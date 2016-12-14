import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';

function getItems(count, height) {
	var heights = [65, 110, 140, 65, 90, 65];
	return range(count).map((value) => {
		return {
			value,
			height: height || heights[random(0, heights.length - 1)]
		};
	});
}

const Handle = SortableHandle(() => <div className={'sb_handle'}></div>);

const Item = SortableElement((props) => {
    return (
        <div className={props.className} style={{
            height: props.height
        }}>
			{props.shouldUseDragHandle && <Handle/>}
			<div className={'sb_wrapper'}>
	            <span>Item</span> {props.value}
			</div>
        </div>
    )
});

class ListWrapper extends Component {
	constructor({items}) {
		super();
		this.state = {
			items, isSorting: false
		};
	}
	static propTypes = {
		items: PropTypes.array,
		className: PropTypes.string,
		itemClass: PropTypes.string,
		width: PropTypes.number,
		height: PropTypes.number,
		onSortStart: PropTypes.func,
		onSortEnd: PropTypes.func,
		component: PropTypes.func,
		shouldUseDragHandle: PropTypes.bool
	}
	static defaultProps = {
		className: classNames('sb_list', 'sb_stylizedList'),
		itemClass: classNames('sb_item', 'sb_stylizedItem'),
		width: 400,
		height: 600
	};
	onSortStart = () => {
		let {onSortStart} = this.props;
		this.setState({isSorting: true});

		if (onSortStart) {
			onSortStart(this.refs.component);
		}
	};
    onSortEnd = ({oldIndex, newIndex}) => {
		let {onSortEnd} = this.props;
        let {items} = this.state;

        this.setState({items: arrayMove(items, oldIndex, newIndex), isSorting: false});

		if (onSortEnd) {
			onSortEnd(this.refs.component);
		}
    };
	render() {
		const Component = this.props.component;
		const {items, isSorting} = this.state;
		const props = {
			isSorting,
			items,
			onSortEnd: this.onSortEnd,
			onSortStart: this.onSortStart,
			ref: "component",
			useDragHandle: this.props.shouldUseDragHandle
		}

		return <Component {...this.props} {...props} />
	}
}


const SortableList = SortableContainer(({className, items, itemClass, sortingIndex, shouldUseDragHandle, sortableHandlers}) => {
	return (
		<div className={className} {...sortableHandlers}>
			{items.map(({value, height}, index) =>
				<Item
					key={`item-${value}`}
					className={itemClass}
					sortingIndex={sortingIndex}
					index={index}
					value={value}
					height={height}
					shouldUseDragHandle={shouldUseDragHandle}
				/>
			)}
		</div>
	);
});

function grid(){
	return (
		<div>
			<ListWrapper component={SortableList} axis={'xy'} items={getItems(10, 110)} helperClass={'sb_stylizedHelper'} className={classNames('sb_list', 'sb_stylizedList', 'sb_grid')} itemClass={classNames('sb_stylizedItem', 'sb_gridItem')}/>
		</div>
	);
}

let d = document.createElement("DIV");
document.body.appendChild(d);
ReactDOM.render(grid(),d);
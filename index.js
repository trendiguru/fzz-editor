import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
//import {storiesOf} from '@kadira/storybook';
//import style from './Storybook.scss';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
//import {defaultFlexTableRowRenderer, FlexColumn, FlexTable, VirtualScroll} from 'react-virtualized';
// import 'react-virtualized/styles.css';
// import Infinite from 'react-infinite';
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

const Handle = SortableHandle(() => <div className={'handle'}></div>);

const Item = SortableElement((props) => {
    return (
        <div className={props.className} style={{
            height: props.height
        }}>
			{props.shouldUseDragHandle && <Handle/>}
			<div className={'wrapper'}>
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
		className: classNames('list', 'stylizedList'),
		itemClass: classNames('item', 'stylizedItem'),
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

// // Function components cannot have refs, so we'll be using a class for React Virtualized
// class VirtualList extends Component {
// 	static propTypes = {
// 		items: PropTypes.array,
// 		className: PropTypes.string,
// 		itemClass: PropTypes.string,
// 		width: PropTypes.number,
// 		height: PropTypes.number,
// 		itemHeight: PropTypes.number,
// 		sortingIndex: PropTypes.number
// 	}
// 	render() {
// 		let {className, items, height, width, itemHeight, itemClass, sortingIndex} = this.props;
// 		return (
// 			<VirtualScroll
// 				ref="vs"
// 				className={className}
// 				rowHeight={({index}) => items[index].height}
// 				estimatedRowSize={itemHeight}
// 				rowRenderer={({index}) => {
// 					let {value, height} = items[index];
// 					return <Item index={index} className={itemClass} sortingIndex={sortingIndex} value={value} height={height}/>;
// 				}}
// 				rowCount={items.length}
// 				width={width}
// 				height={height}
// 			/>
// 		);
// 	}
// }
// const SortableVirtualList = SortableContainer(VirtualList, {withRef: true});

// const SortableFlexTable = SortableContainer(FlexTable, {withRef: true});
// const SortableRowRenderer = SortableElement(defaultFlexTableRowRenderer);

// class FlexTableWrapper extends Component {
// 	static propTypes = {
// 		items: PropTypes.array,
// 		className: PropTypes.string,
// 		helperClass: PropTypes.string,
// 		itemClass: PropTypes.string,
// 		width: PropTypes.number,
// 		height: PropTypes.number,
// 		itemHeight: PropTypes.number,
// 		onSortEnd: PropTypes.func
// 	}
// 	render () {
// 		const {
// 			className,
// 			height,
// 			helperClass,
// 			itemClass,
// 			itemHeight,
// 			items,
// 			onSortEnd,
// 			width
// 		} = this.props

// 		return (
// 			<SortableFlexTable
// 				getContainer={(wrappedInstance) => ReactDOM.findDOMNode(wrappedInstance.Grid)}
// 				gridClassName={className}
// 				headerHeight={itemHeight}
// 				height={height}
// 				helperClass={helperClass}
// 				onSortEnd={onSortEnd}
// 				rowClassName={itemClass}
// 				rowCount={items.length}
// 				rowGetter={({ index }) => items[index]}
// 				rowHeight={itemHeight}
// 				rowRenderer={(props) => <SortableRowRenderer {...props} />}
// 				width={width}
// 			>
// 				<FlexColumn
// 					label='Index'
// 					dataKey='value'
// 					width={100}
// 				/>
// 				<FlexColumn
// 					label='Height'
// 					dataKey='height'
// 					width={width - 100}
// 				/>
// 			</SortableFlexTable>
// 		);
// 	}
// }

// const SortableInfiniteList = SortableContainer(({className, items, itemClass, sortingIndex, sortableHandlers}) => {
// 	return (
// 		<Infinite
// 			className={className}
// 			containerHeight={600}
// 			elementHeight={items.map(({height}) => height)}
// 			{...sortableHandlers}
// 		>
// 			{items.map(({value, height}, index) =>
// 				<Item
// 					key={`item-${index}`}
// 					className={itemClass}
// 					sortingIndex={sortingIndex}
// 					index={index}
// 					value={value}
// 					height={height}
// 				/>
// 			)}
// 		</Infinite>
// 	)
// });

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

// const ShrinkingSortableList = SortableContainer(({className, isSorting, items, itemClass, sortingIndex, shouldUseDragHandle, sortableHandlers}) => {
// 	return (
// 		<div className={className} {...sortableHandlers}>
// 			{items.map(({value, height}, index) =>
// 				<Item
// 					key={`item-${value}`}
// 					className={itemClass}
// 					sortingIndex={sortingIndex}
// 					index={index}
// 					value={value}
// 					height={isSorting ? 20 : height}
// 					shouldUseDragHandle={shouldUseDragHandle}
// 				/>
// 			)}
// 		</div>
// 	);
// });



function grid(){
	return (
		<div className={'root'}>
			<ListWrapper component={SortableList} axis={'xy'} items={getItems(10, 110)} helperClass={'stylizedHelper'} className={classNames('list', 'stylizedList', 'grid')} itemClass={classNames('stylizedItem', 'gridItem')}/>
		</div>
	);
}

let d = document.createElement("DIV");
document.body.appendChild(d);
ReactDOM.render(grid(),d);
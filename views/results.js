import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Item from './result';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';
import Editor from './editor';

function getItems(count, height) {
    var heights = [65, 110, 140, 65, 90, 65];
    return range(count).map((value) => {
        return {
            value,
            height: height || heights[random(0, heights.length - 1)]
        };
    });
}

export default class Results extends Editor {
    constructor(props) {
        super();
        this.state = {
            items: props.origin,
            isSorting: false
        };
        //function binding:
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
        this.add = this.add.bind(this);
    }
    static defaultProps = {
        className: classNames('sb_list', 'sb_stylizedList'),
        itemClass: classNames('sb_item', 'sb_stylizedItem'),
        width: 400,
        height: 600
    };
    remove(id) {
        this.set(
            results => results.filter(result => result.id !== id),
            {
                method: 'DELETE',
            },
            id
        );
    }
    update(results) {
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify({ data: results })
            }
        );
    }

    add(result) {
        this.set(
            (results) => results.concat(result),
            {
                method: 'POST',
                body: JSON.stringify({ data: result })
            }
        );
    }
    shouldCancelStart(e) {
        // Cancel sorting if the event target is a 'button':
        if (['button', 'i'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
            return true; // Return true to cancel sorting
        }
    }

    onSortStart = () => {
        let {onSortStart} = this.props;
        this.setState({ isSorting: true });
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        this.update(arrayMove(this.props.origin, oldIndex, newIndex));
        this.setState({ isSorting: false });
        let {onSortEnd} = this.props;
    };
    render() {
        const {isSorting} = this.state;
        const props = {
            isSorting,
            items: this.props.origin,
            onSortEnd: this.onSortEnd,
            onSortStart: this.onSortStart,
            shouldCancelStart:this.shouldCancelStart,
            ref: "component",
            useDragHandle: this.props.shouldUseDragHandle,
            remove: this.remove
        }
        return <div>
        <button className='add-result' src={'/img/cross.png'} onClick={()=>{
                (document.querySelector('.add-result')).classList.add('hidden');
                (document.querySelector('.result-form')).classList.remove('hidden');
            }}>
            add a result
            </button>
            <form className="result-form hidden">
                <h3>Add a result</h3>
                <label>Image</label>
                <input type="text" name="image" />
                <label>Click URL</label>
                <input type="text" name="clickUrl" />
                <button className="raised" type="button" onClick={({target: {parentElement: form}}) => {
                    this.add({
                        clickUrl: form.elements.clickUrl.value,
                        images: {
                            XLarge: form.elements.image.value
                        }
                    });
                    form.reset();
                } }>Submit</button>
            </form>
            <SortableList
                axis={'xy'}
                helperClass={'sb_stylizedHelper'}
                className={classNames('sb_list', 'sb_stylizedList', 'sb_grid')}
                itemClass={classNames('sb_stylizedItem', 'sb_gridItem')}
                shouldUseDragHandle={true}
                {...props}
                />
        </div>

    }
}


const SortableList = SortableContainer(({className, items, itemClass, remove, sortingIndex, shouldUseDragHandle, sortableHandlers}) => {
    return (
        <div className={className} style={{ width: '100%', height: '100%' }} {...sortableHandlers}>
            {items.map((value, index) =>
                <Item
                    key={index}
                    className={itemClass}
                    sortingIndex={sortingIndex}
                    index={index}
                    value={value}
                    shouldUseDragHandle={shouldUseDragHandle}
                    remove={remove}
                    />
            )}
        </div>
    );
});
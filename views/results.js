import React from 'react';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import Editor from './editor';
import Result from './result';
import classNames from 'classnames';

console.log("*******");
console.log(classNames);

const SortableList = SortableContainer(({className, items, itemClass, sortingIndex, shouldUseDragHandle, sortableHandlers, remove}) => <div className={className} {...sortableHandlers}>
    {items.map((item, index) =>
        <Result key={index} 
        {...{ remove, index }}
        className={itemClass}
        sortingIndex={sortingIndex}
        shouldUseDragHandle={shouldUseDragHandle} 
        value={item} 
        />
    )}
</div>);

export default class Results extends Editor {
    state = {
        selected: undefined
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
    update(results) {
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify({ data: results })
            }
        );
    }
    remove(id) {
        this.set(
            results => results.filter(result => result.id !== id),
            {
                method: 'DELETE',
            },
            id
        );
    }
    onSortEnd({oldIndex, newIndex}) {
        this.update(arrayMove(this.props.origin, oldIndex, newIndex));
    }
    render() {
        return <div>
            <form className="result-form">
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
                helperClass={'stylizedHelper'}
                className={classNames('storybooklist', 'stylizedList', 'grid')}
                itemClass={classNames('stylizedItem', 'gridItem', 'list-item')}
                axis={'xy'}
                useDragHandle={true}
                items={this.props.origin}
                onSortEnd={::this.onSortEnd}
                remove={::this.remove}
            />
        </div>;
    }
}

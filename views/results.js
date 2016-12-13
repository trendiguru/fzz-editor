import React from 'react';
import {SortableContainer, arrayMove} from 'react-sortable-hoc';
import Editor from './editor';
import Result from './result';

const SortableList = SortableContainer(({items, remove}) => <div className="list">
    {items.map((item, index) =>
        <Result key={index} {...{remove, index}} value={item} />
    )}
</div>);

export default class Results extends Editor {
    state = {
        selected: undefined
    }
    add (result) {
        this.set(
            (results) => results.concat(result),
            {
                method: 'POST',
                body: JSON.stringify({data: result})
            }
        );
    }
    update (results) {
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify({data: results})
            }
        );
    }
    remove (id) {
        this.set(
            results => results.filter(result => result.id !== id),
            {
                method: 'DELETE',
            },
            id
        );
    }
    onSortEnd ({oldIndex, newIndex}) {
        this.update(arrayMove(this.props.origin, oldIndex, newIndex));
    }
    render () {
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
                }}>Submit</button>
            </form>
            <SortableList
                helperClass={'stylizedHelper'}
                className={classNames('storyboklist', 'stylizedList', 'grid')} 
                // itemClass={classNames('stylizedItem', 'gridItem')}
                axis={'xy'}
                useDragHandle={true}
                items={this.props.origin}
                onSortEnd={::this.onSortEnd}
                remove={::this.remove}
            />
        </div>;
    }
}

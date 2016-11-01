import React from 'react';
import {SortableContainer, arrayMove} from 'react-sortable-hoc';
import Editor from './editor';
import Result from './result';

const SortableList = SortableContainer(({items, remove}) => {
    return <div className="list">{items.map((item, index) =>
        <Result {...{remove, index}} key={`item-${index}`} value={item} />
    )}</div>;
});

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
                <input type="text" name="click_url" />
                <button className="raised" type="button" onClick={({target: {parentElement: form}}) => {
                    let newResult = {};
                    for (let name of ['image', 'click_url']) {
                        let input = form.querySelector(`input[name="${name}"]`);
                        newResult[name] = input.value;
                        input.value = '';
                    }
                    this.add(newResult);
                }}>Submit</button>
            </form>
            <SortableList
                useDragHandle={true}
                items={this.props.origin}
                onSortEnd={::this.onSortEnd}
                remove={::this.remove}
            />
        </div>;
    }
}

import React from 'react';
import {SortableContainer, arrayMove} from 'react-sortable-hoc';
import Editor from './editor';
import Result from './result';

const SortableList = SortableContainer(({items, remove}) => <div className="list">
    {items.map((item, index) => <Result remove={remove} key={`item-${index}`} index={index} value={item} />)}
</div>);

export default class Results extends Editor {
    state = {
        selected: undefined
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
        // id is not passed
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
        let {props: {origin: results}} = this;
        return <SortableList items={results} onSortEnd={::this.onSortEnd} remove={::this.remove} />;
    }
}

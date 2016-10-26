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
        return <SortableList
            useDragHandle={true}
            items={this.props.origin}
            onSortEnd={::this.onSortEnd}
            remove={::this.remove}
        />;
    }
}

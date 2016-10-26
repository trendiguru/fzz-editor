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
        items: this.props.origin,
        selected: undefined
    }
    update (results) {
        this.setState({items: results});
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify({data: results})
            }
        );
    }
    remove (id) {
        let {state: {items}} = this;
        this.setState({items: items.filter(result => result.id !== id)});
        // id is not passed
        this.set(
            () => this.state.items,
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
        return <SortableList items={this.state.items} onSortEnd={::this.onSortEnd} remove={::this.remove} />;
    }
}

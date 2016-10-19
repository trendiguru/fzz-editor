import React from 'react';
import DraggableList from 'react-draggable-list';
import Editor from './editor';
import Result from './result';

export default class Results extends Editor {
    state = {
        selected: undefined
    }
    update (results) {
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify(results)
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
    render () {
        let {props: {origin: results}} = this;
        let result_entries = Object.entries(results);
        return <DraggableList
            list={result_entries.map(([id, result], i) => Object.assign({}, result, {id, index: i}))}
            itemKey="id"
            template={(props) => <Result {...props} remove={this.remove.bind(this, props.item.id)} origin={props.item} />}
            onMoveEnd={::this.update}
        />;
    }
}

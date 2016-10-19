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
    render () {
        let {props: {origin: results}} = this;
        return <DraggableList
            list={results}
            itemKey="id"
            template={(props) => <Result {...props} remove={::this.remove} origin={props.item} />}
            onMoveEnd={::this.update}
        />;
    }
}

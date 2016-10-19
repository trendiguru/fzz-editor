import React from 'react';
import Editor from './editor';
import Results from './results';
import MDIcon from './md-icon';

export default class Item extends Editor {
    state = {
        selected: undefined,
    }
    unselect () {
        this.setState({selected: undefined});
    }
    select (selected) {
        this.setState({selected});
    }
    get width () {
        let {refs: {root}} = this;
        return root ? root.clientWidth : 1;
    }
    get tiles () {
        let {props: {similar_results}, state: {selected}} = this;
        if (selected) {
            return [
                <div>
                    <div>{selected}</div>
                    <aside>
                        <button onClick={this.unselect.bind(this)}>
                            <MDIcon>keyboard_arrow_up</MDIcon>
                        </button>
                    </aside>
                </div>,
                <Results origin={similar_results[selected]} />
            ];
        }
        return Object.keys(similar_results).map((collection) =>
            <div key={collection} onClick={this.select.bind(this, collection)}>
                {collection}
                <aside>
                    <button onClick={this.select.bind(this)}>
                        <MDIcon>edit</MDIcon>
                    </button>
                </aside>
            </div>
        );
    }
    render () {
        return <div className="list" ref="root">{this.tiles}</div>;
    }
}

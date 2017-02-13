import React from 'react';
import Editor from './editor';
import Results from './results';
import MDIcon from './md-icon';
import router from '../modules/router';

export default class Item extends Editor {
    constructor(props){
        console.log("From item's constructor:");
        console.log(router);
        super(props);
        this.state = {
            selected:(Object.keys(props.similar_results).length===1)
            ?Object.keys(props.similar_results)[0]
            : undefined,
        }
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
            return <div className="list-item">
                <div>
                    <div>{selected}</div>
                    <aside>
                        <button onClick={::this.unselect}>
                            <MDIcon>keyboard_arrow_up</MDIcon>
                        </button>
                    </aside>
                </div>
                <Results origin={similar_results[selected]} />
            </div>;
        }
        return Object.keys(similar_results).map((collection) =>
            <div className="list-item" key={collection} onClick={this.select.bind(this, collection)}>
                <div>
                    {collection}
                    <aside>
                        <button onClick={this.select.bind(this)}>
                            <MDIcon>edit</MDIcon>
                        </button>
                    </aside>
                </div>
            </div>
        );
    }
    render () {
        return <div className="list" ref="root">{this.tiles}</div>;
    }
}

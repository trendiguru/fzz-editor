import React from 'react';
import Editor from './editor';
import Collection from './collection';
import MDIcon from './md-icon';
import {API_URL} from '../constants';
import ReactGridLayout from 'react-grid-layout';

export class Item extends Editor {
    constructor ({similar_results}) {
        super(...arguments);
        this.state = {
            selected: undefined,
            layout: Object.entries(similar_results).map(([id, result], i) => ({
                i: id,
                x: i % 3,
                y: Math.floor(i / 3),
                w: 1,
                h: 1,
            }))
        };
    }
    unselect () {
        this.setState({selected: undefined});
    }
    select (selected) {
        this.setState({selected});
    }
    remove (collection, index) {
        this.setState({
            results: Object.assign(this.state.results, {
                [collection]: this.state.results[collection].filter((a, i) => i !== index)
            })
        });
    }
    get width () {
        let {refs: {root}} = this;
        return root ? root.clientWidth : 1;
    }
    render () {
        let {props: {similar_results}, state: {layout}} = this;
        let collections = Object.keys(similar_results).map((collection, i) => {
            let tile;
            let results;
            if (collection === this.state.selected) {
                tile = <div>
                    <div>{collection}</div>
                    <aside>
                        <button onClick={this.unselect.bind(this)}>
                            <MDIcon>close</MDIcon>
                        </button>
                    </aside>
                </div>;
                let result_entries = Object.entries(similar_results[collection]);
                results = <ReactGridLayout
                    layout={layout}
                    cols={3}
                    rowHeight={200}
                    width={this.width}
                    onLayoutChange={layout => this.setState({layout})}
                >
                    {result_entries.map(([id, result], i) =>
                        <div className="list-item" key={String(i)}>
                            <div>
                                <aside><button onClick={this.remove.bind(this, collection, i)}><MDIcon>delete</MDIcon></button></aside>
                                <div className="img" style={{backgroundImage: `url(${result.images.XLarge})`}} />
                            </div>
                        </div>)}
                </ReactGridLayout>;
            }
            else {
                tile = <div onClick={this.select.bind(this, collection)}>
                    {collection}
                    <aside>
                        <button onClick={this.select.bind(this)}>
                            <MDIcon>edit</MDIcon>
                        </button>
                    </aside>
                </div>;
            }
            return <div className="list-item" key={i}>
                {tile}
                {results}
            </div>;
        });
        return <div className="list" ref="root">{collections}</div>;
    }
}

export class Person extends Editor {
    constructor (props) {
        super(props);
    }
    changeGender (gender) {
        this.set(image => {
            let clone = Object.assign({}, image, {
                people: Object.assign({}, image.people, {
                    [this.props._id]: Object.assign({}, image.people[this.props._id], {gender})
                })
            });
            fetch([API_URL, ...this.path].join('/'), {
                method: 'PATCH',
                body: JSON.stringify({data: {gender}}),
                credentials: 'include'
            });
            return clone;
        });
    }
    render () {
        let {gender} = this.props;
        return <div>
            <select value={gender} onChange={e => this.changeGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <Collection source={this.props} query="items" title="category" editor={Item} />
        </div>;
    }
}

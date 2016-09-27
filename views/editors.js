import React, {Component, PropTypes} from 'react';
import Editor from './editor';
import Collection from './collection';
import MDIcon from './md-icon';
import {API_URL} from '../constants';
import AbsoluteGrid from 'react-absolute-grid';

class Result extends Component {
    render () {
        return <div>
            <button onClick={() => this.props.onRemove(this.props.index)}>
                <MDIcon>delete</MDIcon>
            </button>
            <img src={this.props.item.images.XLarge} />
        </div>;
    }
}

Result.propTypes = {
    item: PropTypes.object,
    onRemove: PropTypes.func,
    index: PropTypes.number
};

export class Item extends Editor {
    constructor (props) {
        super(props);
        let results = {};
        for (let collection in props.similar_results) {
            results[collection] = Object.entries(props.similar_results[collection]).map(([key, value]) => Object.assign({}, value, {key, filtered: false}));
        }
        this.state = {
            selected: undefined,
            results
        };
    }
    unselect () {
        this.setState({selected: undefined});
    }
    select (selected) {
        this.setState({selected});
    }
    remove (collection, i) {
        this.setState({
            results: Object.assign(this.state.results, {
                [collection]: Object.assign(this.state.results[collection], {
                    [i]: Object.assign(this.state.results[collection][i], {
                        filtered: true
                    })
                })
            })
        });
    }
    render () {
        let collections = Object.keys(this.props.similar_results).map((collection, i) => {
            let tile;
            let results;
            if (collection === this.state.selected) {
                tile = <span>
                    <span>{collection}</span>
                    <aside>
                        <button onClick={this.unselect.bind(this)}>
                            <MDIcon>close</MDIcon>
                        </button>
                    </aside>
                </span>;
                results = <AbsoluteGrid
                    displayObject={<Result onRemove={this.remove.bind(this, collection)} />}
                    items={this.state.results[collection]}
                    responsive={true}
                    dragEnabled={true}
                    onMove={(from, to) => console.log(from, to)}
                />;
                // <Collection
                //             template={node => <img src={node.images.XLarge} />}
                //             editable={false}
                //         />
            }
            else {
                tile = <span onClick={this.select.bind(this, collection)}>
                    {collection}
                    <aside>
                        <button onClick={this.select.bind(this)}>
                            <MDIcon>edit</MDIcon>
                        </button>
                    </aside>
                </span>;
            }
            return <li key={i}>
                {tile}
                {results}
            </li>;
        });
        return <ul>{collections}</ul>;
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

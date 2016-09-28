import React, {Component, PropTypes} from 'react';
import Editor from './editor';
import Collection from './collection';
import MDIcon from './md-icon';
import {API_URL} from '../constants';
import ReactGridLayout from 'react-grid-layout';

class Result extends Component {
    render () {
        return <div style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${this.props.item.images.XLarge})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <button onClick={() => this.props.onRemove(this.props.index)}>
                <MDIcon>delete</MDIcon>
            </button>
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
        this.state = {
            selected: undefined,
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
    get width () {
        let {refs: {root}} = this;
        return root ? root.clientWidth : 1;
    }
    render () {
        let {props: {similar_results}} = this;
        let collections = Object.keys(similar_results).map((collection, i) => {
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
                results = <ReactGridLayout width={this.width}>
                    {Object.entries(similar_results[collection]).map(([id, result]) =>
                        <div key={id}>
                            <button><MDIcon>delete</MDIcon></button>
                            <img src={result.images.XLarge} />
                        </div>)}
                </ReactGridLayout>;
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
        return <ul ref="root">{collections}</ul>;
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

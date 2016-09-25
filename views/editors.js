import React from 'react';
import Editor from './editor';
import Collection from './collection';
import MDIcon from './md-icon';
import {API_URL} from '../constants';

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
                results = <Collection
                            source={this.props.similar_results}
                            query={collection}
                            template={node => <img src={node.images.XLarge} />}
                            editable={false}
                        />;
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

import React, {PropTypes} from 'react';
import DraggableList from 'react-draggable-list';
import Editor from './editor';
import MDIcon from './md-icon';

export default class Item extends Editor {
    constructor () {
        super(...arguments);
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
    remove (collection, id) {
        this.set(
            item => {
                delete item.similar_results[collection][id];
                return item;
            },
            {
                method: 'DELETE',
            }
        );
    }
    updateResultList (collection, list) {
        this.set(
            item => {
                item[collection] = list;
                return item;
            },
            {
                method: 'PUT',
                body: JSON.stringify({
                    data: list
                })
            }
        );
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
                let result_entries = Object.entries(similar_results[collection]);
                tile = <div>
                    <div>{collection}</div>
                    <aside>
                        <button onClick={this.unselect.bind(this)}>
                            <MDIcon>keyboard_arrow_up</MDIcon>
                        </button>
                    </aside>
                </div>;
                results = <DraggableList
                    list={result_entries.map(([id, result], i) => Object.assign({}, result, {id, index: i}))}
                    itemKey="id"
                    template={CollectionCard({collection, remove: ::this.remove})}
                    onMoveEnd={this.updateResultList.bind(this, collection)}
                />;
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

function CollectionCard ({collection, remove}) {
    return React.createClass({
        name: 'Card',
        propTypes: {
            item: PropTypes.object,
            dragHandle: PropTypes.func
        },
        render () {
            let {props: {item: result, dragHandle}} = this;
            return dragHandle(<div className="list-item" key={result.id} style={{
                margin: '0',
                width: '24em',
                height: '12em',
                display: 'block',
                overflow: 'visible'
            }}>
                <div style={{width: '100%', height: '100%'}}>
                    <aside><button onClick={(e) => {
                        block(e);
                        remove(collection, result.id);
                    }}><MDIcon>delete</MDIcon></button></aside>
                    <div className="img" style={{backgroundImage: `url(${result.images.XLarge})`}} />
                </div>
            </div>);
        }
    });
}

function block (e) {
    e.preventDefault();
    e.stopPropagation();
}

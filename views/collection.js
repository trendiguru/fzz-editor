import React, {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';
import {api as API_URL} from '../package.json';
import MDIcon from './md-icon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Select from 'react-select';

export default class Collection extends Component {
    static contextTypes = {
        images: PropTypes.object.isRequired,
        setImages: PropTypes.func.isRequired
    }
    static propTypes = {
        source: PropTypes.object.isRequired,
        query: PropTypes.string.isRequired,
        title: PropTypes.string,
        template: PropTypes.func,
        editor: PropTypes.func,
        editable: PropTypes.bool,
        addable: PropTypes.bool,
        selected: PropTypes.string,
        unselect: PropTypes.func,
        options: PropTypes.object
    }
    state = {
        selected: undefined,
    }
    unselect () {
        this.select(undefined);
        if (this.props.unselect) {
            this.props.unselect();
        }
    }
    add (key, value) {
        this.context.setImages(images => {
            let path = images !== this.props.source[this.props.query]
                ? findPathToValue(this.context.images, this.props.source[this.props.query])
                : [];
            Object.assign(this.props.source[this.props.query], {
                [key]: value
            });
            fetch([API_URL, ...path].join('/'), {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    [this.props.query]: key,
                    body: value,
                })
            });
            return images;
        });
    }
    select (selected) {
        this.setState({selected});
    }
    remove (key) {
        this.unselect();
        this.context.setImages(images => {
            let path = images !== this.props.source[this.props.query]
                ? findPathToValue(this.context.images, this.props.source[this.props.query])
                : [];
            delete this.props.source[this.props.query][key];
            fetch([API_URL, ...path, key].join('/'), {
                method: 'DELETE',
                credentials: 'include'
            });
            return images;
        });
    }
    get selected () {
        return this.props.selected || this.state.selected;
    }
    get tiles () {
        let {
            selected,
            props: {
                title,
                query,
                source,
                editable,
                template = (node) => <div>{node[title]}</div>,
            }
        } = this;
        if (selected) {
            let selectedNode = source[query][selected];
            if (!selectedNode) {
                return <div className="list-item selected" key={selected}>
                    {template.call(this, selectedNode)}
                    <aside>
                        <button onClick={this.unselect.bind(this)}>
                            <MDIcon>keyboard_arrow_up</MDIcon>
                        </button>
                    </aside>
                </div>;
            }
            return <div className="list-item selected" key={selected}>
                    <div>
                        {template.call(this, selectedNode)}
                        <aside>
                            <button onClick={this.unselect.bind(this)}>
                                <MDIcon>keyboard_arrow_up</MDIcon>
                            </button>
                        </aside>
                    </div>
                    {React.createElement(this.props.editor, Object.assign({}, selectedNode, {
                        origin: selectedNode,
                    }))}
                </div>;
        }
        return Object.entries(source[query])
        .reverse()
        .map(([key, node]) => {
            let edit;
            if (editable || editable === undefined) {
                edit = <button onClick={this.select.bind(this, key)}>
                    <MDIcon>edit</MDIcon>
                </button>;
            }
            return <div className="list-item" key={key}>
                <div>
                    {template.call(this, node, key, this)}
                    <aside>
                        {edit}
                        <button onClick={this.remove.bind(this, key)}>
                            <MDIcon>delete</MDIcon>
                        </button>
                    </aside>
                </div>
            </div>;
        });
    }
    render () {
        let {props: {addable, options, query}, state: {selected}, tiles} = this;
        if (!selected && addable && options) {
            tiles.unshift(<div className="selectbox">
                <Select
                    name={query}
                    options={options}
                />
                <button onClick={(e) => this.add(e.target.value)}>Add</button>
            </div>);
        }
        return <ReactCSSTransitionGroup
            component="div"
            className={selected ? 'selected list' : 'list'}
            transitionName="collection-item"
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}
        >{tiles}</ReactCSSTransitionGroup>;
    }
}

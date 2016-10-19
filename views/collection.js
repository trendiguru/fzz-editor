import React, {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';
import {api as API_URL} from '../package.json';
import MDIcon from './md-icon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
        editable: PropTypes.bool
    }
    state = {
        selected: undefined,
    }
    unselect () {
        this.select(undefined);
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
    get tiles () {
        let {
            state: {selected},
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
            return [
                <div className="list-item selected" key={selected}>
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
                </div>
            ];
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
        let {state: {selected}} = this;
        return <ReactCSSTransitionGroup
            component="div"
            className={selected ? 'selected list' : 'list'}
            transitionName="collection-item"
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}
        >{this.tiles}</ReactCSSTransitionGroup>;
    }
}

import React, {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';
import {API_URL} from '../constants';
import MDIcon from './md-icon';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Collection extends Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: undefined,
        };
    }
    static get contextTypes () {
        return {
            images: PropTypes.object.isRequired,
            setImages: PropTypes.func.isRequired
        };
    }
    static get propTypes () {
        return {
            source: PropTypes.object.isRequired,
            query: PropTypes.string.isRequired,
            title: PropTypes.string,
            template: PropTypes.func,
            editor: PropTypes.func,
            editable: PropTypes.bool
        };
    }
    unselect () {
        this.setState({selected: undefined});
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
    render () {
        let {selected} = this.state;
        let {editable, title, template = (node) => <div>{node[title]}</div>, source, query} = this.props;
        let nodes;
        if (selected !== undefined) {
            let selectedNode = source[query][selected];
            nodes = [
                <div className="list-item" key={selected}>
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
        else {
            nodes = Object.entries(source[query]).reverse().map(([key, node]) => {
                let remove = <button onClick={this.remove.bind(this, key)}>
                        <MDIcon>delete</MDIcon>
                    </button>;
                let edit;
                if (editable || editable === undefined) {
                    edit = <button onClick={this.select.bind(this, key)}>
                        <MDIcon>edit</MDIcon>
                    </button>;
                }
                return <div className="list-item" key={key}>
                    <div>
                        {template.call(this, node)}
                        <aside>{edit}{remove}</aside>
                    </div>
                </div>;
            });
        }
        return <ReactCSSTransitionGroup
            component="div"
            className="list"
            transitionName="collection-item"
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}
        >{nodes}</ReactCSSTransitionGroup>;
    }
}

Object.entries = Object.entries || (object => Object.keys(object).map(key => [key, object[key]]));

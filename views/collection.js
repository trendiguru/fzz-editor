import React, {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';
import {API_URL} from '../constants';

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
                method: 'DELETE'
            });
            return images;
        });
    }
    render () {
        let {selected} = this.state;
        let {editable, title, template, source, query} = this.props;
        let nodes = Object.entries(source[query]).reverse().map(([key, node], i) => {
            let editor;
            let edit;
            let tile;
            let close;

            if (i === selected) {
                editor = React.createElement(this.props.editor, Object.assign({}, node, {
                    origin: node,
                    key: i
                }));
                close = <button onClick={this.unselect.bind(this)}>close</button>;
            }
            else if (editable || editable === undefined) {
                edit = <button onClick={this.select.bind(this, i)}>edit</button>;
            }

            if (title) {
                tile = <span>{node[title]}</span>;
            }
            else if (template) {
                tile = template.call(this, node);
            }

            return <li key={i}>
                {tile}
                {edit}
                {close}
                <button onClick={this.remove.bind(this, key)}>remove</button>
                {editor}
            </li>;
        });
        return <ul>{nodes}</ul>;
    }
}

Object.entries = Object.entries || (
    object => {
        console.log(object);
        return Object.keys(object).map(key => [key, object[key]]);
    });

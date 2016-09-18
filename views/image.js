import React, {Component, PropTypes} from 'react';
import Collection from './collection';
import {Person} from './editors';
import Face from './face';

export default class Image extends Component {
    constructor (props) {
        super(props);
    }
    componentWillMount () {
        return this.context.getImage(this.props);
    }
    static get propTypes () {
        return {
            image_urls: PropTypes.array.isRequired,
            element: PropTypes.object
        };
    }
    static get contextTypes () {
        return {
            getImage: PropTypes.func.isRequired
        };
    }
    static get childContextTypes () {
        return {
            image: PropTypes.object.isRequired,
        };
    }
    getChildContext () {
        return {
            image: this.props
        };
    }
    render () {
        let {image_urls, element} = this.props;
        return <Collection source={this.props} query="people" editor={Person} template={function (node) {
            if (element) {
                let {face} = node;
                const SIZE = 200;
                return <Face size={SIZE} delta={Math.floor(SIZE / face[2])} face={face} image={{element, image_urls}} />;
            }
            else {
                return {};
            }
        }} />;
    }
}

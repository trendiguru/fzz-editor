import React, {Component, PropTypes} from 'react';
import Collection from './collection';
import Person from './person';
import Face from './face';

export default class Image extends Component {
    static get propTypes () {
        return {
            image_urls: PropTypes.array,
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
    componentWillMount () {
        if (this.props.image_urls) {
            return this.context.getImage(this.props);
        }
    }
    componentWillRecieveProps () {
        if (this.props.image_urls) {
            return this.context.getImage(this.props);
        }
    }
    render () {
        let {props: {image_urls, element}} = this;
        return <div>
            <img id="reference" src={image_urls[0]} />
            <Collection source={this.props} query="people" editor={Person} template={(node) => {
                if (!element) {
                    return {};
                }
                let {face} = node;
                const SIZE = 200;
                return <Face size={SIZE} delta={Math.floor(SIZE / face[2])} face={face} image={{element, image_urls}} />;
            }} />
        </div>;
    }
}

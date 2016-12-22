import React, {Component, PropTypes} from 'react';
import Collection from './collection';
import Person from './person';
import Face from './face';

export default class Image extends Component {
    static get propTypes () {
        return {
            image_urls: PropTypes.array,
            element: PropTypes.object,
            people: PropTypes.object
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
        if (!this.props.people) {
            return this.context.getImage(this.props);
        }
    }
    // componentWillReceiveProps () {
    //     if (!this.props.people) {
    //         return this.context.getImage(this.props);
    //     }
    // }
    render () {
        let {props: {image_urls, element, people}} = this;
        if (!people) {
            return <div>LOADING</div>;
        }
        return <div>
            <div id="reference" style={{backgroundImage:image_urls[0]}} ></div>
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

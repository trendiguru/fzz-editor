import {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';

export default class Editor extends Component {
    componentWillMount () {
        this.path = findPathToValue(this.context.images, this.props.origin);
    }
    static get contextTypes () {
        return {
            setImage: PropTypes.func.isRequired,
            images: PropTypes.object.isRequired,
            image: PropTypes.object.isRequired,
        };
    }
    static get propTypes () {
        return {
            origin: PropTypes.object.isRequired
        };
    }
    set (transform, callback) {
        return this.context.setImage(transform(this.context.image), callback);
    }
}

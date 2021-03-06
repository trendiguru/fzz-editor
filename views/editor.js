import {PropTypes, Component} from 'react';
import findPathToValue from '../modules/path';
import {JSONPath} from 'jsonpath/jsonpath';
import {api as API_URL} from '../package.json';

let jp = new JSONPath();

export default class Editor extends Component {
    componentWillMount () {
        this.path = findPathToValue(this.context.images, this.props.origin);
    }
    static get contextTypes () {
        return {
            setImages: PropTypes.func.isRequired,
            updateImage:    PropTypes.func.isRequired,
            pending:        PropTypes.func.isRequired,
            images: PropTypes.object.isRequired,
            image: PropTypes.object.isRequired,
        };
    }
    static get propTypes () {
        return {
            origin: PropTypes.object.isRequired
        };
    }
    set (transform, fetchSettings, additionalKeys = [], callback) {
        this.context.setImages(images => {
            jp.apply(images, jp.stringify(['$'].concat(this.path)), transform);
            return images;
        }, callback);
        fetchSettings.credentials = 'include';
        return fetch([API_URL, ...this.path].concat(additionalKeys).join('/'), fetchSettings);
    }
}

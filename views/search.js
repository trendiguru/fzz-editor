import React, {Component, PropTypes} from 'react';
import ID from '../modules/id';

export default class Search extends Component {
    state = {
        query: ''
    }
    static contextTypes = {
        getImageByURL:  PropTypes.func.isRequired,
        selectImage:    PropTypes.func.isRequired,
        unselectImage:  PropTypes.func.isRequired,
        setImages:      PropTypes.func.isRequired,
    }
    query (query) {
        let {
            context: {getImageByURL, selectImage, unselectImage, setImages}
        } = this;
        let id = ID();
        if (!query.length) {
            return unselectImage();
        }
        this.setState({query});
        selectImage(id);
        return getImageByURL(query)
        .then((image) => selectImage(image.image_id))
        .catch(() => setImages(images => Object.assign({}, images, {
            [id]: null
        })));
    }
    render () {
        return <input
            id="search"
            type="text"
            placeholder="Edit Image from URL"
            onChange={e => this.query(e.target.value)}
        />;
    }
}

import React, {Component, PropTypes} from 'react';

export default class Search extends Component {
    state = {
        query: ''
    }
    static contextTypes = {
        getImageByURL:  PropTypes.func.isRequired,
        selectImage:    PropTypes.func.isRequired,
    }
    query (query) {
        let {getImageByURL, selectImage} = this.context;
        this.setState({query});
        selectImage('empty');
        getImageByURL(query)
        .then((image) => selectImage(image.image_id));
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

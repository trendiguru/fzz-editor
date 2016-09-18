import React, {Component, PropTypes} from 'react';

export default class Search extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            query: ''
        };
    }
    static get contextTypes () {
        return {
            getImageByURL:  PropTypes.func.isRequired,
            selectImage:    PropTypes.func
        };
    }
    query (query) {
        let {getImageByURL, selectImage} = this.context;
        this.setState({query});
        getImageByURL(query).then((image) => selectImage(image.image_id));
    }
    render () {
        return <input type="text" placeholder="Edit Image from URL" onChange={e => this.query(e.target.value)} />;
    }
}

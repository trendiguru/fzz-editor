import React, {PropTypes, Component} from 'react';
import parseImage from '../modules/parse-image';
import Search from './search';
import Collection from './collection';
import Image from './image';
import {API_URL} from '../constants';
import 'whatwg-fetch';

export default class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            images: {},
        };
    }
    static get childContextTypes () {
        return {
            images:         PropTypes.object.isRequired,
            setImages:      PropTypes.func.isRequired,
            setImage:       PropTypes.func.isRequired,
            getImage:       PropTypes.func.isRequired,
            getImageByURL:  PropTypes.func.isRequired,
            selectImage:    PropTypes.func
        };
    }
    getChildContext () {
        return {
            images:         this.state.images,
            setImages:      this.setImages.bind(this),
            setImage:       this.setImage.bind(this),
            getImage:       this.getImage.bind(this),
            getImageByURL:  this.getImageByURL.bind(this),
            selectImage:    this.selectImage
        };
    }
    componentDidMount () {
        return this.getLastImages(10);
    }
    setImages (transform, callback) {
        return this.setState({images: transform(this.state.images)}, callback);
    }
    setImage (image, callback) {
        return this.setImages(images => Object.assign({}, images, {
            [image.image_id]: Object.assign({}, this.state.images[image.image_id], image)
        }), callback);
    }
    getImage (image, callback) {
        return Promise.all([
            fetch(`${API_URL}/${image.image_id}`).then(res => res.json()),
            getImageElement(image.image_urls[0])
        ])
        .then(([{data: image}, element]) => this.setImage(Object.assign(parseImage(image), {element}), callback));
    }
    getImageByURL (url) {
        return Promise.all([
            fetch(`${API_URL}?image_url=${url}`).then(res => res.json()),
            getImageElement(url)
        ])
        .then(([{data: image}, element]) => {
            image = Object.assign(parseImage(image), {element});
            this.setImage(image);
            return image;
        });
    }
    getLastImages (number = 10) {
        return fetch(`${API_URL}?last=${number}`)
        .then(res => res.json())
        .then(({data = []}) => {
            for (let image of data) {
                this.setImage(image);
            }
        });
    }
    get selectImage () {
        let {collection} = this.refs;
        if (collection) {
            return collection.select.bind(collection);
        }
    }
    render () {
        return <div>
            <Search />
            <Collection ref="collection" source={this.state} query="images" editor={Image} template={node => <img src={node.image_urls[0]} />} />
        </div>;
    }
}

function getImageElement (src) {
    return new Promise ((resolve, reject) => {
        let img = Object.assign(document.createElement('img'), {
            src,
            onload () {
                resolve(img);
            },
            onerror (err) {
                reject(err);
            }
        });
    });
}

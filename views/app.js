import React, {PropTypes, Component} from 'react';
import {api as API_URL} from '../package.json';
import parseImage from '../modules/parse-image';
import getImageElement from '../modules/get-image-element-promise';
import Login from './login';
import Search from './search';
import Collection from './collection';
import Image from './image';

export default class App extends Component {
    static childContextTypes = {
        images:         PropTypes.object.isRequired,
        setImages:      PropTypes.func.isRequired,
        getImage:       PropTypes.func.isRequired,
        getImageByURL:  PropTypes.func.isRequired,
        selectImage:    PropTypes.func.isRequired,
        unselectImage:  PropTypes.func.isRequired
    }
    state = {
        user: undefined,
        images: {},
        selected: undefined
    }
    getChildContext () {
        return {
            images:         this.state.images,
            setImages:      ::this.setImages,
            getImage:       ::this.getImage,
            getImageByURL:  ::this.getImageByURL,
            selectImage:    ::this.selectImage,
            unselectImage:  ::this.unselectImage,
        };
    }
    componentDidMount () {
        return this.getLastImages(10);
    }
    componentDidUpdate () {
        let {state: {images}} = this;
        if (!Object.keys(images).length) {
            this.getLastImages();
        }
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
            fzzFetch(`/${image.image_id}`),
            getImageElement(image.image_urls[0])
        ])
        .then(([{data: image}, element]) => this.setImage(Object.assign(parseImage(image), {element}), callback));
    }
    getImageByURL (url) {
        return Promise.all([
            fzzFetch(`?image_url=${url}`),
            getImageElement(url)
        ])
        .then(([{data: image}, element]) => {
            image = Object.assign(parseImage(image), {element});
            this.setImage(image);
            return image;
        });
    }
    getLastImages (number = 10) {
        return fzzFetch(`?last=${number}`)
        .then(({data = []}) => {
            for (let image of data) {
                this.setImage(image);
            }
        });
    }
    selectImage (selected) {
        this.setState({selected});
    }
    unselectImage () {
        this.selectImage(undefined);
    }
    render () {
        let {state, state: {user, selected}} = this;
        if (!user) {
            return <Login handshake={fzzFetch.bind(null, '?last=10')} onAuthenticate={user => this.setState({user})} />;
        }
        return <div>
            <header>
                <Search />
            </header>
            <Collection
                ref="collection"
                source={state}
                query="images"
                unselect={::this.unselectImage}
                selected={selected}
                editor={Image}
                template={(node, key, collection) => {
                    if (node === undefined) {
                        return <span>LOADING</span>;
                    }
                    else if (node === null) {
                        return <span>NO DATA</span>;
                    }
                    return <img onClick={() => collection.select(key)} src={node.image_urls[0]} />;
                }}
            />
        </div>;
    }
}

function fzzFetch (url, settings = {}) {
    return fetch(API_URL + url, Object.assign(settings, {
        credentials: 'include'
    }))
    .then(res => {
        if (res.status > 400 && res.status < 500) {
            throw new Error(res.statusText);
        }
        return res;
    })
    .then(res => res.json());
}

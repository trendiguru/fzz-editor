import React, {PropTypes, Component} from 'react';
import {api as API_URL} from '../package.json';
import parseImage from '../modules/parse-image';
import getImageElement from '../modules/get-image-element-promise';
import Login from './login';
import Search from './search';
import Collection from './collection';
import Image from './image';
import Query from 'query-class';
import Shadow from './shadow.js';

export default class App extends Component {
    static childContextTypes = {
        images:         PropTypes.object.isRequired,
        setImages:      PropTypes.func.isRequired,
        getImage:       PropTypes.func.isRequired,
        getImageByURL:  PropTypes.func.isRequired,
        selectImage:    PropTypes.func.isRequired,
        unselectImage:  PropTypes.func.isRequired,
        updateImage:    PropTypes.func.isRequired,
        pending:        PropTypes.func.isRequired,
    }
    state = {
        user: undefined,
        gateControl: undefined,
        images: {},
        selected: undefined,
        pending: false,
    }
    getChildContext () {
        return {
            images:         this.state.images,
            setImages:      ::this.setImages,
            getImage:       ::this.getImage,
            getImageByURL:  ::this.getImageByURL,
            selectImage:    ::this.selectImage,
            unselectImage:  ::this.unselectImage,
            updateImage:    ::this.updateImage,
            pending:        ::this.pending,
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
    updateImage(){
        console.log("updateImage function");
        let imgKey = this.state.selected;
        console.log('imgKey');
        console.log(imgKey);
        return this.getImageByURL (this.state.images[imgKey].image_urls[0]);
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
    getLastImages (number = 10, known = 0) {
        return fzzFetch(`?last=${number}`)
        .then(({data = []}) => {
            for (let image of data.slice(known)) {
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

    handShake(){
        return fzzFetch('', '?last=10').then((res) => {
            if (res.status >= 400 && res.status < 500) {
                throw new Error(res.statusText);
            }
            return res;
        });
    }

    pending(stateFlag){
        if (typeof(stateFlag)!=='boolean'){
            throw new TypeError('not suitable type of stateFlag variable', 'app.js');
        }
        this.setState({pending: stateFlag});
    }

render () {
        let {state, state: {user, selected, gateControl}} = this;
        if (gateControl === undefined){
            this.handShake().then(()=>this.setState({gateControl: true})).catch(()=>this.setState({gateControl: false}));
            return <div className={'loading'}></div>;
        }
        if (!user && gateControl === false) {
            return <Login handshake={this.handShake} onAuthenticate={user => this.setState({user})} />;
        }
        return <div>
            <Shadow style={{visibility: (this.state.pending ? 'visible': 'hidden')}}/>
            <header>
                <Search />
            </header>
            {Query.parse(location.search).mode === 'dev' ? <button onClick={() => {
                let image_number = Object.keys(this.state.images).length;
                this.getLastImages(image_number + 10, image_number);
            }}>load more</button> : ''}
            <Collection
                ref="collection"
                source={state}
                query="images"
                unselect={::this.unselectImage}
                selected={selected}
                editor={Image}
                template={(node, key, collection) => {
                    if (node === undefined) {
                        console.log('app span loading');
                        return <div><div className={'loading'}/></div>;
                    }
                    else if (node === null) {
                        return <span>NO DATA</span>;
                    }
                    return <img onClick={() => {
                        this.selectImage(key);
                    }} 
                    src={node.image_urls[0]}/>;
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

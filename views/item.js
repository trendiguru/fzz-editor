import React from 'react';
import Editor from './editor';
import Results from './results';
import MDIcon from './md-icon';
import router from '../modules/router';

export default class Item extends Editor {
    constructor(props){
        super(props);
        this.state = {
            selected:this.initSelected()
        }
    }
    initSelected(){
        let elemsKeys = (Object.keys(this.props.similar_results));
        //If the key is already in URL:
        // for (let key of elemsKeys){
        //     if (router.inRoute(key)){
        //         console.log('key');
        //         console.log(key);
        //         router.nextDo(key, ()=>{
        //             this.setState({selected: key});
        //         });
        //         return key;
        //     }
        // }
        //If there only one element:
        if (elemsKeys.length===1){
             router.nextDo(elemsKeys[0], ()=>{
                 this.setState({selected: elemsKeys[0]});
            });
             return elemsKeys[0];
        }
        return undefined;
    }
    unselect (key) {
        router.backTo(key, ()=>{
            this.setState({selected: undefined})
        });
    }
    select (selected) {
        router.doNext(selected,()=>{
            this.setState({selected});
        });
    }
    get width () {
        let {refs: {root}} = this;
        return root ? root.clientWidth : 1;
    }
    get tiles () {
        let {props: {similar_results}, state: {selected}} = this;
        if (selected) {
            return <div className="list-item">
                <div>
                    <div>{selected}</div>
                    <aside>
                        <button onClick={this.unselect.bind(this, selected)}>
                            <MDIcon>keyboard_arrow_up</MDIcon>
                        </button>
                    </aside>
                </div>
                <Results origin={similar_results[selected]} />
            </div>;
        }
        return Object.keys(similar_results).map((collection) =>
            <div className="list-item" key={collection} onClick={this.select.bind(this, collection)}>
                <div>
                    {collection}
                    <aside>
                        <button>
                            <MDIcon>edit</MDIcon>
                        </button>
                    </aside>
                </div>
            </div>
        );
    }
    render () {
        return <div className="list" ref="root">{this.tiles}</div>;
    }
}
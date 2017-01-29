import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class Shadow extends Component {
    render(){
        return <div className={'shadow'} style={{visibility: 'hidden'}} >
            <div className={'loading'}></div>
        </div>
    }
}
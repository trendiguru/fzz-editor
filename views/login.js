import React, {Component, PropTypes} from 'react';
import {API_URL} from '../constants';

export default class Login extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            email: '',
            password: ''
        };
    }
    static get propTypes () {
        return {
            onAuthenticate: PropTypes.func.isRequired
        };
    }
    login () {
        let {email, password} = this.state;
        return fetch(`${API_URL}/authenticate`, {
            method: 'POST',
            body: JSON.stringify({email, password})
        })
        .then(res => res.json())
        .then(user => this.props.onAuthenticate(user));
    }
    render () {
        return <div>
            <input type="email" onChange={e => this.setState({email: e.target.value})} value={this.state.email} />
            <input type="password" onChange={e => this.setState({password: e.target.value})} value={this.state.password} />
            <button onClick={this.login.bind(this)}>Login</button>
        </div>;
    }
}

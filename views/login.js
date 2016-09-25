import React, {Component, PropTypes} from 'react';
import {API_URL} from '../constants';

export default class Login extends Component {
    constructor () {
        super(...arguments);
        this.state = {
            email: '',
            password: '',
            error: false
        };
    }
    static get propTypes () {
        return {
            handshake: PropTypes.func.isRequired,
            onAuthenticate: PropTypes.func.isRequired
        };
    }
    componentDidMount () {
        let {props: {handshake, onAuthenticate}} = this;
        handshake().then(() => onAuthenticate(true));
    }
    login () {
        let {email, password} = this.state;
        return fetch(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({email, password})
        })
        .then(res => res.json())
        .then(() => this.props.onAuthenticate(true))
        .catch(() => this.setState({error: true}));
    }
    render () {
        return <div>
            {this.state.error ? 'The given username and password combination doesn\'t match' : ''}
            <input type="email" onChange={e => this.setState({email: e.target.value})} value={this.state.email} />
            <input type="password" onChange={e => this.setState({password: e.target.value})} value={this.state.password} />
            <button onClick={this.login.bind(this)}>Login</button>
        </div>;
    }
}

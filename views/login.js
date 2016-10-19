import React, {Component, PropTypes} from 'react';

export default class Login extends Component {
    static propTypes = {
        handshake: PropTypes.func.isRequired,
        onAuthenticate: PropTypes.func.isRequired
    }
    state = {
        email: '',
        password: '',
        error: false
    }
    componentDidMount () {
        let {props: {handshake, onAuthenticate}} = this;
        handshake()
        .then((res) => {
            if (res.status >= 400 && res.status < 500) {
                throw new Error(res.statusText);
            }
            return res;
        })
        .then(() => onAuthenticate(true))
        .catch(() => onAuthenticate(false));
        addEventListener('keydown', this.onKeyDown);
    }
    componentWillUnmount () {
        removeEventListener('keydown', this.onKeyDown);
    }
    login () {
        let {props: {onAuthenticate}, state: {email, password}} = this;
        return fetch('https://editor-dot-test-paper-doll.appspot.com/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            credentials: 'include'
        })
        .then((res) => {
            if (res.status >= 400 && res.status < 500) {
                throw new Error(res.statusText);
            }
            return res;
        })
        .then(() => onAuthenticate(true))
        .catch(() => this.setState({error: true}));
    }
    onKeyDown ({keyCode}) {
        if (keyCode === 13) {
            return this.login();
        }
    }
    render () {
        return <div id="login">
            <img src="/img/logo.svg" />
            <input type="email" onChange={e => this.setState({email: e.target.value})} value={this.state.email} placeholder="email" />
            <input type="password" onChange={e => this.setState({password: e.target.value})} value={this.state.password} placeholder="password" />
            <button onClick={this.login.bind(this)}>Login</button>
            {this.state.error ? 'The given username and password combination doesn\'t match' : ''}
        </div>;
    }
}

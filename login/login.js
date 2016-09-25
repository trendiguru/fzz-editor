import {ConnectedComponent} from 'delux-react';

export default class Login extends ConnectedComponent {
    constructor (props) {
        super(props, 'users');
        this.state = {
            email: '',
            password: '',
        };
    }
    componentDidMount () {
        this.connect();
        this.dispatch({
            type: 'getCurrentUser',
            payload: {
                request: 'http://localhost:8765/users/me',
            }
        });
    }
    login () {
        this.dispatch({
            type: 'login',
            payload: {
                request: {
                    url: 'http://localhost:8765/login',
                    method: 'post',
                },
                user: this.state
            }
        });
    }
    render () {
        let {success, error} = this.state;
        let dialog;
        if (success) {
            dialog = 'WELCOME';
        }
        else if (error) {
            dialog = this.state.error;
        }
        let DialogNode = dialog ? <div className="dialog">{dialog}</div> : null;
        return <div>
            Email:
            <input type="email" onChange={e => this.setState({email: e.target.value})} value={this.state.email} />
            Password:
            <input type="password" onChange={e => this.setState({password: e.target.value})} value={this.state.password} />
            <button onClick={this.login.bind(this)}>Login</button>
            {DialogNode}
        </div>;
    }
}

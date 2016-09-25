import {Provider} from 'delux-react';
import Login from 'login';
import store from 'store';

ReactDOM.render(
    <Provider {...{store}}>
        <Login />
    </Provider>,
    document.querySelector('div')
);

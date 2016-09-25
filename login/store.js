import Store, {Collection} from 'delux';
import fetchMiddleware from 'delux-fetch';

let store = new Store;

store.use(action => {
    let {user} = action.payload;
    if (user) {
        action.payload.request.body = JSON.stringify(user);
    }
});

store.use(fetchMiddleware);

store.users = new Collection({});

store.users.on('login', (action, users) => {
    let {error} = action;
    if (error) {
        users[action.payload.user.email] = error;
    }
    else {
        users[action.payload.user.email] = action.payload.response;
    }
});

export default store;

import Navigo from 'navigo';
const ROOT = 'home';

class Router {
    constructor() {
        this.root = null;
        this.useHash = true;
        this.navigator = new Navigo(this.root, this.useHash);
        this.currentRoute = '';
        this.routesStorage = {};

        this._setRoute = this._setRoute.bind(this);
        this.nextDo = this.nextDo.bind(this);
        this.doNext = this.doNext.bind(this);
        this.backTo = this.backTo.bind(this);
        this.inRoute = this.inRoute.bind(this);

        this.doNext(ROOT, () => {
            console.log('the router is initialised.')
        });
    }
    //Immediately calls to calback.
    doNext(key, callback) {
        if (key) {
            this.currentRoute += "/" + key;
            this._setRoute(this.currentRoute, callback);
            this.navigator.navigate(this.currentRoute);
        }
    }

    //Calls to the callback only on event.
    nextDo(key, callback) {
        if (key) {
            this.currentRoute += "/" + key;
            this.navigator.navigate(this.currentRoute);
            this._setRoute(this.currentRoute, callback);
        }
    }

    _setRoute(route, callback) {
        route = route || this.currentRoute;
        /*if does not exist a callback for the currntRoute =>
            attech the callback to currentRoute*/
        if (!this.routesStorage[route]) {
            this.navigator.on(route, callback).resolve();
            this.routesStorage[route] = callback;
        }
    }

    backTo(key) {
        if (key) {
            console.log('key from backTo');
            console.log(key);
            let route = this.currentRoute.split('/');
            let backIndex = route.indexOf(key);
            if (backIndex !== -1) {
                let newRoute = '';
                for (let key of route.slice(0, backIndex + 1)) {
                    newRoute += '/' + key;
                }
                this.currentRoute = newRoute;
                this.navigator.navigate(this.currentRoute);
            }
        } else {
            this.navigator.navigate(ROOT);
        }
    }

    inRoute(key) {
        console.log("inRoute");
        console.log(key);
        return this.currentRoute.split('/').indexOf(key);
    }
}

let router = router || (new Router());
export default router;

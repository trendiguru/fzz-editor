import Navigo from 'navigo';
const ROOT = 'home';

class Router {
    constructor() {
        this.root = null;
        this.useHash = true;
        this.navigator = new Navigo(this.root, this.useHash);
        this.currentRoute = '';
        this.routesStorage = {};

        this.next = this.next.bind(this);
        this.next(ROOT, () => {
            console.log('the router is initialised.')
        });
    }
    next(key, callback) {
        if (key) {
            this.currentRoute += "/" + key;
            /*if does not exist a callback for the currntRoute =>
            attech the callback to currentRoute*/
            // if (!this.routesStorage[this.currentRoute]) {
            //     this.navigator.on(this.currentRoute, callback).resolve();
            //     this.routesStorage[this.currentRoute] = callback;
            // }
            setRoute(this.currentRoute, callback);
            this.navigator.navigate(this.currentRoute);
        }
    }
    navigateToNext(key){
        this.currentRoute += "/" + key;
        this.navigator.navigate(this.currentRoute);
    }
    setRoute(route, callback){
        route = route || this.currentRoute;
        if (!this.routesStorage[route]) {
            this.navigator.on(route, callback).resolve();
            this.routesStorage[route] = callback;
        }
    }

    backTo(key) {
        if (key) {
            let route = this.currentRoute.split('/');
            let backIndex = route.indexOf(key);
            if (backIndex !== -1) {
                console.log('backTo');
                console.log(route.slice(0, backIndex + 1));
                this.currentRoute = route.slice(0, backIndex + 1);
                this.navigator.navigate(this.currentRoute);
            }
            console.log(this.currentRoute);
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


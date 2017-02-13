import Navigo from 'navigo';

class Router {
    constructor(){
        this.root = null;
        this.useHash = true;
        this.navigator =  new Navigo(this.root, this.useHash);
        this.currentRoute = '';
        this.routesStorage = {};
        
        this.next = this.next.bind(this);
        this.next('home', ()=>{
            console.log('the router is initialised.')
        });
    }
    next(key, callback){
        this.currentRoute +="/"+key;
        /*if does not exist a callback for the currntRoute =>
          attech the callback to currentRoute*/
        if (!this.routesStorage[this.currentRoute]){
            this.navigator.on(this.currentRoute, callback).resolve();
            this.routesStorage[this.currentRoute] = callback;
        }
        this.navigator.navigate(this.currentRoute);
    }
    previous(){
        let path = this.currentRoute;
    }
}

let router = router ||(new Router());
export default router;


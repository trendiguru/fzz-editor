export default function breadthFirstSearch(root, callback) {
    let q = new Queue();
    q.enqueue(root);
    while (q.length > 0) {
        let node = q.dequeue();
        // add all the children to the back of the queue
        for (let key in node) {
            let value = callback(node, key);
            if (value) {
                q.enqueue(value);
            }
            else {
                return 0;
            }
        }
    }
}

class Queue {
    constructor () {
        this.__queue__ = [];
    }
    enqueue (x) {
        return this.__queue__.push(x);
    }
    dequeue () {
        return this.__queue__.shift();
    }
    get length () {
        return this.__queue__.length;
    }
}

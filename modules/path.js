// http://will.thimbleby.net/algorithms/doku.php?id=algorithm:breadth-first_search
import breadthFirstSearch from './breadth-first-search';

export default function findPathToValue (object, query) {
    let path;
    breadthFirstSearch(
        object,
        (parent, key) => {
            let value = parent[key];
            let valueClone = Object.assign({}, value);
            Object.defineProperties(valueClone, {
                parent: {value: parent},
                key: {value: key},
                original: {value: parent[key]}
            });
            if (value === query) {
                path = goUp(valueClone, 'parent', 'key');
                return 0;
            }
            else {
                return valueClone;
            }
        }
    );
    return path.reverse();
}

function goUp (object, PARENNT, PROPERTY, path = []) {
    if (object[PARENNT]) {
        return goUp(object[PARENNT], PARENNT, PROPERTY, path.concat(object[PROPERTY]));
    }
    else {
        return path;
    }
}

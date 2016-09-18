export default function parseImage (image) {
    image.people = arrayToObject(
        image.people.map(person => {
            person.items = arrayToObject(
                person.items.map(item => {
                    let {similar_results} = item;
                    for (let collectionName in similar_results) {
                        similar_results[collectionName] = arrayToObject(similar_results[collectionName], 'id');
                    }
                    return item;
                }),
                'category'
            );
            return person;
        }),
        '_id'
    );
    return image;
}

export function arrayToObject (array, idKey) {
    let object = {};
    for (let element of array) {
        object[element[idKey]] = element;
    }
    return object;
}

Object.values = Object.values || (object => Object.keys(object).map(key => object[key]));

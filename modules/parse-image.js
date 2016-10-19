export default function parseImage (image) {
    image.people = arrayToObject(
        image.people.map(person => {
            person.items = arrayToObject(person.items, 'category');
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

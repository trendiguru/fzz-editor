export default function getImageElement (src) {
    return new Promise ((resolve, reject) => {
        let img = Object.assign(document.createElement('img'), {
            src,
            onload () {
                resolve(img);
            },
            onerror (err) {
                reject(err);
            }
        });
    });
}

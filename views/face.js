import React, {PropTypes} from 'react';

export default function Face ({image, face, size, delta}) {
    let {width} = image.element;
    return <div style={{
        width: size,
        height: size,
        backgroundImage: `url(${image.image_urls[0]})`,
        backgroundPosition: `-${face[0] * delta}px -${face[1] * delta}px`,
        backgroundSize: `${delta * width}px auto`
    }} />;
}

Face.propTypes = {
    size: PropTypes.number,
    delta: PropTypes.number,
    face: PropTypes.array,
    image: PropTypes.object
};

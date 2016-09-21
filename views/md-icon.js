import React, {PropTypes} from 'react';

let MDIcon = (props) => <i className="md-icon">{props.children}</i>;

MDIcon.propTypes = {
    children: PropTypes.string.isRequired
};

export default MDIcon;

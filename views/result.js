import React, {PropTypes} from 'react';
import MDIcon from './md-icon';

export default React.createClass({
    name: 'Result',
    propTypes: {
        item: PropTypes.object,
        dragHandle: PropTypes.func,
        remove: PropTypes.func,
        origin: PropTypes.object
    },
    render () {
        let {props: {item: result, dragHandle, remove}} = this;
        return <div className="list-item" key={result.id} style={{
            margin: '0',
            width: '24em',
            height: '12em',
            display: 'block',
            overflow: 'visible'
        }}>
            <div style={{width: '100%', height: '100%'}}>
                <aside>
                    <button style={{position: 'relative', zIndex: 1000}} onClick={remove.bind(result.id)}>
                        <MDIcon>delete</MDIcon>
                    </button>
                </aside>
                {dragHandle(<div className="img" style={{backgroundImage: `url(${result.images.XLarge})`}} />)}
            </div>
        </div>;
    }
});

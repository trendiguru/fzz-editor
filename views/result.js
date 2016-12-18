import React from 'react';
import MDIcon from './md-icon';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(({children}) => children);

export default SortableElement((props) => {
    console.log(props);
    return <div
        className={props.className}
        style={{
            margin: '1em 0',
            width: '24em',
            height: '24em',
            display: 'block',
            overflow: 'visible',
        }}>
        <div style={{ width: '100%', height: '100%' }} className={'sb_wrapper'} >
            <aside>
                <button style={{ position: 'relative', zIndex: 1000 }} onClick={() => props.remove(props.value.id)}>
                    <MDIcon>delete</MDIcon>
                </button>
            </aside>
            <DragHandle>
                <div style={
                    {
                        backgroundImage: 'url(' + props.value.images.XLarge + ')',
                        height: '100%', width: '100%',
                        'background-size': '80px 60px',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center',
                        'background-size': 'contain'
                    }} />
            </DragHandle>
        </div>
    </div>;
}
);

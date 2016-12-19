import React from 'react';
import MDIcon from './md-icon';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

const REMOVE_BUTTON_SIZE = '40px';

const DragHandle = SortableHandle(({children}) => children);

export default SortableElement((props) => {
    console.log(props);
    return <div style={{ isolation: 'isolate' }}
        className={props.className}
        style={{
            margin: '1em',
            width: '24em',
            height: '24em',
            display: 'block',
            overflow: 'visible',
            backgroundColor: 'WHITE',
            borderRadius: '10px',
            borderColor: 'PINK',
            borderStyle: 'solid',
            borderWidth: '3px',
        }}>
        <div style={{ width: '100%', height: '100%'}}  >
            <aside style={{ position: 'absolute', marging:'10px'}}>
                <button style={{
                    width: REMOVE_BUTTON_SIZE,
                    height: REMOVE_BUTTON_SIZE, 
                    borderRadius: '10px',
                    right: '0px'
                }} onClick={() => props.remove(props.value.id)}>
                    <MDIcon>delete</MDIcon>
                </button>
            </aside>
            <DragHandle>
                <div style={
                    {
                        backgroundImage: 'url(' + props.value.images.XLarge + ')',
                        height: '100%', width: '100%',
                        'backgroundRepeat': 'no-repeat',
                        'backgroundPosition': 'center',
                        'backgroundSize': 'contain'
                    }} />
            </DragHandle>
        </div>
    </div>;
}
);

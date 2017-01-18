import React from 'react';
import MDIcon from './md-icon';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

const REMOVE_BUTTON_SIZE = '40px';

const DragHandle = SortableHandle(({children}) => children);
const OVERWRITE_STYLE = {
    isolation: 'isolate',
    margin: '1em',
    width: '15em',
    height: '15em',
    display: 'block',
    overflow: 'visible',
    borderRadius: '10px',
    backgroundColor: 'white',
}, 
OVERWRITE_BUTTON_STYLE = {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE, 
    borderRadius: '10px',
    right: '0px',
    backgroundColor: 'PINK',
},
OVERWRITE_BACKGROUND_IMAGE_STYLE = {
    height: '100%', width: '100%',
    'backgroundRepeat': 'no-repeat',
    'backgroundPosition': 'center',
    'backgroundSize': 'contain'
};

export default SortableElement((props) => {
    let item;
    try{
        item =  <div 
        className={props.className}
        style={OVERWRITE_STYLE}>
        <div style={{ width: '100%', height: '100%'}}  >
            <aside style={{ position: 'absolute', marging:'10px'}}>
                <button style={OVERWRITE_BUTTON_STYLE} onClick={() => props.remove(props.value.id)}>
                    <MDIcon>delete</MDIcon>
                </button>
            </aside>
            <DragHandle>
                <div style={Object.assign({backgroundImage: 'url(' + props.value.images.XLarge + ')'},OVERWRITE_BACKGROUND_IMAGE_STYLE)}/>
            </DragHandle>
        </div>
    </div>;
    }catch(err){
        console.error(err);
        item =  <div 
        className={props.className}
        style={OVERWRITE_STYLE}>
        <div style={{ width: '100%', height: '100%'}}  >
            <aside style={{ position: 'absolute', marging:'10px'}}>
                <button style={OVERWRITE_BUTTON_STYLE} onClick={() => props.remove(props.value.id)}>
                    <MDIcon>delete</MDIcon>
                </button>
            </aside>
            <DragHandle>
                <div style={Object.assign({backgroundImage:'url(/img/broken.png)'},OVERWRITE_BACKGROUND_IMAGE_STYLE)} className={'broken-result'}/>
            </DragHandle>
        </div>
    </div>;
    }
    return item;
});

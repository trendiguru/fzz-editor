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
}, 
MSG_STYLE={
    wordWrap: 'break-word',
    textAlign: 'justify', 
    whiteSpace:'pre-wrap', 
    position:'absolute'
}, 
ERROR_MSG = 'There are an internal error! please report a support group, by mail: lior@trendiguru.com. Thank you!',
DANGER_ICON = '/img/broken.png';

export default SortableElement((props) => {
    let imageSrc, errorMsg, id, classNames = '';
    let remove = <div></div>;
    try{
        id = props.value.id;
        imageSrc = props.value.images.XLarge;
        remove = <aside style={{ position: 'absolute', marging:'10px'}}>
            <button style={OVERWRITE_BUTTON_STYLE} onClick={() => props.remove(id)}>
                <MDIcon>delete</MDIcon>
            </button>
        </aside>
    }catch(err){
        classNames = 'broken-result';
        imageSrc = DANGER_ICON;
        errorMsg = ERROR_MSG;
        console.error(err);
    }
    return <div 
        className={props.className}
        style={OVERWRITE_STYLE}>
        <div style={{ width: '100%', height: '100%'}}  >
            {remove}
            <DragHandle>
                <div style={Object.assign({backgroundImage: 'url(' + imageSrc + ')'},
                    OVERWRITE_BACKGROUND_IMAGE_STYLE)} 
                    className={classNames}>
                    <p style={MSG_STYLE}>{errorMsg}</p></div>
            </DragHandle>
        </div>
    </div>;
});
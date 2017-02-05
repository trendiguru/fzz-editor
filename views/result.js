import React from 'react';
import MDIcon from './md-icon';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

const REMOVE_BUTTON_SIZE = '40px';

const DragHandle = SortableHandle(({children}) => children);
const OVERWRITE_STYLE = {
    
}, 
OVERWRITE_BUTTON_STYLE = {
    width: REMOVE_BUTTON_SIZE,
    height: REMOVE_BUTTON_SIZE, 
    borderRadius: '10px',
    // right: '0px',
    backgroundColor: 'PINK',
    marginRight: '10px',
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
ERROR_MSG = 'There is an internal error! please report a support group, by mail: lior@trendiguru.com. Thank you!',
DANGER_ICON = '/img/broken.png';

export default SortableElement((props) => {
    let imageSrc, errorMsg, id, classNames = '';
    let remove = <div></div>;
    let info = <div></div>;
    let buy = <div></div>;
    let children = [];
    try{
        id = props.value.id;
        imageSrc = props.value.images.XLarge;
        remove = (<button style={OVERWRITE_BUTTON_STYLE} onClick={() => props.remove(id)}>
                    <MDIcon>delete</MDIcon>
                </button>);
        buy = (<button style={OVERWRITE_BUTTON_STYLE} onClick={() => {}}>
                <MDIcon>shop</MDIcon>
            </button>);
        info = (<button style={OVERWRITE_BUTTON_STYLE} onClick={() => {}}>
                    <MDIcon>info</MDIcon>
                </button>);
        children = [buy, remove];
    }catch(err){
        classNames = 'broken-result';
        imageSrc = DANGER_ICON;
        errorMsg = ERROR_MSG;
        console.error(err);
    }    
    return <div 
        className={props.className+" result"}
        style={OVERWRITE_STYLE}>
        <div style={{ width: '100%', height: '100%', position:'relative'}}  >
            <aside style={{ position: 'absolute', marging:'10px'}}>
                {children}
            </aside>
            <aside style={{ position: 'absolute', marging:'10px', bottom:'0px'}}>
                {info}
            </aside>
            <DragHandle>
                <div style={Object.assign({backgroundImage: 'url(' + imageSrc + ')'},
                    OVERWRITE_BACKGROUND_IMAGE_STYLE)} 
                    className={classNames}>
                    <p style={MSG_STYLE}>{errorMsg}</p></div>
            </DragHandle>
        </div>
    </div>;
});
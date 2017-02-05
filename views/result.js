import React from 'react';
import MDIcon from './md-icon';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import Price from './price';

const REMOVE_BUTTON_SIZE = '40px',
DragHandle = SortableHandle(({children}) => children),
ERROR_MSG = 'There is an internal error! please report a support group, by mail: lior@trendiguru.com. Thank you!',
DANGER_ICON = '/img/broken.png';

export default SortableElement((props) => {
    let imageSrc, errorMsg, id, classNames, brand, clickUrl = '';
    let price = {};
    let remove = <div></div>;
    let info = <div></div>;
    let buy = <div></div>;
    let children = [];
    try{
        id = props.value.id;
        imageSrc = props.value.images.XLarge;
        brand = props.value.brand || 'unknown';
        clickUrl = props.value.clickUrl || 'unknown';
        price = props.value.price || {
            currency: 'unknown',
            price: 'unknown',
        };
        remove = (<button onClick={() => props.remove(id)} key={1}>
                    <MDIcon>delete</MDIcon>
                </button>);
        buy = (<a href={clickUrl} target="_blank" key={2}>
                <button >
                    <MDIcon>shop</MDIcon>
                </button>
            </a>);
        info = (<aside style={{bottom:'0px', right:'0px'}}>
                    <Price data={price} />
                    <span className="brand">{brand}</span>
                </aside>);
        children = [remove, buy];
    }catch(err){
        classNames = 'broken-result';
        imageSrc = DANGER_ICON;
        errorMsg = ERROR_MSG;
        console.error(err);
    }    
    return <div 
        className={props.className+" result"}>
        <div>
            <aside>
                {children}
            </aside>
            {info}
            <DragHandle>
                <div style={Object.assign({backgroundImage: 'url(' + imageSrc + ')'},{})} 
                    className={classNames}>
                    <p>{errorMsg}</p></div>
            </DragHandle>
        </div>
    </div>;
});
import React from 'react';
import MDIcon from './md-icon';
import {SortableElement, SortableHandle} from 'react-sortable-hoc';

const DragHandle = SortableHandle(({children}) => children);

export default SortableElement(({value: result, remove, className}) => <div
className={className}
style={{
    margin: '1em 0',
    width: '24em',
    height: '12em',
    display: 'block',
    overflow: 'visible',
    //float: 'left'
}}>
    <div style={{width: '100%', height: '100%'}} className={'wrapper'} >
       <aside>
           <button style={{position: 'relative', zIndex: 1000}} onClick={() => remove(result.id)}>
               <MDIcon>delete</MDIcon>
           </button>
       </aside>
       <DragHandle>
           <div className="img" style={{backgroundImage: `url(${result.images.XLarge})`}} />
       </DragHandle>
   </div>
</div>);

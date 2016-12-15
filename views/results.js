import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Item from './result';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';

function getItems(count, height) {
    var heights = [65, 110, 140, 65, 90, 65];
    return range(count).map((value) => {
        return {
            value,
            height: height || heights[random(0, heights.length - 1)]
        };
    });
}

class ListWrapper extends Component {
    constructor({items}) {
        super();
        this.state = {
            items, isSorting: false
        };
    }
    static propTypes = {
        items: PropTypes.array,
        className: PropTypes.string,
        itemClass: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        onSortStart: PropTypes.func,
        onSortEnd: PropTypes.func,
        component: PropTypes.func,
        shouldUseDragHandle: PropTypes.bool
    }
    static defaultProps = {
        className: classNames('sb_list', 'sb_stylizedList'),
        itemClass: classNames('sb_item', 'sb_stylizedItem'),
        width: 400,
        height: 600
    };
    onSortStart = () => {
        let {onSortStart} = this.props;
        this.setState({ isSorting: true });

        if (onSortStart) {
            onSortStart(this.refs.component);
        }
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        let {onSortEnd} = this.props;
        let {items} = this.state;

        this.setState({ items: arrayMove(items, oldIndex, newIndex), isSorting: false });

        if (onSortEnd) {
            onSortEnd(this.refs.component);
        }
    };
    render() {
        const Component = this.props.component;
        const {items, isSorting} = this.state;
        const props = {
            isSorting,
            items,
            onSortEnd: this.onSortEnd,
            onSortStart: this.onSortStart,
            ref: "component",
            useDragHandle: this.props.shouldUseDragHandle
        }
        console.log(this.props);
        console.log(props);
        return <Component {...this.props} {...props} />
    }
}


const SortableList = SortableContainer(({className, items, itemClass, sortingIndex, shouldUseDragHandle, sortableHandlers}) => {
    return (
        <div className={className} style={{width:'1300px', height:'auto'}} {...sortableHandlers}>
            {items.map((value, index) =>
                <Item
                    key={index}
                    className={itemClass}
                    sortingIndex={sortingIndex}
                    index={index}
                    value={value}
                    // height={height} TODO: check if it is so important to set height per each item..
                    shouldUseDragHandle={shouldUseDragHandle}
                    remove={(el)=>{console.log;}}
                    />
            )}
        </div>
    );
});

export default class Results extends Component {
    render() {
        return <div>
                <ListWrapper 
                component={SortableList} 
                axis={'xy'} 
                items={this.props.origin} 
                helperClass={'sb_stylizedHelper'} 
                className={classNames('sb_list', 'sb_stylizedList', 'sb_grid')} 
                itemClass={classNames('sb_stylizedItem', 'sb_gridItem')}
                shouldUseDragHandle={true}
                />
            </div>
    }
}

let d = document.createElement("DIV");
document.body.appendChild(d);
// ReactDOM.render(grid(),d);

// import React from 'react';
// import { SortableContainer, arrayMove } from 'react-sortable-hoc';
// import Editor from './editor';
// import Result from './result';
// import classNames from 'classnames';

// console.log("*******");
// console.log(classNames);

// const SortableList = SortableContainer(({className, items, itemClass, sortingIndex, shouldUseDragHandle, sortableHandlers, remove}) => <div className={className} {...sortableHandlers}>
//     {items.map((item, index) =>
//         <Result key={index} 
//         {...{ remove, index }}
//         className={itemClass}
//         sortingIndex={sortingIndex}
//         shouldUseDragHandle={shouldUseDragHandle} 
//         value={item} 
//         />
//     )}
// </div>);

// export default class Results extends Editor {
//     state = {
//         selected: undefined
//     }
//     add(result) {
//         this.set(
//             (results) => results.concat(result),
//             {
//                 method: 'POST',
//                 body: JSON.stringify({ data: result })
//             }
//         );
//     }
//     update(results) {
//         this.set(
//             () => results,
//             {
//                 method: 'PUT',
//                 body: JSON.stringify({ data: results })
//             }
//         );
//     }
//     remove(id) {
//         this.set(
//             results => results.filter(result => result.id !== id),
//             {
//                 method: 'DELETE',
//             },
//             id
//         );
//     }
//     onSortEnd({oldIndex, newIndex}) {
//         this.update(arrayMove(this.props.origin, oldIndex, newIndex));
//     }
//     render() {
//         return <div>
//             <form className="result-form">
//                 <h3>Add a result</h3>
//                 <label>Image</label>
//                 <input type="text" name="image" />
//                 <label>Click URL</label>
//                 <input type="text" name="clickUrl" />
//                 <button className="raised" type="button" onClick={({target: {parentElement: form}}) => {
//                     this.add({
//                         clickUrl: form.elements.clickUrl.value,
//                         images: {
//                             XLarge: form.elements.image.value
//                         }
//                     });
//                     form.reset();
//                 } }>Submit</button>
//             </form>
//             <SortableList
//                 helperClass={'stylizedHelper'}
//                 className={classNames('storybooklist', 'stylizedList', 'grid')}
//                 itemClass={classNames('stylizedItem', 'gridItem', 'list-item')}
//                 axis={'xy'}
//                 useDragHandle={true}
//                 items={this.props.origin}
//                 onSortEnd={::this.onSortEnd}
//                 remove={::this.remove}
//             />
//         </div>;
//     }
// }

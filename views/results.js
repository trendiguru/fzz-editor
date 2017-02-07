import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Item from './result';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import range from 'lodash/range';
import random from 'lodash/random';
import classNames from 'classnames';
import Editor from './editor';
import validURL from '../modules/validURL';
import Select from 'react-select';

function getItems(count, height) {
    var heights = [65, 110, 140, 65, 90, 65];
    return range(count).map((value) => {
        return {
            value,
            height: height || heights[random(0, heights.length - 1)]
        };
    });
}

export default class Results extends Editor {
    constructor(props) {
        super();
        this.state = {
            items: props.origin,
            isSorting: false,
            currencyValue: undefined,
            currencyOptions: [{
                    value:'USD', 
                    label:'USD',
                }, 
                {
                    value:'EUR',
                    label:'EUR',
                }, 
                {
                    value:'Yen',
                    label:'Yen',
                }
            ]
        };
        //function binding:
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
        this.add = this.add.bind(this);
    }
    static defaultProps = {
        className: classNames('sb_list', 'sb_stylizedList'),
        itemClass: classNames('sb_item', 'sb_stylizedItem'),
        width: 400,
        height: 600
    };
    remove(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.set(
                results => results.filter(result => result.id !== id),
                {
                    method: 'DELETE',
                },
                id
            );
        }
    }
    update(results) {
        this.set(
            () => results,
            {
                method: 'PUT',
                body: JSON.stringify({ data: results })//TODO:there may me the same problem that was in add function (data - ruins it all...)
            }
        );
    }

    add(result) {
        this.set(
            (results) => [result].concat(results),
            {
                method: 'POST',
                body: JSON.stringify(result)
            }
        );
    }

    shouldCancelStart(e) {
        // Cancel sorting if the event target is a 'button':
        if (['button', 'i'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
            return true; // Return true to cancel sorting
        }
    }

    onSortStart = () => {
        let {onSortStart} = this.props;
        this.setState({ isSorting: true });
    };

    onSortEnd = ({oldIndex, newIndex}) => {
        this.update(arrayMove(this.props.origin, oldIndex, newIndex));
        this.setState({ isSorting: false });
        let {onSortEnd} = this.props;
    };

    submitResult = (form)=>{
        let clickUrl = form.clickUrl;
        let imageUrl = form.image;
        if (!validURL(clickUrl.value) && clickUrl.value !== ''){
            clickUrl.setCustomValidity('This field is not valid!');
            clickUrl.addEventListener('keydown', ()=>{
                clickUrl.setCustomValidity('');
            });
        }else{
            clickUrl.setCustomValidity('');
        }
        if (!validURL(imageUrl.value) && imageUrl.value !== ''){
            imageUrl.setCustomValidity('This field is not valid!');
            imageUrl.addEventListener('keydown', ()=>{
                imageUrl.setCustomValidity('');
            });
        }else{
            imageUrl.setCustomValidity('');
        }
        clickUrl.reportValidity();
        imageUrl.reportValidity();
        if (clickUrl.checkValidity() && imageUrl.checkValidity()){
            let sentData = {
                clickUrl: clickUrl.value,
                images: {
                    XLarge: imageUrl.value
                },
                price: {
                    currency: form.currency.value,
                    price: form.price.value,
                },
                brand: form.brand.value,
            }
            console.log('Submit results:');
            console.log(sentData);
            this.add(sentData);
            alert('The result was successfully added!');
            form.reset();
        } 
    };

    createForm = ()=>{
        const {currencyValue, currencyOptions} = this.state;
        console.log("inside createForm");
        return (<form className="result-form hidden" required>
                <h3>Add a result</h3>
                <label>Image</label>
                <input type="text" name="image" required/>
                <label>Click URL</label>
                <input type="text" name="clickUrl" required/>
                <label>Price</label>
                <input type="text" name="price" required/>
                <label>Currency</label>
                <Select
                        name={'currency'}
                        options={currencyOptions}
                        value={currencyValue}
                        onChange={(selected) => {
                            this.setState({currencyValue:selected});
                        }}
                    />
                <label>Brand</label>
                <input type="text" name="brand" required/>
                <button className="raised" type="button" onClick={({target: {parentElement: form}}) => {
                    this.submitResult(form);
                } 
            }>Submit</button>
        </form>);
    }

    render() {
        const {currencyValue, isSorting} = this.state;
        const props = {
            isSorting,
            items: this.props.origin,
            onSortEnd: this.onSortEnd,
            onSortStart: this.onSortStart,
            shouldCancelStart:this.shouldCancelStart,
            ref: "component",
            useDragHandle: this.props.shouldUseDragHandle,
            remove: this.remove
        }
        let form =this.createForm();
        return <div>
        <button className='add-result gray-frame' style={{borderRadius:'10px'}} onClick={()=>{
                (document.querySelector('.add-result')).classList.add('hidden');
                (document.querySelector('.result-form')).classList.remove('hidden');
            }}>
            <i className='md-icon'>add</i>
            <p>add a result</p>
            </button>
            {form}
            <SortableList
                axis={'xy'}
                helperClass={'sb_stylizedHelper'}
                className={classNames('sb_list', 'sb_stylizedList', 'sb_grid')}
                itemClass={classNames('sb_stylizedItem', 'sb_gridItem', 'gray-frame')}
                shouldUseDragHandle={true}
                {...props}
                />
        </div>

    }
}


const SortableList = SortableContainer(({className, items, itemClass, remove, sortingIndex, shouldUseDragHandle, sortableHandlers}) => {
    return (
        <div className={className} style={{ width: '100%', height: '87vh' }} {...sortableHandlers}>
            {items.map((value, index) =>
                <Item
                    key={index}
                    className={itemClass}
                    sortingIndex={sortingIndex}
                    index={index}
                    value={value}
                    shouldUseDragHandle={shouldUseDragHandle}
                    remove={remove}
                    />
            )}
        </div>
    );
});

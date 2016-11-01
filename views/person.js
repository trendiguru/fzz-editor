import React from 'react';
import Editor from './editor';
import Collection from './collection';
import Item from './item';
import CATEGORIES from '../categories.json';

export default class Person extends Editor {
    state = {
        changedGender: false
    }
    changeGender (gender) {
        this.setState({changedGender: true});
        this.set(
            person => {
                person.gender = gender;
                delete person.items;
                return person;
            },
            {
                method: 'PATCH',
                body: JSON.stringify({data: gender})
            }
        );
    }
    render () {
        let {gender} = this.props;
        return <div>
            <div>
                <input checked={gender === 'Male'} id="male" type="radio" onChange={e => this.changeGender(e.target.value)} value="Male" name="gender" />
                <label htmlFor="male">Male</label>
            </div>
            <div>
                <input checked={gender === 'Female'} id="female" type="radio" onChange={e => this.changeGender(e.target.value)} value="Female" name="gender" />
                <label htmlFor="female">Female</label>
            </div>
            {
                this.state.changedGender
                ? 'Proccessing new gender'
                : <Collection source={this.props} query="items" title="category" addable={true} options={CATEGORIES} editor={Item} />
            }
        </div>;
    }
}

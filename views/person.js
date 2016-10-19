import React from 'react';
import Editor from './editor';
import Collection from './collection';
import Item from './item';

export default class Person extends Editor {
    constructor (props) {
        super(props);
    }
    changeGender (gender) {
        this.set(
            person => {
                person.gender = gender;
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
            <Collection source={this.props} query="items" title="category" addable={true} editor={Item} />
        </div>;
    }
}

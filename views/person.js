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
        ).then((response)=>{
            console.log('first response');
            console.log(response);
            if (!response.ok){//TODO: check an additional factors of failed response 
                throw new Error('we cannot change the gender.');
            }
        }).then(this.context.updateImage).then((response)=>{
            console.log('second response:');
            console.log(response);
            if (!response.num_of_people > 0){//TODO: check an additional factors of failed response 
                throw new Error('we cannot change the gender.');
            }
            this.setState({changedGender: false});
            alert('gender was successfully added.');
        }).catch((err)=>{
            console.error(err);//TODO: FIRE ERROR API!!!
            // if changing of the gender failed => refresh the react components.
            this.context.updateImage().then((response)=>{
                console.log('response3');
                console.log(response);
                this.setState({changedGender: false});
            }).then(()=>{alert(err.message);});
        });
    }
    render () {
        let {gender} = this.props;
        return <div>
            <div className='gender'>
                <p>gender:</p>
                <div>
                    <input 
                        checked={gender === 'Male'} 
                        id="male" 
                        type="radio" 
                        onChange={(e) => {
                            if (e.target.value!==gender && !this.state.changedGender){
                                this.changeGender(e.target.value);
                            }
                        }} 
                        value="Male"
                        name="gender" 
                    />
                    <label htmlFor="male">Male</label>
                </div>
                <div>
                    <input 
                        checked={gender === 'Female'} 
                        id="female"
                        type="radio"
                        onChange={(e) => {
                            if (e.target.value!==gender && !this.state.changedGender){
                                this.changeGender(e.target.value);
                            }
                        }} 
                        value="Female" 
                        name="gender" 
                        />
                    <label htmlFor="female">Female</label>
                </div>
            </div>
            {
                this.state.changedGender
                ? (<div><div className={'loading'}/></div>)
                : (<Collection source={this.props} query="items" title="category" addable={true} options={CATEGORIES[gender]} editor={Item} />)
            }
        </div>;
    }
}

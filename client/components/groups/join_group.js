import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Groups } from '../../../imports/collections/groups';
import { Accounts } from 'meteor/accounts-base';
import { CountryDropdown } from 'react-country-region-selector';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Group from '../../../imports/classes/Group';

class JoinGroup extends Component {

  constructor(props){
    super(props);
    this.state = {
      error: '',
      country: ''
    };
    this.updateCountry = this.updateCountry.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    let name = document.getElementById("full_name").value;
    let email = document.getElementById("email").value;

    if(name == "" || email == "" || this.state.country == '') {
      console.log("Name: ", name, " Email: ", email, " Country: ", this.state.country);
      Alert.error('Name, Email, Password and Country are mandatory fields!', {
        position: 'top-left',
        effect: 'slide',
        timeout: 3000,
        offset: 20
      });

      return;
    }

    var newMeditator = {
     username: name,
     email: email,
     country: this.state.country
    };

    console.log("COUNTRY: ", newMeditator.country);

    var selectedGroup = new Group(this.props.groups);

    const meditators = {
      full_name: name,
      country: this.state.country,
      email: email
    }

    selectedGroup.addMeditator(meditators);

    Alert.success('Group joined succesfully!', {
      position: 'top-left',
      effect: 'jelly',
      onShow: function () {
        setTimeout(function(){
          browserHistory.push('/');
        }, 2000);
      },
      timeout: 1500,
      offset: 20
    });

  }

  updateCountry(val) {
    console.log('NEW VALUE ', val);
    this.setState({ country: val });
  }


  render(){
    const error = this.state.error;
    return (
      <div className="container-fluid top-buffer">
        { error.length > 0 ?<div className="alert alert-danger fade in">{error}</div>:''}
        <div className="panel panel-primary">
          <div className="panel-heading">Join online group</div>
          <div className="panel-body">
          <div className="form-group">
            <input type="text" id="full_name"
                  className="form-control input-lg" placeholder="Full name"
            />
          </div>
          <div className="form-group">
            <CountryDropdown
              value={this.state.country}
              classes='countryDropDown'
              defaultOptionLabel = 'select country'
              onChange={(val) => this.updateCountry(val)}
            />
          </div>
          <div className="form-group">
            <input type="email" id="email"
                  className="form-control input-lg" placeholder="email"
            />
          </div>
          <button
            className="btn btn-primary"

            onClick={this.handleSubmit.bind(this)}
            >
            Join Group
          </button>
        <Alert stack={{limit: 3}} />
      </div>
      </div>
    </div>
    );
  }
}

export default createContainer((props) => {

  const { groupId } = props.params;

  Meteor.subscribe('groups');

  return { groups: Groups.findOne(groupId) };
}, JoinGroup);

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';
import { CountryDropdown } from 'react-country-region-selector';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

export default class CreateUser extends Component {

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
    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;

    if(name == "" || email == "" || this.state.country == '') {
      Alert.error('Name, Email, Password and Country are mandatory fields!', {
        position: 'top-left',
        effect: 'slide',
        timeout: 3000,
        offset: 20
      });

      return;
    }

    var newUserData = {
     username: name,
     email: email,
     //password: password,
     roles: ['nationalresp'],
     country: this.state.country
    };

    console.log("COUNTRY: ", newUserData.country);

    Meteor.call('mCreateUser', newUserData, (error, result) => {
        if (result) {

          Meteor.call( // Notify the group leader
            'sendEmail',
            'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
            email,
            'WCCM Online Meditation Groups - National Referent Role Assignment',
            '<p>Dear '+name+'</p><h4>You have been granted an administrative account to manage online meditation groups in <b>'+this.state.country+' </b></h4><p>You will receive another email to setup your account password following a personalized link.</p><p>For any help you might need please write to leonardo@wccm.org<p><em>The WCCM Online Mediation Groups Staff</em></p>',
            (err, result) => {
              console.log("ERR: ", err, 'RESULT: ', result);
            }
          );

          Alert.success('User created succesfully!', {
            position: 'top-left',
            effect: 'jelly',
            onShow: function () {
              setTimeout(function(){
                console.log("Result: ", result);
                browserHistory.push('/');
              }, 2000);
            },
            timeout: 1500,
            offset: 20
          });
        } else if (error) {

          Alert.error(error.message, {
            position: 'top-left',
            effect: 'slide',
            timeout: 3000,
            offset: 20
          });
        }
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
          <div className="panel-heading">Create Authorized User</div>
          <div className="panel-body">
          <div className="form-group">
            <input type="text" id="signup-name"
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
            <input type="email" id="signup-email"
                  className="form-control input-lg" placeholder="email"
            />
          </div>
          <button
            className="btn btn-primary"

            onClick={this.handleSubmit.bind(this)}
            >
            Create User
          </button>
        <Alert stack={{limit: 3}} />
      </div>
      </div>
    </div>
    );
  }
}

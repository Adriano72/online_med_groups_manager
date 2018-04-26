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
    let password = document.getElementById("signup-password").value;

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
     password: password,
     roles: ['nationalresp'],
     country: this.state.country
    };

    console.log("COUNTRY: ", newUserData.country);

    Meteor.call('mCreateUser', newUserData, (error, result) => {
        if (error) {
             console.log(error);
              return;
        }
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
          <div className="form-group">
            <input type="password" id="signup-password"
                  className="form-control input-lg"
                  placeholder="password"
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

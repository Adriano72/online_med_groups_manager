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
    let gdpr = this.refs.gdpr_consent.checked

    if(name == "" || email == "" || this.state.country == '' || !gdpr) {
      console.log("Name: ", name, " Email: ", email, " Country: ", this.state.country);
      Alert.error('Name, Email, Password and Country are mandatory fields!', {
        position: 'top-left',
        effect: 'slide',
        timeout: 3000,
        offset: 20
      });

      return;
    }

    var selectedGroup = new Group(this.props.groups);

    const meditators = {
      full_name: name,
      country: this.state.country,
      email: email,
      gdpr_ok: gdpr
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
          <Alert stack={{limit: 3}} />
        </div>
        </div>
        <div className="panel panel-success">
          <div className="panel-heading">Communication Permissions</div>
            <div className="panel-body">
                <div className="form-group">
                  <div className="checkbox">
                    <p>WCCM will use the information you provide on this form to be in touch with you and to provide updates and marketing. Please let us know that you would like to hear from us:</p>
                    <br />
                    <label>
                      <input type="checkbox" ref="gdpr_consent" value="" />
                      <b>I agree to be contacted by EMAIL</b>
                    </label><br /><br />
                    <p>You can change your mind at any time by clicking the unsubscribe link in the footer of any email you receive from us, or by contacting us at leonardo@wccm.org. We will treat your information with respect. For more information about our privacy practices please visit our website. By clicking below, you agree that we may process your information in accordance with these terms.</p>
                  </div>
                </div>
            </div>
        </div>
        <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>
          Join Group
        </button>
      </div>
    );
  }
}

export default createContainer((props) => {

  const { groupId } = props.params;

  Meteor.subscribe('groups');

  return { groups: Groups.findOne(groupId) };
}, JoinGroup);

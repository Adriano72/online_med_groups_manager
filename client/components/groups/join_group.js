import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Groups } from '../../../imports/collections/groups';
import { CountryDropdown } from 'react-country-region-selector';
import Alert from 'react-s-alert';
import moment from 'moment-timezone';
import ReCAPTCHA from "react-google-recaptcha";
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Group from '../../../imports/classes/Group';

let userTimeZone = moment.tz.guess();

const TEST_SITE_KEY = "6LeKW2wUAAAAAKLEwOVTvUVdkEaYZTVcAAoJNjsb";
const DELAY = 1500;

class JoinGroup extends Component {

  constructor(props){
    super(props);
    this.state = {
      error: '',
      country: '',
      load: false,
      value: "[empty]",
      expired: "false"
    };
    this.updateCountry = this.updateCountry.bind(this);
    this._reCaptchaRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ load: true });
    }, DELAY);
    console.log("didMount - reCaptcha Ref-", this._reCaptchaRef);
  }

  handleChange = value => {
    console.log("Captcha value:", value);
    this.setState({ value });
  };

  asyncScriptOnLoad = () => {
    this.setState({ callback: "called!" });
    console.log("scriptLoad - reCaptcha Ref-", this._reCaptchaRef);
  };
  handleExpired = () => {
    this.setState({ expired: "true" });
  };

  handleSubmit(e){
    e.preventDefault();
    let name = document.getElementById("full_name").value;
    let email = document.getElementById("email").value;
    let gdpr = this.refs.gdpr_consent.checked

    var selectedGroup = new Group(this.props.groups);

    const meditators = {
      full_name: name,
      country: this.state.country,
      email: email,
      gdpr_ok: gdpr
    }

    if(this.state.value === "[empty]"){
      bootbox.alert({
        title: "Captcha validation failed",
        message: "Please validate captcha to confirm you are a human being!",
      })
      return;
    }

    selectedGroup.addMeditator(meditators, (err, result) => {
      console.log("ERROR LOG: ", err);
      if(result){

        console.log("PROPS _____ ", this.props.groups);

        Meteor.call( // Notify the group leader -- EDITED
          'sendEmail',
          'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
          this.props.groups.group_leader.email,
          'WCCM Online Meditation Groups - New group subscription',
          '<p>Dear '+this.props.groups.group_leader.first_name+'</p><p>A new meditator, <b>'+name+'</b>, email: '+email+' joined the group you lead every <b>'+this.props.groups.meet_time.day_of_week+ ' at '+this.props.groups.meet_time.meet_time+'</b></p><p>For any help you might need please contact leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

          (err, result) => {
            console.log("ERR: ", err, 'RESULT: ', result);
          }
        );
        Meteor.call( // Notify the user -- EDITED
          'sendEmail',
          'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
          email,
          'WCCM Online Meditation Groups - You joined an online meditation group!',
          '<p>Dear '+name+'</p><h4>You are now a participant of the following online meditation group:</h4><ul><li>Group Language: '+this.props.groups.group_language+'</li><li>Group Meeting Day and Time: '+this.props.groups.meet_time.day_of_week+ ' at '+this.props.groups.meet_time.meet_time+' - Timezone: '+this.props.groups.meet_time.time_zone+' (GMT '+moment().tz(this.props.groups.meet_time.time_zone).format('Z')+')</li></ul><p>For any information you might need please refer to your group leader <b>'+this.props.groups.group_leader.first_name+' '+this.props.groups.group_leader.last_name+'</b> at '+this.props.groups.group_leader.email+'</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

          (err, result) => {
            console.log("ERR: ", err, 'RESULT: ', result);
          }
        );
        Alert.success('Your request to join was sent to the group leader', {
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
      }else {
        Alert.error(err.message, {
          position: 'top-left',
          effect: 'slide',
          timeout: 3000,
          offset: 20
        });
      }
    });
    /*
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
    */

  }

  updateCountry(val) {
    console.log('NEW VALUE ', val);
    this.setState({ country: val });
  }


  render(){
    const error = this.state.error;

    const { value, callback, load, expired } = this.state || {};

    return (
      <div className="container-fluid top-buffer">
        { error.length > 0 ?<div className="alert alert-danger fade in">{error}</div>:''}
        <div className="panel panel-primary">
          <div className="panel-heading">Join Group</div>
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
        <ReCAPTCHA
          style={{ display: "inline-block" }}
          theme="dark"
          ref={this._reCaptchaRef}
          sitekey={TEST_SITE_KEY}
          onChange={this.handleChange}
          asyncScriptOnLoad={this.asyncScriptOnLoad}
        />
      <br />
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

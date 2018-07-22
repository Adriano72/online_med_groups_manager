import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { CountryDropdown } from 'react-country-region-selector';
import { Groups } from '../../../imports/collections/groups';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Group from '../../../imports/classes/Group';
import { ValidationError } from 'meteor/jagi:astronomy';

const format = 'h:mm a';

const now = moment().hour(0).minute(0);

class GroupCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      country: '',
      grpupLanguage: 'English',
      meetDay: '',
      meetTime: ''
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateMeetDay = this.updateMeetDay.bind(this);
    this.updateMeetTime = this.updateMeetTime.bind(this);
  }

  updateLanguage(e) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ grpupLanguage: e.target.value });
  }

  updateMeetDay(e) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ meetDay: e.target.value });
  }

  updateMeetTime(val) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ meetTime: val && val.format(format) });
  }

  updateCountry(val) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ country: val });
  }

  onSaveClick() {

      const gp_leader = {
        first_name: this.refs.group_leader_first_name.value,
        last_name: this.refs.group_leader_second_name.value,
        country: this.state.country,
        phone: this.refs.group_leader_phone.value,
        email: this.refs.group_leader_email.value
      }

      const meet_time = {
        day_of_week: this.state.meetDay,
        meet_time: this.state.meetTime
      }

      var newGroup = new Group();
      newGroup.insert(
        this.state.grpupLanguage,
        this.refs.useOwnMeetingRes.checked,
        gp_leader,
        meet_time,
        (err, result) => {
          if(result){

            Meteor.call(
              'sendEmail',
              'adriano@wccm.org',
              Meteor.user().emails[0].address,
              'WCCM Online Meditation Groups',
              'A new online group has been created!',
              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            Meteor.call(
              'sendEmail',
              'adriano@wccm.org',
              'a.massi@informatica.aci.it',
              'WCCM Online Meditation Groups',
              'A new online group has been created!',
              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            Alert.success('Group created', {
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
            alert("Error during the attempt to create a new group!")
          }
        }
      );


  }

  render() {
    return (
        <div className="container-fluid top-buffer">
            <h2>New online group</h2><br />

              <div className="panel panel-primary">
                <div className="panel-heading">Group Info</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="select1" >Grooup languge</label>
                      <select value={this.state.grpupLanguage} onChange={this.updateLanguage} className="form-control">
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Italian">Italian</option>
                        <option value="Spanish">Spanish</option>
                        <option value="German">German</option>
                        <option value="Dutch">Dutch</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Russian">Russian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Indonesian">Indonesian</option>
                      </select>
                    </div>
                  </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-heading">Group Leader</div>
                  <div className="panel-body">
                      <div className="form-group col-xs-3">
                        <label>First name</label>
                        <input type="text" className="form-control" placeholder="First name" ref="group_leader_first_name" />
                      </div>
                      <div className="form-group col-xs-3">
                        <label>Last name</label>
                        <input type="text" className="form-control" placeholder="Last name" ref="group_leader_second_name" />
                      </div>
                      <div className="form-group col-xs-4">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder="Email" ref="group_leader_email" />
                      </div>
                      <div className="form-group col-xs-2">
                        <label>Phone</label>
                        <input type="text" className="form-control" placeholder="Phone" ref="group_leader_phone" />
                      </div>
                      <div className="form-group col-xs-3">
                        <label>Country</label>
                        <CountryDropdown
                          value={this.state.country}
                          classes='countryDropDown'
                          defaultOptionLabel = 'select country'
                          onChange={(val) => this.updateCountry(val)}
                        />
                      </div>
                  </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-heading">Group Meeting Time</div>
                  <div className="panel-body">
                      <div className="form-group col-xs-2">
                        <label htmlFor="select1" >Day of week</label>
                        <select value={this.state.meetDay} onChange={this.updateMeetDay} className="form-control">
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </div>
                      <div className="form-group col-xs-2">
                        <label>Time</label>
                        <TimePicker
                          showSecond={false}
                          defaultValue={now}
                          className="timePicker"
                          onChange={this.updateMeetTime}
                          format={format}
                          minuteStep={15}
                          use12Hours
                          inputReadOnly
                        />
                      </div>
                  </div>
              </div>
              <div className="panel panel-danger">
                <div className="panel-heading">Group Meeting Time</div>
                  <div className="panel-body">
                      <div className="form-group">
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" ref="useOwnMeetingRes" value="" />
                            We are going to use our own live meeting service (Hangouts, Zoom, Webex...)
                          </label>
                        </div>
                      </div>
                  </div>
              </div>



              <div className="text-danger">{this.state.error}</div>
              <button
                className="btn btn-primary"
                onClick={this.onSaveClick.bind(this)}
                >
                Submit Group
              </button>

            <Alert stack={{limit: 3}} />

        </div>
    )
  }
}

//export default SessionsCreate;

export default createContainer(() => {
  Meteor.subscribe('group');
  return { group: Groups.find({}).fetch() };
}, GroupCreate);

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { CountryDropdown } from 'react-country-region-selector';
import { Groups } from '../../../imports/collections/groups';
import moment from 'moment-timezone';
import TimePicker from 'rc-time-picker';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Group from '../../../imports/classes/Group';
import Select from 'react-select';
import { ValidationError } from 'meteor/jagi:astronomy';

const format = 'h:mm a';

const allTimeZones = [];

var validUrl = require('valid-url');

$.each(moment.tz.names(), function() {
    allTimeZones.push({value: this, label: this });
});

const now = moment().hour(0).minute(0);

class GroupCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      country: '',
      grpupLanguage: 'English',
      meetDay: 'Monday',
      meetTime: '',
      timeZone: ''
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateMeetDay = this.updateMeetDay.bind(this);
    this.updateMeetTime = this.updateMeetTime.bind(this);
    this.updateTimeZone = this.updateTimeZone.bind(this);
  }

  componentWillMount() {

    //  console.log("TIME ZONES: ", moment.tz.names() );
    console.log("TIME ZONE GUESS: ", moment.tz.guess());

    if(!(Roles.userIsInRole(Meteor.user(), ['admin', 'nationalresp']))) {
      console.log("USER ", Meteor.user());
      return browserHistory.push('/');
    };

    this.setState({ timeZone: moment.tz.guess() });
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

  updateTimeZone = (selectedOption) => {

    let timeZoneString = '';

    if(!(_.isUndefined(selectedOption))) {

      for (let x = 0; x < selectedOption.value.length; x++){
           timeZoneString += selectedOption.value[x];
           //console.log("RESULT: ", testVal);
      }
    }

    this.setState({ selectedOption });
    this.setState({ timeZone: timeZoneString });
  }

  updateCountry(val) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ country: val });
  }

  onSaveClick() {
    const allAdmins = Roles.getUsersInRole('admin', Roles.GLOBAL_GROUP);

    if (this.refs.group_detail_url.value !== '' && !validUrl.isUri(this.refs.group_detail_url.value)) {
      bootbox.alert({
        title: "Not a valid URL!",
        message: "The 'URL to Detail Page' field has to be a valid URL (like 'http://google.com')"
      });
      return;
    }

    if (this.refs.group_detail_url.value !== '' && this.refs.group_detail_text.value == ''){
      bootbox.alert({
        title: "No detail text provided",
        message: "If you enter an Detail Page URL, you must also provide a Group Detail text"
      });
      return;
    }

    const gp_detail = {
      detail_text: this.refs.group_detail_text.value,
      detail_url: this.refs.group_detail_url.value
    }

    const gp_leader = {
      first_name: this.refs.group_leader_first_name.value,
      last_name: this.refs.group_leader_second_name.value,
      country: this.state.country,
      phone: this.refs.group_leader_phone.value,
      email: this.refs.group_leader_email.value
    }

    const meet_time = {
      day_of_week: this.state.meetDay,
      meet_time: this.state.meetTime,
      time_zone: this.state.timeZone
    }

    const noNeedToApprove = Roles.userIsInRole(Meteor.user(), ['admin']) || this.refs.useOwnMeetingRes.checked;
    console.log("TO BE APPROVED: ", noNeedToApprove);

    var newGroup = new Group();
    newGroup.insert(
      this.state.grpupLanguage,
      gp_detail,
      this.refs.useOwnMeetingRes.checked,
      gp_leader,
      meet_time,
      noNeedToApprove,
      (err, result) => {
        if(result){
          console.log("GROUP RESULT: ", result);
          if(noNeedToApprove){
            const newLeaderUserData = {
             username: gp_leader.first_name,
             email: gp_leader.email,
             //password: leaderPassword,
             roles: ['groupleader'],
             groupId: result,
             country: this.state.country
            };

            Meteor.call('mcheckUserExistence', newLeaderUserData.email, (error, res) => {
              if (res) {
                if(res === "exist"){
                  Meteor.call('mAddAnotherLeadershipToUser', newLeaderUserData, (error, res) => {
                    if (res) {
                      console.log("FURTHER LEADERSHIP RESULT: ", res);
                    }else if(err) {
                      console.log("FURTHER LEADERSHIP ERROR: ", err);
                    }
                  });
                }else{
                  Meteor.call('mCreateGroupLeader', newLeaderUserData, (error, res) => {
                    if (res) {
                      console.log("GROUP LEADER CREATION RESULT: ", res);
                    }else if(err) {
                      console.log("GROUP LEADER CREATION ERROR: ", err);
                    }
                  });
                }
              }else if(err) {
                console.log("GROUP LEADER EXISTENCE CHECK ERROR: ", err);
              }
            })

            Meteor.call( // Notify the group leader
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              gp_leader.email,
              'WCCM Online Meditation Groups - Group Leader Role Assignment',
              '<p>Dear '+gp_leader.first_name+'</p><h4>You have been assigned to be the Group Leader of an Online Meditation Group</h4><ul><li>Group Language: '+this.state.grpupLanguage+'</li><li>Group Meeting Day and Time: '+this.state.meetDay+ ' at '+this.state.meetTime+'</li></ul><p>In another email you should have received the link to set your password, once done so you will be able to login on the Online Meditation Group platform at https://www.onlinemeditationwccm.org and manage the groups you are leader of.</p><p>For any help you might need please write to leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            Meteor.call( // Notify the National Resp that submitted the group
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              Meteor.user().emails[0].address,
              'WCCM Online Meditation Groups - New Group Created!',
              '<p>Dear '+Meteor.user().username+'</p><h4>You succesfully created a new online group that is now listed in the public directory</h4><ul><li>Group Language: '+this.state.grpupLanguage+'</li><li>Group Meeting Day and Time: '+this.state.meetDay+ ' at '+this.state.meetTime+'</li></ul><p>The new group is now visible on the public group listing page: https://www.onlinemeditationwccm.org</p><p>The person you assigned to lead the group, <b>'+gp_leader.first_name+' '+gp_leader.last_name+'</b>, has received an email that notifies him/her of his group role and another one to complete the account creation that will be needed to manage the communications with the group members</p><p>For any help you might need please write to leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            bootbox.alert({
              title: "Group Creation Complete",
              message: "You succesfully created a new online group that is now listed in the public directory. The Group Leader will also receive the link to create an account that will permit access to the system and group's users management.",
              callback: function(){ return browserHistory.push('/'); }
            })

          }else {

            Meteor.call( // Notify the Logged in User that created the group
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              Meteor.user().emails[0].address,
              'WCCM Online Meditation Groups - New Group Submission',
              '<h4>Your Group request submission has been received</h4><p>As soon as one of the sfaff administrator will review and approve your submission you will receive a notification by email</p><p>For any help you might need please write to leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            allAdmins.forEach(admin => { // Notify all the SuperAdmins
              console.log("ALLUS", admin.emails[0].address);
              Meteor.call(
                'sendEmail',
                'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
                admin.emails[0].address,
                'WCCM Online Meditation Groups - New Group Pending Approval',
                '<h4>A new group creation request has been submitted</h4><p>Please login wth your administrative credentials and review this submission in order to approve or reject it</p><p><em>The WCCM Online Mediation Groups Automatic Notification Bot</em></p>'
              );
            });

            bootbox.alert({
              title: "New group submitted succesfully",
              message: "Your group will be reviewed by our staff for approvation and public listing. You will be notified by email about the approval progress",
              callback: function(){ browserHistory.push('/'); }
            })
          }

        }else {
          Alert.error(err.message, {
            position: 'top-left',
            effect: 'slide',
            timeout: 3000,
            offset: 20
          });
        }
      }
    );


  }

  render() {

    return (
        <div className="container-fluid top-buffer">
            <h2>New Group</h2><br />

              <div className="panel panel-primary">
                <div className="panel-heading">Group Info</div>
                  <div className="panel-body">
                    <div className="form-group col-md-4">
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
                    <div className="form-group col-md-4">
                      <label>Group Detail</label>
                      <input type="text" className="form-control" placeholder="Group Detail" ref="group_detail_text" />
                    </div>
                    <div className="form-group col-md-4">
                      <label>URL to Detail Page</label>
                      <input type="text" className="form-control" placeholder="Detail URL" ref="group_detail_url" />
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
                      <div className="form-group col-xs-2">
                        <label htmlFor="timeZonesSelect" >Time Zone</label>
                        <Select defaultValue={{ value: this.state.timeZone, label: this.state.timeZone }} onChange={this.updateTimeZone} options={allTimeZones} />
                      </div>
                  </div>
              </div>
              <div className="panel panel-danger">
                <div className="panel-heading">Online Meeting Service Option</div>
                  <div className="panel-body">
                      <div className="form-group">
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" ref="useOwnMeetingRes" value="" />
                            We will use our own live meeting service (Hangouts, Zoom, Webex...)
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

export default createContainer(() => {
  Meteor.subscribe('allUsers');
  Meteor.subscribe('group');
  return { group: Groups.find({}).fetch(), currentUser: Meteor.user() || {}, allUsers: Meteor.users.find({}).fetch(), };
}, GroupCreate);

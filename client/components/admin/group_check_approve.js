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
import Select from 'react-select';
import Group from '../../../imports/classes/Group';
import { translate, Trans } from 'react-i18next';

const format = 'h:mm a';

const now = moment().hour(0).minute(0);

const allTimeZones = [];

var validUrl = require('valid-url');

$.each(moment.tz.names(), function() {
    allTimeZones.push({value: this, label: this });
});

class CheckAndApproveGroup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      country: '',
      groupLanguage: '',
      meetDay: '',
      meetTime: moment(),
      selectedOption: null,
      requiresMeetingLink: false,
      timeZone: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateMeetDay = this.updateMeetDay.bind(this);
    this.updateMeetTime = this.updateMeetTime.bind(this);
    this.manageMeetingUrlDisplay = this.manageMeetingUrlDisplay.bind(this);
  }

  updateLanguage(e) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ groupLanguage: e.target.value });
  }

  updateMeetDay(e) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ meetDay: e.target.value });
  }

  updateMeetTime(val) {
    //console.log('NEW VALUE ', newValue);
    //console.log(val && val.format('HH:mm:ss'));
    this.setState({ meetTime: val });
  }

  updateCountry(val) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ country: val });
  }

  manageMeetingUrlDisplay(){
    
    this.setState({ requiresMeetingLink: this.refs.useOwnMeetingRes.checked });

    if (this.refs.useOwnMeetingRes.checked) {
      $("#meetingUrl").show();
    } else {
      $("#meetingUrl").hide();
    }
    
    this.setState({ requiresMeetingLink: this.refs.useOwnMeetingRes.checked });
  }

  updateGroup() {

    var newGroup = new Group(this.props.groups);

    const utenti = this.props.allUsers;

    const groupSubmitter = _.find(utenti, { '_id': newGroup.ownerId });

    console.log("---- ", this.refs.group_detail_url.value);
    console.log("---- ", this.refs.group_detail_url.value !== '');
    console.log("---- ", this.refs.group_detail_url.value !== null);

    if ((this.refs.group_detail_url.value !== '') && !validUrl.isUri(this.refs.group_detail_url.value)) {
      bootbox.alert({
        title: "Not a valid URL!",
        message: "The 'URL to Detail Page' field has to be a valid URL (like 'http://google.com')"
      });
      return;
    }

    if ((this.refs.group_detail_url.value !== '') && this.refs.group_detail_text.value == ''){
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
      meet_time: this.state.meetTime.format(format),
        time_zone: this.state.timeZone
    }

    newGroup.update(this.props.groups,
      {
        group_language: this.state.groupLanguage,
        group_detail: gp_detail,
        use_own_meeting_resources: !this.refs.useOwnMeetingRes.checked,
        group_leader: gp_leader,
        meet_time: meet_time,
        approved: true,
      },
      (err, result) => {
        if(result) {
          const newLeaderUserData = {
           username: this.refs.group_leader_first_name.value,
           email: this.refs.group_leader_email.value,
           //password: leaderPassword,
           roles: ['groupleader'],
           groupId: this.props.groups._id,
           country: this.state.country
          };

          Meteor.call('mcheckUserExistence', newLeaderUserData.email, (error, res) => {
            if (res) {
              if(res === "exist"){
                console.log("$$$ EXIST $$$");
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

          const infoAboutMeetingLink = (this.state.requiresMeetingLink)?'<p>This is the URL link you will use to start the online meetings: <b>'+this.refs.group_meeting_url.value+'</b> please note it down in a safe place.':'';

          Meteor.call( // Notify the group leader -- EDITED AND TRANSLATED
            'sendEmail',
            'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
            gp_leader.email,
            this.props.i18n.t('WCCM Online Meditation Groups - Group Leader Role Assignment'),
            '<p>'+ this.props.i18n.t('Dear') + ' '+this.props.i18n.t(gp_leader.first_name)+'</p><h4>'+this.props.i18n.t('You are now the Group Leader of an Online Meditation Group')+' </h4><ul><li>'+this.props.i18n.t('Group language')+': '+this.props.i18n.t(this.state.grpupLanguage)+'</li><li>'+this.props.i18n.t('Group Meeting Day and Time')+': '+this.props.i18n.t(this.state.meetDay)+ ' at '+this.state.meetTime.format(format)+'</li></ul><p>'+this.props.i18n.t('A separate notification will be sent to you. Please follow the link in that notification to set up your password that will allow you access to  the Online Meditation Group platform.  Once in the platform you will be able to manage your group communications')+'</p>'+infoAboutMeetingLink+'<p>'+this.props.i18n.t('If you need further assistance please get in touch with Leo at')+' leonardo@wccm.org</p><p><em>'+this.props.i18n.t('The WCCM Online Meditation Groups Staff')+'</em></p>',

            (err, result) => {
              console.log("ERR: ", err, 'RESULT: ', result);
            }
          );

          Meteor.call( // Notify the National Resp that submitted the group -- EDITED
            'sendEmail',
            'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
            groupSubmitter.emails[0].address,
            'WCCM Online Meditation Groups - Group submission accepted!',
            '<p>Dear '+groupSubmitter.username+'</p><h4>Your Group request submission has been approved!</h4><ul><li>Group Language: '+this.state.groupLanguage+'</li><li>Group Meeting Day and Time: '+this.state.meetDay+ ' at '+this.state.meetTime.format(format)+'</li></ul><p>This new group is now on our public group listing page: https://www.onlinemeditationwccm.org</p><p>The person you have assigned to lead the group, <b>'+gp_leader.first_name+' '+gp_leader.last_name+'</b>, has been sent a group role notification and will need  to complete the account creation process in order to manage communications with group members.</p><p>For any help you might need please contact leonardo@wccm.org</p><p><em>The WCCM Online Meditation Groups Staff</em></p>',

            (err, result) => {
              console.log("ERR: ", err, 'RESULT: ', result);
            }
          );

          bootbox.alert({ // Group creation confirmation message -- EDITED AND TRANSLATED
            title: this.props.i18n.t("Your group is now set up"),
            message: this.props.i18n.t("The group is listed in the WCCM directory at WCCM.org as following our guidelines. The Group Leader will soon receive a sign-in link which allows access to the system under your supervision"),
            callback: function(){ return browserHistory.push('/'); }
          });
        }
      }
    );
  }

  confirmDelete(){
    const presentGroup = this.props.groups;
    bootbox.confirm({
        message: "Are you sure you want to delete this group?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result){
              console.log("GROUPS NELLA DIALOG: ", presentGroup);
              var newGroup = new Group(presentGroup);
              newGroup.delete(newGroup);
              return browserHistory.push('/');
            };
        }
    });
  }

  updateTimeZone = (selectedOption) => {

    let timeZoneString = '';

    for (let x = 0; x < selectedOption.value.length; x++){
         timeZoneString += selectedOption.value[x];
         //console.log("RESULT: ", testVal);
    }

    this.setState({ selectedOption });
    this.setState({ timeZone: timeZoneString });
  }

  componentWillMount() {
    if(_.isUndefined(this.props.groups)){
      return browserHistory.push('/');
    };

    const meetTime = this.props.groups.meet_time.meet_time;

    let mockdate = '2016-10-01';

    var dateTime = moment(mockdate + ' ' + meetTime, 'DD/MM/YYYY HH:mm');

    let dateStr = moment(),
    timeStr = meetTime,
    date    = moment(dateStr),
    time    = moment(timeStr, 'h:mm a');

    date.set({
        hour:   time.get('hour'),
        minute: time.get('minute')
    });

    this.setState({ meetTime: date });
    this.setState({ timeZone: this.props.groups.meet_time.time_zone });
    this.setState({ groupLanguage: this.props.groups.group_language });
    this.setState({ meetDay: this.props.groups.meet_time.day_of_week });
    this.setState({ country: this.props.groups.group_leader.country });

  };

  renderLink() {
    if(!this.props.groups.use_own_meeting_resources || this.state.requiresMeetingLink ){
      return(
        <div id="meetingUrl" className="form-group col-xs-3">
          <input type="text" className="form-control" placeholder="Enter here the meeting room link for this group" ref="group_meeting_url" />
        </div>
      );
    }
  }

  render() {

    if(_.isUndefined(this.props.groups)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return <div>Updating...</div>;
    };

    console.log("GROUP : ",this.state.requiresMeetingLink);

    const groupDetail = this.props.groups.group_detail;
    const dateCreated = this.props.groups.date_created;
    const groupLanguage = this.props.groups.group_language;
    const ownResources = this.props.groups.use_own_meeting_resources?"":"checked";
    const groupLeader = this.props.groups.group_leader;

    return (

          <div className="container-fluid top-buffer">
              <h2>Review Group Submissions</h2><br />

                <div className="panel panel-danger">
                  <div className="panel-heading">Group Info</div>
                    <div className="panel-body">
                      <div className="form-group col-md-4">
                        <label htmlFor="select1" >Group language</label>
                        <select value={this.state.groupLanguage} onChange={this.updateLanguage} className="form-control">
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="Italian">Italian</option>
                          <option value="Spanish">Spanish</option>
                          <option value="German">German</option>
                          <option value="Dutch">Dutch</option>
                          <option value="Portuguese">Portuguese</option>
                          <option value="Danish">Danish</option>
                          <option value="Russian">Russian</option>
                          <option value="Chinese">Chinese</option>
                          <option value="Indonesian">Indonesian</option>
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label>Group Detail</label>
                        <input type="text" className="form-control" placeholder="Group Detail" ref="group_detail_text" defaultValue={groupDetail&&groupDetail.detail_text} />
                      </div>
                      <div className="form-group col-md-4">
                        <label>URL to Detail Page</label>
                        <input type="text" className="form-control" placeholder="Detail URL" ref="group_detail_url" defaultValue={groupDetail&&groupDetail.detail_url} />
                      </div>
                    </div>
                </div>
                <div className="panel panel-danger">
                  <div className="panel-heading">Group Leader</div>
                    <div className="panel-body">
                        <div className="form-group col-xs-3">
                          <label>First name</label>
                          <input type="text" className="form-control" disabled placeholder="First name" ref="group_leader_first_name" defaultValue={groupLeader.first_name} />
                        </div>
                        <div className="form-group col-xs-3">
                          <label>Last name</label>
                          <input type="text" className="form-control" disabled placeholder="Last name" ref="group_leader_second_name" defaultValue={groupLeader.last_name} />
                        </div>
                        <div className="form-group col-xs-4">
                          <label>Email</label>
                          <input type="text" className="form-control" disabled placeholder="Email" ref="group_leader_email" defaultValue={groupLeader.email} />
                        </div>
                        <div className="form-group col-xs-2">
                          <label>Phone</label>
                          <input type="text" className="form-control" disabled placeholder="Phone" ref="group_leader_phone" defaultValue={groupLeader.phone} />
                        </div>
                        <div className="form-group col-xs-3">
                          <label>Country</label>
                          <CountryDropdown
                            disabled
                            value={this.state.country}
                            classes='countryDropDown'
                            defaultOptionLabel = 'select country'
                            onChange={(val) => this.updateCountry(val)}
                          />
                        </div>
                    </div>
                </div>
                <div className="panel panel-danger">
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
                            defaultValue={this.state.meetTime}
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
                          <Select onChange={this.updateTimeZone} options={allTimeZones} defaultValue={{ value: this.state.timeZone, label: this.state.timeZone }} />
                        </div>
                    </div>
                </div>
                <div className="panel panel-danger">
                  <div className="panel-heading">Online Meeting Service Option</div>
                    <div className="panel-body">
                        <div className="form-group">
                          <div className="checkbox">
                            <label>
                              <input type="checkbox" onChange={this.manageMeetingUrlDisplay} ref="useOwnMeetingRes" value="" defaultChecked={ownResources} />
                              This group needs to receive a link to a meeting room
                            </label>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="text-danger">{this.state.error}</div>
                {this.renderLink()}
                <button
                  className="btn btn-primary"
                  onClick={this.updateGroup.bind(this)}
                >
                  Confirm registration
                </button>
              <Alert stack={{limit: 3}} />
          </div>
    )
  }
}

export default createContainer((props) => {
  const { groupId } = props.params;
  Meteor.subscribe('groupsToApprove');
  Meteor.subscribe('allUsers');

  return { groups: Groups.findOne(groupId), allUsers: Meteor.users.find({}).fetch() };
}, translate('translations')(CheckAndApproveGroup));

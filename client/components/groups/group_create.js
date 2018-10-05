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
import { translate, Trans } from 'react-i18next';

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

    const noNeedToApprove = Roles.userIsInRole(Meteor.user(), ['admin']) || !this.refs.useOwnMeetingRes.checked;
    console.log("noNeedToApprove: ", noNeedToApprove);

    var newGroup = new Group();
    newGroup.insert(
      this.state.grpupLanguage,
      gp_detail,
      !this.refs.useOwnMeetingRes.checked,
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

            Meteor.call( // Notify the group leader -- EDITED AND TRANSLATED
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              gp_leader.email,
              this.props.i18n.t('WCCM Online Meditation Groups - Group Leader Role Assignment'),
              '<p>'+ this.props.i18n.t('Dear') + ' '+this.props.i18n.t(gp_leader.first_name)+'</p><h4>'+this.props.i18n.t('You are now the Group Leader of an Online Meditation Group')+' </h4><ul><li>'+this.props.i18n.t('Group language')+': '+this.props.i18n.t(this.state.grpupLanguage)+'</li><li>'+this.props.i18n.t('Group Meeting Day and Time')+': '+this.props.i18n.t(this.state.meetDay)+ ' at '+this.state.meetTime+'</li></ul><p>'+this.props.i18n.t('A separate notification will be sent to you. Please follow the link in that notification to set up your password that will allow you access to  the Online Meditation Group platform.  Once in the platform you will be able to manage your group communications')+'</p><p>'+this.props.i18n.t('If you need further assistance please get in touch with Leo at')+' leonardo@wccm.org</p><p><em>'+this.props.i18n.t('The WCCM Online Mediation Groups Staff')+'</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            Meteor.call( // Notify the National Resp that submitted the group -- EDITED
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              Meteor.user().emails[0].address,
              'WCCM Online Meditation Groups - New Group Created!',
              '<p>Dear '+Meteor.user().username+'</p><h4>You have successfully created a new online group which  is now listed in the public WCCM Online Directory.</h4><ul><li>Group Language: '+this.state.grpupLanguage+'</li><li>Group Meeting Day and Time: '+this.state.meetDay+ ' at '+this.state.meetTime+'</li></ul><p>This group is now visible on: https://www.onlinemeditationwccm.org</p><p>The new group leader, <b>'+gp_leader.first_name+' '+gp_leader.last_name+'</b>, will receive a notification to complete the account creation process. Once the details are submitted, the new group leader will be able to manage communications with group members.</p><p>If you have any questions,please contact leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            bootbox.alert({ // Group creation confirmation message -- EDITED AND TRANSLATED
              title: this.props.i18n.t("Your group is now set up"),
              message: this.props.i18n.t("The group is listed in the WCCM directory at WCCM.org as following our guidelines. The Group Leader will soon receive a sign-in link which allows access to the system under your supervision"),
              callback: function(){ return browserHistory.push('/'); }
            });

          }else {

            Meteor.call( // Notify the Logged in User that created the group -- EDITED
              'sendEmail',
              'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
              Meteor.user().emails[0].address,
              'WCCM Online Meditation Groups - New Group Submission',
              '<h4>Your Group Creation Request is being processed</h4><p>You will receive a notification by email regarding the status of your submission.</p><p>For any help you might need please contact leonardo@wccm.org</p><p><em>The WCCM Online Mediation Groups Staff</em></p>',

              (err, result) => {
                console.log("ERR: ", err, 'RESULT: ', result);
              }
            );

            allAdmins.forEach(admin => { // Notify all the SuperAdmins -- EDITED
              console.log("ALLUS", admin.emails[0].address);
              Meteor.call(
                'sendEmail',
                'WCCM-NOREPLY Online Meditation Groups <admin@wccm.org>',
                admin.emails[0].address,
                'WCCM Online Meditation Groups - New Group Pending Approval',
                '<h4>A Group Creation Request is waiting for your approval</h4><p>Enter your login credentials to access your https://www.onlinemeditationwccm.org dashboard and manage this request.</p><p><em>The WCCM Online Mediation Groups Automatic Notification</em></p>'
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
    const t = this.props.t;
    const checkDisabled = !Roles.userIsInRole(Meteor.user(), ['admin']);

    return (
        <div className="container-fluid top-buffer">
            <h2>{t('New Group')}</h2><br />

              <div className="panel panel-primary">
                <div className="panel-heading">{t('Group Info')}</div>
                  <div className="panel-body">
                    <div className="form-group col-md-4">
                      <label htmlFor="select1" >{t('Group language')}</label>
                      <select value={this.state.grpupLanguage} onChange={this.updateLanguage} className="form-control">
                        <option value="English">{t('English')}</option>
                        <option value="French">{t('French')}</option>
                        <option value="Italian">{t('Italian')}</option>
                        <option value="Spanish">{t('Spanish')}</option>
                        <option value="German">{t('German')}</option>
                        <option value="Dutch">{t('Dutch')}</option>
                        <option value="Portuguese">{t('Portuguese')}</option>
                        <option value="Danish">{t('Danish')}</option>
                        <option value="Russian">{t('Russian')}</option>
                        <option value="Chinese">{t('Chinese')}</option>
                        <option value="Indonesian">{t('Indonesian')}</option>
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label>{t('Group Detail')}</label>
                      <input type="text" className="form-control" disabled={checkDisabled} placeholder={t('Group Detail')} ref="group_detail_text" />
                    </div>
                    <div className="form-group col-md-4">
                      <label>{t('URL to Detail Page')}</label>
                      <input type="text" className="form-control" disabled={checkDisabled} placeholder={t('URL to Detail Page')} ref="group_detail_url" />
                    </div>
                  </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-heading">{t('Group Leader')}</div>
                  <div className="panel-body">
                      <div className="form-group col-xs-3">
                        <label>{t('First name')}</label>
                        <input type="text" className="form-control" placeholder={t('First name')} ref="group_leader_first_name" />
                      </div>
                      <div className="form-group col-xs-3">
                        <label>{t('Last name')}</label>
                        <input type="text" className="form-control" placeholder={t('Last name')} ref="group_leader_second_name" />
                      </div>
                      <div className="form-group col-xs-4">
                        <label>{t('Email')}</label>
                        <input type="text" className="form-control" placeholder={t('Email')} ref="group_leader_email" />
                      </div>
                      <div className="form-group col-xs-2">
                        <label>{t('Phone')}</label>
                        <input type="text" className="form-control" placeholder={t('Phone')} ref="group_leader_phone" />
                      </div>
                      <div className="form-group col-xs-3">
                        <label>{t('Country')}</label>
                        <CountryDropdown
                          value={this.props.i18n.t(this.state.country)}
                          classes='countryDropDown'
                          defaultOptionLabel = {t('select country')}
                          onChange={(val) => this.updateCountry(val)}
                        />
                      </div>
                  </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-heading">{t('Group Meeting Time')}</div>
                  <div className="panel-body">
                      <div className="form-group col-xs-2">
                        <label htmlFor="select1" >{t('Day of week')}</label>
                        <select value={this.state.meetDay} onChange={this.updateMeetDay} className="form-control">
                          <option value="Monday">{t('Monday')}</option>
                          <option value="Tuesday">{t('Tuesday')}</option>
                          <option value="Wednesday">{t('Wednesday')}</option>
                          <option value="Thursday">{t('Thursday')}</option>
                          <option value="Friday">{t('Friday')}</option>
                          <option value="Saturday">{t('Saturday')}</option>
                          <option value="Sunday">{t('Sunday')}</option>
                        </select>
                      </div>
                      <div className="form-group col-xs-2">
                        <label>{t('Time')}</label>
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
                        <label htmlFor="timeZonesSelect" >{t('Time Zone')}</label>
                        <Select defaultValue={{ value: this.state.timeZone, label: this.state.timeZone }} onChange={this.updateTimeZone} options={allTimeZones} />
                      </div>
                  </div>
              </div>
              <div className="panel panel-danger">
                <div className="panel-heading">{t('Online Meeting Service Option')}</div>
                  <div className="panel-body">
                      <div className="form-group">
                        <div className="checkbox">
                          <label>
                            <input type="checkbox" ref="useOwnMeetingRes" value="" />
                            {t('This group needs to receive a link to a meeting room')}
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
                {t('Submit Group')}
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
}, translate('translations')(GroupCreate));

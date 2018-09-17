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

$.each(moment.tz.names(), function() {
    allTimeZones.push({value: this, label: this });
});

class GroupEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      country: '',
      groupLanguage: '',
      meetDay: '',
      meetTime: moment(),
      selectedOption: null,
      timeZone: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateMeetDay = this.updateMeetDay.bind(this);
    this.updateMeetTime = this.updateMeetTime.bind(this);
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

  updateGroup() {
  
    let requireNewApproval = false;

    if(this.props.groups.meet_time.time_zone !== this.state.timeZone || this.props.groups.meet_time.day_of_week !== this.state.meetDay || this.props.groups.meet_time.meet_time !== this.state.meetTime.format(format) ) {
      
      if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
        requireNewApproval = true;
      };
    }


    var newGroup = new Group(this.props.groups);

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

    if (this.props.groups.group_leader.email !== this.refs.group_leader_email.value) {
      bootbox.confirm({
        message: "Confirm the creation of a new Group Leader for this group and the removal of the old one?",
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
        callback: (result) => {
          if(result){
            
            newGroup.update(this.props.groups,
              {
                group_language: this.state.groupLanguage,
                group_detail: gp_detail,
                use_own_meeting_resources: !this.refs.useOwnMeetingRes.checked,
                group_leader: gp_leader,
                meet_time: meet_time,
                approved: !requireNewApproval
              },
              (err, result) => {
                if (result) {
                  if(Roles.userIsInRole(Meteor.user(), ['admin']) || !requireNewApproval) {
                    bootbox.alert({
                      title: "Groups changes saved",
                      message: "Group changes saved successfully",
                      callback: function(){ browserHistory.push('/'); }
                    })
                  }else{
                    bootbox.alert({
                      title: "Groups changes saved",
                      message: "Your group will be reviewed by our staff for approvation and public listing. You will be notified by email about the approval progress",
                      callback: function(){ browserHistory.push('/'); }
                    })
                  }
                  
                  const newLeaderUserData = {
                    username: gp_leader.first_name,
                    email: gp_leader.email,
                    roles: ['groupleader'],
                    groupId: this.props.groups._id,
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
                    newLeaderUserData.email,
                    this.props.i18n.t('WCCM Online Meditation Groups - Group Leader Role Assignment'),
                    '<p>'+ this.props.i18n.t('Dear') + ' '+this.props.i18n.t(newLeaderUserData.username)+'</p><h4>'+this.props.i18n.t('You are now the Group Leader of an Online Meditation Group')+' </h4><ul><li>'+this.props.i18n.t('Group language')+': '+this.props.i18n.t(this.state.grpupLanguage)+'</li><li>'+this.props.i18n.t('Group Meeting Day and Time')+': '+this.props.i18n.t(this.state.meetDay)+ ' at '+this.state.meetTime+'</li></ul><p>'+this.props.i18n.t('A separate notification will be sent to you. Please follow the link in that notification to set up your password that will allow you access to  the Online Meditation Group platform.  Once in the platform you will be able to manage your group communications')+'</p><p>'+this.props.i18n.t('If you need further assistance please get in touch with Leo at')+' leonardo@wccm.org</p><p><em>'+this.props.i18n.t('The WCCM Online Mediation Groups Staff')+'</em></p>',
        
                    (err, result) => {
                      console.log("ERR: ", err, 'RESULT: ', result);
                    }
                  );
                  
        
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
        }
      });
    } else {
      newGroup.update(this.props.groups,
        {
          group_language: this.state.groupLanguage,
          group_detail: gp_detail,
          use_own_meeting_resources: !this.refs.useOwnMeetingRes.checked,
          group_leader: gp_leader,
          meet_time: meet_time,
          approved: !requireNewApproval
        },
        (err, result) => {
          if (result) {
            if(Roles.userIsInRole(Meteor.user(), ['admin']) || !requireNewApproval) {
              bootbox.alert({
                title: "Groups changes saved",
                message: "Group changes saved successfully",
                callback: function(){ browserHistory.push('/'); }
              })
            }else{
              bootbox.alert({
                title: "Groups changes saved",
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
 
  renderDeleteButton() {
    if(Roles.userIsInRole(Meteor.user(), ['admin']) || Meteor.user()._id == this.props.groups.ownerId) {
      return(
        <button
          className="btn btn-warning"
          onClick={this.confirmDelete.bind(this)}
          >
          Delete Group
        </button>
      )
    }
    return;
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

  componentWillMount() {


    if(_.isUndefined(this.props.groups)){
      console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return browserHistory.push('/');
    };
    const meetTime = this.props.groups.meet_time.meet_time;

    let mockdate = '2016-10-01';

    var dateTime = moment(mockdate + ' ' + meetTime, 'DD/MM/YYYY HH:mm');

    let dateStr = moment(),
    date    = moment(dateStr),
    time    = moment(meetTime, 'h:mm a');

    date.set({
        hour:   time.get('hour'),
        minute: time.get('minute')
    });

    this.setState({ meetTime: date });
    this.setState({ timeZone: this.props.groups.meet_time.time_zone });
    this.setState({ groupLanguage: this.props.groups.group_language });
    this.setState({ meetDay: this.props.groups.meet_time.day_of_week });
    this.setState({ country: this.props.groups.group_leader.country });



  }

  render() {

    if(_.isUndefined(this.props.groups)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return <div>Updating...</div>;
    };

    console.log("GROUP : ",this.props);

    const groupDetail = this.props.groups.group_detail;
    const dateCreated = this.props.groups.date_created;
    const groupLanguage = this.props.groups.group_language;
    const ownResources = this.props.groups.use_own_meeting_resources?"":"checked";
    const groupLeader = this.props.groups.group_leader;
    const checkDisabled = !Roles.userIsInRole(Meteor.user(), ['admin']);

    return (

          <div className="container-fluid top-buffer">
              <h2>Edit Group</h2><br />

                <div className="panel panel-primary">
                  <div className="panel-heading">Group Info</div>
                    <div className="panel-body">
                      <div className="form-group col-md-4">
                        <label htmlFor="select1" >Grooup languge</label>
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
                        <input type="text" className="form-control" disabled={checkDisabled} placeholder="Group Detail" ref="group_detail_text" defaultValue={groupDetail&&groupDetail.detail_text} />
                      </div>
                      <div className="form-group col-md-4">
                        <label>URL to Detail Page</label>
                        <input type="text" className="form-control" disabled={checkDisabled} placeholder="Detail URL" ref="group_detail_url" defaultValue={groupDetail&&groupDetail.detail_url} />
                      </div>
                    </div>
                </div>
                <div className="panel panel-primary">
                  <div className="panel-heading">Group Leader</div>
                    <div className="panel-body">
                      <div className="row">
                        <div className="form-group col-xs-3">
                          <label>First name</label>
                          <input type="text" className="form-control" placeholder="First name" ref="group_leader_first_name" defaultValue={groupLeader.first_name} />
                        </div>
                        <div className="form-group col-xs-3">
                          <label>Last name</label>
                          <input type="text" className="form-control" placeholder="Last name" ref="group_leader_second_name" defaultValue={groupLeader.last_name} />
                        </div>
                        <div className="form-group col-xs-4">
                          <label>Email</label>
                          <input type="text" className="form-control" placeholder="Email" ref="group_leader_email" defaultValue={groupLeader.email} />
                        </div>
                        <div className="form-group col-xs-2">
                          <label>Phone</label>
                          <input type="text" className="form-control" placeholder="Phone" ref="group_leader_phone" defaultValue={groupLeader.phone} />
                        </div>
                      </div>
                      <div className="row">
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
                              <input type="checkbox" disabled={checkDisabled} ref="useOwnMeetingRes" value="" defaultChecked={ownResources} />
                              This group needs to receive a link to a meeting room
                            </label>
                          </div>
                        </div>
                    </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={this.updateGroup.bind(this)}
                  >
                  Update Group
                </button>&nbsp;
                {this.renderDeleteButton()}

              <Alert stack={{limit: 3}} />

          </div>
    )
  }
}

export default createContainer((props) => {
  const { groupId } = props.params;
  Meteor.subscribe('groups');
  return { groups: Groups.findOne(groupId) };
}, translate('translations')(GroupEdit));

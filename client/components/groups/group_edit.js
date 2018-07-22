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

class GroupEdit extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      country: '',
      groupLanguage: 'English',
      meetDay: '',
      meetTime: moment(),
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
    var newGroup = new Group(this.props.groups);

    const gp_leader = {
      first_name: this.refs.group_leader_first_name.value,
      last_name: this.refs.group_leader_second_name.value,
      country: this.state.country,
      phone: this.refs.group_leader_phone.value,
      email: this.refs.group_leader_email.value
    }

    const meet_time = {
      day_of_week: this.state.meetDay,
      meet_time: this.state.meetTime.format(format)
    }

    newGroup.insert(
      this.state.groupLanguage,
      this.refs.useOwnMeetingRes.checked,
      gp_leader,
      meet_time
    );
    Alert.success('Group Updated', {
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

  componentWillMount() {

    if(_.isUndefined(this.props.groups)){
      console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
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
    this.setState({ meetDay: this.props.groups.meet_time.day_of_week });
    this.setState({ country: this.props.groups.group_leader.country });

  };

  render() {

    if(_.isUndefined(this.props.groups)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return <div>Updating...</div>;
    };

    console.log("GROUP : ",this.props);

    const dateCreated = this.props.groups.date_created;
    const groupLanguage = this.props.groups.group_language;
    const ownResources = this.props.groups.use_own_meeting_resources?"checked":"";
    const groupLeader = this.props.groups.group_leader;

    return (

          <div className="container-fluid top-buffer">
              <h2>Edit Group</h2><br />

                <div className="panel panel-primary">
                  <div className="panel-heading">Group Info</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label htmlFor="select1" >Grooup languge</label>
                        <select value={groupLanguage} onChange={this.updateLanguage} className="form-control">
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
                            defaultValue={this.state.meetTime}
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
                              <input type="checkbox" ref="useOwnMeetingRes" value="" defaultChecked={ownResources} />
                              We are going to use our own live meeting service (Hangouts, Zoom, Webex...)
                            </label>
                          </div>
                        </div>
                    </div>
                </div>



                <div className="text-danger">{this.state.error}</div>
                <button
                  className="btn btn-primary"
                  onClick={this.updateGroup.bind(this)}
                  >
                  Update Group
                </button>&nbsp;
                <button
                  className="btn btn-warning"
                  onClick={this.confirmDelete.bind(this)}
                  >
                  Delete Group
                </button>

              <Alert stack={{limit: 3}} />

          </div>
    )
  }
}

export default createContainer((props) => {
  console.log("PROPS: ", props);
  const { groupId } = props.params;
  console.log("GROUP ID: ", { groupId });

  Meteor.subscribe('groups');

  return { groups: Groups.findOne(groupId) };
}, GroupEdit);

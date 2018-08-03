import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Groups } from '../../../imports/collections/groups';
import { Link, browserHistory } from 'react-router';
import Group from '../../../imports/classes/Group';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';


class GroupMeditators extends Component {

  constructor(props) {
    super(props);
    if(_.isUndefined(this.props.groups)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return browserHistory.push('/');
    }

    this.state = {
      userAuth: Meteor.user(),
      meditatorsList: this.props.groups.meditators
    };
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (!Meteor.user()) {
      return browserHistory.push('/');
    }
  }

  updateGroup(medList) {
    console.log("UPDATE GROUPS PARAM: ", medList);
    var newGroup = new Group(this.props.groups);

    const gp_leader = {
      first_name: this.props.groups.group_leader.first_name,
      last_name: this.props.groups.group_leader.last_name,
      country: this.props.groups.group_leader.country,
      phone: this.props.groups.group_leader.phone,
      email: this.props.groups.group_leader.email,

    }

    const meet_time = {
      day_of_week: this.props.groups.meet_time.day_of_week,
      meet_time: this.props.groups.meet_time.meet_time,
    }

    newGroup.insert(
      this.props.groups.group_language,
      this.props.groups.use_own_meeting_resources,
      gp_leader,
      meet_time,
      medList,
    );
    Alert.warning('User removed from this group', {
      position: 'top-left',
      effect: 'jelly',
      onShow: function () {
        setTimeout(function(){
          //browserHistory.push('/');
        }, 2000);
      },
      timeout: 1500,
      offset: 20
    });
  }

  remove(memberToremove) {

    bootbox.confirm({
        message: "Are you sure you want to remove this user from the group?",
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
        callback:  (result)  => {
            if(result){
              let finalSet = _.reject(this.state.meditatorsList, function(value){
                return value.email === memberToremove;
              });
              this.setState({ meditatorsList: finalSet });
              this.updateGroup(finalSet);
            }
        }
    });
  }

  renderRows() {
    console.log("RENDER STATE: ", this.state.meditatorsList);
    return this.state.meditatorsList.map(meditator => {
      const { full_name, email, country } = meditator;
      return (
        <tr key={email}>
          <td>{full_name}</td>
          <td>{email}</td>
          <td>{country}</td>
          <td>
            <button
              className="btn btn-success"
            >
              Send Email
            </button>
          </td>
          <td>
            <button
              className="btn btn-warning"

              onClick={() => this.remove(meditator.email)}>
              Remove
            </button>
          </td>

        </tr>
      );
    });
  }

  render() {
    if(_.isUndefined(this.props.groups)){
      //console.log("COMP WILL MOUNT ", _.isUndefined(this.props.groups));
      return <div>Updating...</div>;
    };

    console.log("*** THe gROUP: ", this.props.groups);

    return (
      <div className="container-fluid top-buffer">
        <pre>
        <h4>Group language: <u>{this.props.groups.group_language}</u></h4>
        <h4>Led by: <u>{this.props.groups.group_leader.first_name} {this.props.groups.group_leader.last_name}</u></h4>
        <h4>Meeting every: <u>{this.props.groups.meet_time.day_of_week} at {this.props.groups.meet_time.meet_time}</u></h4>
        <br />
        <h3><span className="label label-default">Meditators in this group</span></h3><hr />

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Send email</th>
                <th>remove</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </pre>
        <Alert stack={{limit: 3}} />
      </div>
    );
  }

}

export default createContainer((props) => {
  const { groupId } = props.params;
  Meteor.subscribe('groups');
  return { groups: Groups.findOne(groupId), currentUser: Meteor.user() || {} };
}, GroupMeditators);

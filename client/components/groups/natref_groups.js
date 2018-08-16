import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Select from 'react-select';
import { Groups } from '../../../imports/collections/groups';

class NatRefGroups extends Component {


  renderRows() {

    return this.props.groups.map(group => {
      const groupEditUrl = `/editgroup/${group._id}`;
      const { _id, group_language, group_leader, meet_time, meditators  } = group;
      const leader = group_leader.first_name + " " + group_leader.last_name;
      const meetingtime = meet_time.day_of_week + " at " + meet_time.meet_time;
      const med_numbers = (_.isUndefined(meditators))?0:meditators.length;
      if(Roles.userIsInRole(Meteor.user(),['admin']) ||
        Roles.userIsInRole(Meteor.user(), ['groupleader'], group._id) ||
        Meteor.user() && (Meteor.user()._id == group.ownerId)

      ) {
        return (
          <tr key={_id}>
            <td><Link to={groupEditUrl}>{group_language}</Link></td>
            <td>{leader}</td>
            <td>{meetingtime}</td>
            <td><button
              className="btn btn-info"
              onClick={() => {
                  if(med_numbers > 0){
                    browserHistory.push(`/groupmeditators/${group._id}`)
                  }
                }
              }>
              {med_numbers}
            </button></td>
            <td>
              <button
                className="btn btn-success"
                onClick={() => browserHistory.push(`/joingroup/${group._id}`)}>
                Join this group
              </button>
            </td>
          </tr>
        )
      }else if(Roles.userIsInRole(Meteor.user(), ['groupleader'], group._id)) {
        return (
          <tr key={_id}>
            <td>{group_language}</td>
            <td>{leader}</td>
            <td>{meetingtime}</td>
            <td><button
              className="btn btn-info"
              onClick={() => {
                  if(med_numbers > 0){
                    browserHistory.push(`/groupmeditators/${group._id}`)
                  }
                }
              }>
              {med_numbers}
            </button></td>
          </tr>
        )
      }else {
        return (
          <tr key={_id}>
            <td>{group_language}</td>
            <td>{leader}</td>
            <td>{meetingtime}</td>
            <td>{med_numbers}</td>
          </tr>
        )
      }
    });
  }

  render() {

    const daysOfWeek = [{value: 'All', label: 'All'}, {value: 'Monday', label: 'Monday'}, {value: 'Tuesday', label: 'Tuesday'}, {value: 'Wednesday', label: 'Wednesday'}, {value: 'Thursday', label: 'Thursday'}, {value: 'Friday', label: 'Friday'}, {value: 'Saturday', label: 'Saturday'}, {value: 'Sunday', label: 'Sunday'}];


    return (
      <div className="container-fluid top-buffer">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Language</th>
                <th>Group Leader</th>
                <th>Meeting Day and Time</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>

      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('natRefGroups');
  return { groups: Groups.find({}, { sort: { group_language: 1 } }).fetch(), currentUser: Meteor.user() || {} };
}, NatRefGroups);

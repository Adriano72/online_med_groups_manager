import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Groups } from '../../../imports/collections/groups';

class GroupsList extends Component {
  renderRows() {
      return this.props.groups.map(group => {
        const groupEditUrl = `/editgroup/${group._id}`;
        const { _id, group_language, group_leader, meet_time  } = group;
        const leader = group_leader.first_name + " " + group_leader.last_name;
        const meetingtime = meet_time.day_of_week + " at " + meet_time.meet_time;

        if(Roles.userIsInRole(Meteor.user(), ['admin', 'nationalresp'])){
          return (
            <tr key={_id}>
              <td><Link to={groupEditUrl}>{group_language}</Link></td>
              <td>{leader}</td>
              <td>{meetingtime}</td>
              <td>Join</td>
            </tr>
          )
        }else {
          return (
            <tr key={_id}>
              <td>{group_language}</td>
              <td>{leader}</td>
              <td>{meetingtime}</td>
              <td>Join</td>
            </tr>
          )
        }
      });
  }

  render() {
    return (
      <div className="container-fluid top-buffer">
        <pre>
          <table className="table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Group Leader</th>
                <th>Meeting Time</th>
                <th>Join this group</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </pre>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');
  return { groups: Groups.find({}, { sort: { group_language: -1 } }).fetch() };
}, GroupsList);

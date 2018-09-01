import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Parser from 'html-react-parser';
import { Groups } from '../../../imports/collections/groups';

class GroupsToApprove extends Component {

  componentWillMount() {

    if(!(Roles.userIsInRole(Meteor.user(), ['admin']))) {
      return browserHistory.push('/');
    };
  }

  renderRows() {
    return this.props.groups.map(group => {
      const groupEditUrl = `/checkgroup/${group._id}`;
      const { _id, group_language, group_leader, group_detail, meet_time, approved, meditators } = group;
      const detail_text = group_detail && group_detail.detail_text;
      const detail_url = group_detail && group_detail.detail_url;
      const leader = group_leader.first_name + " " + group_leader.last_name;
      const meetingtime = meet_time.day_of_week + " at " + meet_time.meet_time;
      const groupDetailInfo = (detail_text)?detail_text:' ';
      const groupDetailURL = (detail_url)?' <span className="label label-info"><a style="color: inherit; text-decoration: none;"  href=' + detail_url + ' target="_blank">Info</a></span>':' ';

      if(Roles.userIsInRole(Meteor.user(), ['admin'])){
        return (
          <tr key={_id}>
            <td>{group_language}</td>
            <td>{groupDetailInfo}{Parser(groupDetailURL)}</td>
            <td>{leader}</td>
            <td>{meetingtime}</td>
            <td>
              <button
                className="btn btn-success"
                onClick={() => browserHistory.push(groupEditUrl)}>
                Review
              </button>
            </td>
          </tr>
        )
      }else {
        return (
          <tr key={_id}>
            <td><Link to={groupEditUrl}>{group_language}</Link></td>
            <td>{leader}</td>
            <td>{meetingtime}</td>
            <td>
              <button
                className="btn btn-success"
                onClick={() => browserHistory.push(groupEditUrl)}>
                Review
              </button>
            </td>
          </tr>
        )
      }
    });
  }

  render() {
    return (
      <div className="container-fluid top-buffer">
        <pre>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Language</th>
                <th>Group Info</th>
                <th>Group Leader</th>
                <th>Meeting Time</th>
                <th>Review group submission</th>
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
  Meteor.subscribe('groupsToApprove');
  return { groups: Groups.find({}, { sort: { group_language: -1 } }).fetch(), currentUser: Meteor.user() || {} };
}, GroupsToApprove);

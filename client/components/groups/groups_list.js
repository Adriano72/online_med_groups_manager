import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Select from 'react-select';
import { Groups } from '../../../imports/collections/groups';

class GroupsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupSelected: 'all',
      groupsCollection: props.groups,
    };
  }

  renderRows() {

    var groupsToShow = this.state.groupsCollection;

    return groupsToShow.map(group => {
      const groupEditUrl = `/editgroup/${group._id}`;
      const { _id, group_language, group_leader, meet_time, meditators  } = group;
      const leader = group_leader.first_name + " " + group_leader.last_name;
      const meetingtime = meet_time.day_of_week + " at " + meet_time.meet_time +' - Time zone: '+meet_time.time_zone;
      const med_numbers = (_.isUndefined(meditators))?0:meditators.length;

      return (
        <tr key={_id}>
          <td>{group_language}</td>
          <td>{leader}</td>
          <td>{meetingtime}</td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => browserHistory.push(`/joingroup/${group._id}`)}>
              Join this group
            </button>
          </td>

        </tr>
      )
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    this.setState({
      groupsCollection: nextProps.groups
    });
  }

  filterByDayOfWeek = (dayOfWeek) => {
    let tempList;
    this.setState({ filterBy: dayOfWeek });
    if(dayOfWeek.value === 'All'){
      tempList = this.props.groups
    }else {
      tempList = _.filter(this.props.groups, function(o) { return o.meet_time.day_of_week == dayOfWeek.value; });
    }
    this.setState({ groupsCollection: tempList });
  }

  render() {

    const daysOfWeek = [{value: 'All', label: 'All'}, {value: 'Monday', label: 'Monday'}, {value: 'Tuesday', label: 'Tuesday'}, {value: 'Wednesday', label: 'Wednesday'}, {value: 'Thursday', label: 'Thursday'}, {value: 'Friday', label: 'Friday'}, {value: 'Saturday', label: 'Saturday'}, {value: 'Sunday', label: 'Sunday'}];


    return (
      <div className="container-fluid top-buffer">

          <div className="form-group" >

            <Select name="form-field-name" value={this.state.filterBy} placeholder="Filter by Meeting Day" searchable options={daysOfWeek} onChange={this.filterByDayOfWeek} />

          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Language</th>
                <th>Group Leader</th>
                <th>Meeting Day and Time</th>
                <th>Join this group</th>
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
  Meteor.subscribe('groups');
  return { groups: Groups.find({}, { sort: { group_language: 1 } }).fetch(), currentUser: Meteor.user() || {} };
}, GroupsList);

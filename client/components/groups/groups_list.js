import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Select from 'react-select';
import Parser from 'html-react-parser';
import moment from 'moment-timezone';
import { Groups } from '../../../imports/collections/groups';

let userTimeZone = moment.tz.guess();
const format = 'h:mm a';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeek = [{ value: 'All', label: 'All'}, {value: 'Monday', label: 'Monday'}, {value: 'Tuesday', label: 'Tuesday'}, {value: 'Wednesday', label: 'Wednesday'}, {value: 'Thursday', label: 'Thursday'}, {value: 'Friday', label: 'Friday'}, {value: 'Saturday', label: 'Saturday'}, {value: 'Sunday', label: 'Sunday' }];
const languages = [{ value: 'All', label: 'All'}, {value: 'English', label: 'English'}, {value: 'French', label: 'French'}, {value: 'Italian', label: 'Italian'}, {value: 'Spanish', label: 'Spanish'}, {value: 'German', label: 'German'}, {value: 'Dutch', label: 'Dutch'}, {value: 'Portuguese', label: 'Portuguese'}, {value: 'Russian', label: 'Russian'}, {value: 'Chinese', label: 'Chinese'}, {value: 'Indonesian', label: 'Indonesian' }];
const groupTypes = [{ value: 'All', label: 'All'}, {value: 'Special Groups', label: 'Special Groups' }];

class GroupsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterByDay: { value: 'All', label: 'All' },
      filterByLang: { value: 'All', label: 'All' },
      filterByGroupType: { value: 'All', label: 'All' }
    };
  }

  renderRows() {

    return this.props.groups.map(group => {
      const groupEditUrl = `/editgroup/${group._id}`;
      const { _id, group_language, group_leader, group_detail, meet_time, meditators  } = group;
      const detail_text = group_detail && group_detail.detail_text;
      const detail_url = group_detail && group_detail.detail_url;
      const leader = group_leader.first_name + " " + group_leader.last_name;
      const med_numbers = (_.isUndefined(meditators))?0:meditators.length;
      const meetTime = meet_time.meet_time;
      const groupDetailInfo = (detail_text)?detail_text:' ';
      const groupDetailURL = (detail_url)?' <span className="label label-info"><a style="color: inherit; text-decoration: none;"  href=' + detail_url + ' target="_blank">Info</a></span>':' ';

      moment.tz.setDefault(meet_time.time_zone);

      let dateStr = moment(),
      date    = moment(dateStr),
      time    = moment(meetTime, 'h:mm a');

      date.set({
          hour:   time.get('hour'),
          minute: time.get('minute')
      });
      let setTimeZone = moment.tz(date, meet_time.time_zone);
      let rawformattedConvertedTime = moment(setTimeZone).tz(userTimeZone);
      let formattedConvertedTime = moment(setTimeZone).tz(userTimeZone).format(format);
      const originalWeekDay = date.format('dddd');

      let computedMeetingDay = meet_time.day_of_week;

      if(date.format('dddd') !== rawformattedConvertedTime.format('dddd')){
        const indexOfOriginalDay = _.indexOf(weekDays, setTimeZone.format('dddd'));
        const indexOfComputedDay = _.indexOf(weekDays, rawformattedConvertedTime.format('dddd'));
        let indexOfRealDay = _.indexOf(weekDays, meet_time.day_of_week);
        if(indexOfOriginalDay < indexOfComputedDay){
          computedMeetingDay = (indexOfRealDay < 6)?weekDays[indexOfRealDay +1 ]:weekDays[0];
        }else {
          computedMeetingDay = (indexOfRealDay > 0)?weekDays[indexOfRealDay - 1]:weekDays[6];
        }
      }

      const meetingtime = computedMeetingDay + " at " + formattedConvertedTime;
      console.log("BZZZZZZZ: ", detail_text);

      if(this.state.filterByDay.value !== 'All' &&  computedMeetingDay !== this.state.filterByDay.value) return;
      if(this.state.filterByLang.value !== 'All' &&  group_language !== this.state.filterByLang.value) return;
      if(this.state.filterByGroupType.value !== 'All' &&  (detail_text == '' || _.isUndefined(group_detail))) return;

      moment.tz.setDefault();

      //console.log("DETAIL ******: ", group_detail);

      return (
        <tr key={_id}>
          <td>{group_language}</td>
          <td>{groupDetailInfo}{Parser(groupDetailURL)}</td>
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

  filterByDayOfWeek = (dayOfWeek) => {
    this.setState({ filterByDay: dayOfWeek });
  }

  filterByLanguage = (lang) => {
    this.setState({ filterByLang: lang });
  }

  filterByGroupTypes = (type) => {
    this.setState({ filterByGroupType: type });
  }

  resetFilters = () => {
    this.setState({ filterByDay: {value: 'All', label: 'All' } });
    this.setState({ filterByLang: {value: 'All', label: 'All' } });
    this.setState({ filterByGroupType: {value: 'All', label: 'All' } });
  }

  render() {

    return (
      <div className="container-fluid top-buffer">
        <div className="form-group col-md-4" >
          <label>Filter by Language</label>
          <Select id="filter-by-language" value={this.state.filterByLang} placeholder="Filter by Language" searchable options={languages} onChange={this.filterByLanguage} />
        </div>
        <div className="form-group col-md-4">
          <label>Filter by Week Day</label>
          <Select name="filter-by-day" value={this.state.filterByDay} placeholder="Filter by Meeting Day" searchable options={daysOfWeek} onChange={this.filterByDayOfWeek} />
        </div>
        <div className="form-group col-md-4">
          <label>Group Type</label>
          <Select name="filter-by-day" value={this.state.filterByGroupType} placeholder="Filter by Group Type" searchable options={groupTypes} onChange={this.filterByGroupTypes} />
        </div>
        <div className="form-group col-md-6">
          <button
            className="btn btn-warning"
            onClick={this.resetFilters}
          >
            Reset filters
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Language</th>
              <th>Group Info</th>
              <th>Group Leader</th>
              <th>Meeting Schedule [in your local time]</th>
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

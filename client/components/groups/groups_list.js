import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import Select from 'react-select';
import Parser from 'html-react-parser';
import moment from 'moment-timezone';
import { Groups } from '../../../imports/collections/groups';
import { translate, Trans } from 'react-i18next';

let userTimeZone = moment.tz.guess();
const format = 'h:mm a';
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class GroupsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterByDay: { value: 'All', label: this.props.i18n.t('All') },
      filterByLang: { value: 'All', label: this.props.i18n.t('All') },
      filterByGroupType: { value: 'All', label: this.props.i18n.t('All') }
    };
  }

  renderRows() {

    return this.props.groups.map(group => {
      const groupEditUrl = `/editgroup/${group._id}`;
      const { _id, group_language, group_leader, group_detail, meet_time, meditators  } = group;
      const translatedLanguage = this.props.i18n.t(group_language);
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

      const meetingtime = this.props.i18n.t(computedMeetingDay) + " "+this.props.i18n.t('at')+" " + formattedConvertedTime;

      if(this.state.filterByDay.value !== 'All' &&  computedMeetingDay !== this.state.filterByDay.value) return;
      if(this.state.filterByLang.value !== 'All' &&  group_language !== this.state.filterByLang.value) return;
      if(this.state.filterByGroupType.value !== 'All' &&  (detail_text == '' || _.isUndefined(group_detail))) return;

      moment.tz.setDefault();

      //console.log("DETAIL ******: ", group_detail);

      return (
        <tr key={_id}>
          <td>{translatedLanguage}</td>
          <td>{groupDetailInfo}{Parser(groupDetailURL)}</td>
          <td>{leader}</td>
          <td>{meetingtime}</td>
          <td>
            <button
              className="btn btn-success"
              onClick={() => browserHistory.push(`/joingroup/${group._id}`)}>
              {this.props.i18n.t('Join This Group')}
            </button>
          </td>

        </tr>
      )
    });
  }
  /*
  translateDays = () => {
    let translatedObjectArray = [{ value: 'All', label: 'All'}];
    _.forEach(weekDays, function(value){
      let temp = t(value)
      translatedObjectArray.push(temp);
    })

    console.log("FINAL OBJ: ", translatedObjectArray);
  }
  */

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
    this.setState({ filterByDay: {value: 'All', label: this.props.i18n.t('All') } });
    this.setState({ filterByLang: {value: 'All', label: this.props.i18n.t('All') } });
    this.setState({ filterByGroupType: {value: 'All', label: this.props.i18n.t('All') } });
  }

  changeLanguageToEn = () => {
    this.props.i18n.changeLanguage('en');
  };

  changeLanguageToEl = () => {
    this.props.i18n.changeLanguage('el');
  };

  changeLanguageToIt = () => {
    this.props.i18n.changeLanguage('it');
  };

  changeLanguageToPt = () => {
    this.props.i18n.changeLanguage('pt');
  };

  render() {
    const t = this.props.t;
    const i18n = this.props.i18n;
    const languages = [{ value: 'All', label: t('All')}, {value: 'English', label: t('English') }, {value: 'French', label: t('French') }, {value: 'Italian', label: t('Italian') }, {value: 'Spanish', label: t('Spanish') }, {value: 'German', label: t('German') }, {value: 'Dutch', label: t('Dutch') }, {value: 'Portuguese', label: t('Portuguese') }, {value: 'Russian', label: t('Russian') }, {value: 'Chinese', label: t('Chinese') }, {value: 'Indonesian', label: t('Indonesian') }];
    const daysOfWeek = [{ value: 'All', label: t('All') }, { value: 'Monday', label: t('Monday') }, { value: 'Tuesday', label: t('Tuesday') }, {value: 'Wednesday', label: t('Wednesday') }, {value: 'Thursday', label: t('Thursday') }, {value: 'Friday', label: t('Friday') }, {value: 'Saturday', label: t('Saturday') }, {value: 'Sunday', label: t('Sunday') }];
    const groupTypes = [{ value: 'All', label: t('All') }, { value: 'Special Groups', label: t('Special Groups') }];

    return (
      <div className="container-fluid top-buffer">
        <div className="form-group col-md-4" >
          <label>{t('Filter by Language')}</label>
          <Select id="filter-by-language" value={this.state.filterByLang} placeholder="Filter by Language" searchable options={languages} onChange={this.filterByLanguage} />
        </div>
        <div className="form-group col-md-4">
          <label>{t('Filter by Week Day')}</label>
          <Select name="filter-by-day" value={this.state.filterByDay} placeholder="Filter by Meeting Day" searchable options={daysOfWeek} onChange={this.filterByDayOfWeek} />
        </div>
        <div className="form-group col-md-4">
          <label>{t('Group Type')}</label>
          <Select name="filter-by-day" value={this.state.filterByGroupType} placeholder="Filter by Group Type" searchable options={groupTypes} onChange={this.filterByGroupTypes} />
        </div>
        <div className="form-group col-md-6">
          <button
            className="btn btn-warning"
            onClick={this.resetFilters}
          >
            {t('Reset Filters')}
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{t('Language')}</th>
              <th>{t('Group Info')}</th>
              <th>{t('Group Leader')}</th>
              <th>{t('Meeting Schedule [in your local time]')}</th>
              <th>{t('Join This Group')}</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
        {/*
          <button onClick={this.changeLanguageToEl.bind(this)}>el</button>
          <button onClick={this.changeLanguageToIt.bind(this)}>it</button>
        */}
        <button onClick={this.changeLanguageToEn.bind(this)}>en</button>

        <button onClick={this.changeLanguageToPt.bind(this)}>pt</button>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');
  return { groups: Groups.find({}, { sort: { group_language: 1 } }).fetch(), currentUser: Meteor.user() || {} };
}, translate('translations')(GroupsList));

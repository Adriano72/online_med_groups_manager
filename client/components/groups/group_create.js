import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import { Groups } from '../../../imports/collections/groups';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Group from '../../../imports/classes/Group';
import { ValidationError } from 'meteor/jagi:astronomy';


class GroupCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      grpupLanguage: 'English'
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  updateLanguage(e) {
    //console.log('NEW VALUE ', newValue);
    this.setState({ grpupLanguage: e.target.value });
  }

  render() {
    return (
        <div className="container-fluid top-buffer">
            <h2>New online group</h2><br />

              <div className="panel panel-primary">
                <div className="panel-heading">Group Info</div>
                  <div className="panel-body">
                    <div className="form-group">
                      <label htmlFor="select1" >Grooup languge</label>
                      <select value={this.state.grpupLanguage} onChange={this.updateLanguage} className="form-control">
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
                        <input type="text" className="form-control" placeholder="First name" ref="group_leader_second_name" />
                      </div>
                      <div className="form-group col-xs-3">
                        <label>Last name</label>
                        <input type="text" className="form-control" placeholder="Last name" ref="group_leader_second_name" />
                      </div>
                      <div className="form-group col-xs-4">
                        <label>Email</label>
                        <input type="text" className="form-control" placeholder="Email" ref="group_leader_email" />
                      </div>
                      <div className="form-group col-xs-2">
                        <label>Phone</label>
                        <input type="text" className="form-control" placeholder="Phone" ref="group_leader_phone" />
                      </div>
                  </div>
              </div>
              <div className="panel panel-primary">
                <div className="panel-heading">Group Meeting Time</div>
                  <div className="panel-body">
                      <div className="form-group col-xs-2">
                        <label>Day of the week</label>
                        <input type="text" className="form-control" placeholder="Day" ref="group_meeting_day" />
                      </div>
                      <div className="form-group col-xs-2">
                        <label>Time</label>
                        <input type="text" className="form-control" placeholder="Time" ref="group_meeting_time" />
                      </div>
                  </div>
              </div>
              <div className="panel panel-danger">
                <div className="panel-heading">Group Meeting Time</div>
                  <div className="panel-body">
                      <div className="form-group">

                        <div className="checkbox">
                          <label>
                            <input type="checkbox" ref="morning" value="" />
                            We are going to use our own live meeting service (Hangouts, Zoom, Webex...)
                          </label>
                        </div>
                      </div>
                  </div>
              </div>



              <div className="text-danger">{this.state.error}</div>
              <button
                className="btn btn-primary"
                //onClick={this.onSaveClick.bind(this)}
                >
                Submit Group
              </button>

            <Alert stack={{limit: 3}} />

        </div>
    )
  }
}

//export default SessionsCreate;

export default createContainer(() => {
  Meteor.subscribe('group');
  return { group: Groups.find({}).fetch() };
}, GroupCreate);

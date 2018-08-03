import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class AuthUsersList extends Component {

  componentWillMount() {

    if(!(Roles.userIsInRole(Meteor.user(), ['admin']))) {
      console.log("USER ******************", Meteor.user());
      return browserHistory.push('/');
    }
  }

  renderRows() {
    var users = this.props.allUsers;

    console.log('*** USERS ***: ', users);
    if(users){
      return users.map(user => {

          const userViewUrl = `/student_detail/${user._id}`;
          const group = Object.keys(user.roles);
          const roles = Roles.getRolesForUser(user);
          const email = user.emails[0].address;
          return (
            <tr key={user._id}>
              <td><Link to={userViewUrl}>{user.username}</Link></td>
              <td>{email}</td>
              <td>{roles}</td>
            </tr>
          )

      });
    }
  };


  render() {

    return (
      <div className="container-fluid top-buffer">
        <pre>
          <span><h2>Authorized Users</h2></span><br />

          <table className="table">
            <thead>
              <tr>
                <th>Meditator</th>
                <th>Email</th>
                <th>Role</th>
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
  Meteor.subscribe('allUsers');
  return {
    allUsers: Meteor.users.find({}).fetch(),
  };
}, AuthUsersList);

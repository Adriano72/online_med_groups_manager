import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Parser from 'html-react-parser';
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
    if (users) {
      return users.map(user => {
          const userEditUrl = `/userdetail/${user._id}`;
          let rolesCovered = '';
          /*
          if (user.roles.__global_roles__) {
            //console.log("Ruoli numero: ", user.roles.__global_roles__.length);
            _.forEach(user.roles.__global_roles__, function(value) {
              if (value === 'admin'){
                rolesCovered += '<span className="label label-danger">ADMINISTRATOR</span>';
              }
            });
          }
          */
          let groupsForUser = Roles.getGroupsForUser(user);
          
          if (groupsForUser.length) {
            groupsForUser.forEach(function(group) {   
              let userRole = Roles.getRolesForUser(user, group);
              userRole.forEach(function(role) {
                if (role.toString() === 'nationalresp') {
                  rolesCovered += '<span className="label label-info">NATIONAL REFERENT '+group+'</span>';
                }
              });
                               
            });
          }
          

          if (Roles.userIsInRole(user, 'admin')) {
            rolesCovered += '<span className="label label-danger">ADMIN</span>';
          }
          

          if (Roles.userIsInRole(user, ['itsaleader'], Roles.GLOBAL_GROUP)) {
            rolesCovered += '<span className="label label-warning">GROUP LEADER</span>';
          }
          /*
          if (Roles.userIsInRole(user, ['nationalresp'], groupsForUser.toString())) {
            rolesCovered += '<span className="label label-info">NATIONAL REFERENT '+groupsForUser.toString()+'</span>';
          }
          */

          
          /*
          let country = (Roles.getGroupsForUser(user, 'active').length)?' FOR '+Roles.getGroupsForUser(user, 'active'):'';
          rolesCovered += '<span className="label label-info">NATIONAL REFERENT'+country+'</span>';
          

          console.log('TCL: AuthUsersList -> renderRows -> groupsForUser', groupsForUser);
          if(Roles.userIsInRole(user, ['groupleader'], groupsForUser.toString())){
            rolesCovered += '<span className="label label-warning">GROUP LEADER</span>';
          }
          */
          //const userViewUrl = `/student_detail/${user._id}`;
          const keys = user.roles.__global_roles__&&Object.keys(user.roles.__global_roles__);
          //const roles = Object.keys(user.roles.keys);
          let group = Roles.getGroupsForUser(user);
          const userIsNatRest = Roles.userIsInRole(user, 'nationalresp', ['__global_roles__']);
          //let roles = Roles.getRolesForUser(user, [group]);
          let email = user.emails[0].address;
          return (
            <tr key={user._id}>
              <td><Link to={userEditUrl}>{user.username}</Link></td>
              <td>{email}</td>
              <td>{Parser(rolesCovered)}</td>            
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

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Meditator</th>
                <th>Email</th>
                <th>Roles</th>
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
    allUsers: Meteor.users.find({}, { sort: { username: 1 } }).fetch(),
  };
}, AuthUsersList);

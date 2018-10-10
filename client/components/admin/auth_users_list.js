import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Parser from 'html-react-parser';
import { Groups } from '../../../imports/collections/groups';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class AuthUsersList extends Component {

  constructor(props) {
    super(props);

    this.countGroupsOwned = this.countGroupsOwned.bind(this);
  }
  componentWillMount() {

    if(!(Roles.userIsInRole(Meteor.user(), ['admin']))) {
      return browserHistory.push('/');
    }
  }

  countGroupsOwned(uid) {
    //console.log("ROPS GROU: ", this.props.groups);
    var countGroups = _.filter(this.props.groups, {ownerId: uid});    
    return countGroups.length;
  }

  renderRows() {
    if (this.props.allUsers) {
      return this.props.allUsers.map(user => {
          const userEditUrl = `/userdetail/${user._id}`;
          let rolesCovered = '';
         

         var numberOfGroups = this.countGroupsOwned(user._id);
          
          Object.entries(user.roles).forEach(
            ([key, value]) => {
              if(value == 'nationalresp' && key != '__global_roles__') {
                (rolesCovered.length > 0)? rolesCovered += ' <span className="label label-info">NATIONAL REFERENT '+key+'</span>':rolesCovered += '<span className="label label-info">NATIONAL REFERENT '+key+'</span>';

              }
            }
          );

          if (Roles.userIsInRole(user, 'admin')) {
            (rolesCovered.length > 0)? rolesCovered += ' <span className="label label-danger">ADMIN</span>':rolesCovered += '<span className="label label-danger">ADMIN</span>';
          }
          

          if (Roles.userIsInRole(user, ['itsaleader'], Roles.GLOBAL_GROUP)) {
            (rolesCovered.length > 0)? rolesCovered += ' <span className="label label-warning">GROUP LEADER</span>':rolesCovered += '<span className="label label-warning">GROUP LEADER</span>';
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
              <td>{numberOfGroups}</td>
              <td>{Parser(rolesCovered)}</td>            
            </tr>
          )

      });
    }else {
      alert("CIAONEEE");
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
                <th>Groups Owned</th>
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
  Meteor.subscribe('groups');
  return {
    allUsers: Meteor.users.find({}, { sort: { username: 1 } }).fetch(), groups: Groups.find({}).fetch()
  };
}, AuthUsersList);

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import Parser from 'html-react-parser';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class UserDetail extends Component {

  componentWillMount() {

    if(!(Roles.userIsInRole(Meteor.user(), ['admin']))) {
      console.log("USER ******************", Meteor.user());
      return browserHistory.push('/');
    }
  }

  renderRows() {

    const user = this.props.user;

    let tableCode = ""
    
    if (Roles.userIsInRole(user, 'admin')) {
      tableCode += '<tr><td>Admin</td></tr>';     
    }

    if (Roles.userIsInRole(user, 'admin')) {
      tableCode += '<tr><td>Group Leader</td></tr>';     
    }

    let groupsForUser = Roles.getGroupsForUser(user);
          
    if (groupsForUser.length) {
      groupsForUser.forEach(function(group) {    
        let userRole = Roles.getRolesForUser(user, group);
        userRole.forEach(function(role) {
          if (role.toString() === 'nationalresp') {
            tableCode += '<tr><td>National Referent for '+group+'</td></tr>';
          }
        });               
      });
    }
    
    return (
      <tr>
        {Parser(tableCode)}

      </tr>
    );
  };
  
  

  render() {

    // Usa questo : Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.name": "yogi"}});


    return (
      <div className="container-fluid top-buffer">
      <h3>User Detail</h3><br />
        <pre>
        <h4>Username: {this.props.user.username}</h4>
        <h4>Email: {this.props.user.emails[0].address}</h4>
        <br />

          <table className="table">
            <thead>
              <tr>
                <th>Roles</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
            
          </table>
        </pre>
        <Alert stack={{limit: 3}} />
        
      </div>
    );
  }


}

export default createContainer((props) => {
  const {userId} = props.params;
  Meteor.subscribe('allUsers');
  return { user: Meteor.users.findOne(userId) };
}, UserDetail);

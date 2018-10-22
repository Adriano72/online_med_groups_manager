import { Meteor } from 'meteor/meteor';
import { Groups } from '../imports/collections/groups';
import Group from '../imports/classes/Group';

Meteor.methods({
  sendEmail: function(sender, recipient, subject, body) {
    check([sender, recipient, subject, body], [String]);
    this.unblock();
    if (Meteor.isServer) {
      var currentUserId = Meteor.userId();
      
        return Email.send({
          from: sender,
          to: recipient,
          subject: subject,
          html: body
        });
      
    }
  },
});

Accounts.config({
    forbidClientAccountCreation: true
});

Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'WCCM Online Meditation Groups <admin@wccm.org>';
};

Accounts.emailTemplates.enrollAccount.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'WCCM Online Meditation Groups <admin@wccm.org>';
};

Accounts.emailTemplates.enrollAccount.text = (user, url) => { // EDITED
  return 'Dear '+user.username
    + '\n\n'
    + "Welcome aboard!"
    + '\n\n'
    + 'To activate your account on the WCCM Online Meditation Groups portal please click on the link below:'
    + '\n\n'
    + url
    + '\n\n'
    + 'Once you setup your password you will find yourself already logged in on the groups portal. '
    + 'When you logout and wish to log back in, you will require your username: - '+user.username+' - or email and your chosen password.'
    + '\n\n'
    + 'For any help you might need please contact leonardo@wccm.org'
    + '\n\n'
    + 'The WCCM Online Meditation Groups Staff';
};

Meteor.startup(() => {
  //Sessions.rawCollection().drop();
  Meteor.publish('groups', function () {
    return Groups.find({ approved: true });
  });

  Meteor.publish('groupsToApprove', function () {
    return Groups.find({ approved: false });
  });

  Meteor.publish('natRefGroups', function () {
    return Groups.find({ ownerId: Meteor.user()._id, approved: true });
  });

  Meteor.publish('leaderGroups', function () { // Not used, display managed in module's rendering
    return Groups.find(Groups, function(o){
      return 2 > 0;
      //Roles.userIsInRole(Meteor.user(), ['groupleader'], group._id)
    });
  });

  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

  Meteor.publish('groupsToApproveCount', function() {
    Counts.publish(this, 'groups-to-approve', Groups.find({ approved: false }));
  });
});

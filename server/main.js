import { Meteor } from 'meteor/meteor';
import { Groups } from '../imports/collections/groups';
import Group from '../imports/classes/Group';



Meteor.methods({
  sendEmail: function(sender, recipient, subject, body) {
    check([sender, recipient, subject, body], [String]);
    this.unblock();
    if (Meteor.isServer) {
      var currentUserId = Meteor.userId();
      if(currentUserId){
        return Email.send({
          from: sender,
          to: recipient,
          subject: subject,
          html: body
        });
      }
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

Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return 'Dear '+user.username
    + '\n\n'
    + 'To activate your account on the WCCM Online Groups Meditation portal please click on the link below!'
    + '\n\n'
    + url
    + 'Welcome aboard'
    + 'The World Community for Christian Meditation - Online Meditation Groups';
};

Meteor.startup(() => {
  //Sessions.rawCollection().drop();
  Meteor.publish('groups', function () {
    return Groups.find({ approved: true });
  });

  Meteor.publish('groupsToApprove', function () {
    return Groups.find({ approved: false });
  });

  Meteor.publish('allUsers', function () {
    return Meteor.users.find();
  });

  Meteor.publish('groupsToApproveCount', function() {
    Counts.publish(this, 'groups-to-approve', Groups.find({ approved: false }));
  });
});

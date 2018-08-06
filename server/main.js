import { Meteor } from 'meteor/meteor';
import { Groups } from '../imports/collections/groups';
import Group from '../imports/classes/Group';



Meteor.methods({
  sendEmail: function(sender, recipient, subject, body) {
    check([sender, recipient, subject, body], [String]);
    if (Meteor.isServer) {
      var currentUserId = Meteor.userId();
      if(currentUserId){
        return Email.send({
          from: sender,
          to: recipient,
          subject: subject,
          text: body
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

import { Meteor } from 'meteor/meteor';
import { Groups } from '../imports/collections/groups';
import Group from '../imports/classes/Group';

Meteor.startup(() => {
  //Sessions.rawCollection().drop();
  Meteor.publish('groups', function () {
    return Groups.find();
  });
});

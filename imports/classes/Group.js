import { Class } from 'meteor/jagi:astronomy';
import { Groups } from '../collections/groups';

const GroupLeader = Class.create({
  name: 'GroupLeader',
  /* No collection attribute */
  fields: {
    first_name: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Group Leader First Name is mandatory!'
      }]
    },
    last_name: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Group Leader Last Name is mandatory!'
      }]
    },
    country: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Group Leader Country is mandatory!'
      }]
    },
    phone: {
      type: String
    },
    email: {
      type: String,
      validators: [{
        type: 'email',
        message: 'Group Leader Email should be a valid email!'
      }]
    }
  }
});

const MeetTime = Class.create({
  name: 'MeetTime',
  /* No collection attribute */
  fields: {
    day_of_week: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Meet Day is mandatory!'
      }]
    },
    meet_time: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Meet time is mandatory!'
      }]
    }
  }
});

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    ownerId: String,
    date_created: Date,
    group_language: String,
    use_own_meeting_resources: Boolean,
    approved: Boolean,
    meditators: {
      type: Object,
      optional: true
    },
    group_leader: {
      type: GroupLeader
    },
    meet_time: {
      type: MeetTime
    }
  },
  indexes: {
    groupLanguage: {
      fields: {
        group_language: 1
      },
      options: {
        //unique: true
      }
    }
  },
  meteorMethods: {
    insert: function(language, useOwnMeetRes, group_leader, meet_time, approved, meditators) {
      var currentUserId = Meteor.userId();
      if(currentUserId){
        this.ownerId = this.userId,
        this.date_created = new Date();
        this.group_language = language;
        this.use_own_meeting_resources = useOwnMeetRes;
        this.group_leader = group_leader;
        this.meet_time = meet_time;
        this.approved = approved;
        if(meditators){
          console.log("IF mEDITATORS ", meditators);
          this.meditators = meditators;
        }

        this.ownerId = Meteor.userId();
        return this.save();
      }
    },
    addMeditator(meditator) {
      if(this.meditators) {
        this.meditators.push(meditator);
      } else {
        this.meditators = [];
        this.meditators.push(meditator);
      }


      return this.save((err, result) => {
        if(err){
          console.log("ERROR: ", err);
        }else{
          console.log("RESULT: ", result);
        }
      });
    },
    delete(group) {
      return this.remove(group._id);
    },
    update(group, content) {
      return this.update(group._id, { $set: { content } });
    },
  }
});

export default Group;

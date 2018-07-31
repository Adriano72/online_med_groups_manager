import { Class } from 'meteor/jagi:astronomy';
import { Groups } from '../collections/groups';

const GroupLeader = Class.create({
  name: 'GroupLeader',
  /* No collection attribute */
  fields: {
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    country: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    }
  }
});

const MeetTime = Class.create({
  name: 'MeetTime',
  /* No collection attribute */
  fields: {
    day_of_week: {
      type: String
    },
    meet_time: {
      type: String
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
    insert: function(language, useOwnMeetRes, group_leader, meet_time, meditators) {
      var currentUserId = Meteor.userId();
      if(currentUserId){
        this.ownerId = this.userId,
        this.date_created = new Date();
        this.group_language = language;
        this.use_own_meeting_resources = useOwnMeetRes;
        this.group_leader = group_leader;
        this.meet_time = meet_time;
        if(meditators){
          console.log("IF mEDITATORS ", meditators);
          this.meditators = meditators;
        }

        this.ownerId = Meteor.userId();
        return this.save((err, result) => {
          if(err){
            console.log("GROUP INSERT ERROR: ", err);
          }else{
            console.log("GROUP INSERT RESULT: ", result);
          }
        });
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

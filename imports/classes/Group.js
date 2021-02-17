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

const Meditator = Class.create({
  name: 'Meditator',
  /* No collection attribute */
  fields: {
    full_name: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Name is mandatory!'
      }]
    },
    email: {
      type: String,
      validators: [{
        type: 'email',
        message: 'Email should be a valid email!'
      }]
    },
    country: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Country is mandatory!'
      }]
    },
    gdpr_ok: {
      type: Boolean,
      validators: [{
        type: 'gt',
        param: 0,
        message: 'Permission to be contacted by email is mandatory'
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
    },
    time_zone: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 2,
        message: 'Time Zone is mandatory!'
      }]
    }
  }
});

const GroupDetail = Class.create({
  name: 'GroupDetail',
  /* No collection attribute */
  fields: {
    detail_text: {
      type: String,
      optional: true
    },
    detail_url: {
      type: String,
      optional: true
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
    group_detail: {
      type: GroupDetail
    },
    meditators: {
      type: [Meditator],
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
    insert: function(language, groupDetail, useOwnMeetRes, group_leader, meet_time, approved, meditators) {
      var currentUserId = Meteor.userId();
      if(currentUserId){
        this.ownerId = this.userId,
        this.date_created = new Date();
        this.group_language = language;
        this.group_detail = groupDetail;
        this.use_own_meeting_resources = useOwnMeetRes;
        this.group_leader = group_leader;
        this.meet_time = meet_time;
        this.approved = approved;
        if(meditators){
          this.meditators = meditators;
        }

        this.ownerId = Meteor.userId();
        return this.save();
      }
    },
    addMeditator(meditator) {

      let meditatorAlreadyPresent = _.findIndex(this.meditators, (o) => { return _.isMatch(o, meditator) }) > -1;
      //console.log("VARIABLE IS: "+meditatorAlreadyPresent);

      if (meditatorAlreadyPresent == true) throw Error("This meditator is already present in the selected group");

      if(this.meditators) {
        this.meditators.push(meditator);
      } else {
        this.meditators = [];
        this.meditators.push(meditator);
      }
      return this.save();
    },
    delete(group) {
      return this.remove(group._id);
    },
    update(group, content) {
      return Groups.update(group, { $set: content });
    },
  }
});

export default Group;

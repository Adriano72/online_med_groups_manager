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
    date_created: Date,
    group_language: String,
    use_own_meeting_resources: Boolean,
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
    insert(language, useOwnMeetRes, ld_name, ld_surname, ld_email, ld_phone, ld_country, meet_day, meet_time) {
      this.date_created = new Date();
      this.group_language = language;
      this.use_own_meeting_resources = useOwnMeetRes;

      this.group_leader.first_name = ld_name;
      this.group_leader.last_name = ld_surname;
      this.group_leader.country = ld_country;
      this.group_leader.phone = ld_phone;
      this.group_leader.email = ld_email;

      this.meet_time.day_of_week = meet_day;
      this.meet_time.meet_time = meet_time;


      this.ownerId = Meteor.userId();
      return this.save((err, result) => {
        if(err){
          console.log("ERROR: ", err);
        }else{
          console.log("RESULT: ", result);
        }
      });
    }
  }
});

export default Group;

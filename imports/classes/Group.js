import { Class } from 'meteor/jagi:astronomy';
import { Groups } from '../collections/groups';


const Submitter = Class.create({
  name: 'Submitter',
  /* No collection attribute */
  fields: {
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    role: {
      type: String
    }
  }
});

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
    time: {
      type: String
    }
  }
});

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    group_language: String,
    group_country: String,
    submitted_by: {
        type: Submitter
    },
    group_leader: {
      type: GroupLeader
    },
    meet_time: {
      type: MeetTime
    }
  }
});

export default Group;

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
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    state_province: {
      type: String
    },
    zipcode: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
    how_long_know_leader: {
      type: String
    },
    what_capacity_leader: {
      type: String
    },
    leader_familiar_resources: {
      type: String
    },
    leader_knowledge_role: {
      type: String
    },
    leader_knowledge_wccm: {
      type: String
    },
    attended_etw_school: {
      type: String
    },
    other_notes: {
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
    group_name: String,
    group_language: String,
    group_country: String

  }
});

export default Group;

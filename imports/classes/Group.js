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

const Group = Class.create({
  name: 'Group',
  collection: Groups,
  fields: {
    group_name: String,
    group_language: String,
    group_country: String,
    submitted_by: {
      submitter: {
        type: Submitter
      }
    }

  }
});

export default Group;

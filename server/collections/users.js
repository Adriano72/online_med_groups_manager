Meteor.methods({
    mCreateUser: function (user) {
        console.log("NEW USER DATA: ", user);
        if(_.isObject(user)) {

            if (user.username) {

                var id = Accounts.createUser({
                    username: user.username,
                    email: user.email,
                    //password: user.password
                });
                Accounts.sendEnrollmentEmail(id);

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    //Roles.addUsersToRoles(id, user.roles, user.country);
                    Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
                    Roles.setUserRoles(id, 'active', user.country);
                }

                if (user.groupId) {
                    Roles.setUserRoles(id, user.roles, user.groupId);
                }

                _.extend(user, {id: id});

                return user;
            }
        }
    },
    mCreateGroupLeader: function (user) {
        console.log("NEW USER DATA: ", user);
        if(_.isObject(user)) {

            if (user.username) {

                var id = Accounts.createUser({
                    username: user.username,
                    email: user.email,
                    //password: user.password
                });
                Accounts.sendEnrollmentEmail(id);

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    //Roles.addUsersToRoles(id, user.roles, user.country);itsaleader
                    Roles.addUsersToRoles(id, 'itsaleader', Roles.GLOBAL_GROUP);
                    Roles.setUserRoles(id, user.roles, user.groupId);
                }

                _.extend(user, {id: id});

                return id;
            }
        }
    },
    mAddAnotherLeadershipToUser: function (user) {
        console.log("USER TO ADD LEADERSHIP TO: ", user);
        if(_.isObject(user)) {

            if (user.username) {

                const existingUser = Meteor.users.findOne({ 'emails.address': user.email })

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    //Roles.addUsersToRoles(id, user.roles, user.country);
                    Roles.setUserRoles(existingUser, user.roles, user.groupId);
                }

                return existingUser;
            }
        }
    },
    mcheckUserExistence: function(p_email) {
      return (Meteor.users.findOne({ 'emails.address': p_email })) ? 'exist' : 'not found';
    }
});

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
                    if(user.roles[0] ==='admin') {
                        console.log('1TCL: user.roles[0]', user.roles[0]);
                        Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
                    }else if (user.roles[0] ==='nationalresp'){
                        console.log('2TCL: user.roles[0]', user.roles[0]);
                        Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
                        Roles.addUsersToRoles(id, user.roles, user.country);
                    }
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
    mAddAdminRoleToExistingUserToUser: function (user) {
        console.log("USER TO ADD ADMIN TO: ", user);
        if(_.isObject(user)) {

            if (user.username) {

                const existingUser = Meteor.users.findOne({ 'emails.address': user.email })

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    //Roles.addUsersToRoles(id, user.roles, user.country);
                    Roles.addUsersToRoles(existingUser, user.roles, Roles.GLOBAL_GROUP);
                }

                return existingUser;
            }
        }
    },
    mAddNatrefRoleToExistingUserToUser: function (user) {
        console.log("USER TO ADD ADMIN TO: ", user);
        if(_.isObject(user)) {

            if (user.username) {

                const existingUser = Meteor.users.findOne({ 'emails.address': user.email })

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    //Roles.addUsersToRoles(id, user.roles, user.country);
                    Roles.addUsersToRoles(existingUser, user.roles, user.country);
                }

                return existingUser;
            }
        }
    },
    mmRemoveUserFromRole: function (user) {
        console.log("USER TO REMOVE ROLE FROM: ", user);
        if(_.isObject(user)) {            

            const existingUser = Meteor.users.findOne({ 'emails.address': user.email });

            if (user.roles.length > 0) {
                console.log("ROLES FOR USER: ", Roles.getRolesForUser(existingUser));
                console.log("GROUPS FOR USER: ", Roles.getGroupsForUser(existingUser, 'groupleader'));
                
                var user = existingUser, groupName, roles = [];

                for (groupName in user.roles) {
                    // note: doesn't strip duplicates
                    roles.concat(user.roles[groupName])
                }
                console.log("ALl ROLES!!!!! : ",roles);
                  
                return;
                
                // Need _id of existing user record so this call must come
                // after `Accounts.createUser` or `Accounts.onCreate`
                //[].concat(user);
                //Roles.addUsersToRoles(id, user.roles, user.country);
                Roles.removeUsersFromRoles(existingUser, user.roles, user.groupId);
                console.log("DOPO ROLES FOR USER: ", Roles.getRolesForUser(existingUser));
                console.log("DOPO GROUPS FOR USER: ", Roles.getGroupsForUser(existingUser, 'groupleader'));
                
            }

            return existingUser;          
        }
    },
    mcheckUserExistence: function(p_email) {
      return (Meteor.users.findOne({ 'emails.address': p_email })) ? 'exist' : 'not found';
    },
    mUserRemove: function(userId) {
        return (Meteor.users.remove(userId));
    },
    mResetForgottenPassword: function(p_email) {
      console.log("SERVER USER: ", p_email);
      let user = Meteor.users.findOne({ 'emails.address': p_email });
      console.log("FOUND USER: ", Meteor.users.findOne({ 'emails.address': p_email }));
      Accounts.sendResetPasswordEmail(user._id);
    }
});

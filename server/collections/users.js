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
        if(_.isObject(user)) {            

            const existingUser = Meteor.users.findOne({ 'emails.address': user.email });

            if (user.roles.length > 0) {               
                if(_.size(existingUser.roles) < 3) {
                    Meteor.users.remove(existingUser);
                }else {                    
                    _.unset(existingUser.roles, user.groupId);
                    Meteor.users.update({_id: existingUser._id}, {$set: {"roles": existingUser.roles}});
                }
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

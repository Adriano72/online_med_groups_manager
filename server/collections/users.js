Meteor.methods({
    mCreateUser: function (user) {

        if(_.isObject(user)) {

            if (user.username) {

                var id = Accounts.createUser({
                    username: user.username,
                    email: user.email,
                    password: user.password
                });

                if (user.roles.length > 0) {
                    // Need _id of existing user record so this call must come
                    // after `Accounts.createUser` or `Accounts.onCreate`
                    //[].concat(user);
                    Roles.addUsersToRoles(id, user.roles, user.group);
                    Roles.setUserRoles(id, 'active', Roles.GLOBAL_GROUP);
                }

                _.extend(user, {id: id});

                return user;
            }
        }
    }
});

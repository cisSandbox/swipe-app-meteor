Meteor.methods({
    adminCreateUser: function(user, role) {
        Accounts.createUser(user);
        Roles.addUsersToRoles(id, role);
    },
    adminRemoveUser: function(userId) {
        
    }
});
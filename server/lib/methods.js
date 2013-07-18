Meteor.methods({
    adminCreateUser: function(user, role) {
        var id = Accounts.createUser(user);
        Roles.addUsersToRoles(id, role);
    },
    adminRemoveUser: function(userId) {
        if (this.userId !== userId) {
            Meteor.users.remove(userId);
        }
    }
});
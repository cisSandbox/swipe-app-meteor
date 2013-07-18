Meteor.methods({
    adminCreateUser: function(user, role) {
        Accounts.createUser(user);
        Roles.addUsersToRoles(id, role);
    },
    adminRemoveUser: function(userId) {
        if (this.id !== userId) {
            Meteor.users.remove(userId);
        } else {
            Meteor.Error.throw('Cannot delete yourself');
        }
    }
});
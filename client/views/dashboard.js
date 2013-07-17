/*


    Dashboard hookup


 */

Template.dashboard.currentUser = function() {
    return Meteor.user();
};

Template.dashboard.showDynamicContent = function() {
    Session.set('innerTemplate', Meteor.user().roles[0] + 'dashboard');
    return Template[Session.get("innerTemplate")]();
};

Template.tutordashboard.currentlyTutoring = function() {
    return WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
};

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    }
});

Template.tutordashboard.events({
    'click #tutorButton': function() {
        var visit = WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
        if (visit) {
            WorkVisits.update({_id: visit._id}, {$set: {timeOut: new Date()}});
        } else {
            WorkVisits.insert({tutorId: Meteor.userId(), timeIn: new Date(), timeOut: null});
        }
    }
});

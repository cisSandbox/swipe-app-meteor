/*


    Dashboard hookup


 */

Template.dashboard.showDynamicContent = function() {
    var roles = Meteor.user().roles;
    if (jQuery.inArray('admin', roles) > -1) {
        Session.set('innerTemplate', 'admindashboard');
    } else if (jQuery.inArray('professor', roles)  > -1) {
        Session.set('innerTemplate', 'professordashboard');
    } else if (jQuery.inArray('tutor', roles)  > -1) {
        Session.set('innerTemplate', 'tutordashboard');
    }
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

/*


    Dashboard hookup


 */

Session.set('currentlyTutoring', false);

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
    return Session.get('currentlyTutoring');
};

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    },
    'click #tutorButton': function() {
        if (Session.get('currentlyTutoring')) {
            WorkVisits.update({_id: Session.get('currentlyTutoring')}, {$set: {timeOut: new Date()}});
            Session.set('currentlyTutoring', false);
        } else {
            Session.set('currentlyTutoring', WorkVisits.insert({tutorId: Meteor.userId(), timeIn: new Date(), timeOut: null}));
            // WorkVisits.insert({tutorId: Meteor.userId(), timeIn: new Date(), timeOut: null});
        }
    }
});
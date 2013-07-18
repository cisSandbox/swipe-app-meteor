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

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    }
});


Template.tutordashboard.currentlyTutoring = function() {
    return WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
};


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

Template.admindashboard.users = function() {
    return Meteor.users.find();
};

Template.createuser.roles = function() {
    return Meteor.roles.find();
};

Template.createuser.events({
    'click #inputSubmit': function(e, t) {
        e.preventDefault();
        console.log('click');
        var email     = t.find('#inputEmail').value,
            name      = t.find('#inputName').value,
            shortname = t.find('#inputShortname').value,
            password  = t.find('#inputPassword').value,
            role      = t.find('#inputRole').value;
        Meteor.call('adminCreateUser', {email: email, password: password, profile: {name: name, shortname: shortname}}, role);
    }
});
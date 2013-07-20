/*


    Dashboard hookup


 */

// General dashboard template stuff

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
    },
    'click #tutorqueue': function() {
        Meteor.Router.to('/tutor-queue');
    }
});

// Tutor dashboard stuff

Template.tutordashboard.currentlyTutoring = function() {
    return WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
};

Template.edituser.courses = function() {
    var courses = [];
    _.each(Courses.find().fetch(), function(course) {
        if (_.contains(Meteor.user().profile.canTutor, course.abbr)) {
            courses.push({abbr: course.abbr, selected: true});
        } else {
            courses.push({abbr: course.abbr});
        }
    });
    return courses;
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

Template.edituser.events({
    'click #editUserSubmit': function(e, t) {
        e.preventDefault();
        var name = t.find('#editUserName').value,
            selectedCourses = t.findAll('.canTutor:checked'),
            values = [];
        _.each(selectedCourses, function(c) {
            values.push(c.value);
        });
        Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name, 'profile.canTutor': values}});
        Meteor.Messages.postMessage('success', 'Profile updated successfully');
    }
});

// Admin dashboard stuff

Template.admindashboard.users = function() {
    return Meteor.users.find();
};

Template.userstable.events({
    'click #deleteUser': function() {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            Meteor.call('adminRemoveUser', this._id);
            Meteor.Messages.postMessage('success', 'User removed successfully');
        }
    }
});

Template.createuser.roles = function() {
    return Meteor.roles.find();
};

Template.createuser.events({
    'click #createUserSubmit': function(e, t) {
        e.preventDefault();
        console.log('click');
        var email     = t.find('#createUserEmail').value,
            name      = t.find('#createUserName').value,
            shortname = t.find('#createUserShortname').value,
            password  = t.find('#createUserPassword').value,
            role      = t.find('#createUserRole').value;
        Meteor.call('adminCreateUser', {email: email, password: password, profile: {name: name, shortname: shortname}}, role);
        Meteor.Messages.postMessage('success', 'User created successfully');
    }
});
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
    },
    'click #tutorButton': function() {
        var visit = WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
        if (visit) {
            WorkVisits.update({_id: visit._id}, {$set: {timeOut: new Date()}});
        } else {
            WorkVisits.insert({tutorId: Meteor.userId(), timeIn: new Date(), timeOut: null});
        }
    }
});

Template.dashboard.currentlyTutoring = function() {
    return WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
};

Template.dashboard.canTutor = function() {
    if (Meteor.user().roles[0]) {
        return true;
    }
};


// Tutor dashboard stuff

Template.edituser.courses = function() {
    if (Template.dashboard.canTutor()) {
        var courses = [];
        _.each(Courses.find().fetch(), function(course) {
            if (_.contains(Meteor.user().profile.canTutor, course.abbr)) {
                courses.push({abbr: course.abbr, selected: true});
            } else {
                courses.push({abbr: course.abbr});
            }
        });
        return courses;
    }
};

Template.tutorhistory.tutoredVisits = function() {
    return TutoredVisits.find({tutorName: Meteor.user().profile.name}, {limit: 10});
};

Template.edituser.events({
    'click #editUserSubmit': function(e, t) {
        e.preventDefault();
        var name = t.find('#editUserName').value,
            selectedCourses = t.findAll('.canTutor:checked'),
            values = [];
        _.each(selectedCourses, function(c) {
            values.push(c.value);
        });
        var pictureName = '';
        _.each(t.find('#editPicture').files, function(file) {
            Meteor.saveFile(file, file.name);
            pictureName = file.name;
        });
        if (pictureName) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name, 'profile.canTutor': values, 'profile.picture': pictureName}});
        } else {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name, 'profile.canTutor': values}});
        }
        Meteor.Messages.postMessage('success', 'Profile updated successfully');
    },
    'click #saveNewPassword': function(e, t) {
        e.preventDefault();
        console.log('click');
        Accounts.changePassword(t.find('#oldPassword').value, t.find('#newPassword').value, function(err) {
            if(err) {
                Meteor.Messages.postMessage('error', err);
            } else {
                Meteor.Messages.postMessage('success', 'Password changed successfully');
            }
        });
    }
});

// Admin dashboard stuff

Template.editusers.users = function() {
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
        Meteor.call('adminCreateUser', {email: email, password: password, profile: {name: name, shortname: shortname, picture: null}}, role);
        Meteor.Messages.postMessage('success', 'User created successfully');
    }
});

/*


    Dashboard hookup


 */

// General dashboard template stuff

Template.dashboard.currentUser = function() {
    return Meteor.user();
};

Template.dashboard.isAdmin = Template.maindashboard.isAdmin = function() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
};

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    },
    'click #tutorqueue': function() {
        Meteor.Router.to('/tutor-queue');
    },
    'click #tapoutqueue': function() {
        Meteor.Router.to('/tapout-queue');
    },
    'click #swipescreen': function() {
        Meteor.Router.to('/swipe-screen');
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
    return TutoredVisits.find({tutorId: Meteor.userId()}, {sort: {timeHelped:-1}, limit: 10});
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
    },
    'click #stopworking': function() {
        var visit = WorkVisits.findOne({tutorId: this._id, timeOut: null});
        WorkVisits.update({_id: visit._id}, {$set: {timeOut: new Date()}});
    }
});


Template.userstable.isWorking = function() {
    return WorkVisits.findOne({tutorId: this._id, timeOut: null});
};


Template.createuser.roles = function() {
    return Meteor.roles.find();
};

Template.createuser.events({
    'click #createUserSubmit': function(e, t) {
        e.preventDefault();
        var email     = t.find('#createUserEmail').value.toLowerCase(),
            name      = t.find('#createUserName').value,
            shortname = t.find('#createUserShortname').value,
            password  = t.find('#createUserPassword').value,
            role      = t.find('#createUserRole').value;
        Meteor.call('adminCreateUser', {email: email, password: password, profile: {name: name, shortname: shortname, picture: null}}, role);
        Meteor.Messages.postMessage('success', 'User created successfully');
    }
});

///////////////
// REPORTING //
///////////////

//  --------------  //
//  Tutoring Hours  //
//  --------------  //
Template.hoursWorked.dayWorked = function() {
    var dayWorked   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
        myDays      = WorkVisits.find({tutorId: Meteor.userId(), timeOut:{$not:null}, timeIn:{$gt : new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000))}}, {sort: {timeIn:-1}, limit: 10}).fetch();
    //console.log(myDays);
    _.each(myDays, function(e) {
        dayWorked.push({
            'day'       : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
            'timeIn'    : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'timeOut'   : e.timeOut.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'diff'      : ((e.timeOut - e.timeIn) / (1000 * 60 * 60)).toFixed(1) + ' hours'
        });
    });
    return dayWorked;
};

//  ---------------  //
//  Student History  //
//  ---------------  //
Template.studentHistory.events({
    'click #studentLookupBtn': function(e,t) {
        Session.set('currStudent', t.find('#studentLookupTxt').value);
        Meteor.flush();
    }
});
Template.studentHistory.tutorSession = function(e,t) {
    var session     = [],
        history     = TutoredVisits.find({name: Session.get('currStudent')}, {sort: {timeIn:-1}, limit:10}).fetch();
    //console.log(history);
    _.each(history, function(e) {
        session.push({
            'date'      : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
            'course'    : e.course,
            'tutoredBy' : e.tutorName,
            'notes'     : e.description
        });
    });
    return session;
};














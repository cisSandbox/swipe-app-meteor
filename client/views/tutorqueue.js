/*

    Tutor queue hook-up

 */

Meteor.setInterval(function() {
    var visits = Visits.find({'timeOut': null, 'needHelp': true});
    visits.forEach(function(visit) {
        Visits.update({_id: visit._id}, {$set: {timeDiff: Math.ceil((new Date().getTime() - visit.timeIn) / 216000)}});
    });
}, 10000);

Template.tutorqueue.needHelpStudents = function() {
    var visits = Visits.find({'timeOut': null, 'needHelp': true}).fetch();
    for(var i = 0; i < visits.length; i++) {
        visits[i].name = nameConcat(visits[i].name);
    }
    return visits;
};

// BAD... fix
Template.needhelp.checkFrontScreen = Template.tutorqueue.checkFrontScreen = function() {
    return !Roles.userIsInRole(Meteor.userId(), 'frontScreen');
};

Template.tutorqueue.events({
    'click .back-to-dash': function() {
        Meteor.Router.to('dashboard');
    }
});

Template.needhelp.events({
    'click button': function() {
        Meteor.Router.to('/tutor-form/' + this._id);
    }
});

var nameConcat = function(name) {
    return name.substring(0, name.indexOf(' ') + 2) + '.'; 
};


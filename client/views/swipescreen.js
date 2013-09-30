/*

    Swipe screen hook-up

 */
//var sha1 = require('lib/sha1.js');
var reg = new RegExp('^[0-9|;]+$');
var student;
Session.set("innerTemplate", "useridentry");

Template.swipescreen.showDynamicContent = function() {
    return Template[Session.get("innerTemplate")]();
};

Template.currenttutors.tutors = function() {
    var workVisits = WorkVisits.find({timeOut: null}),
        users = Meteor.users.find(),
        tutorsOnDuty = [];
    if (workVisits) {
        workVisits.forEach(function(workVisit) {
            users.forEach(function(user) {
                if (workVisit.tutorId === user._id) {
                    tutorsOnDuty.push(user);
                }
            });
        });
    }
    return tutorsOnDuty;
};

Template.useridentry.events = {
    'keypress #student-id-entry': function(e) {
        e.preventDefault();
        var character = String.fromCharCode(e.which);
        if (reg.test(character)) {
            e.target.value += character;
        }
        // handle if user is found
        if (e.target.value.length === 8) {
           // log the hash
           var hash = Meteor.sha1('@' + e.target.value);
           //console.log(hash);

            if (Visits.findOne({universityID: hash, timeOut: null})) {
                Meteor.Messages.postMessage('error', 'Student already signed in');
                e.target.value = '';
            } else {
                var s = Students.findOne({universityID: hash});
                if (s) {
                    student = s;
                    Session.set("innerTemplate", "studenthelp");
                } else {
                    Meteor.Messages.postMessage('error', 'Student does not exist');
                    e.target.value = '';
                }
            }
        }
    }
};

Template.swipescreen.events = {
    'keypress body': function(e){
        e.preventDefault();
        var character = String.fromCharCode(e.which);
        console.log(character);
    }
};

Template.studenthelp.studentName = function() {
    return student.name;
};

Template.studenthelp.tutor = function() {
    return student.isTutor === 'true';
};

Template.studenthelp.events({
    'click #noHelp': function() {
        Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: false, universityID: student.universityID});
        location.reload();
    },
    'click #needHelp': function() {
        Session.set("innerTemplate", "courseselection");
    }
});

Template.courseselection.courses = function() {
    return Courses.find();
};

Template.courseselection.events({
    'click button': function(e) {
        Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: true, course: e.target.value, universityID: student.universityID});
        location.reload();
    }
});

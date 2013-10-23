/*

    Swipe screen hook-up

 */

var reg = new RegExp('^[0-9|;]+$')
, student
, flag = false;

Session.set("innerTemplate", "useridentry");

Template.swipescreen.showDynamicContent = function() {
    return Template[Session.get("innerTemplate")]();
};

Template.swipescreen.first_screen = function() {
    return Session.equals("innerTemplate", "useridentry");
};

Template.currenttutors.tutors = function() {
    var workVisits = WorkVisits.find({"timeOut": null}).fetch(),
        users = Meteor.users.find().fetch(),
        tutorsOnDuty = [];
    // console.log(workVisits);
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
        var hash
        , swipe = e.target.value;
        // Case 1: user typed ID,   8 chars
        if (swipe.length === 8 && swipe.indexOf(';') === -1) {
            hash = Meteor.sha1('@' + swipe);
            console.log("hash from typed ID: " + hash);
            checkIfStudentExists(hash, e);           
        }
        // Case 2: user swiped ID,  12 chars
        else if (swipe.length === 12 && flag === false){
            hash = Meteor.sha1('@'+swipe.substring(2, swipe.length - 2));
            console.log("hash from swiped ID: " + hash);
            flag = checkIfStudentExists(hash, e);
        }
    }
};

Template.currenttutors.setSpan = function() {
    var count = WorkVisits.find({timeOut: null}).count();
    if(count <= 3) 
        return 4;
    else if(count === 4)
        return 3;
    else
        return 2;
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


///// Helpers /////
var checkIfStudentExists = function(hash, e) {
    if (Visits.findOne({universityID: hash, timeOut: null})) {
        Meteor.Messages.postMessage('error', 'Student already signed in');
        e.target.value = '';
        return false;
    } else {
        var s = Students.findOne({universityID: hash});
        if (s) {
            student = s;
            Session.set("innerTemplate", "studenthelp");
            return true;
        } else {
            Meteor.Messages.postMessage('error', 'Student does not exist');
            e.target.value = '';
            return false;
        }
    }
};
/////         /////

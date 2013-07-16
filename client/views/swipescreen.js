/*

    Swipe screen hook-up

 */

var reg = new RegExp('^[0-9|;]+$');
var student;
Session.set("innerTemplate", "useridentry");

Template.swipescreen.showDynamicContent = function() {
    return Template[Session.get("innerTemplate")]();
};

Template.currenttutors.tutors = function() {
    var workVisits = WorkVisits.find({timeOut: null});
    var users = Meteor.users.find();
    var tutorsOnDuty = [];
    if(workVisits) {
        workVisits.forEach(function(workVisit) {
            users.forEach(function(user) {
                if(workVisit.tutorId === user._id) {
                   tutorsOnDuty.push(user);
                }
            });
        });
    }
    console.log(tutorsOnDuty);
    return tutorsOnDuty;
};

Template.useridentry.rendered = function() {
    $(this.find('#student-id-entry')).focus();
};

Template.useridentry.events = {
    'keypress #student-id-entry': function(e) {
        e.preventDefault();
        var character = String.fromCharCode(e.which);
        if(reg.test(character)) {
            e.target.value += character;
        }
        // handle if user is found
        if(e.target.value.length === 8) {
            if(Visits.find({universityID: e.target.value, timeOut: null}).count() > 0){
                Meteor.Errors.throw('Student already swiped in');
                e.target.value = '';
            } else {
                var s = Students.findOne({universityID: e.target.value});
                if(s) {
                    student = s;
                    Session.set("innerTemplate", "studenthelp");
                } else {
                    Meteor.Errors.throw('Student does not exist');
                    e.target.value = '';
                }
            }
        }
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
        console.log('no help');
        Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: false, universityID: student.universityID});
        location.reload();
    },
    'click #needHelp': function() {
        console.log('need help');
        Session.set("innerTemplate", "courseselection");
    }
});

Template.courseselection.courses = function() {
    return Courses.find();
};

Template.courseselection.events({
    'click button': function(e) {
        console.log(e.target.value);
        Visits.insert({name: student.name, timeIn: new Date(), timeOut: null, needHelp: true, course: e.target.value});
        location.reload();
    }
});
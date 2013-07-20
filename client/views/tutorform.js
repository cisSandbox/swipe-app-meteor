Template.tutorform.currentVisit = function() {
    return Visits.findOne({_id: Session.get('visitID')});
};

Template.tutorform.tutors = function() {
    // Should pull from currently logged-in user
    // Implement later
    return Meteor.users.find({roles: 'tutor'});
};

Template.tutorform.courseSections = function() {
    var f = Template.tutorform.currentVisit();
    return Courses.findOne({abbr: f.course});
};

Template.tutorform.events({
    'click #inputSubmit': function (e, t) {
        e.preventDefault();
        var name        = t.find("#inputSName").value;
        var tutorName   = t.find("#inputTName").value;
        var course      = Template.tutorform.currentVisit().course;
        var duration    = t.find("#inputDuration").value;
        var description = t.find("#inputDescription").value;
        var section     = t.find("#inputCourseSection").value;
        var timeIn      = Template.tutorform.currentVisit().timeIn;
        var timeHelped  = new Date();
        TutoredVisits.insert({name: name, tutorName: tutorName, course: course, duration: duration, description: description, section: section, timeIn: timeIn, timeHelped: timeHelped});
        Visits.update({_id: Template.tutorform.currentVisit()._id}, {$set: {needHelp: false}});
        Meteor.Router.to('/tutor-queue');
    }
});
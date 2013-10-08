Template.tutorform.currentVisit = function() {
    return Visits.findOne({_id: Session.get('visitID')});
};

// Template.tutorform.tutors = function() {
//     // Should pull from currently logged-in user
//     // Implement later
//     return Meteor.users.find({roles: { $in: ['tutor', 'admin'] }});
// };

Template.tutorform.currentUser = function() {
    return Meteor.user();
};

Template.tutorform.courseSections = function() {
    var f = Template.tutorform.currentVisit();
    return Courses.findOne({abbr: f.course});
};

Template.tutorform.events({
    'click #inputSubmit': function (e, t) {
        e.preventDefault();
        var name        = t.find("#inputSName").value,
            tutorName   = t.find("#inputTName").value,
            course      = Template.tutorform.currentVisit().course,
            duration    = t.find("#inputDuration").value,
            description = t.find("#inputDescription").value,
            section     = t.find("#inputCourseSection").value,
            timeIn      = Template.tutorform.currentVisit().timeIn,
            timeHelped  = new Date();
        TutoredVisits.insert({name: name, tutorName: tutorName, course: course, duration: duration, description: description, section: section, timeIn: timeIn, timeHelped: timeHelped, tutorId: Meteor.userId()});
        Visits.update({_id: Template.tutorform.currentVisit()._id}, {$set: {needHelp: false}});
        Meteor.Router.to('/tutor-queue');
    }
});

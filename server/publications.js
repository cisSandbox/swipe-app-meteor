Meteor.publish('students', function() {
    if(this.userId) {
        return Students.find();
    }
});

Meteor.publish('visits', function() {
    if(this.userId) {
        return Visits.find();
    }
});

Meteor.publish('courses', function() {
    if(this.userId) {
        return Courses.find();
    }
});

Meteor.publish('tutoredVisits', function() {
    if(this.userId) {
        return TutoredVisits.find();
    }
});
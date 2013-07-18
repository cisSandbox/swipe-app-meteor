Meteor.publish('students', function() {
    if (this.userId) {
        return Students.find();
    }
});

Meteor.publish('visits', function() {
    if (this.userId) {
        return Visits.find();
    }
});

Meteor.publish('courses', function() {
    if (this.userId) {
        return Courses.find();
    }
});

Meteor.publish('tutoredVisits', function() {
    if (this.userId) {
        return TutoredVisits.find();
    }
});

Meteor.publish('workVisits', function() {
    if (this.userId) {
        return WorkVisits.find();
    }
});

Meteor.publish('users', function() {
    if (Roles.userIsInRole(this.userId, ['admin', 'frontScreen'])) {
        return Meteor.users.find();
    }
});

Meteor.publish('roles', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
        return Meteor.roles.find();
    }
});
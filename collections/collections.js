/*


 definitions of collections and methods on them (could be models/)


 */

Students      = new Meteor.Collection('students');
Visits        = new Meteor.Collection('visits');
Courses       = new Meteor.Collection('courses');
TutoredVisits = new Meteor.Collection('tutoredvisits');
WorkVisits    = new Meteor.Collection('workvisits');


WorkVisits.allow({
    insert: function(userId) {
        return (Roles.userIsInRole(userId, ['admin', 'tutor']));
    },
    update: function(userId) {
        return (Roles.userIsInRole(userId, ['admin', 'tutor']));
    },
    remove: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    }
});

Visits.allow({
    insert: function(userId) {
        return (Roles.userIsInRole(userId, ['admin', 'tutor', 'frontScreen']));
    },
    update: function(userId) {
        return (Roles.userIsInRole(userId, ['admin', 'tutor', 'frontScreen']));
    },
    remove: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    }
});

Students.allow({
    insert: function(userId) {
        return Roles.userIsInRole(userId, 'admin');
    },
    update: function(userId) {
        return Roles.userIsInRole(userId, 'admin');
    },
    remove: function(userId) {
        return Roles.userIsInRole(userId, 'admin');
    }
});

Courses.allow({
    insert: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    },
    update: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    },
    remove: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    }
});

TutoredVisits.allow({
    insert: function(userId) {
        return (Roles.userIsInRole(userId, ['admin', 'tutor']));
    },
    update: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    },
    remove: function(userId) {
        return (Roles.userIsInRole(userId, 'admin'));
    }
});

//
 // Students.insert({name: "Nick Hentschel", shortName: "hentsch_nich", universityID: "03236228"});
 //Students.insert({name: "Harry Bentley", shortName: "bentley_harr", universityID: "21eb611bec07167880324fd513d2ed21226ee9a6"});   //@11111111
 //Students.insert({name: "John Smith", shortName: "smith_john", universityID: "7f4c324fc73fc9d4e7c98eb8472ad511df05de37"});        //@12345678
 //Students.insert({name: "Conner Charlebois", shortName: "charleb_conn", universityID: "a975c4501614e544fb86c2b683d8c1da55fccc06"});        //@03224844

 // Courses.insert({ name: "Intro to IT", abbr: "IT101", sections: [{number: "003", professor: "Frydenberg"}, {number: "001", professor: "Cooprider"}]});
 //Courses.insert({ name: "Intro to Programming", abbr: "CS180", sections: [{number: "001", professor: "Lucas"}]});


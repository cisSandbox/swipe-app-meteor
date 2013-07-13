/*

    
    definitions of collections and methods on them (could be models/)


 */

Students      = new Meteor.Collection('students');
Visits        = new Meteor.Collection('visits');
Courses       = new Meteor.Collection('courses');
TutoredVisits = new Meteor.Collection('tutoredvisits');

// Students.insert({name: "Nick Hentschel", shortName: "hentsch_nich", universityID: "03236228", isTutor: "true"});
// Students.insert({name: "Harry Bentley", shortName: "bentley_harr", universityID: "12345678", isTutor: "false"});

// Courses.insert({ name: "Intro to IT", abbr: "IT101", sections: [{number: "003", professor: "Frydenberg"}, {number: "001", professor: "Cooprider"}]});
// Courses.insert({ name: "Intro to Programming", abbr: "CS180", sections: [{number: "001", professor: "Lucas"}]});
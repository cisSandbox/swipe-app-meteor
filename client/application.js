/*

    
    subscriptions, basic Meteor.startup code


 */

Meteor.absoluteUrl({rootUrl:'http://sandbox.bentley.edu'});

Meteor.subscribe('students');
Meteor.subscribe('courses');
Meteor.subscribe('visits');
Meteor.subscribe('tutoredVisits');
Meteor.subscribe('workVisits');
Meteor.subscribe('users');
Meteor.subscribe('roles');

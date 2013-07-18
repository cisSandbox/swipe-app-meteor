/*

    Tutor queue hook-up

 */

Meteor.setInterval(function() {
    var visits = Visits.find({'timeOut': null, 'needHelp': true});
    visits.forEach(function(visit) {
        Visits.update({_id: visit._id}, {$set: {timeDiff: Math.ceil((new Date().getTime() - visit.timeIn) / 216000)}});
    });
}, 10000);

Template.tutorqueue.needHelpStudents = function() {
    return Visits.find({'timeOut': null, 'needHelp': true});
};
/*

Template.needhelp.timeDiff = function() {
    var today = new Date();
    var diff = Math.ceil((today.getTime() - this.timeIn) / 216000);
    return diff + ' minutes';
};
*/

Template.needhelp.events({
    'click button': function() {
        Meteor.Router.to('/tutor-form/' + this._id);
    }
});
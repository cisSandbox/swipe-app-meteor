/*

    Swipe screen hook-up

 */

Meteor.setInterval(function() {
    var visits = Visits.find({'timeOut': null});
    visits.forEach(function(visit) {
        Visits.update({_id: visit._id}, {$set: {timeDiff: Math.ceil((new Date().getTime() - visit.timeIn) / 216000)}});
    });
}, 10000);

Template.tapoutqueue.signedInStudents = function() {
    return Visits.find({'timeOut': null});
};

Template.student.events({
    'click button': function() {
        Visits.update({_id: this._id}, {$set: {'timeOut': new Date()}});
    }
});
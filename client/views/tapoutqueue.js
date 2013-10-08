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
    var visits = Visits.find({'timeOut': null}).fetch();
    for(var i = 0; i < visits.length; i++) {
        visits[i].name = nameConcat(visits[i].name);
    }
    return visits;
};

Template.student.events({
    'click button': function() {
        Visits.update({_id: this._id}, {$set: {'timeOut': new Date()}});
    }
});

var nameConcat = function(name) {
    return name.substring(0, name.indexOf(' ') + 2) + '.'; 
};

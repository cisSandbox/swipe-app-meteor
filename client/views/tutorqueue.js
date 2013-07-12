/*

    Tutor queue hook-up

 */

Template.tutorqueue.needHelpStudents = function() {
    return Visits.find({'timeOut': null, 'needHelp': true});
};

Template.tutorqueue.students = function() {
    return Visits.find({'timeOut': null, 'needHelp': true}).fetch().length > 0;
};

Template.needhelp.timeDiff = function() {
    var today = new Date();
    var diff = Math.ceil((today.getTime() - this.timeIn) / 216000);
    return diff + ' minutes';
};

setInterval(function() {
    location.reload();
}, 10000);

Template.needhelp.events({
    'click button': function() {
        console.log('hello');
        // Visits.update({_id: this._id}, {$set: {'timeOut': new Date()}});
    }
});
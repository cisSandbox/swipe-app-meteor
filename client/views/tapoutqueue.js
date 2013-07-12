/*

    Swipe screen hook-up

 */

Template.tapoutqueue.signedInStudents = function() {
    return Visits.find({'timeOut': null});
};

Template.student.timeDiff = function() {
	var today = new Date();
	var diff = Math.ceil((today.getTime() - this.timeIn) / 216000);
	return diff + ' minutes';
};

setInterval(function() {
	location.reload();
}, 10000);

Template.student.events({
	'click button': function() {
		Visits.update({_id: this._id}, {$set: {'timeOut': new Date()}});
	}
});
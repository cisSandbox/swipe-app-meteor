/*

    Swipe screen hook-up

 */

var reg = new RegExp('^[0-9|;]+$');

Template.swipescreen.showDynamicContent = function() {
	return Template['useridentry']();
};

Template.useridentry.rendered = function() {
	$(this.find('#student-id-entry')).focus();
};

Template.useridentry.events = {
	'keypress #student-id-entry': function(e) {
		e.preventDefault();
		var character = String.fromCharCode(e.which);
		if(reg.test(character)) {
			e.target.value += character;
			console.log(e.target.value);
		}
		// handle if user is found
		if(e.target.value.length === 8) {
			if(Students.findOne({universityID: e.target.value})) {
				console.log("found");
			} else {
				alert('student does not exist');
			}
		}
	}
};
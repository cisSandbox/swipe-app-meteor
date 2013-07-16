Template.body.events = ({
	'click #close-alert': function() {
		Meteor.Errors.clear();
	}
});
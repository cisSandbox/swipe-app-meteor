Template.body.errors = function() {
	if(Session.get('errors')) {
		return Session.get('errors');
	}
};

Template.body.events = ({
	'click #close-alert': function() {
		Session.set('errors', null);
	}
});
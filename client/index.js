Template.body.errors = function() {
	if(Session.get('errors')) {
		return Session.get('errors');
	}
};
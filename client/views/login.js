Template.login.user = function() {
	if(Meteor.user()) {
		return Meteor.user();
	}
};

Template.login.loginErrors = function() {
	return {'permissionsError': Session.get('permissionsError'), 'loginError': Session.get('loginError')};
};

Template.login.events = ({
	'click #inputSubmit' : function(e, t){
		e.preventDefault();
		var email    = t.find('#inputEmail').value;
		var password = t.find('#inputPassword').value;
		// Trim and validate your fields here.... 

		Meteor.loginWithPassword(email, password, function(err){
			if (err) {
				Session.set('errors', {'loginError': 'Incorrect credentials. Please try again.'});
			} else {
				Session.set('errors', null);
				Meteor.Router.to('/home');
			}
		});
		return false;
	},
	'click #logout': function() {
		Meteor.logout();
	}
});
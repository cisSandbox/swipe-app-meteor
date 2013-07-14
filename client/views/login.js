Template.login.events = ({
	'click #inputSubmit' : function(e, t){
		e.preventDefault();
		var email    = t.find('#inputEmail').value;
		var password = t.find('#inputPassword').value;
		console.log('logging in');
		// Trim and validate your fields here.... 

		Meteor.loginWithPassword(email, password, function(err){
			if (err) {
				alert('login failed');
			} else {
				Meteor.Router.to('/home');
			}
		});
		return false;
	}
});
Meteor.Router.add({
    '/home': 'home',
    '/': 'home',
    '/login': 'login',
    '/swipe-screen': 'swipescreen',
    '/tutor-queue': 'tutorqueue',
    '/tapout-queue': 'tapoutqueue',
    '/tutor-form/:id': function(id) {
        Session.set('visitID', id);
        return 'tutorform';
    },
    '*': 'not_found'
});

var tutorPages       = ['dashboard', 'tutorqueue', 'tapoutqueue', 'home', 'tutorform'];
var professorPages   = ['dashboard', 'home', 'tapoutqueue'];
var frontScreenPages = ['swipescreen', 'tutorqueue', 'tapoutqueue', 'home'];


Meteor.Router.filters({
	'checkLogin': function(page) {
		console.log(page);
		if (Meteor.user()) {
			console.log('logged in');

			if(Roles.userIsInRole(Meteor.user()._id, 'admin')) {
				console.log('admin');
				return page;
			} else if(Roles.userIsInRole(Meteor.user()._id, 'frontScreen') && jQuery.inArray(page, frontScreenPages) > -1) {
				Session.set('errors', null);
				return page;
			} else if(Roles.userIsInRole(Meteor.user()._id, 'professor') && jQuery.inArray(page, professorPages) > -1) {
				Session.set('errors', null);
				return page;
			} else if(Roles.userIsInRole(Meteor.user()._id, 'tutor') && jQuery.inArray(page, tutorPages) > -1) {
				Session.set('errors', null);
				return page;
			} else {
				Session.set('errors', {'permissionsError': 'You do not have permission to access the ' + page + ' page.'});
				return 'login';
			}

		} else {
			return 'login';
		}
	}
});

Meteor.Router.filter('checkLogin', {except: 'login'});

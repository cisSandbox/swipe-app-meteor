Meteor.Router.add({
    '/home': 'home',
    '/': 'home',
    '/login': 'login',
    '/swipe-screen': 'swipescreen',
    '/tutor-queue': 'tutorqueue',
    '/tapout-queue': 'tapoutqueue',
    '/dashboard': 'dashboard',
    '/tutor-form/:id': function(id) {
        Session.set('visitID', id);
        return 'tutorform';
    },
    '*': 'not_found'
});

var tutorPages       = ['dashboard', 'tutorqueue', 'tapoutqueue', 'home', 'tutorform', 'dashboard'];
var professorPages   = ['dashboard', 'home', 'tapoutqueue', 'dashboard'];
var frontScreenPages = ['swipescreen', 'tutorqueue', 'tapoutqueue', 'home'];


Meteor.Router.filters({
	'checkLogin': function(page) {
		if (Meteor.user()) {
			if(Roles.userIsInRole(Meteor.userId(), 'admin')) {
				return page;
			} else if(Roles.userIsInRole(Meteor.userId(), 'frontScreen') && jQuery.inArray(page, frontScreenPages) > -1) {
				return page;
			} else if(Roles.userIsInRole(Meteor.userId(), 'professor') && jQuery.inArray(page, professorPages) > -1) {
				return page;
			} else if(Roles.userIsInRole(Meteor.userId(), 'tutor') && jQuery.inArray(page, tutorPages) > -1) {
				return page;
			} else {
                Meteor.Errors.throw('You do not have permission to access the ' + page + ' page.');
				return 'login'
			}
		} else {
			return 'login';
		}
	}
});

Meteor.Router.filter('checkLogin', {except: 'login'});

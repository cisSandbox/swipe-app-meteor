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

Meteor.Router.filters({
	'checkLogin': function(page) {
		if (Meteor.user()) {

			if(Roles.userIsInRole(Meteor.user()._id, 'admin')) {
				return page;
			} else if(Roles.userIsInRole(Meteor.user()._id, 'frontScreen') && (page === 'swipe-screen' || page === 'tutor-queue' ||  page === 'tapout-queue' ||  page === 'home')) {
				return page;
			}

		} else {
			return 'login';
		}
	},
	'checkAdmin': function(page) {
		if(Roles.userIsInRole(Meteor.user()._id, 'admin')){
			return page;
		}
	}
});

Meteor.Router.filter('checkLogin', {except: 'login'});
// Meteor.Router.filter('checkAdmin', {except: 'login'});

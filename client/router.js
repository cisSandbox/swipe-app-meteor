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
        var goto;
        if (Meteor.user()) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                goto = page;
            } else if (Roles.userIsInRole(Meteor.userId(), 'frontScreen') && _.contains(frontScreenPages, page)) {
                goto = page;
            } else if (Roles.userIsInRole(Meteor.userId(), 'professor') && _.contains(professorPages, page)) {
                goto = page;
            } else if (Roles.userIsInRole(Meteor.userId(), 'tutor') && _.contains(tutorPages, page)) {
                // This is realllllly convoluted. I should fix it.
                var v = !WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
                if (page === 'tutorform' && v) {
                    goto = 'login';
                } else {
                    goto = page;
                }
            } else {
                Meteor.Errors.throw('You do not have permission to access the ' + page + ' page.');
                goto = 'login';
            }
        } else {
            goto = 'login';
        }
        return goto;
    }
});

Meteor.Router.filter('checkLogin', {except: 'login'});

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
var frontScreenPages = ['swipescreen', 'tapoutqueue', 'home'];

// Meteor.Router.filters({
//     'checkLogin': function(page) {
//         var goto;
//         if (Meteor.user()) {
//             if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
//                 goto = page;
//             } else if (Roles.userIsInRole(Meteor.userId(), 'frontScreen') && _.contains(frontScreenPages, page)) {
//                 goto = page;
//             } else if (Roles.userIsInRole(Meteor.userId(), 'professor') && _.contains(professorPages, page)) {
//                 goto = page;
//             } else if (Roles.userIsInRole(Meteor.userId(), 'tutor') && _.contains(tutorPages, page)) {
//                 // This is realllllly convoluted. I should fix it.
//                 var v = !WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
//                 if (page === 'tutorform' && v) {
//                     Meteor.Messages.postMessage('error', 'Tutors must be currently working to access the tutor form page.');
//                     goto = 'login';
//                 } else {
//                     goto = page;
//                 }
//             } else if (page === 'not_found') {
//                 goto = page;
//             } else {
//                 goto = 'login';
//                 Meteor.Messages.postMessage('error', 'You do not have permission to access the ' + page + 'page.');
//             }
//         } else {
//             goto = 'login';
//             Meteor.Messages.postMessage('error', 'You must be logged in to access the ' + page + 'page.');
//         }
//         return goto;
//     }
// });

Meteor.Router.filters({
    'checkLogin': function(page) {
        if(Meteor.user()) {
            return page;
        } else {
            Meteor.Messages.postMessage('error', 'You must be logged in to access the ' + page + 'page.');
            return 'login';
        }
    },
    'checkFrontScreen': function(page) {
        if(Roles.userIsInRole(Meteor.userId(), 'admin') || Roles.userIsInRole(Meteor.userId(), 'frontScreen')) {
            return page;
        } else {
            Meteor.Messages.postMessage('error', 'You must have admin permissions to access the ' + page + ' page.');
            return 'login';
        }
    }
});

Meteor.Router.filter('checkLogin', {except: [ 'not_found', 'login' ]});
Meteor.Router.filter('checkFrontScreen', {only: frontScreenPages});


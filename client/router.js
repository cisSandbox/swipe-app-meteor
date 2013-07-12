Meteor.Router.add({
    '/': 'home',
    '/swipe-screen': 'swipescreen',
    '/tutor-queue': 'tutorqueue',
    '/tapout-queue': 'tapoutqueue',
    '/tutor-form/:id': function(id) {
        Session.set('visitID', id);
        return 'tutorform';
    },
    '*': 'not_found'
});
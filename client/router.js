Meteor.Router.add({
    '/': 'home',
    '/swipe-screen': 'swipescreen',
    '/tutor-queue': 'tutorqueue',
    '/tapout-queue': 'tapoutqueue',
    '*': 'not_found'
});
Meteor.Router.add({
    '/': 'home',
    '/swipe-screen': 'swipe-screen',
    '/tutor-queue': 'tutor-queue',
    '/tapout-queue': 'tapout-queue',
    '*': 'not_found'
});
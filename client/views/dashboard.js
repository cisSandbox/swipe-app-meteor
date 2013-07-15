/*


    Dashboard hookup


 */

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    }
});
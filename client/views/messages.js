Template.flashmessages.messages = function() {
    return Meteor.messages.find();
};

Template.flashmessages.events({
    'click #close-message': function() {
        Meteor.Messages.clearMessage(this._id);
    }
});
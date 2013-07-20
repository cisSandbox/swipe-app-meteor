/*
    Meteor Messaging Lib
    Nick Hentschel
*/

// Local (client-only) collection
Meteor.messages = new Meteor.Collection(null);

Meteor.Messages = {
    'postMessage': function(type, messages) {
        if (!_.isArray(messages)) {
            messages = [messages];
        }
        Meteor.messages.insert({type: type, message: messages});
    },
    'clearMessage': function(id) {
        Meteor.messages.remove({_id: id});
    },
    'clearAllMessages': function() {
        var messages = Meteor.messages.find();
        if (messages.count() > 0) {
            console.log('fired');
            messages.forEach(function(message) {
                Meteor.Messages.clearMessage(message._id);
            });
        }
    }
};
Meteor.methods({
    adminCreateUser: function(user, role) {
        var id = Accounts.createUser(user);
        Roles.addUsersToRoles(id, role);
    },
    adminRemoveUser: function(userId) {
        if (this.userId !== userId) {
            Meteor.users.remove(userId);
        }
    },
    adminUpdateUser: function(userID,role){
        
        Meteor.users.update( { _id: userID }, { $set: { 'roles': role }} );
        
    },
    sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);
   
       // Let other method calls from the same client start running,
       // without waiting for the email sending to complete.
       this.unblock();
   
            Email.send({
              to: to,
              from: from,
              subject: subject,
              text: text
        });
    }
  
  

    
    //admin reports
    
    
    
    
});




/*


    Dashboard hookup


 */

// General dashboard template stuff

Template.dashboard.currentUser = function() {
    return Meteor.user();
};

Template.dashboard.isAdmin = Template.maindashboard.isAdmin = function() {
    return Roles.userIsInRole(Meteor.userId(), 'admin');
};

Template.dashboard.events({
    'click #logout': function() {
        Meteor.logout();
        Meteor.Router.to('/login');
    },
    'click #tutorqueue': function() {
        Meteor.Router.to('/tutor-queue');
    },
    'click #tapoutqueue': function() {
        Meteor.Router.to('/tapout-queue');
    },
    'click #swipescreen': function() {
        Meteor.Router.to('/swipe-screen');
    },
    'click #tutorButton': function() {
        var visit = WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
        if (visit) {
            WorkVisits.update({_id: visit._id}, {$set: {timeOut: new Date()}});
        } else {
            WorkVisits.insert({tutorId: Meteor.userId(), timeIn: new Date(), timeOut: null});
        }
    }
});

Template.dashboard.currentlyTutoring = function() {
    return WorkVisits.findOne({tutorId: Meteor.userId(), timeOut: null});
};

Template.dashboard.canTutor = function() {
    if (Meteor.user().roles[0]) {
        return true;
    }
};


// Tutor dashboard stuff

Template.edituser.courses = function() {
    if (Template.dashboard.canTutor()) {
        var courses = [];
        _.each(Courses.find().fetch(), function(course) {
            if (_.contains(Meteor.user().profile.canTutor, course.abbr)) {
                courses.push({abbr: course.abbr, selected: true});
            } else {
                courses.push({abbr: course.abbr});
            }
        });
        return courses;
    }
};

Template.tutorhistory.tutoredVisits = function() {
    return TutoredVisits.find({tutorId: Meteor.userId()}, {sort: {timeHelped:-1}, limit: 10});
};

Template.edituser.events({
    'click #editUserSubmit': function(e, t) {
        e.preventDefault();
        var name = t.find('#editUserName').value,
            selectedCourses = t.findAll('.canTutor:checked'),
            values = [];
        _.each(selectedCourses, function(c) {
            values.push(c.value);
        });
        var pictureName = '';
        _.each(t.find('#editPicture').files, function(file) {
            Meteor.saveFile(file, file.name);
            pictureName = file.name;
        });
        if (pictureName) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name, 'profile.canTutor': values, 'profile.picture': pictureName}});
        } else {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name, 'profile.canTutor': values}});
        }
        Meteor.Messages.postMessage('success', 'Profile updated successfully');
    },
    'click #saveNewPassword': function(e, t) {
        e.preventDefault();
        Accounts.changePassword(t.find('#oldPassword').value, t.find('#newPassword').value, function(err) {
            if(err) {
                Meteor.Messages.postMessage('error', err);
            } else {
                Meteor.Messages.postMessage('success', 'Password changed successfully');
            }
        });
    }
});

// Admin dashboard stuff

Template.editusers.users = function() {
    return Meteor.users.find();
};

//zhe's code for the boolean
Template.userstable.roles_option = function(){
    
    return Meteor.roles.find();
}




Template.userstable.events({
    
    //added function to change role without deleting the user
    
    'click .changeRole': function() {
            var id = this._id
            var button = document.getElementById("@@@"+id);
            var regular = document.getElementById("@"+id);
            var selection = document.getElementById(id);
            document.getElementById("@@@@"+id).className="btn btn-danger confirm";
            
            //console.log(confirm);
            
        //console.log(this._id);
        
        
        if (String(button.firstChild.data).trim() == "Change Role") {
            
            //this is in the normal view
            
            //set to the right value
            button.firstChild.data = "Cancel";
            
            
            regular.className="hidden";
            selection.className="";
            
            
        }
        else{
            
            //finish the session
            button.firstChild.data= "Change Role";
            
            regular.className="";
            selection.className="hidden";
            
            document.getElementById("@@@@"+id).className="btn btn-danger confirm hidden";
            
            
        }
        
        
        
    },
                  
    'click .confirm' : function(){
        
         //console.log(this._id);
         
         var id = this._id;
         
         //console.log(id);
         
         var select = document.getElementById("@@"+this._id);
         var selection = document.getElementById(id);
         
         var role = select.options[select.selectedIndex].value;
         
         var currentRole = Meteor.users.findOne( {_id : id}).roles;
         
         var regular = document.getElementById("@"+id);
         
         
         if (role==currentRole) {
            alert("The user's role is already "+role);
            
        }
        if(role!=currentRole){
            
            var message = "";
                        
                        //console.log("here");
                        
                        if (role=="admin") {
                            message= "This will grant the adminitrative priviliage to the user";
                        }
                        
                        else{
                             
                            message = "Are you sure to change the current user from "+currentRole+" to "+role+"?";
                          
                        }
                        
                        
                        
           if (window.confirm(message)){
                //console.log(role);
                Meteor.call('adminUpdateUser',id,role);
                
                Meteor.Messages.postMessage('success', 'User Role was Changed successfully');
                document.getElementById("@@@"+id).firstChild.data= "Change Role";
                document.getElementById("@@@@"+id).className="btn btn-danger confirm hidden";
                regular.innerHTML = role;
                regular.className="";
                selection.className="hidden";
                
                
           }
         
         
         
        }
    
    },
    'click #deleteUser': function() {
        if (window.confirm('Are you sure? This cannot be undone.')) {
            Meteor.call('adminRemoveUser', this._id);
            Meteor.Messages.postMessage('success', 'User removed successfully');
        }
    },
    'click #stopworking': function() {
        var visit = WorkVisits.findOne({tutorId: this._id, timeOut: null});
        WorkVisits.update({_id: visit._id}, {$set: {timeOut: new Date()}});
    }
});


Template.userstable.isWorking = function() {
    return WorkVisits.findOne({tutorId: this._id, timeOut: null});
};


Template.createuser.roles = function() {
    return Meteor.roles.find();
};

Template.createuser.events({
    'click #createUserSubmit': function(e, t) {
        e.preventDefault();
        var email     = t.find('#createUserEmail').value.toLowerCase(),
            name      = t.find('#createUserName').value,
            shortname = t.find('#createUserShortname').value,
            password  = t.find('#createUserPassword').value,
            role      = t.find('#createUserRole').value;
        Meteor.call('adminCreateUser', {email: email, password: password, profile: {name: name, shortname: shortname, picture: null}}, role);
        Meteor.Messages.postMessage('success', 'User created successfully');
    }
});

///////////////
// REPORTING //
///////////////

//  --------------  //
//  Tutoring Hours  //
//  --------------  //
Template.hoursWorked.dayWorked = function() {
    var dayWorked   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
        myDays      = WorkVisits.find({tutorId: Meteor.userId(), timeOut:{$not:null}, timeIn:{$gt : new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000))}}, {sort: {timeIn:-1}, limit: 10}).fetch();
    //console.log(myDays);
    _.each(myDays, function(e) {
        dayWorked.push({
            'day'       : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
            'timeIn'    : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'timeOut'   : e.timeOut.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'diff'      : ((e.timeOut - e.timeIn) / (1000 * 60 * 60)).toFixed(1) + ' hours'
        });
    });
    return dayWorked;
};



//  ---------------  //
//  Student History  //
//  ---------------  //
Template.studentHistory.events({
    'click #studentLookupBtn': function(e,t) {
        Session.set('currStudent', t.find('#studentLookupTxt').value);
        Meteor.flush();
    }
});
Template.studentHistory.tutorSession = function(e,t) {
    var session     = [],
        history     = TutoredVisits.find({name: Session.get('currStudent')}, {sort: {timeIn:-1}, limit:10}).fetch();
    //console.log(history);
    _.each(history, function(e) {
        session.push({
            'date'      : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
            'course'    : e.course,
            'tutoredBy' : e.tutorName,
            'notes'     : e.description
        });
    });
    return session;
};

//  -------------  //
//  Admin Reports  //
//  -------------  //




Template.adminReports.rendered = function(){
    
    var courses = getCourses();
    console.log(courses);
    var courses_counts = countTutoredVistisForCourses(courses);
    //Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d"),
        data = {
            labels:courses,
            datasets:[
                {
                    fillColor:"#ffacac",
                    strokeColor:"#ffffff",
                    data:courses_counts
                }
            ]
        },
        myNewChart = new Chart(ctx).Bar(data);
};


Template.adminReports.coursesList = function() {
    
        var courses = [];
        _.each(Courses.find().fetch(), function(course) {
           
                courses.push({
                    
                    'abbr': course.abbr
                    
                });
           
        });
        
        //console.log(courses);
        return courses;

};

Template.adminReports.year = function(){
    
   var result = yearCheck();//client side method
   //console.log(result);
   var year = result[0]["year"];
   
   return year;
}

Template.adminReports.fall_swipes = function(){
    
    return countRecords("swipes","fall");
    
    
}


Template.adminReports.fall_tutoredVisits = function(){
    
    return countRecords("tutoredVisits","fall");
    
}

Template.adminReports.spring_tutoredVisits = function(){
    
    return countRecords("tutoredVisits","spring");
    
}

Template.adminReports.spring_swipes = function(){
    
    return countRecords("swipes","spring");
    
}


Template.adminReports.events({
          
          'click #swipes':function(){
             
             downloadSwipesCSV();
    
          },
          
          'click #tutored_visits' : function(){
            
             downloadTutoredVisitsCSV(); 
            
          },
        
          'click #generateCharts' : function(){
            
             
             var selected_courses = checkRadioButton("course_radio_buttons");
             //console.log(selected_courses);
             
             var selected_courses_counts = countTutoredVistisForCourses(selected_courses);
             
             console.log(selected_courses_counts);
             
             var ctx = document.getElementById("myChart").getContext("2d"),
                data = {
                    labels:selected_courses,
                    datasets:[
                        {
                            fillColor:"#ffacac",
                            strokeColor:"#ffffff",
                            data:selected_courses_counts
                        }
                    ]
                };
            new Chart(ctx).Bar(data, {
                barShowStroke: false
            });
            
            
          }
    
});



//////////////////////////
/////Tutor hours tab for all tutors//////
//////////////////////////



Template.tutorHours.users = function() {
    

    return Meteor.users.find();
};




Template.tutorHours.events({
    'click #go_button': function(){
        
        
        
        //console.log(users);
        
        
        
        var startDate = document.getElementById("start_date").value.toString();
        var toDate = document.getElementById("to_date").value.toString();
        var timeStampSD = convertDateToStamp(startDate);
        var timeStampTD = convertDateToStamp(toDate);
        
        //console.log(timeStampTD);
        //console.log(toDate);
        
        
        if (checkTimeSelection(timeStampSD,timeStampTD)) {
            //code
            
            document.getElementById("email_all").className = "btn btn-success btn-position";
            resetDetailTables();
            
    
        
            var users = getAllUserInfo();
         
         
         
         
            //console.log(users[0]);
            for(var i = 0;i<users.length;i++){
               
               //users[i].id
               
               var dayWorked   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
               myDays= WorkVisits.find({tutorId:users[i].id ,timeIn:{$gt : new Date(timeStampSD)},timeOut:{$lt : new Date(timeStampTD+(24* 60 * 60 * 1000-1))}}).fetch();
               //console.log(myDays);
               _.each(myDays, function(e) {
                   dayWorked.push({
                   'diff'      : ((e.timeOut - e.timeIn) / (1000 * 60 * 60)).toFixed(1)
                   });
               });
               
               //console.log(dayWorked);
               var totalHour = 0;
               for(var k=0;k<dayWorked.length;k++){
                   
                   totalHour=totalHour+parseFloat(dayWorked[k]["diff"]);
                   
               }
               //console.log(totalHour);
               users[i]["totalHour"]= totalHour;
            }
            
            
            
            var general_table_html= "<tr><th>Name</th><th>Email Address</th><th>Total Hours Worked</th><th>Action</th></tr> "
            for(var i = 0; i<users.length;i++){
               
               general_table_html = general_table_html+"<tr><td>"+users[i].name+"</td><td>"+users[i].email+"</td><td>"+users[i].totalHour+'</td><td><button onClick="showDetailTable(this.id)"  class ="btn btn-danger detail self" id='+users[i].id+">Detail</td></tr>";
               
               
            }
            
            document.getElementById("general_table").innerHTML = general_table_html;
       
        
        
      }
        
        
    },
    
    'click #email_all':function(){
        //console.log("here");
        
        var go = confirm("Are you sure to send emails to all users");
        
        if (go) {
            //code
            emailtoAll();
            resetDetailTables();
        }
        
      
    }

});



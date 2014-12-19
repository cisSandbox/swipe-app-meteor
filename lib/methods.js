

convertDateToStamp=function(date){
    
        var arraySD = date.split("-");
        var formatStartDate = arraySD[1]+","+arraySD[2]+","+arraySD[0];
        var timeStampSD = new Date(formatStartDate).getTime();
    
    
        return timeStampSD;
}


checkTimeSelection=function(startStamp, toStamp){
    
    var valid=true;
    
    if (startStamp>toStamp) {
        //code
        Meteor.Messages.postMessage("error","The start date is earlier than the end date");
        valid = false;
        
    }
    
    else if(toStamp>new Date()){
        //code
        
        Meteor.Messages.postMessage("error", "You can't pick a Date in the future");
        valid = false;
        
        
        
    }
    
    else if (isNaN(startStamp)||isNaN(toStamp)) {
        //code
        Meteor.Messages.postMessage("error", "please pick a date");
        valid = false;
    }
    
    return valid;
    
};


showDetailTable=function(id){
        
        //console.log(id)
        var user_id = id
        
        
        
        //    user = Meteor.users.find({_id:id}).fetch();
        
        //get the selected user information
        var user_name = getOneUserInfo(id);
        
        
        
        //_.each(user,function(e){
        //    
        //    user_name.push({
        //        
        //        
        //        'name' : e.profile.name
        //    });
        //});
        
        //console.log(user_name[0].name);
        
        //get the detail information
        //var dayWorked   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
        //myDays      = WorkVisits.find({tutorId: id, timeOut:{$not:null}, timeIn:{$gt : new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000))}}, {sort: {timeIn:-1}}).fetch();
        ////console.log(myDays);
        //_.each(myDays, function(e) {
        //dayWorked.push({
        //    'day'       : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
        //    'timeIn'    : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
        //    'timeOut'   : e.timeOut.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
        //    'diff'      : ((e.timeOut - e.timeIn) / (1000 * 60 * 60)).toFixed(1)
        //    });
        //});
        
        //console.log(dayWorked);
        
        //console.log(parseFloat(dayWorked[3]["diff"])+1);
        
        //form tables
        
        var dayWorked = getHoursWorked(id);
        
        
        var detail_table_html= "<tr><th>Day</th><th>Time In</th><th>Time Out</th><th>Hours Worked</th></tr> "
        
        var totalHour = 0;
        for(var i = 0; i<dayWorked.length;i++){
            
            detail_table_html = detail_table_html + "<tr><td>"+dayWorked[i]["day"]+"</td>"+"<td>"+dayWorked[i]["timeIn"]+"</td>"+"<td>"+dayWorked[i]["timeOut"]+"</td>"+"<td>"+dayWorked[i]["diff"]+" hours"+"</td></tr>"
            totalHour=totalHour+parseFloat(dayWorked[i]["diff"]);
            
        }
        
        //console.log(dayWorked);
        
        //console.log(user_id);
        
        var user_table_html = "<tr><th>User Name</th><th>Total Hours Worked</th><th>Action</th></tr>"
        
        user_table_html+= "<tr><td>"+user_name[0]["name"]+"</td><td>"+totalHour+'</td><td><button id="email_one" class="btn btn-danger" onClick="sendEmailtoOne(\''+user_id+'\')">Email to '+user_name[0]["name"]+'</button><button id="return_general" onclick="resetDetailTables()" style="margin-left:20px;" class="btn btn-danger">Hide</button></td></tr>';
        
        document.getElementById("identity_table").innerHTML= user_table_html;
        
        document.getElementById("individual_table").innerHTML=detail_table_html;
     
}



resetDetailTables=function(){
        
        document.getElementById("individual_table").innerHTML="";
        document.getElementById("identity_table").innerHTML="";
}


formEmailContent=function(dayWorked){
        
        var start_date = document.getElementById("start_date").value;
        var end_date = document.getElementById("to_date").value;
        
        var detail_table_email ="Dear "+user[0].profile.name+":\n\n\n";
        
        if (dayWorked.length==0) {
                //code
                detail_table_email = detail_table_email+ "You do not have any working hours for the Payroll period\n\n"+start_date+" to "+end_date;
        }
        
        else {
                
                
                detail_table_email = detail_table_email+ "Please report your hour in time for the Payroll period:\n\n"+start_date+" to "+end_date+"\n\n"+"Please see the hours record for your reference\n\n";
                 for(var i = 0; i<dayWorked.length;i++){
            
                        detail_table_email = detail_table_email + dayWorked[i]["day"]+"       "+dayWorked[i]["timeIn"]+"       "+dayWorked[i]["timeOut"]+"       "+dayWorked[i]["diff"]+" hours\n";
            
                }
                
        }
        
        
        
        
        
       
        
        detail_table_email = detail_table_email+"\n\nbest regards\n\nSandbox Administrator"
        
        return detail_table_email
        
        
}

emailtoAll=function(){
        
        
        var users = getAllUserInfo();
        var i;
        for (i=0; i<users.length;i++){
                
                sendEmailtoOne(users[i].id);
                console.log((i+1)+" completed");
                
        }
        
        alert((i+1)+" message sent");
        
        
        
}



sendEmailtoOne=function(id){
        
        
        
        var dayWorked = getHoursWorked(id);
        
        var user = getOneUserInfo(id);
        
        var email = user[0].email;
        
        //console.log(user);
        
        var detail_table_email=formEmailContent(dayWorked); 
        
       
        
        Meteor.call('sendEmail',
            email,
            'cissandbox@bentley.edu',
            'Please report your hours',
            detail_table_email);
        
        //console.log("here");
      
        
        
        
}





//methods to get information from database


getHoursWorked=function(id){
        
        
        
        var dayWorked   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
        myDays      = WorkVisits.find({tutorId: id, timeOut:{$not:null}, timeIn:{$gt : new Date(new Date().getTime() - (14 * 24 * 60 * 60 * 1000))}}, {sort: {timeIn:-1}}).fetch();
        //console.log(myDays);
        _.each(myDays, function(e) {
        dayWorked.push({
            'day'       : e.timeIn.toLocaleDateString('en-US', {weekday:'short', month:'short', day:'numeric'}),
            'timeIn'    : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'timeOut'   : e.timeOut.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
            'diff'      : ((e.timeOut - e.timeIn) / (1000 * 60 * 60)).toFixed(1)
            });
        });
        
        
        return dayWorked;
        
}

getOneUserInfo = function(id){
        
        
        
        var user_name = [];
        user = Meteor.users.find({_id:id}).fetch();
        _.each(user,function(e){
            
            user_name.push({
                
                'id' :e._id,
                'name' : e.profile.name,
                'email': e.emails[0].address
            });
        });
        
        
        return user_name;
        
        
}

getAllUserInfo = function(){
        
        
        var users=[],
            userRaw = Meteor.users.find().fetch();
            _.each(userRaw,function(e){
                users.push({
               
               'id' : e._id,
               'email': e.emails[0].address,
               'name':e.profile.name
               
           });
       
        });      
        return users;
        
        
}



//admin report stuff

  
//check which part of which year we are currently in and return the right type of time period
//used in current year display and export time range selection
yearCheck=function(){
    
    var result=[];
    
    var date = new Date();
    var month = date.getMonth();
    var type;
    //console.log(date.getFullYear());
    var year;
    
    //console.log(month);
    //month = 5;
    if (month <= 8) {
        year = (date.getFullYear()-1)+"-"+date.getFullYear();
        type = "cross_year";
    }
    else{

        year = date.getFullYear();
        type = "same_year";
    }
    
    result.push({
       
       'year' : year,
       'type' : type
        
        
    });
    
    //console.log(result);
    return result
    
  }
  
  
//download the data to csv for swipes information

downloadSwipesCSV = function(){
        
        //console.log("here");
               
              var visits   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
                  allVisits   = Visits.find().fetch();
                    //console.log(myDays);
                    _.each(allVisits, function(e) {
                        visits.push({
                            'id'       : e._id,
                            'course'    : e.course,
                            'name'   : e.name,
                            'needHelp'      : e.needHelp,
                            'timeDiff' : e.timeDiff,
                            'timeIn' : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'})
                            
                        });
              });
                    
               //console.log(visits);
             
               
                          
                          // prepare CSV data
                          var csvData = new Array();
                          csvData.push('"id","course","name","needHelp","timeDiff","timeIn"');
                          visits.forEach(function(item, index, array) {
                            csvData.push('"' + item.id + '","' + item.course+ '","' + item.name
                                             + '","' + item.needHelp+ '","' + item.timeDiff+ '","' + item.timeIn
                                             +  '"');
                          });
                          
                          // download stuff
                          var fileName = "swipes.csv";
                          var buffer = csvData.join("\n");
                          var blob = new Blob([buffer], {
                            "type": "text/csv;charset=utf8;"			
                          });
                          var link = document.getElementById("swipes_download");
                          console.log(link);                     
                          if(link.download !== undefined) { // feature detection
                            // Browsers that support HTML5 download attribute
                            link.setAttribute("href", window.URL.createObjectURL(blob));
                            link.setAttribute("download", fileName);
                           }
                          else {
                            // it needs to implement server side export
                            Meteor.Messages.postMessage('error', "Browser doesn't support download");
                          }
                          link.setAttribute("class","");
                          
                         
        
        
}


//download the data to csv for Tutored visits information

downloadTutoredVisitsCSV = function(){
        
        //console.log("here");
               
              var tutoredVisits   = [],   // {"day":"", "timeIn":"", "timeOut":"", "diff":""} 
                  allVisits   = TutoredVisits.find().fetch();
                  console.log(allVisits);
                    _.each(allVisits, function(e) {
                        tutoredVisits.push({
                              
                            'id'       : e._id,
                            'StudentName'    : e.name,
                            'TutorName'   : e.tutorName,
                            'course' : e.course,
                            'duration'      : e.duration,
                            'description' : e.description,
                            'timeIn' : e.timeIn.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
                            'timeHelped' : e.timeHelped.toLocaleTimeString('en-US', {hour12: true, hour:'2-digit', minute:'2-digit'}),
                        });
              });
                    
               //console.log(visits);
             
               
                          
                          // prepare CSV data
                          var csvData = new Array();
                          csvData.push('"id","StudentName","TutorName","course","Duration","Description","timeIn","timeHelped"');
                          tutoredVisits.forEach(function(item, index, array) {
                            csvData.push('"' + item.id + '","' +item.StudentName + '","' +item.TutorName
                                             + '","' +item.course+ '","' + item.duration
                                             + '","' + item.description+ '","' + item.timeIn+ '","' + item.timeHelped
                                             + '"');
                          });
                          
                          // download stuff
                          var fileName = "tutorCases.csv";
                          var buffer = csvData.join("\n");
                          var blob = new Blob([buffer], {
                            "type": "text/csv;charset=utf8;"			
                          });
                          var link = document.getElementById("tutored_visits_link");
                          console.log(link);                     
                          if(link.download !== undefined) { // feature detection
                            // Browsers that support HTML5 download attribute
                            link.setAttribute("href", window.URL.createObjectURL(blob));
                            link.setAttribute("download", fileName);
                           }
                          else {
                            // it needs to implement server side export
                            Meteor.Messages.postMessage('error', "Browser doesn't support download");
                          }
                          link.setAttribute("class","");
                          
                          //document.body.appendChild(link);
        
        
}

timeFormation=function(semester,year){
            
            var DateSet = [];
            //console.log("here");
            var startDate, endDate;
            var startMonth, endMonth;
            
            if (semester === "fall") {
                
                startDate = year+"-"+"9"+"-"+"1";
                endDate = year+"-"+"12"+"-"+"24";
                
            }
            else if (semester === "spring") {
                
                startDate = year+"-"+1+"-"+15;
                endDate = year+"-"+5+"-"+20;
                
            }
            
            DateSet = [convertDateToStamp(startDate),convertDateToStamp(endDate)];
            
            //console.log(DateSet);
            
            return DateSet;
        
}

//count the records on admin report based on the type of report and semester provided, return the number of rows returned
countRecords = function(applicationType,semester){
        //console.log("here");
        var year = yearCheck();
        var queryHeader;
        //console.log(semester+year[0].year);
        var startEndDate = timeFormation(semester,year[0].year);
        //console.log(startEndDate);
        
        if (applicationType ==="tutoredVisits") {
                //code
                queryHeader = TutoredVisits;
        }
        else if (applicationType ==="swipes") {
                //code
                queryHeader = Visits;
        }
        var fall_tutoredVisits = queryHeader.find({timeIn:{$gt: new Date(startEndDate[0]),$lt: new Date(startEndDate[1])}}).count();
        
        return fall_tutoredVisits;
            
            
        
}


//check the selected radio button

checkRadioButton=function(radio_name){
        
        var radio_buttons = document.getElementsByName(radio_name);
        var selected_course=[];
        for (var i = 0; i<radio_buttons.length;i++){
                
                if (radio_buttons[i].checked) {
                        //code
                        selected_course.push(radio_buttons[i].value);
                }
                
        }
        
        return selected_course;
        
        
}
//get all of the courses

getCourses = function(){
        
        var courses = [];
        _.each(Courses.find().fetch(), function(course) {
           
                courses.push(course.abbr)
           
        });
        
        return courses
        
}

//check the count for courses in chart
countTutoredVistisForCourses=function(selected_courses){
        
        var data = [];
        
        for(var i = 0;i <selected_courses.length;i++){
                
                var count = TutoredVisits.find({course : selected_courses[i]}).count();
                console.log(selected_courses[i])
                console.log(count);
                data.push(count);
                
        }
        
        return data;
        
}

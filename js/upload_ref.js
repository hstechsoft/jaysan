
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   const firebaseConfig = {
    apiKey: "AIzaSyArBOz33-zRE8lMCj7d8mlzytL4hH6OSNQ",
    authDomain: "jaysan-8fa8d.firebaseapp.com",
    databaseURL: "https://jaysan-8fa8d-default-rtdb.firebaseio.com",
    projectId: "jaysan-8fa8d",
    storageBucket: "jaysan-8fa8d.appspot.com",
    messagingSenderId: "1077120566221",
    appId: "1:1077120566221:web:17e8bd20996c16bcc8fa84",
    measurementId: "G-6JNJZT1YCV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  var dataArray = [];
  var currentIndex = 1;
$(document).ready(function(){
  $('#spinner').hide();
  $('#cus_upload_btn').hide();
  get_work_type();

  check_login();
  get_employee();
  var filePath ="";

 
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
   $('#cus_upload_in').on('click',function (e)
   {
    console.log($("#work_type_list").val())
    

    
    if($("#work_type_list").val()=="0"  ||  $("#sel_usr_in").val()=="Select User..." )
       {
        salert("Error", "Please Choose File and select user", "warning");
        e.preventDefault()
        e.stopPropagation();
       }
   
   });
  $('#cus_upload_in').on('change',function ()
  {
    $('#cus_upload_btn').hide();
   
    var filename= $(this).val();
    var property =this.files[0];
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();



    if(jQuery.inArray(file_extension,['csv','']) == -1){
      alert("Invalid CSV file");
    }
   else
   {
    $('#cus_upload_btn').hide();
       
    
    $('#cus_upload_in').parse({
			config: {
				delimiter: "auto",
				complete: displayHTMLTable,
			},
			before: function(file, inputElem)
			{
				
        $('#cus_upload_btn').hide();
     
			},
			error: function(err, file)
			{
				
			},
			complete: function()
			{
				
        $('#cus_upload_btn').show();
       
			}
		});

    filePath = filename.replace(/^.*\\/, "");
   }

    // else{
    //     var form_data = new FormData();
    //     form_data.append("file",property);

    //     $.ajax({
    //         url:'ref.php',
    //         method:'POST',
    //         data:form_data,
    //         contentType:false,
    //         cache:false,
    //         processData:false,
    //         beforeSend:function(){
    //         //  $('#msg').html('Loading......');
    //         console.log('Loading......');
    //         },
    //         success:function(data){
    //           console.log(data);
    //          // $('#msg').html(data);
    //         }
    //       });
        
    // }

        // filePath = filename.replace(/^.*\\/, "");
         
        // console.log(filePath);
  });

  
  $('#cus_upload_btn').click('change',function ()
  {
    console.log($("#work_type_list").val())
       if($("#work_type_list").val()=="0" ||  $("#sel_usr_in").val()=="Select User..." )
       {
        salert("Error", "Please Choose File and select user", "warning");
       }
       else{
var count =0;
var rowCount = $('#excel_table tr').length;

const numRows = $('#excel_table tr').length ;
for (let currentRow = 1; currentRow <= numRows; currentRow++) {
        // $('#excel_table > tr').each(function() { 

        const $currentRow = $('#excel_table tr:eq(' + currentRow + ')');
          count =count+1
          //table content
         
       var edate = $.trim($currentRow.find("td").eq(1).html())
         var cus_name = $.trim($currentRow.find("td").eq(2).html())
         var cus_company_name = $.trim($currentRow.find("td").eq(3).html())
         var cus_phone = $.trim($currentRow.find("td").eq(4).html())
         var cus_address = $.trim($currentRow.find("td").eq(5).html())
         var cus_email = $.trim($currentRow.find("td").eq(6).html())
         var cus_lead_source = $.trim($currentRow.find("td").eq(7).html())
         var cus_location = $.trim($currentRow.find("td").eq(8).html())
         var status_p = $.trim($currentRow.find("td").eq(9).html())
         var cus_type = $.trim($currentRow.find("td").eq(10).html())
         var cus_need = $.trim($currentRow.find("td").eq(11).html())
         var cus_gst = $.trim($currentRow.find("td").eq(12).html())
         var  col_count = count
          
        
          upload_cus_sql(edate,cus_name,cus_company_name,cus_phone,cus_address,cus_email,cus_lead_source,cus_location,cus_type,cus_need,cus_gst,col_count,status_p)
var per = (count/rowCount)*100
updateProgressBar(per);

    


        //  ;
       }
      }
  });



  


  

   });

   function updateProgressBar(per) {
    
    $('.progress-bar').css('width', `${per}%`);
    $('.progress-bar').text(`${per.toFixed(2)}%`);
  }
   function displayHTMLTable(results){
  
       console.log(results)

     dataArray = results.data;
     processNextItem();
//     for(var i=1;i<data.length;i++){
       
//         var row = data[i];
//         var cells = row.join(",").split(",");
       
 
//         // $("#excel_table").append(" <tr> <td>"+ i + "</td> <td>"+ cells[0] + "</td> <td>"+ cells[1] + "</td> <td>"+ cells[2] + "</td> <td>"+ cells[3] + "</td> <td>"+ cells[4] + "</td> <td>"+ cells[5] + "</td> <td>"+ cells[6] + "</td> <td>"+ cells[7] + "</td> <td>"+ cells[8] + "</td> <td>"+ cells[9] + "</td> <td>"+ cells[10] + "</td><td>"+ cells[11] + "</td></tr>")
       
    
  
      
//     var edate = cells[0]
//     var cus_name = cells[1]
//     var cus_company_name = cells[2]
//     var cus_phone = cells[3]
//     var cus_address = cells[4]
//     var cus_email = cells[5]
//     var cus_lead_source = cells[6]
//     var cus_location = cells[7]
//     var status_p = cells[8]
//     var cus_type =cells[9]
//     var cus_need = cells[10]
//     var cus_gst = cells[11]
//     var  col_count = data.length-1
     
   
//      upload_cus_sql(edate,cus_name,cus_company_name,cus_phone,cus_address,cus_email,cus_lead_source,cus_location,cus_type,cus_need,cus_gst,col_count,status_p)
//  var per = (i/col_count)*100
// //  updateProgressBar(per);
//  console.log(per)
//  $("#de").text(per);
//  document.getElementById("de").innerHTML = per;
//   }


  
}


function processNextItem() {
  if (currentIndex < dataArray.length-1) {
    // Process the current item here
    // Update UI for this iteration
    var row = dataArray[currentIndex];
        var cells = row.join(",").split(",");
       
 
        // $("#excel_table").append(" <tr> <td>"+ i + "</td> <td>"+ cells[0] + "</td> <td>"+ cells[1] + "</td> <td>"+ cells[2] + "</td> <td>"+ cells[3] + "</td> <td>"+ cells[4] + "</td> <td>"+ cells[5] + "</td> <td>"+ cells[6] + "</td> <td>"+ cells[7] + "</td> <td>"+ cells[8] + "</td> <td>"+ cells[9] + "</td> <td>"+ cells[10] + "</td><td>"+ cells[11] + "</td></tr>")
       
    
  
      
    var edate = cells[0]
    var cus_name = cells[1]
    var cus_company_name = cells[2]
    var cus_phone = cells[3]
    var cus_address = cells[4]
    var cus_email = cells[5]
    var cus_lead_source = cells[6]
    var cus_location = cells[7]
    var status_p = cells[8]
    var cus_type =cells[9]
    var cus_need = cells[10]
    var cus_gst = cells[11]
    var  col_count = dataArray.length-2
     
   
     upload_cus_sql(edate,cus_name,cus_company_name,cus_phone,cus_address,cus_email,cus_lead_source,cus_location,cus_type,cus_need,cus_gst,currentIndex,status_p)
 var per = (currentIndex/col_count)*100
 updateProgressBar(per);


    currentIndex++;
    setTimeout(processNextItem, 0); // Schedule the next iteration asynchronously
  }
}

function get_employee()
{
 
$.ajax({
  url: "php/get_employee.php",
  type: "get", //send it through get method
 
  success: function (response) {


if (response.trim() != "error") {

  var obj = JSON.parse(response);



  obj.forEach(function (obj) {
  
    
    $("#sel_usr_in").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");



  });

 
}

else {
  salert("Error", "User ", "error");
}


    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}

   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
   }

   function get_work_type()
   {
 $.ajax({
  url: "php/get_work_type.php",
  type: "get", //send it through get method
  data: {
  
   
 
 },
  success: function (response) {
 
 
 if (response.trim() != "error") {
  var obj = JSON.parse(response);
 
 
 
  obj.forEach(function (obj) {
   
    
     $("#work_type_list").append(" <option value='" + obj.work_type_id + "'>" + obj.work_type_name + "</option>");
     
 
  });
 
  
 
 
 }
 
 else {
  salert("Error", "User ", "error");
 }
 
 
    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
 });
 
   }


   function upload_cus_sql(edate,cus_name,cus_company_name,cus_phone,cus_address,cus_email,cus_lead_source,cus_location,cus_type,cus_need,cus_gst,col_count,status_p)
   {
   

$.ajax({
  url: "php/upload_cus1.php",
  async:false,
  type: "get", //send it through get method
  data: {
    
    work_type :  $('#work_type_list :selected').text(),
    sel_user:  $("#sel_usr_in").val(),
    sel_user_name: "upload by  -" + localStorage.getItem("ls_uname"),
    cur_time : get_cur_millis(),
     cus_name : cus_name,
cus_address: cus_address,
cus_company_name: cus_company_name,
cus_email: cus_email,
cus_address: cus_address,
cus_lead_source:cus_lead_source,
cus_location: cus_location,
cus_phone: cus_phone,
cus_type: cus_type,
cus_need: cus_need,
cus_gst: cus_gst,
col_count: col_count,
edate: edate,
status_p:status_p

},


  success: function (response) {


 // location.reload();

$('#upload_sts_txt').val($('#upload_sts_txt').val() + response);

  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }



  

   function get_millis(t)
   {
    
    var dt = new Date(t);
    return dt.getTime();
   }



   function get_cur_millis()
   {
    var dt = new Date();
    return dt.getTime();
   }


   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  


    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    return today;
   }

   function get_today_start_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T00:00"; 

    return get_millis(today)
     
   }


   function get_today_end_millis(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today = year + "-" + month + "-" + day +"T23:59"; 

    return get_millis(today)
     
   }

   function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}
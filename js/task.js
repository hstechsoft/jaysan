
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
  import { getDatabase, ref, set ,onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

  var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var work_cus_id = urlParams.get('work_cus_id');
var task_work_type = urlParams.get('work_type');
var pre_work_id = urlParams.get('pre_work_id');
var listner_id = urlParams.get('listner_id');
var work_des = urlParams.get('work_des');
var lead_source = urlParams.get('lead_source');
console.log(lead_source)
var cus_id = '0';



if(work_des != null)
  {
    $("#work_textbox").val(work_des);

  }


if(work_cus_id != null)
{
  $("#work_for_text").prop('disabled', true);
cus_id = work_cus_id;
}

if(pre_work_id != null)
{
  $('#menu_bar').hide();
  $('#top_bar').hide();
}


$('#service_lead_form').hide();
$('#sales_lead_form').hide(); 
$('#spares_lead_form').hide(); 
$('#restamping_lead_form').hide(); 

console.log(work_cus_id);


var current_user_id =  localStorage.getItem("ls_uid") ;
var current_user_name =  localStorage.getItem("ls_uname") ;  
var selected_work_id = 0;   
var selected_user_id_na = 0;  
var selected_user_id_sa = 0;     
var selected_work_date = 0;
var selected_work_type =0;
var selected_workid_array = [];
var selected_workid_array_sa = [];
var selected_work_id_na = 0;         
var selected_work_date_na = 0;
var selected_work_type_na =0;

var selected_work_id_sa = 0;         
var selected_work_date_sa = 0;
var selected_work_type_sa =0;
var his_comment = "work created"
// 34
$(document).ready(function(){


  $("#assign_others_hide").hide();
  
  $("#sel_usr_in_na1").hide();
  $("#work_date1_na1").hide();

  $("#sel_usr_in_sa1").hide();
  $("#work_date1_sa1").hide();
 check_login();
//  39
get_assigned_work();
get_na_work();

// 40
 get_work_type();
 get_employee();



 
  $('#work_attachment').on('change',function ()
  {
    var filename= $(this).val();
    var property =this.files[0];

    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
{
        var form_data = new FormData();
        form_data.append("file",property);

        $.ajax({
            url:'upload_work_attachment.php',
            method:'POST',
            data:form_data,
            contentType:false,
            cache:false,
            processData:false,
            beforeSend:function(){
            //  $('#msg').html('Loading......');
            console.log('Loading......');
            $('#create_work_btn').prop("disabled",true)
            },
            success:function(data){
              console.log(data);
              
              $('#create_work_btn').prop("disabled",false)
             // $('#msg').html(data);
             salert("Upload Result",data,"success")
            }
          });
        
    }

         var filePath = filename.replace(/^.*\\/, "");
         
        console.log(filePath);
  });

  $('#assign_add_button').click(function() {
    var trlength = $('#work_select_employee_table tr').length;
      if( $('#sel_usr_in').find(":selected").val()>0)
    {
      $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + $('#sel_usr_in').find(":selected").text()+ "</td> <td>" + $('#sel_usr_in').find(":selected").val()+ "</td> </tr> ");
    
      $('#selected_user_count_txt').text(trlength)
      
    }
    
     })


     $('#sel_usr_in').change(function() {
     
      if ($(this).find(":selected").val()!="0")
      {
        get_work($(this).find(":selected").val());
       
      }
      
       });
      

 $('#work_user_selectall_checkbox').change(function() {
  if(this.checked) {
  get_all_employee();
  }
  else
  {
    $("#work_select_employee").empty();
    $('#selected_user_count_txt').text("0")

  }
    
});
 

 $('#assigntoothers_checkbox').change(function() {
  if(this.checked) {
    $("#assign_others_hide").show();
  }
  else

  $("#assign_others_hide").hide();      
});

$('#work_type_list').on('change', function() {

  if($(this).find(":selected").text() =="lead")
  {
    $('#lead_modal').modal('show'); 
  }
  else if ($(this).find(":selected").text() =="phonecall" && lead_source == null) 
  {
    $('#enquiry_modal').modal('show'); 
  }
});

$("#task_form").submit(function(){
  $('#create_work_btn').prop("disabled",true)
});

$("#create_work_btn").click(function()
   {
    //create_work();
    
    if($('#task_form')[0].checkValidity())
  {
    if($('#assigntoothers_checkbox').is(":checked"))
    {
      var count =0;
      var rowCount = $('#work_select_employee_table tr').length-1;
      $("#work_select_employee_table tr:gt(0)").each(function () {
        count = count+1;
        var this_row = $(this);
       
        var emp_id_p = $.trim(this_row.find('td:eq(2)').html())
        var emp_name_p = $.trim(this_row.find('td:eq(1)').html())
his_comment = "work created by " + current_user_name + " and assigned to " + emp_name_p
var reload_p="";

if (count >= rowCount)
{
  reload_p="yes";
}
else{
  reload_p="no";
}



create_work("pending",emp_id_p,his_comment,reload_p,"assign")
    });
   
    

    
    }
    else
    {
      //create_work(); 
      his_comment = "work created by " + current_user_name 
      var reload_p="yes";
     
      create_work("accept",current_user_id,his_comment,reload_p,"create");
      
    }
  }
  
   });
 
$("#selected_clear_btn").click(function()
   {
   
    $("#work_select_employee").empty();
    $('#selected_user_count_txt').text("0");
    $('#work_user_selectall_checkbox').prop('checked', false);
   });
 
   $("#unamed").text(localStorage.getItem("ls_uname"))
  // $("#tlead_att_on").text(localStorage.getItem("ls_uname"))

 

//change autocomplete source when text box changes
  $('#work_for_text').on('input',function(e){
//check the value not empty
    if($('#work_for_text').val() !="")
    {
      $('#work_for_text').autocomplete({
        //get data from databse return as array of object which contain label,value
        source: get_customer_autocomplete(),
        minLength: 2,
        cacheLength: 0,
        select: function(event, ui) {
         
        cus_id = ui.item.cus_id;
      
        } ,
        //display no result 
        response: function(event, ui) {
          if (!ui.content.length) {
              var noResult = { value:"",label:"No results found" };
              ui.content.push(noResult);
          }
      }
      });
    }
   
   });


   $('#work_date').on('change', function() {
  
    if(($('#sel_usr_in').find(":selected").val())!="0" && $('#assigntoothers_checkbox').is(':checked'))
    {

    get_work($('#sel_usr_in').find(":selected").val());

    }

    else{
      get_work(current_user_id);
    }

        });
        
        $('#emp_assign_tbl1').on('click', 'tbody tr td', function(event) {
 
          $('#emp_assign_tbl').find('.text-bg-primary').removeClass('text-bg-primary')
        
         //console.log( $(this).hasClass("text-bg-primary"))
        
         $(this).toggleClass('text-bg-primary');
        //($('#work_table1').find('.text-bg-primary'))
        // $('.text-bg-primary').removeClass('text-bg-primary')
          
           
           selected_work_id = $(this).find('#emp_assign_tbl_work_id').html();
           
           selected_work_date = $(this).find('#emp_assign_tbl_work_date').html();
           selected_work_type = $(this).find('#emp_assign_tbl_work_type').html();
        
           console.log($(this).find('#emp_assign_tbl_work_date'));
          
        });


        $('#emp_na_tbl1').on('click', 'tbody tr td', function(event) {
 
         // $('#emp_na_tbl').find('.text-bg-primary').removeClass('text-bg-primary')
        
          
     
        
         $(this).toggleClass('text-bg-primary');
         console.log( $(this).hasClass("text-bg-primary"))

         if ($(this).hasClass("text-bg-primary")) {
          selected_work_id_na = $(this).find('#emp_na_tbl_work_id').html();
           
          selected_work_date_na = $(this).find('#emp_na_tbl_work_date').html();
          selected_work_type_na = $(this).find('#emp_na_tbl_work_type').html();
          (selected_workid_array.push( $(this).find('#emp_na_tbl_work_id').html()));
      }

      else {
          var array_ind = (selected_workid_array.indexOf( $(this).find('#emp_na_tbl_work_id').html()));
          selected_workid_array.splice(array_ind, 1);
          selected_work_id_na =0;
           
          selected_work_date_na = 0;
          selected_work_type_na = 0;

      }
        //($('#work_table1').find('.text-bg-primary'))
        // $('.text-bg-primary').removeClass('text-bg-primary')
          
          
        
           
          
        });
  
        $('#emp_sa_tbl1').on('click', 'tbody tr td', function(event) {
 
          // $('#emp_sa_tbl').find('.text-bg-primary').removeClass('text-bg-primary')
         
           
      
         
          $(this).toggleClass('text-bg-primary');
         
          if ($(this).hasClass("text-bg-primary")) {
           selected_work_id_sa = $(this).find('#emp_sa_tbl_work_id').html();
            
           selected_work_date_sa = $(this).find('#emp_sa_tbl_work_date').html();
           selected_work_type_sa = $(this).find('#emp_sa_tbl_work_type').html();
           (selected_workid_array_sa.push( $(this).find('#emp_sa_tbl_work_id').html()));
       }
 
       else {
           var array_ind = (selected_workid_array_sa.indexOf( $(this).find('#emp_sa_tbl_work_id').html()));
           selected_workid_array_sa.splice(array_ind, 1);
           selected_work_id_na =0;
            
           selected_work_date_sa = 0;
           selected_work_type_sa = 0;
 
       }
         
           
           
       
            
           
         });

        $('#modify_na_btn').click(function () {
   
          if(selected_work_id_na>0)
          {
            
            $('#modify_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });

        $('#modify_sa_btn').click(function () {
   
          if(selected_work_id_sa>0)
          {
            
            $('#search_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });

        $('#view_history_btn').click(function () {
   
          if(selected_work_id>0)
          {
            get_history_sql(selected_work_id);
            $('#history_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });
      
        $('#view_customer_btn').click(function () {
         
          if(selected_work_id>0)
          {
            get_cus_info_sql(selected_work_id);
            $('#cus_info_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });

        $('#view_history_na_btn').click(function () {
   
          if(selected_work_id_na>0) 
          {
            get_history_sql(selected_work_id_na);
            $('#history_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });
      
        $('#view_customer_na_btn').click(function () {
         
          if(selected_work_id_na>0)
          {
            get_cus_info_sql(selected_work_id_na);
            $('#cus_info_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });

        $('#view_history_sa_btn').click(function () {
   
          if(selected_work_id_sa>0) 
          {
            get_history_sql(selected_work_id_sa);
            $('#history_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });
      
        $('#view_customer_sa_btn').click(function () {
         
          if(selected_work_id_sa>0)
          {
            get_cus_info_sql(selected_work_id_sa);
            $('#cus_info_model').modal('show'); 
          }
          else{
            salert("Select Work","Kindly choose work","warning")
          }
      
      
        });

        $('#modify_control_in').on('change', function() {


          if(  $("#modify_control_in :selected").val() ==  "1")   {
            $("#work_date1_na1").show()
            $("#sel_usr_in_na1").hide()
          }
          else if(  $("#modify_control_in :selected").val() ==  "2")   {
            $("#work_date1_na1").hide()
            $("#sel_usr_in_na1").show()
          }
          else if(  $("#modify_control_in :selected").val() ==  "3")   {
            $("#work_date1_na1").show()
            $("#sel_usr_in_na1").show()
          }
          else if(  $("#modify_control_in :selected").val() ==  "4")   {
            $("#work_date1_na1").hide()
            $("#sel_usr_in_na1").hide()
          }
          else{
            $("#work_date1_na1").hide()
            $("#sel_usr_in_na1").hide()
          }
          
        });
        
        $('#modify_control_in_sa').on('change', function() {


          if(  $("#modify_control_in_sa :selected").val() ==  "1")   {
            $("#work_date1_sa1").show()
            $("#sel_usr_in_sa1").hide()
          }
          else if(  $("#modify_control_in_sa :selected").val() ==  "2")   {
            $("#work_date1_sa1").hide()
            $("#sel_usr_in_sa1").show()
          }
          else if(  $("#modify_control_in_sa :selected").val() ==  "3")   {
            $("#work_date1_sa1").show()
            $("#sel_usr_in_sa1").show()
          }
          
          else{
            $("#work_date1_sa1").hide()
            $("#sel_usr_in_sa1").hide()
          }
          
        });

        
 $('#sel_usr_in_na').change(function() {
  
    if( $('#sel_usr_in_na').find(":selected").val()>0)
  {
    
  selected_user_id_na = $('#sel_usr_in_na').find(":selected").val()
    
  }
  else{
    selected_user_id_na=0
  }
  
   });


   $('#sel_usr_in_sa').change(function() {
  
    if( $('#sel_usr_in_sa').find(":selected").val()>0)
  {
    
  selected_user_id_sa = $('#sel_usr_in_sa').find(":selected").val()
    
  }
  else{
    selected_user_id_sa=0
  }
  
   });


   $('#work_submit_btn_na').click(function () {
    var query_work =""
    var query_history = ""
     var reload_p =""

      if($("#modify_control_in").val() == 0)
      {
        salert("Choose Status" , "Kindly choose Options","warning" )
      }

      else if ($("#modify_control_in").val() == "1")
      {
        if(  $("#work_date1_na").val() =="")
        {
    salert("Choose Date","Kindly Enter Date","warning")
        }
        else{
          var work_date =0;
          work_date = get_millis($("#work_date1_na").val())
          var count =0;
          var rowCount = selected_workid_array.length;
          selected_workid_array.forEach(function (item)
          {
            count = count+1;
            query_work = "UPDATE work SET emp_id  = " +  current_user_id +",work_status = 'accepted',work_assign_status = 'accept',work_date =" +  work_date + " WHERE work_id= " + item

            query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reschduled and accepted by " + current_user_name + " for - " + $('#work_remark_text_na').val() +  "','', " + current_user_id + " , 'accepted')";
           
        
            if (count >= rowCount)
            {
              reload_p="yes";
            }
            else{
              reload_p="no";
            }
            update_na_work_sql(query_work , query_history,"",reload_p);



    });
         
        }
        
      }

      else if ($("#modify_control_in").val() == "2")
      {
        if( selected_user_id_na == 0)
        {
    salert("Select User","Kindly select User","warning")
        }
        else{
          
          var work_date =0;
        
          var count =0;
          var rowCount = selected_workid_array.length;
          selected_workid_array.forEach(function (item)
          {
            count = count+1;
          
            query_work = "UPDATE work SET emp_id  = " +  selected_user_id_na +",work_status = 'assign',work_assign_status = 'pending' WHERE work_id= " + item

            query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reassigned to " + $("#sel_usr_in_na :selected").text() + " for - " + $('#work_remark_text_na').val() +  " by " + current_user_name + "','', " + selected_user_id_na + " , 'accepted')";
           
        
            if (count >= rowCount)
            {
              reload_p="yes";
            }
            else{
              reload_p="no";
            }
            update_na_work_sql(query_work , query_history,"assign",reload_p);



    });
        }
        
      }
      else if ($("#modify_control_in").val() == "3")
      {
        if(  $("#work_date1_na").val() =="" || selected_user_id_na ==0 )
        {
    salert("Choose User/Date","Kindly Enter Date/ User","warning")
        }
        else{
          var work_date =0;
        
          var count =0;
          var rowCount = selected_workid_array.length;
          selected_workid_array.forEach(function (item)
          {
            count = count+1;
           

            query_work = "UPDATE work SET emp_id  = " +  selected_user_id_na +",work_status = 'assign',work_assign_status = 'pending',work_date =" +  get_millis($("#work_date1_na").val()) + " WHERE work_id= " + item

            query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reassigned and reschdule  to " + $("#sel_usr_in_na :selected").text() + " for - " + $('#work_remark_text_na').val() +  " by " + current_user_name + "','', " + selected_user_id_na + " , 'accepted')";
           
        
            if (count >= rowCount)
            {
              reload_p="yes";
            }
            else{
              reload_p="no";
            }
            update_na_work_sql(query_work , query_history,"assign",reload_p);



    });
        }
        
      }
      else if ($("#modify_control_in").val() == "4")
      {
        
        
        var work_date =0;
        work_date = get_millis($("#work_date1_na").val())
        var count =0;
        var rowCount = selected_workid_array.length;
        selected_workid_array.forEach(function (item)
        {
          count = count+1;
          query_work = "UPDATE work SET emp_id  = " +  current_user_id +",work_status = 'accepted',work_assign_status ='accept'  WHERE work_id= " + item

          query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work re-assigned and accepted by " + current_user_name + " for - " + $('#work_remark_text_na').val() +  "','', " + current_user_id + " , 'accepted')";
         
      
          if (count >= rowCount)
          {
            reload_p="yes";
          }
          else{
            reload_p="no";
          }
          update_na_work_sql(query_work , query_history,"",reload_p);



  });
        
      }
     
    
     
      });


      $('#work_submit_btn_sa').click(function () {
        var query_work =""
        var query_history = ""
         var reload_p =""
    
          if($("#modify_control_in_sa").val() == 0)
          {
            salert("Choose Status" , "Kindly choose Options","warning" )
          }
    
          else if ($("#modify_control_in_sa").val() == "1")
          {
            if(  $("#work_date1_sa").val() =="")
            {
        salert("Choose Date","Kindly Enter Date","warning")
            }
            else{
              var work_date =0;
              work_date = get_millis($("#work_date1_sa").val())
              var count =0;
              var rowCount = selected_workid_array_sa.length;
              selected_workid_array_sa.forEach(function (item)
              {
                count = count+1;
                query_work = "UPDATE work SET emp_id  = " +  current_user_id +",work_status = 'accepted',work_assign_status = 'accept',work_date =" +  work_date + " WHERE work_id= " + item
    
                query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reschduled  by " + current_user_name + " for - " + $('#work_remark_text_sa').val() +  "','', " + current_user_id + " , 'accepted')";
               
            
                if (count >= rowCount)
                {
                  reload_p="yes";
                }
                else{
                  reload_p="no";
                }
                update_sa_work_sql(query_work , query_history,"",reload_p);
    
    
    
        });
             
            }
            
          }
    
          else if ($("#modify_control_in_sa").val() == "2")
          {
            if( selected_user_id_sa == 0)
            {
        salert("Select User","Kindly select User","warning")
            }
            else{
              
              var work_date =0;
            
              var count =0;
              var rowCount = selected_workid_array_sa.length;
              selected_workid_array_sa.forEach(function (item)
              {
                count = count+1;
              
                query_work = "UPDATE work SET emp_id  = " +  selected_user_id_sa +",work_status = 'assign',work_assign_status = 'pending' WHERE work_id= " + item
    
                query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reassigned to " + $("#sel_usr_in_sa :selected").text() + " for - " + $('#work_remark_text_sa').val() +  " by " + current_user_name + "','', " + selected_user_id_sa + " , 'accepted')";
               
            
                if (count >= rowCount)
                {
                  reload_p="yes";
                }
                else{
                  reload_p="no";
                }
                update_sa_work_sql(query_work , query_history,"assign",reload_p);
    
    
    
        });
            }
            
          }
          else if ($("#modify_control_in_sa").val() == "3")
          {
            if(  $("#work_date1_sa").val() =="" || selected_user_id_sa ==0 )
            {
        salert("Choose User/Date","Kindly Enter Date/ User","warning")
            }
            else{
              var work_date =0;
            
              var count =0;
              var rowCount = selected_workid_array_sa.length;
              selected_workid_array_sa.forEach(function (item)
              {
                count = count+1;
               
    
                query_work = "UPDATE work SET emp_id  = " +  selected_user_id_sa +",work_status = 'assign',work_assign_status = 'pending',work_date =" +  get_millis($("#work_date1_sa").val()) + " WHERE work_id= " + item
    
                query_history =  "INSERT INTO work_history (work_id,his_date,comments,cus_id,emp_id,his_status)VALUES (" + item + "," + get_cur_millis() + ",'work reassigned and reschdule  to " + $("#sel_usr_in_sa :selected").text() + " for - " + $('#work_remark_text_sa').val() +  " by " + current_user_name + "','', " + selected_user_id_sa + " , 'accepted')";
               
            
                if (count >= rowCount)
                {
                  reload_p="yes";
                }
                else{
                  reload_p="no";
                }
                update_sa_work_sql(query_work , query_history,"assign",reload_p);
    
    
    
        });
            }
            
          }
         
         
        
         
          });
    

          $("#report_search_btn").click(function()
   {
    if(  $("#search_start_date").val() =="" || $("#search_end_date").val() =="")
    {
      salert("Choose Date","Kindly Enter Date","warning")
    }
    else{
      get_sa_work();
    }

   });


   $('#cus_need').change(function() {
    if($(this).find(":selected").text() =="service")
    {
      $('#service_lead_form').show();
      $('#sales_lead_form').hide(); 
      $('#spares_lead_form').hide(); 
      $('#restamping_lead_form').hide(); 
    }
    if($(this).find(":selected").text() =="restamping")
    {
      $('#service_lead_form').hide();
      $('#sales_lead_form').hide(); 
      $('#spares_lead_form').hide(); 
      $('#restamping_lead_form').show(); 
    }
    if($(this).find(":selected").text() =="sales")
    {
      $('#service_lead_form').hide();
      $('#sales_lead_form').show(); 
      $('#spares_lead_form').hide(); 
      $('#restamping_lead_form').hide(); 
    }
    if($(this).find(":selected").text() =="spares")
    {
      $('#service_lead_form').hide();
      $('#sales_lead_form').hide(); 
      $('#spares_lead_form').show(); 
      $('#restamping_lead_form').hide(); 
    }
 
   });

   $("#stamp_renewal_date").focusout(function(){
    var d = new Date()
    var n = d.getMonth()+1
  var q_now = get_quater(n)
  var year_now =   d.getFullYear()

    var restamp_date =  new Date($("#stamp_renewal_date").val())
    n = restamp_date.getMonth()+1
    var q_restamp = get_quater(n)
    var year_restamp =   restamp_date.getFullYear()
    
    var q_year = 4*(year_now-year_restamp)
    var q = (q_now -q_restamp)
    console.log(q+q_year)
    var delay =  parseInt(q)+parseInt(q_year)
    $("#fine_txt").text("quarter Delayed - " + delay)
    
 

  
     });

   $('#lead_submit_btn').on('click', function()
   {
    if($("#cus_need").find(":selected").text() =="service")
    {
      $("#work_textbox").val("service lead : complaint_type - " +  $('#complaint_type').val() +
",brand_name - " +  $('#brand_name').val() +
",amc - " +  $('#amc').val() +
",warranty - " +  $('#warranty').val() + 
",service_type - " +  $('#service_type :selected').text())
$('#lead_modal').modal('hide'); 
    
    }
    if($("#cus_need").find(":selected").text() =="restamping")
    {
      $("#work_textbox").val ("restamping lead : machine_type - " +  $('#machine_type_r').val() + 
      ",platfrom_size - " +  $('#platfrom_size').val() + 
      ",capacity - " +  $('#capacity_r').val() + 
      ",brand_name - " +  $('#brand_name_r').val() + 
      ",stamp_certificate - " +   $('#stamp_certificate :selected').val() + 
      ",need_amc - " +   $('#need_amc :selected').val() + 
      ",need_warranty - " +   $('#need_warranty :selected').val() + 
      ",stamp_plate - " +  $('#stamp_plate :selected').val() + 
      ",stamp_renewal_date - " +  $('#stamp_renewal_date').val())
      $('#lead_modal').modal('hide'); 
    }
    if($("#cus_need").find(":selected").text() =="sales")
    {
      $("#work_textbox").val ("sales lead : existing_machine - "  +  $('#existing_machine :selected').val() +
      ",application - " +  $('#application').val() +
      ",machine_type - " +  $('#machine_type').val() +
      ",platform_size - " +  $('#platform_size').val() +
      ",capacity - " +  $('#capacity').val() +
      ",accuracy - " +  $('#accuracy').val() +
      ",min_weight - " +  $('#min_weight').val() +
      ",budget_value - " +  $('#budget_value').val() +
      ",urgency - "+ $('#urgency :selected').text() +
      "extra_option  - "+  $('#extra_option').val())
      $('#lead_modal').modal('hide'); 
     
    }
    if($("#cus_need").find(":selected").text() =="spares")
    {
      $("#work_textbox").val (  "spares lead :  Spares  - " +  $('#spares_type').val())
      
      $('#lead_modal').modal('hide'); 
    }
 
   });

   $('#enquiry_submit_btn').on('click', function()
   {
   lead_source = $("#lead_source").val()
   $('#enquiry_modal').modal('hide'); 
   console.log(lead_source)
   });



   $('#hot_radio').change(function() {
    if(this.checked) {
     
      $("#work_textbox").val($(this).val())
    }
    
    });

    $('#warm_radio').change(function() {
      if(this.checked) {
       
        $("#work_textbox").val($(this).val())
      }
      
      });

      $('#cold_radio').change(function() {
        if(this.checked) {
         
          $("#work_textbox").val($(this).val())
        }
        
        });

   });

   
   function update_na_work_sql(query_work,query_history,work_assign_status_p,reload_p)
   {
console .log(query_work);
console.log(query_history);
    $.ajax({
      url: "php/update_work_na.php",
      type: "get", //send it through get method
      data: {
        query_work : query_work,
        query_history :query_history
     
    
    },
      success: function (response) {
 console.log(response)
    
 if(work_assign_status_p == "assign")
 {
  if(reload_p =="yes")
  {
    get_android_id_by_userid(selected_user_id_na,"yes","")
  }
  else
  {
    get_android_id_by_userid(selected_user_id_na,"no","")
  }

 }
 else{
  if(reload_p =="yes")
  {
  
    
  // salert("success","work successfully created","success");
   window.location.reload();
  }
 }
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
    });

   }


   function update_sa_work_sql(query_work,query_history,work_assign_status_p,reload_p)
   {
console .log(query_work);
console.log(query_history);
    $.ajax({
      url: "php/update_work_na.php",
      type: "get", //send it through get method
      data: {
        query_work : query_work,
        query_history :query_history
     
    
    },
      success: function (response) {
 console.log(response)
    
 if(work_assign_status_p == "assign")
 {
  if(reload_p =="yes")
  {
    get_android_id_by_userid(selected_user_id_sa,"yes","")
  }
  else
  {
    get_android_id_by_userid(selected_user_id_sa,"no","")
  }

 }
 else{
  if(reload_p =="yes")
  {
  
    
  // salert("success","work successfully created","success");
   window.location.reload();
  }
 }
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
    });

   }

   function get_cus_info_sql(cus_id)
   {
     
   $.ajax({
     url: "php/get_cus_info.php",
     type: "get", //send it through get method
     data: {
      work_id: cus_id,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
   
     obj.forEach(function (obj) {
      
    
     $('#cus_info_name_txt').text(obj.cus_name) 
     $('#cus_info_phone_txt').text(obj.cus_phone) 
     $('#cus_info_addr_txt').text(obj.cus_address) 
     var map_lcation = "https://www.google.com/maps/"
if(obj.cus_location != "")
{

  if(obj.cus_location.search("http") != -1)
  {
    map_lcation = obj.cus_location
  }

}


  
     $("#cus_info_map").prop("href", map_lcation)
   
   
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



   function get_history_sql(cus_id)
   {
     
   $.ajax({
     url: "php/get_history.php",
     type: "get", //send it through get method
     data: {
       cus_id_p: cus_id,
      
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
     var obj = JSON.parse(response);
   
     var count = 0;
     $("#thist").empty();
     obj.forEach(function (obj) {
       count = count+1;
   
   
    
       $("#thist").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.his_date)) + "</td><td >" + obj.comments + "</td></tr>")
   
   
   
   
   
   
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

   function get_na_work()
   {
   
   $.ajax({
     url: "php/get_na_work.php",
     type: "get", //send it through get method
     data: {
       emp_id: current_user_id,
     
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
   
   
   
     if((response.trim() != "0 result"))
     {
   
     
     
       var obj = JSON.parse(response);
   
       var count = 0;
     
       obj.forEach(function (obj) {
         count = count+1;
         var date_color = ""
         var date_icon = ""
        
     
         {
          
             if(parseFloat(obj.work_date) < parseFloat(get_cur_millis())){
                 date_color = "text-danger";
                 date_icon = "fa-calendar-xmark";
                     }
           
               else{
                       date_color = "text-success";
                       date_icon = "fa fa-clock-o";
                     }
         }
         
    
     
         
     
     $("#emp_na_tbl").append(" <tr> <td> <div class='visually-hidden'><p id='emp_na_tbl_work_id'>"+obj.work_id + "</p></div><div class='visually-hidden'><p id='emp_na_tbl_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 id= 'emp_na_tbl_work_type' class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>  <div><p class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p class='p-0 m-0 text-danger fw-bold'>" + obj.emp_name + "</p></div> </div> </td> </tr>");
     
         
       });
     
      
   
    
     }
   
     else{
      $("#emp_na_tbl").append("<p class='text-bg-warning w-100'>No Data  </p>");
     }
     
    
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

   
   function get_sa_work()
   {
    
   $.ajax({
     url: "php/get_sa_work.php",
     type: "get", //send it through get method
     data: {
       emp_id: current_user_id,
       start_date :get_millis($('#search_start_date').val()),
       end_date :get_millis($('#search_end_date').val())
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
   
   
   
     if((response.trim() != "0 result"))
     {
   
     
     
       var obj = JSON.parse(response);
   
       var count = 0;
     
       obj.forEach(function (obj) {
         count = count+1;
         var date_color = ""
         var date_icon = ""
        
     
         {
          
             if(parseFloat(obj.work_date) < parseFloat(get_cur_millis())){
                 date_color = "text-danger";
                 date_icon = "fa-calendar-xmark";
                     }
           
               else{
                       date_color = "text-success";
                       date_icon = "fa fa-clock-o";
                     }
         }
         
    
     
         
     
     $("#emp_sa_tbl").append(" <tr> <td> <div class='visually-hidden'><p id='emp_sa_tbl_work_id'>"+obj.work_id + "</p></div><div class='visually-hidden'><p id='emp_sa_tbl_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 id= 'emp_sa_tbl_work_type' class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>  <div><p class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p class='p-0 m-0 text-danger fw-bold'>" + obj.emp_name + "</p></div> </div> </td> </tr>");
     
         
       });
     
      
   
    
     }
   
     else{
      $("#emp_sa_tbl").append("<p class='text-bg-warning w-100'>No Data  </p>");
     }
     
    
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
   function get_assigned_work()
   {
   
   $.ajax({
     url: "php/get_assigned_accept.php",
     type: "get", //send it through get method
     data: {
       emp_id: current_user_id,
     
   },
     success: function (response) {
   console.log(response)
   
   if (response.trim() != "error") {
   
   
   
     if((response.trim() != "0 result"))
     {
   
     
     
       var obj = JSON.parse(response);
   
       var count = 0;
     
       obj.forEach(function (obj) {
         count = count+1;
         var date_color = ""
         var date_icon = ""
        
     
         {
          
             if(parseFloat(obj.work_date) < parseFloat(get_cur_millis())){
                 date_color = "text-danger";
                 date_icon = "fa-calendar-xmark";
                     }
           
               else{
                       date_color = "text-success";
                       date_icon = "fa fa-clock-o";
                     }
         }
         
    
     
         
     
     $("#emp_assign_tbl").append(" <tr> <td> <div class='visually-hidden'><p id='emp_assign_tbl_work_id'>"+obj.work_id + "</p></div><div class='visually-hidden'><p id='emp_assign_tbl_work_date'>"+obj.work_date + "</p></div> <div class='d-flex justify-content-between mb-2'> <div><h6 id= 'emp_assign_tbl_work_type' class='small m-0 p-0'>" +obj.work_type + "</h6> </div><div><p class='small m-0 p-0'>" + millis_to_date(parseFloat(obj.work_date)) + "</p></div> </div><p class='small text-start'>" + obj.work_description + "</p><div class='d-flex justify-content-between'> <div><h6 class='m-0 p-0 " + date_color + "'><i class='fa-solid " + date_icon + "'></i></h6> </div>  <div><p class='p-0 m-0 text-success'>" + obj.work_status + "</p></div><div><p class='p-0 m-0 text-danger fw-bold'>" + obj.emp_name + "</p></div> </div> </td> </tr>");
     
         
       });
     
      
   
    
     }
   
     else{
      $("#emp_assign_tbl").append("<p class='text-bg-warning w-100'>No Data  </p>");
     }
     
    
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
   
   function get_work(emp_id)
{
console.log(get_date_only_start($("#sdate_in").val()))
$.ajax({
  url: "php/get_emp_work.php",
  type: "get", //send it through get method
  data: {
    emp_id: emp_id,
    start_time : get_date_only_start($("#work_date").val()),
    end_time : get_date_only_end($("#work_date").val())
   
},
  success: function (response) {
console.log(response)
$("#emp_work_report_tbl").empty();

if (response.trim() != "error") {

  if(response.trim() !="0 result")
  {
    var obj = JSON.parse(response);
  
    var count = 0;
   
    obj.forEach(function (obj) {
      count = count+1;


      $("#emp_work_report_tbl").append("  <tr><td > " + count + " </td><td class='text-nowrap' >" + millis_to_date(parseFloat(obj.work_date)) + "</td><td >" + obj.work_type + "</td>><td >" + obj.work_description + "</td></tr>")
  
  
    });

    
  }
  else{
 
    $("#emp_work_report_tbl").append("<tr> <td colspan='4'>No Work  </td> </tr>");
  }
  
 
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


   function get_firebase_email()
   {
    

     const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
 
    const uid = user.email;
    // ...
    $("#fire_demo").text(uid);
    console.log(uid);
  } else {
    // User is signed out
    // ...
  }
});
  
   }

   function create_work(work_assign_status_p,emp_id_p,his_comment_p,reload_p,his_status)
   {  

 
console.log(pre_work_id)

$.ajax({
  url: "php/insert_work.php",
  type: "get", //send it through get method
  data: {
    emp_id : emp_id_p,
    work_date  :get_millis($("#work_date").val()),
    cus_id  : cus_id,
    work_created_by  : current_user_id,
    work_assign_status  : work_assign_status_p,
    work_type  : $('#work_type_list :selected').text(),
    work_status  :his_status,
    work_description  :  $("#work_textbox").val() ,
    work_location  : $("#work_location_textbox").val(),
    work_attachment  : "",
    work_com_status  : "incomplete",
    last_att : get_cur_millis(),
    his_comment :his_comment_p,
    his_status : his_status,
    his_emp_id : current_user_id,
  lead_source : lead_source,
    current_work_id : pre_work_id

},
  success: function (response) {
   console.log(response)
var lis_res = response.trim()
if(listner_id != null)
{
  reload_p = "no"
}
   console.log(work_assign_status_p)
   if(work_assign_status_p == "pending")
   {
    if(reload_p =="yes")
    {
      get_android_id_by_userid(emp_id_p,"yes",lis_res)
    }
    else
    {
      get_android_id_by_userid(emp_id_p,"no",lis_res)
    }
  
   }
   else{
    console.log(listner_id)
    if(reload_p =="yes")
    {
    
    // salert("success","work successfully created","success");
    window.location.reload();
    
    }


    if(listner_id != null)
{
  update_listner(listner_id,lis_res)
}
   }




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});

   }


   function get_android_id_by_userid(userid,reload,lis_res)
   {
     $.ajax({
       url: "php/get_android_id.php",
       async : false,
       type: "get", //send it through get method
       data: {
         emp_id:userid,
            },
       success: function (response) {
      
     
      if (response.trim() != "error") {
       var obj = JSON.parse(response);
      
       var selected_android_id =""
      
       obj.forEach(function (obj) {
       selected_android_id =   obj.emp_phone_id;
                });
      
       const db = getDatabase();
    set(ref(db, 'notify/' + selected_android_id), {
notification: "Work assigned" ,
tme : get_cur_millis()
        }).then(() => {
          if(listner_id != null)
{
  update_listner(listner_id,lis_res)
}
      // Data saved successfully!
      if(reload =="yes")
    {
    // salert("success","work successfully created","success");
     window.location.reload();
    }
    }).catch((error) => {
      // The write failed...
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

   function get_all_employee()
   {
    
   $.ajax({
     url: "php/get_employee.php",
     type: "get", //send it through get method
    
     success: function (response) {
   
   
   if (response.trim() != "error") {
   
     var obj = JSON.parse(response);
   
     var trlength = 0;
   
     obj.forEach(function (obj) {
       trlength = $('#work_select_employee_table tr').length;
      $("#work_select_employee").append(" <tr> <td >"+ trlength+"</td> <td>" + obj.emp_id + "</td> <td>" + obj.emp_name + "</td> </tr> ");

    
   
     });
     $('#selected_user_count_txt').text(trlength)
    
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
       $("#sel_usr_in_na").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
       $("#sel_usr_in_sa").append(" <option value='" + obj.emp_id + "'>" + obj.emp_name + "</option>");
   
   
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
 
  function get_customer_autocomplete()
  {
    
       var cusname =  $('#work_for_text').val() + '%';
   var customer = [];
   var obj = {};
    $.ajax({
      url: "php/get_customer_autocomplete.php",
      type: "get", //send it through get method
      data: {
        cus_name:cusname,
       
    
    },
      success: function (response) {
  console.log("res - " + response)
    
    if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
  

    
  
      obj.forEach(function (obj) {

         object = {
       
          label:obj.cus_name + " - " +  obj.cus_address,
          cus_id : obj.cus_id,
          cus_addr : obj.cus_address,
          value : obj.cus_name

         
          
      };
       customer.push(object);
     
        
      });
     
    
    }
    
    else {
      customer = [];
      var object = {
      
        value:"No data",
        cus_id : "",
        cus_addr : ""
         
    };
     customer.push(object);
     console.log(customer)
   
    }
    
    
        
      },
      error: function (xhr) {
          //Do Something to handle error

          customer = [];
          var object = {
      
            value:"No data",
            cus_id : "",
            cus_addr : ""
             
        };
         customer.push(object);
          
      }
    });

   
    console.log(customer)
   
   
    return customer;
   
  }
  

function get_current_userid_byphoneid()
{
  $.ajax({
    url: "php/get_current_employee_id_byphoneid.php",
    type: "get", //send it through get method
    data: {
      phone_id:phone_id,
     
   
   },
    success: function (response) {
   
   
   if (response.trim() != "error") {
    var obj = JSON.parse(response);
   
   
   
    obj.forEach(function (obj) {
      current_user_id = obj.emp_id;
      current_user_name =  obj.emp_name;
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
  
  function get_work_type()
  {
$.ajax({
 url: "php/get_work_type.php",
 type: "get", //send it through get method
 data: {
 
  

},
 success: function (response) {
console.log(response)

if (response.trim() != "error") {
 var obj = JSON.parse(response);



 obj.forEach(function (obj) {
  
   
    $("#work_type_list").append(" <option value='" + obj.work_type_name + "'>" + obj.work_type_name + "</option>");
    

 });

 if(task_work_type != null && task_work_type != "" )
  {
   $("#work_type_list").removeAttr("selected");
   

   $("#work_type_list").val(task_work_type);
   //$("#work_type_list").prop('disabled', true);

    if(task_work_type == "lead")
    {
      $('#lead_modal').modal('show'); 
    }
   
  }


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
    
    if (localStorage.getItem("logemail") == null && phone_id == null )  {
     window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null )
  {
get_current_userid_byphoneid();
  }

   }

   function get_quater(n)
   {
    var q_now =0
    if(n <= 3)
    { 
     
    q_now =1;
    }
    else if(n<=6 && n>3)
    {
      q_now =2;
    }
    else if(n<=9 && n>6)
    {
      q_now =3;
    }
    else if(n<=12 && n>9)
    {
      q_now =4;
    }

    return q_now;
   }

 



  


  //  get today 

   

   


   
  


   


   





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


   function get_date_only_start(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T00:00"; 
    
    return get_millis(today_start);
   
   }


   function get_date_only_end(dates){
    var date = new Date(dates);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
   
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
 
    var today_start = year + "-" + month + "-" + day +"T23:59:59"; 
    
    return get_millis(today_start);
   
   }
   function get_today_date(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var hour = date.getHours();
    var mins = date.getMinutes();
  
console.log(mins)

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

function update_listner(listner_id,lis_res)
{
  $.ajax({
    url: "php/update_listner.php",
    type: "get", //send it through get method
    data: {
      listner_id :listner_id,
      lis_res :lis_res
  
  },
    success: function (response) {

  console.log(response)
 
  
      
    },
    error: function (xhr) {
        //Do Something to handle error
    }
  });

}
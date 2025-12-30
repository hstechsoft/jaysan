  // Import the functions you need from the SDKs you need
 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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
 
var urlParams = new URLSearchParams(window.location.search);
var work_id = urlParams.get('work_id') 
var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
baseUrl  =baseUrl + "/"
console.log(baseUrl)

$(document).ready(function(){
  

  get_svreport(work_id);
  $("#print_btn").on("click", function()
  {
  
     print();
    // getPDF();
  });

   });
  
 


  //  get today 

   

   
function print()
{
  $('#print').printThis({
  
    
   
  
});

}

   




function get_svreport(work_id)
{



$.ajax({
  url: "php/site_visit_report.php",
  type: "get", //send it through get method
  data: {
    work_id: work_id,
   
},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {



  if((response.trim() != "0 result"))
  {


  
    var obj = JSON.parse(response);

  
    obj.forEach(function (obj) {
  
     $("#cus_name").text("Customer Name : " + obj.cus_name);
     $("#cus_name1").text(obj.cus_name);

     $("#cus_phone").text(obj.cus_phone);
     $("#cus_addr").text(obj.cus_addr);
   
  
     $("#cus_location").attr('href', "https://maps.google.com/?q=" + obj.latti + "," + obj.longi );
  
     $("#industry_type_txt").text(obj.industry_type);
     $("#eb_no_txt").text(obj.eb_no);
     $("#eb_reg_no_txt").text(obj.eb_reg_no);
     $("#eb_amount_txt").text(obj.eb_amount);
     $("#eb_tariff_txt").text(obj.eb_tariff);
     $("#eb_san_load_txt").text(obj.eb_san_load);
     $("#eb_tri_load_txt").text(obj.eb_tri_load);
     $("#type_ins_txt").text(obj.type_ins);
     $("#p2p_dis_txt").text(obj.p2p_dis);
     $("#total_mea_txt").text(obj.total_mea);
     $("#shift_txt").text(obj.shift);
     $("#fund_txt").text(obj.fund);
     $("#cus_rating_txt").text(obj.cus_rating);
     $("#remark_txt").text(obj.remark);
    
     $("#emp_name").text("Employee Name : " + obj.emp_name);
     $("#date").text("Date : " + millis_to_date(parseFloat(obj.sv_date)) );


     $("#company_photo_preview").attr('src', baseUrl + obj.company_photo);
     $("#company_photo_preview").parent().attr('href', baseUrl + obj.company_photo);

     
     $("#vc_photo_preview").attr('src', baseUrl + obj.vc_photo);
     $("#vc_photo_preview").parent().attr('href', baseUrl + obj.vc_photo);


     
     $("#roof_photo_preview").attr('src', baseUrl + obj.roof_photo);
     $("#roof_photo_preview").parent().attr('href',baseUrl +  obj.roof_photo);


     
     $("#ge_photo_preview").attr('src', baseUrl + obj.ge_photo);
     $("#ge_photo_preview").parent().attr('href',baseUrl +  obj.ge_photo);


     
     $("#hs_photo_preview").attr('src', baseUrl + obj.hs_photo);
     $("#hs_photo_preview").parent().attr('href', baseUrl + obj.hs_photo);


     
     $("#site_photo_preview").attr('src', baseUrl + obj.site_photo);
     $("#site_photo_preview").parent().attr('href', baseUrl + obj.site_photo);


     
     $("#ep_photo_preview").attr('src', baseUrl + obj.ep_photo);
     $("#ep_photo_preview").parent().attr('href',baseUrl +  obj.ep_photo);
    });
 
 
  }

  else{
    $("#nodata").empty()
    $("#nodata").append("<p class='text-bg-warning w-100'>No Data  </p>");
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
  
    var today = year + "-" + month + "-" + day +"T"+ hour + ":"+ mins; 
    console.log(mins);

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
        onClose: reload_here        // Removed () from here
   }).then(function () {

    });
}


function reload_here(){
location.reload();
}
function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}
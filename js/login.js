
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
  import { getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail  } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'

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
 var app_phone_id = localStorage.getItem("app_phone_id")
 if(app_phone_id && app_phone_id !== "null")
      {

        $("#app_phone_txt").text("Phone Id-"+app_phone_id);
       

      }



$(document).ready(function(){
  $("#login_btn").attr("disabled", true);
  $("#username").attr("disabled", true);
 
  
    $(document).on("click", ".toggle-password", function () {

        const input = $(this).siblings(".password-input");
        const icon = $(this).find("i");

        if (input.attr("type") === "password") {
            input.attr("type", "text");
            icon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            input.attr("type", "password");
            icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    });

    $("#pass_forget_btn").click(function () {
    $("#pass_forget_btn").attr("disabled", true)
    
    
    reset_firebase_password();
});

    $(".switch-link").click(function(e){
      if(app_phone_id && app_phone_id !== "null")
      {
        $("#login_section").toggleClass("d-none");
        $("#register_section").toggleClass("d-none");
       
       

      }
      else
      {
        salert("Error","Install App ","error")
      }
       
    })



  if (app_phone_id && app_phone_id !== "null") {
    
    get_email_by_phoneid(app_phone_id);
   }
   else
   {
    $("#username").attr("disabled", false);
    $("#login_btn").attr("disabled", false);
   }

   $("#register_btn").on("click", function(event) {
     event.preventDefault();
     register_firebase();
   });
   
   $("#login_btn").click(function(){
//     if( $("#username").val() == "admin@gmail.com"   &&   $("#password").val() == "654321")
//    {

// localStorage.setItem("ls_uid", '0')
// localStorage.setItem("ls_uname", 'Admin')
// localStorage.setItem("logemail", 'admin@gmail.com')

// window.location.href = 'admin_index.html';
//    }
  check_user_approval();
 
        
       }); 
       

   });

   function check_user_approval()
   {
    var email = $("#username").val();
    $.ajax({
      url: "php/check_user_approval.php",
      type: "get", //send it through get method
      data: {
        email: email,
      },
      success: function (response) {
        console.log(response);
        
        if (response.trim() == "yes") {
          login_firebase();
        } else if (response.trim() == "no") {
          salert("Pending Approval", "Your account is pending approval. Please contact the administrator.", "warning");
        } else {
          salert("Error", "User not found or not approved.", "error");
        }
      },
      error: function (xhr) {
          //Do Something to handle error
      }
  });
    }

   function reset_firebase_password()
{
    var email = $("#username").val();

    if(email === ""){
        salert("Error", "Please enter your registered email", "error");
        return;
    }

    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
    .then(() => {
        salert(
            "Success",
            "Password reset link sent to your email. Please check inbox / spam.",
            "success"
        );
    })
    .catch((error) => {
        salert("Error", error.message, "error");
        $("#pass_forget_btn").attr("disabled", false)
    });
}


   function get_email_by_phoneid(phone_id) {
    $.ajax({
        url: "php/get_email_by_phoneid.php",
        type: "get", //send it through get method
        data: {
            phone_id: phone_id,

        },
        success: function (response) {


            if (response.trim() != "error") {
              if(response.trim() != "0 result")
              {
                var obj = JSON.parse(response);


                console.log(response);


                obj.forEach(function (obj) {
                  if(obj.emp_approve != "yes")
                  {
                    salert("Pending Approval", "Your account is pending approval. Please contact the administrator.", "warning");
$("#login_btn").attr("disabled", true);
$("#register_btn").attr("disabled", true);
$("#app_approve_txt").text("Your account is pending approval. Please contact the administrator.");
                  }
                  else if(obj.emp_approve == "yes")
                  {
                    $("#register_btn").attr("disabled", true);
                    $("#username").val(obj.emp_email);
                    $("#username").attr("disabled", true);
                    $("#login_btn").attr("disabled", false);
                    $("#app_approve_txt").text("Approved User");

                  }
                });

                //    get_sales_order()
            }
              else {
                 $("#app_approve_txt").text("No registered user found. Please register.");
            }
            }

          



        },
        error: function (xhr) {
            //Do Something to handle error
        }
    });
}
function register_firebase()
{
    var email = $("#email").val();
    var password = $("#password_reg").val();

    if(email === "" || password === ""){
        salert("Error", "Email and Password required", "error");
        return;
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

        const user = userCredential.user;

        console.log("Registered UID:", user.uid);

       

        salert("Success", "Account created successfully", "success");
        store_registration_details();

    })
    .catch((error) => {
        salert("Error", error.message, "error");
    });
}

function store_registration_details()
{
    var emp_email = $("#email").val();
    var emp_phone = $("#phone").val();
    var emp_name = $("#fullname").val();
    var emp_phone_id = localStorage.getItem("app_phone_id");
   
    $.ajax({
    url: "php/store_registration.php",
    type: "get", //send it through get method
    data: {
      emp_email: emp_email,
      emp_phone: emp_phone,
      emp_name: emp_name,
      emp_phone_id: emp_phone_id
    },
    success: function (response) {
      console.log(response);
      if(response.trim() == "success")
      {
       
        $("#register_btn").attr("disabled", true);
        location.reload();
      }
    },
    error: function (xhr) {
        //Do Something to handle error
    }
});
} 


   function login_firebase()
   {
     
       var email = $("#username").val();
       var password = $("#password").val();
   
       const auth = getAuth();
       signInWithEmailAndPassword (auth, email, password)
     .then((userCredential) => {
       // Signed in 
       const user = userCredential.user;
       // ...
       console.log(user.uid);
       localStorage.setItem("logemail", email);
       load_emp_id(email);
       login_session(email);
      
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;

       salert("Error",  error.message, "error");
       // ..
   
   
       
     });
   
   }
   function login_session(email)
   {
     $.ajax({ 
      url: "php/login.php",
      type: "post", //send it through get method
      data: {
        email: email,
      },
      success: function (response) {
   console.log(response)  
      },
      error: function (xhr) {
          //Do Something to handle error
      }
  });
    }


   function load_emp_id(email)
   {
$.ajax({
  url: "php/get_employee_id.php",
  type: "get", //send it through get method
  data: {
    email: email,
   

},
  success: function (response) {
console.log(response)

if (response.trim() != "error") {
  var obj = JSON.parse(response);

 

  obj.forEach(function (obj) {

      if(obj.emp_role != "null" && obj.emp_approve != "no" )
      {
        localStorage.setItem("ls_uid",obj.emp_id)
        localStorage.setItem("ls_uname",obj.emp_name)
        localStorage.setItem("ls_emp_role",obj.emp_role)
       //get_history_sql();
  if(app_phone_id && app_phone_id !== "null")
       window.location.replace("dashboard_p.html?phone_id="+app_phone_id);
  else
       window.location.replace("user_index.html");
      }
      else
      {
        salert("Not Approved","Kindly Contact Admin","warning")
      }
     
      
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

   function salert(title, text, icon) {
  

    swal({
        title: title,
        text: text,
        icon: icon,
    });
}
   




  //  get today 

   

   


   







   

  





  



   

   




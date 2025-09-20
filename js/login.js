
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

$(document).ready(function(){
 
   $("#login_btn").click(function(){
//     if( $("#username").val() == "admin@gmail.com"   &&   $("#password").val() == "654321")
//    {

// localStorage.setItem("ls_uid", '0')
// localStorage.setItem("ls_uname", 'Admin')
// localStorage.setItem("logemail", 'admin@gmail.com')

// window.location.href = 'admin_index.html';
//    }
   
  {
   login_firebase();
  }
        
       }); 
       

   });

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
      
     })
     .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;

       salert("Error",  error.message, "error");
       // ..
   
   
       
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

   

   


   







   

  





  



   

   




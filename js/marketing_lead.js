// updated For App


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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
const db = getDatabase(app);
const demoRef = ref(db, 'demo');

onValue(demoRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(data);

    // Example: access name
    console.log(data.name); // harish
  } else {
    console.log("No data found");
  }
});

window.onLocationReceived = function (lat, lng) {
  console.log("GPS Location received:", lat, lng);
  // alert("GPS Location received:\nLatitude: " + lat + "\nLongitude: " + lng);
  // Example: Show it in an alert or update your UI
  // alert("Latitude: " + lat + "\nLongitude: " + lng);

  // You can now use lat and lng for your business logic
  // For example, update a hidden input or send to your server via AJAX

  if (lat !== undefined && lat !== "" && lng !== undefined && lng !== "") {

    $("#loca").html("Location received: Lat " + lat + ", Lng " + lng);
    $("#lat_input").val(lat);
    $("#lng_input").val(lng);
  } else {
    $("#loca").html(`Current Location: <span id="current_location">Not received yet</span>`);
    swal.fire({
      title: "Warning",
      text: "GPS location not received yet. Please Turn On The Location and try again.",
      icon: "warning",
      confirmButtonText: "OK"
    }).then((result) => {
      if (result.isConfirmed) {
        window.AndroidBridge.openLocationSettings();
      };
    });
  }

};

// End Update






var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
var latti = urlParams.get('latti');
var longi = urlParams.get('longi');
var attach_id = ""
var cus_id = '0';
var current_user_id = localStorage.getItem("ls_uid");
var current_user_name = localStorage.getItem("ls_uname");


$(document).ready(function () {



  // updated For App
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);

      // you can store in localStorage if needed
      localStorage.setItem("firebase_uid", user.uid);

    } else {
      console.log("User is NOT logged in");

      // clear if needed
      localStorage.removeItem("firebase_uid");
    }
  });

  // setTimeout(() => {
  // $("#demo").trigger("click");}, 500);


  AndroidBridge.getLocation();

  // $("#demo").on("click", function (event) {
  //   event.preventDefault();
  //   // TODO: handle click here
  //   AndroidBridge.vibrate(200);
  //   console.log("vibrate");

  //   AndroidBridge.getLocation();
  // });


  $("#qr_btn").on("click", function (event) {
    event.preventDefault();
    console.log(window.AndroidBridge);

    if (window.AndroidBridge) {
      AndroidBridge.openScanner();
    }
  });
  
  $("#lead_attachment_mobile").on("click", function (event) {
    event.preventDefault();

    $("#lat_input").val('');
    $("#lng_input").val('');
    AndroidBridge.getLocation();

    let attempts = 0;

    let checkLocation = setInterval(function () {

      let lat = $("#lat_input").val();
      let lng = $("#lng_input").val();

      if (lat && lng) {
        clearInterval(checkLocation);
        captureWithDbData();
        return;
      }

      attempts++;

      if (attempts >= 10) {
        clearInterval(checkLocation);

        salert(
          "Warning",
          "Unable to get GPS location. Please enable Location and try again.",
          "warning"
        );
      }

    }, 600);
  });

  $("#select_any_file_btn").on("click", function (event) {
    event.preventDefault();
    uploadFile();
  });

  $("#select_pdf_btn").on("click", function (event) {
    event.preventDefault();
    uploadPdf();
  });

  $("#select_image_btn").on("click", function (event) {
    event.preventDefault();
    uploadPhoto();
  });

  // End Update



  check_login();


  $("#mlead_form").submit(function () {
    $("#mlead_add_btn").attr("disabled", true);
  });

  $('#mlead_add_btn').on('click', function () {

    if ($('#mlead_form')[0].checkValidity())
      insert_mlead()

  });


  $('#lead_attachment').on('change', function () {
    var filename = $(this).val();
    var property = this.files[0];
    if (!property) {
      return; // No file selected
    }
    var file_name = property.name;
    var file_extension = file_name.split('.').pop().toLowerCase();
    {
      var form_data = new FormData();
      form_data.append("file", property);
      form_data.append("emp_name", current_user_name)
      // Show the overlay and reset progress bar
      $('#uploadOverlay').removeClass('d-none');
      $('#uploadProgressBar').css('width', '0%').attr('aria-valuenow', 0);

      $.ajax({
        url: 'upload_lead_attachment.php',
        method: 'POST',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function () {
          //  $('#msg').html('Loading......');
          console.log('Loading......');
          $('#mlead_add_btn').prop("disabled", true)
        },
        xhr: function () {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = Math.round((evt.loaded / evt.total) * 100);
              $('#uploadProgressBar').css('width', percentComplete + '%').attr('aria-valuenow', percentComplete);
            }
          }, false);
          return xhr;
        },
        success: function (data) {
          $('#uploadOverlay').addClass('d-none');
          $('#mlead_add_btn').prop("disabled", false)
          attach_id = data.trim();

          // $('#msg').html(data);
          salert("Upload Result", data, "success")
        }
      });

    }

    var filePath = filename.replace(/^.*\\/, "");

    console.log(filePath);
  });








});

function insert_mlead() {


  $.ajax({
    url: "php/insert_mlead.php",
    type: "get", //send it through get method
    data: {
      cus_name: $('#cus_name').val(),
      company_name: $('#company_name').val(),
      address: $('#address').val(),
      phone: $('#phone').val(),
      description: $('#description').val(),
      dated: get_cur_millis(),
      emp_id: current_user_id,
      attach_id: attach_id,
      latti: $("#lat_input").val(),
      longi: $("#lng_input").val()



    },
    success: function (response) {
      console.log(response);

      location.reload()


    },
    error: function (xhr) {
      //Do Something to handle error
    }
  });


}



function get_today_leads() {


  $.ajax({
    url: "php/get_today_lead.php",
    type: "get", //send it through get method
    data: {
      today_start: get_today_start_millis(),
      today_end: get_today_end_millis(),
      emp_id: current_user_id




    },
    success: function (response) {
      console.log(response);

      if (response.trim() != "error") {

        if (response.trim() != "0 result") {
          var obj = JSON.parse(response);

          var count = 0;

          obj.forEach(function (obj) {

            count = count + 1;
            $('#mlead_table').append("<tr><td>" + count + "</td><td>" + obj.cus_name + "</td><td>" + obj.phone + "</td><td>" + obj.description + "</td></tr>")

          });

        }
        else {
          // $("#@id@") .append("<td colspan='4' scope='col'>No Data</td>");
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





function get_customer_autocomplete() {

  var cusname = $('#search_cus_text').val() + '%';
  var customer = [];
  var obj = {};
  $.ajax({
    url: "php/get_customer_autocomplete.php",
    type: "get", //send it through get method
    data: {
      cus_name: cusname,

    },
    success: function (response) {
      console.log("res - " + response)

      if (response.trim() != "0 result") {
        var obj = JSON.parse(response);




        obj.forEach(function (obj) {

          object = {

            label: obj.cus_name + " - " + obj.cus_address,
            cus_id: obj.cus_id,
            cus_addr: obj.cus_address,
            value: obj.cus_name



          };
          customer.push(object);


        });


      }

      else {
        customer = [];
        var object = {

          value: "No data",
          cus_id: "",
          cus_addr: ""

        };
        customer.push(object);
        console.log(customer)

      }



    },
    error: function (xhr) {
      //Do Something to handle error

      customer = [];
      var object = {

        value: "No data",
        cus_id: "",
        cus_addr: ""

      };
      customer.push(object);

    }
  });


  console.log(customer)


  return customer;

}


function get_current_userid_byphoneid() {
  $.ajax({
    url: "php/get_current_employee_id_byphoneid.php",
    type: "get", //send it through get method
    data: {
      phone_id: phone_id,


    },
    success: function (response) {


      if (response.trim() != "error") {
        var obj = JSON.parse(response);



        obj.forEach(function (obj) {
          current_user_id = obj.emp_id;
          current_user_name = obj.emp_name;
          get_today_leads()
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






// updated For App


function uploadPhoto() {
  var myParams = { "user_id": "123", "doc_type": "Photo" };
  // Parameters are passed as the only argument
  AndroidBridge.pickImage(JSON.stringify(myParams));
}


function uploadPdf() {
  var myParams = { "user_id": "123", "doc_type": "PDF" };
  // Parameters are passed as the second argument
  AndroidBridge.pickFile("application/pdf", JSON.stringify(myParams));
}


function captureWithDbData() {
  console.log("capture");

  // var params = {
  //   "emp_name": current_user_name,
  // };

  // if (window.AndroidBridge) {
  //   // Kotlin will take the photo, compress it, 
  //   // and include these params in the POST request to app_upload.php
  //   AndroidBridge.takePhoto(JSON.stringify(params), 'https://jaysan.cloud/upload_lead_attachment.php');
  // }


  if (window.AndroidBridge) {
    // Data you want to save in your MySQL DB along with the file
    var dbParams = JSON.stringify({
      "emp_name": current_user_name,
    });

    // Optional: Override the default upload URL
    var uploadUrl = 'https://jaysan.cloud/upload_lead_attachment.php';

    // Call the app's camera
    window.AndroidBridge.takePhoto(dbParams, uploadUrl);
  }
}


function uploadFile() {
  var myParams = { "user_id": "123", "doc_type": "PDF" };
  // Parameters are passed as the second argument
  if (window.AndroidBridge) {
    AndroidBridge.pickFile("*/*", JSON.stringify(myParams));
  }


}

window.receiveScanResult = function (result) {
  console.log("Scanned result: " + result);

  $("#qr_result").val(result);
};


// Global callbacks called by the Android app
window.onUploadSuccess = function (response) {
  console.log("Upload Success:", response);
  alert("Photo uploaded successfully!");
};

window.onUploadError = function (error) {
  console.error("Upload Error:", error);
  alert("Upload failed. Error code: " + error);
};

// End Update




function check_login() {

  if (localStorage.getItem("logemail") == null && phone_id == null) {
    window.location.replace("login.html");
  }
  else if (localStorage.getItem("logemail") == null && phone_id != null) {
    get_current_userid_byphoneid();
  }


}








//  get today 



















function get_millis(t) {

  var dt = new Date(t);
  return dt.getTime();
}



function get_cur_millis() {
  var dt = new Date();
  return dt.getTime();
}


function get_date_only_start(dates) {
  var date = new Date(dates);

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today_start = year + "-" + month + "-" + day + "T00:00";

  return get_millis(today_start);

}


function get_date_only_end(dates) {
  var date = new Date(dates);

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today_start = year + "-" + month + "-" + day + "T23:59:59";

  return get_millis(today_start);

}
function get_today_date() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var mins = date.getMinutes();

  console.log(mins)

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T" + hour + ":" + mins;
  return today;
}

function get_today_start_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T00:00";

  return get_millis(today)

}




function get_today_end_millis() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  var today = year + "-" + month + "-" + day + "T23:59";

  return get_millis(today)

}

function salert(title, text, icon) {


  swal({
    title: title,
    text: text,
    icon: icon,
  });
}



function millis_to_date(millis) {
  var d = new Date(millis); // Parameter should be long value


  return d.toLocaleString('en-GB');

}

// The following example creates complex markers to indicate beaches near
// Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
// to the base of the flagpole.

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var loca = [[]];
var lastlatti=0
var lastlongi=0;
var lastlevel=0;
var battery = "--";
var ludate = "--";

var count=0;
var firebaseConfig = {
    apiKey: "AIzaSyBPxz_x4MbEGPAWF8pDSW6o5D9iQ5XMuFM",
    authDomain: "jaysonagri123.firebaseapp.com",
    databaseURL: "https://jaysonagri123.firebaseio.com",
    projectId: "jaysonagri123",
    storageBucket: "jaysonagri123.appspot.com",
    messagingSenderId: "197614776969",
    appId: "1:197614776969:web:ed2192621bea8923d20c58",
    measurementId: "G-TY1114YPQJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var urlParams = new URLSearchParams(window.location.search);
var phone_id = urlParams.get('phone_id');
$(document).ready(function(){
    getfiredata();
    
});


function getfiredata()
{


    $.ajax({
      url: "php/get_location.php",
      type: "get", //send it through get method
      data: {
      
        cus_id_p : phone_id,
        start : get_today_start_millis(),
        end : get_today_end_millis()
     
     },
      success: function (response) {
     console.log(response)
     
     if (response.trim() != "error") {
       if (response.trim() != "0 result") {
      var obj = JSON.parse(response);
     
      obj.forEach(function (obj) {
        loca.push([parseFloat(obj.latti),parseFloat(obj.longi)]);
battery = obj.battery;
ludate =  millis_to_date(parseFloat(obj.cur_time))
     
      });
      initMap();
     }
else{
    $("#map").append(" <img src='img/nodata.jpg' class='img-fluid ' alt='Responsive image'>")
}

   }
     
     
     
        
      },
      error: function (xhr) {
          //Do Something to handle error
      }
     });
  


  
   
 
  

  

   
   
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


   function get_millis(t)
   {
    
    var dt = new Date(t);
    return dt.getTime();
   }

function create_button(innerhtml, id, value, fun) {
    var btn = document.createElement("button");
    btn.innerHTML = innerhtml;
    btn.type="submit"
    btn.onclick = function () {
        approve_user(id,value);
    };
    return btn;
}

  const beaches = [
["Bondi Beach", -33.890542, 151.274856, 4],
["Coogee Beach", -33.923036, 151.259052, 5],
["Cronulla Beach", -34.028249, 151.157507, 3],
["Manly Beach", -33.80010128657071, 151.28747820854187, 2],
["Maroubra Beach", -33.950198, 151.259302, 1],


  ];






  function initMap() {

  const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: loca[1][0], lng :loca[1][1] },
  });
    setMarkers(map);
    // Define the symbol, using one of the predefined paths ('CIRCLE')
    // supplied by the Google Maps JavaScript API.
const lineSymbol = {
path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
scale: 3,
strokeColor: "#393",
};
    var flightPlanCoordinates = [];


     
    for (var i = 0; i < loca.length-1; i++) {
         
        flightPlanCoordinates[i] = { lat : loca[i+1][0],lng : loca[i+1][1] };
       

    }
  

    const line = new google.maps.Polyline({
        path: flightPlanCoordinates,


      

        icons: [
          {
              icon: lineSymbol,
              offset: "100%",
          },
        ],
        map: map,
    });

    animateCircle(line);
}


function animateCircle(line) {
    let count = 0;
    window.setInterval(() => {
        count = (count + 1) % 200;
const icons = line.get("icons");
    icons[0].offset = count / 2 + "%";
    line.set("icons", icons);
}, 20);
}
// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.








function setMarkers(map) {
    // Adds markers to the map.
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
 
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
      const contentString = "<h6 class = 'text-danger'><span class='fw-bold'>Current Location </span><br><br> Battery - " + battery + "% <br> Time - " + ludate + " </h6>";

    var marker;
    var bounds = new google.maps.LatLngBounds();
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    for (let i = 0; i < loca.length-1; i++) {
         var position = new google.maps.LatLng(loca[i+1][0], loca[i+1][1]);

marker =    new google.maps.Marker({
        position: { lat: loca[i+1][0], lng: loca[i+1][1] },
    map,

});

    infowindow.open(map, marker);
   
bounds.extend(position)
}
map.fitBounds(bounds);
}





function gettoday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '-' + mm + '-' + yyyy;
    return today

}



function millis_to_date( millis)
{
  var d = new Date(millis); // Parameter should be long value

  
return d.toLocaleString('en-GB');

}
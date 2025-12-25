document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('processForm');
    const titlesTable = document.getElementById('titlesTable').getElementsByTagName('tbody')[0];

    // Load existing titles on page load
    loadTitles();

 
    function loadTitles() {
        fetch('php/fetch_title.php')
        .then(response => response.json())
        .then(data => {
            titlesTable.innerHTML = '';
            data.forEach(row => {
                const newRow = titlesTable.insertRow();
                newRow.innerHTML = `
                    <tr>
                        <td>${row.prs_name}</td>
                        <td>${row.multi_view == 1 ? 'Yes' : 'No'}</td>  <!-- Corrected logic -->
                        <td>
                        
                            <button class="btn btn-danger btn-sm" onclick="confirmDelete(${row.prs_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
    }

    window.confirmDelete = function(prs_id) {
        // SweetAlert confirmation dialog before delete
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                deleteTitle(prs_id);
            }
        });
    };

    window.deleteTitle = function(prs_id) {
        fetch('php/delete_title.php?id=' + prs_id, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadTitles();
                swal("Poof! Your record has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Error! Could not delete the record.", {
                    icon: "error",
                });
            }
        });
    };

    window.editTitle = function(prs_id, title, multi_view) {
        document.getElementById('title').value = title;
        document.getElementById('multi_view').checked = !!multi_view;

        form.action = 'php/add_process_title.php?id=' + prs_id;
    };
});

var multi_view = 0


$(document).ready(function(){
//   $('[id]').each(function(){
  
//     var elementId = $(this).attr('id');
//     console.log(elementId);
// });

//   $(window).on('beforeunload', function(e) {

//     if(issaved == 'no')
//      {
//       var message = "You have unsaved changes in jaysan process. Are you sure you want to leave?";
//       e.returnValue = message; // Standard way to display the message in modern browsers
//       return message; // For older browsers
//     }
// });

const form = document.getElementById('processForm');
  $("#menu_bar").load('menu.html',
    function() { 
      var lo = (window.location.pathname.split("/").pop());
      var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 
    
     if($(web_addr).find("a").hasClass('nav-link'))
     {
      $(web_addr).find("a").toggleClass('active')
     }
     else if($(web_addr).find("a").hasClass('dropdown-item'))
{
$(web_addr).parent().parent().find("a").eq(0).toggleClass('active')
}
      
     
    }
 );

 

 
    check_login();
 
   
    form.addEventListener('submit', function(event) {
        event.preventDefault();
insert_process_title()
      
       
    });

    $('#multi_view').change(function() {
        if(this.checked) {
        multi_view = 1;
        }
        
        });


});




function insert_process_title()
{
 

$.ajax({
  url: "php/add_process_title.php",
  type: "get", //send it through get method
  data: {
  title :  $('#title').val(),
multi_view : multi_view

  },
  success: function (response) {


if (response.trim() == "ok") {

location.reload()

}




    
  },
  error: function (xhr) {
      //Do Something to handle error
  }
});



   
}




   


function shw_toast(title,des,theme)
{

  
      $('.toast-title').text(title);
      $('.toast-description').text(des);
var toast = new bootstrap.Toast($('#myToast'));
toast.show();
}






   function check_login()
   {
    
    if (localStorage.getItem("logemail") == null) {
      window.location.replace("login.html");
  }
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
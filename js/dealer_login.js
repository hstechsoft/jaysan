
 

$(document).ready(function(){
 
   $("#login_btn").click(function(){
    if($('#login_form')[0].checkValidity())
    {
        get_dealer_login()
    }
        
       }); 
       

   });

   
   function get_dealer_login()
   {
    
   
   $.ajax({
     url: "php/get_dealer_login.php",
     type: "get", //send it through get method
     data: {
     dphone :  $('#dphone').val(),
    dpass :  $('#dpass').val()

     },
     success: function (response) {
   
   
   if (response.trim() != "error") {

    if (response.trim() != "0 result")
    {
   
     var obj = JSON.parse(response);
   var count =0 
   
   
     obj.forEach(function (obj) {
        localStorage.setItem("did",obj.did)
        localStorage.setItem("dname",obj.dname)
       
       
  
       window.location.replace("dealer_index.html");
     });
   
    
   }
   else{
    salert("Wrong","Kindly check credentials","warning")
   }
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

   

   


   







   

  





  



   

   




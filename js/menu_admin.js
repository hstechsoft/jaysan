$("#menu_bar").load('menu.html',
function() { 
  var lo = (window.location.pathname.split("/").pop());
  var web_addr = "#"+ (lo.substring(0, lo.indexOf(".")))
 console.log(web_addr)

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
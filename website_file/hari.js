$("#about1").hide();



$(document).ready(function () {
// demo only-------
//   var myOffcanvas = document.getElementById('jaysan_sidebar')
//   var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
//  bsOffcanvas.show();
// end



// d="videos.html";
//  $("#product_menu_web").append("<li><a class='dropdown-item' href='" + d + "'>MD's message</a></li>");


// $("#product_menu_mobile").append("<a href= " + d +  " class='list-group-item list-group-item-action'><span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i></span>Baler</a>");



$("#product_menu_mobile").append(" <a href='baler.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> baler</a> <a href='banana_stem_chopper.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> banana stem chopper</a> <a href='chaff_cutter.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> chaff cutter</a> <a href='cultivator.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> cultivator</a> <a href='forage_crop_cutter.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> forage crop cutter</a> <a href='hay_rake.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> hay rake</a> <a href='hydraulic_shift_rotary.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> hydraulic shift rotary</a> <a href='mulcher.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> mulcher</a> <a href='rotavator.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> rotavator</a> <a href='shredder.html' class='list-group-item list-group-item-action'> <span class='me-1'> <i class='fa-solid fa-angles-right text-success'></i> </span> shredder</a> ")

$("#product_menu_web").append(" <li><a class='dropdown-item' href='baler.html'>baler</a></li> <li><a class='dropdown-item' href='banana_stem_chopper.html'>banana stem chopper</a></li> <li><a class='dropdown-item' href='chaff_cutter.html'>chaff cutter</a></li> <li><a class='dropdown-item' href='cultivator.html'>cultivator</a></li> <li><a class='dropdown-item' href='forage_crop_cutter.html'>forage crop cutter</a></li> <li><a class='dropdown-item' href='hay_rake.html'>hay rake</a></li> <li><a class='dropdown-item' href='hydraulic_shift_rotary.html'>hydraulic shift rotary</a></li> <li><a class='dropdown-item' href='mulcher.html'>mulcher</a></li> <li><a class='dropdown-item' href='rotavator.html'>rotavator</a></li> <li><a class='dropdown-item' href='shredder.html'>shredder</a></li> ")



$(document).on('click', '[data-toggle="lightbox"]:not([data-gallery="navigateTo"])', function(event) {
  event.preventDefault();
  return $(this).ekkoLightbox({
      onShown: function() {
          if (window.console) {
              return console.log('Checking our the events huh?');
          }
      },
onNavigate: function(direction, itemIndex) {
          if (window.console) {
              return console.log('Navigating '+direction+'. Current item: '+itemIndex);
          }
}
  });
});



$(document).on('click', '[data-toggle="lightbox"][data-gallery="navigateTo"]', function(event) {
  event.preventDefault();

  return $(this).ekkoLightbox({
      onShown: function() {

this.modal().on('click', '.modal-footer a', function(e) {

e.preventDefault();
this.navigateTo(2);

          }.bind(this));

      }
  });
});

$(".filter-button").click(function(){
  var value = $(this).attr('data-filter');
  
  if(value == "all")
  {
      //$('.filter').removeClass('hidden');
      $('.filter').show('1000');
  }
  else
  {
//            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
//            $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
      $(".filter").not('.'+value).hide('3000');
      $('.filter').filter('.'+value).show('3000');
      
  }
});

if ($(".filter-button").removeClass("active")) {
$(this).removeClass("active");
}
$(this).addClass("active");





  $("#about1").hide();
  $("#gal_video").hide();

  


  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    fade: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    arrows: false,
    centerMode: true,
    focusOnSelect: true
  });


  //$("#search_product").val('t');
  $('.slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: true
  });


  $('#mobile_wa').click(function(){
    window.location.href='https://wa.me/919843522997';
 })
  
  $(".autoplay").slick({
    dots: false,
    
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,

      pauseOnHover: true,
      prevArrow: $("#pre"),
      nextArrow: $(".nn2"),
    
    responsive: [
    {
        breakpoint: 1024,
        settings: {
            slidesToShow: 5,
            slidesToScroll: 5,
        }
    },
    {
        breakpoint: 600,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
    },
    {
        breakpoint: 480,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
    }

]


  }); 

 

  $(".play_video").click(function(event){

   event.preventDefault();
  
  console.log($(this).prop('href'));
  video_open($(this).prop('href'));
   
  });
  
  $("#company_video_btn").click(function(){

    lightbox_open();
  
   
  });


  $("#chk1").click(function(){


    $(".hide2").hide();
    $(".hide1").removeAttr("data-lightbox", "roadtrip");



    console.log( $(".hide2").html())
   
  });

  $("#chk2").click(function(){


    $(".hide2").show();
    $(".hide1").attr("data-lightbox", "roadtrip");
   
    console.log( $(".hide2").html())
  });

  $("#search_in").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    count = 0;
    $("#filter *").filter(function() {

      if($(this).prop('name') != undefined)
      {
        var text = $(this).prop('name');
      

        count = count+1;
let result = text.indexOf(value);
if(result > -1  )
{

  console.log($("[name="+text + "]").parent("div").html());
  console.log($("[name="+text + "]").html());

  $("[name="+text + "]").parent("div").show();
  $("[name="+text + "]").attr("data-lightbox", "roadtrip");
}
else{
  $("[name="+text + "]").parent("div").hide();
  $("[name="+text + "]").removeAttr("data-lightbox", "roadtrip");
}

      }
     
    });


    $("#filter_video *").filter(function() {
     
      if($(this).prop('name') != undefined)
      {
        var text = $(this).prop('name'); 
        console.log(text);      
let result = text.indexOf(value);
if(result > -1  )
{
  $("[name="+text + "]").parent("div").show();
 
  }
else{
  $("[name="+text + "]").parent("div").hide();
  
}
      }
     
    });


    // $('#item').prop('name');
  //  console.log($("#myDIV *").filter(".hi").html()) ;
  });
  

});


function googleTranslateElementInit() {
  new google.translate.TranslateElement({
      pageLanguage: 'en',
       includedLanguages: 'en,gu,bn,hi,kn,ta,te,ur,ml', autoDisplay: false,
      autoDisplay: 'true',
      layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
  }, 'google_translate_element');
}


function lightbox_open() {
 
console.log("hello");
  $("#about1").show();
  $('#company_video').trigger('play');
  $('#company_video').attr('controls',true);
}

function lightbox_close() {
  
  $('#company_video').trigger('pause');
  $("#about1").hide();
  $('#company_video').attr('controls',false);

}
 

function video_open(src) {
 console.log(src);
 
 $("#company_video").attr("src", src);

$("#about1").show();
$('#company_video').trigger('play');
$('#company_video').attr('controls',true);
  }
  
  function video_close() {
    
    $('#company_video').trigger('pause');
  $("#about1").hide();
  $('#company_video').attr('controls',false);

  
  }

window.document.onkeydown = function(e) {
  if (!e) {
    e = event;
  }
  if (e.keyCode == 27) {
    lightbox_close();
    video_close();
  }
}

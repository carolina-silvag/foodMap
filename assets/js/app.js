$(document).ready(function(){
  $('header').fadeOut(1000);
});

// function init() {
//   $.ajax({
//     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
//     type: 'GET',
//     dataType: 'jsonp',
//     cache: false,
//     data: {
//       location: '-33.8670522,151.1957362',
//       radius: '500',
//       type: 'restaurant',
//       keyword: 'china',
//       key: 'AIzaSyAfdR2-p7bETCxjk_1qQzzDDmuHD47_lsI'
//     },
//   })
//   .done(function(data) {
//     console.log("success", data);

//   })
//   .fail(function(data) {
//     console.log("error", data);
//   })
//   .always(function(data) {
//     console.log("complete", data);
//   });
  
// }


// function changeMap() {
//   var lat = -33.8569;
//   var lon = 151.2152;
//   var iframe = '<iframe src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBMwksHk5b2SIOj6r187Ug3dp42GPGfN4w&center='+lat+','+lon+'&zoom=18&q=restaurante+peruano+in+lima"></iframe>'
//   $("#map").html(iframe);
// }

var map;
var service;
var infowindow;

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    types: ['restaurant']
  };


  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(place);
      createElement(place, i + 1);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

var cols = 0;

function createElement(place, index) {
  if (typeof place.photos != 'undefined') {
    if (cols == 0) {
      $("#listFood").append('<div class="row listImg"></div>');
    }

    var urlImage = place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400});
    $("#listFood .row").last().append('<div class="col-xs-4 img-'+index+'"></div>');
    $('.img-'+index).css({'background-image': 'url('+urlImage+')', 'height': '25vh', 'background-repeat': 'no-repeat', 'background-position': 'bottom 7% center'});
    cols++;

    if (cols == 3) {
      cols = 0;
    }
  }
}
// 


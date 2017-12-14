$(document).ready(function(){
  $('header').fadeOut(1000);
});

var map;
var map2;
var service;
var infowindow;
var positionMap;
var markers = [];
var cols = 0;

function initialize() {
  var santiago = new google.maps.LatLng(-33.4691,-70.6420);

  map = new google.maps.Map(document.getElementById('map'), {
    center: santiago,
    zoom: 15
  });
            
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var request = {
        location: pos,
        radius: '500',
        types: ['restaurant']
      };
      positionMap = pos;
      service.nearbySearch(request, callback);

      infowindow.setPosition(pos);
      infowindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      setDefaultMap(santiago);
    });
  } else {
    setDefaultMap(santiago);
  }

  $('#modalLocal').on('shown.bs.modal', function (e) {
    google.maps.event.trigger(map2, "resize");
    console.log("entre!!")
  })
}

function setDefaultMap(defaultPosition) {
  var request = {
    location: defaultPosition,
    radius: '500',
    types: ['restaurant']
  };
  positionMap = defaultPosition;
  service.nearbySearch(request, callback);
}


function setSearchMap(search) {
  var request = {
    location: positionMap,
    radius: '500',
    types: ['restaurant'],
    keyword: [search]
  };

  service.nearbySearch(request, callback);
}


function callback(results, status) {
  console.log("RESULTADO", results);
  // Se limipia la lista de fotos
  $('#listFood').html("");
  cols = 0;
  // Se limpia los marker del mapa
  removeMarker();
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
  //var image = 'https://userscontent2.emaze.com/images/9ee8f6cc-2b63-4759-bd7c-6492f61b815f/7710ad823f3e2aab72620a4c0c77066d.png';
  var marker = new google.maps.Marker({
    map: map,
    position: placeLoc,
    //icon: image
  });

  markers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function createElement(place, index) {
  console.log(place.name, place.photos);
  if (typeof place.photos != 'undefined') {
    if (cols == 0) {
      $("#listFood").append('<div class="row listImg"></div>');
    }

    var urlImage = place.photos[0].getUrl({'maxWidth': 250, 'maxHeight': 250});
    var name = place.name;
    var direccion = place.vicinity;
    var local = place.location;

    $("#listFood .row").last().append('<div class="col-xs-4 imgcont"><div class="img-'+index+' imgContenedor data-toggle="modal" data-target="#modalLocal""></div></div>');
    $('.img-'+index).css({'background-image': 'url('+urlImage+')', 'height': '10em', 'background-repeat': 'no-repeat', 'background-position': 'center center'});
    $('.img-'+index).last().append('<span class="nameList">'+name+'</span>');
    $('.img-'+index+' h2').hide();
      /*$('.btnClose').click(function(event) {
      $('.name').last().html('');
      $('.direccion').last().html('');
      });*/
    $('.img-'+index).click(function(event) {
      console.log(place.name, place.photos, place.geometry.location);
      $('#modalLocal').modal('show');
      $('.name').last().append(name);
      $('.direccion').last().append('<span>'+direccion+'</span>')
      console.log(name);
      map2 = new google.maps.Map(document.getElementById('map2'), {
        center: place.geometry.location,
        zoom: 16
      });

      map2.setCenter(place.geometry.location);

      var marker = new google.maps.Marker({
        map: map2,
        position: place.geometry.location,
        //icon: image
      });
      
    });
    $('.img-'+index).mouseover(function(event) {
      $('.img-'+index).css({'opacity': '0.8'})
      $('.img-'+index+' span').show();
    });
    $('.img-'+index).mouseleave(function(event) {
      $('.img-'+index).css({'opacity': '1'})
      $('.img-'+index+' span').hide();
    });

    cols++;

    if (cols == 3) {
      cols = 0;
    }
  }
}

$('#btnSearch').click(search);
function search() {
  setSearchMap($('#inputSearch').val());
}





  function initMap(setMarker) {

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 57.70887, lng: 11.974559999999997},
      zoom: 13
    });

    var card = document.getElementById('pac-card');
    var input = document.getElementById('addressInput');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    if(setMarker){
      marker.setVisible(true);
      marker.setPosition(setMarker);
      map.setCenter(setMarker);
      map.setZoom(16);
      console.log('SETMARKER');
    }
    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      console.log('MARKER PLACE GEMOETRY LOCATION: ',place.geometry.location);
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // Sätt attributen på kartan.
      document.getElementById('map').setAttribute('lat', place.geometry.location.lat());
      document.getElementById('map').setAttribute('lng', place.geometry.location.lng());

      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }


    });
  }

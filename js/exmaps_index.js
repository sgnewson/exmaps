var theMap = null;
var geoOverlayIsVisible = true;

var constants = {
    selectionRectangleColor: "#FF0000",

    mapBounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(49, -130),
        new google.maps.LatLng(60, -110)),

    initialMapOptions: {
        zoom: 7,
        maxZoom: 9,
        minZoom: 5,
        center: new google.maps.LatLng(52.5, -116),
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        disableDefaultUI: false,
        keyboardShortcuts: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                  { visibility: "off" }
                ]
            }
        ]
    }
}

function initialize() {
    theMap = createMap();
    setupSelectionRectangle(theMap);

    loadLayers(theMap);
    loadLabels(theMap);

    setupGeologyButton(theMap);
}

google.maps.event.addDomListener(window, 'load', initialize);
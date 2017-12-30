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

    $("#gscASeriesButton").click(function() {window.open(geoscanSearchUrl("GSCMAP-A"))});
    $("#gscPreliminaryButton").click(function() {window.open(geoscanSearchUrl("GSCPRMAP"))});
    $("#gscPapersButton").click(function() {window.open(geoscanSearchUrl("GSCPAPER"))});
}

function geoscanSearchUrl(collection) {
    var minLng = 2000 + -116.08154296875;
    var maxLng = 2000 + -114.345703125;
    var minLat = 2000 + 51.27153858904847;
    var maxLat = 2000 + 52.38498792177971;

    return 'https://geoscan.nrcan.gc.ca/starweb/geoscan/servlet.starweb?path=geoscan/shorte.web&search1=(((MINLNG1="' + minLng + '":A W/O MAXLNG1=_:"' + maxLng + '") W/O (MINLAT1="' + minLat + '":A W/O MAXLAT1=_:"' + maxLat + '")) AND (SER,SSER=' + collection + '))';
}

function createMap() {
    var map = new google.maps.Map(document.getElementById("mapCanvas"), constants.initialMapOptions);

    var lastValidCenter = map.getCenter();

    google.maps.event.addListener(map, 'center_changed', function () {
        if (constants.mapBounds.contains(map.getCenter())) {
            lastValidCenter = map.getCenter();
        } else {
            map.panTo(lastValidCenter);
        }
    });

    return map;
}

google.maps.event.addDomListener(window, 'load', initialize);
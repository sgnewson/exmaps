var theMap = null;
var geoOverlayIsVisible = true;

var constants = {
    geogratisUrlPrefix: "http://geogratis.gc.ca/api/en/nrcan-rncan/ess-sst",

    searchButtonDefaultText: "Search",
    searchButtonSearchingText: "Searching...",
    selectionRectangleColor: "#FF0000",

    geoGratisSearchCategories: [
        {
            humanReadable: "GSC 'A' series",
            machineReadable: "/-/(urn:iso:series)geological-survey-of-canada-a-series-map"
        },
        {
            humanReadable: "GSC open file",
            machineReadable: "/-/(urn:iso:series)geological-survey-of-canada-open-file"
        },
        {
            humanReadable: "GSC preliminary map",
            machineReadable: "/-/(urn:iso:series)geological-survey-of-canada-preliminary-map"
        },
        {
            humanReadable: "GSC Canadian geosciences map",
            machineReadable: "/-/(urn:iso:series)geological-survey-of-canada-canadian-geoscience-map"
        }
    ],

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
    activateGeoGratisSearch(theMap);

    var loadInteractiveLayers = false;
    loadLayers(theMap, loadInteractiveLayers);
    loadLabels(theMap);

    setupGeologyButton(theMap);

    $(".latLngInputBox").change(updateSelectionBoxFromInputs);
    $("#searchButton").click(loadGeoGratis);
}

google.maps.event.addDomListener(window, 'load', initialize);
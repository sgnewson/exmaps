var selectionRectangle = null;
var mouseDownLatLng = null;

function setupSelectionRectangle(map) {
    var mouseDown = false;

    google.maps.event.addListener(map, 'mousedown', function (event) {
        mouseDownLatLng = event.latLng;
        mouseDown = true;
    });

    google.maps.event.addListener(map, 'mousemove', function (event) {
        if (mouseDown) {
            createSelection(map, mouseDownLatLng, event.latLng);
        }
    });

    google.maps.event.addListener(map, 'mouseup', function (event) {
        mouseDown = false;

        createSelection(map, mouseDownLatLng, event.latLng);
    });
}

function urlSearchParams(map) {
    // Example:
    // http://localhost:63342/exmaps/index.html?north=52.956580655415095&east=-115.55419921875&south=52.12134775912647&west=-117.850341796875
    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("north") && searchParams.has("east") && searchParams.has("south") && searchParams.has("west")) {
        var north = searchParams.get("north");
        var east = searchParams.get("east");
        var south = searchParams.get("south");
        var west = searchParams.get("west");

        createSelection(map, new google.maps.LatLng(north, east), new google.maps.LatLng(south, west))
    }
}

function createSelection(map, firstLatLng, secondLatLng) {
    var selectionBounds = createSelectionBounds(firstLatLng, secondLatLng);
    drawUniqueSelectionRectangle(map, selectionBounds);

    var north = round(selectionBounds.getNorthEast().lat(), 4);
    var east = round(selectionBounds.getNorthEast().lng(), 4);
    var south = round(selectionBounds.getSouthWest().lat(), 4);
    var west = round(selectionBounds.getSouthWest().lng(), 4);
    $("#northBox").text(north);
    $("#eastBox").text(east);
    $("#southBox").text(south);
    $("#westBox").text(west);
    setExmapsLink(north, east, south, west);

    $("#gscASeriesButton").prop('disabled', false);
    $("#gscPreliminaryButton").prop('disabled', false);
    $("#gscPapersButton").prop('disabled', false);
}

function round(number, precision) {
    var offset = Math.pow(10, precision);
    return Math.round(number * offset) / offset;
}

function setExmapsLinkDefault() {
    var url = window.location;
    $("#exmapsLink").text(url);
}

function setExmapsLink(north, east, south, west) {
    var urlParams = "?north=" + north + "&east=" + east + "&south=" + south + "&west=" + west;
    var url = window.location.origin + window.location.pathname + urlParams;
    $("#exmapsLink").text(url);
}

function createSelectionBounds(firstLatLng, secondLatLng) {
    var north = Math.max(firstLatLng.lat(), secondLatLng.lat());
    var east = Math.max(firstLatLng.lng(), secondLatLng.lng());
    var south = Math.min(firstLatLng.lat(), secondLatLng.lat());
    var west = Math.min(firstLatLng.lng(), secondLatLng.lng());
    var northEast = new google.maps.LatLng(north, east);
    var southWest = new google.maps.LatLng(south, west);

    return new google.maps.LatLngBounds(southWest, northEast);
}

function drawUniqueSelectionRectangle(map, selectionBounds) {
    if (selectionRectangle != null) {
        selectionRectangle.setMap(null);
        selectionRectangle = null;
    }

    selectionRectangle = new google.maps.Rectangle({
        clickable: false,
        strokeColor: constants.selectionRectangleColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: constants.selectionRectangleColor,
        fillOpacity: 0.35,
        map: map,
        bounds: selectionBounds
    });
}
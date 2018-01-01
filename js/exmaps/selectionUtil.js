var selectionRectangle = null;
var mouseDownLatLng = null;
var selectionBounds = null;


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

function createSelection(map, mouseDownLatLng, latLng) {
    selectionBounds = createSelectionBounds(mouseDownLatLng, latLng);
    drawUniqueSelectionRectangle(map, selectionBounds);

    $("#northBox").text(selectionBounds.getNorthEast().lat());
    $("#eastBox").text(selectionBounds.getNorthEast().lng());
    $("#southBox").text(selectionBounds.getSouthWest().lat());
    $("#westBox").text(selectionBounds.getSouthWest().lng());

    $("#gscASeriesButton").prop('disabled', false);
    $("#gscPreliminaryButton").prop('disabled', false);
    $("#gscPapersButton").prop('disabled', false);
}

function createSelectionBounds(firstLatLng, secondLatLng) {
    var north = Math.max(firstLatLng.lat(), secondLatLng.lat());
    var east = Math.max(firstLatLng.lng(), secondLatLng.lng());
    var south = Math.min(firstLatLng.lat(), secondLatLng.lat());
    var west = Math.min(firstLatLng.lng(), secondLatLng.lng());
    var northEast = new google.maps.LatLng(north, east);
    var southWest = new google.maps.LatLng(south, west);

    var bounds = new google.maps.LatLngBounds(southWest, northEast);
    return bounds;
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
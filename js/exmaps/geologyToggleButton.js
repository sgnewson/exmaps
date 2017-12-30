function setupGeologyButton(map) {
    var geologyButton = document.getElementById("toggleGeologyOverlayButton");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(geologyButton);

    $("#toggleGeologyOverlayButton").click(toggleGeoOverlay);
}

function toggleGeoOverlay() {
    geoOverlayIsVisible = !geoOverlayIsVisible;

    clearAllLayers();

    if (geoOverlayIsVisible) {
        showAllLayers();
    } else {
        showAlwaysOnLayers();
    }
}

function clearAllLayers() {
    $.each(toggleableLayers.concat(alwaysOnLayers), function (index, layer) {
        layer.setMap(null);
    });
}

function showAllLayers() {
    renderLayers(theMap, toggleableLayers.concat(alwaysOnLayers));
}

function showAlwaysOnLayers() {
    renderLayers(theMap, alwaysOnLayers);
}
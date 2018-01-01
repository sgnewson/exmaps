function setupGeologyButton(map) {
    var geologyButton = document.getElementById("toggleGeologyOverlayButton");
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(geologyButton);

    $("#toggleGeologyOverlayButton").click(getToggleGeoOverlay(map));
}

function getToggleGeoOverlay(map) {
    var geoOverlayIsVisible = true;

    return function () {
        geoOverlayIsVisible = !geoOverlayIsVisible;

        $.each(toggleableLayers.concat(alwaysOnLayers), function (index, layer) {
            layer.setMap(null);
        });

        if (geoOverlayIsVisible) {
            renderLayers(map, toggleableLayers.concat(alwaysOnLayers));
        } else {
            renderLayers(map, alwaysOnLayers);
        }
    }
}


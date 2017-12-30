//The KML has to be somewhere Google can get at it.
//So on dropbox or publicly visible on the server

var toggleableLayers = [];
var alwaysOnLayers = [];

function loadLayers(googleMap) {
    var geologyLayer = {
        url: "https://www.dropbox.com/s/ngv790iaeihljgu/ExMaps%20surface%20geology.kmz?dl=1",
        clickable: false,
        toggleable: true
    };

    var lineLayer = {
        url: "https://www.dropbox.com/s/l5cpzipm1oavjoy/ExMaps%20line%20geology.kmz?dl=1",
        clickable: false,
        toggleable: true
    };

    var fieldsLayer = {
        url: "https://www.dropbox.com/s/pwgvddsvsdxz1t8/ExMaps%20field%20outlines.kmz?dl=1",
        clickable: false,
        toggleable: false
    };

    var layerInfos = [geologyLayer, lineLayer, fieldsLayer];

    $.each(layerInfos, function (index, layerInfo) {
        var kmlLayer = ExMapsKmlLayer(layerInfo.url, layerInfo.clickable);
        if (layerInfo.toggleable) {
            toggleableLayers.push(kmlLayer);
        } else {
            alwaysOnLayers.push(kmlLayer);
        }
    });

    renderLayers(googleMap, toggleableLayers.concat(alwaysOnLayers));
}

function renderLayers(googleMap, kmlLayers) {
    var kmlLayer = kmlLayers[0];

    kmlLayer.setMap(googleMap);

    if (kmlLayers.length > 1) {
        var listener = google.maps.event.addListener(kmlLayer, 'metadata_changed', function () {
            google.maps.event.removeListener(listener);

            renderLayers(googleMap, kmlLayers.slice(1, kmlLayers.length));
        });
    }
}

function loadLabels(googleMap) {
    $.ajax({
        type: "GET",
        url: "./js/exmaps/fieldNames.csv",
        dataType: "text",
        success: function (csv_data) {
            var labels = $.csv.toObjects(csv_data);

            $.each(labels, function (index, label) {
                var mapLabel = new MapLabel(label.LABEL, new google.maps.LatLng(label.LATITUDE, label.LONGITUDE), googleMap);
            });
        }
    });
}

function ExMapsKmlLayer(kmlURL, clickable) {
    var kmlURL = kmlURL;
    var kmlOptions = {
        clickable: clickable,
        suppressInfoWindows: !clickable,
        preserveViewport: true
    };

    var kmlLayer = new google.maps.KmlLayer(kmlURL, kmlOptions);

    return kmlLayer;
}

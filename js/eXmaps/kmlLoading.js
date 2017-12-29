//The KML has to be somewhere Google can get at it.
//So on dropbox or publicly visible on the server

var toggleableLayers = [];
var alwaysOnLayers = [];

function loadLayers(googleMap, includeInteractiveLayers) {
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

    var andysPicksLayer = {
        url: "https://www.dropbox.com/s/v1bl7ssheybpxww/Exmaps%20download%20picks.kmz?dl=1",
        clickable: true,
        toggleable: false
    };

    var goldSections = {
        url: "https://www.dropbox.com/s/8vzfzc444fo5d83/ExMaps%20Gold%20Sections.kmz?dl=1",
        clickable: true,
        toggleable: false
    };

    var fieldTripLayer = {
        url: "https://www.dropbox.com/s/f5h8q4z3uqt7o7w/EAGE%20fieldtrip.kmz?dl=1",
        clickable: true,
        toggleable: false
    };

    var rdaModelsLayer = {
        url: "https://www.dropbox.com/s/yr4s73if0vh3std/RDA%20Models.kmz?dl=1",
        clickable: true,
        toggleable: false
    };

    var layerInfos;
    if (includeInteractiveLayers) {
        layerInfos = [geologyLayer, lineLayer, fieldsLayer, andysPicksLayer, goldSections, fieldTripLayer, rdaModelsLayer];
    } else {
        layerInfos = [geologyLayer, lineLayer, fieldsLayer];
    }

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

function loadDemoLayer(googleMap) {
    var demoLayer = {
        url: "https://www.dropbox.com/s/7q63p81dqrql9sy/ExMapsDemoLayer.kmz?dl=1",
        clickable: true
    };

    var kmlLayer = ExMapsKmlLayer(demoLayer.url, demoLayer.clickable);

    kmlLayer.setMap(googleMap);
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
        url: "./js/eXmaps/fieldNames.csv",
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

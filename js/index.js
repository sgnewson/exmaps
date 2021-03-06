﻿function initialize() {
    $("#gscASeriesButton").prop('disabled', true);
    $("#gscPreliminaryButton").prop('disabled', true);
    $("#gscPapersButton").prop('disabled', true);

    var map = createMap();
    setupSelectionRectangle(map);
    urlSearchParams(map);

    if (constants.showGeology) {
        loadLayers(map);
        loadLabels(map);
        setupGeologyButton(map);
    }

    setExmapsLinkDefault();

    $("#gscASeriesButton").click(openUrl("GSCMAP-A"));
    $("#gscPreliminaryButton").click(openUrl("GSCPRMAP"));
    $("#gscPapersButton").click(openUrl("GSCPAPER"));
}

function openUrl(collection) {
    return function() {
        var minLng = 2000.0 + parseFloat($("#westBox").text());
        var maxLng = 2000.0 + parseFloat($("#eastBox").text());
        var minLat = 2000.0 + parseFloat($("#southBox").text());
        var maxLat = 2000.0 + parseFloat($("#northBox").text());

        var url = 'https://geoscan.nrcan.gc.ca/starweb/geoscan/servlet.starweb?path=geoscan/shorte.web&search1=(((MINLNG1="' + minLng + '":A W/O MAXLNG1=_:"' + maxLng + '") W/O (MINLAT1="' + minLat + '":A W/O MAXLAT1=_:"' + maxLat + '")) AND (SER,SSER=' + collection + '))';

        window.open(url);
    }
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
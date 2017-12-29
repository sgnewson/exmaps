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
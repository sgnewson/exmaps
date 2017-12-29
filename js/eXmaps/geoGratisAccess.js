var loadingCounter;
var progressDisplay;
var selectionRectangle = null;
var mouseDownLatLng = null;
var selectionBounds = null;


function activateGeoGratisSearch(map) {
    var mouseDown = false;

    google.maps.event.addListener(map, 'mousedown', function (event) {
        mouseDownLatLng = event.latLng;
        mouseDown = true;
    });

    google.maps.event.addListener(map, 'mousemove', function (event) {
        if (mouseDown) {
            selectionBounds = createSelectionBounds(mouseDownLatLng, event.latLng);
            drawUniqueSelectionRectangle(map, selectionBounds);
        }
    });

    google.maps.event.addListener(map, 'mouseup', function (event) {
        mouseDown = false;

        selectionBounds = createSelectionBounds(mouseDownLatLng, event.latLng);
        drawUniqueSelectionRectangle(map, selectionBounds);

        enableDisableSearchButton(selectionBounds);

        $("#northBox").val(selectionBounds.getNorthEast().lat());
        $("#eastBox").val(selectionBounds.getNorthEast().lng());
        $("#southBox").val(selectionBounds.getSouthWest().lat());
        $("#westBox").val(selectionBounds.getSouthWest().lng());
    });
}

function loadGeoGratis() {
    var maxResults = 100;
    var startIndex = 0;
    $("#geoGratisResults").empty();

    loadingCounter = 0;

    disableMapAndShowSpinners();

    $.each(constants.geoGratisSearchCategories, function (index, category) {
        incrementLoadingCount();

        var resultsDiv = $("#geoGratisResults");
        geoGratisRequest(selectionBounds, category, maxResults, startIndex, null, resultsDiv, decrementLoadingCount);
    });
}

function incrementLoadingCount() {
    if (loadingCounter <= 0) {
        loadingCounter = 0;
    }

    loadingCounter++;
}

function decrementLoadingCount() {
    loadingCounter--;
    progressDisplay.incrementProgress();

    if (loadingCounter <= 0) {
        loadingCounter = 0;

        enableMapAndHideSpinners();
    }
}

function disableMapAndShowSpinners() {
    var spinnerElement = document.getElementById('mapCanvas');
    progressDisplay = new ProgressDisplay(spinnerElement);
    progressDisplay.start();
    $("#mapCanvas").addClass("disabledMap");
    $(".latLngInputBox").prop('disabled', true);
    $("#searchButton")
        .attr("disabled", true)
        .html(constants.searchButtonSearchingText);

}

function enableMapAndHideSpinners() {
        progressDisplay.stop();
        $("#mapCanvas").removeClass("disabledMap");
        $(".latLngInputBox").prop('disabled', false);
        $("#searchButton")
            .attr("disabled", false)
            .html(constants.searchButtonDefaultText);
}

function geoGratisRequest(bounds, category, maxResults, startIndex, items, resultsDiv, requestDoneFunction) {
    var items = items || [];

    var URL = generateGeoGratisURL(bounds, category.machineReadable, maxResults, startIndex);
    //$("#geoGratisResults").append( $('<div/>', { text: URL }) );

    return $.ajax({
        dataType: "jsonp",
        url: URL,
        success: function (data) {
            extractResults(data, bounds, items);

            var totalItemsAvailable = data.count;
            var currentItemsInList = items.length;
            if (currentItemsInList < totalItemsAvailable) {
                var nextStartIndex = data.products[data.products.length - 1].updateIndex;
                geoGratisRequest(bounds, category, maxResults, nextStartIndex, items, resultsDiv, requestDoneFunction); //recursive call
            } else {
                DisplayLinks(category.humanReadable, items, resultsDiv);
                requestDoneFunction();
            }
        }
    });
}

function generateGeoGratisURL(bounds, category, maxResults, startIndex) {
    var southBound = bounds.getSouthWest().lat();
    var westBound = bounds.getSouthWest().lng();
    var northBound = bounds.getNorthEast().lat();
    var eastBound = bounds.getNorthEast().lng();

    var URL = constants.geogratisUrlPrefix
        + category
        + "?bbox="
        + westBound + ","
        + southBound + ","
        + eastBound + ","
        + northBound
        + "&alt=json"
        + "&max-results=" + maxResults
        + "&start-index=" + startIndex;

    return URL;
}

function extractResults(dataSource, bounds, listOfItems) {
    if (dataSource.products == undefined){
        return;
    }

    $.each(dataSource.products, function (key, val) {
        if (itemWithinBounds(val, bounds)) {
            var htmlLinkObject = $.grep(val.links, function (element) { return element.enctype == "text/html"; });
            var item = {
                title: val.title,
                href: htmlLinkObject[0].href,
                id: val.id,
                author: val.author
            };
            listOfItems.push(item);
        }
    });
}

function itemWithinBounds(product, bounds) {
    var itemWithin = true;
    var itemCoordinates = product.geometry.coordinates[0];
    $.each(itemCoordinates, function (key, val) {
        var lng = val[0];
        var lat = val[1];
        var coordinate = new google.maps.LatLng(lat, lng);
        if (!bounds.contains(coordinate)) {
            itemWithin = false;
        }
    });
    return itemWithin;
}

function DisplayLinks(category, listOfItems, jQueryDiv) {
    var links = [];
    $.each(listOfItems, function (key, val) {
        var link = "<a href='" + val.href + "' target='_blank'>" + val.title + "</a>";
        //links.push("<li id='" + val.id + "'>" + link + " (Date) - " + val.author + "</li>");
        links.push("<li id='" + val.id + "'>" + link + "</li>");
    });

    var resultsList = $("<ul/>", {
        id: "resultsList",
        html: "<b>" + category + "</b>"
            + links.join("")
    });
    if (resultsList.children().length <= 1) {
        resultsList.append($("<li/>", { html: "No results found in the selected area." }));
    }

    jQueryDiv.append(resultsList);
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

function enableDisableSearchButton(selectionBounds) {
    if (isAcceptableRectangle(selectionBounds)) {
        $("#searchButton")
            .attr("disabled", false)
            .html(constants.searchButtonDefaultText);
    } else {
        $("#searchButton")
            .attr("disabled", true)
            .html(constants.searchButtonDefaultText);
    }
}

function isAcceptableRectangle(selectionBounds) {
    // Make sure that North != South, and East != West
    return (selectionBounds.getSouthWest().lat() != selectionBounds.getNorthEast().lat()
            && selectionBounds.getSouthWest().lng() != selectionBounds.getNorthEast().lng())
}

function updateSelectionBoxFromInputs() {
    var north = $("#northBox").val();
    var east = $("#eastBox").val();
    var south = $("#southBox").val();
    var west = $("#westBox").val();

    selectionBounds = createSelectionBounds(new google.maps.LatLng(north, east), new google.maps.LatLng(south, west));
    drawUniqueSelectionRectangle(theMap, selectionBounds);

    enableDisableSearchButton(selectionBounds);
}

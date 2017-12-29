function MapLabel(text, latlng, map) {
    var labelText = text;

    var myOptions = {
         content: labelText
        ,boxStyle: {
            border: "none"
            ,textAlign: "center"
            ,fontSize: "8pt"
            ,width: "100px"
            ,background: "transparent"
//            ,fontWeight: "bold"
            ,textShadow: "white 0.1em 0.1em 0.2em"
         }
        ,disableAutoPan: true
        ,pixelOffset: new google.maps.Size(-25, 0)
        ,position: latlng
        ,closeBoxURL: ""
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: true
    };

    var ibLabel = new InfoBox(myOptions);
    ibLabel.open(map);

    return ibLabel;
}

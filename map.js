'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoieGJsdXgiLCJhIjoiY2tmc2w0MXJiMG81ZDJ5bndvMGNrajR0aSJ9.D7C_-vLYzalyoZq_974skA';

var bounds = [
    // Source: New York City Census Tracts for 2010 US Census
    [-74.34438,40.47392], // Southwest coordinates
    [-73.68091,40.95147] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/xblux/ckfpnq1200lnb19l2ggguyiqt',
    center: [40.70578, -73.978187],
    zoom: 1,
    maxBounds: bounds // Sets bounds as max
});

// Click to display lng, lat
map.on('click', function(event) {

    let lng = event.lngLat.lng
    let lat = event.lngLat.lat

    console.log("clicked:", lng, lat)

    document.getElementById('info').innerHTML = lng.toFixed(5) + "," + lat.toFixed(5) + '/n'
})

map.on('load', function () {
    map.addSource('tract', {
        'type': 'geojson',
        'data':
            // 'digital-twin/public/Resources/Data/geo_nyc_zipcode.geojson'
        'digital-twin/public/Resources/Data/tract.json'
    });

    map.addLayer({
        "id": "tract_fill",
        "type": "fill",
        "source": "tract",
        "paint": {
            "fill-color": "#888",
            "fill-opacity": 0.4
        },
    });

    map.addLayer({
        "id": "tract_line",
        "type": "line",
        "source": "tract",
        "paint": {
            "line-color": "#000",
            "line-width": 0.5
        },
    });

})

var layers = ['0-1', '1-2', '2-3', '3-4', '4-5'];
var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'];
for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
}

// map.on('load', function() {
//     // the rest of the code will go in here
//     var layers = ['0-1', '1-2', '2-3', '3-4', '4-5'];
//     var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A'];
//
//     for (var i = 0; i < layers.length; i++) {
//         var layer = layers[i];
//         var color = colors[i];
//         var item = document.createElement('div');
//         var key = document.createElement('span');
//         key.className = 'legend-key';
//         key.style.backgroundColor = color;
//
//         var value = document.createElement('span');
//         value.innerHTML = layer;
//         item.appendChild(key);
//         item.appendChild(value);
//         legend.appendChild(item);
//     }
// });
//
map.on('mousemove', function(e) {
    // var tract = map.queryRenderedFeatures(e.point, {
    //     layers: ['tract_fill']
    // });
    //
    // if (tract.length > 0) {
    //     document.getElementById('pd').innerHTML = '<h3><strong>' + tract[0].properties.ntaname + '</strong></h3><p>' + tract[0].properties.GeoId + '</p>';
    // } else {
    //     document.getElementById('pd').innerHTML = '<p>Move around!</p>';
    // }
});
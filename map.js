'use strict'

console.log('Loaded map.js')

mapboxgl.accessToken = 'pk.eyJ1IjoieGJsdXgiLCJhIjoiY2tmc2w0MXJiMG81ZDJ5bndvMGNrajR0aSJ9.D7C_-vLYzalyoZq_974skA';

var bounds = [
    // Source: New York City Census Tracts for 2010 US Census
    [-74.257159, 40.495992], // Southwest coordinates
    [-73.699215, 40.915568] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/xblux/ckfpnq1200lnb19l2ggguyiqt',
    center: [40.70578, -73.978187],
    zoom: 1,
    maxBounds: bounds // Sets bounds as max
});


let data = [
    {
        location: [-73.96191,40.80762],
        content: 'I like to eat my lunch here'
    },
    {
        location: [-73.95936,40.80610],
        content: '15 years ago, you could see over the trees'
    },
    {
        location: [-73.96204,40.80994],
        content: 'This was once tennis courts'
    },
]

data.forEach(function(d) {

    let marker = new mapboxgl.Marker()
    marker.setLngLat(d.location)
    marker.addTo(map)

    let popup = new mapboxgl.Popup()
    popup.setHTML(d.content)
    marker.setPopup(popup)

})

// Click to display lng, lat
map.on('click', function(event) {

    let lng = event.lngLat.lng
    let lat = event.lngLat.lat

    console.log("clicked:", lng, lat)

    document.getElementById('info').innerHTML = lng.toFixed(5) + "," + lat.toFixed(5) + '/n'

    let marker = new mapboxgl.Marker()
    marker.setLngLat([lng,lat])
    marker.addTo(map)

    let popup = new mapboxgl.Popup()
    popup.setHTML('Hi' + lng.toFixed(5) + "," + lat.toFixed(5))
    marker.setPopup(popup)
})

// map.on('load', function () {
//     map.addSource('tract', {
//         'type': 'geojson',
//         'data':
//             'Resouces/2010 Census Tracts.geojson'
//     });
// })
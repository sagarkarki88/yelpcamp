mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 6, // starting zoom
});



const marker1 = new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    .addTo(map);
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'showMap', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
    `<h3>${campground.title}</h3>`
    );
     
    // create DOM element for the marker
   /*  const el = document.createElement('div');
    el.id = 'marker'; */



const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
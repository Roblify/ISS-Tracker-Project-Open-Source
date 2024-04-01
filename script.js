mapboxgl.accessToken = 'YOUR_MAPBOX_KEY';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 0],
    zoom: 2
});

let isLocked = false;
let updateInterval;

document.getElementById('lockButton').addEventListener('click', function () {
    isLocked = !isLocked;
    map.dragPan.disable();
    map.scrollZoom.disable();

    clearInterval(updateInterval);

    if (isLocked) {
        map.flyTo({ center: [15, 17], zoom: 1.7 });
    } else {
        map.dragPan.enable();
        map.scrollZoom.enable();
    }
});

var issIcon = new mapboxgl.Marker({
    element: document.createElement('img'),
    anchor: 'bottom'
});

var themes = ['mapbox://styles/mapbox/streets-v11', 'mapbox://styles/mapbox/satellite-v9', 'mapbox://styles/mapbox/dark-v10'];
var currentThemeIndex = 0;

document.getElementById('themeButton').addEventListener('click', function () {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    map.setStyle(themes[currentThemeIndex]);
});

issIcon.getElement().src = 'ISS.png';
issIcon.getElement().style.width = '50px';
issIcon.getElement().style.height = '50px';

function updateISSLocation() {
    $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function (data) {
        var lat = data['latitude'];
        var lon = data['longitude'];
        issIcon.setLngLat([lon, lat]).addTo(map);
        if (!isLocked) {
            map.flyTo({ center: [lon, lat], zoom: 4 });
        }

        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;
    });
    setTimeout(updateISSLocation, 5000);
}

updateISSLocation();
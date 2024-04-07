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

issIcon.getElement().src = 'ISS.png';
issIcon.getElement().style.width = '50px';
issIcon.getElement().style.height = '50px';

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString() + ' ' + now.toString().match(/\(([A-Za-z\s].*)\)/)[1].split(' ')[0];
}

function updateClockTime() {
    document.getElementById("time").textContent = getCurrentTime();
}

setInterval(updateClockTime, 1000);

function updateISSLocation() {
    $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function (data) {
        var lat = data['latitude'];
        var lon = data['longitude'];
        var altitude = data['altitude'];
        var velocity = data['velocity'];
        var visibility = data['visibility'];
        var footprint = data['footprint'];

        if (visibility === 'eclipsed') {
            map.setStyle('mapbox://styles/mapbox/dark-v10');
        } else {
            map.setStyle('mapbox://styles/mapbox/streets-v11');
        }

        issIcon.setLngLat([lon, lat]).addTo(map);
        if (!isLocked) {
            map.flyTo({ center: [lon, lat], zoom: 4 });
        }

        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;
        document.getElementById('altitude').textContent = altitude.toFixed(2) + ' km (' + (altitude * 0.621371).toFixed(2) + ' mi)';
        document.getElementById('velocity').textContent = (Math.round(velocity * 100) / 100).toFixed(2) + ' km/h (' + (Math.round((velocity * 0.621371) * 100) / 100).toFixed(2) + ' mph)';
        document.getElementById('visibility').textContent = visibility;
        document.getElementById('footprint').textContent = footprint.toFixed(2) + ' km² (' + (footprint * 0.386102).toFixed(2) + ' mi²)';
    });
    setTimeout(updateISSLocation, 5000);
}

updateISSLocation();

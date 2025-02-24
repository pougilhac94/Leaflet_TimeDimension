function addGeoJSONLayer(map, data, icon="bus") {
    var icon = L.icon({
        iconUrl: 'img/' + icon + '.png',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });

    var geoJSONLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latLng) {
            if (feature.properties.hasOwnProperty('last')) {
                return new L.Marker(latLng, {
                    icon: icon
                });
            }
            return L.circleMarker(latLng);
        }
    });

    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
        updateTimeDimension: false,
        duration: 'P1Y',//durée affichage après dernier step 1 an !!
        updateTimeDimensionMode: 'union',
        addlastPoint: true
    });

    // Show both layers: the geoJSON layer to show the whole track
    // and the timedimension layer to show the movement of the bus
    geoJSONLayer.addTo(map);
    geoJSONTDLayer.addTo(map);
}

function addCountryGeoJSONLayer(map, data) {
    var geoJSONLayer = L.geoJSON(data);    
    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
        updateTimeDimension: false,
        duration: 'P1Y',//durée affichage après dernier step 1 an !!
        updateTimeDimensionMode: 'union',
        addlastPoint: true
    });

    // Show both layers: the geoJSON layer to show the whole track
    // and the timedimension layer to show the movement of the bus
    // geoJSONLayer.addTo(map);
    geoJSONTDLayer.addTo(map);
}

var map = L.map('map', {
    zoom: 14,
    fullscreenControl: true,
    timeDimensionOptions: {
        times: "2019-10-20/2019-12-22/P1D"//Début/Fin/Période 1 jour
    },
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        timeSliderDragUpdate: true,
        loopButton: true,
        autoPlay: false,
        playerOptions: {
            transitionTime: 1000,
            loop: false
        }
    },
    timeDimension: true,
    center: [36.72, -4.43]
});
let googleMap = L.tileLayer('http://{s}.google.com/vt?lyrs=m&hl=fr&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '© GoogleMaps'
});
// var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
// });
// osmLayer.addTo(map);
googleMap.addTo(map);

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", (function (xhr) {
    var response = xhr.currentTarget.response;
    var data = JSON.parse(response);
    addGeoJSONLayer(map, data);
}));
oReq.open('GET', 'data/track_bus699.geojson');
oReq.send();

var oReqSuppl = new XMLHttpRequest();
oReqSuppl.addEventListener("load", (function (xhr) {
    var response = xhr.currentTarget.response;
    var data = JSON.parse(response);
    console.log(data);
    addGeoJSONLayer(map, data, "running");
}));
oReqSuppl.open('GET', 'data/track_bus699suppl.geojson');
oReqSuppl.send();

var oReqMap = new XMLHttpRequest();
oReqMap.addEventListener("load", (function (xhr) {
    var response = xhr.currentTarget.response;
    var data = JSON.parse(response);
    console.log(data);
    addCountryGeoJSONLayer(map, data);
}));
oReqMap.open('GET', 'data/spain.geojson');
oReqMap.send();

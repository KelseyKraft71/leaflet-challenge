const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create function to alter the marker size
function markerSize(magnitude) {
    return magnitude * 30;
  }

// Get the data with d3
d3.json(url).then(function(data) {

    console.log(data)

    createFeatures(data.features);
});

// let geoJson = new L.geoJSON(geojsonFeature, {
//     pointToLayer: (feature, latlng) => {
//         return new L.Circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], feature.geometry.output*50);
//     },
//     onEachFeature: function (feature, layer) {
//         layer.bindPopup('<p>place: '+feature.properties.place);
//     }
// }).addTo(mymap);

function createFeatures(earthquakeData) {

    function getFillColor(feature) {
        if (feature.geometry.coordinates[2] > 90) {
            return "red"
        } else if (feature.geometry.coordinates[2] > 70) {
            return "#F88907"
        } else if (feature.geometry.coordinates[2] > 50) {
            return "orange"
        } else if (feature.geometry.coordinates[2] > 30) {
            return "yellow"
        } else if (feature.geometry.coordinates[2] > 10) {
            return "chartreuse"
        } else return "green"
    }


// https://gis.stackexchange.com/questions/401436/leaflet-circle-rendering-as-marker
    let earthquakes = new L.geoJSON(earthquakeData, {
        
        pointToLayer: (feature, latlng) => {
            return new L.CircleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                radius: feature.properties.mag*4,
                color: "black",
                fillColor: getFillColor(feature),
                fillOpacity: 0.75,
                stroke: true,
                weight: 0.75
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${feature.properties.mag}</h3><h3>Depth: ${feature.geometry.coordinates[2]}</h3>`);
        }
    });

    createMap(earthquakes);


};

function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Creating map object
    let myMap = L.map("map", {
        center: [14.43468, 12.918635],
        zoom: 3,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

};















// // Create marker array
// let markers = [];

// // loop through the data
// for (let i = 0; i < data.length; i++) {

//     let geometry = data[i].features.geometry

//     function getColor(object) {
//         if (object.features.geometry.coordinates[2] > 90) {
//             return "red"
//         } else if (object.features.geometry.coordinates[2] > 70) {
//             return "dark orange"
//         } else if (object.features.geometry.coordinates[2] > 50) {
//             return "orange"
//         } else if (object.features.geometry.coordinates[2] > 30) {
//             return "yellow"
//         } else if (object.features.geometry.coordinates[2] > 10) {
//             return "chartreuse"
//         } else return "green"
//     }

//     markers.push(
//         L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
//             stroke: false,
//             fillOpacity: 1,
//             color: getColor(),
//             size: markerSize(data[i].properties.mag)
//         })
//     )
// }

// let quakes = L.layerGroup(markers);

// // Create the base layers.
// let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// })

// let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
// });

// let baseMaps = {
//     "Street Map": street,
//     "Topographic Map": topo
// };

// let overlayMaps = {
//     "Earthquakes": quakes
// };

// // Creating map object
// let myMap = L.map("map", {
//     center: [14.43468, 12.918635],
//     zoom: 3,
//     layers: [topo, quakes]
// });

// L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
// }).addTo(myMap);


// });
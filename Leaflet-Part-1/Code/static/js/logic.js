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

        
    }
    );

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

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'); // Add 'legend' class here
        let depths = [90, 70, 50, 30, 10];
        let colors = ["red", "#F88907", "orange", "yellow", "chartreuse", "green"];
    
        // loop through depths and colors to generate legend content
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
    
        return div;
    };

    legend.addTo(myMap);
};
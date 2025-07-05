// Initialize the map once globally
const map = L.map('mapid', {
    zoomControl: false
}).setView([50.546352605448064, 0.9171352255804207], 5);

// Add OpenStreetMap tiles with proper attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add zoom control at bottom left
L.control.zoom({ position: 'bottomleft' }).addTo(map);

// Create marker cluster groups for each dataset
const markersCluster1 = L.markerClusterGroup();
const markersCluster2 = L.markerClusterGroup();

let monarchLayer1 = null;
let monarchLayer2 = null;

function getData() {
    // Remove old layers from clusters and map
    if (monarchLayer1) {
        markersCluster1.removeLayer(monarchLayer1);
        map.removeLayer(markersCluster1);
    }
    if (monarchLayer2) {
        markersCluster2.removeLayer(monarchLayer2);
        map.removeLayer(markersCluster2);
    }

    const newMonarch = document.getElementById('monarch').value;
    const newMonarch2 = document.getElementById('monarch2').value;
    const url1 = 'data/json/' + newMonarch + '.json';
    const url2 = 'data/json/' + newMonarch2 + '.json';

    // Fetch and add first GeoJSON dataset
    fetch(url1)
        .then(res => res.json())
        .then(json => {
            monarchLayer1 = L.geoJSON(json, {
                style: { color: '#000', weight: 1, fillColor: 'blue', fillOpacity: 0.65 },
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.3 }));
                    layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.65 }));
                    layer.bindPopup(generatePopupContent(feature, 'monarch'));
                },
                pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 6, fillColor: 'blue', color: '#000', weight: 1, fillOpacity: 0.65 })
            });
            markersCluster1.addLayer(monarchLayer1);
            map.addLayer(markersCluster1);
        });

    // Fetch and add second GeoJSON dataset
    fetch(url2)
        .then(res => res.json())
        .then(json => {
            monarchLayer2 = L.geoJSON(json, {
                style: { color: '#000', weight: 1, fillColor: 'red', fillOpacity: 0.5 },
                onEachFeature: (feature, layer) => {
                    layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.15 }));
                    layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.5 }));
                    layer.bindPopup(generatePopupContent(feature, 'monarch2'));
                },
                pointToLayer: (feature, latlng) => L.circleMarker(latlng, { radius: 6, fillColor: 'red', color: '#000', weight: 1, fillOpacity: 0.5 })
            });
            markersCluster2.addLayer(monarchLayer2);
            map.addLayer(markersCluster2);
        });
}

// Helper function to generate popup HTML content
function generatePopupContent(feature, selectElementId) {
    const select = document.getElementById(selectElementId);
    const selectedText = select.options[select.selectedIndex].text;
    let html = `<strong>${selectedText}</strong>`;
    ['location', 'id', 'date', 'comments'].forEach(prop => {
        if (feature.properties[prop]) {
            html += `<br/><strong>${prop}:</strong> ${feature.properties[prop]}`;
        }
    });
    return html;
}

// Set map height once and update on window resize
function setMapHeight() {
    document.getElementById('mapid').style.height = window.innerHeight + 'px';
}
setMapHeight();
window.addEventListener('resize', setMapHeight);

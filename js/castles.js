function getData(url) {
    if (map != undefined) {
        map.remove();
    }
    var container = L.DomUtil.get('mapid');
    if (container != null) {
        container._leaflet_id = null;
    }
    $('#mapid').height(window.innerHeight);
    var map = L.map('mapid', {
        zoomControl: false
    })
        .setView([52.52711516911194, -3.4273333988961787], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'accessToken'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var url = 'data/json/castles.json'
    fetch(url, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(json => {
            var min = 0;
            var max = 0;
            monarchGeoJSON = L.geoJSON(json, {
                pointToLayer: function (feature, latlng) {
                    var smallIcon = L.icon({
                        iconAnchor: [14, 14],
                        popupAnchor: [1, -24],
                        iconUrl: 'data/img/' + feature.properties.type + '.png'
                    });
                    // var typeOfCastle;
                    // if (feature.properties.type == 'Castle built or wholly rebuilt by Edward I')
                    //     typeOfCastle = 'markersRed';
                    // else if (feature.properties.type == 'parking')
                    //     typeOfCastle = 'markersParking';
                    // else {
                    //     typeOfCastle = 'markerPane';
                    // }
                    return L.marker(latlng, { icon: smallIcon });
                }
            }).addTo(map);
        })
};
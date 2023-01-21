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
        .setView([50.546352605448064, 0.9171352255804207,], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        accessToken: 'accessToken'
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var monarchGeoJSON = false;
    var newMonarch = document.getElementById('monarch').value;
    var newMonarch2 = document.getElementById('monarch2').value;
    var url = 'data/json/' + newMonarch + '.json'
    var url2 = 'data/json/' + newMonarch2 + '.json'
    fetch(url, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(json => {
            var min = 0;
            var max = 0;
            monarchGeoJSON = L.geoJSON(json, {
                style: function (feature) {
                    return {
                        fillOpacity: 1,
                        fillColor: 'blue',
                        color: '#000',
                        opacity: 1
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function () {
                        layer.setStyle({
                            fillOpacity: 0.3
                        })

                    })
                    layer.on('mouseout', function () {
                        layer.setStyle({
                            fillOpacity: 1
                        })
                        $('#country-information').html(layer.feature.properties.name + '(' + layer.feature.id + ')');
                    })
                },
                pointToLayer: function (geoJsonPoint, latlng) {
                    if (geoJsonPoint.properties.id < min || min === 0) {
                        min = geoJsonPoint.properties.id;
                    }
                    if (geoJsonPoint.properties.id > max) {
                        max = geoJsonPoint.properties.id;
                    }
                    var html = '';
                    var arrayOfProps = ['location', 'id', 'date', 'comments'];
                    arrayOfProps.forEach(function (prop) {
                        html += '<strong>' + prop + '</strong>' + ': ' + geoJsonPoint.properties[prop] + '<br/>'
                    })
                    return L.circle(latlng, 5000).bindPopup(html);
                },
            }).addTo(map);
        })

    fetch(url2, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(json => {
            var min = 0;
            var max = 0;
            monarchGeoJSON = L.geoJSON(json, {
                style: function (feature) {
                    return {
                        fillOpacity: 0.5,
                        fillColor: 'red',
                        color: '#000',
                        opacity: 1
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function () {
                        layer.setStyle({
                            fillOpacity: 0.15
                        })

                    })
                    layer.on('mouseout', function () {
                        layer.setStyle({
                            fillOpacity: 0.5
                        })
                        $('#country-information').html(layer.feature.properties.name + '(' + layer.feature.id + ')');
                    })
                },
                pointToLayer: function (geoJsonPoint, latlng) {
                    if (geoJsonPoint.properties.id < min || min === 0) {
                        min = geoJsonPoint.properties.id;
                    }
                    if (geoJsonPoint.properties.id > max) {
                        max = geoJsonPoint.properties.id;
                    }
                    var html = '';
                    var arrayOfProps = ['location', 'id', 'date', 'comments'];
                    arrayOfProps.forEach(function (prop) {
                        html += '<strong>' + prop + '</strong>' + ': ' + geoJsonPoint.properties[prop] + '<br/>'
                    })
                    return L.circle(latlng, 5000).bindPopup(html);
                },
            }).addTo(map);
        })

};



var express = require('express');
var postgeo = require("postgeo");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/', function(req, res) {
    var request = req.body;

    if(typeof request !== 'undefined' &&
        typeof request.latitude !== 'undefined' &&
        request.latitude
    ){
        var query = "SELECT DISTINCT ON(w.p_name) w.p_name, 'place' AS p_type, COALESCE(p.name, 'Bratislava') as p_district, \
            ST_AsGeoJSON(w.p_position) AS geometry, w.*,\
            ST_Distance(p_position, ST_GeomFromText('POINT("+request.longitude+" "+request.latitude+")', 4326)) AS p_distance \
            FROM workout_places w LEFT JOIN planet_osm_polygon p ON p.boundary = 'administrative' \
            AND p.admin_level = '10' AND ST_Contains(st_transform(p.way,26986), st_transform(w.p_position,26986))";
    } else {
        var query = "SELECT DISTINCT ON(w.p_name) w.p_name, 'place' AS p_type, COALESCE(p.name, 'Bratislava') as p_district, \
            ST_AsGeoJSON(w.p_position) AS geometry, w.*,\
            ST_Distance(p_position, ST_GeomFromText('POINT(17.063777899999998 48.158953399999994)', 4326)) AS p_distance \
            FROM workout_places w LEFT JOIN planet_osm_polygon p ON p.boundary = 'administrative' \
            AND p.admin_level = '10' AND ST_Contains(st_transform(p.way,26986), st_transform(w.p_position,26986))";
    }

    postgeo.connect("postgres://postgres@192.168.99.100:5432/postgres");

    postgeo.query(query, "geojson", function(data) {
        var places = data;
        query = "SELECT DISTINCT ON(w.p_name) w.p_name, 'bus_stop' AS p_type, p.name as stop_name, ST_AsGeoJSON(st_transform(p.way,4326)) AS geometry,\
            ST_Distance(st_transform(p.way,26986), st_transform(w.p_position,26986)) AS p_distance\
            FROM workout_places w LEFT JOIN planet_osm_point p ON p.public_transport = 'stop_position' AND p.operator = 'DPB'\
            AND ST_DWithin(st_transform(p.way,26986), st_transform(w.p_position,26986), 420)";
        postgeo.query(query, "geojson", function(data) {
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

            for(var k in places.features){
                places.features[k].properties["marker-symbol"] = "pitch";
                places.features[k].properties["marker-size"] = "large";
                places.features[k].properties["marker-color"] = "#4FC29F";
            }
            for(var k in data.features){
                data.features[k].properties["marker-symbol"] = "bus";
                data.features[k].properties["marker-color"] = "#990000";
            }
            res.json({
                "places": places,
                "bus_stops": data
            });
        });
    });
});

app.listen(3000);
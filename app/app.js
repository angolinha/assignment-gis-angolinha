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
        var query = "SELECT p_id, p_name, p_placement, p_equipment, ST_AsGeoJSON(p_position) AS geometry, \
            ST_Distance(p_position, ST_GeomFromText('POINT("+request.longitude+" "+request.latitude+")', 4326)) AS p_distance FROM workout_places";
    } else {
        var query = "SELECT p_id, p_name, p_placement, p_equipment, ST_AsGeoJSON(p_position) AS geometry, \
            ST_Distance(p_position, ST_GeomFromText('POINT(17.0637918 48.1589835)', 4326)) AS p_distance FROM workout_places";
    }

    postgeo.connect("postgres://postgres@192.168.99.100:5432/postgres");

    postgeo.query(query, "geojson", function(data) {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

        res.json(data);
    });
});

app.listen(3000);
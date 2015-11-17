var express = require('express');
var postgeo = require("postgeo");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
var router = express.Router();

router.get('/', function(req, res) {
    postgeo.connect("postgres://postgres@192.168.99.100:5432/postgres");

    postgeo.query("SELECT p_id, p_name, p_placement, p_equipment, ST_AsGeoJSON(p_position) AS geometry FROM workout_places", "geojson", function(data) {
        res.header('Access-Control-Allow-Origin', ['*']);
        res.json(data);
    });
});

app.use('/api', router);

app.listen(port);
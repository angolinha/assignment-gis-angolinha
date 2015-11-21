# Overview

The application displays public street workout places in Bratislava city:
- find the place closest to your position
- find the bus stop closest to any workout place
- filter places by equipment available
- filter places by city district
- filter places by indoor/outdoor placement

Sample screenshot:

![Screenshot](screenshot.png)

The application has 2 separate parts:
- the client which is a [AngularJS web application](#frontend) using mapbox API and mapbox.js
- the [backend application](#backend) written in [ExpressJS](http://expressjs.com/), communicating with PostGIS via [Postgeo plugin](https://www.npmjs.com/package/postgeo).
The frontend application communicates with backend using a [REST API](#api).

# Setup

- install and run Docker container mdillon//postgis (docker run -p 5432:5432 -d mdillon/postgis)
- connect to database `postgres` and run SQL commands from `/data/load.sql`
- download OSM data for Bratislava city and import them into mentioned database (osm2pgsql -H 192.168.99.100 -P 5432 -s -U postgres -d postgres data/Bratislava.osm)
- go to application root (cd app) and run API server (node app.js) that will be listening on port 3000

# Frontend

The frontend application consists of HTML page `/app/index.html` and AngularJS module `/app/angularApp.js` which shows map using mapbox.js widget and communicates with backend via AJAX calls. Map displays public workout places in Bratislava city.

# Backend

The backend application is written in ExpressJS (application server for NodeJS) and it's just simple API endpoint querying data from PostgreSQL database using postgeo plugin and returning them in GeoJSON format. Module can be found at `/app/app.js`.

## Data

Application uses direct access to MapBox API for map rendering. Only other data sources are:
- public workout location data created via Google My Maps, exported in KML format and transformed into Postgis queries
- OSM export of portion of Bratislava city

## Api

**API accepts queries via POST in JSON format. Only query parameter is current user's geolocation (longitude, latitude)**

### Response

API returns array with 3 `geojsons` which contain geometry and properties for each finded locality. Localities are divided into three groups:
- workout places
- bus stops
- city districts

Properties that are later used in interface are:

- equipment list
- city district into which every specific place belongs
- distance from current user's geolocation
- distance from closest bus stop
- INDOOR/OUTDOOR flag

Sample record:

```
{
    "bus_stops": {
        "features": [
            {
                "geometry": {
                    "coordinates": [
                        17.1572392793896,
                        48.1767909663108
                    ],
                    "type": "Point"
                },
                "properties": {
                    "marker-color": "#990000",
                    "marker-symbol": "bus",
                    "p_distance": 378.131727412405,
                    "p_name": "Crossfit Proton",
                    "p_type": "bus_stop",
                    "stop_name": "Mierová kolónia"
                },
                "type": "Feature"
            }
        ],
        "type": "FeatureCollection"
    },
    "places": {
        "features": [
            {
                "geometry": {
                    "coordinates": [
                        17.1547651,
                        48.1738418
                    ],
                    "type": "Point"
                },
                "properties": {
                    "marker-color": "#4FC29F",
                    "marker-size": "large",
                    "marker-symbol": "pitch",
                    "p_distance": 0.0921972614474001,
                    "p_district": "Nové Mesto",
                    "p_equipment": [
                        "vysoka_hrazda",
                        "kruhy",
                        "bradla"
                    ],
                    "p_id": 13,
                    "p_name": "Crossfit Proton",
                    "p_placement": "INDOOR",
                    "p_position": "0101000020E6100000EA0F83AF9E273140C1D6B67240164840",
                    "p_type": "place"
                },
                "type": "Feature"
            }
        ],
        "type": "FeatureCollection"
    }
}
```
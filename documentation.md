# Overview

The application displays public street workout places in Bratislava city:
- find the place closest to your position
- find the place closest to any bus stop
- filter places by equipment available
- filter places by city district
- filter places by indoor/outdoor placement

Sample screenshot:

![Screenshot](screenshot.png)

The application has 2 separate parts, the client which is a [frontend web application](#frontend) using mapbox API and mapbox.js and the [backend application](#backend) written in [Rails](http://rubyonrails.org/), backed by PostGIS. The frontend application communicates with backend using a [REST API](#api).

# Frontend

The frontend application is HTML page `/app/views/home/index.html.erb` which shows map using mapbox.js widget. To communicate with backend is used Javascript (jQuery and AJAX). On map are shown supermarkets and malls in Bratislava region. My own style of map is based on Street style. I modified the map style in following things:
- changed color of roads - highways (red), main roads (yellow), streets (black)
- changed color of buildings and places - hospital (red), cementary (gray), parking (blue)
I modified roads colors to easily find way to supermarket. Parking has had same color as buildings, so I changed it to easily find parking close to supermarket.

Frontend code which reads form inputs, initiates the map, redirects to results and reads position of marker from map is in `/app/views/home/index.html.erb`. Other frontend code - to communicate with backend (AJAX) and render geojson to map returned from backend is in `app/assets/javascripts/application.js`.

# Backend

The backend application is written in Ruby on Rails and is responsible for querying geo data and formatting the geojson. This functionality is implemented in `app/models/Planet_osm_polygon.rb`, data receiver from frontend is implemented in `app/controllers/home_controller.rb` and output from backend is rendered in `app/views/home/generate_geojson.json.erb`.

## Data

Data is coming directly from Open Street Maps. I downloaded Bratislava region data (around 200 MB) and imported it using the `osm2pgsql` tool into the standard OSM schema in WGS 84 with hstore enabled. To speedup queries I created these indexes:
- on column `name` in table `planet_osm_polygons`
- on column `highway` in table `planet_osm_lines`
- on column `highway` in table `planet_osm_points`
- on column `title` in table `shops`

## Api

**Find closest supermarkets and malls by name, from specific position**

`POST '/generate_gejson?parameter=1&latitude= 48.190206&longitude=17.045348&search_for_centers=1&filter=Billa,Lidl,Baumax`

### Response

API returns `geojson` which contains geometry and properties for each finded supermarket. I get geometry from PostGIS function `ST_AsGeoJSON`, and properties are created by data from database. Example for properties part of geojson:
```
{
  "fillColor": "#FF00FF",
  "weight": "20",
    "color": "#FF00FF",
    "fillOpacity": 0.8,
    "title": "Billa",
    "distance": "329 metres away",
    "area": "400",
    "from": "Saratovská",
    "description": "234 metres away, area of shop: 400 m<sup>2</sup>"
}
```

`geojson` contains a geojson with locations of all matched supermarkets or malls and style definitions.
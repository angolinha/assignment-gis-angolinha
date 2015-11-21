var app = angular.module('pdtApp', ['ui.router', 'ngTagsInput']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('root', {
      'url': '/',
      'controller': 'appCtrl'
    });
  }
]);

app.controller('appCtrl', [
  '$scope', '$http', '$window',
  function ($scope, $http, $window) {

    $scope.init = function(map){
      $scope.equipment = [
        {"name": "vysoká hrazda", "value": "vysoka_hrazda"},
        {"name": "nízka hrazda", "value": "nizka_hrazda"},
        {"name": "rebriny", "value": "rebriny"},
        {"name": "bradlá", "value": "bradla"},
        {"name": "kruhy", "value": "kruhy"},
        {"name": "nízke bradlá", "value": "nizke_bradla"}
      ];
      $scope.districts = [
        { "name": "Centrálna Rača" },
        { "name": "Háje" },
        { "name": "Nivy" },
        { "name": "Mlynská dolina" },
        { "name": "Nové Mesto" },
        { "name": "Dlhé diely" },
        { "name": "Karlova Ves" },
        { "name": "Oblasť Bôrik" },
        { "name": "Lúky" }
      ];
      $scope.query = {
        "indoor": false,
        "outdoor": false,
        "bus_close": false,
        "closest": false,
        "districts": [],
        "equipment": []
      };
      $scope.longitude = null;
      $scope.latitude = null;
      $scope.places = null;
      $scope.stops = null;
      $scope.map_districts = null;
      $scope.min_from_me = 100000;
      $scope.min_from_bus = 100000;
      if(typeof map === 'undefined'){
        $window.map.setView([48.1447422, 17.110000], 12);
        $scope.map = $window.map;
      } else {
        map.setView([48.1447422, 17.110000], 12);
        $scope.map = map;
      }
      if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, query);
      } else {
        query();
      }
    }

    function query(){
      $http({
        method: 'POST',
        url: 'http://localhost:3000/api/',
        data: {
          "longitude": $scope.longitude,
          "latitude": $scope.latitude
        }
      }).then(function successCallback(response) {
        $scope.places = L.mapbox.featureLayer()
          .setGeoJSON(response.data.places.features)
          .addTo($scope.map)
          .setFilter(filter_places);

        $scope.stops = L.mapbox.featureLayer()
          .setGeoJSON(response.data.bus_stops.features)
          .addTo($scope.map)
          .setFilter(filter_stops);

        $scope.map_districts = L.mapbox.featureLayer()
          .setGeoJSON(response.data.districts.features)
          .addTo($scope.map);

        bind_popups();
      });
    }

    function bind_popups(){
      $scope.places.eachLayer(function(marker) {
        marker.bindPopup(
          '<h2>' + marker.toGeoJSON().properties.p_name + '<\/h2><small>' +
          marker.toGeoJSON().properties.p_district + '<\/small><\/h2>' +
          '<p>' + marker.toGeoJSON().properties.p_placement + '<\/p>'
        );
      });

      $scope.stops.eachLayer(function(marker) {
        marker.bindPopup(
          '<h2>' + marker.toGeoJSON().properties.stop_name + '<\/h2><small>' +
          '<b>Closest to: <\/b>' + marker.toGeoJSON().properties.p_name + '<\/small><\/h2>'
        );
      });
    }

    function filter_places(place){
      if(place.properties.p_distance < $scope.min_from_me){
        $scope.min_from_me = place.properties.p_distance;
      }
      if($scope.query.closest && $scope.min_from_me != place.properties.p_distance){
        return false;
      }
      if($scope.query.indoor && !$scope.query.outdoor && place.properties.p_placement == 'OUTDOOR'){
        return false;
      }
      if($scope.query.outdoor && !$scope.query.indoor && place.properties.p_placement == 'INDOOR'){
        return false;
      }
      if($scope.query.equipment.length){
        for(var k in $scope.query.equipment){
          if(place.properties["p_equipment"].indexOf($scope.query.equipment[k].value) == -1){
            return false;
          }
        }
      }
      if($scope.query.districts.length){
        for(var k in $scope.query.districts){
          if(place.properties["p_district"] == $scope.query.districts[k].name){
            return true;
          }
        }
        return false;
      }
      return true;
    }

    function filter_stops(stop){
      if(stop.properties.p_distance < $scope.min_from_bus){
        $scope.min_from_bus = stop.properties.p_distance;
      }
      if($scope.query.bus_close && $scope.min_from_bus != stop.properties.p_distance){
        return false;
      }
      return true;
    }

    function success(position){
      $scope.$apply(function(){
        $scope.longitude = position.coords.longitude;
        $scope.latitude = position.coords.latitude;
        query();
      });
    }

    $scope.filter = function(){
      $scope.places.setFilter(filter_places);
      $scope.stops.setFilter(filter_stops);
      bind_popups();
    }

    $scope.loadEquipment = function($query) {
      return $scope.equipment.filter(function(item) {
        return item.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    };

    $scope.loadDistricts = function($query) {
      return $scope.districts.filter(function(item) {
        return item.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    };
  }
]);

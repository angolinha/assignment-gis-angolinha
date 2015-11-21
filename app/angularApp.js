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
      $scope.places = [];
      $scope.stops = [];
      $scope.districts = [];
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
      console.log('querying');
      $http({
        method: 'POST',
        url: 'http://localhost:3000/api/',
        data: {
          "longitude": $scope.longitude,
          "latitude": $scope.latitude
        }
      }).then(function successCallback(response) {
        if($scope.places.length){
          for(var k in $scope.places){
            $scope.places[k].eachLayer(function(marker) {
              $scope.map.removeLayer(marker);
            });
            $scope.map.removeLayer($scope.places[k]);
          }
          $scope.places = [];
        }
        if($scope.stops.length){
          for(var k in $scope.stops){
            $scope.stops[k].eachLayer(function(marker) {
              $scope.map.removeLayer(marker);
            });
            $scope.map.removeLayer($scope.stops[k]);
          }
          $scope.stops = [];
        }
        if($scope.districts.length){
          for(var k in $scope.stops){
            $scope.districts[k].eachLayer(function(marker) {
              $scope.map.removeLayer(marker);
            });
            $scope.map.removeLayer($scope.districts[k]);
          }
          $scope.districts = [];
        }
        var place = L.mapbox.featureLayer()
          .setGeoJSON(response.data.places.features)
          .addTo($scope.map)
          .setFilter(filter_places);

        var stop = L.mapbox.featureLayer()
          .setGeoJSON(response.data.bus_stops.features)
          .addTo($scope.map)
          .setFilter(filter_stops);

        var district = L.mapbox.featureLayer()
          .setGeoJSON(response.data.districts.features)
          .addTo($scope.map)
          .setFilter(filter_districts);

        place.eachLayer(function(marker) {
          marker.bindPopup(
            '<h2>' + marker.toGeoJSON().properties.p_name + '<\/h2><small>' +
            marker.toGeoJSON().properties.p_district + '<\/small><\/h2>' +
            '<p>' + marker.toGeoJSON().properties.p_placement + '<\/p>'
          );
        });

        stop.eachLayer(function(marker) {
          marker.bindPopup(
            '<h2>' + marker.toGeoJSON().properties.stop_name + '<\/h2><small>' +
            '<b>Closest to: <\/b>' + marker.toGeoJSON().properties.p_name + '<\/small><\/h2>'
          );
        });
        $scope.places.push(place);
        $scope.stops.push(stop);
        $scope.districts.push(district);
      });
    }

    function filter_places(place){
      if($scope.query.indoor && !$scope.query.outdoor && place.properties.p_placement == 'OUTDOOR'){
        return false;
      }
      if($scope.query.outdoor && !$scope.query.indoor && place.properties.p_placement == 'INDOOR'){
        return false;
      }
      // if($scope.query.equipment.length){
      //   var matches = 0;
      //   for(var k in $scope.query.equipment){
      //     for(var j in f.properties["p_equipment"]){
      //       if(f.properties["p_equipment"][j] == $scope.query.equipment[k]){
      //         matches++;
      //       }
      //     }
      //   }
      //   if(matches == $scope.query.equipment.length){
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }
      return true;
    }

    function filter_stops(stops){
      return true;
    }

    function filter_districts(districts){
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
      $scope.places[$scope.places.length-1].setFilter(filter_places);
      $scope.stops[$scope.stops.length-1].setFilter(filter_stops);
      $scope.districts[$scope.districts.length-1].setFilter(filter_districts);
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

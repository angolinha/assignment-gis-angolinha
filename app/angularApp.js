var app = angular.module('pdtApp', ['ui.router', 'ngTagsInput']);

app.directive('mapbox', [
  function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function (scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1IjoiYW5nb2xpbmhhIiwiYSI6ImNpZnliN3B3ZjAyZ2F0Y20waHJjdmE2NTQifQ.zIEssGxujGGZ01-RoO5dPQ';
        var map = L.mapbox.map(element[0], 'angolinha.o6879d61');
        scope.callback(map);
      }
    };
  }
]);

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
  '$scope', '$http',
  function ($scope, $http) {
    init();

    function init(){
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
      $scope.force = false;
      $scope.places = [];
      $scope.stops = [];
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
        var places = filter_places(response.data.places.features);
        var stops = filter_stops(response.data.bus_stops.features);
        var place = L.mapbox.featureLayer().setGeoJSON(places).addTo($scope.map);
        var stop = L.mapbox.featureLayer().setGeoJSON(stops).addTo($scope.map);

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
      });
    }

    function filter_places(places){
      var result = [];
      for(var k in places){
        if($scope.query.indoor && !$scope.query.outdoor && places[k].properties.p_placement == 'OUTDOOR'){
          continue;
        }
        if($scope.query.outdoor && !$scope.query.indoor && places[k].properties.p_placement == 'INDOOR'){
          continue;
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
        result.push(places[k]);
      }
      return result;
    }

    function filter_stops(stops){
      return stops;
    }

    function success(position){
      $scope.$apply(function(){
        $scope.longitude = position.coords.longitude;
        $scope.latitude = position.coords.latitude;
        query();
      });
    }

    $scope.filter = function(){
      $scope.force = true;
      query();
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

    $scope.callback = function(map) {
      map.setView([48.1447422, 17.110000], 12);
      $scope.map = map;
      if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, query);
      } else {
        query();
      }
    };
  }
]);

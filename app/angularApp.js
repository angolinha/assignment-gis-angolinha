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
        { "name": "Mlynská dolina" }, { "name": "Ostredky" }, { "name": "Nové Mesto" },
        { "name": "Krasňany" }, { "name": "Vinohrady" }, { "name": "Vlčie hrdlo" },
        { "name": "Trnávka" }, { "name": "Karlova Ves" }, { "name": "Dlhé diely" },
        { "name": "Bratislava - mestská časť Staré Mesto" }, { "name": "Pasienky" },
        { "name": "Slovany" }, { "name": "Oblasť Drotárska cesta" }, { "name": "Lamač" },
        { "name": "okres Bratislava I" }, { "name": "Oblasť Slavín" }, { "name": "Kramáre" },
        { "name": "Jurajov dvor" }, { "name": "Čierna voda" }, { "name": "Rovinka" },
        { "name": "Historické jadro" }, { "name": "Dvory" }, { "name": "Dúbravka" },
        { "name": "Háje" }, { "name": "Štrkovec" }, { "name": "Berg" },
        { "name": "Kopčany" }, { "name": "Lúky" }, { "name": "Oblasť Obchodná" },
        { "name": "Oblasť Patrónka" }, { "name": "Oblasť Dunajská" }, { "name": "Ružinov" },
        { "name": "Vrakuňa" }, { "name": "Farná" }, { "name": "Mierová kolónia" },
        { "name": "Trávniky" }, { "name": "Oblasť Partizánska" }, { "name": "Oblasť Bôrik" },
        { "name": "Prievoz" }, { "name": "Pošeň" }, { "name": "Starý Ružinov" },
        { "name": "Žabí majer" }, { "name": "Kapitulský Dvor" }, { "name": "Nivy" },
        { "name": "Východné" }, { "name": "Vajnory" }, { "name": "Medzi jarkami" },
        { "name": "Oblasť Žilinská" }, { "name": "Tehelné pole" }
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
        var markers = L.mapbox.featureLayer().setGeoJSON(response.data.features).addTo($scope.map);

        markers.setFilter(function(f){
          if($scope.query.equipment.length){
            var matches = 0;
            for(var k in $scope.query.equipment){
              for(var j in f.properties["p_equipment"]){
                if(f.properties["p_equipment"][j] == $scope.query.equipment[k]){
                  matches++;
                }
              }
            }
            if(matches == $scope.query.equipment.length){
              return true;
            } else {
              return false;
            }
          }
          return true;
          //return (filter === 'all') ? true : f.properties["p_distance"] === true;
        });
      });
    }

    $scope.run_query = function(){
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

    $scope.callback = function (map) {
      map.setView([48.1447422, 17.110000], 12);
      $scope.map = map;
      // if(navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position){
      //     $scope.$apply(function(){
      //       console.log(position);
      //       $scope.longitude = position.coords.longitude;
      //       $scope.latitude = position.coords.latitude;
      //       query();
      //     });
      //   });
      // } else {
        query();
      // }
    };
  }
]);

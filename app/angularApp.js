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
        var mapBox = L.mapbox;
        scope.callback(map, mapBox);
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
        {"id": 0, "name": "vysoká hrazda", "value": "vysoka_hrazda"},
        {"id": 1, "name": "nízka hrazda", "value": "nizka_hrazda"},
        {"id": 2, "name": "rebriny", "value": "rebriny"},
        {"id": 3, "name": "bradlá", "value": "bradla"},
        {"id": 4, "name": "kruhy", "value": "kruhy"},
        {"id": 5, "name": "nízke bradlá", "value": "nizke_bradla"}
      ];
      $scope.districts = [
        { "id": 1, "name": "Oblasť Bôrik" },
        { "id": 2, "name": "Oblasť Partizánska" },
        { "id": 3, "name": "Oblasť Dunajská" },
        { "id": 4, "name": "Krasňany" },
        { "id": 5, "name": "Berg" },
        { "id": 6, "name": "Dvory" },
        { "id": 7, "name": "Rovinka" },
        { "id": 8, "name": "Slovany" },
        { "id": 9, "name": "Kapitulský Dvor" },
        { "id": 10, "name": "Dlhé diely" },
        { "id": 11, "name": "Nivy" },
        { "id": 12, "name": "Karlova Ves" },
        { "id": 13, "name": "Oblasť Drotárska cesta" },
        { "id": 14, "name": "Lamač" },
        { "id": 15, "name": "okres Bratislava I" },
        { "id": 16, "name": "Oblasť Slavín" },
        { "id": 17, "name": "Kramáre" },
        { "id": 18, "name": "Jurajov dvor" },
        { "id": 19, "name": "Čierna voda" },
        { "id": 20, "name": "Trnávka" },
        { "id": 21, "name": "Historické jadro" },
        { "id": 22, "name": "Vlčie hrdlo" },
        { "id": 23, "name": "Dúbravka" },
        { "id": 24, "name": "Háje" },
        { "id": 25, "name": "Štrkovec" },
        { "id": 26, "name": "Vinohrady" },
        { "id": 27, "name": "Kopčany" },
        { "id": 28, "name": "Lúky" },
        { "id": 29, "name": "Oblasť Obchodná" },
        { "id": 30, "name": "Oblasť Patrónka" },
        { "id": 31, "name": "Nové Mesto" },
        { "id": 32, "name": "Ružinov" },
        { "id": 33, "name": "Vrakuňa" },
        { "id": 34, "name": "Farná" },
        { "id": 35, "name": "Mierová kolónia" },
        { "id": 36, "name": "Trávniky" },
        { "id": 37, "name": "Ostredky" },
        { "id": 38, "name": "Mlynská dolina" },
        { "id": 39, "name": "Prievoz" },
        { "id": 40, "name": "Pošeň" },
        { "id": 41, "name": "Starý Ružinov" },
        { "id": 42, "name": "Žabí majer" },
        { "id": 43, "name": "Bratislava - mestská časť Staré Mesto" },
        { "id": 44, "name": "Pasienky" },
        { "id": 45, "name": "Východné" },
        { "id": 46, "name": "Vajnory" },
        { "id": 47, "name": "Medzi jarkami" },
        { "id": 48, "name": "Oblasť Žilinská" },
        { "id": 49, "name": "Tehelné pole" }
      ];
      $scope.query = {
        "indoor": false,
        "outdoor": false,
        "districts": [],
        "equipment": []
      };
    }

    function query(){
      $http({
        method: 'GET',
        url: 'http://localhost:3000/api/'
      }).then(function successCallback(response) {
        $scope.geojson = response.data.features;
        $scope.mapBox.featureLayer().setGeoJSON($scope.geojson).addTo($scope.map);
      });
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

    $scope.callback = function (map, mapBox) {
      map.setView([48.1447422, 17.110000], 12);
      $scope.map = map;
      $scope.mapBox = mapBox;
      query();
    };
  }
]);

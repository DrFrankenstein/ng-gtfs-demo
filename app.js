(function (angular) {

  angular.module("ng-gtfs", ["ngRoute", "ui.bootstrap"])
    .config(routeConfig)
    .value("_", window._)
    .value("Papa", window.Papa)
  ;

  routeConfig.$inject = ["$routeProvider"];
  function routeConfig($routeProvider)
  {
    $routeProvider
      .when("/agency/:feedname/:agencyname", {
        templateUrl: "partials/agency-info.html",
        controller: "AgencyInfoCtrl",
        controllerAs: "ctrl"
      })
      .when("/route/:feedname/:routeId", {
        templateUrl: "partials/route-info.html",
        controller: "RouteInfoCtrl",
        controllerAs: "ctrl"
      })
      .otherwise({
        templateUrl: "partials/agency-list.html",
        controller: "AgencyListCtrl",
        controllerAs: "ctrl"
        //templateUrl: "partials/feed-list.html",
        //controller: "FeedListCtrl",
        //controllerAs: "feedList"
      });
  }

})(window.angular);
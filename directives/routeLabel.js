(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .directive("routeLabel", routeLabel)
  ;

  routeLabel.$inject = ["$location"];
  function routeLabel($location)
  {
    return {
      templateUrl: "/partials/route-label.html",
      scope: {
        route: "=",
        feedname: "="
      },
      controller: RouteLabelCtrl,
      controllerAs: "ctrl",
      bindToController: true
    };

    function RouteLabelCtrl()
    {
      this.typeClasses = [
        "fa-subway", "fa-subway", "fa-train", "fa-bus", "fa-ship", "fa-subway", "fa-subway", "fa-subway"
      ];
      this.typeNames = [
        "Tram", "Subway", "Rail", "Bus", "Ferry", "Cable car", "Gondola", "Funicular"
      ];

      this.gotoRoute = function (route) {
        $location.path("/route/" + this.feedname + "/" + route.route_id);
      };
    }
  }

})(window.angular);

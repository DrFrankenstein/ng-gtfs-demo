(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .directive("routeTable", routeTable)
  ;

  routeTable.$inject = ["$location", "_", "routes"];
  function routeTable($location, _, routes)
  {
    return {
      templateUrl: "/partials/route-table.html",
      scope: {
        routes: "=",
        feedname: "@",
        agency: "@"
      },
      controller: RouteTableCtrl,
      controllerAs: "ctrl",
      bindToController: true
    };

    function RouteTableCtrl()
    {
      this.gotoRoute = function (route) {
        $location.path("/route/" + this.feedname + "/" + route.route_id);
      };

      if (angular.isUndefined(this.routes))
      {
        routes.routesForAgency(this.feedname, this.agency).then(_.bind(
          function (routeData) {
            this.routes = routeData;
          },
          this));
      }
    }
  }
})(window.angular);
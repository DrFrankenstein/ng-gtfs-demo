(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .directive("tripTable", tripTable)
  ;

  tripTable.$inject = ["_", "trips"];
  function tripTable(_, trips)
  {
    return {
      templateUrl: "/partials/trip-table.html",
      scope: {
        trips: "=",
        feedname: "@",
        route: "@"
      },
      controller: TripTableCtrl,
      controllerAs: "ctrl",
      bindToController: true,
      replace: true // play well with bootstrap
    };

    function TripTableCtrl()
    {
      if (angular.isUndefined(this.trips))
      {
        trips.tripsForRoute(this.feedname, this.route).then(_.bind(
          function (tripData) {
            this.trips = tripData;
          },
          this));
      }
    }
  }
  
})(window.angular);
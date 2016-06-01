(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("trips", trips)
  ;

  trips.$inject = ["$q", "_", "fetchCsv"];
  function trips($q, _, fetchCsv)
  {
    var tripsCache = {};

    function fetchTrips(feedname)
    {
      return fetchCsv("/gtfs/" + feedname + "/trips.txt").then(
        function (data) {
          return tripsCache[feedname] = data.data;
        }
      );
    }

    function tripsInFeed(feedname)
    {
      if (feedname in tripsCache)
        return $q.when(tripsCache[feedname]);
      else
        return fetchTrips(feedname);
    }

    function tripsForRoute(feedname, routeId)
    {
      return tripsInFeed(feedname).then(function (trips) {
        return _.where(trips, { route_id: routeId });
      });
    }

    return {
      tripsInFeed: tripsInFeed,
      tripsForRoute: tripsForRoute
    };
  }
})(window.angular);
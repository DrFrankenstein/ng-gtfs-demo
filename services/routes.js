(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("routes", routes)
  ;

  routes.$inject = ["$q", "_", "fetchCsv"];
  function routes($q, _, fetchCsv)
  {
    var routeCache = {};

    function fetchRoutes(feedname)
    {
      return fetchCsv("/gtfs/" + feedname + "/routes.txt").then(
        function (data) {
          return routeCache[feedname] = _.indexBy(data.data, "route_id");
        }
      );
    }

    function routesInFeed(feedname)
    {
      if (feedname in routeCache)
        return $q.when(routeCache[feedname]);
      else
        return fetchRoutes(feedname);
    }

    function routesForAgency(feedname, agency_id)
    {
      return routesInFeed(feedname).then(
        function (routes) {
          if (angular.isDefined(agency_id) && _.some(routes, "agency_id"))
            // only filter if an agency_id is specified *and* the data actually has that info
            routes = _.where(routes, {agency_id: agency_id});
          return routes;
        }
      );
    }

    function route(feedname, route_id)
    {
      return routesInFeed(feedname).then(
        function (routes) {
          return routes[route_id];
        }
      );
    }

    return {
      route: route,
      routesForAgency: routesForAgency
    };
  }

})(window.angular);
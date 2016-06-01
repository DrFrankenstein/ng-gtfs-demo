(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .controller("RouteInfoCtrl", RouteInfoCtrl)
  ;

  RouteInfoCtrl.$inject = ["$filter", "$routeParams", "_", "agency", "routes", "trips", "calendar", "stopTimes"];
  function RouteInfoCtrl($filter, $routeParams, _, agency, routes, trips, calendar, stopTimes)
  {
    this.feedname = $routeParams.feedname;
    this.routeId = $routeParams.routeId;

    routes.route(this.feedname, this.routeId).then(
      _.bind(function (routeData) {
        this.route = routeData;
      }, this)
    ).then(
      _.bind(function () {
        agency.agency(this.feedname, this.route.agency_id).then(
          _.bind(function (agency) {
            this.agency = agency;
          }, this)
        );
      }, this)
    );

    trips.tripsForRoute(this.feedname, this.routeId).then(
      _.bind(function (trips) {
        var tripsByService = _.groupBy(trips, "service_id");

        calendar.calendarForServices(this.feedname, _.keys(tripsByService)).then(
          _.bind(function (calendar) {

            var services = _.indexBy(calendar.services, "service_id");
            
            // add .trips property to services
            _.forOwn(services, function (service, id) {
              service.trips = tripsByService[id];
              service.exceptionsVisible = false;
            });

            // add .exceptions property to services
            _(calendar.dates)
              .where({ exception_type: "2" }) // service removed
              .sortBy("date")
              .groupBy("service_id")
              .forIn(function (dates, id) {
                services[id].exceptions = _.pluck(dates, "date");
              })
              .commit();

            calendar.dates = _(calendar.dates)
              .where({ exception_type: "1" }) // service added
              .sortBy("date")
              .groupBy("service_id")
              .map(function (dates, id) {
                return {
                  service_id: id,
                  trips: tripsByService[id],
                  dates: _.pluck(dates, "date"),
                  calendarDates: dates
                };
              })
              .value();

            this.calendar = calendar;
          }, this)
        );

        _.each(trips, function (trip) {
          stopTimes.tripStartTime(this.feedname, trip.trip_id).then(
            function (startTime) { trip.start_time = startTime; }
          );
        }, this);
      }, this)
    );
  }

})(window.angular);
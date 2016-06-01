(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("calendar", calendar)
  ;

  calendar.$inject = ["$q", "_", "fetchCsv"];
  function calendar($q, _, fetchCsv)
  {
    var calendarCache = {};
    var calendarDateCache = {};

    function fetchCalendar(feedname)
    {
      var promises = {};
      // According to the doc, calendar.txt is required and calendar_dates.txt is optional.
      // However, the actual requirement seems to be that there be at least one of the two,
      // as per the doc on calendar_dates.txt
      promises.services = fetchCsv("/gtfs/" + feedname + "/calendar.txt").then(
        function (data) { return calendarCache[feedname] = data.data; },
        function () { return calendarCache[feedname] = []; }
      );
      promises.dates = fetchCsv("/gtfs/" + feedname + "/calendar_dates.txt").then(
        function (data) { return calendarDateCache[feedname] = _.indexBy(data.data, "date"); },
        function () { return calendarDateCache[feedname] = {}; }
      );
      return $q.all(promises);
    }

    function combineCalendars(feedname)
    {
      return {
        services: calendarCache[feedname],
        dates: calendarDateCache[feedname]
      };
    }

    function calendarForFeed(feedname)
    {
      if (feedname in calendarCache)
        // assumes calendarDateCache was filled up at the same time
        return $q.when(combineCalendars(feedname));
      else
        return fetchCalendar(feedname);
    }

    function calendarForServices(feedname, services)
    {
      services = _.invert(services);  // flip the array into a hashset for faster searches
      return calendarForFeed(feedname).then(
        function (calendar) {
          function haveService(service) { return service.service_id in services; }
          calendar.services = _.filter(calendar.services, haveService);
          calendar.dates = _.filter(calendar.dates, haveService);
          return calendar;
        }
      );
    }

    return {
      calendarForFeed: calendarForFeed,
      calendarForServices: calendarForServices
    };
  }
})(window.angular);
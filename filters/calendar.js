(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .filter("calendarService", calendarServiceFactory)
    .filter("calendarDates", calendarDatesFactory)
  ;

  calendarServiceFactory.$inject = ["$filter"];
  function calendarServiceFactory($filter)
  {
    var isoify = $filter("isoifyDate");
    var date = $filter("date");

    return function calendarService(service) {
      var days = [];
      if (service.monday == "1") days.push("Mondays");
      if (service.tuesday == "1") days.push("Tuesdays");
      if (service.wednesday == "1") days.push("Wednesdays");
      if (service.thursday == "1") days.push("Thursdays");
      if (service.friday == "1") days.push("Fridays");
      if (service.saturday == "1") days.push("Saturdays");
      if (service.sunday == "1") days.push("Sundays");

      var description = days.join(", ");
      description += " from " + date(isoify(service.start_date)) +
        " to " + date(isoify(service.end_date));
      return description;
    };
  }

  calendarDatesFactory.$inject = ["$filter", "_"];
  function calendarDatesFactory($filter, _)
  {
    var isoify = $filter("isoifyDate");
    var dateFilter = $filter("date");

    return function calendarDates(dates) {
      var description = [];
      _.forEach(dates, function (date) {
        description.push(dateFilter(isoify(date)));
      });
      return description.join(", ");
    };
  }

})(window.angular);

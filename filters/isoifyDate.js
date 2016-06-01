(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .filter("isoifyDate", isoifyDateFactory)
  ;

  function isoifyDateFactory()
  { // Takes in a date in GTFS' format and converts it to ISO
    return function isoifyDate(gtfsdate) {
      return gtfsdate.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
    };
  }

})(window.angular);
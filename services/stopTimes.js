(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("stopTimes", stopTimes)
  ;

  stopTimes.$inject = ["$q", "_", "fetchCsv"];
  function stopTimes($q, _, fetchCsv)
  {
    var pending = null;
    var timesCache = {};

    function fetchTimes(feedname)
    {
      return fetchCsv("/gtfs/" + feedname + "/stop_times.txt").then(
        function (data) {
          pending = null;
          return timesCache[feedname] = _.groupBy(data.data, "trip_id");
        }
      );
    }

    function timesInFeed(feedname)
    {
      if (pending != null)
        return pending;
      else if (feedname in timesCache)
        return $q.when(timesCache[feedname]);
      else
        return pending = fetchTimes(feedname);
    }

    function timesForTrip(feedname, trip_id) {
      return timesInFeed(feedname).then(function (allTimes) {
        return allTimes[trip_id];
      });
    }

    function tripFirstStop(feedname, trip_id)
    {
      return timesForTrip(feedname, trip_id).then(function (times) {
        return _.reduce(times, function (first, curr) {
          if (curr.stop_sequence < first.stop_sequence)
            return curr;
          else return first;
        });
      });
    }

    function tripStartTime(feedname, trip_id)
    {
      return tripFirstStop(feedname, trip_id).then(
        function (stop) {
          return angular.isDefined(stop)? stop.departure_time : undefined;
        }
      );
    }

    function compareTimes(left, right)
    {
      var norm_left = parseInt(left.replace(":", ""), 10),
          norm_right = parseInt(right.replace(":", ""), 10);

      return norm_left < norm_right;
    }

    return {
      timesForTrip: timesForTrip,
      tripStartTime: tripStartTime
    };
  }

})(window.angular);

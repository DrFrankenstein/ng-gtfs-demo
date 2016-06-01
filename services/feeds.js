(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("feeds", feeds)
  ;

  feeds.$inject = ["$q", "fetchCsv", "_"];
  function feeds($q, fetchCsv, _)
  {
    var feedCache = null;

    function fetchFeeds()
    {
      return fetchCsv("/gtfs/list.txt").then(
        function (data) {
          return feedCache = _.indexBy(data.data, "name");
        }
      );
    }

    function allFeeds()
    {
      return (feedCache == null ? fetchFeeds() : $q.when(feedCache))
        .then(_.keys);
    }

    return {
      allFeeds: allFeeds
    };
  }

})(window.angular);
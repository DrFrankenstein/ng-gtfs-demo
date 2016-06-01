(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("agency", agency)
  ;

  agency.$inject = ["$q", "_", "fetchCsv"];
  function agency($q, _, fetchCsv)
  {
    var agencyCache = {};

    function fetchAgencies(feedname)
    {
      return fetchCsv("/gtfs/" + feedname + "/agency.txt").then(
        function (data) {
          var agencies = data.data;
          _.each(agencies, function (agency) {
            agency.feedname = feedname;
          });
          return agencyCache[feedname] = agencies;
        }
      );
    }

    function allAgencies(feednames)
    {
      return $q.all(_.map(feednames, agenciesInFeed))
        .then(_.flatten);
    }

    function agenciesInFeed(feedname)
    {
      if (feedname in agencyCache)
        return $q.when(agencyCache[feedname]);
      else
        return fetchAgencies(feedname);
    }

    function getAgency(feedname, agencyname)
    {
      return agenciesInFeed(feedname).then(
        function (agencies) {
          return angular.isDefined(agencyname) ?
            _.find(agencies, function (agency) {
              return agency.agency_id == agencyname || agency.agency_name == agencyname;
            }) :
            agencies[0]
          ;
        }
      );
    }

    return {
      allAgencies: allAgencies,
      agenciesInFeed: agenciesInFeed,
      agency: getAgency
    };
  }

})(window.angular);

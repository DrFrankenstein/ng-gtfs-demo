/// <reference path="/vendor/lodash.js" />
/// <reference path="/vendor/papaparse.js" />
/// <reference path="/vendor/angular.js" />
/// <reference path="/app.js" />

(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .service("gtfs", Gtfs)
  ;

  Gtfs.$inject = ["$q", "$http", "$log", "_", "Papa"];
  function Gtfs($q, $http, $log, _, Papa)
  {
    // PRIVATE

    var feeds = null;

    function fetchCsv(url)
    {
      return $http.get(url)
        .then(function (data) {
          var result = Papa.parse(
            data.data,
            { delimiter: ",", newline: "", header: true, dynamicTyping: true, skipEmptyLines: true }
          );
          if (result.errors.length) handleCsvErrors(url, result.errors);
          return result;
        });
    }

    function handleCsvErrors(url, errors) {
      _.each(errors, function (error) {
        $log.warn(url + "(" + error.row + "): " + error.message);
      });
    }

    function fetchFeeds()
    {
      return fetchCsv("/gtfs/list.txt")
        .then(function (data) {
          feeds = {};
          _.each(data.data, function (feed) {
            feeds[feed.name] = {};
          });
          return feeds;
        });
    }

    function cacheAgencies(feedname, agencies)
    {
      if (feeds == null) feeds = {};
      if (_.isUndefined(feeds[feedname])) feeds[feedname] = {};
      return feeds[feedname].agency = agencies
    }
    

    function fetchAgencies(feedname)
    {
      return fetchCsv("/gtfs/" + feedname + "/agency.txt")
        .then(function (data) {
          var agencies = data.data;
          _.each(agencies, function (agency) {
            agency.feedname = feedname;
          });
          return cacheAgencies(feedname, agencies);
        });
    }

    // PUBLIC

    this.feedList = function () {
      return (feeds == null ? fetchFeeds() : $q.when(feeds))
        .then(_.keys);
    };

    this.allAgencies = function () {
      return this.feedList()  // ensure feed list is loaded
        .then(_.bind(function (feeds) {
          var promises = [];
          _.each(feeds, function (feed) {
            promises.push(this.agencies(feed));
          }, this);
          return $q.all(promises).then(function (combined) {
            return _.flatten(combined);
          });
        }, this));
    };

    this.agencies = function (feedname) {
      if (feeds != null && "agency" in feeds[feedname])
        return $q.when(feeds[feedname].agency);
      else
        return fetchAgencies(feedname);
    };

    this.agency = function (feedname, agencyname) {
      return this.agencies(feedname)
        .then(function (agencies) {
          return _.find(agencies, function (agency) {
            return agency.agency_id == agencyname || agency.agency_name == agencyname;
          });
        });
    };
  }

})(window.angular);
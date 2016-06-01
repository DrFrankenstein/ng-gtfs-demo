(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .controller("AgencyListCtrl", AgencyListCtrl)
  ;

  AgencyListCtrl.$inject = ["_", "feeds", "agency"];
  function AgencyListCtrl(_, feeds, agency)
  {
    feeds.allFeeds()
      .then(agency.allAgencies)
      .then(
        _.bind(function (agencies) {
          this.agencies = agencies;
        }, this)
    );
  }

})(window.angular);
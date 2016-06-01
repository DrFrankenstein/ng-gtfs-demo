(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .controller("AgencyInfoCtrl", AgencyInfoCtrl)
  ;

  AgencyInfoCtrl.$inject = ["$routeParams", "_", "agency"];
  function AgencyInfoCtrl($routeParams, _, agency)
  {
    this.feedname = $routeParams.feedname;
    this.agencyname = $routeParams.agencyname;
    agency.agency(this.feedname, this.agencyname).then(
      _.bind(function (agency) {
        this.agency = agency;
      }, this)
    );
  }

})(window.angular);

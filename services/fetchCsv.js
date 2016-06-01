(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .factory("fetchCsv", fetchCsvFactory)
  ;

  fetchCsvFactory.$inject = ["$http", "$log", "Papa", "_"];
  function fetchCsvFactory($http, $log, Papa, _)
  {
    return function fetchCsv(url) {
      return $http.get(url).then(
        function (data) {
          var result = Papa.parse(
            data.data,
            { delimiter: ",", newline: "", header: true, /*dynamicTyping: true,*/ skipEmptyLines: true }
          );
          if (result.errors.length) handleCsvErrors(url, result.errors);
          return result;
        }
      );
    };

    function handleCsvErrors(url, errors) {
      _.each(errors, function (error) {
        $log.warn(url + "(" + error.row + "): " + error.message);
      });
    }
  }

})(window.angular);
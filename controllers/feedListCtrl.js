(function (angular) {
  "use strict";

  angular.module("ng-gtfs")
    .controller("FeedListCtrl", FeedListCtrl)
  ;

  FeedListCtrl.$inject = ["_", "feeds"];
  function FeedListCtrl(_, feeds)
  {
    //gtfs.feedList().then(_.bind(function (data) {
    //  this.feeds = _.pluck(data.data, "0");
    //}, this));
    feeds.allFeeds().then(
      function (feeds) {
        this.feeds = feeds;
      }
    );
  }

})(window.angular);
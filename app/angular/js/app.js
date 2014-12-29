"use strict";
var App = angular.module('app', []);

App.controller("main", function($scope) {

  var sortItems = function(itemsArg) {
    var items = itemsArg.slice(); //make a shallow copy
    var sortDirection = $scope.sortDirection;
    var sortColumn = $scope.sortColumn;

    return items.sort(function(a, b) {
      return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
    });
  };

  var createNewItems = function(count) {
    $scope.items = sortItems(Common.list.get(count));
  };

  $scope.setSort = function(column) {
    $scope.sortDirection = $scope.sortDirection * -1;
    $scope.sortColumn = column;
    $scope.items = sortItems($scope.items);
  };

  $scope.sortCss = function(column) {
    return {
      up: $scope.sortDirection === 1,
      down: $scope.sortDirection === -1,
      active: column === $scope.sortColumn
    };
  };

  $scope.inputModels = {
    itemsCount: Common.DEFAULT_LIST_SIZE
  };

  $scope.countChange = function() {
    createNewItems($scope.inputModels.itemsCount);
  };

  $scope.sortDirection = 1;
  $scope.sortColumn = "name";

  createNewItems(Common.DEFAULT_LIST_SIZE);
});

App.directive("virtualScroll", function() {
  var $window = $(window);

  return {
    restrict: "A",
    link: function ($scope, $element, attrs) {
      //this function will get called on a throttled basis every time the window scrolls
      var calculateVisibleItems = function() {
        var scrollTop = $window.scrollTop();
        var offset = $element.offset().top;

        //the pixels relative to the outer listing wrapper
        var startPixel = scrollTop - offset;
        var endPixel = startPixel + $window.height();

        if (startPixel < 0) {
          startPixel = 0;
        }

        //start and end row of the items to show
        var startRow = Math.floor(startPixel / Common.ROW_HEIGHT);
        var endRow = Math.ceil(endPixel / Common.ROW_HEIGHT);

        //extra padding at the top that represents the unrendered top elements
        var paddingTop = Common.ROW_HEIGHT * startRow;

        //extra padding at the bottom
        var unrenderedBottomElements = $scope.items.slice(endRow);
        var paddingBottom = Common.ROW_HEIGHT * unrenderedBottomElements.length;

        $element.css({
          "padding-top": paddingTop + "px",
          "padding-bottom": paddingBottom + "px"
        });

        $scope.firstRenderedRow = startRow;
        $scope.visibleItems = $scope.items.slice(startRow, endRow);
      };

      var throttledScrollHandler = Common.misc.throttledFunction(function() {
        $scope.$apply(calculateVisibleItems);
      }, 24);

      //calculate right away
      calculateVisibleItems();

      $scope.$watch("items", calculateVisibleItems);
      $scope.$watch("inputModels.itemsCount", function() {
        $window.scrollTop(0);
      });

      $window.on("scroll", throttledScrollHandler);
      $element.on("$destroy", function() {
        $window.off("scroll", throttledScrollHandler);
      });
    }
  }
});

App.filter("formatDate", function() {
  return Common.formatDate;
});

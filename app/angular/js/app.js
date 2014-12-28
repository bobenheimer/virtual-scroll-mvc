"use strict";
var App = angular.module('app', []);

App.filter("formatDate", function() {
  return Common.formatDate;
});

App.directive("virtualScroll", function($timeout) {
  var $window = $(window);

  return {
    restrict: "A",
    scope: {
      scrollFunction: "&"
    },
    link: function ($scope, $element, attrs) {
      var calcFunction = function() {
        $scope.scrollFunction({
          args: { $element: $element }
        });
      };

      calcFunction();
      $window.scroll(function() {
        $timeout(calcFunction)
      });
    }
  }
});

App.controller("main", function($scope, $timeout) {
  var $window = $(window);

  var sortItems = function() {
    var sortDirection = $scope.sortDirection;
    var sortColumn = $scope.sortColumn;

    $scope.items.sort(function(a, b) {
      return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
    });
  };

  var createItems = function(count) {
    $scope.items = Common.list.get(count);
    sortItems();
  };

  $scope.scrollFunction = function(args) {
    var $element = args.$element;
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
    console.log($scope.firstRenderedRow)
  };

  $scope.setSort = function(column) {
    $scope.sortDirection = $scope.sortDirection * -1;
    $scope.sortColumn = column;
    sortItems();
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
    createItems($scope.inputModels.itemsCount);
  };

  $scope.sortDirection = 1;
  $scope.sortColumn = "name";

  createItems(Common.DEFAULT_LIST_SIZE);
});

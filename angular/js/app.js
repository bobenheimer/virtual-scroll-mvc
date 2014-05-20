var App = angular.module('app', []);

App.controller('main', function($scope) {
  var $list = $(".item-list");
  var $window = $(window);
  var rowHeight = 20;

  $scope.items = Common.getList(500000);
  $scope.sort = {
    column: "name",
    direction: 1
  };

  $scope.startRow = 0;
  $scope.endRow = 0;

  $scope.sortedItems = function() {
    var sortColumn = $scope.sort.column;
    var sortDirection = $scope.sort.direction;
    var items = $scope.items.slice();

    items.sort(function(a, b) {
      return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
    })

    return items;
  }

  $scope.visibleItems = function() {
    var items = $scope.sortedItems();
    var scrollTop = $scope.scrollTop;
    var windowHeight = $window.height();
    var preloadFactor = 200; // load rows 1000px off the screen

    var startPos = scrollTop - preloadFactor;
    var endPos = scrollTop + windowHeight + preloadFactor;

    var startRow = Math.floor(startPos / rowHeight);
    var endRow = Math.ceil(endPos / rowHeight);

    if (startRow < 0) startRow = 0;

    $scope.startRow = startRow;
    $scope.endRow = endRow;

    return items.slice(startRow, endRow);
  }

  $scope.changeSort = function(column) {
    $scope.sort.column = column;
    $scope.sort.direction *= -1;
  }

  $scope.scrollTop = 0;
  $window.scroll(function() {
    $scope.$apply(function() {
      var scrollTop = $window.scrollTop();
      if ($list.length > 0) {
        var offset = $list.offset();
        scrollTop -= offset.top;
      }
      $scope.scrollTop = scrollTop;

    })
  })

  $scope.paddingTop = function() {
    var padding = Math.round($scope.startRow * rowHeight);
    return padding + "px";
  }

  $scope.paddingBottom = function() {
    //if (!visibleStart || !rowHeight || !numColumns) return "0px";

    var diff = $scope.endRow > $scope.items.length ? 0 :$scope. items.length - $scope.endRow;
    var padding = Math.round(diff * rowHeight);
    return padding + "px";
  }

});
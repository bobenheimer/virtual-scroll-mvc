var App = angular.module('app', []);

App.controller('main', function($scope, $timeout) {
  var $list = $(".item-list");
  var listOffset = $list.offset().top; //grab the original offset of the list

  var $window = $(window);

  var rowHeight = 20;
  var extraPixels = 100; //extra dom nodes to render on the top and bottom to make things look a bit smoother

  //This function will set $scope.scrollTop to window.scrolltop every waittime milliseconds
  //So if waittime is 5ms, scrollTop will get updated NO MORE OFTEN than 5ms
  var delayedScrollFunction = (function(waitTime) {
    var timeoutFunc = null;
    var timestamp = new Date().getTime();

    var scrollFunction = function() {
      $scope.scrollTop = $window.scrollTop();
    }

    var returnFunc = function() {
      $timeout.cancel(timeoutFunc);
      var newtimestamp = new Date().getTime();

      if (newtimestamp - timestamp > waitTime) {
        $scope.$apply(scrollFunction)
      } else{
        timeoutFunc = $timeout(scrollFunction, waitTime);
      }
      timestamp = newtimestamp;
    }

    $scope.scrollTop = $window.scrollTop();
    return returnFunc;
  })(5); //waittime of 5

  $window.scroll(delayedScrollFunction);

  $scope.itemsCount = 500;
  $scope.items = Common.list.get(500);

  $scope.$watch("itemsCount", function() {
    console.log(arguments)
  });

  $scope.sortColumn = "name";
  $scope.sortDirection = 1;

  $scope.startRow = 0;
  $scope.endRow = 0;

  $scope.changeItems = function() {

  }

  $scope.sortedItems = function() {
    var sortColumn = $scope.sortColumn;
    var sortDirection = $scope.sortDirection;
    var items = $scope.items.slice();

    items.sort(function(a, b) {
      return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
    });

    return items;
  }

  $scope.visibleItems = function() {
    var items = $scope.sortedItems();
    var scrollTop = $scope.scrollTop;

    var listHeight = $window.height() - listOffset;

    var startPos = scrollTop - extraPixels;
    var endPos = scrollTop + listHeight + extraPixels;

    var startRow = Math.floor(startPos / rowHeight);
    var endRow = Math.ceil(endPos / rowHeight);

    if (startRow < 0) startRow = 0;

    $scope.startRow = startRow;
    $scope.endRow = endRow;

    return items.slice(startRow, endRow);
  }

  $scope.changeSort = function(column) {
    $scope.sortColumn = column;
    $scope.sortDirection *= -1;
  }

  $scope.sortCss = function(column) {
    if (column !== $scope.sortColumn) {
      return {};
    }
    return {
      active: true,
      up: $scope.sortDirection === 1,
      down: $scope.sortDirection === -1
    }
  }

  $scope.offsetTop = function() {
    var padding = Math.round($scope.startRow * rowHeight);
    return padding + "px";
  }

  $scope.offsetBottom = function() {
    if ($scope.endRow > $scope.items.length) {
      return "0px";
    }
    var diff = $scope.items.length - $scope.endRow;
    var padding = Math.round(diff * rowHeight);
    return padding + "px";
  }

});
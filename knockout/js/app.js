$(document).ready(function() {
  var $list = $(".item-list");
  var listOffset = $list.offset().top;
  var $window = $(window);
  var rowHeight = Common.rowHeight;
  var extraPixels = 100;

  var App = new (function() {
    var self = this;

    self.sortColumn = ko.observable("name");
    self.sortDirection = ko.observable(1);
    self.itemsCount = ko.observable(Common.defaultListSize);
    self.scrollTop = ko.observable();
    self.startRow = ko.observable();
    self.endRow = ko.observable();

    //This function will set $scope.scrollTop to window.scrolltop every waittime milliseconds
    //So if waittime is 5ms, scrollTop will get updated NO MORE OFTEN than 5ms
    var delayedScrollFunction = (function(waitTime) {
      var timeoutFunc = null;
      var timestamp = new Date().getTime();

      var scrollFunction = function() {
        self.scrollTop($window.scrollTop())
      }

      var returnFunc = function() {
        clearTimeout(timeoutFunc);
        var newtimestamp = new Date().getTime();

        if (newtimestamp - timestamp > waitTime) {
          scrollFunction()
        } else{
          timeoutFunc = setTimeout(scrollFunction, waitTime);
        }
        timestamp = newtimestamp;
      }

      self.scrollTop($window.scrollTop());
      return returnFunc;
    })(5); //waittime of 5
    $window.scroll(delayedScrollFunction);


    self.items = ko.computed(function() {
      var size = self.itemsCount();
      return Common.list.get(size);
    });

    self.sortedItems = ko.computed(function() {
      var items = self.items();
      var sortDirection = self.sortDirection();
      var sortColumn = self.sortColumn();

      //var t = performance.now();
      items.sort(function(a, b) {
        return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
      });

      //console.log(performance.now() -t);
      return items;
    });

    self.visibleItems = ko.computed(function() {
      var scrollTop = self.scrollTop();
      var listHeight = $window.height() - listOffset;

      var items = self.sortedItems();

      var startPixel = scrollTop - extraPixels;
      var endPixel = scrollTop + listHeight + extraPixels;

      var startRow = Math.floor(startPixel / rowHeight);
      var endRow = Math.ceil(endPixel / rowHeight);

      if (startRow < 0) {
        startRow = 0;
      }

      self.startRow(startRow);
      self.endRow(endRow);
      return items.slice(startRow, endRow);
    });

    self.offsetTop = ko.computed(function() {
      var padding = Math.round(self.startRow() * rowHeight);
      return padding + "px";
    });

    self.offsetBottom = ko.computed(function() {
      var endRow = self.endRow();
      var items = self.items();

      if (endRow > items.length) {
        return "0px";
      }
      var diff = items.length - endRow;
      var padding = Math.round(diff * rowHeight);
      return padding + "px";
    });

    self.sort = function(column) {
      var direction = self.sortDirection();

      self.sortColumn(column);
      self.sortDirection(direction * -1);
    }

    self.sortCss = function(column) {
      var direction = self.sortDirection();
      var sortColumn = self.sortColumn();

      return {
        active: column === sortColumn,
        up: direction === 1,
        down: direction === -1
      }
    }
  })();

  ko.applyBindings(App);
});
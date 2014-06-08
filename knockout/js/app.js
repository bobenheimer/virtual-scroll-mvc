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

    self.paddingTop = ko.observable("0px");
    self.paddingBottom = ko.observable("0px");
    self.startRow = ko.observable();

    self.itemsCount = ko.observable(Common.defaultListSize);

    self.items = ko.computed(function() {
      var size = self.itemsCount();
      return Common.list.get(size);
    });

    self.visibleItems = ko.observableArray();

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

    var calculateVisibleItems = function() {
      var scrollTop = $window.scrollTop();
      var listHeight = $window.height() - listOffset;

      var items = self.sortedItems.peek();

      var startPixel = scrollTop - extraPixels;
      var endPixel = scrollTop + listHeight + extraPixels;

      var startRow = Math.floor(startPixel / rowHeight);
      var endRow = Math.ceil(endPixel / rowHeight);

      if (startRow < 0) {
        startRow = 0;
      }

      var paddingTop = Math.round(startRow * rowHeight);
      var unrenderedTopItems = items.slice(endRow);
      var paddingBottom = Math.round(unrenderedTopItems.length * rowHeight);

      self.startRow(startRow);
      self.paddingTop(paddingTop + "px");
      self.paddingBottom(paddingBottom + "px");
      self.visibleItems(items.slice(startRow, endRow));
    }

    self.sortedItems.subscribe(calculateVisibleItems);
    //This function will calculate the vsibie items every waittime milliseconds
    //So if waittime is 5ms, the visible items will get calculated no more than every 5ms
    var delayedCalculateVisibleItems = (function(waitTime) {
      var timeoutFunc = null;
      var timestamp = new Date().getTime();

      var returnFunc = function() {
        clearTimeout(timeoutFunc);
        var newtimestamp = new Date().getTime();

        if (newtimestamp - timestamp > waitTime) {
          calculateVisibleItems()
        } else{
          timeoutFunc = setTimeout(calculateVisibleItems, waitTime);
          timestamp = newtimestamp;
        }
      }

      calculateVisibleItems(); //calculate right away
      return returnFunc;
    })(5); //waittime of 5

    $window.scroll(delayedCalculateVisibleItems);

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
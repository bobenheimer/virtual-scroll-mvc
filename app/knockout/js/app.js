var App;

ko.bindingHandlers.virtualScroll = new (function() {
  var self = this;
  var $window = $(window);
  var WAIT_TIME = 24;

  var calculateVisibleItems = function(data, $element) {
    var items = data.items();
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
    var unrenderedBottomElements = items.slice(endRow);
    var paddingBottom = Common.ROW_HEIGHT * unrenderedBottomElements.length;

    var newVisibleItems = items.slice(startRow, endRow);

    $element.css({
      "padding-top": paddingTop + "px",
      "padding-bottom": paddingBottom + "px"
    });

    data.firstRenderedRow(startRow);
    data.visibleItems(newVisibleItems);
  };

  self.init = function(element, valueAccessor) {
    var data = valueAccessor();
    var $element = $(element);

    var calcFunction = calculateVisibleItems.bind(this, data, $element);
    var throttledScrollHandler = Common.misc.throttledFunction(calcFunction, WAIT_TIME);

    $window.on("scroll", throttledScrollHandler);
    $window.on("resize", calcFunction);

    var scrollTopHandler = data.itemsCount.subscribe(function(val) {
      setTimeout(function() {
        $window.scrollTop(10);
      })

    });

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      clearTimeout(timeoutFunc);
      scrollTopHandler.dispose();
      $window.off("scroll", throttledScrollHandler);
      $window.off("resize", calcFunction);
    });
  };

  self.update = function(element, valueAccessor) {
    var data = valueAccessor();
    var $element = $(element);

    calculateVisibleItems(data, $element);
  };
})();

$(document).ready(function() {
  App = new (function() {
    var self = this;

    self.sortColumn = ko.observable("name");
    self.sortDirection = ko.observable(1);

    self.itemsCount = ko.observable(Common.DEFAULT_LIST_SIZE);
    self.firstRenderedRow = ko.observable();

    self.unsortedItems = ko.computed(function() {
      var size = self.itemsCount();
      return Common.list.get(size);
    });

    self.visibleItems = ko.observableArray();

    self.items = ko.computed(function() {
      var items = self.unsortedItems();
      var sortDirection = self.sortDirection();
      var sortColumn = self.sortColumn();

      items.sort(function(a, b) {
        return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
      });

      return items;
    });

    self.sort = function(column) {
      var direction = self.sortDirection();

      self.sortColumn(column);
      self.sortDirection(direction * -1);
    };

    self.sortCss = function(column) {
      var direction = self.sortDirection();
      var sortColumn = self.sortColumn();

      return {
        active: column === sortColumn,
        up: direction === 1,
        down: direction === -1
      }
    };

  })();

  ko.applyBindings(App);
});
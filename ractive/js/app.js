var App = new (function() {
  var self = this;
  var $window = $(window);
  var rowHeight = 20;

  self.el = "#app";
  self.template = "#template";

  self.data = {
    items: Common.getList(500000),
    sort: {column: "name", direction: 1},
    scrollTop: 0,
    startRow: 0,
    endRow: 0
  }

  self.computed = {
    sortedItems: function() {
      var items = this.get("items");
      var sortDirection = this.get("sort.direction");
      var sortColumn = this.get("sort.column");

      var t = performance.now();
      items.sort(function(a, b) {
        return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
      });

      console.log(performance.now() -t);
      return items;
    },
    visibleItems: function() {
      var scrollTop = this.get("scrollTop");
      var items = this.get("sortedItems");

      var windowHeight = $window.height();

      var preloadFactor = 200; // load rows 1000px off the screen

      var startPos = scrollTop - preloadFactor;
      var endPos = scrollTop + windowHeight + preloadFactor;

      var startRow = Math.floor(startPos / rowHeight);
      var endRow = Math.ceil(endPos / rowHeight);

      if (startRow < 0) startRow = 0;

      this.set("startRow", startRow);
      this.set("endRow", endRow);

      return items.slice(startRow, endRow);
    },
    paddingTop: function() {
      var startRow = this.get("startRow");
      //if (!visibleStart || !rowHeight || !numColumns) return "0px";

      var padding = Math.round(startRow * rowHeight);
      return padding + "px";
    },
    paddingBottom: function() {
      var endRow = this.get("endRow");
      var items = this.get("items");
      //if (!visibleStart || !rowHeight || !numColumns) return "0px";

      var diff = endRow > items.length ? 0 : items.length - endRow;
      var padding = Math.round(diff * rowHeight);
      return padding + "px";
    }
  }


  self.init = function() {
    var self = this;

    var calculateScrollTop = function() {
      var scrollTop = $window.scrollTop();

      var listing = $("table");
      if (listing.length > 0) {
        var offset = listing.offset();
        scrollTop -= offset.top;
      }

      self.set("scrollTop", scrollTop);
    };

    calculateScrollTop();
    $window.scroll(calculateScrollTop);

    var setSort = function(column, data) {
      var direction = this.get("sort.direction");
      this.set("sort.column", column);
      this.set("sort.direction", -direction);
    }

    this.on({
      clickName: setSort.bind(this, "name"),
      clickSize: setSort.bind(this, "size"),
      clickDate: setSort.bind(this, "date")
    })
  }

})();

var Foo = Ractive.extend(App);

var ractive = new Foo()

(function() {
  var $window = $(window);

  var RactiveApp = Ractive.extend({
    el: "#app",
    template: "#template",
    data: {
      sortColumn: "name",
      sortDirection: 1,
      itemsCount: Common.DEFAULT_LIST_SIZE
    },
    init: function() {
      var self = this;
      var $list = $(".item-list");
      var offset = $list.offset().top;

      var setSort = function(column, data) {
        var direction = self.get("sortDirection");
        self.set("sortColumn", column);
        self.set("sortDirection", -direction);
      };

      //ractive has initialized our template already
      self.set("$list", $list);

      self.set("cssClasses", function(column) {
        var sortColumn = self.get("sortColumn");
        var direction = self.get("sortDirection");

        if (sortColumn !== column) return "";

        var classes = "active ";
        if (direction === 1) {
          classes += "up";
        } else {
          classes += "down";
        }

        return classes;
      });

      var calculateVisibleItems = function() {
        var items = self.get("sortedItems");
        if (!items) {
          return;
        }
        var scrollTop = $window.scrollTop();

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

        $list.css({
          "padding-top": paddingTop + "px",
          "padding-bottom": paddingBottom + "px"
        });

        //data.firstRenderedRow(startRow)
        // ;
        self.set("visibleItems", newVisibleItems)
      };

      self.set("calculateVisibleItems", calculateVisibleItems);
      var throttledScrollHandler = Common.misc.throttledFunction(calculateVisibleItems, 24);

      $window.on("scroll", throttledScrollHandler);

      self.observe("itemsCount", function(newValue, oldValue, keypath) {
        this.set("items", Common.list.get(newValue))
      });

      self.observe("sortedItems", function() {
        calculateVisibleItems();
      });

      this.on({
        sortByName: setSort.bind(self, "name"),
        sortBySize: setSort.bind(self, "size"),
        sortByDate: setSort.bind(self, "date")
      });
    },
    computed: {
      sortedItems: function() {
        var items = this.get("items").slice();
        var sortDirection = this.get("sortDirection");
        var sortColumn = this.get("sortColumn");

        items.sort(function(a, b) {
          return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
        });

        return items;
      }

    }

  });


  var App = new RactiveApp();
})();


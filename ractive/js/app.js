(function() {
  var $window = $(window);
  var rowHeight = Common.rowHeight;
  var extraPixels = 100;

  var App = Ractive.extend({
    el: "#app",
    template: "#template",
    data: {
      sortColumn: "name",
      sortDirection: 1,
      itemsCount: Common.defaultListSize
    },
    init: function() {
      var self = this;

      //This function will set $scope.scrollTop to window.scrolltop every waittime milliseconds
      //So if waittime is 5ms, scrollTop will get updated NO MORE OFTEN than 5ms
      var delayedScrollFunction = (function(waitTime) {
        var timeoutFunc = null;
        var timestamp = new Date().getTime();

        var scrollFunction = function() {
          self.set("scrollTop", $window.scrollTop());
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

        self.set("scrollTop", $window.scrollTop());
        return returnFunc;
      })(5); //waittime of 5

      $window.scroll(delayedScrollFunction);

      var $list = $(".item-list");

      //ractive has initialized our template already
      self.set("$list", $list);
      self.set("listOffset", $list.offset().top);

      self.set("cssClass", function(column) {
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

      self.observe("itemsCount", function(newValue, oldValue, keypath) {
        this.set("items", Common.list.get(newValue))
      });

      var setSort = function(column, data) {
        var direction = self.get("sortDirection");
        self.set("sortColumn", column);
        self.set("sortDirection", -direction);
      }

      this.on({
        sortName: setSort.bind(self, "name"),
        sortSize: setSort.bind(self, "size"),
        sortDate: setSort.bind(self, "date")
      })
    },
    computed: {
      sortedItems: function() {
        var items = this.get("items");
        var sortDirection = this.get("sortDirection");
        var sortColumn = this.get("sortColumn");

        //var t = performance.now();
        items.sort(function(a, b) {
          return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
        });

        //console.log(performance.now() -t);
        return items;
      },
      visibleItems: function() {
        var scrollTop = this.get("scrollTop");
        var items = this.get("sortedItems");
        var listOffset = this.get("listOffset");

        var listHeight = $window.height() - listOffset;

        var startPos = scrollTop - extraPixels;
        var endPos = scrollTop + listHeight + extraPixels;

        var startRow = Math.floor(startPos / rowHeight);
        var endRow = Math.ceil(endPos / rowHeight);

        if (startRow < 0) startRow = 0;

        this.set("startRow", startRow);
        this.set("endRow", endRow);

        return items.slice(startRow, endRow);
      },
      offsetTop: function() {
        var padding = Math.round(this.get("startRow") * rowHeight);
        return padding + "px";
      },
      offsetBottom: function() {
        var endRow = this.get("endRow");
        var items = this.get("items");
        if (endRow > items.length) {
          return "0px";
        }
        var diff = items.length - endRow;
        var padding = Math.round(diff * rowHeight);
        return padding + "px";
      }
    }
  });

  var ractive = new App();
})();


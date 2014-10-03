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
            timestamp = newtimestamp;
          }
        }

        self.set("scrollTop", $window.scrollTop());
        return returnFunc;
      })(5); //waittime of 5

      $window.scroll(delayedScrollFunction);

      var $list = $(".item-list");

      //ractive has initialized our template already
      self.set("$list", $list);
      self.set("listOffset", $list.offset().top);

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

      self.observe("itemsCount", function(newValue, oldValue, keypath) {
        this.set("items", Common.list.get(newValue))
      });

      var setSort = function(column, data) {
        var direction = self.get("sortDirection");
        self.set("sortColumn", column);
        self.set("sortDirection", -direction);
      };

      this.on({
        sortByName: setSort.bind(self, "name"),
        sortBySize: setSort.bind(self, "size"),
        sortByDate: setSort.bind(self, "date")
      });
    }

  });

  var MyWidget = Ractive.extend({
    template: '#widget',
    isolated: true,
    append: true, // so the component doesn't nuke the <h1>

    init: function () {
      console.log(this)
      this.on( 'activate', function () {
        alert( 'Activating!' );
      });
    },
    data: {
      message: 'No message specified, using the default'
    }
  });

  Ractive.components.widget = MyWidget;


  ractive = new App();
})();


"use strict";
(function() {
  var $window = $(window);
  var WAIT_TIME = 24;

  //http://facebook.github.io/react/blog/2013/11/05/thinking-in-react.html
  var App = React.createClass({
    getInitialState: function() {
      return {
        sortColumn: "name",
        sortDirection: 1,
        items: Common.list.get(Common.DEFAULT_LIST_SIZE)
      };
    },
    sortItems: function(items) {
      items = items.slice(); //shallow copy
      var sortColumn = this.state.sortColumn;
      var sortDirection = this.state.sortDirection;

      items.sort(function(a, b) {
        return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
      });

      return items;
    },
    setSort: function(name) {
      this.setState({
        sortColumn: name,
        sortDirection: this.state.sortDirection * -1
      });
    },
    changeCount: function(count) {
      var sorted = this.sortItems(Common.list.get(count));
      this.setState({ items: sorted });
    },
    render: function() {
      var sorted = this.sortItems(this.state.items);
      return (
        <div>
          <MainHeader
            changeCount={this.changeCount}
            currentCount={this.state.items.length}
          />
          <div className="main-content">
            <ItemHeader
              sortColumn={this.state.sortColumn}
              sortDirection={this.state.sortDirection}
              setSort={this.setSort}
            />
            <ItemList items={sorted} />
          </div>
        </div>
      )
    }
  });

  var ItemList = React.createClass({
    getInitialState: function() {
      return { visibleItems: [] };
    },
    componentDidMount: function() {
      var self = this;
      var $element = $(self.getDOMNode());

      var calcFunction = function() {
        self.calculateVisibleItems($element, self.props.items);
      };

      self.throttledScrollHandler = Common.misc.throttledFunction(calcFunction, WAIT_TIME);
      self.resizeHandler = calcFunction;

      //call the function right at the start
      calcFunction();

      $window.on("scroll", self.throttledScrollHandler);
      $window.on("resize", self.resizeHandler);
    },
    componentWillReceiveProps: function(nextProps) {
      if (!nextProps.items) { return; }

      var $element = $(this.getDOMNode());
      this.calculateVisibleItems($element, nextProps.items);

      //scroll to the top when the items count changes
      if (nextProps.items.length !== this.props.items.length) {
        $window.scrollTop(0);
      }
    },
    calculateVisibleItems: function($element, items) {
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

      this.setState({
        visibleItems: newVisibleItems,
        firstRenderedRow: startRow
      });
    },
    render: function() {
      var self = this;
      return (
        <div className="item-list">
        {
          self.state.visibleItems.map(function(item, index) {
            return (
              <div className="item" key={item.name}>
                <div className="index">{self.state.firstRenderedRow + index}</div>
                <div className="name">{item.name}</div>
                <div className="size">{item.size}</div>
                <div className="date">{Common.formatDate(item.date)}</div>
              </div>
            )
          })
        }
        </div>
      )
    },
    componentWillUnmount: function() {
      $window.on("scroll", this.throttledScrollHandler);
      $window.on("resize", this.resizeHandler);
    }
  });

  var ItemHeader = React.createClass({
    classesFor: function(column) {
      var data = {
        active: this.props.sortColumn === column,
        up: this.props.sortDirection === 1,
        down: this.props.sortDirection === -1
      };
      data[column] = true;
      return React.addons.classSet(data);
    },
    render: function() {
      return (
        <div className="item-header">
          <div className="index">
            <span>{"#"}</span>
          </div>
          <div
            className={this.classesFor("name")} onClick={this.props.setSort.bind(null, "name")}>
            <span>Name </span>
            <span className="glyphicon"></span>
          </div>
          <div className={this.classesFor("size")} onClick={this.props.setSort.bind(null, "size")}>
            <span>Size </span>
            <span className="glyphicon"></span>
          </div>
          <div className={this.classesFor("date")} onClick={this.props.setSort.bind(null, "date")}>
            <span>Date </span>
            <span className="glyphicon"></span>
          </div>
        </div>
      )
    }
  });

  var MainHeader = React.createClass({
    onChange: function(event) {
      this.props.changeCount(event.target.value);
    },
    render: function() {
      return (
        <div className="header">
          <div className="header-left">

            <h4 className="virtual-scroll">
              <a href="../">
                <span className="virtual-scroll-text">Virtual Scroll Mvc</span>
                <span className="glyphicon glyphicon-home"></span>
              </a>
            </h4>

            <div className="modify-count">
              <div className="label">{"# Items"}</div>
              <div className="input-wrap">
                <input type="number" value={this.props.currentCount} onChange={this.onChange} />
              </div>
            </div>

          </div>

          <div className="header-right">
            <a target="_blank" className="framework" href="http://facebook.github.io/react/">ReactJS</a>
          </div>
        </div>
      )
    }
  });

  React.render(
    <App />,
    document.getElementById("app")
  );
})();

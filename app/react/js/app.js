//http://facebook.github.io/react/blog/2013/11/05/thinking-in-react.html
var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {
      sortColumn: "name",
      sortDirection: 1,
      items: Common.list.get(Common.DEFAULT_LIST_SIZE)
    };
  },

  setSort: function(name) {
    var items = this.state.items.slice();
    var sortColumn = this.state.sortColumn;
    var sortDirection = this.state.sortDirection;

    items.sort(function(a, b) {
      return a[sortColumn] > b[sortColumn] ? sortDirection : -sortDirection;
    });

    this.setState({
      sortColumn: name,
      sortDirection: sortDirection * -1,
      items: items
    });
  },
  changeCount: function(count) {
    this.setState({ items: Common.list.get(count) });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(MainHeader, {
          changeCount: this.changeCount, 
          currentCount: this.state.items.length}
        ), 
        React.createElement("div", {className: "main-content"}, 
          React.createElement(ItemHeader, {
            sortColumn: this.state.sortColumn, 
            sortDirection: this.state.sortDirection, 
            setSort: this.setSort}
          ), 
          React.createElement(ItemList, {
            items: this.state.items}
          )
        )
      )
    )
  }
});

var ItemList = React.createClass({displayName: "ItemList",
  render: function() {
    return (
      React.createElement("div", {className: "item-list"}, 
      
        this.props.items.map(function(item, index) {
          return (
            React.createElement("div", {className: "item", key: item.name}, 
              React.createElement("div", {className: "index"}, index+1), 
              React.createElement("div", {className: "name"}, item.name), 
              React.createElement("div", {className: "size"}, item.size), 
              React.createElement("div", {className: "date"}, Common.formatDate(item.date))
            )
          )
        })
      
      )
    )
  }
});

var ItemHeader = React.createClass({displayName: "ItemHeader",
  render: function() {
    var self = this;
    var cx = React.addons.classSet;

    var classesFor = function(column) {
      var data = {
        active: self.props.sortColumn === column,
        up: self.props.sortDirection === 1,
        down: self.props.sortDirection === -1
      };
      data[column] = true;
      return cx(data);
    };

    return (
      React.createElement("div", {className: "item-header"}, 
        React.createElement("div", {className: "index"}, 
          React.createElement("span", null, "#")
        ), 
        React.createElement("div", {
          className: classesFor("name"), onClick: self.props.setSort.bind(null, "name")}, 
          React.createElement("span", null, "Name "), 
          React.createElement("span", {className: "glyphicon"})
        ), 
        React.createElement("div", {className: classesFor("size"), onClick: self.props.setSort.bind(null, "size")}, 
          React.createElement("span", null, "Size "), 
          React.createElement("span", {className: "glyphicon"})
        ), 
        React.createElement("div", {className: classesFor("date"), onClick: self.props.setSort.bind(null, "date")}, 
          React.createElement("span", null, "Date "), 
          React.createElement("span", {className: "glyphicon"})
        )
      )
    )
  }
});

var MainHeader = React.createClass({displayName: "MainHeader",
  onChange: function(event) {
    this.props.changeCount(event.target.value);
  },
  render: function() {
    return (
      React.createElement("div", {className: "header"}, 
        React.createElement("div", {className: "header-left"}, 

          React.createElement("h4", {className: "virtual-scroll"}, 
            React.createElement("a", {href: "../"}, 
              React.createElement("span", {className: "virtual-scroll-text"}, "Virtual Scroll Mvc"), 
              React.createElement("span", {className: "glyphicon glyphicon-home"})
            )
          ), 

          React.createElement("div", {className: "modify-count"}, 
            React.createElement("div", {className: "label"}, "# Items"), 
            React.createElement("div", {className: "input-wrap"}, 
              React.createElement("input", {type: "number", value: this.props.currentCount, onChange: this.onChange})
            )
          )

        ), 

        React.createElement("div", {className: "header-right"}, 
          React.createElement("a", {target: "_blank", className: "framework", href: "http://facebook.github.io/react/"}, "ReactJS")
        )
      )
    )
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById("foo")
);

var index = 0;
var Loop = React.createClass({displayName: "Loop",
  getInitialState: function() {
    return {
      items: [
        {
          key: index++,
          value: "test1"
        }
      ]
    };
  },
  addItems: function() {
    this.setState({
      items: this.state.items.concat({
        key: index++,
        value: "test" + index
      })
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {onClick: this.addItems}, "add"), 
        
          this.state.items.map(function(item, i){
            return React.createElement("div", {key: item.key}, item.value)
          })
        
      )
    );
  }
});


var Component = React.createClass({displayName: "Component",
  render: function() {
    return (
      React.createElement("div", {style: this.props.style}, 
        React.createElement("div", null, [this.props.foo,this.props.bar])
      )
    )
  }
});

var poops = {
  foo: 'b',
  bar: 'p',
  style: {
    height: "100px"
  }
};

var component = React.createElement(Component, React.__spread({},  poops));

//React.render(
//  component,
//  document.getElementById('example')
//);
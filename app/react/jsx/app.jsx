//http://facebook.github.io/react/blog/2013/11/05/thinking-in-react.html
var App = React.createClass({
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
          <ItemList
            items={this.state.items}
          />
        </div>
      </div>
    )
  }
});

var ItemList = React.createClass({
  render: function() {
    return (
      <div className="item-list">
      {
        this.props.items.map(function(item, index) {
          return (
            <div className="item" key={item.name}>
              <div className="index">{index+1}</div>
              <div className="name">{item.name}</div>
              <div className="size">{item.size}</div>
              <div className="date">{Common.formatDate(item.date)}</div>
            </div>
          )
        })
      }
      </div>
    )
  }
});

var ItemHeader = React.createClass({
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
      <div className="item-header">
        <div className="index">
          <span>{"#"}</span>
        </div>
        <div
          className={classesFor("name")} onClick={self.props.setSort.bind(null, "name")}>
          <span>Name </span>
          <span className="glyphicon"></span>
        </div>
        <div className={classesFor("size")} onClick={self.props.setSort.bind(null, "size")}>
          <span>Size </span>
          <span className="glyphicon"></span>
        </div>
        <div className={classesFor("date")} onClick={self.props.setSort.bind(null, "date")}>
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
  document.getElementById("foo")
);

var index = 0;
var Loop = React.createClass({
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
      <div>
        <div onClick={this.addItems}>add</div>
        {
          this.state.items.map(function(item, i){
            return <div key={item.key}>{item.value}</div>
          })
        }
      </div>
    );
  }
});


var Component = React.createClass({
  render: function() {
    return (
      <div style={this.props.style}>
        <div>{[this.props.foo,this.props.bar]}</div>
      </div>
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

var component = <Component {...poops}/>;

//React.render(
//  component,
//  document.getElementById('example')
//);
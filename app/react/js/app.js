
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


React.render(
  React.createElement(Loop, null),
  document.getElementById('example')
);
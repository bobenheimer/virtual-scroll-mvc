
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


React.render(
  <Loop />,
  document.getElementById('example')
);
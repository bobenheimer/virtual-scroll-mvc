Common.random = function(min, max) {
  var multiplier = max - min + 1;
  return Math.floor(Math.random() * multiplier + min);
}

Common.randomWord = function() {
  var length = this.random(5,50);
  var word = "";
  for (var i = 0; i < length; i++) {
    word += String.fromCharCode(this.random(48, 125));
  }

  return word;
}

Common.getList = function(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push({
      name: this.randomWord(),
      size: this.random(1, 100000),
      date: new Date(this.random(1000000000000, new Date().getTime()))
    })
  }
  return arr;

}
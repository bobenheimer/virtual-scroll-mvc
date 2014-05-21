Common.list = new (function() {
  var self = this;

  var randomNum = function(min, max) {
    var multiplier = max - min + 1;
    return Math.floor(Math.random() * multiplier + min);
  }

  var randomWord = function(min, max) {
    var length = randomNum(5,50);
    var word = "";
    for (var i = 0; i < length; i++) {
      word += String.fromCharCode(randomNum(48, 122));
    }

    return word;
  }

  self.get = function(size) {
    var arr = [];
    var timestamp = new Date().getTime();

    for (var i = 0; i < size; i++) {
      arr.push({
        name: randomWord(),
        size: randomNum(1, 100000),
        date: new Date(randomNum(1000000000000, timestamp))
      })
    }
    return arr;
  }
})();

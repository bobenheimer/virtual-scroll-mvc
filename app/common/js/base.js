"use strict";
var Common = {
  DEFAULT_LIST_SIZE: 500,
  ROW_HEIGHT: 36
};

Common.list = new (function() {
  var self = this;

  var randomNum = function(min, max) {
    var multiplier = max - min + 1;
    return Math.floor(Math.random() * multiplier + min);
  };

  var randomWord = function(min, max) {
    var length = randomNum(5,50);
    var word = "";
    for (var i = 0; i < length; i++) {
      word += String.fromCharCode(randomNum(65, 122));
    }

    return word;
  };

  self.get = function(size) {
    var arr = [];
    var timestamp = new Date().getTime();

    for (var i = 0; i < size; i++) {
      arr.push({
        name: randomWord(),
        size: randomNum(1, 100000),
        date: new Date(randomNum(1000000000000, timestamp))
      });
    }
    return arr;
  }
})();

//http://stackoverflow.com/questions/1531093/how-to-get-current-date-in-javascript
Common.formatDate = function(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!
  var yyyy = date.getFullYear();

  if (dd < 10) {
    dd = "0" + dd
  }

  if (mm < 10) {
    mm = "0" + mm
  }
  return mm + '/' + dd + '/'+yyyy;
};

Common.misc = new (function() {
  var self = this;

  self.throttledFunction = function(callback, waittime) {
    var timeoutFunc;
    var timestamp = new Date().getTime();

    return function() {
      clearTimeout(timeoutFunc);
      var newtimestamp = new Date().getTime();

      if (newtimestamp - timestamp > waittime) {
        callback();
        timestamp = newtimestamp;
      } else {
        timeoutFunc = setTimeout(function() {
          callback();
        }, waittime);
      }
    };
  };

});
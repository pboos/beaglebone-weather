var   bb = require('./bonescript')
    , http = require('http');

var ledPinMiddle = bone.P8_39;
var ledPinTopLeft = bone.P8_40;
var ledPinTop = bone.P8_41;
var ledPinTopRight = bone.P8_42;

var ledPinLeft = bone.P8_43;
var ledPinBottom = bone.P8_44;
var ledPinRight = bone.P8_45;
var ledPinPoint = bone.P8_46;

var leds = [ledPinMiddle, ledPinTopLeft, ledPinTop, ledPinTopRight, ledPinLeft, ledPinBottom, ledPinRight, ledPinPoint];
var numbers = [
  [ledPinTopLeft, ledPinTop, ledPinTopRight, ledPinLeft, ledPinBottom, ledPinRight],
  [ledPinTopRight, ledPinRight],
  [ledPinTop, ledPinTopRight, ledPinMiddle, ledPinLeft, ledPinBottom],
  [ledPinTop, ledPinTopRight, ledPinMiddle, ledPinRight, ledPinBottom],
  [ledPinTopLeft, ledPinTopRight, ledPinMiddle, ledPinRight],
  [ledPinTop, ledPinTopLeft, ledPinMiddle, ledPinRight, ledPinBottom],
  [ledPinTopLeft, ledPinLeft, ledPinBottom, ledPinRight, ledPinMiddle],
  [ledPinTop, ledPinTopRight, ledPinRight],
  [ledPinMiddle, ledPinTopLeft, ledPinTop, ledPinTopRight, ledPinLeft, ledPinBottom, ledPinRight],
  [ledPinMiddle, ledPinTopLeft, ledPinTop, ledPinTopRight, ledPinRight]
];

var lastRun = new Date(0);
var currentWeather = {
  temp: 0
};

setup = function() {
  leds.forEach(function(led) {
    pinMode(led, OUTPUT);
  });
};

loop = function() {
  if (lastRun.getTime() < ((new Date()).getTime()-30 * 60 *  1000)) {
    lastRun = new Date();
    updateWeather();
  }
  // showNumber(currentWeather.temp);
  delay(1000);
};

function showNumber(number) {
  leds.forEach(function(led) {
    digitalWrite(led, LOW);
  });
  numbers[number].forEach(function(led) {
    digitalWrite(led, HIGH);
  });
}

function updateWeather() {
  var options = {
    host: 'weather.yahooapis.com',
    port: 80,
    path: '/forecastrss?w=1118370&u=c' // 1118370 = Tokyo
  };
  http.get(options, function(res) {
    var body = "";
    res.on("data", function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      var start = body.indexOf('<yweather:condition ');
      var end = body.indexOf('/>', start) + 2;
      var weather = body.substr(start, end-start);
      console.log(weather);
      start = weather.indexOf('temp="') + 6;
      currentWeather.temp = weather.substr(start, weather.indexOf('"', start)-start);
      showNumber(currentWeather.temp);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

bb.run();
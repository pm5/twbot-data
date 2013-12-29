// Generated by LiveScript 1.2.0
(function(){
  var api_url, request, fs, ref$, map, filter, join, keys, split, unique, cache, coordinates, landnoData, areaPattern, sectionPattern, parseLandno;
  api_url = 'http://jimmyhub.net:9192/?address=';
  request = require('request');
  fs = require('fs');
  ref$ = require('prelude-ls'), map = ref$.map, filter = ref$.filter, join = ref$.join, keys = ref$.keys, split = ref$.split, unique = ref$.unique;
  cache = {};
  module.exports.coordinates = coordinates = function(addr, cb){
    if (!cb) {
      return;
    }
    if (cache[addr]) {
      return cb(null, cache[addr]);
    }
    return request(api_url + addr, function(err, response, body){
      var data;
      if (err) {
        return cb(err);
      }
      data = JSON.parse(body);
      if (data.length < 2) {
        return cb(err);
      }
      cache[addr] = [data[1].cx, data[1].cy];
      return cb(null, cache[addr]);
    });
  };
  landnoData = JSON.parse(
  fs.readFileSync(__dirname + '/landno.json'));
  module.exports.areaPattern = areaPattern = function(city){
    return function(s){
      return '(' + s + ')';
    }(
    join('|')(
    map(function(a){
      return a.replace(city, '');
    })(
    filter(function(a){
      return a.search(city) > -1;
    })(
    keys(
    landnoData.area)))));
  };
  module.exports.sectionPattern = sectionPattern = function(city, area){
    return function(s){
      return '(' + s + ')';
    }(
    join('|')(
    keys(
    landnoData.section[landnoData.area[city + area]])));
  };
  module.exports.parseLandno = parseLandno = function(city, text){
    var landno, p, pattern, result, area, p2, pattern2, result2, sec;
    landno = [];
    p = areaPattern(city) + '([^\\d]+(?:、|\\d|\\-)+)';
    pattern = new RegExp(p, 'g');
    while ((result = pattern.exec(text)) !== null) {
      result[0];
      area = result[1];
      p2 = sectionPattern(city, area) + '((?:、|\\d|\\-)*)';
      pattern2 = new RegExp(p2, 'g');
      while ((result2 = pattern2.exec(result[2])) !== null) {
        result2[0];
        sec = result2[1];
        landno = landno.concat(map(fn$, split('、', result2[2])));
      }
    }
    landno = unique(landno);
    return map(function(n){
      return split('|', n);
    }, landno);
    function fn$(n){
      return join('|', [city, area, sec, n]);
    }
  };
}).call(this);

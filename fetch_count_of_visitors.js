// ここ値を書き換えて設定を変更できます。
var config = {
  // 初期値の範囲（整数）
  initRange: {
    min: 35,
    max: 40
  },
  // 変化の範囲（整数）
  variationRange: {
    min: 25,
    max: 50
  },
  // 変化の確率（合計が100未満になる整数）
  percentage: {
    '-2': 2,
    '-1': 15,
    '+1': 15,
    '+2': 2
  }
};

// -----------------------------------------

// Convert object to value array.
Object.prototype.valueArray = function(object){
  var arr = [];
  for(var i in object){
    arr.push(object[i]);
  };
  return arr;
};

// Array.reducer IE polyfills.
var reducer = function(arr, callback){
  var current = arr[0];
  for(var i=1; i<arr.length; i++){
    current = callback(current, arr[i]);
  };
  return current;
};

var arrayIncludes = function(arr, word){
  for(var e in arr) {
    if(arr[e].indexOf(word) >= 0) return arr[e];
  }
  console.log('is not contain.');
  return;
}

// Number of visitors in first.
var initNumberOfVisitors = function(config){
  var cookie = document.cookie;
  
  if(cookie.indexOf('count_of_visitors') >= 0){
    var countOfVisitors = arrayIncludes(cookie.split(';'), 'count_of_visitors');
    if(countOfVisitors.split('=')[1] !== undefined) {
      return countOfVisitors.split('=')[1];
    }else{
      document.cookie = '';
    }
  };

  var max = config.initRange.max,
      min = config.initRange.min;
  return Math.floor(Math.random()*(max+1-min))+min;
};

// Calculate the next number to display next.
var nextNumberOfVisitors = function(prevCount, config){
  var percentage = config.percentage;
  var rangeMin = config.variationRange.min;
  var rangeMax = config.variationRange.max;

  // Check if the sum of percentages is less than 100.
  var sumOfPercentage = reducer(percentage.valueArray(), function(a,b){return a+b})
  if(sumOfPercentage > 100){
    console.log('percentage is not valid.');
    return;
  };

  var between0and100 = Math.floor(Math.random()*101);
  var calcStr = '';
  var nextCount = -1;
  var num = 0;
  for(var k in percentage){
    num += percentage[k];
    if(num > between0and100) {
      calcStr = k;
      nextCount = eval(prevCount.toString() + calcStr);
      break;
    };
  };
  if(nextCount === -1) nextCount = prevCount;
  if(nextCount < rangeMin) nextCount = rangeMin;
  if(nextCount > rangeMax) nextCount = rangeMax;
  document.cookie = 'count_of_visitors=' + nextCount;
  return nextCount;
};

// Test to probability.
var test = function(times, config){
  var minus2 = 0,
      minus1 = 0,
        zero = 0,
       plus1 = 0,
       plus2 = 0;
  
  for(var i=0; i<times; i++) {
    switch(nextNumberOfVisitors(2, config)){
      case 0: minus2++;
        break;
      case 1: minus1++;
        break;
      case 2: zero++;
        break;
      case 3: plus1++;
        break;
      case 4: plus2++;
        break;
      default: console.log('error');
    };
  };

  console.log(`
  minus2: ${Math.round((minus2/times)*100)}%
  minus1: ${Math.round((minus1/times)*100)}%
    zero: ${Math.round((zero/times)*100)}%
   plus1: ${Math.round((plus1/times)*100)}%
   plus2: ${Math.round((plus2/times)*100)}%
  `);
};

addEventListener('DOMContentLoaded', function(){
  var elem = document.querySelector('.count_of_visitors');
  var numberOfVisitors = initNumberOfVisitors(config);
  elem.innerHTML = numberOfVisitors;
  setInterval(function(){
    numberOfVisitors = nextNumberOfVisitors(numberOfVisitors, config);
    elem.innerHTML = numberOfVisitors;
  }, 5000);
});

// test(10000, config);

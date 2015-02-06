var Firebase = require('firebase');
var ref = new Firebase('https://tanks-for-fish.firebaseio.com/ais');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

function saveAis(value) {
  var value = value.val();
  console.log('got stuff from firebase: ', value);
  try {
    rimraf.sync(path.join(__dirname, '..', 'ais'));
  } catch (e) {
    console.error('e is', e);
  }

  fs.mkdirSync(path.join(__dirname, '..', 'ais'));
  Object.keys(value).forEach(function(aiName) {
    console.log('aiName is', aiName, 'value is', value);
    fs.writeFileSync(path.join(__dirname, '..', 'ais', aiName + '.js'), value[aiName].ai);
  });
}

ref.on('value', saveAis)

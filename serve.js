var fs = require('fs');
var express = require('express');
var watch = require('node-watch');

// serve myself
var app = express();
app.use(express.static(__dirname));
app.listen(3000);
console.log('static server listening on localhost:3000\n');

watch('./ais', createAisFile);
createAisFile();
console.log('AI Builder is listening to changes in the ./ais folder');

function createAisFile() {
  var requires = [];
  fs.readdirSync('./ais').forEach(function (ainame) {
    if (ainame.indexOf('.disabled.') > -1) return;
    var match = ainame.match(/\.([0-9]*)\./);
    var count = match ? match[1] : 1;
    for (var i = 0; i < count; ++i) {
      requires.push("  require('./ais/" + ainame + "')");
    }
  });
  var file = 'module.exports = [\n' + requires.join(',\n') + '\n];';
  fs.writeFileSync('./ais.js', file);
}

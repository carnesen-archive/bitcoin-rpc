var fs = require('fs');
var exec = require('child_process').exec;

var topDir = __dirname + '/..';
var packageVersion = require(topDir + '/package.json').version;

exec('git --git-dir=' + topDir + '/.git --work-tree=' + topDir + ' rev-parse HEAD',
  function (err, stdout, stderr) {
    if (!err) {
      self.app.hash = stdout.replace(/\n/, '');
    }
    else {
      console.error('Failed to get git hash');
    }
    self.emit('ready');
  });

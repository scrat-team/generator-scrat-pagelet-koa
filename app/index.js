var yeoman = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var shelljs = require('shelljs');
var promptHelper = require('../lib/promptHelper');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
  },

  initializing: function () {
    this.pkg = require('../package.json');
    this.answers = {};
  },

  prompting: {
    empty: promptHelper.checkEmpty,
    common: promptHelper.askCommon,
    git: promptHelper.askGit,
    end: promptHelper.askConfirm
  },

  writing: {
    app: function () {
      var templateList = ['package.json', 'README.md'];

      //copy files
      fs.readdirSync(this.sourceRoot()).forEach(function(file){
        if(templateList.indexOf(file) === -1) {
          if(file.indexOf('.') === 0){
            //directory won't copy dot files ...
            this.copy(file, file);
          }else {
            this.directory(file, file);
          }
        }
      }, this);

      //template files
      templateList.forEach(function (file) {
        this.template(file, file, this.answers);
      }, this);
    }
  },

  install: {
    component: function () {
      //this.spawnCommand('scrat', ['install']);
    }
  },


  end: {
    git: function () {
      if(this.answers['_needGit']) {
        shelljs.exec('git init');
      }
    },

    usage: function () {
      this.log(yosay([
            chalk.yellow('Usage'),
            'scrat release -wL',
            'scrat server start'
          ].join('\n'))
      );
    }
  }
});

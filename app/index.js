'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var shelljs = require('shelljs');
var semver = require('semver');
var merge = require('merge');
var promptHelper = require('../ask/prompt-helper');

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
      //this.conflicter.force = this.options.force = true;

      //copy dir
      ['components', 'server', 'views'].forEach(function (file) {
        this.bulkDirectory(file, file);
      }, this);

      //template files
      ['package.json', 'README.md', 'Procfile'].forEach(function (file) {
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
      shelljs.exec('git init');
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

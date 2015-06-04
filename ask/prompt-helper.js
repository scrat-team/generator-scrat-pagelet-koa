var fs = require('fs');
var path = require('path');
var semver = require('semver');
var merge = require('merge');

exports.prompt = function (questions, callback) {
  var done = this.async();
  this.prompt(questions, function (results) {
    merge(this.answers, results);
    if (typeof callback === 'function') {
      callback.call(this, this.answers);
    }
    done();
  }.bind(this));
};

//check current directory is empty?
exports.checkEmpty = function () {
  var questions = [{
    type: 'list',
    name: '_ignoreNotEmpty',
    message: 'Current Directory is not empty, still continue?',
    choices: ['quit', 'continue (ask me when conflict)' ,'force overwrite'],
    default: 'quit',
    when: fs.readdirSync(this.destinationRoot()).length > 0
  }];

  exports.prompt.call(this, questions, function (answers) {
    switch (answers['_ignoreNotEmpty']) {
      case 'quit':
        this.log('bye bye');
        process.exit();
        break;

      case 'force overwrite':
        this.conflicter.force = this.options.force = true;
        break;
    }
  }.bind(this));
};

//ask use for name/version/...
exports.askCommon = function () {
  var questions = [{
    type: 'input',
    name: 'name',
    message: 'What is your app name?',
    default: path.basename(process.cwd()),
    validate: function (input) {
      return !!input || 'app name is required';
    }
  }, {
    type: 'input',
    name: 'version',
    message: 'What is your app version?',
    default: '1.0.0',
    validate: function (input) {
      return !!semver.valid(input) || 'please use semver version, like 1.0.0';
    }
  }, {
    type: 'input',
    name: 'description',
    message: 'What is your app description?'
  }];

  exports.prompt.call(this, questions);
};

//ask user for git info
exports.askGit = function () {
  var questions = [{
    type: 'confirm',
    name: '_needGit',
    message: 'Do you need Git?',
    default: true
  }, {
    type: 'input',
    name: 'user',
    message: 'What is your git user name?',
    default: this.user.git.name(),
    when: function (results) {
      return results['_needGit'];
    }
  }, {
    type: 'input',
    name: 'email',
    message: 'What is your git user email?',
    default: this.user.git.email(),
    when: function (results) {
      return results['_needGit'];
    }
  }, {
    type: 'input',
    name: 'repository',
    message: 'What is your git repository?',
    when: function (results) {
      return results['_needGit'];
    }
  }];

  exports.prompt.call(this, questions);
};

//ask user when all done, confirm
exports.askConfirm = function () {
  var echoObj = {};
  Object.keys(this.answers).forEach(function(key){
    if(key.indexOf('_') !== 0){
      echoObj[key] = this.answers[key]
    }
  }, this);

  var questions = [{
    type: 'confirm',
    name: '_allPromptConfirm',
    message: 'Your choices: \n' + JSON.stringify(echoObj, null, 2).replace(/^/gm, '  ') + '\nIs that ok?'
  }];

  exports.prompt.call(this, questions, function (answers) {
    if (!answers['_allPromptConfirm']) {
      //TODO: replay all prompt
      this.log('bye bye');
      process.exit();
    }
  }.bind(this));
};
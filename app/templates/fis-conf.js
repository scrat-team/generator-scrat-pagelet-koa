fis.seo();
fis.config.set('framework.comboPattern', '/co??%s');

//UAE配置
fis.config.get('modules.prepackager').push(uaeConf);
fis.config.set('settings.uae', {
  description: 'UAE 会自动修改这个文件中的配置，请勿手工修改',
  log: {
    disabled: false,
    maxCount: 7
  }
});

function uaeConf(ret){
  var root = fis.project.getProjectPath();

  //create conf/config.json
  var uaeConf = fis.config.get('settings.uae', {});
  var file = fis.file(root, 'conf', 'config.json');
  file.setContent(JSON.stringify(uaeConf, null, 4));
  ret.pkg[file.subpath] = file;
}
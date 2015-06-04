var urllib = require('urllib');
var router = module.exports = require('koa-router')();
var crypto = require('crypto');

router.get('/', function *guildGuest(next) {
  var guildId = this.query.guildId;
  var signId = this.query.signId;

  var url = 'http://api.guild.9game.cn/combine';
  var page = {page: 1, size: 10};

  var config = [
    {
      id: "moduleList",
      service: 'guild.custom.getPageModuleList',
      data: {guildId: guildId, isCustom: 1},
      page: page
    },
    {
      id: 'guildInfo',
      service: 'guild.basic.getGuildInfo',
      data: {guildId: guildId},
      page: page
    },
    {
      id: "noticeInfo",
      service: 'guild.notice.list',
      data: {guildId: guildId},
      page: {page: 1, size: 1}
    },
    {
      id: "checkInfo",
      service: 'guild.growup.sign.signInfo',
      page: page
    },
    {
      id: "checkInList",
      service: 'guild.growup.sign.signMemberList',
      data: {guildId: guildId},
      page: {page: 1, size: 7}
    },
    {
      id: "spokeList",
      service: 'guild.member.listSpokesman',
      data: {guildId: guildId},
      page: {page: 1, size: 50}
    },
    {
      id: "shopList",
      service: 'guild.store.newArrival',
      data: {guildId: guildId},
      page: {page: 1, size: 1}
    },
    {
      id: "enterGameList",
      service: 'guild.game.mng.settleGameList',
      data: {guildId: guildId},
      page: page
    },
    {
      id: "armyList",
      service: 'guild.group.basic.guildGroupList',
      data: {guildId: guildId, type: 0},
      page: page
    },
    {
      id: "memberList",
      service: 'guild.member.list',
      data: {guildId: guildId, type: 0},
      page: {page: 1, size: 1}
    },
    {
      id: "topTopicList",
      service: 'guild.social.feed.getPinList',
      data: {guildId: guildId, commentSize: 2},
      page: {page: 1, size: 2}
    },
    {
      id: "newTopicList",
      service: 'guild.social.feed.getNewList',
      data: {guildId: guildId, commentSize: 2},
      page: {page: 1, size: 2}
    },
    {
      id: "customConfig",
      service: 'guild.common.getThresholdConfig',
      data: {configNameList: ['customModuleMax', 'customImageMax', 'moduleArticleMax']},
      page: page
    },
    {
      id: "userPrivilege",
      service: 'guild.member.listMyPrivilege',
      data: {},
      page: page
    },
    {
      id: "myGuildInfo",
      service: 'guild.basic.getMyGuildInfo',
      data: {},
      page: page
    },
    {
      id: "memberInfo",
      service: 'guild.member.detail',
      page: page
    }
  ];

  var postData = {
    url: url,
    data: config,
    cache: 0,
    server: 'guild_server',
    option: {
      combineMode: 'parallel',
      serialInterruptOnError: false
    },
    id: new Date().getTime(),
    encrypt: 'md5',
    client: {
      caller: "h5",
      os: "android",
      ver: "4.2.0",
      "ucid": 200929661,
      "sid": "cst1game64dbd513c9cd4a349ad5c5e5e1038e07197674",
      uuid: "0b4160cb-5d61-4d78-94c6-ffa979907c6f",
      ch: "KD_45",
      ex: {
        imei: "351746051785353",
        imsi: "460010912121001"
      }
    }
  };

  var toSign = [
    postData.id,
    postData.client.caller,
    JSON.stringify(postData.data),
    '123456'
  ].join('');
  postData.sign = crypto.createHash('md5').update(toSign).digest("hex");
  //console.info(":::::::::::::::", signId, postData.sign);

  if (!guildId || !signId) {
    yield this.render('guild/guest/guest', {result: false, errorCode:"wrong_params", errorMsg: "抱歉，你访问的网址参数不合法。"});
  } else {
    //TODO: 封装成Service, 并添加x-forward, https://github.com/nodejitsu/node-http-proxy/blob/6201ac76f7aa6847f5fa68506043d8f62ea95810/lib/http-proxy/passes/ws-incoming.js
    var startTime = new Date().getTime();
    var response = yield urllib.requestThunk(url, {
      dataType: 'json',
      method: 'post',
      data: JSON.stringify(postData)
    });
    this.set('X-Server-Response-Time', new Date() - startTime);

    //console.info(response);
    if (response.status == 200) {
      var data = response.data.data;

      // 找不到
      if (!data || !data.guildInfo) {
        yield this.render('guild/guest/guest', {result:false, errorCode:"server_error", errorMsg : "抱歉，加载失败。"});
        return ;
      }

      if (!data.guildInfo.data) {
        yield this.render('guild/guest/guest', {result:false, errorCode:"guild_not_exist", errorMsg : "抱歉，公会不存在。"});
        return ;
      }

      if (data.guildInfo.data.signId != signId) {
        yield this.render('guild/guest/guest', {result:false, errorCode:"wrong_signid", errorMsg : "请求的签名id不正确。"});
        return;
      }

      var guildInfo = data.guildInfo.data || {};
      //标题
      if (guildInfo && guildInfo.name) {
        data.title = '九游公会: ' + guildInfo.name;
      }

      //屏幕宽度
      //data.screenWidth = document.documentElement.clientWidth;

      //代言人默认
      if (!data.spokeList || !data.spokeList.data || !data.spokeList.data.list) {
        data.spokeList.data = {
          total: 0,
          list: []
        }
      }
      while (data.spokeList.data.list.length < 3) {
        data.spokeList.data.list.push({});
      }

      // 公会成员显示
      if (data.memberList) {
        data.memberList.data.list = [];
        //console.info(data.memberList.data.list);
        if (data.memberList.data.managementList) {
          data.memberList.data.list = data.memberList.data.list.concat(data.memberList.data.managementList);
        }

        if (data.memberList.data.commonUserList) {
          data.memberList.data.list = data.memberList.data.list.concat(data.memberList.data.commonUserList);
        }
      }


      // 军团处理
      if (data.armyList && data.armyList.data && data.armyList.data.list) {
        data.armyList.data.list = data.armyList.data.list.slice(0, 3);
      }

      // 公会圈
      data.feedList = {data: {list: []}};
      var topTopic = data.topTopicList && data.topTopicList.data.list && data.topTopicList.data.list.length || 0;
      var newTopic = data.newTopicList && data.newTopicList.data.list && data.newTopicList.data.list.length || 0;
      if (topTopic && newTopic) {
        // 各一条
        data.feedList.data.list = [
          data.topTopicList.data.list[0],
          data.newTopicList.data.list[0]
        ];
      }
      else {
        data.feedList.data.list = data.feedList.data.list
            .concat(data.topTopicList.data.list)
            .concat(data.newTopicList.data.list)
            .slice(0, 2);
      }


      //标题栏和显示
      var mapping = {
        'sign': {title: '签到领贡献'},
        'shop': {title: '商店'},
        'member': {title: '公会成员'},
        'spoke': {title: '公会代言人'},
        'game': {title: '入驻游戏'},
        'army': {title: '公会军团'},
        'feed': {title: '公会圈'}
      };
      var defaults = {
        '1': 'sign',
        '2': 'shop',
        '3': 'member',
        '4': 'spoke',
        '5': 'game',
        '6': 'army',
        '10': 'feed'
      };

      //console.info(data);
      if (data.moduleList && data.moduleList.data && data.moduleList.data.list) {
        data.moduleList.data.list.forEach(function (item) {
          var key = defaults[item.moduleTypeId.toString()];
          if (mapping.hasOwnProperty(key)) {
            mapping[key] = {
              title: item.title || mapping[key].title,
              hidden: item.viewTypeId != 1
            };
          }
        });
      }
      data.custom = mapping;

      yield this.render('guild/guest/guest', data);
    }
    else {
      yield this.render('guild/guest/guest', {result:false, errorCode:"server_error", errorMsg : "抱歉，加载失败。"});
    }
  }
});
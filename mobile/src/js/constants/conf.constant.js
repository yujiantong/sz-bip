'use strict';
angular.module('starter')
  .constant('server',{
      loginServer:"http://10.10.1.115:8100",
      appServer:"http://10.10.1.115:8100",
      nodeServer:"http://10.10.1.115:3000"
    //如查在开发环境中，用手机进行测试，需要指定下面的域名，
    //以下域名指向办公室的测试服务器。
   // loginServer:"http://bfdoffice.com",
   // appServer:"http://app.bfdoffice.com"
   // loginServer:"http://bofide.cn",
   // appServer:"http://app.bofide.cn"
  });

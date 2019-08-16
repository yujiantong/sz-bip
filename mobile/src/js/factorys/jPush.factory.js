'use strict';
angular.module('starter')
  .factory('jPush', ['$localStorage','$ionicPopup','$ionicViewSwitcher','$ionicHistory','pubPopup','$rootScope','$cordovaBadge',function($localStorage,$ionicPopup,$ionicViewSwitcher,$ionicHistory,pubPopup,$rootScope,$cordovaBadge){

    var factory = {
      // 设置标签和别名
      onTagsWithAlias : function (event) {
        try {
          $rootScope.message += "onTagsWithAlias";
          var result = "result code:" + event.resultCode + " ";
          result += "tags:" + event.tags + " ";
          result += "alias:" + event.alias + " ";
          //$rootScope.message += result
          //$rootScope.tagAliasResult = result;
        } catch (exception) {
          console.log(exception)
        }
      },
      // 打开通知的回调函数
      onOpenNotification:function (event) {
        try {
          var alertContent;
          if (device.platform == "Android") {
            alertContent = window.plugins.jPushPlugin.openNotification.alert;
          } else {
            alertContent = event.aps.alert;
          }
          //$rootScope.message += alertContent;
          factory.setCordovaBadge(0);
        } catch (exception) {
          console.log("JPushPlugin:onOpenNotification" + exception);
        }
      },// 接收到通知时的回调函数
      onReceiveNotification : function (event) {
        try {
          var alertContent;
          //console.log(window.plugins.jPushPlugin.receiveNotification)
          //console.log(event)
          if (device.platform == "Android") {
            alertContent = window.plugins.jPushPlugin.receiveNotification.alert;
          } else {
            alertContent = event.aps.alert;
          }
          //$rootScope.message += alertContent;
          //$rootScope.notificationResult = alertContent;
        } catch (exception) {
          console.log(exception)
        }
      },// 接收到消息时的回调函数
      onReceiveMessage : function (event) {
        try {
          var message;
          if (device.platform == "Android") {
            message = window.plugins.jPushPlugin.receiveMessage.message;
            var msg = JSON.parse(message);
            factory.setCordovaBadge(msg.pending);
          } else {
            message = event.content;
          }
          //$rootScope.message += message;
          //$rootScope.messageResult = message;
        } catch (exception) {
          console.log("JPushPlugin:onReceiveMessage-->" + exception);
        }
      },
      // 获取RegistrationID
      getRegistrationID : function () {
        window.plugins.jPushPlugin.getRegistrationID(function (data) {
          try {
            console.log("JPushPlugin:registrationID is " + data);
            if (data.length == 0) {
              var t1 = window.setTimeout(factory.getRegistrationID, 1000);
            }
            $rootScope.message += "JPushPlugin:registrationID is " + data;
            $rootScope.registrationID = data;
          } catch (exception) {
            console.log(exception);
          }
        });
      },
    // 设置别名和标签
    setTagsAndAlias:function () {
      try {
        $rootScope.message += "准备设置tag/alias...";
        var tags = [];
        if ($rootScope.formData.tag1 != "") {
          tags.push($rootScope.formData.tag1);
        }
        if ($rootScope.formData.tag2 != "") {
          tags.push($rootScope.formData.tag2);
        }
        window.plugins.jPushPlugin.setTagsWithAlias(tags, $rootScope.formData.alias);
        $rootScope.message += '设置tags和alias成功！ \r\n';
      } catch (exception) {
        console.log(exception);
      }
    },
      setCordovaBadge:function(number){
        try {
          if(!number){
            number = 0;
          }
          $cordovaBadge.clear().then(function() {
            // 有权限, 已清除.
          }, function(err) {
            // 无权限
          });
           $cordovaBadge.set(number).then(function () {
           // 有权限, 已设置.
           }, function (err) {
             console.log("无权限")
           // 无权限
           });
        }catch(err)
        {
          console.log('出错：'+ err)
        }
      }
    };
    return factory;
  }])
function compare(start,end){
  var time =0
  time =end-start;
  return Math.floor(time/86400000)
}

angular.module('starter')

.controller('LoginController', ['$scope','$state','$localStorage','$rootScope','$ionicBackdrop','$ionicLoading',
  '$ionicHistory','$interval','$ionicViewSwitcher','loginService','$filter','$cordovaAppVersion','pubPopup','pubHelper',
  function($scope,$state,$localStorage,$rootScope,$ionicBackdrop,$ionicLoading,$ionicHistory,
           $interval,$ionicViewSwitcher,loginService,$filter,$cordovaAppVersion,pubPopup,pubHelper) {
    var ctrl = this;
    ctrl.login = login;
    ctrl.passTipShowToggle = passTipShowToggle;
    ctrl.setRegistrationID = setRegistrationID;
    ctrl.storeLogo = 1;
    try{
      document.addEventListener("deviceready", function () {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          /*var logo = version.substring(0,4);
          if(logo != "1.10"){
            ctrl.storeLogo = 1;
          }
          if (logo == "1.10"){
            ctrl.storeLogo = 2;
          }*/
          ctrl.storeLogo = 1;
        });
      }, false)
    }catch (e){
      console.log(e)
    }

    ctrl.diaData = {};
    ctrl.isSaving = false;
    ctrl.cancelStateGo = false;
    $ionicHistory.clearHistory();
    var loginMsg = $localStorage.loginMsg;
    var forceExits = $localStorage.forceExits||false;
    var isLogin = $localStorage.isLogin || false;
    if(loginMsg){
      ctrl.diaData.loginName = loginMsg.loginName;
      ctrl.diaData.password = loginMsg.password;
      ctrl.diaData.newDate = new Date();
    }
    if(isLogin&&!forceExits){
      login();
    }

    if(forceExits){
      ctrl.errMsg = "此帐号已在另一个地方登录,您被强行退出！"
    }
    ctrl.passTipShow = false;
    function passTipShowToggle(){
      ctrl.passTipShow = !ctrl.passTipShow;
    }
  function login(){
    if(ctrl.isSaving){
      return;
    }
    ctrl.errMsg = null;
    ctrl.diaData.nowDate = new Date().toString();
    var obj = angular.extend({},ctrl.diaData);
    if(obj.loginName == null || obj.password == null){
      ctrl.errMsg = '请输入用户名和密码！'
      return;
    }
    ctrl.isSaving = true;
    loginService.login(obj).then(function(res){
      ctrl.isSaving = false;
      if(res.success){
        var userInfo = res.content.result;
        //if($localStorage.isAndroid==false&&userInfo.role.roleId==20){
        //  ctrl.errMsg =  '短信发送角色只允许安卓手机app登陆！';
        //  return;
        //}
        var loginRole = [2,3,6,7,8,9,10,11,16,20,22,23]
        if(loginRole.indexOf(userInfo.role.roleId)==-1){
          ctrl.errMsg =  '手机端暂时不允许此角色登陆！';
          return;
        }
        if(userInfo.role.roleName=='总经理助理'){
          userInfo.role.roleName = '总经理';
        }
        $localStorage.loginMsg = userInfo||{};
        $localStorage.loginMsg.password = obj.password;
        $localStorage.loginMsg.loginName = obj.loginName;
        $localStorage.isLogin = true;
        $localStorage.forceExits = false;
        if(userInfo.role.roleId==20){
          $state.go('smsHomePage.smsMyHomePage');
        }else if(userInfo.role.roleId==2||userInfo.role.roleId==6||userInfo.role.roleId==8){
          $state.go('xbzyHomePage.xbzyMyHomePage');
        }else if(userInfo.role.roleId==7||userInfo.role.roleId==9){
          $state.go('mgrHomePage.mgrMyHomePage');
        }else{
          $state.go('homePage.myHomePage');
        }
        var regid = [2,3,6,7,8,9]
        if(regid.indexOf(userInfo.role.roleId)!=-1){
          ctrl.setRegistrationID();
        }
      }else{
        ctrl.errMsg = res.message || '登录失败！'
      }
    })
  }

    //设置设备ID
    function setRegistrationID(){
      if(pubHelper.isEmpty($rootScope.registrationID)){
        return;
      }
      var userId = $localStorage.loginMsg.userId;
      var tag = $localStorage.loginMsg.loginName;
      var registrationId = $rootScope.registrationID;
      var alias = $localStorage.loginMsg.loginName;
      var storeId = $localStorage.loginMsg.store.storeId;
      var logoFlag = ctrl.storeLogo;
      var val = {userId:userId,tag:tag,registrationId:registrationId,alias:alias,storeId:storeId,logoFlag:logoFlag}
      loginService.addJPush({params:JSON.stringify(val)}).then(function(res){
        if(res.status=="OK"){
          console.log('设置设备ID成功');
        }else{
          console.log('设置设备ID失败');
        }
      })
    }
}])


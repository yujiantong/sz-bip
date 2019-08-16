angular.module('starter')

.controller('PersonalCenterController', ['$scope','$rootScope','$state','$timeout','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','myHomePageService','pubPopup','pubHelper',
  function($scope,$rootScope,$state,$timeout,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,myHomePageService,pubPopup,pubHelper) {
  var ctrl = this;
  ctrl.findCountByUserIdTop = findCountByUserIdTop;
  ctrl.stateChange = stateChange;
  ctrl.logout = logout ;
  ctrl.setRegistrationID = setRegistrationID ;
  ctrl.goOnLineService = goOnLineService;
  ctrl.user = $localStorage.loginMsg;// 获取人员信息
  ctrl.storeLogo = $localStorage.loginMsg.store.logo;
  var obj = {
      userId:ctrl.user.userId,userName:ctrl.user.userName,storeName:ctrl.user.store.storeName,roleName:ctrl.user.role.roleName,phone:ctrl.user.phone
  }
  ctrl.userInfo = JSON.stringify(obj);

//判断是否能进入在线客服
    function goOnLineService(stateTo){
      /*if(ctrl.localSession){
        /!*if(ctrl.localSession.isAndroid&&(ctrl.appVersion=='0.0.0'||ctrl.appVersion=='')){
         pubHelper.alert(false,'要使用在线客服功能版本必须是1.0.19以上版本，请先升级版本')
         return;
         }
         if(ctrl.localSession.isAndroid&&ctrl.appVersion<'1.0.19'){
         pubHelper.alert(false,'当前软件版本'+ctrl.appVersion+';要使用在线客服功能版本必须是1.0.19以上' +
         '版本，请先升级版本');
         return;
         }*!/
        /!*if(ctrl.localSession.isIOS||ctrl.localSession.isIPad){
         pubHelper.alert(false,'此功能正在开发')
         return;
         }*!/
        stateChange(stateTo);

      }else{
        stateChange(stateTo);
      }*/
      stateChange(stateTo);
    }

  function findCountByUserIdTop(){
    myHomePageService.findCountByUserId().then(function (result) {
      if (result.status == 'OK'&&result.results.content.status == 'OK') {
        ctrl.topCount = result.results.content.results;
      } else {

      };
    });
  }

  // 按钮显示
  function logout(){
    $localStorage.isLogin = false;
    if($localStorage.loginMsg.role.roleId==2){
      $rootScope.socket.disconnect();
      $rootScope.socket = null;
    }
    //$localStorage.loginMsg = {};
    $state.go('login',{reload:true});
    ctrl.setRegistrationID();
  }
  //设置设备ID
  function setRegistrationID(){
    if(pubHelper.isEmpty($rootScope.registrationID)){
      return;
    }
    var userId = $localStorage.loginMsg.userId;
    var tag = $localStorage.loginMsg.loginName;
    var registrationId = "0";
    var alias = $localStorage.loginMsg.loginName;
    var storeId = $localStorage.loginMsg.store.storeId;
    var logoFlag = ctrl.storeLogo;
    var val = {userId:userId,tag:tag,registrationId:registrationId,alias:alias,storeId:storeId,logoFlag:logoFlag};
    myHomePageService.addJPush({params:JSON.stringify(val)}).then(function(res){
      if(res.status=="OK"){
        console.log('注销设备ID成功');
      }else{
        console.log('注销设备ID失败');
      }
    })
  }
  // 按钮显示
  function showButton(action){
    var actionFlag = pubHelper.hasAction(action);
    return actionFlag;
  }

  function stateChange(stateTo,params){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go(stateTo,params);
  }
}])


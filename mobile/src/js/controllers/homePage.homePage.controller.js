angular.module('starter')
.controller('HomePageController', ['$localStorage','$state','$ionicViewSwitcher',function($localStorage,$state,$ionicViewSwitcher) {
  var ctrl = this;
  ctrl.stateChange = stateChange;
  ctrl.goOnLineService = goOnLineService;
  // 获取人员信息
  var localLoginMsg = $localStorage.loginMsg;
 ctrl.storeLogo = $localStorage.loginMsg.store.logo;
  if(localLoginMsg){
    /*ctrl.localPositionId = localLoginMsg.positionId;
    ctrl.localUserId = localLoginMsg.uuId;
    ctrl.localUserName = localLoginMsg.fullName;*/
  }
  function stateChange(stateTo,params){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go(stateTo,params);
  }
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

}])


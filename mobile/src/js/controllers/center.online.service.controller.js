angular.module('starter')
.controller('CenterOnlineServiceController', ['$scope','$sce','$state','$timeout','$localStorage','$stateParams','$ionicHistory','$ionicNavBarDelegate','$ionicViewSwitcher','pubHelper','pubPopup',
  function($scope,$sce,$state,$timeout,$localStorage,$stateParams,$ionicHistory,$ionicNavBarDelegate,$ionicViewSwitcher,pubHelper,pubPopup) {
  var ctrl = this;
  ctrl.goBack = goBack;
  ctrl.stateChange = stateChange;
  ctrl.user = $localStorage.loginMsg;// 获取人员信息
  ctrl.isSaving = false;
  ctrl.form = {};
  var uname = ctrl.user.store.storeName + "-" + ctrl.user.userName + "-" +ctrl.user.role.roleName;
  ctrl.paySrc = $sce.trustAsResourceUrl('https://www.sobot.com/chat/h5/index.html?sysNum=eede8ad2b4f44f809ee61f4301bcdc83&source=2&uname='+ uname);

  // 回退
  function goBack(){
    $ionicViewSwitcher.nextDirection('back');
    $ionicHistory.goBack();
  }
  function stateChange(stateTo,params){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go(stateTo,params);
  }

}])


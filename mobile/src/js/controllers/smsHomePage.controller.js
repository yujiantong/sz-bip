angular.module('starter')
.controller('smsHomePageController', ['$scope','$rootScope','$state','$timeout','$ionicHistory','$ionicNavBarDelegate',
  '$localStorage','$ionicViewSwitcher','server','messageService',
  function($scope,$rootScope,$state,$timeout,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,server,messageService) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.logout = logout ;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.storeLogo = $localStorage.loginMsg.store.logo;
    ctrl.storeId = ctrl.user.store.storeId;
    ctrl.currentPage = 1;
    ctrl.isLock=false;
    $scope.items = [];
    ctrl.goOnLineService = goOnLineService;
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
    //查询发送过的短信
    ctrl.findPhoneMessage = findPhoneMessage;

    if($localStorage.loginMsg.role.roleId==20){
      $rootScope.socket = io.connect(server.nodeServer);
      $rootScope.socket.on('connect', function(){
        $rootScope.socket.emit('login', {storeId: $localStorage.loginMsg.store.storeId,roleId:$localStorage.loginMsg.role.roleId });
      });

      $rootScope.socket.on('message', function (data) {
        $scope.data = data.data;
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: '' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
            //intent: 'INTENT' // send SMS inside a default SMS app
          }
        };
        try {
          sms.send($scope.data.contactWay, $scope.data.content, options
              ,function () {
                $rootScope.socket.emit('response', {success: true});
              },function (error) {
                $rootScope.socket.emit('response', {success: false});
              });
        } catch (e){
          $rootScope.socket.emit('response', {success: false});
        }

      });
    }

    function stateChange(stateTo,params){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(stateTo,params);
    }

    // 退出登录
    function logout(){
      $localStorage.isLogin = false;
      $rootScope.socket.disconnect();
      $rootScope.socket = null;
      //$localStorage.loginMsg = {};
      $state.go('login',{reload:true});
    }

    //查询发送过的短信
    function findPhoneMessage() {
      if(ctrl.isLock)return;
      ctrl.isLock=true;
      var params = {"storeId":ctrl.storeId,"currentPage":ctrl.currentPage,pageType:'APP'};
      if(ctrl.storeId == null || ctrl.currentPage == null){
        return;
      }
      messageService.findPhoneMessage(params).then(function (result) {
        if (result.status == 'OK') {
          ctrl.MessageList = result.results.content.results;
          for(var i=0 ; i<ctrl.MessageList.length;i++){
            ctrl.MessageList[i].hideStatus = false;
          }
          ctrl.messageCount = result.results.content.messageCount;
          if (ctrl.MessageList.length == 0) {
            $scope.hasmore = true;
            return;
          }
          ctrl.currentPage++;
          $scope.items = $scope.items.concat(ctrl.MessageList);
        }else{
          $scope.hasmore = true;
          return;
        }
      }).finally(function (error) {
        ctrl.isLock = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      })
    };

    $scope.doRefreshMessage = function () {
      ctrl.currentPage = 1;
      $scope.items = [];
      $scope.hasmore = false;
      ctrl.findPhoneMessage();
    }
}])


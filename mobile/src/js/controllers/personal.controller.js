angular.module('starter')
  .controller('pesonalController',
    ['$scope','$state','$timeout','pubHelper','pubPopup','$ionicLoading','$ionicHistory','$localStorage','$ionicViewSwitcher','personalService','$stateParams',
      function($scope,$state,$timeout,pubHelper,pubPopup,$ionicLoading,$ionicHistory,$localStorage,$ionicViewSwitcher,personalService,$stateParams) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.goBack = goBack;
    ctrl.changePassword = changePassword;
    ctrl.qingchu = qingchu;
    ctrl.addSuggest = addSuggest;
    ctrl.qcsuggest = qcsuggest;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.storeLogo = $localStorage.loginMsg.store.logo;
    ctrl.userId = $stateParams.userId;
    ctrl.userName = $stateParams.userName;
    ctrl.findUsersByStoreId = findUsersByStoreId;
    ctrl.findUsersByStoreId();
    ctrl.pauseOrRegain = pauseOrRegain;
    var obj = $stateParams.userInfo;
    if(obj!=undefined||obj!=null){
      ctrl.userInfo = JSON.parse($stateParams.userInfo);
    }
    // 回退
    function goBack(){
      $ionicHistory.goBack();
    }
    //路由跳转
    function stateChange(stateTo){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(stateTo);
    }
    /**
     * 查询店员工列表
     * param: storeId
     */
    function findUsersByStoreId(){
      personalService.findUsersByStoreId().then(function(result){
        if (result.status == 'OK'&&result.results.content.status=='OK') {
          ctrl.workersAll = result.results.content.result;
        }
      })
    }
    //暂停用户操作
     function pauseOrRegain(Id,status,index){
      if(status == 2){
        pubHelper.alert(true,"该用户已经被禁用");
        return;
      }
      if(status == 0){
        var confirmPopup = pubPopup.confirm({
          title: '暂停管理',
          template: '是否确认暂停该用户？',
          okText:'确定',
          cancelText:'取消',
          scope: $scope,
        });
        confirmPopup.then(function(res) {
          if(res) {
            $ionicLoading.show();
            personalService.pauseOrForbidden(Id,1)
                .then(function (result) {
                  $ionicLoading.hide();
                  if (result.status == 'OK') {
                    pubHelper.alert(true,"暂停成功",0);
                    ctrl.workersAll[index].status=1;
                  } else {
                    pubHelper.alert(false,"暂停失败",0);
                  }
                  ;
                });
            }
        });
      }else if(status == 1){
        var confirmPopup = pubPopup.confirm({
          title: '暂停管理',
          template: '是否确认取消暂停该用户？',
          okText:'确定',
          cancelText:'取消',
          scope: $scope,
        });
        confirmPopup.then(function(res) {
          if(res) {
            $ionicLoading.show();
            personalService.pauseOrForbidden(Id,0)
              .then(function (result) {
                $ionicLoading.hide();
                if (result.status == 'OK') {
                  pubHelper.alert(true,"取消暂停成功",0);
                  ctrl.workersAll[index].status=0;
                } else {
                  pubHelper.alert(false,"取消暂停失败",0);
                }
                ;
              });
          }
        });
      }
    }

        /**
         * 修改密码
         * param: storeId
         */
        function changePassword(){
          var password = ctrl.change.password;
          var passwordOne = ctrl.change.passwordOne;
          var passwordTwo = ctrl.change.passwordTwo;
          if(passwordOne==null||passwordOne==''){
            ctrl.errMsg = "新密码不能为空！";
            return;
          }
          if(password == passwordOne){
            ctrl.errMsg = "新密码不能和原密码相同！";
            return;
          }
          if(passwordOne !=passwordTwo){
            ctrl.errMsg = "新密码输入不一致！";
            return;
          }
          var obj = {
            id:ctrl.userId,password:passwordOne,oldPassword:password
          }
          $ionicLoading.show();
          personalService.changePassword(obj).then(function(result){
            $ionicLoading.hide();
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.errMsg = result.results.message;
              setTimeout(ctrl.goBack,1000);
              setTimeout(ctrl.qingchu,1100);
            }else{
              ctrl.errMsg = result.results.message;
            }
          })
        }
        function qingchu(){
          ctrl.change.password = '';
          ctrl.change.passwordOne = '';
          ctrl.change.passwordTwo = '';
          ctrl.errMsg = '';
        }

        /**
         * 新增建议
         * param: storeId
         */
        ctrl.newSuggest = {};
        function addSuggest(){
          var title = ctrl.newSuggest.title;
          var content = ctrl.newSuggest.content;
          if(title==null||title==''){
            ctrl.errMsg = "请输入标题！";
          }else if(content==null||content==''){
            ctrl.errMsg = "请输入内容！";
          }else{
            ctrl.newSuggest.userId = ctrl.userInfo.userId;
            ctrl.newSuggest.storeName = ctrl.userInfo.storeName;
            ctrl.newSuggest.userRoleName = ctrl.userInfo.roleName;
            ctrl.newSuggest.userName = ctrl.userInfo.userName;
            ctrl.newSuggest.userPhone = ctrl.userInfo.phone;
            $ionicLoading.show();
            personalService.addSuggest(ctrl.newSuggest).then(function(result){
              $ionicLoading.hide();
              if (result.status == 'OK'&&result.results.content.status=='OK') {
                ctrl.errMsg = result.results.message;
                setTimeout(ctrl.goBack,1000);
                setTimeout(ctrl.qcsuggest,1100);
              }else{
                ctrl.errMsg = result.results.message;
              }
            })
          }
        }
        function qcsuggest(){
          ctrl.newSuggest.title = '';
          ctrl.newSuggest.content = '';
          ctrl.errMsg = '';
        }

}])


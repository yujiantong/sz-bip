angular.module('starter')
  .controller('InviteRecordController',
  ['$scope','$state','$timeout','$ionicPopup','$filter','pubHelper','$ionicModal','pubPopup','$ionicLoading','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','inviteRecordService',
    function($scope,$state,$timeout,$ionicPopup,$filter,pubHelper,$ionicModal,pubPopup,$ionicLoading,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,inviteRecordService) {
    var ctrl = this;
    ctrl.goBack = goBack;
    ctrl.stateChange = stateChange;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.customerId = $stateParams.customerId;
    ctrl.contact = $stateParams.contact;
    ctrl.userId = $stateParams.userId;
    ctrl.userName = $stateParams.userName;
    ctrl.customerTraceId = $stateParams.customerTraceId;
    ctrl.cxdata = $stateParams.cxdata;
    ctrl.gzcxdata = $stateParams.gzcxdata;
    ctrl.currentPage = 1;
    ctrl.isLock=false;
    $scope.items = [];
    ctrl.selectKSCYY = selectKSCYY;
    ctrl.selectKSCYYXQ = selectKSCYYXQ;
    ctrl.deleteInvite = deleteInvite;

    // 回退
    function goBack(){
      $ionicHistory.goBack();
    }
    //路由跳转
    function stateChange(stateTo,params){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(stateTo,params);
    }

    //可删除邀约
    function selectKSCYY() {
      if(ctrl.isLock)return;
      ctrl.isLock=true;
      inviteRecordService.selectKSCYY(ctrl.customerId,ctrl.currentPage).then(function (result) {
        if (result.status == 'OK') {
          ctrl.customerList = result.results.content.results;
          if (ctrl.customerList.length == 0) {
            $scope.hasmore = true;
            return;
          }
          ctrl.currentPage++;
          $scope.items = $scope.items.concat(ctrl.customerList);
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

    $scope.doRefreshKSCYY = function () {
      ctrl.currentPage = 1;
      $scope.items = [];
      ctrl.selectKSCYY();
      $scope.hasmore = false;
    }

    function selectKSCYYXQ() {
      if (ctrl.customerTraceId != null) {
        inviteRecordService.selectKSCYYXQ(ctrl.customerTraceId).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerDetails = result.results.content.results;
            ctrl.principalId = ctrl.customerDetails.principalId;
            ctrl.principal = ctrl.customerDetails.principal;
          } else {

          }
        });
      }
    };

    //搜索框
    $ionicModal.fromTemplateUrl('templates/modal/modalYY.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modalYY = modal;
    });
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
      $scope.modalYY.remove();
    });
    ctrl.confirmData = {};
    function deleteInvite() {
      if(!ctrl.confirmData.scyyyy){
        pubHelper.alert(false,"原因不能为空");
        return;
      }
      inviteRecordService.deleteInvite(ctrl.customerTraceId,ctrl.confirmData.scyyyy,ctrl.customerId,
        ctrl.principalId,ctrl.principal).then(function (result) {
        if (result.status == 'OK') {
          $scope.modalYY.hide();
          setTimeout(function(){
            pubHelper.alert(true,"删除成功",-1);
          },500)
        } else {
          pubHelper.alert(false,result.results.message);
        }
      });
    };
  }])


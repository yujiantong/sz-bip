angular.module('starter')
  .controller('ReceivedController',
    ['$scope','$state','$timeout','$ionicHistory','$localStorage','$ionicViewSwitcher','workerIndexService',
      function($scope,$state,$timeout,$ionicHistory,$localStorage,$ionicViewSwitcher,workerIndexService) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.findDHTWorkCollection = findDHTWorkCollection;
    ctrl.findDHTWorkCollection();
    ctrl.goBack = goBack;
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
     * 查询待回退员工列表
     * param: storeId
     */
    function findDHTWorkCollection(){
      var storeId = $localStorage.loginMsg.store.storeId;
      var returnStatu = 3;
      var params = {"storeId":storeId,"returnStatu":returnStatu};
      approvalService.findDHTWorkCollection(params).then(function(result){
        if (result.status == 'OK'&&result.results.content.status=='OK') {
          ctrl.dhtWorkCollection = result.results.content.results.dhtWorkCollection;
          ctrl.sumDHTNum = result.results.content.results.sumDHTNum;
        }
      })
    }

  }])


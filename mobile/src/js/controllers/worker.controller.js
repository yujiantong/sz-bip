angular.module('starter')
  .controller('WorkerController',
    ['$scope','$state','$timeout','$ionicHistory','$localStorage','$ionicViewSwitcher','workerIndexService','$stateParams',
      function($scope,$state,$timeout,$ionicHistory,$localStorage,$ionicViewSwitcher,workerIndexService,$stateParams) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.findDHTWorkCollection = findDHTWorkCollection;
    ctrl.findDYQWorkCollection = findDYQWorkCollection;
    ctrl.findWJSWorkCollection = findWJSWorkCollection;
    ctrl.findYGZWorkCollection = findYGZWorkCollection;
    ctrl.findJRYYWorkerCollection = findJRYYWorkerCollection;
    ctrl.findTBWorkCollection = findTBWorkCollection;
    ctrl.findJTBWorkCollection = findJTBWorkCollection;
    ctrl.findDDWCDWorkCollection = findDDWCDWorkCollection;
    ctrl.findGZWCWorkCollection = findGZWCWorkCollection;
    ctrl.findYHTWorkCollection = findYHTWorkCollection;
    ctrl.findZBXSWorkCollection = findZBXSWorkCollection;
    ctrl.goBack = goBack;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.userId = $stateParams.userId;
    ctrl.userName = $stateParams.userName;
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
         * param: storeId；returnStatu
         */
        function findDHTWorkCollection(applyStatu) {
          var storeId = $localStorage.loginMsg.store.storeId;
          var roleId = $localStorage.loginMsg.role.roleId;
          var returnStatu = '3';
          var applyStatu = applyStatu;
          var params = {"storeId": storeId, "returnStatu": returnStatu,'roleId':roleId,'applyStatu':applyStatu};
          workerIndexService.findDHTWorkCollection(params).then(function (result) {
            if (result.status == 'OK' && result.results.content.status == 'OK') {
              ctrl.dhtWorkCollection = result.results.content.results.workCollection;
              ctrl.sumDHTNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询待延期员工列表
         * param: storeId；returnState
         */
        function findDYQWorkCollection() {
          var storeId = $localStorage.loginMsg.store.storeId;
          var returnStatu = '7';
          var params = {"storeId": storeId, "returnStatu": returnStatu};
          workerIndexService.findDHTWorkCollection(params).then(function (result) {
            if (result.status == 'OK' && result.results.content.status == 'OK') {
              ctrl.dhtWorkCollection = result.results.content.results.workCollection;
              ctrl.sumDHTNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询未接收员工列表
         * param: storeId
         */
        function findWJSWorkCollection() {
          workerIndexService.findWJSWorkCollection().then(function (result) {
            if (result.status == 'OK' && result.results.content.status == 'OK') {
              ctrl.workCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询应跟踪/已跟踪员工列表
         * param: storeId
         */
        function findYGZWorkCollection(traceStatu) {
          workerIndexService.findYGZWorkCollection(traceStatu).then(function (result) {
            if (result.status == 'OK' && result.results.content.status == 'OK') {
              ctrl.workCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询邀约员工列表
         * param: storeId
         */
        function findJRYYWorkerCollection(){
          workerIndexService.findJRYYWorkerCollection().then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.dhtWorkCollection = result.results.content.results.workCollection;
              ctrl.sumDHTNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询已脱保员工列表
         * param: storeId
         * cusLostInsurStatu 潜客脱保状态
         */
        function findTBWorkCollection(){
          var storeId = $localStorage.loginMsg.store.storeId;
          var roleId = $localStorage.loginMsg.role.roleId;
          var cusLostInsurStatu = '2';
          var params = {'storeId':storeId,'cusLostInsurStatu':cusLostInsurStatu,'roleId':roleId};
          workerIndexService.findTBWorkCollection(params).then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.ytbWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询将脱保员工列表
         * param: storeId
         * cusLostInsurStatu 潜客脱保状态
         */
        function findJTBWorkCollection(){
          var storeId = $localStorage.loginMsg.store.storeId;
          var roleId = $localStorage.loginMsg.role.roleId;
          var cusLostInsurStatu = '1';
          var params = {'storeId':storeId,'cusLostInsurStatu':cusLostInsurStatu,'roleId':roleId};
          workerIndexService.findTBWorkCollection(params).then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.jtbWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }

        /**
         * 查询进店未出单员工列表
         * param: storeId
         */
        function findDDWCDWorkCollection(){
          workerIndexService.findDDWCDWorkCollection().then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.ddwcdWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }
        /**
         * 查询跟踪完成员工列表
         */
        function findGZWCWorkCollection(){
          workerIndexService.findGZWCWorkCollection().then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.gzwcWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }
        /**
         * 查询已回退员工列表
         */
        function findYHTWorkCollection(){
          workerIndexService.findYHTWorkCollection().then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.yhtWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }
        /**
         * 查询战败线索员工列表
         */
        function findZBXSWorkCollection(){
          workerIndexService.findZBXSWorkCollection().then(function(result){
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.zbxsWorkCollection = result.results.content.results.workCollection;
              ctrl.allCustomerNum = result.results.content.results.allCustomerNum;
            }
          })
        }

      }])


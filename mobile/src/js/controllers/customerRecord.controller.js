angular.module('starter')
  .controller('CustomerRecordController',
    ['$scope','$state','$timeout','$ionicHistory','$localStorage','$ionicViewSwitcher','$stateParams','customerRecordService',
      function($scope,$state,$timeout,$ionicHistory,$localStorage,$ionicViewSwitcher,$stateParams,customerRecordService) {
    var ctrl = this;
    ctrl.goBack = goBack;
    ctrl.stateChange = stateChange;
    ctrl.trackRecordTab = trackRecordTab;
    ctrl.customerId = $stateParams.customerId;
    ctrl.contact = $stateParams.contact;
    ctrl.userId = $stateParams.userId;
    ctrl.userName = $stateParams.userName;
    ctrl.cxdata = $stateParams.cxdata;
    ctrl.gzcxdata = $stateParams.gzcxdata;
    ctrl.yhtdata = $stateParams.yhtdata;
    ctrl.findRecordByCustomerId = findRecordByCustomerId;
    ctrl.findRecordByCustomerId();
    ctrl.findBjRecordByCustomerId = findBjRecordByCustomerId;
    ctrl.findBjRecordByCustomerId();

    // 回退
    function goBack(){
      $ionicHistory.goBack();
    }
    //路由跳转
    function stateChange(stateTo,params){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(stateTo,params);
    }

    ctrl.trackRecord = true;
    ctrl.quotesRecord = false;
    function trackRecordTab(tabname){
      if(tabname == 1){
        ctrl.trackRecord = true;
        ctrl.quotesRecord = false;
      }else if(tabname == 2){
        ctrl.trackRecord = false;
        ctrl.quotesRecord = true;
      };
    }
    /**
     * 根据潜客id查询该潜客的所有跟踪记录
     * param: customerId
     */

    function findRecordByCustomerId(){
      var params = {'customerId':ctrl.customerId};
      customerRecordService.findRecordByCustomerId(params).then(function(result){
        if (result.status == 'OK') {
          ctrl.customerTraceRecodes = result.results.content.results;
          for(var i=0 ; i<ctrl.customerTraceRecodes.length;i++){
            ctrl.customerTraceRecodes[i].hideStatus = false;
          }
        }
      })
    }

      /**
       * 根据潜客id查询该潜客的所有报价记录
       * param: customerId
       */
      function findBjRecordByCustomerId(){
        var params = {'customerId':ctrl.customerId};
        customerRecordService.findBjRecordByCustomerId(params).then(function(result){
          if (result.status == 'OK') {
            ctrl.bjRecodes = result.results.content.customerBJRecodeList;
            for(var i=0 ; i<ctrl.bjRecodes.length;i++){
              ctrl.bjRecodes[i].hideStatus = false;
            }
          }
        })
      }
  }])


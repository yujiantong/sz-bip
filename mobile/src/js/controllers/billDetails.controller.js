angular.module('starter')
  .controller('billDetailsController',
    ['$scope','$state','$timeout','$filter','$ionicPopup','pubHelper','pubPopup','$ionicLoading','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','billDetailsService',
      function($scope,$state,$timeout,$filter,$ionicPopup,pubHelper,pubPopup,$ionicLoading,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,billDetailsService) {
        var ctrl = this;
        ctrl.stateChange = stateChange;
        ctrl.user = $localStorage.loginMsg;// 获取人员信息
        ctrl.insuranceBillId = $stateParams.insuranceBillId;
        ctrl.findBillDetails = findBillDetails;
        ctrl.findBillDetails();
        ctrl.billmxToggle = billmxToggle;
        ctrl.billjlToggle = billjlToggle;


        //路由跳转
        function stateChange(stateTo,params){
          $ionicViewSwitcher.nextDirection('forward');
          $state.go(stateTo,params);
        }

        /**
         *按保单ID查询保单明细
         */
        function findBillDetails() {
          if (ctrl.insuranceBillId != null) {
            billDetailsService.findBillDetailsById(ctrl.insuranceBillId).then(function (result) {
              if (result.status == 'OK') {
                ctrl.billDetails = result.results.content.insuranceBill;
                ctrl.billTrackList = result.results.content.recodeList;
              } else {

              }
            });
          }
        };
        ctrl.billmx = false;
        function billmxToggle(){
          ctrl.billmx = !ctrl.billmx;
        }
        ctrl.billjl = false;
        function billjlToggle(){
          ctrl.billjl = !ctrl.billjl;
        }

  }])


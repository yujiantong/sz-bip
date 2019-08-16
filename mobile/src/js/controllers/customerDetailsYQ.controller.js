angular.module('starter')
  .controller('CustomerDetailsYQController',
    ['$scope','$state','$timeout','$ionicPopup','pubHelper','pubPopup','$ionicLoading','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','customerDetailsService',
      function($scope,$state,$timeout,$ionicPopup,pubHelper,pubPopup,$ionicLoading,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,customerDetailsService) {
        var ctrl = this;
        ctrl.stateChange = stateChange;
        ctrl.goBack = goBack;
        ctrl.customerId = $stateParams.customerId;
        ctrl.contact = $stateParams.contact;
        ctrl.userName = $stateParams.userName;
        ctrl.userId = $stateParams.userId;
        ctrl.returnStatu = $stateParams.returnStatu;
        ctrl.user = $localStorage.loginMsg;// 获取人员信息
        ctrl.findCustomerDetailsByCustomerId = findCustomerDetailsByCustomerId;
        ctrl.findCustomerDetailsByCustomerId();
        ctrl.updateReturnStatuToYyq = updateReturnStatuToYyq; //同意延期
        ctrl.updateReturnStatuToCszt = updateReturnStatuToCszt;//拒绝延期
        ctrl.replacePrincipal = replacePrincipal;//更换负责人
        ctrl.assignPrincipal = assignPrincipal;//续保主管指定负责人

        // 回退
        function goBack(){
          $ionicHistory.goBack();
        }
        //路由跳转
        function stateChange(stateTo,params){
          $ionicViewSwitcher.nextDirection('forward');
          $state.go(stateTo,params);
        }

        /**
         *根据customerId查询该潜客详情
         * params: customerId
         */
        function findCustomerDetailsByCustomerId() {
          if (ctrl.customerId != null) {
            var params = {'customerId': ctrl.customerId};
            customerDetailsService.findCustomerDetailsByCustomerId(params).then(function (result) {
              if (result.status == 'OK') {
                ctrl.customerDetails = result.results.content.results;
                ctrl.principalId = ctrl.customerDetails.principalId;
                ctrl.principal = ctrl.customerDetails.principal;
                ctrl.customerId = ctrl.customerDetails.customerId;
                ctrl.holderRoleId = ctrl.customerDetails.holderRoleId;
                ctrl.holderId = ctrl.customerDetails.holderId;
                ctrl.cusLostInsurStatu = ctrl.customerDetails.cusLostInsurStatu;
                ctrl.customerTraceRecodes = ctrl.customerDetails.customerTraceRecodes;
                for (var i = 0; i < ctrl.customerTraceRecodes.length; i++) {
                  ctrl.customerTraceRecodes[i].hideStatus = false;
                }
                ctrl.insuranceStatus = false;
              } else {

              }
            });
          }
        };

       //续保主管同意延期
        function updateReturnStatuToYyq() {
          var confirmPopup = pubPopup.confirm({
            title: '同意延期原因',
            template: '<textarea type="text" class="result-box" ng-model="ctrl.tyyqyj"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.tyyqyj){
                pubHelper.alert(false,"请输入延期原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.updateReturnStatuToYyq(ctrl.customerId, ctrl.principalId,ctrl.principal,ctrl.tyyqyj)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"延期成功",0);
                      ctrl.stateChange('customerDyqList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:7});
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                    ;
                  });
              }
            }
          });
        }

        //续保主管拒绝延期
        function updateReturnStatuToCszt() {
          var confirmPopup = pubPopup.confirm({
            title: '拒绝延期原因',
            template: '<textarea type="text" class="result-box" ng-model="ctrl.jjyqyy"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.jjyqyy){
                pubHelper.alert(false,"请输入拒绝延期原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.updateReturnStatuToCszt(ctrl.customerId, ctrl.principalId,ctrl.principal,ctrl.jjyqyy)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"操作成功",0);
                      ctrl.stateChange('customerDyqList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:7});
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                    ;
                  });
              }
            }
          });
        }

        //续保主管更换负责人
        function replacePrincipal(){
          if(ctrl.principalId==null||ctrl.principalId==''){
            pubHelper.alert(false,"该潜客不在续保专员名下，不能更换负责人")
            return;
          }
          if(ctrl.returnStatu==3&&ctrl.cusLostInsurStatu==2){
            pubHelper.alert(false,"该潜客已经脱保，且处于待回退，不能更换负责人")
            return;
          }
          if(ctrl.returnStatu==7&&ctrl.cusLostInsurStatu==2){
            pubHelper.alert( false,"该潜客已经脱保，且处于待延期，不能更换负责人")
            return;
          }
          //更换负责人列表查询
          customerDetailsService.findAllSubordinate(ctrl.principalId).then(function (result) {
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.replacePrincipals = result.results.content.results;
            } else {

            };
          });

          ctrl.newPrincipal = {};
          var confirmPopup = pubPopup.confirm({
            title: '更换负责人',
            template: '<div>'+
            '<select class="principal-select" ng-model="ctrl.newPrincipal.principal" ng-options="y.userName for (x,y) in ctrl.replacePrincipals">'+
            '<option value="">请选择负责人</option>'+
            '</select>'+
            '</div><textarea type="text" class="result-box" ng-model="ctrl.ghfzryy" placeholder="请输入更换原因"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.newPrincipal.principal){
                pubHelper.alert(false,"请选择负责人");
                return;
              }else if(!ctrl.ghfzryy){
                pubHelper.alert(false,"请输入原因");
                return;
              } else {
                $ionicLoading.show();
                customerDetailsService.replacePrincipal(ctrl.customerId, ctrl.newPrincipal.principal.id,
                  ctrl.newPrincipal.principal.userName, ctrl.principalId,ctrl.principal,ctrl.ghfzryy)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK' && result.results.content.status == 'OK') {
                      pubHelper.alert(true,"更换成功",0);
                      ctrl.stateChange('customerDyqList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:7});
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                  });
              }
            }
          });
        };


        //续保主管指定负责人
        function assignPrincipal(){
          //指定负责人列表查询
          customerDetailsService.findSubordinate().then(function (result) {
            if (result.status == 'OK'&&result.results.content.status=='OK') {
              ctrl.assignPrincipals = result.results.content.results;
            } else {
            };
          });
          ctrl.assignPri = {};
          var confirmPopup = pubPopup.confirm({
            title: '指定负责人',
            template: '<div>'+
            '<select class="principal-select" ng-model="ctrl.assignPri.principal" ng-options="y.userName for (x,y) in ctrl.assignPrincipals">'+
            '<option value="">请选择负责人</option>'+
            '</select>'+
            '</div><textarea type="text" class="result-box" ng-model="ctrl.assignPri.ghfzryy" placeholder="请输入原因"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.assignPri.principal){
                pubHelper.alert(false,"请选择负责人");
                return;
              }else if(!ctrl.assignPri.ghfzryy){
                pubHelper.alert(false,"请输入原因");
                return;
              } else {
                $ionicLoading.show();
                customerDetailsService.assignPrincipal(ctrl.customerId, ctrl.assignPri.principal.id,
                  ctrl.assignPri.principal.userName, ctrl.principalId,ctrl.assignPri.ghfzryy)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK' && result.results.content.status == 'OK') {
                      pubHelper.alert(true,"操作成功");
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                  });
              }
            }
          });
        };

  }])


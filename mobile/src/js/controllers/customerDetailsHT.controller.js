angular.module('starter')
  .controller('CustomerDetailsHTController',
    ['$scope','$state','$timeout','$ionicPopup','pubHelper','pubPopup','$ionicModal','$ionicLoading','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','customerDetailsService',
      function($scope,$state,$timeout,$ionicPopup,pubHelper,pubPopup,$ionicModal,$ionicLoading,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,customerDetailsService) {
        var ctrl = this;
        ctrl.stateChange = stateChange;
        ctrl.goBack = goBack;
        ctrl.customerId = $stateParams.customerId;
        ctrl.contact = $stateParams.contact;
        ctrl.userName = $stateParams.userName;
        ctrl.userId = $stateParams.userId;
        ctrl.returnStatu = $stateParams.returnStatu;
        ctrl.user = $localStorage.loginMsg;// 获取人员信息
        ctrl.csModuleFlag =  ctrl.user.store.csModuleFlag; //客服模块状态
        ctrl.findCustomerDetailsByCustomerId = findCustomerDetailsByCustomerId;
        ctrl.AgreetraceReturn = AgreetraceReturn; //同意回退
        ctrl.unAgreeTraceReturn = unAgreeTraceReturn;//拒绝回退
        ctrl.replacePrincipal = replacePrincipal;//更换负责人
        ctrl.returnByXSJLZD = returnByXSJLZD; //销售经理、服务经理主动回退
        ctrl.findDefeatedDetail = findDefeatedDetail;//查询该战败潜客详情
        ctrl.defeatCustomerBtn = defeatCustomerBtn;//战败潜客

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
                ctrl.clerkId = ctrl.customerDetails.clerkId;
                ctrl.clerk = ctrl.customerDetails.clerk;
                ctrl.cusLostInsurStatu = ctrl.customerDetails.cusLostInsurStatu;
                ctrl.customerTraceRecodes = ctrl.customerDetails.customerTraceRecodes;
                for (var i = 0; i < ctrl.customerTraceRecodes.length; i++) {
                  ctrl.customerTraceRecodes[i].hideStatus = false;
                }
                ctrl.insuranceStatus = false;

                //更换负责人列表查询
                if(ctrl.user.role.roleId==3){
                  ctrl.fzrId = ctrl.principalId;
                }else if(ctrl.user.role.roleId==7||ctrl.user.role.roleId==9){
                  ctrl.fzrId = ctrl.clerkId;
                }
                customerDetailsService.findAllSubordinate(ctrl.fzrId).then(function (result) {
                  if (result.status == 'OK'&&result.results.content.status=='OK') {
                    ctrl.replacePrincipals = result.results.content.results;
                  } else {

                  };
                });
              } else {

              }
            });
          }
        };

        /**
         *根据id查询该战败潜客详情
         * params: Id
         */
        function findDefeatedDetail() {
          if (ctrl.customerId != null) {
            var params = {id: ctrl.customerId};
            customerDetailsService.findDefeatedSourceById(params).then(function (result) {
              if (result.status == 'OK') {
                ctrl.customerDetails = result.results.content.results;
              } else {

              }
            });
          }
        };

        //战败潜客
        function defeatCustomerBtn() {
          var confirmPopup = pubPopup.confirm({
            title: '战败潜客',
            template: '是否确定战败潜客？',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              $ionicLoading.show();
              customerDetailsService.saveDefeatCustomer( ctrl.customerDetails)
                .then(function (result) {
                  $ionicLoading.hide();
                  if (result.status == 'OK'&&result.results.content.status=='OK') {
                    pubHelper.alert(true,"战败操作成功",0);
                    ctrl.stateChange('defeatList',{userId:ctrl.userId,userName:ctrl.userName});
                  } else {
                    pubHelper.alert(false,"战败操作失败");
                  }
                });
            }
          });
        };

       //续保主管同意回退
        function AgreetraceReturn(retrunType) {
          var title;
          if(retrunType==1){
            if(ctrl.principalId==null||ctrl.principalId==''||ctrl.principalId!=ctrl.holderId){
              pubHelper.alert(false,"非续保专员申请的回退，不能执行此操作");
              return;
            }
            title = "同意回退原因"
          }else if(retrunType==2){
            title = "同意失销原因"
          }else if(retrunType==3){
            title = "同意睡眠原因"
          }

          var confirmPopup = pubPopup.confirm({
            title: title,
            template: '<textarea type="text" class="result-box" ng-model="ctrl.tyhtyj"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.tyhtyj){
                pubHelper.alert(false,"请输入原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.AgreetraceReturn(ctrl.customerId, ctrl.principalId,ctrl.principal,ctrl.tyhtyj)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"操作成功",0);
                      if(retrunType==1){
                        ctrl.stateChange('customerList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }else if(retrunType==2){
                        ctrl.stateChange('lostList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }else if(retrunType==3){
                        ctrl.stateChange('sleepList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                  });
              }
            }
          });
        }

        //续保主管拒绝回退
        function unAgreeTraceReturn(refuseType) {
          var refuseTitle;
          if(refuseType==1){
            if(ctrl.principalId==null||ctrl.principalId==''||ctrl.principalId!=ctrl.holderId){
              pubHelper.alert(false,"非续保专员申请的回退，不能执行此操作",5000);
              return;
            }
            refuseTitle = "拒绝回退原因"
          }else if(refuseType==2){
            refuseTitle = "拒绝失销原因"
          }else if(refuseType==3){
            refuseTitle = "拒绝睡眠原因"
          }
          var confirmPopup = pubPopup.confirm({
            title: refuseTitle,
            template: '<textarea type="text" class="result-box" ng-model="ctrl.jjhtyj"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.jjhtyj){
                pubHelper.alert(false,"请输入原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.unAgreeTraceReturnXbzg(ctrl.customerId, ctrl.principalId,ctrl.principal,ctrl.jjhtyj)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"操作成功",0);
                      if(refuseType==1){
                        ctrl.stateChange('customerList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }else if(refuseType==2){
                        ctrl.stateChange('lostList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }else if(refuseType==3){
                        ctrl.stateChange('sleepList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                      }
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
                      ctrl.stateChange('customerList',{userId:ctrl.userId,userName:ctrl.userName,returnStatu:3});
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                  });
              }
            }
          });
        };
        //销售经理、服务经理主动回退
        $ionicModal.fromTemplateUrl('templates/modal/modalZDHT.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalZDHT = modal;
        });
        //销售经理、服务经理主动回退
        function returnByXSJLZD(){
          if(!ctrl.confirmData.zdhtyj){
            pubHelper.alert(false,"原因不能为空");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.returnByXSJLZD(ctrl.customerId,ctrl.clerkId,ctrl.confirmData.zdhtyj,ctrl.principalId,ctrl.principal)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status == 'OK') {
                $scope.modalZDHT.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功");
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            })

        }

  }])


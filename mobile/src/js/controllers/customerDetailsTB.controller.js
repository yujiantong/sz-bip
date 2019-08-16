angular.module('starter')
  .controller('CustomerDetailsTBController',
    ['$scope','$state','$timeout','$filter','$ionicPopup','pubHelper','pubPopup','$ionicModal','$ionicLoading','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','customerDetailsService',
      function($scope,$state,$timeout,$filter,$ionicPopup,pubHelper,pubPopup,$ionicModal,$ionicLoading,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,customerDetailsService) {
        var ctrl = this;
        ctrl.stateChange = stateChange;
        ctrl.goBack = goBack;
        ctrl.customerId = $stateParams.customerId;
        ctrl.contact = $stateParams.contact;
        ctrl.userName = $stateParams.userName;
        ctrl.userId = $stateParams.userId;
        ctrl.delayDate = $stateParams.delayDate;
        ctrl.user = $localStorage.loginMsg;// 获取人员信息
        ctrl.csModuleFlag =  ctrl.user.store.csModuleFlag; //客服模块状态
        ctrl.lockLevel = ctrl.user.store.lockLevel;
        ctrl.gzcxdata = $stateParams.gzcxdata;
        ctrl.findCustomerDetailsByCustomerId = findCustomerDetailsByCustomerId;
        ctrl.findCustomerDetailsByCustomerId();
        ctrl.activeReturn = activeReturn; //续保主管主动回退
        ctrl.updateReturnStatuByRD = updateReturnStatuByRD;//续保主管主动延期
        ctrl.addNewTrace = addNewTrace;//续保专员跟踪
        ctrl.setNextTraceDay = setNextTraceDay;//计算下次跟踪日期
        ctrl.jsbjje = jsbjje;//计算报价金额
        ctrl.traceReturn = traceReturn; //续保专员回退
        ctrl.updateReturnStatuToDyq = updateReturnStatuToDyq; //续保专员延期
        ctrl.traceReturnFwgw = traceReturnFwgw; //服务顾问回退
        ctrl.traceReturnSC = traceReturnSC; //销售顾问回退
        ctrl.traceReturnBtn = traceReturnBtn; //回退操作
        ctrl.replacePrincipalSM = replacePrincipalSM; //销售经理、服务经理更换负责人
        ctrl.returnByXSJLZD = returnByXSJLZD; //销售经理、服务经理主动回退
        ctrl.lostSale = lostSale; //续保主管主动失销
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
                ctrl.newTrace.customerLevel = ctrl.customerDetails.customerLevel;
                var length = ctrl.customerDetails.customerAssigns.length-1;
                ctrl.acceptStatu = ctrl.customerDetails.customerAssigns[length].acceptStatu;
                ctrl.traceStatu = ctrl.customerDetails.customerAssigns[length].traceStatu;
                ctrl.returnStatu = ctrl.customerDetails.customerAssigns[length].returnStatu;
                ctrl.inviteStatu =ctrl.customerDetails.customerAssigns[length].inviteStatu;
                ctrl.delayDate =ctrl.customerDetails.customerAssigns[length].delayDate;
                ctrl.virtualJqxdqr = ctrl.customerDetails.virtualJqxdqr;
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
                ctrl.setNextTraceDay();
                //查询负责人列表，去除当前负责人
                if(ctrl.user.role.roleId==3){
                  ctrl.fzrId = ctrl.principalId;
                }else if(ctrl.user.role.roleId==7||ctrl.user.role.roleId==9){
                  ctrl.fzrId = ctrl.clerkId;
                }
                customerDetailsService.findAllSubordinate(ctrl.fzrId).then(function (result) {
                  if (result.status == 'OK'&& result.results.content.status=='OK') {
                    ctrl.replacePrincipals = result.results.content.results;
                  } else {

                  };
                });
              } else {

              }
            });
          }
        };

       //续保主管主动回退
        function activeReturn() {
          var confirmPopup = pubPopup.confirm({
            title: '回退原因',
            template: '<textarea type="text" class="result-box" ng-model="ctrl.zdhtyy"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.zdhtyy){
                pubHelper.alert(false,"请输入回退原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.activeReturn(ctrl.customerId,ctrl.principalId,ctrl.principal,ctrl.zdhtyy)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"回退成功");
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                    ;
                  });
              }
            }
          });
        }

        //续保主管主动延期
        function updateReturnStatuByRD() {
          var currentTime = $filter('date')(new Date(),'yyyy-MM-dd');
          var delayDate = $filter('date')(ctrl.delayDate,'yyyy-MM-dd');
          if(delayDate!=null&&delayDate>currentTime){
            pubHelper.alert(false,"该潜客已脱保时间未超出延期时间范围，此操作无法执行。");
            return;
          }
          var confirmPopup = pubPopup.confirm({
            title: '延期原因',
            template: '<textarea type="text" class="result-box" ng-model="ctrl.yqyy"></textarea>',
            okText:'确定',
            cancelText:'取消',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res) {
              if(!ctrl.yqyy){
                pubHelper.alert(false,"请输入延期原因");
                return;
              }else {
                $ionicLoading.show();
                customerDetailsService.updateReturnStatuByRD(ctrl.customerId, ctrl.principalId,ctrl.principal,ctrl.yqyy)
                  .then(function (result) {
                    $ionicLoading.hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                      pubHelper.alert(true,"延期成功");
                    } else {
                      pubHelper.alert(false,result.results.message);
                    }
                    ;
                  });
              }
            }
          });
        }

        ctrl.dateTrackOption = {
          title : '日期',
          buttonOk : '确定',
          buttonCancel : '取消'
        }
        //搜索框
        $ionicModal.fromTemplateUrl('templates/modal/modalYgz.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalYgz = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalYgz.remove();
        });
        //顾问跟踪框
        $ionicModal.fromTemplateUrl('templates/modal/modalgwGZ.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalgwGZ = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalgwGZ.remove();
        });
        //计算下次跟踪日期
        function setNextTraceDay(){
          var customerLevel = ctrl.newTrace.customerLevel;
          var daySets = ctrl.user.daySets;
          for(var i =0;i<daySets.length;i++){
            if(daySets[i].customerLevel == customerLevel){
              var dayNumber = daySets[i].dayNumber;
              var nextTraceDate = new Date( new Date().setDate(new Date().getDate() + dayNumber));
              ctrl.maxNextTraceDate = $filter('date')(nextTraceDate,'yyyy-MM-dd');
              ctrl.newTrace.nextTraceDate = ctrl.maxNextTraceDate;
            }
          }
        }
        //计算报价金额
        function jsbjje(){
          var syxbj = parseFloat(ctrl.newTrace.syxbj||0);//商业险报价
          var jqxbj = parseFloat(ctrl.newTrace.jqxbj||0);//交强险报价
          var ccsbj = parseFloat(ctrl.newTrace.ccsbj||0);//车船税报价
          ctrl.newTrace.quotedPrice = (syxbj + jqxbj + ccsbj).toFixed(2);
        }
        //续保专员跟踪
        ctrl.newTrace = {};
        function addNewTrace(traceFlag) {
          var customerLevel = ctrl.newTrace.customerLevel;
          var nextTraceDate = $filter('date')(ctrl.newTrace.nextTraceDate,'yyyy-MM-dd');
          var sfjt = ctrl.newTrace.sfjt;
          var inviteDate =ctrl.newTrace.inviteDate==""?undefined: $filter('date')(ctrl.newTrace.inviteDate,'yyyy-MM-dd');
          var quote =  ctrl.newTrace.quote;
          var quotedPrice = ctrl.newTrace.quotedPrice;
          var syxbj = ctrl.newTrace.syxbj;//商业险报价
          var jqxbj = ctrl.newTrace.jqxbj;//交强险报价
          var ccsbj = ctrl.newTrace.ccsbj;//车船税报价
          var sfgyx = ctrl.newTrace.sfgyx;//是否高意向
          var traceContext ="操作人:"+ ctrl.userName+";"+"内容:"+ ctrl.newTrace.traceContext;//跟踪内容
          var customerId = ctrl.customerId;
          var lxr = ctrl.customerDetails.contact;
          var lxfs = ctrl.customerDetails.contactWay;
          var cx = ctrl.customerDetails.vehicleModel;
          var bxdqr = $filter('date')(ctrl.customerDetails.jqxrqEnd,'yyyy-MM-dd');
          var principal = ctrl.customerDetails.principal;
          var principalId = ctrl.customerDetails.principalId;
          var renewalType = $filter('mapTBLX')(ctrl.customerDetails.renewalType);

          var newTraceDatas = {
            customerId:customerId,lxr:lxr,lxfs:lxfs, cx:cx,quote:quote,quotedPrice:quotedPrice,
            customerLevel:customerLevel,sfjt:sfjt, bxdqr:bxdqr,nextTraceDate:nextTraceDate,
            inviteDate:inviteDate, traceContext:traceContext, principal:principal,principalId:principalId,
            syxbj:syxbj,jqxbj:jqxbj, ccsbj:ccsbj,renewalType:renewalType,sfgyx:sfgyx
          };
          var today = $filter('date')(new Date(),'yyyy-MM-dd');
          if(ctrl.newTrace.traceContext==""||ctrl.newTrace.traceContext==null){
            pubHelper.alert(false,"请填写跟踪内容");
            return;
          }else if(nextTraceDate==""||nextTraceDate==null){
            pubHelper.alert(false,"请填写下次跟踪日期");
            return;
          }else if(nextTraceDate<today){
            pubHelper.alert(false,"下次跟踪日期必须大于等于当前日");
            return;
          }else if(nextTraceDate>ctrl.maxNextTraceDate){
            pubHelper.alert(false,"下次跟踪日期不能超过"+ctrl.maxNextTraceDate);
            ctrl.newTrace.nextTraceDate = ctrl.maxNextTraceDate;
            return;
          }else if(inviteDate != "" && inviteDate != null && inviteDate<today){
            pubHelper.alert(false,"预计到店日期必须大于等于当前日");
            ctrl.newTrace.inviteDate = undefined;
            return;
          }else if(sfgyx==""||sfgyx==null){
            pubHelper.alert(false,"请选择是否高意向");
            return;
          }else {
            $ionicLoading.show();
            customerDetailsService.addTraceRecord(newTraceDatas,traceFlag)
              .then(function (result) {
                $ionicLoading.hide();
                if (result.status == 'OK'&&result.results.content.status=='OK') {
                  $scope.modalYgz.hide();
                  setTimeout(function(){
                    pubHelper.alert(true,"跟踪信息添加成功");
                  },500)
                } else {
                  pubHelper.alert(false,result.results.content.message);
                }
                ;
              });
          }
        }

        //按4s店ID查询所有失销/回退原因
        ctrl.reasonData = {storeId: ctrl.user.store.storeId};
        ctrl.htyySelect = [];
        customerDetailsService.findForSelectData(ctrl.reasonData).then(function (result) {
          if (result.status == 'OK') {
            ctrl.reasonAll = result.results.content.result;
            for(var i=0;i<ctrl.reasonAll.length;i++){
              ctrl.htyySelect.push(ctrl.reasonAll[i].reason);
            }
          } else {

          }
        });
        //搜索框
        $ionicModal.fromTemplateUrl('templates/modal/modalHT.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalHT = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalHT.remove();
        });
        //续保专员失销
        $ionicModal.fromTemplateUrl('templates/modal/modalSX.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalSX = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalSX.remove();
        });
        //续保专员睡眠
        $ionicModal.fromTemplateUrl('templates/modal/modalSM.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalSM = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalSM.remove();
        });
        //续保专员回退
        ctrl.confirmData = {};
        function traceReturn(applyStatu){
          var currentTime = $filter('date')(new Date(),'yyyy-MM-dd');
          var delayDate = $filter('date')(ctrl.delayDate,'yyyy-MM-dd');
          if(applyStatu!=1&&applyStatu!=2){
            if(delayDate==null&&ctrl.cusLostInsurStatu==2){
              pubHelper.alert(false,"该潜客已脱保，且在将脱保时未做延期，此操作无法执行。");
              return;
            }
            if(delayDate<currentTime){
              pubHelper.alert(false,"该潜客已脱保，且超出延期时间范围，此操作无法执行");
              return;
            }
            if(ctrl.returnStatu==3){
              pubHelper.alert(false,"该潜客已经申请回退，当前在处于待审批状态，此操作不能进行");
              return;
            }
          }

          var htyyxz = ctrl.confirmData.htyyxz||"";
          var htyysr = ctrl.confirmData.htyysr||"";
          ctrl.confirmData.htyy = '';
          if(htyyxz==''){
            ctrl.confirmData.htyy = htyysr;
          }else{
            if(htyysr==""){
              ctrl.confirmData.htyy = htyyxz;
            }else{
              ctrl.confirmData.htyy = htyyxz + "," + htyysr;
            }
          }
          if(ctrl.confirmData.htyy==''){
            if(applyStatu==1){
              pubHelper.alert(false,"请选择失销原因");
            }else if(applyStatu==2){
              pubHelper.alert(false,"请输入睡眠原因");
            }else{
              pubHelper.alert(false,"请选择回退原因");
            };
            return;
          }
          $ionicLoading.show();
          customerDetailsService.traceReturn(ctrl.customerId, ctrl.confirmData.htyy,ctrl.principalId,ctrl.principal,htyyxz,applyStatu)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status=='OK') {
                if(applyStatu==1){
                  $scope.modalSX.hide();
                }else if(applyStatu==2){
                  $scope.modalSM.hide();
                }else{
                  $scope.modalHT.hide();
                };

                setTimeout(function(){
                  pubHelper.alert(true,"操作成功",1);
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            });
        };
        //服务顾问回退
        function traceReturnFwgw(){
          if(ctrl.returnStatu==3){
            pubHelper.alert(false,"该潜客已经申请回退，当前在处于待审批状态，此操作不能进行");
            return;
          }
          var htyyxz = ctrl.confirmData.htyyxz||"";
          var htyysr = ctrl.confirmData.htyysr||"";
          ctrl.confirmData.htyy = '';
          if(htyyxz==''){
            ctrl.confirmData.htyy = htyysr;
          }else{
            if(htyysr==""){
              ctrl.confirmData.htyy = htyyxz;
            }else{
              ctrl.confirmData.htyy = htyyxz + "," + htyysr;
            }
          }
          if(htyyxz==''){
            pubHelper.alert(false,"请选择回退原因");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.traceReturnFwgw(ctrl.customerId, ctrl.confirmData.htyy,ctrl.principalId,ctrl.principal)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status=='OK') {
                $scope.modalHT.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功",1);
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            });
        };
        //销售顾问回退
        function traceReturnSC(){
          if(ctrl.returnStatu==3){
            pubHelper.alert(false,"该潜客已经申请回退，当前在处于待审批状态，此操作不能进行");
            return;
          }
          var htyyxz = ctrl.confirmData.htyyxz||"";
          var htyysr = ctrl.confirmData.htyysr||"";
          ctrl.confirmData.htyy = '';
          if(htyyxz==''){
            ctrl.confirmData.htyy = htyysr;
          }else{
            if(htyysr==""){
              ctrl.confirmData.htyy = htyyxz;
            }else{
              ctrl.confirmData.htyy = htyyxz + "," + htyysr;
            }
          }
          if(htyyxz==''){
            pubHelper.alert(false,"请选择回退原因");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.returnBySC(ctrl.customerId, ctrl.confirmData.htyy,ctrl.principalId,ctrl.principal)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status=='OK') {
                $scope.modalHT.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功",1);
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            });
        };
        //回退操作按钮
        function traceReturnBtn(applyStatu){
          if(ctrl.user.role.roleId==2){
            ctrl.traceReturn(applyStatu);
          }else if(ctrl.user.role.roleId==6){
            ctrl.traceReturnSC();
          }else if(ctrl.user.role.roleId==8){
            ctrl.traceReturnFwgw();
          }
        }
        //搜索框
        $ionicModal.fromTemplateUrl('templates/modal/modalYQ.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalYQ = modal;
        });
          //当我们用到模型时，清除它！
          $scope.$on('$destroy', function() {
            $scope.modalYQ.remove();
          });
          //申请延期按钮
          function updateReturnStatuToDyq(){
          var currentTime = $filter('date')(new Date(),'yyyy-MM-dd');
          var delayDate = $filter('date')(ctrl.delayDate,'yyyy-MM-dd');
          var maxDelayDay =new Date().getTime() +30*24*3600*1000;
          maxDelayDay = $filter('date')(maxDelayDay,'yyyy-MM-dd');
          var virtualJqxdqr = $filter('date')(ctrl.virtualJqxdqr,'yyyy-MM-dd');
          var applyDelayDay= $filter('date')(ctrl.confirmData.applyDelayDay,'yyyy-MM-dd');
          if(delayDate==null&&ctrl.cusLostInsurStatu==2){
            pubHelper.alert(false,"该潜客已脱保，且在将脱保时未做延期，此操作无法执行。");
            return;
          }
          if(delayDate<currentTime){
            pubHelper.alert(false,"该潜客已脱保，且超出延期时间范围，此操作无法执行");
            return;
          }
          if(ctrl.returnStatu==7){
            pubHelper.alert(false,"该潜客已经申请延期，当前在处于待审批状态，此操作不能进行");
            return;
          }
          if(!applyDelayDay){
            pubHelper.alert(false,"延期日期不能为空");
            return;
          }
          if(applyDelayDay<=currentTime){
            pubHelper.alert(false,"延期日期必须大于今天");
            return;
          }
          if(applyDelayDay<=virtualJqxdqr){
            pubHelper.alert(false,"延期日期必须大于保险到期日");
            return;
          }
          if(applyDelayDay>maxDelayDay){
            pubHelper.alert(false,"延期日期不能超过30天");
            return;
          }
          if(!ctrl.confirmData.yqyy){
            pubHelper.alert(false,"原因不能为空");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.updateReturnStatuToDyq(ctrl.customerId,ctrl.confirmData.yqyy,ctrl.principalId,ctrl.principal,applyDelayDay)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status == 'OK') {
                $scope.modalYQ.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功",1);
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            });

        };

        //销售经理、服务经理更新负责人
        $ionicModal.fromTemplateUrl('templates/modal/modalHR.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalHR = modal;
        });
        ctrl.newPrincipal = {};
        function replacePrincipalSM(){
          if(!ctrl.newPrincipal.principal){
            pubHelper.alert(false,"请选择持有人");
            return;
          };
          if(!ctrl.newPrincipal.ghfzryy){
            pubHelper.alert(false,"原因不能为空");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.replacePrincipalSM(ctrl.newPrincipal.principal.id,ctrl.newPrincipal.principal.userName,
            ctrl.customerId, ctrl.clerkId,ctrl.clerk, ctrl.newPrincipal.ghfzryy)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status == 'OK') {
                $scope.modalHR.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功");
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            })
        }
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
        //续保主管主动失销
        $ionicModal.fromTemplateUrl('templates/modal/modalZDSX.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal) {
          $scope.modalZDSX = modal;
        });
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modalZDSX.remove();
        });
        function lostSale(){
          var htyyxz = ctrl.confirmData.htyyxz||"";
          var htyysr = ctrl.confirmData.htyysr||"";
          ctrl.confirmData.htyy = '';
          if(htyyxz==''){
            ctrl.confirmData.htyy = htyysr;
          }else{
            if(htyysr==""){
              ctrl.confirmData.htyy = htyyxz;
            }else{
              ctrl.confirmData.htyy = htyyxz + "," + htyysr;
            }
          }
          if(ctrl.confirmData.htyy==''){
            pubHelper.alert(false,"请选择失销原因");
            return;
          }
          $ionicLoading.show();
          customerDetailsService.lostByXbzg(ctrl.customerId,ctrl.principalId,ctrl.principal,ctrl.confirmData.htyy,htyyxz)
            .then(function (result) {
              $ionicLoading.hide();
              if (result.status == 'OK' && result.results.content.status=='OK') {
                $scope.modalZDSX.hide();
                setTimeout(function(){
                  pubHelper.alert(true,"操作成功");
                },500)
              } else {
                pubHelper.alert(false,result.results.message);
              }
            });
        };
  }])


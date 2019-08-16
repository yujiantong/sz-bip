angular.module('starter')
  .controller('CustomerListController',
    ['$scope','$state','$timeout','$filter','$ionicHistory','pubHelper','pubPopup','$ionicLoading','$ionicModal','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','customerListService',
    function($scope,$state,$timeout,$filter,$ionicHistory,pubHelper,pubPopup,$ionicLoading,$ionicModal,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,customerListService) {
      var ctrl = this;
      ctrl.stateChange = stateChange;
      ctrl.goBack = goBack;
      ctrl.user = $localStorage.loginMsg;// 获取人员信息
      ctrl.storeId = ctrl.user.store.storeId;
      ctrl.userId = $stateParams.userId;
      ctrl.userName = $stateParams.userName;
      ctrl.returnStatu = $stateParams.returnStatu;
      ctrl.customerNum = $stateParams.customerNum;
      ctrl.cusLostInsurStatu = $stateParams.cusLostInsurStatu;
      ctrl.cxdata = $stateParams.cxdata;
      ctrl.gzcxdata = $stateParams.gzcxdata;
      ctrl.currentPage = 1;
      ctrl.isLock=false;
      ctrl.today=$filter('date')(new Date(),'yyyy-MM-dd');
      $scope.items = [];
      //回退待审批和延期待审批潜客列表
      ctrl.findCustomerCollectionByUserId = findCustomerCollectionByUserId;
      //未接收潜客列表
      ctrl.findWJSCustomer = findWJSCustomer;
      //应跟踪潜客列表
      ctrl.findYGZCustomer = findYGZCustomer;
      //到店未出单潜客列表
      ctrl.findDDWCDCustomer = findDDWCDCustomer;
      //邀约潜客列表
      ctrl.findJRYYCustomerCollectionByUserId = findJRYYCustomerCollectionByUserId;
      //已脱保潜客列表
      ctrl.findYTBCustomerCollectionByUserId = findYTBCustomerCollectionByUserId;
      //将脱保潜客列表
      ctrl.findJTBCustomerCollectionByUserId = findJTBCustomerCollectionByUserId;
      //今日创建保单列表
      ctrl.findBillTodayCreate = findBillTodayCreate;
      //已激活潜客列表
      ctrl.findJiHuoByUserId = findJiHuoByUserId;
      //待审批潜客列表
      ctrl.findDSPCustomerByUserId = findDSPCustomerByUserId;
      //查询潜客列表
      ctrl.findCustomerByCondition = findCustomerByCondition;
      //根据回退状态查询潜客列表（服务顾问销售顾问跟踪完成潜客）
      ctrl.findByReturnStatu = findByReturnStatu;
      //唤醒未分配
      ctrl.findWakeupCustomer = findWakeupCustomer;
      //查询战败线索列表
      ctrl.findDefeatedCustomer = findDefeatedCustomer;

      ctrl.findCompInfo = findCompInfo;
      ctrl.findCompInfo();
      ctrl.findCarInfo = findCarInfo;
      ctrl.findCarInfo();
      ctrl.xzVehicleModel = xzVehicleModel;
      //续保专员批量接收
      ctrl.updateAcceptStatuBatch = updateAcceptStatuBatch;
      //接收全选
      ctrl.checkAllChange = checkAllChange;
      //已回退潜客列表
      ctrl.findByYiHuiTui = findByYiHuiTui;
      //销售经理服务经理批量更换负责人
      ctrl.changePrincipalBatch = changePrincipalBatch;
      ctrl.changePriBox = changePriBox;
      ctrl.findHolder = findHolder; //查询持有人
      ctrl.findHolder();
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
       * 查询潜客列表
       * param:userId
       */

      function findCustomerCollectionByUserId(applyStatu) {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {"userId":ctrl.userId,"currentPage":ctrl.currentPage,"returnStatu": ctrl.returnStatu,"applyStatu":applyStatu};
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findCustomerCollectionByUserId(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
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

      $scope.doRefresh = function (applyStatu) {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findCustomerCollectionByUserId(applyStatu);
        $scope.hasmore = false;
      }

      //未接收潜客列表
      function findWJSCustomer() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {"userId":ctrl.userId,"currentPage":ctrl.currentPage};
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findWJSCustomer(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerListWjs = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for (var i = 0; i < ctrl.customerListWjs.length; i++) {
              ctrl.customerListWjs[i].checked = false;
            }
            if (ctrl.customerListWjs.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListWjs);
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

      $scope.doRefreshWjs = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findWJSCustomer();
      }

      //续保专员批量接收
      function updateAcceptStatuBatch(){
        ctrl.AcceptDatas = [];
        for (var j = 0; j < $scope.items.length; j++) {
          if( $scope.items[j].checked == true){

            if(!$scope.items[j].principalId || !$scope.items[j].principal){
              $scope.items[j].principalId = parseInt(ctrl.userId),
                $scope.items[j].principal = ctrl.userName
            }

            var oneData = {
              customerId:$scope.items[j].customerId,
              userId:parseInt(ctrl.userId),
              userName:ctrl.userName,
              principalId:$scope.items[j].principalId,
              principal:$scope.items[j].principal
            }
            ctrl.AcceptDatas.push(oneData);
          }
        }
        if(ctrl.AcceptDatas.length==0){
          pubHelper.alert(false,"请选择需要接收的潜客");
          return;
        }
        $ionicLoading.show();
        customerListService.updateAcceptStatuBatch(ctrl.AcceptDatas).then(function (result) {
          $ionicLoading.hide();
          if (result.status == 'OK'&&result.results.content.status=='OK') {
              pubHelper.alert(true,"接收成功",0);
              $scope.doRefreshWjs();
             ctrl.checkAll.checked = false;
          } else {
            pubHelper.alert(false,result.results.message,0);
          }
        });
      }

      ctrl.checkAll = {checked: false};
      function checkAllChange(){
        if(ctrl.checkAll.checked == true){
          for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].checked = true;
          }
        };
        if(ctrl.checkAll.checked == false){
          for (var i = 0; i < $scope.items.length; i++) {
            $scope.items[i].checked = false;
          }
        }
      }
      //批量换人弹出框
      $ionicModal.fromTemplateUrl('templates/modal/changePrincipal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.changePri = modal;
      });
      //查询负责人列表
      customerListService.findSubordinate().then(function (result) {
        if (result.status == 'OK'&&result.results.content.status=='OK') {
          ctrl.PriUser = result.results.content.results;
        } else {
        };
      });
      function changePriBox(PriState){
        ctrl.PriState = PriState;
        var PriBol = false;
        for (var i = 0; i < $scope.items.length; i++) {
          if( $scope.items[i].checked == true){
            PriBol = true;
          }
        };
        if(PriBol == false){
          pubHelper.alert(false,"请选择潜客");
          return;
        }else{
          $scope.changePri.show();
        }
      }
      //销售经理服务经理批量换人
      ctrl.newPri={};
      function changePrincipalBatch(){
        ctrl.ReplaceDatas = [];
        if(!ctrl.newPri.User){
          pubHelper.alert(false,"请选择持有人");
          return;
        }
        ctrl.newPrincipalId = ctrl.newPri.User.id;
        ctrl.newPrincipal = ctrl.newPri.User.userName;
        for (var j = 0; j < $scope.items.length; j++) {
          if( $scope.items[j].checked == true){
            var oneData = {
              customerId:$scope.items[j].customerId,
              prePrincipalId:$scope.items[j].clerkId,
              prePrincipal:$scope.items[j].clerk,
              newPrincipalId:ctrl.newPrincipalId,
              newPrincipal:ctrl.newPrincipal
            }
            ctrl.ReplaceDatas.push(oneData);
          }
        }
        $ionicLoading.show();
        customerListService.changePrincipalBatch(ctrl.ReplaceDatas).then(function (result) {
          $ionicLoading.hide();
          if (result.status == 'OK'&&result.results.content.status=='OK') {
            $scope.changePri.hide();
            if(ctrl.PriState==1){
              $scope.doDSPRefresh();
            }else if(ctrl.PriState==2){
              $scope.doRefreshYgz(1)
            }else if(ctrl.PriState==3){
              $scope.doRefreshYgz(2)
            }else if(ctrl.PriState==4){
              $scope.doJTBRefresh()
            }else if(ctrl.PriState==5){
              $scope.doYTBRefresh()
            }else if(ctrl.PriState==6){
              $scope.doRefreshWjs()
            }else if(ctrl.PriState==7){
              $scope.doRefreshDdwcd()
            }
            setTimeout(function(){
              pubHelper.alert(true,"更换成功",0);
            },500)
            ctrl.checkAll.checked = false;
          } else {
            pubHelper.alert(false,result.results.message,0);
          }
        });
      }

      //应跟踪潜客列表
      //搜索框应跟踪
      $ionicModal.fromTemplateUrl('templates/modal/searchGz.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.searchGz = modal;
      });
      //搜索框已跟踪
      $ionicModal.fromTemplateUrl('templates/modal/searchYgz.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.searchYgz = modal;
      });
      //搜索框已脱保
      $ionicModal.fromTemplateUrl('templates/modal/searchYtb.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.searchYtb = modal;
      });
      //搜索框已回退
      $ionicModal.fromTemplateUrl('templates/modal/searchYht.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.searchYht = modal;
      });
      ctrl.searchGz = {};
      if(ctrl.gzcxdata){
        ctrl.searchGz = JSON.parse(ctrl.gzcxdata);
      }
      function findYGZCustomer(traceStatu) {
        var cc = ctrl.searchGz.insuranceCoverageLY;
        var contact = ctrl.searchGz.contact;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var renewalType = ctrl.searchGz.renewalType;
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contactWay = ctrl.searchGz.contactWay;
        var ifLoan = ctrl.searchGz.ifLoan;
        var boo = ctrl.searchGz.boo;
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {userId:ctrl.userId,currentPage:ctrl.currentPage,traceStatu:traceStatu,contact:contact,boo:boo,
          customerLevel:customerLevel,insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,
          renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay,ifLoan:ifLoan};
        ctrl.gzcxdata = {traceStatu:traceStatu,contact:contact, customerLevel:customerLevel,boo:boo,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,
          renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay,ifLoan:ifLoan};
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findYGZCustomer(params).then(function (result) {
          $scope.searchGz.hide();
          $scope.searchYgz.hide();
          if (result.status == 'OK') {
            ctrl.customerListYgz = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            if (ctrl.customerListYgz.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListYgz);
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

      $scope.doRefreshYgz = function (traceStatu) {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findYGZCustomer(traceStatu);
      }

      //到店未出单潜客列表
      function findDDWCDCustomer() {
        if (ctrl.isLock)return;
        ctrl.isLock = true;
        var params = {"userId": ctrl.userId, "currentPage": ctrl.currentPage};
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findDDWCDCustomer(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerListDdwcd = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            if (ctrl.customerListDdwcd.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListDdwcd);
          }else{
            $scope.hasmore = true;
            return;
          }
        }).finally(function (error) {
          ctrl.isLock = false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.refreshComplete');
        })
      }

      $scope.doRefreshDdwcd = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findDDWCDCustomer();
      }

      /**
       * 查询今日邀约潜客列表
       * param:userId；currentPage
       */
      function findJRYYCustomerCollectionByUserId() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {"userId":ctrl.userId,"currentPage":ctrl.currentPage};
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findJRYYCustomerCollectionByUserId(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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

      $scope.doJRYYRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findJRYYCustomerCollectionByUserId();
        $scope.hasmore = false;
      }

      /**
       * 查询已脱保潜客列表
       * param:userId；currentPage
       */

      function findYTBCustomerCollectionByUserId() {
        var contact = ctrl.searchGz.contact;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var renewalType = ctrl.searchGz.renewalType;
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contactWay = ctrl.searchGz.contactWay;
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        if(ctrl.userId == null || ctrl.currentPage == null || ctrl.cusLostInsurStatu == null){
          return;
        }
        var params = {userId:ctrl.userId,currentPage:ctrl.currentPage,cusLostInsurStatu:2,contact:contact,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,
          renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay};
        ctrl.gzcxdata = {cusLostInsurStatu:2,contact:contact,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,renewalType:renewalType,
          chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay};
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        customerListService.findYTBCustomerCollectionByUserId(params).then(function (result) {
          $scope.searchYtb.hide();
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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

      $scope.doYTBRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findYTBCustomerCollectionByUserId();
        $scope.hasmore = false;
      }

      /**
       * 查询将脱保潜客列表（因为和已脱保的差不多，请看清楚再改）
       * param:userId；currentPage
       */

      function findJTBCustomerCollectionByUserId() {
        var contact = ctrl.searchGz.contact;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var renewalType = ctrl.searchGz.renewalType;
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contactWay = ctrl.searchGz.contactWay;
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {userId:ctrl.userId,currentPage:ctrl.currentPage,cusLostInsurStatu:1,contact:contact,
          customerLevel:customerLevel,insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,
          renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay};
        ctrl.gzcxdata = {cusLostInsurStatu:1,contact:contact, customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,
          renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contactWay:contactWay};
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        if(ctrl.userId == null || ctrl.currentPage == null || ctrl.cusLostInsurStatu == null){
          return;
        }
        customerListService.findYTBCustomerCollectionByUserId(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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

      $scope.doJTBRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findJTBCustomerCollectionByUserId();
        $scope.hasmore = false;
      }

      /**
       * 查询今日创建保单
       * param:userId；currentPage
       */

      function findBillTodayCreate() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        if(ctrl.currentPage == null){
          return;
        }
        var params = {'storeId':ctrl.storeId,'currentPage':ctrl.currentPage,'foundDate':ctrl.today};
        customerListService.findBillTodayCreate(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.billList = result.results.content.results;
            ctrl.billCount = result.results.content.billCount;
            for(var i=0 ; i<ctrl.billList.length;i++){
              ctrl.billList[i].hideStatus = false;
            }
            if (ctrl.billList.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.billList);
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

      $scope.doBillRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findBillTodayCreate();
        $scope.hasmore = false;
      }

      /**
       * 查询已激活潜客列表
       * param:userId；currentPage
       */
      function findJiHuoByUserId() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {"userId":ctrl.userId,"currentPage":ctrl.currentPage};
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findByJiHuo(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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

      $scope.doJiHuoRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findJiHuoByUserId();
        $scope.hasmore = false;
      }

      /**
       * 查询待审批潜客列表
       * param:userId；currentPage
       */
      function findDSPCustomerByUserId() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var renewalType = ctrl.searchGz.renewalType;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contact = ctrl.searchGz.contact;
        var contactWay = ctrl.searchGz.contactWay;
        var params = {currentPage:ctrl.currentPage,renewalType:renewalType,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
          carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
        };
        ctrl.gzcxdata = {renewalType:renewalType,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
          carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
        };
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        if(ctrl.currentPage == null){
          return;
        }
        customerListService.findReturnDSPCustomer(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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

      $scope.doDSPRefresh = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findDSPCustomerByUserId();
        $scope.hasmore = false;
      }

      //搜索框
      $ionicModal.fromTemplateUrl('templates/modal/modal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      ctrl.dateTrackOption = {
        title : '保险到期日',
        buttonOk : '确定',
        buttonCancel : '取消'
      }
      //根据4s店id查询保险公司信息
      function findCompInfo(){
        customerListService.findCompInfoByStoreId().then(function (result) {
          if(result.status == 'OK'&&result.results.content.status=='OK'){
            ctrl.insuranceCompNames = [];
            var insuranceCompNames = result.results.content.result;
            for(var i=0;i<insuranceCompNames.length;i++){
              ctrl.insuranceCompNames.push(insuranceCompNames[i].insuranceCompName);
            }
          }else{

          }
        });
      };
      //按4s店ID查询车辆品牌车型信息
      function findCarInfo(){
        customerListService.findCarInfoByStoreId().then(function(res){
          $scope.carBrands =[];//品牌名称下拉框数据源
          if(res.status == 'OK'&&res.results.success==true){
            $scope.carBrandList = res.results.content.result;
            //给品牌数据源赋值(只是名称,而非一个对象)
            for(var i=0;i<$scope.carBrandList.length;i++){
              $scope.carBrands.push($scope.carBrandList[i].brandName);
            }
            $scope.carBrands.push('异系');
          }else{
            $scope.carBrands.push('异系');
          }
          //下面的方法的作用是将主页传过来的车型在潜客查询页面的放大镜中的车型条件自动填充
          if(ctrl.searchData) {
            xzVehicleModel();
          }
        })
      };
      ctrl.carModelshow = false;
      function xzVehicleModel(){
        if(ctrl.searchData.carBrand){
          if(ctrl.searchData.carBrand == "异系"){
            ctrl.carModelshow = true;
          }else {
            ctrl.carModelshow = false;
            $scope.carModelList =[];//车型名称下拉框数据源
            //给车型数据源设置值(只是名称,而非一个对象)
            for (var i = 0; i < $scope.carBrandList.length; i++) {
              if ($scope.carBrandList[i].brandName == ctrl.searchData.carBrand){
                var carModels = $scope.carBrandList[i].carModelList;
                for(var j = 0; j < carModels.length; j++){
                  $scope.carModelList.push(carModels[j].modelName);
                }
                break;
              }
            }
          }
        }else {
          ctrl.carModelshow = false;
        }
      }
      //查询持有人列表
      function findHolder(){
        customerListService.selectUserForHolderSearch().then(function(res){
          if(res.status == 'OK'&&res.results.content.status=='OK'){
            ctrl.holderAlls = res.results.content.result;
          }else{

          }
          ctrl.holders=[];
          ctrl.principals = [];
          for(var i=0;i<ctrl.holderAlls.length;i++){
            if(ctrl.holderAlls[i].roleId!=""&&ctrl.holderAlls[i].roleId!=null){
              ctrl.holders.push(ctrl.holderAlls[i]);
            }
            if(ctrl.holderAlls[i].roleId==2){
              ctrl.principals.push(ctrl.holderAlls[i]);
            }
          }
        });
      }
      //查询潜客
      if(ctrl.cxdata){
        ctrl.searchData = JSON.parse(ctrl.cxdata);
        if(ctrl.searchData.statusId){
          ctrl.statusId = ctrl.searchData.statusId;
        }
      }

      function findCustomerByCondition() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var renewalType = ctrl.searchData.renewalType;
        if(ctrl.searchData.insuranceCompLY){
          var insuranceCompLY = ctrl.searchData.insuranceCompLY;
        }
        var customerLevel = ctrl.searchData.customerLevel;
        var statusId = ctrl.searchData.statusId;
        var insuranceEndDateStart = $filter('date')(ctrl.searchData.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchData.insuranceEndDateEnd,'yyyy-MM-dd');;
        var contact = ctrl.searchData.contact;
        var contactWay = ctrl.searchData.contactWay;
        if(ctrl.searchData.carBrand){
          var carBrand = ctrl.searchData.carBrand;
        }
        if(ctrl.searchData.vehicleModel && ctrl.searchData.vehicleModel!=""){
          var vehicleModel = ctrl.searchData.vehicleModel;
        }

        var chassisNumber = ctrl.searchData.chassisNumber;
        var carLicenseNumber = ctrl.searchData.carLicenseNumber;
        var insured = ctrl.searchData.insured;
        var carOwner = ctrl.searchData.carOwner;
        var holderId = ctrl.searchData.holderId;
        var principalId = ctrl.searchData.principalId;
        var params = {"currentPage":ctrl.currentPage,"renewalType":renewalType,"insuranceCompLY":insuranceCompLY
          ,"customerLevel":customerLevel,"statusId":statusId,"insuranceEndDateStart":insuranceEndDateStart,"insuranceEndDateEnd":insuranceEndDateEnd
          ,"contact":contact,"contactWay":contactWay,"carBrand":carBrand,"vehicleModel":vehicleModel,"chassisNumber":chassisNumber,
          "chassisNumber":chassisNumber,"carLicenseNumber":carLicenseNumber,"insured":insured,"carOwner":carOwner,"holderId":holderId,"principalId":principalId};
        ctrl.cxdata = {"renewalType":renewalType,"insuranceCompLY":insuranceCompLY,"customerLevel":customerLevel,"statusId":statusId,
          "insuranceEndDateStart":insuranceEndDateStart,"insuranceEndDateEnd":insuranceEndDateEnd
          ,"contact":contact,"contactWay":contactWay,"carBrand":carBrand,"vehicleModel":vehicleModel,"chassisNumber":chassisNumber,
          "chassisNumber":chassisNumber,"carLicenseNumber":carLicenseNumber,"insured":insured,"carOwner":carOwner,"holderId":holderId,"principalId":principalId};
        ctrl.cxdata = JSON.stringify(ctrl.cxdata);
        if(ctrl.currentPage == null){
          return;
        }
        customerListService.findCustomerByConditionApp(params).then(function (result) {
          $scope.modal.hide();
          if (result.status == 'OK') {
            ctrl.customerListCx = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            if (ctrl.customerListCx.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListCx);
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

      $scope.doRefreshCxqk = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findCustomerByCondition();
        $state.go('searchList',{userId:ctrl.userId,userName:ctrl.userName,cxdata:ctrl.cxdata});
      }
      /**
       * 查询已回退潜客列表
       * param:userId；currentPage
       */
      function findByYiHuiTui() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var renewalType = ctrl.searchGz.renewalType;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contact = ctrl.searchGz.contact;
        var contactWay = ctrl.searchGz.contactWay;
        if(ctrl.user.role.roleId==7||ctrl.user.role.roleId==9){
          var params = {userId:ctrl.userId,currentPage:ctrl.currentPage,renewalType:renewalType,customerLevel:customerLevel,
            insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
            carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
          };
        }else {
          var params = {currentPage:ctrl.currentPage,renewalType:renewalType,customerLevel:customerLevel,
            insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
            carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
          };
        }

        ctrl.gzcxdata = {renewalType:renewalType,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
          carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
        };
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        if(ctrl.currentPage == null){
          return;
        }
        customerListService.findByYiHuiTui(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerList = result.results.content.list;
            ctrl.customerCount = result.results.content.policyCount;
            for(var i=0 ; i<ctrl.customerList.length;i++){
              ctrl.customerList[i].hideStatus = false;
            }
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
      //根据回退状态查询潜客列表（销售顾问销售顾问跟踪完成潜客）
      function findByReturnStatu(statu) {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var renewalType = ctrl.searchGz.renewalType;
        var customerLevel = ctrl.searchGz.customerLevel;
        var insuranceEndDateStart = $filter('date')(ctrl.searchGz.insuranceEndDateStart,'yyyy-MM-dd');
        var insuranceEndDateEnd = $filter('date')(ctrl.searchGz.insuranceEndDateEnd,'yyyy-MM-dd');
        var chassisNumber = ctrl.searchGz.chassisNumber;
        var carLicenseNumber = ctrl.searchGz.carLicenseNumber;
        var contact = ctrl.searchGz.contact;
        var contactWay = ctrl.searchGz.contactWay;
        var params = {userId:ctrl.userId,currentPage:ctrl.currentPage,returnStatu:statu,renewalType:renewalType,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
          carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
        };
        ctrl.gzcxdata = {returnStatu:statu,renewalType:renewalType,customerLevel:customerLevel,
          insuranceEndDateStart:insuranceEndDateStart,insuranceEndDateEnd:insuranceEndDateEnd,chassisNumber:chassisNumber,
          carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay
        };
        ctrl.gzcxdata = JSON.stringify(ctrl.gzcxdata);
        if(ctrl.userId == null || ctrl.currentPage == null){
          return;
        }
        customerListService.findByReturnStatu(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerListGzwc = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            for (var i = 0; i < ctrl.customerListGzwc.length; i++) {
              ctrl.customerListGzwc[i].checked = false;
            }
            if (ctrl.customerListGzwc.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListGzwc);
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

      $scope.doRefreshYHT = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        ctrl.findByYiHuiTui();
        $scope.hasmore = false;
      }
      $scope.doRefreshGzwc = function (statu) {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findByReturnStatu(statu);
      }
      //放大镜出现，并定位是哪个模块的放大镜
      $scope.fangdajing = function(num){
        $scope.searchYht.show();
        $scope.crlNum = num;
      }
      //根据上面的定位的模块定位查询方法
      $scope.crlchaxun = function(num){
        if(num==1){
          $scope.doRefreshYgz(1);
        }else if(num==3){
          $scope.doJTBRefresh();
        }else if(num==4){
          $scope.doRefreshYgz(2);
        }else if(num==5){
          $scope.doYTBRefresh();
        }else if(num==6){
          $scope.doRefreshGzwc(11);
        }else if(num==7){
          $scope.doRefreshYHT();
        }else if(num==8){
          $scope.doDSPRefresh();
        }
        $scope.searchYht.hide();
      }

      //唤醒未分配潜客列表
      function findWakeupCustomer() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {web:'app',startNum:ctrl.currentPage,returnStatu: 10};
        if(ctrl.currentPage == null){
          return;
        }
        customerListService.findActivateCustomer(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerListWake = result.results.content.result;
            ctrl.customerCount = result.results.content.policyCount;
            for (var i = 0; i < ctrl.customerListWake.length; i++) {
              ctrl.customerListWake[i].checked = false;
            }
            if (ctrl.customerListWake.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListWake);
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
      $scope.doRefreshWakeup = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findWakeupCustomer();
      }

      //查询战败线索列表
      function findDefeatedCustomer() {
        if(ctrl.isLock)return;
        ctrl.isLock=true;
        var params = {userId:ctrl.userId,currentPage:ctrl.currentPage};
        if(ctrl.currentPage == null){
          return;
        }
        customerListService.findDefeatedSourceByUserId(params).then(function (result) {
          if (result.status == 'OK') {
            ctrl.customerListDefeat = result.results.content.results;
            ctrl.customerCount = result.results.content.customerCount;
            if (ctrl.customerListDefeat.length == 0) {
              $scope.hasmore = true;
              return;
            }
            ctrl.currentPage++;
            $scope.items = $scope.items.concat(ctrl.customerListDefeat);
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
      $scope.doRefreshDefeat = function () {
        ctrl.currentPage = 1;
        $scope.items = [];
        $scope.hasmore = false;
        ctrl.findDefeatedCustomer();
      }


    }])


angular.module('starter')
  .controller('CustomerAddController',
    ['$scope','$state','$timeout','$filter','$ionicPopup','pubHelper','pubPopup','$ionicModal','$ionicLoading','$ionicHistory','$localStorage','$ionicViewSwitcher','$stateParams','customerAddService',
      function($scope,$state,$timeout,$filter,$ionicPopup,pubHelper,pubPopup,$ionicModal,$ionicLoading,$ionicHistory,$localStorage,$ionicViewSwitcher,$stateParams,customerAddService) {
    var ctrl = this;
    ctrl.goBack = goBack;
    ctrl.stateChange = stateChange;
    ctrl.customerId = $stateParams.customerId;
    ctrl.contact = $stateParams.contact;
    ctrl.userId = $stateParams.userId;
    ctrl.userName = $stateParams.userName;
    ctrl.contact = $stateParams.contact;
    ctrl.contactWay = $stateParams.contactWay;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.storeId = ctrl.user.store.storeId;
    ctrl.addNewCustomer = addNewCustomer;//生成潜客
    ctrl.cancelCust = cancelCust;//取消生成潜客
    // 回退
    function goBack(){
      $ionicHistory.goBack();
    }
    //路由跳转
    function stateChange(stateTo,params){
      $ionicViewSwitcher.nextDirection('forward');
      $state.go(stateTo,params);
    }
    ctrl.dateTrackOption = {
      title : '日期',
      buttonOk : '确定',
      buttonCancel : '取消'
    }

        //生成潜客
        ctrl.newqk = {};
        ctrl.newqk.contact = ctrl.contact;
        ctrl.newqk.contactWay = ctrl.contactWay;
        function addNewCustomer()  {
          var carLicenseNumber =ctrl.newqk.carLicenseNumber;
          var chassisNumber =ctrl.newqk.chassisNumber;
          var syxrqEnd =$filter('date')(ctrl.newqk.syxrqEnd,'yyyy-MM-dd');
          var jqxrqEnd =$filter('date')(ctrl.newqk.jqxrqEnd,'yyyy-MM-dd');
          var renewalType =ctrl.newqk.renewalType;
          var insured =ctrl.newqk.insured;
          var customerLevel =ctrl.newqk.customerLevel;
          var contact =ctrl.newqk.contact;
          var contactWay =ctrl.newqk.contactWay;
          var customerDescription =ctrl.newqk.customerDescription;
          var reg = /^[a-zA-Z0-9]{17}$/ ;//车架号
          if(!chassisNumber||chassisNumber==''){
            pubHelper.alert(false,"车架号不能为空");
            return;
          }
          if(!reg.test(chassisNumber.trim())){
            pubHelper.alert(false,"车架号错误，应为17位字母或数字组成");
            return;
          }
          if(!jqxrqEnd||jqxrqEnd==''){
            pubHelper.alert(false,"交强险日期结束不能为空");
            return;
          }
          if(!renewalType||renewalType==''){
            pubHelper.alert(false,"投保类型不能为空");
            return;
          }
          if(!insured||insured==''){
            pubHelper.alert(false,"被保险人不能为空");
            return;
          }
          if(!contact||contact==''){
            pubHelper.alert(false,"联系人不能为空");
            return;
          }
          if(!contactWay||contactWay==''){
            pubHelper.alert(false,"联系方式不能为空");
            return;
          }
          if(!(/^1\d{10}$/.test(contactWay))){
            pubHelper.alert(false,"联系方式填写有误");
            return;
          }
          var newqkDatas = {carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,syxrqEnd:syxrqEnd,jqxrqEnd:jqxrqEnd,
            renewalType:renewalType,insured:insured,customerLevel:customerLevel,contact:contact,contactWay:contactWay,
            customerDescription:customerDescription,fourSStoreId: ctrl.storeId};

          $ionicLoading.show();
          customerAddService.addCustomer(newqkDatas,1).then(function(res){
            $ionicLoading.hide();
            if(res.status == 'OK' && res.results.success==true){
              ctrl.newqk = {};
              pubHelper.alert(true,"生成潜客成功",0);
              ctrl.stateChange('defeatList',{userId:ctrl.userId,userName:ctrl.userName});
            }else{
              pubHelper.alert(false,res.results.message);
            }
          });
        };

        //战败潜客
        function cancelCust() {
          var confirmPopup = pubPopup.confirm({
            template: '是否放弃生成潜客？',
            okText:'是',
            cancelText:'否',
            scope: $scope,
          });
          confirmPopup.then(function(res) {
            if(res){
              ctrl.stateChange('defeatDetails',{userId:ctrl.userId,userName:ctrl.userName,customerId:ctrl.customerId});
            }
          });
        };
  }])


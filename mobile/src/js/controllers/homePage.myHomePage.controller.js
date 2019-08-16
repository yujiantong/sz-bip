angular.module('starter')

.controller('MyHomePageController', ['$scope','$state','$filter','$timeout','$ionicModal','$stateParams','$ionicHistory','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','myHomePageService','jPush',
  function($scope,$state,$filter,$timeout,$ionicModal,$stateParams,$ionicHistory,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,myHomePageService,jPush) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.ReportTab = ReportTab;
    ctrl.changeStore = changeStore;
    ctrl.ReportTabNO = $stateParams.ReportTabNO;
    ctrl.findHomePageCount = findHomePageCount;
    ctrl.storeListToggle = storeListToggle;
    findHomePageCount();
    ctrl.findCompInfo = findCompInfo;
    ctrl.findCompInfo();
    ctrl.findCarInfo = findCarInfo;
    ctrl.findCarInfo();
    ctrl.xzVehicleModel = xzVehicleModel;
    ctrl.findHolder = findHolder; //查询持有人
    ctrl.findHolder();
    ctrl.searchCustomer = searchCustomer;//查询潜客列表
    ctrl.diaData = {};
    // 获取人员信息
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.storeLogo = $localStorage.loginMsg.store.logo;
    ctrl.csModuleFlag = $localStorage.loginMsg.store.csModuleFlag; //客服模块状态
    var myDate = new Date();
    var myMonth = myDate.getMonth();
    ctrl.bspBar = {
      typeDate: ctrl.typeDate
    }
    var localLoginMsg = $localStorage.loginMsg;
    $ionicHistory.clearHistory();
    if(localLoginMsg){
      ctrl.storeSelection = localLoginMsg.store.storeName;
      ctrl.role = localLoginMsg.role;
      if(localLoginMsg.role.roleId==16||localLoginMsg.role.roleId==23){
        myHomePageService.findStore({}).then(function (result) {
          if (result.status == 'OK') {
            ctrl.storeAll = result.results.content.result;
          } else {

          }
        });
      }
    }
    //更改店
  function changeStore(store1){
    var loginUser = {}
    loginUser.password = $localStorage.loginMsg.password;
    loginUser.loginName = $localStorage.loginMsg.loginName;
      myHomePageService.changeStoreCookies(store1)
        .then(function (result) {
          if (result.status == 'OK') {
            ctrl.storeSelection = store1.storeName;
            $localStorage.loginMsg = result.content||{};
            $localStorage.loginMsg.password = loginUser.password;
            $localStorage.loginMsg.loginName = loginUser.loginName;
            //window.location.reload();
            ctrl.storeListShow = false;
            findHomePageCount();
          } else {
            pubHelper.alert(false,"切换失败");
          };
        });
    }
  //首页数据
  function findHomePageCount(){
    myHomePageService.findHomePageCount().then(function (result) {
      if (result.status == 'OK'&&result.results.content.status == 'OK') {
        ctrl.homeCount = result.results.content.results;
      } else {

      };
    });
    try {
      jPush.setCordovaBadge(0)
    } catch (e) {

    }
  }
  $scope.refreshHome = function () {
    ctrl.findHomePageCount();
    $scope.$broadcast('scroll.refreshComplete');
  }

  // 按钮显示
  function showButton(action){
    var actionFlag = pubHelper.hasAction(action);
    return actionFlag;
  }
 //跳转
  function stateChange(stateTo,params){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go(stateTo,params);
  }
  //报表tab切换
  if(ctrl.ReportTabNO==2){
    ctrl.dailyReport = false;
    ctrl.monthReport = true;
  }else {
    ctrl.dailyReport = true;
    ctrl.monthReport = false;
  }
  function ReportTab(tabname){
    if(tabname == 1){
      ctrl.dailyReport = true;
      ctrl.monthReport = false;
    }else if(tabname == 2){
      ctrl.dailyReport = false;
      ctrl.monthReport = true;
    };
  }

    ctrl.storeListShow = false;
    function storeListToggle(){
      ctrl.storeListShow = !ctrl.storeListShow;
    }
    //搜索框
    $ionicModal.fromTemplateUrl('templates/modal/modalIndex.html', {
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
    //查询持有人列表
    function findHolder(){
      myHomePageService.selectUserForHolderSearch().then(function(res){
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

    //根据4s店id查询保险公司信息
    function findCompInfo(){
      myHomePageService.findCompInfoByStoreId().then(function (result) {
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
      myHomePageService.findCarInfoByStoreId().then(function(res){
        $scope.carBrands =[];
        if(res.status == 'OK'&&res.results.success==true){
          $scope.carBrandList = res.results.content.result;
          for(var i=0;i<$scope.carBrandList.length;i++){
            $scope.carBrands.push($scope.carBrandList[i].brandName);
          }
          $scope.carBrands.push('异系');
        }else{
          $scope.carBrands.push('异系');
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
          $scope.carModelList =[];
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
    //查询潜客
    ctrl.searchData = {};
    function searchCustomer() {
      var renewalType = ctrl.searchData.renewalType;
      if(ctrl.searchData.insuranceCompLY){
        var insuranceCompLY = ctrl.searchData.insuranceCompLY;
      }
      var customerLevel = ctrl.searchData.customerLevel;
      var statusId = ctrl.searchData.statusId;
      var insuranceEndDateStart = $filter('date')(ctrl.searchData.insuranceEndDateStart,'yyyy-MM-dd');
      var insuranceEndDateEnd = $filter('date')(ctrl.searchData.insuranceEndDateEnd,'yyyy-MM-dd');
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
      var cxdata = {"renewalType":renewalType,"insuranceCompLY":insuranceCompLY,"customerLevel":customerLevel,"statusId":statusId,
        "insuranceEndDateStart":insuranceEndDateStart,"insuranceEndDateEnd":insuranceEndDateEnd,"contact":contact,
        "contactWay":contactWay,"carBrand":carBrand,"vehicleModel":vehicleModel,"chassisNumber":chassisNumber,
        "chassisNumber":chassisNumber,"carLicenseNumber":carLicenseNumber,"insured":insured,"carOwner":carOwner,
        "holderId":holderId,"principalId":principalId};
      $state.go('searchList',{userId:ctrl.userId,userName:ctrl.userName,cxdata:JSON.stringify(cxdata)});
      $scope.modal.hide();
    };

}])


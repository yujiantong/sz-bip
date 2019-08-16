angular.module('starter')
.controller('xbzyHomePageController',  ['$scope','$rootScope','$state','$filter','$timeout','$ionicModal','pubHelper','pubPopup','$ionicLoading','$ionicHistory','$localStorage','$ionicViewSwitcher','server','xbzyHomeService','$stateParams','jPush',
  function($scope,$rootScope,$state,$filter,$timeout,$ionicModal,pubHelper,pubPopup,$ionicLoading,$ionicHistory,$localStorage,$ionicViewSwitcher,server,xbzyHomeService,$stateParams,jPush) {
    var ctrl = this;
    ctrl.stateChange = stateChange;
    ctrl.user = $localStorage.loginMsg;// 获取人员信息
    ctrl.storeLogo = $localStorage.loginMsg.store.logo;
    ctrl.userId = ctrl.user.userId;
    ctrl.userName = ctrl.user.userName;
    ctrl.today=$filter('date')(new Date(),'yyyy-MM-dd');
    ctrl.findHomePageCount = findHomePageCount;
    ctrl.findHomePageCount();
    //查询潜客列表
    ctrl.searchCustomer = searchCustomer;
    ctrl.findCompInfo = findCompInfo;
    ctrl.findCompInfo();
    ctrl.findCarInfo = findCarInfo;
    ctrl.findCarInfo();
    ctrl.xzVehicleModel = xzVehicleModel;
    ctrl.goOnLineService = goOnLineService;
    //判断是否能进入在线客服
    function goOnLineService(stateTo){
      /*if(ctrl.localSession){
       /!*if(ctrl.localSession.isAndroid&&(ctrl.appVersion=='0.0.0'||ctrl.appVersion=='')){
       pubHelper.alert(false,'要使用在线客服功能版本必须是1.0.19以上版本，请先升级版本')
       return;
       }
       if(ctrl.localSession.isAndroid&&ctrl.appVersion<'1.0.19'){
       pubHelper.alert(false,'当前软件版本'+ctrl.appVersion+';要使用在线客服功能版本必须是1.0.19以上' +
       '版本，请先升级版本');
       return;
       }*!/
       /!*if(ctrl.localSession.isIOS||ctrl.localSession.isIPad){
       pubHelper.alert(false,'此功能正在开发')
       return;
       }*!/
       stateChange(stateTo);

       }else{
       stateChange(stateTo);
       }*/
      stateChange(stateTo);
    }

    if($localStorage.loginMsg.role.roleId==2){
      $rootScope.socket = io.connect(server.nodeServer);
      $rootScope.socket.on('connect', function(){
        $rootScope.socket.emit('login', {storeId: $localStorage.loginMsg.store.storeId,
          roleId:$localStorage.loginMsg.role.roleId,userId:$localStorage.loginMsg.userId });
      });

      $rootScope.socket.on('message', function (data) {
        $scope.data = data.data;
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: '' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
            //intent: 'INTENT' // send SMS inside a default SMS app
          }
        };
        try {
          sms.send($scope.data.contactWay, $scope.data.content, options
              ,function () {
                $rootScope.socket.emit('response', {success: true});
              },function (error) {
                $rootScope.socket.emit('response', {success: false});
              });
        } catch (e){
          $rootScope.socket.emit('response', {success: false});
        }

      });
    }
  //路由跳转
  function stateChange(stateTo,params){
    $ionicViewSwitcher.nextDirection('forward');
    $state.go(stateTo,params);
  }
    //首页数据
    function findHomePageCount(){
      xbzyHomeService.findHomePageCount().then(function (result) {
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
    };

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

    //根据4s店id查询保险公司信息
    function findCompInfo(){
      xbzyHomeService.findCompInfoByStoreId().then(function (result) {
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
      xbzyHomeService.findCarInfoByStoreId().then(function(res){
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
      var cxdata = {"renewalType":renewalType,"insuranceCompLY":insuranceCompLY
        ,"customerLevel":customerLevel,"statusId":statusId,"insuranceEndDateStart":insuranceEndDateStart,"insuranceEndDateEnd":insuranceEndDateEnd
        ,"contact":contact,"contactWay":contactWay,"carBrand":carBrand,"vehicleModel":vehicleModel,"chassisNumber":chassisNumber,
        "chassisNumber":chassisNumber,"carLicenseNumber":carLicenseNumber,"insured":insured,"carOwner":carOwner};
      $state.go('searchList',{userId:ctrl.userId,userName:ctrl.userName,cxdata:JSON.stringify(cxdata)});
      $scope.modal.hide();
    };

}])


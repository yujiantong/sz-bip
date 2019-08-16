angular.module('starter')
  .controller('ReportController',
    ['$scope','$state','$timeout','$ionicHistory','$filter','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','reportService',
    function($scope,$state,$timeout,$ionicHistory,$filter,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,reportService) {
      var ctrl = this;
      ctrl.stateChange = stateChange;
      ctrl.goBack = goBack;
      ctrl.user = $localStorage.loginMsg;// 获取人员信息
      ctrl.storeId = ctrl.user.store.storeId;
      ctrl.appInsurancebillCount = appInsurancebillCount;
      ctrl.findCountMonthKpiInsurComp = findCountMonthKpiInsurComp;
      ctrl.SearchReportTime = SearchReportTime;
      ctrl.maxDate = new Date(new Date().getTime()+86400000);
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
        buttonCancel : '取消',
        onlyValid:{
          between:{
            initial:new Date(2015,01,01),
            final:ctrl.maxDate,
          }
        }
      }
      ctrl.report = {};
      ctrl.report.searchDate = $filter('date')(new Date(),'yyyy-MM-dd');
      //日报-分保险公司
      function appInsurancebillCount(){
        var time =  $filter('date')(ctrl.report.searchDate,'yyyy-MM-dd');
        var storeId = ctrl.storeId;
        var param = {time:time,storeId:storeId};
        reportService.appInsurancebillCount(param).then(function(result){
          if (result.status == 'OK') {
            ctrl.insuranceNum = result.results.content.results;
          }else{

          };
        });
      }
      //获取报表的查询日期列表
      function SearchReportTime(){
        var tableName = 'bf_bip_report_month_kpi_xbzy';
        var condition = {tableName:tableName,storeId:ctrl.storeId};
        reportService.findReportSearchTime(condition).then(function(result){
          if (result.status == 'OK') {
            ctrl.selectTimes = result.results.content.results;
          }else{
            pubHelper.alert(false,result.results.message);
          }
        })
      };
      ctrl.SearchReportTime();
      //初始时间
      ctrl.report.mouthDate = $filter('date')(new Date(),'yyyy-MM');
      //月报-分保险公司
      function findCountMonthKpiInsurComp(){
        var time = ctrl.report.mouthDate;
        var storeId = ctrl.storeId;
        var param = {time:time,storeId:storeId};
        reportService.findCountMonthKpiInsurComp(param).then(function(result){
          if (result.status == 'OK') {
            ctrl.MonthKpiInsurComp = result.results.content.results;
          }else{

          };
        });
      }

  }])


'use strict';
angular.module('myApp')
    .controller('pushRepairSeM_Controller',['$rootScope','$scope','$filter','pushRepairSeMService','$state',
        function($rootScope,$scope,$filter,pushRepairSeMService,$state) {
            $scope.customerAll = [];
            $scope.startNum = 1;//初始化页数
            $scope.customerIndex= 1;//初始化下标
            $scope.policyCount = 0;
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.condition = {}; //查询条件
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];

            //根据4s店id查询保险公司信息
            pushRepairSeMService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //初始化页面查询数据
            $scope.pushRepairPage = {
                infiniteScrollRowsFromEnd: 5,
                infiniteScrollDown: true,
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { field: 'reportNumber',cellTooltip: true, enableColumnMenu: false,minWidth:100,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>报案号</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.addpushBox();"></span></div>'},
                    { name: '保险公司', field: 'insuranceComp',enableColumnMenu: false},
                    { name: '定损金额', field: 'maintenanceRecord.certainCost', enableColumnMenu: false},
                    { name: '维修金额', field: 'maintenanceRecord.maintainCost',enableColumnMenu: false},
                    { name: '报案人', field: 'reporter', enableColumnMenu: false,cellTooltip: true},
                    { name: '报案电话', field: 'reporterPhone',enableColumnMenu: false,cellTooltip: true},
                    { name: '推送时间', field: 'pushTime',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false},
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false},
                    { name: '出险地点', field: 'accidentPlace', enableColumnMenu: false},
                    { name: '维修开始时间', field: 'maintenanceRecord.maintenanceTimeStart',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false},
                    { name: '维修结束时间', field: 'maintenanceRecord.maintenanceTimeEnd',cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false},
                    { name: '是否回款', field: 'sfhk',cellFilter: 'mapSF', enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.pushDetails(row.entity.reportNumber)" class="btn btn-default btn-sm genzcl">查看明细</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_tsx) {
                    gridApi_tsx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_tsx = gridApi_tsx;
                }
            };
            //推送修记录查询
            $scope.tsxSearch = {};
            $scope.findByConditionTSX = function(){
                var reportNumber = $scope.tsxSearch.reportNumber;
                var carLicenseNumber = $scope.tsxSearch.carLicenseNumber;
                var insuranceComp = $scope.tsxSearch.insuranceComp;
                var sfwx = $scope.tsxSearch.sfwx;
                var bdcb = $scope.tsxSearch.bdcb;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        reportNumber: reportNumber, carLicenseNumber: carLicenseNumber,
                        insuranceComp: insuranceComp, sfwx: sfwx, bdcb: bdcb
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                pushRepairSeMService.findByConditionTSX($scope.condition).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.customerAll = result.results.content.results;
                        $scope.policyCount = result.results.content.policyCount;
                        $scope.getPolicyPage();
                    } else {

                    };
                });
            };
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-105
                }
            },100);
            //重置数据，包括页数，表格内容
            $scope.resetPageData = function(){
                if($scope.searchMoreStatus ==true){
                    $scope.startNum = 1; //开始页
                    $scope.condition = {};
                }else{
                    $scope.startNum = $scope.startNum + 1;
                }
                if($scope.startNum==1){
                    $scope.customerIndex= 1;
                    $scope.pushRepairPage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.customerAll.length;i++){
                    $scope.customerAll[i].index = $scope.customerIndex;
                    $scope.pushRepairPage.data.push($scope.customerAll[i])
                    $scope.customerIndex = $scope.customerIndex+1;
                }
                $scope.loadingPage();
            }

            //加载更多按钮
            $scope.searchMore = function(){
                $scope.searchMoreStatus =false;
                $scope.findByTraceStatu('gz',1);
                $scope.searchMoreStatus =true;
                $scope.loadStatus=1;//正在加载中。。。
            }

            //判定数据是否加载完毕
            $scope.loadingPage = function(){
                if($scope.pushRepairPage.data.length>=$scope.policyCount||$scope.customerAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApi_tsx.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApi_tsx.infiniteScroll.dataLoaded(false, true)
                }
            }
            //保单明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            };
            //清空表单
            $scope.clearTSX = function(){
                $scope.tsxSearch = {};
            };
            //推送修明细
            $scope.addpushInfo = {};
            $scope.addpushBox=function(){
                $("#pushAdd").show();
            }
            //车架号查询潜客信息
            $scope.getInfoByChassisNumber = function(){
                var chassisNumber = $scope.addpushInfo.chassisNumber;
                if(chassisNumber==null||chassisNumber==''){
                    return;
                }
                pushRepairSeMService.getInfoByChassisNumber(chassisNumber).then(function(result){
                    if (result.success == true) {
                        var custInfo = result.content.result.custInfo;
                    };
                    $("#updataPolicy").show();
                    $scope.updataPolicy= function(){
                        $("#updataPolicy").hide();
                        if(custInfo!=null) {
                            $scope.addpushInfo.carLicenseNumber = custInfo.carLicenseNumber;
                            $scope.addpushInfo.engineNumber = custInfo.engineNumber;
                            var carBrand = '';//品牌
                            var vehicleModel = '';//车辆型号
                            var factoryLicenseType = "";
                            if($scope.addpushInfo.factoryLicenseType=="null"){
                                factoryLicenseType = "";
                            }else{
                                factoryLicenseType = $scope.addpushInfo.factoryLicenseType||'';
                            }
                            $scope.addpushInfo.MoldName =factoryLicenseType;
                        }
                    }

                });
            }
            // 新增推送记录
            $scope.addpushDetails=function(){
                var carLicenseNumber =$scope.addpushInfo.carLicenseNumber||" ";
                var chassisNumber =$scope.addpushInfo.chassisNumber;
                var engineNumber =$scope.addpushInfo.engineNumber;
                var MoldName =$scope.addpushInfo.MoldName;
                var reportNumber =$scope.addpushInfo.reportNumber;
                var agencyCode =$scope.addpushInfo.agencyCode;
                var agencyName =$scope.addpushInfo.agencyName;
                var insuranceComp =$scope.addpushInfo.insuranceComp;
                var clerk =$scope.addpushInfo.clerk;
                var driveArea =$scope.addpushInfo.driveArea;
                var reportTime =$scope.addpushInfo.reportTime;
                var accidentTime =$scope.addpushInfo.accidentTime;
                var accidentPlace =$scope.addpushInfo.accidentPlace;
                var groupType =$scope.addpushInfo.groupType;
                var customerFlag =$scope.addpushInfo.customerFlag;
                var insuranceDateStart =$scope.addpushInfo.insuranceDateStart;
                var insuranceDateEnd =$scope.addpushInfo.insuranceDateEnd;
                var insuranceNumber =$scope.addpushInfo.insuranceNumber;
                var channelSource =$scope.addpushInfo.channelSource;
                var reporterPhone =$scope.addpushInfo.reporterPhone;
                var reporter =$scope.addpushInfo.reporter;
                var sslx =$scope.addpushInfo.sslx;
                var sglx =$scope.addpushInfo.sglx;
                var csxbe =$scope.addpushInfo.csxbe;
                var syszxbe =$scope.addpushInfo.syszxbe;
                var bajsy =$scope.addpushInfo.bajsy;
                var sfdhck =$scope.addpushInfo.sfdhck;
                var ajzt =$scope.addpushInfo.ajzt;
                var cxjsy =$scope.addpushInfo.cxjsy;
                var sfxcba =$scope.addpushInfo.sfxcba;
                var sfmxc =$scope.addpushInfo.sfmxc;
                var baclyj =$scope.addpushInfo.baclyj;
                var ajtd =$scope.addpushInfo.ajtd;
                var cslaje =$scope.addpushInfo.cslaje;
                var rslaje =$scope.addpushInfo.rslaje;
                var wslaje =$scope.addpushInfo.wslaje;
                var zrxs =$scope.addpushInfo.zrxs;
                var laje =$scope.addpushInfo.laje;
                var zalsTimeStart =$scope.addpushInfo.zalsTimeStart;
                var zalsTimeEnd =$scope.addpushInfo.zalsTimeEnd;
                var sczfcgTime =$scope.addpushInfo.sczfcgTime;
                var jasj =$scope.addpushInfo.jasj;
                var jaje =$scope.addpushInfo.jaje;
                var scckTimeStart =$scope.addpushInfo.scckTimeStart;
                var mcckTimeEnd =$scope.addpushInfo.mcckTimeEnd;
                var mczfcgTime =$scope.addpushInfo.mczfcgTime;
                var pfcs =$scope.addpushInfo.pfcs;
                var wjzt =$scope.addpushInfo.wjzt;
                var csjaje =$scope.addpushInfo.csjaje;
                var rsjaje =$scope.addpushInfo.rsjaje;
                var wsjaje =$scope.addpushInfo.wsjaje;
                var wjje =$scope.addpushInfo.wjje;
                var zaje =$scope.addpushInfo.zaje;
                var dachsj =$scope.addpushInfo.dachsj;
                var baly =$scope.addpushInfo.baly;
                var pfjl =$scope.addpushInfo.pfjl;
                var pushTime =$scope.addpushInfo.pushTime;
                var sfhk =$scope.addpushInfo.sfhk;

                var reg = /^[a-zA-Z0-9]{17}$/ ;//车架号
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                }
                if(!reg.test(chassisNumber)){
                    $scope.angularTip("车架号错误，应为17位字母或数字组成",5000);
                    return;
                }
                if(!reportNumber||reportNumber==''){
                    $scope.angularTip("报案号不能为空",5000);
                    return;
                }
                if(!insuranceNumber||insuranceNumber==''){
                    $scope.angularTip("保单号不能为空",5000);
                    return;
                }
                if(!insuranceComp||insuranceComp==''){
                    $scope.angularTip("保险公司不能为空",5000);
                    return;
                }
                if(!reporter||reporter==''){
                    $scope.angularTip("报案人不能为空",5000);
                    return;
                }
                if(!reporterPhone||reporterPhone==''){
                    $scope.angularTip("报案电话不能为空",5000);
                    return;
                }
                if(!accidentPlace||accidentPlace==''){
                    $scope.angularTip("出险地点不能为空",5000);
                    return;
                }
                if(!accidentTime||accidentTime==''){
                    $scope.angularTip("出险时间不能为空",5000);
                    return;
                }
                var addpushDatas = {
                    carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber, engineNumber:engineNumber, MoldName:MoldName,
                    reportNumber:reportNumber, agencyCode:agencyCode, agencyName:agencyName, clerk:clerk, driveArea:driveArea,
                    reportTime:reportTime, accidentTime:accidentTime, accidentPlace:accidentPlace, groupType:groupType,
                    customerFlag:customerFlag, insuranceDateStart:insuranceDateStart, insuranceDateEnd:insuranceDateEnd,
                    insuranceNumber:insuranceNumber, channelSource:channelSource, reporterPhone:reporterPhone, reporter:reporter,
                    sslx:sslx,sglx:sglx,csxbe:csxbe, syszxbe:syszxbe, bajsy:bajsy, sfdhck:sfdhck, ajzt:ajzt, cxjsy:cxjsy,
                    sfxcba:sfxcba, sfmxc:sfmxc, baclyj:baclyj, ajtd:ajtd, cslaje:cslaje, rslaje:rslaje, wslaje:wslaje, zrxs:zrxs,
                    laje:laje, zalsTimeStart:zalsTimeStart, zalsTimeEnd:zalsTimeEnd, sczfcgTime:sczfcgTime, jasj:jasj, jaje:jaje,
                    scckTimeStart:scckTimeStart, mcckTimeEnd:mcckTimeEnd, mczfcgTime:mczfcgTime, pfcs:pfcs, wjzt:wjzt,
                    csjaje:csjaje, rsjaje:rsjaje, wsjaje:wsjaje, wjje:wjje, zaje:zaje, dachsj:dachsj, baly:baly, pfjl:pfjl,
                    pushTime:pushTime, sfhk:sfhk,insuranceComp:insuranceComp
                }
                $("#msgwindow").show();
                pushRepairSeMService.addPushMaintenance(addpushDatas).then(function(result){
                    $("#msgwindow").hide();
                    if(result.status == 'OK'&&result.results.success==true){
                        $("#pushAdd").hide();
                        $scope.angularTip("新增推送记录成功",5000);
                        $scope.addpushInfo = {};
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });

            }
            //关闭新增推送记录，并清除数据
            $scope.cleanPushDetails = function(){
                $("#pushAdd").hide();
                $scope.addpushInfo = {};
            };

            //推送修明细
            $scope.pushInfo = {};
            $scope.pushInfoQK = {};
            $scope.pushDetails=function(reportNumber){
                $scope.reportNumber = reportNumber;
                $("#msgwindow").show();
                pushRepairSeMService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $("#pushDetail").show();
                        $scope.pushInfo = result.results.content.results;
                        $scope.pushInfoQK = result.results.content.rc;
                        if($scope.pushInfoQK!=null){
                            $scope.pushInfoQK.registrationDate = $filter('date')($scope.pushInfoQK.registrationDate, 'yyyy-MM-dd');
                            $scope.pushInfoQK.carAnnualCheckUpDate = $filter('date')($scope.pushInfoQK.carAnnualCheckUpDate, 'yyyy-MM-dd');
                        }
                        $scope.pushInfo.reportTime = $filter('date')($scope.pushInfo.reportTime, 'yyyy-MM-dd');
                        $scope.pushInfo.accidentTime = $filter('date')($scope.pushInfo.accidentTime, 'yyyy-MM-dd');
                        $scope.pushInfo.insuranceDateStart = $filter('date')($scope.pushInfo.insuranceDateStart, 'yyyy-MM-dd');
                        $scope.pushInfo.insuranceDateEnd = $filter('date')($scope.pushInfo.insuranceDateEnd, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.zalsTimeStart = $filter('date')($scope.pushInfo.pushMaintenanceChild.zalsTimeStart, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.zalsTimeEnd = $filter('date')($scope.pushInfo.pushMaintenanceChild.zalsTimeEnd, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.sczfcgTime = $filter('date')($scope.pushInfo.pushMaintenanceChild.sczfcgTime, 'yyyy-MM-dd');
                        $scope.pushInfo.jasj = $filter('date')($scope.pushInfo.jasj, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.scckTimeStart = $filter('date')($scope.pushInfo.pushMaintenanceChild.scckTimeStart, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.mcckTimeEnd = $filter('date')($scope.pushInfo.pushMaintenanceChild.mcckTimeEnd, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.mczfcgTime = $filter('date')($scope.pushInfo.pushMaintenanceChild.mczfcgTime, 'yyyy-MM-dd');
                        $scope.pushInfo.pushMaintenanceChild.dachsj = $filter('date')($scope.pushInfo.pushMaintenanceChild.dachsj, 'yyyy-MM-dd');
                        $scope.pushInfo.pushTime = $filter('date')($scope.pushInfo.pushTime, 'yyyy-MM-dd');
                    } else {

                    };
                });
            }

        }
    ]);

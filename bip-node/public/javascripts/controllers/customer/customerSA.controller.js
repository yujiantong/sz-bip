'use strict';
angular.module('myApp')
    .controller('customerSA_Controller',['$rootScope','$scope','$filter','customerSAService','$timeout','$interval','$state','checkService',
        function($rootScope,$scope,$filter,customerSAService,$timeout,$interval,$state,checkService){
            //服务顾问
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            $scope.dayNumber = $rootScope.user.dayNumber; //首次提醒天数
            $scope.lockLevel = $rootScope.user.store.lockLevel;//是否锁死潜客级别
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            $scope.pageType = 'gz'; //页面状态，用于判断页面的类型
            $scope.customerAll = [];
            $scope.customerAllSearch = [];
            $scope.confirmData = {};
            $scope.startNum = 1;//初始化页数
            $scope.showAll = false;//是否全部显示
            $scope.customerIndex= 1;//初始化下标
            $scope.customerNoReceivedIndex = 1;
            $scope.customerSearchIndex= 1;//初始化下标
            $scope.filingUserAllIndex = 1;//建档人下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            $scope.qkSearch = {}; //潜客条件查询
            $scope.search = {}; //多条件查询
            $scope.newTrace = {}; //新跟踪记录
            $scope.newqk = {}; //新增潜客
            $scope.customerId = 0;
            $scope.condition = {}; //查询条件
            $scope.conditionSearch = {};  //潜客查询里的条件
            $scope.cityCode = $rootScope.user.store.cityCode;//4s店城市码
            var short=0;//全局排序（按某字段排序）
            var shortmain=0;//全局排序（1：升序2：降序）
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month=myDate.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            $scope.startTime = year+"-"+month+"-01";//初始化为今月1号
            $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd'); //初始化为今天日期

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                }
                $scope.gridSearchbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-135
                }
                $scope.gridbox_Received = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                };
                $scope.gridboxTj = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-45
                }
            },100);

            //接收父级传过的参数
            $scope.$on('pageStatus', function(e, pageTypeStatus) {
                if(pageTypeStatus.pageTypeStatus == 'shtj'){
                    $scope.showAll = false;
                }else {
                    $scope.showAll = true;
                };
                $scope.pageTypeStatus = pageTypeStatus;
                $scope.pageStatus = pageTypeStatus.pageStatus||0;
                $scope.pageType = pageTypeStatus.pageTypeStatus||'qkcx';
                var id_key = '#'+pageTypeStatus.pageTypeStatus + pageTypeStatus.pageStatus;
                $("#myTab").children("li").removeClass("active");
                $("#myTabContent").children(".tab-pane").removeClass("in active");
                $(id_key).addClass("active");
                if($scope.pageType=="js"){
                    $("#noReceived").addClass("in active");
                }else if($scope.pageType=="qkcx"){
                    $("#chaxun").addClass("in active");
                    $scope.rightTitleTimeToolHide();
                }else{
                    $("#yaoyue").addClass("in active");
                }
                $scope.getShowAll();

            });
            /*个人通知*/
            $scope.$on('geRenXingXi', function(e, customer) {
                $scope.pageTypeOld = $scope.pageType;
                $scope.pageType = 'grxx';
                $scope.findByCustomerId(customer);
            });
            $scope.$on('pageTypeOld', function(e,pageTypeOld) {
                $scope.pageType = $scope.pageTypeOld;
            });
            $scope.$on('clickFlag', function(e,clickFlag) {
                $scope.clickFlag = clickFlag;
            });
            $scope.changeClickFlag = function(){
                $scope.clickFlag = 1;
            }
            //下拉列表数据初始化
            $scope.coverTypes = [{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            $scope.loan = [{id:1,vlaue:'是'},{id:2,vlaue:'否'}];
            $scope.privilegePros = ['现金','套餐','现金+套餐','其他'];
            $scope.carUsedTypes = [{id:1,vlaue:'家庭自用车'},{id:2,vlaue:'党政机关、事业团体'},{id:3,vlaue:'非营业企业客车'}];
            $scope.ownerIdCardTypes = [{id:1,vlaue:'身份证'},{id:2,vlaue:'组织机构代码证'}];
            $scope.customerLevels = ['A','B','C','D'];
            $scope.customerLevelsB = ['A','B','C'];
            $scope.customerLevelsC = ['A','B'];
            $scope.customerLevelsD = ['A'];
            $scope.customerLevelsSearch = ['A','B','C','D'];
            $scope.lostInsurDays = [
                {range : "0—7", value : 1},
                {range : "8—30", value : 2},
                {range : "31—60", value : 3},
                {range : "61—90", value : 4},
                {range : "90+", value : 5}
            ]; /*将脱保天数范围查询*/

            //按4s店ID查询车辆品牌车型信息
            customerSAService.findCarInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.success==true){
                    $scope.carBrands = res.results.content.result||[];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                }else{
                    $scope.carBrands = [];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                }
            });

            //根据4s店id查询保险公司信息
            customerSAService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            customerSAService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });
            //自定义表格行样式
            var start = new Date();
            var sec = $interval(function () {
                var wait = parseInt(((new Date()) - start) / 1000, 10);
            }, 1000);
            function rowTemplate() {
                return $timeout(function() {
                    $interval.cancel(sec);
                    return '<div>' +
                        '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader, \'trackbg\': grid.appScope.rowFormatter( row )}"  ui-grid-cell></div>' +
                        '</div>';
                }, 1000);
            }

            $scope.rowFormatter = function( row ) {
                return  row.entity.gzCount == '0' && $scope.pageType == 'gz' && $scope.pageStatus == 1;
            };

            //初始化页面查询数据
            $scope.customerAllPage = {
                rowTemplate: rowTemplate(),
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_statu(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_statu" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_statu" class=""></span></div>'},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                            '<div role="button" ng-click="grid.appScope.qjsort_statu(6)" class="ui-grid-cell-contents fl" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                            '&nbsp;&nbsp;&nbsp;<span id="crldjxzqk" class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_statu" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_statu" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_statu" class=""></span></div>'},
                    { name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                    '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                    '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                    '<span class="glyphicon glyphicon-exclamation-sign white" ng-if="row.entity.showNum==0"></span>'+
                    '<span>{{row.entity.bhInsuranceEndDate}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(10)">更新日期&nbsp;&nbsp;&nbsp;<span id="bhInsuranceEndDate_statu" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_statu" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_statu" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_statu" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_statu" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_statu" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_qk) {
                    gridApi_qk.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_qk = gridApi_qk;
                }
            };


            $scope.customerAllSearchPage = {
                infiniteScrollRowsFromEnd: 5,
                infiniteScrollDown: false,
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk" class=""></span></div>'},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                            '<div role="button" ng-click="grid.appScope.qjsort(6)" class="ui-grid-cell-contents fl" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                            '&nbsp;&nbsp;&nbsp;<span id="crldjxzqk" class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompLY', width:70,enableColumnMenu: false},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd" class=""></span></div>'},
                    { name: '最低折扣', field: 'zdZheKou', width:60,enableColumnMenu: false},
                    { name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                    '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                    '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                    '<span class="glyphicon glyphicon-exclamation-sign white" ng-if="row.entity.showNum==0"></span>'+
                    '<span>{{row.entity.bhInsuranceEndDate}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(10)">更新日期&nbsp;&nbsp;&nbsp;<span id="bhInsuranceEndDate" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_qkcx) {
                    gridApi_qkcx.infiniteScroll.dataLoaded(false, false);
                    gridApi_qkcx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_qkcx = gridApi_qkcx;
                }
            };

            //售后统计查询
            $scope.serviceStatisticsAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',enableColumnMenu: false,cellTooltip: true},
                    { name: '回退', field: 'returnCount', enableColumnMenu: false},
                    { name: '出单', field: 'billCount',enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.findSAServiceStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $scope.pageType = pageType;
                $scope.serviceStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerSAService.findSAServiceStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.serviceStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.serviceStatisticsAll.length;i++){
                            $scope.serviceStatisticsAll[i].index = i+1;
                            $scope.serviceStatisticsAllPage.data.push($scope.serviceStatisticsAll[i])
                        }
                    }
                });
            };

            /* 未接收*/
            $scope.customerNoReceived = [];
            $scope.customerNoReceivedPage = {
                infiniteScrollRowsFromEnd: 5,
                infiniteScrollDown: true,
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                multiSelect:true,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_js(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_js" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_js" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(6)">车架号&nbsp;&nbsp;&nbsp;<span id="clerk_js" class=""></span></div>'},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                            '<div role="button" ng-click="grid.appScope.qjsort_js(6)" class="ui-grid-cell-contents fl" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                            '&nbsp;&nbsp;&nbsp;<span id="crldjxzqk" class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_js" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_js" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_js" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_js" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_js" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_js" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_js" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_js" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_js" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_js(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_js" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(NoReceGridApi) {
                    NoReceGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.NoReceGridApi = NoReceGridApi;
                }
            };

            //建档人查询
            $scope.filingUserAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:150,headerCellTemplate: '' +
                            '<div role="button" ng-click="grid.appScope.qjsort_jdr(6)" class="ui-grid-cell-contents fl" style="width: 110px;"><span>车架号</span></div><div class="fr">' +
                            '<span class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_jdr" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_jdr" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_jdr" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_jdr" class=""></span></div>',cellTemplate: '<div role="button">' +
                            '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '建档日期', field: 'createTime',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(20)">建档日期&nbsp;&nbsp;&nbsp;<span id="createTime_jdr" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_jdr" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_jdr(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_jdr" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                            '<div class="rowButtons">'+
                            '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">查看信息</button>'+
                            '</div></div>'},
                ],
                onRegisterApi : function(filingUserGridApi) {
                    filingUserGridApi.infiniteScroll.dataLoaded(false, false);
                    filingUserGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.filingUserGridApi = filingUserGridApi;
                }
            };


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
                    $scope.customerNoReceivedIndex = 1;
                    $scope.filingUserAllIndex = 1;
                    $scope.customerAllPage.data = [];
                    $scope.customerNoReceivedPage.data = [];
                    $scope.filingUserAllPage.data = [];
                }
            };
            //更新日期栏的增删
            $scope.removeColumns = function() {
                $scope.customerAllPage.columnDefs.splice(7, 1);
            }
            $scope.addColumns = function() {
                $scope.customerAllPage.columnDefs.splice(7, 0,{ name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                '<span>{{row.entity.bhInsuranceEndDate}}</span></div>'});
            }

            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                if($scope.pageType == 'qkcx'){
                    for(var i=0;i<$scope.customerAllSearch.length;i++){
                        $scope.customerAllSearch[i].index = $scope.customerSearchIndex;
                        $scope.customerAllSearchPage.data.push($scope.customerAllSearch[i])
                        $scope.customerSearchIndex = $scope.customerSearchIndex+1;
                    };
                }else if($scope.pageType == 'js'){
                    for(var i=0;i<$scope.customerNoReceived.length;i++){
                        $scope.customerNoReceived[i].index = $scope.customerNoReceivedIndex;
                        $scope.customerNoReceivedPage.data.push($scope.customerNoReceived[i]);
                        $scope.customerNoReceivedIndex = $scope.customerNoReceivedIndex+1;
                    }
                }else if($scope.pageType == 'jiandang'){
                    for(var i=0;i<$scope.filingUserAll.length;i++) {
                        $scope.filingUserAll[i].index = $scope.filingUserAllIndex;
                        $scope.filingUserAllPage.data.push($scope.filingUserAll[i]);
                        $scope.filingUserAllIndex = $scope.filingUserAllIndex + 1;
                    }
                }else{
                    for(var i=0;i<$scope.customerAll.length;i++){
                        $scope.customerAll[i].index = $scope.customerIndex;
                        $scope.customerAllPage.data.push($scope.customerAll[i])
                        $scope.customerIndex = $scope.customerIndex+1;
                    }
                };

                if(($scope.bhDock==1||$scope.bhDock==2)){
                    if($scope.customerAllPage.columnDefs[7].name != '更新日期'){
                        if(($scope.pageType == 'gz'&& $scope.pageStatus==1)||($scope.pageType == 'tb'&& $scope.pageStatus==2)){
                            $scope.addColumns();
                        }
                    }else if($scope.customerAllPage.columnDefs[7].name == '更新日期'){
                        if(!(($scope.pageType == 'gz'&& $scope.pageStatus==1)||($scope.pageType == 'tb'&& $scope.pageStatus==2))){
                            $scope.removeColumns();
                        }
                    }
                }else if(($scope.bhDock==0||$scope.bhDock==3) && $scope.customerAllPage.columnDefs[7].name == '更新日期'){
                    $scope.removeColumns();
                }
                $scope.loadingPage();
            }

            //加载更多按钮
            $scope.searchMore = function(){
                $scope.searchMoreStatus =false;
                $scope.getSearchMroe();
                $scope.searchMoreStatus =true;
                $scope.loadStatus=1;//正在加载中。。。
            }

            //判定数据是否加载完毕
            $scope.loadingPage = function(){

                if($scope.pageType == 'qkcx'){
                    if($scope.customerAllSearchPage.data.length>=$scope.policySearchCount ||$scope.customerAllSearch.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApi_qkcx.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApi_qkcx.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType == 'js'){
                    if($scope.customerNoReceivedPage.data.length>=$scope.policyCount ||$scope.customerNoReceived.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.NoReceGridApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.NoReceGridApi.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType == 'jiandang'){
                    if($scope.filingUserAllPage.data.length>=$scope.policyCount||$scope.filingUserAll.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.filingUserGridApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.filingUserGridApi.infiniteScroll.dataLoaded(false, true)
                    }
                }else{
                    if($scope.customerAllPage.data.length>=$scope.policyCount||$scope.customerAll.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApi_qk.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApi_qk.infiniteScroll.dataLoaded(false, true)
                    }
                }
            }

            //查询全部还是按时间查询按钮
            $scope.getShowAll = function (){

                if($scope.showAll==true){
                    $scope.rightTimeToolHide();
                }else {
                    $scope.rightTimeToolShow();
                }
                $scope.getSearchByTime();
            }

            //点击时间区间查询
            $scope.getSearchByTime = function (){
                $scope.resetTime = false;
                var re_data=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                if(!(re_data.test($scope.startTime)) || !(re_data.test($scope.endTime))){
                    $scope.resetTime = true;
                    return;
                }else if ($scope.startTime <= $scope.endTime){
                    $("#tipAlert").hide();
                    if($scope.pageType=='gz'){
                        $scope.findByTraceStatu('gz',$scope.pageStatus)
                    }else if($scope.pageType=='js'){
                        $scope.findByAcceptStatu('js',$scope.pageStatus)
                    }else if($scope.pageType=='tb'){
                        $scope.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                    }else if($scope.pageType=='ht'){
                        $scope.findByReturnStatu('ht',$scope.pageStatus);
                    }else if($scope.pageType=='shtj'){
                        $scope.findSAServiceStatistics('shtj');
                    }else if($scope.pageType=='ddwcd'){
                        $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                    }
                }else {
                    $scope.angularTip("开始时间不能大于结束时间！",5000);
                }
            };
            //重置时间
            $scope.ResetData = function (){
                var re_data=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                if( $scope.resetTime == true){
                    $scope.angularTip("输入的时间格式不正确！", 5000);
                    $scope.resetTime = false;
                    if(!(re_data.test($scope.startTime))){
                        $scope.startTime = "";
                    }else if(!(re_data.test($scope.endTime))){
                        $scope.endTime = "";
                    }
                }
            }

            //点击加载更多查询
            $scope.getSearchMroe = function (){

                if($scope.pageType=='gz'){
                    $scope.findByTraceStatu('gz',$scope.pageStatus)
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus)
                }else if($scope.pageType=='tb'){
                    $scope.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                }else if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus);
                }else if($scope.pageType=='ddwcd'){
                    $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                }else if($scope.pageType=='qkcx'){
                    $scope.findByCondition();//潜客查询
                }else if($scope.pageType=='jiandang'){
                    $scope.jiandangcx('jiandang'); //建档人查询
                }

            };

            //全局排序（状态界面）
            $scope.qjsort_statu = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==3){
                        $("#clerk_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==4){
                        $("#contact_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==5){
                        $("#contactWay_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class",""); $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class",""); $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_statu").attr("class","sort_desc"), $("#bhInsuranceEndDate_statu").attr("class",""),$("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==16){
                        $("#delayDate_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==18){
                        $("#cyts_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==19){
                        $("#holder_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==3){
                        $("#clerk_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==4){
                        $("#contact_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==5){
                        $("#contactWay_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class",""); $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class",""); $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_statu").attr("class","sort_asc"), $("#bhInsuranceEndDate_statu").attr("class",""),$("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==16){
                        $("#delayDate_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#cyts_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==18){
                        $("#cyts_statu").attr("class","sort_desc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#holder_statu").attr("class","")
                    }else if(short==19){
                        $("#holder_statu").attr("class","sort_asc"),$("#customerLevel_statu").attr("class",""), $("#principal_statu").attr("class","");$("#clerk_statu").attr("class","");$("#contact_statu").attr("class","");$("#contactWay_statu").attr("class","");$("#chassisNumber_statu").attr("class","");
                        $("#carLicenseNumber_statu").attr("class","");$("#coverTypeName_statu").attr("class","");$("#jqxrqEnd_statu").attr("class","");$("#bhInsuranceEndDate_statu").attr("class","");
                        $("#willingTraceDate_statu").attr("class","");$("#gotThroughNum_statu").attr("class","");$("#lastTraceDate_statu").attr("class","");$("#lastTraceResult_statu").attr("class","");$("#delayDate_statu").attr("class","");
                        $("#remainLostInsurDay_statu").attr("class","");$("#cyts_statu").attr("class","");
                    }
                }
                if($scope.pageType=='gz'){
                    this.findByTraceStatu('gz',$scope.pageStatus)
                }else if($scope.pageType=='js'){
                    this.findByAcceptStatu('js',$scope.pageStatus)
                }else if($scope.pageType=='tb'){
                    this.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                }else if($scope.pageType=='ht'){
                    this.findByReturnStatu('ht',$scope.pageStatus);
                }else if($scope.pageType=='ddwcd'){
                    this.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                }else if($scope.pageType=='qkcx'){
                    this.findByCondition();//潜客查询
                }

            };
            //根据跟踪状态查询
            $scope.findByTraceStatu = function(pageType,traceStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var ifLoan = $scope.qkSearch.ifLoan;
                var qnbfSort = $scope.qkSearch.qnbfSort;
                var sfgyx = $scope.qkSearch.sfgyx;
                $scope.pageType = pageType;
                $scope.pageStatus = traceStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, traceStatu: traceStatu,sfgyx:sfgyx,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber,ifLoan:ifLoan,qnbfSort:qnbfSort
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            traceStatu: traceStatu, startNum: $scope.startNum,sfgyx:sfgyx,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,ifLoan:ifLoan,qnbfSort:qnbfSort
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerSAService.findByTraceStatu($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.list;
                            if($scope.customerAll!=null&&$scope.customerAll.length>0){
                                for(var i=0;i<$scope.customerAll.length;i++){
                                    $scope.customerAll[i].dayNumber = $scope.dayNumber;
                                    $scope.customerAll[i].showNum = $scope.getNum($scope.customerAll[i].bhInsuranceEndDate,$scope.customerAll[i].jqxrqEnd);
                                    $scope.customerAll[i].bhInsuranceEndDate = $filter('date')($scope.customerAll[i].bhInsuranceEndDate,'yyyy-MM-dd/EEE');
                                    if($scope.customerAll[i].bhUpdateTime!=null){
                                        $scope.customerAll[i].bhUpdateTime = $filter('date')($scope.customerAll[i].bhUpdateTime,'yyyy-MM-dd HH:mm:ss');
                                    }
                                }
                            }
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };
            //根据潜客脱保状态查询
            $scope.findByCusLostInsurStatu = function(pageType,cusLostInsurStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = cusLostInsurStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, cusLostInsurStatu: cusLostInsurStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            cusLostInsurStatu: cusLostInsurStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerSAService.findByCusLostInsurStatu($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.list;
                            if($scope.customerAll!=null&&$scope.customerAll.length>0){
                                for(var i=0;i<$scope.customerAll.length;i++){
                                    $scope.customerAll[i].dayNumber = $scope.dayNumber;
                                    $scope.customerAll[i].showNum = $scope.getNum($scope.customerAll[i].bhInsuranceEndDate,$scope.customerAll[i].jqxrqEnd);
                                    $scope.customerAll[i].bhInsuranceEndDate = $filter('date')($scope.customerAll[i].bhInsuranceEndDate,'yyyy-MM-dd/EEE');
                                    if($scope.customerAll[i].bhUpdateTime!=null){
                                        $scope.customerAll[i].bhUpdateTime = $filter('date')($scope.customerAll[i].bhUpdateTime,'yyyy-MM-dd HH:mm:ss');
                                    }
                                }
                            }
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
            }
            //（全局排序）未接收状态查询
            $scope.qjsort_js = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==3){
                        $("#clerk_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==4){
                        $("#contact_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==5){
                        $("#contactWay_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class",""); $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class",""); $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==11){
                        $("#bhInsuranceEndDate_js").attr("class","");$("#customerLevel_js").attr("class","sort_desc");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==16){
                        $("#delayDate_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==18){
                        $("#cyts_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#holder_js").attr("class","")
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==3){
                        $("#clerk_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==4){
                        $("#contact_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==5){
                        $("#contactWay_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class",""); $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class",""); $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==11){
                        $("#bhInsuranceEndDate_js").attr("class","");$("#customerLevel_js").attr("class","sort_asc");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==16){
                        $("#delayDate_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_js").attr("class","sort_asc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#cyts_js").attr("class","");$("#holder_js").attr("class","")
                    }else if(short==18){
                        $("#cyts_js").attr("class","sort_desc");$("#customerLevel_js").attr("class","");
                        $("#principal_js").attr("class","");$("#clerk_js").attr("class","");$("#contact_js").attr("class","");$("#contactWay_js").attr("class","");$("#chassisNumber_js").attr("class","");
                        $("#carLicenseNumber_js").attr("class","");$("#coverTypeName_js").attr("class","");$("#jqxrqEnd_js").attr("class","");$("#bhInsuranceEndDate_js").attr("class","");
                        $("#willingTraceDate_js").attr("class","");$("#gotThroughNum_js").attr("class","");$("#lastTraceDate_js").attr("class","");$("#lastTraceResult_js").attr("class","");$("#delayDate_js").attr("class","");
                        $("#remainLostInsurDay_js").attr("class","");$("#holder_js").attr("class","")
                    }
                }
                this.findByAcceptStatu('js',$scope.pageStatus) //接收
            };
            //根据接收状态查询
            $scope.findByAcceptStatu = function(pageType,acceptStatu){
                $scope.rightTitleTimeToolHide();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                $scope.pageType = pageType;
                $scope.pageStatus = acceptStatu;
                $scope.customerNoReceived= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {short:short,shortmain:shortmain,acceptStatu: acceptStatu, startNum: $scope.startNum};
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerSAService.findByAcceptStatu($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerNoReceived = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };

            //根据回退状态查询
            $scope.findByReturnStatu = function(pageType,returnStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime,returnStatu:returnStatu,approvalStatu: returnStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu:returnStatu,approvalStatu: returnStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                if(returnStatu=='3,7'){
                    customerSAService.findByApproval($scope.condition)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.customerAll = result.results.content.list;
                                $scope.policyCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {

                            };
                        });
                }else if(returnStatu==2) {//已回退
                    customerSAService.findByYiHuiTui($scope.condition)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.customerAll = result.results.content.list;
                                $scope.policyCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {

                            };
                        });
                }else{//待审批查询
                    customerSAService.findByReturnStatu($scope.condition)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.customerAll = result.results.content.list;
                                $scope.policyCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {

                            };
                        });
                }
            };
            //查询到店未出单潜客
            $scope.findDdwcdCus = function(pageType,pageStatus){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = pageStatus;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerSAService.findDdwcdCus($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };
            //全局排序（建档人查询界面）
            $scope.qjsort_jdr = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==4){
                        $("#contact_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contactWay_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==5){
                        $("#contactWay_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==6){
                        $("#contactWay_jdr").attr("class","");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_desc");
                    }else if(short==7){
                        $("#carLicenseNumber_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#carLicenseNumber_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==9){
                        $("#jqxrqEnd_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==11){
                        $("#jqxrqEnd_jdr").attr("class","");$("#customerLevel_jdr").attr("class","sort_desc");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","");
                    }else if(short==20){
                        $("#createTime_jdr").attr("class","sort_desc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#").attr("class","carLicenseNumber_jdr");$("#chassisNumber_jdr").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==4){
                        $("#contact_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contactWay_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==5){
                        $("#contactWay_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==6){
                        $("#contactWay_jdr").attr("class","");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==7){
                        $("#carLicenseNumber_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==8){
                        $("#coverTypeName_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#carLicenseNumber_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==9){
                        $("#jqxrqEnd_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==11){
                        $("#jqxrqEnd_jdr").attr("class","");$("#customerLevel_jdr").attr("class","sort_asc");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#carLicenseNumber_jdr").attr("class","");$("#createTime_jdr").attr("class","");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }else if(short==20){
                        $("#createTime_jdr").attr("class","sort_asc");$("#customerLevel_jdr").attr("class","");$("#contact_jdr").attr("class","");$("#contactWay_jdr").attr("class","");
                        $("#coverTypeName_jdr").attr("class","");$("#jqxrqEnd_jdr").attr("class","");$("#").attr("class","carLicenseNumber_jdr");$("#chassisNumber_jdr").attr("class","sort_asc");
                    }
                }
                this.jiandangcx('jiandang'); //建档人查询
            };
            //根据建档人查询
            $scope.createrSearch = {};
            $scope.jiandangcx = function(pageType){
                $scope.rightTitleTimeToolHide();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                $scope.pageType = pageType;
                $scope.filingUserAll = [];
                var renewalType = $scope.createrSearch.renewalType;
                var contact = $scope.createrSearch.contact;
                var contactWay = $scope.createrSearch.contactWay;
                var chassisNumber = $scope.createrSearch.chassisNumber;
                var carLicenseNumber = $scope.createrSearch.carLicenseNumber;
                var defeatFlag = $scope.createrSearch.defeatFlag;
                var startDate = $scope.createrSearch.startDate;
                var endDate = $scope.createrSearch.endDate;
                if(startDate > endDate){
                    $scope.angularTip("开始时间不能大于结束时间",5000);
                }
                $scope.resetPageData();
                $("#msgwindow").show();
                customerSAService.findCustomerByCreater(short,shortmain,$scope.startNum,renewalType,chassisNumber,carLicenseNumber,contact,contactWay,startDate,endDate,defeatFlag)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.filingUserAll = result.results.content.results;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
            }
            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
				$('select[multiple="multiple"]').multiselect('clearSelection');
                $('select[multiple="multiple"]').multiselect('refresh');
            };
            //清空表单
            $scope.clearQksearch = function(){
                $scope.qkSearch = {};
                $scope.createrSearch = {};
                $scope.zbqk = {};
            };

            //点击潜客查询事件
            $scope.coutomerSreachClick = function(){
                $scope.rightTitleTimeToolHide();
                $scope.pageType = 'qkcx';
                if(($scope.bhDock==0||$scope.bhDock==3) && $scope.customerAllSearchPage.columnDefs[7].name == '更新日期'){
                    $scope.customerAllSearchPage.columnDefs.splice(7, 1);
                }
                $scope.loadingPage();
            }
            //排序潜客界面（全局）
            $scope.qjsort = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","");
                    }else if(short==3){
                        $("#clerk").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==4){
                        $("#contact").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==5){
                        $("#contactWay").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class",""); $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class",""); $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==11){
                        $("#bhInsuranceEndDate").attr("class","");$("#customerLevel").attr("class","sort_desc");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==16){
                        $("#delayDate").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==18){
                        $("#cyts").attr("class","sort_asc")
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#holder").attr("class","")
                    }else if(short==19){
                        $("#holder").attr("class","sort_desc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==3){
                        $("#clerk").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==4){
                        $("#contact").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==5){
                        $("#contactWay").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class",""); $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class",""); $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==11){
                        $("#bhInsuranceEndDate").attr("class","");$("#customerLevel").attr("class","sort_asc");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==16){
                        $("#delayDate").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#cyts").attr("class","");$("#holder").attr("class","")
                    }else if(short==18){
                        $("#cyts").attr("class","sort_desc");;$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#holder").attr("class","")
                    }else if(short==19){
                        $("#holder").attr("class","sort_asc");$("#customerLevel").attr("class","");
                        $("#principal").attr("class","");$("#clerk").attr("class","");$("#contact").attr("class","");$("#contactWay").attr("class","");$("#chassisNumber").attr("class","");
                        $("#carLicenseNumber").attr("class","");$("#coverTypeName").attr("class","");$("#jqxrqEnd").attr("class","");$("#bhInsuranceEndDate").attr("class","");
                        $("#willingTraceDate").attr("class","");$("#gotThroughNum").attr("class","");$("#lastTraceDate").attr("class","");$("#lastTraceResult").attr("class","");$("#delayDate").attr("class","");
                        $("#remainLostInsurDay").attr("class","");$("#cyts").attr("class","");
                    }
                }
                this.findByCondition();
            };
            //按条件查询潜客信息
            $scope.findByCondition = function(){
                var short = $scope.short;
                var shortmain =$scope.shortmain;
                var fourSStoreId = $rootScope.user.store.storeId;
                var carBrand = '';
                var vehicleModel = '';
                if($scope.search.carBrand){
                    carBrand = $scope.search.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.search.vehicleModelInput
                    }else if($scope.search.vehicleModel){
                        vehicleModel =$scope.search.vehicleModel.modelName;
                    }
                }
                var chassisNumber = $scope.search.chassisNumber;
                var carLicenseNumber = $scope.search.carLicenseNumber;
                var insured = $scope.search.insured;
                var contact = $scope.search.contact;
                var contactWay = $scope.search.contactWay;
                var contactWayReserve = $scope.search.contactWayReserve;
                var insuranceCompLY = $scope.search.insuranceCompLY;
                var renewalTypes = $scope.search.renewalType;
                var customerLevel = $scope.search.customerLevel;
                var comeStoreNumber = $scope.search.comeStoreNumber;
                var principalId = $scope.search.principalId;
                var insurNumber = $scope.search.insurNumber;
                var isInvite = $scope.search.isInvite;
                var isComeStore = $scope.search.isComeStore;
                var isQuote = $scope.search.isQuote;
                var insurDateLYStart = $scope.search.insurDateLYStart;
                var insurDateLYEnd = $scope.search.insurDateLYEnd;
                var insuranceEndDateStart = $scope.search.insuranceEndDateStart;
                var insuranceEndDateEnd = $scope.search.insuranceEndDateEnd;
                var syxrqDateStart=$scope.search.syxrqDateStart;
                var syxrqDateEnd=$scope.search.syxrqDateEnd;
                var inviteDateStart = $scope.search.inviteDateStart;
                var inviteDateEnd = $scope.search.inviteDateEnd;
                var comeStoreDateStart = $scope.search.comeStoreDateStart;
                var comeStoreDateEnd = $scope.search.comeStoreDateEnd;
                var lastTraceDateStart = $scope.search.lastTraceDateStart;
                var lastTraceDateEnd = $scope.search.lastTraceDateEnd;
                var quoteDateStart = $scope.search.quoteDateStart;
                var quoteDateEnd = $scope.search.quoteDateEnd;
                var traceDateStart = $scope.search.traceDateStart;
                var traceDateEnd = $scope.search.traceDateEnd;
                var zdZheKouStart = $scope.search.zdZheKouStart;
                var zdZheKouEnd = $scope.search.zdZheKouEnd;
                var carOwner = $scope.search.carOwner;
                var LostInsurDay = $scope.search.remainLostInsurDay;
                var sfgyx = $scope.search.sfgyx;
                var ifLoan = $scope.search.ifLoan;
                var registrationDateStart = $scope.search.registrationDateStart;
                var registrationDateEnd = $scope.search.registrationDateEnd;
                var remainLostInsurDayStart;
                var remainLostInsurDayEnd;
                var myDate = new Date().getTime();
                if(LostInsurDay==1){
                    remainLostInsurDayStart = myDate;
                    remainLostInsurDayEnd = myDate+7*24*60*60*1000;
                }else if(LostInsurDay==2){
                    remainLostInsurDayStart = myDate+8*24*60*60*1000;
                    remainLostInsurDayEnd = myDate+30*24*60*60*1000;
                }else if(LostInsurDay==3){
                    remainLostInsurDayStart = myDate+31*24*60*60*1000;
                    remainLostInsurDayEnd = myDate+60*24*60*60*1000;
                }else if(LostInsurDay==4){
                    remainLostInsurDayStart = myDate+61*24*60*60*1000;
                    remainLostInsurDayEnd = myDate+90*24*60*60*1000;
                }else if(LostInsurDay==5){
                    remainLostInsurDayStart = myDate+91*24*60*60*1000;
                    remainLostInsurDayEnd = myDate+364*24*60*60*1000;
                };
                remainLostInsurDayStart = $filter('date')(remainLostInsurDayStart,'yyyy-MM-dd');
                remainLostInsurDayEnd = $filter('date')(remainLostInsurDayEnd,'yyyy-MM-dd');
                //重置数据
                if ($scope.searchMoreStatus == true) {
                    $scope.startNumSearch = 1; //开始页
                    $scope.customerSearchIndex = 1;
                    $scope.customerAllSearchPage.data = [];
                    $scope.conditionSearch = {};
                } else {
                    $scope.startNumSearch = $scope.startNumSearch + 1;
                };
                if($scope.startNumSearch == 1) {
                    $scope.conditionSearch = {
                        short:short,shortmain:shortmain,
                        fourSStoreId: fourSStoreId,
                        startNum: $scope.startNumSearch,
                        insurDateLYStart: insurDateLYStart, insurDateLYEnd: insurDateLYEnd,
                        insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd,
                        syxrqDateStart: syxrqDateStart,syxrqDateEnd: syxrqDateEnd,
                        inviteDateStart: inviteDateStart, inviteDateEnd: inviteDateEnd,
                        comeStoreDateStart: comeStoreDateStart, comeStoreDateEnd: comeStoreDateEnd,
                        lastTraceDateStart: lastTraceDateStart, lastTraceDateEnd: lastTraceDateEnd,
                        quoteDateStart: quoteDateStart, quoteDateEnd: quoteDateEnd,traceDateStart: traceDateStart,
                        traceDateEnd: traceDateEnd,zdZheKouStart:zdZheKouStart,zdZheKouEnd:zdZheKouEnd,
                        remainLostInsurDayStart:remainLostInsurDayStart,remainLostInsurDayEnd:remainLostInsurDayEnd,
                        registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                        condition: {
                            carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                            carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                            contactWay: contactWay, contactWayReserve:contactWayReserve,insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
                            customerLevel: customerLevel, insurNumber: insurNumber,
                            isInvite: isInvite, isComeStore: isComeStore, isQuote: isQuote,
                            comeStoreNumber: comeStoreNumber, principalId: principalId,carOwner:carOwner,sfgyx:sfgyx,ifLoan:ifLoan
                        }
                    }
                }else{
                    $scope.conditionSearch.startNum = $scope.startNumSearch;
                };

                if( insurDateLYStart != null  && insurDateLYEnd != null && insurDateLYStart != ""  && insurDateLYEnd != "" && insurDateLYStart>insurDateLYEnd){
                    $scope.angularTip("投保开始日期不能大于结束日期！",5000)
                }else if(insuranceEndDateStart != null && insuranceEndDateEnd != null && insuranceEndDateStart != "" && insuranceEndDateEnd != "" && insuranceEndDateStart>insuranceEndDateEnd){
                    $scope.angularTip("保险到期开始日期不能大于结束日期！",5000)
                }else if(inviteDateStart != null && inviteDateEnd != null && inviteDateStart != "" && inviteDateEnd != "" && inviteDateStart>inviteDateEnd){
                    $scope.angularTip("邀约开始日期不能大于结束日期！",5000)
                }else if(comeStoreDateStart != null && comeStoreDateEnd != null && comeStoreDateStart != "" && comeStoreDateEnd != "" && comeStoreDateStart>comeStoreDateEnd){
                    $scope.angularTip("到店日开始日期不能大于结束日期！",5000)
                }else if(lastTraceDateStart != null && lastTraceDateEnd != null && lastTraceDateStart != "" && lastTraceDateEnd != "" && lastTraceDateStart>lastTraceDateEnd){
                    $scope.angularTip("末次跟踪日期开始日期不能大于结束日期！",5000)
                }else if(quoteDateStart != null && quoteDateEnd != null && quoteDateStart != "" && quoteDateEnd != "" && quoteDateStart>quoteDateEnd){
                    $scope.angularTip("报价开始日期不能大于结束日期！",5000)
                }else if(traceDateStart != null && traceDateEnd != null && traceDateStart != "" && traceDateEnd != "" && traceDateStart>traceDateEnd){
                    $scope.angularTip("应跟踪开始日期不能大于结束日期！",5000)
                }else if(registrationDateStart != null && registrationDateEnd != null && registrationDateStart != "" && registrationDateEnd != "" && registrationDateStart>registrationDateEnd){
                    $scope.angularTip("上牌日期开始日期不能大于结束日期！",5000)
                }else if(syxrqDateStart != null && syxrqDateEnd != null && syxrqDateStart != "" && syxrqDateEnd != "" && syxrqDateStart>syxrqDateEnd){
                    $scope.angularTip("商业到期开始日期不能大于结束日期！",5000)
                }else {
                    $("#msgwindow").show();
                    customerSAService.findByCondition($scope.conditionSearch)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#msgwindow").hide();
                                $scope.customerAllSearch = result.results.content.list;
                                if($scope.customerAllSearch!=null&&$scope.customerAllSearch.length>0){
                                    for(var i=0;i<$scope.customerAllSearch.length;i++){
                                        $scope.customerAllSearch[i].dayNumber = $scope.dayNumber;
                                        $scope.customerAllSearch[i].showNum = $scope.getNum($scope.customerAllSearch[i].bhInsuranceEndDate,$scope.customerAllSearch[i].jqxrqEnd);
                                        $scope.customerAllSearch[i].bhInsuranceEndDate = $filter('date')($scope.customerAllSearch[i].bhInsuranceEndDate,'yyyy-MM-dd/EEE');
                                        if($scope.customerAllSearch[i].bhUpdateTime!=null){
                                            $scope.customerAllSearch[i].bhUpdateTime = $filter('date')($scope.customerAllSearch[i].bhUpdateTime,'yyyy-MM-dd HH:mm:ss');
                                        }
                                    }
                                }
                                $scope.policySearchCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {
                                $scope.angularTip("查询失败",5000);
                            };
                        });
                }
            };

            $scope.getNum = function(bhInsuranceEndDate,jqxrqEnd){
                var  myDate_ms = Date.parse(new Date());
                if(bhInsuranceEndDate!=undefined&&bhInsuranceEndDate!=null){
                    return Math.abs(bhInsuranceEndDate-myDate_ms);
                }else{
                    return 0;
                }
            }

            //跟踪处理内跟踪记录
            $scope.tracelistPage = {};
            $scope.tracelistPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false},
                    { name: '跟踪时间', field: 'currentTraceDate',enableColumnMenu: false,width:150,cellFilter: 'date:"yyyy-MM-dd/EEE HH:mm"'},
                    { name: '跟踪记录', width:300,enableColumnMenu: false,
                        cellTemplate:'<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.trackConbox(row.entity)">{{row.entity.traceContext}}</div>'},
                    { name: '保险到期日', field: 'bxdqr',width:95,enableColumnMenu: false,cellFilter: 'date:"yy-MM-dd/EEE"'},
                    { name: '预计到店日期', field: 'inviteDate',width:95,enableColumnMenu: false,cellFilter: 'date:"yy-MM-dd/EEE"'},
                    { name: '下次跟踪时间', field: 'newNextTraceDate',width:100,enableColumnMenu: false,cellFilter: 'date:"yy-MM-dd/EEE"'},

                    { name: '联系人', field: 'lxr',width:70,enableColumnMenu: false},
                    { name: '联系方式', field: 'lxfs',width:95, enableColumnMenu: false,cellTooltip: true},
                    { name: '投保类型', field: 'renewalType',width:70,enableColumnMenu: false},
                    { name: '车型', field: 'cx',width:80, enableColumnMenu: false},
                    { name: '是否报价', field: 'quote',cellFilter: 'mapSF',width:65,enableColumnMenu: false},
                    { name: '报价金额', field: 'quotedPrice',width:70,enableColumnMenu: false},
                    { name: '商业险报价', field: 'syxbj',width:70,enableColumnMenu: false},
                    { name: '交强险报价', field: 'jqxbj',width:70,enableColumnMenu: false},
                    { name: '车船税报价', field: 'ccsbj',width:70,enableColumnMenu: false},
                    { name: '进店', field: 'comeStore',cellFilter: 'mapSF',width:45,enableColumnMenu: false},
                    { name: '进店时间', field: 'comeStoreDate',width:150,enableColumnMenu: false,cellFilter: 'date:"yyyy-MM-dd/EEE HH:mm"'},
                    { name: '级别', field: 'customerLevel',width:45,enableColumnMenu: false},
                    { name: '是否接通', field: 'sfjt',cellFilter: 'mapSF',width:65,enableColumnMenu: false},
                    { name: '持有天数', field: 'cyts',width:80,enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            $scope.trackConbox=function(trackCon){
                $scope.traceContext = trackCon.traceContext;
                var index = trackCon.index;
                $(".trackConbox").css("top",index*30);
                $(".trackConbox").show();
                setTimeout(function(){
                    $(".trackCopybox").focus();
                    $(".trackCopybox").select();
                },200);
            }
            $scope.trackConboxHide=function(){
                $(".trackConbox").hide();
            }
            $(document).bind("click",function(e){
                var target = $(e.target);
                if(target.closest("#genzong").length == 0){
                    $(".trackConbox").hide();
                }
            })
            //按潜客ID查询潜客信息及跟踪记录
            $scope.findByCustomerId=function(customer){
                $scope.footerBtn = "";
                $scope.customerId = customer.customerId;
                $scope.chassisNumber = customer.chassisNumber;
                $scope.principalId = customer.principalId;
                $scope.principal = customer.principal;
                $scope.thisRowData = customer;
                $scope.acceptStatu = customer.customerAssigns[0].acceptStatu;
                $scope.returnStatu = customer.customerAssigns[0].returnStatu;
                $scope.traceStatu = customer.customerAssigns[0].traceStatu;
                $scope.jqxrqEnd_before = customer.jqxrqEnd;
                $("#msgwindow").show();
                customerSAService.findByCustomerId( $scope.customerId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $("#genzcl").show();
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $("#gz_tab").children("li").removeClass("active");
                        $("#gz_tab_grid").children(".tab-pane").removeClass("in active");
                        $("#gzjl_tab").addClass("active");
                        $("#genzong").addClass("in active");
                        $scope.custInfo = result.results.content.results;
                        var bhInsuranceEndDate = $scope.custInfo.bhInsuranceEndDate;
                        var jqxrqEnd = $scope.custInfo.jqxrqEnd;
                        if(bhInsuranceEndDate!=undefined&&bhInsuranceEndDate!=null){
                            var myDate_ms = Date.parse(new Date());
                            $scope.custInfo.showNum = Math.abs(bhInsuranceEndDate - myDate_ms);
                        }else{
                            $scope.custInfo.showNum = 0;
                        }
                        $scope.custInfo.bhInsuranceEndDate = $filter('date')($scope.custInfo.bhInsuranceEndDate,'yyyy-MM-dd');
                        $scope.tracelistPage.data = result.results.content.results.customerTraceRecodes;
                        for(var i=0;i< $scope.tracelistPage.data.length;i++){
                            $scope.tracelistPage.data[i].index = i+1;
                        };
                        $scope.custInfo.carAnnualCheckUpDate = $filter('date')($scope.custInfo.carAnnualCheckUpDate,'yyyy-MM-dd');
                        $scope.custInfo.registrationDate = $filter('date')($scope.custInfo.registrationDate,'yyyy-MM-dd');
                        $scope.custInfo.insuranceEndDate = $filter('date')($scope.custInfo.insuranceEndDate,'yyyy-MM-dd');
                        $scope.custInfo.insurDateLY = $filter('date')($scope.custInfo.insurDateLY,'yyyy-MM-dd');
                        $scope.custInfo.syxrqEnd = $filter('date')($scope.custInfo.syxrqEnd,'yyyy-MM-dd');
                        $scope.custInfo.jqxrqEnd = $filter('date')($scope.custInfo.jqxrqEnd,'yyyy-MM-dd');
                        for(var i = 0 ;i<$scope.kingdsUser.servicer.length;i++){
                            if($scope.kingdsUser.servicer[i].id==$scope.custInfo.serviceConsultantId){
                                $scope.custInfo.serviceConsultant = $scope.kingdsUser.servicer[i];
                            }
                        }
                        $scope.carLicenseNumber = $scope.custInfo.carLicenseNumber;
                        $scope.gzclmr($scope.custInfo.carBrand,$scope.custInfo.vehicleModel);
                        $scope.saveCustChangefun();

                    } else {

                    };
                    $scope.isQuoteBol=true;
                    $scope.isInviteBol=true;
                    $scope.isComeStoreBol=true;
                    $scope.lastYearIsDealBol=true;
                    $scope.progressWidth = {"width" : "0%"}
                    if($scope.custInfo.isQuote ==1){
                        $scope.isQuoteBol=false;
                        $scope.progressWidth = {"width" : "0%"}
                    };
                    if($scope.custInfo.isInvite ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.progressWidth = {"width" : "33%"}
                    };
                    if($scope.custInfo.isComeStore ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.isComeStoreBol=false;
                        $scope.progressWidth = {"width" : "66%"}
                    };
                    if($scope.custInfo.lastYearIsDeal ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.isComeStoreBol=false;
                        $scope.lastYearIsDealBol=false;
                        $scope.progressWidth = {"width" : "100%"}
                    };
                });
            };
            //跟踪处理内报价记录
            $scope.add_bj_Page = {};
            $scope.add_bj_Page = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false},
                    { name:'报价明细',enableColumnMenu: false,minWidth:65,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.bjRecordDetails(row.entity)">查看明细</div>'},
                    { name: '报价时间', field: 'dcbjrq',enableColumnMenu: false,width:150,cellFilter: 'date:"yyyy-MM-dd/EEE HH:mm"'},
                    { name: '商业险保费', field: 'syxje',width:80, enableColumnMenu: false},
                    { name: '交强险保费', field: 'jqxje',width:80,enableColumnMenu: false},
                    { name: '车船税', field: 'ccsje',width:80,enableColumnMenu: false},
                    { name: '保费合计', field: 'bfhj',width:65,enableColumnMenu: false},
                    { name: '应交保费', field: 'shijize',width:65,enableColumnMenu: false},
                    { name: '出险次数', field: 'cxcs',width:65,enableColumnMenu: false},
                    { name: '理赔金额', field: 'lpje',width:65,enableColumnMenu: false},
                    { name: '现金优惠', field: 'yhje',width:65,enableColumnMenu: false},
                    { name: '保险公司', field: 'bxgs',width:85,enableColumnMenu: false,cellTooltip: true},
                    { name: '综合优惠系数', field: 'jncdzk',width:90,enableColumnMenu: false},
                    { name: '无赔款优惠系数', field: 'rateFactor1',width:100,enableColumnMenu: false},
                    { name: '自主渠道系数', field: 'rateFactor2',width:100,enableColumnMenu: false},
                    { name: '自主核保系数', field: 'rateFactor3',width:100,enableColumnMenu: false},
                    { name: '交通违法系数', field: 'rateFactor4',width:100,enableColumnMenu: false},
                    /*{ name: '核保', field: 'underWriting[0].submitResult',width:100,cellTooltip: true,enableColumnMenu: false},*/
                    { name: '险种', field: 'xz',width:150,cellTooltip: true,cellFilter: 'mapBoLi', enableColumnMenu: false},
                    { name: '报价人', field: 'bjr',width:70,enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,enableColumnMenu: false,cellTooltip: true},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //查询潜客报价记录
            $scope.findListCustomerBJRecode = function() {
                customerSAService.findListCustomerBJRecode($scope.customerId).then(function (result) {
                    if (result.status == 'OK' && result.results.success == true) {
                        $scope.add_bj_Page.data = result.results.content.customerBJRecodeList;
                        for (var i = 0; i < $scope.add_bj_Page.data.length; i++) {
                            $scope.add_bj_Page.data[i].index = i + 1;
                        };
                    }
                })
            }
            //查看报价记录明细
            $scope.bhQuoteDetails={};
            $scope.xzArr = [];
            $scope.bjRecordDetails = function(quoteRecord) {
                $scope.bhQuoteDetails = quoteRecord;
                $scope.bhQuoteDetails.bjsj = $filter('date')($scope.bhQuoteDetails.dcbjrq, 'yyyy-MM-dd');
                $scope.bhQuoteDetails.carLicenseNumber = $scope.custInfo.carLicenseNumber;
                $scope.bhQuoteDetails.chassisNumber = $scope.custInfo.chassisNumber;
                $scope.xzArr = $filter('mapBoLi')($scope.bhQuoteDetails.xz);
                $scope.xzArr = $scope.xzArr.split(";");
                $scope.xzArr.splice(-1,1);
                $("#bjDetails").show();
            }
            //关闭报价记录明细
            $scope.bjDetailsClose = function() {
                $("#bjDetails").hide();
            }
            //跟踪处理内审批单记录
            $scope.customerSpdjl = {};
            $scope.customerSpdjl = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false},
                    { name: '交强险日期', field: 'jqxrq',width:200,enableColumnMenu: false},
                    { name: '投保日期', field: 'insurDate',width:80, enableColumnMenu: false,cellFilter: 'date:"yyyy-MM-dd"'},
                    { name: '投保类型', field: 'renewalType',width:80,enableColumnMenu: false},
                    { name: '投保公司', field: 'insuranceCompName',width:80,enableColumnMenu: false},
                    { name: '险种明细', field: 'insurancTypes',width:65,enableColumnMenu: false,cellTooltip: true},
                    { name: '商业险金额', field: 'syxje',width:65,enableColumnMenu: false},
                    { name: '交强险金额', field: 'jqxje',width:65,enableColumnMenu: false},
                    { name: '车船税金额', field: 'ccs',width:65,enableColumnMenu: false},
                    { name: '保费合计', field: 'bfhj',width:65,enableColumnMenu: false},
                    { name: '综合优惠', field: 'comprehensiveDiscount',width:85,enableColumnMenu: false,cellTooltip: true},
                    { name: '实收金额', field: 'ssje',width:90,enableColumnMenu: false},
                    { name: '赠品', field: 'giftNameArr',width:200,enableColumnMenu: false,cellTooltip: true}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //查询潜客审批单记录
            $scope.findApprovalBillRecordList = function() {
                customerSAService.findApprovalBillRecordList($scope.chassisNumber).then(function (result) {
                    if (result.status == 'OK' && result.results.success == true) {
                        $scope.customerSpdjl.data = result.results.content.results;
                        for (let i = 0; i < $scope.customerSpdjl.data.length; i++) {
                            $scope.customerSpdjl.data[i].index = i + 1;
                            if($scope.customerSpdjl.data[i].jqxrqStart==null){
                                $scope.customerSpdjl.data[i].jqxrq="";
                            }else{
                                $scope.customerSpdjl.data[i].jqxrq = $scope.dateToStr(new Date($scope.customerSpdjl.data[i].jqxrqStart))
                                    +'~'+$scope.dateToStr(new Date($scope.customerSpdjl.data[i].jqxrqEnd));
                            }
                            $scope.customerSpdjl.data[i].renewalType = getCoverType($scope.customerSpdjl.data[i].renewalType);
                            let giftNameArr = "";
                            for (let j = 0; j < $scope.customerSpdjl.data[i].givingInformations.length; j++){
                                let givingInformations = $scope.customerSpdjl.data[i].givingInformations;
                                if(givingInformations[j].giftName == null || givingInformations[j].amount ==null){
                                    giftNameArr ="";
                                }else{
                                    giftNameArr += givingInformations[j].giftName+'('+givingInformations[j].amount+')'+"；";
                                }
                            }
                            $scope.customerSpdjl.data[i].giftNameArr =giftNameArr;
                        };
                    }
                })
            }
            function getCoverType (str){
                var x = 0;
                switch (str)  {
                    case 1:x="首次";break;
                    case 2:x="新转续";break;
                    case 3:x="续转续";break;
                    case 4:x="间转续";break;
                    case 5:x="潜转续";break;
                    case 6:x="首次";break;
                }
                return x;
            }
            $scope.dateToStr = function(dateTime){
                var year = dateTime.getFullYear();
                var month = dateTime.getMonth()+1;//js从0开始取
                var date = dateTime.getDate();
                if(month<10){
                    month = "0" + month;
                }
                if(date<10){
                    date = "0" + date;
                }
                return year+"-"+month+"-"+date;
            }
            //保单查询品牌车型选择框与输入框切换
            $scope.searchVehicleModel = function(){
                $scope.search.vehicleModel='';
                $scope.search.vehicleModelInput='';
                if($scope.search.carBrand){
                    if($scope.search.carBrand.brandName=='异系'){
                        $("#clxhsr_search").show();
                        $("#clxhxz_search").hide();
                    }else{
                        $("#clxhxz_search").show();
                        $("#clxhsr_search").hide();
                    }
                }else {
                    $("#clxhxz_search").show();
                    $("#clxhsr_search").hide();
                }
            }

            //跟踪处理品牌车型选择框与输入框切换
            $scope.gzclVehicleModel = function(){
                $scope.custInfo.vehicleModel='';
                $scope.custInfo.vehicleModelInput='';
                if($scope.custInfo.carBrand){
                    if($scope.custInfo.carBrand.brandName=='异系'){
                        $("#clxhsr_gzcl").show();
                        $("#clxhxz_gzcl").hide();
                    }else{
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                    }
                }else {
                    $("#clxhxz_gzcl").show();
                    $("#clxhsr_gzcl").hide();
                }
            }
            //跟踪处理品牌与车型默认值
            $scope.gzclmr = function (carBrand,vehicleModel){
                var sfyy = 0 ;
                $scope.carBrandsgz = [];
                $scope.carBrandsgz = $.extend(true,[], $scope.carBrands);

                for(var i = 0 ;i<$scope.carBrandsgz.length;i++){
                    if(carBrand==$scope.carBrandsgz[i].brandName){
                        sfyy = 1;
                    }else if(carBrand==null||carBrand==''){
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        return;
                    }
                }
                if(sfyy==0){
                    $scope.carBrandsgz.push({brandName:carBrand})
                }
                for(var i = 0 ;i<$scope.carBrandsgz.length;i++){
                    if(carBrand==$scope.carBrandsgz[i].brandName&&sfyy==0){
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                            return
                        }
                        $scope.carBrandsgz[i].carModelList=[{modelName:vehicleModel}];
                        $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                        $scope.custInfo.vehicleModel = $scope.custInfo.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsgz[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_gzcl").show();
                        $("#clxhxz_gzcl").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                            return
                        }
                        $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                        $scope.custInfo.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsgz[i].brandName&&sfyy==1){
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                        for(var j = 0 ;j<$scope.custInfo.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.custInfo.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsgz[i].carModelList.push({modelName:vehicleModel});
                            $scope.custInfo.carBrand = $scope.carBrandsgz[i];
                        }
                        for(var j = 0 ;j<$scope.custInfo.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.custInfo.carBrand.carModelList[j].modelName){
                                $scope.custInfo.vehicleModel = $scope.custInfo.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }
            //改变交强险日期
            $scope.changeJqxrqEnd = function(){
                $scope.custInfo.jqxrqEnd=$scope.custInfo.bhInsuranceEndDate;
                $scope.CustValuebol = true;
            };
            //潜客跟踪处理，保存修改的潜客信息
            $scope.saveCustChangefun = function(){
                $scope.CustValuebol = false;
                $(".changeValue").find("input").change(function(){
                    $scope.CustValuebol = true;
                });
                $(".changeValue").find("textarea").change(function(){
                    $scope.CustValuebol = true;
                });
                $(".changeValue").find("select").change(function(){
                    $scope.CustValuebol = true;
                });

            };
            //数据改变了是否保存
            $scope.saveCustChangeBtn = function(){
                $scope.footerBtn = "";
                if ($scope.CustValuebol == true && !($scope.pageType=='js'||
                    ($scope.pageType=='ht'&&$scope.pageStatus==11)||($scope.pageType=='ht'&&$scope.pageStatus==2))) {
                    $("#changevalue").show();
                }else {
                    $("#genzcl").hide();
                }
            };
            //保存修改
            $scope.saveChange = function(){
                $scope.CustValuebol = false;
                var carLicenseNumber =$scope.custInfo.carLicenseNumber;//车牌号
                var chassisNumber =$scope.custInfo.chassisNumber;//车架号
                var engineNumber =$scope.custInfo.engineNumber;//发动机号
                var registrationDate =$scope.custInfo.registrationDate;//上牌日期
                var carBrand = '';//品牌
                var vehicleModel = '';//车辆型号
                if($scope.custInfo.carBrand){
                    carBrand = $scope.custInfo.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.custInfo.vehicleModelInput
                    }else if($scope.custInfo.vehicleModel){
                        vehicleModel =$scope.custInfo.vehicleModel.modelName;
                    }
                }

                var syxrqEnd =$scope.custInfo.syxrqEnd;//商业险结束日期
                var jqxrqEnd =$scope.custInfo.jqxrqEnd;//交强险结束日期
                var renewalType =$scope.custInfo.renewalType||'';//投保类型
                var renewalWay =$scope.custInfo.renewalWay||'';//续保渠道
                var principal = $scope.custInfo.principal;//当前负责人
                var solicitMemberLY = $scope.custInfo.solicitMemberLY||'';//去年招揽员
                var insurNumber = $scope.custInfo.insurNumber;//本店投保次数
                var zdZheKou =$scope.custInfo.zdZheKou;//最低折扣
                var insurDateLY =$scope.custInfo.insurDateLY;//去年投保日期
                var insuranceCompLY =$scope.custInfo.insuranceCompLY;//去年投保公司
                var insuranceCoverageLY =$scope.custInfo.insuranceCoverageLY;//去年保额
                var privilegeProLY =$scope.custInfo.privilegeProLY||'';//去年优惠项目
                var insuranceTypeLY =$scope.custInfo.insuranceTypeLY;//去年投保险种
                var remark =$scope.custInfo.remark;//备注

                var carOwner =$scope.custInfo.carOwner;//车主
                var insured =$scope.custInfo.insured;//被保险人
                var certificateNumber =$scope.custInfo.certificateNumber;//被保险人证件号
                var customerLevel =$scope.custInfo.customerLevel;//潜客级别
                var contact =$scope.custInfo.contact;//联系人
                var contactWay =$scope.custInfo.contactWay;//联系方式
                var address =$scope.custInfo.address;//现住址
                var isMaintainAgain =$scope.custInfo.isMaintainAgain;//是否本店再修客户
                if(isMaintainAgain==null||isMaintainAgain=='') {
                    if (!(isMaintainAgain == 0)) {
                        isMaintainAgain = -1
                    }
                }
                var maintainNumberLY =$scope.custInfo.maintainNumberLY;//去年本店维修次数
                var accidentNumberLY =$scope.custInfo.accidentNumberLY;//去年出险次数
                var accidentOutputValueLY =$scope.custInfo.accidentOutputValueLY;//去年事故车产值
                var serviceConsultant = '';//服务顾问
                var serviceConsultantId = -1;//服务顾问id
                if($scope.custInfo.serviceConsultant){
                    serviceConsultant = $scope.custInfo.serviceConsultant.userName;
                    serviceConsultantId = $scope.custInfo.serviceConsultant.id;
                };
                var customerCharacter =$scope.custInfo.customerCharacter;//客户性质
                var sfgyx =$scope.custInfo.sfgyx;//是否高意向
                if(sfgyx==null||sfgyx=='') {
                    if (!(sfgyx == 0)) {
                        sfgyx = -1
                    }
                }
                var customerDescription =$scope.custInfo.customerDescription;//客户描述
                var factoryLicenseType =$scope.custInfo.factoryLicenseType;//厂牌型号
                var carAnnualCheckUpDate =$scope.custInfo.carAnnualCheckUpDate;//车辆年审日期
                var insuredLY =$scope.custInfo.insuredLY;//去年被保险人
                var buyfromThisStore =$scope.custInfo.buyfromThisStore;//是否本店购买车辆
                var contactWayReserve =$scope.custInfo.contactWayReserve;//备选联系方式
                var fourSStoreId = $rootScope.user.store.storeId;
                var customerId = $scope.customerId;
                var ifUpdate = $scope.custInfo.ifUpdate;
                var bhInsuranceEndDate = $scope.custInfo.bhInsuranceEndDate;
                var bhUpdateTime = $scope.custInfo.bhUpdateTime;
                var updateStatus = $scope.custInfo.updateStatus;
                var ifLoan = $scope.custInfo.ifLoan;

                var updateData = {carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,engineNumber:engineNumber,
                    registrationDate:registrationDate,carBrand:carBrand,vehicleModel:vehicleModel,
                    syxrqEnd:syxrqEnd,jqxrqEnd:jqxrqEnd,renewalType:renewalType,renewalWay:renewalWay,principal:principal,
                    solicitMemberLY:solicitMemberLY,insurNumber:insurNumber,zdZheKou:zdZheKou,insurDateLY:insurDateLY,
                    insuranceCompLY:insuranceCompLY,insuranceCoverageLY:insuranceCoverageLY,privilegeProLY:privilegeProLY,
                    insuranceTypeLY:insuranceTypeLY, remark:remark,
                    carOwner:carOwner,insured:insured,certificateNumber:certificateNumber,customerLevel:customerLevel,
                    contact:contact,contactWay:contactWay, address:address,isMaintainAgain:isMaintainAgain,
                    maintainNumberLY:maintainNumberLY, accidentNumberLY:accidentNumberLY,accidentOutputValueLY:accidentOutputValueLY,
                    serviceConsultant:serviceConsultant,serviceConsultantId:serviceConsultantId,
                    customerCharacter:customerCharacter,sfgyx:sfgyx,customerDescription:customerDescription,
                    fourSStoreId:fourSStoreId,customerId:customerId,ifUpdate:ifUpdate,bhInsuranceEndDate:bhInsuranceEndDate,
                    insuredLY:insuredLY, factoryLicenseType:factoryLicenseType,carAnnualCheckUpDate:carAnnualCheckUpDate,
                    buyfromThisStore:buyfromThisStore,contactWayReserve:contactWayReserve,ifLoan:ifLoan,bhUpdateTime:bhUpdateTime,
                    updateStatus:updateStatus
                };
                var checkResult = checkService.qkxxxz(updateData);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };
                /*if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))
                    &&($filter('date')(jqxrqEnd,'yyyy-MM-dd') < $filter('date')(new Date(),'yyyy-MM-dd'))){
                    $scope.angularTip("交强险日期结束不能设置为今天以前",5000);
                    return;
                }*/
                $scope.updateCustMsg = function(){
                    $("#msgwindow").show();
                    customerSAService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.jqxrqEnd = jqxrqEnd;
                            $scope.thisRowData.customerLevel = customerLevel;
                            $scope.thisRowData.contact = contact;
                            $scope.thisRowData.contactWay = contactWay;
                            $scope.thisRowData.sfgyx = sfgyx;
                            $scope.thisRowData.chassisNumber = chassisNumber.toLocaleUpperCase();
                            if(bhInsuranceEndDate!=null&&bhInsuranceEndDate!=''){
                                var num1 = new Date(bhInsuranceEndDate).getTime()-28800000;
                                var num2 = new Date(jqxrqEnd).getTime()-28800000;
                                $scope.thisRowData.showNum = $scope.getNum(num1,num2);
                                $scope.thisRowData.bhInsuranceEndDate = $filter('date')(new Date(bhInsuranceEndDate).getTime(),'yyyy-MM-dd/EEE');
                            }else{
                                $scope.thisRowData.showNum = 0;
                            }
                            if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))){
                                $scope.thisRowData.remainLostInsurDay = Math.ceil(((new Date(jqxrqEnd )).getTime() - (new Date).getTime())/(24 * 60 * 60 * 1000));
                            }
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("修改成功",5000);
                            if($scope.footerBtn == "gzwc"){
                                $scope.traceFinishHandleFun();
                            }
                        }else {
                            if($scope.footerBtn == "gzwc"){
                                $scope.angularTip("保存潜客信息失败，无法跟踪完成",5000);
                            }else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        }
                    });
                };
                if($scope.footerBtn == "gz"){
                    $scope.updateCustMsg();
                    $scope.addNewTraceInitFun();
                }else if($scope.footerBtn == "ht"){
                    $scope.updateCustMsg();
                    $scope.traceReturnFun();
                }else if($scope.footerBtn == "gzwc"){
                    $scope.updateCustMsg();
                }else if($scope.footerBtn == "bj"){
                    $scope.updateCustMsg();
                    $scope.openbjfun();
                }else {
                    $("#msgwindow").show();
                    customerSAService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.jqxrqEnd = jqxrqEnd;
                            $scope.thisRowData.customerLevel = customerLevel;
                            $scope.thisRowData.contact = contact;
                            $scope.thisRowData.contactWay = contactWay;
                            $scope.thisRowData.sfgyx = sfgyx;
                            $scope.thisRowData.chassisNumber = chassisNumber.toLocaleUpperCase();
                            if(bhInsuranceEndDate!=null&&bhInsuranceEndDate!=''){
                                var num1 = new Date(bhInsuranceEndDate).getTime()-28800000;
                                var num2 = new Date(jqxrqEnd).getTime()-28800000;
                                $scope.thisRowData.showNum = $scope.getNum(num1,num2);
                                $scope.thisRowData.bhInsuranceEndDate = $filter('date')(new Date(bhInsuranceEndDate).getTime(),'yyyy-MM-dd/EEE');
                            }else{
                                $scope.thisRowData.showNum = 0;
                            }
                            if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))){
                                $scope.thisRowData.remainLostInsurDay = Math.ceil(((new Date(jqxrqEnd )).getTime() - (new Date).getTime())/(24 * 60 * 60 * 1000));
                            }
                            $("#genzcl").hide();
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("修改成功",5000);
                        }else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };
            //取消修改
            $scope.cancelChange = function(){
                $scope.CustValuebol = false;
                $("#changevalue").hide();
                if($scope.footerBtn == "gz"){
                    $scope.addNewTraceInitFun();
                }else if($scope.footerBtn == "ht"){
                    $scope.traceReturnFun();
                }else if($scope.footerBtn == "gzwc"){
                    $scope.traceFinishHandleFun();
                }else if($scope.footerBtn == "bj"){
                    $scope.openbjfun();
                }else{
                    $("#genzcl").hide();
                }

            };

            //跟踪按钮
            $scope.addNewTraceInit = function(){
                $scope.footerBtn = "gz";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.addNewTraceInitFun();
                }
            };
            //跟踪信息界面初始化
            $scope.addNewTraceInitFun = function(){
                $scope.newTrace = {};
                $scope.newTrace.sfgyx = $scope.custInfo.sfgyx;
                if($scope.custInfo.customerLevel){
                    $scope.newTrace.customerLevel=$scope.custInfo.customerLevel;
                    //$scope.newTrace.customerId=$scope.custInfo.customerId;
                    //customerSAService.setNextTraceDay($scope.newTrace.customerLevel, $scope.newTrace.customerId).then(function(result) {
                    //    if (result.status == 'OK') {
                    //        $scope.maxNextTraceDate = $filter('date')(result.results.content.results,'yyyy-MM-dd');
                    //        $scope.newTrace.nextTraceDate =  $scope.maxNextTraceDate;
                    //    } else {
                    //
                    //    }
                    //});
                    $scope.setNextTraceDay($scope.newTrace.customerLevel);
                }
                $("#trackCust").show();
                $scope.gzMsgValuebol = false;
                $(".gzMsg").change(function(){
                    $scope.gzMsgValuebol = true;
                });
            };
            //客户级别与下次跟踪日期联动
            $scope.custLevelCheck = function(){
                var customerLevel = $scope.newTrace.customerLevel;
                $scope.setNextTraceDay(customerLevel);
            };

            //计算下次跟踪日期
            $scope.setNextTraceDay = function(customerLevel){
                var daySets = $rootScope.user.daySets;
                for(var i =0;i<daySets.length;i++){
                    if(daySets[i].customerLevel == customerLevel){
                        var dayNumber = daySets[i].dayNumber;
                        var nextTraceDate = new Date( new Date().setDate(new Date().getDate() + dayNumber));
                        $scope.maxNextTraceDate = $filter('date')(nextTraceDate,'yyyy-MM-dd');
                        $scope.newTrace.nextTraceDate = $scope.maxNextTraceDate;
                    }
                }
            }

            //跟踪信息数据改变了是否保存
            $scope.closeChangeBtn = function(){
                // 新增了一个跟踪完成按钮,点关闭弹出的提示, 如果点击确定不知道调跟踪还是跟踪完成,所以不抬出提示,直接关闭
                //if ($scope.gzMsgValuebol == true) {
                //    $("#Genzongvalue").show();
                //    $scope.saveGenzong = function(){
                //        $scope.addNewTrace();
                //    };
                //    $scope.cancelGenzong = function(){
                //        $("#Genzongvalue").hide();
                //        $("#trackCust").hide();
                //    };
                //}else {
                    $("#trackCust").hide();
                //}
            };
            //添加新跟踪记录
            $scope.addNewTrace = function(traceFlag){
                var nextTraceDate = $scope.newTrace.nextTraceDate;
                var traceContext ="操作人:"+ $rootScope.user.userName+";"+"内容:"+ $scope.newTrace.traceContext;//跟踪内容
                var customerDescription = "";
                var sfjt = $scope.newTrace.sfjt;
                var sfgyx = $scope.newTrace.sfgyx;
                var customerId = $scope.customerId;
                var lxr = $scope.custInfo.contact;
                var lxfs = $scope.custInfo.contactWay;
                var cx = '';
                if($scope.custInfo.carBrand&&$scope.custInfo.carBrand.brandName == '异系'){
                    cx = $scope.custInfo.vehicleModelInput
                }else{
                    if($scope.custInfo.vehicleModel){
                        cx = $scope.custInfo.vehicleModel.modelName
                    }
                }
                var quote = '';
                var quotedPrice = '';
                var comeStore = '';
                var customerLevel = $scope.newTrace.customerLevel;
                var bxdqr = $scope.custInfo.jqxrqEnd;
                var principal = $scope.custInfo.principal;
                var principalId = $scope.custInfo.principalId;
                var renewalType = $filter('mapTBLX')($scope.custInfo.renewalType);

                var today = $filter('date')(new Date(),'yyyy-MM-dd');
                if($scope.newTrace.traceContext==""||$scope.newTrace.traceContext==null){
                    $scope.angularTip("请填写跟踪内容！",5000);
                    return;
                }
                if($scope.newTrace.nextTraceDate<today){
                    $scope.angularTip("下次跟踪日期必须大于等于当前日",5000);
                    return;
                }
                if($scope.newTrace.nextTraceDate>$scope.maxNextTraceDate){
                    $scope.angularTip("下次跟踪日期不能超过"+$scope.maxNextTraceDate,5000);
                    $scope.newTrace.nextTraceDate = $scope.maxNextTraceDate;
                    return;
                }
                if(sfgyx==null||sfgyx==-1){
                    $scope.angularTip("请选择是否高意向",5000);
                    return;
                }
                var newTraceDatas = {
                    customerId:customerId,lxr:lxr,lxfs:lxfs,
                    cx:cx,quote:quote,quotedPrice:quotedPrice,
                    comeStore:comeStore,customerLevel:customerLevel,sfjt:sfjt,sfgyx:sfgyx,
                    bxdqr:bxdqr,nextTraceDate:nextTraceDate,
                    traceContext:traceContext,customerDescription:customerDescription,
                    principal:principal,principalId:principalId,renewalType:renewalType
                };
                if(traceFlag==1||traceFlag==2){
                    $scope.traceSubmit(newTraceDatas,traceFlag);
                }else if(traceFlag==3){
                    if($scope.returnStatu==3){
                        $scope.angularTip("该潜客已经申请回退，当前在处于待审批状态，此操作不能进行！",5000);
                        return;
                    }
                    $("#ht").show();
                    $scope.makesure = function() {
                        if(!$scope.confirmData.htyy){
                            $scope.angularTip("原因不能为空",5000);
                            return;
                        }
                        $("#ht").hide();
                        $scope.traceSubmit(newTraceDatas,traceFlag,$scope.confirmData.htyy);
                    }
                }

            };
            $scope.traceSubmit = function(newTraceDatas,traceFlag,htyy,htyyxz){
                var today = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.gzMsgValuebol = true;
                $("#msgwindow").show();
                customerSAService.addTraceRecord(newTraceDatas,traceFlag,htyy,htyyxz)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status == 'OK') {
                            $scope.customerAll.data = result.results.content.list;
                            $("#Genzongvalue").hide();
                            $("#trackCust").hide();
                            $("#genzcl").hide();
                            if(traceFlag==2){
                                if($scope.pageType=='qkcx'){
                                    $scope.customerAllSearchPage.data.splice($scope.customerAllSearchPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policySearchCount = $scope.policySearchCount-1;
                                }else{
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policyCount = $scope.policyCount-1;
                                }
                            }else{
                                if($scope.pageType=='gz'&& $scope.traceStatu==1 && $scope.newTrace.nextTraceDate>today){
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policyCount = $scope.policyCount-1;
                                }else{
                                    $scope.thisRowData.customerLevel = $scope.newTrace.customerLevel;
                                    $scope.thisRowData.lastTraceResult = $scope.newTrace.traceContext;
                                    $scope.thisRowData.willingTraceDate = $scope.newTrace.nextTraceDate;
                                    $scope.thisRowData.lastTraceDate=$filter('date')(new Date(),'yyyy-MM-dd/EEE');
                                    $scope.thisRowData.gzCount = $scope.thisRowData.gzCount+1;
                                }
                            }
                            $scope.$emit("CountByUserIdTop", true);
                            if(traceFlag==1||traceFlag==2){
                                $scope.angularTip("跟踪信息添加成功！",5000);
                            }else if(traceFlag==3){
                                $scope.angularTip("跟踪信息添加成功！回退成功",5000);
                            }
                        } else if(result.results.content.status == 'dataException'){
                            $scope.angularTip( result.results.content.message,5000)
                        }else{
                            $scope.angularTip( result.results.content.message,5000)
                        };
                    });
            }
            //跟踪完成按钮
            $scope.traceFinishHandle = function(){
                $scope.footerBtn = "gzwc";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.traceFinishHandleFun();
                }
            };
            //跟踪完成
            $scope.traceFinishHandleFun = function(){
                customerSAService.findGzCount($scope.customerId)
                    .then(function (res) {
                        var gzCount =res.results.content.results.gzCount;
                        if(gzCount<=0){
                            $scope.addNewTraceInitFun();
                            $scope.angularTip("跟踪完成操作失败,每个潜客必须跟踪一次",5000);
                        }else{
                            $("#msgwindow").show();
                            customerSAService.traceFinishHandle($scope.customerId,$scope.principalId,$scope.principal)
                                .then(function (result) {
                                    $("#msgwindow").hide();
                                    if (result.status == 'OK') {
                                        if($scope.pageType!='qkcx'){
                                            $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                            $scope.policyCount = $scope.policyCount-1;
                                        }
                                        if($scope.pageType=='qkcx'){
                                            $scope.customerAllSearchPage.data.splice($scope.customerAllSearchPage.data.indexOf($scope.thisRowData), 1);
                                            $scope.policySearchCount = $scope.policySearchCount-1;
                                        }

                                        $scope.$emit("CountByUserIdTop", true);
                                        $("#genzcl").hide();
                                        $scope.angularTip("跟踪完成",5000);
                                    } else {
                                        $scope.angularTip(result.results.message,5000);
                                    }
                                });
                        }
                    });
            }

            //跟踪回退按钮
            $scope.traceReturn = function(){
                if($scope.returnStatu==3){
                    $scope.angularTip("该潜客已经申请回退，当前在处于待审批状态，此操作不能进行！",5000);
                    return;
                }
                $scope.footerBtn = "ht";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.traceReturnFun();
                }
            };
            //跟踪回退
            $scope.traceReturnFun = function(){
                $("#ht").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.htyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#ht").hide();
                    $("#msgwindow").show();
                    customerSAService.traceReturn($scope.customerId, $scope.confirmData.htyy,$scope.principalId,$scope.principal)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status=='OK') {
                                $scope.$emit("CountByUserIdTop", true);
                                $("#genzcl").hide();
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //更新接收状态
            $scope.updateAcceptStatu = function(){
                $("#msgwindow").show();
                customerSAService.updateAcceptStatu($scope.customerId,$scope.principalId,$scope.principal)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerNoReceivedPage.data.splice($scope.customerNoReceivedPage.data.indexOf($scope.thisRowData), 1);
                            $scope.policyCount = $scope.policyCount-1;
                            $scope.$emit("CountByUserIdTop", true);
                            $("#genzcl").hide();
                            $scope.angularTip("接收成功",5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
            };

            //批量更新接收状态
            $scope.userId = $rootScope.user.userId;
            $scope.userName = $rootScope.user.userName;
            $scope.superiorId = $scope.superiorId = $rootScope.user.superiorId;

            $scope.AcceptStatusubmit = function() {
                var SelectedCount = $scope.NoReceGridApi.selection.getSelectedCount();
                if(SelectedCount == 0){
                    $scope.angularTip("请先选择您需要接收的客户",5000)
                }else{
                    //选择选中状态的
                    $scope.AcceptDatas = [];
                    for (var i=0;i<SelectedCount;i++){
                        var customerId = $scope.NoReceGridApi.selection.getSelectedGridRows()[i].entity.customerId;
                        var principalId = $scope.NoReceGridApi.selection.getSelectedGridRows()[i].entity.principalId||-1;
                        var principal = $scope.NoReceGridApi.selection.getSelectedGridRows()[i].entity.principal||'';
                        var oneData = {
                            customerId: customerId,
                            userId:$scope.userId,
                            superiorId:$scope.superiorId,
                            userName:$scope.userName,
                            principalId:principalId,
                            principal:principal
                        }
                        $scope.AcceptDatas.push(oneData);
                    }
                    $("#msgwindow").show();
                    customerSAService.updateAcceptStatuBatch($scope.AcceptDatas).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.angularTip("接收成功",5000);
                            for (var i=0;i<SelectedCount;i++){
                                var onerow = $scope.NoReceGridApi.selection.getSelectedGridRows()[i]
                                $scope.customerNoReceivedPage.data.splice($scope.customerNoReceivedPage.data.indexOf(onerow.entity), 1);
                            }
                            $scope.policyCount = $scope.policyCount - SelectedCount;
                            $scope.NoReceGridApi.selection.clearSelectedRows();
                            $scope.$emit("CountByUserIdTop", true);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                            $scope.NoReceGridApi.selection.clearSelectedRows();
                            $scope.findByAcceptStatu('js',1);
                        }
                    });
                }

            };

            //手动请求壁虎刷新潜客信息
            $scope.manual = function(flag){
                var fourSStoreId = $rootScope.user.store.storeId;
                var userId = $rootScope.user.userId;
                var customerId = $scope.customerId;
                var carLicenseNumber = $scope.custInfo.carLicenseNumber;
                var chassisNumber = $scope.custInfo.chassisNumber;
                var engineNumber = $scope.custInfo.engineNumber;
                var certificateNumber = $scope.custInfo.certificateNumber;
                var condition = {
                    fourSStoreId:fourSStoreId,userId:userId,customerId: customerId, carLicenseNumber: carLicenseNumber,
                    chassisNumber: chassisNumber,engineNumber: engineNumber,flag:flag,certificateNumber:certificateNumber
                }
                $("#msgwindow").show();
                customerSAService.manual(condition).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.bhInfo = result.results.content.map;
                        $scope.bhInfo.syxrqEndDate = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                        $scope.bhInfo.bhInsuranceEndDate = $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd');
                        $scope.bhInfo.panduan = 2;
                        $("#bhmsg").show();
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }

            //确认覆盖信息
            $scope.bhCover = function(){
                var bo = false;
                $scope.custInfo.updateStatus = 1;
                if($scope.bhInfo.insuranceCompLY!=null&&$scope.bhInfo.insuranceCompLY!=''){
                    if($scope.custInfo.insuranceCompLY != $scope.bhInfo.insuranceCompLY){
                        $scope.custInfo.insuranceCompLY = $scope.bhInfo.insuranceCompLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insuranceTypeLY!=null&&$scope.bhInfo.insuranceTypeLY!=''){
                    if($scope.custInfo.insuranceTypeLY != $scope.bhInfo.insuranceTypeLY){
                        $scope.custInfo.insuranceTypeLY = $scope.bhInfo.insuranceTypeLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.carLicenseNumber!=null&&$scope.bhInfo.carLicenseNumber!=''){
                    if($scope.custInfo.carLicenseNumber != $scope.bhInfo.carLicenseNumber){
                        $scope.custInfo.carLicenseNumber = $scope.bhInfo.carLicenseNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.engineNumber!=null&&$scope.bhInfo.engineNumber!=''){
                    if($scope.custInfo.engineNumber != $scope.bhInfo.engineNumber){
                        $scope.custInfo.engineNumber = $scope.bhInfo.engineNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.bhInsuranceEndDate!=null&&$scope.bhInfo.bhInsuranceEndDate!=''){
                    if($scope.custInfo.bhInsuranceEndDate != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
                        var dateNum1 = new Date($scope.bhInfo.bhInsuranceEndDate).getTime()-28800000;
                        var dateNum2 = new Date($scope.custInfo.jqxrqEnd).getTime()-28800000;
                        $scope.custInfo.showNum = $scope.getNum(dateNum1,dateNum2);
                        $scope.custInfo.bhInsuranceEndDate = $scope.bhInfo.bhInsuranceEndDate;
                        $scope.custInfo.bhUpdateTime = 'yes';
                        bo =true;
                    }
                    if($scope.custInfo.jqxrqEnd != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
                        $scope.custInfo.jqxrqEnd = $scope.custInfo.bhInsuranceEndDate;
                        bo =true;
                    }
                }
                if($scope.bhInfo.syxrqEnd!=null&&$scope.bhInfo.syxrqEnd!=''){
                    if($scope.custInfo.syxrqEnd != $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd')){
                        $scope.custInfo.syxrqEnd = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                        bo =true;
                    }
                }
                if($scope.bhInfo.carOwner!=null&&$scope.bhInfo.carOwner!=''){
                    if($scope.custInfo.carOwner != $scope.bhInfo.carOwner){
                        $scope.custInfo.carOwner = $scope.bhInfo.carOwner;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insured!=null&&$scope.bhInfo.insured!=''){
                    if($scope.custInfo.insured != $scope.bhInfo.insured){
                        $scope.custInfo.insured = $scope.bhInfo.insured;
                        bo =true;
                    }
                }
                if($scope.bhInfo.certificateNumber!=null&&$scope.bhInfo.certificateNumber!=''){
                    if($scope.custInfo.certificateNumber != $scope.bhInfo.certificateNumber){
                        $scope.custInfo.certificateNumber = $scope.bhInfo.certificateNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.customerCharacter!=null&&$scope.bhInfo.customerCharacter!=''){
                    if($scope.custInfo.customerCharacter != $scope.bhInfo.customerCharacter){
                        $scope.custInfo.customerCharacter = $scope.bhInfo.customerCharacter;
                        bo =true;
                    }
                }
                if($scope.bhInfo.chejiahao!=null&&$scope.bhInfo.chejiahao!=''){
                    if($scope.custInfo.chassisNumber != $scope.bhInfo.chejiahao){
                        $scope.custInfo.chassisNumber = $scope.bhInfo.chejiahao;
                        bo =true;
                    }
                }
                if($scope.bhInfo.modleName!=null&&$scope.bhInfo.modleName!=''){
                    if($scope.custInfo.factoryLicenseType != $scope.bhInfo.modleName){
                        $scope.custInfo.factoryLicenseType = $scope.bhInfo.modleName;
                        bo =true;
                    }
                }
                if($scope.bhInfo.registerDate!=null&&$scope.bhInfo.registerDate!=''){
                    if($scope.custInfo.registrationDate != $scope.bhInfo.registerDate){
                        $scope.custInfo.registrationDate = $scope.bhInfo.registerDate;
                        bo =true;
                    }
                }
                $("#bhmsg").hide();
                $scope.CustValuebol = bo;
            }

            //关闭壁虎信息窗口
            $scope.bhclose = function() {
                $("#bhmsg").hide();
            }
            //报价按钮
            $scope.open_BJ = function(){
                $scope.footerBtn = "bj";
                $scope.carModelAll={}; //清空查询的品牌型号
                var re_card = /^[\u4E00-\u9Fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$/;
                if(($scope.bhDock==1||$scope.bhDock==3) && !(re_card.test($scope.custInfo.carLicenseNumber))){
                    $scope.angularTip("车牌号格式不对！（例如：京Q11111）",5000);
                    return;
                };
                $scope.bihubaojia.ForceTax = 1;
                customerSAService.findBxInfoForBH( $scope.customerId).then(function(result){
                    if (result.status == 'OK' && result.results.success == true) {
                        var BxInfoAll = result.results.content.results;
                        if(BxInfoAll.daoQiang>0){
                            $scope.bihubaojia.DaoQiang = 1;
                        };
                        if(BxInfoAll.cheSun>0){
                            $scope.bihubaojia.CheSun = 1;
                        };
                        if(BxInfoAll.sanZhe>0){
                            $scope.bihubaojia.SanZheck = 1;
                            $scope.bihubaojia.SanZhe = BxInfoAll.sanZhe;
                        };
                        if(BxInfoAll.siJi>0){
                            $scope.bihubaojia.SiJick = 1;
                            $scope.bihubaojia.SiJi = BxInfoAll.siJi;
                        };
                        if(BxInfoAll.chengKe>0){
                            $scope.bihubaojia.ChengKeck = 1;
                            $scope.bihubaojia.ChengKe = BxInfoAll.chengKe;
                        };
                        $scope.bihubaojia.BuJiMianCheSun = BxInfoAll.buJiMianCheSun;
                        $scope.bihubaojia.BuJiMianDaoQiang = BxInfoAll.buJiMianDaoQiang;
                        $scope.bihubaojia.BuJiMianSanZhe = BxInfoAll.buJiMianSanZhe;
                        $scope.bihubaojia.BuJiMianSiJi = BxInfoAll.buJiMianSiJi;
                        $scope.bihubaojia.BuJiMianChengKe = BxInfoAll.buJiMianChengKe;
                        $scope.bihubaojia.BuJiMianHuaHen = BxInfoAll.buJiMianHuaHen;
                        $scope.bihubaojia.BuJiMianSheShui = BxInfoAll.buJiMianSheShui;
                        $scope.bihubaojia.BuJiMianZiRan = BxInfoAll.buJiMianZiRan;
                        $scope.bihubaojia.buJiMianJingShenSunShi = BxInfoAll.BuJiMianJingShenSunShi;
                        if(BxInfoAll.sheShui>0){
                            $scope.bihubaojia.SheShui = 1;
                        };
                        if(BxInfoAll.ziRan>0){
                            $scope.bihubaojia.ZiRan = 1;
                        };
                        if(BxInfoAll.hcSanFangTeYue>0){
                            $scope.bihubaojia.HcSanFangTeYue = 1;
                        };
                        if(BxInfoAll.boLi>0){
                            $scope.bihubaojia.BoLick = 1;
                            $scope.bihubaojia.BoLi = BxInfoAll.boLi;
                        };
                        if(BxInfoAll.huaHen>0){
                            $scope.bihubaojia.HuaHenck = 1;
                            $scope.bihubaojia.HuaHen = BxInfoAll.huaHen;
                        };
                        if(BxInfoAll.hcJingShenSunShi>0){
                            $scope.bihubaojia.HcJingShenck = 1;
                            $scope.bihubaojia.HcJingShenSunShi = BxInfoAll.hcJingShenSunShi;
                        };
                        if(BxInfoAll.hcXiuLiChang>0){
                            $scope.bihubaojia.HcXiuLick = 1;
                            $scope.bihubaojia.HcXiuLiChang = BxInfoAll.hcXiuLiChang;
                        };
                    } else {

                    }
                });
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.openbjfun();
                }
            };
            //行驶证默认填写
            $scope.xszDefult = function(){
                if($scope.custInfo){
                    $scope.bihubaojia.LicenseNo = $scope.custInfo.carLicenseNumber||"";
                    $scope.bihubaojia.CarVin = $scope.custInfo.chassisNumber||"";
                    $scope.bihubaojia.EngineNo = $scope.custInfo.engineNumber||"";
                    $scope.bihubaojia.RegisterDate = $scope.custInfo.registrationDate||"";
                    var carBrand = '';//品牌
                    var vehicleModel = '';//车辆型号
                    var factoryLicenseType = "";
                    if($scope.custInfo.factoryLicenseType=="null"){
                        factoryLicenseType = "";
                    }else{
                        factoryLicenseType = $scope.custInfo.factoryLicenseType||'';
                    }
                    $scope.bihubaojia.MoldName =factoryLicenseType;
                }
            }
            //打开增加报价页面
            $scope.openbjfun = function(){
                $scope.xszDefult();
                $('#add_bj').show();
                $("#bihubaojia").hide();
                $("#bihuRequest").show();
            }

            //关闭增加报价页面
            $scope.closeNew_bj = function(){
                $('#add_bj').hide();
                $scope.footerBtn = "";
                $scope.bihubaojia = {};
                for(var j=0;j<$scope.insuranceCompNames.length;j++){
                    $scope.insuranceCompNames[j].sfbj = 0;
                    $scope.insuranceCompNames[j].sfhb = 0
                }
            };
            //壁虎报价
            $scope.bihubaojia = {};
            $scope.bihuquote = {};
            $scope.BoLis = [
                {site : "不投保", value : 0},
                {site : "国产", value : 1},
                {site : "进口", value : 2}
            ];
            $scope.bihubaojia.BoLi=0;
            $scope.sjCheck = function(){
                if($scope.bihubaojia.SiJick==1){
                    $scope.bihubaojia.SiJi = 10000;
                }else{
                    $scope.bihubaojia.SiJi = undefined;
                }
            }
            $scope.ckCheck = function(){
                if($scope.bihubaojia.ChengKeck==1){
                    $scope.bihubaojia.ChengKe = 10000;
                }else{
                    $scope.bihubaojia.ChengKe = undefined;
                }
            }
            $scope.SanZhes = [
                {site : "5万", value : 50000},
                {site : "10万", value : 100000},
                {site : "15万", value : 150000},
                {site : "20万", value : 200000},
                {site : "30万", value : 300000},
                {site : "50万", value : 500000},
                {site : "100万", value : 1000000},
                {site : "150万", value : 1500000},
                {site : "200万", value : 2000000}
            ];
            $scope.HuaHens = [2000,5000,10000,20000];
            //行驶证报价---车辆用途改变时方法
            $scope.changeCarUsedType = function(){
                var CarUsedType = $scope.bihubaojia.CarUsedType||0;
                if(CarUsedType==2||CarUsedType==3){
                    $scope.bihubaojia.OwnerIdCardType = 2;
                }
            }
            //查询品牌型号
            $scope.searchMoldName = function(){
                $scope.carModelAll={};
                var licenseNo = $scope.bihubaojia.LicenseNo;
                var carVin = $scope.bihubaojia.CarVin;
                var engineNo = $scope.bihubaojia.EngineNo;
                var moldName = $scope.bihubaojia.MoldName;
                var Data = {licenseNo:licenseNo,carVin:carVin,engineNo:engineNo,moldName:moldName};
                if(moldName==""||moldName==null){
                    $scope.angularTip("请输入品牌型号！",5000);
                    return;
                }
                if(moldName.length<5){
                    $scope.angularTip("输入品牌型号长度需大于5",5000);
                    return;
                }
                $("#msgwindow").show();
                customerSAService.getModels(Data).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.carModelAll = result.results.content.results;
                        $("#brandList").show();
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }
            $scope.chooseModel = function(car){
                $scope.bihubaojia.MoldName = car.models;
                $scope.bihubaojia.carModeltype = car;
                $("#brandList").hide();
            }
            $scope.closeBrandList = function(){
                $("#brandList").hide();
            }
            $scope.bihuQuote_b = function(bjType){
                if( $scope.bihubaojia.SanZheck==0){
                    $scope.bihubaojia.SanZhe = 0;
                }
                if( $scope.bihubaojia.SiJick==0){
                    $scope.bihubaojia.SiJi = 0;
                }
                if( $scope.bihubaojia.ChengKeck==0){
                    $scope.bihubaojia.ChengKe = 0;
                }
                if( $scope.bihubaojia.BoLick==0){
                    $scope.bihubaojia.BoLi = 0;
                }
                if( $scope.bihubaojia.HuaHenck==0){
                    $scope.bihubaojia.HuaHen = 0;
                }
                if( $scope.bihubaojia.HcHuock==0){
                    $scope.bihubaojia.HcHuoWuZeRen = 0;
                }
                if( $scope.bihubaojia.HcJingShenck==0){
                    $scope.bihubaojia.HcJingShenSunShi = 0;
                }
                if( $scope.bihubaojia.HcFeiYongck==0){
                    $scope.bihubaojia.HcFeiYongBuChang = 0;
                }
                if( $scope.bihubaojia.HcXiuLick==0){
                    $scope.bihubaojia.HcXiuLiChang = 0;
                }
                var storeId = $rootScope.user.store.storeId;
                var userId = $rootScope.user.userId;
                var customerId = $scope.customerId;
                var LicenseNo = $scope.bihubaojia.LicenseNo||0;
                var CarVin = $scope.bihubaojia.CarVin||0;
                var EngineNo = $scope.bihubaojia.EngineNo||0;
                var RegisterDate = $scope.bihubaojia.RegisterDate||0;
                var MoldName = $scope.bihubaojia.MoldName||0;
                var CarUsedType = $scope.bihubaojia.CarUsedType||0;
                var OwnerIdCardType = $scope.bihubaojia.OwnerIdCardType||0;
                var CarOwnersName =$scope.bihubaojia.CarOwnersName;
                var IdCard =$scope.bihubaojia.IdCard;
                var ForceTimeStamp =$scope.bihubaojia.ForceTimeStamp||0;
                var BizTimeStamp =$scope.bihubaojia.BizTimeStamp||0;
                ForceTimeStamp = Math.round(new Date(ForceTimeStamp).getTime()/1000);
                BizTimeStamp = Math.round(new Date(BizTimeStamp).getTime()/1000);
                var ForceTax = $scope.bihubaojia.ForceTax||0;
                var BuJiMianCheSun = $scope.bihubaojia.BuJiMianCheSun||0;
                var BuJiMianDaoQiang = $scope.bihubaojia.BuJiMianDaoQiang||0;
                var BuJiMianSanZhe = $scope.bihubaojia.BuJiMianSanZhe||0;
                var BuJiMianChengKe = $scope.bihubaojia.BuJiMianChengKe||0;
                var BuJiMianSiJi = $scope.bihubaojia.BuJiMianSiJi||0;
                var BuJiMianHuaHen = $scope.bihubaojia.BuJiMianHuaHen||0;
                var BuJiMianSheShui = $scope.bihubaojia.BuJiMianSheShui||0;
                var BuJiMianZiRan = $scope.bihubaojia.BuJiMianZiRan||0;
                var BuJiMianJingShenSunShi = $scope.bihubaojia.BuJiMianJingShenSunShi||0;
                var SheShui = $scope.bihubaojia.SheShui||0;
                var CheSun = $scope.bihubaojia.CheSun||0;
                var DaoQiang = $scope.bihubaojia.DaoQiang||0;
                var ZiRan = $scope.bihubaojia.ZiRan||0;
                var HcSheBeiSunshi = $scope.bihubaojia.HcSheBeiSunshi||0;
                var HcSanFangTeYue = $scope.bihubaojia.HcSanFangTeYue||0;
                var BoLi = $scope.bihubaojia.BoLi||0;
                var SiJi = $scope.bihubaojia.SiJi||0;
                var SanZhe = 0;
                if($scope.bihubaojia.SanZhe){
                    SanZhe = $scope.bihubaojia.SanZhe||0;
                };
                var ChengKe = $scope.bihubaojia.ChengKe||0;
                var HcHuoWuZeRen = $scope.bihubaojia.HcHuoWuZeRen||0;
                var HcFeiYongBuChang = $scope.bihubaojia.HcFeiYongBuChang||0;
                var HuaHen = $scope.bihubaojia.HuaHen||0;
                var HcJingShenSunShi = $scope.bihubaojia.HcJingShenSunShi||0;
                var HcXiuLiChang = $scope.bihubaojia.HcXiuLiChang||0;
                var BizStartDate = $scope.custInfo.syxrqEnd ||"";
                //行驶证报价检验行驶证信息
                if(bjType==2){
                    var xszInfo = {
                        LicenseNo:LicenseNo,CarVin:CarVin,EngineNo:EngineNo,RegisterDate:RegisterDate,MoldName:MoldName,
                        CarUsedType:CarUsedType,OwnerIdCardType:OwnerIdCardType,CarOwnersName:CarOwnersName,IdCard:IdCard
                    }
                    var checkXszInfo = checkService.xszInfo(xszInfo);
                }
                if(bjType==2&&checkXszInfo.status==false){
                    $scope.angularTip(checkXszInfo.message,5000);
                    return;
                }
                //约束信息条件
                $scope.bjxz = {
                    BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
                    BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
                    BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
                    HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
                    HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang
                }
                var checkbjxz = {
                    BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
                    BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
                    BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
                    HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
                    HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang,LicenseNo:LicenseNo
                }

                //判定约束条件
                var checkResult = checkService.bjtbxz(checkbjxz,$scope.bihubaojia);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };

                var num = parseInt(BuJiMianCheSun+BuJiMianDaoQiang+BuJiMianSanZhe+BuJiMianChengKe+BuJiMianSiJi+BuJiMianHuaHen+BuJiMianSheShui+BuJiMianZiRan+
                    BuJiMianJingShenSunShi+SheShui+CheSun+DaoQiang+ZiRan+HcSheBeiSunshi+HcSanFangTeYue+BoLi+SiJi+SanZhe+ChengKe+HcHuoWuZeRen+
                    HcFeiYongBuChang+HuaHen+HcJingShenSunShi+HcXiuLiChang);
                var QuoteGroup = [];
                var inscomBol = 0;
                var bhinscomBol = 0;
                for(var j=0;j<$scope.insuranceCompNames.length;j++){
                    if($scope.insuranceCompNames[j].sfbj ==1){
                        inscomBol = 1;
                    };
                    if($scope.insuranceCompNames[j].source != null && $scope.insuranceCompNames[j].sfbj ==1){
                        var arr = {source: $scope.insuranceCompNames[j].source,
                            insuranceCompName:$scope.insuranceCompNames[j].insuranceCompName,
                            sfbj: $scope.insuranceCompNames[j].sfbj,
                            sfhb: $scope.insuranceCompNames[j].sfhb||0
                        };
                        QuoteGroup.push(arr);
                        bhinscomBol = 1;
                    }
                };

                if(inscomBol==0){
                    $scope.angularTip("请选择保险公司！",5000);
                    return;
                }else if(num==0 && ForceTax==0){
                    $scope.angularTip("请选择险种！",5000);
                    return;
                }else if(num!=0 && ForceTax==0){
                    ForceTax =0;
                }else if(num!=0 && ForceTax==1){
                    ForceTax =1;
                }else if(num==0 && ForceTax==1){
                    ForceTax =2;
                };
                if(ForceTax==0&&BizTimeStamp==0){
                    $scope.angularTip("单商业险报价，商业险起保日期不能为空！",5000);
                    return;
                }

                var quoteDatas = {
                    storeId:storeId,
                    userId:userId,
                    customerId:customerId,
                    source:QuoteGroup,
                    bjType:bjType||0,
                    bjInfo:{
                        LicenseNo:LicenseNo,ForceTimeStamp:ForceTimeStamp,BizTimeStamp:BizTimeStamp,
                        ForceTax:ForceTax,BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
                        BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
                        BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
                        HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
                        HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang
                    }
                };

                if(bjType==2){
                    quoteDatas.bjInfo.CarVin = CarVin;
                    quoteDatas.bjInfo.EngineNo = EngineNo;
                    quoteDatas.bjInfo.RegisterDate = RegisterDate;
                    quoteDatas.bjInfo.MoldName = MoldName;
                    if($scope.bihubaojia.carModeltype && MoldName == $scope.bihubaojia.carModeltype.VehicleName){
                        quoteDatas.bjInfo.MoldName = $scope.bihubaojia.carModeltype.VehicleName;
                        quoteDatas.bjInfo.PurchasePrice = $scope.bihubaojia.carModeltype.PurchasePrice;
                        quoteDatas.bjInfo.AutoMoldCode = $scope.bihubaojia.carModeltype.VehicleNo;
                        quoteDatas.bjInfo.ExhaustScale = $scope.bihubaojia.carModeltype.VehicleExhaust;
                        quoteDatas.bjInfo.SeatCount = $scope.bihubaojia.carModeltype.VehicleSeat;
                        quoteDatas.bjInfo.VehicleSource = $scope.bihubaojia.carModeltype.Source;
                    }
                }
                if(CarUsedType&&(CarUsedType==2||CarUsedType==3)){
                    quoteDatas.bjInfo.CarUsedType = CarUsedType;
                    quoteDatas.bjInfo.OwnerIdCardType = OwnerIdCardType;
                    quoteDatas.bjInfo.CarOwnersName = CarOwnersName;
                    quoteDatas.bjInfo.IdCard = IdCard;
                }
                $scope.forceTax = ForceTax;

                $("#msgwindow").show();
                if(bhinscomBol == 1){
                    customerSAService.bihuApplyBJ(quoteDatas).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.success==true){
                            $scope.bihuquote = result.results.content.results;
                            $scope.bihuquote.PayAmount = 0;
                            if($scope.bihuquote.cXinfo && ($scope.bihuquote.cXinfo!=""||$scope.bihuquote.cXinfo!=null)){
                                $scope.bihuquote.accidentNumberLY = $scope.bihuquote.cXinfo.List.length;
                                if($scope.bihuquote.accidentNumberLY>0){
                                    for(var i=0;i<$scope.bihuquote.accidentNumberLY;i++){
                                        $scope.bihuquote.PayAmount +=$scope.bihuquote.cXinfo.List[i].PayAmount;
                                    }
                                };
                            };
                            if(bjType==2){
                                $scope.bihuquote.xbInfo.UserInfo = {LicenseNo:LicenseNo,CarVin:CarVin,ModleName:MoldName}
                            }
                            $scope.bihuComps = $scope.bihuquote.bj;
                            for(var n=0;n<$scope.insuranceCompNames.length;n++){
                                if($scope.insuranceCompNames[n].sfbj ==1 && $scope.insuranceCompNames[n].source == null){
                                    var compArr = {
                                        source:0,
                                        insuranceCompName:$scope.insuranceCompNames[n].insuranceCompName
                                    };
                                    $scope.bihuComps.push(compArr);
                                }
                            };
                            //$("#bihuRequest").hide();
                            $("#bihubaojia").show();
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }else {
                    $("#msgwindow").hide();
                    $scope.bihuquote = {
                        bj:[],
                        xbInfo:{
                            UserInfo:{}
                        }
                    };
                    $scope.bihuquote.xbInfo.UserInfo.LicenseNo =  $scope.bihubaojia.LicenseNo;
                    $scope.bihuquote.xbInfo.UserInfo.CarVin =  $scope.bihubaojia.CarVin;
                    $scope.bihuquote.xbInfo.UserInfo.ModleName =  $scope.bihubaojia.MoldName;
                    $scope.bihuquote.accidentNumberLY = 0;
                    $scope.bihuquote.PayAmount = 0;
                    $scope.bihuComps = $scope.bihuquote.bj;
                    for(var n=0;n<$scope.insuranceCompNames.length;n++){
                        if($scope.insuranceCompNames[n].sfbj ==1 && $scope.insuranceCompNames[n].source == null){
                            var compArr = {
                                source:0,
                                insuranceCompName:$scope.insuranceCompNames[n].insuranceCompName
                            };
                            $scope.bihuComps.push(compArr);
                        }
                    };
                    //$("#bihuRequest").hide();
                    $("#bihubaojia").show();
                }
            };
            //博福报价
            $scope.bofideQuote = function(bjType){
                var bjType = bjType;
                if( $scope.bihubaojia.SanZheck==0){
                    $scope.bihubaojia.SanZhe = 0;
                }
                if( $scope.bihubaojia.SiJick==0){
                    $scope.bihubaojia.SiJi = 0;
                }
                if( $scope.bihubaojia.ChengKeck==0){
                    $scope.bihubaojia.ChengKe = 0;
                }
                if( $scope.bihubaojia.BoLick==0){
                    $scope.bihubaojia.BoLi = 0;
                }
                if( $scope.bihubaojia.HuaHenck==0){
                    $scope.bihubaojia.HuaHen = 0;
                }
                if( $scope.bihubaojia.HcHuock==0){
                    $scope.bihubaojia.HcHuoWuZeRen = 0;
                }
                if( $scope.bihubaojia.HcJingShenck==0){
                    $scope.bihubaojia.HcJingShenSunShi = 0;
                }
                if( $scope.bihubaojia.HcFeiYongck==0){
                    $scope.bihubaojia.HcFeiYongBuChang = 0;
                }
                if( $scope.bihubaojia.HcXiuLick==0){
                    $scope.bihubaojia.HcXiuLiChang = 0;
                }
                var storeId = $rootScope.user.store.storeId;
                var userId = $rootScope.user.userId;
                var customerId = $scope.customerId;
                var LicenseNo = $scope.bihubaojia.LicenseNo;
                var CarVin = $scope.bihubaojia.CarVin;
                var EngineNo = $scope.bihubaojia.EngineNo;
                var ForceTimeStamp = $scope.bihubaojia.ForceTimeStamp;
                var BizTimeStamp = $scope.bihubaojia.BizTimeStamp;
                var stRegisterDate = $scope.bihubaojia.RegisterDate;
                var newCarPrice = $scope.bihubaojia.newCarPrice;
                var MoldName = $scope.bihubaojia.MoldName;
                var carUsedType = $scope.bihubaojia.CarUsedType;
                var ownerIdCardType = $scope.bihubaojia.OwnerIdCardType;
                var carOwnersName = $scope.bihubaojia.CarOwnersName;
                var idCard = $scope.bihubaojia.IdCard;

                var ForceTax = $scope.bihubaojia.ForceTax||0;
                var BuJiMianCheSun = $scope.bihubaojia.BuJiMianCheSun||0;
                var BuJiMianDaoQiang = $scope.bihubaojia.BuJiMianDaoQiang||0;
                var BuJiMianSanZhe = $scope.bihubaojia.BuJiMianSanZhe||0;
                var BuJiMianChengKe = $scope.bihubaojia.BuJiMianChengKe||0;
                var BuJiMianSiJi = $scope.bihubaojia.BuJiMianSiJi||0;
                var BuJiMianHuaHen = $scope.bihubaojia.BuJiMianHuaHen||0;
                var BuJiMianSheShui = $scope.bihubaojia.BuJiMianSheShui||0;
                var BuJiMianZiRan = $scope.bihubaojia.BuJiMianZiRan||0;
                var BuJiMianJingShenSunShi = $scope.bihubaojia.BuJiMianJingShenSunShi||0;
                var SheShui = $scope.bihubaojia.SheShui||0;
                var CheSun = $scope.bihubaojia.CheSun||0;
                var DaoQiang = $scope.bihubaojia.DaoQiang||0;
                var ZiRan = $scope.bihubaojia.ZiRan||0;
                var HcSheBeiSunshi = $scope.bihubaojia.HcSheBeiSunshi||0;
                var HcSanFangTeYue = $scope.bihubaojia.HcSanFangTeYue||0;
                var BoLi = $scope.bihubaojia.BoLi||0;
                var SiJi = $scope.bihubaojia.SiJi||0;
                var SanZhe = 0;
                if($scope.bihubaojia.SanZhe){
                    SanZhe = $scope.bihubaojia.SanZhe||0;
                };
                var ChengKe = $scope.bihubaojia.ChengKe||0;
                var HcHuoWuZeRen = $scope.bihubaojia.HcHuoWuZeRen||0;
                var HcFeiYongBuChang = $scope.bihubaojia.HcFeiYongBuChang||0;
                var HuaHen = $scope.bihubaojia.HuaHen||0;
                var HcJingShenSunShi = $scope.bihubaojia.HcJingShenSunShi||0;
                var HcXiuLiChang = $scope.bihubaojia.HcXiuLiChang||0;
                var BizStartDate = $scope.custInfo.syxrqEnd ||"";
                if((LicenseNo==null||LicenseNo=="")&&(CarVin==null||CarVin=="")){
                    $scope.angularTip("请填写车牌号或者车架号",5000);
                    return;
                }
                //行驶证报价检验行驶证信息
                if(bjType==2){
                    if(newCarPrice==null||newCarPrice==""){
                        $scope.angularTip("请填写新车购买价格",5000);
                        return;
                    }
                    var xszInfo = {
                        LicenseNo:LicenseNo,CarVin:CarVin,EngineNo:EngineNo,RegisterDate:stRegisterDate,MoldName:MoldName,
                        CarUsedType:carUsedType,OwnerIdCardType:ownerIdCardType,CarOwnersName:carOwnersName,IdCard:idCard
                    }
                    var checkXszInfo = checkService.xszInfo(xszInfo);
                }
                if(bjType==2&&checkXszInfo.status==false){
                    $scope.angularTip(checkXszInfo.message,5000);
                    return;
                }
                $scope.bjxz = {
                    BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
                    BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
                    BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
                    HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
                    HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang
                }
                var checkbjxz = {
                    BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
                    BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
                    BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
                    HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
                    HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang,LicenseNo:"京Q11111"
                } //车牌号已验证，略过
                //判定约束条件
                var checkResult = checkService.bjtbxz(checkbjxz,$scope.bihubaojia);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };
                var num = parseInt(BuJiMianCheSun+BuJiMianDaoQiang+BuJiMianSanZhe+BuJiMianChengKe+BuJiMianSiJi+BuJiMianHuaHen+BuJiMianSheShui+BuJiMianZiRan+
                    BuJiMianJingShenSunShi+SheShui+CheSun+DaoQiang+ZiRan+HcSheBeiSunshi+HcSanFangTeYue+BoLi+SiJi+SanZhe+ChengKe+HcHuoWuZeRen+
                    HcFeiYongBuChang+HuaHen+HcJingShenSunShi+HcXiuLiChang);
                var insuranceCompanys = [];
                var inscomBol = 0;
                var bhinscomBol = 0;
                for(var j=0;j<$scope.insuranceCompNames.length;j++){
                    if($scope.insuranceCompNames[j].sfbj ==1){
                        inscomBol = 1;
                    };
                    if($scope.insuranceCompNames[j].insuranceKey!="" && $scope.insuranceCompNames[j].insuranceKey!=null && $scope.insuranceCompNames[j].sfbj ==1){
                        insuranceCompanys.push($scope.insuranceCompNames[j].insuranceKey);
                        bhinscomBol = 1;
                    }
                };
                insuranceCompanys = insuranceCompanys.join(",");
                if(inscomBol==0){
                    $scope.angularTip("请选择保险公司！",5000);
                    return;
                }else if(num==0 && ForceTax==0){
                    $scope.angularTip("请选择险种！",5000);
                    return;
                }else if(num!=0 && ForceTax==0){
                    ForceTax =0;
                }else if(num!=0 && ForceTax==1){
                    ForceTax =1;
                }else if(num==0 && ForceTax==1){
                    ForceTax =2;
                };
                $scope.forceTax = ForceTax;
                if(ForceTax==0&&BizStartDate==""){
                    $scope.angularTip("单商业险报价，商业险日期结束不能为空！",5000);
                    return;
                }
                var compulsory;
                var commercial;
                if(ForceTax==0){
                    compulsory = false
                }else if(ForceTax==1||ForceTax ==2){
                    compulsory = true
                };
                if(num==0){
                    commercial = false
                }else if(num!=0){
                    commercial = true
                }
                var quoteInsuranceVos = [];
                if($scope.bihubaojia.CheSun==1){
                    var BuJiMianCheSun;
                    if($scope.bihubaojia.BuJiMianCheSun==1){
                        BuJiMianCheSun = true;
                    }else {
                        BuJiMianCheSun = false;
                    }
                    var arr = {
                        "insuranceCode": "01",
                        "isDeductible": BuJiMianCheSun,
                        "isLossDeductible": false
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.SanZheck==1){
                    var BuJiMianSanZhe;
                    if($scope.bihubaojia.BuJiMianSanZhe==1){
                        BuJiMianSanZhe = true;
                    }else {
                        BuJiMianSanZhe = false;
                    }
                    var arr = {
                        "insuranceCode": "02",
                        "isDeductible": BuJiMianSanZhe,
                        "amount": $scope.bihubaojia.SanZhe
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.SiJick==1){
                    var BuJiMianSiJi;
                    if($scope.bihubaojia.BuJiMianSiJi==1){
                        BuJiMianSiJi = true;
                    }else {
                        BuJiMianSiJi = false;
                    }
                    var arr = {
                        "insuranceCode": "03",
                        "isDeductible": BuJiMianSiJi,
                        "amount": $scope.bihubaojia.SiJi
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.ChengKeck==1){
                    var BuJiMianChengKe;
                    if($scope.bihubaojia.BuJiMianChengKe==1){
                        BuJiMianChengKe = true;
                    }else {
                        BuJiMianChengKe = false;
                    }
                    var arr = {
                        "insuranceCode": "04",
                        "isDeductible": BuJiMianChengKe,
                        "amount": $scope.bihubaojia.ChengKe
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.DaoQiang==1){
                    var BuJiMianDaoQiang;
                    if($scope.bihubaojia.BuJiMianDaoQiang==1){
                        BuJiMianDaoQiang = true;
                    }else {
                        BuJiMianDaoQiang = false;
                    }
                    var arr = {
                        "insuranceCode": "05",
                        "isDeductible": BuJiMianDaoQiang
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.BoLick==1){
                    var BoLi;
                    if($scope.bihubaojia.BoLi==1){
                        BoLi = "0";
                    }else if($scope.bihubaojia.BoLi==2){
                        BoLi = "1";
                    }
                    var arr = {
                        "insuranceCode": "06",
                        "producingArea": BoLi
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.ZiRan==1){
                    var BuJiMianZiRan;
                    if($scope.bihubaojia.BuJiMianZiRan==1){
                        BuJiMianZiRan = true;
                    }else {
                        BuJiMianZiRan = false;
                    }
                    var arr = {
                        "insuranceCode": "07",
                        "isDeductible": BuJiMianZiRan
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HuaHenck==1){
                    var BuJiMianHuaHen;
                    if($scope.bihubaojia.BuJiMianHuaHen==1){
                        BuJiMianHuaHen = true;
                    }else {
                        BuJiMianHuaHen = false;
                    }
                    var arr = {
                        "insuranceCode": "08",
                        "isDeductible": BuJiMianHuaHen,
                        "amount": $scope.bihubaojia.HuaHen
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.SheShui==1){
                    var BuJiMianSheShui;
                    if($scope.bihubaojia.BuJiMianSheShui==1){
                        BuJiMianSheShui = true;
                    }else {
                        BuJiMianSheShui = false;
                    }
                    var arr = {
                        "insuranceCode": "09",
                        "isDeductible": BuJiMianSheShui
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HcHuock==1){
                    var arr = {
                        "insuranceCode": "10",
                        "isDeductible": false,
                        "amount": $scope.bihubaojia.HcHuoWuZeRen
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HcJingShenck==1){
                    var BuJiMianJingShenSunShi;
                    if($scope.bihubaojia.BuJiMianJingShenSunShi==1){
                        BuJiMianJingShenSunShi = true;
                    }else {
                        BuJiMianJingShenSunShi = false;
                    }
                    var arr = {
                        "insuranceCode": "11",
                        "isDeductible": BuJiMianJingShenSunShi,
                        "amount": $scope.bihubaojia.HcJingShenSunShi
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HcFeiYongck==1){
                    var arr = {
                        "insuranceCode": "12",
                        "maxClaimDays": "1",
                        "amount": $scope.bihubaojia.HcFeiYongBuChang
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HcXiuLick==1){
                    var arr = {
                        "insuranceCode": "13",
                        "repairFactorRate": "0.15",
                        "amount": $scope.bihubaojia.HcXiuLiChang
                    }
                    quoteInsuranceVos.push(arr);
                }
                if($scope.bihubaojia.HcSanFangTeYue==1){
                    var arr = {
                        "insuranceCode": "14"
                    }
                    quoteInsuranceVos.push(arr);
                }
                var args={
                    "bjType":bjType,
                    "plateNo": LicenseNo,
                    "carVIN": CarVin,
                    "engineNo": EngineNo,
                    "stRegisterDate":stRegisterDate,
                    "modelType":MoldName,
                    "newCarPrice":newCarPrice,
                    "carUsedType":carUsedType,
                    "ownerIdCardType":ownerIdCardType,
                    "carOwnersName":carOwnersName,
                    "idCard":idCard,
                    "maturityDate":ForceTimeStamp,
                    "businessEndTime":BizTimeStamp,
                    "insuranceCompanys": insuranceCompanys,
                    "compulsory": compulsory,
                    "commercial": commercial,
                    "quoteInsuranceVos": quoteInsuranceVos
                }

                $("#msgwindow").show();
                if(bhinscomBol == 1){
                    customerSAService.applyBJFromBofide(args).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.success==true){
                            $scope.bihuquote = result.results.content.results;
                            $scope.bihuquote.PayAmount = 0;
                            if($scope.bihuquote.cXinfo && ($scope.bihuquote.cXinfo!=""||$scope.bihuquote.cXinfo!=null)){
                                $scope.bihuquote.accidentNumberLY = $scope.bihuquote.cXinfo.List.length;
                                if($scope.bihuquote.accidentNumberLY>0){
                                    for(var i=0;i<$scope.bihuquote.accidentNumberLY;i++){
                                        $scope.bihuquote.PayAmount +=$scope.bihuquote.cXinfo.List[i].PayAmount;
                                    }
                                };
                            };
                            $scope.bihuComps = $scope.bihuquote.bj;
                            for(var n=0;n<$scope.insuranceCompNames.length;n++){
                                if($scope.insuranceCompNames[n].sfbj ==1&&($scope.insuranceCompNames[n].insuranceKey==""||$scope.insuranceCompNames[n].insuranceKey==null)){
                                    var compArr = {
                                        source:0,
                                        insuranceCompName:$scope.insuranceCompNames[n].insuranceCompName
                                    };
                                    $scope.bihuComps.push(compArr);
                                }
                            };
                            //$("#bihuRequest").hide();
                            $("#bihubaojia").show();
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }else {
                    $("#msgwindow").hide();
                    $scope.bihuquote = {
                        bj:[],
                        xbInfo:{
                            UserInfo:{}
                        }
                    };
                    $scope.bihuquote.xbInfo.UserInfo.LicenseNo =  $scope.bihubaojia.LicenseNo;
                    $scope.bihuquote.xbInfo.UserInfo.CarVin =  $scope.bihubaojia.CarVin;
                    $scope.bihuquote.xbInfo.UserInfo.ModleName =  $scope.bihubaojia.ModleName;
                    $scope.bihuquote.accidentNumberLY = 0;
                    $scope.bihuquote.PayAmount = 0;
                    $scope.bihuComps = $scope.bihuquote.bj;
                    for(var n=0;n<$scope.insuranceCompNames.length;n++){
                        if($scope.insuranceCompNames[n].sfbj ==1&&($scope.insuranceCompNames[n].insuranceKey==""||$scope.insuranceCompNames[n].insuranceKey==null)){
                            var compArr = {
                                source:0,
                                insuranceCompName:$scope.insuranceCompNames[n].insuranceCompName
                            };
                            $scope.bihuComps.push(compArr);
                        }
                    };
                    //$("#bihuRequest").hide();
                    $("#bihubaojia").show();
                }
            };
            $scope.checkZhekou=function(val){
                if(val<0 || val>1){
                    $scope.angularTip("商业险折扣数值应为0到1之间",5000);
                };
            };
            $scope.saveQuote = function(){
                var storeId = $rootScope.user.store.storeId;
                var userId = $rootScope.user.userId;
                var userName = $rootScope.user.userName;
                var customerId = $scope.customerId;
                var saveBj = {
                    forceTax:$scope.forceTax,
                    bjxz:$scope.bjxz,
                    storeId:storeId,
                    userId:userId,
                    customerId:customerId,
                    userName:userName,
                    accidentNumberLY:$scope.bihuquote.accidentNumberLY,
                    payAmount:$scope.bihuquote.PayAmount,
                    bj:$scope.bihuComps};
                for(var i=0;i<saveBj.bj.length;i++){
                    if(saveBj.bj[i].zhekou<0||saveBj.bj[i].zhekou>1){
                        $scope.angularTip("商业险折扣数值应为0到1之间",5000);
                        return;
                    };
                    if(saveBj.bj[i].bJinfo!=null&&saveBj.bj[i].bJinfo.Item.BoLi){
                        if(saveBj.bj[i].bJinfo.Item.BoLi.BaoE ==1){
                            saveBj.bj[i].bJinfo.Item.BoLi.BaoE = 3;
                        };
                    };
                };
                $("#msgwindow").show();
                customerSAService.bihuSaveBJ(saveBj).then(function(result){
                    $("#msgwindow").hide();
                    if(result.status == 'OK'){
                        $scope.closeNew_bj();
                        $scope.angularTip(result.results.message,5000)
                    } else {
                        $scope.angularTip(result.results.message,5000)
                    }
                });
            }
            //壁虎 保险公司报价tab
            $scope.BjTab=function(){
                $("#BjTab td").click(function(){
                    $("#BjTab td").removeClass("active");
                    $(this).addClass("active");
                    var thisIndex = $('#BjTab td').index(this);
                    $("#BjTabContent .Bjconbox").hide();
                    $("#BjTabContent .Bjconbox").eq(thisIndex).show();
                });
            }
            //维修记录查询数据
            $scope.maintainRecordPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name:'维修种类明细',enableColumnMenu: false,minWidth:85,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.maintainDetails(row.entity.maintainNumber)">查看明细</div>'},
                    { name: '施工单号', field: 'maintainNumber', enableColumnMenu: false},
                    { name: '维修开始时间', field: 'maintenanceTimeStart',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false},
                    { name: '维修结束时间', field: 'maintenanceTimeEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false},
                    { name: '托修人', field: 'entrustor', enableColumnMenu: false,cellTooltip: true},
                    { name: '托修人联系方式', field: 'entrustorPhone',enableColumnMenu: false,cellTooltip: true},
                    { name: '维修种类', field: 'maintenanceType', enableColumnMenu: false},
                    { name: '维修金额', field: 'maintainCost', enableColumnMenu: false},
                    { name: '实收金额', field: 'realCost', enableColumnMenu: false},
                    { name: '是否本店', field: 'sfbd',cellFilter: 'mapSF', enableColumnMenu: false},
                    { name: '服务顾问', field: 'consultantName', enableColumnMenu: false},
                ],
                onRegisterApi : function(gridApi_wxjl) {
                    $scope.gridApi_wxjl = gridApi_wxjl;
                }
            };

            $scope.findwxRecordByCondition = function(){
                var carLicenseNumber = $scope.carLicenseNumber;
                if(carLicenseNumber==null||carLicenseNumber==''){
                    carLicenseNumber = '-1';
                }
                $scope.condition = {
                    startNum:1,carLicenseNumber: carLicenseNumber,crlsign:1
                };
                customerSAService.findwxRecordByCondition($scope.condition)
                    .then(function (result) {
                        $scope.maintainRecordPage.data = result.results.content.results;
                        for (var i = 0; i < $scope.maintainRecordPage.data.length; i++) {
                            $scope.maintainRecordPage.data[i].index = i + 1;
                            if($scope.maintainRecordPage.data[i].syxrqStart<=$scope.maintainRecordPage.data[i].maintenanceTimeStart
                                && $scope.maintainRecordPage.data[i].syxrqEnd>=$scope.maintainRecordPage.data[i].maintenanceTimeStart){
                                $scope.maintainRecordPage.data[i].sfbd = 1;
                            }else {
                                $scope.maintainRecordPage.data[i].sfbd = 0;
                            }
                        };
                    });
            };
            //维修项目明细
            $scope.itemInfoPage = {};
            $scope.itemInfoPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '维修项目', field: 'maintenanceItem',enableColumnMenu: false},
                    { name: '工时', field: 'workingHour',enableColumnMenu: false},
                    { name: '工时费用', field: 'workingCost',enableColumnMenu: false},
                    { name: '备注', field: 'remark',enableColumnMenu: false,cellTooltip: true},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //配件明细
            $scope.partInfoPage = {};
            $scope.partInfoPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '配件名称', field: 'partName',enableColumnMenu: false},
                    { name: '单位', field: 'unit',enableColumnMenu: false},
                    { name: '数量', field: 'amount',enableColumnMenu: false},
                    { name: '单价', field: 'unitPrice',enableColumnMenu: false},
                    { name: '金额', field: 'totalAmount',enableColumnMenu: false},
                    { name: '备注', field: 'remark',enableColumnMenu: false,cellTooltip: true},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //维修记录明细
            $scope.maintainDetails=function(maintainNumber){
                $scope.maintainNumber = maintainNumber;
                $("#msgwindow").show();
                customerSAService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $("#maintainDetailAll").show();
                        $scope.itemInfoPage.data = result.results.content.itemLists;
                        $scope.partInfoPage.data = result.results.content.partLists;
                        for(var i=0;i< $scope.itemInfoPage.data.length;i++){
                            $scope.itemInfoPage.data[i].index = i;
                        };
                        for(var i=0;i< $scope.partInfoPage.data.length;i++){
                            $scope.partInfoPage.data[i].index = i;
                        };
                        $scope.itemInfoPage.data[0].index = "";
                        $scope.partInfoPage.data[0].index = "";
                        $scope.totalCost = $scope.itemInfoPage.data[0].workingCost + $scope.partInfoPage.data[0].totalAmount;
                    } else {

                    };
                });
            }

            //推送修记录
            $scope.pushRepairPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name:'推送修明细',enableColumnMenu: false,minWidth:85,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.pushDetails(row.entity.reportNumber)">查看明细</div>'},
                    { name: '报案号', field: 'reportNumber', enableColumnMenu: false},
                    { name: '定损金额', field: 'maintenanceRecord.certainCost', enableColumnMenu: false},
                    { name: '维修金额', field: 'maintenanceRecord.maintainCost',enableColumnMenu: false},
                    { name: '推送时间', field: 'pushTime',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false},
                    { name: '保险公司', field: 'insuranceComp',enableColumnMenu: false},
                    { name: '报案人', field: 'reporter', enableColumnMenu: false,cellTooltip: true},
                    { name: '报案电话', field: 'reporterPhone',enableColumnMenu: false,cellTooltip: true},
                    { name: '出险地点', field: 'accidentPlace', enableColumnMenu: false},
                    { name: '维修开始时间', field: 'maintenanceRecord.maintenanceTimeStart',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false},
                    { name: '维修结束时间', field: 'maintenanceRecord.maintenanceTimeEnd',cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false},
                    { name: '是否回款', field: 'sfhk',cellFilter: 'mapSF', enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi_tsx) {
                    $scope.gridApi_tsx = gridApi_tsx;
                }
            };
            $scope.findByConditionTSX = function(){
                var chassisNumber = $scope.chassisNumber;
                $scope.condition = {
                    startNum:1,chassisNumber: chassisNumber
                };
                customerSAService.findByConditionTSX($scope.condition)
                    .then(function (result) {
                        $scope.pushRepairPage.data = result.results.content.results;
                        for (var i = 0; i < $scope.pushRepairPage.data.length; i++) {
                            $scope.pushRepairPage.data[i].index = i + 1;
                        };
                    });
            };
            //推送修明细
            $scope.pushInfo = {};
            $scope.pushDetails=function(reportNumber){
                $scope.reportNumber = reportNumber;
                $("#msgwindow").show();
                customerSAService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $("#pushDetailAll").show();
                        $scope.pushInfo = result.results.content.results;
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
            //新增潜客品牌车型选择框与输入框切换
            $scope.xzVehicleModel = function(){
                $scope.newqk.vehicleModel='';
                $scope.newqk.vehicleModelInput='';
                if($scope.newqk.carBrand){
                    if($scope.newqk.carBrand.brandName=='异系'){
                        $("#clxhsr").show();
                        $("#clxhxz").hide();
                    }else{
                        $("#clxhxz").show();
                        $("#clxhsr").hide();
                    }
                }else {
                    $("#clxhxz").show();
                    $("#clxhsr").hide();
                }
            }
            //服务顾问新增潜客弹框
            $scope.newCustomerbtn = function() {
                $("#newCustomer").show();
                $scope.newqk.customerLevel = 'A';
                $scope.newqk.renewalType = 5;
                $scope.newqk.serviceConsultant = $rootScope.user.userName;
                $scope.xzVehicleModel();
                $scope.saveCustChangefun();
                $scope.generateCustomerFlag = 0;
            };
            //是否取消新增潜客
            $scope.sfqxxzqk = function(){
                if($scope.CustValuebol == true){
                    $("#giveCust").show();
                    $scope.giveAddCust= function(){
                        $("#giveCust").hide();
                        $("#newCustomer").hide();
                        $scope.newqk = {};
                    }
                }else{
                    $scope.newqk = {};
                    $("#newCustomer").hide();
                }
            }
            //提交新增潜客信息
            $scope.submit = function() {
                var carLicenseNumber =$scope.newqk.carLicenseNumber;
                var chassisNumber =$scope.newqk.chassisNumber;
                var engineNumber =$scope.newqk.engineNumber;
                var carBrand = null;
                var vehicleModel = null;
                if($scope.newqk.carBrand){
                    carBrand = $scope.newqk.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.newqk.vehicleModelInput
                    }else if($scope.newqk.vehicleModel){
                        vehicleModel =$scope.newqk.vehicleModel.modelName;
                    }
                }
                var registrationDate =$scope.newqk.registrationDate==''?undefined:$scope.newqk.registrationDate;
                var syxrqEnd =$scope.newqk.syxrqEnd==''?undefined:$scope.newqk.syxrqEnd;
                var jqxrqEnd =$scope.newqk.jqxrqEnd==''?undefined:$scope.newqk.jqxrqEnd;
                var renewalType =$scope.newqk.renewalType;
                var renewalWay =$scope.newqk.renewalWay;
                var insurDateLY =$scope.newqk.insurDateLY==''?undefined:$scope.newqk.insurDateLY;
                var insuranceCompLY =$scope.newqk.insuranceCompLY;
                var insuranceCoverageLY =$scope.newqk.insuranceCoverageLY;
                var privilegeProLY =$scope.newqk.privilegeProLY;
                var insuranceTypeLY =$scope.newqk.insuranceTypeLY;
                var remark =$scope.newqk.remark;
                var carOwner =$scope.newqk.carOwner;
                var insured =$scope.newqk.insured;
                var certificateNumber =$scope.newqk.certificateNumber;
                var customerLevel =$scope.newqk.customerLevel;
                var contact =$scope.newqk.contact;
                var contactWay =$scope.newqk.contactWay;
                var address =$scope.newqk.address;
                var isMaintainAgain =$scope.newqk.isMaintainAgain;
                var maintainNumberLY =$scope.newqk.maintainNumberLY;
                var accidentNumberLY =$scope.newqk.accidentNumberLY;
                var accidentOutputValueLY =$scope.newqk.accidentOutputValueLY;
                var serviceConsultant = null;
                var serviceConsultantId = null;
                if($scope.newqk.serviceConsultant){
                    //服务顾问新建潜客，服务顾问默认是他自己
                    serviceConsultant = $rootScope.user.userName;
                    serviceConsultantId = $rootScope.user.id;
                };
                var factoryLicenseType =$scope.newqk.factoryLicenseType;//厂牌型号
                var carAnnualCheckUpDate =$scope.newqk.carAnnualCheckUpDate==''?undefined:$scope.newqk.carAnnualCheckUpDate;//车辆年审日期
                var insuredLY =$scope.newqk.insuredLY;//去年被保险人
                var buyfromThisStore =$scope.newqk.buyfromThisStore;//是否本店购买车辆
                var contactWayReserve =$scope.newqk.contactWayReserve;//备选联系方式
                var customerCharacter =$scope.newqk.customerCharacter;
                var sfgyx =$scope.newqk.sfgyx;
                var customerDescription =$scope.newqk.customerDescription;
                var fourSStoreId = $rootScope.user.store.storeId;
                var ifLoan = $scope.newqk.ifLoan;
                var bxInfo = $scope.newqk.bxInfo;
                var newqkDatas = {carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,engineNumber:engineNumber,
                    carBrand:carBrand,vehicleModel:vehicleModel,registrationDate:registrationDate,syxrqEnd:syxrqEnd,
                    jqxrqEnd:jqxrqEnd,renewalType:renewalType,renewalWay:renewalWay,
                    insurDateLY:insurDateLY,insuranceCompLY:insuranceCompLY,insuranceTypeLY:insuranceTypeLY,
                    insuranceCoverageLY:insuranceCoverageLY, privilegeProLY:privilegeProLY,remark:remark,carOwner:carOwner,
                    insured:insured,certificateNumber:certificateNumber,customerLevel:customerLevel,
                    contact:contact,contactWay:contactWay, address:address,isMaintainAgain:isMaintainAgain,
                    maintainNumberLY:maintainNumberLY, accidentNumberLY:accidentNumberLY,accidentOutputValueLY:accidentOutputValueLY,
                    serviceConsultant:serviceConsultant,serviceConsultantId:serviceConsultantId,
                    customerCharacter:customerCharacter,sfgyx:sfgyx,customerDescription:customerDescription,
                    fourSStoreId:fourSStoreId,insuredLY:insuredLY, factoryLicenseType:factoryLicenseType,
                    carAnnualCheckUpDate:carAnnualCheckUpDate,buyfromThisStore:buyfromThisStore,
                    contactWayReserve:contactWayReserve,ifLoan:ifLoan,bxInfo:bxInfo
                };
                var checkResult = checkService.qkxxxz(newqkDatas);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };
                $("#msgwindow").show();
                customerSAService.addCustomer(newqkDatas,$scope.generateCustomerFlag).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK' && res.results.success==true){
                        $scope.newqk = {};
                        $("#newCustomer").hide();
                        $scope.$emit("CountByUserIdTop", true);
                        if($scope.generateCustomerFlag==1){
                            $scope.customerDefeatPage.data.splice($scope.customerDefeatPage.data.indexOf($scope.exhibitionDefeat), 1);
                        }
                        $scope.angularTip("新增潜客成功",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                    }
                });

            };
            //手动请求博福报价接口刷新潜客信息，新增潜客
            $scope.newCover = function(flag){
                $("#msgwindow").show();
                var carLicenseNumber = $scope.newqk.carLicenseNumber;
                var chassisNumber = $scope.newqk.chassisNumber;
                var engineNumber = $scope.newqk.engineNumber;
                var certificateNumber = $scope.newqk.certificateNumber;
                var cboo = false;
                var str1 = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$/;
                var str2 = /[a-z_A-Z_0-9]+/;
                if(carLicenseNumber!=null&&carLicenseNumber!=''&&str1.test(carLicenseNumber)){
                    cboo =  true;
                }
                if(chassisNumber!=null&&chassisNumber!=''||engineNumber!=null&&engineNumber!=''&&str2.test(engineNumber)){
                    cboo =  true;
                }
                if(cboo){
                    customerSAService.newCover(carLicenseNumber,chassisNumber,engineNumber,flag,certificateNumber).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.bhInfo = result.results.content.map;
                            $scope.bhInfo.syxrqEndDate = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                            $scope.bhInfo.bhInsuranceEndDate = $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd');
                            $scope.bhInfo.panduan = 1;
                            $("#bhmsg").show();
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }else{
                    $("#msgwindow").hide();
                    $scope.angularTip("请输入正确的车牌号，或者车架号和发动机号!",5000);
                }
            }
            //确认覆盖信息，新增
            $scope.bhCoverNew = function(){
                if($scope.bhInfo.insuranceCompLY!=null&&$scope.bhInfo.insuranceCompLY!=''){
                    $scope.newqk.insuranceCompLY = $scope.bhInfo.insuranceCompLY;
                }
                if($scope.bhInfo.insuranceTypeLY!=null&&$scope.bhInfo.insuranceTypeLY!=''){
                    $scope.newqk.insuranceTypeLY = $scope.bhInfo.insuranceTypeLY;
                    $scope.newqk.bxInfo = $scope.bhInfo.bxInfo;
                }
                if($scope.bhInfo.carLicenseNumber!=null&&$scope.bhInfo.carLicenseNumber!=''){
                    $scope.newqk.carLicenseNumber = $scope.bhInfo.carLicenseNumber;
                }
                if($scope.bhInfo.engineNumber!=null&&$scope.bhInfo.engineNumber!=''){
                    $scope.newqk.engineNumber = $scope.bhInfo.engineNumber;
                }
                if($scope.bhInfo.bhInsuranceEndDate!=null&&$scope.bhInfo.bhInsuranceEndDate!=''){
                    $scope.newqk.jqxrqEnd = $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd');
                }
                if($scope.bhInfo.syxrqEnd!=null&&$scope.bhInfo.syxrqEnd!=''){
                    $scope.newqk.syxrqEnd = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                }
                if($scope.bhInfo.carOwner!=null&&$scope.bhInfo.carOwner!=''){
                    $scope.newqk.carOwner = $scope.bhInfo.carOwner;
                }
                if($scope.bhInfo.insured!=null&&$scope.bhInfo.insured!=''){
                    $scope.newqk.insured = $scope.bhInfo.insured;
                }
                if($scope.bhInfo.certificateNumber!=null&&$scope.bhInfo.certificateNumber!=''){
                    $scope.newqk.certificateNumber = $scope.bhInfo.certificateNumber;
                }
                if($scope.bhInfo.customerCharacter!=null&&$scope.bhInfo.customerCharacter!=''){
                    $scope.newqk.customerCharacter = $scope.bhInfo.customerCharacter;
                }
                if($scope.bhInfo.chejiahao!=null&&$scope.bhInfo.chejiahao!=''){
                    $scope.newqk.chassisNumber = $scope.bhInfo.chejiahao;
                }
                if($scope.bhInfo.modleName!=null&&$scope.bhInfo.modleName!=''){
                    $scope.newqk.factoryLicenseType = $scope.bhInfo.modleName;
                }
                if($scope.bhInfo.registerDate!=null&&$scope.bhInfo.registerDate!=''){
                    $scope.newqk.registrationDate = $scope.bhInfo.registerDate;
                }
                $("#bhmsg").hide();
            }

            //确认覆盖信息，修改
            $scope.bhCover = function(){
                var bo = false;
                $scope.custInfo.updateStatus = 1;
                if($scope.bhInfo.insuranceCompLY!=null&&$scope.bhInfo.insuranceCompLY!=''){
                    if($scope.custInfo.insuranceCompLY != $scope.bhInfo.insuranceCompLY){
                        $scope.custInfo.insuranceCompLY = $scope.bhInfo.insuranceCompLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insuranceTypeLY!=null&&$scope.bhInfo.insuranceTypeLY!=''){
                    if($scope.custInfo.insuranceTypeLY != $scope.bhInfo.insuranceTypeLY){
                        $scope.custInfo.insuranceTypeLY = $scope.bhInfo.insuranceTypeLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.carLicenseNumber!=null&&$scope.bhInfo.carLicenseNumber!=''){
                    if($scope.custInfo.carLicenseNumber != $scope.bhInfo.carLicenseNumber){
                        $scope.custInfo.carLicenseNumber = $scope.bhInfo.carLicenseNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.engineNumber!=null&&$scope.bhInfo.engineNumber!=''){
                    if($scope.custInfo.engineNumber != $scope.bhInfo.engineNumber){
                        $scope.custInfo.engineNumber = $scope.bhInfo.engineNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.bhInsuranceEndDate!=null&&$scope.bhInfo.bhInsuranceEndDate!=''){
                    if($scope.custInfo.bhInsuranceEndDate != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
                        var dateNum1 = new Date($scope.bhInfo.bhInsuranceEndDate).getTime()-28800000;
                        var dateNum2 = new Date($scope.custInfo.jqxrqEnd).getTime()-28800000;
                        $scope.custInfo.showNum = $scope.getNum(dateNum1,dateNum2);
                        $scope.custInfo.bhInsuranceEndDate = $scope.bhInfo.bhInsuranceEndDate;
                        $scope.custInfo.bhUpdateTime = 'yes';
                        bo =true;
                    }
                    if($scope.custInfo.jqxrqEnd != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
                        $scope.custInfo.jqxrqEnd = $scope.custInfo.bhInsuranceEndDate;
                        bo =true;
                    }
                }
                if($scope.bhInfo.syxrqEnd!=null&&$scope.bhInfo.syxrqEnd!=''){
                    if($scope.custInfo.syxrqEnd != $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd')){
                        $scope.custInfo.syxrqEnd = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                        bo =true;
                    }
                }
                if($scope.bhInfo.carOwner!=null&&$scope.bhInfo.carOwner!=''){
                    if($scope.custInfo.carOwner != $scope.bhInfo.carOwner){
                        $scope.custInfo.carOwner = $scope.bhInfo.carOwner;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insured!=null&&$scope.bhInfo.insured!=''){
                    if($scope.custInfo.insured != $scope.bhInfo.insured){
                        $scope.custInfo.insured = $scope.bhInfo.insured;
                        bo =true;
                    }
                }
                if($scope.bhInfo.certificateNumber!=null&&$scope.bhInfo.certificateNumber!=''){
                    if($scope.custInfo.certificateNumber != $scope.bhInfo.certificateNumber){
                        $scope.custInfo.certificateNumber = $scope.bhInfo.certificateNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.customerCharacter!=null&&$scope.bhInfo.customerCharacter!=''){
                    if($scope.custInfo.customerCharacter != $scope.bhInfo.customerCharacter){
                        $scope.custInfo.customerCharacter = $scope.bhInfo.customerCharacter;
                        bo =true;
                    }
                }
                if($scope.bhInfo.chejiahao!=null&&$scope.bhInfo.chejiahao!=''){
                    if($scope.custInfo.chassisNumber != $scope.bhInfo.chejiahao){
                        $scope.custInfo.chassisNumber = $scope.bhInfo.chejiahao;
                        bo =true;
                    }
                }
                if($scope.bhInfo.modleName!=null&&$scope.bhInfo.modleName!=''){
                    if($scope.custInfo.factoryLicenseType != $scope.bhInfo.modleName){
                        $scope.custInfo.factoryLicenseType = $scope.bhInfo.modleName;
                        bo =true;
                    }
                }
                if($scope.bhInfo.registerDate!=null&&$scope.bhInfo.registerDate!=''){
                    if($scope.custInfo.registrationDate != $scope.bhInfo.registerDate){
                        $scope.custInfo.registrationDate = $scope.bhInfo.registerDate;
                        bo =true;
                    }
                }
                $("#bhmsg").hide();
                $scope.CustValuebol = bo;
            }

            //关闭壁虎信息窗口
            $scope.bhclose = function(){
                $("#bhmsg").hide();
            };
            //保单明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            }

            //日期显示
            $scope.rightTimeToolShow=function(){
                $(".control-group").show();
            }

            //日期隐藏
            $scope.rightTimeToolHide=function(){
                $(".control-group").hide();
            }

            //右侧时间隐藏
            $scope.rightTitleTimeToolHide=function(){
                $("#scmTitleTool").hide();
            }
            //右侧时间显示
            $scope.rightTitleTimeToolShow=function(){
                $("#scmTitleTool").show();
            }

            //查询目录展开更多的按钮s
            $("#morebtn").click(function(){
                $("#searchDivTr2").toggle();
                if($("#searchDivTr2").is(":hidden")){
                    var newHeight = $("#myTabContent").height()-135;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }else{
                    var newHeight = $("#myTabContent").height()-255;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }
            });

            //投保类型下拉框
            $('#example-getting-started').multiselect({
                nonSelectedText: '请选择',
                nSelectedText: '已选择',
                allSelectedText: '全选'
            });
            //级别下拉框
            $('#example-getting-started-customerLevel').multiselect({
                nonSelectedText: '请选择',
                nSelectedText: '已选择',
                allSelectedText: '全选'
            });

            //时间控件
            $('.starttime').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
				forceParse:false
            }).on('changeDate',function(ev){
               var  startTime = ev.date.valueOf();
            });
            var newdata =  new Date();
            $('.endtime').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
				forceParse:false
            }).on('changeDate',function(ev){
                var endTime = ev.date.valueOf();
            });
            //商业险和交强险时间格式（mm-dd）
            $('.starttimemd').datepicker({
                format: 'mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                forceParse:false
            }).on('changeDate',function(ev){
                var  startTime = ev.date.valueOf();
            });
            var newdata =  new Date();
            $('.endtimemd').datepicker({
                format: 'mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                forceParse:false
            }).on('changeDate',function(ev){
                var endTime = ev.date.valueOf();
            });
        }

    ]);

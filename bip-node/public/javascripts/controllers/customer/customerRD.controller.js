'use strict';
angular.module('myApp')
    .controller('customerRD_Controller',['$location','constant','$rootScope','$scope','$filter','customerRDService','$state','ExportExcel', '$timeout', '$interval','uiGridConstants','checkService',
        function($location,constant,$rootScope,$scope,$filter,customerRDService,$state,ExportExcel, $timeout, $interval,uiGridConstants,checkService){
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.asmModuleFlag = $rootScope.user.store.asmModuleFlag; //出单员模块状态
            $scope.saleFlag = $rootScope.user.store.saleFlag; //销售顾问模块状态
            $scope.afterSaleFlag = $rootScope.user.store.afterSaleFlag; //服务顾问模块状态
            $scope.dayNumber = $rootScope.user.dayNumber; //首次提醒天数
            $scope.exportNumberEachFile = 10000; //每个文件导出的记录数
            $scope.setExport = {};//导出总数
            $scope.startNumExport = 1; //导出的跟踪记录开始页
            $scope.customerAll = [];
            $scope.customerInvited = [];
            $scope.customerAllSearch = [];
            $scope.confirmData = {};
            $scope.loadStatus=2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            $scope.startNum = 1;//初始化页数
            $scope.showAll = false;//是否全部显示
            $scope.customerIndex= 1;//初始化下标
            $scope.customerInvitedIndex = 1;//初始化下标
            $scope.customerSearchIndex= 1;//初始化下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.approvalStatu = '3,7';  //  1:待审批   2：已审批
            $scope.qkSearch = {}; //潜客条件查询
            $scope.search = {};  //多条件查询
            $scope.newPrincipal = {};  //新负责人
            $scope.customerId = 0;
            $scope.condition = {};
            $scope.conditionSearch = {};
            var short=0;//全局排序（按某字段排序）
            var shortmain=0;//全局排序（1：升序2：降序）
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month=myDate.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            $scope.startTime = year+"-"+month+"-01";//初始化为今天日期
            $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd'); //初始化为今天日期
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            $scope.lockLevel = $rootScope.user.store.lockLevel;//是否锁死潜客级别
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            $scope.cityCode = $rootScope.user.store.cityCode;//4s店城市码
            var host = $location.host();
            if($scope.storeId==122 || host==constant.bipServer){
                $scope.storetitle="传慧嘉和(北京)管理咨询有限公司";
            }else {
                $scope.storetitle="北京博福易商科技有限公司";
            }
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                };
                $scope.gridSearchbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-160
                };
                $scope.gridboxTj = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-45
                }
            },100);
            //模块开启设置查询
            customerRDService.moduleSearch().then(function (result) {
                if (result.status == 'OK') {
                    $scope.modulesetAll = result.results.content.result;
                    for(var i=0;i<$scope.modulesetAll.length;i++){
                        if($scope.modulesetAll[i].moduleName=="csModule"){
                            $scope.csModuleFlag = $scope.modulesetAll[i].switchOn; //客服模块状态
                        }
                    }
                } else {

                }
            });
            //接收父级传过的参数
            $scope.$on('pageStatus', function(e, pageTypeStatus) {
                if(pageTypeStatus.pageTypeStatus == 'xstj'){
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
                if($scope.pageType=="qkcx"){
                    $("#chaxun").addClass("in active");
                    $scope.rightTitleTimeToolHide();
                }else if($scope.pageType=="bspcx"){
                    $("#bspcx").addClass("in active");
                }else{
                    $("#yaoyue").addClass("in active");
                }
                $scope.getShowAll();

            });
            $scope.$on('shuaXinYeMian', function(e, shuaXinYeMian) {
                $scope.getShowAll();
            });
            //初始化下拉菜单
            //下拉列表数据初始化
            $scope.coverTypes = [{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            $scope.loan = [{id:1,vlaue:'是'},{id:2,vlaue:'否'}];
            $scope.privilegePros = ['现金','套餐','现金+套餐','会员积分','储值','其他'];
            $scope.carUsedTypes = [{id:1,vlaue:'家庭自用车'},{id:2,vlaue:'党政机关、事业团体'},{id:3,vlaue:'非营业企业客车'}];
            $scope.ownerIdCardTypes = [{id:1,vlaue:'身份证'},{id:2,vlaue:'组织机构代码证'}];
            $scope.customerLevels = ['A','B','C','D'];
            $scope.customerLevelsB = ['A','B','C'];
            $scope.customerLevelsC = ['A','B'];
            $scope.customerLevelsD = ['A'];
            $scope.customerLevelsSearch = ['A','B','C','D','F','O','S'];
            $scope.lostInsurDays = [
                {range : "0—7", value : 1},
                {range : "8—30", value : 2},
                {range : "31—60", value : 3},
                {range : "61—90", value : 4},
                {range : "90+", value : 5}
            ]; /*将脱保天数范围查询*/

            //按4s店ID查询车辆品牌车型信息
            customerRDService.findCarInfoByStoreId().then(function(res){
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
            //按4s店ID查询所有失销/回退原因
            $scope.reasonData = {storeId:$rootScope.user.store.storeId}
            $scope.sxyySelect = [];
            customerRDService.findForSelectData($scope.reasonData).then(function (result) {
                if (result.status == 'OK') {
                    $scope.reasonAll = result.results.content.result;
                    for(var i=0;i<$scope.reasonAll.length;i++){
                        $scope.sxyySelect.push($scope.reasonAll[i].reason);
                    }
                } else {

                }
            });
            //根据4s店id查询保险公司信息
            customerRDService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            customerRDService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });
            //查询建档人
            customerRDService.selectUserForJdrDataSource().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.createUser = res.results.content.result;
                }else{

                }
            });
            //查询持有人列表
            customerRDService.selectUserForHolderSearch().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.holders = res.results.content.result;
                }else{

                }
                $scope.backUser = [];
                for(var i=0;i<$scope.holders.length;i++){
                    if($scope.holders[i].roleId==2||$scope.holders[i].roleId==6||$scope.holders[i].roleId==8){
                        $scope.backUser.push($scope.holders[i]);
                    }
                }
            });
            $scope.holderShow = function() {
                $(".holder_list").show();
            };
            $scope.holderHide = function() {
                $(".holder_list").hide();
            };
            $scope.holderSet = function(holder) {
                $scope.qkSearch.holder = holder;
                $(".holder_list").hide();
            };
            //潜客查询持有人
            $scope.holderSet2 = function(holder) {
                $scope.search.holder = holder;
            };
            
            //自定义表格行样式
            var start = new Date();
            var sec = $interval(function () {
                var wait = parseInt(((new Date()) - start) / 1000, 10);
            }, 1000);

            function rowTemplate() {
                return $timeout(function() {
                    $interval.cancel(sec);
                    return '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
                        '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                        '</div>';
                }, 1000);
            }

            $scope.rowFormatter = function( row ) {
                return row.entity.holderRoleId != '2'&& $scope.pageType == 'dsp';
            };

            $scope.customerAllPage = {
                rowTemplate: rowTemplate(),
                infiniteScrollRowsFromEnd: 5,
                infiniteScrollDown: true,
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                multiSelect:true,
                isRowSelectable : function(row){if(row.entity.holderRoleId != 2){
                    return false;} else {return true;}},
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_statu" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_statu" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_statu" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_statu" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_statu" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',width:80,cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_statu" class=""></span></div>'},
                    { name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                    '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                    '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                    '<span class="glyphicon glyphicon-exclamation-sign white" ng-if="row.entity.showNum==0"></span>'+
                    '<span>{{ row.entity.bhInsuranceEndDate | date:\'yyyy-MM-dd/EEE\' }}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(10)">更新日期&nbsp;&nbsp;&nbsp;<span id="bhInsuranceEndDate_statu" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_statu" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '接通次数', field: 'gotThroughNum',cellClass: 'text-center', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(12)">接通次数&nbsp;&nbsp;&nbsp;<span id="gotThroughNum_statu" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_statu" class=""></span></div>'},
                    { name: '延期到期日', field: 'customerAssigns[0].delayDate',width:70,cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(16)">延期到期日&nbsp;&nbsp;&nbsp;<span id="delayDate_statu" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay',width:60, enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_statu" class=""></span></div>'},
                    { name: '持有天数', field: 'cyts', enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(18)">持有天数&nbsp;&nbsp;&nbsp;<span id="cyts_statu" class=""></span></div>'},
                    { name: '持有人', field: 'holder', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(19)">持有人&nbsp;&nbsp;&nbsp;<span id="holder_statu" class=""></span></div>'},
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

            /* 邀约新*/
            $scope.customerInvitedPage = {
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_yyjl" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_yyjl" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_yyjl" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_yyjl" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_yyjl" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_yyjl" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_yyjl" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_yyjl" class=""></span></div>'},
                    { name: '预计到店日期', field: 'inviteDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(21)">预计到店日期&nbsp;&nbsp;&nbsp;<span id="inviteDate_yyjl" class=""></span></div>'},
                    { name: '是否到店', field: 'isComeStore',cellFilter: 'mapSF', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(22)">是否到店&nbsp;&nbsp;&nbsp;<span id="isComeStore_yyjl" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_yyjl" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_yyjl" class=""></span></div>'},
                    { name: '延期到期日', field: 'delayDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(16)">延期到期日&nbsp;&nbsp;&nbsp;<span id="delayDate_yyjl" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_yyjl" class=""></span></div>'},
                    { name: '持有天数', field: 'cyts', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(18)">持有天数&nbsp;&nbsp;&nbsp;<span id="cyts_yyjl" class=""></span></div>'},
                    { name: '持有人', field: 'holder',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(19)">持有人&nbsp;&nbsp;&nbsp;<span id="holder_yyjl" class=""></span></div>'},
                    { name: '邀约人', field: 'yyr',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(23)">邀约人&nbsp;&nbsp;&nbsp;<span id="yyr_yyjl" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(invitedGridApi) {
                    invitedGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.invitedGridApi = invitedGridApi;
                }
            };

            $scope.customerAllSearchPage = {
                infiniteScrollRowsFromEnd: 5,
                infiniteScrollDown: false,
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: true,
                isRowSelectable : function(row){if(row.entity.holderRoleId != 2){
                    return false;} else {return true;}},
                multiSelect:true,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompLY', width:50,enableColumnMenu: false},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd" class=""></span></div>'},
                    { name: '最低折扣', field: 'zdZheKou', width:60,enableColumnMenu: false},
                    { name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                    '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                    '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                    '<span class="glyphicon glyphicon-exclamation-sign white" ng-if="row.entity.showNum==0"></span>'+
                    '<span>{{row.entity.bhInsuranceEndDate}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(10)">更新日期&nbsp;&nbsp;&nbsp;<span id="bhInsuranceEndDate" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:60,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '接通次数', field: 'gotThroughNum',cellClass: 'text-center', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(12)">接通次数&nbsp;&nbsp;&nbsp;<span id="gotThroughNum" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',width:80,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',width:80,cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult" class=""></span></div>'},
                    { name: '延期到期日', field: 'customerAssigns[0].delayDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(16)">延期到期日&nbsp;&nbsp;&nbsp;<span id="delayDate" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay" class=""></span></div>'},
                    { name: '持有天数', field: 'cyts', enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(18)">持有天数&nbsp;&nbsp;&nbsp;<span id="cyts" class=""></span></div>'},
                    { name: '持有人', field: 'holder', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(19)">持有人&nbsp;&nbsp;&nbsp;<span id="holder" class=""></span></div>'},
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

            //销售战败潜客
            $scope.customerDefeat = [];
            $scope.customerDefeatPage = {
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
                    { name: '潜客名称', field: 'contact',width:80,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(2)">潜客名称&nbsp;&nbsp;&nbsp;<span id="contact_bspcx" class=""></span></div>'},
                    { name: '潜客电话', field: 'contactWay', width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(3)">潜客电话&nbsp;&nbsp;&nbsp;<span id="contactWay_bspcx" class=""></span></div>'},
                    { name: '失销原因', field: 'cause', width:350,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(4)">失销原因&nbsp;&nbsp;&nbsp;<span id="cause_bspcx" class=""></span></div>'},
                    { name: '失销分析', field: 'causeAnalysis',width:550, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(5)">失销分析&nbsp;&nbsp;&nbsp;<span id="causeAnalysis_bspcx" class=""></span></div>'},
                    { name: '失销时间', field: 'failureTime',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(6)">失销时间&nbsp;&nbsp;&nbsp;<span id="failureTime_bspcx" class=""></span></div>'},
                ],
                onRegisterApi : function(defeatGridApi) {
                    defeatGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.defeatGridApi = defeatGridApi;
                }
            };
            //禁用或取消禁用用户操作
            $scope.forbiddenOrRegain = function(obj,roleId){
                if(obj.userStatus != 2){
                    $scope.userStatusName = "禁用";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        $("#msgwindow").show();
                        customerRDService.pauseOrForbidden(obj.userId,2,roleId).then(function(res){
                            $("#msgwindow").hide();
                            if(res.status == 'OK'){
                                $scope.angularTip("禁用成功",5000);
                                obj.userStatus = 2;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.getShowAll();
                            }else{
                                $scope.angularTip(res.results.message,5000);
                            }
                        });
                    };
                }else if(obj.userStatus == 2){
                    $scope.userStatusName = "取消禁用";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        $("#msgwindow").show();
                        customerRDService.pauseOrForbidden(obj.userId,0).then(function(res){
                            $("#msgwindow").hide();
                            if(res.status == 'OK'){
                                $scope.angularTip("取消禁用成功",5000);
                                obj.userStatus = 0;
                            }else{
                                $scope.angularTip("取消禁用失败",5000);
                            }
                        });
                    };
                }
            }

            //暂停用户操作
            $scope.pauseOrRegain = function(obj){
                if(obj.userStatus == 2){
                    $scope.angularTip("该用户已经被禁用",5000);
                    return;
                }
                if(obj.userStatus == 0){
                    $scope.userStatusName = "暂停";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        customerRDService.pauseOrForbidden(obj.userId,1).then(function(res){
                            if(res.status == 'OK'){
                                $scope.angularTip("暂停成功",5000);
                                obj.userStatus = 1;
                            }else{
                                $scope.angularTip("暂停失败",5000);
                            }
                        });
                    };
                }else if(obj.userStatus == 1){
                    $scope.userStatusName = "取消暂停";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        customerRDService.pauseOrForbidden(obj.userId,0).then(function(res){
                            if(res.status == 'OK'){
                                $scope.angularTip("取消暂停成功",5000);
                                obj.userStatus = 0;
                            }else{
                                $scope.angularTip("取消暂停失败",5000);
                            }
                        });
                    };
                }
            }

            //保险统计查询
            $scope.insuranceStatisticsAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    { name: '生成潜客数', field: 'generateCount',type:'number',width: 80,enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',type:'number',enableColumnMenu: false},
                    { name: '将脱保', field: 'jtbCount', type:'number',enableColumnMenu: false},
                    { name: '已脱保', field: 'ytbCount', type:'number',enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '延期',field: 'delayCount',cellTooltip: true,type:'number',enableColumnMenu: false,},
                    { name: '回退', field: 'returnCount', type:'number',enableColumnMenu: false},
                    { name: '失销', field: 'lostCount', type:'number',enableColumnMenu: false},
                    { name: '睡眠', field: 'sleepCount', type:'number',enableColumnMenu: false},
                    { name: '激活', field: 'awakenCount',type:'number',enableColumnMenu: false},
                    { name: '出单', field: 'billCount',type:'number',enableColumnMenu: false},
                    {
                        name: '暂停',
                        cellClass: 'girdDeleteimg',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: '禁用',cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor">' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity,2)"/>' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity)"/>' +
                        '</div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };




            $scope.findInsuranceStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("--");
                $scope.pageType = pageType;
                $scope.insuranceStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerRDService.findInsuranceStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuranceStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.insuranceStatisticsAll.length;i++){
                            $scope.insuranceStatisticsAll[i].index = i+1;
                            $scope.insuranceStatisticsAllPage.data.push($scope.insuranceStatisticsAll[i])
                        }
                    };
                });
            }


            //销售统计查询
            $scope.saleStatisticsAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',type:'number',enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '回退', field: 'returnCount',type:'number', enableColumnMenu: false},
                    { name: '新保出单', field: 'newBillCount',type:'number',enableColumnMenu: false},
                    { name: '新转续出单', field: 'newToContinueBillCount',type:'number',enableColumnMenu: false},
                    { name: '暂停',cellClass:'girdDeleteimg',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false},
                    { name: '禁用',cellClass:'girdDeleteimg', cellTemplate:'<div class="cursor">' +
                    '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity,6)"/>' +
                    '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity)"/>' +
                    '</div>',
                        enableColumnMenu: false,enableSorting:false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };




            $scope.findSaleStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("--");
                $scope.pageType = pageType;
                $scope.saleStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerRDService.findSaleStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.saleStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.saleStatisticsAll.length;i++){
                            $scope.saleStatisticsAll[i].index = i+1;
                            $scope.saleStatisticsAllPage.data.push($scope.saleStatisticsAll[i])
                        }
                    };
                });
            }

            //售后统计查询
            $scope.serviceStatisticsAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',type:'number',enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '回退', field: 'returnCount',type:'number', enableColumnMenu: false},
                    { name: '出单', field: 'billCount',type:'number',enableColumnMenu: false},
                    {
                        name: '暂停',
                        cellClass: 'girdDeleteimg',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '</div>',
                        enableColumnMenu: false,
                        enableSorting:false},
                    { name: '禁用',cellClass:'girdDeleteimg', cellTemplate:'<div class="cursor">' +
                    '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity,8)"/>' +
                    '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity)"/>' +
                    '</div>',
                        enableColumnMenu: false,enableSorting:false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.findServiceStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("--");
                $scope.pageType = pageType;
                $scope.serviceStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerRDService.findServiceStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.serviceStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.serviceStatisticsAll.length;i++){
                            $scope.serviceStatisticsAll[i].index = i+1;
                            $scope.serviceStatisticsAllPage.data.push($scope.serviceStatisticsAll[i])
                        }
                    };
                });
            };

            //客服统计查询
            $scope.kefuAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '失销', field: 'lostCount',type:'number',enableColumnMenu: false},
                    { name: '睡眠', field: 'sleepCount',type:'number',enableColumnMenu: false},
                    { name: '唤醒数', field: 'awakenCount',type:'number',enableColumnMenu: false},
                    { name: '生成潜客数', field: 'generateCount',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    {
                        name: '暂停',
                        cellClass: 'girdDeleteimg',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" ng-click="grid.appScope.pauseOrRegain(row.entity)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: '禁用',cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor">' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity,5)"/>' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" ng-click="grid.appScope.forbiddenOrRegain(row.entity)"/>' +
                        '</div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //出单员统计查询
            $scope.insuranceWriterAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '出单数', field: 'entryInranceNum',type:'number',enableColumnMenu: false},
                    { name: '报价数', field: 'quotedPriceNum',type:'number',enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            $scope.findkefu = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("--");
                $scope.pageType = pageType;
                $scope.kefuAllPage.data = [];
                $("#msgwindow").show();
                customerRDService.findCSCStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.kefuAll = result.results.content.results;
                        for(var i=0;i<$scope.kefuAll.length;i++){
                            $scope.kefuAll[i].index = i+1;
                            $scope.kefuAllPage.data.push($scope.kefuAll[i])
                        }
                    };
                });
            }
            $scope.findIWStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("--");
                $scope.pageType = pageType;
                $scope.insuranceWriterAllPage.data = [];
                $("#msgwindow").show();
                customerRDService.findIWStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuranceWriterAll = result.results.content.results;
                        for(var i=0;i<$scope.insuranceWriterAll.length;i++){
                            $scope.insuranceWriterAll[i].index = i+1;
                            $scope.insuranceWriterAllPage.data.push($scope.insuranceWriterAll[i])
                        }
                    };
                });
            }
            //重置数据，包括页数，表格内容
            $scope.resetPageData = function(){
                if($scope.searchMoreStatus ==true){
                    $scope.startNum = 1; //开始页
                    $scope.condition = {};
                    $scope.clearSelectedRows();
                }else{
                    $scope.startNum = $scope.startNum + 1;
                }
                if($scope.startNum==1){
                    $scope.customerIndex= 1;
                    $scope.customerInvitedIndex= 1;
                    $scope.customerAllPage.data = [];
                    $scope.customerInvitedPage.data = [];
                    $scope.customerDefeatIndex = 1;
                    $scope.customerDefeatPage.data = [];
                }
            }
            //更新日期栏的增删
            $scope.removeColumns = function() {
                $scope.customerAllPage.columnDefs.splice(9, 1);
            }
            $scope.addColumns = function() {
                $scope.customerAllPage.columnDefs.splice(9, 0,{ name: '更新日期', field: 'showNum',enableColumnMenu: false,width:70,cellTemplate: '' +
                '<div role="button" title="{{row.entity.bhUpdateTime}}" class="ui-grid-cell-contents"><span class="glyphicon glyphicon-exclamation-sign red"  ng-if="row.entity.showNum>1000*60*60*24*row.entity.dayNumber"></span>' +
                '<span class="glyphicon glyphicon-exclamation-sign blue"  ng-if="0<row.entity.showNum&&row.entity.showNum<=1000*60*60*24*row.entity.dayNumber"></span>'+
                '<span>{{row.entity.bhInsuranceEndDate}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(10)">更新日期&nbsp;&nbsp;&nbsp;<span id="bhInsuranceEndDate_statu" class=""></span></div>'});
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                if ($scope.pageType == 'qkcx') {
                    for (var i = 0; i < $scope.customerAllSearch.length; i++) {
                        var a1 = new Date().getTime();
                        $scope.customerAllSearch[i].index = $scope.customerSearchIndex;
                        var firstAcceptDate = $scope.customerAllSearch[i].customerAssigns[0].assignDate;
                        var currentDate = new Date().getTime();
                        var cyts = (currentDate - firstAcceptDate) / (1000 * 60 * 60 * 24);
                        $scope.customerAllSearch[i].cyts = parseInt(cyts);
                        if (firstAcceptDate == 0 || firstAcceptDate == null) {
                            $scope.customerAllSearch[i].cyts = "--";
                        }
                        var holder = $scope.customerAllSearch[i].holder;
                        if (holder == "" || holder == null) {
                            $scope.customerAllSearch[i].cyts = "--";
                        }
                        $scope.customerAllSearchPage.data.push($scope.customerAllSearch[i])
                        $scope.customerSearchIndex = $scope.customerSearchIndex + 1;
                    };

                }else if($scope.pageType == 'yyjl'){
                    $("#yyks").html("预计到店时间:");
                    $("#yyjs").html("--");
                    for(var i=0;i<$scope.customerInvited.length;i++){
                        $scope.customerInvited[i].index = $scope.customerInvitedIndex;
                        var firstAcceptDate = new Date($scope.customerInvited[i].assignDate).getTime();
                        var traceStatu = $scope.customerInvited[i].traceStatu;
                        var currentDate = new Date().getTime();
                        if(typeof traceStatu == 'undefined' || traceStatu == 3){
                            $scope.customerInvited[i].cyts = "--";
                            $scope.customerInvited[i].holder = "--";
                        }else if(isNaN(firstAcceptDate) || firstAcceptDate == 0 || firstAcceptDate == null){
                            $scope.customerInvited[i].cyts = "--";
                        }else{
                            var cyts = (currentDate - firstAcceptDate) / (1000 * 60 * 60 * 24);
                            $scope.customerInvited[i].cyts = parseInt(cyts);
                        }

                        if($scope.customerInvited[i].status != 1){
                            if($scope.customerInvited[i].customerLevel == 'O'
                                || $scope.customerInvited[i].customerLevel == 'F'
                                || $scope.customerInvited[i].customerLevel == 'S'){
                                $scope.customerInvited[i].remainLostInsurDay = "--";
                            }else{
                                var virtualJqxdqr = new Date($scope.customerInvited[i].virtualJqxdqr).getTime();
                                $scope.customerInvited[i].remainLostInsurDay = parseInt((virtualJqxdqr - currentDate)/(1000*3600*24));
                            }
                        }else{
                            $scope.customerInvited[i].remainLostInsurDay = "--";
                        }

                        $scope.customerInvitedPage.data.push($scope.customerInvited[i]);
                        $scope.customerInvitedIndex = $scope.customerInvitedIndex + 1;
                    }
                }else if($scope.pageType == 'bspcx'){
                    for(var i=0;i<$scope.customerDefeat.length;i++){
                        $scope.customerDefeat[i].index = $scope.customerDefeatIndex;
                        $scope.customerDefeatPage.data.push($scope.customerDefeat[i]);
                        $scope.customerDefeatIndex = $scope.customerDefeatIndex+1;
                    };
                    $("#yyks").html("失销时间:");
                    $("#yyjs").html("--");
                }else{
                    for (var i = 0; i < $scope.customerAll.length; i++) {
                        $scope.customerAll[i].index = $scope.customerIndex;
                        var firstAcceptDate = null;
                        if($scope.customerAll[i].customerAssigns.length>0){
                            firstAcceptDate = $scope.customerAll[i].customerAssigns[0].assignDate;
                        }
                        var currentDate = new Date().getTime();
                        var cyts = (currentDate - firstAcceptDate) / (1000 * 60 * 60 * 24);
                        $scope.customerAll[i].cyts = parseInt(cyts);
                        if (firstAcceptDate == 0 || firstAcceptDate == null) {
                            $scope.customerAll[i].cyts = "--";
                        }
                        var holder = $scope.customerAll[i].holder;
                        if (holder == "" || holder == null) {
                            $scope.customerAll[i].cyts = "--";
                        }
                        $scope.customerAllPage.data.push($scope.customerAll[i])
                        $scope.customerIndex = $scope.customerIndex + 1;
                    }
                    if($scope.pageType == 'jh'){
                        $("#yyks").html("唤醒时间:");
                        $("#yyjs").html("--");
                    }else{
                        $("#yyks").html("开始时间:");
                        $("#yyjs").html("--");
                    }
                }
                if($scope.bhDock==1||$scope.bhDock==2){
                    if($scope.customerAllPage.columnDefs[9].name != '更新日期'){
                        if(($scope.pageType == 'gz'&& $scope.pageStatus==1)||($scope.pageType == 'tb'&& $scope.pageStatus==2)){
                            $scope.addColumns();
                        }
                    }else if($scope.customerAllPage.columnDefs[9].name == '更新日期'){
                        if(!(($scope.pageType == 'gz'&& $scope.pageStatus==1)||($scope.pageType == 'tb'&& $scope.pageStatus==2))){
                            $scope.removeColumns();
                        }
                    }
                }else if(($scope.bhDock==0||$scope.bhDock==3)&& $scope.customerAllPage.columnDefs[9].name == '更新日期'){
                    $scope.removeColumns();
                };

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
                }else if($scope.pageType == 'yyjl'){
                    if($scope.customerInvitedPage.data.length>=$scope.policyCount ||$scope.customerInvitedPage.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.invitedGridApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.invitedGridApi.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType == 'bspcx'){
                    if($scope.customerDefeatPage.data.length>=$scope.policyCount ||$scope.customerDefeat.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.defeatGridApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.defeatGridApi.infiniteScroll.dataLoaded(false, true)
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
                $scope.gzjlBol = false;
                if ($scope.pageType == 'gz') {
                    $scope.findByTraceStatuGzjlExport('gz', $scope.pageStatus) //跟踪 跟踪记录数
                } else if ($scope.pageType == 'js') {
                    $scope.findByAcceptStatuGzjlExport('js', $scope.pageStatus) //接收 跟踪记录数
                } else if ($scope.pageType == 'tb') {
                    $scope.findByCusLostInsurStatuGzjlExport('tb', $scope.pageStatus)//潜客脱保(脱保) 跟踪记录数
                } else if($scope.pageType=='yyjl'){
                    $scope.findByInviteStatuGzjlExport('yyjl', $scope.pageStatus);//邀约记录
                } else if ($scope.pageType == 'ht') {
                    $scope.findByReturnStatuGzjlExport('ht', $scope.pageStatus)//回退 跟踪记录数
                } else if ($scope.pageType == 'dsp') {
                    $scope.findByApprovalStatuGzjlExport('dsp', $scope.approvalStatu)//待审批 跟踪记录数
                } else if ($scope.pageType == 'jh'){
                    $scope.findActivateCustomerGzjlExport('jh',$scope.pageStatus);//已唤醒
                }  else if ($scope.pageType == 'qkcx') {
                    $scope.findByConditionGzjlExport();
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
                }else if ($scope.startTime <= $scope.endTime) {
                    $("#tipAlert").hide();
                    if ($scope.pageType == 'gz') {
                        $scope.findByTraceStatu('gz', $scope.pageStatus) //跟踪
                    } else if ($scope.pageType == 'js') {
                        $scope.findByAcceptStatu('js', $scope.pageStatus) //接收
                    } else if ($scope.pageType == 'tb') {
                        $scope.findByCusLostInsurStatu('tb', $scope.pageStatus)//潜客脱保(脱保)
                    } else if($scope.pageType=='yyjl'){
                        $scope.findInviteStatuRD('yyjl',$scope.pageStatus);//邀约记录
                    } else if ($scope.pageType == 'ht') {
                        $scope.findByReturnStatu('ht', $scope.pageStatus)//回退
                    } else if ($scope.pageType == 'dsp') {
                        $scope.findByApprovalStatu('dsp', $scope.approvalStatu)//待审批
                    } else if ($scope.pageType == 'bxtj') {
                        $scope.findInsuranceStatistics('bxtj');
                    } else if ($scope.pageType == 'xstj') {
                        $scope.findSaleStatistics('xstj');
                    } else if ($scope.pageType == 'shtj') {
                        $scope.findServiceStatistics('shtj');
                    } else if ($scope.pageType == 'kefu') {
                        $scope.findkefu('kefu');
                    } else if ($scope.pageType == 'insuranceWriter') {
                        $scope.findIWStatistics('insuranceWriter');
                    } else if ($scope.pageType == 'jh'){
                        $scope.findActivateCustomer('jh',$scope.pageStatus);//已唤醒
                    }else if ($scope.pageType == 'yjh'){
                        $scope.findByJiHuo('yjh',$scope.pageStatus);//已激活
                    }else if($scope.pageType=='ddwcd'){
                        $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                    }else if($scope.pageType=='bspcx'){
                        $scope.findBspDefeatCustomer('bspcx',$scope.pageStatus) //销售战败线索
                    }
                } else {
                    $scope.angularTip("开始时间不能大于结束时间！", 5000);
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
                    $scope.findByTraceStatu('gz',$scope.pageStatus) //跟踪
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='tb'){
                    $scope.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                }else if($scope.pageType=='yyjl'){
                    $scope.findInviteStatuRD('yyjl',$scope.pageStatus);//邀约记录
                }else if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='dsp'){
                    $scope.findByApprovalStatu('dsp',$scope.approvalStatu)//待审批
                }else if($scope.pageType=='qkcx'){
                    $scope.findByCondition();//潜客查询
                }else if($scope.pageType=='bxtj'){
                    $scope.findInsuranceStatistics('bxtj');
                }else if($scope.pageType=='xstj'){
                    $scope.findSaleStatistics('xstj');
                }else if($scope.pageType=='shtj'){
                    $scope.findServiceStatistics('shtj');
                }else if ($scope.pageType == 'jh'){
                    $scope.findActivateCustomer('jh',$scope.pageStatus);//已唤醒
                }else if ($scope.pageType == 'yjh'){
                    $scope.findByJiHuo('yjh',$scope.pageStatus);//已激活
                }else if($scope.pageType=='ddwcd'){
                    $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                }else if($scope.pageType=='bspcx'){
                    $scope.findBspDefeatCustomer('bspcx',$scope.pageStatus);//销售战败线索
                }
            };
            //销售战败线索查询(全局排序)
            $scope.qjsort_bspcx = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0) {
                    $scope.shortmain = 2;
                    if(short==2){
                        $("#contact_bspcx").attr("class","sort_desc"),$("#contactWay_bspcx").attr("class",""),$("#cause_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==3){
                        $("#contactWay_bspcx").attr("class","sort_desc"),$("#contact_bspcx").attr("class",""),$("#cause_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==4){
                        $("#cause_bspcx").attr("class","sort_desc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==5){
                        $("#causeAnalysis_bspcx").attr("class","sort_desc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#cause_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==6){
                        $("#failureTime_bspcx").attr("class","sort_desc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#cause_bspcx").attr("class",""), $("#causeAnalysis_bspcx").attr("class","")
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#contact_bspcx").attr("class","sort_asc"),$("#contactWay_bspcx").attr("class",""),$("#cause_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==3){
                        $("#contactWay_bspcx").attr("class","sort_asc"),$("#contact_bspcx").attr("class",""),$("#cause_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==4){
                        $("#cause_bspcx").attr("class","sort_asc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#causeAnalysis_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==5){
                        $("#causeAnalysis_bspcx").attr("class","sort_asc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#cause_bspcx").attr("class",""),$("#failureTime_bspcx").attr("class","")
                    }else if(short==6){
                        $("#failureTime_bspcx").attr("class","sort_asc"),$("#contactWay_bspcx").attr("class",""),$("#contact_bspcx").attr("class",""),
                            $("#cause_bspcx").attr("class",""), $("#causeAnalysis_bspcx").attr("class","")
                    }
                }
                    this.findBspDefeatCustomer('bspcx',$scope.pageStatus); //销售战败线索
            };
            //销售战败线索查询
            $scope.zbqk = {}
            $scope.findBspDefeatCustomer = function(pageType,pageStatus){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                $scope.pageType = pageType;
                $scope.pageStatus = pageStatus;
                $scope.customerDefeat= [];
                var sxyy =  $scope.zbqk.sxyy;
                $scope.resetPageData();
                $("#msgwindow").show();
                customerRDService.findDefeatCustomer(short,shortmain,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll,sxyy)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            var list = result.results.content.list;
                            if(list.length>0){
                                for(var i=0;i<list.length;i++){
                                    list[i].failureTime = $filter('date')(list[i].failureTime, 'yyyy-MM-dd/EEE');
                                }
                            }
                            $scope.customerDefeat = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
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
                if ($scope.pageType == 'gz') {
                    this.findByTraceStatu('gz', $scope.pageStatus) //跟踪
                } else if ($scope.pageType == 'js') {
                    this.findByAcceptStatu('js', $scope.pageStatus) //接收
                } else if ($scope.pageType == 'tb') {
                    this.findByCusLostInsurStatu('tb', $scope.pageStatus)//潜客脱保(脱保)
                } else if($scope.pageType=='yyjl'){
                    this.findInviteStatuRD('yyjl',$scope.pageStatus);//邀约记录
                } else if ($scope.pageType == 'ht') {
                    this.findByReturnStatu('ht', $scope.pageStatus)//回退
                } else if ($scope.pageType == 'dsp') {
                    this.findByApprovalStatu('dsp', $scope.approvalStatu)//待审批
                } else if ($scope.pageType == 'bxtj') {
                    this.findInsuranceStatistics('bxtj');
                } else if ($scope.pageType == 'xstj') {
                    this.findSaleStatistics('xstj');
                } else if ($scope.pageType == 'shtj') {
                    this.findServiceStatistics('shtyj');
                } else if ($scope.pageType == 'kefu') {
                    this.findkefu('kefu');
                } else if ($scope.pageType == 'insuranceWriter') {
                    this.findIWStatistics('insuranceWriter');
                } else if ($scope.pageType == 'jh'){
                    this.findActivateCustomer('jh',$scope.pageStatus);//已唤醒
                }else if ($scope.pageType == 'yjh'){
                    this.findByJiHuo('yjh',$scope.pageStatus);//已激活
                }else if($scope.pageType=='ddwcd'){
                    this.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                }else if($scope.pageType=='bspcx'){
                    this.findBspDefeatCustomer('bspcx',$scope.pageStatus); //销售战败线索
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
                }
                $("#msgwindow").show();
                customerRDService.findByTraceStatu($scope.condition)
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
                }

                $("#msgwindow").show();
                customerRDService.findByCusLostInsurStatu($scope.condition)
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
            //查询潜客邀约记录(全局排序)
            $scope.qjsort_yyjl = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#contact_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==3){
                        $("#clerk_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#principal_yyjl").attr("class","");$("#contact_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==4){
                        $("#contact_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==5){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==6){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==7){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==8){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==9){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==11){
                        $("#customerLevel_yyjl").attr("class","sort_desc"), $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==13){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==14){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==15){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==16){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==17){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==18){
                        $("#contact_yyjl").attr("class","");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","sort_asc");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==19){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==21){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==22){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==23){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","sort_desc");$("#customerLevel_yyjl").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#contact_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==3){
                        $("#clerk_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#principal_yyjl").attr("class","");$("#contact_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==4){
                        $("#contact_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==5){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==6){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==7){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==8){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==9){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==11){
                        $("#customerLevel_yyjl").attr("class","sort_asc"), $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==13){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==14){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==15){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==16){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==17){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==18){
                        $("#contact_yyjl").attr("class","");$("#customerLevel_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","sort_desc");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==19){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==21){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==22){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");$("#yyr_yyjl").attr("class","");
                    }else if(short==23){
                        $("#contact_yyjl").attr("class","");
                        $("#clerk_yyjl").attr("class","");$("#principal_yyjl").attr("class","");$("#contactWay_yyjl").attr("class","");$("#chassisNumber_yyjl").attr("class","");
                        $("#carLicenseNumber_yyjl").attr("class","");$("#coverTypeName_yyjl").attr("class","");$("#jqxrqEnd_yyjl").attr("class","");$("#willingTraceDate_yyjl").attr("class","");
                        $("#lastTraceDate_yyjl").attr("class","");$("#lastTraceResult_yyjl").attr("class","");$("#delayDate_yyjl").attr("class","");$("#remainLostInsurDay_yyjl").attr("class","");
                        $("#cyts_yyjl").attr("class","");$("#holder_yyjl").attr("class","");$("#inviteDate_yyjl").attr("class","");$("#isComeStore_yyjl").attr("class","");$("#yyr_yyjl").attr("class","sort_asc");$("#customerLevel_yyjl").attr("class","");
                    }
                }
                this.findInviteStatuRD('yyjl',$scope.pageStatus);//邀约记录
            };
            //查询潜客邀约记录
            $scope.findInviteStatuRD = function(pageType,inviteStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var operatorID = $scope.qkSearch.operatorID;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var inviteHappenTimeStart = $scope.qkSearch.inviteHappenTimeStart;
                var inviteHappenTimeEnd = $scope.qkSearch.inviteHappenTimeEnd;
                if(inviteHappenTimeStart>inviteHappenTimeEnd){
                    $scope.angularTip("邀约开始时间不能大于结束时间！",5000);
                    return;
                };
                $scope.pageType = pageType;
                $scope.pageStatus = inviteStatu;
                $scope.customerInvited= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, inviteStatu: inviteStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID,
                            inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            inviteStatu: inviteStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID,
                            inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerRDService.findInviteStatuRD($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerInvited = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };

            //根据接收状态查询
            $scope.findByAcceptStatu = function(pageType,acceptStatu){
                $scope.rightTitleTimeToolHide();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = acceptStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {short:short,shortmain:shortmain,acceptStatu:acceptStatu,startNum:$scope.startNum,
                        renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                        contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                }else{
                    $scope.condition.startNum = $scope.startNum;
                }
                $("#msgwindow").show();
                customerRDService.findByAcceptStatu($scope.condition)
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
                var insuranceEndDateStart = $scope.qkSearch.insuranceEndDateStart;
                var insuranceEndDateEnd = $scope.qkSearch.insuranceEndDateEnd;
                var operatorID = $scope.qkSearch.operatorID;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if($scope.showAll==false){
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID,
                            insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd};
                    }else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu:returnStatu,startNum:$scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID,
                            insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd};
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                }
                $("#msgwindow").show();
                if(returnStatu==2){
                    customerRDService.findByYiHuiTui($scope.condition)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.customerAll = result.results.content.list;
                                $scope.policyCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {

                            };
                        });
                }else{
                    customerRDService.findByReturnStatu($scope.condition)
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
            //查询已激活潜客
            $scope.findByJiHuo = function(pageType,pageStatus){
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
                    if($scope.showAll==false){
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                    }else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                }
                $("#msgwindow").show();
                customerRDService.findByJiHuo($scope.condition).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
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
                customerRDService.findDdwcdCus($scope.condition)
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
            //根据审批状态查询
            $scope.findByApprovalStatu = function(pageType,approvalStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var custStatu = $scope.qkSearch.returnStatu3;
                var returnStatu3 = "";
                var applyStatu = "";
                if(custStatu==3||custStatu==7){
                    returnStatu3 = custStatu;
                }else if(custStatu==1||custStatu==2){
                    returnStatu3 = 3;
                    applyStatu = custStatu;
                }
                $scope.pageType = pageType;
                $scope.pageStatus = 0;
                $scope.approvalStatu = '3,7';
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if($scope.showAll==false){
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime:$scope.startTime,endTime:$scope.endTime,approvalStatu:$scope.approvalStatu,startNum:$scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                    }else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            approvalStatu:$scope.approvalStatu,startNum:$scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                }
                $("#msgwindow").show();
                customerRDService.findByApprovalStatu($scope.condition)
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
            //查询已经唤醒的潜客
            $scope.findActivateCustomer = function(pageType,returnStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if($scope.showAll==false){
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNum,
                            renewalType: renewalType, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                    }else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu:returnStatu,startNum:$scope.startNum,
                            renewalType: renewalType, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                }
                $("#msgwindow").show();
                customerRDService.findActivateCustomer($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.result;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };

            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
				$('select[multiple="multiple"]').multiselect('clearSelection');
                $('select[multiple="multiple"]').multiselect('refresh');
            };
            //清空表单
            $scope.clearQksearch = function(){
                $scope.qkSearch = {};
                $scope.zbqk = {};
            };

            //点击潜客查询事件
            $scope.coutomerSreachClick = function(){
                $scope.rightTitleTimeToolHide();
                $scope.pageType = 'qkcx';
                if(($scope.bhDock==0||$scope.bhDock==3) && $scope.customerAllSearchPage.columnDefs[9].name == '更新日期'){
                    $scope.customerAllSearchPage.columnDefs.splice(9, 1);
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
            $scope.findByCondition = function() {
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var fourSStoreId = $rootScope.user.store.storeId;
                var carBrand = undefined;
                var vehicleModel = undefined;
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
                var principal = $scope.search.principal;
                var insurNumber = $scope.search.insurNumber;
                var isInvite = $scope.search.isInvite;
                var isComeStore = $scope.search.isComeStore;
                var isQuote = $scope.search.isQuote;
                var insuDateStartTime = $scope.search.insuDateStartTime;
                var insuDateEndTime = $scope.search.insuDateEndTime;
                var insuEndStartTime = $scope.search.insuEndStartTime;
                var insuEndEndTime = $scope.search.insuEndEndTime;
                var syxrqDateStart=$scope.search.syxrqDateStart;
                var syxrqDateEnd=$scope.search.syxrqDateEnd;
                var inviteStartTime = $scope.search.inviteStartTime;
                var inviteEndTime = $scope.search.inviteEndTime;
                var comeStoreStartTime = $scope.search.comeStoreStartTime;
                var comeStoreEndTime = $scope.search.comeStoreEndTime;
                var lastTraceStartTime = $scope.search.lastTraceStartTime;
                var lastTraceEndTime = $scope.search.lastTraceEndTime;
                var quoteStartTime = $scope.search.quoteStartTime;
                var quoteEndTime = $scope.search.quoteEndTime;
                var traceStartTime = $scope.search.traceStartTime;
                var traceEndTime = $scope.search.traceEndTime;
                var zdZheKouStart = $scope.search.zdZheKouStart;
                var zdZheKouEnd = $scope.search.zdZheKouEnd;
                var createTimeStart = $scope.search.createTimeStart;
                var createTimeEnd = $scope.search.createTimeEnd;
                var createrId = $scope.search.createrId;
                var defeatFlag = $scope.search.defeatFlag;
                var carOwner = $scope.search.carOwner;
                var holder = $scope.search.holder;
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
                if($scope.searchMoreStatus ==true){
                    $scope.startNumSearch = 1; //开始页
                    $scope.customerSearchIndex= 1;
                    $scope.customerAllSearchPage.data = [];
                    $scope.conditionSearch = {};
                    $scope.clearSelectedRows();
                }else {
                    $scope.startNumSearch = $scope.startNumSearch + 1;
                };
                if($scope.startNumSearch == 1) {
                    $scope.conditionSearch = {
                        short:short,shortmain:shortmain,
                        startNum: $scope.startNumSearch, fourSStoreId: fourSStoreId,
                        carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                        carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                        contactWay: contactWay, contactWayReserve:contactWayReserve,insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
                        customerLevel: customerLevel, comeStoreNumber: comeStoreNumber, insurNumber: insurNumber,
                        principalId: principalId, principal: principal,
                        isInvite: isInvite, isComeStore: isComeStore, isQuote: isQuote,
                        insuDateStartTime: insuDateStartTime, insuDateEndTime: insuDateEndTime,
                        insuEndStartTime: insuEndStartTime, insuEndEndTime: insuEndEndTime,
                        syxrqDateStart: syxrqDateStart,syxrqDateEnd: syxrqDateEnd,
                        inviteStartTime: inviteStartTime, inviteEndTime: inviteEndTime,
                        comeStoreStartTime: comeStoreStartTime, comeStoreEndTime: comeStoreEndTime,
                        lastTraceStartTime: lastTraceStartTime, lastTraceEndTime: lastTraceEndTime,
                        quoteStartTime: quoteStartTime, quoteEndTime: quoteEndTime, traceStartTime: traceStartTime,
                        traceEndTime: traceEndTime,zdZheKouStart:zdZheKouStart,zdZheKouEnd:zdZheKouEnd,
                        carOwner: carOwner, holder: holder,
                        remainLostInsurDayStart:remainLostInsurDayStart,remainLostInsurDayEnd:remainLostInsurDayEnd,
                        sfgyx:sfgyx,ifLoan:ifLoan,registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                        createTimeStart:createTimeStart,createTimeEnd:createTimeEnd,createrId:createrId,defeatFlag:defeatFlag
                    }
                }else{
                    $scope.conditionSearch.startNum = $scope.startNumSearch;
                }
                if( insuDateStartTime != null  && insuDateEndTime != null && insuDateStartTime != ""  && insuDateEndTime != "" && insuDateStartTime>insuDateEndTime){
                    $scope.angularTip("投保开始日期不能大于结束日期！",5000)
                }else if(insuEndStartTime != null && insuEndEndTime != null && insuEndStartTime != "" && insuEndEndTime != "" && insuEndStartTime>insuEndEndTime){
                    $scope.angularTip("保险到期开始日期不能大于结束日期！",5000)
                }else if(inviteStartTime != null && inviteEndTime != null && inviteStartTime != "" && inviteEndTime != "" && inviteStartTime>inviteEndTime){
                    $scope.angularTip("邀约开始日期不能大于结束日期！",5000)
                }else if(comeStoreStartTime != null && comeStoreEndTime != null && comeStoreStartTime != "" && comeStoreEndTime != "" && comeStoreStartTime>comeStoreEndTime){
                    $scope.angularTip("到店日开始日期不能大于结束日期！",5000)
                }else if(lastTraceStartTime != null && lastTraceEndTime != null && lastTraceStartTime != "" && lastTraceEndTime != "" && lastTraceStartTime>lastTraceEndTime){
                    $scope.angularTip("末次跟踪日期开始日期不能大于结束日期！",5000)
                }else if(quoteStartTime != null && quoteEndTime != null && quoteStartTime != "" && quoteEndTime != "" && quoteStartTime>quoteEndTime){
                    $scope.angularTip("报价开始日期不能大于结束日期！",5000)
                }else if(traceStartTime != null && traceEndTime != null && traceStartTime != "" && traceEndTime != "" && traceStartTime>traceEndTime){
                    $scope.angularTip("应跟踪开始日期不能大于结束日期！",5000)
                }else if(registrationDateStart != null && registrationDateEnd != null && registrationDateStart != "" && registrationDateEnd != "" && registrationDateStart>registrationDateEnd){
                    $scope.angularTip("上牌日期开始日期不能大于结束日期！",5000)
                }else if(createTimeStart != null && createTimeEnd != null && createTimeStart != "" && createTimeEnd != "" && createTimeStart>createTimeEnd){
                    $scope.angularTip("建档时间开始日期不能大于结束日期！",5000)
                }else if(syxrqDateStart != null && syxrqDateEnd != null && syxrqDateStart != "" && syxrqDateEnd != "" && syxrqDateStart>syxrqDateEnd){
                    $scope.angularTip("商业到期开始日期不能大于结束日期！",5000)
                }else {
                    $("#msgwindow").show();
                    customerRDService.findByCondition($scope.conditionSearch).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.result.content.status == 'OK') {
                            $scope.customerAllSearch = result.result.content.result;
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
                            $scope.policySearchCount = result.result.content.policyCount||0;
                            $scope.getPolicyPage();
                        } else {
                            $scope.angularTip(result.result.message,5000)
                        }

                    });
                }
            }

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
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '跟踪时间', field: 'currentTraceDate',enableColumnMenu: false,width:150,cellFilter: 'date:"yyyy-MM-dd/EEE HH:mm"'},
                    { name: '跟踪记录', field: 'traceContext',width:300,enableColumnMenu: false,cellTooltip: true},
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
                    { name: '持有天数', field: 'cyts',width:80,enableColumnMenu: false,type:'number'},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            //按潜客ID查询潜客信息及跟踪记录
            $scope.crljqxrqEnd = '';
            $scope.findByCustomerId=function(customer){
                $scope.customer = customer;
                $scope.thisRowData = customer;
                $scope.footerBtn = "";
                $scope.chassisNumber = customer.chassisNumber;
                $scope.customerId = customer.customerId;
                $scope.principalId = customer.principalId;
                $scope.principal = customer.principal;
                $scope.holderId = customer.holderId;
                $scope.holderRoleId = customer.holderRoleId;

                if($scope.pageType == 'yyjl'){
                    $scope.returnStatu = customer.returnStatu;
                    $scope.assign_userId = customer.assign_userId;
                    $scope.delayDate =customer.delayDate;
                }else{
                    $scope.returnStatu = customer.customerAssigns[0].returnStatu;
                    $scope.assign_userId = customer.customerAssigns[0].userId;
                    $scope.delayDate =customer.customerAssigns[0].delayDate;
                    $scope.applyStatu = customer.customerAssigns[0].applyStatu;
                }
                $scope.cusLostInsurStatu = customer.cusLostInsurStatu;
                $scope.jqxrqEnd_before = customer.jqxrqEnd;
                $scope.genzcl = {};
                $("#msgwindow").show();
                customerRDService.findByCustomerId(customer.customerId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&& result.results.success==true) {
                        $("#genzcl").show();
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $("#gz_tab").children("li").removeClass("active");
                        $("#gz_tab_grid").children(".tab-pane").removeClass("in active");
                        $("#gzjl_tab").addClass("active");
                        $("#genzong").addClass("in active");
                        $scope.genzcl = result.results.content.results;
                        var bhInsuranceEndDate = $scope.genzcl.bhInsuranceEndDate;
                        var jqxrqEnd = $scope.genzcl.jqxrqEnd;
                        if(bhInsuranceEndDate!=undefined&&bhInsuranceEndDate!=null){
                            var myDate_ms = Date.parse(new Date());
                            $scope.genzcl.showNum = Math.abs(bhInsuranceEndDate - myDate_ms);
                        }else{
                            $scope.genzcl.showNum = 0;
                        }
                        $scope.genzcl.bhInsuranceEndDate = $filter('date')($scope.genzcl.bhInsuranceEndDate,'yyyy-MM-dd');
                        $scope.tracelistPage.data = result.results.content.results.customerTraceRecodes;
                        for(var i=0;i< $scope.tracelistPage.data.length;i++){
                            $scope.tracelistPage.data[i].index = i+1;
                        };
                        $scope.genzcl.carAnnualCheckUpDate = $filter('date')($scope.genzcl.carAnnualCheckUpDate,'yyyy-MM-dd');
                        $scope.genzcl.registrationDate = $filter('date')($scope.genzcl.registrationDate,'yyyy-MM-dd');
                        $scope.genzcl.insurDateLY = $filter('date')($scope.genzcl.insurDateLY,'yyyy-MM-dd');
                        $scope.genzcl.syxrqEnd = $filter('date')($scope.genzcl.syxrqEnd,'yyyy-MM-dd');
                        $scope.genzcl.jqxrqEnd = $filter('date')($scope.genzcl.jqxrqEnd,'yyyy-MM-dd');
                        $scope.jqxrqEndOld = $scope.genzcl.jqxrqEnd;
                        $scope.crljqxrqEnd = $scope.genzcl.jqxrqEnd;
                        for(var i = 0 ;i<$scope.kingdsUser.servicer.length;i++){
                            if($scope.kingdsUser.servicer[i].id==$scope.genzcl.serviceConsultantId){
                                $scope.genzcl.serviceConsultant = $scope.kingdsUser.servicer[i];
                            }
                        }
                        $scope.carLicenseNumber = $scope.genzcl.carLicenseNumber;
                        $scope.gzclmr($scope.genzcl.carBrand,$scope.genzcl.vehicleModel);
                        $scope.saveCustChangefun();
                    } else {

                    };
                    $scope.isQuoteBol=true;
                    $scope.isInviteBol=true;
                    $scope.isComeStoreBol=true;
                    $scope.lastYearIsDealBol=true;
                    $scope.progressWidth = {"width" : "0%"}
                    if($scope.genzcl.isQuote ==1){
                        $scope.isQuoteBol=false;
                        $scope.progressWidth = {"width" : "0%"}
                    };
                    if($scope.genzcl.isInvite ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.progressWidth = {"width" : "33%"}
                    };
                    if($scope.genzcl.isComeStore ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.isComeStoreBol=false;
                        $scope.progressWidth = {"width" : "66%"}
                    };
                    if($scope.genzcl.lastYearIsDeal ==1){
                        $scope.isQuoteBol=false;
                        $scope.isInviteBol=false;
                        $scope.isComeStoreBol=false;
                        $scope.lastYearIsDealBol=false;
                        $scope.progressWidth = {"width" : "100%"}
                    };
                });

                //更换负责人列表查询
                customerRDService.findAllSubordinate(customer.principalId).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.replacePrincipals = result.results.content.results;
                    } else {

                    };
                });
                //指定负责人列表查询
                customerRDService.findSubordinate().then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.assignPrincipals = result.results.content.results;
                    } else {

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
                customerRDService.findListCustomerBJRecode($scope.customerId).then(function (result) {
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
                $scope.bhQuoteDetails.carLicenseNumber = $scope.genzcl.carLicenseNumber;
                $scope.bhQuoteDetails.chassisNumber = $scope.genzcl.chassisNumber;
                $scope.xzArr = $filter('mapBoLi')($scope.bhQuoteDetails.xz);
                $scope.xzArr = $scope.xzArr.split(";");
                $scope.xzArr.splice(-1,1);
                $("#bjDetails").show();
            }
            //关闭报价记录明细
            $scope.bjDetailsClose = function() {
                $("#bjDetails").hide();
            }
            //改变交强险日期
            $scope.changeJqxrqEnd = function(){
                $scope.genzcl.jqxrqEnd=$scope.genzcl.bhInsuranceEndDate;
                $scope.CustValuebol = true;
            };

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
                customerRDService.findApprovalBillRecordList($scope.chassisNumber).then(function (result) {
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
                })

            }

            //数据改变了是否保存
            $scope.saveCustChangeBtn = function(){
                $scope.footerBtn = "";
                $scope.crlMessage = '';
                if ($scope.CustValuebol == true) {
                    if($scope.genzcl.customerLevel=='F'&&$scope.crljqxrqEnd!=$scope.genzcl.jqxrqEnd){
                        customerRDService.getMessageByUC($scope.genzcl.jqxrqEnd).then(function(result){
                            if (result.status == 'OK'){
                                $scope.crlMessage = result.results.message;
                                $("#changevalue").show();
                            }
                        })
                    }else{
                        $("#changevalue").show();
                    }
                }else {
                    $("#genzcl").hide();
                }
            }
            //确认修改
            $scope.saveChange = function(){
                $scope.CustValuebol = false;
                var carLicenseNumber =$scope.genzcl.carLicenseNumber;//车牌号
                var chassisNumber =$scope.genzcl.chassisNumber;//车架号
                var engineNumber =$scope.genzcl.engineNumber;//发动机号
                var registrationDate =$scope.genzcl.registrationDate;//上牌日期
                var carBrand = '';//品牌
                var vehicleModel = '';//车辆型号
                if($scope.genzcl.carBrand){
                    carBrand = $scope.genzcl.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.genzcl.vehicleModelInput
                    }else if($scope.genzcl.vehicleModel){
                        vehicleModel =$scope.genzcl.vehicleModel.modelName;
                    }
                }

                var syxrqEnd =$scope.genzcl.syxrqEnd;//商业险结束日期
                var jqxrqEnd =$scope.genzcl.jqxrqEnd;//交强险结束日期
                var renewalType =$scope.genzcl.renewalType||'';//投保类型
                var renewalWay =$scope.genzcl.renewalWay||'';//续保渠道
                var principal = $scope.genzcl.principal;//当前负责人
                var solicitMemberLY = $scope.genzcl.solicitMemberLY||'';//去年招揽员
                var insurNumber = $scope.genzcl.insurNumber;//本店投保次数
                var zdZheKou =$scope.genzcl.zdZheKou;//最低折扣
                var insurDateLY =$scope.genzcl.insurDateLY;//去年投保日期
                var insuranceCompLY =$scope.genzcl.insuranceCompLY;//去年投保公司
                var insuranceCoverageLY =$scope.genzcl.insuranceCoverageLY;//去年保额
                var privilegeProLY =$scope.genzcl.privilegeProLY||'';//去年优惠项目
                var insuranceTypeLY =$scope.genzcl.insuranceTypeLY;//去年投保险种
                var remark =$scope.genzcl.remark;//备注

                var carOwner =$scope.genzcl.carOwner;//车主
                var insured =$scope.genzcl.insured;//被保险人
                var certificateNumber =$scope.genzcl.certificateNumber;//被保险人证件号
                var customerLevel =$scope.genzcl.customerLevel;//潜客级别
                var contact =$scope.genzcl.contact;//联系人
                var contactWay =$scope.genzcl.contactWay;//联系方式
                var address =$scope.genzcl.address;//现住址
                var isMaintainAgain =$scope.genzcl.isMaintainAgain;//是否本店再修客户
                if(isMaintainAgain==null||isMaintainAgain=='') {
                    if (!(isMaintainAgain == 0)) {
                        isMaintainAgain = -1
                    }
                }
                var maintainNumberLY =$scope.genzcl.maintainNumberLY;//去年本店维修次数
                var accidentNumberLY =$scope.genzcl.accidentNumberLY;//去年出险次数
                var accidentOutputValueLY =$scope.genzcl.accidentOutputValueLY;//去年事故车产值
                var serviceConsultant = '';//服务顾问
                var serviceConsultantId = -1;//服务顾问id
                if($scope.genzcl.serviceConsultant){
                    serviceConsultant = $scope.genzcl.serviceConsultant.userName;
                    serviceConsultantId = $scope.genzcl.serviceConsultant.id;
                };
                var customerCharacter =$scope.genzcl.customerCharacter;//客户性质
                var sfgyx =$scope.genzcl.sfgyx;//是否高意向
                if(sfgyx==null||sfgyx=='') {
                    if (!(sfgyx == 0)) {
                        sfgyx = -1
                    }
                };
                var customerDescription =$scope.genzcl.customerDescription;//客户描述
                var factoryLicenseType =$scope.genzcl.factoryLicenseType;//厂牌型号
                var carAnnualCheckUpDate =$scope.genzcl.carAnnualCheckUpDate;//车辆年审日期
                var insuredLY =$scope.genzcl.insuredLY;//去年被保险人
                var buyfromThisStore =$scope.genzcl.buyfromThisStore;//是否本店购买车辆
                var contactWayReserve =$scope.genzcl.contactWayReserve;//备选联系方式
                var fourSStoreId = $rootScope.user.store.storeId;
                var customerId = $scope.customerId;
                var ifUpdate = $scope.genzcl.ifUpdate;
                var bhInsuranceEndDate = $scope.genzcl.bhInsuranceEndDate;
                var bhUpdateTime = $scope.genzcl.bhUpdateTime;
                var updateStatus = $scope.genzcl.updateStatus;
                var ifLoan = $scope.genzcl.ifLoan;
                var status;
                if($scope.genzcl.customerLevel=='F'&&$scope.crljqxrqEnd!=$scope.genzcl.jqxrqEnd){
                    status = 1;
                }

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
                    updateStatus:updateStatus,status:status
                };
                var checkResult = checkService.qkxxxz(updateData);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };
                if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))
                    &&($filter('date')(jqxrqEnd,'yyyy-MM-dd') < $filter('date')(new Date(),'yyyy-MM-dd'))){
                    $scope.angularTip("交强险日期结束不能设置为今天以前",5000);
                    return;
                }
                $scope.updateCustMsg = function(){
                    $("#msgwindow").show();
                    customerRDService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal,$scope.holderId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.jqxrqEnd = jqxrqEnd;
                            $scope.thisRowData.coverType.coverTypeName = $filter('mapTBLX')(renewalType);
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
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
                if($scope.footerBtn == "ghrp"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                }else if($scope.footerBtn == "tyht"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.traceReturnFun();
                }else if($scope.footerBtn == "jjht"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.unAgreeTraceReturnXbzgFun();
                }else if($scope.footerBtn == "tyyq"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.updateReturnStatuToYyqFun();
                }else if($scope.footerBtn == "jjyq"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.updateReturnStatuToCsztFun();
                }else if($scope.footerBtn == "yq"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.updateReturnStatuByRDFun();
                }else if($scope.footerBtn == "hx"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "bj"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.openbjfun();;
                }else if($scope.footerBtn == "zdht"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.activeReturn();;
                }else if($scope.footerBtn == "zdsx"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.lostSaleFun();;
                }else {
                    $("#msgwindow").show();
                    customerRDService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal,$scope.holderId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $("#genzcl").hide();
                            $scope.angularTip("修改成功",5000);
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.coverType.coverTypeName = $filter('mapTBLX')(renewalType);
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
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };
            //取消修改
            $scope.cancelChange = function(){
                $scope.CustValuebol = false;
                $("#changevalue").hide();
                if($scope.footerBtn == "tyht"){
                    $scope.traceReturnFun();
                }else if($scope.footerBtn == "jjht"){
                    $scope.unAgreeTraceReturnXbzgFun();
                }else if($scope.footerBtn == "tyyq"){
                    $scope.updateReturnStatuToYyqFun();
                }else if($scope.footerBtn == "jjyq"){
                    $scope.updateReturnStatuToCsztFun();
                }else if($scope.footerBtn == "yq"){
                    $scope.updateReturnStatuByRDFun();
                }else if($scope.footerBtn == "hx"){
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "zdht"){
                    $scope.activeReturn();
                }else if($scope.footerBtn == "bj"){
                    $scope.openbjfun();
                }else if($scope.footerBtn == "zdsx"){
                    $scope.lostSaleFun();
                }else{
                    $("#genzcl").hide();
                }
            };
            //失销按钮
            $scope.lostSale = function(){
                $scope.footerBtn = "zdsx";
                customerRDService.getMessage($scope.customerId).then(function(result){
                    if (result.status == 'OK'){
                        $scope.tipMessage = result.results.message;
                    }
                })
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.lostSaleFun();
                }
            };
            //失销
            $scope.lostSaleFun = function(){
                $("#zdsx").show();
                $scope.makesure = function() {
                    var sxyyxz = $scope.confirmData.sxyyxz||"";
                    var sxyysr = $scope.confirmData.sxyysr||"";
                    $scope.confirmData.sxyy = '';
                    if(sxyyxz==''){
                        $scope.confirmData.sxyy = sxyysr;
                    }else{
                        if(sxyysr==""){
                            $scope.confirmData.sxyy = sxyyxz;
                        }else{
                            $scope.confirmData.sxyy = sxyyxz + "," + sxyysr;
                        }
                    }
                    if($scope.confirmData.sxyy==''){
                        $scope.angularTip("失销原因不能为空",5000);
                        return;
                    }
                    $("#zdsx").hide();
                    $("#msgwindow").show();
                    customerRDService.lostByXbzg($scope.customerId,$scope.principalId,$scope.principal,$scope.confirmData.sxyy,sxyyxz)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status=='OK') {
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.angularTip("操作成功",5000);
                                $scope.$emit("CountByUserIdTop", true);
                                $("#genzcl").hide();
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

            //批量睡眠
            $scope.batchSm = function() {
                var SelectedCount = 0;
                var SelectedGridRows = {};
                var qkSearch=$("#qkSearch").val();
                SelectedCount = $scope.gridApi_qk.selection.getSelectedCount();
                SelectedGridRows = $scope.gridApi_qk.selection.getSelectedGridRows();
                $scope.sleepDatas = [];
                if(SelectedCount == 0){
                    $scope.angularTip("请先选择潜客",5000)
                }else if(qkSearch!=2){
                    $scope.angularTip("请先筛选出睡眠待审批的潜客",5000)
                }else{
                    for (var i=0;i<SelectedCount;i++){
                        var customerId = SelectedGridRows[i].entity.customerId;
                        var chassisNumber=SelectedGridRows[i].entity.chassisNumber;
                        var oneData = {
                            customerId:customerId,chassisNumber:chassisNumber,
                        }
                        $scope.sleepDatas.push(oneData);
                    };
                    $("#msgwindow").show();
                    customerRDService.sleepBatchXBZG($scope.sleepDatas).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getSearchByTime();
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("睡眠成功",5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };
            //批量失销
            $scope.batchSx = function() {
                var SelectedCount = 0;
                var SelectedGridRows = {};
                var qkSearch=$("#qkSearch").val();
                SelectedCount = $scope.gridApi_qk.selection.getSelectedCount();
                SelectedGridRows = $scope.gridApi_qk.selection.getSelectedGridRows();
                $scope.shixiaoDatas = [];
                if(SelectedCount == 0){
                    $scope.angularTip("请先选择潜客",5000)
                }else if(qkSearch!=1){
                    $scope.angularTip("请先筛选出失销待审批的潜客",5000)
                }else{
                    for (var i=0;i<SelectedCount;i++){
                        var customerId = SelectedGridRows[i].entity.customerId;
                        var principalId = SelectedGridRows[i].entity.principalId;
                        var principal = SelectedGridRows[i].entity.principal;
                        var oneData = {
                            customerId:customerId,principalId:principalId,principal:principal,
                        }
                        $scope.shixiaoDatas.push(oneData);
                    };
                    $("#msgwindow").show();
                    customerRDService.batchLostSale($scope.shixiaoDatas).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getSearchByTime();
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("失销成功",5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };
            //续保主管同意回退按钮
            $scope.traceReturn = function(retrunType){
                $scope.retrunType = retrunType;
                $scope.footerBtn = "tyht";
                //bug修复
                if($scope.principalId==null||$scope.principalId==''){
                    if($scope.genzcl.principalId){
                        $scope.principalId = $scope.genzcl.principalId;
                    }
                }
                if($scope.principal==null||$scope.principal==''){
                    if($scope.genzcl.principal){
                        $scope.principal = $scope.genzcl.principal;
                    }
                }
                if(($scope.principalId==null||$scope.principalId==''||$scope.principalId!=$scope.assign_userId)&&retrunType==1){
                    $scope.angularTip("非续保专员申请的回退，不能执行此操作",5000);
                    return;
                }
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.traceReturnFun();
                }
            };

            //续保主管回退
            $scope.traceReturnFun = function(){
                if($scope.retrunType==1){
                    $("#tyht").show();
                }else if($scope.retrunType==2){
                    $("#tysx").show();
                }else if($scope.retrunType==3){
                    $("#tysm").show();
                }
                $scope.makesure = function() {
                    var reason;
                    if($scope.retrunType==1){
                        reason = $scope.confirmData.tyhtyj;
                    }else if($scope.retrunType==2){
                        reason = $scope.confirmData.tysxyy;
                    }else if($scope.retrunType==3){
                        reason = $scope.confirmData.tysmyy;
                    }
                    if(!reason){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    if($scope.retrunType==1){
                        $("#tyht").hide();
                    }else if($scope.retrunType==2){
                        $("#tysx").hide();
                    }else if($scope.retrunType==3){
                        $("#tysm").hide();
                    }
                    $("#msgwindow").show();
                    customerRDService.traceReturn($scope.customerId, $scope.principalId,$scope.principal,reason)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                            ;
                        });
                }
            };
            //选择负责人
            $scope.checkPrincipalBtn = function(){
                $scope.footerBtn = "ghrp";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }
            }

            //续保主管更换负责人
            $scope.replacePrincipal = function(){
                //bug修复
                if($scope.principalId==null||$scope.principalId==''){
                    if($scope.genzcl.principalId){
                        $scope.principalId = $scope.genzcl.principalId;
                    }
                }
                if($scope.principalId==null||$scope.principalId==''){
                    $scope.angularTip("该潜客不在续保专员名下，不能更换负责人。",5000)
                    return;
                }
                if($scope.returnStatu==3&&$scope.cusLostInsurStatu==2){
                    $scope.angularTip("该潜客已经脱保，且处于待回退，不能更换负责人。",5000)
                    return;
                }
                if($scope.returnStatu==7&&$scope.cusLostInsurStatu==2){
                    $scope.angularTip("该潜客已经脱保，且处于待延期，不能更换负责人。",5000)
                    return;
                }
                if(!$scope.newPrincipal.principal){
                    $scope.angularTip("请选择负责人。",5000);
                    return;
                }
                $("#ghfzr").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.ghfzryy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#ghfzr").hide();
                    $("#msgwindow").show();
                    customerRDService.replacePrincipal($scope.customerId, $scope.newPrincipal.principal.id,
                        $scope.newPrincipal.principal.userName, $scope.principalId,$scope.principal,$scope.confirmData.ghfzryy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                if($scope.pageType!='tb'&& $scope.pageType!='js'&& $scope.pageType!='ddwcd'){
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                    $scope.policyCount = $scope.policyCount-1;
                                };
                                $scope.thisRowData.principal = $scope.newPrincipal.principal.userName;
                                $scope.thisRowData.principalId = $scope.newPrincipal.principal.id;
                                $scope.thisRowData.holder = $scope.newPrincipal.principal.userName;
                                $scope.$emit("CountByUserIdTop", true);
                                $("#genzcl").hide();
                                $scope.angularTip("更换成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //续保主管指定负责人
            $scope.assignPrincipal = function(){

                if(!$scope.newPrincipal.principal){
                    $scope.angularTip("请选择负责人。",5000);
                    return;
                }
                $("#ghfzr").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.ghfzryy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#ghfzr").hide();
                    $("#msgwindow").show();
                    customerRDService.assignPrincipal($scope.customerId, $scope.newPrincipal.principal.id,
                        $scope.newPrincipal.principal.userName, $scope.principalId,$scope.confirmData.ghfzryy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                if($scope.pageType!='tb'&& $scope.pageType!='js'){
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                    $scope.policyCount = $scope.policyCount-1;
                                };
                                $scope.$emit("CountByUserIdTop", true);
                                $("#genzcl").hide();
                                $scope.angularTip("指定成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //续保主管激活按钮
            $scope.wakeUpCustomer = function(){
                $scope.footerBtn = "hx";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.wakeUpCustomerFun();
                }
            };
            //激活
            $scope.wakeUpCustomerFun = function(){
                $("#hx").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.hxyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#hx").hide();
                    $("#msgwindow").show();
                    customerRDService.wakeUpCustomer($scope.customerId, $scope.principalId, $scope.principal, $scope.confirmData.hxyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip(result.results.message,5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

            //同意延期按钮
            $scope.updateReturnStatuToYyq = function(){
                $scope.footerBtn = "tyyq";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.updateReturnStatuToYyqFun();
                }
            };
            //续保主管同意延期
            $scope.updateReturnStatuToYyqFun = function(){
                $("#tyyq").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.tyyqyj){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#tyyq").hide();
                    $("#msgwindow").show();
                    if(!$scope.principalId || !$scope.principal){
                        if($scope.genzcl.principalId){
                            $scope.principalId = $scope.genzcl.principalId;
                        }
                        if($scope.genzcl.principal){
                            $scope.principal = $scope.genzcl.principal;
                        }
                    }
                    customerRDService.updateReturnStatuToYyq($scope.customerId, $scope.principalId,$scope.principal,$scope.confirmData.tyyqyj)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //直接延期按钮
            $scope.updateReturnStatuByRD = function(){
                $scope.footerBtn = "yq";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.updateReturnStatuByRDFun();
                }
            };
            //续保主管直接延期
            $scope.updateReturnStatuByRDFun = function(){
                var currentTime = $filter('date')(new Date(),'yyyy-MM-dd');
                var delayDate = $filter('date')($scope.delayDate,'yyyy-MM-dd');
                if(delayDate!=null&&delayDate>currentTime){
                    $scope.angularTip("该潜客已脱保时间未超出延期时间范围，此操作无法执行。",5000);
                    return;
                }
                $("#yq").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.yqyy){
                        $scope.angularTip("延期原因不能为空！",5000);
                        return;
                    }
                    $("#yq").hide();
                    $("#msgwindow").show();
                    if(!$scope.principalId || !$scope.principal){
                        if($scope.genzcl.principalId){
                            $scope.principalId = $scope.genzcl.principalId;
                        }
                        if($scope.genzcl.principal){
                            $scope.principal = $scope.genzcl.principal;
                        }
                    }
                    customerRDService.updateReturnStatuByRD($scope.customerId, $scope.principalId,$scope.principal,$scope.confirmData.yqyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //拒绝回退按钮
            $scope.unAgreeTraceReturnXbzg = function(refuseType){
                $scope.refuseType = refuseType;
                $scope.footerBtn = "jjht";
                if($scope.principalId==null||$scope.principalId==''){
                    if($scope.genzcl.principalId){
                        $scope.principalId = $scope.genzcl.principalId;
                    }
                }
                if($scope.principal==null||$scope.principal==''){
                    if($scope.genzcl.principal){
                        $scope.principal = $scope.genzcl.principal;
                    }
                }
                console.log(" 续保主管拒绝回退: " +$scope.principalId +" "+$scope.assign_userId);
                if(($scope.principalId==null||$scope.principalId==''||$scope.principalId!=$scope.assign_userId) && refuseType==1){
                    $scope.angularTip("非续保专员申请的回退，不能执行此操作",5000);
                    return;
                }
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.unAgreeTraceReturnXbzgFun();
                }
            };

            //续保主管不同意回退
            $scope.unAgreeTraceReturnXbzgFun = function(){
                if($scope.refuseType==1){
                    $("#jjht").show();
                }else if($scope.refuseType==2){
                    $("#jjsx").show();
                }else if($scope.refuseType==3){
                    $("#jjsm").show();
                }
                $scope.makesure = function() {
                    var reason;
                    if($scope.refuseType==1){
                        reason = $scope.confirmData.jjhtyy;
                    }else if($scope.refuseType==2){
                        reason = $scope.confirmData.jjsxyy;
                    }else if($scope.refuseType==3){
                        reason = $scope.confirmData.jjsmyy;
                    }
                    if(!reason){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    if($scope.refuseType==1){
                        $("#jjht").hide();
                    }else if($scope.refuseType==2){
                        $("#jjsx").hide();
                    }else if($scope.refuseType==3){
                        $("#jjsm").hide();
                    }
                    $("#msgwindow").show();
                    customerRDService.unAgreeTraceReturnXbzg($scope.customerId, $scope.principalId,$scope.principal,reason)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //主动回退按钮
            $scope.activeReturnBut = function(){
                $scope.footerBtn = "zdht";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.activeReturn();
                }
            }

            //主动回退方法
            $scope.activeReturn = function(){
                $("#zdhtyy").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.zdhtyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#zdhtyy").hide();
                    $("#msgwindow").show();
                    customerRDService.activeReturn($scope.customerId,$scope.principalId,$scope.principal,$scope.confirmData.zdhtyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }
            //不同意延期按钮
            $scope.updateReturnStatuToCszt = function(){
                $scope.footerBtn = "jjyq";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.updateReturnStatuToCsztFun();
                }
            };
            //续保主管不同意延期
            $scope.updateReturnStatuToCsztFun = function(){
                $("#jjyq").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.jjyqyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#jjyq").hide();
                    $("#msgwindow").show();
                    customerRDService.updateReturnStatuToCszt($scope.customerId, $scope.principalId,$scope.principal,$scope.confirmData.jjyqyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#genzcl").hide();
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.customer), 1);
                                $scope.policyCount = $scope.policyCount-1;
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.angularTip("操作成功",5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            };

            //睡眠按钮
            $scope.customerSleep = function(){
                $scope.footerBtn = "sm";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.customerSleepFun();
                }
            };
            //睡眠
            $scope.customerSleepFun = function(){
                $("#sm").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.smyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#sm").hide();
                    $("#msgwindow").show();
                    customerRDService.customerSleep($scope.customerId,$scope.principalId,$scope.principal,$scope.confirmData.smyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK') {
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf( $scope.customer), 1);
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.policyCount = $scope.policyCount-1;
                                $("#genzcl").hide();
                                $scope.angularTip('睡眠成功',5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

            //取消睡眠
            $scope.saveCancelSleep = function(){
                var jqxrqEnd = $scope.genzcl.jqxrqEnd;
                $("#msgwindow").show();
                customerRDService.saveCancelSleep($scope.customerId,$scope.principalId,$scope.principal,jqxrqEnd)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            if($scope.pageType=='qkcx'){
                                if($scope.search.customerLevel && $scope.search.customerLevel=='S'){
                                    $scope.customerAllSearchPage.data.splice($scope.customerAllSearchPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policySearchCount = $scope.policySearchCount-1;
                                    $scope.thisRowData.customerLevel = "A";
                                    $scope.genzcl.customerLevel="A";
                                    $scope.customer.customerLevel="A";
                                }else{
                                    $scope.thisRowData.customerLevel = "A";
                                    $scope.genzcl.customerLevel="A";
                                    $scope.customer.customerLevel="A";
                                }
                            }
                            $scope.angularTip(result.results.message,5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
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
                            $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                            return
                        }
                        $scope.carBrandsgz[i].carModelList=[{modelName:vehicleModel}];
                        $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                        $scope.genzcl.vehicleModel = $scope.genzcl.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsgz[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_gzcl").show();
                        $("#clxhxz_gzcl").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                            return
                        }
                        $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                        $scope.genzcl.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsgz[i].brandName&&sfyy==1){
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                        for(var j = 0 ;j<$scope.genzcl.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.genzcl.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsgz[i].carModelList.push({modelName:vehicleModel});
                            $scope.genzcl.carBrand = $scope.carBrandsgz[i];
                        }
                        for(var j = 0 ;j<$scope.genzcl.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.genzcl.carBrand.carModelList[j].modelName){
                                $scope.genzcl.vehicleModel = $scope.genzcl.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }

            //跟踪处理品牌车型选择框与输入框切换
            $scope.gzclVehicleModel = function(){
                $scope.genzcl.vehicleModel='';
                $scope.genzcl.vehicleModelInput='';
                if($scope.genzcl.carBrand){
                    if($scope.genzcl.carBrand.brandName=='异系'){
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
            //潜客查询品牌车型选择框与输入框切换
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
            //停止导出
            $scope.stopExportData = function(){
                $scope.stopExport = true;
            }
            $scope.expCountValue = [5000,6000,7000,8000,9000,10000];
            $scope.setExport.expCount = 5000;
            //导出潜客按钮事件
            $scope.exportSetNum=function(tableId){
                $scope.showExp = 1;
                $scope.expNum = 0;
                if($scope.pageType == 'qkcx'){
                    $scope.expNum =  $scope.policySearchCount
                }else {
                    $scope.expNum =  $scope.policyCount
                };
                if($scope.expNum==0){
                    if($scope.pageType == 'bspcx'){
                        $scope.angularTip("无线索导出！",5000);
                    }else {
                        $scope.angularTip("无潜客导出！",5000);
                    }
                    return;
                }
                if($scope.expNum>5000){
                    $("#exportSet").show();
                    $scope.setExp = function(){
                        $("#exportSet").hide();
                        $scope.exportNumberEachFile = $scope.setExport.expCount;
                        $scope.exportToExcel(tableId);
                    }
                }else {
                    $scope.exportToExcel(tableId);
                }
            }

            //导出潜客
            $scope.exportToExcel=function(tableId){
                $("#msgwindowExport").show();
                $scope.loadFinish = '';//每次请求完成
                $scope.loadDataFinish = false;//分文件导出,一个文件导出完毕标志
                $scope.finaLoadDataFinish = false;//最终全部导出完成标志
                $scope.showSuccessExport =0;//显示成功导出条数
                $scope.stopExport = false;
                $scope.policyExportCount = 0
                $scope.progressExport = {width:"0%"}
                $scope.startNumExport = 1; //开始页
                $scope.exportData = [];
                $scope.tableId = tableId;
                var load = $scope.$watch("loadFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if($scope.loadFinish){
                        $scope.getExportData();
                    }
                },true);
                var creatingFile =$scope.$watch("loadDataFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.loadDataFinish) {
                        //最终导出完成,释放loadDataFinish监听
                        if($scope.finaLoadDataFinish){
                            load();
                            creatingFile();
                        }
                        $scope.loadFinish = false;

                        setTimeout(function(){
                            var id_key = '#'+$scope.pageType + $scope.pageStatus;
                            if($scope.pageType=="qkcx"){id_key='#qkcx0';}
                            if($scope.pageType=="bspcx"){id_key='#bspcx7';}
                            var pageTypeName = $(id_key).html().trim();
                            var fileName = $scope.storetitle+$filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客.xls'
                            var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客';
                            ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName)
                            if(!$scope.finaLoadDataFinish){
                                $scope.loadFinish = true;
                                $scope.loadDataFinish = false;
                            }
                            $scope.exportData = [];
                            if($scope.finaLoadDataFinish){
                                $("#msgwindowExport").hide();
                            }
                        },100);
                    }
                },true);
                var stop =$scope.$watch("stopExport", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.stopExport) {
                        load();
                        creatingFile();
                        stop();
                        $scope.loadFinish = '';
                        $scope.exportData = [];
                        $("#msgwindowExport").hide();
                    }
                },true);
                $scope.getExportData();
            }
            //导出潜客获取数据方法
            $scope.getExportData = function () {
                if ($scope.pageType == 'gz') {
                    $scope.findByTraceStatuExport('gz', $scope.pageStatus) //跟踪
                } else if ($scope.pageType == 'js') {
                    $scope.findByAcceptStatuExport('js', $scope.pageStatus) //接收
                } else if ($scope.pageType == 'tb') {
                    $scope.findByCusLostInsurStatuExport('tb', $scope.pageStatus)//潜客脱保(脱保)
                } else if ($scope.pageType == 'yyjl') {
                    $scope.findByInviteStatuExport('yyjl', $scope.pageStatus);//邀约记录
                } else if ($scope.pageType == 'ht') {
                    $scope.findByReturnStatuExport('ht', $scope.pageStatus)//回退
                } else if ($scope.pageType == 'dsp') {
                    $scope.findByApprovalStatuExport('dsp', $scope.approvalStatu)//待审批
                } else if ($scope.pageType == 'qkcx') {
                    $scope.findByConditionExport();
                } else if ($scope.pageType == 'jh'){
                    $scope.findActivateCustomerExport('jh',$scope.pageStatus);//已唤醒
                }else if ($scope.pageType == 'yjh'){
                    $scope.findByJiHuoExport('yjh',$scope.pageStatus);//已激活
                }else if ($scope.pageType == 'ddwcd'){
                    $scope.findDdwcdCusExport('ddwcd',$scope.pageStatus);//到店未出单
                }else if($scope.pageType == 'bspcx'){
                    $scope.findBspDefeatCustomerExport('bspcx') //战败线索
                }
                $scope.startNumExport = $scope.startNumExport + 1;
            };

            //查询导出潜客回调后的处理
            $scope.getExportDataCallback = function(customerArray,policyExportCount){
                $.merge($scope.exportData,customerArray);
                //每个文件设置可以导出条数限制
                if($scope.exportData.length>0&&$scope.exportData.length%$scope.exportNumberEachFile==0){
                    $scope.loadDataFinish=true;
                }
                if(customerArray.length<$rootScope.pageSize){
                    $scope.loadDataFinish=true;
                    $scope.finaLoadDataFinish=true;
                }
                for (var i = 0; i < $scope.exportData.length; i++) {
                    if($scope.exportData[i].customerAssigns && $scope.exportData[i].customerAssigns.length>0){
                        var firstAcceptDate = $scope.exportData[i].customerAssigns[0].assignDate;
                        var currentDate = new Date().getTime();
                        var cyts = (currentDate - firstAcceptDate) / (1000 * 60 * 60 * 24);
                        $scope.exportData[i].cyts = parseInt(cyts);
                        if (firstAcceptDate == 0 || firstAcceptDate == null) {
                            $scope.exportData[i].cyts = "--";
                        }
                        var holder = $scope.exportData[i].holder;
                        if (holder == "" || holder == null) {
                            $scope.exportData[i].cyts = "--";
                        }
                    }

                };
                $scope.policyExportCount = policyExportCount;
                $scope.showSuccessExport += customerArray.length;
                var pro=0;
                if($scope.policyExportCount!=0) {
                    pro = ($scope.showSuccessExport / policyExportCount * 100).toFixed(2);
                }
                $scope.progressExport.width = pro+"%";
                $scope.loadFinish = true;
            }

            //导出战败线索
            $scope.findBspDefeatCustomerExport = function(pageType){
                $scope.loadFinish = false;
                $scope.pageType = pageType;
                var sxyy =  $scope.zbqk.sxyy;
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                customerRDService.findDefeatCustomer(short,shortmain,$scope.startTime,$scope.endTime,$scope.startNumExport,$scope.showAll,sxyy)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        }
                    });
            };
            //按条件查询潜客信息---导出潜客
            $scope.findByConditionExport = function() {
                $scope.loadFinish = false;
                var fourSStoreId = $rootScope.user.store.storeId;
                var carBrand = undefined;
                var vehicleModel = undefined;
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
                var insuranceCompLY = $scope.search.insuranceCompLY;
                var renewalTypes = $scope.search.renewalType;
                var customerLevel = $scope.search.customerLevel;
                var comeStoreNumber = $scope.search.comeStoreNumber;
                var principalId = $scope.search.principalId;
                var principal = $scope.search.principal;
                var insurNumber = $scope.search.insurNumber;
                var isInvite = $scope.search.isInvite;
                var isComeStore = $scope.search.isComeStore;
                var isQuote = $scope.search.isQuote;
                var insuDateStartTime = $scope.search.insuDateStartTime;
                var insuDateEndTime = $scope.search.insuDateEndTime;
                var insuEndStartTime = $scope.search.insuEndStartTime;
                var insuEndEndTime = $scope.search.insuEndEndTime;
                var syxrqDateStart=$scope.search.syxrqDateStart;
                var syxrqDateEnd=$scope.search.syxrqDateEnd;
                var inviteStartTime = $scope.search.inviteStartTime;
                var inviteEndTime = $scope.search.inviteEndTime;
                var comeStoreStartTime = $scope.search.comeStoreStartTime;
                var comeStoreEndTime = $scope.search.comeStoreEndTime;
                var lastTraceStartTime = $scope.search.lastTraceStartTime;
                var lastTraceEndTime = $scope.search.lastTraceEndTime;
                var quoteStartTime = $scope.search.quoteStartTime;
                var quoteEndTime = $scope.search.quoteEndTime;
                var traceStartTime = $scope.search.traceStartTime;
                var traceEndTime = $scope.search.traceEndTime;
                var carOwner = $scope.search.carOwner;
                var holder = $scope.search.holder;
                var createTimeStart = $scope.search.createTimeStart;
                var createTimeEnd = $scope.search.createTimeEnd;
                var createrId = $scope.search.createrId;
                var defeatFlag = $scope.search.defeatFlag;
                var LostInsurDay = $scope.search.remainLostInsurDay;
                var registrationDateStart = $scope.search.registrationDateStart;
                var registrationDateEnd = $scope.search.registrationDateEnd;
                var sfgyx = $scope.search.sfgyx;
                var ifLoan = $scope.search.ifLoan;
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
                var searchDatas = {
                    startNum:$scope.startNumExport,fourSStoreId:fourSStoreId,
                    carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                    carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                    contactWay: contactWay, insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
                    customerLevel: customerLevel, comeStoreNumber:comeStoreNumber,insurNumber: insurNumber,
                    principalId:principalId,principal:principal,
                    isInvite: isInvite, isComeStore: isComeStore, isQuote: isQuote,
                    insuDateStartTime: insuDateStartTime, insuDateEndTime: insuDateEndTime,
                    insuEndStartTime: insuEndStartTime, insuEndEndTime: insuEndEndTime,
                    syxrqDateStart: syxrqDateStart,syxrqDateEnd: syxrqDateEnd,
                    inviteStartTime: inviteStartTime, inviteEndTime: inviteEndTime,
                    comeStoreStartTime: comeStoreStartTime, comeStoreEndTime: comeStoreEndTime,
                    lastTraceStartTime: lastTraceStartTime, lastTraceEndTime: lastTraceEndTime,
                    quoteStartTime: quoteStartTime, quoteEndTime: quoteEndTime, traceStartTime: traceStartTime,
                    traceEndTime: traceEndTime,carOwner:carOwner,holder:holder,remainLostInsurDayStart:remainLostInsurDayStart,
                    remainLostInsurDayEnd:remainLostInsurDayEnd,sfgyx:sfgyx,ifLoan:ifLoan,
                    registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                    createTimeStart:createTimeStart,createTimeEnd:createTimeEnd,createrId:createrId,defeatFlag:defeatFlag
                }
                if( insuDateStartTime != null  && insuDateEndTime != null && insuDateStartTime != ""  && insuDateEndTime != "" && insuDateStartTime>insuDateEndTime){
                    $scope.angularTip("投保开始日期不能大于结束日期！",5000)
                }else if(insuEndStartTime != null && insuEndEndTime != null && insuEndStartTime != "" && insuEndEndTime != "" && insuEndStartTime>insuEndEndTime){
                    $scope.angularTip("保险到期开始日期不能大于结束日期！",5000)
                }else if(inviteStartTime != null && inviteEndTime != null && inviteStartTime != "" && inviteEndTime != "" && inviteStartTime>inviteEndTime){
                    $scope.angularTip("邀约开始日期不能大于结束日期！",5000)
                }else if(comeStoreStartTime != null && comeStoreEndTime != null && comeStoreStartTime != "" && comeStoreEndTime != "" && comeStoreStartTime>comeStoreEndTime){
                    $scope.angularTip("到店日开始日期不能大于结束日期！",5000)
                }else if(lastTraceStartTime != null && lastTraceEndTime != null && lastTraceStartTime != "" && lastTraceEndTime != "" && lastTraceStartTime>lastTraceEndTime){
                    $scope.angularTip("末次跟踪日期开始日期不能大于结束日期！",5000)
                }else if(quoteStartTime != null && quoteEndTime != null && quoteStartTime != "" && quoteEndTime != "" && quoteStartTime>quoteEndTime){
                    $scope.angularTip("报价开始日期不能大于结束日期！",5000)
                }else if(traceStartTime != null && traceEndTime != null && traceStartTime != "" && traceEndTime != "" && traceStartTime>traceEndTime){
                    $scope.angularTip("应跟踪开始日期不能大于结束日期！",5000)
                }else if(registrationDateStart != null && registrationDateEnd != null && registrationDateStart != "" && registrationDateEnd != "" && registrationDateStart>registrationDateEnd){
                    $scope.angularTip("上牌日期开始日期不能大于结束日期！",5000)
                }else if(syxrqDateStart != null && syxrqDateEnd != null && syxrqDateStart != "" && syxrqDateEnd != "" && syxrqDateStart>syxrqDateEnd){
                    $scope.angularTip("商业到期开始日期不能大于结束日期！",5000)
                }else {
                    customerRDService.findByCondition(searchDatas).then(function (result) {
                        if (result.status == 'OK' && result.result.content.status == 'OK') {
                            $scope.getExportDataCallback(result.result.content.result,result.result.content.policyCount);
                        } else {
                            $scope.angularTip(result.result.message,5000)
                        }

                    });
                }
            }
            //根据跟踪状态查询---导出潜客
            $scope.findByTraceStatuExport = function(pageType,traceStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var qnbfSort = $scope.qkSearch.qnbfSort;
                var sfgyx = $scope.qkSearch.sfgyx;
                $scope.pageType = pageType;
                $scope.pageStatus = traceStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,traceStatu:traceStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,sfgyx:sfgyx,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,qnbfSort:qnbfSort};
                }else {
                    condition = {traceStatu:traceStatu,startNum:$scope.startNumExport,sfgyx:sfgyx,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,qnbfSort:qnbfSort};
                };
                customerRDService.findByTraceStatu(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {

                        };
                    });
            };
            //根据潜客脱保状态查询---导出潜客
            $scope.findByCusLostInsurStatuExport = function(pageType,cusLostInsurStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = cusLostInsurStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,cusLostInsurStatu:cusLostInsurStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {cusLostInsurStatu:cusLostInsurStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findByCusLostInsurStatu(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {
                        };
                    });
            };
            //查询邀约潜客---导出潜客
            $scope.findByInviteStatuExport = function(pageType,inviteStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var inviteHappenTimeStart = $scope.qkSearch.inviteHappenTimeStart;
                var inviteHappenTimeEnd = $scope.qkSearch.inviteHappenTimeEnd;
                $scope.pageType = pageType;
                $scope.pageStatus = inviteStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,inviteStatu:inviteStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber, inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd};
                }else {
                    condition = {inviteStatu:inviteStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,
                        inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd};
                };
                customerRDService.findByInviteStatu(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {

                        }
                    });
            }
            //根据接收状态查询---导出潜客
            $scope.findByAcceptStatuExport = function(pageType,acceptStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = acceptStatu;
                var condition = {acceptStatu:acceptStatu,startNum:$scope.startNumExport, renewalType:renewalType,
                    holder:holder,chassisNumber:chassisNumber, contact:contact,
                    contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                customerRDService.findByAcceptStatu(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {

                        };
                    });
            };
            //根据回退状态查询---导出潜客
            $scope.findByReturnStatuExport = function(pageType,returnStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var insuranceEndDateStart = $scope.qkSearch.insuranceEndDateStart;
                var insuranceEndDateEnd = $scope.qkSearch.insuranceEndDateEnd;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,
                        insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd};
                }else {
                    condition = {returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,
                        insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd};
                };
                if(returnStatu==2){
                    customerRDService.findByYiHuiTui(condition)
                        .then(function (result) {
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                            } else {

                            };
                        });
                }else{
                    customerRDService.findByReturnStatu(condition)
                        .then(function (result) {
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                            } else {

                            };
                        });
                }
            };
            //根据审批状态查询---导出潜客
            $scope.findByApprovalStatuExport = function(pageType,approvalStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var custStatu = $scope.qkSearch.returnStatu3;
                var returnStatu3 = "";
                var applyStatu = "";
                if(custStatu==3||custStatu==7){
                    returnStatu3 = custStatu;
                }else if(custStatu==1||custStatu==2){
                    returnStatu3 = 3;
                    applyStatu = custStatu;
                }
                $scope.pageType = pageType;
                $scope.approvalStatu = '3,7';
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,approvalStatu:approvalStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                }else {
                    condition = {approvalStatu:approvalStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                };
                customerRDService.findByApprovalStatu(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {

                        };
                    });
            };
            //查询已经唤醒的潜客---导出潜客
            $scope.findActivateCustomerExport = function(pageType,returnStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findActivateCustomer(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.result,result.results.content.policyCount);
                        } else {

                        };
                    });
            };
            //查询已激活的潜客---导出潜客
            $scope.findByJiHuoExport = function(pageType,pageStatus){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = pageStatus;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime: $scope.startTime, endTime: $scope.endTime, startNum: $scope.startNumExport,
                        renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                        contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                }else {
                    condition = {startNum: $scope.startNumExport, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                        contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                };
                customerRDService.findByJiHuo(condition).then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                        } else {

                        };
                    });
            };
            //查询到店未出单潜客---导出潜客
            $scope.findDdwcdCusExport = function(pageType,pageStatus){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = pageStatus;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime: $scope.startTime, endTime: $scope.endTime, startNum: $scope.startNumExport,
                        renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                        contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                }else {
                    condition = {startNum: $scope.startNumExport, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                        contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber};
                };
                customerRDService.findDdwcdCus(condition).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.getExportDataCallback(result.results.content.list,result.results.content.policyCount);
                    } else {

                    };
                });
            };
            //导出潜客跟踪记录
            $scope.exportGzjlSetNum=function(tableId){
                $scope.gzjlBol=true;
                $scope.showExp = 2;
                if($scope.pageType == 'qkcx'){
                    $scope.expNum =  $scope.policySearchCount
                }else {
                    $scope.expNum =  $scope.policyCount
                };
                if($scope.expNum==0){
                    $scope.angularTip("无潜客记录导出！",5000);
                    return;
                }
                if($scope.expGzjlNum>5000){
                    $("#exportSet").show();
                    $scope.setExp = function(){
                        $("#exportSet").hide();
                        $scope.exportNumberEachFile = $scope.setExport.expCount;
                        $scope.exportGzjlToExcel(tableId);
                    }
                }else {
                    $scope.exportGzjlToExcel(tableId);
                }
            }
            //导出潜客跟踪记录
            $scope.exportGzjlToExcel=function(tableId){
                $("#msgwindowExportGzjl").show();
                $scope.loadDataFinish = false;//分文件导出,一个文件导出完毕标志
                $scope.finaLoadDataFinish = false;//最终全部导出完成标志
                $scope.showSuccessExport =0;//显示成功导出条数
                $scope.stopExport = false;
                $scope.customerGzjlExportCount = 0
                $scope.progressExport = {width:"0%"}
                $scope.startNumExport = 1; //开始页
                //$scope.dataNumExport = 0; //已经获取的数据页数
                $scope.customerGzjlCount = 0;
                $scope.customerCount = 0;
                $scope.progressGzjl = 0;
                $scope.exportGzjlData = [];
                $scope.exportGzjlDataTemp = [];
                $scope.exportFileNumber =0;//已经导出文件个数
                $scope.tableId = tableId;
                var creatingFileGzjl =$scope.$watch("loadDataFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.loadDataFinish) {
                        //最终导出完成,释放loadDataFinish监听
                        if($scope.finaLoadDataFinish){
                            creatingFileGzjl();
                        }
                        //if(!$scope.finaLoadDataFinish){
                        //    $scope.loadFinish = true;
                        //    $scope.loadDataFinish = false;
                        //}
                        setTimeout(function(){
                            var id_key = '#'+$scope.pageType + $scope.pageStatus;
                            if($scope.pageType=="qkcx"){id_key='#qkcx0';}
                            var pageTypeName = $(id_key).html().trim();
                            if($scope.pageType=="yyjl"){
                                var fileName = $scope.storetitle+$filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客邀约记录.xls'
                                var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客邀约记录';
                            }else{
                                var fileName = $scope.storetitle+$filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客跟踪记录.xls'
                                var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客跟踪记录';
                            }
                            ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName);
                            $scope.exportGzjlDataTemp = [];
                            $scope.exportFileNumber += 1;
                            if(!$scope.finaLoadDataFinish){
                                $scope.loadDataFinish = false;
                                $scope.getExportGzjlData();
                            }
                            if($scope.finaLoadDataFinish){
                                $scope.exportGzjlData = [];
                                $("#msgwindowExportGzjl").hide();
                            }

                        },100);
                    }
                },true);
                var stopGzjl =$scope.$watch("stopExport", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.stopExport) {
                        creatingFileGzjl();
                        stopGzjl();
                        $scope.loadFinish = '';
                        $scope.exportGzjlDataTemp = [];
                        $scope.exportGzjlData = [];
                        $("#msgwindowExportGzjl").hide();
                    }
                },true);
                $scope.getExportGzjlData();
            }
            //导出潜客获取数据方法--跟踪记录
            $scope.getExportGzjlData = function () {
                if ($scope.pageType == 'gz') {
                    $scope.findByTraceStatuGzjlExport('gz', $scope.pageStatus) //跟踪
                } else if ($scope.pageType == 'js') {
                    $scope.findByAcceptStatuGzjlExport('js', $scope.pageStatus) //接收
                } else if ($scope.pageType == 'tb') {
                    $scope.findByCusLostInsurStatuGzjlExport('tb', $scope.pageStatus)//潜客脱保(脱保)
                } else if ($scope.pageType == 'yyjl') {
                   $scope.findByInviteStatuGzjlExport('yyjl', $scope.pageStatus);//邀约记录
                } else if ($scope.pageType == 'ht') {
                    $scope.findByReturnStatuGzjlExport('ht', $scope.pageStatus)//回退
                } else if ($scope.pageType == 'dsp') {
                    $scope.findByApprovalStatuGzjlExport('dsp', $scope.approvalStatu)//待审批
                } else if ($scope.pageType == 'qkcx') {
                    $scope.findByConditionGzjlExport();
                } else if ($scope.pageType == 'jh'){
                    $scope.findActivateCustomerGzjlExport('jh',$scope.pageStatus);//已唤醒
                }
                $scope.startNumExport = $scope.startNumExport + 1;
            };


            //导出潜客邀约记录
            $scope.exportToExcel=function(tableId){
                $("#msgwindowExport").show();
                $scope.loadFinish = '';//每次请求完成
                $scope.loadDataFinish = false;//分文件导出,一个文件导出完毕标志
                $scope.finaLoadDataFinish = false;//最终全部导出完成标志
                $scope.showSuccessExport =0;//显示成功导出条数
                $scope.stopExport = false;
                $scope.policyExportCount = 0
                $scope.progressExport = {width:"0%"}
                $scope.startNumExport = 1; //开始页
                $scope.exportData = [];
                $scope.tableId = tableId;
                var load = $scope.$watch("loadFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if($scope.loadFinish){
                        $scope.getExportData();
                    }
                },true);
                var creatingFile =$scope.$watch("loadDataFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.loadDataFinish) {
                        //最终导出完成,释放loadDataFinish监听
                        if($scope.finaLoadDataFinish){
                            load();
                            creatingFile();
                        }
                        $scope.loadFinish = false;

                        setTimeout(function(){
                            var id_key = '#'+$scope.pageType + $scope.pageStatus;
                            if($scope.pageType=="qkcx"){id_key='#qkcx0';}
                            var pageTypeName = $(id_key).html().trim();
                            var fileName = $scope.storetitle+$filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客.xls'
                            var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'潜客';
                            ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName)
                            if(!$scope.finaLoadDataFinish){
                                $scope.loadFinish = true;
                                $scope.loadDataFinish = false;
                            }
                            $scope.exportData = [];
                            if($scope.finaLoadDataFinish){
                                $("#msgwindowExport").hide();
                            }
                        },100);
                    }
                },true);
                var stop =$scope.$watch("stopExport", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.stopExport) {
                        load();
                        creatingFile();
                        stop();
                        $scope.loadFinish = '';
                        $scope.exportData = [];
                        $("#msgwindowExport").hide();
                    }
                },true);
                $scope.getExportData();
            }

            //查询导出潜客回调后的处理--跟踪记录
            $scope.getExportGzjlDataCallback = function(customerArray,customerCount,customerGzjlCount){
                if(customerArray!=null){
                    $scope.showSuccessExport += customerArray.length;
                    $.merge($scope.exportGzjlData,customerArray);
                }
                if($scope.exportGzjlData.length>=$scope.exportNumberEachFile){
                    $scope.exportGzjlDataTemp = $scope.exportGzjlData.slice(0,$scope.exportNumberEachFile);
                    $scope.exportGzjlData = $scope.exportGzjlData.slice($scope.exportNumberEachFile);
                    $scope.loadDataFinish = true;
                    return;
                }else if(customerCount<=$rootScope.pageSize*($scope.startNumExport-1)){
                    $scope.exportGzjlDataTemp = $scope.exportGzjlData;
                    $scope.loadDataFinish=true;
                    $scope.finaLoadDataFinish = true;
                    if(!$scope.pageType=="yyjl"){
                        $scope.exportGzjlDataTemp = arrayUnique($scope.exportGzjlDataTemp);
                    }

                    return;
                }
                $scope.progressGzjl = ($scope.showSuccessExport/customerGzjlCount*100).toFixed(2)+"%";
                if(customerGzjlCount==0){
                    $scope.progressGzjl = "100%";
                }
                $scope.progressExport.width =  $scope.progressGzjl;
                $scope.customerGzjlCount = customerGzjlCount;
                $scope.customerCount = customerCount;
                $scope.getExportGzjlData();
            }
            //排序 去重
            function arrayUnique(req){
                req.sort(compare("customerTraceId")); //先排序
                var res = [req[0]];
                for(var i = 1; i < req.length; i++){
                   if(req[i].customerTraceId !== res[res.length - 1].customerTraceId){
                        res.push(req[i]);
                   }
                }
                return res;
            }
            function compare(property){
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            }
            //按条件查询潜客信息---导出潜客跟踪记录
            $scope.findByConditionGzjlExport = function() {
                $scope.loadFinish = false;
                var fourSStoreId = $rootScope.user.store.storeId;
                var carBrand = undefined;
                var vehicleModel = undefined;
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
                var insuranceCompLY = $scope.search.insuranceCompLY;
                var renewalTypes = $scope.search.renewalType;
                var customerLevel = $scope.search.customerLevel;
                var comeStoreNumber = $scope.search.comeStoreNumber;
                var principalId = $scope.search.principalId;
                var principal = $scope.search.principal;
                var insurNumber = $scope.search.insurNumber;
                var isInvite = $scope.search.isInvite;
                var isComeStore = $scope.search.isComeStore;
                var isQuote = $scope.search.isQuote;
                var insuDateStartTime = $scope.search.insuDateStartTime;
                var insuDateEndTime = $scope.search.insuDateEndTime;
                var insuEndStartTime = $scope.search.insuEndStartTime;
                var insuEndEndTime = $scope.search.insuEndEndTime;
                var inviteStartTime = $scope.search.inviteStartTime;
                var inviteEndTime = $scope.search.inviteEndTime;
                var comeStoreStartTime = $scope.search.comeStoreStartTime;
                var comeStoreEndTime = $scope.search.comeStoreEndTime;
                var lastTraceStartTime = $scope.search.lastTraceStartTime;
                var lastTraceEndTime = $scope.search.lastTraceEndTime;
                var quoteStartTime = $scope.search.quoteStartTime;
                var quoteEndTime = $scope.search.quoteEndTime;
                var traceStartTime = $scope.search.traceStartTime;
                var traceEndTime = $scope.search.traceEndTime;
                var carOwner = $scope.search.carOwner;
                var holder = $scope.search.holder;
                var createTimeStart = $scope.search.createTimeStart;
                var createTimeEnd = $scope.search.createTimeEnd;
                var createrId = $scope.search.createrId;
                var defeatFlag = $scope.search.defeatFlag;
                var LostInsurDay = $scope.search.remainLostInsurDay;
                var registrationDateStart = $scope.search.registrationDateStart;
                var registrationDateEnd = $scope.search.registrationDateEnd;
                var sfgyx = $scope.search.sfgyx;
                var ifLoan = $scope.search.ifLoan;
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
                var searchDatas = {
                    startNum:$scope.startNumExport,fourSStoreId:fourSStoreId,
                    carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                    carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                    contactWay: contactWay, insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
                    customerLevel: customerLevel, comeStoreNumber:comeStoreNumber,insurNumber: insurNumber,
                    principalId:principalId,principal:principal,
                    isInvite: isInvite, isComeStore: isComeStore, isQuote: isQuote,
                    insuDateStartTime: insuDateStartTime, insuDateEndTime: insuDateEndTime,
                    insuEndStartTime: insuEndStartTime, insuEndEndTime: insuEndEndTime,
                    inviteStartTime: inviteStartTime, inviteEndTime: inviteEndTime,
                    comeStoreStartTime: comeStoreStartTime, comeStoreEndTime: comeStoreEndTime,
                    lastTraceStartTime: lastTraceStartTime, lastTraceEndTime: lastTraceEndTime,
                    quoteStartTime: quoteStartTime, quoteEndTime: quoteEndTime, traceStartTime: traceStartTime,
                    traceEndTime: traceEndTime,carOwner:carOwner,holder:holder,remainLostInsurDayStart:remainLostInsurDayStart,
                    remainLostInsurDayEnd:remainLostInsurDayEnd,sfgyx:sfgyx,ifLoan:ifLoan,
                    registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                    createTimeStart:createTimeStart,createTimeEnd:createTimeEnd,createrId:createrId,defeatFlag:defeatFlag
                }
                if( insuDateStartTime != null  && insuDateEndTime != null && insuDateStartTime != ""  && insuDateEndTime != "" && insuDateStartTime>insuDateEndTime){
                    $scope.angularTip("投保开始日期不能大于结束日期！",5000)
                }else if(insuEndStartTime != null && insuEndEndTime != null && insuEndStartTime != "" && insuEndEndTime != "" && insuEndStartTime>insuEndEndTime){
                    $scope.angularTip("保险到期开始日期不能大于结束日期！",5000)
                }else if(inviteStartTime != null && inviteEndTime != null && inviteStartTime != "" && inviteEndTime != "" && inviteStartTime>inviteEndTime){
                    $scope.angularTip("邀约开始日期不能大于结束日期！",5000)
                }else if(comeStoreStartTime != null && comeStoreEndTime != null && comeStoreStartTime != "" && comeStoreEndTime != "" && comeStoreStartTime>comeStoreEndTime){
                    $scope.angularTip("到店日开始日期不能大于结束日期！",5000)
                }else if(lastTraceStartTime != null && lastTraceEndTime != null && lastTraceStartTime != "" && lastTraceEndTime != "" && lastTraceStartTime>lastTraceEndTime){
                    $scope.angularTip("末次跟踪日期开始日期不能大于结束日期！",5000)
                }else if(quoteStartTime != null && quoteEndTime != null && quoteStartTime != "" && quoteEndTime != "" && quoteStartTime>quoteEndTime){
                    $scope.angularTip("报价开始日期不能大于结束日期！",5000)
                }else if(traceStartTime != null && traceEndTime != null && traceStartTime != "" && traceEndTime != "" && traceStartTime>traceEndTime){
                    $scope.angularTip("应跟踪开始日期不能大于结束日期！",5000)
                }else if(registrationDateStart != null && registrationDateEnd != null && registrationDateStart != "" && registrationDateEnd != "" && registrationDateStart>registrationDateEnd){
                    $scope.angularTip("上牌日期开始日期不能大于结束日期！",5000)
                }else {
                    customerRDService.findByConditionGzjl(searchDatas).then(function (result) {
                        if (result.status == 'OK' && result.results.content.status == 'OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {
                            $scope.angularTip(result.results.message,5000)
                        }

                    });
                }
            }
            //根据跟踪状态查询---导出潜客跟踪记录
            $scope.findByTraceStatuGzjlExport = function(pageType,traceStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var sfgyx = $scope.qkSearch.sfgyx;
                $scope.pageType = pageType;
                $scope.pageStatus = traceStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,traceStatu:traceStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,sfgyx:sfgyx,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {traceStatu:traceStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,sfgyx:sfgyx,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findByTraceStatuGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        };
                    });
            };
            //根据潜客脱保状态查询---导出潜客跟踪记录
            $scope.findByCusLostInsurStatuGzjlExport = function(pageType,cusLostInsurStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = cusLostInsurStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,cusLostInsurStatu:cusLostInsurStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {cusLostInsurStatu:cusLostInsurStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findByCusLostInsurStatuGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {
                        };
                    });
            };
            //查询邀约潜客---导出潜客跟踪记录
            $scope.findByInviteStatuGzjlExport = function(pageType,inviteStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var operatorID = $scope.qkSearch.operatorID;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var inviteHappenTimeStart = $scope.qkSearch.inviteHappenTimeStart;
                var inviteHappenTimeEnd = $scope.qkSearch.inviteHappenTimeEnd;
                $scope.pageType = pageType;
                $scope.pageStatus = inviteStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,inviteStatu:inviteStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact, contactWay:contactWay,
                        carLicenseNumber:carLicenseNumber,inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd,
                        operatorID:operatorID};
                }else {
                    condition = {inviteStatu:inviteStatu,startNum:$scope.startNumExport, renewalType:renewalType,holder:holder,
                        chassisNumber:chassisNumber, contact:contact, contactWay:contactWay,carLicenseNumber:carLicenseNumber,
                        inviteHappenTimeStart:inviteHappenTimeStart,inviteHappenTimeEnd:inviteHappenTimeEnd,operatorID:operatorID};
                };
                customerRDService.findInviteStatuRD(condition).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        var customerYyjlArray = result.results.content.list;
                        for(var i=0;i<customerYyjlArray.length;i++){
                            var firstAcceptDate = new Date(customerYyjlArray[i].assignDate).getTime();
                            var currentDate = new Date().getTime();
                            var cyts = (currentDate - firstAcceptDate) / (1000 * 60 * 60 * 24);
                            customerYyjlArray[i].cyts = parseInt(cyts);
                            if (firstAcceptDate == 0 || firstAcceptDate == null || isNaN(firstAcceptDate)) {
                                customerYyjlArray[i].cyts = "--";
                            }

                            if(customerYyjlArray[i].status != 1){
                                if(customerYyjlArray[i].customerLevel == 'O'
                                    || customerYyjlArray[i].customerLevel == 'F'
                                    || customerYyjlArray[i].customerLevel == 'S'){
                                    customerYyjlArray[i].remainLostInsurDay = "--";
                                }else{
                                    var virtualJqxdqr = new Date(customerYyjlArray[i].virtualJqxdqr).getTime();
                                    customerYyjlArray[i].remainLostInsurDay = parseInt((virtualJqxdqr - currentDate)/(1000*3600*24));
                                }
                            }else{
                                customerYyjlArray[i].remainLostInsurDay = "--";
                            }
                        }
                        if($scope.gzjlBol==true){
                            $scope.getExportGzjlDataCallback(customerYyjlArray,result.results.content.policyCount,result.results.content.policyCount);
                        };
                        $scope.expGzjlNum =  result.results.content.policyCount;
                    } else {

                    }
                });
                /*customerRDService.findByInviteStatuGzjl(condition).then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        }
                    });*/
            }

            //根据接收状态查询---导出潜客跟踪记录
            $scope.findByAcceptStatuGzjlExport = function(pageType,acceptStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = acceptStatu;
                var condition = {acceptStatu:acceptStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};

                customerRDService.findByAcceptStatuGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        };
                    });
            };
            //根据回退状态查询---导出潜客跟踪记录
            $scope.findByReturnStatuGzjlExport = function(pageType,returnStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findByReturnStatuGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        };
                    });
            };
            //根据审批状态查询---导出潜客跟踪记录
            $scope.findByApprovalStatuGzjlExport = function(pageType,approvalStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var custStatu = $scope.qkSearch.returnStatu3;
                var returnStatu3 = "";
                var applyStatu = "";
                if(custStatu==3||custStatu==7){
                    returnStatu3 = custStatu;
                }else if(custStatu==1||custStatu==2){
                    returnStatu3 = 3;
                    applyStatu = custStatu;
                }
                $scope.pageType = pageType;
                $scope.approvalStatu = '3,7';
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,approvalStatu:approvalStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                }else {
                    condition = {approvalStatu:approvalStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber,contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber,returnStatu3:returnStatu3,applyStatu:applyStatu};
                };
                customerRDService.findByApprovalStatuGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        };
                    });
            };
            //查询已经唤醒的潜客---导出潜客跟踪记录
            $scope.findActivateCustomerGzjlExport = function(pageType,returnStatu){
                $scope.loadFinish = false;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                var condition = {};
                if($scope.showAll==false){
                    condition = {startTime:$scope.startTime,endTime:$scope.endTime,returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                }else {
                    condition = {returnStatu:returnStatu,startNum:$scope.startNumExport,
                        renewalType:renewalType,holder:holder,chassisNumber:chassisNumber, contact:contact,
                        contactWay:contactWay,carLicenseNumber:carLicenseNumber};
                };
                customerRDService.findActivateCustomerGzjl(condition)
                    .then(function (result) {
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            if($scope.gzjlBol==true){
                                $scope.getExportGzjlDataCallback(result.results.content.listGzjl,result.results.content.customerCount,
                                    result.results.content.customerGzjlCount);
                            };
                            $scope.expGzjlNum =  result.results.content.customerGzjlCount;
                        } else {

                        };
                    });
            };

            //手动请求壁虎刷新潜客信息
            $scope.manual = function(flag){
                var fourSStoreId = $rootScope.user.store.storeId;
                var userId = $rootScope.user.userId;
                var customerId = $scope.customerId;
                var carLicenseNumber = $scope.genzcl.carLicenseNumber;
                var chassisNumber = $scope.genzcl.chassisNumber;
                var engineNumber = $scope.genzcl.engineNumber;
                var certificateNumber = $scope.genzcl.certificateNumber;
                var condition = {
                    fourSStoreId:fourSStoreId,userId:userId,customerId: customerId, carLicenseNumber: carLicenseNumber,
                    chassisNumber: chassisNumber,engineNumber: engineNumber,flag:flag,certificateNumber:certificateNumber
                }
                $("#msgwindow").show();
                customerRDService.manual(condition).then(function (result) {
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
                $scope.genzcl.updateStatus = 1;
                if($scope.bhInfo.insuranceCompLY!=null&&$scope.bhInfo.insuranceCompLY!=''){
                    if($scope.genzcl.insuranceCompLY != $scope.bhInfo.insuranceCompLY){
                        $scope.genzcl.insuranceCompLY = $scope.bhInfo.insuranceCompLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insuranceTypeLY!=null&&$scope.bhInfo.insuranceTypeLY!=''){
                    if($scope.genzcl.insuranceTypeLY != $scope.bhInfo.insuranceTypeLY){
                        $scope.genzcl.insuranceTypeLY = $scope.bhInfo.insuranceTypeLY;
                        bo =true;
                    }
                }
                if($scope.bhInfo.carLicenseNumber!=null&&$scope.bhInfo.carLicenseNumber!=''){
                    if($scope.genzcl.carLicenseNumber != $scope.bhInfo.carLicenseNumber){
                        $scope.genzcl.carLicenseNumber = $scope.bhInfo.carLicenseNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.engineNumber!=null&&$scope.bhInfo.engineNumber!=''){
                    if($scope.genzcl.engineNumber != $scope.bhInfo.engineNumber){
                        $scope.genzcl.engineNumber = $scope.bhInfo.engineNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.bhInsuranceEndDate!=null&&$scope.bhInfo.bhInsuranceEndDate!=''){
                    if($scope.genzcl.bhInsuranceEndDate != $scope.bhInfo.bhInsuranceEndDate){
                        var dateNum1 = new Date($scope.bhInfo.bhInsuranceEndDate).getTime()-28800000;
                        var dateNum2 = new Date($scope.genzcl.jqxrqEnd).getTime()-28800000;
                        $scope.genzcl.showNum = $scope.getNum(dateNum1,dateNum2);
                        $scope.genzcl.bhInsuranceEndDate = $scope.bhInfo.bhInsuranceEndDate;
                        $scope.genzcl.bhUpdateTime = 'yes';
                        bo =true;
                    }
                    if($scope.genzcl.jqxrqEnd != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
                        $scope.genzcl.jqxrqEnd = $scope.genzcl.bhInsuranceEndDate;
                        bo =true;
                    }
                }
                if($scope.bhInfo.syxrqEnd!=null&&$scope.bhInfo.syxrqEnd!=''){
                    if($scope.genzcl.syxrqEnd != $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd')){
                        $scope.genzcl.syxrqEnd = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                        bo =true;
                    }
                }
                if($scope.bhInfo.carOwner!=null&&$scope.bhInfo.carOwner!=''){
                    if($scope.genzcl.carOwner != $scope.bhInfo.carOwner){
                        $scope.genzcl.carOwner = $scope.bhInfo.carOwner;
                        bo =true;
                    }
                }
                if($scope.bhInfo.insured!=null&&$scope.bhInfo.insured!=''){
                    if($scope.genzcl.insured != $scope.bhInfo.insured){
                        $scope.genzcl.insured = $scope.bhInfo.insured;
                        bo =true;
                    }
                }
                if($scope.bhInfo.certificateNumber!=null&&$scope.bhInfo.certificateNumber!=''){
                    if($scope.genzcl.certificateNumber != $scope.bhInfo.certificateNumber){
                        $scope.genzcl.certificateNumber = $scope.bhInfo.certificateNumber;
                        bo =true;
                    }
                }
                if($scope.bhInfo.customerCharacter!=null&&$scope.bhInfo.customerCharacter!=''){
                    if($scope.genzcl.customerCharacter != $scope.bhInfo.customerCharacter){
                        $scope.genzcl.customerCharacter = $scope.bhInfo.customerCharacter;
                        bo =true;
                    }
                }
                if($scope.bhInfo.chejiahao!=null&&$scope.bhInfo.chejiahao!=''){
                    if($scope.genzcl.chassisNumber != $scope.bhInfo.chejiahao){
                        $scope.genzcl.chassisNumber = $scope.bhInfo.chejiahao;
                        bo =true;
                    }
                }
                if($scope.bhInfo.modleName!=null&&$scope.bhInfo.modleName!=''){
                    if($scope.genzcl.factoryLicenseType != $scope.bhInfo.modleName){
                        $scope.genzcl.factoryLicenseType = $scope.bhInfo.modleName;
                        bo =true;
                    }
                }
                if($scope.bhInfo.registerDate!=null&&$scope.bhInfo.registerDate!=''){
                    if($scope.genzcl.registrationDate != $scope.bhInfo.registerDate){
                        $scope.genzcl.registrationDate = $scope.bhInfo.registerDate;
                        bo =true;
                    }
                }
                $("#bhmsg").hide();
                $scope.CustValuebol = bo;
            };

            //批量更换负责人窗口
            $scope.replacePriBox = function() {
                $("#plghfzr").show();
                customerRDService.findSubordinate().then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.PriUser = result.results.content.results;
                    } else {

                    };
                });
            };
            $scope.clearSelectedRows = function() {
                $scope.invitedGridApi.selection.clearSelectedRows();
                $scope.gridApi_qkcx.selection.clearSelectedRows();
                $scope.gridApi_qk.selection.clearSelectedRows();
                $scope.newPri={};
            }
            //批量更换负责人
            $scope.newPri={};
            $scope.replacePri = function() {
                if(!$scope.newPri.User){
                    $scope.angularTip("请选择负责人",5000);
                    return;
                }
                $scope.newPrincipalId = $scope.newPri.User.id;
                $scope.newPrincipal.principal = $scope.newPri.User.userName
                var SelectedCount = 0;
                var SelectedGridRows = {};
                $scope.ReplaceDatas = [];
                if($scope.pageType=='yyjl'){
                     SelectedCount = $scope.invitedGridApi.selection.getSelectedCount();
                     SelectedGridRows = $scope.invitedGridApi.selection.getSelectedGridRows();
                }else if($scope.pageType=='qkcx'){
                     SelectedCount = $scope.gridApi_qkcx.selection.getSelectedCount();
                     SelectedGridRows = $scope.gridApi_qkcx.selection.getSelectedGridRows();
                }else {
                    SelectedCount = $scope.gridApi_qk.selection.getSelectedCount();
                    SelectedGridRows = $scope.gridApi_qk.selection.getSelectedGridRows();
                };
                if(SelectedCount == 0){
                    $scope.angularTip("请先选择潜客",5000)
                }else{
                    for (var i=0;i<SelectedCount;i++){
                        var customerId = SelectedGridRows[i].entity.customerId;
                        var prePrincipalId = SelectedGridRows[i].entity.principalId;
                        var prePrincipal = SelectedGridRows[i].entity.principal;
                        var oneData = {
                            customerId:customerId,prePrincipalId:prePrincipalId,prePrincipal:prePrincipal,
                            newPrincipalId:$scope.newPrincipalId,newPrincipal:$scope.newPrincipal.principal
                        }
                        $scope.ReplaceDatas.push(oneData);
                    };
                    $("#msgwindow").show();
                    customerRDService.changePrincipalBatch($scope.ReplaceDatas).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $("#plghfzr").hide();
                            if($scope.pageType=='qkcx'){
                                $scope.findByCondition();
                            }else {
                                $scope.getSearchByTime();
                            };
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("更换成功",5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };

            //报价
            $scope.new_bj = {};
            //查询潜客报价记录
            $scope.findListCustomerBJRecode = function() {
                customerRDService.findListCustomerBJRecode($scope.customerId).then(function (result) {
                    if (result.status == 'OK' && result.results.success == true) {
                        $scope.add_bj_Page.data = result.results.content.customerBJRecodeList;
                        for (var i = 0; i < $scope.add_bj_Page.data.length; i++) {
                            $scope.add_bj_Page.data[i].index = i + 1;
                        };
                    }
                })
            }
            //新增报价
            $scope.addCustomerBJRecode = function (){
                var syxje = $scope.new_bj.syxje;//商业险金额
                var jqxje = $scope.new_bj.jqxje;//交强险金额
                var ccsje = $scope.new_bj.ccsje;//车船税金额
                var bfhj = $scope.new_bj.bfhj;//保费合计
                var jncdzk = $scope.new_bj.jncdzk;//今年出单折扣
                var cxcs = $scope.new_bj.cxcs;//出险次数
                var lpje = $scope.new_bj.lpje;//理赔金额
                var remark = $scope.new_bj.remark;//备注
                var customerId = $scope.customerId;
                var bxgs = '';//保险公司
                var xz = $scope.new_bj.insuranceTypes;
                if($scope.new_bj.bxgs){
                    bxgs = $scope.new_bj.bxgs.insuranceCompName;
                }
                var insuranceType = '';//险种
                if($scope.new_bj.insuranceTypes){
                    var xz = $scope.new_bj.insuranceTypes;
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].status == true){
                            if(insuranceType==''){
                                insuranceType = xz[i].insuranceType;
                            }else{
                                insuranceType = insuranceType + ','+ xz[i].insuranceType;
                            }
                        }
                    }
                }
                if(!bfhj||bfhj==''){
                    $scope.angularTip("保费合计不能为空", 5000);
                    return;
                }
                if(bfhj<=0){
                    $scope.angularTip("保费合计必须大于0", 5000);
                    return;
                }
                if(jncdzk<0){
                    $scope.angularTip("折扣必须大于0", 5000);
                    return;
                }
                var customerBJRecode = {
                    syxje:syxje,jqxje:jqxje,ccsje:ccsje,bfhj:bfhj,
                    jncdzk:jncdzk,cxcs:cxcs,lpje:lpje,bxgs:bxgs,
                    xz:insuranceType,customerId:customerId,remark:remark
                };
                $("#msgwindow").show();
                customerRDService.addCustomerBJRecode(customerBJRecode).then(function(res){
                    $("#msgwindow").hide();
                    if (res.status == 'OK' && res.results.success == true) {
                        $("#add_bj").hide();
                        $scope.angularTip("新增报价成功", 5000);
                        $scope.isQuoteBol=false;
                        $scope.findListCustomerBJRecode();
                    } else {
                        $scope.angularTip(res.results.message, 5000);
                    }
                });
            };
            //报价按钮
            $scope.open_BJ = function(){
                $scope.carModelAll={}; //清空查询的品牌型号
                var re_card = /^[\u4E00-\u9Fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$/;
                if(($scope.bhDock==1||$scope.bhDock==3) && !(re_card.test($scope.genzcl.carLicenseNumber))){
                    $scope.angularTip("车牌号格式不对！（例如：京Q11111）",5000);
                    return;
                };
                $scope.bihubaojia.ForceTax = 1;
                customerRDService.findBxInfoForBH( $scope.customerId).then(function(result){
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
                if($scope.bhInfo){
                    $scope.bihubaojia.newCarPrice = $scope.bhInfo.newCarPrice;
                    $scope.bihubaojia.ForceTimeStamp = $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd');
                    $scope.bihubaojia.BizTimeStamp = $filter('date')($scope.bhInfo.syxrqEnd,'yyyy-MM-dd');
                }
                $scope.footerBtn = "bj";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.openbjfun();
                }
            };
            //行驶证默认填写
            $scope.xszDefult = function(){
                if($scope.genzcl){
                    $scope.bihubaojia.LicenseNo = $scope.genzcl.carLicenseNumber||"";
                    $scope.bihubaojia.CarVin = $scope.genzcl.chassisNumber||"";
                    $scope.bihubaojia.EngineNo = $scope.genzcl.engineNumber||"";
                    $scope.bihubaojia.RegisterDate = $scope.genzcl.registrationDate||"";
                    $scope.bihubaojia.jqxrqEnd = $scope.genzcl.jqxrqEnd||"";
                    $scope.bihubaojia.syxrqEnd = $scope.genzcl.syxrqEnd||"";
                    var carBrand = '';//品牌
                    var vehicleModel = '';//车辆型号
                    var factoryLicenseType = "";
                    if($scope.genzcl.factoryLicenseType=="null"){
                        factoryLicenseType = "";
                    }else{
                        factoryLicenseType = $scope.genzcl.factoryLicenseType||'';
                    }
                    $scope.bihubaojia.MoldName =factoryLicenseType;
                }
            }
            //打开增加报价页面
            $scope.openbjfun = function(){
                $scope.new_bj = {};
                $scope.xszDefult();
                $('#add_bj').show();
                $("#bihubaojia").hide();
                $("#bihuRequest").show();
            }

            //关闭增加报价页面
            $scope.closeNew_bj = function(){
                $('#add_bj').hide();
                $scope.footerBtn = "";
                $scope.new_bj = {};
                $scope.bihubaojia = {};
                for(var j=0;j<$scope.insuranceCompNames.length;j++){
                    $scope.insuranceCompNames[j].sfbj = 0;
                    $scope.insuranceCompNames[j].sfhb = 0
                }
            }

            //计算报价金额
            $scope.jsbfhj = function(){
                var syxje = $scope.new_bj.syxje||0;//商业险报价
                var jqxje = $scope.new_bj.jqxje||0;//交强险报价
                var ccsje = $scope.new_bj.ccsje||0;//车船税报价
                $scope.new_bj.bfhj = (syxje + jqxje + ccsje).toFixed(2);
            }

            //审批单商业险种拼装
            $scope.add_bj_xzpz = function(){
                $scope.new_bj.insuranceTypes = [];
                if($scope.new_bj.bxgs){
                    var syxz = $scope.new_bj.bxgs.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        var xz = {status:false,insuranceType:syxz[i].typeName}
                        $scope.new_bj.insuranceTypes.push(xz);
                    }
                }
            };
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
                customerRDService.getModels(Data).then(function (result) {
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
                var BizStartDate = $scope.genzcl.syxrqEnd ||"";
                var bxgs = $scope.bihubaojia.bxgs ||"";
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

                if(inscomBol==0 && bxgs ==""){
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
                    customerRDService.bihuApplyBJ(quoteDatas).then(function(result){
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
                    if($scope.bhDock==0||$scope.bhDock==2){
                        var compArr = {
                            source:0,
                            insuranceCompName: $scope.bihubaojia.bxgs.insuranceCompName
                        };
                        $scope.bihuComps.push(compArr);
                    }else {
                        for(var n=0;n<$scope.insuranceCompNames.length;n++){
                            if($scope.insuranceCompNames[n].sfbj ==1 && $scope.insuranceCompNames[n].source == null){
                                var compArr = {
                                    source:0,
                                    insuranceCompName:$scope.insuranceCompNames[n].insuranceCompName
                                };
                                $scope.bihuComps.push(compArr);
                            }
                        };
                    }
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
                var BizStartDate = $scope.genzcl.syxrqEnd ||"";
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
                    customerRDService.applyBJFromBofide(args).then(function(result){
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
                customerRDService.bihuSaveBJ(saveBj).then(function(result){
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

            //关闭壁虎信息窗口
            $scope.bhclose = function(){
                $("#bhmsg").hide();
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
                    startNum:1,carLicenseNumber: carLicenseNumber
                };
                customerRDService.findwxRecordByCondition($scope.condition)
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
                customerRDService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
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
                customerRDService.findByConditionTSX($scope.condition)
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
                customerRDService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
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

            //保单明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            };

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

            //查询目录展开更多的按钮
            $("#morebtn").click(function(){
                $("#searchDivTr2").toggle();
                if($("#searchDivTr2").is(":hidden")){
                    var newHeight = $("#myTabContent").height()-160;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }else{
                    var newHeight = $("#myTabContent").height()-280;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }
            });

            //导出下来框
            $scope.bipNavshow=function(){
                $("#bipNav").show();
            };
            $scope.bipNavhide=function(){
                $("#bipNav").hide();
            };
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

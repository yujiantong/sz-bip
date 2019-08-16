/**
 * Created by Bao on 2016/6/7.
 */
'use strict';
angular.module('myApp')
    .controller('customerIW_Controller',['$rootScope','$scope','$filter','customerIWService','$state',
        'policyIWService','checkService',
        function($rootScope,$scope,$filter,customerIWService,$state,policyIWService,checkService){
            //出单员
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.dayNumber = $rootScope.user.dayNumber; //首次提醒天数
            $scope.pageType = 'qkcx'; //页面状态，用于判断页面的类型
            $scope.customerAll = [];
            $scope.customerInvited = [];
            $scope.customerAllSearch = [];
            $scope.startNum = 1;//初始化页数
            $scope.showAll = false;//是否全部显示
            $scope.customerIndex= 1;//初始化下标
            $scope.customerInvitedIndex = 1;//初始化下标
            $scope.customerSearchIndex= 1;//初始化下标
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.customerId="";
            $scope.isComeStore="";
            $scope.print_spd = {};
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            $scope.lockLevel = $rootScope.user.store.lockLevel;//是否锁死潜客级别
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            $scope.cityCode = $rootScope.user.store.cityCode;//4s店城市码
            var short=0;//全局排序（按某字段排序）
            var shortmain=0;//全局排序（1：升序2：降序）
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month=myDate.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            $scope.startTime = year+"-"+month+"-01";//初始化为今月1号
            $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.confirmData = {};
            $scope.qkSearch = {}; //潜客条件查询
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                }
                $scope.gridSearchbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-135
                };
                $scope.gridboxTj = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-45
                }
            },100);

            //下拉列表数据初始化
            $scope.newqk = {customerLevel:'A'};
            $scope.search = {};
            $scope.coverTypes = [{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            $scope.loan = [{id:1,vlaue:'是'},{id:2,vlaue:'否'}];
            $scope.privilegePros = ['现金','套餐','现金+套餐','会员积分','储值','其他'];
            $scope.sdfss = ['到店自取','快递','本店送单']
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
            customerIWService.findCarInfoByStoreId().then(function(res){
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
            customerIWService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            customerIWService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });
            //查询持有人列表
            customerIWService.selectUserForHolderSearch().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.holders = res.results.content.result;
                }else{

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
            //查询模块是否开启
            customerIWService.findModuleSet().then(function(res){
                if(res.status == 'OK'||res.content.status=='OK'){
                    var findModuleOpen = res.results.content.result;
                    for(var i=0;i<findModuleOpen.length;i++){
                        if(findModuleOpen[i].moduleName=='finance'){
                            $scope.cwmksfkq = findModuleOpen[i].switchOn;
                        }
                    }
                }else{

                }
            });

            $scope.customerAllPage = {
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
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_statu" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_statu" class=""></span></div>'},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:100,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" ng-click="grid.appScope.qjsort_statu(6)" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newCustomerbtn()"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_statu" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_statu" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_statu" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_statu" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_statu" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_statu" class=""></span></div>'},
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
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:100,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_yyjl" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_yyjl" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_yyjl" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_yyjl" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_yyjl" class=""></span></div>'},
                    { name: '预计到店日期', field: 'inviteDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(21)">预计到店日期&nbsp;&nbsp;&nbsp;<span id="inviteDate_yyjl" class=""></span></div>'},
                    { name: '是否到店', field: 'isComeStore',cellFilter: 'mapSF', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(22)">是否到店&nbsp;&nbsp;&nbsp;<span id="isComeStore_yyjl" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_yyjl" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_yyjl" class=""></span></div>'},
                    { name: '延期到期日', field: 'delayDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(16)">延期到期日&nbsp;&nbsp;&nbsp;<span id="delayDate_yyjl" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:70,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_yyjl" class=""></span></div>'},
                    { name: '持有天数', field: 'cyts', width:70,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(18)">持有天数&nbsp;&nbsp;&nbsp;<span id="cyts_yyjl" class=""></span></div>'},
                    { name: '持有人', field: 'holder',enableColumnMenu: false},
                    { name: '邀约人', field: 'yyr',enableColumnMenu: false},
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
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay" class=""></span></div>'},
                    { field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false,minWidth:100,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" ng-click="grid.appScope.qjsort(6)" style="width: 70px;"><span>车架号</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newCustomerbtn();"></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName" class=""></span></div>'},
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
                    $scope.customerInvitedIndex= 1;
                    $scope.customerAllPage.data = [];
                    $scope.customerInvitedPage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                if($scope.pageType == 'qkcx'){
                    for(var i=0;i<$scope.customerAllSearch.length;i++){
                        $scope.customerAllSearch[i].index = $scope.customerSearchIndex;
                        var firstAcceptDate = $scope.customerAllSearch[i].customerAssigns[0].assignDate;
                        var currentDate = new Date().getTime();
                        var cyts = (currentDate-firstAcceptDate)/(1000*60*60*24);
                        $scope.customerAllSearch[i].cyts = parseInt(cyts);
                        if(firstAcceptDate==0 || firstAcceptDate == null){
                            $scope.customerAllSearch[i].cyts = "--";
                        }
                        var holder = $scope.customerAllSearch[i].holder;
                        if (holder == "" || holder == null) {
                            $scope.customerAllSearch[i].cyts = "--";
                        }
                        $scope.customerAllSearchPage.data.push($scope.customerAllSearch[i])
                        $scope.customerSearchIndex = $scope.customerSearchIndex+1;
                    };
                }else if($scope.pageType == 'yyjl'){
                    $("#yyks").html("预计到店时间开始:");
                    $("#yyjs").html("预计到店时间结束:");
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
                }else{
                    $("#yyks").html("开始时间:");
                    $("#yyjs").html("结束时间:");
                    for(var i=0;i<$scope.customerAll.length;i++){
                        $scope.customerAll[i].index = $scope.customerIndex;
                        var firstAcceptDate = null;
                        if($scope.customerAll[i].customerAssigns.length>0){
                            firstAcceptDate = $scope.customerAll[i].customerAssigns[0].assignDate;
                        }
                        var currentDate = new Date().getTime();
                        var cyts = (currentDate-firstAcceptDate)/(1000*60*60*24);
                        $scope.customerAll[i].cyts = parseInt(cyts);
                        if(firstAcceptDate==0 || firstAcceptDate == null){
                            $scope.customerAll[i].cyts = "--";
                        }
                        var holder = $scope.customerAll[i].holder;
                        if (holder == "" || holder == null) {
                            $scope.customerAll[i].cyts = "--";
                        }
                        $scope.customerAllPage.data.push($scope.customerAll[i])
                        $scope.customerIndex = $scope.customerIndex+1;
                    };
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

            //点击加载更多查询
            $scope.getSearchMroe = function (){
                if($scope.pageType=='yyjl'){
                    $scope.getcustByCovertypeTime();
                }else if($scope.pageType=='qkcx'){
                    $scope.findByCondition();//潜客查询
                }else if($scope.pageType=='ht'){
                    $scope.findByReturnStatu($scope.pageType,$scope.returnStatu);//已失销
                }else if($scope.pageType=='yjh'){
                    $scope.findByJiHuo($scope.pageType,$scope.pageStatus);//已激活
                }else if($scope.pageType=='ddwcd'){
                    $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
                }

            };

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
                $scope.getcustByCovertypeTime();
            }

            //时间改变时按类型查询
            $scope.getcustByCovertypeTime = function(){
                $scope.resetTime = false;
                var re_data=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                if(!(re_data.test($scope.startTime)) || !(re_data.test($scope.endTime))){
                    $scope.resetTime = true;
                    return;
                }else if ($scope.startTime <= $scope.endTime){
                    $("#tipAlert").hide();
                    if($scope.pageType=='yyjl'){
                        $scope.findInviteStatuIW('yyjl',2);//邀约记录
                    }else if($scope.pageType == 'ht'){
                        $scope.findByReturnStatu('ht',5);
                    }else if($scope.pageType == 'yjh'){
                        $scope.findByJiHuo('yjh',$scope.pageStatus); //已激活
                    }else if($scope.pageType == 'ddwcd'){
                        $scope.findDdwcdCus('ddwcd',$scope.pageStatus); //到店未出单
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
                this.findInviteStatuIW('yyjl',$scope.pageStatus);//邀约记录
            };
            //查询潜客邀约记录
            $scope.findInviteStatuIW = function(pageType,inviteStatu){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var renewalType = $scope.qkSearch.renewalType;
                var holder = $scope.qkSearch.holder;
                var contact = $scope.qkSearch.contact;
                var contactWay = $scope.qkSearch.contactWay;
                var chassisNumber = $scope.qkSearch.chassisNumber;
                var carLicenseNumber = $scope.qkSearch.carLicenseNumber;
                var inviteHappenTimeStart = $scope.qkSearch.inviteHappenTimeStart;
                var inviteHappenTimeEnd = $scope.qkSearch.inviteHappenTimeEnd;
                var operatorID = $scope.qkSearch.operatorID;
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
                customerIWService.findInviteStatuIW($scope.condition)
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
                if($scope.pageType=='yyjl'){
                    this.findInviteStatuIW('yyjl',2);//邀约记录
                }else if($scope.pageType == 'ht'){
                    this.findByReturnStatu('ht',5);
                }else if($scope.pageType == 'yjh'){
                    this.findByJiHuo('yjh',$scope.pageStatus); //已激活
                }else if($scope.pageType == 'ddwcd'){
                    this.findDdwcdCus('ddwcd',$scope.pageStatus); //到店未出单
                }
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
                $scope.pageType = pageType;
                $scope.returnStatu = returnStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, returnStatu: returnStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber,
                            insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu: returnStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,
                            insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerIWService.findByReturnStatu($scope.condition)
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
                customerIWService.findByJiHuo($scope.condition)
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
                customerIWService.findDdwcdCus($scope.condition)
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

            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
                $('select[multiple="multiple"]').multiselect('clearSelection');
                $('select[multiple="multiple"]').multiselect('refresh');
            };
            //清空表单
            $scope.clearQksearch = function(){
                $scope.qkSearch = {};
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
            /*$scope.qjsort = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                $rootScope.$emit("qjsort", {});

                this.findByCondition();
            };*/
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
                }else {
                    $scope.startNumSearch = $scope.startNumSearch + 1;
                }
                if($scope.startNumSearch == 1) {
                    $scope.conditionSearch = {
                        short:short,shortmain:shortmain,
                        startNum:$scope.startNumSearch,fourSStoreId:fourSStoreId,
                        carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                        carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                        contactWay: contactWay, contactWayReserve:contactWayReserve,insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
                        customerLevel: customerLevel, comeStoreNumber:comeStoreNumber,insurNumber: insurNumber,
                        principalId:principalId,principal:principal,
                        isInvite: isInvite, isComeStore: isComeStore, isQuote: isQuote,
                        insuDateStartTime: insuDateStartTime, insuDateEndTime: insuDateEndTime,
                        insuEndStartTime: insuEndStartTime, insuEndEndTime: insuEndEndTime,
                        syxrqDateStart: syxrqDateStart,syxrqDateEnd: syxrqDateEnd,
                        inviteStartTime: inviteStartTime, inviteEndTime: inviteEndTime,
                        comeStoreStartTime: comeStoreStartTime, comeStoreEndTime: comeStoreEndTime,
                        lastTraceStartTime: lastTraceStartTime, lastTraceEndTime: lastTraceEndTime,
                        quoteStartTime: quoteStartTime, quoteEndTime: quoteEndTime,traceStartTime: traceStartTime,
                        traceEndTime: traceEndTime,zdZheKouStart:zdZheKouStart,zdZheKouEnd:zdZheKouEnd,carOwner:carOwner, holder:holder,
                        remainLostInsurDayStart:remainLostInsurDayStart,remainLostInsurDayEnd:remainLostInsurDayEnd,
                        sfgyx:sfgyx,ifLoan:ifLoan,registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd
                    }
                }else{
                    $scope.conditionSearch.startNum = $scope.startNumSearch;
                };
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
                    $("#msgwindow").show();
                    customerIWService.findByCondition($scope.conditionSearch).then(function (result) {
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
                            $scope.policySearchCount = result.result.content.policyCount;
                            $scope.getPolicyPage();
                        } else {
                            $scope.angularTip(result.result.message,5000)
                        }

                    });
                }
            }

            $scope.getNum = function(bhInsuranceEndDate,jqxrqEnd){
                var  myDate_ms = Date.parse(new Date);
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
            //跟踪处理  潜客Id查询跟踪记录
            $scope.crljqxrqEnd = '';
            $scope.findByCustomerId=function(customer) {
                $scope.footerBtn = "";
                $scope.thisRowData = customer;
                $scope.chassisNumber = customer.chassisNumber;
                $scope.customerLevel = customer.customerLevel;
                $scope.customerId = customer.customerId;
                $scope.jqxrqEnd_before = customer.jqxrqEnd;
                $scope.holderId = customer.holderId;
                $scope.genzcl = {};
                $("#msgwindow").show();
                customerIWService.getCustById($scope.customerId).then(function (result) {
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
                        var  jqxrqEnd = $scope.genzcl.jqxrqEnd;
                        var  myDate_ms= Date.parse(new Date());
                        if(bhInsuranceEndDate!=undefined&&bhInsuranceEndDate!=null){
                            $scope.genzcl.showNum = Math.abs(bhInsuranceEndDate - myDate_ms);
                        }else{
                            $scope.genzcl.showNum = 0;
                        }
                        $scope.genzcl.bhInsuranceEndDate = $filter('date')($scope.genzcl.bhInsuranceEndDate,'yyyy-MM-dd');
                        $scope.principalId = result.results.content.results.principalId;
                        $scope.principal = result.results.content.results.principal;
                        $scope.tracelistPage.data = result.results.content.results.customerTraceRecodes;
                        for(var i=0;i< $scope.tracelistPage.data.length;i++){
                            $scope.tracelistPage.data[i].index = i+1;
                        };
                        $scope.genzcl.carAnnualCheckUpDate = $filter('date')($scope.genzcl.carAnnualCheckUpDate,'yyyy-MM-dd');
                        $scope.genzcl.registrationDate = $filter('date')($scope.genzcl.registrationDate,'yyyy-MM-dd');
                        $scope.genzcl.insurDateLY = $filter('date')($scope.genzcl.insurDateLY,'yyyy-MM-dd');
                        $scope.genzcl.syxrqEnd = $filter('date')($scope.genzcl.syxrqEnd,'yyyy-MM-dd');
                        $scope.genzcl.jqxrqEnd = $filter('date')($scope.genzcl.jqxrqEnd,'yyyy-MM-dd');
                        $scope.crljqxrqEnd = $scope.genzcl.jqxrqEnd;
                        for(var i = 0 ;i<$scope.kingdsUser.servicer.length;i++){
                            if($scope.kingdsUser.servicer[i].id==$scope.genzcl.serviceConsultantId){
                                $scope.genzcl.serviceConsultant = $scope.kingdsUser.servicer[i];
                            }
                        };
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
                customerIWService.findApprovalBillRecordList($scope.chassisNumber).then(function (result) {
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
            //改变交强险日期
            $scope.changeJqxrqEnd = function(){
                $scope.genzcl.jqxrqEnd=$scope.genzcl.bhInsuranceEndDate;
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
                })


            }

            //数据改变了是否保存
            $scope.saveCustChangeBtn = function(){
                $scope.footerBtn = "";
                $scope.crlMessage = "";
                if ($scope.CustValuebol == true) {
                    if($scope.genzcl.customerLevel=='F'&&$scope.crljqxrqEnd!=$scope.genzcl.jqxrqEnd){
                        customerIWService.getMessageByUC($scope.genzcl.jqxrqEnd).then(function(result){
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
                if(isMaintainAgain==null||isMaintainAgain==''){
                    if(!(isMaintainAgain==0)){
                        isMaintainAgain=-1
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
                }
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
                /*if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))
                    &&($filter('date')(jqxrqEnd,'yyyy-MM-dd') < $filter('date')(new Date(),'yyyy-MM-dd'))){
                    $scope.angularTip("交强险日期结束不能设置为今天以前",5000);
                    return;
                }*/
                //点击保存和关闭保存潜客信息
                $scope.updateCustMsg = function(){
                    $("#msgwindow").show();
                    customerIWService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal,$scope.holderId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
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
                        } else {
                            $scope.angularTip(result.results.message,5000)
                        }
                    });
                };
                if($scope.footerBtn == "hx"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "yydd"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.confirmStoreFun();
                }else if($scope.footerBtn == "spd"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.spd_infoFun();
                }else if($scope.footerBtn == "bj"){
                    $("#changevalue").hide();
                    $scope.updateCustMsg();
                    $scope.openbjfun();
                }else {
                    //点击其他按钮保存潜客信息
                    $("#msgwindow").show();
                    customerIWService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal,$scope.holderId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $("#genzcl").hide();
                            $scope.angularTip("修改成功",5000);
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
                        } else {
                            $scope.angularTip(result.results.message,5000)
                        }
                    });
                }

            };
            //取消修改
            $scope.cancelChange = function(){
                $scope.CustValuebol = false;
                $("#changevalue").hide();
                if($scope.footerBtn == "hx"){
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "yydd"){
                    $scope.confirmStoreFun();
                }else if($scope.footerBtn == "spd"){
                    $scope.spd_infoFun();
                }else if($scope.footerBtn == "bj"){
                    $scope.openbjfun();
                }else{
                    $("#genzcl").hide();
                }
            };

            //审批单按钮
            $scope.spd_info = function(){
                $scope.footerBtn = "spd";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.spd_infoFun();
                }
            };
            //审批单从跟踪处理页面所带数据
            $scope.spd_infoFun = function (){
                $scope.print_spd = {};
                $scope.print_spd.carLicenseNumber = $scope.genzcl.carLicenseNumber;
                $scope.print_spd.chassisNumber = $scope.genzcl.chassisNumber;
                $scope.print_spd.engineNumber = $scope.genzcl.engineNumber;
                $scope.print_spd.carBrand = $scope.genzcl.carBrand;
                $scope.print_spd.vehicleModel = $scope.genzcl.vehicleModel;
                $scope.print_spd.renewalType = $scope.genzcl.renewalType;
                $scope.print_spd.renewalWay = $scope.genzcl.renewalWay;
                $scope.print_spd.insured = $scope.genzcl.insured;
                $scope.print_spd.certificateNumber = $scope.genzcl.certificateNumber;
                $scope.print_spd.contact = $scope.genzcl.contact;
                $scope.print_spd.contactWay = $scope.genzcl.contactWay;
                $scope.print_spd.factoryLicenseType = $scope.genzcl.factoryLicenseType||"";
                $scope.print_spd.insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                if($scope.print_spd.carBrand==null||$scope.print_spd.carBrand==''){
                    $scope.print_spd.carBrand = {brandName:''}
                }
                if($scope.print_spd.vehicleModel==null||$scope.print_spd.vehicleModel==''){
                    $scope.print_spd.vehicleModel = {modelName:''}
                }
                $scope.spdmr($scope.print_spd.carBrand.brandName,$scope.print_spd.vehicleModel.modelName);
                $("#spd").show();
                $scope.print_spd.giftNum = 1;
                $scope.print_spd.comprehensiveDiscount = 0;
                $scope.print_spd.giftDiscount = 0;
                $scope.giftListCustAllPage.data = [];
            }

            //确认到店按钮
            $scope.confirmStore = function(){
                $scope.footerBtn = "yydd";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.confirmStoreFun();
                }
            };
            //确认邀约到店
            $scope.confirmStoreFun = function(){
                $("#msgwindow").show();
                customerIWService.confirmIntoStore($scope.customerId, $scope.principalId,$scope.principal,$scope.holderId).then(function(result){
                    $("#msgwindow").hide();
                    if(result.status == 'OK' &&　result.result.content.status == 'OK'){
                        $scope.angularTip(result.result.message,5000)
                    }else{
                        $scope.angularTip(result.result.message,5000)
                    }
                });
            }
            //激活按钮
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
                $scope.closeConfirmPageStatus = '请确认是否激活该潜客？';
                $scope.makesure = function() {
                    if(!$scope.confirmData.hxyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#hx").hide();
                    $("#msgwindow").show();
                    customerIWService.wakeUpCustomer($scope.customerId, $scope.principalId,$scope.principal,$scope.confirmData.hxyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.policyCount = $scope.policyCount-1;
                                $("#genzcl").hide();
                                $scope.angularTip (result.results.message,5000);
                            } else if(result.status == 'OK' && result.results.content.status == 'BAD'){
                                $scope.angularTip (result.results.message,5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }
            //是否取消新增潜客
            $scope.sfqxxzqk = function(){
                if($scope.CustValuebol == true){
                    $("#giveCust").show();
                    $scope.giveAddCust= function(){
                        $("#giveCust").hide();
                        $("#newqk").hide();
                        $scope.newqk = {};
                    }
                }else{
                    $scope.newqk = {};
                    $("#newqk").hide();
                }
            }
            //新增潜客弹框
            $scope.newCustomerbtn=function(){
                $("#newqk").show();
                $scope.newqk.customerLevel = 'A';
                $scope.xzVehicleModel();
                $scope.saveCustChangefun();
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
                    serviceConsultant = $scope.newqk.serviceConsultant.userName;
                    serviceConsultantId = $scope.newqk.serviceConsultant.id;
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
                var fourSStore = $rootScope.user.store.storeName;
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
                    fourSStoreId:fourSStoreId,fourSStore:fourSStore,insuredLY:insuredLY, factoryLicenseType:factoryLicenseType,
                    carAnnualCheckUpDate:carAnnualCheckUpDate,buyfromThisStore:buyfromThisStore,
                    contactWayReserve:contactWayReserve,ifLoan:ifLoan,bxInfo:bxInfo
                };
                var checkResult = checkService.qkxxxz(newqkDatas);
                if(checkResult.status==false){
                    $scope.angularTip(checkResult.message,5000);
                    return;
                };
                $("#msgwindow").show();
                customerIWService.addCustomer(newqkDatas).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK' && res.results.success==true){
                        $scope.newqk = {};
                        $("#newqk").hide();
                        $scope.angularTip("新增潜客成功",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                    }
                });

            }

            //交强险日期设定
            $scope.jqxrqStartChange = function() {
                var setDate = $scope.print_spd.jqxrqStart;
                $scope.print_spd.jqxrqEnd = $scope.GetDateStr(setDate);
            }

            //日期计算方法
            $scope.GetDateStr = function(setDate)
            {
                var startDate =new Date(setDate);
                startDate.setFullYear(startDate.getFullYear()+1);
                var endDate=startDate.getTime()-(1000*60*60*24);
                var nextyear=$filter('date')(new Date(endDate),'yyyy-MM-dd 23:59:59');
                return nextyear;
            }
            //礼包管理
            $scope.giftListCustAllPage = {}
            $scope.giftListCustAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { name: '赠品类型', field: 'giftType',cellFilter: 'mapZPLX',enableColumnMenu: false},
                    { name: '赠品名称', field: 'giftName',enableColumnMenu: false},
                    { name: '有效期至', field: 'validDate',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '数量',enableColumnMenu: false,
                        cellTemplate: '<div class="ui-grid-cell-contents"><input class="zpDiscount" min="0" num-format ng-change="grid.appScope.giftNumModify(row.entity)" ng-model="row.entity.amount" type="number"></div>'},
                    { name: '金额', field: 'amountMoney',width:70,enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name:'删除',enableColumnMenu: false, width:60,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.deleteGiftBtnCust(row)">删除</div>'}
                ]
            };
            //赠品数量
            $scope.minusFwnumCust=function(){
                if($scope.print_spd.giftNum>=1){
                    $scope.print_spd.giftNum = $scope.print_spd.giftNum -1;
                }
            }
            $scope.plusFwnumCust=function(){
                $scope.print_spd.giftNum = $scope.print_spd.giftNum +1;;
            }
            $scope.giftListHideCust = function() {
                $(".giftListBox").hide();
            };
            $scope.giftListSetCust = function(Gift) {
                $scope.print_spd.giftName = Gift.giftName;
                $(".giftListBox").hide();
            };
            $scope.giftSetNone = function() {
                $scope.print_spd.giftName = "";
                $scope.print_spd.searchGift = "";
            };
            //检索服务赠品
            $scope.chooseGiftCust=function(){
                $(".giftListBox").show();
                var searchCondition = $scope.print_spd.searchGift;
                var giftType = $scope.print_spd.giftType;
                customerIWService.findGiftByCodeOrName(searchCondition,giftType).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.giftListData = result.results.content.results;
                    } else {

                    };
                });
            }
            //修改赠品数量
            $scope.giftNumModify=function(rowData){
                rowData.amountMoney = rowData.guidePrice*rowData.amount;
                $scope.print_spd.czkje = 0;
                $scope.print_spd.czkjedw=0;
                $scope.print_spd.giftDiscount = 0;
                for(var i=0;i<$scope.giftListCustAllPage.data.length;i++){
                    if($scope.giftListCustAllPage.data[i].giftType==4){
                        $scope.print_spd.czkje = $scope.print_spd.czkje+$scope.giftListCustAllPage.data[i].amountMoney;
                    }
                    $scope.print_spd.giftDiscount = $scope.giftListCustAllPage.data[i].amountMoney+$scope.print_spd.giftDiscount;
                }
                if($scope.print_spd.syxje!=0&&$scope.print_spd.syxje!=null){
                    $scope.print_spd.czkjedw = Math.round($scope.print_spd.czkje/$scope.print_spd.syxje*100)/100;
                }
                $scope.print_spd.comprehensiveDiscount = $scope.print_spd.yhje+$scope.print_spd.giftDiscount;
            }
            //添加赠品
            $scope.addGiftBtnCust = function() {
                var giftBol = 0;
                if($scope.print_spd.giftName ==null|| $scope.print_spd.giftName == ""){
                    $scope.angularTip("请输入赠品",5000);
                    return;
                }
                for(var i=0;i<$scope.giftListData.length;i++){
                    if($scope.print_spd.giftName==$scope.giftListData[i].giftName){
                        giftBol = 1;
                        $scope.Gift = $scope.giftListData[i];
                    }
                }
                if(giftBol==0){
                    $scope.angularTip("赠品输入有误",5000);
                    return;
                }
                var validDate=new Date();
                validDate.setMonth(validDate.getMonth()+$scope.Gift.validLength);
                var arr = {
                    giftCode:$scope.Gift.giftCode,
                    giftName:$scope.Gift.giftName,
                    quota:$scope.Gift.quota,
                    guidePrice:$scope.Gift.guidePrice,
                    salePrice:$scope.Gift.salePrice,
                    actualPrice:$scope.Gift.actualPrice,
                    validDate:validDate,
                    remark:$scope.Gift.remark,
                    giftType:$scope.Gift.giftType,
                    amount:$scope.print_spd.giftNum,
                    sellingPrice:$scope.Gift.guidePrice,
                    amountMoney: $scope.Gift.guidePrice*$scope.print_spd.giftNum
                }
                var giftcodeRepeat = 0;
                for(var i=1;i<=$scope.giftListCustAllPage.data.length;i++){
                    if($scope.Gift.giftCode==$scope.giftListCustAllPage.data[i-1].giftCode){
                        $scope.giftListCustAllPage.data[i-1].amount = $scope.giftListCustAllPage.data[i-1].amount+$scope.print_spd.giftNum;
                        $scope.giftListCustAllPage.data[i-1].amountMoney = $scope.giftListCustAllPage.data[i-1].amountMoney+$scope.Gift.guidePrice*$scope.print_spd.giftNum;
                        giftcodeRepeat = 1;
                    }
                }
                if(giftcodeRepeat == 0){
                    $scope.giftListCustAllPage.data.unshift(arr);
                };
                $scope.print_spd.giftDiscount = 0;
                $scope.print_spd.czkje = 0;
                $scope.print_spd.czkjedw=0;
                for(var i=1;i<=$scope.giftListCustAllPage.data.length;i++){
                    $scope.giftListCustAllPage.data[i-1].index = i;
                    if($scope.giftListCustAllPage.data[i-1].giftType==4){
                        $scope.print_spd.czkje = $scope.print_spd.czkje+$scope.giftListCustAllPage.data[i-1].amountMoney;
                    }
                    $scope.print_spd.giftDiscount = $scope.giftListCustAllPage.data[i-1].amountMoney+$scope.print_spd.giftDiscount;
                }
                if($scope.print_spd.syxje!=0&&$scope.print_spd.syxje!=null){
                    $scope.print_spd.czkjedw = Math.round($scope.print_spd.czkje/$scope.print_spd.syxje*100)/100;
                }
                $scope.print_spd.comprehensiveDiscount = $scope.print_spd.yhje+$scope.print_spd.giftDiscount;
            };
            $scope.deleteGiftBtnCust = function(row) {
                $scope.giftListCustAllPage.data.splice($scope.giftListCustAllPage.data.indexOf(row.entity), 1);
                $scope.print_spd.giftDiscount = 0;
                for(var i=1;i<=$scope.giftListCustAllPage.data.length;i++){
                    $scope.giftListCustAllPage.data[i-1].index = i;
                    $scope.print_spd.giftDiscount = $scope.giftListCustAllPage.data[i-1].amountMoney+$scope.print_spd.giftDiscount;
                }
                $scope.print_spd.comprehensiveDiscount = $scope.print_spd.yhje+$scope.print_spd.giftDiscount;
                $scope.print_spd.czkje = 0;
                $scope.print_spd.czkjedw=0;
                for(var i=1;i<=$scope.giftListCustAllPage.data.length;i++){
                    $scope.giftListCustAllPage.data[i-1].index = i;
                    if($scope.giftListCustAllPage.data[i-1].giftType==4){
                        $scope.print_spd.czkje = $scope.print_spd.czkje+$scope.giftListCustAllPage.data[i-1].amountMoney;
                    }
                }
                if($scope.print_spd.syxje!=0&&$scope.print_spd.syxje!=null){
                    $scope.print_spd.czkjedw = Math.round($scope.print_spd.czkje/$scope.print_spd.syxje*100)/100;
                }
            };
            //提交审批单
            $scope.print_spd_submit = function(){

                var carLicenseNumber =$scope.print_spd.carLicenseNumber||'';
                var chassisNumber =$scope.print_spd.chassisNumber||'';
                var engineNumber =$scope.print_spd.engineNumber||'';
                var carBrand = '';
                var vehicleModel = '';
                if($scope.print_spd.carBrand){
                    carBrand = $scope.print_spd.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.print_spd.vehicleModelInput||'';
                    }else if($scope.print_spd.vehicleModel){
                        vehicleModel =$scope.print_spd.vehicleModel.modelName;
                    }
                }
                var factoryLicenseType =$scope.print_spd.factoryLicenseType||'';
                var jqxrqStart =$filter('date')(new Date($scope.print_spd.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                var jqxrqEnd =$scope.print_spd.jqxrqEnd||'';
                var insurDate =$scope.print_spd.insurDate||'';
                var renewalType =$scope.print_spd.renewalType||'';
                var renewalWay =$scope.print_spd.renewalWay||'';
                var solicitMember =$scope.print_spd.solicitMember||'';
                var insured =$scope.print_spd.insured||'';
                var bbxrzjh =$scope.print_spd.certificateNumber||'';
                var contact =$scope.print_spd.contact||'';
                var contactWay =$scope.print_spd.contactWay||'';
                var remark =$scope.print_spd.remark||'';
                var insuranceCompName = '';
                if($scope.print_spd.insuranceCompName){
                    insuranceCompName = $scope.print_spd.insuranceCompName.insuranceCompName;
                }

                var insurancTypes = '';
                var insuTypes = [];
                if($scope.print_spd.insuranceTypes){
                    var xz = $scope.print_spd.insuranceTypes;
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].checkStatus == true){
                            if(insurancTypes==''){
                                insurancTypes = xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }else{
                                insurancTypes = insurancTypes + ','+ xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }
                            insuTypes.push(xz[i]);
                        }
                    }
                }

                var kpxx =$scope.print_spd.kpxx||'';
                var syxje =$scope.print_spd.syxje||'';
                var jqxje =$scope.print_spd.jqxje||'';
                var ccs =$scope.print_spd.ccs||'';
                var bfhj =$scope.print_spd.bfhj||'';
                var kpje =$scope.print_spd.kpje||'';
                var yhje =$scope.print_spd.yhje||'';
                var ssje =$scope.print_spd.ssje||'';
                var xjyhdw =$scope.print_spd.xjyhdw||'';
                var czkje =$scope.print_spd.czkje||'';
                var czkjedw =$scope.print_spd.czkjedw||'';
                var fkfs =$scope.print_spd.fkfs||'';
                var zsxx1 =$scope.print_spd.zsxx1||'';
                var zsxx2 =$scope.print_spd.zsxx2||'';
                var zsxx3 =$scope.print_spd.zsxx3||'';
                var zsxx4 =$scope.print_spd.zsxx4||'';
                var zsxx5 =$scope.print_spd.zsxx5||'';
                var zsxx6 =$scope.print_spd.zsxx6||'';
                var zsxx7 =$scope.print_spd.zsxx7||'';
                var zsxx8 =$scope.print_spd.zsxx8||'';
                var zsxx9 =$scope.print_spd.zsxx9||'';
                var zsxx10 =$scope.print_spd.zsxx10||'';
                var zsxx11 =$scope.print_spd.zsxx11||'';
                var zsxx12 =$scope.print_spd.zsxx12||'';
                var giftDiscount =$scope.print_spd.giftDiscount||'';
                var comprehensiveDiscount =$scope.print_spd.comprehensiveDiscount||'';
                var zxxxs = [];
                var flag;//1表示打印老审批单,2表示打印新审批单
                if($scope.accountModule==1){
                    flag = 2;
                    zxxxs=$scope.giftListCustAllPage.data;
                }else{
                    flag = 1;
                    zxxxs =[
                        {zsxx:zsxx1},{zsxx:zsxx2},{zsxx:zsxx3},{zsxx:zsxx4},{zsxx:zsxx5},{zsxx:zsxx6},
                        {zsxx:zsxx7},{zsxx:zsxx8},{zsxx:zsxx9},{zsxx:zsxx10},{zsxx:zsxx11},{zsxx:zsxx12}
                    ]
                }

                //保险保额信息
                var cheSunBX = 0;
                var sanZheBX = 0;
                var siJiBX = 0;
                var chengKeBX = 0;
                var boLiBX = 0;
                var huahenBX = 0;
                var huoWuBX = 0;
                var jingShenSunShiBX = 0;
                var feiYongBuChangBX = 0;
                var zhiDingXiuLiBX = 0;
                if($("#chesun").val()> 0){
                    var chesunNum =  $("#chesun").val();
                    cheSunBX = chesunNum;
                }else{
                    cheSunBX =  0;
                }
                if($("#sanzhe").val().indexOf(":") > -1){
                    var sanzheNum =  $("#sanzhe").val().split(":")[1];
                    sanZheBX = sanzheNum;
                }else{
                    sanZheBX =  0;
                }
                // console.log("三责 " + sanZheBX)
                if($("#siji").val()> 100){
                    var sijiNum =  $("#siji").val();
                    siJiBX = sijiNum;
                }else{
                    siJiBX =  0;
                }
                // console.log("司机 " + siJiBX)
                if($("#chengke").val() > 100){
                    var chengkeNum =  $("#chengke").val();
                    chengKeBX = chengkeNum;
                }else{
                    chengKeBX =  0;
                }
                // console.log("乘客  " + chengKeBX )
                if($("#huahen").val().indexOf(":") > -1){
                    var huahenNum =  $("#huahen").val().split(":")[1];
                    huahenBX = huahenNum;
                }else{
                    huahenBX =  0;
                }
                //  console.log("划痕 " + huahenBX)
                if($("#boli").val().indexOf(":") > -1){
                    var boliNum =  $("#boli").val().split(":")[1];
                    boLiBX = boliNum;
                }else{
                    boLiBX =  0;
                }
                //  console.log("玻璃 " + boLiBX)
                if($("#huowu").val() > 100){
                    var huowuNum =  $("#huowu").val();
                    huoWuBX = huowuNum;
                }else{
                    huoWuBX =  0;
                }
                // console.log("货物 " + huoWuBX)
                if($("#jingshen").val() > 10){
                    var jingshenNum =  $("#jingshen").val();
                    jingShenSunShiBX = jingshenNum;
                }else{
                    jingShenSunShiBX =  0;
                }
                //  console.log("精神损失 " + jingShenSunShiBX)
                if($("#feiyong").val() > 10){
                    var feiyongNum =  $("#feiyong").val();
                    feiYongBuChangBX = feiyongNum;
                }else{
                    feiYongBuChangBX =  0;
                }
                // console.log("费用补偿 " + feiYongBuChangBX)
                if($("#zhiding").val() > 10){
                    var zhidingNum =  $("#zhiding").val();
                    zhiDingXiuLiBX = zhidingNum;
                }else{
                    zhiDingXiuLiBX =  0;
                }
                // console.log("指定修理厂 " + zhiDingXiuLiBX)
                var insuredQuota = {"cheSun" : cheSunBX , "sanZhe" : sanZheBX , "siJi" : siJiBX, "chengKe" : chengKeBX , "huaHen" : huahenBX ,
                    "boLi" : boLiBX , "huoWu" : huoWuBX , "jingShenSunShi" : jingShenSunShiBX , "feiYongBuChang" : feiYongBuChangBX ,
                    "zhiDingXiuLi" : zhiDingXiuLiBX}
                var print_spd_datas = {
                    approvalBill:{carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,engineNumber:engineNumber,
                        carBrand:carBrand,vehicleModel:vehicleModel,jqxrqStart:jqxrqStart,jqxrqEnd:jqxrqEnd,
                        insurDate:insurDate,renewalType:renewalType,renewalWay:renewalWay,
                        solicitMember:solicitMember,insured:insured,bbxrzjh:bbxrzjh,
                        contact:contact,contactWay:contactWay,insurancTypes:insurancTypes,
                        kpxx:kpxx,syxje:syxje,jqxje:jqxje,insuranceCompName:insuranceCompName,
                        ccs:ccs,bfhj:bfhj,kpje:kpje,remark:remark, yhje:yhje,ssje:ssje,fkfs:fkfs,
                        factoryLicenseType:factoryLicenseType,giftDiscount:giftDiscount,xjyhdw:xjyhdw,
                        czkje:czkje,czkjedw:czkjedw,comprehensiveDiscount:comprehensiveDiscount},
                    zsxxs: zxxxs,insuTypes:insuTypes
                }
                if(chassisNumber==''){
                    $scope.angularTip("车架号不能为空！",5000);
                    return;
                }
                $("#msgwindow").show();
                customerIWService.print_spd_submit(print_spd_datas, flag, insuredQuota).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK'){
                        var hr = "/pdf/"+chassisNumber+".pdf";
                        $("#iframe").attr("src", hr);
                        var ifr = document.getElementById("iframe");
                        if (ifr.attachEvent) {
                            ifr.attachEvent("onload", function() {
                                $scope.angularTip("Local if is now loaded attachEvent.",5000);
                            });
                        } else {
                            ifr.onload = function() {
                                setTimeout(function(){
                                    document.getElementById("iframe").contentWindow.print();
                                },200);
                            };
                        };


                    }else{
                        $scope.angularTip("操作失败",5000);
                    }
                });

            }
            $scope.close_spd = function(){
                $("#spd").hide();
                $scope.footerBtn = "";
                $scope.print_spd = {};
                $scope.cleanSingleDetails();
            }
            //审批单商业险种拼装
            $scope.spdsyxz = function(){
                $scope.print_spd.insuranceTypes = [];
                if($scope.print_spd.insuranceCompName){
                    var syxz = $scope.print_spd.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                    }
                    $scope.print_spd.insuranceTypes = syxz;
                }
            }
            //新增保单品牌车型选择框与输入框切换
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

            //审批单品牌与车型默认值
            $scope.spdmr = function (carBrand,vehicleModel){
                var sfyy = 0 ;
                $scope.carBrands_spd = [];
                $scope.carBrands_spd = $.extend(true, [], $scope.carBrands);

                for(var i = 0 ;i<$scope.carBrands_spd.length;i++){
                    if(carBrand==$scope.carBrands_spd[i].brandName){
                        sfyy = 1;
                    }else if(carBrand==null||carBrand==''){
                        $("#clxhxz_spd").show();
                        $("#clxhsr_spd").hide();
                        return;
                    }
                }
                if(sfyy==0){
                    $scope.carBrands_spd.push({brandName:carBrand})
                }
                for(var i = 0 ;i<$scope.carBrands_spd.length;i++){
                    if(carBrand==$scope.carBrands_spd[i].brandName&&sfyy==0){
                        $("#clxhxz_spd").show();
                        $("#clxhsr_spd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                            return
                        }
                        $scope.carBrands_spd[i].carModelList=[{modelName:vehicleModel}];
                        $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                        $scope.print_spd.vehicleModel = $scope.print_spd.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrands_spd[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_spd").show();
                        $("#clxhxz_spd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                            return
                        }
                        $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                        $scope.print_spd.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrands_spd[i].brandName&&sfyy==1){
                        $("#clxhxz_spd").show();
                        $("#clxhsr_spd").hide();
                        $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                        for(var j = 0 ;j<$scope.print_spd.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.print_spd.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrands_spd[i].carModelList.push({modelName:vehicleModel});
                            $scope.print_spd.carBrand = $scope.carBrands_spd[i];
                        }
                        for(var j = 0 ;j<$scope.print_spd.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.print_spd.carBrand.carModelList[j].modelName){
                                $scope.print_spd.vehicleModel = $scope.print_spd.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }

            //审批单品牌车型选择框与输入框切换
            $scope.spdVehicleModel = function(){
                $scope.print_spd.vehicleModel='';
                $scope.print_spd.vehicleModelInput='';
                if($scope.print_spd.carBrand){
                    if($scope.print_spd.carBrand.brandName=='异系'){
                        $("#clxhsr_spd").show();
                        $("#clxhxz_spd").hide();
                    }else{
                        $("#clxhxz_spd").show();
                        $("#clxhsr_spd").hide();
                    }
                }else {
                    $("#clxhxz_spd").show();
                    $("#clxhsr_spd").hide();
                }
            }

            //保费合计计算
            $scope.bfhjjs = function(){
                var syxje = $scope.print_spd.syxje||0;
                var jqxje = $scope.print_spd.jqxje||0;
                var ccs = $scope.print_spd.ccs||0;
                $scope.print_spd.bfhj = (syxje + jqxje + ccs).toFixed(2);
                if(syxje!=0&&syxje!=null&&$scope.print_spd.czkje!=null){
                    $scope.print_spd.czkjedw = Math.round($scope.print_spd.czkje/syxje*100)/100;
                }
                $scope.sjjejs();
            }
            //现金优惠点位计算
            $scope.xjyhdwjs = function(){
                var syxje = $scope.print_spd.syxje||0;
                var xjyhdw = $scope.print_spd.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.print_spd.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.print_spd.yhje = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs();
                }
            }

            //实收金额计算
            $scope.sjjejs = function(){
                var syxje = $scope.print_spd.syxje||0;
                var bfhj = $scope.print_spd.bfhj||0;
                var yhje = $scope.print_spd.yhje||0;
                $scope.print_spd.ssje = (bfhj - yhje).toFixed(2);
                $scope.print_spd.comprehensiveDiscount = $scope.print_spd.yhje+$scope.print_spd.giftDiscount;
                if(syxje!=0){
                    $scope.print_spd.xjyhdw = Math.round(yhje/syxje*100)/100;
                }
            }

            //新增保单

            //新增保单弹框
            $scope.newsingle = {};
            $scope.newPolicybtn_qk=function(){
                $("#newsingle_qk").show();
                $("#msgwindow").show();
                $scope.xzVehicleModel_qk();
                $scope.newsingle = {};
                $scope.newsingle.chassisNumber=$scope.genzcl.chassisNumber;
                $scope.newsingle.insuranceCompLY=$scope.genzcl.insuranceCompLY;
                $scope.tracelistNewPolicy.data = [];
                $scope.newsingle.insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.getInfoByChassisNumber_qk(0);
            }

            //新增保单品牌车型选择框与输入框切换
            $scope.xzVehicleModel_qk = function(){
                $scope.newsingle.vehicleModel='';
                $scope.newsingle.vehicleModelInput='';
                if($scope.newsingle.carBrand){
                    if($scope.newsingle.carBrand.brandName=='异系'){
                        $("#clxhsr_xbd_qk").show();
                        $("#clxhxz_xbd_qk").hide();
                    }else{
                        $("#clxhxz_xbd_qk").show();
                        $("#clxhsr_xbd_qk").hide();
                    }
                }else {
                    $("#clxhxz_xbd_qk").show();
                    $("#clxhsr_xbd_qk").hide();
                }
            }

            //新增保单品牌与车型默认值
            $scope.newPolicymr_qk = function (carBrand,vehicleModel){
                var sfyy = 0 ;
                $scope.carBrandsXBD = [];
                $scope.carBrandsXBD = $.extend(true, [], $scope.carBrands);
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName){
                        sfyy = 1;
                    }else if(carBrand==null||carBrand==''){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        return;
                    }
                }
                if(sfyy==0){
                    $scope.carBrandsXBD.push({brandName:carBrand})
                }
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==0){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.carBrandsXBD[i].carModelList=[{modelName:vehicleModel}];
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.newsingle.vehicleModel = $scope.newsingle.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsXBD[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_xbd").show();
                        $("#clxhxz_xbd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.newsingle.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==1){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        for(var j = 0 ;j<$scope.newsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.newsingle.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsXBD[i].carModelList.push({modelName:vehicleModel});
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        }
                        for(var j = 0 ;j<$scope.newsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.newsingle.carBrand.carModelList[j].modelName){
                                $scope.newsingle.vehicleModel = $scope.newsingle.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }

            //保费合计计算
            $scope.bfhjjs_qk = function(){
                var cinsuranceCoverage = $scope.newsingle.cinsuranceCoverage||0;
                var vehicleTax = $scope.newsingle.vehicleTax||0;
                var binsuranceCoverage = $scope.newsingle.binsuranceCoverage||0;
                $scope.newsingle.premiumCount = (cinsuranceCoverage + vehicleTax + binsuranceCoverage).toFixed(2);
                $scope.sjjejs_qk();
                $scope.sxfhj_qk(0);
                if(binsuranceCoverage!=0&&binsuranceCoverage!=null&&$scope.newsingle.czkje!=null){
                    $scope.newsingle.czkjedw = Math.round($scope.newsingle.czkje/binsuranceCoverage*100)/100;
                }
            }

            //利润计算
            $scope.lrjs_qk = function(){
                var factorageCount = $scope.newsingle.factorageCount || 0;
                var privilegeSum = $scope.newsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                if(factorageCount!= 0){
                    $scope.newsingle.profit = (factorageCount - privilegeSum).toFixed(2);
                }
            }

            //实收金额计算
            $scope.sjjejs_qk = function(){
                var syxje = $scope.newsingle.binsuranceCoverage||0;
                var premiumCount = $scope.newsingle.premiumCount||0;
                var privilegeSum = $scope.newsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                $scope.newsingle.realPay =  (premiumCount - privilegeSum).toFixed(2);
                $scope.sxfhj_qk(0);
                if(syxje!=0){
                    $scope.newsingle.xjyhdw = Math.round(privilegeSum/syxje*100)/100;
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs_qk = function(){
                var syxje = $scope.newsingle.binsuranceCoverage||0;
                var xjyhdw = $scope.newsingle.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.newsingle.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.newsingle.privilegeSum = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs_qk();
                }
            }
            //商业险保费＊ 参数设置内商业险手续费％＋  交强险保费＊参数设置内交强险手续费％（新保按新保的手续费，续保按续保的手续费
            //bxgssfgb=0代表不进行商业险种的拼装  bxgssfgb=1代表进行商业险种的拼装
            $scope.sxfhj_qk = function(bxgssfgb){
                var cinsuranceCoverage = $scope.newsingle.cinsuranceCoverage||0;
                var binsuranceCoverage = $scope.newsingle.binsuranceCoverage||0;
                var coverType = $scope.newsingle.coverType||0;
                if($scope.newsingle.insuranceCompName&&coverType>0){
                    var sjf = $scope.newsingle.insuranceCompName.factorages;
                    if($scope.newsingle.insuranceCompName.factorages && $scope.newsingle.insuranceCompName.factorages.length>0){
                        for(var i = 0;i<$scope.newsingle.insuranceCompName.factorages.length;i++){
                            if(sjf[i].insuName=='binsuranceNew'&&coverType==1){
                                binsuranceCoverage = sjf[i].insuPercent*binsuranceCoverage/100;
                            }else if(sjf[i].insuName=='cinsuranceNew'&&coverType==1 ){
                                cinsuranceCoverage = sjf[i].insuPercent*cinsuranceCoverage/100;
                            }else if(sjf[i].insuName=='binsurance'&&coverType!=1 ){
                                binsuranceCoverage = sjf[i].insuPercent*binsuranceCoverage/100;
                            }else if(sjf[i].insuName=='cinsurance'&&coverType!=1 ){
                                cinsuranceCoverage = sjf[i].insuPercent*cinsuranceCoverage/100;
                            }
                        }
                    }

                    $scope.newsingle.factorageCount = (cinsuranceCoverage + binsuranceCoverage).toFixed(2);
                }else {
                    $scope.newsingle.factorageCount = 0;
                }
                $scope.lrjs_qk();
                if(bxgssfgb==1){
                    $scope.syxzpz_qk();
                }
            }
            //商业险种拼装
            $scope.syxzpz_qk = function(){
                $scope.newsingle.insuranceTypes = [];
                if($scope.newsingle.insuranceCompName){
                    $scope.bihubaojia.SanZhe = "";
                    $scope.bihubaojia.SiJick = "";
                    $scope.bihubaojia.ChengKe = "";
                    $scope.bihubaojia.HuaHen = "";
                    $scope.bihubaojia.BoLi = "";
                    $scope.bihubaojia.HcHuoWuZeRen = "";
                    $scope.bihubaojia.HcJingShenSunShi = "";
                    $scope.bihubaojia.hcFeiYongBuChang = "";
                    $scope.bihubaojia.hcXiuLiBuChang = "";
                    var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                        if(syxz[i].typeName.indexOf("-")>0){
                            var typeName = syxz[i].typeName.split("-")[0];
                            syxz[i].typeName = typeName;
                        }else{
                            var typeName = syxz[i].typeName;
                            syxz[i].typeName = typeName;
                        }
                    }
                    $scope.newsingle.insuranceTypes = syxz;
                }
            }

            //日期计算方法
            $scope.GetDateStr_qk = function(setDate)
            {
                var startDate =new Date(setDate);
                startDate.setFullYear(startDate.getFullYear()+1);
                var endDate=startDate.getTime()-(1000*60*60*24);
                var nextyear=$filter('date')(new Date(endDate),'yyyy-MM-dd');
                return nextyear;
            }
            //商业险日期设定
            $scope.syxrqStartChange_qk = function() {
                var setDate = $scope.newsingle.syxrqStart;
                if(typeof setDate == 'undefined' || setDate == '' || setDate == null){
                    $scope.newsingle.syxrqEnd = undefined;
                }else{
                    $scope.newsingle.syxrqEnd = $scope.GetDateStr(setDate);
                }
            }
            //交强险日期设定
            $scope.jqxrqStartChange_qk = function() {
                var setDate = $scope.newsingle.jqxrqStart;
                if(typeof setDate == 'undefined' || setDate == '' || setDate == null){
                    $scope.newsingle.jqxrqEnd = undefined;
                }else{
                    $scope.newsingle.jqxrqEnd = $scope.GetDateStr(setDate);
                }
            }
            //险种选中变状态
            $scope.checkboxChange = function(){
                $scope.PolicyValuebol = true;
                var length = parseInt(this.$$watchers.length-1);
                angular.forEach(this.$$watchers[length].last, function (each) {

                    //车损
                    each.typeId == 64 && each.checkStatus ?  $('#chesun').attr("disabled",false) : "";
                    each.typeId == 64 && !each.checkStatus ?  $('#chesun').attr("disabled",true) : "";
                    //三者
                    each.typeId == 65 && each.checkStatus ?  $('#sanzhe').attr("disabled",false) : "";
                    each.typeId == 65 && !each.checkStatus ?  $('#sanzhe').attr("disabled",true) : "";
                    //司机
                    each.typeId == 67 && each.checkStatus ?  $('#siji').attr("disabled",false) : "";
                    each.typeId == 67 && !each.checkStatus ?  $('#siji').attr("disabled",true) : "";
                    //乘客
                    each.typeId == 76 && each.checkStatus ?  $('#chengke').attr("disabled",false) : "";
                    each.typeId == 76 && !each.checkStatus ?  $('#chengke').attr("disabled",true) : "";
                    //划痕
                    each.typeId == 69 && each.checkStatus ?  $('#huahen').attr("disabled",false) : "";
                    each.typeId == 69 && !each.checkStatus ?  $('#huahen').attr("disabled",true) : "";
                    //玻璃
                    each.typeId == 70 && each.checkStatus ?  $('#boli').attr("disabled",false) : "";
                    each.typeId == 70 && !each.checkStatus ?  $('#boli').attr("disabled",true) : "";
                    //货物
                    each.typeId == 79 && each.checkStatus ?  $('#huowu').attr("disabled",false) : "";
                    each.typeId == 79 && !each.checkStatus ?  $('#huowu').attr("disabled",true) : "";
                    //精神
                    each.typeId == 77 && each.checkStatus ?  $('#jingshen').attr("disabled",false) : "";
                    each.typeId == 77 && !each.checkStatus ?  $('#jingshen').attr("disabled",true) : "";
                    //费用
                    each.typeId == 80 && each.checkStatus ?  $('#feiyong').attr("disabled",false) : "";
                    each.typeId == 80 && !each.checkStatus ?  $('#feiyong').attr("disabled",true) : "";
                    //指定
                    each.typeId == 74 && each.checkStatus ?  $('#zhiding').attr("disabled",false) : "";
                    each.typeId == 74 && !each.checkStatus ?  $('#zhiding').attr("disabled",true) : "";

                });
            };

            //提交新增保单信息
            $scope.submit_qk = function() {
                //车辆信息
                var carLicenseNumber =$scope.newsingle.carLicenseNumber;
                var chassisNumber =$scope.newsingle.chassisNumber;
                var engineNumber =$scope.newsingle.engineNumber;
                var carBrand = null;
                var vehicleModel = null;
                if($scope.newsingle.carBrand){
                    carBrand = $scope.newsingle.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.newsingle.vehicleModelInput
                    }else if($scope.newsingle.vehicleModel){
                        vehicleModel =$scope.newsingle.vehicleModel.modelName;
                    }
                }
                var registrationDate =$scope.newsingle.registrationDate;
                if(registrationDate == ""||registrationDate == null){
                    registrationDate = undefined;
                }
                //保单信息
                var binsuranceNumber =$scope.newsingle.binsuranceNumber;
                var binsuranceCoverage =$scope.newsingle.binsuranceCoverage;
                var vehicleTax =$scope.newsingle.vehicleTax;
                var privilegePro =$scope.newsingle.privilegePro;
                var renewalWay =$scope.newsingle.renewalWay;
                //出单成功后本店投保次数加1
                var insurNumber =$scope.newsingle.insurNumber + 1;
                var cinsuranceNumber = $scope.newsingle.cinsuranceNumber;
                var cinsuranceCoverage =$scope.newsingle.cinsuranceCoverage;
                var premiumCount =$scope.newsingle.premiumCount;
                var privilegeSum =$scope.newsingle.privilegeSum;
                var donateCostCount =$scope.newsingle.donateCostCount;
                var factorageCount =$scope.newsingle.factorageCount;
                var realPay =$scope.newsingle.realPay;
                var payWay =$scope.newsingle.payWay;
                var sdfs = $scope.newsingle.sdfs;
                var coverType =$scope.newsingle.coverType;
                var profit = $scope.newsingle.profit;
                var insurDate =$scope.newsingle.insurDate;
                var giftDiscount =$scope.newsingle.giftDiscount;
                var xjyhdw =$scope.newsingle.xjyhdw;
                var czkje =$scope.newsingle.czkje;
                var czkjedw =$scope.newsingle.czkjedw;
                if(insurDate == ""||insurDate==null){
                    insurDate = undefined;
                }
                var syxrqStart = $scope.newsingle.syxrqStart||null;
                if(syxrqStart != ""&&syxrqStart!=null){
                    syxrqStart =$filter('date')(new Date($scope.newsingle.syxrqStart),'yyyy-MM-dd 00:00:00');
                }
                var syxrqEnd =$scope.newsingle.syxrqEnd;
                var jqxrqStart = $scope.newsingle.jqxrqStart||null;
                if(jqxrqStart != ""&&jqxrqStart!=null){
                    jqxrqStart =$filter('date')(new Date($scope.newsingle.jqxrqStart),'yyyy-MM-dd 00:00:00');
                }
                var jqxrqEnd =$scope.newsingle.jqxrqEnd;
                var qnbe =$scope.newsingle.qnbe;
                var qnsyxje =$scope.newsingle.qnsyxje;
                var qnjqxje =$scope.newsingle.qnjqxje;
                var qnccsje =$scope.newsingle.qnccsje;
                var invoiceName =$scope.newsingle.invoiceName;
                var insuranceCompName = null;
                if($scope.newsingle.insuranceCompName){
                    insuranceCompName = $scope.newsingle.insuranceCompName.insuranceCompName;
                }
                var insurancTypes = '';

                //保险保额信息
                var sanZhe = 0;
                var cheSun = 0;
                var siJi = 0;
                var chengKe = 0;
                var huaHen = 0;
                var boLi = 0;
                var huoWu = 0;
                var jingShenSunShi = 0;
                var feiYongBuChang = 0;
                var zhiDingXiuLi = 0;

                if($scope.newsingle.insuranceTypes){
                    var xz = $scope.newsingle.insuranceTypes;
                    var insuTypes = [];
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].checkStatus == true){
                            if(insurancTypes==''){
                                insurancTypes = xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }else{
                                insurancTypes = insurancTypes + ','+ xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    //  insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }
                            if(xz[i].typeId =="64" && xz[i].typeName.indexOf("-")<0){
                                cheSun =  $scope.bihubaojia.CheSun
                                // console.log("车损 " + cheSun)
                            }
                            if(xz[i].typeId =="65" && xz[i].typeName.indexOf("-")<0){
                                sanZhe =  $scope.bihubaojia.SanZhe
                                // console.log("三责 " + sanZhe)
                            }
                            if(xz[i].typeId =="67"&& xz[i].typeName.indexOf("-")<0){
                                siJi= $scope.bihubaojia.SiJick
                                // console.log("司机 " + siJi)
                            }
                            if(xz[i].typeId =="76"&& xz[i].typeName.indexOf("-")<0){
                                chengKe = $scope.bihubaojia.ChengKe
                                // console.log("乘客  " + chengKe )
                            }
                            if(xz[i].typeId =="69"&& xz[i].typeName.indexOf("-")<0){
                                huaHen= $scope.bihubaojia.HuaHen
                                // console.log("划痕 " + huaHen)
                            }
                            if(xz[i].typeId =="70"&& xz[i].typeName.indexOf("-")<0){
                                boLi= $scope.bihubaojia.BoLi
                                // console.log("玻璃 " + boLi)
                            }
                            if(xz[i].typeId =="79"&& xz[i].typeName.indexOf("-")<0){
                                huoWu = $scope.bihubaojia.HcHuoWuZeRen
                                // console.log("货物 " + huoWu)
                            }
                            if(xz[i].typeId =="77"&& xz[i].typeName.indexOf("-")<0){
                                jingShenSunShi = $scope.bihubaojia.HcJingShenSunShi
                                // console.log("精神损失 " + jingShenSunShi)
                            }
                            if(xz[i].typeId =="80"&& xz[i].typeName.indexOf("-")<0){
                                feiYongBuChang = $scope.bihubaojia.hcFeiYongBuChang
                                // console.log("费用补偿 " + feiYongBuChang)
                            }
                            if(xz[i].typeId =="74"&& xz[i].typeName.indexOf("-")<0){
                                zhiDingXiuLi= $scope.bihubaojia.hcXiuLiBuChang
                                // console.log("指定修理厂 " + zhiDingXiuLi)
                            }
                            insuTypes.push(xz[i]);
                        }
                    }
                    if($scope.approvalBillAll!=null){
                        $scope.approvalBillAll.insurancTypes = insurancTypes;
                    }
                }
                var remark =$scope.newsingle.remark;
                var customerSource =$scope.newsingle.customerSource;

                //办理人员

                var principal = null;
                var principalId = null;
                if($scope.genzcl.principal && $scope.genzcl.principalId){
                    principal = $scope.genzcl.principal;
                    principalId = $scope.genzcl.principalId;
                }else if($scope.newsingle.principal){
                    principal = $scope.newsingle.principal.userName;
                    principalId = $scope.newsingle.principal.id;
                }
                var clerk = null;
                var clerkId = null;
                if($scope.newsingle.clerk){
                    clerk = $scope.newsingle.clerk.userName;
                    clerkId = $scope.newsingle.clerk.id;
                }
                var insuranceWriter =$rootScope.user.userName;
                var insuranceWriterId =$rootScope.user.userId;
                var solicitMember = null;
                var solicitMemberId =null;
                if($scope.newsingle.solicitMember){
                    solicitMember = $scope.newsingle.solicitMember.userName;
                    solicitMemberId = $scope.newsingle.solicitMember.id;
                }

                var cashier =$scope.newsingle.cashier;

                //客户信息
                var carOwner =$scope.newsingle.carOwner;
                var insured =$scope.newsingle.insured;
                var certificateNumber =$scope.newsingle.certificateNumber;
                var contact =$scope.newsingle.contact;
                var contactWay =$scope.newsingle.contactWay;
                var customerCharacter =$scope.newsingle.customerCharacter;
                var address =$scope.newsingle.address;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                //验证表单信息
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                }
                var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
                /* if (jqxrqStart&&!reg.test(jqxrqStart)){
                     $scope.angularTip("请保证交强险开始日期格式为yyyy-mm-dd",5000);
                     return ;
                 }
                 if (syxrqStart&&!reg.test(syxrqStart)){
                     $scope.angularTip("请保证商业险开始日期格式为yyyy-mm-dd",5000);
                     return ;
                 }*/
                if((cinsuranceCoverage!=null&&cinsuranceCoverage!="") && (!jqxrqStart||jqxrqStart=='')){
                    $scope.angularTip("交强险保额不为空,交强险日期不能为空",5000);
                    return;
                }
                if(!coverType||coverType==''){
                    $scope.angularTip("投保类型不能为空",5000);
                    return;
                }
                if(!jqxrqStart && !syxrqStart){
                    $scope.angularTip("交强险日期开始和商业险日期开始不能同时为空",5000);
                    return;
                }
                if(insuranceCompName==null||insuranceCompName==""){
                    $scope.angularTip("保险公司不能为空",5000);
                    return;
                }
                if(!contact||contact==''){
                    $scope.angularTip("联系人不能为空",5000);
                    return;
                }
                if(!contactWay||contactWay==''){
                    $scope.angularTip("联系方式不能为空",5000);
                    return;
                }
                if(!(/^([0-9-]+)$/.test(contactWay))){
                    $scope.angularTip("联系方式填写有误！",5000);
                    return;
                }
                if(jqxrqStart != ''&&jqxrqStart!=null){
                    if(new Date(jqxrqStart).toISOString().substring(0,10) <= new Date(new Date().setMonth(new Date().getMonth() - 3 )).toISOString().substring(0,10)){
                        $scope.angularTip("交强险开始日期不能为3个月以前",5000);
                        return;
                    }
                    if (new Date(jqxrqStart).toISOString().substring(0,10) >= new Date( new Date().setDate(new Date().getDate()+95)).toISOString().substring(0,10)){
                        $scope.angularTip("交强险开始日期不能为3个月以后",5000);
                        return;
                    }
                }
                if((syxrqStart!=null&&syxrqStart!="") && (!binsuranceCoverage||binsuranceCoverage==''||binsuranceCoverage==0)){
                        $scope.angularTip("商业险日期不为空,商业险保额不能为空",5000);
                        return;
                }
                if((binsuranceCoverage!=null&&binsuranceCoverage!="") && (!syxrqStart||syxrqStart=='')){
                        $scope.angularTip("商业险保额不为空,商业险日期不能为空",5000);
                        return;
                }
                if(cinsuranceCoverage == "" || cinsuranceCoverage == null){
                    cinsuranceCoverage = 0;
                }
                var newSingleDatas = {
                    carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,engineNumber:engineNumber,
                    carBrand:carBrand,vehicleModel:vehicleModel,registrationDate:registrationDate,
                    binsuranceNumber:binsuranceNumber,vehicleTax:vehicleTax,binsuranceCoverage:binsuranceCoverage,
                    privilegePro:privilegePro,renewalWay:renewalWay,insurNumber:insurNumber,
                    cinsuranceNumber:cinsuranceNumber,cinsuranceCoverage:cinsuranceCoverage,premiumCount:premiumCount,
                    privilegeSum:privilegeSum,donateCostCount:donateCostCount,factorageCount:factorageCount,
                    realPay:realPay,payWay:payWay,sdfs:sdfs,profit:profit,
                    coverType:coverType,insurDate:insurDate,syxrqStart:syxrqStart,
                    syxrqEnd:syxrqEnd,jqxrqStart:jqxrqStart,jqxrqEnd:jqxrqEnd,
                    qnbe:qnbe,qnsyxje:qnsyxje,qnjqxje:qnjqxje,giftDiscount:giftDiscount,
                    qnccsje:qnccsje,invoiceName:invoiceName,insuranceCompName:insuranceCompName,
                    insuranceType:insurancTypes,remark:remark,
                    principal:principal,principalId:principalId,clerk:clerk,
                    clerkId:clerkId,insuranceWriter:insuranceWriter,insuranceWriterId:insuranceWriterId,
                    solicitMember:solicitMember,solicitMemberId:solicitMemberId,cashier:cashier,
                    carOwner:carOwner,insured:insured,certificateNumber:certificateNumber,
                    contact:contact,contactWay:contactWay,customerCharacter:customerCharacter,address:address,
                    fourSStoreId:fourSStoreId,foursStore:foursStore,customerSource:customerSource,
                    xjyhdw:xjyhdw,czkje:czkje,czkjedw:czkjedw
                };
                var insuredQuota = {"cheSun" : cheSun , "sanZhe" : sanZhe , "siJi" : siJi, "chengKe" : chengKe , "huaHen" : huaHen ,
                    "boLi" : boLi , "huoWu" : huoWu , "jingShenSunShi" : jingShenSunShi , "feiYongBuChang" : feiYongBuChang ,
                    "zhiDingXiuLi" : zhiDingXiuLi}
                var identifying = 0;
                //此条件是为店里出交强险是保额为空或为0而添加（如果取消只需else中的方法）
                if((jqxrqStart!=null&&jqxrqStart!="") && (!cinsuranceCoverage||cinsuranceCoverage==''||cinsuranceCoverage==0)){
                    $("#jqbe").show();
                    $scope.jqxbe = function(){
                        $("#jqbe").hide();
                        policyIWService.findExistBillThisMonth(chassisNumber,insurDate).then(function(res){
                            if(res.results.content.existCount>0){
                                $("#jybdts").show();
                                $scope.makesure = function(){
                                    $("#jybdts").hide();
                                    $("#msgwindow").show();
                                    policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                        $("#msgwindow").hide();
                                        if(res.status == 'OK'&&res.results.success==true){
                                            $scope.newsingle = {};
                                            $scope.tracelistSave=[];
                                            $("#newsingle_qk").hide();
                                            $("#genzcl").hide();
                                            $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                            $scope.policyCount = $scope.policyCount-1;
                                            $scope.angularTip("新增保单成功",5000);
                                        }else{
                                            $scope.angularTip(res.results.message,5000);
                                        }
                                    });
                                }
                            }else{
                                $("#msgwindow").show();
                                //$scope.approvalBillAll.jqxrqEnd = $filter('date')(new Date($scope.approvalBillAll.jqxrqEnd),'yyyy-MM-dd HH:mm:ss');
                                policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                    $("#msgwindow").hide();
                                    if(res.status == 'OK'&&res.results.success==true){
                                        $scope.newsingle = {};
                                        $scope.tracelistSave=[];
                                        $("#newsingle_qk").hide();
                                        $("#genzcl").hide();
                                        $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                        $scope.policyCount = $scope.policyCount-1;
                                        $scope.angularTip("新增保单成功",5000);
                                    }else{
                                        $scope.angularTip(res.results.message,5000);
                                    }
                                });
                            }


                        });
                    }
                }else{
                    policyIWService.findExistBillThisMonth(chassisNumber,insurDate).then(function(res){
                        if(res.results.content.existCount>0){
                            $("#jybdts").show();
                            $scope.makesure = function(){
                                $("#jybdts").hide();
                                $("#msgwindow").show();
                                policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                    $("#msgwindow").hide();
                                    if(res.status == 'OK'&&res.results.success==true){
                                        $scope.newsingle = {};
                                        $scope.tracelistSave=[];
                                        $("#newsingle_qk").hide();
                                        $("#genzcl").hide();
                                        $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                        $scope.policyCount = $scope.policyCount-1;
                                        $scope.angularTip("新增保单成功",5000);
                                    }else{
                                        $scope.angularTip(res.results.message,5000);
                                    }
                                });
                            }
                        }else{
                            $("#msgwindow").show();
                            //$scope.approvalBillAll.jqxrqEnd = $filter('date')(new Date($scope.approvalBillAll.jqxrqEnd),'yyyy-MM-dd HH:mm:ss');
                            policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                $("#msgwindow").hide();
                                if(res.status == 'OK'&&res.results.success==true){
                                    $scope.newsingle = {};
                                    $scope.tracelistSave=[];
                                    $("#newsingle_qk").hide();
                                    $("#genzcl").hide();
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policyCount = $scope.policyCount-1;
                                    $scope.angularTip("新增保单成功",5000);
                                }else{
                                    $scope.angularTip(res.results.message,5000);
                                }
                            });
                        }


                    });
                }
            }


            //关闭新增保单窗口，并清除数据
            $scope.closeNewSingle_qk = function(){
                $("#newsingle").hide();
                $scope.newsingle = {};
                $scope.tracelistSave=[];
                $scope.cleanSingleDetails();
            }

            //新增保单跟踪潜客信息
            $scope.chaNumberTrue = 0;
            $scope.tracelistNewPolicy = {};
            $scope.tracelistNewPolicy = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '负责人', field: 'principal' ,width:80,enableColumnMenu: false},
                    { name: '跟踪周期', field: 'traceClcye',width:170,enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',enableColumnMenu: false},
                    { name:'投保类型',field: 'renewalType', cellFilter:'mapTBLX', enableColumnMenu: false,},
                    /* { name: '提前出单天数', field: 'outBillDay' ,enableColumnMenu: false},*/
                    { name: '是否邀约', field: 'isInvite',cellFilter:'mapSF',enableColumnMenu: false},
                    { name: '邀约次数', field: 'inviteNumber',enableColumnMenu: false},
                    { name: '是否邀约进店', field: 'isComeStore',cellFilter:'mapSF',enableColumnMenu: false},
                    { name: '备注', field: 'remark',enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //按车架号查询车辆及潜客信息  sfts  如果为0不提示  1为提示
            $scope.approvalBillAll = {};
            $scope.getInfoByChassisNumber_qk=function(sfts){
                $scope.tracelistNewPolicy.data = [];
                var chassisNumber = $scope.newsingle.chassisNumber;
                policyIWService.getInfoByChassisNumber(chassisNumber).then(function (result) {
                    if (result.success == true) {
                        var custInfo = result.content.result.custInfo;
                        var approvalBill = result.content.result.approvalBill;
                        var insuranceBill = result.content.result.insuranceBill;
                        var insuTypes = result.content.result.insuTypes;
                        if(approvalBill!=null){
                            if(approvalBill.jqxrqStart!=null&&approvalBill.jqxrqStart!=""){
                                approvalBill.jqxrqStart = $filter('date')(new Date(approvalBill.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                                approvalBill.jqxrqEnd = $filter('date')(new Date(approvalBill.jqxrqEnd),'yyyy-MM-dd HH:mm:ss');
                            }

                        }
                        //将审批单信息赋值全局变量
                        $scope.approvalBillAll = approvalBill;
                        if(custInfo!=null||approvalBill!=null||insuranceBill!=null){
                            var insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                            $scope.newsingle = {chassisNumber:chassisNumber,insurDate:insurDate};
                        }else{
                            return;
                        };
                        if(sfts==1){
                            $("#updataPolicy").show();
                        }else{
                            setTimeout(function(){
                                $scope.updataPolicy();
                                $scope.$apply(function() {
                                });
                            },100);
                        }
                        $scope.updataPolicy= function(){
                            $("#updataPolicy").hide();
                            if(custInfo!=null) {
                                //车辆信息
                                $scope.newsingle.carLicenseNumber = custInfo.carLicenseNumber;
                                $scope.newsingle.engineNumber = custInfo.engineNumber;
                                $scope.newsingle.registrationDate = custInfo.registrationDate;
                                $scope.newsingle.carBrand = custInfo.carBrand;
                                $scope.newsingle.vehicleModel = custInfo.vehicleModel;
                                //客户信息
                                $scope.newsingle.carOwner = custInfo.carOwner;
                                $scope.newsingle.insured = custInfo.insured;
                                $scope.newsingle.certificateNumber = custInfo.certificateNumber;
                                $scope.newsingle.contact = custInfo.contact;
                                $scope.newsingle.contactWay = custInfo.contactWay;
                                $scope.newsingle.customerCharacter = custInfo.customerCharacter;
                                $scope.newsingle.address = custInfo.address;
                                $scope.newsingle.coverType = custInfo.renewalType;

                                //办理人员
                                if(custInfo.principalId){
                                    $scope.newsingle.principalId = custInfo.principalId;
                                    $scope.newsingle.clerkId = custInfo.clerkId;
                                }else if($scope.genzcl.principalId || $scope.genzcl.clerkId ){
                                    $scope.newsingle.principalId = $scope.genzcl.principalId;
                                    $scope.newsingle.clerkId = $scope.genzcl.clerkId;
                                }
                                //负责人
                                for (var i = 0; i < $scope.kingdsUser.principal.length; i++) {
                                    if ($scope.kingdsUser.principal[i].id == $scope.newsingle.principalId) {
                                        $scope.newsingle.principal = $scope.kingdsUser.principal[i];
                                    }
                                }
                                //业务员
                                for (var i = 0; i < $scope.kingdsUser.salesman.length; i++) {
                                    if ($scope.kingdsUser.salesman[i].id == $scope.newsingle.clerkId) {
                                        $scope.newsingle.clerk = $scope.kingdsUser.salesman[i];
                                    }
                                }

                                //保险信息
                                $scope.newsingle.insurNumber = custInfo.insurNumber;
                                $scope.newsingle.qnbe = custInfo.insuranceCoverageLY;
                            }
                            if(approvalBill!=null){
                                $scope.newsingle.binsuranceCoverage = approvalBill.syxje;
                                $scope.newsingle.vehicleTax = approvalBill.ccs;
                                $scope.newsingle.renewalWay = approvalBill.renewalWay;
                                $scope.newsingle.cinsuranceCoverage = approvalBill.jqxje;
                                $scope.newsingle.privilegeSum = approvalBill.yhje;
                                $scope.newsingle.payWay = approvalBill.fkfs;
                                $scope.newsingle.coverType = approvalBill.renewalType;
                                //$scope.newsingle.insurDate = approvalBill.insurDate;
                                $scope.newsingle.jqxrqStart = approvalBill.jqxrqStart;
                                $scope.newsingle.jqxrqEnd = approvalBill.jqxrqEnd;
                                $scope.newsingle.invoiceName = approvalBill.kpxx;
                                $scope.newsingle.insuranceCompName = approvalBill.insuranceCompName;
                                $scope.newsingle.giftDiscount = approvalBill.giftDiscount;
                                $scope.newsingle.xjyhdw = approvalBill.xjyhdw;
                                $scope.newsingle.czkje = approvalBill.czkje;
                                $scope.newsingle.czkjedw = approvalBill.czkjedw;
                            }
                            //过滤时间格式
                            $scope.newsingle.insurDate = $filter('date')($scope.newsingle.insurDate, 'yyyy-MM-dd');
                            $scope.newsingle.registrationDate = $filter('date')($scope.newsingle.registrationDate, 'yyyy-MM-dd');
                            if($scope.newsingle.jqxrqStart!=null&&$scope.newsingle.jqxrqStart!=""){
                                $scope.newsingle.jqxrqStart = new Date($scope.newsingle.jqxrqStart);
                            }
                            $scope.newsingle.jqxrqEnd = $filter('date')($scope.newsingle.jqxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                            if(insuranceBill!=null){
                                $scope.newsingle.qnsyxje = insuranceBill.qnsyxje;
                                $scope.newsingle.qnjqxje = insuranceBill.qnjqxje;
                                $scope.newsingle.qnccsje = insuranceBill.qnccsje;
                            }

                            $scope.tracelistSave = result.content.result.traceRecode;
                            $scope.tracelistNewPolicy.data = [];
                            for(var i=0;i<$scope.tracelistSave.length;i++){
                                $scope.tracelistSave[i].index = i+1;
                                if($scope.tracelistSave[i].isComeStore!=null&&$scope.tracelistSave[i].isComeStore>0){
                                    $scope.tracelistSave[i].isComeStore = 1;
                                }else{
                                    $scope.tracelistSave[i].isComeStore = 0;
                                }
                                if($scope.tracelistSave[i].isInvite!=null&&$scope.tracelistSave[i].isInvite>0){
                                    $scope.tracelistSave[i].isInvite = 1;
                                }else{
                                    $scope.tracelistSave[i].isInvite = 0;
                                }
                                $scope.tracelistNewPolicy.data.push($scope.tracelistSave[i])
                            }

                            //保险公司
                            for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                $scope.CheSun = "";
                                $scope.SanZhe = "";
                                $scope.SiJick = "";
                                $scope.chengke = "";
                                $scope.HuaHen = "";
                                $scope.BoLi = "";
                                $scope.HcHuoWuZeRen = "";
                                $scope.HcJingShenSunShi = "";
                                $scope.hcFeiYongBuChang = "";
                                $scope.hcXiuLiBuChang = "";
                                if ($scope.insuranceCompNames[i].insuranceCompName == $scope.newsingle.insuranceCompName && insuTypes) {

                                    $scope.newsingle.insuranceCompName = $scope.insuranceCompNames[i];
                                    if ($scope.newsingle.insuranceCompName) {
                                        var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                                        $scope.newsingle.insuranceTypes = [];
                                        for (var i = 0; i < syxz.length; i++) {
                                            syxz[i].checkStatus=false;
                                            syxz[i].coverage = null;

                                            for (var j = 0; j < insuTypes.length; j++) {
                                                if(syxz[i].typeName.indexOf("-")>0){
                                                    var typeName = syxz[i].typeName.split("-")[0];
                                                    // var insu = syxz[i].typeName.split("-")[1];
                                                    syxz[i].typeName = typeName;
                                                }
                                                if (syxz[i].typeName == insuTypes[j].typeName) {

                                                    syxz[i].checkStatus = true;
                                                    syxz[i].coverage = insuTypes[j].coverage;
                                                }
                                            }
                                            $scope.newsingle.insuranceTypes.push(syxz[i]);
                                        }
                                        //  console.log("baoxian " + JSON.stringify($scope.newsingle.insuranceTypes))
                                    }
                                }else if($scope.insuranceCompNames[i].insuranceCompName == $scope.genzcl.insuranceCompLY && $scope.genzcl.insuranceTypeLY){

                                    $scope.newsingle.insuranceCompName = $scope.insuranceCompNames[i];

                                    $scope.newsingle.insuranceTypes = [];
                                    if($scope.newsingle.insuranceCompName){
                                        $scope.bihubaojia.SanZhe = "";
                                        $scope.bihubaojia.SiJick = "";
                                        $scope.bihubaojia.ChengKe = "";
                                        $scope.bihubaojia.HuaHen = "";
                                        $scope.bihubaojia.BoLi = "";
                                        $scope.bihubaojia.HcHuoWuZeRen = "";
                                        $scope.bihubaojia.HcJingShenSunShi = "";
                                        $scope.bihubaojia.hcFeiYongBuChang = "";
                                        $scope.bihubaojia.hcXiuLiBuChang = "";
                                        var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                                        var insuTypes =[];
                                        if($scope.genzcl.insuranceTypeLY.indexOf(",")>-1){
                                            insuTypes  = $scope.genzcl.insuranceTypeLY.split(",");
                                        }
                                        for (let i = 0; i < syxz.length; i++) {
                                            syxz[i].checkStatus=false;
                                            syxz[i].coverage = null;
                                            for (let j = 0; j < insuTypes.length; j++) {

                                                if(insuTypes[j].indexOf("不计免")>-1 ){
                                                    if(syxz[i].typeId == getTypeId("不计免")){
                                                        syxz[i].checkStatus = true;
                                                    }

                                                } else {
                                                    if(insuTypes[j].indexOf("车损")>-1 && syxz[i].typeId == getTypeId("车损")){
                                                        //车损
                                                        syxz[i].checkStatus = true;
                                                    }else  if(insuTypes[j].indexOf("盗抢")>-1 && syxz[i].typeId == getTypeId("盗抢")){
                                                        //盗抢
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("自燃")>-1 && syxz[i].typeId == getTypeId("自燃")){
                                                        //自燃
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("涉水")>-1 && syxz[i].typeId == getTypeId("涉水")){
                                                        //涉水
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("新增设备")>-1 && syxz[i].typeId == getTypeId("新增设备")){
                                                        //新增设备
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("无法找到第三方")>-1 && syxz[i].typeId == getTypeId("无法找到第三方")){
                                                        //无法找到第三方
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("三责假日")>-1 && syxz[i].typeId == getTypeId("三责假日")){
                                                        //三责假日限额
                                                        syxz[i].checkStatus = true;
                                                    }else if(insuTypes[j].indexOf("第三方责任险")>-1 && syxz[i].typeId == getTypeId("三者") && isNum(insuTypes[j])){
                                                        //第三方责任险
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.SanZhe = parseInt( getNum(insuTypes[j]));
                                                        syxz[i].coverage =parseInt( getNum(insuTypes[j]));


                                                    } else if(insuTypes[j].indexOf("划痕")>-1 && syxz[i].typeId == getTypeId("划痕") && isNum(insuTypes[j])){
                                                        //划痕
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.HuaHen = parseInt( getNum(insuTypes[j]));
                                                        syxz[i].coverage =parseInt( getNum(insuTypes[j]));


                                                    }else if(insuTypes[j].indexOf("玻璃")>-1 && syxz[i].typeId == getTypeId("玻璃") && isNum(insuTypes[j])){
                                                        //玻璃
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.BoLi = parseInt( getNum(insuTypes[j]));
                                                        syxz[i].coverage =parseInt( getNum(insuTypes[j]));


                                                    }else if(insuTypes[j].indexOf("司机")>-1 && syxz[i].typeId == getTypeId("司机") && isNum(insuTypes[j])){
                                                        //司机
                                                        syxz[i].checkStatus = true;
                                                        syxz[i].coverage = getNum(insuTypes[j]);
                                                        $scope.bihubaojia.SiJick = parseInt( getNum(insuTypes[j]));

                                                    }else if(insuTypes[j].indexOf("乘客")>-1 && syxz[i].typeId == getTypeId("乘客") && isNum(insuTypes[j])){
                                                        //乘客
                                                        syxz[i].checkStatus = true;
                                                        syxz[i].coverage = getNum(insuTypes[j]);
                                                        $scope.bihubaojia.ChengKe = parseInt( getNum(insuTypes[j]));
                                                    }else if(insuTypes[j].indexOf("指定")>-1 && syxz[i].typeId == getTypeId("指定") && isNum(insuTypes[j])){
                                                        //指定
                                                        syxz[i].checkStatus = true;
                                                        syxz[i].coverage = getNum(insuTypes[j]);
                                                        $scope.bihubaojia.hcXiuLiBuChang = parseInt( getNum(insuTypes[j]));
                                                    }
                                                }

                                            }
                                            $scope.newsingle.insuranceTypes.push(syxz[i]);
                                        }
                                    }
                                }else {
                                    for (var j = 0; j < $scope.insuranceCompNames[i].insuranceTypes.length; j++) {
                                        $scope.insuranceCompNames[i].insuranceTypes[j].coverage = null;
                                    }
                                }
                            }

                            $scope.newPolicymr_qk($scope.newsingle.carBrand, $scope.newsingle.vehicleModel);
                            $scope.bfhjjs_qk();
                        }
                        if(custInfo.insuranceCompLY == '人保' || custInfo.insuranceCompLY == '太平洋'
                            ||custInfo.insuranceCompLY == '人寿' ||custInfo.insuranceCompLY == '平安'){
                            $scope.getCarInsurances(custInfo);
                        }else{
                            //默认选中时可以直接修改值
                            $scope.checkMoren();
                            $("#msgwindow").hide();
                        }
                    }
                });
            };

            //报价
            $scope.new_bj = {};
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
                    { name: '险种', field: 'xz',width:150,cellFilter: 'mapBoLi',cellTooltip: true, enableColumnMenu: false},
                    { name: '报价人', field: 'bjr',width:70,enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,enableColumnMenu: false,cellTooltip: true},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //查询潜客报价记录
            $scope.findListCustomerBJRecode = function() {
                customerIWService.findListCustomerBJRecode($scope.customerId).then(function (result) {
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
                customerIWService.addCustomerBJRecode(customerBJRecode).then(function(res){
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
                customerIWService.findBxInfoForBH( $scope.customerId).then(function(result){
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
                $scope.footerBtn = "";
                $('#add_bj').hide();
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
                customerIWService.getModels(Data).then(function (result) {
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
            //报价
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
                var stRegisterDate = $scope.bihubaojia.RegisterDate;
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
               //保险报价关于“划痕险”的规则，人保3年后不能承保，平安、太平洋5年后不能承保，人寿  picc,pingan,cpic,lifeInsurance
                var myDate = Date.parse(new Date());
                //注册日期三年后的时间
                var zcDate3 = Date.parse(stRegisterDate) + 94694400000;
                //注册日期五年后的时间
                var zcDate5 = Date.parse(stRegisterDate) + 157852800000;
                var compNames = "";
                if($scope.bihubaojia.HuaHenck==1 ){
                    /*if(bxgs.insuranceCompName == '人保' && myDate > zcDate5){
                        compNames+="人保5年后不能承保'划痕险'，";
                    }*/
                    if(bxgs.insuranceCompName == '人寿' && myDate > zcDate3){
                        compNames+="人寿3年后不能承保'划痕险'，";
                    }
                    if(bxgs.insuranceCompName == '平安' && myDate > zcDate5){
                        compNames+="平安5年后不能承保'划痕险'，";
                    }
                    if(bxgs.insuranceCompName == '太平洋' && myDate > zcDate5){
                        compNames+="太平洋5年后不能承保'划痕险'，";
                    }
                    if(compNames!="" && compNames!=null){
                        $scope.angularTip(compNames, 5000);
                        return;
                    }
                }
                $("#msgwindow").show();
                if(bhinscomBol == 1){
                    customerIWService.bihuApplyBJ(quoteDatas).then(function(result){
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
                }
                else {
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
                    //insuranceKey
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
                //保险报价关于“划痕险”的规则，人保3年后不能承保，平安、太平洋5年后不能承保，人寿  picc,pingan,cpic,lifeInsurance
                var bxgs = insuranceCompanys.split(",");
                var myDate = Date.parse(new Date());
                //注册日期三年后的时间
                var zcDate3 = Date.parse(stRegisterDate) + 94694400000;
                //注册日期五年后的时间
                var zcDate5 = Date.parse(stRegisterDate) + 157852800000;
                var compNames = "";
                if($scope.bihubaojia.HuaHenck==1 ){
                    for (var i = 0; i < bxgs.length; i++) {
                        /*if (bxgs[i] == 'picc' && myDate > zcDate5) {
                            compNames = "人保5年后不能承保'划痕险'，";
                        }*/
                        if (bxgs[i] == 'lifeInsurance' && myDate > zcDate3) {
                            compNames += "人寿3年后不能承保'划痕险'，";
                        }
                        if (bxgs[i] == 'pingan' && myDate > zcDate5) {
                            compNames += "平安5年后不能承保'划痕险'，";
                        }
                        if (bxgs[i] == 'cpic' && myDate > zcDate5) {
                            compNames += "太平洋5年后不能承保'划痕险'，";
                        }
                    }
                    if (compNames != "" && compNames != null) {
                        $scope.angularTip(compNames, 5000);
                        return;
                    }
                }
                $("#msgwindow").show();
                if(bhinscomBol == 1){
                    customerIWService.applyBJFromBofide(args).then(function(result){
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
                }
                else {
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
                customerIWService.bihuSaveBJ(saveBj).then(function(result){
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

            //手动请求壁虎刷新潜客信息，修改潜客
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
                customerIWService.manual(condition).then(function (result) {
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

            //手动请求壁虎刷新潜客信息，新增潜客
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
                if(chassisNumber!=null&&chassisNumber!=''&&engineNumber!=null&&engineNumber!=''&&str2.test(engineNumber)){
                    cboo =  true;
                }
                if(cboo){
                    customerIWService.newCover(carLicenseNumber,chassisNumber,engineNumber,flag,certificateNumber).then(function (result) {
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

            //确认覆盖信息,修改
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
                    if($scope.genzcl.bhInsuranceEndDate != $filter('date')($scope.bhInfo.bhInsuranceEndDate,'yyyy-MM-dd')){
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
            }

            $scope.yanzheng = function(){
                var storeId = $rootScope.user.store.storeId;
                var chassisNumber = $scope.newqk.chassisNumber;
                if(chassisNumber==null||chassisNumber==''){
                    return;
                }
                var condition = {
                    storeId: storeId, chassisNumber: chassisNumber
                }
                customerIWService.yzChaNum(condition).then(function(result){
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.angularTip(result.results.message,2000);
                    }
                });
            }

            //取消睡眠
            $scope.saveCancelSleep = function(){
                var jqxrqEnd = $scope.genzcl.jqxrqEnd;
                $("#msgwindow").show();
                customerIWService.saveCancelSleep($scope.customerId,$scope.principalId,$scope.principal,jqxrqEnd)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            if($scope.pageType=='qkcx'){
                                if($scope.search.customerLevel && $scope.search.customerLevel=='S'){
                                    $scope.customerAllSearchPage.data.splice($scope.customerAllSearchPage.data.indexOf($scope.thisRowData), 1);
                                    $scope.policySearchCount = $scope.policySearchCount-1;
                                    $scope.thisRowData.customerLevel = "A";
                                    $scope.genzcl.customerLevel="A";
                                    $scope.customerLevel="A";
                                }else{
                                    $scope.thisRowData.customerLevel = "A";
                                    $scope.genzcl.customerLevel="A";
                                    $scope.customerLevel="A";
                                }
                            }
                            $scope.angularTip(result.results.message,5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
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
                customerIWService.findwxRecordByCondition($scope.condition)
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
                customerIWService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
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
                customerIWService.findByConditionTSX($scope.condition)
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
                customerIWService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
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
            //跟踪处理悬浮按钮
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
            };

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

            //正则匹配数字 ^[0-9]*$
            function getNum(str){

                var reg = /\d+(\.\d{1,2})?/g;
                var num = str.match(reg);
                if(num == null){
                    return 0;
                }else{
                    return num[0];
                }
            }

            //正则数字
            function isNum(str){
                var regexp = /^[0-9]*/g;
                return regexp.test(str)
            }
            //getTypeId
            function getTypeId (str){
                var x = 0;
                switch (str)  {
                    case "不计免":
                        x= 68;
                        break;
                    case "车损":
                        x=64;
                        break;
                    case "三者":
                        x= 65;
                        break;
                    case "盗抢":
                        x=66;
                        break;
                    case "司机":
                        x=67;
                        break;
                    case "乘客":
                        x=76;
                        break;
                    case "划痕":
                        x=69;
                        break;
                    case "玻璃":
                        x=70;
                        break;
                    case "自燃":
                        x=71;
                        break;
                    case "无法找到第三方":
                        x=72;
                        break;
                    case "涉水":
                        x=73;
                        break;
                    case "指定":
                        x=74;
                        break;
                    case "新增设备":
                        x=74;
                        break;
                    case "三责假日":
                        x=78;
                        break;

                }
                return x;
            }
            //getTypeName
            function getTypeName (str){
                var x ;
                switch (str)  {
                    case 68:
                        x= "不计免";
                        break;
                    case 64:
                        x="车损";
                        break;
                    case 65:
                        x= "三者";
                        break;
                    case 66:
                        x="盗抢";
                        break;
                    case 67:
                        x="司机";
                        break;
                    case 76:
                        x="乘客";
                        break;
                    case 69:
                        x="划痕";
                        break;
                    case 70:
                        x="玻璃";
                        break;
                    case 71:
                        x="自燃";
                        break;
                    case 72:
                        x="无法找到第三方";
                        break;
                    case 73:
                        x="涉水";
                        break;
                    case 74:
                        x="指定";
                        break;
                    case 74:
                        x="新增设备";
                        break;
                    case 78:
                        x="三责假日限额翻倍险";
                        break;

                }
                return x;
            }
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



            //获取出单信息  2018-05-23 luo xiao rong
            $scope.getCarInsurances = function(custInfo) {
                var insuranceCompName = custInfo.insuranceCompLY;
                if($scope.genzcl.insuranceCompLY){
                    insuranceCompName = $scope.genzcl.insuranceCompLY;
                }
                var carLicenseNumber = custInfo.carLicenseNumber;
                var chassisNumber =$scope.newsingle.chassisNumber;
                $scope.newsingle.insuranceCompName = insuranceCompName;
                if(typeof insuranceCompName == 'undefined' || insuranceCompName == '' || insuranceCompName == null){
                    //去年投保公司在上个页面取不到直接调用车架号查询
                    $("#msgwindow").hide();
                    return;
                }
                var bxId = '';
                if(insuranceCompName == '人保'){
                    bxId = 'picc';
                }else if(insuranceCompName == '平安'){
                    bxId = 'pingan';
                }else if(insuranceCompName == '太平洋'){
                    bxId = 'cpic';
                }else if(insuranceCompName == '人寿'){
                    bxId = 'lifeInsurance';
                }else{
                    // $scope.angularTip("暂不支持该保险公司,请选择别的保险公司",5000);
                    $("#msgwindow").hide();
                    return;
                }
                if((typeof carLicenseNumber == 'undefined' && typeof chassisNumber == 'undefined')
                    || (typeof carLicenseNumber == 'undefined' && chassisNumber == null)
                    || (typeof carLicenseNumber == 'undefined' && chassisNumber == '')
                    || (carLicenseNumber == null && typeof chassisNumber == 'undefined')
                    || (carLicenseNumber == null && chassisNumber == null)
                    || (carLicenseNumber == null && chassisNumber == '')
                    || (carLicenseNumber == '' && typeof chassisNumber == 'undefined')
                    || (carLicenseNumber == '' && chassisNumber == null)
                    || (carLicenseNumber == '' && chassisNumber == '')){
                    $scope.angularTip("请输入车牌号或车架号",5000);
                    return;
                }

                var condition = {vehicleLicenceCode:carLicenseNumber,vehicleFrameNo:chassisNumber,bxId:bxId};
                policyIWService.getCarInsuranceInfo(condition).then(function(res){

                    $("#msgwindow").hide();
                    if(res.status == 'OK'){
                        var result = res.results.content.results;
                        console.log("获取保单成功返回信息："+JSON.stringify(result));
                        if(result && result != null && result != ''){
                            // 总保费
                            if(result.totalPremium){
                                $scope.newsingle.premiumCount = result.totalPremium;
                            }
                            if(result.vehicleTarget){
                                //如果车牌号没填,查出来就自动填上
                                if(typeof carLicenseNumber == 'undefined' || carLicenseNumber == '' || carLicenseNumber == null){
                                    $scope.newsingle.carLicenseNumber = result.vehicleTarget.plateNo;
                                }

                                var modelType = result.vehicleTarget.modelType;
                                if(modelType && modelType != null && modelType != ''){
                                    //判断品牌型号是否带有空格,比如:"雷克萨斯LEXUS RX450H越野车",需要根据空格拆分,获取品牌(前者)和型号(后者)
                                    if(modelType.indexOf(" ") >=0){
                                        var modelTypeArray = modelType.split(" ");
                                        $scope.newPolicymr(modelTypeArray[0],modelTypeArray[1]);
                                    }
                                }
                                //如果车架号没填,查出来就自动填上
                                if(typeof chassisNumber == 'undefined' || chassisNumber == '' || chassisNumber == null){
                                    $scope.newsingle.chassisNumber = result.vehicleTarget.carVIN;
                                    $scope.getInfoByChassisNumber(0);
                                }
                                if(result.vehicleTarget.engineNo){
                                    $scope.newsingle.engineNumber = result.vehicleTarget.engineNo;
                                }
                                if(result.vehicleTarget.stRegisterDate){
                                    $scope.newsingle.registrationDate = result.vehicleTarget.stRegisterDate;
                                }
                            }
                            if(result.commercialInsuransVo){
                                $scope.newsingle.binsuranceCoverage = result.commercialInsuransVo.premium
                                && result.commercialInsuransVo.premium !='' ? parseFloat(result.commercialInsuransVo.premium) : 0;
                                if(result.commercialInsuransVo.stStartDate
                                    && result.commercialInsuransVo.stStartDate != ''
                                    && result.commercialInsuransVo.stStartDate != null){
                                    if(result.commercialInsuransVo.stStartDate.length == 10){
                                        result.commercialInsuransVo.stStartDate = result.commercialInsuransVo.stStartDate + " 00:00:00";
                                    }
                                    $scope.newsingle.syxrqStart = new Date(result.commercialInsuransVo.stStartDate);
                                }
                                if(result.commercialInsuransVo.stEndDate
                                    && result.commercialInsuransVo.stEndDate != ''
                                    && result.commercialInsuransVo.stEndDate != null){
                                    if(result.commercialInsuransVo.stEndDate.length == 10){
                                        result.commercialInsuransVo.stEndDate = result.commercialInsuransVo.stEndDate + " 23:59:59";
                                    }
                                }
                                //商业险保单号
                                if(result.commercialInsuransVo.insuranceQueryCode){
                                    $scope.newsingle.binsuranceNumber = result.commercialInsuransVo.insuranceQueryCode;
                                }
                                $scope.newsingle.syxrqEnd = result.commercialInsuransVo.stEndDate;
                                //获取到的商业险险种信息
                                var syxArrays = result.commercialInsuransVo.quoteInsuranceVos;

                                //保险公司
                                for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                    if ($scope.insuranceCompNames[i].insuranceCompName == insuranceCompName) {
                                        if ($scope.newsingle.insuranceCompName) {
                                            //该保险公司的所有商业险种
                                            var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                                            $scope.newsingle.insuranceTypes = [];
                                            for (var i = 0; i < syxz.length; i++) {
                                                syxz[i].checkStatus=false;
                                                syxz[i].coverage = null;
                                                for (var j = 0; j < syxArrays.length; j++) {
                                                    if((syxz[i].typeName == '车损' && syxArrays[j].insuranceCode == '01')
                                                        || (syxz[i].typeName == '盗抢' && syxArrays[j].insuranceCode == '05')
                                                        || (syxz[i].typeName == '玻璃' && syxArrays[j].insuranceCode == '06')
                                                        || (syxz[i].typeName == '自燃' && syxArrays[j].insuranceCode == '07')
                                                        || (syxz[i].typeName == '无法找到第三方' && syxArrays[j].insuranceCode == '14')
                                                        || (syxz[i].typeName == '涉水' && syxArrays[j].insuranceCode == '09')
                                                        || (syxz[i].typeName == '指定特约店维修险' && syxArrays[j].insuranceCode == '13')
                                                        || (syxz[i].typeName == '新增设备' && syxArrays[j].insuranceCode == '15')){
                                                        syxz[i].checkStatus = true;
                                                        //如果投保了玻璃险
                                                        if(syxz[i].typeName == '玻璃' && syxArrays[j].insuranceCode == '06' ){
                                                            //默认为国产
                                                            $scope.bihubaojia.BoLi = 1;
                                                            if(syxArrays[j].producingArea && syxArrays[j].producingArea != ''){
                                                                //博福玻璃产地为 0：国产、1：进口   （bip页面2代表进口）
                                                                if(parseFloat(syxArrays[j].amount) == 1){
                                                                    $scope.bihubaojia.BoLi = 2;
                                                                }
                                                            }

                                                        }
                                                    }else if(syxz[i].typeName == '三者' && syxArrays[j].insuranceCode == '02'){
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.SanZhe = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                    }else if(syxz[i].typeName == '车上人员司机' && syxArrays[j].insuranceCode == '03'){
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.SiJick = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                    }else if(syxz[i].typeName == '车上人员乘客' && syxArrays[j].insuranceCode == '04'){
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.ChengKe = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                    }else if(syxz[i].typeName == '划痕' && syxArrays[j].insuranceCode == '08'){
                                                        syxz[i].checkStatus = true;
                                                        $scope.bihubaojia.HuaHen = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                    }else if(syxz[i].typeName == '不计免赔' && syxArrays[j].isDeductible && typeof syxArrays[j].isDeductible != 'undefined'){
                                                        syxz[i].checkStatus = true;
                                                        //只要发现买了任意一种不计免赔险种,不计免赔就勾上
                                                        break;
                                                    }

                                                }


                                                $scope.newsingle.insuranceTypes.push(syxz[i]);
                                            }
                                            console.log("2345:"+JSON.stringify($scope.newsingle.insuranceTypes));
                                        }
                                    }
                                }
                            }

                            //交强险信息
                            if(result.compulsoryInsuransVo){
                                $scope.newsingle.vehicleTax = result.compulsoryInsuransVo.taxAmount
                                && result.compulsoryInsuransVo.taxAmount !='' ? parseFloat(result.compulsoryInsuransVo.taxAmount) : 0;
                                $scope.newsingle.cinsuranceCoverage = result.compulsoryInsuransVo.cipremium
                                && result.compulsoryInsuransVo.cipremium !='' ? parseFloat(result.compulsoryInsuransVo.cipremium) : 0;

                                if(result.compulsoryInsuransVo.stStartDate
                                    && result.compulsoryInsuransVo.stStartDate != ''
                                    && result.compulsoryInsuransVo.stStartDate != null){
                                    if(result.compulsoryInsuransVo.stStartDate.length == 10){
                                        result.compulsoryInsuransVo.stStartDate = result.compulsoryInsuransVo.stStartDate + " 00:00:00";
                                    }
                                    $scope.newsingle.jqxrqStart = new Date(result.compulsoryInsuransVo.stStartDate);
                                }
                                if(result.compulsoryInsuransVo.stEndDate
                                    && result.compulsoryInsuransVo.stEndDate != ''
                                    && result.compulsoryInsuransVo.stEndDate != null){
                                    if(result.compulsoryInsuransVo.stEndDate.length == 10){
                                        result.compulsoryInsuransVo.stEndDate = result.compulsoryInsuransVo.stEndDate + " 23:59:59";
                                    }
                                }
                                //交险保单号
                                if(result.compulsoryInsuransVo.insuranceQueryCode){
                                    $scope.newsingle.cinsuranceNumber = result.compulsoryInsuransVo.insuranceQueryCode;
                                }
                                $scope.newsingle.jqxrqEnd = result.compulsoryInsuransVo.stEndDate;
                            }

                            if(result.ownerInfo){
                                $scope.newsingle.carOwner = result.ownerInfo.ownerName;
                                if(result.ownerInfo.ownerProp == '1'){
                                    $scope.newsingle.customerCharacter = '个人';
                                }else if(result.ownerInfo.ownerProp == '2'){
                                    $scope.newsingle.customerCharacter = '机关';
                                }else if(result.ownerInfo.ownerProp == '3'){
                                    $scope.newsingle.customerCharacter = '企业';
                                }
                            }
                            if(result.insurantInfo){
                                $scope.newsingle.insured = res.results.content.results.insurantInfo.insurantName;
                                $scope.newsingle.certificateNumber = res.results.content.results.insurantInfo.insurantNo;
                            }
                            $scope.bfhjjs();
                        }
                        $scope.angularTip("获取保单信息成功，请核实是否为最新信息",5000);
                    }else{
                        $scope.angularTip("获取保单信息失败，请手动录入保单",5000);
                    }
                    //默认选中时可以直接修改值
                    $scope.checkMoren();
                });
            }
            //默认选中时可以直接修改值
            $scope.checkMoren = function(){
                var insuranceTypes = $scope.newsingle.insuranceTypes;
                if(insuranceTypes!= undefined && insuranceTypes!= null && insuranceTypes.length>0){
                    for(var j=0 ; j<insuranceTypes.length; j++){
                        insuranceTypes[j].typeId ==64 && insuranceTypes[j].checkStatus ?  $('#chesun').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==64 && !insuranceTypes[j].checkStatus ?  $('#chesun').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==65 && insuranceTypes[j].checkStatus ?  $('#sanzhe').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==65 && !insuranceTypes[j].checkStatus ?  $('#sanzhe').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==67 && insuranceTypes[j].checkStatus ?  $('#siji').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==67 && !insuranceTypes[j].checkStatus ?  $('#siji').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==76 && insuranceTypes[j].checkStatus ?  $('#chengke').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==76 && !insuranceTypes[j].checkStatus ?  $('#chengke').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==69 && insuranceTypes[j].checkStatus ?  $('#huahen').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==69 && !insuranceTypes[j].checkStatus ?  $('#huahen').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==70 && insuranceTypes[j].checkStatus ?  $('#boli').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==70 && !insuranceTypes[j].checkStatus ?  $('#boli').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==79 && insuranceTypes[j].checkStatus ?  $('#huowu').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==79 && !insuranceTypes[j].checkStatus ?  $('#huowu').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==77 && insuranceTypes[j].checkStatus ?  $('#jingshen').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==77 && !insuranceTypes[j].checkStatus ?  $('#jingshen').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==80 && insuranceTypes[j].checkStatus ?  $('#feiyong').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==80 && !insuranceTypes[j].checkStatus ?  $('#feiyong').attr("disabled",true) : "";

                        insuranceTypes[j].typeId ==74 && insuranceTypes[j].checkStatus ?  $('#zhiding').attr("disabled",false) : "";
                        insuranceTypes[j].typeId ==74 && !insuranceTypes[j].checkStatus ?  $('#zhiding').attr("disabled",true) : "";
                    }
                }
            }
            //新增保单品牌与车型默认值
            $scope.newPolicymr = function (carBrand,vehicleModel){
                var sfyy = 0 ;
                $scope.carBrandsXBD = [];
                $scope.carBrandsXBD = $.extend(true, [], $scope.carBrands);
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName){
                        sfyy = 1;
                    }else if(carBrand==null||carBrand==''){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        return;
                    }
                }
                if(sfyy==0){
                    $scope.carBrandsXBD.push({brandName:carBrand})
                }
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==0){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.carBrandsXBD[i].carModelList=[{modelName:vehicleModel}];
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.newsingle.vehicleModel = $scope.newsingle.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsXBD[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_xbd").show();
                        $("#clxhxz_xbd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.newsingle.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==1){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        for(var j = 0 ;j<$scope.newsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.newsingle.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsXBD[i].carModelList.push({modelName:vehicleModel});
                            $scope.newsingle.carBrand = $scope.carBrandsXBD[i];
                        }
                        for(var j = 0 ;j<$scope.newsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.newsingle.carBrand.carModelList[j].modelName){
                                $scope.newsingle.vehicleModel = $scope.newsingle.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }
            //关闭窗口时清空保单明细数据
            $scope.cleanSingleDetails = function(){
                $scope.searchsingle ={};
                $scope.bihubaojia.CheSun = "";
                $scope.bihubaojia.SanZhe = "";
                $scope.bihubaojia.SiJick = "";
                $scope.bihubaojia.ChengKe = "";
                $scope.bihubaojia.HuaHen = "";
                $scope.bihubaojia.BoLi = "";
                $scope.bihubaojia.HcHuoWuZeRen = "";
                $scope.bihubaojia.HcJingShenSunShi = "";
                $scope.bihubaojia.hcFeiYongBuChang = "";
                $scope.bihubaojia.hcXiuLiBuChang = "";
            }
        }

    ]);

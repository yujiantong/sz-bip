'use strict';
angular.module('myApp')
    .controller('customerDA_Controller',['$rootScope','$scope','$filter','customerDAService','$state',
        function($rootScope,$scope,$filter,customerDAService,$state){
            //数据分析员
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.customerAll = [];
            $scope.customerInvited = [];
            $scope.customerAllSearch = [];
            $scope.startNum = 1;//初始化页数
            $scope.showAll = false;//是否全部显示
            $scope.customerIndex= 1;//初始化下标
            $scope.customerInvitedIndex = 1;//初始化下标
            $scope.customerSearchIndex= 1;//初始化下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.approvalStatu = '3,7';//待审批，包括待回退和待延期
            $scope.qkSearch = {}; //潜客条件查询
            $scope.search = {};  //多条件查询
            $scope.newPrincipal = {};  //新负责人
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            $scope.customerId = 0;
            $scope.condition = {}; //查询条件
            $scope.conditionSearch = {};  //潜客查询里的条件
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
                    height:$("#myTabContent").height()-160
                };
                $scope.gridboxTj = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-45
                }
            },200);

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
                }else{
                    $("#yaoyue").addClass("in active");
                }
                $scope.getShowAll();

            });

            //下拉列表数据初始化
            $scope.coverTypes = [{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            $scope.loan = [{id:1,vlaue:'是'},{id:2,vlaue:'否'}];
            $scope.privilegePros = ['现金','套餐','现金+套餐','其他'];
            $scope.customerLevels = ['A','B','C','D'];
            $scope.customerLevelsSearch = ['A','B','C','D','F','O','S'];
            $scope.lostInsurDays = [
                {range : "0—7", value : 1},
                {range : "8—30", value : 2},
                {range : "31—60", value : 3},
                {range : "61—90", value : 4},
                {range : "90+", value : 5}
            ]; /*将脱保天数范围查询*/

            //按4s店ID查询车辆品牌车型信息
            customerDAService.findCarInfoByStoreId().then(function(res){
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
            customerDAService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            customerDAService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });
            //查询建档人
            customerDAService.selectUserForJdrDataSource().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.createUser = res.results.content.result;
                }else{

                }
            });
            //查询持有人列表
            customerDAService.selectUserForHolderSearch().then(function(res){
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
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_statu(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_statu" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_statu" class=""></span></div>'},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_statu" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_statu" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_statu" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_statu" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_statu" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_statu" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_statu" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_statu" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_statu" class=""></span></div>'},
                    { name: '延期到期日', field: 'customerAssigns[0].delayDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(16)">延期到期日&nbsp;&nbsp;&nbsp;<span id="delayDate_statu" class=""></span></div>'},
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_yyjl(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_yyjl" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_yyjl" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_yyjl" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_yyjl" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_yyjl(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_yyjl" class=""></span></div>'},
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
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk" class=""></span></div>'},
                    { name: '联系人', field: 'contact', width:60,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:70, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompLY', width:70,enableColumnMenu: false},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd" class=""></span></div>'},
                    { name: '最低折扣', field: 'zdZheKou', width:60,enableColumnMenu: false},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel" class=""></span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult" class=""></span></div>'},
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

            //禁用或取消禁用用户操作
            $scope.forbiddenOrRegain = function(obj){
                if(obj.userStatus != 2){
                    $scope.userStatusName = "禁用";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        $("#msgwindow").show();
                        customerDAService.pauseOrForbidden(obj.userId,2).then(function(res){
                            $("#msgwindow").hide();
                            if(res.status == 'OK'){
                                $scope.angularTip("禁用成功",5000);
                                obj.userStatus = 2;
                            }else{
                                $scope.angularTip("禁用失败",5000);
                            }
                        });
                    };
                }else if(obj.userStatus == 2){
                    $scope.userStatusName = "取消禁用";
                    $("#pause").show();
                    $scope.makeSure = function() {
                        $("#pause").hide();
                        customerDAService.pauseOrForbidden(obj.userId,0).then(function(res){
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
                        customerDAService.pauseOrForbidden(obj.userId,1).then(function(res){
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
                        customerDAService.pauseOrForbidden(obj.userId,0).then(function(res){
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
                    { name: '序号', field: 'index',type:'number',  enableColumnMenu: false},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    { name: '生成潜客数', field: 'generateCount',type:'number',width: 80,enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',type:'number',enableColumnMenu: false},
                    { name: '将脱保', field: 'jtbCount',type:'number', enableColumnMenu: false},
                    { name: '已脱保', field: 'ytbCount',type:'number', enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '延期',field: 'delayCount',type:'number',cellTooltip: true,enableColumnMenu: false,},
                    { name: '回退', field: 'returnCount',type:'number', enableColumnMenu: false},
                    { name: '激活', field: 'awakenCount',type:'number',enableColumnMenu: false},
                    { name: '失销', field: 'lostCount', type:'number',enableColumnMenu: false},
                    { name: '睡眠', field: 'sleepCount', type:'number',enableColumnMenu: false},
                    { name: '出单', field: 'billCount',type:'number',enableColumnMenu: false},
                    { name: '暂停',cellClass:'girdDeleteimg',
                        cellTemplate: '<div>' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" />' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" />' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false},
                    { name: '禁用',cellClass:'girdDeleteimg',
                        cellTemplate:'<div>' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" />' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" />' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.findInsuranceStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("结束时间:");
                $scope.pageType = pageType;
                $scope.insuranceStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerDAService.findInsuranceStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuranceStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.insuranceStatisticsAll.length;i++){
                            $scope.insuranceStatisticsAll[i].index = i+1;
                            $scope.insuranceStatisticsAllPage.data.push($scope.insuranceStatisticsAll[i])
                        }
                    }
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
                        cellTemplate: '<div>' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" />' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" />' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false},
                    { name: '禁用',cellClass:'girdDeleteimg',
                        cellTemplate:'<div>' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" />' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" />' +
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
                $("#yyjs").html("结束时间:");
                $scope.pageType = pageType;
                $scope.saleStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerDAService.findSaleStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.saleStatisticsAll = result.results.content.results;
                        for(var i=0;i<$scope.saleStatisticsAll.length;i++){
                            $scope.saleStatisticsAll[i].index = i+1;
                            $scope.saleStatisticsAllPage.data.push($scope.saleStatisticsAll[i])
                        }
                    }
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
                    { name:'序号',field: 'index',type:'number',  enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '全部潜客', field: 'allCustomer',type:'number',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',type:'number',enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceCount',type:'number',enableColumnMenu: false},
                    { name: '经理转出', field: 'moveOutCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '经理转入', field: 'moveIntoCount',type:'number',enableColumnMenu: false,cellTooltip: true},
                    { name: '回退', field: 'returnCount',type:'number', enableColumnMenu: false},
                    { name: '出单', field: 'billCount',type:'number',enableColumnMenu: false},
                    { name: '暂停',cellClass:'girdDeleteimg',
                        cellTemplate: '<div>' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" />' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png" />' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false},
                    { name: '禁用',cellClass:'girdDeleteimg',
                        cellTemplate:'<div>' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png" />' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png" />' +
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
                $("#yyjs").html("结束时间:");
                $scope.pageType = pageType;
                $scope.serviceStatisticsAllPage.data = [];
                $("#msgwindow").show();
                customerDAService.findServiceStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
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
                        cellTemplate: '<div>' +
                        '<img ng-if="row.entity.userStatus==0" src="../../images/enable.png" />' +
                        '<img ng-if="row.entity.userStatus==1 || row.entity.userStatus==2" src="../../images/enable2.png"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: '禁用',cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div>' +
                        '<img ng-if="row.entity.userStatus==0 || row.entity.userStatus==1" src="../../images/enablered.png"/>' +
                        '<img ng-if="row.entity.userStatus==2" src="../../images/enablered2.png"/>' +
                        '</div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.findkefu = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("结束时间:");
                $scope.pageType = pageType;
                $scope.kefuAllPage.data = [];
                $("#msgwindow").show();
                customerDAService.findCSCStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
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
            $scope.findIWStatistics = function(pageType){
                $scope.rightTitleTimeToolShow();
                $("#yyks").html("开始时间:");
                $("#yyjs").html("结束时间:");
                $scope.pageType = pageType;
                $scope.insuranceWriterAllPage.data = [];
                $("#msgwindow").show();
                customerDAService.findIWStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
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
                    }
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
                }else{
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
                    if($scope.pageType == 'jh'){
                        $("#yyks").html("唤醒时间:");
                        $("#yyjs").html("--");
                    }else{
                        $("#yyks").html("开始时间:");
                        $("#yyjs").html("结束时间:");
                    }
                }
                $scope.loadingPage();
            };

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
                        $scope.findByTraceStatu('gz',$scope.pageStatus) //跟踪
                    }else if($scope.pageType=='js'){
                        $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                    }else if($scope.pageType=='tb'){
                        $scope.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                    }else if($scope.pageType=='yyjl'){
                        $scope.findInviteStatuDA('yyjl',$scope.pageStatus);//邀约记录
                    }else if($scope.pageType=='ht'){
                        $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                    }else if($scope.pageType=='dsp'){
                        $scope.findByApprovalStatu('dsp',$scope.approvalStatu)//待审批
                    }else if($scope.pageType=='bxtj'){
                        $scope.findInsuranceStatistics('bxtj');
                    }else if($scope.pageType=='xstj'){
                        $scope.findSaleStatistics('xstj');
                    }else if($scope.pageType=='shtj'){
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
                    $scope.findByTraceStatu('gz',$scope.pageStatus) //跟踪
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='tb'){
                    $scope.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                }else if($scope.pageType=='yyjl'){
                    $scope.findInviteStatuDA('yyjl',$scope.pageStatus);//邀约记录
                }else if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='dsp'){
                    $scope.findByApprovalStatu('dsp',$scope.approvalStatu)//待审批
                }else if($scope.pageType=='qkcx'){
                    $scope.findByCondition();
                }else if ($scope.pageType == 'jh'){
                    $scope.findActivateCustomer('jh',$scope.pageStatus);//已唤醒
                }else if ($scope.pageType == 'yjh'){
                    $scope.findByJiHuo('yjh',$scope.pageStatus);//已激活
                }else if($scope.pageType=='ddwcd'){
                    $scope.findDdwcdCus($scope.pageType,$scope.pageStatus);//到店未出单
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
                    this.findByTraceStatu('gz',$scope.pageStatus) //跟踪
                }else if($scope.pageType=='js'){
                    this.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='tb'){
                    this.findByCusLostInsurStatu('tb',$scope.pageStatus)//保单日期(脱保)
                }else if($scope.pageType=='yyjl'){
                    this.findInviteStatuDA('yyjl',$scope.pageStatus);//邀约记录
                }else if($scope.pageType=='ht'){
                    this.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='dsp'){
                    this.findByApprovalStatu('dsp',$scope.approvalStatu)//待审批
                }else if($scope.pageType=='bxtj'){
                    this.findInsuranceStatistics('bxtj');
                }else if($scope.pageType=='xstj'){
                    this.findSaleStatistics('xstj');
                }else if($scope.pageType=='shtj'){
                    this.findServiceStatistics('shtj');
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
                customerDAService.findByTraceStatu($scope.condition)
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
                customerDAService.findByCusLostInsurStatu($scope.condition)
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
                this.findInviteStatuDA('yyjl',$scope.pageStatus);//邀约记录
            };
            //查询潜客邀约记录
            $scope.findInviteStatuDA = function(pageType,inviteStatu){
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
                customerDAService.findInviteStatuDA($scope.condition)
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
                    $scope.condition = {
                        short:short,shortmain:shortmain,
                        acceptStatu: acceptStatu, startNum: $scope.startNum,
                        renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                        contactWay: contactWay, carLicenseNumber: carLicenseNumber
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerDAService.findByAcceptStatu($scope.condition)
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
                var operatorID = $scope.qkSearch.operatorID;
                $scope.pageType = pageType;
                $scope.pageStatus = returnStatu;
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, returnStatu: returnStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu: returnStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber,operatorID:operatorID
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                if(returnStatu==2){
                    customerDAService.findByYiHuiTui($scope.condition)
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
                    customerDAService.findByReturnStatu($scope.condition)
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
                $scope.pageType = pageType;
                $scope.approvalStatu = '3,7';
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, approvalStatu: $scope.approvalStatu,
                            startNum: $scope.startNum, renewalType: renewalType, holder: holder, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            approvalStatu: $scope.approvalStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerDAService.findByApprovalStatu($scope.condition)
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
                    if ($scope.showAll == false) {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            startTime: $scope.startTime, endTime: $scope.endTime, returnStatu: returnStatu,
                            startNum: $scope.startNum, renewalType: renewalType, chassisNumber: chassisNumber,
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu: returnStatu, startNum: $scope.startNum,
                            renewalType: renewalType, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerDAService.findActivateCustomer($scope.condition)
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
                customerDAService.findByJiHuo($scope.condition)
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
                customerDAService.findDdwcdCus($scope.condition)
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
                }else {
                    $scope.startNumSearch = $scope.startNumSearch + 1;
                };
                if($scope.startNumSearch == 1) {
                    $scope.conditionSearch = {
                        short:short,shortmain:shortmain,
                        startNum:$scope.startNumSearch,fourSStoreId:fourSStoreId,
                        carBrand: carBrand, vehicleModel: vehicleModel,chassisNumber: chassisNumber,
                        carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                        contactWay: contactWay,contactWayReserve:contactWayReserve, insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
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
                        traceEndTime: traceEndTime,zdZheKouStart:zdZheKouStart,zdZheKouEnd:zdZheKouEnd,carOwner:carOwner,holder:holder,
                        remainLostInsurDayStart:remainLostInsurDayStart,remainLostInsurDayEnd:remainLostInsurDayEnd,
                        sfgyx:sfgyx,ifLoan:ifLoan,registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                        createTimeStart:createTimeStart,createTimeEnd:createTimeEnd,createrId:createrId,defeatFlag:defeatFlag
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
                }else if(createTimeStart != null && createTimeEnd != null && createTimeStart != "" && createTimeEnd != "" && createTimeStart>createTimeEnd){
                    $scope.angularTip("建档时间开始日期不能大于结束日期！",5000)
                }else if(syxrqDateStart != null && syxrqDateEnd != null && syxrqDateStart != "" && syxrqDateEnd != "" && syxrqDateStart>syxrqDateEnd){
                    $scope.angularTip("商业到期开始日期不能大于结束日期！",5000)
                }else {
                    $("#msgwindow").show();
                    customerDAService.findByCondition($scope.conditionSearch).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.result.content.status == 'OK') {
                            $scope.customerAllSearch = result.result.content.result;
                            $scope.policySearchCount = result.result.content.policyCount;
                            $scope.getPolicyPage();
                        } else {
                            $scope.angularTip(result.result.message,5000)
                        }

                    });
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
                    { name: '持有天数', field: 'cyts',width:80,enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false},
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //按潜客ID查询潜客信息及跟踪记录
            $scope.findByCustomerId=function(customer){
                $scope.customer = customer;
                $scope.chassisNumber = customer.chassisNumber;
                $scope.customerId = customer.customerId;
                $scope.principalId = customer.principalId;
                $scope.clerkId = customer.clerkId;
                $("#msgwindow").show();
                customerDAService.findByCustomerId( $scope.customerId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $("#genzcl").show();
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $("#gz_tab").children("li").removeClass("active");
                        $("#gz_tab_grid").children(".tab-pane").removeClass("in active");
                        $("#gzjl_tab").addClass("active");
                        $("#genzong").addClass("in active");
                        $scope.custInfo = result.results.content.results;
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
                customerDAService.findListCustomerBJRecode($scope.customerId).then(function (result) {
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
                customerDAService.findApprovalBillRecordList($scope.chassisNumber).then(function (result) {
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
                customerDAService.findwxRecordByCondition($scope.condition)
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
                customerDAService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
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
                customerDAService.findByConditionTSX($scope.condition)
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
                customerDAService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
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

            //查询目录展开更多的按钮s
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

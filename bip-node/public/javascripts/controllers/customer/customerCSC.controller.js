'use strict';
angular.module('myApp')
    .controller('customerCSC_Controller',['$rootScope','$scope','$filter','customerCSCService','$state','checkService',
        function($rootScope,$scope,$filter,customerCSCService,$state,checkService){
            //客服专员
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            $scope.bangStatu = $rootScope.user.store.bangStatu; //是否和bsp店绑定
            $scope.pageType = 'kefu'; //页面状态，用于判断页面的类型
            $scope.customerAll = [];
            $scope.customerAllSearch = [];
            $scope.confirmData = {};
            $scope.startNum = 1;//初始化页数
            $scope.showAll = false;//是否全部显示
            $scope.customerIndex= 1;//初始化下标
            $scope.customerDsxIndex= 1;//初始化下标
            $scope.customerNoReceivedIndex = 1;
            $scope.customerDefeatIndex = 1;//销售战败潜客
            $scope.customerGeneratedIndex = 1;//生成的潜客
            $scope.customerSearchIndex= 1;//初始化下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            $scope.qkSearch = {}; //潜客条件查询
            $scope.search = {}; //多条件查询
            $scope.newTrace = {}; //新跟踪记录
            $scope.newqk = {}; //新增潜客
            $scope.exhibitionDefeat = {}; //销售战败潜客
            $scope.customerId = 0;
            $scope.condition = {}; //查询条件
            $scope.conditionSearch = {};  //潜客查询里的条件
            var short=0;//全局排序（按某字段排序）
            var shortmain=0;//全局排序（1：升序2：降序）
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month=myDate.getMonth()+1;
            month =(month<10 ? "0"+month:month);
            $scope.startTime = year+"-"+month+"-01";//初始化为今天日期
            $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd'); //初始化为今天日期
            $scope.lockLevel = $rootScope.user.store.lockLevel;//是否锁死潜客级别

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
                $scope.gridboxTj = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-40
                }
                $scope.gridboxZb = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-70
                }
            },100);

            //接收父级传过的参数
            $scope.$on('pageStatus', function(e, pageTypeStatus) {
                $scope.showAll = pageTypeStatus.goShowAll;
                $scope.pageTypeStatus = pageTypeStatus;
                $scope.pageType = pageTypeStatus.pageTypeStatus||'qkcx';
                $scope.pageStatus = pageTypeStatus.pageStatus;
                var id_key = '#'+pageTypeStatus.pageTypeStatus + pageTypeStatus.pageStatus;
                $("#myTab").children("li").removeClass("active");
                $("#myTabContent").children(".tab-pane").removeClass("in active");
                $(id_key).addClass("active");
                if($scope.pageType=="qkcx"){
                    $("#chaxun").addClass("in active");
                    $scope.rightTitleTimeToolHide();
                }else if($scope.pageType=="js"){
                    $("#noReceived").addClass("in active");
                }else if($scope.pageType=="bspcx"){
                    $("#bspcx").addClass("in active");
                }else if($scope.pageType=='ht' && $scope.pageStatus==4){
                    $("#dsx").addClass("in active");
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

            //按4s店ID查询所有失销/回退原因
            $scope.reasonData = {storeId:$rootScope.user.store.storeId}
            $scope.sxyySelect = [];
            customerCSCService.findForSelectData($scope.reasonData).then(function (result) {
                if (result.status == 'OK') {
                    $scope.reasonAll = result.results.content.result;
                    for(var i=0;i<$scope.reasonAll.length;i++){
                        $scope.sxyySelect.push($scope.reasonAll[i].reason);
                    }
                } else {

                }
            });

            //按4s店ID查询车辆品牌车型信息
            customerCSCService.findCarInfoByStoreId().then(function(res){
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
            customerCSCService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            customerCSCService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_statu" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_statu" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_statu" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_statu" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_statu(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_statu" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
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
            $scope.customerDsxPage = {
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_dsx(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_dsx" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_dsx" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_dsx" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_dsx" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_dsx" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_dsx" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_dsx" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_dsx" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_dsx" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_dsx" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_dsx" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_dsx" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_dsx(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_dsx" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_dsx) {
                    gridApi_dsx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_dsx = gridApi_dsx;
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
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompLY', width:50,enableColumnMenu: false},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd" class=""></span></div>'},
                    { name: '最低折扣', field: 'zdZheKou', width:60,enableColumnMenu: false},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
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
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_wjs(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_wjs" class=""></span></div>'},
                    { name: '业务员', field: 'clerk', width:70,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_wjs" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber', width:100,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_wjs" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', width:70,enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_wjs" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName',width:80, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_wjs" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_wjs" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(11)">客户级别&nbsp;&nbsp;&nbsp;<span id="customerLevel_wjs" class=""></span></div>',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '应跟踪日期', field: 'willingTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(13)">应跟踪日期&nbsp;&nbsp;&nbsp;<span id="willingTraceDate_wjs" class=""></span></div>'},
                    { name: '末次跟踪日期', field: 'lastTraceDate',cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(14)">末次跟踪日期&nbsp;&nbsp;&nbsp;<span id="lastTraceDate_wjs" class=""></span></div>'},
                    { name: '末次跟踪结果', field: 'lastTraceResult',cellTooltip: true, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(15)">末次跟踪结果&nbsp;&nbsp;&nbsp;<span id="lastTraceResult_wjs" class=""></span></div>'},
                    { name: '将脱保(天)', field: 'remainLostInsurDay', width:80,enableColumnMenu: false,type:'number',headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(17)">将脱保(天)&nbsp;&nbsp;&nbsp;<span id="remainLostInsurDay_wjs" class=""></span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_wjs" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_wjs(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_wjs" class=""></span></div>'},
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

            /* bsp战败潜客列表*/
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
                    { name: '失销时间', enableColumnMenu: false,allowCellFocus:false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bspcx(6)">失销时间&nbsp;&nbsp;&nbsp;<span id="failureTime_bspcx" class=""></span></div>',
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span ng-bind="row.entity.failureTime"></span>'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByPage(row.entity)" class="btn btn-default btn-sm defeatqkPage">跟踪处理</button>'+
                        '</div></div>'
                    },
                ],
                onRegisterApi : function(defeatGridApi) {
                    defeatGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.defeatGridApi = defeatGridApi;
                }
            };

            //客服统计查询
            $scope.kefuAllPage = {};
            $scope.kefuAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号', cellTemplate: '<div class="ui-grid-cell-contents">{{$index+1}}</div>',enableColumnMenu: false,},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '失销', field: 'lostCount',enableColumnMenu: false},
                    { name: '睡眠', field: 'sleepCount',enableColumnMenu: false},
                    { name: '唤醒数', field: 'awakenCount',enableColumnMenu: false},
                    { name: '生成潜客数', field: 'generateCount',enableColumnMenu: false},
                    { name: '当期潜客', field: 'monthCustomer',enableColumnMenu: false},
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
                customerCSCService.findCSCUserStatistics($scope.startTime,$scope.endTime,$scope.showAll).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.kefuData = result.results.content.results;
                        $scope.kefuAllPage.data.push($scope.kefuData);
                    };
                });
            }
            /* bsp已生成的bip潜客*/
            $scope.customerGenerated = [];
            $scope.customerGeneratedPage = {
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
                    { name: '车架号', field: 'chassisNumber',cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_generated" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_generated" class=""></span></div>'},
                    { name: '投保类型', field: 'coverType.coverTypeName', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_generated" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_generated" class=""></span></div>'},
                    { name: '客户级别',enableColumnMenu: false,width:70,cellClass:'text-center',cellTemplate: '<div role="button">' +
                    '<span ng-class="{starbg:row.entity.sfgyx==1}" class="nostarbg">{{row.entity.customerLevel}}</span></div>'},
                    { name: '联系方式', field: 'contactWay',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_generated" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_generated(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_generated" class=""></span></div>'},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findByCustomerId(row.entity)" class="btn btn-default btn-sm genzcl">查看信息</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(GeneratedApi) {
                    GeneratedApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.GeneratedApi = GeneratedApi;
                }
            };

            //全局排序（bsp已生成的bip潜客）
            $scope.qjsort_generated = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==4){
                        $("#contact_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==5){
                        $("#contactWay_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class",""); $("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class",""); $("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_generated").attr("class","sort_desc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_generated").attr("class","sort_desc"), $("#bhInsuranceEndDate_generated").attr("class",""),$("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==4){
                        $("#contact_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==5){
                        $("#contactWay_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class",""); $("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class",""); $("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_generated").attr("class","sort_asc"),$("#customerLevel_generated").attr("class",""), $("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#bhInsuranceEndDate_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_generated").attr("class","sort_asc"), $("#bhInsuranceEndDate_generated").attr("class",""),$("#principal_generated").attr("class","");$("#clerk_generated").attr("class","");$("#contact_generated").attr("class","");$("#contactWay_generated").attr("class","");$("#chassisNumber_generated").attr("class","");
                        $("#carLicenseNumber_generated").attr("class","");$("#coverTypeName_generated").attr("class","");$("#jqxrqEnd_generated").attr("class","");
                        $("#willingTraceDate_generated").attr("class","");$("#gotThroughNum_generated").attr("class","");$("#lastTraceDate_generated").attr("class","");$("#lastTraceResult_generated").attr("class","");$("#delayDate_generated").attr("class","");
                        $("#remainLostInsurDay_generated").attr("class","");$("#cyts_generated").attr("class","");$("#holder_generated").attr("class","")
                    }
                }
                    this.findBspGeneratedCustomer('jiandang'); //销售战败线索
            };
            //bsp生成的潜客
            $scope.createrSearch = {};
            $scope.findBspGeneratedCustomer = function(pageType){
                $scope.rightTitleTimeToolHide();
                $scope.pageType = pageType;
                $scope.customerGenerated= [];
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var fourSStoreId = $rootScope.user.store.storeId;
                var renewalType = $scope.createrSearch.renewalType;
                var contact = $scope.createrSearch.contact;
                var contactWay = $scope.createrSearch.contactWay;
                var chassisNumber = $scope.createrSearch.chassisNumber;
                var carLicenseNumber = $scope.createrSearch.carLicenseNumber;
                $scope.resetPageData();
                $("#msgwindow").show();
                customerCSCService.findCustomerByCreater(short,shortmain,$scope.startNum,renewalType,chassisNumber,carLicenseNumber,contact,contactWay)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerGenerated =  result.results.content.results;
                            $scope.policyCount = result.results.content.policyCount
                            $scope.getPolicyPage();
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
            };

            $scope.clearSelectedRows = function() {
                $scope.gridApi_dsx.selection.clearSelectedRows();
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
                    $scope.customerNoReceivedIndex = 1;
                    $scope.customerDefeatIndex = 1;
                    $scope.customerGeneratedIndex = 1;
                    $scope.customerDsxIndex= 1;
                    $scope.customerAllPage.data = [];
                    $scope.customerNoReceivedPage.data = [];
                    $scope.customerDefeatPage.data = [];
                    $scope.customerGeneratedPage.data = [];
                    $scope.customerDsxPage.data = [];
                }
            }

            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                if($scope.pageType == 'qkcx'){
                    for(var i=0;i<$scope.customerAllSearch.length;i++){
                        $scope.customerAllSearch[i].index = $scope.customerSearchIndex;
                        $scope.customerAllSearchPage.data.push($scope.customerAllSearch[i])
                        $scope.customerSearchIndex = $scope.customerSearchIndex+1;
                    }
                }else if($scope.pageType == 'js'){
                    for(var i=0;i<$scope.customerNoReceived.length;i++){
                        $scope.customerNoReceived[i].index = $scope.customerNoReceivedIndex;
                        $scope.customerNoReceivedPage.data.push($scope.customerNoReceived[i]);
                        $scope.customerNoReceivedIndex = $scope.customerNoReceivedIndex+1;
                    }
                }else if($scope.pageType == 'bspcx'){
                    for(var i=0;i<$scope.customerDefeat.length;i++){
                        $scope.customerDefeat[i].index = $scope.customerDefeatIndex;
                        $scope.customerDefeatPage.data.push($scope.customerDefeat[i]);
                        $scope.customerDefeatIndex = $scope.customerDefeatIndex+1;
                    };
                    $("#yyks").html("失销开始时间:");
                    $("#yyjs").html("失销结束时间:");
                }else if($scope.pageType == 'jiandang'){
                    for(var i=0;i<$scope.customerGenerated.length;i++){
                        $scope.customerGenerated[i].index = $scope.customerGeneratedIndex;
                        $scope.customerGeneratedPage.data.push($scope.customerGenerated[i]);
                        $scope.customerGeneratedIndex = $scope.customerGeneratedIndex+1;
                    }
                }else if($scope.pageType=='ht'&& $scope.pageStatus==4){
                    for(var i=0;i<$scope.customerAll.length;i++){
                        $scope.customerAll[i].index = $scope.customerDsxIndex;
                        $scope.customerDsxPage.data.push($scope.customerAll[i])
                        $scope.customerDsxIndex = $scope.customerDsxIndex+1;
                    };
                    $("#yyks").html("开始时间:");
                    $("#yyjs").html("结束时间:");
                }else{
                    for(var i=0;i<$scope.customerAll.length;i++){
                        $scope.customerAll[i].index = $scope.customerIndex;
                        $scope.customerAllPage.data.push($scope.customerAll[i])
                        $scope.customerIndex = $scope.customerIndex+1;
                    };
                    $("#yyks").html("开始时间:");
                    $("#yyjs").html("结束时间:");
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
                }else if($scope.pageType == 'bspcx'){
                    if($scope.customerDefeatPage.data.length>=$scope.policyCount ||$scope.customerDefeat.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.defeatGridApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.defeatGridApi.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType == 'jiandang'){
                    if($scope.customerGeneratedPage.data.length>=$scope.policyCount ||$scope.customerGenerated.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.GeneratedApi.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.GeneratedApi.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType=='ht' && $scope.pageStatus==4){
                    if($scope.customerDsxPage.data.length>=$scope.policyCount ||$scope.customerDsxPage.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApi_dsx.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApi_dsx.infiniteScroll.dataLoaded(false, true)
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

            $scope.randomSize = function () {
                var newHeight = $("#myTabContent").height()-70;
                var newWidth = $("#myTabContent").width()-2;
                angular.element(document.getElementsByClassName('gridbox')[0]).css('height', newHeight + 'px');
                angular.element(document.getElementsByClassName('gridbox')[0]).css('width', newWidth + 'px');
            };

            //点击时间区间查询
            $scope.getSearchByTime = function (){
                $scope.resetTime = false;
                var re_data=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                if(!(re_data.test($scope.startTime)) || !(re_data.test($scope.endTime))){
                    $scope.resetTime = true;
                    return;
                }else if ($scope.startTime <= $scope.endTime){
                    $("#tipAlert").hide();
                    if($scope.pageType=='ht'){
                        $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                    }else if($scope.pageType=='js'){
                        $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                    }else if($scope.pageType=='bspcx'){
                        $scope.findBspDefeatCustomer('bspcx') //bsp战败潜客
                    }else if($scope.pageType=='kefu'){
                        $scope.findkefu('kefu');
                    }else if($scope.pageType=='jiandang'){
                        $scope.findBspGeneratedCustomer('jiandang');
                    }
                }else {
                    $scope.angularTip("开始时间不能大于结束时间！",5000);
                }
            }
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

                if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='qkcx'){
                    $scope.findByCondition(); //潜客查询
                }else if($scope.pageType=='bspcx'){
                    $scope.findBspDefeatCustomer('bspcx');//bsp战败潜客查询
                }else if($scope.pageType=='jiandang'){
                    $scope.findBspGeneratedCustomer('jiandang');//生成潜客
                }
            };

            //全局排序（待失销界面）
            $scope.qjsort_dsx = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==3){
                        $("#clerk_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==4){
                        $("#contact_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==5){
                        $("#contactWay_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class",""); $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class",""); $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_dsx").attr("class","sort_desc"), $("#bhInsuranceEndDate_dsx").attr("class",""),$("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==16){
                        $("#delayDate_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==18){
                        $("#cyts_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==19){
                        $("#holder_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==3){
                        $("#clerk_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==4){
                        $("#contact_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==5){
                        $("#contactWay_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class",""); $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class",""); $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_dsx").attr("class","sort_asc"), $("#bhInsuranceEndDate_dsx").attr("class",""),$("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==16){
                        $("#delayDate_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#cyts_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==18){
                        $("#cyts_dsx").attr("class","sort_desc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#holder_dsx").attr("class","")
                    }else if(short==19){
                        $("#holder_dsx").attr("class","sort_asc"),$("#customerLevel_dsx").attr("class",""), $("#principal_dsx").attr("class","");$("#clerk_dsx").attr("class","");$("#contact_dsx").attr("class","");$("#contactWay_dsx").attr("class","");$("#chassisNumber_dsx").attr("class","");
                        $("#carLicenseNumber_dsx").attr("class","");$("#coverTypeName_dsx").attr("class","");$("#jqxrqEnd_dsx").attr("class","");$("#bhInsuranceEndDate_dsx").attr("class","");
                        $("#willingTraceDate_dsx").attr("class","");$("#gotThroughNum_dsx").attr("class","");$("#lastTraceDate_dsx").attr("class","");$("#lastTraceResult_dsx").attr("class","");$("#delayDate_dsx").attr("class","");
                        $("#remainLostInsurDay_dsx").attr("class","");$("#cyts_dsx").attr("class","");
                    }
                }
                if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='bspcx'){
                    $scope.findBspDefeatCustomer('bspcx') //bsp战败潜客
                }else if($scope.pageType=='kefu'){
                    $scope.findkefu('kefu');
                }else if($scope.pageType=='jiandang'){
                    $scope.findBspGeneratedCustomer('jiandang');
                }
            };
            //全局排序（状态界面：已失销、已激活）
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
                if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='bspcx'){
                    $scope.findBspDefeatCustomer('bspcx') //bsp战败潜客
                }else if($scope.pageType=='kefu'){
                    $scope.findkefu('kefu');
                }else if($scope.pageType=='jiandang'){
                    $scope.findBspGeneratedCustomer('jiandang');
                }
            };
            //全局排序（未接收界面）
            $scope.qjsort_wjs = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==3){
                        $("#clerk_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==4){
                        $("#contact_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==5){
                        $("#contactWay_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class",""); $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class",""); $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_wjs").attr("class","sort_desc"), $("#bhInsuranceEndDate_wjs").attr("class",""),$("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==16){
                        $("#delayDate_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==18){
                        $("#cyts_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==19){
                        $("#holder_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==3){
                        $("#clerk_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==4){
                        $("#contact_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==5){
                        $("#contactWay_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==6){
                        $("#chassisNumber_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class",""); $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==7){
                        $("#carLicenseNumber_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==8){
                        $("#coverTypeName_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class",""); $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==9){
                        $("#jqxrqEnd_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==10){
                        $("#bhInsuranceEndDate_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==11){
                        $("#customerLevel_wjs").attr("class","sort_asc"), $("#bhInsuranceEndDate_wjs").attr("class",""),$("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==12){
                        $("#gotThroughNum_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==13){
                        $("#willingTraceDate_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==14){
                        $("#lastTraceDate_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==15){
                        $("#lastTraceResult_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==16){
                        $("#delayDate_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==17){
                        $("#remainLostInsurDay_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#cyts_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==18){
                        $("#cyts_wjs").attr("class","sort_desc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#holder_wjs").attr("class","")
                    }else if(short==19){
                        $("#holder_wjs").attr("class","sort_asc"),$("#customerLevel_wjs").attr("class",""), $("#principal_wjs").attr("class","");$("#clerk_wjs").attr("class","");$("#contact_wjs").attr("class","");$("#contactWay_wjs").attr("class","");$("#chassisNumber_wjs").attr("class","");
                        $("#carLicenseNumber_wjs").attr("class","");$("#coverTypeName_wjs").attr("class","");$("#jqxrqEnd_wjs").attr("class","");$("#bhInsuranceEndDate_wjs").attr("class","");
                        $("#willingTraceDate_wjs").attr("class","");$("#gotThroughNum_wjs").attr("class","");$("#lastTraceDate_wjs").attr("class","");$("#lastTraceResult_wjs").attr("class","");$("#delayDate_wjs").attr("class","");
                        $("#remainLostInsurDay_wjs").attr("class","");$("#cyts_wjs").attr("class","");
                    }
                }
                if($scope.pageType=='ht'){
                    $scope.findByReturnStatu('ht',$scope.pageStatus)//回退
                }else if($scope.pageType=='js'){
                    $scope.findByAcceptStatu('js',$scope.pageStatus) //接收
                }else if($scope.pageType=='bspcx'){
                    $scope.findBspDefeatCustomer('bspcx') //bsp战败潜客
                }else if($scope.pageType=='kefu'){
                    $scope.findkefu('kefu');
                }else if($scope.pageType=='jiandang'){
                    $scope.findBspGeneratedCustomer('jiandang');
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
                            contact: contact, contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    } else {
                        $scope.condition = {
                            short:short,shortmain:shortmain,
                            returnStatu: returnStatu, startNum: $scope.startNum,
                            renewalType: renewalType, holder: holder, chassisNumber: chassisNumber, contact: contact,
                            contactWay: contactWay, carLicenseNumber: carLicenseNumber
                        };
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                customerCSCService.findByReturnStatu($scope.condition)
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
            //根据接收状态查询
            $scope.findByAcceptStatu = function(pageType,acceptStatu){
                $scope.rightTitleTimeToolHide();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                $scope.pageType = pageType;
                $scope.pageStatus = acceptStatu;
                $scope.customerNoReceived= [];
                var condition= {acceptStatu:acceptStatu,startNum:$scope.startNum,short:short,shortmain:shortmain,};
                $scope.resetPageData();
                $("#msgwindow").show();
                customerCSCService.findByAcceptStatu(condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerNoReceived = result.results.content.list;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
            };
            //销售战败潜客查询(全局排序)
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
            //销售战败潜客查询
            $scope.zbqk = {}
            $scope.findBspDefeatCustomer = function(pageType){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                $scope.pageType = pageType;
                //$scope.pageStatus = acceptStatu;
                $scope.customerDefeat= [];
                var sxyy =  $scope.zbqk.sxyy;
                $scope.resetPageData();
                $("#msgwindow").show();
                customerCSCService.findDefeatCustomer(short,shortmain,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll,sxyy)
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
            //bsp战败潜客跟踪处理
            $scope.findByPage=function(obj) {
                $("#defeatqkPage").show();
                $scope.exhibitionDefeat = obj;
                $scope.exhibitionDefeat.failureTime = $filter('date')($scope.exhibitionDefeat.failureTime, 'yyyy-MM-dd');
            }
            //bsp战败潜客跟踪处理页面关闭
            $scope.findByPageClose=function() {
                $("#defeatqkPage").hide();
            }
            //bsp战败潜客按钮
            $scope.defeatqk=function(msg) {
                if(msg){
                    $("#defeatqkPage").hide();
                    $("#newCustomer").show();
                    $scope.newqk.customerLevel = 'A';
                    $scope.newqk.contact = $scope.exhibitionDefeat.contact;
                    $scope.newqk.contactWay = $scope.exhibitionDefeat.contactWay;
                    $scope.defeatTransformation();
                }else{
                    $("#defeatqd").show();
                }
            }
            //新增潜客品牌车型选择框与输入框切换
            $scope.defeatTransformation = function(){
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
            //取消战败转潜客
            $scope.defeatTransformationClose=function() {
                $("#transformationGiveCust").show();
                $scope.giveCustrefeat= function(msg){
                    if(msg){
                        $("#transformationGiveCust").hide();
                        $("#newCustomer").hide();
                        $scope.newqk = {};
                    }else{
                        $("#transformationGiveCust").hide();
                    }
                }
            }
            //bsp战败潜客选择按钮
            $scope.defeatBtn=function(msg) {
                $("#defeatqd").hide();
                if(msg){
                    customerCSCService.saveDefeatCustomer($scope.exhibitionDefeat)
                        .then(function (result) {
                            $("#defeatqkPage").hide();
                            if (result.status == 'OK'&&result.results.content.status=='OK') {
                                $scope.findCountByUserIdTop();
                                $scope.customerDefeatPage.data.splice($scope.customerDefeatPage.data.indexOf($scope.exhibitionDefeat), 1);
                                $scope.angularTip("战败操作成功！",5000);
                            } else {
                                $scope.angularTip("战败操作失败！",5000);
                            }
                        });
                }
            }

            //bsp战败潜客转成bip潜客
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
                var reg = /^[a-zA-Z0-9]{17}$/ ;
                //验证表单信息
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                }else if(!renewalType||renewalType==''){
                    $scope.angularTip("投保类型不能为空",5000);
                    return;
                }else if(!jqxrqEnd||jqxrqEnd==''){
                    $scope.angularTip("交强险日期结束不能为空",5000);
                    return;
                }else if(!contact||contact==''){
                    $scope.angularTip("联系人不能为空",5000);
                    return;
                }else if(!contactWay||contactWay==''){
                    $scope.angularTip("联系方式不能为空",5000);
                    return;
                }else if(!(/^([0-9-]+)$/.test(contactWay))){
                    $scope.angularTip("联系方式填写有误！",5000);
                    return;
                }else if(!insured||insured==''){
                    $scope.angularTip("被保险人不能为空",5000);
                    return;
                }

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
                    carAnnualCheckUpDate:carAnnualCheckUpDate,buyfromThisStore:buyfromThisStore,contactWayReserve:contactWayReserve
                };
                $("#msgwindow").show();
                customerCSCService.addCustomer(newqkDatas).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK' && res.results.success==true){
                        $scope.newqk = {};
                        $("#newCustomer").hide();
                        $scope.$emit("CountByUserIdTop", true);
                        $scope.customerDefeatPage.data.splice($scope.customerDefeatPage.data.indexOf($scope.exhibitionDefeat), 1);
                        $scope.angularTip("新增潜客成功",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                    }
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
                $scope.createrSearch = {};
                $scope.zbqk = {};
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
                        $("#principal").attr("class","sort_asc");$("#customerLevel").attr("class","sort_asc");
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
                var short=$scope.short;
                var shortmain=$scope.shortmain;
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
                    $scope.conditionSearch  = {
                    short:short,shortmain:shortmain,
                    fourSStoreId: fourSStoreId,
                    startNum: $scope.startNumSearch,
                    insurDateLYStart: insurDateLYStart, insurDateLYEnd: insurDateLYEnd,
                    insuranceEndDateStart: insuranceEndDateStart, insuranceEndDateEnd: insuranceEndDateEnd,
                    syxrqDateStart: syxrqDateStart,syxrqDateEnd: syxrqDateEnd,
                    inviteDateStart: inviteDateStart, inviteDateEnd: inviteDateEnd,
                    comeStoreDateStart: comeStoreDateStart, comeStoreDateEnd: comeStoreDateEnd,
                    lastTraceDateStart: lastTraceDateStart, lastTraceDateEnd: lastTraceDateEnd,
                    quoteDateStart: quoteDateStart, quoteDateEnd: quoteDateEnd, traceDateStart: traceDateStart,
                    traceDateEnd: traceDateEnd,zdZheKouStart:zdZheKouStart,zdZheKouEnd:zdZheKouEnd,
                    remainLostInsurDayStart:remainLostInsurDayStart,remainLostInsurDayEnd:remainLostInsurDayEnd,
                    registrationDateStart:registrationDateStart,registrationDateEnd:registrationDateEnd,
                    condition: {
                        carBrand: carBrand, vehicleModel: vehicleModel, chassisNumber: chassisNumber,
                        carLicenseNumber: carLicenseNumber, insured: insured, contact: contact,
                        contactWay: contactWay,contactWayReserve:contactWayReserve, insuranceCompLY: insuranceCompLY, renewalTypes: renewalTypes,
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
                    customerCSCService.findByCondition($scope.conditionSearch)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $("#msgwindow").hide();
                                $scope.customerAllSearch = result.results.content.list;
                                $scope.policySearchCount = result.results.content.policyCount;
                                $scope.getPolicyPage();
                            } else {
                                $scope.angularTip("查询失败",5000);
                            };
                        });
                }
            };

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
                    { name: '持有天数', field: 'cyts',width:80,enableColumnMenu: false,type:'number'},
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
            $scope.crljqxrqEnd = '';
            $scope.findByCustomerId=function(customer) {
                $scope.customer = customer;
                $scope.thisRowData = customer;
                $scope.chassisNumber = customer.chassisNumber;
                $scope.customerId = customer.customerId;
                $scope.principalId = customer.principalId;
                $scope.principal = customer.principal;
                $scope.clerkId = customer.clerkId;
                $scope.returnStatu = customer.customerAssigns[0].returnStatu;
                $scope.jqxrqEnd_before = customer.jqxrqEnd;
                $("#msgwindow").show();
                customerCSCService.findByCustomerId($scope.customerId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK' && result.results.content.status == 'OK') {
                        $("#genzcl").show();
                        $("#clxhxz_gzcl").show();
                        $("#clxhsr_gzcl").hide();
                        $("#gz_tab").children("li").removeClass("active");
                        $("#gz_tab_grid").children(".tab-pane").removeClass("in active");
                        $("#gzjl_tab").addClass("active");
                        $("#genzong").addClass("in active");
                        $scope.custInfo = result.results.content.results;
                        $scope.tracelistPage.data = result.results.content.results.customerTraceRecodes;
                        for (var i = 0; i < $scope.tracelistPage.data.length; i++) {
                            $scope.tracelistPage.data[i].index = i + 1;
                        };
                        $scope.custInfo.carAnnualCheckUpDate = $filter('date')($scope.custInfo.carAnnualCheckUpDate,'yyyy-MM-dd');
                        $scope.custInfo.registrationDate = $filter('date')($scope.custInfo.registrationDate, 'yyyy-MM-dd');
                        $scope.custInfo.insuranceEndDate = $filter('date')($scope.custInfo.insuranceEndDate, 'yyyy-MM-dd');
                        $scope.custInfo.insurDateLY = $filter('date')($scope.custInfo.insurDateLY, 'yyyy-MM-dd');
                        $scope.custInfo.syxrqEnd = $filter('date')($scope.custInfo.syxrqEnd, 'yyyy-MM-dd');
                        $scope.custInfo.jqxrqEnd = $filter('date')($scope.custInfo.jqxrqEnd, 'yyyy-MM-dd');
                        $scope.crljqxrqEnd = $scope.custInfo.jqxrqEnd;
                        for (var i = 0; i < $scope.kingdsUser.servicer.length; i++) {
                            if ($scope.kingdsUser.servicer[i].id == $scope.custInfo.serviceConsultantId) {
                                $scope.custInfo.serviceConsultant = $scope.kingdsUser.servicer[i];
                            }
                        }
                        $scope.carLicenseNumber = $scope.custInfo.carLicenseNumber;
                        $scope.gzclmr($scope.custInfo.carBrand, $scope.custInfo.vehicleModel);
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
                customerCSCService.findApprovalBillRecordList($scope.chassisNumber).then(function (result) {
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
                });

            }

            //数据改变了是否保存
            $scope.saveCustChangeBtn = function(){
                $scope.crlMessage = '';
                $scope.footerBtn = "";
                if ($scope.CustValuebol == true && $scope.pageType!='js') {
                    if($scope.custInfo.customerLevel=='F'&&$scope.crljqxrqEnd!=$scope.custInfo.jqxrqEnd){
                        customerCSCService.getMessageByUC($scope.custInfo.jqxrqEnd).then(function(result){
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
                var ifLoan =$scope.custInfo.ifLoan;
                var fourSStoreId = $rootScope.user.store.storeId;
                var customerId = $scope.customerId;
                var status;
                if($scope.custInfo.customerLevel=='F'&&$scope.crljqxrqEnd!=$scope.custInfo.jqxrqEnd){
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
                    fourSStoreId:fourSStoreId,customerId:customerId,insuredLY:insuredLY, factoryLicenseType:factoryLicenseType,
                    carAnnualCheckUpDate:carAnnualCheckUpDate, buyfromThisStore:buyfromThisStore,
                    contactWayReserve:contactWayReserve,ifLoan:ifLoan,status:status
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
                    customerCSCService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.jqxrqEnd = jqxrqEnd;
                            $scope.thisRowData.customerLevel = customerLevel;
                            $scope.thisRowData.contact = contact;
                            $scope.thisRowData.contactWay = contactWay;
                            $scope.thisRowData.sfgyx = sfgyx;
                            if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))){
                                $scope.thisRowData.remainLostInsurDay = Math.ceil(((new Date(jqxrqEnd )).getTime() - (new Date).getTime())/(24 * 60 * 60 * 1000));
                            }
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.angularTip("修改成功",5000);
                        }else {
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                };
                if($scope.footerBtn == "hx"){
                    $scope.updateCustMsg();
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "sx"){
                    $scope.updateCustMsg();
                    $scope.lostSaleFun();
                }else {
                    $("#msgwindow").show();
                    customerCSCService.updateCustomerInfo(updateData,$scope.principalId,$scope.principal).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $("#changevalue").hide();
                            $("#genzcl").hide();
                            $scope.angularTip("修改成功",5000);
                            $scope.$emit("CountByUserIdTop", true);
                            $scope.thisRowData.insured = insured;
                            $scope.thisRowData.jqxrqEnd = jqxrqEnd;
                            $scope.thisRowData.customerLevel = customerLevel;
                            $scope.thisRowData.contact = contact;
                            $scope.thisRowData.contactWay = contactWay;
                            $scope.thisRowData.sfgyx = sfgyx;
                            if(($filter('date')($scope.jqxrqEnd_before,'yyyy-MM-dd')!=$filter('date')(jqxrqEnd,'yyyy-MM-dd'))){
                                $scope.thisRowData.remainLostInsurDay = Math.ceil(((new Date(jqxrqEnd )).getTime() - (new Date).getTime())/(24 * 60 * 60 * 1000));
                            }
                        }else {
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }

            };
            //取消修改
            $scope.cancelChange = function(){
                $("#changevalue").hide();
                $scope.CustValuebol = false;
                if($scope.footerBtn == "hx"){
                    $scope.wakeUpCustomerFun();
                }else if($scope.footerBtn == "sx"){
                    $scope.lostSaleFun();
                }else{
                    $("#genzcl").hide();
                }

            };

            //更新接收状态(批量)
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
                        var principalId = $scope.NoReceGridApi.selection.getSelectedGridRows()[i].entity.principalId;
                        var principal = $scope.NoReceGridApi.selection.getSelectedGridRows()[i].entity.principal;
                        var oneData = {
                            customerId: customerId,
                            userId:$scope.userId,
                            superiorId:$scope.superiorId,
                            userName:$scope.userName,
                            principalId:principalId,
                            principal:principal
                        }
                        $scope.AcceptDatas.push(oneData);
                    };
                    $("#msgwindow").show();
                    customerCSCService.updateAcceptStatuBatch($scope.AcceptDatas).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.angularTip("接收成功",5000);
                            for (var i=0;i<SelectedCount;i++){
                                var onerow = $scope.NoReceGridApi.selection.getSelectedGridRows()[i]
                                $scope.customerNoReceivedPage.data.splice($scope.customerNoReceivedPage.data.indexOf(onerow.entity), 1);
                            };
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

            //更新接收状态
            $scope.updateAcceptStatu = function(){
                $("#msgwindow").show();
                var oneData = [{
                    customerId: $scope.customerId,
                    userId:$scope.userId,
                    superiorId:$scope.superiorId,
                    userName:$scope.userName,
                    principalId:$scope.principalId,
                    principal:$scope.principal
                }];
                customerCSCService.updateAcceptStatuBatch(oneData)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerNoReceivedPage.data.splice($scope.customerNoReceivedPage.data.indexOf($scope.customer), 1);
                            $scope.policyCount = $scope.policyCount-1;
                            $scope.$emit("CountByUserIdTop", true);
                            $("#genzcl").hide();
                            $scope.angularTip("接收成功",5000);
                        } else {
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
            };


            //激活按钮
            $scope.wakeUpCustomer = function(){
                $scope.footerBtn = "hx";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.wakeUpCustomerFun();
                }
            };


            //唤醒按钮
            $scope.activateCustomer = function(){
                $scope.footerBtn = "jh";
                if ($scope.CustValuebol == true) {
                    $("#changevalue").show();
                }else {
                    $scope.activateCustomerFun();
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
                    customerCSCService.wakeUpCustomer($scope.customerId, $scope.principalId, $scope.principal,$scope.confirmData.hxyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf( $scope.customer), 1);
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.policyCount = $scope.policyCount-1;
                                $("#genzcl").hide();
                                $scope.angularTip('激活成功',5000);
                            } else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

            //唤醒
            $scope.activateCustomerFun = function(){
                $("#jh").show();
                $scope.makesure = function() {
                    if(!$scope.confirmData.jhyy){
                        $scope.angularTip("原因不能为空",5000);
                        return;
                    }
                    $("#jh").hide();
                    $("#msgwindow").show();
                    customerCSCService.activateCustomer($scope.customerId, $scope.principalId, $scope.principal, $scope.confirmData.jhyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $scope.customerDsxPage.data.splice($scope.customerDsxPage.data.indexOf( $scope.customer), 1);
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.policyCount = $scope.policyCount-1;
                                $("#genzcl").hide();
                                $scope.angularTip('唤醒成功',5000);
                            }else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

            //失销按钮
            $scope.lostSale = function(){
                $scope.footerBtn = "sx";
                customerCSCService.getMessage($scope.customerId).then(function(result){
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
                $("#sx").show();
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
                    $("#sx").hide();
                    $("#msgwindow").show();
                    customerCSCService.lostSale($scope.customerId,$scope.principalId,$scope.principal,$scope.confirmData.sxyy,sxyyxz)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK' && result.results.content.status == 'OK') {
                                $scope.customerDsxPage.data.splice($scope.customerDsxPage.data.indexOf( $scope.customer), 1);
                                $scope.$emit("CountByUserIdTop", true);
                                $scope.policyCount = $scope.policyCount-1;
                                $("#genzcl").hide();
                                $scope.angularTip(result.results.message,5000);
                            }else {
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                }
            }

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
                    customerCSCService.customerSleep($scope.customerId,$scope.principalId,$scope.principal,$scope.confirmData.smyy)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK') {
                                if($scope.pageType=='ht' && $scope.pageStatus==4){
                                    $scope.customerDsxPage.data.splice($scope.customerDsxPage.data.indexOf( $scope.customer), 1);
                                }else {
                                    $scope.customerAllPage.data.splice($scope.customerAllPage.data.indexOf( $scope.customer), 1);
                                }
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
            //批量失销
            $scope.batchSx = function() {
                var SelectedCount = 0;
                var SelectedGridRows = {};
                SelectedCount = $scope.gridApi_dsx.selection.getSelectedCount();
                SelectedGridRows = $scope.gridApi_dsx.selection.getSelectedGridRows();
                $scope.shixiaoDatas = [];
                if(SelectedCount == 0){
                    $scope.angularTip("请先选择潜客",5000)
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
                    customerCSCService.batchLostSale($scope.shixiaoDatas).then(function (result) {
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
                customerCSCService.findwxRecordByCondition($scope.condition)
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
                customerCSCService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
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
                customerCSCService.findByConditionTSX($scope.condition)
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
                customerCSCService.findPMaintenanceByRNumber($scope.reportNumber).then(function (result) {
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


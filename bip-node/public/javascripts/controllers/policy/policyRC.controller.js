'use strict';
angular.module('myApp')
    .controller('policyRC_Controller',['$rootScope','$scope','$filter','policyRCService','policyIWService','$state',
        function($rootScope,$scope,$filter,policyRCService,policyIWService,$state){
            $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和第三方(壁虎或博福)对接
            $scope.billType = 0//新增保单的类别, 0表示新增保单,1表示新增历史保单
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope.searchPolicy={};
            $scope.policyAll = {data:[]};
            $scope.policyAllSearch = {data:[]};
            $scope.search={};
            $scope.startNum = 1;
            $scope.startNum2 = 1;
            $scope.loadStatus=2;
            $scope.loadStatus2=2;
            $scope.showAll = false;
            $scope.policySearchCount = 0;
            $scope.policyCount = 0;
            var short=0;//全局排序（按某字段排序）
            var shortmain=0;//全局排序（1：升序2：降序）
            //多条件查询参数
            $scope.covertype = 1;
            $scope.startTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.privilegePros = ['现金','套餐','现金+套餐','会员积分','储值','其他'];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sdfss = ['到店自取','快递','本店送单']
            $scope.coverTypes = [{id:1,coverType:'新保'},{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.principals = ['张三','李四'];
            $scope.insuranceWriters = ['张三','李四'];

            $scope.newPolicy={chassisNumber:''}

            $scope.newsingle={chassisNumber:''}
            $scope.tracelistSave= [];

            //商险种类的下拉框

            //三者
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
            //划痕
            $scope.HuaHens = [2000,5000,10000,20000];
            //玻璃
            $scope.BoLis = [
                {site : "不投保", value : 0},
                {site : "国产", value : 1},
                {site : "进口", value : 2}
            ];
            //下拉列表数据初始化
            //按4s店ID查询车辆品牌车型信息
            policyRCService.findCarInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.success==true){
                    $scope.carBrands = res.results.content.result||[];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                    $scope.carBrandsnbd = [];
                    Array.prototype.push.apply($scope.carBrandsnbd,$scope.carBrands);
                }else{
                    $scope.carBrands = [];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                }
            });
            //根据4s店id查询保险公司信息
            policyRCService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            policyRCService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });

            //按4s店ID查询车辆品牌车型信息(出单员禁用情况下，点击“+”新增保单)
            policyIWService.findCarInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.success==true){
                    $scope.carBrands = res.results.content.result||[];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                    $scope.carBrandsXBD = [];
                    $scope.carBrandsXBD = $.extend(true, [], $scope.carBrands);
                }else{
                    $scope.carBrands = [];
                    $scope.carBrands.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                }
            });

            //初始按承保类型查询保单信息
            $scope.policyAllPage = {};
            $scope.policyAllPage = {
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
                    { name: '负责人', field: 'principal',width:90,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk',width:90,enableColumnMenu: false},
                    { name: '投保日期', field: 'insurDate',cellFilter: 'date:"yyyy-MM-dd/EEE"',width:110, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(24)">投保日期&nbsp;&nbsp;&nbsp;<span id="insurDate_xb" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompName',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(25)">保险公司&nbsp;&nbsp;&nbsp;<span id="insuranceCompName_xb" class=""></span></div>'},
                    { name: '车损投保金额', field: 'chesuntbje',width:90,enableColumnMenu: false},
                    { name: '车架号',field: 'chassisNumber',width:160,cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" ng-click="grid.appScope.qjsort_xb(6)" style="width: 110px;"><span>车架号</span></div><div ng-if="grid.appScope.asmModuleFlag==0" class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newPolicybtn();"></span></div>'},
                    { name: '车牌号',field: 'carLicenseNumber',cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_xb" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName.coverTypeName',width:100, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_xb" class=""></span></div>'},
                    { name: '本店承保次数', field: 'insurNumber',width:100,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(26)">本店承保次数&nbsp;&nbsp;&nbsp;<span id="insurNumber_xb" class=""></span></div>'},
                    { name: '保险开始日期', field: 'jqxrqStart',cellFilter: 'date:"yyyy-MM-dd HH:mm:ss/EEE"',width:160,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(27)">保险开始日期&nbsp;&nbsp;&nbsp;<span id="jqxrqStart_xb" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_xb" class=""></span></div>'},
                    { name: '出单员',  enableColumnMenu: false,width:100,allowCellFocus : false,enableSorting: false,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span>{{row.entity.insuranceWriter}}</span>'+
                        '<div class="rowButtons">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '</div>' +
                        '<div class="cdyButtons" ng-if="grid.appScope.asmModuleFlag==0">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.approvalBillId,1,row.entity.insurDate)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
                        '</div>' +
                        '</div>'}
                ],
                onRegisterApi : function(gridApiPolicy) {
                    gridApiPolicy.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApiPolicy = gridApiPolicy;
                }
            };

            $scope.getPolicyPage = function(){

                if($scope.startNum==1){
                    $scope.policyIndex= 1;
                    $scope.policyAllPage.data = [];
                }
                for(var i=0;i<$scope.policyAll.data.length;i++){
                    $scope.policyAll.data[i].index = $scope.policyIndex;
                    $scope.policyAllPage.data.push($scope.policyAll.data[i])
                    $scope.policyIndex = $scope.policyIndex+1;
                }
                $scope.loadingPage();

            }

            $scope.searchMore = function(){
                $scope.startNum = $scope.startNum + 1;
                $scope.getSingleByCovertypeMore();
                $scope.loadStatus=1;//正在加载中。。。
            }
            $scope.loadingPage = function(){
                if($scope.policyAllPage.data.length>=$scope.policyCount){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApiPolicy.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApiPolicy.infiniteScroll.dataLoaded(false, true)
                }
            }

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-70
                }
                $scope.gridSearchbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-130
                }
                $scope.gridSpd = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                }
            },100);

            //按类型查询（全局）
            $scope.qjsort_xb = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_xb").attr("class","sort_desc")
                        $("#clerk_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#contact_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==3){
                        $("#clerk_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#contact_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==4){
                        $("#contact_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#coverTypeName_xb").attr("class","");
                        $("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==24){
                        $("#insurDate_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==25){
                        $("#insuranceCompName_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#chassisNumber_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==26){
                        $("#insurNumber_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==27){
                        $("#jqxrqStart_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#sort_desc").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==28){
                        $("#insuranceWriter_xb").attr("class","sort_desc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#sort_desc").attr("class","");$("#clerk_xb").attr("class","");$("#jqxrqStart_xb").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_xb").attr("class","sort_asc")
                        $("#clerk_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#contact_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==3){
                        $("#clerk_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#contact_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==4){
                        $("#contact_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#carLicenseNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#coverTypeName_xb").attr("class","");
                        $("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");$("#chassisNumber_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==24){
                        $("#insurDate_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#chassisNumber_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==25){
                        $("#insuranceCompName_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#chassisNumber_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#coverTypeName_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==26){
                        $("#insurNumber_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#coverTypeName_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#jqxrqStart_xb").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    }else if(short==27){
                        $("#jqxrqStart_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#sort_asc").attr("class","");$("#clerk_xb").attr("class","");$("#insuranceWriter_xb").attr("class","");
                    } else if(short==28){
                        $("#insuranceWriter_xb").attr("class","sort_asc");
                        $("#principal_xb").attr("class","");$("#insurDate_xb").attr("class","");$("#insuranceCompName_xb").attr("class","");$("#carLicenseNumber_xb").attr("class","");
                        $("#chassisNumber_xb").attr("class","");$("#insurNumber_xb").attr("class","");$("#contact_xb").attr("class","");
                        $("#sort_asc").attr("class","");$("#clerk_xb").attr("class","");$("#jqxrqStart_xb").attr("class","");
                    }
                }
                if($scope.covertype==1) {
                    this.getSingleByCovertype(1);
                }else if($scope.covertype==2){
                    this.getSingleByCovertype(2);
                }else if($scope.covertype==3){
                    this.getSingleByCovertype(3);
                }else if($scope.covertype==4){
                    this.getSingleByCovertype(4);
                }else if($scope.covertype==5){
                    this.getSingleByCovertype(5);
                }else if($scope.covertype==6){
                    this.getSingleByCovertype(6);
                }
            };
            //按类型查询
            $scope.getSingleByCovertype = function(covertype){
                $scope.rightTitleTimeToolShow();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                if($scope.covertype!=covertype){
                    $scope.startNum = 1;
                }
                $scope.covertype = covertype;
                $scope.policyAll.data=[];
                $("#msgwindow").show();
                policyRCService.getSingleAll(covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll,short,shortmain)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.customerAll = result.result.content.list;
                            if($scope.customerAll!=null&&$scope.customerAll.length>0) {
                                for (var i = 0; i < $scope.customerAll.length; i++) {
                                    $scope.customerAll[i].showNum = $scope.getNum($scope.customerAll[i].bhInsuranceEndDate, $scope.customerAll[i].jqxrqEnd);
                                }
                            }
                            $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
                            $scope.policyAll.data = result.result.content.results;
                            $scope.policyCount = result.result.content.policyCount;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
            }

            //查询全部还是按时间查询按钮
            $scope.getShowAll = function (){

                if($scope.showAll==true){
                    $scope.rightTimeToolHide();
                }else {
                    $scope.rightTimeToolShow();
                }
                $scope.getSingleByCovertypeTime();
            }
            //时间改变时按类型查询
            $scope.getSingleByCovertypeTime = function(){
                $scope.startNum = 1;
                $scope.policyAll.data=[];
                $scope.resetTime = false;
                var re_data=/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                if(!(re_data.test($scope.startTime)) || !(re_data.test($scope.endTime))){
                    $scope.resetTime = true;
                    return;
                }else if ($scope.startTime <= $scope.endTime) {
                    $("#tipAlert").hide();
                    $("#msgwindow").show();
                    policyRCService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK') {
                                $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
                                $scope.policyAll.data = result.result.content.results;
                                $scope.policyCount = result.result.content.policyCount;
                                $scope.getPolicyPage();
                            } else {

                            }
                        });
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
            //查询更多
            $scope.getSingleByCovertypeMore = function(){
                $scope.policyAll.data=[];
                $("#msgwindow").show();
                policyRCService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.policyAll.data = result.result.content.results;
                            $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
            }

            //按车架号查询车辆及潜客信息 sfts 如果为0不提示,1为提示
            $scope.getInfoByChassisNumber=function(sfts){
                //alert("查询潜客")
                $scope.tracelistNewPolicy.data = [];
                var chassisNumber = $scope.newsingle.chassisNumber;
                policyIWService.getInfoByChassisNumber(chassisNumber).then(function (result) {
                    if (result.success == true) {
                        var custInfo = result.content.result.custInfo;
                        var approvalBill = result.content.result.approvalBill;
                        var insuTypes = result.content.result.insuTypes;
                        if(approvalBill!=null){
                            if(approvalBill.jqxrqStart!=null&&approvalBill.jqxrqStart!=""){
                                approvalBill.jqxrqStart = $filter('date')(new Date(approvalBill.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                                approvalBill.jqxrqEnd = $filter('date')(new Date(approvalBill.jqxrqEnd),'yyyy-MM-dd HH:mm:ss');
                            }

                        }
                        //将审批单信息赋值全局变量
                        $scope.approvalBillAll = approvalBill;
                        var insuranceBill = result.content.result.insuranceBill;
                        if(custInfo!=null||approvalBill!=null||insuranceBill!=null){
                            var insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                            $scope.newsingle.chassisNumber = chassisNumber;
                            $scope.newsingle.insurDate = insurDate;
                            if(custInfo!=null){
                                $scope.customerLevel = custInfo.customerLevel;
                            }
                        }else{
                            return;
                        };

                        if(sfts==1){
                            $("#updataPolicy").show();
                        }else{
                            setTimeout(function(){
                                $scope.updataPolicy();
                                $scope.$apply(function() {});
                            },100);
                        }
                        $scope.updataPolicy= function(){
                            $("#updataPolicy").hide();
                            if(custInfo!=null) {
                                //车辆信息
                                if(sfts==1){
                                    $scope.newsingle.carLicenseNumber = custInfo.carLicenseNumber;
                                    $scope.newsingle.carBrand = custInfo.carBrand;
                                    $scope.newsingle.vehicleModel = custInfo.vehicleModel;
                                }
                                $scope.newsingle.engineNumber = custInfo.engineNumber;
                                $scope.newsingle.registrationDate = custInfo.registrationDate;

                                //客户信息
                                if(sfts==1){
                                    $scope.newsingle.carOwner = custInfo.carOwner;
                                    $scope.newsingle.insured = custInfo.insured;
                                    $scope.newsingle.certificateNumber = custInfo.certificateNumber;
                                    $scope.newsingle.customerCharacter = custInfo.customerCharacter;
                                }
                                $scope.newsingle.contact = custInfo.contact;
                                $scope.newsingle.contactWay = custInfo.contactWay;
                                $scope.newsingle.customerSource = custInfo.customerSource;
                                $scope.newsingle.address = custInfo.address;
                                $scope.newsingle.coverType = custInfo.renewalType;

                                //办理人员
                                $scope.newsingle.principalId = custInfo.principalId;
                                $scope.newsingle.clerkId = custInfo.clerkId;

                                //保险信息
                                $scope.newsingle.insurNumber = custInfo.insurNumber;
                                $scope.newsingle.qnbe = custInfo.insuranceCoverageLY;
                            }
                            if(approvalBill!=null){
                                if(sfts==1){
                                    $scope.newsingle.binsuranceCoverage = approvalBill.syxje;
                                    $scope.newsingle.vehicleTax = approvalBill.ccs;
                                    $scope.newsingle.cinsuranceCoverage = approvalBill.jqxje;
                                    $scope.newsingle.jqxrqStart = approvalBill.jqxrqStart;
                                    $scope.newsingle.jqxrqEnd = approvalBill.jqxrqEnd;
                                    $scope.newsingle.insuranceCompName = approvalBill.insuranceCompName;
                                    if($scope.newsingle.jqxrqStart!=null&&$scope.newsingle.jqxrqStart!=""){
                                        $scope.newsingle.jqxrqStart = new Date($scope.newsingle.jqxrqStart);
                                    }
                                    $scope.newsingle.jqxrqEnd = $filter('date')($scope.newsingle.jqxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                                }
                                $scope.newsingle.renewalWay = approvalBill.renewalWay;
                                $scope.newsingle.privilegeSum = approvalBill.yhje;
                                $scope.newsingle.payWay = approvalBill.fkfs;
                                $scope.newsingle.coverType = approvalBill.renewalType;
                                //$scope.newsingle.insurDate = approvalBill.insurDate;
                                $scope.newsingle.invoiceName = approvalBill.kpxx;
                                $scope.newsingle.giftDiscount = approvalBill.giftDiscount;
                                $scope.newsingle.xjyhdw = approvalBill.xjyhdw;
                                $scope.newsingle.czkje = approvalBill.czkje;
                                $scope.newsingle.czkjedw = approvalBill.czkjedw;
                            }
                            //过滤时间格式
                            $scope.newsingle.insurDate = $filter('date')($scope.newsingle.insurDate, 'yyyy-MM-dd');
                            $scope.newsingle.registrationDate = $filter('date')($scope.newsingle.registrationDate, 'yyyy-MM-dd');
                            if(insuranceBill!=null){
                                $scope.newsingle.qnsyxje = insuranceBill.binsuranceCoverage;
                                $scope.newsingle.qnjqxje = insuranceBill.cinsuranceCoverage;
                                $scope.newsingle.qnccsje = insuranceBill.vehicleTax;
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

                            //负责人

                            for (var i = 0; i < $scope.kingdsUser.principal.length; i++) {
                                if ($scope.kingdsUser.principal[i].id == $scope.newsingle.principalId) {
                                    if(!$scope.newsingle.principal){
                                        $scope.newsingle.principal = $scope.kingdsUser.principal[i];
                                    }

                                }
                            }
                            //业务员
                            for (var i = 0; i < $scope.kingdsUser.salesman.length; i++) {
                                if ($scope.kingdsUser.salesman[i].id == $scope.newsingle.clerkId) {
                                    $scope.newsingle.clerk = $scope.kingdsUser.salesman[i];
                                }
                            }

                            if(sfts==1){
                                //保险公司
                                for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                    if ($scope.insuranceCompNames[i].insuranceCompName == $scope.newsingle.insuranceCompName) {
                                        $scope.newsingle.insuranceCompName = $scope.insuranceCompNames[i];
                                        if ($scope.newsingle.insuranceCompName) {
                                            var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                                            $scope.newsingle.insuranceTypes = [];
                                            for (var i = 0; i < syxz.length; i++) {
                                                syxz[i].checkStatus=false;
                                                syxz[i].coverage = null;
                                                for (var j = 0; j < insuTypes.length; j++) {
                                                    if (syxz[i].typeName == insuTypes[j].typeName) {
                                                        syxz[i].checkStatus = true;
                                                        syxz[i].coverage = insuTypes[j].coverage;
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
                                $scope.newPolicymr($scope.newsingle.carBrand, $scope.newsingle.vehicleModel);
                            }
                            $scope.bfhjjs();
                            if(custInfo!=null && custInfo.customerLevel=='S'){
                                $("#smqkjybd").show();
                                $scope.makesure= function() {
                                    $scope.sleepCustomerPromptFlag = 1;
                                    $("#smqkjybd").hide();
                                }
                            }
                        }
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
            //保单明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'0px'},500);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });

                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".cdyButtons").stop(true).animate({right:'0px'},500);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".cdyButtons").stop(true).animate({right:'-270px'},100);
                });
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons_spd").stop(true).animate({right:'-60px'},500);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons_spd").stop(true).animate({right:'-170px'},100);
                });
            }


            //时间显示隐藏
            $scope.rightTimeToolShow=function(){
                $(".control-group").show();
            }

            //时间显示隐藏
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
                    { name:'序号',field: 'index', width:60,enableColumnMenu: false,},
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

            //保单明细跟踪记录
            $scope.policyInfoTracePage = {
                enableHorizontalScrollbar:0,
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index', cellClass:'text-center',width:50, enableColumnMenu: false},
                    { name: '负责人', field: 'principal',width:70,enableColumnMenu: false},
                    { name: '跟踪周期', field: 'traceClcye',width:160,enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceNumber',cellClass:'text-center', enableColumnMenu: false},
                    { name: '投保类型', field: 'coverType',cellFilter:'mapTBLX',enableColumnMenu: false},
                    { name: '是否邀约',field: 'isInvite',cellFilter:'mapSF',cellClass:'text-center',enableColumnMenu: false},
                    { name: '邀约次数', field: 'inviteNumber',cellClass:'text-center',enableColumnMenu: false},
                    { name: '是否邀约进店', field: 'isInviteToStore',cellFilter:'mapSF',cellClass:'text-center',enableColumnMenu: false,},
                    { name: '备注', field: 'remark',cellTooltip: true,enableColumnMenu: false},
                ],

                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            $scope.SanZhe =  ""
            //查询保单明细
            $scope.foundDate = 0;
            $scope.singleDetails=function(rowData) {
                $scope.policyInfoTracePage.data=[];
                $scope.searchPolicy = {};
                var insuranceBillId = rowData.insuranceBillId;
                var newDate = new Date();
                var between = (newDate - rowData.foundDate)/1000;
                if(between<=86400){
                    $scope.foundDate = 1;
                }else {
                    $scope.foundDate = 0;
                }
                $scope.rowData = rowData;
                $("#msgwindow").show();
                //出单员禁用和启用状态下查询保单模板不同
                if($scope.asmModuleFlag==0){
                    policyRCService.getSingleById(insuranceBillId).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status=='OK'&&result.results.content.status == 'OK') {
                            $("#singleDetails_noCdy").show();  //保单明细弹框
                            $("#clxhxz_xbd2").show();
                            $("#clxhsr_xbd2").hide();
                            $scope.insuTypeList = result.results.content.insuTypeList;
                            $scope.searchsingle = result.results.content.insuranceBill;
                            $scope.searchsingle.insurDate = $filter('date')($scope.searchsingle.insurDate, 'yyyy-MM-dd');
                            $scope.searchsingle.registrationDate = $filter('date')($scope.searchsingle.registrationDate, 'yyyy-MM-dd');
                            if($scope.searchsingle.syxrqStart!=null&&$scope.searchsingle.syxrqStart!=""){
                                $scope.searchsingle.syxrqStart = new Date($scope.searchsingle.syxrqStart);
                            }
                            $scope.searchsingle.syxrqEnd = $filter('date')($scope.searchsingle.syxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                            if($scope.searchsingle.jqxrqStart!=null&&$scope.searchsingle.jqxrqStart!=""){
                                $scope.searchsingle.jqxrqStart = new Date($scope.searchsingle.jqxrqStart);
                            }
                            $scope.searchsingle.jqxrqEnd = $filter('date')($scope.searchsingle.jqxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                            var tracelists=result.results.content.tracelist;
                            var traceIndex = 1;
                            for(var i=0;i<tracelists.length;i++){
                                tracelists[i].index = traceIndex;
                                $scope.policyInfoTracePage.data.push(tracelists[i])
                                traceIndex = traceIndex+1;
                            };
                            //负责人
                            for (var i = 0; i < $scope.kingdsUser.principal.length; i++) {
                                if ($scope.kingdsUser.principal[i].id == $scope.searchsingle.principalId) {
                                    $scope.searchsingle.principal = $scope.kingdsUser.principal[i];
                                }
                            };
                            //业务员
                            for (var i = 0; i < $scope.kingdsUser.salesman.length; i++) {
                                if ($scope.kingdsUser.salesman[i].id == $scope.searchsingle.clerkId) {
                                    $scope.searchsingle.clerk = $scope.kingdsUser.salesman[i];
                                }
                            };

                            // console.log("insuranceCompNames" + JSON.stringify($scope.insuranceCompNames))
                            // console.log("insuTypeList" + JSON.stringify($scope.insuTypeList))
                            //保险公司
                            for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                if ($scope.insuranceCompNames[i].insuranceCompName == $scope.searchsingle.insuranceCompName) {
                                    $scope.searchsingle.insuranceCompName = $scope.insuranceCompNames[i];
                                    // 三者 划痕 玻璃 司机 乘客 费用 指定
                                    var typeNameQuota = "";
                                    var typeNameQuotaArr = [];
                                    var chesun = 0;
                                    var sanzhe = 0;
                                    var huahen = 0;
                                    var boli  = 0;
                                    var siji  = 0;
                                    var chengke  = 0;
                                    var feiyong = 0;
                                    var zhiding = 0;
                                    var jingshen = 0;
                                    var huowu = 0;
                                    for (var j = 0; j < $scope.insuTypeList.length; j++) {
                                        if($scope.insuTypeList[j].typeName.indexOf("-") > -1){
                                            typeNameQuota = $scope.insuTypeList[j].typeName;
                                            typeNameQuotaArr = typeNameQuota.split("-");
                                            $scope.insuTypeList[j].typeName = typeNameQuotaArr[0];
                                            if(typeNameQuotaArr[0].indexOf("车损")>-1){
                                                chesun =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("三者")>-1){
                                                sanzhe =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("划痕")>-1){
                                                huahen =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("玻璃")>-1){
                                                boli =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("司机")>-1){
                                                siji =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("乘客")>-1){
                                                chengke =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("费用")>-1){
                                                feiyong =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("指定")>-1){
                                                zhiding =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("货物")>-1){
                                                huowu =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("精神")>-1){
                                                jingshen =  typeNameQuotaArr[1]

                                            }
                                        }else{
                                            typeNameQuota = $scope.insuTypeList[j].typeName;
                                        }
                                    }
                                    if ($scope.searchsingle.insuranceCompName) {
                                        var syxz = $scope.searchsingle.insuranceCompName.insuranceTypes;
                                        $scope.searchsingle.insuranceTypes = [];
                                        $scope.CheSun = "";
                                        $scope.SanZhe = "";
                                        $scope.SiJick = "";
                                        $scope.ChengKe = "";
                                        $scope.HuaHen = "";
                                        $scope.BoLi = "";
                                        $scope.HcHuoWuZeRen = "";
                                        $scope.HcJingShenSunShi = "";
                                        $scope.hcFeiYongBuChang = "";
                                        $scope.hcXiuLiBuChang = "";

                                        for (var i = 0; i < syxz.length; i++) {
                                            syxz[i].checkStatus=false;
                                            syxz[i].coverage = null;
                                            for (var j = 0; j < $scope.insuTypeList.length; j++) {
                                                //console.log(syxz[i].typeName +" " + $scope.insuTypeList[j].typeName)

                                                if (syxz[i].typeName == $scope.insuTypeList[j].typeName) {
                                                    syxz[i].checkStatus = true;
                                                    syxz[i].coverage = $scope.insuTypeList[j].coverage;

                                                    if($scope.insuTypeList[j].typeName.indexOf("车损")>-1 && chesun>0){
                                                        $scope.CheSun = parseInt(chesun);
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("三者")>-1 && sanzhe>0){

                                                        $scope.SanZhe = parseInt(sanzhe);
                                                        // console.log(" 三者 " + $scope.SanZhe)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("划痕")>-1 && huahen>0){

                                                        $scope.HuaHen = parseInt(huahen);
                                                        // console.log(" 划痕 " + $scope.HuaHen)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("玻璃")>-1){

                                                        $scope.BoLi = parseInt(boli);
                                                        //  console.log(" 玻璃 " + $scope.BoLi)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("司机")>-1 && siji>0){
                                                        $scope.SiJick = parseInt(siji);
                                                        // console.log(" 司机 " + $scope.SiJick)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("乘客")>-1 && chengke>0){

                                                        $scope.ChengKe = parseInt(chengke);
                                                        // console.log("乘客 " + $scope.ChengKe)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("费用")>-1 && feiyong>0){
                                                        $scope.hcFeiYongBuChang = parseInt(feiyong);
                                                        // console.log("费用 " + $scope.hcFeiYongBuChang)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("指定")>-1 && zhiding>0){
                                                        $scope.hcXiuLiBuChang = parseInt(zhiding);
                                                        // console.log("指定 " + $scope.hcXiuLiBuChang)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("货物")>-1 && feiyong>0){
                                                        $scope.HcHuoWuZeRen = parseInt(huowu);
                                                        // console.log("货物 " + $scope.HcHuoWuZeRen)
                                                    }
                                                    if($scope.insuTypeList[j].typeName.indexOf("精神")>-1 && zhiding>0){
                                                        $scope.HcJingShenSunShi = parseInt(jinghsen);
                                                        // console.log("精神 " + $scope.HcJingShenSunShi)
                                                    }


                                                }
                                            }
                                            $scope.searchsingle.insuranceTypes.push(syxz[i]);
                                        }
                                    }
                                }else {
                                    for (var j = 0; j < $scope.insuranceCompNames[i].insuranceTypes.length; j++) {
                                        $scope.insuranceCompNames[i].insuranceTypes[j].coverage = null;
                                    }
                                }
                            }


                            $scope.newPolicymrbd($scope.searchsingle.carBrand, $scope.searchsingle.vehicleModel);
                        } else {

                        }
                    });
                }
                else{
                    policyRCService.getSingleById(insuranceBillId).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.success==true) {
                            $("#singleDetails").show(); //保单明细弹框
                            $scope.searchPolicy = result.results.content.insuranceBill;
                            var tracelists=result.results.content.tracelist;
                            $scope.searchPolicy.registrationDate = $filter('date')($scope.searchPolicy.registrationDate,'yyyy-MM-dd');
                            $scope.searchPolicy.coverDate = $filter('date')($scope.searchPolicy.coverDate,'yyyy-MM-dd');
                            $scope.searchPolicy.insuranceEndDate = $filter('date')($scope.searchPolicy.insuranceEndDate,'yyyy-MM-dd');
                            var traceIndex = 1;
                            for(var i=0;i<tracelists.length;i++){
                                tracelists[i].index = traceIndex;
                                $scope.policyInfoTracePage.data.push(tracelists[i])
                                traceIndex = traceIndex+1;
                            }
                        } else {

                        }
                    });
                }
            }
            //关闭窗口时清空保单明细数据
            $scope.cleanSingleDetails_noCdy = function(){
                $scope.searchsingle ={};
                $scope.policyInfoTracePage.data = [];
                $scope.SanZhe = "";
                $scope.SiJick = "";
                $scope.ChengKe = "";
                $scope.HuaHen = "";
                $scope.BoLi = "";
                $scope.HcHuoWuZeRen = "";
                $scope.HcJingShenSunShi = "";
                $scope.hcFeiYongBuChang = "";
                $scope.hcXiuLiBuChang = "";
            }

            //关闭窗口时清空保单明细数据
            $scope.cleanSingleDetails = function(){
                $scope.searchsingle ={};
                $scope.policyInfoTracePage.data = [];
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

            //关闭窗口时清空跟踪记录数据
            $scope.cleanRecord = function(){
                $scope.recodeListPage.data = [];
            }
            //查询跟踪记录表格
            $scope.recodeListPage = {
                enableHorizontalScrollbar:0,
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index', cellClass:'text-center',width:80, enableColumnMenu: false},
                    { name: '级别', field: 'customerLevel',width:80,cellClass:'text-center',enableColumnMenu: false},
                    { name: '投保类型', field: 'renewalType',width:100,cellClass:'text-center',enableColumnMenu: false},
                    { name: '跟踪结果', field: 'traceContext',cellTooltip: true,enableColumnMenu: false},
                    { name: '跟踪时间', field: 'currentTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE hh:MM"',enableColumnMenu: false},
                    { name: '下次跟踪时间',field: 'nextTraceDate',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false}
                ],

                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //查询跟踪记录
            $scope.findRecord=function(insuranceBillId) {
                $scope.recodeListPage.data = [];
                $("#genzjilu").show();//跟踪记录弹框
                policyRCService.findRecord(insuranceBillId).then(function (result) {
                    if (result.status=='OK'&&result.results.content.status == 'OK') {
                        var recodeList = result.results.content.RecodeList;
                        for(var i=0;i<recodeList.length;i++){
                            recodeList[i].index = i+1;
                            $scope.recodeListPage.data.push(recodeList[i])
                        }
                    } else {

                    }
                });
            }


            //按条件查询保单信息
            $scope.policyAllSearchPage = {};
            $scope.policyAllSearchPage = {
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
                    { name: '负责人', field: 'principal',width:90,enableColumnMenu: false},
                    { name: '业务员', field: 'clerk',width:90,enableColumnMenu: false},
                    { name: '投保日期', field: 'insurDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(24)">投保日期&nbsp;&nbsp;&nbsp;<span id="insurDate_bd" class=""></span></div>'},
                    { name: '保险公司', field: 'insuranceCompName',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(25)">保险公司&nbsp;&nbsp;&nbsp;<span id="insuranceCompName_bd" class=""></span></div>'},
                    { name: '车损投保金额', field: 'chesuntbje',width:90,enableColumnMenu: false},
                    { name: '车架号',field: 'chassisNumber',width:160,cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" ng-click="grid.appScope.qjsort_bd(6)" style="width: 110px;"><span>车架号</span></div><div ng-if="grid.appScope.asmModuleFlag==0" class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newPolicybtn();"></span></div>'},
                    { name: '车牌号',field: 'carLicenseNumber',cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_bd" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName.coverTypeName',width:100, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_bd" class=""></span></div>'},
                    { name: '本店承保次数', field: 'insurNumber',width:100,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(26)">本店承保次数&nbsp;&nbsp;&nbsp;<span id="insurNumber_bd" class=""></span></div>'},
                    { name: '保险开始日期', field: 'jqxrqStart',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(27)">保险开始日期&nbsp;&nbsp;&nbsp;<span id="jqxrqStart_bd" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_bd" class=""></span></div>'},
                    { name: '出单员',  enableColumnMenu: false,width:100,allowCellFocus : false,enableSorting: false,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span>{{row.entity.insuranceWriter}}</span>'+
                        '<div class="rowButtons" ng-if="grid.appScope.asmModuleFlag==1">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '</div>' +
                        '<div class="cdyButtons" ng-if="grid.appScope.asmModuleFlag==0">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.approvalBillId,1,row.entity.insurDate)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
                        '</div>' +
                        '</div>'}
                ],
                onRegisterApi : function(gridApi_bdcx) {
                    gridApi_bdcx.infiniteScroll.dataLoaded(false, false);
                    gridApi_bdcx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore2);
                    $scope.gridApi_bdcx = gridApi_bdcx;
                }
            };

            $scope.getPolicySearchPage = function(){

                if($scope.startNum2==1){
                    $scope.policySearchIndex= 1;
                    $scope.policyAllSearchPage.data = [];
                }
                for(var i=0;i<$scope.policyAllSearch.data.length;i++){
                    $scope.policyAllSearch.data[i].index = $scope.policySearchIndex;
                    $scope.policyAllSearchPage.data.push($scope.policyAllSearch.data[i])
                    $scope.policySearchIndex = $scope.policySearchIndex+1;
                }
                $scope.loadingPage2();

            }

            $scope.searchMore2 = function(){
                $scope.startNum2 = $scope.startNum2 + 1;
                $scope.searchMoreStatus =false;
                $scope.singleSearch();
                $scope.loadStatus2=1;//正在加载中。。。
                $scope.searchMoreStatus =true;
            }
            $scope.loadingPage2 = function(){
                if($scope.policyAllSearchPage.data.length>=$scope.policySearchCount){
                    $scope.loadStatus2=2; //全部加载完成
                    $scope.gridApi_bdcx.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus2=0; //加载更多
                    $scope.gridApi_bdcx.infiniteScroll.dataLoaded(false, true)
                }
            }
            //按条件查询保单信息排序（全局）
            $scope.qjsort_bd = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==2){
                        $("#principal_bd").attr("class","sort_desc")
                        $("#clerk_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#contact_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==3){
                        $("#clerk_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#contact_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==4){
                        $("#contact_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#coverTypeName_bd").attr("class","");
                        $("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==24){
                        $("#insurDate_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==25){
                        $("#insuranceCompName_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#chassisNumber_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==26){
                        $("#insurNumber_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==27){
                        $("#jqxrqStart_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#sort_desc").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==28){
                        $("#insuranceWriter_bd").attr("class","sort_desc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#sort_desc").attr("class","");$("#clerk_bd").attr("class","");$("#jqxrqStart_bd").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==2){
                        $("#principal_bd").attr("class","sort_asc")
                        $("#clerk_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#contact_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==3){
                        $("#clerk_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#contact_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==4){
                        $("#contact_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#carLicenseNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#coverTypeName_bd").attr("class","");
                        $("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");$("#chassisNumber_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==24){
                        $("#insurDate_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#chassisNumber_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==25){
                        $("#insuranceCompName_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#chassisNumber_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#coverTypeName_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==26){
                        $("#insurNumber_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#coverTypeName_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#jqxrqStart_bd").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    }else if(short==27){
                        $("#jqxrqStart_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#sort_asc").attr("class","");$("#clerk_bd").attr("class","");$("#insuranceWriter_bd").attr("class","");
                    } else if(short==28){
                        $("#insuranceWriter_bd").attr("class","sort_asc");
                        $("#principal_bd").attr("class","");$("#insurDate_bd").attr("class","");$("#insuranceCompName_bd").attr("class","");$("#carLicenseNumber_bd").attr("class","");
                        $("#chassisNumber_bd").attr("class","");$("#insurNumber_bd").attr("class","");$("#contact_bd").attr("class","");
                        $("#sort_asc").attr("class","");$("#clerk_bd").attr("class","");$("#jqxrqStart_bd").attr("class","");
                    }
                }
                this.singleSearch();
            };
            $scope.singleSearch=function(){
                var shortBd=$scope.short;
                var shortmainBd=$scope.shortmain;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                var carBrand = null;
                var vehicleModel = null;
                if($scope.search.carBrand){
                    carBrand = $scope.search.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.search.vehicleModelInput
                    }else if($scope.search.vehicleModel){
                        vehicleModel =$scope.search.vehicleModel.modelName;
                    }
                }
                var insured = $scope.search.insured;
                var contact = $scope.search.contact;
                var contactWay = $scope.search.contactWay;
                var carLicenseNumber = $scope.search.carLicenseNumber;
                var chassisNumber = $scope.search.chassisNumber;
                var insuranceCompName = $scope.search.insuranceCompName;
                var coverTypes = $scope.search.coverType;
                var insurNumber = $scope.search.insurNumber;
                var principalId = $scope.search.principal;
                var insuranceWriterId = $scope.search.insuranceWriter;
                var cbrqStart = $scope.search.cbrqStart;
                var cbrqEnd = $scope.search.cbrqEnd;
                var cinsuranceNumber = $scope.search.cinsuranceNumber;
                var syxrqStart = $scope.search.syxrqStart;
                var syxrqEnd = $scope.search.syxrqEnd;
                var jqxrqStart = $scope.search.jqxrqStart;
                var jqxrqEnd = $scope.search.jqxrqEnd;
                var syxjeStart = $scope.search.syxjeStart;
                var syxjeEnd = $scope.search.syxjeEnd;
                var certificateNumber = $scope.search.certificateNumber;
                var notExistCustomer = $scope.search.notExistCustomer;
                if($scope.searchMoreStatus ==true){
                    $scope.startNum2 = 1; //开始页
                }
                $scope.policyAllSearch.data = [];
                var searchDatas = {
                    shortBd:shortBd,shortmainBd:shortmainBd,
                    fourSStoreId:fourSStoreId,foursStore:foursStore,carBrand:carBrand,vehicleModel:vehicleModel,
                    insured:insured,contact:contact,contactWay:contactWay,
                    insuranceCompName:insuranceCompName,carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,
                    coverTypes:coverTypes,insurNumber:insurNumber,principalId:principalId,
                    insuranceWriterId:insuranceWriterId,cbrqStart:cbrqStart,cbrqEnd:cbrqEnd,cinsuranceNumber:cinsuranceNumber,
                    syxrqStart:syxrqStart,syxrqEnd:syxrqEnd,jqxrqStart:jqxrqStart,jqxrqEnd:jqxrqEnd,
                    syxjeStart:syxjeStart,syxjeEnd:syxjeEnd,certificateNumber:certificateNumber,notExistCustomer:notExistCustomer
                };

                if(cbrqStart != null && cbrqEnd != null && cbrqStart != "" && cbrqEnd != "" && cbrqStart>cbrqEnd){
                    $scope.angularTip("投保开始日期不能大于结束日期！",5000)
                }else if(syxrqStart != null && syxrqEnd != null && syxrqStart != "" && syxrqEnd != "" && syxrqStart>syxrqEnd){
                    $scope.angularTip("商业险开始日期不能大于结束日期！",5000)
                }else if(jqxrqStart != null && jqxrqEnd != null && jqxrqStart != "" && jqxrqEnd != "" && jqxrqStart>jqxrqEnd){
                    $scope.angularTip("交强险开始日期不能大于结束日期！",5000)
                }else if(syxjeStart != null && syxjeEnd != null && syxjeStart != "" && syxjeEnd != "" && syxjeStart>syxjeEnd){
                    $scope.angularTip("商业险金额区间填写有误！",5000)
                }else{
                    $("#msgwindow").show();
                    policyRCService.getSingleByCondition(searchDatas,$scope.startNum2).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK' &&result.result.success==true){
                            $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
                            $scope.policyAllSearch.data = result.result.content.results;
                            $scope.policySearchCount = result.result.content.policyCount;
                            $scope.getPolicySearchPage();
                        } else {
                            $scope.angularTip("查询失败",5000);
                        }
                    });
                }
            }

            //按条件查询审批单信息（出单员禁用后，审批单显示在续保专员界面）
            $scope.startNum3=1;
            $scope.spdSearchPage = {};
            $scope.spdSearchPage = {
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
                    { name: '联系人', field: 'contact',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_spd" class=""></span></div>'},
                    { name: '联系电话', field: 'contactWay',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(5)">联系方式&nbsp;&nbsp;&nbsp;<span id="contactWay_spd" class=""></span></div>'},
                    { name: '车牌号', field: 'carLicenseNumber',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_spd" class=""></span></div>'},
                    { name: '车架号', field: 'chassisNumber',enableColumnMenu: false,cellTooltip: true,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_spd" class=""></span></div>'},
                    { name: '投保类型', field: 'renewalType',width:100,cellFilter:'mapTBLX', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_spd" class=""></span></div>'},
                    { name: '投保日期', field: 'insurDate',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(24)">投保日期&nbsp;&nbsp;&nbsp;<span id="insurDate_spd" class=""></span></div>'},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd HH:mm:ss/EEE"',width:160,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(9)">保险到期日&nbsp;&nbsp;&nbsp;<span id="jqxrqEnd_spd" class=""></span></div>'},
                    { name: '保费合计', field: 'bfhj',width:100, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_spd(30)">保费合计&nbsp;&nbsp;&nbsp;<span id="bfhj_spd" class=""></span></div>'},
                    { name: '保险公司',  enableColumnMenu: false,width:100,allowCellFocus : false,enableSorting: false,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span>{{row.entity.insuranceCompName}}</span>'+
                        '<div class="rowButtons_spd">'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.id,2,row.entity.insurDate)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
                        '</div></div>'}
                ],
                onRegisterApi : function(gridApi_spd) {
                    gridApi_spd.infiniteScroll.dataLoaded(false, false);
                    gridApi_spd.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore3);
                    $scope.gridApi_spd = gridApi_spd;
                }
            };
            $scope.getspdSearchPage = function(){
                if($scope.startNum3==1){
                    $scope.spdSearchIndex= 1;
                    $scope.spdSearchPage.data = [];
                }
                for(var i=0;i<$scope.spdSearch.data.length;i++){
                    $scope.spdSearch.data[i].index = $scope.spdSearchIndex;
                    $scope.spdSearchPage.data.push($scope.spdSearch.data[i])
                    $scope.spdSearchIndex = $scope.spdSearchIndex+1;
                }
                $scope.loadingPage3();

            }
            $scope.searchMore3 = function(){
                $scope.startNum3 = $scope.startNum3 + 1;
                $scope.searchMoreStatus =false;
                $scope.spdSearchBtn();
                $scope.loadStatus3=1;//正在加载中。。。
                $scope.searchMoreStatus =true;
            }
            $scope.loadingPage3 = function(){
                if($scope.spdSearchPage.data.length>=$scope.spdSearchCount){
                    $scope.loadStatus3=2; //全部加载完成
                    $scope.gridApi_spd.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus3=0; //加载更多
                    $scope.gridApi_spd.infiniteScroll.dataLoaded(false, true)
                };
            }
            $scope.spdSearch = {};
            $scope.spdSearch.billFlag = 1;

            //审批单信息排序（全局）
            $scope.qjsort_spd = function(short){
                $scope.short=short;
                $scope.shortmain=++shortmain;
                if(shortmain%2==0){
                    $scope.shortmain=2;
                    if(short==4){
                        $("#contact_spd").attr("class","sort_desc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#carLicenseNumber_spd").attr("class","");$("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==5){
                        $("#contactWay_spd").attr("class","sort_desc");$("#contact_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#carLicenseNumber_spd").attr("class","");$("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_spd").attr("class","sort_desc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_spd").attr("class","sort_desc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#coverTypeName_spd").attr("class","");
                        $("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_spd").attr("class","sort_desc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#chassisNumber_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==9){
                        $("#jqxrqEnd_spd").attr("class","sort_desc");$("#coverTypeName_spd").attr("class","");$("#contactWay_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#chassisNumber_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==24){
                        $("#insurDate_spd").attr("class","sort_desc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==30){
                        $("#bfhj_spd").attr("class","sort_desc");$("#insurDate_spd").attr("class","");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }
                }
                else{
                    $scope.shortmain=1;
                    if(short==4){
                        $("#contact_spd").attr("class","sort_asc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#carLicenseNumber_spd").attr("class","");$("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==5){
                        $("#contactWay_spd").attr("class","sort_asc");$("#contact_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#carLicenseNumber_spd").attr("class","");$("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==6){
                        $("#chassisNumber_spd").attr("class","sort_asc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==7){
                        $("#carLicenseNumber_spd").attr("class","sort_asc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#coverTypeName_spd").attr("class","");
                        $("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");$("#chassisNumber_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==9){
                        $("#jqxrqEnd_spd").attr("class","sort_asc");$("#coverTypeName_spd").attr("class","");$("#contactWay_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#chassisNumber_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==8){
                        $("#coverTypeName_spd").attr("class","sort_asc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insurDate_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#chassisNumber_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==24){
                        $("#insurDate_spd").attr("class","sort_asc");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");$("#bfhj_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }else if(short==30){
                        $("#bfhj_spd").attr("class","sort_asc");$("#insurDate_spd").attr("class","");$("#contactWay_spd").attr("class","");$("#jqxrqEnd_spd").attr("class","");
                        $("#principal_spd").attr("class","");$("#insuranceCompName_spd").attr("class","");$("#chassisNumber_spd").attr("class","");$("#carLicenseNumber_spd").attr("class","");
                        $("#coverTypeName_spd").attr("class","");$("#insurNumber_spd").attr("class","");$("#contact_spd").attr("class","");
                        $("#jqxrqStart_spd").attr("class","");$("#clerk_spd").attr("class","");$("#insuranceWriter_spd").attr("class","");
                    }
                }
                this.spdSearchBtn();
            };
            //出单员禁用，审批单查询显示在续保专员里面
            $scope.spdSearchBtn=function(){
                $("#scmTitleTool").hide();
                var short=$scope.short;
                var shortmain=$scope.shortmain;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                var contact = $scope.spdSearch.contact;
                var contactWay = $scope.spdSearch.contactWay;
                var carLicenseNumber = $scope.spdSearch.carLicenseNumber;
                var chassisNumber = $scope.spdSearch.chassisNumber;
                var billFlag = $scope.spdSearch.billFlag;
                if($scope.searchMoreStatus ==true){
                    $scope.startNum3 = 1; //开始页
                }
                $scope.spdSearch.data = [];
                var spdDatas = {
                    fourSStoreId:fourSStoreId,contact:contact,contactWay:contactWay,
                    carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,
                };

                $("#msgwindow").show();
                policyIWService.getSpdByCondition(spdDatas,$scope.startNum3,billFlag,short,shortmain).then(function(result){
                    $("#msgwindow").hide();
                    if(result.status == 'OK'&&result.results.success==true){
                        $scope.spdSearch.data = result.results.content.result;
                        $scope.spdSearchCount = result.results.content.policyCount;
                        $scope.getspdSearchPage();
                    }else{
                        $scope.angularTip("审批单查询失败",5000);
                    }
                });
            }
            //赠品信息
            $scope.giftDetailAllPage = {}
            $scope.giftDetailAllPage = {
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
                    { name: '数量', field: 'amount',enableColumnMenu: false},
                    { name: '金额', field: 'amountMoney',width:70,enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false}
                ]
            };
            //查询审批单明细
            $scope.SpdDetails=function(id,flag,insurDate) {
                var billFlag;
                //如果flag=1表示查询的是保单的审批单明细,flag=2表示查询的是审批单的明细
                if(flag==1){
                    billFlag = 1;
                }else{
                    billFlag = $scope.spdSearch.billFlag;
                }
                if(id){
                    $scope.spddetail = {};
                    policyIWService.getSpdById(id,billFlag).then(function (result) {
                        if (result.status=='OK'&&result.results.content.status == 'OK') {
                            $scope.spddetail = result.results.content.result;
                            $scope.zsxxAll = result.results.content.result.givingInformations;
                            $scope.giftDetailAllPage.data = result.results.content.result.givingInformations;
                            //保险公司
                            for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                if ($scope.insuranceCompNames[i].insuranceCompName == $scope.spddetail.insuranceCompName) {
                                    $scope.spddetail.insuranceCompName = $scope.insuranceCompNames[i];
                                    // 三者 划痕 玻璃 司机 乘客 费用 指定
                                    var typeNameQuota = "";
                                    var typeNameQuotaArr = [];
                                    var chesun = 0;
                                    var sanzhe = 0;
                                    var huahen = 0;
                                    var boli  = 0;
                                    var siji  = 0;
                                    var chengke  = 0;
                                    var feiyong = 0;
                                    var zhiding = 0;
                                    var jingshen = 0;
                                    var huowu = 0;
                                    $scope.insuTypeList = $scope.spddetail.insurancTypes.split(",");
                                    for (var j = 0; j < $scope.insuTypeList.length; j++) {
                                        if($scope.insuTypeList[j].indexOf("-") > -1){
                                            typeNameQuota = $scope.insuTypeList[j];
                                            typeNameQuotaArr = typeNameQuota.split("-");
                                            $scope.insuTypeList[j] = typeNameQuotaArr[0];
                                            if(typeNameQuotaArr[0].indexOf("车损")>-1){
                                                chesun =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("三者")>-1){
                                                sanzhe =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("划痕")>-1){
                                                huahen =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("玻璃")>-1){
                                                boli =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("司机")>-1){
                                                siji =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("乘客")>-1){
                                                chengke =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("费用")>-1){
                                                feiyong =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("指定")>-1){
                                                zhiding =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("货物")>-1){
                                                huowu =  typeNameQuotaArr[1]

                                            }else if(typeNameQuotaArr[0].indexOf("精神")>-1){
                                                jingshen =  typeNameQuotaArr[1]

                                            }
                                        }else{
                                            typeNameQuota = $scope.insuTypeList[j];
                                        }
                                    }
                                    if ($scope.spddetail.insuranceCompName) {
                                        var syxz = $scope.spddetail.insuranceCompName.insuranceTypes;
                                        $scope.spddetail.insuranceTypes = [];
                                        $scope.CheSun = "";
                                        $scope.SanZhe = "";
                                        $scope.SiJick = "";
                                        $scope.ChengKe = "";
                                        $scope.HuaHen = "";
                                        $scope.BoLi = "";
                                        $scope.HcHuoWuZeRen = "";
                                        $scope.HcJingShenSunShi = "";
                                        $scope.hcFeiYongBuChang = "";
                                        $scope.hcXiuLiBuChang = "";

                                        for (var i = 0; i < syxz.length; i++) {
                                            syxz[i].checkStatus=false;
                                            syxz[i].coverage = null;
                                            for (var j = 0; j < $scope.insuTypeList.length; j++) {
                                                //console.log(syxz[i].typeName +" " + $scope.insuTypeList[j].typeName)

                                                if (syxz[i].typeName == $scope.insuTypeList[j]) {
                                                    syxz[i].checkStatus = true;
                                                    syxz[i].coverage = $scope.insuTypeList[j].coverage;

                                                    if($scope.insuTypeList[j].indexOf("车损")>-1 && chesun>0){
                                                        $scope.CheSun = parseInt(chesun);
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("三者")>-1 && sanzhe>0){

                                                        $scope.SanZhe = parseInt(sanzhe);
                                                        // console.log(" 三者 " + $scope.SanZhe)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("划痕")>-1 && huahen>0){

                                                        $scope.HuaHen = parseInt(huahen);
                                                        // console.log(" 划痕 " + $scope.HuaHen)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("玻璃")>-1){

                                                        $scope.BoLi = parseInt(boli);
                                                        //  console.log(" 玻璃 " + $scope.BoLi)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("司机")>-1 && siji>0){
                                                        $scope.SiJick = parseInt(siji);
                                                        // console.log(" 司机 " + $scope.SiJick)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("乘客")>-1 && chengke>0){

                                                        $scope.ChengKe = parseInt(chengke);
                                                        // console.log("乘客 " + $scope.ChengKe)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("费用")>-1 && feiyong>0){
                                                        $scope.hcFeiYongBuChang = parseInt(feiyong);
                                                        // console.log("费用 " + $scope.hcFeiYongBuChang)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("指定")>-1 && zhiding>0){
                                                        $scope.hcXiuLiBuChang = parseInt(zhiding);
                                                        // console.log("指定 " + $scope.hcXiuLiBuChang)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("货物")>-1 && feiyong>0){
                                                        $scope.HcHuoWuZeRen = parseInt(huowu);
                                                        // console.log("货物 " + $scope.HcHuoWuZeRen)
                                                    }
                                                    if($scope.insuTypeList[j].indexOf("精神")>-1 && zhiding>0){
                                                        $scope.HcJingShenSunShi = parseInt(jinghsen);
                                                        // console.log("精神 " + $scope.HcJingShenSunShi)
                                                    }
                                                }
                                            }
                                            $scope.spddetail.insuranceTypes.push(syxz[i]);
                                        }
                                    }
                                }else {
                                    for (var j = 0; j < $scope.insuranceCompNames[i].insuranceTypes.length; j++) {
                                        $scope.insuranceCompNames[i].insuranceTypes[j].coverage = null;
                                    }
                                }
                            }
                            $scope.spddetail.insuranceCompName = $scope.spddetail.insuranceCompName.insuranceCompName;
                            if(billFlag == 1){
                                for(var i=0;i<$scope.giftDetailAllPage.data.length;i++){
                                    if($scope.giftDetailAllPage.data[i].givingInformationId!=0){
                                        $scope.giftDetailAllPage.data.splice($scope.giftDetailAllPage.data.indexOf($scope.giftDetailAllPage.data[i]), 1);
                                        i=i-1;
                                    }
                                }
                            }  //无保单的审批单不用过滤礼包
                            for(var j=0;j<$scope.giftDetailAllPage.data.length;j++){
                                $scope.giftDetailAllPage.data[j].index = j+1;
                            }
                            //在此添加校验，去年有审批单，今年直接出单会导致主键冲突，后台修改后，前台可以查出来，现在通过投保日期来校验  2018-06-26yujaintong
                            var time=new Date(insurDate);
                            var insyTime=new Date($scope.spddetail.insurDate);
                            if(time.getFullYear()==insyTime.getFullYear()){
                                $("#spdDetails").show();  //保单审批单弹框
                            }else{
                                $scope.angularTip("该保单无审批单记录",5000);
                            }
                        } else {

                        }
                    });
                }
                else {
                    $scope.angularTip("该保单无审批单记录",5000);
                }

            }
            //保单查询品牌车型选择框与输入框切换
            $scope.searchVehicleModel = function(){
                //$scope.search.vehicleModel='';
                //$scope.search.vehicleModelInput='';
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

            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
				$('select[multiple="multiple"]').multiselect('clearSelection');
                $('select[multiple="multiple"]').multiselect('refresh');
            }
            $scope.cleanSpd = function(){
                $scope.spdSearch = {};
                $scope.spdSearch.billFlag = 1;
            };

            //查询目录展开更多的按钮s
            $("#morebtn").click(function(){
                $("#searchDivTr2").toggle();
                if($("#searchDivTr2").is(":hidden")){
                    var newHeight = $("#myTabContent").height()-130;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }else{
                    var newHeight = $("#myTabContent").height()-194;
                    angular.element(document.getElementsByClassName('gridSearchbox')[0]).css('height', newHeight + 'px');
                }
            });

            //新增保单弹框
            $scope.newCustomerbtn=function(){
                $("#newPolicy").show();
            }

            //投保类型下拉框
            $('#example-getting-started').multiselect({
                nonSelectedText: '请选择',
                nSelectedText: '已选择',
                allSelectedText: '全选'
            });
            //续保专员新增保单操做(以下方法)

            //获取出单信息
            $scope.getCarInsuranceInfo = function() {
                var insuranceCompName = $scope.newsingle.insuranceCompName;
                var carLicenseNumber =$scope.newsingle.carLicenseNumber;
                var chassisNumber =$scope.newsingle.chassisNumber;
                if(typeof insuranceCompName == 'undefined' || insuranceCompName == '' || insuranceCompName == null){
                    $scope.angularTip("请选择保险公司",5000);
                    return;
                }
                var bxId = '';
                if(insuranceCompName.insuranceCompName == '人保'){
                    bxId = 'picc';
                }else if(insuranceCompName.insuranceCompName == '平安'){
                    bxId = 'pingan';
                }else if(insuranceCompName.insuranceCompName == '太平洋'){
                    bxId = 'cpic';
                }else{
                    $scope.angularTip("暂不支持该保险公司,请选择别的保险公司",5000);
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

                $("#msgwindow").show();
                policyIWService.getCarInsuranceInfo(condition).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK'){
                        var result = res.results.content.results;
                        if(result && result != null && result != ''){
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
                                $scope.newsingle.syxrqEnd = result.commercialInsuransVo.stEndDate;
                                //获取到的商业险险种信息
                                var syxArrays = result.commercialInsuransVo.quoteInsuranceVos;
                                //保险公司
                                for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                                    if ($scope.insuranceCompNames[i].insuranceCompName == $scope.newsingle.insuranceCompName.insuranceCompName) {
                                        if ($scope.newsingle.insuranceCompName) {
                                            //该保险公司的所有商业险种
                                            var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                                            $scope.newsingle.insuranceTypes = [];
                                            for (var i = 0; i < syxz.length; i++) {
                                                syxz[i].checkStatus=false;
                                                syxz[i].coverage = null;
                                                for (var j = 0; j < syxArrays.length; j++) {
                                                    if((syxz[i].typeName == '车损' && syxArrays[j].insuranceCode == '01')
                                                        || (syxz[i].typeName == '三者' && syxArrays[j].insuranceCode == '02')
                                                        || (syxz[i].typeName == '盗抢' && syxArrays[j].insuranceCode == '05')
                                                        || (syxz[i].typeName == '划痕' && syxArrays[j].insuranceCode == '08')
                                                        || (syxz[i].typeName == '玻璃' && syxArrays[j].insuranceCode == '06')
                                                        || (syxz[i].typeName == '自燃' && syxArrays[j].insuranceCode == '07')
                                                        || (syxz[i].typeName == '无法找到第三方' && syxArrays[j].insuranceCode == '14')
                                                        || (syxz[i].typeName == '涉水' && syxArrays[j].insuranceCode == '09')
                                                        || (syxz[i].typeName == '指定特约店维修险' && syxArrays[j].insuranceCode == '13')
                                                        || (syxz[i].typeName == '新增设备' && syxArrays[j].insuranceCode == '15')){
                                                        syxz[i].checkStatus = true;
                                                        var amount = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                        syxz[i].coverage = amount;
                                                    } else if(syxz[i].typeName == '车上人员' && (syxArrays[j].insuranceCode == '03' || syxArrays[j].insuranceCode == '04')){
                                                        syxz[i].checkStatus = true;
                                                        var amount = syxArrays[j].amount && syxArrays[j].amount !='' ? parseFloat(syxArrays[j].amount) : 0;
                                                        syxz[i].coverage += amount;
                                                    } else if(syxz[i].typeName == '不计免赔' && syxArrays[j].isDeductible && typeof syxArrays[j].isDeductible != 'undefined'){
                                                        syxz[i].checkStatus = true;
                                                        //只要发现买了任意一种不计免赔险种,不计免赔就勾上
                                                        break;
                                                    }
                                                }
                                                $scope.newsingle.insuranceTypes.push(syxz[i]);
                                            }
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
                        $scope.angularTip("获取出单成功，请核实是否为最新信息",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                    }
                });
            }

            //提交新增保单信息
            $scope.submit = function() {
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
                var xjyhdw =$scope.newsingle.xjyhdw;
                var czkje =$scope.newsingle.czkje;
                var czkjedw =$scope.newsingle.czkjedw;
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
                var sfdk =$scope.newsingle.sfdk;
                var profit = $scope.newsingle.profit;
                var insurDate =$scope.newsingle.insurDate;
                if(insurDate == ""||insurDate == null){
                    insurDate = undefined;
                }
                var syxrqStart = $scope.newsingle.syxrqStart||null;
                if(syxrqStart != ""&&syxrqStart!=null){
                    syxrqStart =$filter('date')(new Date($scope.newsingle.syxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var syxrqEnd =$scope.newsingle.syxrqEnd;
                var jqxrqStart = $scope.newsingle.jqxrqStart||null;
                if(jqxrqStart != ""&&jqxrqStart!=null){
                    jqxrqStart =$filter('date')(new Date($scope.newsingle.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var jqxrqEnd =$scope.newsingle.jqxrqEnd;
                var qnbe =$scope.newsingle.qnbe;
                var qnsyxje =$scope.newsingle.qnsyxje;
                var qnjqxje =$scope.newsingle.qnjqxje;
                var qnccsje =$scope.newsingle.qnccsje;
                var invoiceName =$scope.newsingle.invoiceName;
                var giftDiscount =$scope.newsingle.giftDiscount;
                var insuranceCompName = null;
                if($scope.newsingle.insuranceCompName){
                    insuranceCompName = $scope.newsingle.insuranceCompName.insuranceCompName;
                }

                //办理人员
                //出单员禁用，此处续保专员自己新增保单,负责人是自己
                var principal = $rootScope.user.userName;
                var principalId = $rootScope.user.userId;
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
                var customerSource =$scope.newsingle.customerSource;
                var customerCharacter =$scope.newsingle.customerCharacter;
                var address =$scope.newsingle.address;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                var reg = /^[a-zA-Z0-9]{17}$/ ;
                //验证表单信息
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                }
                var regDate = /^(\d{4})-(\d{2})-(\d{2})$/;
                /* if (jqxrqStart&&!regDate.test(jqxrqStart)){
                     $scope.angularTip("请保证交强险开始日期格式为yyyy-mm-dd",5000);
                     return ;
                 }
                 if (syxrqStart&&!regDate.test(syxrqStart)){
                     $scope.angularTip("请保证商业险开始日期格式为yyyy-mm-dd",5000);
                     return ;
                 }*/
                if(!reg.test(chassisNumber)){
                    $scope.angularTip("车架号错误，应为17位字母或数字组成",5000);
                    return;
                }
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
                if(identifying==0){
                    if(jqxrqStart != ''&&jqxrqStart!=null){
                        if(new Date(jqxrqStart).toISOString().substring(0,10) <= new Date(new Date().setMonth(new Date().getMonth() - 3 )).toISOString().substring(0,10)){
                            $scope.angularTip("交强险开始日期不能为3个月以前",5000);
                            return;
                        } else if (new Date(jqxrqStart).toISOString().substring(0,10) >= new Date( new Date().setDate(new Date().getDate()+95)).toISOString().substring(0,10)){
                            $scope.angularTip("交强险开始日期不能为3个月以后",5000);
                            return;
                        }
                    }
                }
                if(identifying==1){
                    if(typeof jqxrqStart != 'undefined'){
                        if(new Date(jqxrqStart).toISOString().substring(0,10) >= new Date(new Date().setMonth(new Date().getMonth() - 3 )).toISOString().substring(0,10)){
                            $scope.angularTip("新增历史保单，交强险开始日期只能为3个月以前",5000);
                            return;
                        }
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
                var insuredQuota = {"cheSun" : cheSunBX ,"sanZhe" : sanZheBX , "siJi" : siJiBX, "chengKe" : chengKeBX , "huaHen" : huahenBX ,
                    "boLi" : boLiBX , "huoWu" : huoWuBX , "jingShenSunShi" : jingShenSunShiBX , "feiYongBuChang" : feiYongBuChangBX ,
                    "zhiDingXiuLi" : zhiDingXiuLiBX}
                var insuranceType = '';
                if($scope.newsingle.insuranceTypes){
                    var xz = $scope.newsingle.insuranceTypes;
                    var insuTypes = [];
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].checkStatus == true){
                            if(insuranceType==''){
                                insuranceType = xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insuranceType = insuranceType+':'+xz[i].coverage;
                                }
                            }else{
                                insuranceType = insuranceType + ','+ xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insuranceType = insuranceType+':'+xz[i].coverage;
                                }
                            }
                            insuTypes.push(xz[i]);
                        }
                    }
                    if($scope.approvalBillAll!=null){
                        $scope.approvalBillAll.insurancTypes = insuranceType;
                    }
                }


                var remark =$scope.newsingle.remark;

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
                    qnbe:qnbe,qnsyxje:qnsyxje,qnjqxje:qnjqxje,
                    qnccsje:qnccsje,invoiceName:invoiceName,insuranceCompName:insuranceCompName,
                    insuranceType:insuranceType,remark:remark,
                    principal:principal,principalId:principalId,clerk:clerk,
                    clerkId:clerkId,insuranceWriter:insuranceWriter,insuranceWriterId:insuranceWriterId,
                    solicitMember:solicitMember,solicitMemberId:solicitMemberId,cashier:cashier,
                    carOwner:carOwner,insured:insured,certificateNumber:certificateNumber,
                    contact:contact,contactWay:contactWay,customerSource:customerSource,
                    customerCharacter:customerCharacter,address:address,
                    fourSStoreId:fourSStoreId,foursStore:foursStore,sfdk:sfdk,giftDiscount:giftDiscount,
                    xjyhdw:xjyhdw,czkje:czkje,czkjedw:czkjedw
                };
                //此条件是为店里出交强险是保额为空或为0而添加（如果取消只需else中的方法）
                if((jqxrqStart!=null&&jqxrqStart!="") && (!cinsuranceCoverage||cinsuranceCoverage==''||cinsuranceCoverage==0)){
                    $("#jqbe").show();
                    $scope.jqxbe = function() {
                        $("#jqbe").hide();
                        if ($scope.customerLevel == 'S' && $scope.sleepCustomerPromptFlag == 0) {
                            $("#smqkjybd").show();
                            $scope.makesure = function () {
                                $("#smqkjybd").hide();
                                policyIWService.findExistBillThisMonth(chassisNumber, insurDate).then(function (res) {
                                    if (res.results.content.existCount > 0) {
                                        $("#jybdts").show();
                                        $scope.makesure = function () {
                                            $("#jybdts").hide();
                                            $("#msgwindow").show();
                                            policyIWService.addSingle(newSingleDatas, $scope.tracelistSave, $scope.approvalBillAll, identifying, insuTypes, insuredQuota).then(function (res) {
                                                $("#msgwindow").hide();
                                                if (res.status == 'OK' && res.results.success == true) {
                                                    $scope.newsingle = {};
                                                    $scope.tracelistSave = [];
                                                    $("#newsingle").hide();
                                                    $scope.angularTip("新增保单成功", 5000);
                                                } else {
                                                    $scope.angularTip(res.results.message, 5000);
                                                }
                                            });
                                        }
                                    } else {
                                        $("#msgwindow").show();
                                        policyIWService.addSingle(newSingleDatas, $scope.tracelistSave, $scope.approvalBillAll, identifying, insuTypes, insuredQuota).then(function (res) {
                                            $("#msgwindow").hide();
                                            if (res.status == 'OK' && res.results.success == true) {
                                                $scope.newsingle = {};
                                                $scope.tracelistSave = [];
                                                $("#newsingle").hide();
                                                $scope.angularTip("新增保单成功", 5000);
                                            } else {
                                                $scope.angularTip(res.results.message, 5000);
                                            }
                                        });
                                    }


                                });
                            }
                        }
                        else {
                            policyIWService.findExistBillThisMonth(chassisNumber, insurDate).then(function (res) {
                                if (res.results.content.existCount > 0) {
                                    $("#jybdts").show();
                                    $scope.makesure = function () {
                                        $("#jybdts").hide();
                                        $("#msgwindow").show();
                                        policyIWService.addSingle(newSingleDatas, $scope.tracelistSave, $scope.approvalBillAll, identifying, insuTypes, insuredQuota).then(function (res) {
                                            $("#msgwindow").hide();
                                            if (res.status == 'OK' && res.results.success == true) {
                                                $scope.newsingle = {};
                                                $scope.tracelistSave = [];
                                                $("#newsingle").hide();
                                                $scope.angularTip("新增保单成功", 5000);
                                            } else {
                                                $scope.angularTip(res.results.message, 5000);
                                            }
                                        });
                                    }
                                } else {
                                    $("#msgwindow").show();
                                    policyIWService.addSingle(newSingleDatas, $scope.tracelistSave, $scope.approvalBillAll, identifying, insuTypes, insuredQuota).then(function (res) {
                                        $("#msgwindow").hide();
                                        if (res.status == 'OK' && res.results.success == true) {
                                            $scope.newsingle = {};
                                            $scope.tracelistSave = [];
                                            $("#newsingle").hide();
                                            $scope.angularTip("新增保单成功", 5000);
                                        } else {
                                            $scope.angularTip(res.results.message, 5000);
                                        }
                                    });
                                }


                            });
                        }
                        //出单后初始化提示标志
                        $scope.sleepCustomerPromptFlag = 0;
                    }
                }else{
                    if($scope.customerLevel=='S'&&$scope.sleepCustomerPromptFlag==0){
                        $("#smqkjybd").show();
                        $scope.makesure = function(){
                            $("#smqkjybd").hide();
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
                                                $("#newsingle").hide();
                                                $scope.angularTip("新增保单成功",5000);
                                            }else{
                                                $scope.angularTip(res.results.message,5000);
                                            }
                                        });
                                    }
                                }else{
                                    $("#msgwindow").show();
                                    policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                        $("#msgwindow").hide();
                                        if(res.status == 'OK'&&res.results.success==true){
                                            $scope.newsingle = {};
                                            $scope.tracelistSave=[];
                                            $("#newsingle").hide();
                                            $scope.angularTip("新增保单成功",5000);
                                        }else{
                                            $scope.angularTip(res.results.message,5000);
                                        }
                                    });
                                }


                            });
                        }
                    }
                    else{
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
                                            $("#newsingle").hide();
                                            $scope.angularTip("新增保单成功",5000);
                                        }else{
                                            $scope.angularTip(res.results.message,5000);
                                        }
                                    });
                                }
                            }else{
                                $("#msgwindow").show();
                                policyIWService.addSingle(newSingleDatas,$scope.tracelistSave,$scope.approvalBillAll,identifying,insuTypes,insuredQuota).then(function(res){
                                    $("#msgwindow").hide();
                                    if(res.status == 'OK'&&res.results.success==true){
                                        $scope.newsingle = {};
                                        $scope.tracelistSave=[];
                                        $("#newsingle").hide();
                                        $scope.angularTip("新增保单成功",5000);
                                    }else{
                                        $scope.angularTip(res.results.message,5000);
                                    }
                                });
                            }


                        });
                    }
                    //出单后初始化提示标志
                    $scope.sleepCustomerPromptFlag = 0;
                }

            }

            //关闭新增保单窗口，并清除数据
            $scope.closeNewSingle = function(){
                $("#newsingle").hide();
                $scope.newsingle = {};
                $scope.tracelistSave=[];
                $scope.cleanSingleDetails();
            }

            //新增保单品牌与车型默认值
            $scope.newPolicymrbd = function (carBrand,vehicleModel){
                var sfyy = 0 ;
                $scope.carBrandsXBD = [];
                $scope.carBrandsXBD = $.extend(true, [], $scope.carBrands);
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName){
                        sfyy = 1;
                    }else if(carBrand==null||carBrand==''){
                        $("#clxhxz_xbd2").show();
                        $("#clxhsr_xbd2").hide();
                        return;
                    }
                }
                if(sfyy==0){
                    $scope.carBrandsXBD.push({brandName:carBrand})
                }
                for(var i = 0 ;i<$scope.carBrandsXBD.length;i++){
                    if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==0){
                        $("#clxhxz_xbd2").show();
                        $("#clxhsr_xbd2").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.carBrandsXBD[i].carModelList=[{modelName:vehicleModel}];
                        $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.searchsingle.vehicleModel = $scope.searchsingle.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsXBD[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_xbd2").show();
                        $("#clxhxz_xbd2").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                        $scope.searchsingle.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==1){
                        $("#clxhxz_xbd2").show();
                        $("#clxhsr_xbd2").hide();
                        $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                        for(var j = 0 ;j<$scope.searchsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.searchsingle.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsXBD[i].carModelList.push({modelName:vehicleModel});
                            $scope.searchsingle.carBrand = $scope.carBrandsXBD[i];
                        }
                        for(var j = 0 ;j<$scope.searchsingle.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.searchsingle.carBrand.carModelList[j].modelName){
                                $scope.searchsingle.vehicleModel = $scope.searchsingle.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }
            //保费合计计算
            $scope.bfhjjs2 = function(){
                var cinsuranceCoverage = $scope.searchsingle.cinsuranceCoverage||0;
                var vehicleTax = $scope.searchsingle.vehicleTax||0;
                var binsuranceCoverage = $scope.searchsingle.binsuranceCoverage||0;
                $scope.searchsingle.premiumCount = (cinsuranceCoverage + vehicleTax + binsuranceCoverage).toFixed(2);
                $scope.sjjejs2();
                $scope.sxfhj2(0);
                if(binsuranceCoverage!=0&&binsuranceCoverage!=null&&$scope.searchsingle.czkje!=null){
                    $scope.searchsingle.czkjedw = Math.round($scope.searchsingle.czkje/binsuranceCoverage*100)/100;
                }
            }

            //利润计算
            $scope.lrjs2 = function(){
                var factorageCount = $scope.searchsingle.factorageCount ||0;
                var privilegeSum = $scope.searchsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                if(factorageCount!= 0){
                    $scope.searchsingle.profit = (factorageCount - privilegeSum).toFixed(2);
                }
            }

            //实收金额计算
            $scope.sjjejs2 = function(){
                var syxje = $scope.searchsingle.binsuranceCoverage||0;
                var premiumCount = $scope.searchsingle.premiumCount||0;
                var privilegeSum = $scope.searchsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                $scope.searchsingle.realPay =  (premiumCount - privilegeSum).toFixed(2);
                $scope.sxfhj2(0);
                if(syxje!=0){
                    $scope.searchsingle.xjyhdw = Math.round(privilegeSum/syxje*100)/100;
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs2 = function(){
                var syxje = $scope.searchsingle.binsuranceCoverage||0;
                var xjyhdw = $scope.searchsingle.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.searchsingle.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.searchsingle.privilegeSum = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs2();
                }
            }
            //商业险保费＊ 参数设置内商业险手续费％＋  交强险保费＊参数设置内交强险手续费％（新保按新保的手续费，续保按续保的手续费
            //bxgssfgb=0代表不进行商业险种的拼装  bxgssfgb=1代表进行商业险种的拼装 bxgssfgb=2代表是从投保类型进入
            $scope.sxfhj2 = function(bxgssfgb){
                var cinsuranceCoverage = $scope.searchsingle.cinsuranceCoverage||0;
                var binsuranceCoverage = $scope.searchsingle.binsuranceCoverage||0;
                var coverType = $scope.searchsingle.coverType||0;
                var jqxsxfRate=$scope.searchsingle.jqxsxfRate;
                var syxsxfRate=$scope.searchsingle.syxsxfRate;
                if(jqxsxfRate!=0||syxsxfRate!=0){
                    cinsuranceCoverage = jqxsxfRate*cinsuranceCoverage/100;
                    binsuranceCoverage = syxsxfRate*binsuranceCoverage/100;
                    $scope.searchsingle.factorageCount = (cinsuranceCoverage + binsuranceCoverage).toFixed(2);
                }
                $scope.lrjs2();
                if(bxgssfgb==1){
                    $scope.syxzpz2();
                }
            }
            //商业险种拼装
            $scope.syxzpz2 = function(){
                $scope.searchsingle.insuranceTypes = [];
                if($scope.searchsingle.insuranceCompName){
                    var syxz = $scope.searchsingle.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                    }
                    $scope.searchsingle.insuranceTypes = syxz;
                }
            }

            //保费合计计算
            $scope.bfhjjs = function(){
                var cinsuranceCoverage = $scope.newsingle.cinsuranceCoverage||0;
                var vehicleTax = $scope.newsingle.vehicleTax||0;
                var binsuranceCoverage = $scope.newsingle.binsuranceCoverage||0;
                $scope.newsingle.premiumCount = (cinsuranceCoverage + vehicleTax + binsuranceCoverage).toFixed(2);
                $scope.sjjejs();
                $scope.sxfhj(0);
                if(binsuranceCoverage!=0&&binsuranceCoverage!=null&&$scope.newsingle.czkje!=null){
                    $scope.newsingle.czkjedw = Math.round($scope.newsingle.czkje/binsuranceCoverage*100)/100;
                }
            }

            //利润计算
            $scope.lrjs = function(){
                var factorageCount = $scope.newsingle.factorageCount ||0;
                var privilegeSum = $scope.newsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                if(factorageCount!= 0){
                    $scope.newsingle.profit = (factorageCount - privilegeSum).toFixed(2);
                }
            }

            //实收金额计算
            $scope.sjjejs = function(){
                var syxje = $scope.newsingle.binsuranceCoverage||0;
                var premiumCount = $scope.newsingle.premiumCount||0;
                var privilegeSum = $scope.newsingle.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                $scope.newsingle.realPay =  (premiumCount - privilegeSum).toFixed(2);
                $scope.sxfhj(0);
                if(syxje!=0){
                    $scope.newsingle.xjyhdw = Math.round(privilegeSum/syxje*100)/100;
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs = function(){
                var syxje = $scope.newsingle.binsuranceCoverage||0;
                var xjyhdw = $scope.newsingle.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.newsingle.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.newsingle.privilegeSum = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs();
                }
            }
            //商业险保费＊ 参数设置内商业险手续费％＋  交强险保费＊参数设置内交强险手续费％（新保按新保的手续费，续保按续保的手续费
            //bxgssfgb=0代表不进行商业险种的拼装  bxgssfgb=1代表进行商业险种的拼装 bxgssfgb=2代表是从投保类型进入
            $scope.sxfhj = function(bxgssfgb){
                var cinsuranceCoverage = $scope.newsingle.cinsuranceCoverage||0;
                var binsuranceCoverage = $scope.newsingle.binsuranceCoverage||0;
                var coverType = $scope.newsingle.coverType||0;
                var sfdk = $scope.newsingle.sfdk;
                if(sfdk==null||sfdk==''){
                    if(!(sfdk===0)){
                        sfdk=-1
                    }
                }
                if(bxgssfgb!=2&&sfdk==-1&&coverType==1){
                    $scope.angularTip("请选择是否贷款！",5000);return;
                }
                if(coverType!=1){
                    $scope.newsingle.sfdk = "";
                }else if(sfdk==-1){
                    $scope.newsingle.sfdk = 0;
                }else if(sfdk==1&&$scope.newsingle.insuranceCompName){
                    var sjf_dk = $scope.newsingle.insuranceCompName.factorages;
                    var dksjf = false;
                    for(var i = 0;i<$scope.newsingle.insuranceCompName.factorages.length;i++){
                        if(sjf_dk[i].insuName=='binsuranceNewLoan'){
                            dksjf = true;
                        }else if(sjf_dk[i].insuName=='cinsuranceNewLoan'){
                            dksjf = true;
                        }
                    }
                    if(dksjf == false){
                        var bxm = $scope.newsingle.insuranceCompName.insuranceCompName;
                        $scope.newsingle.insuranceCompName = undefined;
                        $scope.syxzpz();
                        $scope.newsingle.factorageCount = 0;
                        $scope.angularTip("“"+bxm+"”保险公司没有设置新保贷款手续费！",5000);return;
                    }
                }
                if($scope.newsingle.insuranceCompName&&coverType>0){
                    var sjf = $scope.newsingle.insuranceCompName.factorages;
                    for(var i = 0;i<$scope.newsingle.insuranceCompName.factorages.length;i++){
                        if(sjf[i].insuName=='binsuranceNew'&&coverType==1&&sfdk!=1){
                            binsuranceCoverage = sjf[i].insuPercent*binsuranceCoverage/100;
                        }else if(sjf[i].insuName=='cinsuranceNew'&&coverType==1&&sfdk!=1 ){
                            cinsuranceCoverage = sjf[i].insuPercent*cinsuranceCoverage/100;
                        }else if(sjf[i].insuName=='binsuranceNewLoan'&&coverType==1&&sfdk==1){
                            binsuranceCoverage = sjf[i].insuPercent*binsuranceCoverage/100;
                        }else if(sjf[i].insuName=='cinsuranceNewLoan'&&coverType==1&&sfdk==1 ){
                            cinsuranceCoverage = sjf[i].insuPercent*cinsuranceCoverage/100;
                        }else if(sjf[i].insuName=='binsurance'&&coverType!=1 ){
                            binsuranceCoverage = sjf[i].insuPercent*binsuranceCoverage/100;
                        }else if(sjf[i].insuName=='cinsurance'&&coverType!=1 ){
                            cinsuranceCoverage = sjf[i].insuPercent*cinsuranceCoverage/100;
                        }
                    }
                    $scope.newsingle.factorageCount = (cinsuranceCoverage + binsuranceCoverage).toFixed(2);
                }else {
                    $scope.newsingle.factorageCount = 0;
                }
                $scope.lrjs();
                if(bxgssfgb==1){
                    $scope.syxzpz();
                }
            }
            //商业险种拼装
            $scope.syxzpz = function(){

                $scope.newsingle.insuranceTypes = [];
                if($scope.newsingle.insuranceCompName){
                    var syxz = $scope.newsingle.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                        syxz[i].coverage=null;
                    }
                    $scope.newsingle.insuranceTypes = syxz;
                }
            };

            var identifying = 0;
            $scope.switch = function(obj) {
                var spans = $("#WindowTitleTab").find("span");
                spans.removeClass();
                spans.eq(obj).addClass("active");
                identifying = obj;
                $scope.billType = obj;
            }

            //新增保单弹框
            $scope.newPolicybtn=function(){
                $("#newsingle").show();
                $scope.xzVehicleModel();
                $scope.newsingle = {};
                $scope.tracelistNewPolicy.data = [];
                $scope.newsingle.insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                identifying = 0;
                var spans = $("#WindowTitleTab").find("span");
                spans.removeClass();
                spans.eq(0).addClass("active");
            }
            //新增保单品牌车型选择框与输入框切换
            $scope.xzVehicleModel = function(){
                $scope.newsingle.vehicleModel='';
                $scope.newsingle.vehicleModelInput='';
                if($scope.newsingle.carBrand){
                    if($scope.newsingle.carBrand.brandName=='异系'){
                        $("#clxhsr_xbd").show();
                        $("#clxhxz_xbd").hide();
                    }else{
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                    }
                }else {
                    $("#clxhxz_xbd").show();
                    $("#clxhsr_xbd").hide();
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
            //保存修改的保单信息
            $scope.saveUpdateSingle = function(){
                //车辆信息
                var carLicenseNumber = $scope.searchsingle.carLicenseNumber;
                var chassisNumber = $scope.searchsingle.chassisNumber;
                var engineNumber = $scope.searchsingle.engineNumber;
                var registrationDate = $scope.searchsingle.registrationDate;
                var carBrand = '';
                var vehicleModel = '';
                if($scope.searchsingle.carBrand){
                    carBrand = $scope.searchsingle.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.searchsingle.vehicleModelInput
                    }else if($scope.searchsingle.vehicleModel){
                        vehicleModel =$scope.searchsingle.vehicleModel.modelName;
                    }
                }
                //保单信息
                var binsuranceNumber = $scope.searchsingle.binsuranceNumber;
                var binsuranceCoverage = $scope.searchsingle.binsuranceCoverage;
                var vehicleTax = $scope.searchsingle.vehicleTax;
                var privilegePro = $scope.searchsingle.privilegePro||'';
                var renewalWay = $scope.searchsingle.renewalWay||'';
                var insurNumber = $scope.searchsingle.insurNumber;
                var cinsuranceNumber = $scope.searchsingle.cinsuranceNumber;
                var cinsuranceCoverage = $scope.searchsingle.cinsuranceCoverage;
                var premiumCount = $scope.searchsingle.premiumCount;
                var privilegeSum = $scope.searchsingle.privilegeSum;
                var donateCostCount = $scope.searchsingle.donateCostCount;
                var factorageCount = $scope.searchsingle.factorageCount;
                var realPay = $scope.searchsingle.realPay;
                var payWay = $scope.searchsingle.payWay||'';
                var sdfs = $scope.searchsingle.sdfs||'';
                var profit = $scope.searchsingle.profit;
                var coverType = $scope.searchsingle.coverType||'';
                var sfdk = $scope.searchsingle.sfdk;
                if(sfdk==null||sfdk==""){
                    if(!(sfdk===0)){
                        sfdk=-1
                    }
                }
                var insurDate = $scope.searchsingle.insurDate;
                var syxrqStart = $scope.searchsingle.syxrqStart||undefined;
                if(syxrqStart != undefined){
                    syxrqStart =$filter('date')(new Date($scope.searchsingle.syxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var syxrqEnd = $scope.searchsingle.syxrqEnd;
                var jqxrqStart = $scope.searchsingle.jqxrqStart||undefined;
                if(jqxrqStart != undefined){
                    jqxrqStart =$filter('date')(new Date($scope.searchsingle.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var jqxrqEnd = $scope.searchsingle.jqxrqEnd;
                var qnbe = $scope.searchsingle.qnbe;
                var qnsyxje = $scope.searchsingle.qnsyxje;
                var qnjqxje = $scope.searchsingle.qnjqxje;
                var qnccsje = $scope.searchsingle.qnccsje;
                var invoiceName = $scope.searchsingle.invoiceName;
                var giftDiscount = $scope.searchsingle.giftDiscount;
                var xjyhdw =$scope.searchsingle.xjyhdw;
                var czkje =$scope.searchsingle.czkje;
                var czkjedw =$scope.searchsingle.czkjedw;
                var insuranceCompName = '';
                if($scope.searchsingle.insuranceCompName){
                    insuranceCompName = $scope.searchsingle.insuranceCompName.insuranceCompName;
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

                var insuranceType = '';
                if($scope.searchsingle.insuranceTypes){
                    var xz = $scope.searchsingle.insuranceTypes;
                    var insuTypes = [];
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].checkStatus == true){
                            if(insuranceType==''){
                                insuranceType = xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insuranceType = insuranceType+':'+xz[i].coverage;
                                }
                            }else{
                                insuranceType = insuranceType + ','+ xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insuranceType = insuranceType+':'+xz[i].coverage;
                                }
                            }
                            if(xz[i].typeId =="64"&& xz[i].typeName.indexOf("-")<0){
                                if($("#chesun").val() > 0){
                                    var chesunNum =  $("#chesun").val();
                                    cheSunBX = chesunNum;
                                }else{
                                    cheSunBX =  0;
                                }
                                // console.log("车损  " + cheSunBX )
                            }
                            if(xz[i].typeId =="65" && xz[i].typeName.indexOf("-")<0){
                                if($("#sanzhe").val().indexOf(":") > -1){
                                    var sanzheNum =  $("#sanzhe").val().split(":")[1];
                                    sanZheBX = sanzheNum;
                                }else{
                                    sanZheBX =  0;
                                }
                                // console.log("三责 " + sanZheBX)
                            }
                            if(xz[i].typeId =="67"&& xz[i].typeName.indexOf("-")<0){
                                if($("#siji").val()> 100){
                                    var sijiNum =  $("#siji").val();
                                    siJiBX = sijiNum;
                                }else{
                                    siJiBX =  0;
                                }
                                // console.log("司机 " + siJiBX)
                            }
                            if(xz[i].typeId =="76"&& xz[i].typeName.indexOf("-")<0){
                                if($("#chengke").val() > 100){
                                    var chengkeNum =  $("#chengke").val();
                                    chengKeBX = chengkeNum;
                                }else{
                                    chengKeBX =  0;
                                }
                                // console.log("乘客  " + chengKeBX )
                            }
                            if(xz[i].typeId =="69"&& xz[i].typeName.indexOf("-")<0){
                                if($("#huahen").val().indexOf(":") > -1){
                                    var huahenNum =  $("#huahen").val().split(":")[1];
                                    huahenBX = huahenNum;
                                }else{
                                    huahenBX =  0;
                                }
                                //  console.log("划痕 " + huahenBX)
                            }
                            if(xz[i].typeId =="70"&& xz[i].typeName.indexOf("-")<0){
                                if($("#boli").val().indexOf(":") > -1){
                                    var boliNum =  $("#boli").val().split(":")[1];
                                    boLiBX = boliNum;
                                }else{
                                    boLiBX =  0;
                                }
                                //  console.log("玻璃 " + boLiBX)
                            }
                            if(xz[i].typeId =="79"&& xz[i].typeName.indexOf("-")<0){
                                if($("#huowu").val() > 100){
                                    var huowuNum =  $("#huowu").val();
                                    huoWuBX = huowuNum;
                                }else{
                                    huoWuBX =  0;
                                }
                                // console.log("货物 " + huoWuBX)
                            }
                            if(xz[i].typeId =="77"&& xz[i].typeName.indexOf("-")<0){
                                if($("#jingshen").val() > 10){
                                    var jingshenNum =  $("#jingshen").val();
                                    jingShenSunShiBX = jingshenNum;
                                }else{
                                    jingShenSunShiBX =  0;
                                }
                                //  console.log("精神损失 " + jingShenSunShiBX)
                            }
                            if(xz[i].typeId =="80"&& xz[i].typeName.indexOf("-")<0){
                                if($("#feiyong").val() > 10){
                                    var feiyongNum =  $("#feiyong").val();
                                    feiYongBuChangBX = feiyongNum;
                                }else{
                                    feiYongBuChangBX =  0;
                                }
                                // console.log("费用补偿 " + feiYongBuChangBX)
                            }
                            if(xz[i].typeId =="74"&& xz[i].typeName.indexOf("-")<0){
                                if($("#zhiding").val() > 10){
                                    var zhidingNum =  $("#zhiding").val();
                                    zhiDingXiuLiBX = zhidingNum;
                                }else{
                                    zhiDingXiuLiBX =  0;
                                }
                                // console.log("指定修理厂 " + zhiDingXiuLiBX)
                            }

                            insuTypes.push(xz[i]);
                        }
                    }
                }
                var remark =$scope.searchsingle.remark;

                //办理人员
                var principal = '';
                var principalId = -1;
                if($scope.searchsingle.principal){
                    principal = $scope.searchsingle.principal.userName;
                    principalId = $scope.searchsingle.principal.id;
                }
                var clerk = '';
                var clerkId = -1;
                if($scope.searchsingle.clerk){
                    clerk = $scope.searchsingle.clerk.userName;
                    clerkId = $scope.searchsingle.clerk.id;
                }
                var insuranceWriter=$scope.searchsingle.insuranceWriter;
                var insuranceWriterId =$scope.searchsingle.insuranceWriterId;
                var solicitMember = '';
                var solicitMemberId =-1;
                if($scope.searchsingle.solicitMember){
                    solicitMember = $scope.searchsingle.solicitMember.userName;
                    solicitMemberId = $scope.searchsingle.solicitMember.id;
                }

                var cashier =$scope.searchsingle.cashier;

                //客户信息
                var carOwner =$scope.searchsingle.carOwner;
                var insured =$scope.searchsingle.insured;
                var certificateNumber =$scope.searchsingle.certificateNumber;
                var contact =$scope.searchsingle.contact;
                var contactWay =$scope.searchsingle.contactWay;
                var customerSource =$scope.searchsingle.customerSource;
                var customerCharacter =$scope.searchsingle.customerCharacter;
                var address =$scope.searchsingle.address;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                var insuranceBillId = $scope.searchsingle.insuranceBillId;
                //验证表单信息
                var reg = /^[a-zA-Z0-9]{17}$/ ;
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                }
                if(!reg.test(chassisNumber)){
                    $scope.angularTip("车架号错误，应为17位字母或数字组成",5000);
                    return;
                }
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
                if(typeof syxrqEnd != 'undefined' && syxrqEnd != null){
                    if(syxrqStart>=syxrqEnd){
                        $scope.angularTip("商业险日期开始日期不能大于商业险日期结束日期",5000);
                        return;
                    }
                }
                if(typeof jqxrqEnd != 'undefined' && jqxrqEnd != null){
                    if(jqxrqStart>=jqxrqEnd){
                        $scope.angularTip("交强险日期开始日期不能大于交强险日期结束日期",5000);
                        return;
                    }
                }
                if(!contact||contact==''){
                    $scope.angularTip("联系人不能为空",5000);
                    return;
                }
                if(!contactWay||contactWay==''){
                    $scope.angularTip("联系方式不能为空",5000);
                    return;
                };

                if((syxrqStart!=null&&syxrqStart!="") && (!binsuranceCoverage||binsuranceCoverage==''||binsuranceCoverage==0)){
                        $scope.angularTip("商业险日期不为空,商业险保额不能为空",5000);
                        return;
                }
                if((binsuranceCoverage!=null&&binsuranceCoverage!="") && (!syxrqStart||syxrqStart=='')){
                    $scope.angularTip("商业险保额不为空,商业险日期不能为空",5000);
                    return;
                }
                var updateSingleDatas = {
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
                    insuranceType:insuranceType,remark:remark,
                    principal:principal,principalId:principalId,clerk:clerk,
                    clerkId:clerkId,insuranceWriter:insuranceWriter,insuranceWriterId:insuranceWriterId,
                    solicitMember:solicitMember,solicitMemberId:solicitMemberId,cashier:cashier,
                    carOwner:carOwner,insured:insured,certificateNumber:certificateNumber,
                    contact:contact,contactWay:contactWay,customerSource:customerSource,
                    customerCharacter:customerCharacter,address:address,sfdk:sfdk,
                    fourSStoreId:fourSStoreId,foursStore:foursStore,insuranceBillId:insuranceBillId,
                    xjyhdw:xjyhdw,czkje:czkje,czkjedw:czkjedw
                };
                var insuredQuota = {"cheSun" : cheSunBX ,"sanZhe" : sanZheBX , "siJi" : siJiBX, "chengKe" : chengKeBX , "huaHen" : huahenBX ,
                    "boLi" : boLiBX , "huoWu" : huoWuBX , "jingShenSunShi" : jingShenSunShiBX , "feiYongBuChang" : feiYongBuChangBX ,
                    "zhiDingXiuLi" : zhiDingXiuLiBX}
                //此条件是为店里出交强险是保额为空或为0而添加（如果取消只需else中的方法）
                if(jqxrqStart && !cinsuranceCoverage || cinsuranceCoverage==''||cinsuranceCoverage==0){
                    $("#jqbe").show();
                    $scope.jqxbe = function() {
                        $("#jqbe").hide();
                        policyIWService.updateInsuSingle(updateSingleDatas, insuTypes, insuredQuota).then(function (res) {
                            if (res.status == 'OK' && res.results.success == true) {
                                $("#singleDetails_noCdy").hide();
                                $scope.searchsingle = {};
                                $scope.tracelists = {};
                                $scope.angularTip("修改保单成功", 5000);
                                $scope.rowData.principal = principal;
                                $scope.rowData.clerk = clerk;
                                $scope.rowData.insurDate = insurDate;
                                $scope.rowData.insuranceCompName = insuranceCompName;
                                $scope.rowData.chassisNumber = chassisNumber.toLocaleUpperCase();
                                $scope.rowData.coverTypeName.coverTypeName = $filter('mapTBLX')(coverType);
                                $scope.rowData.insurNumber = insurNumber;
                                if (jqxrqStart != undefined) {
                                    $scope.rowData.jqxrqStart = $filter('date')(new Date(jqxrqStart), 'yyyy-MM-dd HH:mm:ss/EEE');
                                }

                            } else {
                                $scope.angularTip(res.results.message, 5000);
                            }
                        });
                    }
                }else{
                    policyIWService.updateInsuSingle(updateSingleDatas, insuTypes, insuredQuota).then(function (res) {
                        if (res.status == 'OK' && res.results.success == true) {
                            $("#singleDetails_noCdy").hide();
                            $scope.searchsingle = {};
                            $scope.tracelists = {};
                            $scope.angularTip("修改保单成功", 5000);
                            $scope.rowData.principal = principal;
                            $scope.rowData.clerk = clerk;
                            $scope.rowData.insurDate = insurDate;
                            $scope.rowData.insuranceCompName = insuranceCompName;
                            $scope.rowData.chassisNumber = chassisNumber.toLocaleUpperCase();
                            $scope.rowData.coverTypeName.coverTypeName = $filter('mapTBLX')(coverType);
                            $scope.rowData.insurNumber = insurNumber;
                            if (jqxrqStart != undefined) {
                                $scope.rowData.jqxrqStart = $filter('date')(new Date(jqxrqStart), 'yyyy-MM-dd HH:mm:ss/EEE');
                            }

                        } else {
                            $scope.angularTip(res.results.message, 5000);
                        }
                    });
                }
            };
            //商业险日期设定
            $scope.syxrqStartChangebd = function() {
                var setDate = $scope.searchsingle.syxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.searchsingle.syxrqEnd = undefined;
                }else{
                    $scope.searchsingle.syxrqEnd = $scope.GetDateStr(setDate);
                }
            };
            //交强险日期设定
            $scope.jqxrqStartChangebd = function() {
                var setDate = $scope.searchsingle.jqxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.searchsingle.jqxrqEnd = undefined;
                }else{
                    $scope.searchsingle.jqxrqEnd = $scope.GetDateStr(setDate);
                }
            };
            //日期计算方法
            $scope.GetDateStr = function(setDate)
            {
                var startDate =new Date(setDate);
                startDate.setFullYear(startDate.getFullYear()+1);
                var endDate=startDate.getTime()-(1000*60*60*24);
                var nextyear=$filter('date')(new Date(endDate),'yyyy-MM-dd 23:59:59');
                return nextyear;
            }
            //商业险日期设定
            $scope.syxrqStartChange = function() {
                var setDate = $scope.newsingle.syxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.newsingle.syxrqEnd = undefined;
                }else{
                    $scope.newsingle.syxrqEnd = $scope.GetDateStr(setDate);
                }
            }
            //交强险日期设定
            $scope.jqxrqStartChange = function() {
                var setDate = $scope.newsingle.jqxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.newsingle.jqxrqEnd = undefined;
                }else{
                    $scope.newsingle.jqxrqEnd = $scope.GetDateStr(setDate);
                }
            }

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
        }

    ]);

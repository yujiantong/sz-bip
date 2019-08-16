'use strict';
angular.module('myApp')
    .controller('policyRD_Controller',['$rootScope','$location','constant','$scope','$filter','policyRDService','$state','ExportExcel',
        function($rootScope,$location,constant,$scope,$filter,policyRDService,$state,ExportExcel){
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            $scope .searchPolicy={};
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
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];

            $scope.newPolicy={chassisNumber:''}
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            var host = $location.host();
            if($scope.storeId==122 || host==constant.bipServer){
                $scope.storetitle="传慧嘉和(北京)管理咨询有限公司";
            }else {
                $scope.storetitle="北京博福易商科技有限公司";
            }
            //报价
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
            //下拉列表数据初始化
            //按4s店ID查询车辆品牌车型信息
            policyRDService.findCarInfoByStoreId().then(function(res){
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
            policyRDService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            policyRDService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

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
                    { name: '车架号',field: 'chassisNumber',width:160,cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_xb" class=""></span></div>'},
                    { name: '车牌号',field: 'carLicenseNumber',cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_xb" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName.coverTypeName',width:100, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_xb" class=""></span></div>'},
                    { name: '本店承保次数', field: 'insurNumber',width:100,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(26)">本店承保次数&nbsp;&nbsp;&nbsp;<span id="insurNumber_xb" class=""></span></div>'},
                    { name: '保险开始日期', field: 'jqxrqStart',cellFilter: 'date:"yyyy-MM-dd HH:mm:ss/EEE"',width:160,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(27)">保险开始日期&nbsp;&nbsp;&nbsp;<span id="jqxrqStart_xb" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_xb" class=""></span></div>'},
                    { name: '出单员',  enableColumnMenu: false,width:100,allowCellFocus : false,enableSorting: false,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span>{{row.entity.insuranceWriter}}</span>'+
                        '<div class="rowButtons" style="width:300px;right:-300px">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.approvalBillId,1)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.deleteBill(row.entity)" class="btn btn-default btn-sm ">删除</button>'+
                        '</div></div>'}
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
                policyRDService.getSingleAll(covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll,short,shortmain)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
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
                    policyRDService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
                        .then(function (result) {
                            $("#msgwindow").hide();
                            if (result.status == 'OK') {
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

            //删除保单
            $scope.deleteBill = function(obj){
                $("#bdsc").show();
                $scope.makesure = function() {
                    $("#bdsc").hide();
                    $("#msgwindow").show();
                    policyRDService.deleteBill(obj.insuranceBillId).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.policyAllSearchPage.data.splice($scope.policyAllSearchPage.data.indexOf(obj), 1);
                            $scope.policySearchCount = $scope.policySearchCount - 1;
                            $scope.policyAllPage.data.splice($scope.policyAllPage.data.indexOf(obj), 1);
                            $("#policyCount").html($scope.policyCount - 1);
                            $scope.angularTip("删除成功", 5000);
                        } else {
                            $scope.angularTip(result.results.message, 5000);
                        }
                    });
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
            //查询更多
            $scope.getSingleByCovertypeMore = function(){
                $scope.policyAll.data=[];
                $("#msgwindow").show();
                policyRDService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.policyAll.data = result.result.content.results;
                            $scope.getPolicyPage();
                        } else {

                        }
                    });
            }

            //保单明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'0px'},500);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-300px'},100);
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
                $(".biptooltap").show();
                $scope.covertype = 0;
            }
            //右侧时间显示
            $scope.rightTitleTimeToolShow=function(){
                $("#scmTitleTool").show();
                $(".biptooltap").show();
            }

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
                    { name: '跟踪周期', field: 'traceClcye',enableColumnMenu: false},
                    { name: '跟踪次数', field: 'traceNumber',cellClass:'text-center',width:70, enableColumnMenu: false},
                    { name: '投保类型', field: 'coverType',cellFilter:'mapTBLX',width:80, enableColumnMenu: false},
                    { name: '是否邀约',field: 'isInvite',cellFilter:'mapSF',cellClass:'text-center',width:70,enableColumnMenu: false},
                    { name: '邀约次数', field: 'inviteNumber',cellClass:'text-center',width:70,enableColumnMenu: false},
                    { name: '是否邀约进店', field: 'isInviteToStore',cellFilter:'mapSF',cellClass:'text-center',width:100,enableColumnMenu: false,},
                    { name: '备注', field: 'remark',cellTooltip: true,enableColumnMenu: false},
                ],

                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
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
            //查询保单明细
            $scope.singleDetails=function(rowData) {
                $scope.policyInfoTracePage.data=[];
                $scope.searchPolicy = {};
                var insuranceBillId = rowData.insuranceBillId;
                $scope.rowData = rowData;
                $("#msgwindow").show();
                policyRDService.getSingleById(insuranceBillId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $("#singleDetails").show(); //保单明细弹框
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        $scope.insuTypeList = result.results.content.insuTypeList;
                        $scope.searchPolicy = result.results.content.insuranceBill;
                        var tracelists=result.results.content.tracelist;
                        $scope.searchPolicy.insurDate = $filter('date')($scope.searchPolicy.insurDate, 'yyyy-MM-dd');
                        $scope.searchPolicy.registrationDate = $filter('date')($scope.searchPolicy.registrationDate, 'yyyy-MM-dd');
                        if($scope.searchPolicy.syxrqStart!=null&&$scope.searchPolicy.syxrqStart!=""){
                            $scope.searchPolicy.syxrqStart = new Date($scope.searchPolicy.syxrqStart);
                        }
                        $scope.searchPolicy.syxrqEnd = $filter('date')($scope.searchPolicy.syxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                        if($scope.searchPolicy.jqxrqStart!=null&&$scope.searchPolicy.jqxrqStart!=""){
                            $scope.searchPolicy.jqxrqStart = new Date($scope.searchPolicy.jqxrqStart);
                        }
                        $scope.searchPolicy.jqxrqEnd = $filter('date')($scope.searchPolicy.jqxrqEnd, 'yyyy-MM-dd HH:mm:ss');
                        var traceIndex = 1;
                        for(var i=0;i<tracelists.length;i++){
                            tracelists[i].index = traceIndex;
                            $scope.policyInfoTracePage.data.push(tracelists[i])
                            traceIndex = traceIndex+1;
                        };
                        //负责人
                        for (var i = 0; i < $scope.kingdsUser.principal.length; i++) {
                            if ($scope.kingdsUser.principal[i].id == $scope.searchPolicy.principalId) {
                                $scope.searchPolicy.principal = $scope.kingdsUser.principal[i];
                            }
                        };
                        //业务员
                        for (var i = 0; i < $scope.kingdsUser.salesman.length; i++) {
                            if ($scope.kingdsUser.salesman[i].id == $scope.searchPolicy.clerkId) {
                                $scope.searchPolicy.clerk = $scope.kingdsUser.salesman[i];
                            }
                        };
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

                        var chesun = 0;
                        var sanzhe = 0;
                        var huahen = 0;
                        var boli  = 0;
                        var siji  = 0;
                        var chengke  = 0;
                        var feiyong = 0;
                        var zhiding = 0;

                        var typeNameQuota = "";
                        var typeNameQuotaArr = [];
                       // console.log("insuranceCompNames" + JSON.stringify($scope.insuranceCompNames))
                       // console.log("insuTypeList" + JSON.stringify($scope.insuTypeList))
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
                        //保险公司
                        for (var i = 0; i < $scope.insuranceCompNames.length; i++) {
                            if ($scope.insuranceCompNames[i].insuranceCompName == $scope.searchPolicy.insuranceCompName) {
                                $scope.searchPolicy.insuranceCompName = $scope.insuranceCompNames[i];
                                if ($scope.searchPolicy.insuranceCompName) {
                                    var syxz = $scope.searchPolicy.insuranceCompName.insuranceTypes;
                                    $scope.searchPolicy.insuranceTypes = [];
                                    for (var i = 0; i < syxz.length; i++) {
                                        syxz[i].checkStatus=false;
                                        syxz[i].coverage = null;

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

                                                }
                                            }else{
                                                typeNameQuota = $scope.insuTypeList[j].typeName;
                                            }
                                           // console.log("syxz typeName " + syxz[i].typeName + " insuType typeName " + $scope.insuTypeList[j].typeName)

                                            if (syxz[i].typeName == $scope.insuTypeList[j].typeName) {
                                                syxz[i].checkStatus = true;
                                                syxz[i].coverage = $scope.insuTypeList[j].coverage;
                                                if($scope.insuTypeList[j].typeName.indexOf("车损")>-1 && chesun>0){

                                                    $scope.CheSun = parseInt(chesun);
                                                    //  console.log(" 车损 " + $scope.SanZhe)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("三者")>-1 && sanzhe>0){

                                                    $scope.SanZhe = parseInt(sanzhe);
                                                  //  console.log(" 三者 " + $scope.SanZhe)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("划痕")>-1 && huahen>0){

                                                    $scope.HuaHen = parseInt(huahen);
                                                   // console.log(" 划痕 " + $scope.HuaHen)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("玻璃")>-1){

                                                    $scope.BoLi = parseInt(boli);
                                                   // console.log(" 玻璃 " + $scope.BoLi)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("司机")>-1 && siji>0){
                                                    $scope.SiJick = parseInt(siji);
                                                   // console.log(" 司机 " + $scope.SiJick)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("乘客")>-1 && chengke>0){

                                                    $scope.ChengKe = parseInt(chengke);
                                                    //console.log("乘客 " + $scope.ChengKe)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("费用")>-1 && feiyong>0){
                                                    $scope.hcFeiYongBuChang = parseInt(feiyong);
                                                   // console.log("费用 " + $scope.hcFeiYongBuChang)
                                                }
                                                if($scope.insuTypeList[j].typeName.indexOf("指定")>-1 && zhiding>0){
                                                    $scope.hcXiuLiBuChang = parseInt(zhiding);
                                                    //console.log("指定 " + $scope.hcXiuLiBuChang)
                                                }
                                            }
                                        }
                                        //console.log("遍历 " +  JSON.stringify(syxz[i]))
                                        $scope.searchPolicy.insuranceTypes.push(syxz[i]);

                                    }

                                }
                            }else {
                                for (var j = 0; j < $scope.insuranceCompNames[i].insuranceTypes.length; j++) {
                                    $scope.insuranceCompNames[i].insuranceTypes[j].coverage = null;
                                }
                            }
                        }
                        $scope.newPolicymr($scope.searchPolicy.carBrand, $scope.searchPolicy.vehicleModel);
                    } else {

                    }
                });
                $scope.savePolicyChangefun();

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
                policyRDService.findRecord(insuranceBillId).then(function (result) {
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
                    { name: '车架号',field: 'chassisNumber',width:160,cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(6)">车架号&nbsp;&nbsp;&nbsp;<span id="chassisNumber_bd" class=""></span></div>'},
                    { name: '车牌号',field: 'carLicenseNumber',cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(7)">车牌号&nbsp;&nbsp;&nbsp;<span id="carLicenseNumber_bd" class=""></span></div>'},
                    { name: '投保类型', field: 'coverTypeName.coverTypeName',width:100, enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(8)">投保类型&nbsp;&nbsp;&nbsp;<span id="coverTypeName_bd" class=""></span></div>'},
                    { name: '本店承保次数', field: 'insurNumber',width:100,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(26)">本店承保次数&nbsp;&nbsp;&nbsp;<span id="insurNumber_bd" class=""></span></div>'},
                    { name: '保险开始日期', field: 'jqxrqStart',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(27)">保险开始日期&nbsp;&nbsp;&nbsp;<span id="jqxrqStart_bd" class=""></span></div>'},
                    { name: '联系人', field: 'contact',enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(4)">联系人&nbsp;&nbsp;&nbsp;<span id="contact_bd" class=""></span></div>'},
                    { name: '出单员',  enableColumnMenu: false,width:100,allowCellFocus : false,enableSorting: false,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<span>{{row.entity.insuranceWriter}}</span>'+
                        '<div class="rowButtons" style="width:300px;right:-300px">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.approvalBillId,1)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.deleteBill(row.entity)" class="btn btn-default btn-sm ">删除</button>'+
                        '</div></div>'}
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
                var coverTypes = $scope.search.coverType;;
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
                    policyRDService.getSingleByCondition(searchDatas,$scope.startNum2).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK' &&result.result.success==true){
                            $scope.policyAllSearch.data = result.result.content.results;
                            $scope.policySearchCount = result.result.content.policyCount;
                            $scope.getPolicySearchPage();

                        }else{
                            $scope.angularTip("查询失败",5000);
                        }
                    });
                }
            };

            //保存修改的保单信息
            $scope.savePolicyChangefun = function(){
                $scope.PolicyValuebol = false;
                $(".changeValue").find("input").change(function(){
                    $scope.PolicyValuebol = true;
                });
                $(".changeValue").find("textarea").change(function(){
                    $scope.PolicyValuebol = true;
                });
                $(".changeValue").find("select").change(function(){
                    $scope.PolicyValuebol = true;
                });
            };
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


            //数据改变了是否保存
            $scope.savePolicyChangeBtn = function(){
                if ($scope.PolicyValuebol == true) {
                    $("#changePolicy").show();
                }else {
                    $("#singleDetails").hide();
                    $scope.searchPolicy ={};
                    $scope.tracelists = {};
                };
            }

            //保存修改的保单信息
            $scope.saveUpdateSingle = function(){
                $("#changePolicy").hide();
                //车辆信息
                var carLicenseNumber = $scope.searchPolicy.carLicenseNumber;
                var chassisNumber = $scope.searchPolicy.chassisNumber;
                var engineNumber = $scope.searchPolicy.engineNumber;
                var registrationDate = $scope.searchPolicy.registrationDate;
                var carBrand = '';
                var vehicleModel = '';
                if($scope.searchPolicy.carBrand){
                    carBrand = $scope.searchPolicy.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.searchPolicy.vehicleModelInput
                    }else if($scope.searchPolicy.vehicleModel){
                        vehicleModel =$scope.searchPolicy.vehicleModel.modelName;
                    }
                }
                //保单信息
                var binsuranceNumber = $scope.searchPolicy.binsuranceNumber;
                var binsuranceCoverage = $scope.searchPolicy.binsuranceCoverage;
                var vehicleTax = $scope.searchPolicy.vehicleTax;
                var privilegePro = $scope.searchPolicy.privilegePro||'';
                var renewalWay = $scope.searchPolicy.renewalWay||'';
                var insurNumber = $scope.searchPolicy.insurNumber;
                var cinsuranceNumber = $scope.searchPolicy.cinsuranceNumber;
                var cinsuranceCoverage = $scope.searchPolicy.cinsuranceCoverage;
                var premiumCount = $scope.searchPolicy.premiumCount;
                var privilegeSum = $scope.searchPolicy.privilegeSum;
                var donateCostCount = $scope.searchPolicy.donateCostCount;
                var factorageCount = $scope.searchPolicy.factorageCount;
                var realPay = $scope.searchPolicy.realPay;
                var payWay = $scope.searchPolicy.payWay||'';
                var sdfs = $scope.searchPolicy.sdfs||'';
                var profit = $scope.searchPolicy.profit;
                var coverType = $scope.searchPolicy.coverType||'';
                var sfdk = $scope.searchPolicy.sfdk;
                if(sfdk==null||sfdk==""){
                    if(!(sfdk===0)){
                        sfdk=-1
                    }
                }
                var insurDate = $scope.searchPolicy.insurDate;
                var syxrqStart = $scope.searchPolicy.syxrqStart||undefined;
                if(syxrqStart != undefined){
                    syxrqStart =$filter('date')(new Date($scope.searchPolicy.syxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var syxrqEnd = $scope.searchPolicy.syxrqEnd;
                var jqxrqStart = $scope.searchPolicy.jqxrqStart||undefined;
                if(jqxrqStart != undefined){
                    jqxrqStart =$filter('date')(new Date($scope.searchPolicy.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                }
                var jqxrqEnd = $scope.searchPolicy.jqxrqEnd;
                var qnbe = $scope.searchPolicy.qnbe;
                var qnsyxje = $scope.searchPolicy.qnsyxje;
                var qnjqxje = $scope.searchPolicy.qnjqxje;
                var qnccsje = $scope.searchPolicy.qnccsje;
                var invoiceName = $scope.searchPolicy.invoiceName;
                var giftDiscount = $scope.searchPolicy.giftDiscount;
                var xjyhdw =$scope.searchPolicy.xjyhdw;
                var czkje =$scope.searchPolicy.czkje;
                var czkjedw =$scope.searchPolicy.czkjedw;
                var insuranceCompName = '';
                if($scope.searchPolicy.insuranceCompName){
                    insuranceCompName = $scope.searchPolicy.insuranceCompName.insuranceCompName;
                }
                var insuranceType = '';
                if($scope.searchPolicy.insuranceTypes){
                    var xz = $scope.searchPolicy.insuranceTypes;
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
                                // console.log("车损 " + cheSunBX)
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
                              //  console.log("乘客  " + chengKeBX )
                            }
                            if(xz[i].typeId =="69"&& xz[i].typeName.indexOf("-")<0){
                                if($("#huahen").val().indexOf(":") > -1){
                                    var huahenNum =  $("#huahen").val().split(":")[1];
                                    huahenBX = huahenNum;
                                }else{
                                    huahenBX =  0;
                                }
                               // console.log("划痕 " + huahenBX)
                            }
                            if(xz[i].typeId =="70"&& xz[i].typeName.indexOf("-")<0){
                                if($("#boli").val().indexOf(":") > -1){
                                    var boliNum =  $("#boli").val().split(":")[1];
                                    boLiBX = boliNum;
                                }else{
                                    boLiBX =  0;
                                }
                                //console.log("玻璃 " + boLiBX)
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
                               // console.log("精神损失 " + jingShenSunShiBX)
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
                var remark =$scope.searchPolicy.remark;

                //办理人员
                var principal = '';
                var principalId = -1;
                if($scope.searchPolicy.principal){
                    principal = $scope.searchPolicy.principal.userName;
                    principalId = $scope.searchPolicy.principal.id;
                }
                var clerk = '';
                var clerkId = -1;
                if($scope.searchPolicy.clerk){
                    clerk = $scope.searchPolicy.clerk.userName;
                    clerkId = $scope.searchPolicy.clerk.id;
                }
                var insuranceWriter=$scope.searchPolicy.insuranceWriter;
                var insuranceWriterId =$scope.searchPolicy.insuranceWriterId;
                var solicitMember = '';
                var solicitMemberId =-1;
                if($scope.searchPolicy.solicitMember){
                    solicitMember = $scope.searchPolicy.solicitMember.userName;
                    solicitMemberId = $scope.searchPolicy.solicitMember.id;
                }

                var cashier =$scope.searchPolicy.cashier;

                //客户信息
                var carOwner =$scope.searchPolicy.carOwner;
                var insured =$scope.searchPolicy.insured;
                var certificateNumber =$scope.searchPolicy.certificateNumber;
                var contact =$scope.searchPolicy.contact;
                var contactWay =$scope.searchPolicy.contactWay;
                var customerSource =$scope.searchPolicy.customerSource;
                var customerCharacter =$scope.searchPolicy.customerCharacter;
                var address =$scope.searchPolicy.address;
                var fourSStoreId = $rootScope.user.store.storeId;
                var foursStore = $rootScope.user.store.storeName;
                var insuranceBillId = $scope.searchPolicy.insuranceBillId;
                //验证表单信息
                var reg = /^[a-zA-Z0-9]{17}$/ ;
                if(!chassisNumber||chassisNumber==''){
                    $scope.angularTip("车架号不能为空",5000);
                    return;
                };
                if(jqxrqStart && !cinsuranceCoverage || cinsuranceCoverage==''){
                    if(cinsuranceCoverage!=0){
                        $scope.angularTip("交强险日期不为空,交强险保额不能为空",5000);
                        return;
                    }
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
                    xjyhdw:xjyhdw,czkje:czkje,czkjedw:czkjedw,
                    fourSStoreId:fourSStoreId,foursStore:foursStore,insuranceBillId:insuranceBillId
                };
                var insuredQuota = {"cheSun" : cheSunBX ,"sanZhe" : sanZheBX , "siJi" : siJiBX, "chengKe" : chengKeBX , "huaHen" : huahenBX ,
                    "boLi" : boLiBX , "huoWu" : huoWuBX , "jingShenSunShi" : jingShenSunShiBX , "feiYongBuChang" : feiYongBuChangBX ,
                    "zhiDingXiuLi" : zhiDingXiuLiBX}
                policyRDService.updateInsuSingle(updateSingleDatas,insuTypes,insuredQuota).then(function(res){
                 if(res.status == 'OK'&&res.results.success==true){
                     $("#singleDetails").hide();
                     $scope.searchPolicy ={};
                     $scope.tracelists = {};
                     $scope.angularTip("修改保单成功",5000);
                     $scope.rowData.principal = principal;
                     $scope.rowData.clerk = clerk;
                     $scope.rowData.insurDate = insurDate;
                     $scope.rowData.insuranceCompName = insuranceCompName;
                     $scope.rowData.chassisNumber = chassisNumber.toLocaleUpperCase();
                     $scope.rowData.coverTypeName.coverTypeName = $filter('mapTBLX')(coverType);
                     $scope.rowData.insurNumber = insurNumber;
                     if(jqxrqStart != undefined){
                         $scope.rowData.jqxrqStart = $filter('date')(new Date(jqxrqStart),'yyyy-MM-dd HH:mm:ss/EEE');
                     }
                 }else{
                     $scope.angularTip(res.results.message,5000);
                    }
                 });
            };

            //取消保存修改的保单信息
            $scope.cancelChangePolicy = function(){
                $("#changePolicy").hide();
                $("#singleDetails").hide();
                $scope.searchPolicy ={};
                $scope.tracelists = {};
            };

            //日期计算方法
            $scope.GetDateStr = function(setDate)
            {
                var startDate =new Date(setDate);
                startDate.setFullYear(startDate.getFullYear()+1);
                var endDate=startDate.getTime()-(1000*60*60*24);
                var nextyear=$filter('date')(new Date(endDate),'yyyy-MM-dd 23:59:59');
                return nextyear;
            };
            //商业险日期设定
            $scope.syxrqStartChange = function() {
                var setDate = $scope.searchPolicy.syxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.searchPolicy.syxrqEnd = undefined;
                }else{
                    $scope.searchPolicy.syxrqEnd = $scope.GetDateStr(setDate);
                }
            };
            //交强险日期设定
            $scope.jqxrqStartChange = function() {
                var setDate = $scope.searchPolicy.jqxrqStart;
                if(typeof setDate == 'undefined' || setDate == ''){
                    $scope.searchPolicy.jqxrqEnd = undefined;
                }else{
                    $scope.searchPolicy.jqxrqEnd = $scope.GetDateStr(setDate);
                }
            };

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

            //新增保单品牌车型选择框与输入框切换
            $scope.xzVehicleModel = function(){
                $scope.searchPolicy.vehicleModel='';
                $scope.searchPolicy.vehicleModelInput='';
                if($scope.searchPolicy.carBrand){
                    if($scope.searchPolicy.carBrand.brandName=='异系'){
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
                            $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.carBrandsXBD[i].carModelList=[{modelName:vehicleModel}];
                        $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                        $scope.searchPolicy.vehicleModel = $scope.searchPolicy.carBrand.carModelList[0];
                    }else if("异系"==$scope.carBrandsXBD[i].brandName&&carBrand=="异系"){
                        $("#clxhsr_xbd").show();
                        $("#clxhxz_xbd").hide();
                        if(vehicleModel==null||vehicleModel==''){
                            $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                            return
                        }
                        $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                        $scope.searchPolicy.vehicleModelInput = vehicleModel;
                    }else if(carBrand==$scope.carBrandsXBD[i].brandName&&sfyy==1){
                        $("#clxhxz_xbd").show();
                        $("#clxhsr_xbd").hide();
                        $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                        for(var j = 0 ;j<$scope.searchPolicy.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.searchPolicy.carBrand.carModelList[j].modelName){
                                sfyy = 2;
                            }else if(vehicleModel==null||vehicleModel==''){
                                return
                            }
                        }
                        if(sfyy==1){
                            $scope.carBrandsXBD[i].carModelList.push({modelName:vehicleModel});
                            $scope.searchPolicy.carBrand = $scope.carBrandsXBD[i];
                        }
                        for(var j = 0 ;j<$scope.searchPolicy.carBrand.carModelList.length;j++){
                            if(vehicleModel==$scope.searchPolicy.carBrand.carModelList[j].modelName){
                                $scope.searchPolicy.vehicleModel = $scope.searchPolicy.carBrand.carModelList[j];
                            }
                        }

                    }
                }

            }

            //保费合计计算
            $scope.bfhjjs = function(){
                var cinsuranceCoverage = $scope.searchPolicy.cinsuranceCoverage||0;
                var vehicleTax = $scope.searchPolicy.vehicleTax||0;
                var binsuranceCoverage = $scope.searchPolicy.binsuranceCoverage||0;
                $scope.searchPolicy.premiumCount = (cinsuranceCoverage + vehicleTax + binsuranceCoverage).toFixed(2);
                $scope.sjjejs();
                $scope.sxfhj(0);
                if(binsuranceCoverage!=0&&binsuranceCoverage!=null&&$scope.searchPolicy.czkje!=null){
                    $scope.searchPolicy.czkjedw = Math.round($scope.searchPolicy.czkje/binsuranceCoverage*100)/100;
                }
            }

            //利润计算
            $scope.lrjs = function(){
                var factorageCount = $scope.searchPolicy.factorageCount ||0;
                var privilegeSum = $scope.searchPolicy.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                if(factorageCount!= 0){
                    $scope.searchPolicy.profit = (factorageCount - privilegeSum).toFixed(2);
                }
            }

            //实收金额计算
            $scope.sjjejs = function(){
                var syxje = $scope.searchPolicy.binsuranceCoverage||0;
                var premiumCount = $scope.searchPolicy.premiumCount||0;
                var privilegeSum = $scope.searchPolicy.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                $scope.searchPolicy.realPay =  (premiumCount - privilegeSum).toFixed(2);
                $scope.sxfhj(0);
                if(syxje!=0){
                    $scope.searchPolicy.xjyhdw = Math.round(privilegeSum/syxje*100)/100;
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs = function(){
                var syxje = $scope.searchPolicy.binsuranceCoverage||0;
                var xjyhdw = $scope.searchPolicy.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.searchPolicy.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.searchPolicy.privilegeSum = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs();
                }
            }
            //商业险保费＊ 参数设置内商业险手续费％＋  交强险保费＊参数设置内交强险手续费％（新保按新保的手续费，续保按续保的手续费
            //bxgssfgb=0代表不进行商业险种的拼装  bxgssfgb=1代表进行商业险种的拼装
            $scope.sxfhj = function(bxgssfgb){
                var cinsuranceCoverage = $scope.searchPolicy.cinsuranceCoverage||0;
                var binsuranceCoverage = $scope.searchPolicy.binsuranceCoverage||0;
                var coverType = $scope.searchPolicy.coverType||0;
                var jqxsxfRate=$scope.searchPolicy.jqxsxfRate;
                var syxsxfRate=$scope.searchPolicy.syxsxfRate;
                if(jqxsxfRate!=0||syxsxfRate!=0){
                    cinsuranceCoverage = jqxsxfRate*cinsuranceCoverage/100;
                    binsuranceCoverage = syxsxfRate*binsuranceCoverage/100;
                    $scope.searchPolicy.factorageCount = (cinsuranceCoverage + binsuranceCoverage).toFixed(2);
                }
                $scope.lrjs();
                if(bxgssfgb==1){
                    $scope.syxzpz();
                }
            }
            //商业险种拼装
            $scope.syxzpz = function(){
                $scope.searchPolicy.insuranceTypes = [];
                if($scope.searchPolicy.insuranceCompName){
                    var syxz = $scope.searchPolicy.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                        if(syxz[i].typeName.indexOf("-")>0){
                            var typeName = syxz[i].typeName.split("-")[0];
                            // var insu = syxz[i].typeName.split("-")[1];
                            syxz[i].typeName = typeName;
                        }
                    }
                    for(var i = 0; i<syxz.length;i++){
                        var xz = {status:false,insuranceTypes:syxz[i].typeName}
                        $scope.searchPolicy.insuranceTypes.push(xz);
                    };
                }
            }
            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
				$('select[multiple="multiple"]').multiselect('clearSelection');
                $('select[multiple="multiple"]').multiselect('refresh');
            };
            //查询所有险种
            policyRDService.findInsu().then(function (result) {
                if (result.status == 'OK') {
                    $scope.insuranceAll = result.results.content.result;
                } else {

                }
            });
            //停止导出
            $scope.stopExportData = function(){
                $scope.stopExport = true;
            }
            //导出保单
            $scope.exportToExcel=function(tableId){
                $("#msgwindowExport").show();
                $scope.loadFinish = '';//每次请求完成
                $scope.loadDataFinish = false;
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
                        load();
                        creatingFile();
                        setTimeout(function(){
                            var id_key = '#'+'policy'+ $scope.covertype;
                            var pageTypeName = $(id_key).html().trim();
                            var fileName = $scope.storetitle+$filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'保单.xls'
                            var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+pageTypeName+'保单';
                            ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName)
                            $scope.loadFinish = '';
                            $scope.exportData = [];
                            $("#msgwindowExport").hide();
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
            };

            //导出保单获取数据方法
            $scope.getExportData = function () {
                if ($scope.covertype == 0) {
                    $scope.singleSearchExport() //保单查询
                }else{
                    $scope.getSingleByCovertypeExport($scope.covertype);//保单
                }
                $scope.startNumExport = $scope.startNumExport + 1;
            };

            $scope.singleSearchExport=function(){
                $scope.loadFinish = false;
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
                var coverTypes = $scope.search.coverType;;
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
                var notExistCustomer = $scope.search.notExistCustomer;
                $scope.policyAllSearch.data = [];
                var searchDatas = {
                    fourSStoreId:fourSStoreId,foursStore:foursStore,carBrand:carBrand,vehicleModel:vehicleModel,
                    insured:insured,contact:contact,contactWay:contactWay,
                    insuranceCompName:insuranceCompName,carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,
                    coverTypes:coverTypes,insurNumber:insurNumber,principalId:principalId,
                    insuranceWriterId:insuranceWriterId,cbrqStart:cbrqStart,cbrqEnd:cbrqEnd,cinsuranceNumber:cinsuranceNumber,
                    syxrqStart:syxrqStart,syxrqEnd:syxrqEnd,jqxrqStart:jqxrqStart,jqxrqEnd:jqxrqEnd,
                    syxjeStart:syxjeStart,syxjeEnd:syxjeEnd,notExistCustomer:notExistCustomer
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
                    policyRDService.getSingleByCondition(searchDatas,$scope.startNumExport).then(function(result){
                        if(result.status == 'OK' &&result.result.success==true){
                            $scope.getExportDataCallback(result.result.content.results,result.result.content.policyCount);
                        }else{
                            $scope.angularTip("查询失败",5000);
                        }
                    });
                }
            };
            //按类型查询
            $scope.getSingleByCovertypeExport = function(covertype){
                $scope.loadFinish = false;
                $scope.covertype = covertype;
                $scope.policyAll.data=[];
                policyRDService.getSingleAll(covertype,$scope.startTime,$scope.endTime,$scope.startNumExport,$scope.showAll)
                    .then(function (result) {
                        if (result.status == 'OK') {
                            $scope.getExportDataCallback(result.result.content.results,result.result.content.policyCount);
                        } else {

                        }
                    });
            }

            //查询导出保单回调后的处理
            $scope.getExportDataCallback = function(customerArray,policyExportCount){
                if(customerArray!=null&&customerArray.length>0){
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
                    for(var i=0;i<customerArray.length;i++){
                        customerArray[i].insuranceList = [];

                        for(var j=0;j<$scope.insuranceAll.length;j++){
                            var arr = {checkState:false,coverage:null,typeName:$scope.insuranceAll[j].typeName};
                            for(var k=0;k<customerArray[i].insuTypes.length;k++){
                               // console.log("insuranceAll " + $scope.insuranceAll[j].typeName + " insuTypes " + customerArray[i].insuTypes[k].typeName)
                                if(customerArray[i].insuTypes[k].typeName.indexOf("-") > -1){
                                    typeNameQuota = customerArray[i].insuTypes[k].typeName;
                                    typeNameQuotaArr = typeNameQuota.split("-");
                                    customerArray[i].insuTypes[k].typeName = typeNameQuotaArr[0];
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

                                    }
                                }else{
                                    typeNameQuota = customerArray[i].insuTypes[k].typeName;
                                }
                                if($scope.insuranceAll[j].typeName==customerArray[i].insuTypes[k].typeName){
                                    if(customerArray[i].insuTypes[k].typeName.indexOf("车损") > -1){
                                        arr = {checkState:true,coverage:chesun,typeName:$scope.insuranceAll[j].typeName};
                                    }
                                    if(customerArray[i].insuTypes[k].typeName.indexOf("三者") > -1){
                                        arr = {checkState:true,coverage:sanzhe,typeName:$scope.insuranceAll[j].typeName};
                                    }else if(customerArray[i].insuTypes[k].typeName.indexOf("划痕") > -1){
                                        arr = {checkState:true,coverage:huahen,typeName:$scope.insuranceAll[j].typeName};
                                    }else if(customerArray[i].insuTypes[k].typeName.indexOf("玻璃") > -1){

                                        arr = {checkState:true,coverage:boliTransformation(boli),typeName:$scope.insuranceAll[j].typeName};
                                    }else  if(customerArray[i].insuTypes[k].typeName.indexOf("司机") > -1){
                                        arr = {checkState:true,coverage:siji,typeName:$scope.insuranceAll[j].typeName};
                                    }else  if(customerArray[i].insuTypes[k].typeName.indexOf("乘客") > -1){
                                        arr = {checkState:true,coverage:chengke,typeName:$scope.insuranceAll[j].typeName};
                                    }else  if(customerArray[i].insuTypes[k].typeName.indexOf("费用") > -1){
                                        arr = {checkState:true,coverage:feiyong,typeName:$scope.insuranceAll[j].typeName};
                                    }else  if(customerArray[i].insuTypes[k].typeName.indexOf("指定") > -1){
                                        arr = {checkState:true,coverage:zhiding,typeName:$scope.insuranceAll[j].typeName};
                                    }else {
                                        arr = {checkState:true,coverage:customerArray[i].insuTypes[k].coverage,typeName:$scope.insuranceAll[j].typeName};
                                    }
                                }
                            }
                            customerArray[i].insuranceList.push(arr);
                        }
                    }
                    for(var i=0;i<customerArray.length;i++){
                        if(customerArray[i].sfdk==1){
                            customerArray[i].sfdkStr = '是';
                        }else if(customerArray[i].sfdk==0){
                            customerArray[i].sfdkStr = '否';
                        }else{
                            customerArray[i].sfdkStr = '';
                        }
                    }
                }
                $.merge($scope.exportData,customerArray);
                if(customerArray.length<$rootScope.pageSize){
                    $scope.loadDataFinish=true;
                }
                $scope.policyExportCount = policyExportCount;
                var pro=0;
                if($scope.policyExportCount!=0) {
                    pro = ($scope.exportData.length / policyExportCount * 100).toFixed(2);
                }
                $scope.progressExport.width = pro+"%";
                $scope.loadFinish = true;
            };

            //按条件查询审批单信息
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
                        '<div class="rowButtons" style="width: 100px;">'+
                        '<button type="button" ng-click="grid.appScope.SpdDetails(row.entity.id,2)" class="btn btn-default btn-sm baodanmx">审批单明细</button>'+
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
            $scope.spdSearchBtn=function(){
                $("#scmTitleTool").hide();
                $(".biptooltap").hide();
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
                policyRDService.getSpdByCondition(spdDatas,$scope.startNum3,billFlag,short,shortmain).then(function(result){
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
            $scope.SpdDetails=function(id,flag) {
                var billFlag;
                //如果flag=1表示查询的是保单的审批单明细,flag=2表示查询的是审批单的明细
                if(flag==1){
                    billFlag = 1;
                }else{
                    billFlag = $scope.spdSearch.billFlag;
                }
                if(id){
                    $("#spdDetails").show();  //保单审批单弹框
                    $scope.spddetail = {};
                    policyRDService.getSpdById(id,billFlag).then(function (result) {
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
                            }   //无保单的审批单不用过滤礼包
                            for(var j=0;j<$scope.giftDetailAllPage.data.length;j++){
                                $scope.giftDetailAllPage.data[j].index = j+1;
                            }
                        } else {

                        }
                    });
                }else {
                    $scope.angularTip("该保单无审批单记录",5000);
                }

            }

            //保费合计计算
            $scope.bfhjjs2 = function(){
                var cinsuranceCoverage = $scope.searchPolicy.cinsuranceCoverage||0;
                var vehicleTax = $scope.searchPolicy.vehicleTax||0;
                var binsuranceCoverage = $scope.searchPolicy.binsuranceCoverage||0;
                $scope.searchPolicy.premiumCount = (cinsuranceCoverage + vehicleTax + binsuranceCoverage).toFixed(2);
                $scope.sjjejs2();
                $scope.sxfhj2(0);
                if(binsuranceCoverage!=0&&binsuranceCoverage!=null&&$scope.searchPolicy.czkje!=null){
                    $scope.searchPolicy.czkjedw = Math.round($scope.searchPolicy.czkje/binsuranceCoverage*100)/100;
                }
            }

            //利润计算
            $scope.lrjs2 = function(){
                var factorageCount = $scope.searchPolicy.factorageCount ||0;
                var privilegeSum = $scope.searchPolicy.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                if(factorageCount!= 0){
                    $scope.searchPolicy.profit = (factorageCount - privilegeSum).toFixed(2);
                }
            }

            //实收金额计算
            $scope.sjjejs2 = function(){
                var syxje = $scope.searchPolicy.binsuranceCoverage||0;
                var premiumCount = $scope.searchPolicy.premiumCount||0;
                var privilegeSum = $scope.searchPolicy.privilegeSum||0;
                if(privilegeSum=='null'){
                    privilegeSum=0
                }
                $scope.searchPolicy.realPay =  (premiumCount - privilegeSum).toFixed(2);
                $scope.sxfhj2(0);
                if(syxje!=0){
                    $scope.searchPolicy.xjyhdw = Math.round(privilegeSum/syxje*100)/100;
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs2 = function(){
                var syxje = $scope.searchPolicy.binsuranceCoverage||0;
                var xjyhdw = $scope.searchPolicy.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.searchPolicy.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.searchPolicy.privilegeSum = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs2();
                }
            }
            //商业险保费＊ 参数设置内商业险手续费％＋  交强险保费＊参数设置内交强险手续费％（新保按新保的手续费，续保按续保的手续费
            //bxgssfgb=0代表不进行商业险种的拼装  bxgssfgb=1代表进行商业险种的拼装 bxgssfgb=2代表是从投保类型进入
            $scope.sxfhj2 = function(bxgssfgb){
                var cinsuranceCoverage = $scope.searchPolicy.cinsuranceCoverage||0;
                var binsuranceCoverage = $scope.searchPolicy.binsuranceCoverage||0;
                var coverType = $scope.searchPolicy.coverType||0;
                var jqxsxfRate=$scope.searchPolicy.jqxsxfRate;
                var syxsxfRate=$scope.searchPolicy.syxsxfRate;
                if(jqxsxfRate!=0||syxsxfRate!=0){
                    cinsuranceCoverage = jqxsxfRate*cinsuranceCoverage/100;
                    binsuranceCoverage = syxsxfRate*binsuranceCoverage/100;
                    $scope.searchPolicy.factorageCount = (cinsuranceCoverage + binsuranceCoverage).toFixed(2);
                }
                $scope.lrjs2();
                if(bxgssfgb==1){
                    $scope.syxzpz2();
                }
            }
            //商业险种拼装
            $scope.syxzpz2 = function(){
                $scope.searchPolicy.insuranceTypes = [];
                if($scope.searchPolicy.insuranceCompName){
                    var syxz = $scope.searchPolicy.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                    }
                    $scope.searchPolicy.insuranceTypes = syxz;
                }
            }
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
            $scope.cleanSpd = function(){
                $scope.spdSearch = {};
                $scope.spdSearch.billFlag = 1;
            };
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
            //导出下来框
            $scope.bipNavshow=function(){
                $("#bipNav").show();
            };
            $scope.bipNavhide=function(){
                $("#bipNav").hide();
            };

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
            function getReport(){
                bofideChart.createTissueSingleChart('bsp_month_report_hold_personnel',"mainContainer",'test');
            }
            function boliTransformation(boli){
                switch(boli)
                {
                    case "0":
                        return "不投保";
                        break;
                    case "1":
                        return "国产";
                        break;
                    case "2":
                        return "进口";
                        break;
                    default:
                        return "不投保";
                }

            }
        }
    ]);


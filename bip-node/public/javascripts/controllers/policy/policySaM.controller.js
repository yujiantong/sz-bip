'use strict';
angular.module('myApp')
    .controller('policySaM_Controller',['$rootScope','$scope','$filter','policySaMService','$state',
        function($rootScope,$scope,$filter,policySaMService,$state){
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


            //下拉列表数据初始化
            //按4s店ID查询车辆品牌车型信息
            policySaMService.findCarInfoByStoreId().then(function(res){
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
            policySaMService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            policySaMService.findKindsUser().then(function(res){
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
                    { name: '负责人', field: 'principal',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_xb(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_xb" class=""></span></div>'},
                    { name: '业务员', field: 'clerk',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_xb(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_xb" class=""></span></div>'},
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
                        '<div class="rowButtons">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity.insuranceBillId)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
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
            };

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
                }else if($scope.covertype==2) {
                    this.getSingleByCovertype(2);
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
                policySaMService.getSingleAll(covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll,short,shortmain)
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
                    policySaMService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
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
                policySaMService.getSingleAll($scope.covertype,$scope.startTime,$scope.endTime,$scope.startNum,$scope.showAll)
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
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
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
            //查询保单明细
            $scope.singleDetails=function(insuranceBillId) {
                $scope.policyInfoTracePage.data=[];
                $scope.searchPolicy = {};
                $("#msgwindow").show();
                policySaMService.getSingleById(insuranceBillId).then(function (result) {
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

            //关闭窗口时清空保单明细数据
            $scope.cleanSingleDetails = function(){
                $scope.searchsingle ={};
                $scope.policyInfoTracePage.data = [];
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
                policySaMService.findRecord(insuranceBillId).then(function (result) {
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
                    { name: '负责人', field: 'principal',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button"  ng-click="grid.appScope.qjsort_bd(2)"  >负责人&nbsp;&nbsp;&nbsp;<span id="principal_bd" class=""></span></div>'},
                    { name: '业务员', field: 'clerk',width:90,enableColumnMenu: false,headerCellTemplate: '<div class="sort_button" ng-click="grid.appScope.qjsort_bd(3)">业务员&nbsp;&nbsp;&nbsp;<span id="clerk_bd" class=""></span></div>'},
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
                        '<div class="rowButtons">'+
                        ' <button type="button" ng-click="grid.appScope.singleDetails(row.entity.insuranceBillId)" class="btn btn-default btn-sm baodanmx">保单明细</button>'+
                        '<button type="button" ng-click="grid.appScope.findRecord(row.entity.insuranceBillId)" class="btn btn-default btn-sm genzcl">跟踪记录</button>'+
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
                    policySaMService.getSingleByCondition(searchDatas,$scope.startNum2).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $scope.policyAllSearch.data = result.result.content.results;
                            $scope.policySearchCount = result.result.content.policyCount;
                            $scope.getPolicySearchPage();

                        }else{
                            $scope.angularTip("查询失败",5000);
                        }
                    });
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
            };
            //投保类型下拉框
            $('#example-getting-started').multiselect({
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
        }

    ]);

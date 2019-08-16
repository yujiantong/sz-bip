'use strict';
angular.module('myApp')
    .controller('maintainRecordSA_Controller',['$rootScope','$scope','$filter','maintainRecordSAService','$state',
        function($rootScope,$scope,$filter,maintainRecordSAService,$state) {
            $scope.customerAll = [];
            $scope.startNum = 1;//初始化页数
            $scope.customerIndex= 1;//初始化下标
            $scope.policyCount = 0;
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.condition = {}; //查询条件
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            //初始化页面查询数据
            $scope.maintainRecordPage = {
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
                    { name: '施工单号', field: 'maintainNumber', enableColumnMenu: false},
                    { name: '报案号', field: 'reportNumber', enableColumnMenu: false},
                    { name: '维修开始时间', field: 'maintenanceTimeStart',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false},
                    { name: '维修结束时间', field: 'maintenanceTimeEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"',enableColumnMenu: false},
                    { name: '车牌号', field: 'carLicenseNumber',enableColumnMenu: false,cellTooltip: true},
                    { name: '托修人', field: 'entrustor', enableColumnMenu: false,cellTooltip: true},
                    { name: '托修人联系方式', field: 'entrustorPhone',enableColumnMenu: false,cellTooltip: true},
                    { name: '维修种类', field: 'maintenanceType', enableColumnMenu: false},
                    { name: '维修金额', field: 'maintainCost', enableColumnMenu: false},
                    { name: '定损金额', field: 'certainCost', enableColumnMenu: false},
                    { name: '实收金额', field: 'realCost', enableColumnMenu: false},
                    { name: '是否本店', field: 'sfbd', cellFilter: 'mapSF',enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.maintainDetails(row.entity.maintainNumber)" class="btn btn-default btn-sm genzcl">查看明细</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_wxjl) {
                    gridApi_wxjl.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_wxjl = gridApi_wxjl;
                }
            };
            //维修记录
            $scope.wxSearch = {};
            $scope.findwxRecordByCondition = function(){
                var carLicenseNumber = $scope.wxSearch.carLicenseNumber;
                var entrustor = $scope.wxSearch.entrustor;
                var entrustorPhone = $scope.wxSearch.entrustorPhone;
                var maintenanceTimeStartStart = $scope.wxSearch.maintenanceTimeStartStart;
                var maintenanceTimeStartEnd = $scope.wxSearch.maintenanceTimeStartEnd;
                var maintenanceTimeEndStart = $scope.wxSearch.maintenanceTimeEndStart;
                var maintenanceTimeEndEnd = $scope.wxSearch.maintenanceTimeEndEnd;
                var bdcb = $scope.wxSearch.bdcb;
                if( maintenanceTimeStartStart != null  && maintenanceTimeStartEnd != null && maintenanceTimeStartStart != ""  && maintenanceTimeStartEnd != "" && maintenanceTimeStartStart>maintenanceTimeStartEnd){
                    $scope.angularTip("维修开始日期查询范围有误",5000);
                    return;
                }
                if(maintenanceTimeEndStart != null && maintenanceTimeEndEnd != null && maintenanceTimeEndStart != "" && maintenanceTimeEndEnd != "" && maintenanceTimeEndStart>maintenanceTimeEndEnd){
                    $scope.angularTip("维修结束日期查询范围有误",5000);
                    return;
                }
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        startNum: $scope.startNum,carLicenseNumber: carLicenseNumber,entrustor:entrustor,
                        entrustorPhone:entrustorPhone, maintenanceTimeStartStart:maintenanceTimeStartStart,
                        maintenanceTimeStartEnd:maintenanceTimeStartEnd,maintenanceTimeEndStart:maintenanceTimeEndStart,
                        maintenanceTimeEndEnd:maintenanceTimeEndEnd, bdcb:bdcb,
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                maintainRecordSAService.findwxRecordByCondition($scope.condition)
                    .then(function (result) {
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
                    height:$("#myTabContent").height()-100
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
                    $scope.maintainRecordPage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.customerAll.length;i++){
                    $scope.customerAll[i].index = $scope.customerIndex;
                    if($scope.customerAll[i].syxrqStart<$scope.customerAll[i].maintenanceTimeStart
                        && $scope.customerAll[i].syxrqEnd>$scope.customerAll[i].maintenanceTimeStart){
                        $scope.customerAll[i].sfbd = 1;
                    }else {
                        $scope.customerAll[i].sfbd = 0;
                    }
                    $scope.maintainRecordPage.data.push($scope.customerAll[i])
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
                if($scope.maintainRecordPage.data.length>=$scope.policyCount||$scope.customerAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApi_wxjl.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApi_wxjl.infiniteScroll.dataLoaded(false, true)
                }
            };
            //清空表单
            $scope.clearwxSearch = function(){
                $scope.wxSearch = {};
            };
            //维修记录明细，跟踪记录 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
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
            $scope.custInfo = {};
            $scope.weixiuInfo = {};
            $scope.maintainDetails=function(maintainNumber){
                $scope.maintainNumber = maintainNumber;
                $("#msgwindow").show();
                maintainRecordSAService.findByMaintainNumber($scope.maintainNumber).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $("#maintainDetail").show();
                        $scope.itemInfoPage.data = result.results.content.itemLists;
                        $scope.partInfoPage.data = result.results.content.partLists;
                        $scope.custInfo = result.results.content.lists;
                        $scope.weixiuInfo = result.results.content.record;
                        for(var i=0;i< $scope.itemInfoPage.data.length;i++){
                            $scope.itemInfoPage.data[i].index = i;
                        };
                        for(var i=0;i< $scope.partInfoPage.data.length;i++){
                            $scope.partInfoPage.data[i].index = i;
                        };
                        $scope.itemInfoPage.data[0].index = "";
                        $scope.partInfoPage.data[0].index = "";
                        $scope.custLength =  $scope.custInfo.length;
                        $scope.totalCost = $scope.itemInfoPage.data[0].workingCost + $scope.partInfoPage.data[0].totalAmount;
                    } else {

                    };
                });
            };
            //推送记录条数
            $scope.carlistshow=function(){
                $(".carlist").toggle();
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

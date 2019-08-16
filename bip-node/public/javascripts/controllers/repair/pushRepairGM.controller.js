/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .controller('pushRepairGM_Controller',['$rootScope','$scope','$filter','pushRepairGMService',
        function($rootScope,$scope,$filter,pushRepairGMService,$state) {
            $scope.tsxRecordAll = [];
            $scope.startNum = 1;//初始化页数
            $scope.customerIndex= 1;//初始化下标
            $scope.policyCount = 0;
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.condition = {}; //查询条件
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            //初始化页面查询数据
            $scope.tsxIncomePage = {
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
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false},
                    { name: '车架号', field: 'chassisNumber',cellTooltip: true, enableColumnMenu: false},
                    { name: '保单号', field: 'insuranceNumber',cellTooltip: true, enableColumnMenu: false},
                    { name: '定损金额', field: 'certainCost', enableColumnMenu: false},
                    { name: '维修收入', field: 'maintainCost', enableColumnMenu: false},
                    { name: '实收维修收入', field: 'realCost', enableColumnMenu: false},
                    { name: '应收维修收入', field: 'needCost',cellTooltip: true, enableColumnMenu: false},
                    { name: '报案人', field: 'reporter',cellTooltip: true, enableColumnMenu: false},
                    { name: '报案电话', field: 'reporterPhone',cellTooltip: true, enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi_tsx) {
                    gridApi_tsx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_tsx = gridApi_tsx;
                }
            };
            //赠送核销记录
            $scope.hxSearch = {};
            $scope.findGivingCont = function(){
                var carLicenseNumber = $scope.hxSearch.carLicenseNumber;
                var chassisNumber = $scope.hxSearch.chassisNumber;
                var insuranceNumber = $scope.hxSearch.insuranceNumber;
                var isMaintenance = $scope.hxSearch.isMaintenance;
                $scope.tsxRecordAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        startNum: $scope.startNum,carLicenseNumber: carLicenseNumber,chassisNumber:chassisNumber,
                        insuranceNumber:insuranceNumber,isMaintenance:isMaintenance
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                pushRepairGMService.findTzPushMaintenance($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.tsxRecordAll = result.results.content.results;
                            $scope.policyCount = result.results.content.maintainCountAndCostSum.countPushMaintenance;
                            $scope.sumMaintainCost = result.results.content.maintainCountAndCostSum.sumMaintainCost;
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
                    $scope.tsxIncomePage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.tsxRecordAll.length;i++){
                    $scope.tsxRecordAll[i].index = $scope.customerIndex;
                    $scope.tsxIncomePage.data.push($scope.tsxRecordAll[i]);
                    $scope.customerIndex = $scope.customerIndex+1;
                }
                $scope.loadingPage();
            }

            //加载更多按钮
            $scope.searchMore = function(){
                $scope.searchMoreStatus =false;
                $scope.searchMoreStatus =true;
                $scope.loadStatus=1;//正在加载中。。。
            }

            //判定数据是否加载完毕
            $scope.loadingPage = function(){
                if($scope.tsxIncomePage.data.length>=$scope.policyCount||$scope.tsxRecordAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApi_tsx.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApi_tsx.infiniteScroll.dataLoaded(false, true)
                }
            };
            //清空表单
            $scope.clearhxSearch = function(){
                $scope.hxSearch = {};
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
        }
    ]);

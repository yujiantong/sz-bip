/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .controller('suggest_Controller',['$rootScope','$scope','$filter','suggestService',
        function($rootScope,$scope,$filter,suggestService) {
            $scope.suggestAll = [];
            $scope.loadStatus=2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policyCount = 0;
            $scope.startNum = 1;//初始化页数
            $scope.suggestIndex= 1;//初始化下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.pageType="jy";
            $scope.suggestSearch = {};

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                };
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
                    $scope.suggestIndex= 1;
                    $scope.suggestAllPage.data = [];
                }
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
                if($scope.pageType=='jy'){
                    $scope.findAllSuggestByUserId();
                }
            };

            $scope.suggestAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { field: 'index',cellClass:'text-center',width:70, enableColumnMenu: false,type:'number',
                        headerCellTemplate:'<div role="button" class="ui-grid-cell-contents"><span>序号</span>(<span id="suggCount">0</span>)</div>'},
                    { name: '反馈日期', field: 'proposeTime',width:150,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false},
                    { name: '标题', field: 'title',width:150, enableColumnMenu: false},
                    { name: '内容', field: 'content',cellTooltip: true, enableColumnMenu: false},
                    { name: '处理结果', field: 'statusStr', width:70,cellTooltip: true,enableColumnMenu: false},
                    { name: '回复内容', field: 'disContent',cellTooltip: true,enableColumnMenu: false},
                    { name: '处理日期', field: 'solveTime',width:150,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm/EEE'",enableColumnMenu: false},
                ],
                onRegisterApi : function(gridApi_suggest) {
                    gridApi_suggest.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_suggest = gridApi_suggest;
                }
            };

            $scope.getPolicyPage = function(){
                if ($scope.pageType == 'jy') {
                    for (var i = 0; i < $scope.suggestAll.length; i++) {
                        $scope.suggestAll[i].index = $scope.suggestIndex;
                        if($scope.suggestAll[i].status==1){
                            $scope.suggestAll[i].statusStr = '已处理';
                        }else{
                            $scope.suggestAll[i].statusStr = '未处理';
                        }
                        $scope.suggestAllPage.data.push($scope.suggestAll[i]);
                        $scope.suggestIndex = $scope.suggestIndex + 1;
                    };
                }
                $scope.loadingPage();
            }
            //判定数据是否加载完毕
            $scope.loadingPage = function(){
                if($scope.pageType == 'jy'){
                    if($scope.suggestAllPage.data.length>=$scope.policyCount ||$scope.suggestAll.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApi_suggest.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApi_suggest.infiniteScroll.dataLoaded(false, true)
                    }
                }
            }

            //根据建议人ID查询建议
            $scope.findAllSuggestByUserId = function(){
                $scope.pageType="jy";
                $scope.resetPageData();
                var title = $scope.suggestSearch.title;
                var status = $scope.suggestSearch.status;
                var proposeTimeStartTime = $scope.suggestSearch.proposeTimeStartTime;
                var proposeTimeEndTime = $scope.suggestSearch.proposeTimeEndTime;
                var solveTimeStartTime = $scope.suggestSearch.solveTimeStartTime;
                var solveTimeEndTime = $scope.suggestSearch.solveTimeEndTime;
                var userId = $rootScope.user.userId;
                var startNum = $scope.startNum;
                var condition = {
                    title: title, status: status,proposeTimeStartTime: proposeTimeStartTime, proposeTimeEndTime: proposeTimeEndTime,
                    solveTimeStartTime: solveTimeStartTime, solveTimeEndTime: solveTimeEndTime,userId:userId,startNum:startNum
                }
                suggestService.findAllSuggestByUserId(condition).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.suggestAll = result.results.content.results;
                        $scope.policyCount = result.results.content.policyCount;
                        $("#suggCount").html($scope.policyCount);
                        $scope.getPolicyPage();
                    } else {

                    };
                });
            }
            $scope.findAllSuggestByUserId();
            //清空查询条件
            $scope.clearQksearch = function(){
                $scope.suggestSearch = {};
            };

            $scope.ceshi22 = function(){
                var date1 = $scope.ceshi.date1;
                var date2 = $scope.ceshi.date2;
                var num = $scope.ceshi.num;
                var parm = {
                    date1:date1,date2:date2,num:num
                }
                suggestService.ceshi(parm).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.ceshi.date3 = result.results.content.aa;
                    } else {

                    };
                });
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

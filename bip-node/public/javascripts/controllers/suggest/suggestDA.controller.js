'use strict';
angular.module('myApp')
    .controller('suggestDA_Controller',['$rootScope','$scope','$filter','superAdminService','$state',
        function($rootScope,$scope,$filter,superAdminService,$state){
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-95
                };
            },100);
            //建议列表
            $scope.suggestAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:80, enableColumnMenu: false,type:'number',
                        headerCellTemplate:'<div role="button" class="ui-grid-cell-contents"><span>序号</span>(<span id="suggestNum">0</span>)</div>'},
                    { name: '公司名称', field: 'storeName',enableColumnMenu: false},
                    { name: '角色', field: 'userRoleName' ,enableColumnMenu: false},
                    { name: '反馈人', field: 'userName',enableColumnMenu: false},
                    { name: '电话', field: 'userPhone',enableColumnMenu: false},
                    { name: '标题', field: 'title',enableColumnMenu: false},
                    { name: '内容', field: 'content',enableColumnMenu: false},
                    { name: '提出时间', field: 'proposeTime',enableColumnMenu: false,width:145 },
                    { name: '处理状态', field: 'newStatus',enableColumnMenu: false,width:65},
                    { name: '回复内容', field: 'disContent',enableColumnMenu: false},
                    { name: '解决时间', field: 'solveTime',enableColumnMenu: false,width:145 },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findBySuggest(row.entity)" class="btn btn-default btn-sm suggest">建议信息</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(suggestGridApi) {
                    suggestGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.suggestGridApi = suggestGridApi;
                }
            };
            $scope.selectStatus = [{num:0,name:'未解决'},{num:1,name:'已解决'}];
            $scope.search = {}; //多条件查询
            $scope.loadStatus = 2;
            $scope.startNumSearch = 0;
            $scope.searchMoreStatus = true;
            $scope.suggestSearchIndex = 1;
            $scope.suggetCount = 0;
            $scope.suggestAll = [];

            //加载更多按钮
            $scope.searchMore = function(){
                $scope.searchMoreStatus =false;
                $scope.suggestbtn();
                $scope.searchMoreStatus =true;
                $scope.loadStatus=1;//正在加载中。。。
            }
            var searchDatas = {};
            var newSearchDatas = {};
            //建议查询
            $scope.suggestbtn = function(){
                $("#msgwindow").show();
                var selectStoreName = $scope.search.storeName;
                var selectNum = $scope.search.num;
                var selectUserName = $scope.search.userName;
                newSearchDatas = {
                    selectStoreName:selectStoreName,
                    selectNum:selectNum,
                    selectUserName:selectUserName,
                }
                if($scope.searchMoreStatus){
                    $scope.startNumSearch = 0;
                    $scope.suggestAllPage.data = [];
                    $scope.suggestSearchIndex = 1;
                    searchDatas = newSearchDatas;
                }else{
                    $scope.startNumSearch = $scope.startNumSearch+1;
                }
                superAdminService.selectAllSuggest(searchDatas,$scope.startNumSearch).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.storeNames = [];
                        $scope.suggestAll = result.results.content.results;
                        for(var i=0;i<$scope.suggestAll.length;i++){
                            $scope.suggestAll[i].proposeTime = $filter('date')($scope.suggestAll[i].proposeTime, 'yyyy-MM-dd HH:mm/EEE');
                            $scope.suggestAll[i].solveTime = $filter('date')($scope.suggestAll[i].solveTime, 'yyyy-MM-dd HH:mm/EEE');
                            if($scope.suggestAll[i].status == 0){
                                $scope.suggestAll[i].newStatus = '未解决';
                            }else{
                                $scope.suggestAll[i].newStatus = '已解决';
                            }
                        }
                        $scope.suggetCount = result.results.content.policyCount;
                        $("#suggestNum").html($scope.suggetCount);
                        for(var i=0;i<result.results.content.storeNames.length;i++){
                            $scope.storeNames.push({storeName:result.results.content.storeNames[i]});
                        }

                        $scope.getPolicyPage();
                    }
                });
            }
            $scope.suggestbtn();
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.suggestAll.length;i++){
                    $scope.suggestAll[i].index = $scope.suggestSearchIndex;
                    $scope.suggestAllPage.data.push($scope.suggestAll[i]);
                    $scope.suggestSearchIndex = $scope.suggestSearchIndex+1;
                }
                $scope.loadingPage();
            }
            //判断是否加载完成
            $scope.loadingPage = function(){
                if($scope.suggestAllPage.data.length>=$scope.suggetCount ||$scope.suggestAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.suggestGridApi.infiniteScroll.dataLoaded(false, false);
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.suggestGridApi.infiniteScroll.dataLoaded(false, true);
                }
            }
            //多条件查询
            $scope.findByCondition = function(){
                $scope.suggestbtn();
            }
            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
            };
            //弹出建议信息窗口
            $scope.exhibitionSuggest = {};
            $scope.findBySuggest = function(obj){
                $("#disSuggestPage").show();
                $scope.exhibitionSuggest = obj;
            }
            //关闭建议信息窗口
            $scope.suggestPageClose = function(){
                $("#disSuggestPage").hide();
            }
            //建议查询 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            }
        }

    ]);

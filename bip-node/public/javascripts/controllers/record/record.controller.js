/**
 * Created by lixuhua on 2016/11/10.
 */
'use strict';
angular.module('myApp')
    .controller('record_Controller',['$rootScope','$scope','$filter','recordService',
        function($rootScope,$scope,$filter,recordService) {
            $scope.storeId = $rootScope.user.store.storeId; //4S店
            $scope.userName = $rootScope.user.userName;
            $scope.bhDock = $rootScope.user.store.bhDock;
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-70
                };
            },100);

            //根据4s店id查询保险公司信息
            recordService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{
                }
            });

            //查询更新密码记录
            $scope.recordPage = {};
            $scope.recordPage = {
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
                    { field: 'userName',cellTooltip: true, enableColumnMenu: false,minWidth:120,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 80px;"><span>用户名</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.updatePass();"></span></div>'},
                    { name: '原密码', field: 'oldPassword', enableColumnMenu: false},
                    { name: '新密码', field: 'newPassword', enableColumnMenu: false},
                    { name: '保险公司名称', field: 'insuranceCompName',enableColumnMenu: false,cellTooltip: true},
                    { name: '操作时间', field: 'operateTime',cellFilter: 'date:"yyyy-MM-dd HH:mm:ss"',enableColumnMenu: false,cellTooltip: false},
                    { name: '操作人', field: 'operator', enableColumnMenu: false},
                    { name: '操作状态', field: 'operateStatu',enableColumnMenu: false,cellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents" ng-class="{red:row.entity.operateStatu==0}"><span>{{row.entity.operateStatu | mapCS}}</span></div>'},
                ],
                onRegisterApi: function(gridApi){
                    $scope.gridApi = gridApi;
                },
            };

            // 查询更新密码记录
            $scope.record={};
            $scope.record.operateTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.findByStoreAndTime = function(){
                var time = $scope.record.operateTime;
                var params = {operateTime:time,storeId:$scope.storeId};
                recordService.findByStoreAndTime(params).then(function(result){
                    if (result.status == 'OK') {
                        $scope.recordPage.data = result.results.content.results;
                        for(var i=1;i<=$scope.recordPage.data.length;i++){
                            var j = i-1;
                            $scope.recordPage.data[j].index = i;
                        };
                    }else{

                    };
                });
            };
            $scope.findByStoreAndTime();

            // 查询最近的更新密码操作记录
            $scope.passRecord = {};
            $scope.updatePass = function(){
                $("#updatePass").show();
                //var params = {storeId:$scope.storeId};
                //recordService.findLatestRecordByStore(params).then(function(result){
                //    if (result.status == 'OK') {
                //        $scope.passRecord = result.results.content.results;
                //        if($scope.passRecord!=null&&$scope.passRecord!=""){
                //            $scope.newPassRecord.insuranceComp = $scope.passRecord.insuranceCompName;
                //            $scope.newPassRecord.userName = $scope.passRecord.userName;
                //            //$scope.newPassRecord.oldPassword = $scope.passRecord.oldPassword;
                //            //$scope.newPassRecord.newPassword = $scope.passRecord.newPassword;
                //        }
                //    }else{
                //
                //    };
                //});
            };
            $scope.newPassRecord = {};
            $scope.addPassRecord = function(){
                var source = $scope.newPassRecord.insuranceComp.source;
                var insuranceCompName = $scope.newPassRecord.insuranceComp.insuranceCompName;
                var userName = $scope.newPassRecord.userName;
                var bhDock = $scope.user.store.bhDock;
                var oldPassword = $scope.newPassRecord.oldPassword;
                var newPassword = $scope.newPassRecord.newPassword;
                var operator = $scope.userName;
                if(source=="" || source==null){
                    $scope.angularTip("请选择保险公司",5000);
                    return;
                }
                if(userName=="" || userName==null){
                    $scope.angularTip("请填写用户名",5000);
                    return;
                }
                if(bhDock==1&&(oldPassword=="" || oldPassword==null)){
                    $scope.angularTip("请填写原密码",5000);
                    return;
                }
                if(newPassword=="" || newPassword==null){
                    $scope.angularTip("请填写新密码",5000);
                    return;
                }
                var params = {storeId:$scope.storeId,source:source,insuranceCompName:insuranceCompName,userName:userName,
                    oldPassword:oldPassword,newPassword:newPassword,operator:operator};
                $("#msgwindow").show();
                recordService.addUpdateRecord(params).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $("#updatePass").hide();
                        $scope.angularTip(result.results.message,5000);
                        $scope.findByStoreAndTime();
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            };

            //时间控件
            $('.coverDate').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                forceParse:false
            }).on('changeDate',function(ev){
                var  startTime = ev.date.valueOf();
            });
        }
    ]);

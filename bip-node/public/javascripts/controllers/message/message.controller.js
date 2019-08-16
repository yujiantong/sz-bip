/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .controller('message_Controller',['$rootScope','$scope','$filter','messageService',
        function($rootScope,$scope,$filter,messageService) {
            $scope.storeName = $rootScope.user.store.storeName;
            $scope.messageCount = 0;
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否 / --'}];
            $scope.search = {};
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-50
                };
                $scope.gridSMSbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-95
                };
            },100);
            $scope.messageAllPage = {};
            $scope.messageAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    {name: '序号',field: 'index',cellClass:'text-center',width:70, enableColumnMenu: false,type:'number'},
                    { field: 'templateName',cellTooltip: true, enableColumnMenu: false,minWidth:100,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>模板名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.smsModule()"></span></div>'},
                    { name: '起始时间', field: 'startTime',width:140,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd 00:00:00'",enableColumnMenu: false},
                    { name: '结束时间', field: 'endTime',width:140,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd 23:59:59'",enableColumnMenu: false},
                    { name: '创建者', field: 'establishName', enableColumnMenu: false},
                    { name: '创建时间', field: 'establishTime',width:140,cellTooltip: true,cellFilter: "date:'yyyy-MM-dd HH:mm:ss'", enableColumnMenu: false},
                    { name: '状态',
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents lightblue">' +
                        '<span ng-if="row.entity.enabledState==0" ng-click="grid.appScope.updateEnabledStateBtn(row)">已禁用</span>' +
                        '<span ng-if="row.entity.enabledState==1" ng-click="grid.appScope.updateEnabledStateBtn(row)">已启用</span>' +
                        '</div>',
                        enableColumnMenu: false},
                    { name: '最后操作日期', field: 'endOperationTime',width:140,cellFilter: "date:'yyyy-MM-dd HH:mm:ss'",enableColumnMenu: false},
                    { name: '最后操作者', field: 'endOperationName',enableColumnMenu: false},
                    { name: '操作',width:130,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents lightblue">' +
                        '<span ng-click="grid.appScope.previewSMSBtn(row)">预览</span>' +
                        '<span class="ml10" ng-click="grid.appScope.modifyMessage(row)">编辑</span>' +
                        '<span class="ml10" ng-click="grid.appScope.deleteSMSBtn(row)">删除</span>' +
                        '</div>',
                        enableColumnMenu: false},
                ],
                onRegisterApi : function(gridApi_sms) {
                    $scope.gridApi_sms = gridApi_sms;
                }
            };
            //查询用户
            $scope.findSMSByCondition = function(){
                $("#msgwindow").show();
                messageService.findSMSByCondition().then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.messageAllPage.data = result.results.content.results;
                        for(var i=1;i<=$scope.messageAllPage.data.length;i++){
                            var j = i-1;
                            $scope.messageAllPage.data[j].index = i;
                        }
                    } else {
                    }
                });
            }
            $scope.findSMSByCondition();

            //预览营销模块
            $scope.preview ={};
            $scope.previewSMSBtn = function(row){
                $scope.preview.details = row.entity.details;
                $("#previewSMS").show();
            }

            //新增营销模块
            $scope.smsModule = function(){
                $("#smsBox").show();
            }
            $scope.addmessage = {};
            $scope.addNewSMS = function(){
                var templateName = $scope.addmessage.templateName;
                var details = $scope.addmessage.details;
                var startTime = $scope.addmessage.startTime;
                var endTime = $scope.addmessage.endTime;
                var enabledState = $scope.addmessage.enabledState;
                var storeId = $rootScope.user.store.storeId;
                var establishName = $rootScope.user.userName;
                if(!templateName){
                    $scope.angularTip("请填写模板名称",5000);
                    return;
                };
                if(!details){
                    $scope.angularTip("请填写活动详情",5000);
                    return;
                };
                if(!startTime){
                    $scope.angularTip("请填写活动起始时间",5000);
                    return;
                };
                if(!endTime){
                    $scope.angularTip("请填写活动结束时间",5000);
                    return;
                };
                if(startTime>endTime){
                    $scope.angularTip("起始时间不能大于结束时间",5000);
                    return;
                };
                if(!enabledState){
                    $scope.angularTip("请选择模板状态",5000);
                    return;
                };
                var addsmsData = {
                    templateName:templateName,details:details,startTime:startTime,endTime:endTime,enabledState:enabledState,
                    storeId:storeId,establishName:establishName
                };
                var establishTime =  new Date();
                var index = $scope.messageAllPage.data.length+1;
                var addOneData = {
                    templateName:templateName,details:details,startTime:startTime,endTime:endTime,enabledState:enabledState,
                    storeId:storeId,establishName:establishName,establishTime:establishTime,index:index
                };
                $("#msgwindow").show();
                messageService.saveSmsTemplate(addsmsData).then(function(result){
                    $("#msgwindow").hide();
                    if(result.status == 'OK'&&result.results.success==true){
                        $("#smsBox").hide();
                        $scope.angularTip("新增营销模板成功",5000);
                        $scope.findSMSByCondition();
                        $scope.addmessage = {};
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }

            //编辑营销模块
            $scope.modifysms = {};
            $scope.modifyMessage = function(row){
                $scope.modifysms.templateName = row.entity.templateName;
                $scope.modifysms.details = row.entity.details;
                $scope.modifysms.startTime = $filter('date')(row.entity.startTime,'yyyy-MM-dd');
                $scope.modifysms.endTime = $filter('date')(row.entity.endTime,'yyyy-MM-dd');
                $scope.modifysms.enabledState = row.entity.enabledState;
                var endOperationName = $rootScope.user.userName;
                var endOperationTime =  $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                var id =  row.entity.id;
                $("#modifySmsbox").show();
                $scope.moditysmsSubmit = function(){
                    var enabledState = $scope.modifysms.enabledState.toString();
                    if(!$scope.modifysms.templateName){
                        $scope.angularTip("请填写模板名称",5000);
                        return;
                    };
                    if(!$scope.modifysms.details){
                        $scope.angularTip("请填写活动详情",5000);
                        return;
                    };
                    if(!$scope.modifysms.startTime){
                        $scope.angularTip("请填写活动起始时间",5000);
                        return;
                    };
                    if(!$scope.modifysms.endTime){
                        $scope.angularTip("请填写活动结束时间",5000);
                        return;
                    };
                    if($scope.modifysms.startTime>$scope.modifysms.endTime){
                        $scope.angularTip("起始时间不能大于结束时间",5000);
                        return;
                    };
                    if($scope.modifysms.enabledState!=1&&$scope.modifysms.enabledState!=0){
                        $scope.angularTip("请选择模板状态",5000);
                        return;
                    };
                    var modifysmsData = {
                        templateName:$scope.modifysms.templateName,details:$scope.modifysms.details,startTime:$scope.modifysms.startTime,
                        endTime:$scope.modifysms.endTime,enabledState:enabledState,endOperationName:endOperationName,
                        endOperationTime:endOperationTime,id:id
                    };
                    $("#msgwindow").show();
                    messageService.updateTemplateById(modifysmsData).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifySmsbox").hide();
                            row.entity.templateName = $scope.modifysms.templateName;
                            row.entity.details = $scope.modifysms.details;
                            row.entity.startTime = $scope.modifysms.startTime;
                            row.entity.endTime = $scope.modifysms.endTime;
                            row.entity.enabledState = $scope.modifysms.enabledState;
                            row.entity.endOperationName = endOperationName;
                            row.entity.endOperationTime = endOperationTime;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };
            //禁用/启用营销模板
            $scope.updateEnabledStateBtn = function(row) {
                $scope.enabledState = row.entity.enabledState;
                $("#enabledSMS").show();
                $scope.makesureUpdateSMS = function() {
                    $("#enabledSMS").hide();
                    $("#msgwindow").show();
                    var newState;
                    if(row.entity.enabledState==1){
                        newState = 0;
                    }else if(row.entity.enabledState==0){
                        newState = 1;
                    }
                    messageService.updateEnabledState(row.entity.id,newState).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            row.entity.endOperationName = $rootScope.user.userName;
                            row.entity.endOperationTime =  $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                            if($scope.enabledState == 0){
                                row.entity.enabledState = 1;
                                $scope.angularTip("启用成功",5000);
                            }else if($scope.enabledState == 1){
                                row.entity.enabledState = 0;
                                $scope.angularTip("禁用成功",5000);
                            }

                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
            };
            //删除营销模板
            $scope.deleteSMSBtn = function(row) {
                $("#deleteSMS").show();
                $scope.makesureDeleteSMS = function() {
                    $("#deleteSMS").hide();
                    $("#msgwindow").show();
                    messageService.deleteTemplateById(row.entity.id).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $scope.messageAllPage.data.splice($scope.messageAllPage.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
            };

            //初始按承保类型查询保单信息
            $scope.currentPage = 1;
            $scope.loadStatus=2;
            $scope.smsListPage = {};
            $scope.smsListPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '模板名称', field: 'templateName',width:90,enableColumnMenu: false},
                    { name: '发送内容', field: 'content',width:300,enableColumnMenu: false},
                    { name: '发送时间', field: 'sendTime',cellFilter: 'date:"yyyy-MM-dd HH:mm"', enableColumnMenu: false},
                    { name: '接收号码', field: 'contactWay',enableColumnMenu: false},
                    { name: '接收人',field: 'contact',cellTooltip: true,enableColumnMenu: false},
                    { name: '是否高意向',
                        cellTemplate: '<div >' +
                        '<span ng-if="row.entity.sfdj==1 && row.entity.userName==\'系统\'">&nbsp;&nbsp;是</span>' +
                        '<span ng-if="row.entity.sfdj==0 && row.entity.userName==\'系统\'">&nbsp;&nbsp;否</span>' +
                        '<span ng-if="row.entity.userName!=\'系统\'">&nbsp;&nbsp;--</span></div>',enableColumnMenu: false},
                    { name: '操作者',field: 'userName',cellTooltip: true,enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi_mess) {
                    gridApi_mess.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_mess = gridApi_mess;
                }
            };

            $scope.getPolicyPage = function(){
                if($scope.currentPage==1){
                    $scope.policyIndex= 1;
                    $scope.smsListPage.data = [];
                }
                for(var i=0;i<$scope.messageAll.data.length;i++){
                    $scope.messageAll.data[i].index = $scope.policyIndex;
                    $scope.smsListPage.data.push($scope.messageAll.data[i])
                    $scope.policyIndex = $scope.policyIndex+1;
                }
                $scope.loadingPage();

            }

            $scope.searchMore = function(){
                $scope.currentPage = $scope.currentPage + 1;
                $scope.findPhoneMessageMore();
                $scope.loadStatus=1;//正在加载中。。。
            }
            $scope.loadingPage = function(){
                if($scope.smsListPage.data.length>=$scope.messageCount){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApi_mess.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApi_mess.infiniteScroll.dataLoaded(false, true)
                }
            };
            //按类型查询
            $scope.messageAll = {data:[]};
            $scope.findPhoneMessage = function(covertype){

                var smsTemplateId = $scope.search.smsTemplateId;
                var sendTimeStart = $scope.search.sendTimeStart;
                var sendTimeEnd = $scope.search.sendTimeEnd;
                var sfgyx = $scope.search.sfgyx;
                if(covertype =='duanxin'){
                    $scope.currentPage = 1;
                }
                $scope.messageAll.data=[];
                var storeId = $rootScope.user.store.storeId;
                var params = {storeId:storeId,currentPage:$scope.currentPage,pageType:'PC',
                    smsTemplateId:smsTemplateId,sendTimeStart:sendTimeStart,sendTimeEnd:sendTimeEnd,sfgyx:sfgyx};
                $("#msgwindow").show();
                messageService.findPhoneMessage(params).then(function (result) {


                        $("#msgwindow").hide();

                        if (result.status == 'OK') {
                            $("#myTabContent").show();
                            $("#duanxin").show();
                            $scope.messageAll.data = result.results.content.results;
                            $scope.messageCount = result.results.content.messageCount;
                            $scope.getPolicyPage();

                        } else {

                        }
                    });
            }
            $scope.findPhoneMessageMore = function(){
                var smsTemplateId = $scope.search.smsTemplateId;
                var sendTimeStart = $scope.search.sendTimeStart;
                var sendTimeEnd = $scope.search.sendTimeEnd;
                var sfgyx = $scope.search.sfgyx;
                $scope.messageAll.data=[];
                var storeId = $rootScope.user.store.storeId;
                var params = {storeId:storeId,currentPage:$scope.currentPage,pageType:'PC',
                    smsTemplateId:smsTemplateId,sendTimeStart:sendTimeStart,sendTimeEnd:sendTimeEnd,sfgyx:sfgyx};
                $("#msgwindow").show();
                messageService.findPhoneMessage(params).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.messageAll.data = result.results.content.results;
                        $scope.getPolicyPage();
                    } else {

                    }
                });
            }

              //清空表单
            $scope.clearMessageSearch = function(){
                $scope.search = {};
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

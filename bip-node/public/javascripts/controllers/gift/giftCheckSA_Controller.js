'use strict';
angular.module('myApp')
    .controller('giftCheckSA_Controller',['$rootScope','$scope','$filter','giftCheckSAService','$state',
        function($rootScope,$scope,$filter,giftCheckSAService,$state) {
            $scope.customerAll = [];
            $scope.startNum = 1;//初始化页数
            $scope.customerIndex= 1;//初始化下标
            $scope.policyCount = 0;
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.condition = {}; //查询条件
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            $scope.gridbox = {
                width:$("#myTabContent").width()-2,
                height:$("#myTabContent").height()-100
            }
            //初始化页面查询数据
            $scope.giftCheckPage = {
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
                    { name: '车架号', field: 'chassisNumber', enableColumnMenu: false},
                    { name: '联系人', field: 'contact', enableColumnMenu: false},
                    { name: '联系方式', field: 'contactWay', enableColumnMenu: false},
                    { name: '保单号', field: 'binsuranceNumber', enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.giftDetails(row.entity)" class="btn btn-default btn-sm genzcl">赠送核销</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_zshx) {
                    gridApi_zshx.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_zshx = gridApi_zshx;
                }
            };
            //赠送核销记录
            $scope.hxSearch = {};
            $scope.findGivingCont = function(){
                var carLicenseNumber = $scope.hxSearch.carLicenseNumber;
                var chassisNumber = $scope.hxSearch.chassisNumber;
                var contact = $scope.hxSearch.contact;
                var contactWay = $scope.hxSearch.contactWay;
                var binsuranceNumber = $scope.hxSearch.binsuranceNumber;
                //核销的只需要查询出服务类的
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        startNum: $scope.startNum,carLicenseNumber: carLicenseNumber,chassisNumber:chassisNumber,
                        contact:contact,contactWay:contactWay,binsuranceNumber:binsuranceNumber
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                giftCheckSAService.findGivingByCondition($scope.condition)
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
                    $scope.giftCheckPage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.customerAll.length;i++){
                    $scope.customerAll[i].index = $scope.customerIndex;
                    $scope.giftCheckPage.data.push($scope.customerAll[i]);
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
                if($scope.giftCheckPage.data.length>=$scope.policyCount||$scope.customerAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.gridApi_zshx.infiniteScroll.dataLoaded(false, false)
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.gridApi_zshx.infiniteScroll.dataLoaded(false, true)
                }
            };
            //清空表单
            $scope.clearhxSearch = function(){
                $scope.hxSearch = {};
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

            //赠送核销明细
            $scope.giftInfoPage = {};
            $scope.giftInfoPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { name: '赠品类型', field: 'giftType',cellFilter: 'mapZPLX',enableColumnMenu: false},
                    { name: '赠品名称', field: 'giftName',enableColumnMenu: false},
                    { name: '数量', field: 'amount',enableColumnMenu: false},
                    { name: '剩余', field: 'surplusNum',enableColumnMenu: false},
                    { name: '本次使用',enableColumnMenu: false,
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<input class="zpUseNum"  ng-change="grid.appScope.thisUsetimes(row.entity)" ng-model="row.entity.newUseNum" type="number">' +
                        '</div>'},
                    { name: '消费明细',width:170,enableColumnMenu: false,cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<input class="zpremark"  ng-model="row.entity.addhxDetail" type="text"></div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //赠送核销明细
            $scope.giftdyInfoPage = {};
            $scope.giftdyInfoPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { name: '赠品类型', field: 'giftType',cellFilter: 'mapZPLX',enableColumnMenu: false},
                    { name: '赠品名称', field: 'giftName',enableColumnMenu: false},
                    { name: '剩余', field: 'surplusNum',enableColumnMenu: false},
                    { name: '本次使用', field: 'thisUseNum',enableColumnMenu: false},
                    { name: '消费明细', field: 'bcxfDetail',width:170,enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //全部赠送核销明细
            $scope.giftAllInfoPage = {};
            $scope.giftAllInfoPage = {
                enableSorting: false,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index',width:50, enableColumnMenu: false,type:'number'},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { name: '赠品类型', field: 'giftType',cellFilter: 'mapZPLX',enableColumnMenu: false},
                    { name: '赠品名称', field: 'giftName',enableColumnMenu: false},
                    { name: '数量', field: 'amount',enableColumnMenu: false},
                    { name: '剩余', field: 'surplusNum',enableColumnMenu: false},
                    { name: '本次使用', field: 'thisUseNum',enableColumnMenu: false},
                    { name: '消费明细', field: 'bcxfDetail',width:170,cellTooltip: true,enableColumnMenu: false},
                    { name: '核销时间', field: 'hxTime',cellFilter: "date:'yyyy-MM-dd/EEE'",cellTooltip: true,enableColumnMenu: false},
                    { name: '核销人', field: 'hxr',enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //赠送核销明细
            $scope.custInfo = {};
            $scope.giftDetails=function(rowData){
                $("#gz_tab").children("li").removeClass("active");
                $("#gz_tab").children("li").eq(0).addClass("active");
                $("#gz_tab_grid").children("div.tab-pane").removeClass("in active");
                $("#gz_tab_grid").children("div.tab-pane").eq(0).addClass("in active");
                $scope.custInfo = rowData;
                $scope.approvalBillId = rowData.approvalBillId;
                $("#msgwindow").show();
                $scope.findAllHxRecord(1);
                giftCheckSAService.findGivingByApprovalBillId($scope.approvalBillId).then(function (result) {
                    $("#msgwindow").hide();
                    $("#hxdetail").show();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.giftListdata = result.results.content.results;
                        $scope.giftInfoPage.data = [];
                        for(var i=0;i<$scope.giftListdata.length;i++){
                            if($scope.giftListdata[i].giftType==1||$scope.giftListdata[i].giftType==4||$scope.giftListdata[i].giftType==5){
                                $scope.giftInfoPage.data.push($scope.giftListdata[i])
                            }
                        }
                        $scope.giftdyInfoPage.data = $scope.giftInfoPage.data;
                        for(var j=0;j<$scope.giftInfoPage.data.length;j++){
                            $scope.giftInfoPage.data[j].surplusNum = parseInt($scope.giftInfoPage.data[j].surplusNum);
                            $scope.giftInfoPage.data[j].index = j+1;
                            $scope.giftInfoPage.data[j].newUseNum = 0;
                            $scope.giftInfoPage.data[j].addhxDetail = "";
                            $scope.giftdyInfoPage.data[j].index = j+1;
                        }
                    } else {

                    };
                });
            };
            $scope.findAllHxRecord=function(number){
                if(number==1){
                    $("#hxbc").show();
                    $("#hxdy").hide();
                }else if(number==3){
                    $("#hxbc").hide();
                    $("#hxdy").hide();
                }
                $("#msgwindow").show();
                giftCheckSAService.findAllHxRecordByApprovalBillId({approvalBillId:$scope.approvalBillId}).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.giftAllInfoPage.data = result.results.content.results;
                        for(var j=0;j<$scope.giftAllInfoPage.data.length;j++){
                            $scope.giftAllInfoPage.data[j].index = j+1;
                        }
                    } else {

                    };
                });
            };

            $scope.thisUsetimes=function(rowData){
                if(rowData.newUseNum>rowData.surplusNum){
                    $scope.angularTip("本次使用数不能大于剩余数",5000);
                    rowData.newUseNum = 0;
                }
                if(rowData.newUseNum<0){
                    $scope.angularTip("本次使用数不能为负",5000);
                    rowData.newUseNum = 0;
                }
            }
            $scope.tabBtnShow=function(number){
                $scope.tabShowNo = number;
                if(number==1){
                    $("#hxbc").show();
                    $("#hxdy").hide();
                }else if(number==2){
                    $("#hxbc").hide();
                    $("#hxdy").show();
                }
            }

            //修改赠送核销信息
            $scope.updateGiftInfo=function(){
                var useNum=0;
                for(var i=0;i<$scope.giftInfoPage.data.length;i++){
                    if($scope.giftInfoPage.data[i].newUseNum != 0){
                        useNum = 1;
                    }
                }
                if(useNum = 1){
                    for(var i=0;i<$scope.giftInfoPage.data.length;i++){
                        $scope.giftInfoPage.data[i].thisUseNum = $scope.giftInfoPage.data[i].newUseNum;
                        $scope.giftInfoPage.data[i].bcxfDetail = $scope.giftInfoPage.data[i].addhxDetail;
                    }
                    $("#msgwindow").show();
                    giftCheckSAService.updateGiving($scope.giftInfoPage.data).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            giftCheckSAService.findGivingByApprovalBillId($scope.approvalBillId).then(function (result) {
                                if (result.status == 'OK'&&result.results.content.status=='OK') {
                                    $scope.giftListdata = result.results.content.results;
                                    $scope.giftInfoPage.data = [];
                                    for(var i=0;i<$scope.giftListdata.length;i++){
                                        if($scope.giftListdata[i].giftType==1||$scope.giftListdata[i].giftType==4||$scope.giftListdata[i].giftType==5){
                                            $scope.giftInfoPage.data.push($scope.giftListdata[i])
                                        }
                                    }
                                    $scope.giftdyInfoPage.data = $scope.giftInfoPage.data;
                                    for(var j=0;j<$scope.giftInfoPage.data.length;j++){
                                        $scope.giftInfoPage.data[j].index = j+1;
                                        $scope.giftInfoPage.data[j].newUseNum = 0;
                                        $scope.giftInfoPage.data[j].addhxDetail="";
                                        $scope.giftdyInfoPage.data[j].index = j+1;
                                    }
                                } else {

                                };
                            });
                            $scope.angularTip("操作成功",5000);
                        }else{
                            $scope.angularTip("操作失败",5000);
                        }
                    });
                }else{
                    $scope.angularTip("操作成功",5000);
                }
            }
            $scope.printHxPdf=function(){
                $("#msgwindow").show();
                giftCheckSAService.printHxd($scope.approvalBillId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        var hr = "/pdf/"+$scope.custInfo.chassisNumber+".pdf";
                        $("#iframe").attr("src", hr);
                        var ifr = document.getElementById("iframe");
                        if (ifr.attachEvent) {
                            ifr.attachEvent("onload", function() {
                                $scope.angularTip("Local if is now loaded attachEvent.",5000);
                            });
                        } else {
                            ifr.onload = function() {
                                setTimeout(function(){
                                    document.getElementById("iframe").contentWindow.print();
                                },200);
                            };
                        };
                    } else {
                        $scope.angularTip("操作失败",5000);
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

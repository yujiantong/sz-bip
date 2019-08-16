/**
 * Created by ben on 2016/12/28. 出单员
 */
'use strict';
angular.module('myApp')
    .controller('giftRecordIW_Controller',['$rootScope','$scope','$filter','giftRecordIWService',
        function($rootScope,$scope,$filter,giftRecordIWService,$state) {
            $scope.customerAll = [];
            $scope.startNum = 1;//初始化页数
            $scope.customerIndex= 1;//初始化下标
            $scope.policyCount = 0;
            $scope.loadStatus = 2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.condition = {}; //查询条件
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数

            $scope.startNumExport = 1; //开始页
            $scope.exportNumberEachFile = 10000; //每个文件导出的记录数
            //初始化页面查询数据
            $scope.giftRecordPage = {
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
                    { name: '备注', field: 'remark',cellTooltip: true, enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.giftDetails(row.entity)" class="btn btn-default btn-sm genzcl">查看明细</button>'+
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
                var createTimeStart = $scope.createTimeStart;
                var createTimeEnd = $scope.createTimeEnd;
                if(createTimeStart>createTimeEnd){
                    $scope.angularTip("开始日期不能大于结束日期",5000);
                    return;
                }
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        startNum: $scope.startNum,carLicenseNumber: carLicenseNumber,chassisNumber:chassisNumber,
                        contact:contact,contactWay:contactWay,binsuranceNumber:binsuranceNumber,
                        createTimeStart:createTimeStart,createTimeEnd:createTimeEnd
                    };
                }else{
                    $scope.condition.startNum = $scope.startNum;
                };
                $("#msgwindow").show();
                giftRecordIWService.findGivingByCondition($scope.condition)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK'&&result.results.content.status=='OK') {
                            $scope.customerAll = result.results.content.results;
                            $scope.policyCount = result.results.content.policyCount;
                            $scope.TotalAmount = result.results.content.dou || 0;
                            $scope.getPolicyPage();
                        } else {

                        };
                    });
            };
            $scope.chooseCycle = function(time){
                var myDate = new Date();
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var threeMonth = myDate-90*24*60*60*1000;
                $scope.createTimeEnd = $filter('date')(new Date(),'yyyy-MM-dd');
                if(time==1){
                    $scope.createTimeStart = $filter('date')(oneWeek,'yyyy-MM-dd');
                }else if(time==2){
                    $scope.createTimeStart = $filter('date')(oneMonth,'yyyy-MM-dd');
                }else if(time==3){
                    $scope.createTimeStart = $filter('date')(threeMonth,'yyyy-MM-dd');
                }
                $scope.findGivingCont();
            }

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
                    $scope.giftRecordPage.data = [];
                }
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.customerAll.length;i++){
                    $scope.customerAll[i].index = $scope.customerIndex;
                    $scope.giftRecordPage.data.push($scope.customerAll[i]);
                    $scope.customerIndex = $scope.customerIndex+1;
                }
                $scope.loadingPage();
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
                $scope.findGivingCont();
            };

            //判定数据是否加载完毕
            $scope.loadingPage = function(){
                if($scope.giftRecordPage.data.length>=$scope.policyCount||$scope.customerAll.length<$rootScope.pageSize){
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
                    { name: '有效期至', field: 'validDate',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售价', field: 'sellingPrice',enableColumnMenu: false},
                    { name: '数量', field: 'amount',enableColumnMenu: false},
                    { name: '金额', field: 'amountMoney',enableColumnMenu: false},
                    { name: '备注', field: 'remark',cellTooltip: true,enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //赠送核销明细
            $scope.custInfo = {};
            $scope.giftDetails=function(rowData){
                $scope.custInfo = rowData;
                $scope.approvalBillId = rowData.approvalBillId;
                $("#msgwindow").show();
                giftRecordIWService.findGivingByApprovalBillId($scope.approvalBillId).then(function (result) {
                    $("#msgwindow").hide();
                    $("#hxdetail").show();
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.giftInfoPage.data = result.results.content.results;
                        $scope.giftInfoAmount = result.results.content.dou || 0;
                        for(var i=0;i<$scope.giftInfoPage.data.length;i++){
                            if($scope.giftInfoPage.data[i].givingInformationId!=0){
                                $scope.giftInfoPage.data.splice($scope.giftInfoPage.data.indexOf($scope.giftInfoPage.data[i]), 1);
                                i=i-1;
                            }
                        }
                        for(var j=0;j<$scope.giftInfoPage.data.length;j++){
                            $scope.giftInfoPage.data[j].index = j+1;
                        }
                    } else {

                    };
                });
            };
            //导出下拉框
            $scope.exportGiftShow=function(){
                $("#exportGift").show();
            };
            $scope.exportGiftHide=function(){
                $("#exportGift").hide();
            };

            //停止导出
            $scope.stopExportData = function(){
                $scope.stopExport = true;
            }
            //exportGiftRecord 导出赠品信息
            $scope.exportGiftRecord = function(){
                $scope.loadFinish = false;
                $scope.expNum = 0;
                $scope.showExp = 1;

                if($scope.policyCount &&　$scope.policyCount > 0){
                    $scope.expNum =  $scope.policyCount
                }
                if($scope.expNum==0){
                    $scope.angularTip("无赠送记录导出！",5000);
                    return;
                }
                if( $scope.expNum>10000){
                    /* $("#exportSet").show();
                     $scope.expCountValue = [5000,6000,7000,8000,9000,10000];
                     // $scope.setExport.expCount = 50;
                     $scope.setExp = function(){
                         $("#exportSet").hide();
                         $scope.exportNumberEachFile = $scope.expCountValue;
                         $scope.exportToExcel();
                     }*/
                    $scope.angularTip("导出数据量超出限制！",5000);
                    return;
                }else {
                    $scope.exportToExcel();
                }
            }
            //导出赠送记录
            $scope.exportToExcel=function(){

                $scope.loadFinish = '';//每次请求完成
                $scope.loadDataFinish = false;//分文件导出,一个文件导出完毕标志
                $scope.finaLoadDataFinish = false;//最终全部导出完成标志
                $scope.showSuccessExport =0;//显示成功导出条数
                $scope.stopExport = false;
                $scope.policyExportCount = 0
                $scope.progressExport = {width:"0%"}
                $scope.startNumExport = 1; //开始页
                $scope.exportData = [];
                $scope.exportCustomerData = [];
                var load = $scope.$watch("loadFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if($scope.loadFinish){
                        $scope.getExportData();
                    }
                },true);
                var creatingFile =$scope.$watch("loadDataFinish", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.loadDataFinish) {
                        //最终导出完成,释放loadDataFinish监听
                        if($scope.finaLoadDataFinish){
                            load();
                            creatingFile();
                        }
                        $scope.loadFinish = false;

                        setTimeout(function(){
                            var fileName = $scope.exportCustomerData[0].foursStore + $filter('date')(new Date(),'yyyyMMdd') + '赠品记录.xls'
                            var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+'赠品记录';
                            //console.log("exportCustomerData ==>" + JSON.stringify($scope.exportCustomerData))
                            //console.log("exportData ==> " + JSON.stringify($scope.exportData))
                            giftRecordIWService.exportGiftRecordExcel($scope.exportCustomerData,$scope.exportData);
                            //console.log("fileName " + fileName + " worksheetName " + worksheetName)
                            // ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName)
                            if(!$scope.finaLoadDataFinish){
                                $scope.loadFinish = true;
                                $scope.loadDataFinish = false;
                                $scope.getExportData();
                            }
                            $scope.exportData = [];
                            $scope.exportCustomerData = [];
                            if($scope.finaLoadDataFinish){
                                $("#msgExportGift").hide();
                                $("#msgExport").hide();
                            }
                        },100);
                    }
                },true);
                var stop =$scope.$watch("stopExport", function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    if ($scope.stopExport) {
                        load();
                        creatingFile();
                        stop();
                        $scope.startNum = 1;
                        $scope.loadFinish = '';
                        $scope.exportData = [];
                        $scope.exportCustomerData = [];
                        $("#msgExportGift").hide();
                        $("#msgExport").hide();
                    }
                },true);
                $scope.getExportData();
            }

            //导出赠送信息获取数据方法
            $scope.getExportData = function () {

                $scope.exportGiftRecords();
                $scope.startNumExport = $scope.startNumExport + 1;
            };
            //导出赠送信息
            $scope.exportGiftRecords=function() {
                var carLicenseNumber = $scope.hxSearch.carLicenseNumber;
                var chassisNumber = $scope.hxSearch.chassisNumber;
                var contact = $scope.hxSearch.contact;
                var contactWay = $scope.hxSearch.contactWay;
                var binsuranceNumber = $scope.hxSearch.binsuranceNumber;
                var createTimeStart = $scope.createTimeStart;
                var createTimeEnd = $scope.createTimeEnd;
                if(!createTimeStart && !createTimeEnd){
                    $scope.angularTip("请选择开始日期,结束日期",5000);
                    return;
                }
                if(createTimeStart>createTimeEnd){
                    $scope.angularTip("开始日期不能大于结束日期",5000);
                    return;
                }
                $scope.customerAll= [];
                $scope.resetPageData();
                if($scope.startNum==1) {
                    $scope.condition = {
                        startNum: $scope.startNumExport,carLicenseNumber: carLicenseNumber,chassisNumber:chassisNumber,
                        contact:contact,contactWay:contactWay,binsuranceNumber:binsuranceNumber,
                        createTimeStart:createTimeStart,createTimeEnd:createTimeEnd
                    };
                };
                $scope.loadFinish = false;

                $("#msgExport").show();
                giftRecordIWService.findGivingByCondition($scope.condition)
                    .then(function (result) {
                        // console.log("result " + JSON.stringify(result.results.contact)
                        if (result.status == 'OK' && result.results.content.status == 'OK') {
                            //console.log("result回调 ==>" + JSON.stringify(result))
                            var condition = "";
                            if(result.results.content.results.length > 0){
                                var customer = result.results.content.results;
                                for(var i=0;i<customer.length;i++){
                                    if(customer[i].approvalBillId){
                                        condition += customer[i].approvalBillId  + ",";
                                    }
                                }
                                condition = condition.substring(0,condition.length-1);
                                giftRecordIWService.exportGiftRecord(condition).then(function (resultCustomer){
                                    if (resultCustomer.status == 'OK' && resultCustomer.results.success &&resultCustomer.results.content.status == 'OK') {
                                        var customer = resultCustomer.results.content.results;
                                        $.merge($scope.exportCustomerData,customer);
                                        $scope.getExportDataCallback(result.results.content.results,result.results.content.policyCount);
                                    }else{

                                    }
                                });
                            }

                        } else {
                            $scope.angularTip(result.result.message,5000)
                        }
                    });
            }
            //查询导出赠送信息回调后的处理
            $scope.getExportDataCallback = function(customerArray,policyExportCount){
                $.merge($scope.exportData,customerArray);
                //console.log("$scope.exportData " + $scope.exportData.length + " " + JSON.stringify($scope.exportData))
                //每个文件设置可以导出条数限制
                if($scope.exportData.length>0&&$scope.exportData.length%$scope.exportNumberEachFile==0){

                    $scope.loadDataFinish=true;
                }
                if(customerArray.length<$rootScope.pageSize){
                    $scope.loadDataFinish=true;
                    $scope.finaLoadDataFinish=true;
                }

                $scope.policyExportCount = policyExportCount;
                $scope.showSuccessExport += customerArray.length;
                var pro = 0;
                if($scope.policyExportCount!=0){
                    pro = ($scope.showSuccessExport/policyExportCount*100).toFixed(2);
                }
                $scope.progressExport.width = pro+"%";
                $scope.loadFinish = true;
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

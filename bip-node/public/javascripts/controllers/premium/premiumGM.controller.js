/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .controller('premiumGM_Controller',['$rootScope','$scope','$filter','premiumGMService',
        function($rootScope,$scope,$filter,premiumGMService) {
            $scope.premiumAll = [];
            $scope.loadStatus=2;//判定数据是否加载完成。  ---默认为加载完成
            $scope.policyCount = 0;
            $scope.startNum = 1;//初始化页数
            $scope.premiumIndex= 1;//初始化下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.pageType="bfcx";
            $scope.bfSearch = {}; //潜客条件查询
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-100
                };
            },100);
            //根据4s店id查询保险公司信息
            premiumGMService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });
            //查询本店各种用户
            premiumGMService.findKindsUser().then(function(res){
                if(res.status == 'OK'&&res.results.content.status=='OK'){
                    $scope.kingdsUser = res.results.content.result;
                }else{

                }
            });

            //重置数据，包括页数，表格内容
            $scope.resetPageData = function(){
                if($scope.searchMoreStatus ==true){
                    $scope.startNum = 1; //开始页
                    $scope.condition = {};
                }else{
                    $scope.startNum = $scope.startNum + 1;
                }
                if($scope.startNum==1){
                    $scope.premiumIndex= 1;
                    $scope.premiumAllPage.data = [];
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
                if($scope.pageType=='bfcx'){
                    $scope.findAllpremiumByUserId();
                }
            };

            $scope.premiumAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '负责人', field: 'principal',enableColumnMenu: false},
                    { name: '业务员', field: 'clerk',enableColumnMenu: false},
                    { name: '投保日期', field: 'insurDate',cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '保险公司', field: 'insuranceCompName',enableColumnMenu: false},
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false},
                    { name: '车架号', field: 'chassisNumber',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '联系人', field: 'contact',enableColumnMenu: false},
                    { name: '出单员', field: 'insuranceWriter',enableColumnMenu: false},
                    { name: '保费额度', field: 'premiumCount',enableColumnMenu: false},
                    { name: '手续费金额', field: 'factorageCount',enableColumnMenu: false},
                    { name: '综合优惠', field: 'comprehensiveDiscount',enableColumnMenu: false},
                    { name: '实收金额', field: 'realPay',enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.giftDetails(row.entity)" class="btn btn-default btn-sm genzcl">查看明细</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(gridApi_premium) {
                    gridApi_premium.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApi_premium = gridApi_premium;
                }
            };

            $scope.getPolicyPage = function(){
                if ($scope.pageType == 'bfcx') {
                    for (var i = 0; i < $scope.premiumAll.length; i++) {
                        $scope.premiumAll[i].index = $scope.premiumIndex;
                        if($scope.premiumAll[i].status==1){
                            $scope.premiumAll[i].statusStr = '已处理';
                        }else{
                            $scope.premiumAll[i].statusStr = '未处理';
                        }
                        $scope.premiumAllPage.data.push($scope.premiumAll[i]);
                        $scope.premiumIndex = $scope.premiumIndex + 1;
                    };
                }
                $scope.loadingPage();
            }
            //判定数据是否加载完毕
            $scope.loadingPage = function(){
                if($scope.pageType == 'bfcx'){
                    if($scope.premiumAllPage.data.length>=$scope.policyCount ||$scope.premiumAll.length<$rootScope.pageSize){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApi_premium.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApi_premium.infiniteScroll.dataLoaded(false, true)
                    }
                }
            }

            //根据条件查询保单及统计保费总额度
            $scope.findAllpremiumByUserId = function(){
                $scope.pageType="bfcx";
                $scope.resetPageData();
                var principalId = $scope.bfSearch.principalId;
                var insuranceCompName = $scope.bfSearch.insuranceCompName;
                var carLicenseNumber = $scope.bfSearch.carLicenseNumber;
                var chassisNumber = $scope.bfSearch.chassisNumber;
                var insuranceWriter = $scope.bfSearch.insuranceWriter;
                var cbrqStart = $scope.startTime;
                var cbrqEnd = $scope.endTime;
                var start = $scope.startNum;
                var condition = {
                    principalId: principalId, insuranceCompName: insuranceCompName,carLicenseNumber:carLicenseNumber,
                    chassisNumber:chassisNumber,cbrqStart:cbrqStart,cbrqEnd:cbrqEnd,start:start,insuranceWriter:insuranceWriter
                }
                premiumGMService.findInformationAndPremiumCount(condition).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.premiumAll = result.results.content.lists;
                        $scope.policyCount = result.results.content.policyCount;
                        $scope.TotalAmount = result.results.content.dou || 0;
                        $scope.getPolicyPage();
                    } else {

                    };
                });
            }

            //清空查询条件
            $scope.clearBfSearch = function(){
                $scope.bfSearch = {};
            };
            $scope.chooseCycle = function(time){
                var myDate = new Date();
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var threeMonth = myDate-90*24*60*60*1000;
                $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
                if(time==1){
                    $scope.startTime = $filter('date')(oneWeek,'yyyy-MM-dd');
                }else if(time==2){
                    $scope.startTime = $filter('date')(oneMonth,'yyyy-MM-dd');
                }else if(time==3){
                    $scope.startTime = $filter('date')(threeMonth,'yyyy-MM-dd');
                }
                $scope.findAllpremiumByUserId();
            }
            //跟踪处理悬浮按钮
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
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
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
                $scope.custInfo.insurDate = $filter('date')($scope.custInfo.insurDate,'yyyy-MM-dd');
                $scope.approvalBillId = rowData.approvalBillId;
                $("#msgwindow").show();
                premiumGMService.findGivingByApprovalBillId($scope.approvalBillId).then(function (result) {
                    $("#msgwindow").hide();
                    $("#bfdetail").show();
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

/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .controller('giftManagement_Controller',['$rootScope','$scope','$filter','giftManagementService',
        function($rootScope,$scope,$filter,giftManagementService) {
            $scope.fuwugiftAll = [];
            $scope.fuwugiftIndex= 1;//初始化下标
            $scope.giftType=1;
            $scope.zpSearch = {}; //赠品条件查询
            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-70
                };
            },100);

            //服务管理
            $scope.fuwugiftAllPage = {}
            $scope.fuwugiftAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { field: 'giftName',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>赠品名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newFuwubtn(1);"></span></div>'},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售成本', field: 'salePrice', enableColumnMenu: false},
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
                    { name: '有效时限', field: 'validLength',enableColumnMenu: false},
                    { name: '生效日期', field: 'effectiveTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '失效日期', field: 'failureTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '状态', field: 'status',width:60,cellFilter:'mapSX',enableColumnMenu: false},
                    {
                        name: '操作',
                        cellClass: 'girdoperate',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.status==2" src="../../images/enable.png" ng-click="grid.appScope.operateStatus(row.entity,1)"/>' +
                        '<img ng-if="row.entity.status==1" src="../../images/enable2.png" ng-click="grid.appScope.operateStatus(row.entity,2)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyGiftBtn(row.entity,1)" class="btn btn-default btn-sm genzcl">编辑</button>'+
                        '</div></div>'},
                ]
            };
            //精品管理
            $scope.finegiftAllPage = {}
            $scope.finegiftAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { field: 'giftName',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>赠品名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newjpbtn();"></span></div>'},
                    { name: '赠品型号', field: 'giftModel',enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售成本', field: 'salePrice', enableColumnMenu: false},
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
                    { name: '生效日期', field: 'effectiveTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '失效日期', field: 'failureTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '状态', field: 'status',width:60,cellFilter:'mapSX',enableColumnMenu: false},
                    {
                        name: '操作',
                        cellClass: 'girdoperate',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.status==2" src="../../images/enable.png" ng-click="grid.appScope.operateStatus(row.entity,1)"/>' +
                        '<img ng-if="row.entity.status==1" src="../../images/enable2.png" ng-click="grid.appScope.operateStatus(row.entity,2)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyGiftBtn(row.entity,2)" class="btn btn-default btn-sm genzcl">编辑</button>'+
                        '</div></div>'},
                ]
            };

            //礼包管理
            $scope.packsgiftAllPage = {}
            $scope.packsgiftAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { field: 'giftName',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>赠品名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.newlbbtn();"></span></div>'},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售成本', field: 'salePrice', enableColumnMenu: false},
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
                    { name: '有效时限', field: 'validLength',width:70,enableColumnMenu: false},
                    { name: '生效日期', field: 'effectiveTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '失效日期', field: 'failureTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '状态', field: 'status',width:60,cellFilter:'mapSX',enableColumnMenu: false},
                    {
                        name: '操作',
                        cellClass: 'girdoperate',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.status==2" src="../../images/enable.png" ng-click="grid.appScope.operateStatus(row.entity,1)"/>' +
                        '<img ng-if="row.entity.status==1" src="../../images/enable2.png" ng-click="grid.appScope.operateStatus(row.entity,2)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyGiftBtn(row.entity,3)" class="btn btn-default btn-sm genzcl">编辑</button>'+
                        '</div></div>'},
                ]
            };
            //储值卡管理
            $scope.giftcardAllPage = {}
            $scope.giftcardAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { field: 'giftName',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>赠品名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.czkhyjfbtn(4);"></span></div>'},
                    { name: '额度', field: 'quota',enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售成本', field: 'salePrice', enableColumnMenu: false},
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
                    { name: '有效时限', field: 'validLength',width:70,enableColumnMenu: false},
                    { name: '生效日期', field: 'effectiveTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '失效日期', field: 'failureTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '状态', field: 'status',width:60,cellFilter:'mapSX',enableColumnMenu: false},
                    {
                        name: '操作',
                        cellClass: 'girdoperate',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.status==2" src="../../images/enable.png" ng-click="grid.appScope.operateStatus(row.entity,1)"/>' +
                        '<img ng-if="row.entity.status==1" src="../../images/enable2.png" ng-click="grid.appScope.operateStatus(row.entity,2)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyGiftBtn(row.entity,4)" class="btn btn-default btn-sm genzcl">编辑</button>'+
                        '</div></div>'},
                ]
            };
            //会员积分管理
            $scope.integralAllPage = {}
            $scope.integralAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { field: 'giftName',cellTooltip: true, enableColumnMenu: false,minWidth:110,headerCellTemplate: '' +
                    '<div role="button" class="ui-grid-cell-contents fl" style="width: 70px;"><span>赠品名称</span></div><div class="fr">' +
                    '<span class="slick-header-button" ng-click="grid.appScope.czkhyjfbtn(5);"></span></div>'},
                    { name: '额度', field: 'quota',enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '销售成本', field: 'salePrice', enableColumnMenu: false},
                    { name: '实际成本', field: 'actualPrice',enableColumnMenu: false},
                    { name: '有效时限', field: 'validLength',width:70,enableColumnMenu: false},
                    { name: '生效日期', field: 'effectiveTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '失效日期', field: 'failureTime',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name: '状态', field: 'status',width:60,cellFilter:'mapSX',enableColumnMenu: false},
                    {
                        name: '操作',
                        cellClass: 'girdoperate',
                        cellTemplate: '<div class="cursor" >' +
                        '<img ng-if="row.entity.status==2" src="../../images/enable.png" ng-click="grid.appScope.operateStatus(row.entity,1)"/>' +
                        '<img ng-if="row.entity.status==1" src="../../images/enable2.png" ng-click="grid.appScope.operateStatus(row.entity,2)"/>' +
                        '</div>',
                        enableColumnMenu: false, enableSorting: false
                    },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyGiftBtn(row.entity,5)" class="btn btn-default btn-sm genzcl">编辑</button>'+
                        '</div></div>'},
                ]
            };
            //操作
            $scope.operateStatus = function(giftData,status){
                var giftCode = giftData.giftCode;
                var status = status;
                giftManagementService.updateGiftStaus(giftCode,status).then(function(result){
                    if(result.status == 'OK'){
                        $scope.angularTip("操作成功",5000);
                        giftData.status = status;
                    }else{
                        $scope.angularTip("操作失败",5000);
                    }
                });
            }
            //根据条件查询赠品
            $scope.findGiftByCondition = function(giftType){
                var giftName = $scope.zpSearch.giftName;
                var giftCode = $scope.zpSearch.giftCode;
                var status = $scope.zpSearch.status;
                var storeId = $rootScope.user.store.storeId;
                $scope.giftType = giftType;
                var condition = {
                    giftName:giftName,giftCode:giftCode,status:status,giftType:giftType,storeId:storeId
                }
                giftManagementService.findGiftByCondition(condition).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        if($scope.giftType==1){
                            $scope.fuwugiftAllPage.data = result.results.content.results;
                            for(var i=0;i<$scope.fuwugiftAllPage.data.length;i++){
                                $scope.fuwugiftAllPage.data[i].index = i+1;
                            }
                        };
                        if($scope.giftType==2){
                            $scope.finegiftAllPage.data = result.results.content.results;
                            for(var i=0;i<$scope.finegiftAllPage.data.length;i++){
                                $scope.finegiftAllPage.data[i].index = i+1;
                            }
                        }
                        if($scope.giftType==3){
                            $scope.packsgiftAllPage.data = result.results.content.results;
                            for(var i=0;i<$scope.packsgiftAllPage.data.length;i++){
                                $scope.packsgiftAllPage.data[i].index = i+1;
                            }
                        }
                        if($scope.giftType==4){
                            $scope.giftcardAllPage.data = result.results.content.results;
                            for(var i=0;i<$scope.giftcardAllPage.data.length;i++){
                                $scope.giftcardAllPage.data[i].index = i+1;
                            }
                        }
                        if($scope.giftType==5){
                            $scope.integralAllPage.data = result.results.content.results;
                            for(var i=0;i<$scope.integralAllPage.data.length;i++){
                                $scope.integralAllPage.data[i].index = i+1;
                            }
                        }
                    } else {

                    };
                });
            }
            $scope.findGiftByCondition(1);
            //清空查询条件
            $scope.clearzpSearch = function(){
                $scope.zpSearch = {};
            };
            //储值卡管理、会员积分管理
            $scope.czkhyjfbtn=function(fwtype){
                $scope.fwtype = fwtype;
                $("#czkhy").show();
                $scope.gift.validLength = 0;
            }
            //新增赠品弹框、
            $scope.newFuwubtn=function(fwtype){
                $scope.fwtype = fwtype;
                $("#xzfw").show();
                $scope.gift.validLength = 0;
            }
            $scope.newjpbtn=function(){
                $("#xzjp").show();
                $scope.gift.validLength = 0;
            }
            $scope.newlbbtn=function(){
                $("#xzlb").show();
                $scope.gift.validLength = 0;
                $scope.gift.fwNum = 1;
                $scope.gift.jpNum = 1;
                $scope.fwPackageDetails = [];
                $scope.jpPackageDetails = [];
                $scope.gift.guidePrice = 0;
                $scope.gift.salePrice = 0;
                $scope.gift.actualPrice = 0;
            }
            //服务赠品数量
            $scope.minusFwnum=function(){
                if($scope.gift.fwNum>=1){
                    $scope.gift.fwNum = $scope.gift.fwNum -1;
                }
            }
            $scope.plusFwnum=function(){
                $scope.gift.fwNum = $scope.gift.fwNum +1;;
            }
            //精品赠品数量
            $scope.minusJpnum=function(){
                if($scope.gift.jpNum>=1){
                    $scope.gift.jpNum = $scope.gift.jpNum -1;
                }
            }
            $scope.plusJpnum=function(){
                $scope.gift.jpNum = $scope.gift.jpNum +1;;
            }
            //检索服务赠品
            $scope.choosefwGift=function(){
                $(".fwgiftList").show();
                var searchCondition = $scope.gift.fwName;
                var giftType = 1;
                giftManagementService.findGiftByCodeOrName(searchCondition,giftType).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.fwgiftListData = result.results.content.results;
                    } else {

                    };
                });
            }
            $scope.fwgiftListHide = function() {
                $(".fwgiftList").hide();
            };
            $scope.fwgiftListSet = function(fwGift) {
                $scope.gift.fwName = fwGift.giftName;
                $(".fwgiftList").hide();
            };
            //添加服务赠品
            $scope.fwPackageDetails = [];
            $scope.addfwGift = function() {
                if($scope.gift.fwName ==null|| $scope.gift.fwName == ""){
                    $scope.angularTip("请输入服务赠品",5000);
                    return;
                }
                var giftBol = 0;
                for(var i=0;i<$scope.fwgiftListData.length;i++){
                    if($scope.gift.fwName==$scope.fwgiftListData[i].giftName){
                        giftBol = 1;
                        $scope.fwGift = $scope.fwgiftListData[i];
                    }
                }
                if(giftBol==0){
                    $scope.angularTip("赠品输入有误",5000);
                    return;
                }
                var arr = {
                    giftCode:$scope.fwGift.giftCode,
                    giftName:$scope.fwGift.giftName,
                    guidePrice:$scope.fwGift.guidePrice,
                    salePrice:$scope.fwGift.salePrice,
                    actualPrice:$scope.fwGift.actualPrice,
                    giftType:1,
                    number:$scope.gift.fwNum
                }
                $scope.fwPackageDetails.unshift(arr);
                $scope.gift.guidePrice = arr.guidePrice*arr.number+$scope.gift.guidePrice;
                $scope.gift.salePrice = arr.salePrice*arr.number+$scope.gift.salePrice;
                $scope.gift.actualPrice = arr.actualPrice*arr.number+$scope.gift.actualPrice;
                $scope.modifyGift.guidePrice = arr.guidePrice*arr.number+$scope.modifyGift.guidePrice;
                $scope.modifyGift.salePrice = arr.salePrice*arr.number+$scope.modifyGift.salePrice;
                $scope.modifyGift.actualPrice = arr.actualPrice*arr.number+$scope.modifyGift.actualPrice;
            };
            $scope.deletefwGift = function(tc) {
                $scope.fwPackageDetails.splice( $scope.fwPackageDetails.indexOf(tc), 1);
                $scope.gift.guidePrice = $scope.gift.guidePrice - tc.guidePrice*tc.number;
                $scope.gift.salePrice = $scope.gift.salePrice - tc.salePrice*tc.number;
                $scope.gift.actualPrice = $scope.gift.actualPrice - tc.actualPrice*tc.number;
                $scope.modifyGift.guidePrice = $scope.modifyGift.guidePrice - tc.guidePrice*tc.number;
                $scope.modifyGift.salePrice = $scope.modifyGift.salePrice - tc.salePrice*tc.number;
                $scope.modifyGift.actualPrice = $scope.modifyGift.actualPrice - tc.actualPrice*tc.number;
            };
            //检索精品赠品
            $scope.choosejpGift=function(){
                $(".jpgiftList").show();
                var searchCondition = $scope.gift.jpName;
                var giftType = 2;
                giftManagementService.findGiftByCodeOrName(searchCondition,giftType).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.jpgiftListData = result.results.content.results;
                    } else {

                    };
                });
            }
            $scope.jpgiftListHide = function() {
                $(".jpgiftList").hide();
            };
            $scope.jpgiftListSet = function(jpGift) {
                $scope.gift.jpName = jpGift.giftName;
                $(".jpgiftList").hide();
            };
            //添加精品赠品
            $scope.jpPackageDetails = [];
            $scope.addjpGift = function() {
                if($scope.gift.jpName ==null|| $scope.gift.jpName == ""){
                    $scope.angularTip("请输入精品赠品",5000);
                    return;
                }
                var giftBol = 0;
                for(var i=0;i<$scope.jpgiftListData.length;i++){
                    if($scope.gift.jpName==$scope.jpgiftListData[i].giftName){
                        giftBol = 1;
                        $scope.jpGift = $scope.jpgiftListData[i];
                    }
                }
                if(giftBol==0){
                    $scope.angularTip("赠品输入有误",5000);
                    return;
                }
                var arr = {
                    giftCode:$scope.jpGift.giftCode,
                    giftName:$scope.jpGift.giftName,
                    guidePrice:$scope.jpGift.guidePrice,
                    salePrice:$scope.jpGift.salePrice,
                    actualPrice:$scope.jpGift.actualPrice,
                    giftType:2,
                    number:$scope.gift.jpNum
                }
                $scope.jpPackageDetails.unshift(arr);
                $scope.gift.guidePrice = arr.guidePrice*arr.number+$scope.gift.guidePrice;
                $scope.gift.salePrice = arr.salePrice*arr.number+$scope.gift.salePrice;
                $scope.gift.actualPrice = arr.actualPrice*arr.number+$scope.gift.actualPrice;
                $scope.modifyGift.guidePrice = arr.guidePrice*arr.number+$scope.modifyGift.guidePrice;
                $scope.modifyGift.salePrice = arr.salePrice*arr.number+$scope.modifyGift.salePrice;
                $scope.modifyGift.actualPrice = arr.actualPrice*arr.number+$scope.modifyGift.actualPrice;

            };
            $scope.deletejpGift = function(tc) {
                $scope.jpPackageDetails.splice( $scope.jpPackageDetails.indexOf(tc), 1);
                $scope.gift.guidePrice = $scope.gift.guidePrice - tc.guidePrice*tc.number;
                $scope.gift.salePrice = $scope.gift.salePrice - tc.salePrice*tc.number;
                $scope.gift.actualPrice = $scope.gift.actualPrice - tc.actualPrice*tc.number;
                $scope.modifyGift.guidePrice = $scope.modifyGift.guidePrice - tc.guidePrice*tc.number;
                $scope.modifyGift.salePrice = $scope.modifyGift.salePrice - tc.salePrice*tc.number;
                $scope.modifyGift.actualPrice = $scope.modifyGift.actualPrice - tc.actualPrice*tc.number;
            };

            //新增赠品
            $scope.gift = {};
            $scope.addGiftSubmit = function(giftType) {
                var giftType =giftType;
                var storeId = $rootScope.user.store.storeId;
                var giftName =$scope.gift.giftName;
                var giftCode =$scope.gift.giftCode;
                var guidePrice =$scope.gift.guidePrice;
                var salePrice =$scope.gift.salePrice;
                var actualPrice =$scope.gift.actualPrice;
                var validLength =$scope.gift.validLength;
                var effectiveTime =$scope.gift.effectiveTime;
                var failureTime =$scope.gift.failureTime;
                var remark =$scope.gift.remark;
                var giftModel =$scope.gift.giftModel;
                var packageGuidePrice =$scope.gift.packageGuidePrice;
                var packageSalePrice =$scope.gift.packageSalePrice;
                var packageActualPrice =$scope.gift.packageActualPrice;
                var quota =$scope.gift.quota;

                if(giftName==null||giftName==""){
                    $scope.angularTip("请输入赠品名称",5000);
                    return;
                };
                if(giftCode==null||giftCode==""){
                    $scope.angularTip("请输入赠品编码",5000);
                    return;
                };
                $scope.giftPackageDetails = [];
                if(giftType == 3){
                    if(packageGuidePrice==null||packageGuidePrice==""){
                        $scope.angularTip("请输入礼包指导价",5000);
                        return;
                    };
                    if(packageSalePrice==null||packageSalePrice==""){
                        $scope.angularTip("请输入礼包销售成本",5000);
                        return;
                    };
                    if(packageActualPrice==null||packageActualPrice==""){
                        $scope.angularTip("请输入礼包实际成本",5000);
                        return;
                    };
                    for(var i=0;i<$scope.fwPackageDetails.length;i++){
                        $scope.giftPackageDetails.push($scope.fwPackageDetails[i]);
                    }
                    for(var j=0;j<$scope.jpPackageDetails.length;j++){
                        $scope.giftPackageDetails.push($scope.jpPackageDetails[j]);
                    }
                }
                if(guidePrice==null||guidePrice==""){
                    $scope.angularTip("请输入指导价",5000);
                    return;
                };
                if(salePrice==null||salePrice==""){
                    $scope.angularTip("请输入销售成本",5000);
                    return;
                };
                if(actualPrice==null||actualPrice==""){
                    $scope.angularTip("请输入实际成本",5000);
                    return;
                };
                if(validLength<0){
                    $scope.angularTip("有效时限不能为负",5000);
                    return;
                };
                if(effectiveTime==null||effectiveTime==""){
                    $scope.angularTip("请输入生效日期",5000);
                    return;
                };
                if(failureTime==null||failureTime==""){
                    $scope.angularTip("请输入失效日期",5000);
                    return;
                };
                if((giftType == 4||giftType == 5)&&(quota==null||quota=="")){
                    $scope.angularTip("请输入额度",5000);
                    return;
                };
                var giftDatas = {giftType:giftType,storeId:storeId,giftName:giftName,giftCode:giftCode,guidePrice:guidePrice,
                    salePrice:salePrice,actualPrice:actualPrice,validLength:validLength,effectiveTime:effectiveTime,
                    failureTime:failureTime,remark:remark,giftModel:giftModel,packageGuidePrice:packageGuidePrice,packageSalePrice:packageSalePrice,
                    packageActualPrice:packageActualPrice,giftPackageDetails:$scope.giftPackageDetails,quota:quota
                };
                $("#msgwindow").show();
                giftManagementService.addGift(giftDatas).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK' && res.results.success==true){
                        $scope.newqk = {};
                        $("#xzfw").hide();
                        $("#xzjp").hide();
                        $("#xzlb").hide();
                        $("#czkhy").hide();
                        $scope.angularTip("新增赠品成功",5000);
                        $scope.findGiftByCondition(giftType);
                        $scope.gift = {};
                    }else{
                        $scope.angularTip(res.results.message,5000);
                    }
                });
            };

            //有效时限
            $scope.minusValidLength=function(){
                if($scope.gift.validLength>=1){
                    $scope.gift.validLength = $scope.gift.validLength -1;
                }
                if($scope.modifyGift.validLength>=1){
                    $scope.modifyGift.validLength = $scope.modifyGift.validLength -1;
                }
            }
            $scope.plusValidLength=function(){
                $scope.gift.validLength = $scope.gift.validLength +1;
                $scope.modifyGift.validLength = $scope.modifyGift.validLength +1;
            }

            //修改赠品
            $scope.modifyGift = {};
            $scope.modifyGiftBtn = function(fwData,giftType) {
                var giftType =giftType;
                $scope.giftType==giftType;
                var storeId = $rootScope.user.store.storeId;
                $scope.modifyGift.giftName = fwData.giftName;
                $scope.modifyGift.giftCode = fwData.giftCode;
                $scope.modifyGift.guidePrice = fwData.guidePrice;
                $scope.modifyGift.salePrice = fwData.salePrice;
                $scope.modifyGift.actualPrice = fwData.actualPrice;
                $scope.modifyGift.validLength = fwData.validLength;
                $scope.modifyGift.remark = fwData.remark;
                $scope.modifyGift.giftModel = fwData.giftModel;
                $scope.modifyGift.effectiveTime = $filter('date')(fwData.effectiveTime,'yyyy-MM-dd');
                $scope.modifyGift.failureTime = $filter('date')(fwData.failureTime,'yyyy-MM-dd');
                $scope.modifyGift.packageGuidePrice = fwData.packageGuidePrice;
                $scope.modifyGift.packageSalePrice = fwData.packageSalePrice;
                $scope.modifyGift.packageActualPrice = fwData.packageActualPrice;
                $scope.modifyGift.quota = fwData.quota;
                var id = fwData.id;
                if(giftType==1){
                    $("#bjfw").show();
                }else if(giftType==4||giftType==5){
                    $("#bjczkhy").show();
                }else if(giftType==2){
                    $("#bjjp").show();
                }else if(giftType==3){
                    $("#bjlb").show();
                    $scope.gift.fwNum = 1;
                    $scope.gift.jpNum = 1;
                    $scope.fwPackageDetails = [];
                    $scope.jpPackageDetails = [];
                    for(var i=0;i<fwData.giftPackageDetails.length;i++){
                        if(fwData.giftPackageDetails[i].giftType==1){
                            $scope.fwPackageDetails.push(fwData.giftPackageDetails[i]);
                        }else if(fwData.giftPackageDetails[i].giftType==2){
                            $scope.jpPackageDetails.push(fwData.giftPackageDetails[i]);
                        }
                    }

                }
                $scope.modityGiftSubmit = function(){
                    if($scope.modifyGift.giftName==null||$scope.modifyGift.giftName==""){
                        $scope.angularTip("请输入赠品名称",5000);
                        return;
                    };
                    if($scope.modifyGift.giftCode==null||$scope.modifyGift.giftCode==""){
                        $scope.angularTip("请输入赠品编码",5000);
                        return;
                    };
                    $scope.giftPackageDetails = [];
                    if(giftType == 3){
                        if($scope.modifyGift.packageGuidePrice==null||$scope.modifyGift.packageGuidePrice==""){
                            $scope.angularTip("请输入礼包指导价",5000);
                            return;
                        };
                        if($scope.modifyGift.packageSalePrice==null||$scope.modifyGift.packageSalePrice==""){
                            $scope.angularTip("请输入礼包销售成本",5000);
                            return;
                        };
                        if($scope.modifyGift.packageActualPrice==null||$scope.modifyGift.packageActualPrice==""){
                            $scope.angularTip("请输入礼包实际成本",5000);
                            return;
                        };
                        for(var i=0;i<$scope.fwPackageDetails.length;i++){
                            $scope.giftPackageDetails.push($scope.fwPackageDetails[i]);
                        }
                        for(var j=0;j<$scope.jpPackageDetails.length;j++){
                            $scope.giftPackageDetails.push($scope.jpPackageDetails[j]);
                        }
                    }
                    if($scope.modifyGift.guidePrice==null||$scope.modifyGift.guidePrice==""){
                        $scope.angularTip("请输入指导价",5000);
                        return;
                    };
                    if($scope.modifyGift.salePrice==null||$scope.modifyGift.salePrice==""){
                        $scope.angularTip("请输入销售成本",5000);
                        return;
                    };
                    if($scope.modifyGift.actualPrice==null||$scope.modifyGift.actualPrice==""){
                        $scope.angularTip("请输入实际成本",5000);
                        return;
                    };
                    if($scope.modifyGift.validLength<0){
                        $scope.angularTip("有效时限不能为负",5000);
                        return;
                    };
                    if($scope.modifyGift.effectiveTime==null||$scope.modifyGift.effectiveTime==""){
                        $scope.angularTip("请输入生效日期",5000);
                        return;
                    };
                    if($scope.modifyGift.failureTime==null||$scope.modifyGift.failureTime==""){
                        $scope.angularTip("请输入失效日期",5000);
                        return;
                    };
                    if($scope.modifyGift.effectiveTime>$scope.modifyGift.failureTime){
                        $scope.angularTip("生效日期不能大于失效日期",5000);
                        return;
                    };
                    if((giftType == 4||giftType == 5)&&( $scope.modifyGift.quota==null|| $scope.modifyGift.quota=="")){
                        $scope.angularTip("请输入额度",5000);
                        return;
                    };
                    var modifyGiftDatas = {giftType:giftType,storeId:storeId, giftName:$scope.modifyGift.giftName,giftCode:$scope.modifyGift.giftCode,
                        guidePrice:$scope.modifyGift.guidePrice, salePrice:$scope.modifyGift.salePrice,actualPrice:$scope.modifyGift.actualPrice,
                        effectiveTime:$scope.modifyGift.effectiveTime,validLength:$scope.modifyGift.validLength,failureTime:$scope.modifyGift.failureTime,
                        remark:$scope.modifyGift.remark,giftModel:$scope.modifyGift.giftModel,packageGuidePrice:$scope.modifyGift.packageGuidePrice,
                        packageSalePrice:$scope.modifyGift.packageSalePrice,packageActualPrice:$scope.modifyGift.packageActualPrice,id:id,
                        giftPackageDetails:$scope.giftPackageDetails,quota:$scope.modifyGift.quota};

                    giftManagementService.updateGiftByCode(modifyGiftDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#bjfw").hide();
                            $("#bjjp").hide();
                            $("#bjlb").hide();
                            $("#bjczkhy").hide();
                            fwData.giftName = $scope.modifyGift.giftName;
                            fwData.giftCode = $scope.modifyGift.giftCode;
                            fwData.guidePrice = $scope.modifyGift.guidePrice;
                            fwData.salePrice = $scope.modifyGift.salePrice;
                            fwData.actualPrice = $scope.modifyGift.actualPrice;
                            fwData.validLength = $scope.modifyGift.validLength;
                            fwData.remark = $scope.modifyGift.remark;
                            fwData.giftModel = $scope.modifyGift.giftModel;
                            fwData.effectiveTime = $scope.modifyGift.effectiveTime;
                            fwData.failureTime = $scope.modifyGift.failureTime;
                            fwData.giftPackageDetails = $scope.giftPackageDetails;
                            fwData.quota = $scope.modifyGift.quota;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            }

            //跟踪处理悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-100px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
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

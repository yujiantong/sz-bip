/**
 * Created by qiumingyu on 2016/7/6.
 */
'use strict';
angular.module('myApp')
    .controller('performanceIM_Controller',['$rootScope','$scope','$filter','$state','$interval','performanceIMService',
        function($rootScope,$scope,$filter,$state,$interval,performanceIMService) {
            $scope.pageType="xb";
            $scope.coverType = 1;
            $scope.renewalType = 0;
            $scope.newInsuranceAll = [];//新保的结果集
            $scope.otherInsuranceTypeAll = [];//除新保外的结果集
            $scope.newInsuranceAllIndex= 1;//初始化新保页面下标
            $scope.otherInsuranceTypeAllIndex = 1;//初始化其他类型页面下标
            $scope.searchMoreStatus = true;//加载时用于判断是否重置页数
            $scope.statisticTime = $filter('date')(new Date(),'yyyy-MM'); //初始化为当月

            $scope.otherInsuranceTypeAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index', enableColumnMenu: false,type:'number'},
                    { name: '负责人', field: 'principal',enableColumnMenu: false},
                    { name: '职务', field: 'position', enableColumnMenu: false},
                    { name: '全部潜客', field: 'assignCusNumNoTime', enableColumnMenu: false},
                    { name: '准时跟进率', field: 'traceOnTimeRate', enableColumnMenu: false,headerTooltip:true},
                    { name: '潜客邀约率', field: 'inviteRate', enableColumnMenu: false,headerTooltip:true},
                    { name: '邀约到店率', field: 'comeStoreRate',enableColumnMenu: false,headerTooltip:true},
                    { name: '邀约到店成交率', field: 'comStoreDealRate', enableColumnMenu: false,headerTooltip:true},
                    { name: '到店成交率', field: 'ddcjl', enableColumnMenu: false,headerTooltip:true},
                    { name: '当期续保率', field: 'curRenewalRate', enableColumnMenu: false,headerTooltip:true},
                    /*{ name: '综合续保率', field: 'syntheticalRenewalRate', enableColumnMenu: false,headerTooltip:true},*/
                    { name: '保费合计', field: 'coverageSumNoTime', enableColumnMenu: false,headerTooltip:true},
                    { name: '商业险合计', field: 'bInsurCoverageSumNoTime', enableColumnMenu: false,headerTooltip:true},
                    { name: '商业险单均保费', field: 'avgCoverageNoTime', enableColumnMenu: false,headerTooltip:true},
                    { name: '当期潜客', field: 'curAssignCusNum', enableColumnMenu: false,headerTooltip:true},
                    { name: '当期续保数', field: 'curInsuranceNum', enableColumnMenu: false,headerTooltip:true},
                    { name: '当期商业险保费', field: 'bInsurCoverageSum' , enableColumnMenu: false,headerTooltip:true},
                    { name: '当期商业险单均保费', field: 'avgCoverage', enableColumnMenu: false,headerTooltip:true}],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.newInsuranceAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index', enableColumnMenu: false,type:'number'},
                    { name: '业务员', field: 'clerk',enableColumnMenu: false},
                    { name: '职务', field: 'position', enableColumnMenu: false},
                    { name: '新保数量', field: 'newInsurCount', enableColumnMenu: false},
                    { name: '商业险保费', field: 'binsuranceCoverageSum', enableColumnMenu: false},
                    { name: '商业险单价', field: 'binsuranceAvg', enableColumnMenu: false}],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            //初始化
            performanceIMService.statisticalNewInsurance($scope.coverType,$scope.statisticTime).then(function(result){
                if (result.status == 'OK'&&result.results.content.status=='OK') {
                    $scope.newInsuranceAll = result.results.content.listMap;
                    $scope.getPerformancePage();

                } else {

                }
            })

            //统计新保
            $scope.statisticalXbInsurance = function(pageType,coverType){
                $scope.coverType = coverType;
                $scope.pageType = pageType;
                $("#msgwindow").show();
                performanceIMService.statisticalNewInsurance($scope.coverType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.newInsuranceAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {
                        };
                    });
            }

            //统计续保汇总
            $scope.statisticalAllInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalAllInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            }

            //统计新转续
            $scope.statisticalXinzxInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalXinzxInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            }

            //统计续转续
            $scope.statisticalXuzxInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalXuzxInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            }

            //统计间转续
            $scope.statisticalJianzxInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalJianzxInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            }

            //统计潜转续
            $scope.statisticalQianzxInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalQianzxInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            }

            //统计首次
            $scope.statisticalFirstInsurance = function(pageType,renewalType){
                $scope.pageType = pageType;
                $scope.renewalType = renewalType;
                $scope.otherInsuranceTypeAll= [];
                $("#msgwindow").show();
                performanceIMService.statisticalFirstInsurance($scope.renewalType,$scope.statisticTime)
                    .then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK' && result.results.content.status=='OK') {
                            $scope.otherInsuranceTypeAll = result.results.content.listMap;
                            $scope.getPerformancePage();
                        } else {

                        };
                    });
            };
            //点击时间区间查询
            $scope.getSearchByTime = function (){
                if($scope.pageType=='xb'){
                    $scope.statisticalXbInsurance('xb',$scope.coverType) //新保
                }else if($scope.pageType=='xbhz'){
                    $scope.statisticalAllInsurance('xbhz',$scope.renewalType) //续保汇总
                }else if($scope.pageType=='xinzx'){
                    $scope.statisticalXinzxInsurance('xinzx',$scope.renewalType)//新转续
                }else if($scope.pageType=='xuzx'){
                    $scope.statisticalXuzxInsurance('xuzx',$scope.renewalType);//续转续
                }else if($scope.pageType=='jianzx'){
                    $scope.statisticalJianzxInsurance('jianzx',$scope.renewalType)//间转续
                }else if($scope.pageType=='qianzx'){
                    $scope.statisticalQianzxInsurance('qianzx',$scope.renewalType)//潜转续
                }else if($scope.pageType=='first'){
                    $scope.statisticalFirstInsurance('first',$scope.renewalType)//首次
                }
            };
            //将查询数据加上序号并放入表格中
            $scope.getPerformancePage = function(){
                $scope.otherInsuranceTypeAllPage.data = [];
                $scope.newInsuranceAllPage.data = [];
                $scope.otherInsuranceTypeAllIndex = 1;
                $scope.newInsuranceAllIndex = 1;
                if($scope.pageType == 'xb'){
                    for(var i=0;i<$scope.newInsuranceAll.length;i++){
                        $scope.newInsuranceAll[i].index = $scope.newInsuranceAllIndex;
                        $scope.newInsuranceAllPage.data.push($scope.newInsuranceAll[i])
                        $scope.newInsuranceAllIndex = $scope.newInsuranceAllIndex+1;
                    }
                }else{
                    for(var i=0;i<$scope.otherInsuranceTypeAll.length;i++){
                        $scope.otherInsuranceTypeAll[i].index = $scope.otherInsuranceTypeAllIndex;
                        $scope.otherInsuranceTypeAllPage.data.push($scope.otherInsuranceTypeAll[i])
                        $scope.otherInsuranceTypeAllIndex = $scope.otherInsuranceTypeAllIndex+1;
                    }
                }
            }
            //重置数据，包括页数，表格内容
            $scope.resetPageData = function(){
                if($scope.searchMoreStatus ==true){
                    $scope.startNum = 1; //开始页
                }else{
                    $scope.startNum = $scope.startNum + 1;
                }
                if($scope.startNum==1){
                    $scope.customerIndex= 1;
                    if($scope.pageType)
                    $scope.customerAllPage.data = [];
                }
            }

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-50
                }
            },100);


            //时间控件
            $('.mouthtime').datepicker({
                format: 'yyyy-mm',
                weekStart: 1,
                startView: 1,
                minViewMode:1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                forceParse:false
            }).on('changeDate',function(ev){
                var  startTime = ev.date.valueOf();
            });
        }
    ]);

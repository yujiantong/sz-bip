/**
 * Created by lixuhua on 2016/11/10.
 */
'use strict';
angular.module('myApp')
    .controller('report_Controller',['$rootScope','$location','constant','$scope','$filter','reportService','ExportExcel',
        function($rootScope,$location,constant,$scope,$filter,reportService,ExportExcel) {
            var host = $location.host();
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            if($scope.storeId==122 || host==constant.bipServer){
                $scope.storetitle="传慧嘉和(北京)管理咨询有限公司";
            }else {
                $scope.storetitle="北京博福易商科技有限公司";
            }
            $scope.pageType="xb";
            $scope.rangeTimes = [
                {timeName : "近一周", rangeTime : 1},
                {timeName : "近30天", rangeTime : 2},
                {timeName : "本月", rangeTime : 3},
                {timeName : "上月", rangeTime : 4}
            ];

            //邀约统计报表-邀约率
            $scope.chartOptions_yytjbb_yyl =  {
                type : 'bar',
                unit:'%',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['提前邀约率'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'持有人'
            };
            //邀约统计报表-到店率
            $scope.chartOptions_yytjbb_ddl =  {
                type : 'bar',
                unit:'%',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['提前邀约到店率'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'持有人'
            };

            $scope.exportReportData = {};
            $scope.exportData_yyl = {storetitle:$scope.storetitle,name:"邀约统计报表-邀约率",data:{}};
            $scope.exportData_ddl = {storetitle:$scope.storetitle,name:"邀约统计报表-到店率",data:{}};
            $scope.exportData_khbb = {storetitle:$scope.storetitle,name:"持有潜客统计报表",data:{}};
            $scope.exportData_khlzbb = {storetitle:$scope.storetitle,name:"客户流转报表",data:{}};
            $scope.exportData_sxyy = {storetitle:$scope.storetitle,name:"失销原因统计报表",data:{}};
            $scope.exportData_htyy = {storetitle:$scope.storetitle,name:"回退原因统计报表",data:{}};
            $scope.exportData_bxgsywzb = {storetitle:$scope.storetitle,name:"保险公司业务占比报表",data:{}};
            $scope.exportData_dqxbl = {storetitle:$scope.storetitle,name:"当期续保率报表",data:{}};
            $scope.exportData_zhxbl = {storetitle:$scope.storetitle,name:"综合续保率",data:{}};
            $scope.exportData_dqqs = {storetitle:$scope.storetitle,name:"续保率趋势报表-当期续保率",data:{}};
            $scope.exportData_zhxbqs = {storetitle:$scope.storetitle,name:"续保率趋势报表-综合续保率",data:{}};
            $scope.exportData_ycsjbb = {storetitle:$scope.storetitle,name:"异常数据报表",data:{}};
            $scope.reportCondition = {};
            $scope.selectTimes = [];
            $scope.updateData = false;
            //获取报表的查询日期列表
            $scope.findReportSearchTime = function(tableNo){
                var tableName;
                if(tableNo == 'khlz'){
                    tableName = 'bf_bip_report_month_customer_trend';
                }else if(tableNo == 'kh'){
                    tableName = 'bf_bip_report_month_customer_holder';
                }else if(tableNo == 'yyl'){
                    tableName = 'bf_bip_report_day_invite';
                }else if(tableNo == 'zhxbl'){
                    tableName = 'bf_bip_report_day_xbltjbb_zhxbl';
                }else if(tableNo == 'zhxbqs'){
                    tableName = 'bf_bip_report_day_xbltjbb_zhxbl';
                }else if(tableNo == 'dqxbl'){
                    tableName = 'bf_bip_report_day_xbltjbb_dqxbl';
                }else if(tableNo == 'dqqs'){
                    tableName = 'bf_bip_report_day_xbltjbb_dqxbl';
                }else if(tableNo == 'ybWorker'){
                    tableName = 'bf_bip_report_month_kpi_xbzy';
                    $scope.findCountMonthKpi();
                }else if(tableNo == 'ybCompany'){
                    tableName = 'bf_bip_report_month_kpi_company';
                    $scope.findCountMonthKpiInsurComp();
                }else if(tableNo == 'ybCoverType'){
                    tableName = 'bf_bip_report_month_kpi_cover_type_gzyy';
                    $scope.findCountMonthKpiCoverType();
                };
                var condition = {tableName:tableName,storeId:$rootScope.user.store.storeId};
                reportService.findReportSearchTime(condition).then(function(result){
                    if (result.status == 'OK') {
                        $scope.selectTimes = result.results.content.results;
                        $scope.defultSearch(tableNo);
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            };
            $scope.findReportSearchTime('khlz');

            //默认查询
            $scope.defultSearch = function(tableNo){
                $scope.tabName = tableNo;
                if(tableNo == 'khlz'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.khlzHolder.selectTime=$scope.selectTimes[0];
                        $scope.findCustomerKhlz();
                    }
                }else if(tableNo == 'kh'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.CustomerHolder.selectTime=$scope.selectTimes[0];
                        $scope.CustomerHolder.selectRoleIds = 2;//默认续保专员；
                        $scope.findCustomerHolder();
                    }
                }else if(tableNo == 'yyl'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.reportCondition.selectTime=$scope.selectTimes[0];
                        $scope.findInviteReportData();
                    }
                }else if(tableNo == 'zhxbl'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.zhxbl.selectTime=$scope.selectTimes[0];
                        $scope.xbltjbbZhxbl();
                    }
                }else if(tableNo == 'dqxbl'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.reportCondition.selectTime_dqxbl=$scope.selectTimes[0];
                        //查询当期续保率日期列表
                        $scope.selectTimes_dqxbl = $scope.selectTimes;
                        $scope.xbltjbbDqxbl();
                    }
                }else if(tableNo == 'dqqs'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.selectTimes_dqqs = [];
                        $scope.selectTimes_dqqs.push($scope.selectTimes[0].substr(0,4));
                        for(var i=0;i<$scope.selectTimes.length-1;i++){
                            if($scope.selectTimes[i+1].substr(0,4)!=$scope.selectTimes[i].substr(0,4)){
                                $scope.selectTimes_dqqs.push($scope.selectTimes[i+1].substr(0,4));
                            }
                        }
                        $scope.reportCondition.selectTime_dqqs=$scope.selectTimes_dqqs[0];
                        $scope.xblqsbbDqqs();
                    }
                }else if(tableNo == 'zhxbqs'){
                    if($scope.selectTimes&&$scope.selectTimes.length>0){
                        $scope.selectTimes_zhxbqs = [];
                        $scope.selectTimes_zhxbqs.push($scope.selectTimes[0].substr(0,4));
                        for(var i=0;i<$scope.selectTimes.length-1;i++){
                            if($scope.selectTimes[i+1].substr(0,4)!=$scope.selectTimes[i].substr(0,4)){
                                $scope.selectTimes_zhxbqs.push($scope.selectTimes[i+1].substr(0,4));
                            }
                        }
                        $scope.reportCondition.selectTime_zhxbqs=$scope.selectTimes_zhxbqs[0];
                        $scope.zhxblqsSearch();
                    }
                };
            }

            //查询邀约率报表-邀约率数据
            $scope.findInviteReportData = function(){
                var selectTime =  $scope.reportCondition.selectTime||'';
                if(selectTime==''){
                    $scope.angularTip("请选择时间",5000);
                    return;
                }
                $("#msgwindow").show();
                var condition = {selectTime:selectTime,storeId:$rootScope.user.store.storeId};
                reportService.findInviteReportData(condition).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.reportData__yyl = result.results.content.results;
                        $scope.updateData = true;
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            }
            //查询邀约率报表-到店率数据
            $scope.comeStoreDate = {};
            $scope.comeStoreDate.rangeTime = 1;
            $scope.comeStoreDate.startTime = $filter('date')(new Date()-7*24*60*60*1000,'yyyy-MM-dd');
            $scope.comeStoreDate.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.comeStoreTimes = function(){
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month=myDate.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var rangeTime = $scope.comeStoreDate.rangeTime;
                if(rangeTime==1){
                    $scope.comeStoreDate.startTime = $filter('date')(oneWeek,'yyyy-MM-dd');
                    $scope.comeStoreDate.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==2){
                    $scope.comeStoreDate.startTime = $filter('date')(oneMonth,'yyyy-MM-dd');
                    $scope.comeStoreDate.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==3){
                    $scope.comeStoreDate.startTime = year+"-"+month+"-01";
                    $scope.comeStoreDate.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==4){
                    if(month==1){
                        $scope.comeStoreDate.startTime = (year-1)+"-12"+"-01";
                        $scope.comeStoreDate.endTime = (year-1)+"-12-"+new Date(year,12,0).getDate();
                    }else{
                       var lastmonth = month-1;
                        lastmonth =(lastmonth<10 ? "0"+lastmonth:lastmonth);
                        $scope.comeStoreDate.startTime = year+"-"+lastmonth+"-01";
                        $scope.comeStoreDate.endTime = year+'-'+lastmonth+'-'+new Date(year,lastmonth,0).getDate();
                    }
                };
            };
            $scope.findComeStoreReportData = function(){
                $("#msgwindow").show();
                var startTime =  $scope.comeStoreDate.startTime;
                var endTime =  $scope.comeStoreDate.endTime;
                var condition = {startTime:startTime,endTime:endTime,storeId:$rootScope.user.store.storeId};
                reportService.findComeStoreReportData(condition).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.reportData__ddl = result.results.content.results;
                        $scope.updateData = true;
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            }

            //查询持有潜客统计报表
            $scope.selectRoleIds = [
                {RoleName : "续保专员", roleId : 2},
                {RoleName : "销售顾问", roleId : 6},
                {RoleName : "服务顾问", roleId : 8}
            ];

            $scope.chartOptions_CustomerHolder =  {
                type : 'bar',
                xNameType:'持有人'
            };
            $scope.CustomerReportData ={};
            $scope.CustomerHolder = {};
            $scope.updateData = false;
            $scope.findCustomerHolder = function(){
                var selectTime =  $scope.CustomerHolder.selectTime;
                var roleId =  $scope.CustomerHolder.selectRoleIds;
                if(selectTime == "" || selectTime == null){
                    $scope.angularTip("请选择时间！",5000);
                }else {
                    $("#msgwindow").show();
                    reportService.findCustomerHolder(selectTime,roleId).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.CustomerReportData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                };

            };
            //客户流转报表
            $scope.chartOptions_khlzbb =  {
                type : 'bar',
                xNameType:'流转潜客持有人'
            };
            $scope.khlzReportData ={};
            $scope.khlzHolder = {};
            $scope.findCustomerKhlz = function(){
                $scope.pageType = "khlz";
                var recordTime =  $scope.khlzHolder.selectTime;
                if(recordTime == "" || recordTime == null){
                    $scope.angularTip("请选择时间！",5000);
                }else {
                    $("#msgwindow").show();
                    reportService.findCustomerTrendData(recordTime).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.khlzReportData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                };

            };

            //流转客户明细
            $scope.customerTrendPage = {};
            $scope.customerTrendPage = {
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
                    { name: '持有人', field: 'holderName',width:80, enableColumnMenu: false},
                    { name: '客户级别', field: 'customerLevel',width:70, enableColumnMenu: false},
                    { name: '车牌号', field: 'carLicenseNumber', enableColumnMenu: false},
                    { name: '车架号', field: 'chassisNumber',width:140,enableColumnMenu: false},
                    { name: '发动机号', field: 'engineNumber',enableColumnMenu: false},
                    { name: '投保类型', field: 'renewalType',enableColumnMenu: false},
                    { name: '交强险到期日', field: 'jqxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false},
                    { name: '商业险到期日', field: 'syxrqEnd',cellFilter: 'date:"yyyy-MM-dd/EEE"', enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApiTrend) {
                    gridApiTrend.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApiTrend = gridApiTrend;
                }
            };
            $scope.startNum = 1;
            $scope.loadStatus=2;
            $scope.customerTrend = {data:[]};
            $scope.custDetail = function(){
                if($scope.lineData!=""&&$scope.lineData!=null&&$scope.lineData.name!='店均'&&$scope.lineData.clickValue==0){
                    $scope.customerCount = $scope.lineData.value;
                    $scope.startNum = 1;
                    $scope.customerTrend.data=[];
                    $scope.recordTime =  $scope.khlzHolder.selectTime;
                    $scope.stackName = $scope.lineData.seriesName;
                    var userIndex = $scope.lineData.dataIndex;//表示哪一个人的数据,下标0开始
                    var stackIndex = $scope.lineData.seriesIndex;//表示哪一柱子的数据,下标0开始
                    $scope.userId = $scope.khlzReportData[userIndex +  stackIndex * $scope.khlzReportData.length/10].xId;
                    $("#msgwindow").show();
                    reportService.findCustomerTrendDetail($scope.recordTime,$scope.stackName,$scope.userId,$scope.startNum).then(function (result) {
                        $("#msgwindow").hide();
                        if(result.results.content.results== ''){
                            $scope.angularTip("查询明细失败，请联系客服！",4000);
                            $scope.customerTrendPage.data = [];
                            $scope.customerCount =0;
                        }else if (result.status == 'OK') {
                            $scope.customerTrend.data = result.results.content.results;
                            $scope.getPolicyPage();
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    })
                    $scope.lineData.clickValue=1;
                    $("#custDetail").show();
                }
            };
            //查询更多
            $scope.custDetailMore = function(){
                $scope.customerTrend.data=[];
                $("#msgwindow").show();
                reportService.findCustomerTrendDetail($scope.recordTime,$scope.stackName,$scope.userId,$scope.startNum).then(function (result) {
                    $("#msgwindow").hide();
                    if(result.results.content.results== ''){
                        $scope.angularTip("查询明细失败，请联系客服！",4000);
                        $scope.customerTrendPage.data = [];
                    }else if (result.status == 'OK') {
                        $scope.customerTrend.data = result.results.content.results;
                        $scope.getPolicyPage();
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                })
            }
            $scope.closeCustDetail = function(){
                $("#custDetail").hide();
            }

            //BIP日报-异常数据
            $scope.chartOptions_ycsjbb =  {
                type : 'bar',
                xNameType:'异常数据持有人'
            };
            $scope.ycsjReportData ={};
            $scope.aberrant = {};
            var yesterday = new Date() - 24*3600*1000;
            $scope.aberrant.selectTime = $filter('date')(yesterday,'yyyy-MM-dd');
            $scope.findCustomerYcsj = function(){
                $scope.pageType = "ycsj";
                var recordTime =  $scope.aberrant.selectTime;
                var roleId =  $scope.aberrant.selectRoleId;
                if(recordTime == "" || recordTime == null){
                    $scope.angularTip("请选择时间！",5000);
                    return;
                };
                $("#msgwindow").show();
                reportService.findExceptionData(recordTime,roleId).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.ycsjReportData = result.results.content.results;
                        $scope.updateData = true;
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            };

            //异常数据明细
            $scope.customerYcsjPage = {};
            $scope.customerYcsjPage = {
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
                    { name: '持有人', field: 'holderName', enableColumnMenu: false},
                    { name: '业务员', field: 'clerk', enableColumnMenu: false},
                    { name: '联系人', field: 'contact', enableColumnMenu: false},
                    { name: '联系电话', field: 'contactWay',cellTooltip: true,enableColumnMenu: false},
                    { name: '车架号', field: 'chassisNumber',cellTooltip: true,enableColumnMenu: false},
                    { name: '车牌号', field: 'carLicenseNumber',cellTooltip: true,enableColumnMenu: false},
                    { name: '投保类型', field: 'renewalType',cellFilter: 'mapTBLX',enableColumnMenu: false},
                    { name: '保险到期日', field: 'jqxrqEnd',cellFilter: "date:'yyyy-MM-dd'",cellTooltip: true,enableColumnMenu: false},
                    { name: '客户级别', field: 'customerLevel',enableColumnMenu: false},
                    { name: '应跟踪日期', field:'willingTraceDate',cellFilter:"date:'yyyy-MM-dd'",cellTooltip: true, enableColumnMenu: false},
                    { name: '末次跟踪日期', field:'lastTraceDate',cellFilter:"date:'yyyy-MM-dd'",cellTooltip: true, enableColumnMenu: false},
                    { name: '末次跟踪结果', field:'lastTraceResult',cellTooltip: true,enableColumnMenu: false},
                    { name: '已脱保(天)', field: 'ytb',enableColumnMenu: false}
                ],
                onRegisterApi : function(gridApiYcsj) {
                    gridApiYcsj.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.gridApiYcsj = gridApiYcsj;
                }
            };
            //异常数据明细栏的增删
            $scope.changeColumns = function(stackIndex,stackName,tabtrue) {
                $scope.ycsjData.clickValue=0;
                $scope.ycsjDetail(stackIndex,stackName,tabtrue);
            }
            $scope.customerYcsj = {data:[]};
            $scope.ycsjDetail = function(stackIndex,stackName,tabtrue){
                if($scope.ycsjData!=""&&$scope.ycsjData!=null&&$scope.ycsjData.name!='店均'&&$scope.ycsjData.clickValue==0){
                    $scope.startNum = 1;
                    $scope.customerYcsj.data=[];
                    $scope.recordTime =  $scope.aberrant.selectTime;
                    $scope.stackName = stackName;
                    var userIndex = $scope.ycsjData.dataIndex;//表示哪一个人的数据,下标0开始
                    //var stackIndex = $scope.ycsjData.seriesIndex;//表示哪一柱子的数据,下标0开始
                    $("#ycsjTabs").children("li").removeClass("active");
                    $("#ycsjTabs").children("li").eq(stackIndex).addClass("active");
                    var tabNo;
                    if(tabtrue){
                        tabNo = tabtrue;
                    }else {
                        tabNo = stackIndex;
                    }
                    if(tabNo==0){
                        if($scope.customerYcsjPage.columnDefs.length>=14&&$scope.customerYcsjPage.columnDefs[13].name == '已脱保(天)'){
                            $scope.customerYcsjPage.columnDefs.splice(13, 1);
                        }
                        if($scope.customerYcsjPage.columnDefs[10].name == '应跟踪日期'){
                            $scope.customerYcsjPage.columnDefs.splice(10, 1);
                        }
                    }else if(tabNo==1){
                        if($scope.customerYcsjPage.columnDefs[10].name != '应跟踪日期'){
                            $scope.customerYcsjPage.columnDefs.splice(10, 0,{ name: '应跟踪日期', field: 'willingTraceDate',cellFilter:"date:'yyyy-MM-dd'",cellTooltip: true,enableColumnMenu: false});
                        }
                        if($scope.customerYcsjPage.columnDefs.length>=14&&$scope.customerYcsjPage.columnDefs[13].name == '已脱保(天)'){
                            $scope.customerYcsjPage.columnDefs.splice(13, 1);
                        }
                    }else if(tabNo==2){
                        if($scope.customerYcsjPage.columnDefs[10].name != '应跟踪日期'){
                            $scope.customerYcsjPage.columnDefs.splice(10, 0,{ name: '应跟踪日期', field: 'willingTraceDate',cellFilter:"date:'yyyy-MM-dd'",cellTooltip: true,enableColumnMenu: false});
                        }
                        if($scope.customerYcsjPage.columnDefs.length<14){
                            $scope.customerYcsjPage.columnDefs.splice(13, 0,{ name: '已脱保(天)', field: 'ytb',enableColumnMenu: false});
                        }
                    }
                    $scope.userId = $scope.ycsjReportData[userIndex +  stackIndex * $scope.ycsjReportData.length/3].xId;
                    $("#msgwindow").show();
                    reportService.findExceptionDataDetail($scope.recordTime,$scope.stackName,$scope.userId,$scope.startNum).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.customerYcsj.data = result.results.content.results;
                            $scope.customerCount = result.results.content.detailCount;
                            $scope.getPolicyPage();
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    })
                    $scope.ycsjData.clickValue=1;
                    $("#aberrantDetail").show();
                }
            };
            $scope.getPolicyPage = function(){
                if($scope.pageType == "khlz"){
                    if($scope.startNum==1){
                        $scope.policyIndex= 1;
                        $scope.customerTrendPage.data = [];
                    }
                    for(var i=0;i<$scope.customerTrend.data.length;i++){
                        $scope.customerTrend.data[i].index = $scope.policyIndex;
                        $scope.customerTrendPage.data.push($scope.customerTrend.data[i])
                        $scope.policyIndex = $scope.policyIndex+1;
                    }
                    if($scope.customerTrendPage.data.length>=$scope.customerCount){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApiTrend.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApiTrend.infiniteScroll.dataLoaded(false, true)
                    }
                }else if($scope.pageType == "ycsj"){
                    if($scope.startNum==1){
                        $scope.policyIndex= 1;
                        $scope.customerYcsjPage.data = [];
                    }
                    for(var i=0;i<$scope.customerYcsj.data.length;i++){
                        var jqxrqEnd = new Date($scope.customerYcsj.data[i].jqxrqEnd).getTime();
                        var currentDate = new Date().getTime();
                        $scope.customerYcsj.data[i].ytb = parseInt((currentDate - jqxrqEnd) / (1000 * 60 * 60 * 24));
                        $scope.customerYcsj.data[i].index = $scope.policyIndex;
                        $scope.customerYcsjPage.data.push($scope.customerYcsj.data[i])
                        $scope.policyIndex = $scope.policyIndex+1;
                    }
                    if($scope.customerYcsjPage.data.length>=$scope.customerCount){
                        $scope.loadStatus=2; //全部加载完成
                        $scope.gridApiYcsj.infiniteScroll.dataLoaded(false, false)
                    }else{
                        $scope.loadStatus=0; //加载更多
                        $scope.gridApiYcsj.infiniteScroll.dataLoaded(false, true)
                    }
                }

            }
            $scope.searchMore = function(){
                $scope.startNum = $scope.startNum + 1;
                if($scope.pageType == "khlz"){
                    $scope.custDetailMore();
                }else if($scope.pageType == "ycsj"){
                    $scope.ycsjDetailMore();
                }
                $scope.loadStatus=1;//正在加载中。。。
            };
            //查询更多
            $scope.ycsjDetailMore = function(){
                $scope.customerYcsj.data=[];
                $("#msgwindow").show();
                reportService.findExceptionDataDetail($scope.recordTime,$scope.stackName,$scope.userId,$scope.startNum).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.customerYcsj.data = result.results.content.results;
                        $scope.getPolicyPage();
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                })
            }
            $scope.closeycsjDetail = function(){
                $("#aberrantDetail").hide();
            }
            //查询失销原因统计报表
            $scope.lostSale = {};
            $scope.lostSale.rangeTime = 1;
            $scope.lostSale.startTime = $filter('date')(new Date()-7*24*60*60*1000,'yyyy-MM-dd');
            $scope.lostSale.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.lostSaleRangeTimes = function(){
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month=myDate.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var rangeTime = $scope.lostSale.rangeTime;
                if(rangeTime==1){
                    $scope.lostSale.startTime = $filter('date')(oneWeek,'yyyy-MM-dd');
                    $scope.lostSale.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==2){
                    $scope.lostSale.startTime = $filter('date')(oneMonth,'yyyy-MM-dd');
                    $scope.lostSale.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==3){
                    $scope.lostSale.startTime = year+"-"+month+"-01";
                    $scope.lostSale.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==4){
                    if(month==1){
                        $scope.lostSale.startTime = (year-1)+"-12"+"-01";
                        $scope.lostSale.endTime = (year-1)+"-12-"+new Date(year,12,0).getDate();
                    }else{
                        var lastmonth = month-1;
                        lastmonth =(lastmonth<10 ? "0"+lastmonth:lastmonth);
                        $scope.lostSale.startTime = year+"-"+lastmonth+"-01";
                        $scope.lostSale.endTime = year+'-'+lastmonth+'-'+new Date(year,lastmonth,0).getDate();
                    }
                };
            };
            $scope.chartOptions_lostSale =  {
                type : 'bar',
                position:'top',
                xNameType:'失销原因'
            };
            $scope.lostSaleReportData ={};
            $scope.findLossReasonCount = function(){
                var startTime =  $scope.lostSale.startTime;
                var endTime =  $scope.lostSale.endTime;
                if(startTime>endTime){
                    $scope.angularTip("开始时间不能大于结束时间",5000);
                }else {
                    $("#msgwindow").show();
                    reportService.findLossReasonCount(startTime,endTime).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.lostSaleReportData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                }
            };

            //查询回退原因统计报表
            $scope.sendBack = {};
            $scope.sendBack.rangeTime = 1;
            $scope.sendBack.startTime = $filter('date')(new Date()-7*24*60*60*1000,'yyyy-MM-dd');
            $scope.sendBack.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.sendBackRangeTimes = function(){
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month=myDate.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var rangeTime = $scope.sendBack.rangeTime;
                if(rangeTime==1){
                    $scope.sendBack.startTime = $filter('date')(oneWeek,'yyyy-MM-dd');
                    $scope.sendBack.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==2){
                    $scope.sendBack.startTime = $filter('date')(oneMonth,'yyyy-MM-dd');
                    $scope.sendBack.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==3){
                    $scope.sendBack.startTime = year+"-"+month+"-01";
                    $scope.sendBack.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==4){
                    if(month==1){
                        $scope.sendBack.startTime = (year-1)+"-12"+"-01";
                        $scope.sendBack.endTime = (year-1)+"-12-"+new Date(year,12,0).getDate();
                    }else{
                        var lastmonth = month-1;
                        lastmonth =(lastmonth<10 ? "0"+lastmonth:lastmonth);
                        $scope.sendBack.startTime = year+"-"+lastmonth+"-01";
                        $scope.sendBack.endTime = year+'-'+lastmonth+'-'+new Date(year,lastmonth,0).getDate();
                    }
                };
            };
            $scope.chartOptions_sendBack =  {
                type : 'bar',
                position:'top',
                xNameType:'回退原因'
            };
            $scope.sendBackReportData ={};
            $scope.findReturnReasonCount = function(){
                var startTime =  $scope.sendBack.startTime;
                var endTime =  $scope.sendBack.endTime;
                if(startTime>endTime){
                    $scope.angularTip("开始时间不能大于结束时间",5000);
                }else {
                    $("#msgwindow").show();
                    reportService.findReturnReasonCount(startTime,endTime).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.sendBackReportData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                };
            };

            //保险公司业务占比
            $scope.insuranceBill_company =  {
                type : 'bar',
                groupByY : false,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : [],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'保险公司'
            };
            $scope.countInsuranceBillData ={};
            $scope.countInsuranceBill = function(){
                $("#msgwindow").show();
                var startTime =  $scope.insuranceBill.startTime;
                var endTime =  $scope.insuranceBill.endTime;
                var storeId = $rootScope.user.store.storeId;
                var param = {startTime:startTime,endTime:endTime,storeId:storeId};
                reportService.countInsuranceBill(param).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.countInsuranceBillData = result.results.content.results;
                        $scope.updateData = true;
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            }
            //保险公司业务占比时间栏
            $scope.insuranceBill = {};
            $scope.insuranceBill.rangeTime = 1;
            $scope.insuranceBill.startTime = $filter('date')(new Date()-7*24*60*60*1000,'yyyy-MM-dd');
            $scope.insuranceBill.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.insuranceBillRangeTimes = function(){
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month=myDate.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                var oneWeek = myDate-7*24*60*60*1000;
                var oneMonth = myDate-30*24*60*60*1000;
                var rangeTime = $scope.insuranceBill.rangeTime;
                if(rangeTime==1){
                    $scope.insuranceBill.startTime = $filter('date')(oneWeek,'yyyy-MM-dd');
                    $scope.insuranceBill.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==2){
                    $scope.insuranceBill.startTime = $filter('date')(oneMonth,'yyyy-MM-dd');
                    $scope.insuranceBill.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==3){
                    $scope.insuranceBill.startTime = year+"-"+month+"-01";
                    $scope.insuranceBill.endTime = $filter('date')(myDate,'yyyy-MM-dd');
                }else if(rangeTime==4){
                    if(month==1){
                        $scope.insuranceBill.startTime = (year-1)+"-12"+"-01";
                        $scope.insuranceBill.endTime = (year-1)+"-12-"+new Date(year,12,0).getDate();
                    }else{
                        var lastmonth = month-1;
                        lastmonth =(lastmonth<10 ? "0"+lastmonth:lastmonth);
                        $scope.insuranceBill.startTime = year+"-"+lastmonth+"-01";
                        $scope.insuranceBill.endTime = year+'-'+lastmonth+'-'+new Date(year,lastmonth,0).getDate();
                    }
                };
            };

            //查询当期续保率数据
            $scope.xbltjbb_dqxbl =  {
                type : 'bar',
                unit:'%',
                position:'top',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['当期续保率'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'续保类型'
            };
            $scope.xbltjbbDqxblData ={};
            $scope.xbltjbbDqxbl = function(msg){
                var time =  $scope.reportCondition.selectTime_dqxbl;
                if(time==undefined||time==null||time.length==0){
                    $scope.angularTip("请选择保险到期日",2500);
                }else{
                    $("#msgwindow").show();
                    var storeId = $rootScope.user.store.storeId;
                    var param = {time:time,storeId:storeId};
                    reportService.xbltjbbDqxbl(param).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.xbltjbbDqxblData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                }
            };

            //查询续保率统计报表-综合续保率
            $scope.xbltjbb_zhxbl =  {
                type : 'bar',
                unit:'%',
                position:'top',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['综合续保率'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'续保类型'
            };
            $scope.zhxbl ={};
            $scope.zhxblReportData ={};
            $scope.xbltjbbZhxbl = function(){
                $("#msgwindow").show();
                var selectTime =  $scope.zhxbl.selectTime;
                var condition = {time:selectTime,storeId:$rootScope.user.store.storeId};
                reportService.xbltjbbZhxbl(condition).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.zhxblReportData = result.results.content.results;
                        $scope.updateData = true;
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    };
                });
            }

            //续保率趋势报表-当期续保率
            $scope.xblqsbb_dqqs =  {
                type : 'bar',
                unit:'%',
                position:'top',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['新转续(%)','续转续(%)','间转续(%)','潜转续(%)','首次(%)'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'月',
                isShowAll:{isShowAll:true,show:['新转续','续转续','间转续','潜转续','首次','续转续(%)']}
            };
            $scope.xblqsbbDqqsData ={};
            $scope.xblqsbbDqqs = function(msg){
                var time =  $scope.reportCondition.selectTime_dqqs;
                if(time==undefined||time==null||time.length==0){
                    $scope.angularTip("请选择保险到期日",2500);
                }else{
                    $("#msgwindow").show();
                    var storeId = $rootScope.user.store.storeId;
                    var param = {time:time,storeId:storeId};
                    reportService.searchDqxblqs(param).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.xblqsbbDqqsData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                }
            };

            //续保率趋势报表-综合续保率
            $scope.xblqsbb_zhxbqs =  {
                type : 'bar',
                unit:'%',
                position:'top',
                groupByY : true,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                yAxisTwo : ['综合续保率(%)'],//存在第二个y轴时，以第二个y轴为基准的yName
                xNameType:'月',
                isShowAll:{isShowAll:true,show:['去年投保数','今年续保数','综合续保率(%)']}
            };
            $scope.zhxbqsbbData ={};
            $scope.zhxblqsSearch = function(msg){
                var time =  $scope.reportCondition.selectTime_zhxbqs;
                if(time==undefined||time==null||time.length==0){
                    $scope.angularTip("请选择保险到期日",2500);
                }else{
                    $("#msgwindow").show();
                    var storeId = $rootScope.user.store.storeId;
                    var param = {time:time,storeId:storeId};
                    reportService.searchZhxblqs(param).then(function(result){
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.zhxbqsbbData = result.results.content.results;
                            $scope.updateData = true;
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        };
                    });
                }
            };

            //跟踪统计,邀约和到店统计
            $scope.traceCounts =[];
            $scope.inviteComestores =[];
            $scope.countTraceCount_time = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.bipRiBao = function(){
                var time =  $scope.countTraceCount_time;
                if(time==undefined||time==null||time.length==0){
                    $scope.angularTip("请选择日期",2500);
                }else{
                    $("#msgwindow").show();
                    var storeId = $rootScope.user.store.storeId;
                    var param = {time:time,storeId:storeId};
                    insurancebillCount(param);
                    countXbzyKPI(param);
                    countXsgwKPI(param);
                    countFwgwKPI(param);
                    countCdyKPI(param);
                    countXbzyKPIDetail(param);
                    countXbzyKPICoverType(param);
                }
            }
            //跟踪统计
            function traceCount(param){
                reportService.traceCount(param).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.traceCounts = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            //邀约和到店统计
            function inviteComestore(param){
                reportService.inviteComestore(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.inviteComestores = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.insuranceCompNames = [];
            $scope.typeNames = [];
            $scope.nums = [];

            //保险KPI日报-分保险公司
            function insurancebillCount(param){
                reportService.insurancebillCount(param).then(function(result){
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.dailyInsuranceComps = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.dayXbzyKPIs = [];
            //保险KPI日报-续保专员
            function countXbzyKPI(param){
                reportService.countXbzyKPI(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.dayXbzyKPIs = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.dayXsgwKPIs = [];
            //保险KPI日报-销售顾问
            function countXsgwKPI(param){
                reportService.countXsgwKPI(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.dayXsgwKPIs = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.dayFwgwKPIs = [];
            //保险KPI日报-服务顾问
            function countFwgwKPI(param){
                reportService.countFwgwKPI(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.dayFwgwKPIs = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.dayCdyKPIs = [];
            //保险KPI日报-出单员
            function countCdyKPI(param){
                reportService.countCdyKPI(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.dayCdyKPIs = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.dayXbzyKPIDetails = [];
            //保险KPI日报-续保专员详情
            function countXbzyKPIDetail(param){
                reportService.countXbzyKPIDetail(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.dayXbzyKPIDetails = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            $scope.crltc = [];
            //保险KPI日报-分续保类型
            function countXbzyKPICoverType(param){
                $scope.yueInt = parseInt(param.time.substring(5,7));
                $scope.yueInt1=($scope.yueInt+1)%12;
                if($scope.yueInt1==0){
                    $scope.yueInt1 = 12;
                }
                $scope.yueInt2=($scope.yueInt+2)%12;
                if($scope.yueInt2==0){
                    $scope.yueInt2 = 12;
                }
                $scope.yueInt3=($scope.yueInt+3)%12;
                if($scope.yueInt3==0){
                    $scope.yueInt3 = 12;
                }
                reportService.countXbzyKPICoverType(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.crltc = result.results.content.results;
                    }else{
                        $scope.angularTip(result.results.message,2500);
                    };
                });
            }
            //显示续保专员的详情
            $scope.showXq = function(){
                $("#xbzyXQ").show();
            }
            //关闭
            $scope.guanbi = function(){
                $("#xbzyXQ").hide();
            }

            //保险KPI月报-分工作人员
            $scope.ybKpiWorker_selectTime = $filter('date')(new Date(),'yyyy-MM');
            $scope.monthXbzy = [];
            $scope.findCountMonthKpi = function(){
                var time = $scope.ybKpiWorker_selectTime;
                if(time==""||time==null){
                    $scope.angularTip("请选择时间",5000);
                    return;
                }
                var storeId = $rootScope.user.store.storeId;
                var param = {time:time,storeId:storeId};
                reportService.findCountMonthKpiXbzy(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.monthXbzy = result.results.content.results;
                    }else{
                        $scope.angularTip("查询失败",2500);
                    };
                });
                reportService.findCountMonthKpiCdy(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.monthCdy = result.results.content.results;
                        $scope.asmModuleFlag = $scope.monthCdy[0].asmModuleFlag;
                    }else{
                        $scope.angularTip("查询失败",2500);
                    };
                });
                reportService.findCountMonthKpiXbzyDetail(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.monthXbzyDetail = result.results.content.results;
                    }else{
                        $scope.angularTip("查询失败",2500);
                    };
                });
            };
            //显示月报 续保专员的详情
            $scope.showMonthXbzy = function(){
                $("#monthXbzyXQ").show();
            }
            //关闭
            $scope.hideMonthXbzy = function(){
                $("#monthXbzyXQ").hide();
            }
            //月报导出-分工作人员
            $scope.monthKpiExport = function(){
                var fileName = $scope.storetitle + $filter('date')(new Date(), 'yyyyMMdd') + "BIP月报-分工作人员" + '.xls'
                var worksheetName = $filter('date')(new Date(), 'yyyyMMdd') + "BIP月报-分工作人员" ;
                ExportExcel.tableToExcel("#monthKpiWorker",worksheetName,fileName);
            }

            //保险KPI月报-分保险公司
            $scope.ybKpiCompany_selectTime = $filter('date')(new Date(),'yyyy-MM');
            $scope.monthCompany = [];
            $scope.findCountMonthKpiInsurComp = function(){
                var time = $scope.ybKpiCompany_selectTime;
                if(time==""||time==null){
                    $scope.angularTip("请选择时间",5000);
                    return;
                }
                var storeId = $rootScope.user.store.storeId;
                var param = {time:time,storeId:storeId};
                reportService.findCountMonthKpiInsurComp(param).then(function(result){
                    console.log(result);
                    if (result.status == 'OK') {
                        $scope.monthCompany = result.results.content.results;
                      /*  $scope.monthCompany = [
                            {
                                insuranceCompName:'合计',
                                num:'5',
                                shuju:[
                                    {
                                        name:'合计',
                                        a:'11', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-全',
                                        a:'21', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-全',
                                        a:'31', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-贷',
                                        a:'41', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'续保',
                                        a:'51', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    }
                                ]
                            },
                            {
                                insuranceCompName:'人保',
                                num:'6',
                                shuju:[
                                    {
                                        name:'合计',
                                        a:'11', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-全',
                                        a:'21', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-全',
                                        a:'31', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-贷',
                                        a:'41', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'新保-贷',
                                        a:'61', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    },
                                    {
                                        name:'续保',
                                        a:'51', b:'12', c:'13', d:'14',e:'15',f:'16',g:'17',h:'18',i:'19',j:'10',k:'21'
                                    }
                                ]
                            },
                        ]*/
                       /* console.log($scope.monthCompany);*/
                    }else{
                        $scope.angularTip("查询失败",2500);
                    };
                });
            };
            //月报导出-分工作人员
            $scope.monthKpiCompExport = function(){
                var fileName = $scope.storetitle + $filter('date')(new Date(), 'yyyyMMdd') + "BIP月报-分保险公司" + '.xls'
                var worksheetName = $filter('date')(new Date(), 'yyyyMMdd') + "BIP月报-分保险公司" ;
                ExportExcel.tableToExcel("#monthKpiCompany",worksheetName,fileName);
            }
            //保险KPI月报-按投保类型
            $scope.ybRenewal_selectTime = $filter('date')(new Date(),'yyyy-MM');
            $scope.MonthKpiCoverType = [];
            $scope.findCountMonthKpiCoverType = function(){
                var time = $scope.ybRenewal_selectTime;
                $scope.thisMonth = parseInt($scope.ybRenewal_selectTime.substr(-2));
                $scope.thisMonth1=($scope.thisMonth+1)%12;
                if($scope.thisMonth1==0){
                    $scope.thisMonth1 = 12;
                }
                $scope.thisMonth2=($scope.thisMonth+2)%12;
                if($scope.thisMonth2==0){
                    $scope.thisMonth2 = 12;
                }
                $scope.thisMonth3=($scope.thisMonth+3)%12;
                if($scope.thisMonth3==0){
                    $scope.thisMonth3 = 12;
                }
                if(time==""||time==null){
                    $scope.angularTip("请选择时间",5000);
                    return;
                }
                var storeId = $rootScope.user.store.storeId;
                var param = {time:time,storeId:storeId};
                reportService.findCountMonthKpiCoverType(param).then(function(result){
                    if (result.status == 'OK') {
                        $scope.MonthKpiCoverType = result.results.content.results;
                        $scope.zynum00 = $scope.MonthKpiCoverType.zy[0].newN + $scope.MonthKpiCoverType.zy[0].renewN +
                            $scope.MonthKpiCoverType.zy[0].jzxN + $scope.MonthKpiCoverType.zy[0].qzxN + $scope.MonthKpiCoverType.zy[0].scN;
                        $scope.zynum01 = $scope.MonthKpiCoverType.zy[0].newN1 + $scope.MonthKpiCoverType.zy[0].renewN1 +
                            $scope.MonthKpiCoverType.zy[0].jzxN1 + $scope.MonthKpiCoverType.zy[0].qzxN1 + $scope.MonthKpiCoverType.zy[0].scN1;
                        $scope.zynum02 = $scope.MonthKpiCoverType.zy[0].newN2 + $scope.MonthKpiCoverType.zy[0].renewN2 +
                            $scope.MonthKpiCoverType.zy[0].jzxN2 + $scope.MonthKpiCoverType.zy[0].qzxN2 + $scope.MonthKpiCoverType.zy[0].scN2;
                        $scope.zynum03 = $scope.MonthKpiCoverType.zy[0].newN3 + $scope.MonthKpiCoverType.zy[0].renewN3 +
                            $scope.MonthKpiCoverType.zy[0].jzxN3 + $scope.MonthKpiCoverType.zy[0].qzxN3 + $scope.MonthKpiCoverType.zy[0].scN3;
                        $scope.zynum10 = $scope.MonthKpiCoverType.zy[1].newN + $scope.MonthKpiCoverType.zy[1].renewN +
                            $scope.MonthKpiCoverType.zy[1].jzxN + $scope.MonthKpiCoverType.zy[1].qzxN + $scope.MonthKpiCoverType.zy[1].scN;
                        $scope.zynum11 = $scope.MonthKpiCoverType.zy[1].newN1 + $scope.MonthKpiCoverType.zy[1].renewN1 +
                            $scope.MonthKpiCoverType.zy[1].jzxN1 + $scope.MonthKpiCoverType.zy[1].qzxN1 + $scope.MonthKpiCoverType.zy[1].scN1;
                        $scope.zynum12 = $scope.MonthKpiCoverType.zy[1].newN2 + $scope.MonthKpiCoverType.zy[1].renewN2 +
                            $scope.MonthKpiCoverType.zy[1].jzxN2 + $scope.MonthKpiCoverType.zy[1].qzxN2 + $scope.MonthKpiCoverType.zy[1].scN2;
                        $scope.zynum13 = $scope.MonthKpiCoverType.zy[1].newN3 + $scope.MonthKpiCoverType.zy[1].renewN3 +
                            $scope.MonthKpiCoverType.zy[1].jzxN3 + $scope.MonthKpiCoverType.zy[1].qzxN3 + $scope.MonthKpiCoverType.zy[1].scN3;
                        $scope.zynum20 = $scope.MonthKpiCoverType.zy[2].newN + $scope.MonthKpiCoverType.zy[2].renewN +
                            $scope.MonthKpiCoverType.zy[2].jzxN + $scope.MonthKpiCoverType.zy[2].qzxN + $scope.MonthKpiCoverType.zy[2].scN;
                        $scope.zynum21 = $scope.MonthKpiCoverType.zy[2].newN1 + $scope.MonthKpiCoverType.zy[2].renewN1 +
                            $scope.MonthKpiCoverType.zy[2].jzxN1 + $scope.MonthKpiCoverType.zy[2].qzxN1 + $scope.MonthKpiCoverType.zy[2].scN1;
                        $scope.zynum22 = $scope.MonthKpiCoverType.zy[2].newN2 + $scope.MonthKpiCoverType.zy[2].renewN2 +
                            $scope.MonthKpiCoverType.zy[2].jzxN2 + $scope.MonthKpiCoverType.zy[2].qzxN2 + $scope.MonthKpiCoverType.zy[2].scN2;
                        $scope.zynum23 = $scope.MonthKpiCoverType.zy[2].newN3 + $scope.MonthKpiCoverType.zy[2].renewN3 +
                            $scope.MonthKpiCoverType.zy[2].jzxN3 + $scope.MonthKpiCoverType.zy[2].qzxN3 + $scope.MonthKpiCoverType.zy[2].scN3;
                        $scope.zynum30 = $scope.MonthKpiCoverType.zy[3].newN + $scope.MonthKpiCoverType.zy[3].renewN +
                            $scope.MonthKpiCoverType.zy[3].jzxN + $scope.MonthKpiCoverType.zy[3].qzxN + $scope.MonthKpiCoverType.zy[3].scN;
                        $scope.zynum31 = $scope.MonthKpiCoverType.zy[3].newN1 + $scope.MonthKpiCoverType.zy[3].renewN1 +
                            $scope.MonthKpiCoverType.zy[3].jzxN1 + $scope.MonthKpiCoverType.zy[3].qzxN1 + $scope.MonthKpiCoverType.zy[3].scN1;
                        $scope.zynum32 = $scope.MonthKpiCoverType.zy[3].newN2 + $scope.MonthKpiCoverType.zy[3].renewN2 +
                            $scope.MonthKpiCoverType.zy[3].jzxN2 + $scope.MonthKpiCoverType.zy[3].qzxN2 + $scope.MonthKpiCoverType.zy[3].scN2;
                        $scope.zynum33 = $scope.MonthKpiCoverType.zy[3].newN3 + $scope.MonthKpiCoverType.zy[3].renewN3 +
                            $scope.MonthKpiCoverType.zy[3].jzxN3 + $scope.MonthKpiCoverType.zy[3].qzxN3 + $scope.MonthKpiCoverType.zy[3].scN3;

                        $scope.gzyynum00 = $scope.MonthKpiCoverType.gzyy[0].newN + $scope.MonthKpiCoverType.gzyy[0].renewN +
                            $scope.MonthKpiCoverType.gzyy[0].jzxN + $scope.MonthKpiCoverType.gzyy[0].qzxN + $scope.MonthKpiCoverType.gzyy[0].scN;
                        $scope.gzyynum01 = $scope.MonthKpiCoverType.gzyy[0].newN1 + $scope.MonthKpiCoverType.gzyy[0].renewN1 +
                            $scope.MonthKpiCoverType.gzyy[0].jzxN1 + $scope.MonthKpiCoverType.gzyy[0].qzxN1 + $scope.MonthKpiCoverType.gzyy[0].scN1;
                        $scope.gzyynum02 = $scope.MonthKpiCoverType.gzyy[0].newN2 + $scope.MonthKpiCoverType.gzyy[0].renewN2 +
                            $scope.MonthKpiCoverType.gzyy[0].jzxN2 + $scope.MonthKpiCoverType.gzyy[0].qzxN2 + $scope.MonthKpiCoverType.gzyy[0].scN2;
                        $scope.gzyynum03 = $scope.MonthKpiCoverType.gzyy[0].newN3 + $scope.MonthKpiCoverType.gzyy[0].renewN3 +
                            $scope.MonthKpiCoverType.gzyy[0].jzxN3 + $scope.MonthKpiCoverType.gzyy[0].qzxN3 + $scope.MonthKpiCoverType.gzyy[0].scN3;
                        $scope.gzyynum10 = $scope.MonthKpiCoverType.gzyy[1].newN + $scope.MonthKpiCoverType.gzyy[1].renewN +
                            $scope.MonthKpiCoverType.gzyy[1].jzxN + $scope.MonthKpiCoverType.gzyy[1].qzxN + $scope.MonthKpiCoverType.gzyy[1].scN;
                        $scope.gzyynum11 = $scope.MonthKpiCoverType.gzyy[1].newN1 + $scope.MonthKpiCoverType.gzyy[1].renewN1 +
                            $scope.MonthKpiCoverType.gzyy[1].jzxN1 + $scope.MonthKpiCoverType.gzyy[1].qzxN1 + $scope.MonthKpiCoverType.gzyy[1].scN1;
                        $scope.gzyynum12 = $scope.MonthKpiCoverType.gzyy[1].newN2 + $scope.MonthKpiCoverType.gzyy[1].renewN2 +
                            $scope.MonthKpiCoverType.gzyy[1].jzxN2 + $scope.MonthKpiCoverType.gzyy[1].qzxN2 + $scope.MonthKpiCoverType.gzyy[1].scN2;
                        $scope.gzyynum13 = $scope.MonthKpiCoverType.gzyy[1].newN3 + $scope.MonthKpiCoverType.gzyy[1].renewN3 +
                            $scope.MonthKpiCoverType.gzyy[1].jzxN3 + $scope.MonthKpiCoverType.gzyy[1].qzxN3 + $scope.MonthKpiCoverType.gzyy[1].scN3;

                        $scope.ddcdnum00 = $scope.MonthKpiCoverType.ddcd[0].newN + $scope.MonthKpiCoverType.ddcd[0].renewN +
                            $scope.MonthKpiCoverType.ddcd[0].jzxN + $scope.MonthKpiCoverType.ddcd[0].qzxN + $scope.MonthKpiCoverType.ddcd[0].scN;
                        $scope.ddcdnum01 = $scope.MonthKpiCoverType.ddcd[0].newN1 + $scope.MonthKpiCoverType.ddcd[0].renewN1 +
                            $scope.MonthKpiCoverType.ddcd[0].jzxN1 + $scope.MonthKpiCoverType.ddcd[0].qzxN1 + $scope.MonthKpiCoverType.ddcd[0].scN1;
                        $scope.ddcdnum02 = $scope.MonthKpiCoverType.ddcd[0].newN2 + $scope.MonthKpiCoverType.ddcd[0].renewN2 +
                            $scope.MonthKpiCoverType.ddcd[0].jzxN2 + $scope.MonthKpiCoverType.ddcd[0].qzxN2 + $scope.MonthKpiCoverType.ddcd[0].scN2;
                        $scope.ddcdnum03 = $scope.MonthKpiCoverType.ddcd[0].newN3 + $scope.MonthKpiCoverType.ddcd[0].renewN3 +
                            $scope.MonthKpiCoverType.ddcd[0].jzxN3 + $scope.MonthKpiCoverType.ddcd[0].qzxN3 + $scope.MonthKpiCoverType.ddcd[0].scN3;
                        $scope.ddcdnum10 = $scope.MonthKpiCoverType.ddcd[1].newN + $scope.MonthKpiCoverType.ddcd[1].renewN +
                            $scope.MonthKpiCoverType.ddcd[1].jzxN + $scope.MonthKpiCoverType.ddcd[1].qzxN + $scope.MonthKpiCoverType.ddcd[1].scN;
                        $scope.ddcdnum11 = $scope.MonthKpiCoverType.ddcd[1].newN1 + $scope.MonthKpiCoverType.ddcd[1].renewN1 +
                            $scope.MonthKpiCoverType.ddcd[1].jzxN1 + $scope.MonthKpiCoverType.ddcd[1].qzxN1 + $scope.MonthKpiCoverType.ddcd[1].scN1;
                        $scope.ddcdnum12 = $scope.MonthKpiCoverType.ddcd[1].newN2 + $scope.MonthKpiCoverType.ddcd[1].renewN2 +
                            $scope.MonthKpiCoverType.ddcd[1].jzxN2 + $scope.MonthKpiCoverType.ddcd[1].qzxN2 + $scope.MonthKpiCoverType.ddcd[1].scN2;
                        $scope.ddcdnum13 = $scope.MonthKpiCoverType.ddcd[1].newN3 + $scope.MonthKpiCoverType.ddcd[1].renewN3 +
                            $scope.MonthKpiCoverType.ddcd[1].jzxN3 + $scope.MonthKpiCoverType.ddcd[1].qzxN3 + $scope.MonthKpiCoverType.ddcd[1].scN3;
                        $scope.ddcdnum20 = $scope.MonthKpiCoverType.ddcd[2].newN + $scope.MonthKpiCoverType.ddcd[2].renewN +
                            $scope.MonthKpiCoverType.ddcd[2].jzxN + $scope.MonthKpiCoverType.ddcd[2].qzxN + $scope.MonthKpiCoverType.ddcd[2].scN;
                        $scope.ddcdnum21 = $scope.MonthKpiCoverType.ddcd[2].newN1 + $scope.MonthKpiCoverType.ddcd[2].renewN1 +
                            $scope.MonthKpiCoverType.ddcd[2].jzxN1 + $scope.MonthKpiCoverType.ddcd[2].qzxN1 + $scope.MonthKpiCoverType.ddcd[2].scN1;
                        $scope.ddcdnum22 = $scope.MonthKpiCoverType.ddcd[2].newN2 + $scope.MonthKpiCoverType.ddcd[2].renewN2 +
                            $scope.MonthKpiCoverType.ddcd[2].jzxN2 + $scope.MonthKpiCoverType.ddcd[2].qzxN2 + $scope.MonthKpiCoverType.ddcd[2].scN2;
                        $scope.ddcdnum23 = $scope.MonthKpiCoverType.ddcd[2].newN3 + $scope.MonthKpiCoverType.ddcd[2].renewN3 +
                            $scope.MonthKpiCoverType.ddcd[2].jzxN3 + $scope.MonthKpiCoverType.ddcd[2].qzxN3 + $scope.MonthKpiCoverType.ddcd[2].scN3;
                    }else{
                        $scope.angularTip("查询失败",3000);
                    };
                });
            };

            //保险KPI月报-按投保类型导出
            $scope.MonthKpiRenewalExport = function(){
                var fileName = $scope.storetitle + $filter('date')(new Date(), 'yyyyMMdd') + "KPI月报-按投保类型" + '.xls'
                var worksheetName = $filter('date')(new Date(), 'yyyyMMdd') + "KPI月报-按投保类型" ;
                ExportExcel.tableToExcel("#MonthKpiRenewalType",worksheetName,fileName);
            }

            //导出
            $scope.daochu = function(){
                var fileName = $scope.storetitle + $filter('date')(new Date(), 'yyyyMMdd') + "BIP日报" + '.xls'
                var worksheetName = $filter('date')(new Date(), 'yyyyMMdd') + "BIP日报" ;
                ExportExcel.tableToExcel("#ribao",worksheetName,fileName);
            }
            //时间控件
            $('.time').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                endDate : new Date()
            });
            //时间控件
            $('.selectDate').datepicker({
                format: 'yyyy-mm',
                weekStart: 1,
                autoclose: true,
                startView: 1,
                maxViewMode: 2,
                minViewMode:1,
                forceParse: false,
                language: 'zh-CN',
                endDate : new Date()
            });
            //时间控件
            $('.starttime').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN',
                endDate : new Date(),
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
                endDate : new Date(),
                forceParse:false
            }).on('changeDate',function(ev){
                var endTime = ev.date.valueOf();
            });
            // 报表tab导航栏
            $scope.ReportIndex = 0;
            $(".report_nav_tabs li").mouseover(function() {
                $(".report_tab_content").show();
                 var index = $(this).index();
                $(".report_nav_tabs li").removeClass("active");
                $(this).addClass("active");
                $(".report_tab_content").children(".report_fade").hide();
                $(".report_tab_content").children(".report_fade").eq(index).show();
            });
            $(".report_tab_content  li").click(function() {
                $(".report_tab_content").hide();
                $scope.ReportIndex = $(this).parents(".report_fade").index();
                $(".report_nav_tabs li").removeClass("active");
                $(".report_nav_tabs li").eq($scope.ReportIndex).addClass("active");
            });
            $(".report_tab_content").mouseleave(function() {
                $(".report_tab_content").hide();
                $(".report_nav_tabs li").removeClass("active");
                $(".report_nav_tabs li").eq($scope.ReportIndex).addClass("active");
            });
        }
    ]);

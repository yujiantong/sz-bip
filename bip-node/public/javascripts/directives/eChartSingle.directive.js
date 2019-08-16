'use strict';
angular.module('myApp')
    .directive('eChartSingle', function(createReportOption,exportExcelReportData) {
        return {
            scope: {
                id: "@",
                chartOptions: "=",
                slaveData: "=",
                eRData:"=",
                data: "=",
                updateData:"=",
                lineData:"=",
                customerDetail:"="
            },
            restrict: 'E',
            template: '<div style="height:500px;width: 100%"></div>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                function creatOption() {
                    if(!$scope.data){
                        $scope.data=[];
                    }
                    if(!$scope.chartOptions){
                        $scope.chartOptions = {};
                    }
                    var chartOptions = {
                        data: $scope.data,
                        type: $scope.chartOptions.type || 'bar',
                        name: $scope.chartOptions.name || "",
                        width: $scope.chartOptions.width || 1000,
                        height: $scope.chartOptions.height || 800,
                        needSum: $scope.chartOptions.needSum || false,//是否需要展示合计，若展示合计，图表显示时默认只显示合计值
                        dateType: $scope.chartOptions.dateType || 'month',
                        unit: $scope.chartOptions.unit || '',
                        isShowLabel: $scope.chartOptions.isShowLabel || true,
                        position:$scope.chartOptions.position||"inside",//top'|'right'|'inside' | 'left' | 'bottom'
                        needAuthority: $scope.chartOptions.needAuthority || !0,//是否需要权限过滤
                        groupByY: $scope.chartOptions.groupByY || false,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                        yAxisTwo: $scope.chartOptions.yAxisTwo || [],//存在第二个y轴时，以第二个y轴为基准的yName
                        xNameType: $scope.chartOptions.xNameType || '',
                        needLengend:$scope.chartOptions.needLengend||true, //是否显示图例，默认true显示，false为不显示
                        isShowAll:$scope.chartOptions.isShowAll||{isShowAll:true,show:[]}//{isShowAll:true,show:[]},是否显示所有，
                                     // isShowAll默认true显示全部;show[]长度为0时，显示全部，如果show有值，
                                     // 则显示show中的值，其他不显示；false：只显示首个,show:[]无效
                    };

                    var option = createReportOption.createOption(chartOptions);
                    $scope.eRData = exportExcelReportData.createReportData(option, chartOptions);
                    var worldMapContainer = document.getElementById($scope.id);
                    //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
                    var resizeWorldMapContainer = function () {
                        worldMapContainer.style.width = (window.innerWidth-100)+'px';
                        worldMapContainer.style.height = (window.innerHeight-260)+'px';
                    };
                    //设置容器高宽
                    resizeWorldMapContainer();
                    function eConsole(param) {
                        if($scope.chartOptions.xNameType == '流转潜客持有人'||$scope.chartOptions.xNameType == '异常数据持有人'){
                            $scope.lineData = param;
                            $scope.lineData.clickValue = 0;
                            $scope.customerDetail;
                            $scope.$apply(function() {
                            });
                        }
                    };
                    var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
                    myChart.resize();
                    myChart.clear();
                    myChart.setOption(option);
                    //用于使chart自适应高度和宽度
                    window.onresize = function () {
                        //重置容器高宽
                        resizeWorldMapContainer();
                        myChart.resize();
                    };
                    myChart.on('click', eConsole);
                }
                creatOption();
                $scope.$watch(attrs['updateData'], function() {
                    if($scope.updateData){
                        creatOption();
                    }
                    $scope.updateData = false;
                }, true);
            }
        };
    });
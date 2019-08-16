'use strict';
angular.module('myApp')
    .directive('eChartMaster', function(eChartsHelper) {
        return {
            scope: {
                id: "@",
                legend: "=",
                item: "=",
                data: "="
            },
            restrict: 'E',
            template: '<div style="height:400px;"></div>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                var chartOptionsMaster = {
                    data : $scope.data,//报表数据来源
                    type : 'bar',
                    name :  "情况统计报表-主图",//报表的名字
                    width : 1000,
                    height : 800,
                    needSum : true,//是否需要展示合计，若展示合计，图表显示时默认只显示合计值
                    dateType : 'month',
                    needAuthority : !0,//是否需要权限过滤
                    groupByY : false,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                    yAxisTwo : [],//存在第二个y轴时，以第二个y轴为基准的yName
                };

                var optionMaster = eChartsHelper.createOption(chartOptionsMaster,0,0);
                console.log(optionMaster)
                function eConsole(param) {
                    $scope.item = {name:param.name,seriesName:param.seriesName};
                    $scope.$apply(function() {
                    });
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(optionMaster);
                myChart.on('click', eConsole);
            }
        };
    });
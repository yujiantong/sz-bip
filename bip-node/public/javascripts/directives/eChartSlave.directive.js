'use strict';
angular.module('myApp')
    .directive('eChartSlave', function(eChartsHelper) {
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
                function creatOption() {


                    var masterData = $.extend(true, [], $scope.data);
                    var masterStack = null;
                    console.log($scope.item)
                    //用于点击主表数据时子表的数据显示
                    $.each(masterData, function (i, v) {
                        var needLengend = (v.yName == $scope.item.seriesName && $scope.item.name == v.xName);
                        if (needLengend) {
                            masterStack = v.stack;
                            return false;
                        }
                    })
                    var slaveData = [];
                    $.each(masterData, function (i, v) {
                        var needLengend = (v.xName == $scope.item.name && (v.stack == masterStack || $scope.item.seriesName == '合计'));
                        if (needLengend) {
                            var dataTemp = $.extend({}, v);
                            dataTemp.tempXName = dataTemp.xName;
                            dataTemp.xName = dataTemp.yName;
                            dataTemp.yName = dataTemp.stackName;
                            slaveData.push(dataTemp);
                        }
                    })
                    var chartOptionsMaster = {
                        data: slaveData,
                        type: 'bar',
                        name: "情况统计报表-子图",
                        width: 1000,
                        height: 800,
                        needSum: false,//是否需要展示合计，若展示合计，图表显示时默认只显示合计值
                        dateType: 'month',
                        needAuthority: !0,//是否需要权限过滤
                        groupByY: false,//仅在趋势图时使用，是否使用yId作为展示趋势的值。默认是使用xId
                        yAxisTwo: [],//存在第二个y轴时，以第二个y轴为基准的yName
                    };

                    var optionMaster = eChartsHelper.createOption(chartOptionsMaster, 1, 1,1);

                    function eConsole(param) {

                    };
                    var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
                    myChart.setOption(optionMaster);
                    //myChart.on('click', eConsole);
                };
                creatOption();
                $scope.$watch(attrs['item'], function() {
                    creatOption();
                }, true);
            }
        };
    });
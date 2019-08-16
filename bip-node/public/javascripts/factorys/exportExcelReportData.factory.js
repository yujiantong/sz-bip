angular.module('myApp')
    .factory('exportExcelReportData', function ($window,FileSaver,Blob) {
            var createReportData = function(option,chartOptions){
                var exportReportData = {title:[],content:[]};
                exportReportData.title = $.merge(['序号',chartOptions.xNameType||''],$.extend(true,[], option.legend.data));
                var xAxis = $.extend(true,[],option.xAxis[0].data);
                var content =  $.extend(true,[], option.series);
                for (var i = 0; i < content.length; i++) {
                    for (var j = 0; j < chartOptions.yAxisTwo.length; j++) {
                        if(chartOptions.yAxisTwo[j]==content[i].name){
                            for (var k = 0; k < content[i].data.length; k++) {
                                content[i].data[k] += chartOptions.unit;
                            }
                        }
                    }
                }
                for (var i = 0; i < xAxis.length; i++) {
                    var rowArray = [{value:xAxis[i]}];
                    for (var j = 0; j < content.length; j++) {
                        rowArray.push({value:content[j].data[i]});
                    }
                    exportReportData.content.push($.extend(true, [],rowArray));
                }
                return exportReportData;
            }
        return {
            /**
             * 此方法从echars图表中的option转成导出所需格式
             * @param option  echars图表格式，
             */
            createReportData: function (option,chartOptions) {
                return createReportData(option,chartOptions);
               }
        };
    })
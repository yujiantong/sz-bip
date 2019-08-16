angular.module('myApp')
    .factory('createReportOption', function () {

        var reportOptions = {};
        var bofideChartStackMap = {};
        reportOptions.chartTypes = {
            bar : 'bar',//柱状图
            line : 'line',//折线图
            pie : 'pie',//饼图
            trend : 'trend',//趋势图
        };

        var createReportOption = {
            //data=[{xName:XXX,group:XXX,value:XXX},{xName:XXX,group:XXX,value:XXX}...]
            //type为要渲染的图表类型：可以为line，bar，这种格式的数据多用于展示多条折线图、分组的柱图
            formateGroupDataForStack : function(data, type,needSum,needLengend,isShowAll,unit,isShowLabel,position){
                var chart_type = type || reportOptions.chartTypes.bar;
                var xAxis = [];
                var xIndexMap = {};
                var xSumMap = {};
                var group = [];
                var series = [];
                var stacks = [];
                var stackNames = [];
                // 统计stack的个数用于去除重复的
                for (var i = 0; i < data.length; i++) {
                    var boolean = true;
                    if(stacks.length){
                        for(var j = 0;j<stacks.length;j++){
                            if(stacks[j] == data[i].stack){
                                boolean =false;
                            }
                        }
                        if(boolean){
                            stacks.push(data[i].stack);
                        }
                    }else{
                        stacks.push(data[i].stack)
                    }
                }
                for (var a = 0; a < data.length; a++) {
                    var boolean = true;
                    if(stackNames.length){
                        for(var b = 0;b<stackNames.length;b++){
                            if(stackNames[b] == data[a].stackName){
                                boolean =false;
                            }
                        }
                        if(boolean){
                            stackNames.push(data[a].stackName);
                        }
                    }else{
                        stackNames.push(data[a].stackName)

                    }
                }

                //统计不同的stack下的列数组{}
                //      var map = {};
                for(var i = 0 ;i < stackNames.length;i++){
                    var stackArray = [];
                    for (var j = 0; j < data.length; j++) {
                        if(stackNames[i] == data[j].stackName){
                            stackArray.push(data[j].xName)
                        }
                    }
                    var stackName = stackNames[i];
                    bofideChartStackMap[stackName] = stackArray;
                }



                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < xAxis.length && xAxis[j] != data[i].xName; j++);
                    if (j == xAxis.length){
                        xAxis.push(data[i].xName);
                        xIndexMap[data[i].xName] = xAxis.length-1;
                        xSumMap[data[i].xName] = 0;
                    }
                    for (var k = 0; k < group.length && group[k] != data[i].yName; k++);
                    if (k == group.length){
                        group.push(data[i].yName);
                    }
                }
                if(needLengend||!needLengend){
                    for (var i = 0; i < group.length; i++) {
                        var temp = [];
                        for(var j = 0; j < xAxis.length; j++){
                            temp[j] = 0;
                        }

                        var stack = '';
                        for (var j = 0; j < data.length; j++) {
                            if (group[i] == data[j].yName) {
                                stack = data[j].stack;
                                if (type == "map"){
                                    temp[xIndexMap[data[j].xName]] = { name: data[j].xName, value: data[i].value };
                                }else{
                                    temp[xIndexMap[data[j].xName]] = data[j].value;
                                }
                            }
                        }
                        var series_temp;
                        switch (type) {
                            case reportOptions.chartTypes.bar:
                                series_temp = { name: group[i], data: temp, type: chart_type };
                                series_temp = $.extend({}, {
                                    stack: stack ,
                                    label: {
                                        normal: {
                                            show: isShowLabel,
                                            position: position,
                                            formatter:'{c}'
                                        }
                                    }
                                }, series_temp);
                                break;
                            case 'map':
                                series_temp = {
                                    name: group[i], type: chart_type, mapType: 'china', selectedMode: 'single',
                                    itemStyle: {
                                        normal: { label: { show: true} },
                                        emphasis: { label: { show: true} }
                                    },
                                    data: temp
                                };
                                break;
                            case reportOptions.chartTypes.line:
                                series_temp = { name: group[i], data: temp, type: chart_type };
                                series_temp = $.extend({}, {
                                    stack: stack,
                                    label: {
                                        normal: {
                                            show: isShowLabel,
                                            position: 'top'
                                        }
                                    }
                                }, series_temp);
                                break;
                            default:
                                var series_temp = { name: group[i], data: temp, type: chart_type };
                        }
                        series.push(series_temp);
                    }
                }

                //求合计
                if(needSum){
                    $.each(data,function(i,v){
                        xSumMap[v.xName] += v.value;
                    });
                    var sumData = [];
                    $.each(xAxis,function(i,v){
                        sumData.push(xSumMap[v]/(stacks.length));
                    });
                    var series_temp;
                    switch (type) {
                        case reportOptions.chartTypes.bar:
                            series_temp = { name: '合计', data: sumData, type: chart_type };
                            series_temp = $.extend({}, {
                                stack: '合计' ,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }, series_temp);
                            break;
                        case reportOptions.chartTypes.line:
                            series_temp = { name: '合计', data: sumData, type: chart_type };
                            series_temp = $.extend({}, {
                                stack: '合计',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }, series_temp);
                            break;
                    }
                    series.unshift(series_temp);
                    group.unshift('合计');
                }
                return { category: group, xAxis: xAxis, series: series };
            },
            ChartOptionTemplates: {
                CommonOption: {//通用的图表基本配置
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {type:'shadow'}
                    },
                    toolbox: {
                        show: true, //是否显示工具栏
                        feature: {
                            mark: true,
                            dataView: { readOnly: false }, //数据预览
                            restore: true, //复原
                            saveAsImage: true //是否保存图片
                        }
                    }
                },
                CommonLineOption: function(legend,unit){//通用的折线图表的基本配置
                    var tooltip = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {type: 'shadow'}
                        }
                    }
                    /*var formatter = '{b}<br/>';
                     var style = "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;'></span>"
                     if(unit!=""){
                     for(i=0;i<legend.length;i++){
                     var unit2 = '';
                     if((legend.length-1)==i){
                     unit2 = unit;
                     }
                     formatter += style+'{a'+i+'} : {c'+i+'}'+unit2+'<br/>';
                     }
                     tooltip.tooltip.formatter = formatter;
                     }*/
                    return  tooltip;
                },
                //饼图
                Pie: function (data, name) {//data:数据格式：{name：xxx,value:xxx}...
                    var pie_datas = createReportOption.formateNOGroupData(data);
                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b} : {c} ({d}/%)',
                            show: true
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: pie_datas.category
                        },
                        series: [
                            {
                                name: name || "",
                                type: reportOptions.chartTypes.pie,
                                radius: '65%',
                                center: ['50%', '50%'],
                                data: pie_datas.data
                            }
                        ]
                    };
                    return $.extend({}, createReportOption.ChartOptionTemplates.CommonOption, option);
                },
                getLegendSelected: function(datas,needSum){
                    if(!needSum){
                        return {};
                    }
                    var selected = {};
                    $.each(datas.category,function(i,v){
                        selected[v] = v=='合计';
                    });
                    return selected;
                },
                //折线图
                Lines: function (data, name, needSum) { //data:数据格式：{name：xxx,group:xxx,value:xxx}...
                    var stackline_datas = createReportOption.formateGroupDataForStack(data, reportOptions.chartTypes.line, needSum);
                    var option = {
                        legend: {
                            data: stackline_datas.category,
                            selected: createReportOption.ChartOptionTemplates.getLegendSelected(stackline_datas,needSum)
                        },
                        xAxis: [{
                            type: 'category', //X轴均为category，Y轴均为value
                            data: stackline_datas.xAxis,
                            boundaryGap: false//数值轴两端的空白策略
                        }],
                        yAxis: [{
                            name: name || '',
                            type: 'value',
                            splitArea: { show: true }
                        }],
                        series: stackline_datas.series
                    };
                    return $.extend({}, createReportOption.ChartOptionTemplates.CommonLineOption, option);
                },
                Trend: function (data, name, dateType, groupByY){
                    var trend_dates = createReportOption.formateGroupDataForTime(data, dateType, groupByY);
                    var option = {
                        legend: {
                            data: trend_dates.category
                        },
                        xAxis: [{
                            type: 'category', //X轴均为category，Y轴均为value
                            data: trend_dates.xAxis,
                            boundaryGap: false//数值轴两端的空白策略
                        }],
                        yAxis: [{
                            name: name || '',
                            type: 'value',
                            splitArea: { show: true }
                        }],
                        series: trend_dates.series
                    };
                    return $.extend({}, createReportOption.ChartOptionTemplates.CommonLineOption, option);
                },
                Bars: function (data, name, needSum,needLengend,isShowAll,unit,isShowLabel,position) {//data:数据格式：{name：xxx,group:xxx,value:xxx}...
                    var bars_dates = createReportOption.formateGroupDataForStack(data, reportOptions.chartTypes.bar, needSum,needLengend,isShowAll,unit,isShowLabel,position);
                    var select = {};
                    //默认显示legends的第一个
                    var legends = bars_dates.category
                    if(!isShowAll.isShowAll){
                        for(var i in legends){
                            var legend = legends[i];
                            if(i == 0){
                                select[legend] = true;
                            }else{
                                select[legend] = false;
                            }
                        }
                    }else{
                        if(isShowAll.show.length>0){
                            for(var i in legends){
                                var legend = legends[i];
                                select[legend] = false;
                            }
                            for(var i in isShowAll.show){
                                var legend = isShowAll.show[i];
                                select[legend] = true;
                            }
                        }else {
                            for(var i in legends){
                                var legend = legends[i];
                                select[legend] = true;
                            }
                        }
                    }
                    var option = {
                        legend: {
                            show : needLengend,
                            selected :select,
                            data : bars_dates.category,
                        },
                        xAxis: [{
                            type: 'category',
                            data: bars_dates.xAxis,
                            axisLabel: {
                                show: true,
                                interval: 'auto',
                                rotate: 0,
                                margion: 8
                            }
                        }],
                        yAxis: [{
                            nameTextStyle:{fontSize  : 20},
                            type: 'value',
                            name: name || '',
                            splitArea: { show: true }
                        }],
                        series: bars_dates.series
                    };
                    if(option.xAxis[0].data.length>10){
                        var end = (100*10/option.xAxis[0].data.length).toFixed(0);
                        option.dataZoom = {
                            orient:"horizontal", //水平显示
                            show:true, //显示滚动条
                            start:0, //起始值为0%
                            end:end  //结束值为前10个
                        }
                    }
                    return $.extend({}, createReportOption.ChartOptionTemplates.CommonLineOption(bars_dates.category,unit), option);
                }
            },
            /**
             * 完成数据的转换
             * @param chartOptions
             * @returns {*}
             */
            getEChartOption : function(chartOptions){
                var option;
                switch (chartOptions.type) {
                    case reportOptions.chartTypes.trend://趋势图
                        option = createReportOption.ChartOptionTemplates.Trend(chartOptions.data,chartOptions.name,chartOptions.dateType,chartOptions.groupByY);
                        break;
                    case reportOptions.chartTypes.bar://柱状图
                        option = createReportOption.ChartOptionTemplates.Bars(chartOptions.data,chartOptions.name,chartOptions.needSum,
                            chartOptions.needLengend,chartOptions.isShowAll,chartOptions.unit,chartOptions.isShowLabel,chartOptions.position);
                        break;
                    case reportOptions.chartTypes.line://折线图
                        option = createReportOption.ChartOptionTemplates.Lines(chartOptions.data,chartOptions.name,chartOptions.needSum);
                        break;
                    case reportOptions.chartTypes.pie://饼图
                        option = createReportOption.ChartOptionTemplates.Pie(chartOptions.data,chartOptions.name);
                        break;
                    case reportOptions.chartTypes.bar_line://折拄混搭图
                        option = createReportOption.ChartOptionTemplates.Bar_line(chartOptions.data,chartOptions.name);
                        break;
                    default:
                        option = createReportOption.ChartOptionTemplates.Bars(chartOptions.data,chartOptions.name,
                            chartOptions.needSum,chartOptions.needLengend,chartOptions.isShowAll,chartOptions.unit);
                }
                if(chartOptions.yAxisTwo.length>0){
                    option.yAxis.push({
                        nameTextStyle:{fontSize  : 20},
                        type: 'value',
                        name: '',
                        splitArea: { show: true },
                        axisLabel : {
                            formatter: '{value} '+ chartOptions.unit
                        }
                    });
                    $.each(option.series,function(i,v){
                        $.each(chartOptions.yAxisTwo,function(index,name){
                            v.name==name && (v.yAxisIndex=1,v.type='line',v.label.normal.position='top',
                                v.label.normal.formatter='{c}'+chartOptions.unit);
                        });
                    })
                }
                return $.extend({}, createReportOption.ChartOptionTemplates.CommonLineOption, option);
            }
        }


        return {
            /**
             *
             * @param chartOptions  options配置参数
             *                        data : 从后台所获取的json数据,
             *                        type : 图表类型,
             *                        name :  表名称，默认为空字符串"",
             *                        needSum : 是否需要展示合计，若展示合计，图表显示时默认只显示合计值，默认为true
             *                        groupByY : 仅在趋势图时使用，是否使用yId作为展示趋势的值。默认为false,
             *                        yAxisTwo : 默认[],存在第二个y轴时，以第二个y轴为基准的yName
             *                        needLengend:是否显示图例，默认true显示  true：默认，显示图例 false：不显示图例
             *                        isShowAll:{isShowAll:true,show:[]},是否显示所有，isShowAll默认true显示全部,
             *                                  show[]长度为0时，显示全部，如果show有值，则显示show中的值，其他不显示；
             *                                  false：只显示首个,show:[]无效
             * @returns {*}  echars所需的option
             */
            createOption: function (chartOptions) {
                return createReportOption.getEChartOption(chartOptions);
            }
        };

    })
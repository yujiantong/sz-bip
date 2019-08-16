angular.module('myApp')
    .factory('eChartsHelper', function () {
        var reportOptions = {};
        var bofideChartStackMap = {};
        reportOptions.chartTypes = {
            bar : 'bar',
            line : 'line',
            pie : 'pie',
            trend : 'trend'
        };
        var eChartsHelper = {
            //data=[{xName:XXX,value:XXX},{xName:XXX,value:XXX}….]
            //多用于饼图、单一的柱形图的数据源
            formateNOGroupData : function(data,needSum){
                var categories = [];
                var datas = [];
                for (var i = 0; i < data.length; i++) {
                    categories.push(data[i].xName || "");
                    datas.push({ name: data[i].xName, value: data[i].value || 0 });
                }
                return { category: categories, data: datas };
            },
            //data=[{xName:XXX,group:XXX,value:XXX},{xName:XXX,group:XXX,value:XXX}...]
            //type为要渲染的图表类型：可以为line，bar，这种格式的数据多用于展示多条折线图、分组的柱图
            formateGroupDataForStack : function(data, type,needSum,needLengend,lengendSort){
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
                if(needLengend){
                    for (var i = 0; i < group.length; i++) {
                        var temp = [];
                        if(!lengendSort){//不对lengend排序的话，补齐0
                            for(var j = 0; j < xAxis.length; j++){
                                temp[j] = 0;
                            }
                        }
                        var stack = '';
                        for (var j = 0; j < data.length; j++) {
                            if (group[i] == data[j].yName) {
                                stack = data[j].stack;
                                if (type == "map"){
                                    temp[xIndexMap[data[j].xName]] = { name: data[j].xName, value: data[i].value };
                                }else{
                                    if(lengendSort){
                                        temp.push(data[j].value);
                                    }else{
                                        temp[xIndexMap[data[j].xName]] = data[j].value;
                                    }
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
                                            show: true,
                                            position: 'inside'
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
                                            show: true,
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
            //data=[{xName:XXX,group:XXX,recordTime:XXX,value:XXX},{xName:XXX,group:XXX,recordTime:XXX,value:XXX}...]
            //根据时间
            formateGroupDataForTime: function(data, dateType,groupByY){
                var chart_dateType = dateType || reportOptions.dateTypes.month;
                //将日期作为横坐标
                var xAxisMap = {};
                var xAxis = [];
                var xIndex = 0;
                var groupMap = {};
                var group = [];
                var gIndex = 0;
                //预处理recordTime
                $.each(data,function(i,v){
                    switch (chart_dateType) {
                        case reportOptions.dateTypes.year:
                            v.recordTime = v.recordTime.substring(0,4);
                            break;
                        case reportOptions.dateTypes.month:
                            v.recordTime = v.recordTime.substring(0,7);
                            break;
                        case reportOptions.dateTypes.week:
                            v.recordTime = moment(v.recordTime.substring(0,10)).isoWeekday(7).format('YYYY-MM-DD');
                            break;
                        case reportOptions.dateTypes.day:
                            v.recordTime = v.recordTime.substring(0,10);
                            break;
                    }
                    xAxisMap[v.recordTime]==null && (xAxis[xIndex]=v.recordTime,xAxisMap[v.recordTime]=xIndex++);
                    groupMap[groupByY?v.yName:v.xName]==null && (group[gIndex]=groupByY?v.yName:v.xName,groupMap[groupByY?v.yName:v.xName]=gIndex++);
                });
                //重新按日期进行排序
                xAxis.sort();
                $.each(xAxis,function(i,v){
                    xAxisMap[v]=i;
                });

                var series = [];
                $.each(group,function(i,v){
                    var serieData = [];
                    $.each(xAxis,function(i1,v1){
                        serieData[i1]=0;
                    });
                    $.each(data,function(i2,v2){
                        if(v!=(groupByY?v2.yName:v2.xName)){
                            return true;
                        }
                        if(serieData[xAxisMap[v2.recordTime]]==null){
                            serieData[xAxisMap[v2.recordTime]]=0;
                        }
                        serieData[xAxisMap[v2.recordTime]] += v2.value;
                    });
                    //展示的横坐标
                    var serie = {
                        name: group[i],
                        data: serieData,
                        type: reportOptions.chartTypes.line,
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        }
                    };
                    series.push(serie);
                });
                return {category: group, xAxis: xAxis, series: series};
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
                CommonLineOption: {//通用的折线图表的基本配置
                    toolbox: {
                        show : true,
                        itemSize : 20,
                        feature: {
                            mySaveAsExcel : {
                                show:true,//是否显示
                                title:'导出到Excel', //鼠标移动上去显示的文字
                                icon:'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0', //图标
                                option:{},
                                onclick:function(chartOption,canvas) {
                                    var bfChart = $(canvas.getDom()).data('bfChart');
                                    var dates;
                                    try{
                                        dates = bfChart.getDateChooseBarValue();
                                    }catch(err){
                                        dates = bfChart.parentChart.getDateChooseBarValue();
                                    }
                                    bfChart.exportData(dates.start,dates.end,bfChart.exportXid,bfChart.exportYid,bfChart.chartOptions.reportKey);
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis'  ,
                        axisPointer : {type:'shadow'}
                    }
                },
                //饼图
                Pie: function (data, name) {//data:数据格式：{name：xxx,value:xxx}...
                    var pie_datas = eChartsHelper.formateNOGroupData(data);
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
                    return $.extend({}, eChartsHelper.ChartOptionTemplates.CommonOption, option);
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
                    var stackline_datas = eChartsHelper.formateGroupDataForStack(data, reportOptions.chartTypes.line, needSum);
                    var option = {
                        legend: {
                            data: stackline_datas.category,
                            selected: eChartsHelper.ChartOptionTemplates.getLegendSelected(stackline_datas,needSum)
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
                    return $.extend({}, eChartsHelper.ChartOptionTemplates.CommonLineOption, option);
                },
                Trend: function (data, name, dateType, groupByY){
                    var trend_dates = eChartsHelper.formateGroupDataForTime(data, dateType, groupByY);
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
                    return $.extend({}, eChartsHelper.ChartOptionTemplates.CommonLineOption, option);
                },
                Bars: function (data, name, needSum,needLengend,isShow,lengendSort) {//data:数据格式：{name：xxx,group:xxx,value:xxx}...
                    var bars_dates = eChartsHelper.formateGroupDataForStack(data, reportOptions.chartTypes.bar, needSum,needLengend,lengendSort);
                    var select = {};
                    if(isShow){

                        //默认显示legends的第一个
                        var legends = bars_dates.category
                        for(var i in legends){
                            var legend = legends[i];
                            if(i == 0){
                                select[legend] = true;
                            }else{
                                select[legend] = false;
                            }

                        }
                    }
                    var option = {
                        legend: {
                            show : isShow,
                            selected :select,
                            data : bars_dates.category,

                        },
                        xAxis: [{
                            //x轴字体大小 ？？？？？？？？？？？？？
                            //nameTextStyle:{fontSize  : 100},
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
                    return $.extend({}, eChartsHelper.ChartOptionTemplates.CommonLineOption, option);
                }
            },

            /**
             * 完成数据的转换
             * @param chartOptions
             * @returns {*}
             */
            getEChartOption : function(chartOptions,needLengend,isShow,lengendSort){
                var option;
                switch (chartOptions.type) {
                    case reportOptions.chartTypes.trend:
                        option = eChartsHelper.ChartOptionTemplates.Trend(chartOptions.data,chartOptions.name,chartOptions.dateType,chartOptions.groupByY);
                        break;
                    case reportOptions.chartTypes.bar:
                        option = eChartsHelper.ChartOptionTemplates.Bars(chartOptions.data,chartOptions.name,chartOptions.needSum,needLengend,isShow,lengendSort);
                        break;
                    case reportOptions.chartTypes.line:
                        option = eChartsHelper.ChartOptionTemplates.Lines(chartOptions.data,chartOptions.name,chartOptions.needSum);
                        break;
                    case reportOptions.chartTypes.pie:
                        option = eChartsHelper.ChartOptionTemplates.Pie(chartOptions.data,chartOptions.name);
                        break;
                    default:
                        option = eChartsHelper.ChartOptionTemplates.Bars(chartOptions.data,chartOptions.name,chartOptions.needSum,needLengend,isShow,lengendSort);
                }
                if(chartOptions.yAxisTwo.length>0){
                    option.yAxis.push({
                        nameTextStyle:{fontSize  : 20},
                        type: 'value',
                        name: '',
                        splitArea: { show: true }
                    });
                    $.each(option.series,function(i,v){
                        $.each(chartOptions.yAxisTwo,function(index,name){
                            v.name==name && (v.yAxisIndex=1,v.type='line',v.label.normal.position='top');
                        });
                    })
                }
                return option;
            }
        }

        return {
            createOption: function (chartOptions,needLengend,isShow,lengendSort) {
                return eChartsHelper.getEChartOption(chartOptions,needLengend,isShow,lengendSort);
               }
        };

    })
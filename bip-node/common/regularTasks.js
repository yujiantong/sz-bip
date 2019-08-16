var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
var utilBsp = require('./utilBsp');
var fs = require('fs');
var logger = require('./logger').logger;

rule.dayOfWeek = [0, new schedule.Range(1, 6)];//建立每周中的哪几天，当前为第天
rule.hour = 3;  //建立小时
rule.minute = 0;    //建立分钟

//定时清除pdf文件
schedule.scheduleJob(rule, function(){
    var fileHeadPath = '';
    var fileHeadPath_exists = fs.existsSync('../public/');
    if(fileHeadPath_exists == true){
        fileHeadPath = '../public/pdf';
    }else{
        fileHeadPath = 'public/pdf';
    }
    utilBsp.deleteFileAll(fileHeadPath);

});

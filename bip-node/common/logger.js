var log4js = require('log4js');

log4js.configure({
  appenders: [
    {//控制台输出
      type: 'console',
      category: "console"
    },{//文件输出
      type: 'file',
      filename: 'logs/access.log',
      maxLogSize: 102400,
      backups:5,
      category: 'dateFileLog'
    }
  ],
  replaceConsole: true,//替换console.log
  levels:{
      dateFileLog: 'debug',
      console: 'debug'
  }
});

var dateFileLog = log4js.getLogger('dateFileLog');
var consoleLog = log4js.getLogger('console');
exports.logger = dateFileLog;
exports.use = function(app) {
  app.use(log4js.connectLogger(dateFileLog, {level:'debug', format:':method :url'}));// trace, debug, info, warn, error, fatal
}



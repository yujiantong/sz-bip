var crypto = require('crypto');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var fileConfig = require('../common/configure').fileConfig;
var uuid = require('uuid');
var logger = require('./logger').logger;

function getRs (success,message,content){
  var rs = {
    success : success || false,
    message : message || '',
    content : content==null? {} : content
  };
  if(!success){
    console.log(message);
  }
  return rs;
};
exports.getRs = getRs;

//获取根据密钥加密后的值，用于向java端提交请求
exports.getJAVAPassKey = function(text){
  var cipher = crypto.createCipher('aes-128-ecb','bsp2014ForMobile');
  var str = cipher.update(text,'utf8','hex') + cipher.final('hex');
  console.log('密文：'+str);
  return str;
}



exports.postToJava = function(server,action,param,next){
  var paramStr = require('querystring').stringify(param);


  var opt = {
    host: server.host,
    port: server.port,
    path: server.path+action, ///本地开发用
    method:'POST',
    headers:{
      "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8',
      "Content-Length": paramStr.length
    }
  }
  ///
  if(action.indexOf('importInventoeyByExcel.action')>-1){
    opt.headers = {
      'Content-Type' : 'multipart/form-data;charset=UTF-8'
    }
  }
    ///
  return new Promise(function(resolve, reject){
    var body = '';
    var req = http.request(opt, function(res) {
      res.setEncoding('utf8');
      res.on('data',function(d){
        body += d;
      }).on('end', function(){
        try{
          resolve( JSON.parse(body));
        }catch(e){
          reject( body);
        }
      });
    }).on('error', function(e) {
      　　reject( getRs(false,e.message+' 服务器连接失败',null));
    })

    req.write(paramStr+"\n");
    req.end();
  });



}
exports.uploadToJava = function(server,req,next){

  var form = new formidable.IncomingForm();
  form.uploadDir="./temp";
  form.parse(req, function(err, fields, files) {
    //接收文件，保存至本地
	if(files.uploadfile==undefined || files.uploadfile == null){
		next.call(null, getRs(false,'上传失败，请重试',null));
    	return;
	}
    var types = files.uploadfile.name.split('.');
    
    var type = String(types[types.length-1]);
    if(type != 'xls'){
    	next.call(null, getRs(false,' 抱歉，目前系统只支持97~2003格式Excel的导入',null));
    	return;
    }
    var date        = new Date();
    var ms          = Date.parse(date);
    var tempFileName = files.uploadfile.name + ms +"."+type;
    var fullFileName = "./temp/"+ tempFileName;
    fs.renameSync(files.uploadfile.path,fullFileName);
    //读取文件
    var stat = fs.statSync(fullFileName);

    //拼装模拟form请求
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';
    // var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: application/octet-stream\r\n" + "Content-Disposition: form-data; name=\"uploadfile\"; filename=\"" + tempFileName + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";

    //头
    var content = "\r\n----" + boundaryKey + "\r\n";
    //参数
    // var content = '\r\nContent-Type: multipart/form-data; boundary='+boundaryKey+'\r\n\r\n';
    // content += "--" + boundaryKey+'\r\n';
    content += 'Content-Disposition: form-data; name="userId"\r\n\r\n'+(req.body&&req.body.authority_userId?req.body.authority_userId:0);
    //文件
    content += "\r\n----" + boundaryKey + "\r\n";
    content += "Content-Type: application/octet-stream\r\n" + "Content-Disposition: form-data; name=\"uploadfile\"; filename=\"" + tempFileName + "\"\r\n";
    content += 'Content-Transfer-Encoding: binary\r\n\r\n';
    // //尾
    // content += "\r\n--" + boundaryKey + "\r\n" ;

    var contentBinary = new Buffer(content, 'utf-8');
    var contentLength = contentBinary.length+stat.size;

    var opt = {
      host: servers[server].host,
      port: servers[server].port,
      path: servers[server].path+req.originalUrl, ///本地开发用
      // path:action, ///发布路径
      method:'POST'
    }

    var body = '';
    var req2 = http.request(opt, function(res) {
      res.setEncoding('utf8');
      res.on('data',function(d){
          body += d;
      }).on('end', function(){
        try{
          next.call(null, JSON.parse(body));
        }catch(e){
          next.call(null, body);
        }
      });
    }).on('error', function(e) {
      next.call(null, getRs(false,e.message+' 服务器连接失败',null));
    })

    req2.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req2.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));
    req2.write(contentBinary);
    //创建文件流
    var fileStream = fs.createReadStream(fullFileName, {bufferSize : 4 * 1024});
    fileStream.pipe(req2, {end: false});
    fileStream.on('end', function() {
      req2.end(enddata);
      //传输完成后删除文件
      fs.unlinkSync(fullFileName);
    });
  });
}

var DateTool = {
  getDayStartAndEnd : function(date){
    var start = new Date();
    var end = new Date();
    start.setTime(date.getTime());
    end.setTime(date.getTime());
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    return {start:start,end:end}
  },
  /**
   * 时间格式化 返回格式化的时间
   * @param date {object}  可选参数，要格式化的data对象，没有则为当前时间
   * @param fomat {string} 格式化字符串，例如：'YYYY年MM月DD日 hh时mm分ss秒 星期' 'YYYY/MM/DD week' (中文为星期，英文为week)
   * @return {string} 返回格式化的字符串
   * 
   * 例子:
   * formatDate(new Date("january 01,2012"));
   * formatDate(new Date());
   * formatDate('YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY-MM-DD week');
   * formatDate(new Date("january 01,2012"),'YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY/MM/DD week');
   * 
   * 格式：
   * YYYY：4位年,如1993
   * YY：2位年,如93
   * MM：月份
   * DD：日期
   * hh：小时
   * mm：分钟
   * ss：秒钟
   * 星期：星期，返回如 星期二
   * 周：返回如 周二
   * week：英文星期全称，返回如 Saturday
   * www：三位英文星期，返回如 Sat
   */
  formatDate : function(date, format) {
    if (arguments.length < 2 && !date.getTime) {
      format = date;
      date = new Date();
    }
    typeof format != 'string' && (format = 'YYYY-MM-DD hh:mm:ss');
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
    return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function(a) {
      switch (a) {
        case "YYYY": return date.getFullYear();
        case "YY": return (date.getFullYear()+"").slice(2);
        case "MM": return date.getMonth()<9?'0'+(date.getMonth()+1):date.getMonth()+1;
        case "DD": return date.getDate()<10?'0'+date.getDate():date.getDate();
        case "hh": return date.getHours()<10?'0'+date.getHours():date.getHours();
        case "mm": return date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        case "ss": return date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        case "星期": return "星期" + week[date.getDay() + 7];
        case "周": return "周" +  week[date.getDay() + 7];
        case "week": return week[date.getDay()];
        case "www": return week[date.getDay()].slice(0,3);
      }
    });
  }
}
exports.DateTool = DateTool;


function urlencode (str) {  
    str = (str + '').toString();   

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
    replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
}
exports.urlencode = urlencode;

var stringTool = {
  checkInArray : function (it, its) {
    for (var i in its) {
      if (its[i] == it) {
        return 1;
      }
    }
    return 0;
  }
}
exports.stringTool = stringTool;

/**
 * @author DHY  获取当前n天的日期
 */
function DayOfZero(n) {
  var da = new Date(new Date().getTime() - n * 24 * 60 * 60 * 1000);
  var year = da.getFullYear();
  var month = da.getMonth() + 1;
  var day = da.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var dayOfZero = year + '-' + month + '-' + day + ' 00:00:00';
  return dayOfZero;
}
exports.DayOfZero = DayOfZero;


/**
 * @author DHY  比较日期大小
 */
function compareDate(beginTime, endTime) {
  //var beginTime = "2009-09-21 00:00:00";
  //var endTime = "2009-09-21 00:00:01";
  var beginTimes = beginTime.substring(0, 10).split('-');
  var endTimes = endTime.substring(0, 10).split('-');
  beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' '
      + beginTime.substring(10, 19);
  endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' '
      + endTime.substring(10, 19);
  var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
  if (a < 0) {
    //alert("endTime小!");
    return false;
  } else if (a > 0) {
    //alert("endTime大!");
    return true;
  } else if (a == 0) {
    //alert("时间相等!");
    return true;
  }
}
exports.compareDate = compareDate;

exports.copyFile = function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
        var dir = fileConfig.fileTarget;
        var rd = fs.createReadStream(source);
        rd.on('error', function(err){
            if(err){
                logger.debug(err);
                reject(err);
            }
        });
        var wr = fs.createWriteStream(dir + target);
        wr.on('error', function(err){
            if(err){
                logger.debug(err);
                reject(err);
            }
        });
        wr.on('close', function(){
            var uniqueName = uuid.v1();
            fs.renameSync(dir + target, dir + "ok_"+ uniqueName + "_" + target );
            fs.unlinkSync(source);
            resolve({uniqueName:uniqueName, originalName:target})
        });
        rd.pipe(wr);
    });
}

exports.deleteFile = function deleteFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.unlink(filePath, function(err){
      if(err){
        logger.debug(err);
        reject(err);
      }else{
        resolve({status:"OK"});
      }
    });
  });
}

exports.deleteFileAll = function deleteFile(filePath) {
  return new Promise(function(resolve, reject) {
    var folder_exists = fs.existsSync(filePath);
    if(folder_exists == true)
      {
        var dirList = fs.readdirSync(filePath);
        dirList.forEach(function(fileName)
          {
            var filePathName = filePath+"/" + fileName;
            fs.unlinkSync(filePathName,function(err){
              if(err){
                logger.debug(err);
                logger.debug(new Date()+"清除文件执行失败");
                reject(err);
              }else{
                resolve({status:"OK"});
              }
            });
          });
       }
  });
}
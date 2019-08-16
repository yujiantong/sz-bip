var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var insuranceRoutes = require('./routes/insuranceIndex');
var settingRoutes = require('./routes/settingIndex');
var commonRoutes = require('./routes/commonIndex');
var customerRouts = require('./routes/customerIndex');
var userRouts = require('./routes/userIndex');
var adminRouts = require('./routes/adminIndex');
var importRouts = require('./routes/import');
var performanceRouts = require('./routes/performanceIndex');
var statisticRouts = require('./routes/statisticIndex');
var sysnRouts = require('./routes/sysnIndex');
var reportRouts = require('./routes/reportIndex');
var suggestRouts = require('./routes/suggestIndex');
var mobileIndexRouts = require('./routes/mobileIndex');
var biHuRouts = require('./routes/biHuIndex');
var updatePasswordRecordIndexRouts = require('./routes/updatePasswordRecordIndex');
var sendMessageIndexRouts = require('./routes/sendMessageIndex');
var web = require('./common/configure').webConfigure;
var regularTasks = require('./common/regularTasks');//定时任务
var userService = require("./service/userService");
var maintenanceRouts = require('./routes/maintenanceIndex');
var smsTemplateRouts = require('./routes/smsTemplateIndex');
var giftRouts = require('./routes/giftIndex');
var venderRouts = require('./routes/venderIndex');
var blocRouts = require('./routes/blocIndex');
var unitRouts = require('./routes/unitIndex');
var reasonRouts = require('./routes/reasonIndex');
var jpushRouts = require('./routes/jpushIndex');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',function (req,res,next){
    if(req.path.indexOf('/logout')>=0){
        next();
    }else if(req.path.indexOf('/index')>=0){
        next();
    }else if(req.path.indexOf('/login')>=0){
        next();
    }else if(req.path.indexOf('/bspLogin')>=0){
        next();
    }else if(req.path.indexOf('/sysn/findBipWork')>=0){
        next();
    }else if(req.path.indexOf('/marketing')>=0){
        next();
    }else{
        var crlmryapp='';
        if(req.method=='POST'){
            console.log(req.method);
            crlmryapp = req.body.crlmryapp;
        }else if(req.method=='GET'){
            crlmryapp = req.query.crlmryapp;
        }
        res.cookie('bip_login_time', new Date().getTime());
        if(req.cookies.bip_user){
            var user = JSON.parse(req.cookies.bip_user);
            userService.findUserById(user.userId).then(function(result){
                if(result.status == 'OK'){
                    var loginUuId = req.cookies.bip_login_uuid;
                    var loginAppUuId = req.cookies.bip_login_appUuid;
                    var userInfo = result.results.content.result;
                    if(userInfo.role.roleId==2){
                        if(crlmryapp=='app'){
                            if(userInfo.loginAppUuId == null || userInfo.loginAppUuId == ''){
                                next();
                            }else if(userInfo.loginAppUuId != loginAppUuId){
                                res.json({status:'out-of-date'});
                            }else{
                                next();
                            }
                        }else{
                            if(userInfo.loginUuId == null || userInfo.loginUuId == ''){
                                next();
                            }else if(userInfo.loginUuId != loginUuId){
                                res.json({status:'out-of-date'});
                            }else{
                                next();
                            }
                        }
                    }else{
                        if(userInfo.loginUuId == null || userInfo.loginUuId == ''){
                            next();
                        }else if(userInfo.loginUuId != loginUuId){
                            res.json({status:'out-of-date'});
                        }else{
                            next();
                        }
                    }
                }else{
                    next();
                }
            })
        }

    }
});

app.use('/', routes);
app.use('/insurance', insuranceRoutes);
app.use('/setting', settingRoutes);
app.use('/common', commonRoutes);
app.use('/customer', customerRouts);
app.use('/user', userRouts);
app.use('/admin', adminRouts);
app.use('/import', importRouts);
app.use('/performance', performanceRouts);
app.use('/statistic', statisticRouts);
app.use('/bihu',biHuRouts);
app.use('/sysn',sysnRouts);
app.use('/report',reportRouts);
app.use('/suggest',suggestRouts);
app.use('/mobile',mobileIndexRouts);
app.use('/updatePasswordRecord',updatePasswordRecordIndexRouts);
app.use('/message',sendMessageIndexRouts);
app.use('/maintenance',maintenanceRouts);
app.use('/smsTemplate',smsTemplateRouts);
app.use('/gift',giftRouts);
app.use('/vender',venderRouts);
app.use('/bloc',blocRouts);
app.use('/unit',unitRouts);
app.use('/reason',reasonRouts);
app.use('/jpush',jpushRouts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    if (req.url.indexOf("/favicon.ico")>-1) return;
  var err = new Error('Not    Found');
  err.status = 404;

  next( {status:web.fault,message:404});
});

// error handlers

// development error handler
// will print stacktrace


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var onlineUsers = {};

io.on("connection" , function(socket){

    socket.on("login" , function(obj){
        var socketName;
        if(obj.roleId == 2){
            socketName = obj.storeId+'_'+obj.userId;
        }else if(obj.roleId == 20){
            socketName = obj.storeId+'_0';
        }

        socket.name = socketName;
        //if(!onlineUsers.hasOwnProperty(obj.storeId)){
            delete onlineUsers[socket.name];
            onlineUsers[socketName] = {'socket':socket};
        //}
        //console.log(onlineUsers);

    });

    socket.on("disconnect" , function(){
        //console.log('连接关闭');
        if(onlineUsers.hasOwnProperty(socket.name)){
            delete onlineUsers[socket.name];
        }
        //console.log(onlineUsers);
    });

});

module.exports.server = server;

exports.onlineUsers = onlineUsers;

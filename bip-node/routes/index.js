var express = require('express');
var router = express.Router();
var userService = require("../service/userService");
var smsTemplateService = require("../service/smsTemplateService");
var settingService = require("../service/settingService");
var utilBsp = require('../common/utilBsp');
var uuid = require('uuid');
var logger = require('../common/logger').logger;
var host = require('../common/configure').hostConfig;

function getStringDate(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    if(month < 10){
        month = '0' + month;
    }
    if(day < 10){
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

router.get('/index', function(req, res, next) {
    if(req.host.indexOf(  host.bipHost ) > -1){
        res.render( 'login',{title: '博福续保管理系统'});
    }else{
        res.render( 'chipLogin',{title: '传慧嘉和管理系统'});
    }

});
router.get('/marketing', function(req, res, next) {
    var customerId = req.query.customerId;
    var param = {customerId:customerId};
    smsTemplateService.showModule(param).then(function (result) {
            var smscon = result.results.content.results;
            var details =  smscon.details;
            var storeName = smscon.store.storeName;
            if(req.host == host.bipHost){
                res.render( 'marketing',{title: '博福续保管理系统',details:details,storeName:storeName,customerId:customerId});
            }else{
                res.render( 'chipMarketing',{title: '传慧嘉和管理系统',details:details,storeName:storeName,customerId:customerId});
            }
        })
        .catch(function (err) {
            res.json(err);
        })

});
router.post('/marketing/updateCustomer', function(req, res, next) {
    var param = {customerId:req.body.customerId};
    smsTemplateService.updateCustomer(param).then(function (result) {
            res.json(utilBsp.getRs(true,result.results.message,null));
        })
        .catch(function (err) {
            res.json(err);
        })

});
router.post('/login', function(req, res, next) {
    //console.log(req.cookies);
    var loginName = req.body.loginName;
    var password = req.body.password;
    var nowDate = req.body.nowDate;
    var crlmryapp = req.body.crlmryapp;
    if(new Date().toISOString().substr(0,10) != new Date(nowDate).toISOString().substr(0,10)){
        res.json(utilBsp.getRs(false,'本地时间跟服务器时间不一致',null));
    }else{
        userService.selectByLoginName({loginName:loginName}).then(function(result){
            if(result.status == 'OK'){//验证用户名是否存在
                userService.selectUserInfo({loginName:loginName,password:password}).then(function(result1){
                    if(result1.status == 'OK'){//验证用户名与密码是否匹配
                        var user = result1.results.content.result;
                        var csModuleFlag = user.store.csModuleFlag;
                        var asmModuleFlag = user.store.asmModuleFlag;
                        var saleFlag = user.store.saleFlag;
                        var afterSaleFlag = user.store.afterSaleFlag;
                        if(user.store.storeId != 1 && user.store.storeId != 0 && (csModuleFlag == null || csModuleFlag == 0)){
                            if(user.role.roleId == 4 || user.role.roleId == 5){
                                res.json(utilBsp.getRs(false,'客服模块被禁用,不允许登录',null));
                            }
                        }
                        if(user.store.storeId != 1 && user.store.storeId != 0 && (asmModuleFlag == null || asmModuleFlag == 0)){
                            if(user.role.roleId == 1){
                                res.json(utilBsp.getRs(false,'出单员模块被禁用,不允许登录',null));
                            }
                        }
                        if(user.store.storeId != 1 && user.store.storeId != 0 && (saleFlag == null || saleFlag == 0)){
                            if(user.role.roleId == 6){
                                res.json(utilBsp.getRs(false,'销售顾问模块被禁用,不允许登录',null));
                            }
                        }
                        if(user.store.storeId != 1 && user.store.storeId != 0 && (afterSaleFlag == null || afterSaleFlag == 0)){
                            if(user.role.roleId == 8){
                                res.json(utilBsp.getRs(false,'服务顾问模块被禁用,不允许登录',null));
                            }
                        }

                        //店有效期结束日期
                        var validDate = user.store.vaildDate;
                        //店有效期开始日期
                        var vaildDateStart = user.store.vaildDateStart;
                        //集团有效期开始日期
                        var jtYxqStart = user.jtYxqStart;
                        //集团有效期结束日期
                        var jtYxqEnd = user.jtYxqEnd;
                        //验证用户所在店是否过期
                        if(user.store.storeId !=1
                            && (validDate != null && getStringDate(new Date()) > getStringDate(new Date(validDate)))
                            || (vaildDateStart != null && getStringDate(new Date()) < getStringDate(new Date(vaildDateStart)))){
                            res.json(utilBsp.getRs(false,'用户所在店不在有效期内',null));
                        }
                        //验证用户所在集团是否过期
                        if((jtYxqEnd != null && getStringDate(new Date()) > getStringDate(new Date(jtYxqEnd)))
                            || (jtYxqStart != null && getStringDate(new Date()) < getStringDate(new Date(jtYxqStart)))){
                            res.json(utilBsp.getRs(false,'用户所在集团不在有效期内',null));
                        }
                        //user.store.vaildDate = null;

                        var loginUuId = '';
                        var loginAppUuId = '';
                        if(crlmryapp!=null&&crlmryapp=='app'&&user.role.roleId==2){
                            loginAppUuId = uuid.v1();
                        }else{
                            loginUuId = uuid.v1();
                        }
                        //console.log(loginUuId);
                        userService.updateUserUuId(user.userId,loginUuId,loginAppUuId).then(function(result){
                            var roleId = user.role.roleId;
                            if(roleId == 16 || roleId == 23 || roleId == 41 || roleId == 42 || roleId == 43 || roleId == 44 || roleId == 45 || roleId == 46
                                || roleId == 47 || roleId == 48 || roleId == 49 || roleId == 50 || roleId == 51 || roleId == 52 || roleId == 53
                                || roleId == 54 || roleId == 55 || roleId == 56 || roleId == 57 || roleId == 58 || roleId == 59){
                                user.store.storeId = 1;
                                user.store.storeName = '请选择4S店';
                            }
                            if(user.status == 2){
                                res.json(utilBsp.getRs(false,'此用户已被禁用',null));
                            }
                            //到期提醒标志,一登陆就需要提醒,如果满足提醒的条件
                            user.needTx = 1;
                            if(user.role.roleName=='总经理助理'){
                                user.role.roleName = '总经理';
                            }
                            res.cookie('bip_user', JSON.stringify(user));
                            res.cookie('bip_login_uuid', loginUuId);
                            res.cookie('bip_login_appUuid', loginAppUuId);
                            res.cookie('bip_login_time', new Date().getTime());
                            console.log("-----------------------------------");
                            console.log(req.cookies.bip_login_time);
                            //console.log(req.cookies.bip_user);
                            /*if(typeof req.cookies.bip_user == 'undefined'){
                             res.cookie('bip_user', JSON.stringify(user));
                             }*/
                            res.json(utilBsp.getRs(true,null,{result:user}));
                        }).catch(function(err){
                            logger.error(err);
                        });
                    }else{
                        res.json(utilBsp.getRs(false,'用户密码错误',null));
                    }
                })
                .catch(function(err){
                    logger.error(err);
                });
            }else{
                res.json(utilBsp.getRs(false,'用户名不存在',null));
            }
        });
    }
});

//bsp用户当点登录登录接口
router.get('/bspLogin', function(req, res,next) {
    /*var bspEncryptLoginInfo = "C114375A48BAE36893895CABB8FD9DD8C07B6E749BAD4060215237E85E659F7B94550E5" +
        "7D75D56F9523EAE84CA417055ACA0365748038E4A3600C455E63426C8";*/
    var url = "http://"+req.headers.host;
    var bspEncryptLoginInfo = req.query.bspEncryptLoginInfo||"";
    if(bspEncryptLoginInfo==""){
        res.json(utilBsp.getRs(false,"链接无效",null));
        return;
    }

        userService.loginFromBsp(bspEncryptLoginInfo).then(function(result1){
                if(result1.status == 'OK'){//验证用户名与密码是否匹配
                    var user = result1.results.content.result;
                    //店有效期结束日期
                    var validDate = user.store.vaildDate;
                    //店有效期开始日期
                    var vaildDateStart = user.store.vaildDateStart;
                    //验证用户所在店是否过期
                    if(user.store.storeId !=1
                        && (validDate != null && getStringDate(new Date()) > getStringDate(new Date(validDate)))
                        || (vaildDateStart != null && getStringDate(new Date()) < getStringDate(new Date(vaildDateStart)))){
                        res.json(utilBsp.getRs(false,'用户所在店不在有效期内',null));
                    }
                    
                    //user.store.vaildDate = null;

                    var loginUuId = uuid.v1();
                    //console.log(loginUuId);
                    userService.updateUserUuId(user.userId,loginUuId).then(function(result){
                        if(user.role.roleId==16||user.role.roleId==23){
                            user.store.storeId = 1;
                            user.store.storeName = '请选择4S店';
                        }
                        if(user.status == 2){
                            res.json(utilBsp.getRs(false,'此用户已被禁用',null));
                        }
                        //到期提醒标志,一登陆就需要提醒,如果满足提醒的条件
                        user.needTx = 1;
                        if(user.role.roleName=='总经理助理'){
                            user.role.roleName = '总经理';
                        }
                        //console.log(req.cookies.bip_user);
                        res.cookie('bip_user', JSON.stringify(user));
                        res.cookie('bip_login_uuid', loginUuId);
                        res.cookie('bip_login_time', new Date().getTime());
                        console.log("-----------------------------------");
                        console.log(req.cookies.bip_login_time);
                        //console.log(req.cookies.bip_user);
                        /*if(typeof req.cookies.bip_user == 'undefined'){
                         res.cookie('bip_user', JSON.stringify(user));
                         }*/
                        if(user.role.roleName == '销售顾问'){
                            res.redirect(url+"/#/salesConsultant")
                            //res.json(utilBsp.getRs(true,'验证成功',{role:'销售顾问',href:'http://bip.bofide.cn/#/salesConsultant'}));
                        }else if(user.role.roleName == '销售经理'){
                            res.redirect(url+"/#/salesManager")
                            //res.json(utilBsp.getRs(true,'验证成功',{role:'销售经理',href:'http://bip.bofide.cn/#/salesManager'}));
                        }
                    }).catch(function(err){
                        logger.error(err);
                    });
                }else{
                    //res.redirect("http://localhost:3000/logout")
                    //res.render( 'logout',{status: '博福易商-汽车保险潜客成交促进系统'});
                    res.json(utilBsp.getRs(false,result1.results.message,null));
                }
            })
            .catch(function(err){
                logger.error(err);
            });
   /* }*/
});

router.post('/logout', function (req, res, next) {
    res.clearCookie('bip_user');
    res.json({status:'noLogin'});
});
//数据分析员--换店查询
router.post('/changeStoreCookies', function (req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var store = JSON.parse(req.body.store);
    user.store.storeId = store.storeId;
    user.store.storeName = store.storeName;
    user.store.shortStoreName = store.shortStoreName;
    user.store.bhDock = store.bhDock;
    settingService.findModuleSet(store.storeId)
        .then(function(result){
            console.log(result.results.content.result);
            var moduleSets = result.results.content.result;
            for(var i=0;i<moduleSets.length;i++){
                var moduleSet = moduleSets[i];
                if(moduleSet.moduleName == 'accountModule'){
                    user.accountModule = moduleSet.switchOn;
                }
            }
            res.cookie('bip_user', JSON.stringify(user));
            res.json({status:"OK",content:user});
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;

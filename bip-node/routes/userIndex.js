/**
 * Created by huliangqing on 2016/6/13.
 */
var express = require('express');
var router = express.Router();
var userService = require("../service/userService");


//查询负责人列表，去除当前负责人
router.post('/findAllSubordinate', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user)
    //登录的用户的id
    var userId = user.userId;
    //4s店id
    var storeId = user.store.storeId;
    //需要被更换掉的负责人id,这里可以是续保专员也可以是销售顾问或者服务顾问
    var principalId = req.body.principalId;

    var obj = {userId: userId,principalId:principalId,storeId:storeId};
    userService.findAllSubordinate(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询负责人列表
router.post('/findSubordinate', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user)
    //登录的用户的id
    var userId = user.userId;
    //4s店id
    var storeId = user.store.storeId;

    var obj = {userId: userId,storeId:storeId};
    userService.findSubordinate(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增用户
router.post('/addUser', function(req, res, next) {
    var userInfo = req.body.userInfo;
    userService.addUser(userInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//更新密码
router.post('/updatePassword', function(req, res, next) {
    var id = req.body.id;
    var password = req.body.password;
    var oldPassword = req.body.oldPassword;
    userService.updatePassword(id, password, oldPassword)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//重置密码
router.post('/resetPassword', function(req, res, next) {
    var id = req.body.id;
    userService.resetPassword(id)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除用户
router.post('/deleteUser', function(req, res, next) {
    var id = req.body.id;
    var roleId = req.body.roleId;
    var user = JSON.parse(req.cookies.bip_user)
    //4s店id
    var storeId = user.store.storeId;
    userService.deleteUser(id,roleId,storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询用户
router.post('/findUser', function(req, res, next) {
    var storeId = req.body.storeId;
    userService.findUser(storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询系统用户  --查询数据分析师
router.post('/findUser_xtyh', function(req, res, next) {
    var storeId = req.body.storeId;
    userService.findUser_xtyh(storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询角色
router.post('/findRole', function(req, res, next) {
    userService.findRole()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询系统角色
router.post('/findRole_xtyh', function(req, res, next) {
    userService.findRole_xtyh()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//更改用户状态：0正常1暂停2禁用
router.post('/updateUserStatus', function(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    var roleId = req.body.roleId;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    //4s店id
    var storeId = user.store.storeId;

    userService.updateUserStatus(id,status,storeId,roleId,userId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询各种用户
router.post('/findKindsUser', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    userService.findKindsUser(storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增用户
router.post('/updateUser', function(req, res, next) {
    var jtId = JSON.parse(req.cookies.bip_user).jtId;
    var userInfo = req.body.userInfo;
    userService.updateUser(userInfo,jtId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据用户id查询用户
router.post('/findUserById', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user)
    userService.findUserById(user.userId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据4s店id和角色id查询用户, 作为持有人下拉框查询条件数据源
router.post('/selectUserForHolderSearch', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    var roleId = req.body.roleId;

    var param = {storeId:storeId,roleId:roleId};
    userService.selectUserForHolderSearch(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//根据用户名重置密码
router.post('/dglyResetPassword', function(req, res, next) {
    var loginName = req.body.loginName;
    userService.dglyResetPassword(loginName)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询系统用户  --行政建店
router.post('/findUser_xzjd', function(req, res, next) {
    userService.findUser_xzjd()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询角色--行政建店
router.post('/findRole_xzjd', function(req, res, next) {
    userService.findRole_xzjd()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询角色--集团管理员
router.post('/findRoleByBloc', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var jtId = user.jtId;
    var condition = req.body.condition;

    var param = {condition:condition,jtId:jtId};
    userService.findRoleByBloc(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//集团管理员能查到的用户
router.post('/findUser_jtgl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var jtId = user.jtId;
    var condition = req.body.condition;

    var param = {condition:condition,jtId:jtId};
    userService.findUser_jtgl(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//建档人下拉框的数据源
router.post('/selectUserForJdrDataSource', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;


    var param = {storeId:storeId};
    userService.selectUserForJdrDataSource(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询区域分析师和店的关系-行政建店
router.post('/findUser_xzjd_store', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var roleId = user.role.roleId;

    var param = {roleId:roleId};
    userService.findUser_xzjd_store(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据区域分析师的ID查询绑定的店
router.post('/findStoreByUser', function(req, res, next) {
    var dataAnalystId = req.body.dataAnalystId;

    var param = {dataAnalystId:dataAnalystId};
    userService.findStoreByUser(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改区域分析和店之间的关联
router.post('/updateUserAndStore', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};
    userService.updateUserAndStore(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});


module.exports = router;

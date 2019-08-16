var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

function  findAllSubordinate(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findAllSubordinate", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

function  findSubordinate(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findSubordinate", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//新增用户
function  addUser(userInfo){
    var param = {"_method":"INSERT" ,userInfo:userInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/addUser", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//更新密码
function  updatePassword(id, password, oldPassword){
    var param = {"_method":"UPDATE" ,id:id ,password:password,oldPassword:oldPassword};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/updatePassword", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//重置密码
function  resetPassword(id){
    var param = {"_method":"UPDATE" ,id:id};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/resetPassword", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除用户
function  deleteUser(id,roleId,storeId){
    var param = {"_method":"UPDATE" ,id:id, roleId:roleId,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/deleteUser", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询用户
function  findUser(storeId){
    var param = {"_method":"SEARCH" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUser", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询用户系统用户
function  findUser_xtyh(storeId){
    var param = {"_method":"SEARCH" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUser_xtyh", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询角色
function  findRole(){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findRole")
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询系统用户角色
function  findRole_xtyh(){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findRole_xtyh")
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


//根据登录名和密码查询用户信息
function  selectUserInfo(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/selectUserInfo",obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据登录名查询,验证登录名是否存在
function  selectByLoginName(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/selectByLoginName",obj)
            .then(function (result) {
                if(result.content.result >0){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//更改用户状态：0正常1暂停2禁用
function  updateUserStatus(id,status,storeId,roleId,userId){
    var param = {"_method":"UPDATE" ,id:id ,status:status,storeId:storeId,roleId:roleId,userId:userId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/updateUserStatus", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询各种用户
function  findKindsUser(storeId){
    var param = {"_method":"SEARCH" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findKindsUser",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//更新用户
function  updateUser(userInfo,jtId){
    var param = {"_method":"INSERT" ,userInfo:userInfo,jtId:jtId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/updateUser", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//更新用户,设置登录uuid
function  updateUserUuId(userId,loginUuId,loginAppUuId){
    var param = {userId:userId ,loginUuId:loginUuId,loginAppUuId:loginAppUuId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/updateUserUuId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据用户id查询用户
function  findUserById(userId){
    var param = {userId:userId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUserById", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


function  loginFromBsp(bspEncryptLoginInfo){
    var param = {bspEncryptLoginInfo:bspEncryptLoginInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/sysn/loginFromBsp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


function  selectUserForHolderSearch(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/selectUserForHolderSearch", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}
//根据用户名重置密码
function  dglyResetPassword(loginName){
    var param = {"_method":"UPDATE" ,loginName:loginName};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/dglyResetPassword", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询用户系统用户-行政建店
function  findUser_xzjd(){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUser_xzjd")
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询角色--行政建店
function  findRole_xzjd(){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findRole_xzjd")
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询角色--集团管理员
function  findRoleByBloc(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findRoleByBloc",param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//集团管理员能查到的用户
function  findUser_jtgl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUser_jtgl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//建档人下拉框的数据源
function selectUserForJdrDataSource(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/selectUserForJdrDataSource", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询区域分析师和店的关系-行政建店
function findUser_xzjd_store(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findUser_xzjd_store", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据区域分析师的ID查询绑定的店
function findStoreByUser(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/findStoreByUser", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//修改区域分析和店之间的关联
function updateUserAndStore(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/user/updateUserAndStore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}



exports.findAllSubordinate  = findAllSubordinate;
exports.findSubordinate = findSubordinate;
exports.addUser  = addUser;
exports.updatePassword  = updatePassword;
exports.deleteUser  = deleteUser;
exports.findUser  = findUser;
exports.findUser_xtyh = findUser_xtyh;
exports.findRole  = findRole;
exports.findRole_xtyh = findRole_xtyh;
exports.resetPassword  = resetPassword;
exports.selectUserInfo  = selectUserInfo;
exports.selectByLoginName  = selectByLoginName;
exports.updateUserStatus  = updateUserStatus;
exports.findKindsUser  = findKindsUser;
exports.updateUser  = updateUser;
exports.updateUserUuId = updateUserUuId;
exports.findUserById = findUserById;
exports.loginFromBsp = loginFromBsp;
exports.selectUserForHolderSearch = selectUserForHolderSearch;
exports.dglyResetPassword = dglyResetPassword;
exports.findUser_xzjd = findUser_xzjd;
exports.findRole_xzjd = findRole_xzjd;
exports.findRoleByBloc = findRoleByBloc;
exports.findUser_jtgl = findUser_jtgl;
exports.selectUserForJdrDataSource = selectUserForJdrDataSource;
exports.findUser_xzjd_store = findUser_xzjd_store;
exports.findStoreByUser = findStoreByUser;
exports.updateUserAndStore = updateUserAndStore;

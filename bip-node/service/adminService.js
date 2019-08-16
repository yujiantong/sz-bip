/**
 * Created by Bao on 2016/6/20.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增险种
function  addInsuranceType(typeInfo){
    var param = {"_method":"INSERT" ,typeInfo:typeInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/addInsuranceType", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除险种
function  deleteInsuranceType(typeId){
    var param = {"_method":"DELETE" ,typeId:typeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/deleteInsuranceType", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询险种
function  findInsuranceType(){
    var param = {"_method":"SELECT"};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findInsuranceType", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//新增保险公司
function  addInsuranceComp(companyInfo){
    var param = {"_method":"INSERT" ,companyInfo:companyInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/addInsuranceComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除保险公司
function  deleteInsuranceComp(insuranceCompId){
    var param = {"_method":"DELETE" ,insuranceCompId:insuranceCompId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/deleteInsuranceComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询保险公司
function  findInsuranceComp(){
    var param = {"_method":"SELECT"};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findInsuranceComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//修改保险公司(险种)
function  updateInsuranceComp(companyInfo){
    var param = {"_method":"INSERT" ,companyInfo:companyInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/updateInsuranceComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//新增4S店
function  addStore(storeInfo){
    var param = {"_method":"INSERT" ,storeInfo:storeInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/addStore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除4S店
function  deleteStore(storeId){
    var param = {"_method":"DELETE" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/deleteStore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询4S店
function  findStore(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findStore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//修改4S店
function  updateStore(storeInfo){
    var param = {"_method":"INSERT" ,storeInfo:storeInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/updateStore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//新增汽车品牌
function  addCarBrand(carBrandInfo){
    var param = {"_method":"INSERT" ,carBrandInfo:carBrandInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/addCarBrand", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//修改4S店
function  updateCarBrand(carBrandInfo){
    var param = {"_method":"INSERT" ,carBrandInfo:carBrandInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/updateCarBrand", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除汽车品牌
function  deleteCarBrand(brandId){
    var param = {"_method":"DELETE" ,brandId:brandId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/deleteCarBrand", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询汽车品牌
function  findCarBrand(condition){
    var param = {"_method":"SELECT",condition:condition};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findCarBrand", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//新增汽车型号
function  addCarModel(carModelInfo){
    var param = {"_method":"INSERT" ,carModelInfo:carModelInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/addCarModel", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//删除汽车型号
function  deleteCarModel(modelId){
    var param = {"_method":"DELETE" ,modelId:modelId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/deleteCarModel", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询汽车型号
function  findCarModel(brandId){
    var param = {"_method":"SELECT" ,brandId:brandId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findCarModel", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据4S店id查询汽车信息
function  findCarInfoByStoreId(storeId){
    var param = {"_method":"SELECT" ,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findCarInfoByStoreId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

function formatStoreById(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/formatStoreById", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按品牌名称首字母大小排序查询所有品牌
function  findCarBrandByOrder(condition){
    var param = {"_method":"SELECT",condition:condition};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findCarBrandByOrder", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按条件校验4s店的信息是否存在, true表示存在, false表示不存在
function findExistStoreByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findExistStoreByCondition", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据险种ID查询险种
function findInsuByTypeId(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/findInsuByTypeId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//修改险种
function updateInsu(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/updateInsu", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//营销短信充值
function  messageRecharge(storeInfo){
    var param = {"_method":"INSERT" ,storeInfo:storeInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/admin/messageRecharge", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

exports.addInsuranceType  = addInsuranceType;
exports.deleteInsuranceType  = deleteInsuranceType;
exports.findInsuranceType  = findInsuranceType;
exports.addInsuranceComp  = addInsuranceComp;
exports.deleteInsuranceComp  = deleteInsuranceComp;
exports.findInsuranceComp  = findInsuranceComp;
exports.updateInsuranceComp  = updateInsuranceComp;
exports.addStore  = addStore;
exports.deleteStore  = deleteStore;
exports.findStore  = findStore;
exports.updateStore  = updateStore;
exports.addCarBrand  = addCarBrand;
exports.deleteCarBrand  = deleteCarBrand;
exports.updateCarBrand  = updateCarBrand;
exports.findCarBrand  = findCarBrand;
exports.addCarModel  = addCarModel;
exports.deleteCarModel  = deleteCarModel;
exports.findCarModel  = findCarModel;
exports.findCarInfoByStoreId  = findCarInfoByStoreId;
exports.formatStoreById = formatStoreById;
exports.findCarBrandByOrder = findCarBrandByOrder;
exports.findExistStoreByCondition = findExistStoreByCondition;
exports.findInsuByTypeId = findInsuByTypeId;
exports.updateInsu = updateInsu;
exports.messageRecharge = messageRecharge;
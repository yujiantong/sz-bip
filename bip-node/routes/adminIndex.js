/**
 * Created by Bao on 2016/6/20.
 */
var express = require('express');
var router = express.Router();
var adminService = require("../service/adminService");

//新增险种
router.post('/addInsuranceType', function(req, res, next) {
    var typeInfo = req.body.typeInfo;
    adminService.addInsuranceType(typeInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除险种
router.post('/deleteInsuranceType', function(req, res, next) {
    var typeId = req.body.typeId;
    adminService.deleteInsuranceType(typeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询险种
router.post('/findInsuranceType', function(req, res, next) {
    adminService.findInsuranceType()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增保险公司
router.post('/addInsuranceComp', function(req, res, next) {
    var companyInfo = req.body.companyInfo;
    adminService.addInsuranceComp(companyInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除保险公司
router.post('/deleteInsuranceComp', function(req, res, next) {
    var insuranceCompId = req.body.insuranceCompId;
    adminService.deleteInsuranceComp(insuranceCompId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改保险公司(险种)
router.post('/updateInsuranceComp', function(req, res, next) {
    var companyInfo = req.body.companyInfo;
    adminService.updateInsuranceComp(companyInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询保险公司
router.post('/findInsuranceComp', function(req, res, next) {
    adminService.findInsuranceComp()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增4S店
router.post('/addStore', function(req, res, next) {
    var storeInfo = req.body.storeInfo;
    adminService.addStore(storeInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除4S店
router.post('/deleteStore', function(req, res, next) {
    var storeId = req.body.storeId;
    adminService.deleteStore(storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询4S店
router.post('/findStore', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var jtId = user.jtId;
    var unitId = user.unitId;
    var userId = user.userId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;

    var param = {condition:condition,jtId:jtId,unitId:unitId,userId:userId,roleId:roleId};
    adminService.findStore(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改4S店
router.post('/updateStore', function(req, res, next) {
    var storeInfo = req.body.storeInfo;
    adminService.updateStore(storeInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增汽车品牌
router.post('/addCarBrand', function(req, res, next) {
    var carBrandInfo = req.body.carBrandInfo;
    adminService.addCarBrand(carBrandInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改汽车品牌
router.post('/updateCarBrand', function(req, res, next) {
    var carBrandInfo = req.body.carBrandInfo;
    adminService.updateCarBrand(carBrandInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除汽车品牌
router.post('/deleteCarBrand', function(req, res, next) {
    var brandId = req.body.brandId;
    adminService.deleteCarBrand(brandId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询汽车品牌
router.post('/findCarBrand', function(req, res, next) {
    var condition = req.body.condition;
    adminService.findCarBrand(condition)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//新增汽车型号
router.post('/addCarModel', function(req, res, next) {
    var carModelInfo = req.body.carModelInfo;
    adminService.addCarModel(carModelInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除汽车型号
router.post('/deleteCarModel', function(req, res, next) {
    var modelId = req.body.modelId;
    adminService.deleteCarModel(modelId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询汽车型号
router.post('/findCarModel', function(req, res, next) {
    var brandId = req.body.brandId;
    adminService.findCarModel(brandId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据4S店id查询汽车信息
router.post('/findCarInfoByStoreId', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    adminService.findCarInfoByStoreId(storeId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//格式化4s店的数据
router.post('/formatStoreById', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = req.body.storeId;
    var loginName = req.body.loginName;
    var password =  req.body.password;
    var param = {storeId : storeId, loginName : loginName, password : password};
    adminService.formatStoreById(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按品牌名称首字母大小排序查询所有品牌
router.post('/findCarBrandByOrder', function(req, res, next) {
    var condition = req.body.condition;
    adminService.findCarBrandByOrder(condition)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按条件校验4s店的信息是否存在, true表示存在, false表示不存在
router.post('/findExistStoreByCondition', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition : condition};
    adminService.findExistStoreByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据险种ID查询险种
router.post('/findInsuByTypeId', function(req, res, next) {
    var typeId = req.body.typeId;
    var param = {typeId : typeId};
    adminService.findInsuByTypeId(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改险种
router.post('/updateInsu', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition : condition};
    adminService.updateInsu(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//营销短信充值
router.post('/messageRecharge', function(req, res, next) {
    var storeInfo = req.body.storeInfo;
    adminService.messageRecharge(storeInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});


module.exports = router;
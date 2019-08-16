/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('giftRecordIMService', ['$http','$q', function($http,$q){
        //根据条件查询赠送核销记录
        this.findGivingByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/findGivingByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据审批单ID查询赠送信息
        this.findGivingByApprovalBillId = function(approvalBillId){
            var deferred = $q.defer();
            $http.post('/gift/findGivingByApprovalBillId',{approvalBillId:approvalBillId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询本店各种用户
        this.findKindsUser = function(){
            var deferred = $q.defer();
            $http.post('/user/findKindsUser')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //exportGiftRecord 导出赠品信息
        this.exportGiftRecord = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/exportGiftRecord',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //exportGiftRecordExcel 导出赠品信息生成表格.
        this.exportGiftRecordExcel = function(exportCustomerData,exportData){
            //新建工作簿
            var wb = new Workbook_Bip();
            /**
             *设置表头
             *
             **/
                //设置sheet表名
            var overviewSheet = stripscript("总览");//sheet表名
            var summaryDetailsSheet = stripscript("明细汇总");
            var serviceSheet = stripscript("服务类");
            var boutiqueSheet = stripscript("精品类");
            var packagesSheet = stripscript("礼包类");
            var storedCardSheet = stripscript("储值卡");
            var membershipIntegralSheet = stripscript("会员积分");

            /**
             * 总览表头
             * @type {Array}
             */
            var overviewData = [];
            overviewData.push([
                {"v": "总览", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 15, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}}
            ]);
            /**
             * 总览第一行
             */
            overviewData.push([
                {"v": "赠品类别", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "服务类价格", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "精品类价格", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "礼包类价格", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "储值卡类价格", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "会员积分类价格", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "合计", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}}
            ]);
            /**
             * 明细汇总表头
             * @type {Array}
             */
            var summaryDetailsData = [];
            /**
             * 服务类表头
             * @type {Array}
             */
            var serviceData = [];
            /**
             * 精品类表头
             * @type {Array}
             */
            var boutiqueData = [];
            /**
             * 储值卡表头
             * @type {Array}
             */
            var storedCardData = [];
            /**
             * 礼包类表头
             * @type {Array}
             */
            var packagesData = [];
            /**
             * 会员积分类表头
             * @type {Array}
             */
            var membershipIntegralData = [];
            /**
             * 明细汇总第一行
             */
            summaryDetailsData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品类型", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}}
            ]);



            serviceData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}}
            ]);
            boutiqueData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}}
            ]);
            storedCardData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}}
            ]);

            packagesData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12 , bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true  }, alignment: {horizontal: "center"}}}
            ]);

            membershipIntegralData.push([
                {"v": "序号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车牌号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "车架号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系人", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "联系方式", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品编码", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "赠品名称", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "有效期至", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "指导价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "销售价", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "数量", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "保单号", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单时间", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "出单员", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}},
                {"v": "备注", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 12, bold: true }, alignment: {horizontal: "center"}}}
            ]);

            /**
             * 遍历数据
             */
            var foursStore = "";
            var approvalBillId = "";//审批单id
            var carLicenseNumber = "";//车牌号
            var chassisNumber = "";//车架号
            var contact = ""; //联系人
            var contactWay = "" ;
            var giftCode = "" ;
            var giftType = "" ;
            var giftName = "" ;
            var validDate = "" ;
            var guidePrice = "" ;
            var actualPrice = "" ;
            var sellingPrice = "" ;
            var amount = "" ;
            var amountMoney = "" ;
            var insuranceBillId = "" ;
            var cdrq = "" ;
            var insuranceWriter = "" ;
            var remark = "" ;

            //总览
            var serviceTotalPrice = 0;//服务类价格
            var boutiqueTotalPrice = 0;//精品类价格
            var packagesTotalPrice = 0;//礼包类价格
            var storedCardTotalPrice = 0;//储值卡类价格
            var membershipIntegralTotalPrice = 0;//会员积分类价格
            var total = 0;//合计

            var serviceIndexes = 0;var summaryIndexes = 0;var boutiqueIndexes = 0;var packagesIndexes = 0;var storedCardIndexes = 0;var membershipIndexes = 0;
            for(var i=0;i<exportData.length;i++){
                var exportApprovalBillId = exportData[i].approvalBillId;
                carLicenseNumber = exportData[i].carLicenseNumber != null &&exportData[i].carLicenseNumber !="" ? exportData[i].carLicenseNumber : "";//车牌号
                chassisNumber = exportData[i].chassisNumber !=null && exportData[i].chassisNumber !="" ? exportData[i].chassisNumber : "";//车架号
                contact = exportData[i].contact!=null && exportData[i].contact != "" ? exportData[i].contact : "";
                contactWay = exportData[i].contactWay!=null && exportData[i].contactWay!="" ? exportData[i].contactWay : "";
                insuranceBillId = exportData[i].insuranceBillId !=null && exportData[i].insuranceBillId !="" ? exportData[i].insuranceBillId : "";
                cdrq = exportData[i].cdrq !=null && exportData[i].cdrq !="" ? exportData[i].cdrq : "";
                insuranceWriter = exportData[i].insuranceWriter!=null && exportData[i].insuranceWriter != "" ? exportData[i].insuranceWriter : "";
                if(!isVehicleNumber(carLicenseNumber)){
                    carLicenseNumber = "";
                }
                if(!foursStore){
                    foursStore = exportData[i].foursStore;
                }
                if(contactWay.length<6){
                    contactWay = "";
                }
                if(exportData[i].remark){
                    remark = exportData[i].remark ;
                }else{
                    remark = "" ;
                }

                for(var j=0;j<exportCustomerData.length;j++){
                    approvalBillId = exportCustomerData[j].approvalBillId;

                    if(exportCustomerData[j].givingInformationId==0 && approvalBillId == exportApprovalBillId){

                        giftCode = exportCustomerData[j].giftCode !="" ? exportCustomerData[j].giftCode : "";
                        giftType = exportCustomerData[j].giftType !="" ? exportCustomerData[j].giftType : "";
                        giftName = exportCustomerData[j].giftName != "" ? exportCustomerData[j].giftName : "";
                        validDate = exportCustomerData[j].validDate !="" ? exportCustomerData[j].validDate : "";
                        guidePrice = numberTwo(exportCustomerData[j].guidePrice);
                        //actualPrice = numberTwo(exportCustomerData[j].actualPrice);

                        sellingPrice = numberTwo(exportCustomerData[j].sellingPrice);
                        amount = exportCustomerData[j].amount !="" ? exportCustomerData[j].amount : "";
                        amountMoney = numberTwo(exportCustomerData[j].amountMoney);

                        var giftTypeStr = giftTypeUtil(giftType);

                        if(giftType == 1){//服务类 serviceTotalPrice
                            if(exportCustomerData[j].amountMoney){
                                serviceTotalPrice = accAdd(serviceTotalPrice , exportCustomerData[j].amountMoney);//amountMoney
                            }
                        }else if(giftType == 2){//精品类 boutiqueTotalPrice
                            if(exportCustomerData[j].amountMoney){
                                boutiqueTotalPrice = accAdd(boutiqueTotalPrice , exportCustomerData[j].amountMoney);//amountMoney
                            }
                        }else if(giftType == 3){//礼包类 packagesTotalPrice
                            if(exportCustomerData[j].amountMoney){
                                packagesTotalPrice = accAdd(packagesTotalPrice , exportCustomerData[j].amountMoney);//amountMoney
                            }
                        }else if(giftType == 4){//储值卡类 storedCardTotalPrice
                            if(exportCustomerData[j].amountMoney){
                                storedCardTotalPrice = accAdd(storedCardTotalPrice , exportCustomerData[j].amountMoney);//amountMoney
                            }
                        }else if(giftType == 5){//会员积分类 membershipIntegralTotalPrice
                            if(exportCustomerData[j].amountMoney){
                                membershipIntegralTotalPrice = accAdd(membershipIntegralTotalPrice , exportCustomerData[j].amountMoney);//amountMoney
                            }
                        }

                        /**
                         *  sheet表
                         */
                        //明细汇总
                        summaryDetailsData.push([
                            {"v": ++summaryIndexes, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": carLicenseNumber , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": chassisNumber , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": contact , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": contactWay , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": giftCode , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": giftTypeStr , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                            {"v": giftName , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                            {"v": validDate , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": parseFloat(guidePrice) , "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": parseFloat(sellingPrice) , "s": {"numFmt" : "0.00" , border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": amount , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                            {"v": parseFloat(amountMoney) , "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                            {"v": insuranceBillId, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": cdrq , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": insuranceWriter, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                            {"v": remark , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}}
                        ]);
                        if(giftType == 1){//服务类 serviceData
                            overviewInsertd11(serviceData , ++serviceIndexes , carLicenseNumber , chassisNumber ,  contact , contactWay, giftCode, giftName, validDate, guidePrice, sellingPrice, amount, amountMoney, insuranceBillId , cdrq, insuranceWriter , remark);
                        }else if(giftType == 2){//精品类 boutiqueData
                            overviewInsertd11(boutiqueData , ++boutiqueIndexes , carLicenseNumber , chassisNumber ,  contact , contactWay, giftCode, giftName, validDate, guidePrice, sellingPrice, amount, amountMoney, insuranceBillId , cdrq, insuranceWriter , remark);
                        }else if(giftType == 3){//礼包类 packagesData
                            overviewInsertd11(packagesData , ++packagesIndexes , carLicenseNumber , chassisNumber ,  contact , contactWay, giftCode, giftName, validDate, guidePrice, sellingPrice, amount, amountMoney, insuranceBillId , cdrq, insuranceWriter , remark);
                        }else if(giftType == 4){//储值卡类 storedCardData
                            overviewInsertd11(storedCardData , ++storedCardIndexes , carLicenseNumber , chassisNumber ,  contact , contactWay, giftCode, giftName, validDate, guidePrice, sellingPrice, amount, amountMoney, insuranceBillId , cdrq, insuranceWriter , remark);
                        }else if(giftType == 5){//会员积分类 membershipIntegralData
                            overviewInsertd11(membershipIntegralData , ++membershipIndexes , carLicenseNumber , chassisNumber ,  contact , contactWay, giftCode, giftName, validDate, guidePrice, sellingPrice, amount, amountMoney, insuranceBillId , cdrq, insuranceWriter , remark);
                        }

                    }
                }//遍历完成  exportCustomerData
            }//遍历完成   exportData
            // 服务类 serviceTotalPrice 精品类 boutiqueTotalPrice 礼包类 packagesTotalPrice 储值卡类 storedCardTotalPrice 会员积分类 membershipIntegralTotalPrice
            total = addT(serviceTotalPrice , boutiqueTotalPrice , packagesTotalPrice , storedCardTotalPrice , membershipIntegralTotalPrice);
            if(serviceTotalPrice){
                serviceTotalPrice = numberTwo(serviceTotalPrice);
            }
            if(boutiqueTotalPrice){
                boutiqueTotalPrice = numberTwo(boutiqueTotalPrice);
            }
            if(packagesTotalPrice){
                packagesTotalPrice = numberTwo(packagesTotalPrice);
            }
            if(storedCardTotalPrice){
                storedCardTotalPrice = numberTwo(storedCardTotalPrice);
            }
            if(membershipIntegralTotalPrice){
                membershipIntegralTotalPrice = numberTwo(membershipIntegralTotalPrice);
            }
            if(total){
                total = numberTwo(total);
            }

            //总览数据
            overviewData.push([
                {"v": "赠送金额", "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(serviceTotalPrice), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(boutiqueTotalPrice), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(packagesTotalPrice), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(storedCardTotalPrice), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                {"v": parseFloat(membershipIntegralTotalPrice), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                {"v": parseFloat(total), "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}}
            ])

            // wb.addRowsToSheet("总览", overviewData).finalize();
            var overview = wb.addRowsToSheet(overviewSheet, overviewData).finalize();//总览
            var summaryDetails = wb.addRowsToSheet(summaryDetailsSheet, summaryDetailsData).finalize();//明细汇总
            var service = wb.addRowsToSheet(serviceSheet, serviceData).finalize();//服务类
            var boutique = wb.addRowsToSheet(boutiqueSheet, boutiqueData).finalize();//精品类
            var packages = wb.addRowsToSheet(packagesSheet, packagesData).finalize();//礼包类
            var storedCard = wb.addRowsToSheet(storedCardSheet, storedCardData).finalize();//储值卡
            var membershipIntegral = wb.addRowsToSheet(membershipIntegralSheet, membershipIntegralData).finalize();//会员积分
            overview.mergeCells(overviewSheet, {
                //第1行 合并单元格 (横向)
                "s": {"c": 0, "r": 0 },
                "e": {"c": 6, "r": 0 }
            });
            var wopts = { bookType:'xlsx', bookSST:false, type:'binary' ,cellStyles: true};

            var wbout = XLSX.write(wb,wopts);

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            if(foursStore.indexOf("传慧")> -1){
                var fileName ="传慧嘉和(北京)管理咨询有限公司" + " " + getNowFormatDate() + " 赠送记录导出.xlsx" ;
            }else {
                var fileName ="北京博福易商科技有限公司" + " " + getNowFormatDate() + " 赠送记录导出.xlsx" ;
            }
            /* the saveAs call downloads a file on the local machine */
            saveAs(new Blob([s2ab(wbout)],{type:""}), fileName)



        };
        function numberTwo(c){
            c = c +"";
            c = c.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符

            if(/^0+/.test(c)) //清除字符串开头的0
                c = c.replace(/^0+/, '');
            if(!/\./.test(c)) //为整数字符串在末尾添加.00
                c += '.00';
            if(/^\./.test(c)) //字符以.开头时,在开头添加0
                c = '0' + c;
            c += '00';        //在字符串末尾补零
            c = c.match(/\d+\.\d{2}/)[0];
            return c;
        }
        //代码复用
        function overviewInsertd11(sheetData , mapIndex, carLicenseNumber , chassisNumber ,  contact, contactWay, giftCode, giftType , validDate , guidePrice  , sellingPrice
            , amount , amountMoney , insuranceBillId , cdrq , insuranceWriter , remark){

            sheetData.push([
                {"v": mapIndex, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": carLicenseNumber , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": chassisNumber , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": contact , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": contactWay , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": giftCode , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": giftType , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                {"v": validDate , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(guidePrice) , "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": parseFloat(sellingPrice) , "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": amount , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                {"v": parseFloat(amountMoney) , "s": {"numFmt" : "0.00" ,border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center", wrapText: "true"}}},
                {"v": insuranceBillId, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10, bold: true }, alignment:{horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": cdrq , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": insuranceWriter, "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}},
                {"v": remark , "s": {border: {top: {style: "thin"}, bottom: {style: "thin"}, left: {style: "thin"}, right:{style: "thin"}},font: {name: "宋体", sz: 10 }, alignment: {horizontal: "center", vertical: "center" , wrapText: "true"}}}
            ]);

        }
        function isVehicleNumber(vehicleNumber) {
            var result = false;
            if (vehicleNumber.length == 7){
                var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
                result = express.test(vehicleNumber);
            }
            return result;
        }
        function giftTypeUtil(giftType){
            switch(giftType)
            {
                case 1:
                    giftType = "服务类";
                    break;
                case 2:
                    giftType = "精品类";
                    break;
                case 3:
                    giftType = "礼包类";
                    break;
                case 4:
                    giftType = "储值卡";
                    break;
                case 5:
                    giftType = "会员积分";
                    break;

                default:
                    giftType = "";
            }
            return giftType;
        }

        //以下四个函数是算术运算得到精确方法
        //除法函数，用来得到精确的除法结果
        //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
        //调用：accDiv(arg1,arg2)
        //返回值：arg1除以arg2的精确结果
        function accDiv(arg1,arg2) {
            return accMul(arg1,1/arg2);
        }

        //乘法函数，用来得到精确的乘法结果
        //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
        //调用：accMul(arg1,arg2)
        //返回值：arg1乘以arg2的精确结果
        function accMul(arg1,arg2){
            if(arg1 == 0 || arg2 == 0 || arg1 == 0.0 || arg2 == 0.0){
                return 0;
            }
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{m+=s1.split(".")[1].length}catch(e){}
            try{m+=s2.split(".")[1].length}catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
        }

        //加法函数，用来得到精确的加法结果
        //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
        //调用：accAdd(arg1,arg2)
        //返回值：arg1加上arg2的精确结果
        function accAdd(arg1,arg2){
            var r1,r2,m;
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            return (accMul(arg1,m)+accMul(arg2,m))/m;
        }

        //减法函数，用来得到精确的减法结果
        //说明：javascript的减法结果会有误差，在两个浮点数减法的时候会比较明显。这个函数返回较为精确的减法结果。
        //调用：accSub(arg1,arg2)
        //返回值：arg1减法arg2的精确结果
        function accSub(arg1,arg2){
            return accAdd(arg1,-arg2);
        }
        /**
         * 提供精确加法计算的add方法
         *
         * @param value1
         *            被加数
         * @param value2
         *            加数
         * @param value3
         *            加数
         * @param scale
         *            精确位数
         * @return 三个参数的和
         */
        function addT(arg1, arg2, arg3, arg4, arg5) {
            return accAdd(arg5,accAdd(arg4,accAdd(arg3,accAdd(arg1,arg2))));
        }
        //转义特殊字符
        function stripscript(s) {

            if(s){
                //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")

                if(s.indexOf("/")>0){
                    s = s.replace("/" , " ");
                }
                /* for (var i = 0; i < s.length; i++) {
                     rs = rs+s.substr(i, 1).replace(pattern, " ");
                 }*/
                return (s).toString();
            }else{
                return s;
            }
            // return s.toString();
        }
        //现在时间
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";

            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " ";// + date.getHours() + seperator2 + date.getMinutes()  + seperator2 + date.getSeconds()
            return currentdate;
        }
    }]);

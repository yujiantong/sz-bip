var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;
var xlsx = require('node-xlsx');
var fs = require('fs');

function importData(source,fourSStoreId,fourSStore,importCategory,isFugai,userId) {
    var promise = new Promise(function (resolve, reject) {
        try{
            var workbook = xlsx.parse(source); // parses a file
        }catch(e){
            reject({results:{message:"文件解析失败,请从系统下载模版"}});
        }
        var data = workbook[0].data;
        var allData = [];
        var errorMessage = [];
        //用于校验车架号是否含有汉字
        //var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        //校验车架号
        //var reg = /^[a-zA-Z0-9]{17}$/ ;
        console.log(data.length);
        if(importCategory == '保单导入'){
            if(data[1].length != 60){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                //try {
                    if (data[i].length == 0) continue;
                    if (i == 0 || i == 1) continue;
                    var insurDate = getNeedTime(data[i][0]);//投保日期;
                    var clerk = data[i][1];//业务员或者销售员  ---------------
                    if(clerk){
                        clerk = clerk.toString().trim();
                    }
                    var principal = data[i][2];//负责人----续保专员
                    if(principal){
                        principal = principal.toString().trim();
                    }
                    var insuranceWriter = data[i][3];//出单员
                    if(insuranceWriter){
                        insuranceWriter = insuranceWriter.toString().trim();
                    }
                    var chassisNumber = data[i][4];//车架号
                    if(chassisNumber){
                        chassisNumber = chassisNumber.toString().trim();
                    }

                    var carLicenseNumber = data[i][5];
                    if(carLicenseNumber){
                        carLicenseNumber = carLicenseNumber.toString().trim();//车牌号
                    }
                    var registrationDate = getNeedTime(data[i][6]);//上牌日期
                    var engineNumber = data[i][7];
                    if(engineNumber){
                        engineNumber = engineNumber.toString().trim();//发动机号
                    }
                    var carBrand = data[i][8]
                    if(carBrand){
                        carBrand = carBrand.toString().trim();//汽车品牌
                    }
                    var vehicleModel = data[i][9];
                    if(vehicleModel){
                        vehicleModel = vehicleModel.toString().trim();//汽车型号
                    }
                    var carOwner = data[i][10];
                    if(carOwner){
                        carOwner = carOwner.toString().trim();//车主
                    }
                    var insured = data[i][11];
                    if(insured){
                        insured = insured.toString().trim();//被保险人
                    }
                    var certificateNumber = data[i][12]
                    if(certificateNumber){
                        certificateNumber = certificateNumber.toString().trim();//被保险人证件号   ------------
                    }
                    var contact = data[i][13];
                    if(contact){
                        contact = contact.toString().trim();//联系人
                    }
                    var contactWay = data[i][14];
                    if(contactWay){
                        contactWay = contactWay.toString().trim();//联系人手机
                    }
                    var customerSource = data[i][15];
                    if(customerSource){
                        customerSource = customerSource.toString().trim();//客户来源 --------------
                    }
                    var customerCharacter = data[i][16];
                    if(customerCharacter){
                        customerCharacter = customerCharacter.toString().trim();//客户性质 ------------
                    }
                    var coverType = data[i][17];
                    if(coverType){
                        coverType = coverType.toString().trim();//投保类型
                    }
                    var insurNumber = '0';
                    if(data[i][18]){
                        insurNumber = data[i][18].toString();//本店投保次数
                    }
                    var insuranceCompName = data[i][19]
                    if(insuranceCompName){
                        insuranceCompName = insuranceCompName.toString().trim();//保险公司
                    }
                    var cinsuranceNumber = data[i][20];//交强险保单号
                    var jqxrqEnd = getNeedDateTime(data[i][21]);//交强险结束日期;

                    //if(jqxrqEnd){
                    //    var jqxrqStart = getLastYear(jqxrqEnd);//交强险开始日期 ;
                    //}

                    var binsuranceNumber = data[i][22];//商业险保单号

                    var syxrqEnd = getNeedDateTime(data[i][23]);//商业险结束日期
                    //console.log(syxrqEnd);
                    //if(syxrqEnd){
                    //    var syxrqStart = getLastYear(syxrqEnd);//商业险开始日期
                    //}

                    var cinsuranceCoverage = '0';
                    if(data[i][24]){
                        cinsuranceCoverage = data[i][24].toString();//交强险保额
                    }
                    var binsuranceCoverage = '0';
                    if(data[i][25]){
                        binsuranceCoverage = data[i][25].toString();//商业险保额
                    }
                    var vehicleTax = '0';
                    if(data[i][26]){
                        vehicleTax = data[i][26].toString();//车船税金额
                    }

                    var realPay = '0';
                    if(data[i][28]){
                        realPay = data[i][28].toString();//实收金额
                    }

                    var payWay = data[i][29];//收款方式
                    var invoiceName = data[i][30];//开票名称
                    var remark = '';
                    if (data[i][27]) {
                        remark += data[1][27] + ':' + data[i][27] + ';';//销售赠送
                    }
                    if (data[i][31] && data[i][31] != 0) {
                        remark += data[1][31] + ':' + data[i][31] + ';';//车损险保费
                    }
                    if (data[i][32] && data[i][32] != 0) {
                        remark += data[1][32] + ':' + data[i][32] + ';';//三者险保额
                    }
                    if (data[i][33] && data[i][33] != 0) {
                        remark += data[1][33] + ':' + data[i][33] + ';';//三者险保费
                    }
                    if (data[i][34] && data[i][34] != 0) {
                        remark += data[1][34] + ':' + data[i][34] + ';';//盗抢险保费
                    }
                    if (data[i][35] && data[i][35] != 0) {
                        remark += data[1][35] + ':' + data[i][35] + ';';//车上人员险保额(司机)
                    }
                    if (data[i][36] && data[i][36] != 0) {
                        remark += data[1][36] + ':' + data[i][36] + ';';//车上人员险保额(乘客)
                    }
                    if (data[i][37] && data[i][37] != 0) {
                        remark += data[1][37] + ':' + data[i][37] + ';';//车上人员险保费
                    }
                    if (data[i][38] && data[i][38] != 0) {
                        remark += data[1][38] + ':' + data[i][38] + ';';//不计免赔险保费
                    }
                    if (data[i][39] && data[i][39] != 0) {
                        remark += data[1][39] + ':' + data[i][39] + ';';//玻璃保费
                    }
                    if (data[i][40] && data[i][40] != 0) {
                        remark += data[1][40] + ':' + data[i][40] + ';';//划痕险保额
                    }
                    if (data[i][41] && data[i][41] != 0) {
                        remark += data[1][41] + ':' + data[i][41] + ';';//划痕险保费
                    }
                    if (data[i][42] && data[i][42] != 0) {
                        remark += data[1][42] + ':' + data[i][42] + ';';//自燃险保费
                    }
                    if (data[i][43] && data[i][43] != 0) {
                        remark += data[1][43] + ':' + data[i][43] + ';';//涉水险保费
                    }
                    if (data[i][44] && data[i][44] != 0) {
                        remark += data[1][44] + ':' + data[i][44] + ';';//大灯、倒车镜险保费
                    }
                    if (data[i][45] && data[i][45] != 0) {
                        remark += data[1][45] + ':' + data[i][45] + ';';//指定修理厂险
                    }
                    if (data[i][46] && data[i][46] != 0) {
                        remark += data[1][46] + ':' + data[i][46] + ';';//无法找到第三方责任险
                    }
                    if (data[i][47] && data[i][47] != 0) {
                        remark += data[1][47] + ':' + data[i][47] + ';';//其他商业险
                    }
                    if (data[i][48] || data[i][49] || data[i][50] || data[i][51]
                        || data[i][52] || data[i][53] || data[i][54] || data[i][55]) {
                        remark += '赠送明细:';
                    }
                    if (data[i][48]) {
                        remark += data[1][48] + ':' + data[i][48] + ';';//赠送明细一
                    }
                    if (data[i][49]) {
                        remark += data[1][49] + ':' + data[i][49] + ';';//赠送明细二
                    }
                    if (data[i][50]) {
                        remark += data[1][50] + ':' + data[i][50] + ';';//赠送明细三
                    }
                    if (data[i][51]) {
                        remark += data[1][51] + ':' + data[i][51] + ';';//赠送明细四
                    }
                    if (data[i][52]) {
                        remark += data[1][52] + ':' + data[i][52] + ';';//赠送明细五
                    }
                    if (data[i][53]) {
                        remark += data[1][53] + ':' + data[i][53] + ';';//赠送明细六
                    }
                    if (data[i][54]) {
                        remark += data[1][54] + ':' + data[i][54] + ';';//赠送明细七
                    }
                    if (data[i][55]) {
                        remark += data[1][55] + ':' + data[i][55] + ';';//赠送明细八
                    }
                    if (data[i][56]) {
                        remark += data[1][56] + ':' + data[i][56] + ';';//赠送明细九
                    }
                    if (data[i][57]) {
                        remark += data[1][57] + ':' + data[i][57] + ';';//赠送明细十
                    }
                    if (data[i][58]) {
                        remark += data[1][58] + ':' + data[i][58] + ';';//赠送明细十一
                    }
                    if (data[i][59]) {
                        remark += data[1][59] + ':' + data[i][59] + ';';//赠送明细十二
                    }
                    var insuranceBill = {
                        rowNumber: i+1,fourSStoreId: fourSStoreId,foursStore: fourSStore,insurDate: insurDate,clerk: clerk,
                        principal: principal,insuranceWriter: insuranceWriter,chassisNumber: chassisNumber,
                        carLicenseNumber: carLicenseNumber,registrationDate: registrationDate,engineNumber: engineNumber,
                        carBrand: carBrand,vehicleModel: vehicleModel,carOwner: carOwner,insured: insured,
                        certificateNumber: certificateNumber,contact: contact,contactWay: contactWay,
                        customerSource: customerSource,customerCharacter: customerCharacter,
                        coverTypeName: {coverTypeName: coverType},insurNumber: insurNumber,
                        insuranceCompName: insuranceCompName,cinsuranceNumber: cinsuranceNumber,
                        binsuranceNumber: binsuranceNumber,jqxrqEnd: jqxrqEnd,syxrqEnd: syxrqEnd,
                        cinsuranceCoverage: cinsuranceCoverage,binsuranceCoverage: binsuranceCoverage,
                        vehicleTax: vehicleTax,realPay: realPay,payWay: payWay,invoiceName: invoiceName,remark: remark
                    };
                    allData.push(insuranceBill);
                //} catch (e){
                //    console.log(e);
                //    logger.error(e);
                //    fs.unlinkSync(source);
                //    if(e.message == 'Invalid time value'){
                //        resolve({status:web.fault,results:{message:"导入失败,文件第"+ (i+1) +"行存在错误的日期"}});
                //    }else{
                //        resolve({status:web.fault,results:{message:"导入失败,文件第"+ (i+1) +"行有错误"}});
                //    }
                //    return;
                //}
            }
            var param = {data:JSON.stringify(allData),fourSStoreId:fourSStoreId};
            utilBsp.postToJava(web.bip, "/insurance/importInsurance",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.success){
                        if(result.content.errorMessage){
                            fs.writeFileSync('./public/file/message.txt', '');
                            var arr = result.content.errorMessage;
                            for(var i=0;i< arr.length;i++){
                                var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                                fs.appendFile('./public/file/message.txt', data, function(err){
                                    if (err) logger.error(err);
                                });
                            }
                        }
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        } else {
            if(data[1].length != 26){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                //try{
                if(data[i].length ==0) continue;
                if(i==0 || i==1) continue;
                var clerk = data[i][0];//业务员或者销售员  ---------------
                if(clerk){
                    clerk = clerk.toString().trim();
                }
                var principal = data[i][1];//负责人----续保专员
                if(principal){
                    principal = principal.toString().trim();
                }
                var chassisNumber = data[i][2];//车架号
                if(chassisNumber){
                    chassisNumber = chassisNumber.toString().trim();
                }
                var carLicenseNumber = data[i][3];//车牌号
                if(carLicenseNumber){
                    carLicenseNumber = carLicenseNumber.toString().trim();
                }
                var registrationDate = getNeedTime(data[i][4]);//上牌日期

                var engineNumber = data[i][5];
                if(engineNumber){
                    engineNumber = engineNumber.toString().trim();//发动机号
                }
                var carBrand = data[i][6];
                if(carBrand){
                    carBrand = carBrand.toString().trim();//汽车品牌
                }
                var vehicleModel = data[i][7];
                if(vehicleModel){
                    vehicleModel = vehicleModel.toString().trim();//车型
                }
                var factoryLicenseType = data[i][8];
                if(factoryLicenseType){
                    factoryLicenseType = factoryLicenseType.toString().trim();//车型号
                }
                var tempIfLoan = data[i][9];//是否贷款
                if(tempIfLoan){
                    tempIfLoan = tempIfLoan.toString().trim();
                }
                var ifLoan = 0; //是否贷款转成整数
                if(tempIfLoan == '是') {
                    ifLoan = 1;
                }else if(tempIfLoan == '否'){
                    ifLoan = 2;
                }
                var carOwner = data[i][10];
                if(carOwner){
                    carOwner = carOwner.toString().trim();//车主
                }
                var insured = data[i][11];
                if(insured){
                    insured = insured.toString().trim();//被保险人
                }
                var certificateNumber = data[i][12];//被保险人证件号   ------------
                if(certificateNumber){
                    certificateNumber = certificateNumber.toString().trim();
                }
                var contact = data[i][13];//联系人
                if(contact){
                    contact = contact.toString().trim();
                }
                var contactWay = data[i][14];//联系人手机
                if(contactWay){
                    contactWay = contactWay.toString().trim();
                }
                var customerCharacter = data[i][15];//客户性质 ------------
                if(customerCharacter){
                    customerCharacter = customerCharacter.toString().trim();
                }
                var tempCoverType = data[i][16];//投保类型
                if(tempCoverType){
                    tempCoverType = tempCoverType.toString().trim();
                }
                var renewalType = 0; //投保类型转成整数
                if(tempCoverType == '新保'){
                    renewalType = 1;
                    //fs.unlinkSync(source);
                    //resolve({status:web.fault,results:{message:"导入失败,文件第"+ (i+1) +"行出错,投保类型不能为新保"}});
                    //allData = [];
                    //return;
                    //errorMessage.push("文件第"+ (i+1) +"行投保类型不能为新保");
                    //continue;
                }else if(tempCoverType == '新转续'){
                    renewalType = 2;
                }else if(tempCoverType == '续转续'){
                    renewalType = 3;
                }else if(tempCoverType == '间转续'){
                    renewalType = 4;
                }else if(tempCoverType == '潜转续'){
                    renewalType = 5;
                }else if(tempCoverType == '首次'){
                    renewalType = 6;
                }
                var insurNumber = '0';
                if(data[i][17]){
                    insurNumber = data[i][17].toString();//本店投保次数
                }

                var insuranceCompLY = data[i][18];
                if(insuranceCompLY){
                    insuranceCompLY = insuranceCompLY.toString().trim();//(去年)保险公司
                }
                var insuranceEndDate = getNeedTime(data[i][19]);//交强险结束日期
                var syxrqEnd = getNeedTime(data[i][20]);//商业险结束日期
                var insurDateLY = getNeedTime(data[i][21]);//去年投保日期
                var remark = data[i][22];//备注
                //维修信息
                var maintainNumberLY = '0';//(去年)本店维修次数
                if(data[i][23]){
                    maintainNumberLY = data[i][23].toString().trim();//(去年)本店维修次数
                }
                var accidentNumberLY = '0';//(去年)出险次数
                if(data[i][24]){
                    accidentNumberLY = data[i][24].toString().trim();//(去年)出险次数
                }
                var accidentOutputValueLY = data[i][25];//(去年)事故车产值
                var importFlag = 0;//导入标志
                var customer = {
                    rowNumber: i+1,fourSStoreId:fourSStoreId,fourSStore:fourSStore,
                    clerk:clerk,principal:principal,
                    chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,
                    registrationDate:registrationDate,engineNumber:engineNumber,carBrand:carBrand,
                    vehicleModel:vehicleModel,factoryLicenseType:factoryLicenseType,
                    ifLoan:ifLoan,
                    carOwner:carOwner,insured:insured,certificateNumber:certificateNumber,
                    contact:contact,contactWay:contactWay, customerCharacter:customerCharacter,
                    renewalType:renewalType,insurNumber:insurNumber,insuranceCompLY:insuranceCompLY,
                    jqxrqEnd:insuranceEndDate,syxrqEnd:syxrqEnd, maintainNumberLY:maintainNumberLY,
                    accidentNumberLY:accidentNumberLY,accidentOutputValueLY:accidentOutputValueLY,
                    insurDateLY:insurDateLY,remark:remark,
                    importFlag:importFlag
                };

                allData.push(customer);
                //} catch (e){
                //    console.log(e);
                //    logger.error(e);
                //    //fs.unlinkSync(source);
                //    if(e.message == 'Invalid time value'){
                //        //resolve({status:web.fault,results:{message:"导入失败,文件第"+ (i+1) +"行存在错误的日期"}});
                //        errorMessage.push("导入失败,文件第"+ (i+1) +"行存在错误的日期");
                //    }else{
                //        //resolve({status:web.fault,results:{message:"导入失败,文件第"+ (i+1) +"行有错误"}});
                //        errorMessage.push("导入失败,文件第"+ (i+1) +"行有错误");
                //    }
                //    continue;
                //}
            }
            var param = {data:JSON.stringify(allData),fourSStoreId:fourSStoreId,isFugai:isFugai,userId:userId};
            utilBsp.postToJava(web.bip, "/customer/importCustomer",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/message.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/message.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    if(result.success){
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    //console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        }
    });
    return promise;
}

function getJsDateFromExcel(excelDate) {
    // 参数excelDate表示文件单元格中日期与 1900.01.01相差的天数
    var day = 25569;//从1900.01.01 到 1970.01.01 相差的天数
    return new Date((excelDate - day) * 86400 * 1000);
}

function getLastYear(date) {
    var startDate =new Date(date);
    startDate.setFullYear(startDate.getFullYear()-1);
    var endDate = startDate.getTime()+(1000*60*60*24);
    return new Date(endDate).toISOString().substr(0,10).replace(/\//g,"-");
}

//获取日期格式,带时分秒
function getNeedDateTime(date){
    var needDate;
    if(typeof date == 'number'){
        try{
            needDate = getJsDateFromExcel(date).toISOString().replace(/\//g,"-").replace(/T/g," ").substr(0,19);
        }catch(e){
            //console.log(e);
            logger.error(e);
            needDate = '0000-00-00 00:00:00';
        }
    } else if(typeof date == 'string'){
        needDate = date.replace(/\//g,"-");
    }
    return needDate;
}

//获取日期格式,不带时分秒
function getNeedTime(date){
    var insuranceEndDate;

    if(typeof date == 'number'){
        //console.log(date)
        try{
            insuranceEndDate = getJsDateFromExcel(date).toISOString().substr(0,10).replace(/\//g,"-");//交强险结束日期
        }catch(e){
            //console.log(e);
            logger.error(e);
            insuranceEndDate = '0000-00-00';
        }
    } else if(typeof date == 'string'){
        insuranceEndDate = date.replace(/\//g,"-");
        ////校验日期格式
        //var reg= /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
        //if(!reg.test(insuranceEndDate)){
        //    throw new Error("Invalid time value");
        //}
    }
    return insuranceEndDate;
}

function sleepBatch(source,fourSStoreId,userId) {
    var promise = new Promise(function (resolve, reject) {
        try{
            var workbook = xlsx.parse(source); // parses a file
        }catch(e){
            reject({results:{message:"文件解析失败,请从系统下载模版"}});
        }
        var data = workbook[0].data;
        var allData = [];
        var errorMessage = [];
        //用于校验车架号是否含有汉字
        //var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
        //校验车架号
        //var reg = /^[a-zA-Z0-9]{17}$/ ;
        if(data[0].length != 1){
            fs.unlinkSync(source);
            resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
            return;
        }
        for(var i=0; i<data.length; i++){
            if (data[i].length == 0) continue;
            if (i == 0) continue;
            var chassisNumber = data[i][0];//车架号
            if(chassisNumber){
                chassisNumber = chassisNumber.toString().trim();
            }
            var sleepCustomer = {rowNumber: i+1,fourSStoreId: fourSStoreId,chassisNumber: chassisNumber};
            allData.push(sleepCustomer);
        }
        var param = {data:JSON.stringify(allData),fourSStoreId:fourSStoreId,userId:userId};
        utilBsp.postToJava(web.bip, "/customer/sleepBatch",param)
            .then(function (result) {
                fs.unlinkSync(source);
                if(result.success){
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/sleepBatchMessage.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/sleepBatchMessage.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                console.log(err);
                logger.error(err);
                fs.unlinkSync(source);
                reject({results:{message:"导入失败,程序出现错误"}});
            });
    });
    return promise;
}

//销售战败潜客导入
function importDefeat(source,fourSStoreId) {
    var promise = new Promise(function (resolve, reject) {
        try{
            var workbook = xlsx.parse(source); // parses a file
        }catch(e){
            reject({results:{message:"文件解析失败,请从系统下载模版"}});
        }
        var data = workbook[0].data;
        var allData = [];
        var errorMessage = [];
        console.log(data[0]);
        if(data[0].length != 5){
            fs.unlinkSync(source);
            resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
            return;
        }
        for(var i=0; i<data.length; i++){
            if (data[i].length == 0) continue;
            if (i == 0) continue;
            var contact = data[i][0];//潜客名称
            if(contact){
                contact = contact.toString().trim();
            }
            var contactWay = data[i][1];//潜客电话
            if(contactWay){
                contactWay = contactWay.toString().trim();
            }
            var cause = data[i][2];//失销原因
            if(cause){
                cause = cause.toString().trim();
            }
            var causeAnalysis = data[i][3];//失销分析
            if(causeAnalysis){
                causeAnalysis = causeAnalysis.toString().trim();
            }
            var failureTime = getNeedTime(data[i][4]);//失销时间

            var defeatCustomer = {rowNumber: i+1,bip_storeId: fourSStoreId,contact: contact,
                contactWay:contactWay,cause:cause,causeAnalysis:causeAnalysis,failureTime:failureTime
            };
            allData.push(defeatCustomer);
        }
        var param = {data:JSON.stringify(allData),fourSStoreId:fourSStoreId};
        utilBsp.postToJava(web.bip, "/customer/importDefeat",param)
            .then(function (result) {
                fs.unlinkSync(source);
                if(result.success){
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/importDefeatMessage.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/importDefeatMessage.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                console.log(err);
                logger.error(err);
                fs.unlinkSync(source);
                reject({results:{message:"导入失败,程序出现错误"}});
            });
    });
    return promise;
}


function tsxImport(source,storeId,importCategory,insuranceCompName) {
    var promise = new Promise(function (resolve, reject) {
        try{
            var workbook = xlsx.parse(source); // parses a file
        }catch(e){
            reject({results:{message:"文件解析失败,请从系统下载模版"}});
        }
        var data = workbook[0].data;
        var allData = [];
        var errorMessage = [];

        console.log(data.length);
        if(importCategory == '推送修'){
            if(data[1].length != 95){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                if (data[i].length == 0) continue;
                if (i == 0) continue;
                var pushTime = getNeedTime(data[i][0]);//推送时间
                var reportNumber = data[i][1];//报案号
                if(reportNumber){
                    reportNumber = reportNumber.toString().trim();
                }
                var insuranceNumber = data[i][2];//保单号
                if(insuranceNumber){
                    insuranceNumber = insuranceNumber.toString().trim();
                }
                var carLicenseNumber = data[i][3];//车牌号
                if(carLicenseNumber){
                    carLicenseNumber = carLicenseNumber.toString().trim();
                }
                var chassisNumber = data[i][4];//车架号
                if(chassisNumber){
                    chassisNumber = chassisNumber.toString().trim();
                }
                var ppcx = data[i][5];//品牌车型
                if(ppcx){
                    ppcx = ppcx.toString().trim();
                }
                var engineNumber = data[i][6];//发动机号
                if(engineNumber){
                    engineNumber = engineNumber.toString().trim();
                }
                var reporter = data[i][7];//报案人
                if(reporter){
                    reporter = reporter.toString().trim();
                }
                var reporterPhone = data[i][8];//报案电话
                if(reporterPhone){
                    reporterPhone = reporterPhone.toString().trim();
                }
                var accidentPlace = data[i][9];//出险地点
                if(accidentPlace){
                    accidentPlace = accidentPlace.toString().trim();
                }
                var accidentTime = getNeedTime(data[i][10]);//出险时间
                var agencyCode = data[i][11];//机构代码
                if(agencyCode){
                    agencyCode = agencyCode.toString().trim();
                }
                var agencyName = data[i][12];//机构名称
                if(agencyName){
                    agencyName = agencyName.toString().trim();
                }
                var channelSource = data[i][13];//保单渠道来源
                if(channelSource){
                    channelSource = channelSource.toString().trim();
                }
                var groupType = data[i][14];//个团类型
                if(groupType){
                    groupType = groupType.toString().trim();
                }
                var insured = data[i][15];//被保险人
                if(insured){
                    insured = insured.toString().trim();
                }
                var clerk = data[i][16];//业务员
                if(clerk){
                    clerk = clerk.toString().trim();
                }
                var customerFlag = data[i][17];//客户标识
                if(customerFlag){
                    customerFlag = customerFlag.toString().trim();
                }
                var insuranceDateStart = getNeedTime(data[i][18]);//保险起期
                var insuranceDateEnd = getNeedTime(data[i][19]);//保险止期
                var sfhk = data[i][20]=='是'?1:0;//是否回款
                var clzws = '0';//车辆座位数
                if(data[i][21]){
                    clzws = data[i][21].toString();
                }
                var driveArea = data[i][22];//行驶区域
                if(driveArea){
                    driveArea = driveArea.toString().trim();
                }
                var csxbe = '0';//车损险保额
                if(data[i][23]){
                    csxbe = data[i][23].toString();
                }
                var syszxbe = '0';//商业三者险保额
                if(data[i][24]){
                    syszxbe = data[i][24].toString();
                }
                var sfnzcxs = data[i][25]=='是'?1:0;//是否能正常行驶
                var accidentReason = data[i][26];//出险原因
                if(accidentReason){
                    accidentReason = accidentReason.toString().trim();
                }
                var reportTime = getNeedTime(data[i][27]);//报案时间
                var bajsy = data[i][28];//报案驾驶员
                if(bajsy){
                    bajsy = bajsy.toString().trim();
                }
                var cxjsy = data[i][29];//出险驾驶员
                if(cxjsy){
                    cxjsy = cxjsy.toString().trim();
                }
                var sfxcba = data[i][30]=='是'?1:0;//是否现场报案

                var sfmxc = data[i][31]=='是'?1:0;//是否免现场

                var sslx = data[i][32];//损失类型
                if(sslx){
                    sslx = sslx.toString().trim();
                }
                var baclyj = data[i][33];//报案处理意见
                if(baclyj){
                    baclyj = baclyj.toString().trim();
                }
                var cwckr = data[i][34];//车物查勘人
                if(cwckr){
                    cwckr = cwckr.toString().trim();
                }
                var rsdhcky = data[i][35];//人伤电话查勘员
                if(rsdhcky){
                    rsdhcky = rsdhcky.toString().trim();
                }
                var rssdcky = data[i][36];//人伤实地查勘员
                if(rssdcky){
                    rssdcky = rssdcky.toString().trim();
                }
                var sfdhck = data[i][37]=='是'?1:0;//是否电话查勘

                var sglx = data[i][38];//事故类型
                if(sglx){
                    sglx = sglx.toString().trim();
                }
                var dachr = data[i][39];//大案初核人
                if(dachr){
                    dachr = dachr.toString().trim();
                }
                var dachsj = getNeedTime(data[i][40]);//大案初核时间
                var zrxs = '0';//责任系数
                if(data[i][41]){
                    zrxs = data[i][41].toString();
                }
                var sfrskckp = data[i][42]=='是'?1:0;//是否人伤快处快赔

                var sdsj = getNeedTime(data[i][43]);//收单时间
                var sdr = data[i][44];//收单人
                if(sdr){
                    sdr = sdr.toString().trim();
                }
                var lasj = getNeedTime(data[i][45]);//立案时间
                var laje = '0';//立案金额
                if(data[i][46]){
                    laje = data[i][46].toString();
                }
                var cslaje = '0';//车损立案金额
                if(data[i][47]){
                    cslaje = data[i][47].toString();
                }
                var rslaje = '0';//人伤立案金额
                if(data[i][48]){
                    rslaje = data[i][48].toString();
                }
                var wslaje = '0';//物损立案金额
                if(data[i][49]){
                    wslaje = data[i][49].toString();
                }
                var sfrgls1 = data[i][50]=='是'?1:0;//是否人工理算(符合人工理算规则)
                var sfrgls2 = data[i][51]=='是'?1:0;//是否人工理算(经过人工理算平台)
                var zalsTimeStart = getNeedTime(data[i][52]);//整案理算开始时间
                var zalsTimeEnd = getNeedTime(data[i][53]);//整案理算结束时间
                var scrgzjTimeStart = getNeedTime(data[i][54]);//首次人工质检开始时间
                var mcrgzjTimeEnd = getNeedTime(data[i][55]);//末次人工质检结束时间
                var scckTimeStart = getNeedTime(data[i][56]);//首次查勘开始时间
                var mcckTimeEnd = getNeedTime(data[i][57]);//末次查勘结束时间
                var dssfbhsjf = data[i][58]=='是'?1:0;//定损是否包含施救费
                var sftd = data[i][59]=='是'?1:0;//是否提调
                var sctdTime = getNeedTime(data[i][60]);//首次提调时间
                var sfzdtd = data[i][61]=='是'?1:0;//是否自动提调
                var cwnbdcjsje = '0';//车物内部调查减损金额
                if(data[i][62]){
                    cwnbdcjsje = data[i][62].toString();
                }
                var cwwbdcjsje = '0';//车物外部调查减损金额
                if(data[i][63]){
                    cwwbdcjsje = data[i][63].toString();
                }
                var jpje = '0';//拒赔金额
                if(data[i][64]){
                    jpje = data[i][64].toString();
                }
                var fkjsje = '0';//复勘减损金额
                if(data[i][65]){
                    fkjsje = data[i][65].toString();
                }
                var zcje = '0';//追偿金额
                if(data[i][66]){
                    zcje = data[i][66].toString();
                }
                var sfdlsp = data[i][67]=='是'?1:0;//是否代理索赔

                var dlspxlcmc = data[i][68];//代理索赔修理厂名称
                if(dlspxlcmc){
                    dlspxlcmc = dlspxlcmc.toString().trim();
                }
                var zfdxsfbbxr = data[i][69]=='是'?1:0;//支付对象是否被保险人
                var sczfcgTime = getNeedTime(data[i][70]);//首次支付成功时间
                var mczfcgTime = getNeedTime(data[i][71]);//末次支付成功时间
                var sczfthTime = getNeedTime(data[i][72]);//首次支付退回时间
                var sfczjth = data[i][73]=='是'?1:0;//是否曾质检退回
                var jasj = getNeedTime(data[i][74]);//结案时间
                var jaje = '0';//结案金额
                if(data[i][75]){
                    jaje = data[i][75].toString();
                }
                var csjaje = '0';//车损结案金额
                if(data[i][76]){
                    csjaje = data[i][76].toString();
                }
                var rsjaje = '0';//人伤结案金额
                if(data[i][77]){
                    rsjaje = data[i][77].toString();
                }
                var wsjaje = '0';//物损结案金额
                if(data[i][78]){
                    wsjaje = data[i][78].toString();
                }
                var ajtd = data[i][79];//案件通道
                if(ajtd){
                    ajtd = ajtd.toString().trim();
                }
                var ajzt = data[i][80];//案件状态
                if(ajzt){
                    ajzt = ajzt.toString().trim();
                }
                var pfcs = '0';//赔付次数
                if(data[i][81]){
                    pfcs = data[i][81].toString();
                }
                var wjzt = data[i][82];//未决状态
                if(wjzt){
                    wjzt = wjzt.toString().trim();
                }
                var wjje = '0';//未决金额
                if(data[i][83]){
                    wjje = data[i][83].toString();
                }
                var pfjl = data[i][84];//赔付结论
                if(pfjl){
                    pfjl = pfjl.toString().trim();
                }
                var sfxxycsjqq = data[i][85]=='是'?1:0;//是否信息一次收集齐全
                var yeqxfsckrwls = '0';//有E权限发送查勘任务流数
                if(data[i][86]){
                    yeqxfsckrwls = data[i][86].toString();
                }
                var elpfsckrwls = '0';//E理赔发送查勘任务流数
                if(data[i][87]){
                    elpfsckrwls = data[i][87].toString();
                }
                var fscsdsrwls = '0';//发送车损定损任务流数
                if(data[i][88]){
                    fscsdsrwls = data[i][88].toString();
                }
                var yeqxfsdsrwls = '0';//有E权限发送定损任务流数
                if(data[i][89]){
                    yeqxfsdsrwls = data[i][89].toString();
                }
                var elpfsdsrwls = '0';//E理赔发送定损任务流数
                if(data[i][90]){
                    elpfsdsrwls = data[i][90].toString();
                }
                var sfss = data[i][91]=='是'?1:0;//是否诉讼
                var baly = data[i][92];//报案来源
                if(baly){
                    baly = baly.toString().trim();
                }
                var zaje = '0';//整案金额
                if(data[i][93]){
                    zaje = data[i][93].toString();
                }
                var ckwtsljg = data[i][94];//查勘委托受理机构
                if(ckwtsljg){
                    ckwtsljg = ckwtsljg.toString().trim();
                }

                var pushMaintenance = {
                    rowNumber: i+1,insuranceComp:insuranceCompName.insuranceCompName,storeId: storeId,pushTime: pushTime,
                    reportNumber: reportNumber,insuranceNumber: insuranceNumber,carLicenseNumber:carLicenseNumber,
                    chassisNumber: chassisNumber,ppcx: ppcx,engineNumber: engineNumber,
                    reporter: reporter,reporterPhone: reporterPhone,accidentPlace: accidentPlace,
                    accidentTime: accidentTime,agencyCode: agencyCode,agencyName: agencyName,
                    channelSource: channelSource,groupType:groupType,insured:insured,
                    clerk: clerk,customerFlag: customerFlag,insuranceDateStart: insuranceDateStart,
                    insuranceDateEnd: insuranceDateEnd,sfhk: sfhk,clzws:clzws,driveArea:driveArea,
                    csxbe: csxbe,syszxbe: syszxbe,sfnzcxs:sfnzcxs,accidentReason:accidentReason,
                    reportTime: reportTime,bajsy: bajsy,cxjsy:cxjsy,sfxcba:sfxcba,sfmxc:sfmxc,
                    sslx: sslx,baclyj: baclyj,cwckr: cwckr,rsdhcky:rsdhcky,rssdcky:rssdcky,
                    sfdhck: sfdhck,sglx: sglx,dachr:dachr,dachsj:dachsj,zrxs:zrxs,sfrskckp:sfrskckp,
                    sdsj: sdsj,sdr: sdr,lasj: lasj,laje: laje,cslaje: cslaje,rslaje:rslaje,
                    wslaje:wslaje,sfrgls1:sfrgls1,sfrgls2:sfrgls2,zalsTimeStart:zalsTimeStart,
                    zalsTimeEnd:zalsTimeEnd,scrgzjTimeStart:scrgzjTimeStart,mcrgzjTimeEnd:mcrgzjTimeEnd,
                    scckTimeStart:scckTimeStart,mcckTimeEnd:mcckTimeEnd,dssfbhsjf:dssfbhsjf,
                    sftd:sftd,sctdTime:sctdTime,sfzdtd:sfzdtd,cwnbdcjsje:cwnbdcjsje,cwwbdcjsje:cwwbdcjsje,
                    jpje:jpje,fkjsje:fkjsje,zcje:zcje,sfdlsp:sfdlsp,dlspxlcmc:dlspxlcmc,
                    zfdxsfbbxr:zfdxsfbbxr,sczfcgTime:sczfcgTime,mczfcgTime:mczfcgTime,
                    sczfthTime:sczfthTime,sfczjth:sfczjth,jasj:jasj,jaje:jaje,csjaje:csjaje,
                    rsjaje:rsjaje,wsjaje:wsjaje,ajtd:ajtd,ajzt:ajzt,pfcs:pfcs,wjzt:wjzt,
                    wjje:wjje,pfjl:pfjl,sfxxycsjqq:sfxxycsjqq,yeqxfsckrwls:yeqxfsckrwls,
                    elpfsckrwls:elpfsckrwls,fscsdsrwls:fscsdsrwls,yeqxfsdsrwls:yeqxfsdsrwls,
                    elpfsdsrwls:elpfsdsrwls,sfss:sfss,baly:baly,zaje:zaje,ckwtsljg:ckwtsljg
                };
                allData.push(pushMaintenance);
            }
            var param = {data:JSON.stringify(allData),storeId:storeId};

            utilBsp.postToJava(web.bip, "/pushMaintenance/importPushMaintenance",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.success){
                        if(result.content.errorMessage){
                            fs.writeFileSync('./public/file/importPushMaintenanceMessage.txt', '');
                            var arr = result.content.errorMessage;
                            for(var i=0;i< arr.length;i++){
                                var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                                fs.appendFile('./public/file/importPushMaintenanceMessage.txt', data, function(err){
                                    if (err) logger.error(err);
                                });
                            }
                        }
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        }else if(importCategory == '维修记录'){
            if(data[0].length != 12){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                if(data[i].length ==0) continue;
                if(i==0) continue;
                var maintainNumber = data[i][0];//施工单号
                if(maintainNumber){
                    maintainNumber = maintainNumber.toString().trim();
                }
                var reportNumber = data[i][1];//报案号
                if(reportNumber){
                    reportNumber = reportNumber.toString().trim();
                }
                var maintenanceTimeStart = getNeedTime(data[i][2]);//维修开始时间
                var maintenanceTimeEnd = getNeedTime(data[i][3]);//维修结束时间
                var carLicenseNumber = data[i][4];//车牌号
                if(carLicenseNumber){
                    carLicenseNumber = carLicenseNumber.toString().trim();
                }
                var entrustor = data[i][5];//托修人
                if(entrustor){
                    entrustor = entrustor.toString().trim();
                }
                var entrustorPhone = data[i][6];//托修人联系方式
                if(entrustorPhone){
                    entrustorPhone = entrustorPhone.toString().trim();
                }
                var maintenanceType = data[i][7];//维修种类
                if(maintenanceType){
                    maintenanceType = maintenanceType.toString().trim();
                }
                var certainCost = '0';//定损金额(元)
                if(data[i][8]){
                    certainCost = data[i][8].toString();
                }

                var maintainCost = data[i][9];//维修金额(元)
                if(maintainCost){
                    maintainCost = maintainCost.toString();
                }
                var realCost = '0';//实收金额(元)
                if(data[i][10]){
                    realCost = data[i][10].toString();
                }
                var consultantName = data[i][11];//服务顾问名字
                if(consultantName){
                    consultantName = consultantName.toString().trim();
                }
                var maintainRecord = {
                    rowNumber: i+1,storeId:storeId,maintainNumber:maintainNumber,reportNumber:reportNumber,
                    maintenanceTimeStart:maintenanceTimeStart,maintenanceTimeEnd:maintenanceTimeEnd,
                    carLicenseNumber:carLicenseNumber,entrustor:entrustor,entrustorPhone:entrustorPhone,
                    maintenanceType:maintenanceType,certainCost:certainCost,maintainCost:maintainCost,
                    realCost:realCost,consultantName:consultantName
                };
                allData.push(maintainRecord);

            }
            var param = {data:JSON.stringify(allData),storeId:storeId};
            utilBsp.postToJava(web.bip, "/maintenance/importMaintenanceRecord",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/importMaintainRecordMessage.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/importMaintainRecordMessage.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    if(result.success){
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    //console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        } else if(importCategory == '配件记录'){
            if(data[0].length != 7){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                if(data[i].length ==0) continue;
                if(i==0) continue;
                var maintainNumber = data[i][0];//施工单号
                if(maintainNumber){
                    maintainNumber = maintainNumber.toString().trim();
                }
                var partName = data[i][1];//配件名称
                if(partName){
                    partName = partName.toString().trim();
                }
                var unit = data[i][2];//单位
                if(unit){
                    unit = unit.toString().trim();
                }
                var amount = '0';//数量
                if(data[i][3]){
                    amount = data[i][3].toString();
                }
                var unitPrice = '0';//单价(元)
                if(data[i][4]){
                    unitPrice = data[i][4].toString();
                }
                var totalAmount = '0';//总金额
                if(data[i][5]){
                    totalAmount = data[i][5].toString();
                }
                var remark = data[i][6];//备注
                if(remark){
                    remark = remark.toString().trim();
                }
                var part = {
                    rowNumber: i+1,storeId:storeId,maintainNumber:maintainNumber,partName:partName,
                    unit:unit,amount:amount,unitPrice:unitPrice,totalAmount:totalAmount,remark:remark
                };
                allData.push(part);

            }
            var param = {data:JSON.stringify(allData),storeId:storeId};

            utilBsp.postToJava(web.bip, "/maintenance/importMaintenancePart",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/importMaintenancePartMessage.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/importMaintenancePartMessage.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    if(result.success){
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    //console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        }else if(importCategory == '工时记录'){
            if(data[0].length != 5){
                fs.unlinkSync(source);
                resolve({status:web.fault,results:{message:"导入失败,请选择正确的导入模版",content:{}}});
                return;
            }
            for(var i=0; i<data.length; i++){
                if(data[i].length ==0) continue;
                if(i==0) continue;
                var maintainNumber = data[i][0];//施工单号
                if(maintainNumber){
                    maintainNumber = maintainNumber.toString().trim();
                }
                var maintenanceItem = data[i][1];//维修项目
                if(maintenanceItem){
                    maintenanceItem = maintenanceItem.toString().trim();
                }
                var workingHour = '0';//工时
                if(data[i][2]){
                    workingHour = data[i][2].toString();
                }
                var workingCost = '0';//工时费用(元)
                if(data[i][3]){
                    workingCost = data[i][3].toString();
                }
                var remark = data[i][4];//备注
                if(remark){
                    remark = remark.toString().trim();
                }
                var item = {
                    rowNumber: i+1,storeId:storeId,maintainNumber:maintainNumber,maintenanceItem:maintenanceItem,
                    workingHour:workingHour,workingCost:workingCost,remark:remark
                };
                allData.push(item);

            }
            var param = {data:JSON.stringify(allData),storeId:storeId};

            utilBsp.postToJava(web.bip, "/maintenance/importMaintenanceItem",param)
                .then(function (result) {
                    fs.unlinkSync(source);
                    if(result.content.errorMessage){
                        fs.writeFileSync('./public/file/importMaintenanceItemMessage.txt', '');
                        var arr = result.content.errorMessage;
                        for(var i=0;i< arr.length;i++){
                            var data ='第'+ arr[i].errorRow + '行:' + arr[i].errorString +'\n';
                            fs.appendFile('./public/file/importMaintenanceItemMessage.txt', data, function(err){
                                if (err) logger.error(err);
                            });
                        }
                    }
                    if(result.success){
                        resolve({status:web.success,results:result});
                    }else{
                        resolve({status:web.fault,results:result});
                    }
                })
                .catch(function (err) {
                    //console.log(err);
                    logger.error(err);
                    fs.unlinkSync(source);
                    reject({results:{message:"导入失败,程序出现错误"}});
                });
        }
    });
    return promise;
}

exports.importData  = importData;
exports.sleepBatch  = sleepBatch;
exports.importDefeat = importDefeat;
exports.tsxImport = tsxImport;
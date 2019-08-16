var PDF = require('pdfkit');            //including the pdfkit module
var fs = require('fs');


var a = {
    approvalBill: {
        carLicenseNumber: "桂A 324G34",
        chassisNumber: "LFV2A1BS8G4570839",
        engineNumber: "G12431",
        carBrand: "一汽大众",
        factoryLicenseType:"厂牌型号",
        vehicleModel: "高尔夫",
        jqxrqStart: "2016-09-30",
        jqxrqEnd: "2017-09-29",
        insurDate: "2016-09-09",
        renewalType: 5,
        renewalWay: "朋友介绍",
        solicitMember: "",
        insured: "张玉海",
        bbxrzjh: "452122199101019999",
        contact: "张玉海",
        contactWay: "13910081405",
        insurancTypes: "交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机," +
        "不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ,第三者责任保险," +
        "车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险,精神损失抚慰金责任险,指定修理厂险 ",
        kpxx: "543535中坚力量地地要扔的的伯失伯的国；地fjd塔吉克斯坦",
        syxje: 10344,
        jqxje: 4000,
        insuranceCompName: "平安",
        ccs: 3434,
        bfhj: "17778.00",
        kpje: 17000,
        yhje: 100,
        ssje: "17678.00",
        fkfs: "现金",
        fourSStoreId: 50,
        remark:"交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机,不计免划痕," +
        "不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ," +
        "第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险," +
        "精神损失抚慰金责任险,指定修理厂险,交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者)," +
        "不计免乘客,不计免司机,不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险," +
        "全车盗抢保险,自燃损失险,新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险," +
        "车上人员责任险(司机) ,第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险," +
        "车身划痕损失险,精神损失抚慰金责任险,指定修理厂险,交强+车船,不计免赔险(车损),不计免赔险(盗抢)," +
        "不计免赔险(三者),不计免乘客,不计免司机,不计免划痕,不计免涉水,不计免自燃,不计免精神损失电"
    },
    zsxxs: [
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台1"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台2"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台3"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台4"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台5"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台6"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台7"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台8"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台9"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台10"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台11"},
        {zsxx:"电脑一台电脑一台电脑一台电脑一台电脑一台12"}
    ]
}

var newSpdTestData = {
    approvalBill: {
        carLicenseNumber: "桂A 324G34",
        chassisNumber: "LFV2A1BS8G4570839",
        engineNumber: "G12431",
        carBrand: "一汽大众",
        factoryLicenseType:"厂牌型号",
        vehicleModel: "高尔夫",
        jqxrqStart: "2016-09-30",
        jqxrqEnd: "2017-09-29",
        insurDate: "2016-09-09",
        renewalType: 5,
        renewalWay: "朋友介绍",
        solicitMember: "",
        insured: "张玉海",
        bbxrzjh: "452122199101019999",
        contact: "张玉海",
        contactWay: "13910081405",
        insurancTypes: "交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机," +
        "不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ,第三者责任保险," +
        "车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险,精神损失抚慰金责任险,指定修理厂险 ",
        kpxx: "543535中坚力量地地要扔的的伯失伯的国；地fjd塔吉克斯坦",
        syxje: 10344,
        jqxje: 4000,
        insuranceCompName: "平安",
        ccs: 3434,
        bfhj: 17778.23,
        kpje: 17000,
        yhje: 100,
        ssje: "17678.00",
        fkfs: "现金",
        fourSStoreId: 50,
        giftDiscount:11111.23,
        comprehensiveDiscount:12345.67,
        xjyhdw: 0.1,
        czkje: 12345,
        czkjedw: 0.2,
        remark:"交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机,不计免划痕," +
        "不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ," +
        "第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险," +
        "精神损失抚慰金责任险,指定修理厂险,交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者)," +
        "不计免乘客,不计免司机,不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险," +
        "全车盗抢保险,自燃损失险,新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险," +
        "车上人员责任险(司机) ,第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险"
    },
    zsxxs: [
        {giftName:"电脑一台电脑一台电脑一台电脑一台电脑一台",validDate:'2017-01-09',amount:1,amountMoney:1000.11},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-02-09',amount:2,amountMoney:2000.22},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-03-09',amount:3,amountMoney:3000.33},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-04-09',amount:4,amountMoney:4000.44},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-05-09',amount:5,amountMoney:5000.55},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-06-09',amount:6,amountMoney:6000.66},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-07-09',amount:7,amountMoney:7000.77},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-08-09',amount:8,amountMoney:8000.88},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-09-09',amount:9,amountMoney:9000.99},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-10-09',amount:10,amountMoney:10000.00},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-11-09',amount:11,amountMoney:11000.22},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-12-09',amount:12,amountMoney:12000.33},
        {giftName:"电脑一台电脑一台电脑一台",validDate:'2017-12-09',amount:13,amountMoney:13000.33}
    ]
}

var hxdTestData = {
    carLicenseNumber: "桂A 324G34",
    chassisNumber: "LFV2A1BS8G4570840",
    engineNumber: "G12431",
    carBrand: "一汽大众",
    factoryLicenseType:"厂牌型号",
    vehicleModel: "高尔夫",
    jqxrqStart: "2016-09-30",
    jqxrqEnd: "2017-09-29",
    insurDate: "2016-09-09",
    renewalType: 5,
    renewalWay: "朋友介绍",
    solicitMember: "",
    insured: "张玉海",
    bbxrzjh: "452122199101019999",
    contact: "张玉海",
    contactWay: "13910081405",
    insurancTypes: "交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机," +
        "不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ,第三者责任保险," +
        "车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险,精神损失抚慰金责任险,指定修理厂险 ",
    kpxx: "543535中坚力量地地要扔的的伯失伯的国；地fjd塔吉克斯坦",
    syxje: 10344,
    jqxje: 4000,
    insuranceCompName: "平安",
    ccs: 3434,
    bfhj: 17778.23,
    kpje: 17000,
    yhje: 100,
    ssje: "17678.00",
    fkfs: "现金",
    fourSStoreId: 50,
    giftDiscount:11111.23,
    comprehensiveDiscount:12345.67,
    remark:"交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者),不计免乘客,不计免司机,不计免划痕," +
        "不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险,全车盗抢保险,自燃损失险," +
        "新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险,车上人员责任险(司机) ," +
        "第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险,车身划痕损失险," +
        "精神损失抚慰金责任险,指定修理厂险,交强+车船,不计免赔险(车损),不计免赔险(盗抢),不计免赔险(三者)," +
        "不计免乘客,不计免司机,不计免划痕,不计免涉水,不计免自燃,不计免精神损失,涉水行驶损失险,机动车损失保险," +
        "全车盗抢保险,自燃损失险,新增设备损失险,机动车损失保险无法找到第三方特约险,玻璃单独破碎险," +
        "车上人员责任险(司机) ,第三者责任保险,车上人员责任险(乘客),车上货物责任险,修理期间费用补偿险",
    givingInformations: [
        {giftName:"电脑一台电脑一台电脑一台电脑一台电脑一台",giftType:1,thisUseNum:1,surplusNum:1,amount:2},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:2,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:4,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:4,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:4,thisUseNum:2,surplusNum:2,amount:4},
        {giftName:"电脑一台电脑一台电脑一台",giftType:5,thisUseNum:200,surplusNum:200,amount:400},
        {giftName:"电脑一台电脑一台电脑一台",giftType:5,thisUseNum:200,surplusNum:200,amount:400},
        {giftName:"电脑一台电脑一台电脑一台",giftType:5,thisUseNum:200,surplusNum:200,amount:400}
    ]
}

var coverTypes = [{id:1,coverType:'新保'},{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
    {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];

//测试老审批单打印
//get_spd(a,function(){
//    console.log("成功");
//});

//测试新审批单打印
//getSpdNew(newSpdTestData,function(){
// console.log("成功");
// });

//测试核销单打印
//getHxd(hxdTestData,function(){
//    console.log("成功1");
//});

function get_spd(spdInfo,callback) {

    var approvalBill = spdInfo.approvalBill;
    for (var i = 0; i < coverTypes.length; i++) {
        if (coverTypes[i].id == approvalBill.renewalType) {
            approvalBill.renewalType = coverTypes[i].coverType
        }
    }
    var zsxxs = spdInfo.zsxxs;
    doc = new PDF();                        //creating a new PDF object
    var fileHeadPath = '';
    var fileHeadPath_exists = fs.existsSync('../public/');
    if(fileHeadPath_exists == true){
        fileHeadPath = '../public/';
    }else{
        fileHeadPath = 'public/';
    }
    writeStream =fs.createWriteStream(fileHeadPath+'pdf/'+approvalBill.chassisNumber+'.pdf');
    doc.pipe(writeStream);  //creating a write stream
    //doc.font(fileHeadPath+'fonts/weiruanyaheijianti.ttf',8)
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',14)
    doc.text('审批单', 280, 20);


    doc.path('M 40,40 L 565,40 L 565,675  L 40,675 L 40,40')  //外框
        .lineWidth(0.5)
        .stroke()
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',9)

    doc.text('车辆信息', 45, 60)
    doc.text('保险信息', 45, 238)
    doc.text('财务信息', 45, 470)
    doc.text('赠送信息', 45, 620)

    doc.text('车牌号', 100, 48).text('车架号', 255, 48).text('发动机号', 415, 48)
    doc.text('品  牌', 100, 73).text('车 型', 258, 73).text('车型号',416,73)

    doc.text('保险到期日', 92, 98).text('续保类型', 255, 98).text('续保渠道', 415, 98)
    doc.text('投保日期', 95, 123).text('被保险人', 255, 123).text('被保险人证件号', 415, 116, {width: 40})
    doc.text('保险公司', 95, 148).text('联系人', 255, 148).text('联系方式', 415, 148)
    doc.text('开票信息', 95, 173)
    doc.text('商业险险种', 92, 223)
    doc.text('备  注', 95, 333)

    doc.text('商业险金额', 92, 430).text('交强险金额', 252, 430).text('车船税', 415, 430)
    doc.text('保费合计', 95, 455).text('开票金额', 255, 455).text('优惠金额', 415, 455)
    doc.text('实收金额', 95, 480).text('出单员签字', 252, 480)
    doc.text('付款方式', 95, 505).text('收银员签字', 252, 505)
    //doc.text('备  注', 95, 438)
    doc.text('1', 100, 533).text('2', 340, 533)
    doc.text('3', 100, 558).text('4', 340, 558)
    doc.text('5', 100, 583).text('6', 340, 583)
    doc.text('7', 100, 608).text('8', 340, 608)
    doc.text('9', 100, 633).text('10', 340, 633)
    doc.text('11', 100, 658).text('12', 340, 658)


    doc.moveTo(40, 90).lineTo(90, 90).stroke();
    doc.moveTo(40, 425).lineTo(90, 425).stroke();
    doc.moveTo(40, 525).lineTo(90, 525).stroke();

    //横线
    var y1 = 65;
    for (var i = 0; i < 17; i++) {
        doc.moveTo(90, y1).lineTo(565, y1).stroke();
        if (i == 5) {
            y1 = y1 + 75;
        } else {
            y1 = y1 + 25;
        }
        if(i==6){
            y1 = y1 + 135
        }
    }
    //竖线
    doc.moveTo(90, 40).lineTo(90, 675).stroke();
    doc.moveTo(140, 40).lineTo(140, 525).stroke();

    //车辆信息、保险信息竖线
    x1 = 250;
    for (var i = 0; i < 4; i++) {
        if(i<2){
            doc.moveTo(x1, 40).lineTo(x1, 165).stroke();
        }else {
            doc.moveTo(x1, 40).lineTo(x1, 165).stroke();
        }
        if ((i + 1) / 2 % 1) {
            x1 = x1 + 50;
        } else {
            x1 = x1 + 110;
        }
    }

    //财务信息竖线
    x2 = 250;
    for (var i = 0; i < 4; i++) {
        if(i>1){
            doc.moveTo(x2, 425).lineTo(x2, 475).stroke();
        }else {
            doc.moveTo(x2, 425).lineTo(x2, 525).stroke();
        }
        if ((i + 1) / 2 % 1) {
            x2 = x2 + 50;
        } else {
            x2 = x2 + 110;
        }

    }

    //赠送信息竖线
    doc.moveTo(115, 525).lineTo(115, 675).stroke();
    doc.moveTo(330, 525).lineTo(330, 675).stroke();
    doc.moveTo(355, 525).lineTo(355, 675).stroke();

    //主管签字
    doc.text('主管签字：', 40, 700)
    doc.moveTo(85, 710).lineTo(150, 710).stroke();

    //主管签字
    doc.text('经理签字：', 250, 700)
    doc.moveTo(295, 710).lineTo(360, 710).stroke();

    //主管签字
    doc.text('客户签字：', 460, 700)
    doc.moveTo(505, 710).lineTo(565, 710).stroke();

    doc.font(fileHeadPath+'fonts/simhei.ttf',9);
    doc.text('', 150, 190).moveDown()
        .text(approvalBill.insurancTypes, {
            width: 412,
            align: 'justify',
            indent: 10,
            height: 300,
            ellipsis: true
        });

    doc.text(approvalBill.carLicenseNumber, 150, 48).text(approvalBill.chassisNumber, 305, 48).text(approvalBill.engineNumber, 465, 48)
    doc.text(approvalBill.carBrand, 150, 73).text(approvalBill.vehicleModel, 305, 73).text(approvalBill.factoryLicenseType,465,73)

    doc.text(approvalBill.jqxrqEnd, 150, 98).text(approvalBill.renewalType, 305, 98).text(approvalBill.renewalWay, 465, 98)
    doc.text(approvalBill.insurDate, 150, 123).text(approvalBill.insured, 305, 123).text(approvalBill.bbxrzjh, 465, 123, {width: 100})
    doc.text(approvalBill.insuranceCompName, 150, 148).text(approvalBill.contact, 305, 148).text(approvalBill.contactWay, 465, 148)
    doc.text(approvalBill.kpxx, 150, 173)
    doc.text(approvalBill.remark ,150, 275)

    doc.text(approvalBill.syxje, 150, 430).text(approvalBill.jqxje, 305, 430).text(approvalBill.ccs, 465, 430)
    doc.text(approvalBill.bfhj, 150, 455).text(approvalBill.kpje, 305, 455).text(approvalBill.yhje, 465, 455)
    doc.text(approvalBill.ssje ,150, 480)
    doc.text(approvalBill.fkfs ,150, 505)

    doc.text(zsxxs[0].zsxx, 125, 533).text(zsxxs[1].zsxx, 365, 533)
    doc.text(zsxxs[2].zsxx, 125, 558).text(zsxxs[3].zsxx, 365, 558)
    doc.text(zsxxs[4].zsxx, 125, 583).text(zsxxs[5].zsxx, 365, 583)
    doc.text(zsxxs[6].zsxx, 125, 608).text(zsxxs[7].zsxx, 365, 608)
    doc.text(zsxxs[8].zsxx, 125, 633).text(zsxxs[9].zsxx, 365, 633)
    doc.text(zsxxs[10].zsxx, 125, 658).text(zsxxs[11].zsxx, 365, 658)


    // more things can be added here including new pages
    doc.end(); //we end the document writing.
    writeStream.on('finish', function () {
        if(callback){
            callback();
        }
    });
    /*var oneSecond = 1000 * 1;
    setTimeout(function() {
        if(callback){
            callback();
        }
    }, oneSecond);*/


}


function getSpdNew(spdInfo,callback) {
    var approvalBill = spdInfo.approvalBill;
    for (var i = 0; i < coverTypes.length; i++) {
        if (coverTypes[i].id == approvalBill.renewalType) {
            approvalBill.renewalType = coverTypes[i].coverType
        }
    }
    var zsxxs = spdInfo.zsxxs;
    doc = new PDF();                        //creating a new PDF object
    var fileHeadPath = '';
    var fileHeadPath_exists = fs.existsSync('../public/');
    if(fileHeadPath_exists == true){
        fileHeadPath = '../public/';
    }else{
        fileHeadPath = 'public/';
    }
    writeStream =fs.createWriteStream(fileHeadPath+'pdf/'+approvalBill.chassisNumber+'.pdf',{encoding: 'utf8'});
    doc.pipe(writeStream);  //creating a write stream
    //doc.font(fileHeadPath+'fonts/weiruanyaheijianti.ttf',8)
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',14)
    doc.text('审批单', 280, 20);


    doc.path('M 40,40 L 565,40 L 565,690  L 40,690 L 40,40')  //外框
        .lineWidth(0.5)
        .stroke()
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',9)

    doc.text('车辆信息', 45, 52)
    doc.text('保险信息', 45, 198)
    doc.text('财务信息', 45, 375)
    doc.text('赠送信息', 45, 560)

    doc.text('车牌号', 100, 43).text('车架号', 255, 43).text('发动机号', 415, 43)
    doc.text('品  牌', 100, 65).text('车 型', 258, 65).text('车型号',416,65)

    doc.text('保险到期日', 92, 85).text('续保类型', 255, 85).text('续保渠道', 415, 85)
    doc.text('投保日期', 95, 105).text('被保险人', 255, 105).text('被保险人证件号', 415, 101, {width: 40})
    doc.text('保险公司', 95, 128).text('联系人', 255, 128).text('联系方式', 415, 128)
    doc.text('开票信息', 95, 148)
    doc.text('商业险险种', 92, 193)
    doc.text('备  注', 103, 275)

    doc.text('商业险金额', 102, 334).text('交强险金额', 260, 334).text('车船税', 412, 334)
    doc.text('保费合计', 108,354 ).text('付款方式', 335,354 )
    doc.text('现金优惠', 108, 374).text('现金优惠点位',260, 374).text('储值卡金额', 405, 374)
    doc.text('储值卡金额点位',94 , 394).text('赠送优惠', 265, 394).text('综合优惠', 408, 394)
    doc.text('出单员签字', 100, 414).text('收银员签字', 330, 414)

    doc.text('赠品名称', 200, 434).text('数量', 365, 434).text('金额', 430, 434).text('有效期至', 502, 434)

    //第一列的3条横线
    doc.moveTo(40, 80).lineTo(90, 80).stroke();
    doc.moveTo(40, 330).lineTo(90, 330).stroke();
    doc.moveTo(40, 430).lineTo(90, 430).stroke();

    //横线
    var y1 = 60;
    for (var i = 0; i < 24; i++) {
        doc.moveTo(90, y1).lineTo(565, y1).stroke();
        if (i == 2) {
            y1 = y1 + 25;
        } else if(i==5){
            y1 = y1 + 65;
        } else if(i==6){
            y1 = y1 + 100;
        } else {
            y1 = y1 + 20;
        }
    }
    //竖线
    //第二条竖线
    doc.moveTo(90, 40).lineTo(90, 690).stroke();
    //第三条竖线,到财务信息即停
    doc.moveTo(140, 40).lineTo(140, 330).stroke();
    //第三条竖线,财务信息
    doc.moveTo(160, 330).lineTo(160, 430).stroke();

    //车辆信息、保险信息竖线
    x1 = 250;
    for (var i = 0; i < 4; i++) {
        if(i<2){
            doc.moveTo(x1, 40).lineTo(x1, 145).stroke();
        }else {
            doc.moveTo(x1, 40).lineTo(x1, 145).stroke();
        }
        if ((i + 1) / 2 % 1) {
            x1 = x1 + 50;
        } else {
            x1 = x1 + 110;
        }
    }

    //财务信息竖线
    x2 = 250;
    for (var i = 0; i < 4; i++) {
        if(i==0 ||i==3){
            doc.moveTo(x2, 330).lineTo(x2, 350).stroke();
            doc.moveTo(x2, 370).lineTo(x2, 410).stroke();
        }else {
            doc.moveTo(x2, 330).lineTo(x2, 430).stroke();
        }
        x2 = x2 + 70;
    }

    //赠送信息竖线
    doc.moveTo(350, 430).lineTo(350, 690).stroke();
    doc.moveTo(400, 430).lineTo(400, 690).stroke();
    doc.moveTo(480, 430).lineTo(480, 690).stroke();

    //主管签字
    doc.text('主管签字：', 40, 705)
    doc.moveTo(85, 715).lineTo(150, 715).stroke();

    //主管签字
    doc.text('经理签字：', 250, 705)
    doc.moveTo(295, 715).lineTo(360, 715).stroke();

    //主管签字
    doc.text('客户签字：', 460, 705)
    doc.moveTo(505, 715).lineTo(565, 715).stroke();

    doc.font(fileHeadPath+'fonts/simhei.ttf',9);

    doc.text(approvalBill.carLicenseNumber, 150, 43).text(approvalBill.chassisNumber, 305, 43).text(approvalBill.engineNumber, 465, 43)
    doc.text(approvalBill.carBrand, 150, 65).text(approvalBill.vehicleModel, 305, 65).text(approvalBill.factoryLicenseType,465,65)

    doc.text(approvalBill.jqxrqEnd, 150, 85).text(approvalBill.renewalType, 305, 85).text(approvalBill.renewalWay, 465, 85)
    doc.text(approvalBill.insurDate, 150, 105).text(approvalBill.insured, 305, 105).text(approvalBill.bbxrzjh, 465, 105, {width: 100})
    doc.text(approvalBill.insuranceCompName, 150, 128).text(approvalBill.contact, 305, 128).text(approvalBill.contactWay, 465, 128)
    doc.text(approvalBill.kpxx, 150, 148)
    doc.text('', 150, 157).moveDown()
        .text(approvalBill.insurancTypes, {
            width: 412,
            align: 'justify',
            indent: 10,
            height: 300,
            ellipsis: true
        });
    doc.text('', 150, 235).text(approvalBill.remark,{
        width: 412,
        align: 'justify',
        indent: 10,
        height: 300,
        ellipsis: true
    })

    //财务信息内容填充
    doc.text(approvalBill.syxje, 170, 334).text(approvalBill.jqxje, 330, 334).text(approvalBill.ccs, 465, 334)
    doc.text(approvalBill.bfhj ,170, 354).text(approvalBill.fkfs ,412, 354)
    doc.text(approvalBill.yhje, 170, 374).text(approvalBill.xjyhdw, 330, 374).text(approvalBill.czkje, 465, 374)
    doc.text(approvalBill.czkjedw, 170, 394).text(approvalBill.giftDiscount, 330, 394).text(approvalBill.comprehensiveDiscount, 465, 394)

    //赠品信息内容填充
    var lineHeight = 454;
    for(var j=0;j<zsxxs.length;j++){
        if(j>=12) break;
        doc.text(zsxxs[j].giftName, 100, lineHeight)
           .text(zsxxs[j].amount, 370, lineHeight)
           .text(zsxxs[j].amountMoney, 420, lineHeight)
           .text(zsxxs[j].validDate.substring(0,10), 490, lineHeight)
        lineHeight+=20;
    }

    // more things can be added here including new pages
    doc.end(); //we end the document writing.
    writeStream.on('finish', function () {
        if(callback){
            callback();
        }
    });

}

function getHxd(hxdInfo,callback) {
    for (var i = 0; i < coverTypes.length; i++) {
        if (coverTypes[i].id == hxdInfo.renewalType) {
            hxdInfo.renewalType = coverTypes[i].coverType
        }
    }
    var zsxxs = hxdInfo.givingInformations;
    console.log(zsxxs);
    var hxxx = [];
    for(var z=0;z<zsxxs.length;z++){
        if(zsxxs[z].giftType==1){
            zsxxs[z].giftType = '服务类';
            hxxx.push(zsxxs[z]);
        }else if(zsxxs[z].giftType==4){
            zsxxs[z].giftType = '储值卡';
            hxxx.push(zsxxs[z]);
        }else if(zsxxs[z].giftType==5){
            zsxxs[z].giftType = '会员积分';
            hxxx.push(zsxxs[z]);
        }
    }
    doc = new PDF();                        //creating a new PDF object
    var fileHeadPath = '';
    var fileHeadPath_exists = fs.existsSync('../public/');
    if(fileHeadPath_exists == true){
        fileHeadPath = '../public/';
    }else{
        fileHeadPath = 'public/';
    }
    writeStream =fs.createWriteStream(fileHeadPath+'pdf/'+hxdInfo.chassisNumber+'.pdf',{encoding: 'utf8'});
    doc.pipe(writeStream);  //creating a write stream
    //doc.font(fileHeadPath+'fonts/weiruanyaheijianti.ttf',8)
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',14)
    doc.text('赠品核销', 280, 20);

    doc.path('M 40,40 L 565,40 L 565,590  L 40,590 L 40,40')  //外框
        .lineWidth(0.5)
        .stroke()
    doc.font(fileHeadPath+'fonts/weiruanyaheichuti.ttf',9)

    doc.text('车辆信息', 45, 60)
    doc.text('保险信息', 45, 163)
    doc.text('赠送信息', 45, 440)

    doc.text('车牌号', 100, 48).text('车架号', 255, 48).text('发动机号', 415, 48)
    doc.text('品  牌', 100, 73).text('车 型', 258, 73).text('车型号',416,73)

    doc.text('保险到期日', 92, 98).text('续保类型', 255, 98).text('续保渠道', 415, 98)
    doc.text('投保日期', 95, 123).text('被保险人', 255, 123).text('被保险人证件号', 415, 116, {width: 40})
    doc.text('保险公司', 95, 148).text('联系人', 255, 148).text('联系方式', 415, 148)
    doc.text('开票信息', 95, 173)
    doc.text('商业险险种', 92, 223)

    doc.text('赠品名称',200,271).text('赠品类型',330,271).text('数量',400,271).text('本次使用',450,271).text('剩余',522,271)

    //第一列的3条横线
    doc.moveTo(40, 90).lineTo(90, 90).stroke();
    doc.moveTo(40, 265).lineTo(90, 265).stroke();
    //doc.moveTo(40, 365).lineTo(90, 365).stroke();

    //横线
    var y1 = 65;
    for (var i = 0; i < 19; i++) {
        doc.moveTo(90, y1).lineTo(565, y1).stroke();
        if (i == 5) {
            y1 = y1 + 75;
        } else {
            y1 = y1 + 25;
        }
    }
    //竖线
    //第二条竖线
    doc.moveTo(90, 40).lineTo(90, 590).stroke();
    //地三条竖线
    doc.moveTo(140, 40).lineTo(140, 265).stroke();

    //车辆信息、保险信息竖线
    x1 = 250;
    for (var i = 0; i < 4; i++) {
        if(i<2){
            doc.moveTo(x1, 40).lineTo(x1, 165).stroke();
        }else {
            doc.moveTo(x1, 40).lineTo(x1, 165).stroke();
        }
        if ((i + 1) / 2 % 1) {
            x1 = x1 + 50;
        } else {
            x1 = x1 + 110;
        }
    }

    //赠送信息竖线
    doc.moveTo(320, 265).lineTo(320, 590).stroke();
    doc.moveTo(380, 265).lineTo(380, 590).stroke();
    doc.moveTo(440, 265).lineTo(440, 590).stroke();
    doc.moveTo(500, 265).lineTo(500, 590).stroke();

    //主管签字
    doc.text('主管签字：', 40, 705)
    doc.moveTo(85, 715).lineTo(150, 715).stroke();

    //主管签字
    doc.text('经理签字：', 250, 705)
    doc.moveTo(295, 715).lineTo(360, 715).stroke();

    //主管签字
    doc.text('客户签字：', 460, 705)
    doc.moveTo(505, 715).lineTo(565, 715).stroke();

    doc.font(fileHeadPath+'fonts/simhei.ttf',10);

    doc.text(hxdInfo.carLicenseNumber, 150, 48).text(hxdInfo.chassisNumber, 305, 48).text(hxdInfo.engineNumber, 465, 48)
    doc.text(hxdInfo.carBrand, 150, 73).text(hxdInfo.vehicleModel, 305, 73).text(hxdInfo.factoryLicenseType,465,73)

    doc.text(new Date(hxdInfo.jqxrqEnd).toLocaleDateString(), 150, 98).text(hxdInfo.renewalType, 305, 98).text(hxdInfo.renewalWay, 465, 98)
    doc.text(new Date(hxdInfo.insurDate).toLocaleDateString(), 150, 123).text(hxdInfo.insured, 305, 123).text(hxdInfo.bbxrzjh, 465, 123, {width: 100})
    doc.text(hxdInfo.insuranceCompName, 150, 148).text(hxdInfo.contact, 305, 148).text(hxdInfo.contactWay, 465, 148)
    doc.text(hxdInfo.kpxx, 150, 173)
    doc.text('', 150, 190).moveDown()
        .text(hxdInfo.insurancTypes, {
            width: 412,
            align: 'justify',
            indent: 10,
            height: 300,
            ellipsis: true
        });

    //赠品信息内容填充
    var lineHeight = 300;
    for(var j=0;j<hxxx.length;j++){
        if(j>=12) break;
        doc.text(hxxx[j].giftName, 100, lineHeight)
            .text(hxxx[j].giftType, 325, lineHeight)
            .text(hxxx[j].amount, 390, lineHeight)
            .text(hxxx[j].thisUseNum, 445, lineHeight)
            .text(hxxx[j].surplusNum, 515, lineHeight)
        lineHeight+=25;
    }

    // more things can be added here including new pages
    doc.end(); //we end the document writing.
    writeStream.on('finish', function () {
        if(callback){
            callback();
        }
    });
}

exports.get_spd = get_spd;
exports.getSpdNew =getSpdNew;
exports.getHxd =getHxd;
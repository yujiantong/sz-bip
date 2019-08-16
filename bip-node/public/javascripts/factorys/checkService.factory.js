angular.module('myApp')
    .factory('checkService', function () {
        var reg = /^[a-zA-Z0-9]{17}$/ ;//车架号
        var re_card = /^[\u4E00-\u9Fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$/;//车牌号
        var bjtbxz = function(xzInfo,bihubaojia){
            if(!xzInfo.LicenseNo||xzInfo.LicenseNo==''){
                var result = {
                    status : false,
                    message:"车牌号不能为空"}
                return result;
            }
            if(!(re_card.test(xzInfo.LicenseNo))){
                var result = {
                    status : false,
                    message:"车牌号格式不对！（例如：京Q11111）"}
                return result;
            };
            if(bihubaojia.SiJick==1&&xzInfo.SiJi==0){
                var result = {
                    status : false,
                    message:"请输入车上人员责任险(司机)保额应在“1万-30万”之间"}
                return result;
            }
            if(xzInfo.SiJi!=0&&(xzInfo.SiJi>300000||xzInfo.SiJi<10000)){
                var result = {
                    status : false,
                    message:"车上人员责任险(司机)保额应在“1万-30万”之间"}
                return result;
            }
            if(bihubaojia.ChengKeck==1&&xzInfo.ChengKe==0){
                var result = {
                    status : false,
                    message:"请输入车上人员责任险(乘客)保额应在“1万-30万”之间"}
                return result;
            }
            if(xzInfo.ChengKe!=0&&(xzInfo.ChengKe>300000||xzInfo.ChengKe<10000)){
                var result = {
                    status : false,
                    message:"车上人员责任险(乘客)保额应在“1万-30万”之间"}
                return result;
            }
            if(bihubaojia.SanZheck==1&&xzInfo.SanZhe==0){
                var result = {
                    status : false,
                    message:"请选择第三者责任保险金额"}
                return result;
            }
            if(bihubaojia.HcHuock==1&&xzInfo.HcHuoWuZeRen==0){
                var result = {
                    status : false,
                    message:"请输入车上货物责任险金额"}
                return result;
            }
            if(bihubaojia.HcFeiYongck==1&&xzInfo.HcFeiYongBuChang==0){
                var result = {
                    status : false,
                    message:"请输入修理期间费用补偿险金额"}
                return result;
            }
            if(bihubaojia.HuaHenck==1&&xzInfo.HuaHen==0){
                var result = {
                    status : false,
                    message:"请选择车身划痕损失险金额"}
                return result;
            }
            if(bihubaojia.BoLick==1&&xzInfo.BoLi==0){
                var result = {
                    status : false,
                    message:"请选择玻璃破碎险类型"}
                return result;
            }
            if(bihubaojia.HcJingShenck==1&&xzInfo.HcJingShenSunShi==0){
                var result = {
                    status : false,
                    message:"请输入精神损失抚慰金责任险金额"}
                return result;
            }
            if(bihubaojia.HcXiuLick==1&&xzInfo.HcXiuLiChang==0){
                var result = {
                    status : false,
                    message:"请输入指定修理厂险金额"}
                return result;
            }

            if(xzInfo.BuJiMianCheSun>0&&xzInfo.CheSun<=0){
                var result = {
                    status : false,
                    message:"不选择“机动车损失保险”,不能选择“不计免赔险(车损)”"}
                return result;
            }
            if(xzInfo.BuJiMianDaoQiang>0&&xzInfo.DaoQiang<=0){
                var result = {
                    status : false,
                    message:"不选择“全车盗抢保险”,不能选择“不计免赔险(盗抢) ”"}
                return result;
            }
            if(xzInfo.BuJiMianSanZhe>0&&xzInfo.SanZhe<=0){
                var result = {
                    status : false,
                    message:"不选择“第三者责任保险”,不能选择“不计免赔险(三者) ”"}
                return result;
            }
            if(xzInfo.BuJiMianChengKe>0&&xzInfo.ChengKe<=0){
                var result = {
                    status : false,
                    message:"不选择“车上人员责任险(乘客)”,不能选择“不计免乘客”"}
                return result;
            }
            if(xzInfo.BuJiMianSiJi>0&&xzInfo.SiJi<=0){
                var result = {
                    status : false,
                    message:"不选择“车上人员责任险(司机)”,不能选择“不计免司机”"}
                return result;
            }
            if(xzInfo.BuJiMianHuaHen>0&&xzInfo.HuaHen<=0){
                var result = {
                    status : false,
                    message:"不选择“车身划痕损失险”,不能选择“不计免划痕”"}
                return result;
            }
            if(xzInfo.BuJiMianSheShui>0&&xzInfo.SheShui<=0){
                var result = {
                    status : false,
                    message:"不选择“涉水行驶损失险”,不能选择“不计免涉水”"}
                return result;
            }
            if(xzInfo.BuJiMianZiRan>0&&xzInfo.ZiRan<=0){
                var result = {
                    status : false,
                    message:"不选择“自燃损失险”,不能选择“不计免自燃”"}
                return result;
            }
            if(xzInfo.HcSanFangTeYue>0&&xzInfo.CheSun<=0){
                var result = {
                    status : false,
                    message:"不选择“机动车损失保险”,不能选择“机动车损失保险无法找到第三方特约险”"}
                return result;
            }
            if(xzInfo.HcJingShenSunShi>0&&xzInfo.ChengKe<=0&&xzInfo.SiJi<=0&&xzInfo.SanZhe<=0){
                var result = {
                    status : false,
                    message:"“第三者责任保险、车上人员责任险(司机)、车上人员责任险(乘客)" +
                    "”任选其一,才能选择“精神损失抚慰金责任险”"}
                return result;
            }
            if(xzInfo.BuJiMianJingShenSunShi>0&&xzInfo.HcJingShenSunShi<=0){
                var result = {
                    status : false,
                    message:"不选择“精神损失抚慰金责任险”,不能选择“不计免精神损失”"}
                return result;
            }
            var result = {
                status : true,
                message:"验证成功"}
            return result;
        };
        var qkxxxz = function(qkInfo){
            if(!qkInfo.chassisNumber||qkInfo.chassisNumber==''){
                var result = {
                    status : false,
                    message:"车架号不能为空"}
                return result;
            }
            if(!reg.test(qkInfo.chassisNumber.trim())){
                var result = {
                    status : false,
                    message:"车架号错误，应为17位字母或数字组成"}
                return result;
            }
            if(!qkInfo.renewalType||qkInfo.renewalType==''){
                var result = {
                    status : false,
                    message:"投保类型不能为空"}
                return result;
            }
            if(!qkInfo.jqxrqEnd||qkInfo.jqxrqEnd==''){
                var result = {
                    status : false,
                    message:"交强险日期结束不能为空"}
                return result;
            }
            if(!qkInfo.insured||qkInfo.insured==''){
                var result = {
                    status : false,
                    message:"被保险人不能为空"}
                return result;
            }
            if(!qkInfo.contact||qkInfo.contact==''){
                var result = {
                    status : false,
                    message:"联系人不能为空"}
                return result;
            }
            if(!qkInfo.contactWay||qkInfo.contactWay==''){
                var result = {
                    status : false,
                    message:"联系方式不能为空"}
                return result;
            }
            if(!(/^([0-9-]+)$/.test(qkInfo.contactWay))){
                var result = {
                    status : false,
                    message:"联系方式填写有误"}
                return result;
            }
            var result = {
                status : true,
                message:"验证成功"}
            return result;
        };
        //行驶证信息校验
        var xszInfoCheck = function(xszInfo){
            if(!xszInfo.LicenseNo||xszInfo.LicenseNo==''){
                var result = {
                    status : false,
                    message:"车牌号不能为空"}
                return result;
            }
            if(!(re_card.test(xszInfo.LicenseNo))){
                var result = {
                    status : false,
                    message:"车牌号格式不对！（例如：京Q11111）"}
                return result;
            };
            if(!xszInfo.CarVin||xszInfo.CarVin==''){
                var result = {
                    status : false,
                    message:"车架号不能为空"}
                return result;
            }
            if(!xszInfo.EngineNo||xszInfo.EngineNo==''){
                var result = {
                    status : false,
                    message:"发动机号不能为空"}
                return result;
            }
            if(!xszInfo.RegisterDate||xszInfo.RegisterDate==''){
                var result = {
                    status : false,
                    message:"注册日期不能为空"}
                return result;
            }
            if(!xszInfo.MoldName||xszInfo.MoldName==''){
                var result = {
                    status : false,
                    message:"品牌型号不能为空"}
                return result;
            }
            var sfPublic = false;
            if(xszInfo.CarUsedType&&(xszInfo.CarUsedType==2||xszInfo.CarUsedType==3)){
                sfPublic = true;
            }
            if(sfPublic&&(!xszInfo.OwnerIdCardType||xszInfo.OwnerIdCardType==''||xszInfo.OwnerIdCardType==0
                ||xszInfo.OwnerIdCardType==1)){
                var result = {
                    status : false,
                    message:"车辆使用性质选择‘党政机关、事业团体’，‘非营业企业客车’时，车主证件类型必须为‘组织机构代码证’"}
                return result;
            }
            if(sfPublic&&(!xszInfo.CarOwnersName||xszInfo.CarOwnersName=='')){
                var result = {
                    status : false,
                    message:"车辆使用性质选择‘党政机关、事业团体’，‘非营业企业客车’时，车主姓名不能为空"}
                return result;
            }
            if(sfPublic&&(!xszInfo.IdCard||xszInfo.IdCard=='')){
                var result = {
                    status : false,
                    message:"车辆使用性质选择‘党政机关、事业团体’，‘非营业企业客车’时，车主证件号不能为空"}
                return result;
            }
            var result = {
                status : true,
                message:"验证成功"}
            return result;
        }

        return {
            bjtbxz: function (xzInfo,bihubaojia) {
                return bjtbxz(xzInfo,bihubaojia);
               },
            qkxxxz: function (qkInfo) {
                return qkxxxz(qkInfo);
            },
            xszInfo: function (xszInfo) {
                return xszInfoCheck(xszInfo);
            }
        };

    })
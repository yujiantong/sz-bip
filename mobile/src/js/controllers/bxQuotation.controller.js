angular.module('starter')
  .controller('BXQuotationController', ['$scope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','customerDetailsService','$ionicLoading','$ionicModal','$filter','pubHelper',
    function($scope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,customerDetailsService,$ionicLoading,$ionicModal,$filter,pubHelper) {
      var ctrl = this;

      ctrl.goBack = goBack;
      ctrl.stateChange = stateChange;
      ctrl.customerId = $stateParams.customerId;
      ctrl.contact = $stateParams.contact;
      ctrl.userName = $stateParams.userName;
      ctrl.userId = $stateParams.userId;
      ctrl.storeId = $stateParams.storeId;
      ctrl.gzcxdata = $stateParams.gzcxdata;
      ctrl.bxInsurance = bxInsurance;
      ctrl.carUsedTypes = [{id:1,vlaue:'家庭自用车'},{id:2,vlaue:'党政机关、事业团体'},{id:3,vlaue:'非营业企业客车'}];
      ctrl.findCustomerDetailsByCustomerId = findCustomerDetailsByCustomerId;
      ctrl.findCustomerDetailsByCustomerId();
      //根据4s店id查询保险公司信息
      ctrl.findCompInfoByStoreId = findCompInfoByStoreId;
      ctrl.insuranceStatus = false;
      ctrl.insuranceS = false;
      ctrl.findBxInfoForBH = findBxInfoForBH;
      ctrl.sjCheck= sjCheck;
      ctrl.bofideQuote = bofideQuote;
      ctrl.bjtbxz = bjtbxz;
      ctrl.xszInfoCheck = xszInfoCheck;
      ctrl.saveQuote = saveQuote;
        // 回退
      function goBack(){
        $ionicViewSwitcher.nextDirection('back');
        $ionicHistory.goBack();
      }
      function stateChange(stateTo,params){
        $ionicViewSwitcher.nextDirection('forward');
        $state.go(stateTo,params);
      }

      ctrl.SanZhes = [
        {site : "5万", value : 50000},
        {site : "10万", value : 100000},
        {site : "15万", value : 150000},
        {site : "20万", value : 200000},
        {site : "30万", value : 300000},
        {site : "50万", value : 500000},
        {site : "100万", value : 1000000},
        {site : "150万", value : 1500000},
        {site : "200万", value : 2000000}
      ];

      ctrl.BoLis = [
        {site : "不投保", value : 0},
        {site : "国产", value : 1},
        {site : "进口", value : 2}
      ];

      ctrl.HuaHens = [2000,5000,10000,20000];


      /**
       *根据customerId查询该潜客详情
       * params: customerId
       */
      function findCustomerDetailsByCustomerId() {
        if (ctrl.customerId != null) {
          var params = {'customerId': ctrl.customerId};
          customerDetailsService.findCustomerDetailsByCustomerId(params).then(function (result) {
            if (result.status == 'OK') {
              ctrl.customerDetails = result.results.content.results;
              if(ctrl.customerDetails.insuranceTypeLY){
                ctrl.shangye=1;
                $("#commercialInput").attr('checked',true);
              }
              ctrl.findCompInfoByStoreId();
            } else {

            }
          });
        }
      };

      //根据4s店id查询保险公司信息
      function findCompInfoByStoreId() {
        ctrl.ForceTax=1;
        if(ctrl.storeId != null){
          var params = {'storeId': ctrl.storeId};
          customerDetailsService.findCompInfoByStoreId(params).then(function (result) {
            if (result.status == 'OK') {
              ctrl.insuranceCompNames = [];
              ctrl.insuranceComps = result.results.content.result;
              if(ctrl.insuranceComps && ctrl.insuranceComps.length > 0){
                for(var n = 0;n < ctrl.insuranceComps.length;n++){
                  var insuran = ctrl.insuranceComps[n];
                  if("picc" == insuran.insuranceKey){
                    var insu = {
                      "insuranceCompName": insuran.insuranceCompName,
                      "insuranceKey":insuran.insuranceKey
                    };
                    ctrl.insuranceCompNames.push(insu);
                  }
                  if("pingan" == insuran.insuranceKey){
                    var insu = {
                      "insuranceCompName": insuran.insuranceCompName,
                      "insuranceKey":insuran.insuranceKey
                    };
                    ctrl.insuranceCompNames.push(insu);
                  }
                  if("lifeInsurance" == insuran.insuranceKey){
                    var insu = {
                      "insuranceCompName": insuran.insuranceCompName,
                      "insuranceKey":insuran.insuranceKey
                    };
                    ctrl.insuranceCompNames.push(insu);
                  }
                  if("cpic" == insuran.insuranceKey){
                    var insu = {
                      "insuranceCompName": insuran.insuranceCompName,
                      "insuranceKey":insuran.insuranceKey
                    };
                    ctrl.insuranceCompNames.push(insu);
                  }
                }
              }
              ctrl.findBxInfoForBH();
            } else {

            }
          });
        }
      }

      //按潜客ID查询该潜客去年险种信息
      function findBxInfoForBH(){
        if (ctrl.customerId != null) {
          var params = {'customerId': ctrl.customerId};
          customerDetailsService.findBxInfoForBH(params).then(function (result) {
            if (result.status == 'OK') {
              if(ctrl.customerDetails.insuranceCompLY){
                $("#insuranceCompLYs").find("span").each(function () {
                  if ($(this).text()==ctrl.customerDetails.insuranceCompLY) {
                    $(this).attr('class',"quotation yes");
                  }
                });
              }
              var BxInfoAll = result.results.content.results;
              if(BxInfoAll.daoQiang>0){
                ctrl.DaoQiang = 1;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.cheSun>0){
                ctrl.CheSun = 1;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.sanZhe>0){
                ctrl.SanZheck = 1;
                ctrl.SanZhe = BxInfoAll.sanZhe;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.siJi>0){
                ctrl.SiJick = 1;
                ctrl.SiJi = BxInfoAll.siJi;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.chengKe>0){
                ctrl.ChengKeck = 1;
                ctrl.ChengKe = BxInfoAll.chengKe;
                ctrl.shangye = 1;
              };
              ctrl.BuJiMianCheSun = BxInfoAll.buJiMianCheSun;
              ctrl.BuJiMianDaoQiang = BxInfoAll.buJiMianDaoQiang;
              ctrl.BuJiMianSanZhe = BxInfoAll.buJiMianSanZhe;
              ctrl.BuJiMianSiJi = BxInfoAll.buJiMianSiJi;
              ctrl.BuJiMianChengKe = BxInfoAll.buJiMianChengKe;
              ctrl.BuJiMianHuaHen = BxInfoAll.buJiMianHuaHen;
              ctrl.BuJiMianSheShui = BxInfoAll.buJiMianSheShui;
              ctrl.BuJiMianZiRan = BxInfoAll.buJiMianZiRan;
              ctrl.buJiMianJingShenSunShi = BxInfoAll.BuJiMianJingShenSunShi;
              if(BxInfoAll.sheShui>0){
                ctrl.SheShui = 1;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.ziRan>0){
                ctrl.ZiRan = 1;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.hcSanFangTeYue>0){
                ctrl.HcSanFangTeYue = 1;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.boLi>0){
                ctrl.BoLick = 1;
                ctrl.BoLi = BxInfoAll.boLi;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.huaHen>0){
                ctrl.HuaHenck = 1;
                ctrl.HuaHen = BxInfoAll.huaHen;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.hcJingShenSunShi>0){
                ctrl.HcJingShenck = 1;
                ctrl.HcJingShenSunShi = BxInfoAll.hcJingShenSunShi;
                ctrl.shangye = 1;
              };
              if(BxInfoAll.hcXiuLiChang>0){
                ctrl.HcXiuLick = 1;
                ctrl.HcXiuLiChang = BxInfoAll.hcXiuLiChang;
                ctrl.shangye = 1;
              }
            } else {

            }
          });
        }
      }


      //点击保险公司添加样式
      function bxInsurance($event){
        var spanClass  = $event.target.getAttribute('class');
        if(spanClass.indexOf('yes') < 0){
          $event.target.setAttribute('class','quotation yes');
        }else{
          $event.target.setAttribute('class','quotation');
        }
      }
      //点击左侧险种，获取商业险是否选中，如果选中则可以选中险种且不计免默认选中，否则险种选不中
      $("input[name='checkbox']").click(function(){
        var cb1= $(this).parent().parent("div").children("div").find("input[name='checkbox1']");
        if($("#commercialInput").attr('checked')){
          // cb1.attr('checked',this.checked);
        }else{
          $(this).attr("checked", false);
          cb1.attr("checked", false);
        }
      });

      //点击右侧不计免赔，获取左侧主险是否选中，如选中不计免可选，否则不能选中
      $("input[name='checkbox1']").click(function(){
        var cb = $(this).parent().parent("div").children("div").find("input[name='checkbox']").attr('checked');
        if(!cb){
          $(this).attr("checked", false);
        }
      });

      $("#commercialInput").click(function(){
        if($(this).attr("checked")){
        }else{
          $("input[name='checkbox']").attr("checked", false);
          $("input[name='checkbox1']").attr("checked",false);
        }
      });


      //给司机保险选中设置个默认值
      function sjCheck(){
        if(ctrl.SiJick==1){
          ctrl.SiJi = 10000;
        }else{
          ctrl.SiJi = undefined;
        }
      }

      //给乘客保险选中设置个默认值
      ctrl.ckCheck = function(){
        if(ctrl.ChengKeck==1){
          ctrl.ChengKe = 10000;
        }else{
          ctrl.ChengKe = undefined;
        }
      }



      //发送报价请求
      function bofideQuote(bjType){
        var bjType = bjType;

        var LicenseNo = ctrl.customerDetails.carLicenseNumber || "";
        var CarVin = ctrl.customerDetails.chassisNumber || "";
        var EngineNo = ctrl.customerDetails.engineNumber || "";
        var newCarPrice = ctrl.customerDetails.newCarPrice;
        var stRegisterDate = ctrl.customerDetails.registrationDate;
        if(stRegisterDate){
          stRegisterDate =  $filter('date')(stRegisterDate,'yyyy-MM-dd')
        }
        var idCard = ctrl.customerDetails.certificateNumber;
        var carOwnersName = ctrl.customerDetails.carOwner;
        var MoldName = ctrl.customerDetails.factoryLicenseType;
        var carUsedType = 1;
        if(ctrl.customerDetails.customerCharacter){
          carUsedType = ctrl.customerDetails.customerCharacter;
        }

        if(ctrl.DaoQiang==0){
          ctrl.BuJiMianDaoQiang==0;
        }
        if(ctrl.CheSun == 0){
          ctrl.BuJiMianCheSun == 0;
        }
        if(ctrl.SanZheck == 0){
          ctrl.SanZhe = 0;
          ctrl.BuJiMianSanZhe =0;
        }
        if(ctrl.SiJick == 0){
          ctrl.SiJi = 0;
          ctrl.BuJiMianSiJi = 0;
        }
        if(ctrl.ChengKeck == 0){
          ctrl.ChengKe = 0;
          ctrl.BuJiMianChengKe = 0;
        }
        if(ctrl.SheShui == 0){
          ctrl.BuJiMianSheShui = 0;
        }
        if(ctrl.ZiRan == 0){
          ctrl.BuJiMianZiRan = 0;
        }
        if(ctrl.BoLick == 0){
          ctrl.BoLi = 0;
        }
        if(ctrl.HuaHenck == 0){
          ctrl.HuaHen = 0;
          ctrl.BuJiMianHuaHen = 0;
        }
        if(ctrl.HcHuock == 0){
          ctrl.HcHuoWuZeRen = 0;
        }
        if(ctrl.HcJingShenck == 0){
          ctrl.HcJingShenSunShi = 0;
          ctrl.BuJiMianJingShenSunShi = 0;
        }
        if(ctrl.HcFeiYongck==0){
          ctrl.HcFeiYongBuChang = 0;
        }
        if(ctrl.HcXiuLick==0){
          ctrl.HcXiuLiChang = 0;
        }
        var ForceTax = ctrl.ForceTax||0;
        var shangye = ctrl.shangye ||0;
        var BuJiMianCheSun = ctrl.BuJiMianCheSun||0;
        var BuJiMianDaoQiang = ctrl.BuJiMianDaoQiang||0;
        var BuJiMianSanZhe = ctrl.BuJiMianSanZhe||0;
        var BuJiMianChengKe = ctrl.BuJiMianChengKe||0;
        var BuJiMianSiJi = ctrl.BuJiMianSiJi||0;
        var BuJiMianHuaHen = ctrl.BuJiMianHuaHen||0;
        var BuJiMianSheShui = ctrl.BuJiMianSheShui||0;
        var BuJiMianZiRan = ctrl.BuJiMianZiRan||0;
        var BuJiMianJingShenSunShi = ctrl.BuJiMianJingShenSunShi||0;
        var SheShui = ctrl.SheShui||0;
        var CheSun = ctrl.CheSun||0;
        var DaoQiang = ctrl.DaoQiang||0;
        var ZiRan = ctrl.ZiRan||0;
        var HcSheBeiSunshi = ctrl.HcSheBeiSunshi||0;
        var HcSanFangTeYue = ctrl.HcSanFangTeYue||0;
        var BoLi = ctrl.BoLi||0;
        var SiJi = ctrl.SiJi||0;
        var SanZheck = ctrl.SanZheck||0;
        var SanZhe = 0;
        if(ctrl.SanZhe){
          SanZhe = ctrl.SanZhe||0;
        };
        var ChengKe = ctrl.ChengKe||0;
        var HcHuoWuZeRen = ctrl.HcHuoWuZeRen||0;
        var HcFeiYongBuChang = ctrl.HcFeiYongBuChang||0;
        var HuaHen = ctrl.HuaHen||0;
        var HcJingShenSunShi = ctrl.HcJingShenSunShi||0;
        var HcXiuLiChang = ctrl.HcXiuLiChang||0;
        var BizStartDate = ctrl.customerDetails.syxrqEnd || "";
        if(BizStartDate){
          BizStartDate =  $filter('date')(BizStartDate,'yyyy-MM-dd')
        }
        var BiQzStartDate = ctrl.customerDetails.jqxrqEnd || "";
        if(BiQzStartDate){
          BiQzStartDate =  $filter('date')(BiQzStartDate,'yyyy-MM-dd')
        }
        ctrl.bjxz = {
          BuJiMianCheSun:BuJiMianCheSun,BuJiMianDaoQiang:BuJiMianDaoQiang,BuJiMianSanZhe:BuJiMianSanZhe,BuJiMianChengKe:BuJiMianChengKe,
          BuJiMianSiJi:BuJiMianSiJi,BuJiMianHuaHen:BuJiMianHuaHen,BuJiMianSheShui:BuJiMianSheShui,BuJiMianZiRan:BuJiMianZiRan,
          BuJiMianJingShenSunShi:BuJiMianJingShenSunShi,SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
          HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
          HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang
        }
        var checkbjxz = {
          SheShui:SheShui,CheSun:CheSun,DaoQiang:DaoQiang,ZiRan:ZiRan,HcSheBeiSunshi:HcSheBeiSunshi,
          HcSanFangTeYue:HcSanFangTeYue,BoLi:BoLi,SiJi:SiJi,SanZhe:SanZhe,ChengKe:ChengKe,HcHuoWuZeRen:HcHuoWuZeRen,HcFeiYongBuChang:HcFeiYongBuChang,
          HuaHen:HuaHen,HcJingShenSunShi:HcJingShenSunShi,HcXiuLiChang:HcXiuLiChang,LicenseNo:"京Q11111"
        } //车牌号已验证，略过
        var re_card = /^[\u4E00-\u9Fa5]{1}[A-Z]{1}[A-Z_0-9]{4,5}$/;
        if(LicenseNo && !re_card.test(LicenseNo)){
          pubHelper.alert(false,"车牌号格式不对！（例如：京Q11111）");
          return;
        };
        if(!stRegisterDate){
          pubHelper.alert(false,"请填写上牌日期");
          return;
        }
        if(!LicenseNo && !CarVin){
          pubHelper.alert(false,"请填写车牌号或者车架号");
          return;
        }
        var num = parseInt(SheShui+CheSun+DaoQiang+ZiRan+HcSheBeiSunshi+HcSanFangTeYue+BoLi+SiJi+SanZhe+ChengKe+HcHuoWuZeRen+
          HcFeiYongBuChang+HuaHen+HcJingShenSunShi+HcXiuLiChang);

        var insuranceCompanys = [];
        var mark = false;
        $("#insuranceCompLYs").find("span").each(function(j){
          if ($(this).attr('class').indexOf('yes') > 0) {
            if(ctrl.insuranceCompNames[j].insuranceKey){
              insuranceCompanys.push(ctrl.insuranceCompNames[j].insuranceKey)
            }
            mark = true;
          }
        })
        insuranceCompanys = insuranceCompanys.join(",");
        if(mark == false){
          pubHelper.alert(false,"请至少选择一家保险公司");
          return;
        }
        if(shangye == 0 && ForceTax == 0){
          pubHelper.alert(false,"请选择交险和商险中的一种保险");
          return;
        }
        if(shangye == 1 && num == 0){
          pubHelper.alert(false,"请选择商业险中的一种保险");
          return;
        }
        if(shangye == 1 && BizStartDate == ""){
          pubHelper.alert(false,"选择了商业险，商险到期日不能为空");
          return;
        }
        if(ForceTax == 1 && BiQzStartDate == ""){
          pubHelper.alert(false,"选择了交强险，交险到期日不能为空");
          return;
        }
        //判定约束条件
        var checkResult = ctrl.bjtbxz(checkbjxz,ctrl);
        if(checkResult.status == false){
          pubHelper.alert(false,checkResult.message,5000);
          return;
        };

        if(bjType == 2){
          var xszInfo = {
            LicenseNo:LicenseNo,CarVin:CarVin,EngineNo:EngineNo,RegisterDate:stRegisterDate,MoldName:MoldName,
            CarUsedType:carUsedType,newCarPrice:newCarPrice
          }
          var checkResult = ctrl.xszInfoCheck(xszInfo);
          if(checkResult.status == false){
            pubHelper.alert(false,checkResult.message,5000);
            return;
          };
        }
        if(EngineNo && EngineNo.indexOf("*")>0){
          pubHelper.alert(false,"发动机号不符合规范");
          return;
        }

        var compulsory;
        var commercial;
        if(ForceTax==0){
          compulsory = false;
        }else if(ForceTax==1){
          compulsory = true;
        };
        if(shangye==0){
          commercial = false;
        }else if(shangye!=0){
          commercial = true;
        }
        ctrl.commercial = commercial;
        var quoteInsuranceVos = [];
        if(CheSun==1){
          if(BuJiMianCheSun == 1){
            BuJiMianCheSun = true;
          }else {
            BuJiMianCheSun = false;
          }
          var arr = {
            "insuranceCode": "01",
            "isDeductible": BuJiMianCheSun,
            "isLossDeductible": false
          }
          quoteInsuranceVos.push(arr);
        }
        if(SanZheck==1){
          if(BuJiMianSanZhe==1){
            BuJiMianSanZhe = true;
          }else {
            BuJiMianSanZhe = false;
          }
          var arr = {
            "insuranceCode": "02",
            "isDeductible": BuJiMianSanZhe,
            "amount": SanZhe
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.SiJick==1){
          if(BuJiMianSiJi==1){
            BuJiMianSiJi = true;
          }else {
            BuJiMianSiJi = false;
          }
          var arr = {
            "insuranceCode": "03",
            "isDeductible": BuJiMianSiJi,
            "amount": SiJi
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.ChengKeck == 1){
          if(BuJiMianChengKe == 1){
            BuJiMianChengKe = true;
          }else {
            BuJiMianChengKe = false;
          }
          var arr = {
            "insuranceCode": "04",
            "isDeductible": BuJiMianChengKe,
            "amount": ChengKe
          }
          quoteInsuranceVos.push(arr);
        }
        if(DaoQiang==1){
          if(BuJiMianDaoQiang==1){
            BuJiMianDaoQiang = true;
          }else {
            BuJiMianDaoQiang = false;
          }
          var arr = {
            "insuranceCode": "05",
            "isDeductible": BuJiMianDaoQiang
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.BoLick == 1){
          if(BoLi == 1){
            BoLi = "0";
          }else if(BoLi == 2){
            BoLi = "1";
          }
          var arr = {
            "insuranceCode": "06",
            "producingArea": BoLi
          }
          quoteInsuranceVos.push(arr);
        }
        if(ZiRan==1){
          if(BuJiMianZiRan==1){
            BuJiMianZiRan = true;
          }else {
            BuJiMianZiRan = false;
          }
          var arr = {
            "insuranceCode": "07",
            "isDeductible": BuJiMianZiRan
          }
          quoteInsuranceVos.push(arr);
        }


        if(ctrl.HuaHenck==1){
          //划痕险投保规则
          checkResult = HuaHenRule(insuranceCompanys,BiQzStartDate,stRegisterDate);
          if(checkResult.status == false){
            pubHelper.alert(false,checkResult.message);
            return;
          };

          if(BuJiMianHuaHen==1){
            BuJiMianHuaHen = true;
          }else {
            BuJiMianHuaHen = false;
          }
          var arr = {
            "insuranceCode": "08",
            "isDeductible": BuJiMianHuaHen,
            "amount": HuaHen
          }
          quoteInsuranceVos.push(arr);
        }
        if(SheShui==1){
          if(BuJiMianSheShui==1){
            BuJiMianSheShui = true;
          }else {
            BuJiMianSheShui = false;
          }
          var arr = {
            "insuranceCode": "09",
            "isDeductible": BuJiMianSheShui
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.HcHuock==1){
          var arr = {
            "insuranceCode": "10",
            "isDeductible": false,
            "amount": HcHuoWuZeRen
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.HcJingShenck==1){
          if(BuJiMianJingShenSunShi==1){
            BuJiMianJingShenSunShi = true;
          }else {
            BuJiMianJingShenSunShi = false;
          }
          var arr = {
            "insuranceCode": "11",
            "isDeductible": BuJiMianJingShenSunShi,
            "amount": HcJingShenSunShi
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.HcFeiYongck == 1){
          var arr = {
            "insuranceCode": "12",
            "maxClaimDays": "1",
            "amount": HcFeiYongBuChang
          }
          quoteInsuranceVos.push(arr);
        }
        if(ctrl.HcXiuLick==1){
          var arr = {
            "insuranceCode": "13",
            "repairFactorRate": "0.15",
            "amount": HcXiuLiChang
          }
          quoteInsuranceVos.push(arr);
        }
        if(HcSanFangTeYue==1){
          var arr = {
            "insuranceCode": "14"
          }
          quoteInsuranceVos.push(arr);
        }

        //划痕险验证规则
        function HuaHenRule(insuranceCompanys,BiQzStartDate,stRegisterDate){
          if(insuranceCompanys && BiQzStartDate && stRegisterDate){
            var message = "";
            var year = getDateYearSub(BizStartDate,stRegisterDate);
           /* if(insuranceCompanys.indexOf("picc") > -1 && year > 5){
              message += "人保5年后不能承保划痕险;";
            }*/
            if(insuranceCompanys.indexOf("cpic") > -1 && year > 5){
              message += "太平洋5年后不能承保划痕险;";
            }
            if(insuranceCompanys.indexOf("pingan") > -1 && year > 5){
              message += "平安5年后不能承保划痕险;";
            }
            if(insuranceCompanys.indexOf("lifeInsurance") > -1 && year > 3){
              message += "人寿3年后不能承保划痕险;";
            }
            if(message){
              var result = {status : false, message:message}
              return result;
            }
          }
          var result = {status : true}
          return result;
        }

        var args={
          "bjType":bjType,
          "plateNo": LicenseNo,
          "carVIN": CarVin,
          "engineNo": EngineNo,
          "stRegisterDate":stRegisterDate,
          "modelType":MoldName,
          "newCarPrice":newCarPrice,
          "carUsedType":carUsedType,
          "ownerIdCardType":1,
          "carOwnersName":carOwnersName,
          "idCard":idCard,
          "maturityDate":BiQzStartDate,
          "businessEndTime":BizStartDate,
          "insuranceCompanys": insuranceCompanys,
          "compulsory": compulsory,
          "commercial": commercial,
          "quoteInsuranceVos": quoteInsuranceVos
        }

        $ionicLoading.show();
        customerDetailsService.applyBJFromBofide(args).then(function(result){
          $ionicLoading.hide();
          if(result.status == 'OK'&&result.results.success==true){

            ctrl.bihuquote = result.results.content.results;
            ctrl.bihuComps = ctrl.bihuquote.bj;
            ctrl.bihuCompsTwo = [];
            $("#bihuRequest").hide();
            if(commercial){
              for(var n = 0;n < ctrl.bihuComps.length;n++){
                var comp = ctrl.bihuComps[n];
                if(!comp.totalPremium){
                  comp.totalPremium = 0;
                }
                comp.yj = comp.totalPremium;
                comp.zhehousyx = comp.totalPremium;
                comp.shijize = comp.totalPremium;
                var insurance = [];
                var CheSunI ="",SanZheI="",SiJiI="",ChengKeI="",DaoQiangI="",BoLiI="",ZiRanI="",HuaHenI="",SheShuiI="",
                  HcHuoWuZeRenI="",HcJingShenSunShiI="",HcFeiYongBuChangI="",HcXiuLiChangI="",HcSanFangTeYueI="",HcSheBeiSunshiI="";
                var CheSunIb = "",SanZheIb="",SiJiIb="",ChengKeIb="",DaoQiangIb="",ZiRanIb="",HuaHenIb="",SheShuiIb="",
                  HcJingShenSunShiIb="",HcSheBeiSunshiIb="";
                if(comp.bJinfo.Item.CheSun){
                  CheSunI+="车损险("+comp.bJinfo.Item.CheSun.BaoE+"):"+comp.bJinfo.Item.CheSun.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianCheSun){
                  CheSunIb+="不计免车损险:"+comp.bJinfo.Item.BuJiMianCheSun.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.SanZhe){
                  SanZheI+="第三方责任险("+SanZhe+"):"+comp.bJinfo.Item.SanZhe.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianSanZhe){
                  SanZheIb+="不计免第三方责任险:"+comp.bJinfo.Item.BuJiMianSanZhe.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.SiJi){
                  SiJiI+="司机人员责任险("+SiJi+"):"+comp.bJinfo.Item.SiJi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianSiJi){
                  SiJiIb+="不计免司机人员责任险:"+comp.bJinfo.Item.BuJiMianSiJi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.ChengKe){
                  ChengKeI+="乘客人员责任险("+ChengKe+"):"+comp.bJinfo.Item.ChengKe.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianChengKe){
                  ChengKeIb+="不计免乘客人员责任险:"+comp.bJinfo.Item.BuJiMianChengKe.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.DaoQiang){
                  DaoQiangI+="盗抢险:"+comp.bJinfo.Item.DaoQiang.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianDaoQiang){
                  DaoQiangIb+="不计免盗抢险:"+comp.bJinfo.Item.BuJiMianDaoQiang.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BoLi){
                  BoLiI+="玻璃单独破碎险:"+comp.bJinfo.Item.BoLi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.ZiRan){
                  ZiRanI+="自燃损失险:"+comp.bJinfo.Item.ZiRan.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianZiRan){
                  ZiRanIb+="不计免自燃损失险:"+comp.bJinfo.Item.BuJiMianZiRan.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HuaHen){
                  HuaHenI+="车身划痕损失险("+HuaHen+"):"+comp.bJinfo.Item.HuaHen.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianHuaHen){
                  HuaHenIb+="不计免车身划痕损失险:"+comp.bJinfo.Item.BuJiMianHuaHen.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.SheShui){
                  SheShuiI+="涉水损失险:"+comp.bJinfo.Item.SheShui.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianSheShui){
                  SheShuiIb+="不计免涉水损失险:"+comp.bJinfo.Item.BuJiMianSheShui.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcHuoWuZeRen){
                  HcHuoWuZeRenI+="车上货物责任险("+HcHuoWuZeRen+"):"+comp.bJinfo.Item.HcHuoWuZeRen.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcJingShenSunShi){
                  HcJingShenSunShiI+="精神损害险("+HcJingShenSunShi+"):"+comp.bJinfo.Item.HcJingShenSunShi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BuJiMianJingShenSunShi){
                  HcJingShenSunShiIb+="不计免精神损害险:"+comp.bJinfo.Item.BuJiMianJingShenSunShi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcFeiYongBuChang){
                  HcFeiYongBuChangI+="修理期间费用补偿险("+HcFeiYongBuChang+"):"+comp.bJinfo.Item.HcFeiYongBuChang.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcXiuLiChang){
                  HcXiuLiChangI+="指定修理厂险("+HcXiuLiChang+"):"+comp.bJinfo.Item.HcXiuLiChang.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcSanFangTeYue){
                  HcSanFangTeYueI+="第三方特约险:"+comp.bJinfo.Item.HcSanFangTeYue.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.HcSheBeiSunshi){
                  HcSheBeiSunshiI+="新增设备损失险("+HcSheBeiSunshi+"):"+comp.bJinfo.Item.HcSheBeiSunshi.BaoFei+"元;"
                }
                if(comp.bJinfo.Item.BjmSheBeiSunShi){
                  HcSheBeiSunshiIb+="不计免新增设备损失险:"+comp.bJinfo.Item.BjmSheBeiSunShi.BaoFei+"元;"
                }

                if(CheSunI) insurance.push(CheSunI);if(CheSunIb) insurance.push(CheSunIb);
                if(SanZheI) insurance.push(SanZheI);if(SanZheIb) insurance.push(SanZheIb);
                if(SiJiI) insurance.push(SiJiI);if(SiJiIb) insurance.push(SiJiIb);
                if(ChengKeI) insurance.push(ChengKeI);if(ChengKeIb) insurance.push(ChengKeIb);
                if(DaoQiangI) insurance.push(DaoQiangI);if(DaoQiangIb) insurance.push(DaoQiangIb);
                if(BoLiI) insurance.push(BoLiI);
                if(ZiRanI) insurance.push(ZiRanI);if(ZiRanIb) insurance.push(ZiRanIb);
                if(HuaHenI) insurance.push(HuaHenI);if(HuaHenIb) insurance.push(HuaHenIb);
                if(SheShuiI) insurance.push(SheShuiI);if(SheShuiIb) insurance.push(SheShuiIb);
                if(HcHuoWuZeRenI) insurance.push(HcHuoWuZeRenI);
                if(HcJingShenSunShiI) insurance.push(HcJingShenSunShiI);if(HcJingShenSunShiIb) insurance.push(HcJingShenSunShiIb);
                if(HcFeiYongBuChangI) insurance.push(HcFeiYongBuChangI);if(HcXiuLiChangI) insurance.push(HcXiuLiChangI);
                if(HcSanFangTeYueI) insurance.push(HcSanFangTeYueI);
                if(HcSheBeiSunshiI) insurance.push(HcSheBeiSunshiI);if(HcSheBeiSunshiIb) insurance.push(HcSheBeiSunshiIb);

                comp.insurance = insurance;
                console.log("args:"+JSON.stringify(comp.insurance))
                ctrl.bihuCompsTwo.push(comp);
              }
            }

            $("#bihubaojia").show();
          }else{
            pubHelper.alert(false,result.results.message);
          }
        });
      }
      ctrl.bxYouHui = function(){
        var youhui = $("#youhui").val();
        if(youhui && !/^[0-9]+$/.test(youhui)){
          pubHelper.alert(false,"店优惠金额必须是纯数字");
        }
      }

      ctrl.bxZheKou = function(){
        var zhekou = $("#zhekou").val();
        if(zhekou<0 || zhekou>1){
          pubHelper.alert(false,"商业险折扣数值应为0到1之间");
        }
      }


      //保存报价
      function saveQuote(){
        var storeId = parseInt(ctrl.storeId);
        var userId = parseInt(ctrl.userId);
        var customerId = parseInt(ctrl.customerId);
        var userName = ctrl.userName;
        var saveBj = {
          forceTax:ctrl.ForceTax,
          bjxz:ctrl.bjxz,
          storeId:storeId,
          userId:userId,
          customerId:customerId,
          userName:userName,
          accidentNumberLY:0,
          payAmount:0,
          bj:ctrl.bihuCompsTwo};
        for(var i=0;i<saveBj.bj.length;i++){
          if(saveBj.bj[i].zhekou<0||saveBj.bj[i].zhekou>1){
            $scope.alert("商业险折扣数值应为0到1之间",5000);
            return;
          };
          if(saveBj.bj[i].bJinfo!=null&&saveBj.bj[i].bJinfo.Item.BoLi){
            if(saveBj.bj[i].bJinfo.Item.BoLi.BaoE ==1){
              saveBj.bj[i].bJinfo.Item.BoLi.BaoE = 3;
            };
          };
        };
        $ionicLoading.show();
        customerDetailsService.saveBJ(saveBj).then(function(result){
          $ionicLoading.hide();
          if(result.status == 'OK'){
            $("#bihubaojia").hide();
            $("#bihuRequest").show();
            pubHelper.alert(false,result.results.message);
          } else {
            pubHelper.alert(false,result.results.message);
          }
        });
      }

      $(".closeBjResult").click(function(){
        $("#bihubaojia").hide();
        $("#bihuRequest").show();
      })


      function bjtbxz(xzInfo ,bihubaojia){
        if(xzInfo.CheSun==0){
          if(xzInfo.BoLi==1||xzInfo.ZiRan==1 || xzInfo.HuaHen==1 || xzInfo.SheShui==1
            || xzInfo.HcFeiYongBuChang==1 || xzInfo.HcXiuLiChang==1 || xzInfo.HcSanFangTeYue==1){
            var result = {
              status : false,
              message:"投保了玻璃、自燃、划痕、涉水、修理期间费用补偿险、指定修理厂险、第三方特约险中的一种，必须勾选机动车损失保险"}
            return result;
          }
        }
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
        var result = {
          status : true,
          message:"验证成功"}
        return result;
      }

      //行驶证信息校验
      function xszInfoCheck(xszInfo){
        if(!xszInfo.newCarPrice||xszInfo.newCarPrice==''){
          var result = {
            status : false,
            message:"新车购买价格不能为空"}
          return result;
        }
        if(!xszInfo.LicenseNo||xszInfo.LicenseNo==''){
          var result = {
            status : false,
            message:"车牌号不能为空"}
          return result;
        }
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
        var result = {
          status : true,
          message:"验证成功"}
        return result;
      }

      function getDateYearSub (startDateStr, endDateStr){
        var oDate1 = new Date(startDateStr);
        var oDate2 = new Date(endDateStr);
        var year = oDate1.getFullYear() - oDate2.getFullYear();
        return year;
      }

    }]);





'use strict';
angular.module('myApp')
    .controller('indexIW_Controller',['$rootScope','constant','$location','$scope','$filter','loginService','$state','customerIWService','$cookies',
        function($rootScope,constant,$location,$scope,$filter,loginService,$state,customerIWService,$cookies) {
            $scope.accountModule = $rootScope.user.accountModule; //赠品管理模块
            var host = $location.host();
            var hostname = window.location.hostname;
            if(host==constant.bipServer){
                $scope.logo=1;
                //初始化智齿咨询组件实例
                var zhiManager = (getzhiSDKInstance());
                if($rootScope.user){
                    var uname = $rootScope.user.store.storeName + "-" +  $rootScope.user.userName + "-" +
                        $rootScope.user.role.roleName
                    zhiManager.set("uname", uname);
                }
                //再调用load方法
                zhiManager.on("load", function() {
                    zhiManager.initBtnDOM();
                });
            }else {
                $scope.logo=2;
            }

            if(hostname == constant.bipHostname || hostname ==constant.biplocalhost ){
                $scope.logo=1;
                if(hostname == constant.bipHostname){
                //初始化智齿咨询组件实例
                var zhiManager = (getzhiSDKInstance());
                    if($rootScope.user){
                        var uname = $rootScope.user.store.storeName + "-" +  $rootScope.user.userName + "-" +
                            $rootScope.user.role.roleName
                        zhiManager.set("uname", uname);
                    }
                    //再调用load方法
                    zhiManager.on("load", function() {
                        zhiManager.initBtnDOM();
                    });
                }
            }else {
                $scope.logo=2;
            }

            $scope.findCountByUserIdTop = function(){
                loginService.findCountByUserIdTop().then(function (result) {
                    if (result.status == 'OK'||result.results.content.status == 'OK') {
                        $scope.topCount = result.results.content.results;
                    } else {

                    };
                });
            }
            $scope.findCountByUserIdTop();
            //弹框
            $scope.scmUsershow = function (){
                $(".scmUserTip").show();
            };
            $scope.scmUserhide = function (){
                $(".scmUserTip").hide();
            };

            $scope.scmSBReturn = function (){
                $("#scmSidebar").stop(true).animate({left:'-300px'});
            };

            $scope.sideNavSwitch = function (){
                $("#scmSidebar").stop(true).animate({left:'10px'});
            };

            //安全退出
            $scope.logout = function(){
                loginService.logout()
                    .then(function (result) {
                        if (result.status == 'noLogin') {
                            window.location.href = '/index'
                        } else {
                            $scope.angularTip("注销失败",5000);
                        };
                    });
            }

            //修改密码弹框
            $scope.changePassBtn = function() {
                $("#changePass").show();
            };

            //修改密码
            $scope.change = {};
            $scope.id = $rootScope.user.userId;
            $scope.changePasswordbtn = function() {
                var oldPassword =$scope.change.oldPassword;
                var newPassword =$scope.change.newPassword;
                var confirmPassword =$scope.change.confirmPassword;
                var patrn = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
                if (!patrn.exec(newPassword)){
                    $scope.angularTip("至少8-16个字符，至少1个大写字母，1个小写字母和1个数字",5000);
                }else if(confirmPassword!=newPassword){
                    $scope.angularTip("两次输入的新密码不一致，请重新输入",5000);
                }else{
                    loginService.changePassword($scope.id,newPassword,oldPassword).then(function(result){
                        if(result.results.content.status == 'OK'){
                            //密码修改成功时把首次登陆状态变成0
                            $scope.user.firstLogin = 0;
                            var bip_user = JSON.parse($cookies.get('bip_user'));
                            bip_user.firstLogin = 0;
                            $cookies.put('bip_user', JSON.stringify(bip_user));
                            $("#firstChangePass").hide();

                            $scope.angularTip("修改成功",5000);
                            $("#changePass").hide();
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };
            //当首次登陆时弹出密码修改框
            if($scope.user.firstLogin==1){
                setTimeout(function(){
                    $("#firstChangePass").show();
                },200);
            }

            //信息弹出框
            $scope.angularTip =function(tip,tipTime) {
                clearTimeout($scope.Timeout);
                $("#tipContent").html(tip);
                $("#tipAlert").show();
                $scope.Timeout = setTimeout(function(){
                    $("#tipAlert").hide();
                },tipTime);
            };
            $scope.closeAlert =function() {
                $("#tipAlert").hide();
                clearTimeout($scope.Timeout);
            }

            //审批单内容
            $scope.coverTypes = [{id:1,coverType:'新保'},{id:2,coverType:'新转续'},{id:3,coverType:'续转续'},
                {id:4,coverType:'间转续'},{id:5,coverType:'潜转续'},{id:6,coverType:'首次'}];
            $scope.renewalWays = ['续保客户','朋友介绍','自然来店','呼入电话','活动招揽','其他'];
            $scope.payWays = ['现金','刷卡','现金+刷卡','支票','转账','其他'];
            $scope.sf = [{id:1,vlaue:'是'},{id:0,vlaue:'否'}];
            $scope.privilegePros = ['现金','套餐','现金+套餐','其他'];
            $scope.customerLevels = ['A','B','C','D'];
            $scope.print_spd_top = {};
            $scope.bihubaojia = {};
            $scope.bihuquote = {};
            $scope.BoLis = [
                {site : "不投保", value : 0},
                {site : "国产", value : 1},
                {site : "进口", value : 2}
            ];
            $scope.bihubaojia.BoLi=0;
            $scope.sjCheck = function(){
                if($scope.bihubaojia.SiJick==1){
                    $scope.bihubaojia.SiJi = 10000;
                }else{
                    $scope.bihubaojia.SiJi = undefined;
                }
            }
            $scope.ckCheck = function(){
                if($scope.bihubaojia.ChengKeck==1){
                    $scope.bihubaojia.ChengKe = 10000;
                }else{
                    $scope.bihubaojia.ChengKe = undefined;
                }
            }
            $scope.SanZhes = [
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
            $scope.HuaHens = [2000,5000,10000,20000];

            //查询模块是否开启
            customerIWService.findModuleSet().then(function(res){
                if(res.status == 'OK'||res.content.status=='OK'){
                    var findModuleOpen = res.results.content.result;
                    for(var i=0;i<findModuleOpen.length;i++){
                        if(findModuleOpen[i].moduleName=='finance'){
                            $scope.cwmksfkq_top = findModuleOpen[i].switchOn;
                        }
                    }
                }else{

                }
            });

            $scope.openWindow = function (){
                //打开审批单
                $("#spd_top").show();
                $scope.print_spd_top.insurDate = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.print_spd_top.giftNum = 1;
                $scope.print_spd_top.comprehensiveDiscount = 0;
                $scope.print_spd_top.giftDiscount = 0;
                $scope.giftListAllPage.data = [];
                $scope.spdVehicleModel_top();
            }

            //交强险日期设定
            $scope.jqxrqStartChange_top = function() {
                var setDate = $scope.print_spd_top.jqxrqStart;
                $scope.print_spd_top.jqxrqEnd = $scope.GetDateStr_top(setDate);
            }
            //日期计算方法
            $scope.GetDateStr_top = function(setDate)
            {
                var startDate =new Date(setDate);
                startDate.setFullYear(startDate.getFullYear()+1);
                var endDate=startDate.getTime()-(1000*60*60*24);
                var nextyear=$filter('date')(new Date(endDate),'yyyy-MM-dd 23:59:59');
                return nextyear;
            }

            //按4s店ID查询车辆品牌车型信息
            customerIWService.findCarInfoByStoreId().then(function(res){
                if(res.status == 'OK'&&res.results.success==true){
                    $scope.carBrands_top = res.results.content.result;
                    $scope.carBrands_top.push({brandName:'异系'});
                    $("#clxhsr_search").hide();

                }else{
                    $scope.carBrands_top = [];
                    $scope.carBrands_top.push({brandName:'异系'});
                    $("#clxhsr_search").hide();
                }
            });

            //根据4s店id查询保险公司信息
            customerIWService.findCompInfoByStoreId().then(function(res){
                if(res.status == 'OK'||res.content.status=='OK'){
                    $scope.insuranceCompNames = res.results.content.result;
                }else{

                }
            });

            //审批单品牌车型选择框与输入框切换
            $scope.spdVehicleModel_top = function(){
                $scope.print_spd_top.vehicleModel='';
                $scope.print_spd_top.vehicleModelInput='';
                if($scope.print_spd_top.carBrand){
                    if($scope.print_spd_top.carBrand.brandName=='异系'){
                        $("#clxhsr_spd_top").show();
                        $("#clxhxz_spd_top").hide();
                    }else{
                        $("#clxhxz_spd_top").show();
                        $("#clxhsr_spd_top").hide();
                    }
                }else {
                    $("#clxhxz_spd_top").show();
                    $("#clxhsr_spd_top").hide();
                }
            }

            //保费合计计算
            $scope.bfhjjs_top = function(){
                var syxje = $scope.print_spd_top.syxje||0;
                var jqxje = $scope.print_spd_top.jqxje||0;
                var ccs = $scope.print_spd_top.ccs||0;
                $scope.print_spd_top.bfhj = (syxje + jqxje + ccs).toFixed(2);
                $scope.sjjejs_top();
                if(syxje!=0&&syxje!=null&&$scope.print_spd_top.czkje!=null){
                    $scope.print_spd_top.czkjedw = Math.round($scope.print_spd_top.czkje/syxje*100)/100;
                }
            }

            $scope.m=function(e){
                var ss=window.event||e;
                if(!((ss.keyCode>47&&ss.keyCode<58))){
                    ss.preventDefault();
                }
            }
            //现金优惠点位计算
            $scope.xjyhdwjs_top = function(){
                var syxje = $scope.print_spd_top.syxje||0;
                var xjyhdw = $scope.print_spd_top.xjyhdw||0;
                if(xjyhdw>1||xjyhdw<0){
                    $scope.angularTip("现金优惠点位为0—1之间",5000);
                    $scope.print_spd_top.xjyhdw = 0;
                    return;
                }
                if(syxje!=0){
                    $scope.print_spd_top.yhje = Math.round(syxje*xjyhdw*100)/100;
                    $scope.sjjejs_top();
                }
            }
            //实收金额计算
            $scope.sjjejs_top = function(){
                var syxje = $scope.print_spd_top.syxje||0;
                var bfhj = $scope.print_spd_top.bfhj||0;
                var yhje = $scope.print_spd_top.yhje||0;
                $scope.print_spd_top.ssje = (bfhj - yhje).toFixed(2);
                $scope.print_spd_top.comprehensiveDiscount = $scope.print_spd_top.yhje+$scope.print_spd_top.giftDiscount;
                if(syxje!=0){
                    $scope.print_spd_top.xjyhdw = Math.round(yhje/syxje*100)/100;
                }
            }
            //审批单商业险种拼装
            $scope.spdsyxz_top = function(){
                $scope.print_spd_top.insuranceTypes = [];
                if($scope.print_spd_top.insuranceCompName){
                    var syxz = $scope.print_spd_top.insuranceCompName.insuranceTypes;
                    for(var i = 0; i<syxz.length;i++){
                        syxz[i].checkStatus=false;
                    }
                    $scope.print_spd_top.insuranceTypes = syxz;
                }
            }
            //赠品信息
            $scope.giftListAllPage = {}
            $scope.giftListAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name: '序号', field: 'index',width:50,cellClass:'text-center',type:'number',enableColumnMenu: false},
                    { name: '赠品编码', field: 'giftCode',enableColumnMenu: false},
                    { name: '赠品类型', field: 'giftType',cellFilter: 'mapZPLX',enableColumnMenu: false},
                    { name: '赠品名称', field: 'giftName',enableColumnMenu: false},
                    { name: '有效期至', field: 'validDate',width:100,cellFilter: "date:'yyyy-MM-dd'",enableColumnMenu: false},
                    { name: '指导价', field: 'guidePrice',enableColumnMenu: false},
                    { name: '数量',enableColumnMenu: false,
                        cellTemplate: '<div class="ui-grid-cell-contents"><input class="zpDiscount" min="0" num-format ng-change="grid.appScope.giftNumModify(row.entity)" ng-model="row.entity.amount" type="number"></div>'},
                    { name: '金额', field: 'amountMoney',width:70,enableColumnMenu: false},
                    { name: '备注', field: 'remark',width:150,cellTooltip: true,enableColumnMenu: false},
                    { name:'删除',enableColumnMenu: false, width:60,
                        cellTemplate: '<div role="button" class="ui-grid-cell-contents" ng-click="grid.appScope.deleteGiftBtn(row)">删除</div>'}
                ]
            };
            //赠品数量
            $scope.minusFwnum=function(){
                if($scope.print_spd_top.giftNum>=1){
                    $scope.print_spd_top.giftNum = $scope.print_spd_top.giftNum -1;
                }
            }
            $scope.plusFwnum=function(){
                $scope.print_spd_top.giftNum = $scope.print_spd_top.giftNum +1;;
            }
            $scope.giftListHide = function() {
                $(".giftListBox").hide();
            };
            $scope.giftListSet = function(Gift) {
                $scope.print_spd_top.giftName = Gift.giftName;
                $(".giftListBox").hide();
            };
            $scope.giftSetNone = function() {
                $scope.print_spd_top.giftName = "";
                $scope.print_spd_top.searchGift = "";
            };
            //检索服务赠品
            $scope.chooseGift=function(){
                $(".giftListBox").show();
                var searchCondition = $scope.print_spd_top.searchGift;
                var giftType = $scope.print_spd_top.giftType;
                customerIWService.findGiftByCodeOrName(searchCondition,giftType).then(function (result) {
                    if (result.status == 'OK'&&result.results.content.status=='OK') {
                        $scope.giftListData = result.results.content.results;
                    } else {

                    };
                });
            }
            //修改赠品数量
            $scope.giftNumModify=function(rowData){
                rowData.amountMoney = rowData.guidePrice*rowData.amount;
                $scope.print_spd_top.czkje = 0;
                $scope.print_spd_top.czkjedw=0;
                $scope.print_spd_top.giftDiscount = 0;
                for(var i=0;i<$scope.giftListAllPage.data.length;i++){
                    if($scope.giftListAllPage.data[i].giftType==4){
                        $scope.print_spd_top.czkje = $scope.print_spd_top.czkje+$scope.giftListAllPage.data[i].amountMoney;
                    }
                    $scope.print_spd_top.giftDiscount = $scope.giftListAllPage.data[i].amountMoney+$scope.print_spd_top.giftDiscount;
                }
                if($scope.print_spd_top.syxje!=0&&$scope.print_spd_top.syxje!=null){
                    $scope.print_spd_top.czkjedw = Math.round($scope.print_spd_top.czkje/$scope.print_spd_top.syxje*100)/100;
                }
                $scope.print_spd_top.comprehensiveDiscount = $scope.print_spd_top.yhje+$scope.print_spd_top.giftDiscount;
            }
            //添加赠品
            $scope.addGiftBtn = function() {
                var giftBol = 0;
                if($scope.print_spd_top.giftName ==null|| $scope.print_spd_top.giftName == ""){
                    $scope.angularTip("请输入赠品",5000);
                    return;
                }
                for(var i=0;i<$scope.giftListData.length;i++){
                    if($scope.print_spd_top.giftName==$scope.giftListData[i].giftName){
                        giftBol = 1;
                        $scope.Gift = $scope.giftListData[i];
                    }
                }
                if(giftBol==0){
                    $scope.angularTip("赠品输入有误",5000);
                    return;
                }
                var validDate=new Date();
                validDate.setMonth(validDate.getMonth()+$scope.Gift.validLength);
                var arr = {
                    giftCode:$scope.Gift.giftCode,
                    giftName:$scope.Gift.giftName,
                    quota:$scope.Gift.quota,
                    guidePrice:$scope.Gift.guidePrice,
                    salePrice:$scope.Gift.salePrice,
                    actualPrice:$scope.Gift.actualPrice,
                    validDate:validDate,
                    remark:$scope.Gift.remark,
                    giftType:$scope.Gift.giftType,
                    amount:$scope.print_spd_top.giftNum,
                    sellingPrice:$scope.Gift.guidePrice,
                    amountMoney: $scope.Gift.guidePrice*$scope.print_spd_top.giftNum
                }
                var giftcodeRepeat = 0;
                for(var i=1;i<=$scope.giftListAllPage.data.length;i++){
                    if($scope.Gift.giftCode==$scope.giftListAllPage.data[i-1].giftCode){
                        $scope.giftListAllPage.data[i-1].amount = $scope.giftListAllPage.data[i-1].amount+$scope.print_spd_top.giftNum;
                        $scope.giftListAllPage.data[i-1].amountMoney = $scope.giftListAllPage.data[i-1].amountMoney+$scope.Gift.guidePrice*$scope.print_spd_top.giftNum;
                        giftcodeRepeat = 1;
                    }
                }
                if(giftcodeRepeat == 0){
                    $scope.giftListAllPage.data.unshift(arr);
                };

                $scope.print_spd_top.giftDiscount = 0;
                $scope.print_spd_top.czkje = 0;
                $scope.print_spd_top.czkjedw=0;
                for(var i=1;i<=$scope.giftListAllPage.data.length;i++){
                    $scope.giftListAllPage.data[i-1].index = i;
                    if($scope.giftListAllPage.data[i-1].giftType==4){
                        $scope.print_spd_top.czkje = $scope.print_spd_top.czkje+$scope.giftListAllPage.data[i-1].amountMoney;
                    }
                    $scope.print_spd_top.giftDiscount = $scope.giftListAllPage.data[i-1].amountMoney+$scope.print_spd_top.giftDiscount;
                }
                if($scope.print_spd_top.syxje!=0&&$scope.print_spd_top.syxje!=null){
                    $scope.print_spd_top.czkjedw = Math.round($scope.print_spd_top.czkje/$scope.print_spd_top.syxje*100)/100;
                }
                $scope.print_spd_top.comprehensiveDiscount = $scope.print_spd_top.yhje+$scope.print_spd_top.giftDiscount;
            };
            $scope.deleteGiftBtn = function(row) {
                $scope.giftListAllPage.data.splice($scope.giftListAllPage.data.indexOf(row.entity), 1);
                $scope.print_spd_top.giftDiscount = 0;
                for(var i=1;i<=$scope.giftListAllPage.data.length;i++){
                    $scope.giftListAllPage.data[i-1].index = i;
                    $scope.print_spd_top.giftDiscount = $scope.giftListAllPage.data[i-1].amountMoney+$scope.print_spd_top.giftDiscount;
                }
                $scope.print_spd_top.comprehensiveDiscount = $scope.print_spd_top.yhje+$scope.print_spd_top.giftDiscount;
                $scope.print_spd_top.czkje = 0;
                $scope.print_spd_top.czkjedw=0;
                for(var i=1;i<=$scope.giftListAllPage.data.length;i++){
                    $scope.giftListAllPage.data[i-1].index = i;
                    if($scope.giftListAllPage.data[i-1].giftType==4){
                        $scope.print_spd_top.czkje = $scope.print_spd_top.czkje+$scope.giftListAllPage.data[i-1].amountMoney;
                    }
                }
                if($scope.print_spd_top.syxje!=0&&$scope.print_spd_top.syxje!=null){
                    $scope.print_spd_top.czkjedw = Math.round($scope.print_spd_top.czkje/$scope.print_spd_top.syxje*100)/100;
                }
            };
            //赠品折扣
            $scope.countSellingPrice=function(rowData){
                if(rowData.discount>100||rowData.discount<0){
                    $scope.angularTip("折扣值为0—100之间",5000);
                    rowData.discount = 0;
                }
                rowData.sellingPrice = rowData.guidePrice*(1-rowData.discount/100);
                rowData.sellingPrice = rowData.sellingPrice.toFixed(2);
                rowData.amountMoney = rowData.sellingPrice*rowData.amount;
                $scope.print_spd_top.giftDiscount = 0;
                for(var i=0;i<$scope.giftListAllPage.data.length;i++){
                    $scope.print_spd_top.giftDiscount = $scope.giftListAllPage.data[i].amountMoney+$scope.print_spd_top.giftDiscount;
                }
                $scope.print_spd_top.comprehensiveDiscount = $scope.print_spd_top.yhje+$scope.print_spd_top.giftDiscount;
            }
            //提交审批单
            $scope.print_spd_top_submit = function(){
                var carLicenseNumber =$scope.print_spd_top.carLicenseNumber||'';
                var chassisNumber =$scope.print_spd_top.chassisNumber||'';
                var engineNumber =$scope.print_spd_top.engineNumber||'';
                var carBrand = '';
                var vehicleModel = '';
                if($scope.print_spd_top.carBrand){
                    carBrand = $scope.print_spd_top.carBrand.brandName;
                    if(carBrand=='异系'){
                        vehicleModel = $scope.print_spd_top.vehicleModelInput||'';
                    }else if($scope.print_spd_top.vehicleModel){
                        vehicleModel =$scope.print_spd_top.vehicleModel.modelName;
                    }
                }
                var factoryLicenseType =$scope.print_spd_top.factoryLicenseType||'';
                var jqxrqStart =$filter('date')(new Date($scope.print_spd_top.jqxrqStart),'yyyy-MM-dd HH:mm:ss');
                var jqxrqEnd =$scope.print_spd_top.jqxrqEnd||'';
                var insurDate =$scope.print_spd_top.insurDate||'';
                var renewalType =$scope.print_spd_top.renewalType||'';
                var renewalWay =$scope.print_spd_top.renewalWay||'';
                var solicitMember =$scope.print_spd_top.solicitMember||'';
                var insured =$scope.print_spd_top.insured||'';
                var bbxrzjh =$scope.print_spd_top.certificateNumber||'';
                var contact =$scope.print_spd_top.contact||'';
                var contactWay =$scope.print_spd_top.contactWay||'';
                var remark =$scope.print_spd_top.remark||'';
                var insuranceCompName = '';
                if($scope.print_spd_top.insuranceCompName){
                    insuranceCompName = $scope.print_spd_top.insuranceCompName.insuranceCompName;
                }
                var insurancTypes = '';
                var insuTypes = [];
                if($scope.print_spd_top.insuranceTypes){
                    var xz = $scope.print_spd_top.insuranceTypes;
                    for(var i = 0;i<xz.length;i++){
                        if(xz[i].checkStatus == true){
                            if(insurancTypes==''){
                                insurancTypes = xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }else{
                                insurancTypes = insurancTypes + ','+ xz[i].typeName;
                                if(xz[i].status==1 && xz[i].coverage!=null && xz[i].coverage!=undefined){
                                    insurancTypes = insurancTypes+':'+xz[i].coverage;
                                }
                            }
                            insuTypes.push(xz[i]);
                        }
                    }
                }

                var kpxx =$scope.print_spd_top.kpxx||'';
                var syxje =$scope.print_spd_top.syxje||'';
                var jqxje =$scope.print_spd_top.jqxje||'';
                var ccs =$scope.print_spd_top.ccs||'';
                var bfhj =$scope.print_spd_top.bfhj||'';
                var kpje =$scope.print_spd_top.kpje||'';
                var yhje =$scope.print_spd_top.yhje||'';
                var ssje =$scope.print_spd_top.ssje||'';
                var xjyhdw =$scope.print_spd_top.xjyhdw||'';
                var czkje =$scope.print_spd_top.czkje||'';
                var czkjedw =$scope.print_spd_top.czkjedw||'';
                var fkfs =$scope.print_spd_top.fkfs||'';
                var zsxx1 =$scope.print_spd_top.zsxx1||'';
                var zsxx2 =$scope.print_spd_top.zsxx2||'';
                var zsxx3 =$scope.print_spd_top.zsxx3||'';
                var zsxx4 =$scope.print_spd_top.zsxx4||'';
                var zsxx5 =$scope.print_spd_top.zsxx5||'';
                var zsxx6 =$scope.print_spd_top.zsxx6||'';
                var zsxx7 =$scope.print_spd_top.zsxx7||'';
                var zsxx8 =$scope.print_spd_top.zsxx8||'';
                var zsxx9 =$scope.print_spd_top.zsxx9||'';
                var zsxx10 =$scope.print_spd_top.zsxx10||'';
                var zsxx11 =$scope.print_spd_top.zsxx11||'';
                var zsxx12 =$scope.print_spd_top.zsxx12||'';
                var giftDiscount =$scope.print_spd_top.giftDiscount||'';
                var comprehensiveDiscount =$scope.print_spd_top.comprehensiveDiscount||'';
                var zsxx =$scope.giftListAllPage.data||'';
                var zxxxs = [];
                var flag;//1表示打印老审批单,2表示打印新审批单
                if($scope.accountModule==1){
                    flag = 2;
                    zxxxs=$scope.giftListAllPage.data;
                }else{
                    flag = 1;
                    zxxxs =[
                        {zsxx:zsxx1},{zsxx:zsxx2},{zsxx:zsxx3},{zsxx:zsxx4},{zsxx:zsxx5},{zsxx:zsxx6},
                        {zsxx:zsxx7},{zsxx:zsxx8},{zsxx:zsxx9},{zsxx:zsxx10},{zsxx:zsxx11},{zsxx:zsxx12}
                    ]
                }
                //保险保额信息
                var cheSunBX = 0;
                var sanZheBX = 0;
                var siJiBX = 0;
                var chengKeBX = 0;
                var boLiBX = 0;
                var huahenBX = 0;
                var huoWuBX = 0;
                var jingShenSunShiBX = 0;
                var feiYongBuChangBX = 0;
                var zhiDingXiuLiBX = 0;
                if($("#chesun").val()> 0){
                    var chesunNum =  $("#chesun").val();
                    cheSunBX = chesunNum;
                }else{
                    cheSunBX =  0;
                }
                if($("#sanzhe").val().indexOf(":") > -1){
                    var sanzheNum =  $("#sanzhe").val().split(":")[1];
                    sanZheBX = sanzheNum;
                }else{
                    sanZheBX =  0;
                }
                // console.log("三责 " + sanZheBX)
                if($("#siji").val()> 100){
                    var sijiNum =  $("#siji").val();
                    siJiBX = sijiNum;
                }else{
                    siJiBX =  0;
                }
                // console.log("司机 " + siJiBX)
                if($("#chengke").val() > 100){
                    var chengkeNum =  $("#chengke").val();
                    chengKeBX = chengkeNum;
                }else{
                    chengKeBX =  0;
                }
                // console.log("乘客  " + chengKeBX )
                if($("#huahen").val().indexOf(":") > -1){
                    var huahenNum =  $("#huahen").val().split(":")[1];
                    huahenBX = huahenNum;
                }else{
                    huahenBX =  0;
                }
                //  console.log("划痕 " + huahenBX)
                if($("#boli").val().indexOf(":") > -1){
                    var boliNum =  $("#boli").val().split(":")[1];
                    boLiBX = boliNum;
                }else{
                    boLiBX =  0;
                }
                //  console.log("玻璃 " + boLiBX)
                if($("#huowu").val() > 100){
                    var huowuNum =  $("#huowu").val();
                    huoWuBX = huowuNum;
                }else{
                    huoWuBX =  0;
                }
                // console.log("货物 " + huoWuBX)
                if($("#jingshen").val() > 10){
                    var jingshenNum =  $("#jingshen").val();
                    jingShenSunShiBX = jingshenNum;
                }else{
                    jingShenSunShiBX =  0;
                }
                //  console.log("精神损失 " + jingShenSunShiBX)
                if($("#feiyong").val() > 10){
                    var feiyongNum =  $("#feiyong").val();
                    feiYongBuChangBX = feiyongNum;
                }else{
                    feiYongBuChangBX =  0;
                }
                // console.log("费用补偿 " + feiYongBuChangBX)
                if($("#zhiding").val() > 10){
                    var zhidingNum =  $("#zhiding").val();
                    zhiDingXiuLiBX = zhidingNum;
                }else{
                    zhiDingXiuLiBX =  0;
                }
                // console.log("指定修理厂 " + zhiDingXiuLiBX)
                var insuredQuota = {"cheSun" : cheSunBX , "sanZhe" : sanZheBX , "siJi" : siJiBX, "chengKe" : chengKeBX , "huaHen" : huahenBX ,
                    "boLi" : boLiBX , "huoWu" : huoWuBX , "jingShenSunShi" : jingShenSunShiBX , "feiYongBuChang" : feiYongBuChangBX ,
                    "zhiDingXiuLi" : zhiDingXiuLiBX}
                var print_spd_datas = {
                    approvalBill:{carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,engineNumber:engineNumber,
                        carBrand:carBrand,vehicleModel:vehicleModel,jqxrqStart:jqxrqStart,jqxrqEnd:jqxrqEnd,
                        insurDate:insurDate,renewalType:renewalType,renewalWay:renewalWay,
                        solicitMember:solicitMember,insured:insured,bbxrzjh:bbxrzjh,
                        contact:contact,contactWay:contactWay,insurancTypes:insurancTypes,
                        kpxx:kpxx,syxje:syxje,jqxje:jqxje,insuranceCompName:insuranceCompName,
                        ccs:ccs,bfhj:bfhj,kpje:kpje,remark:remark, yhje:yhje,ssje:ssje,fkfs:fkfs,
                        xjyhdw:xjyhdw,czkje:czkje,czkjedw:czkjedw,
                        factoryLicenseType:factoryLicenseType,giftDiscount:giftDiscount,
                        comprehensiveDiscount:comprehensiveDiscount},
                    zsxxs: zxxxs,insuTypes:insuTypes
                }
                if(chassisNumber==''){
                    $scope.angularTip("车架号不能为空！",5000);
                    return;
                }
                $("#msgwindow").show();
                customerIWService.print_spd_submit(print_spd_datas,flag,insuredQuota).then(function(res){
                    $("#msgwindow").hide();
                    if(res.status == 'OK'){
                        var hr = "/pdf/"+chassisNumber+".pdf";
                        $("#iframe").attr("src", hr);
                        var ifr = document.getElementById("iframe");
                        if (ifr.attachEvent) {
                            ifr.attachEvent("onload", function() {
                                $scope.angularTip("Local if is now loaded attachEvent.",5000);
                            });
                        } else {
                            ifr.onload = function() {
                                setTimeout(function(){
                                    document.getElementById("iframe").contentWindow.print();
                                },200);
                            };
                        };


                    }else{
                        $scope.angularTip("操作失败",5000);
                    }
                });

            }
            $scope.close_spd_top = function(){
                $("#spd_top").hide();
                $scope.print_spd_top = {};
                $scope.cleanSingleDetails ();
            };
             //关闭窗口时清空保单明细数据
             $scope.cleanSingleDetails = function(){
                $scope.searchsingle ={};
                $scope.bihubaojia.CheSun = "";
                $scope.bihubaojia.SanZhe = "";
                $scope.bihubaojia.SiJick = "";
                $scope.bihubaojia.ChengKe = "";
                $scope.bihubaojia.HuaHen = "";
                $scope.bihubaojia.BoLi = "";
                $scope.bihubaojia.HcHuoWuZeRen = "";
                $scope.bihubaojia.HcJingShenSunShi = "";
                $scope.bihubaojia.hcFeiYongBuChang = "";
                $scope.bihubaojia.hcXiuLiBuChang = "";
            }

            //系统信息通知
            $scope.systemMsg=function(){
                $("#systemMsg").show();
                //查询系统通知消息
                loginService.findSysMessage()
                    .then(function (result) {
                        if (result.status == 'OK'||result.results.content.status == 'OK') {
                            $scope.systemMsgList = result.results.content.results;
                            //将未读消息数字置为0
                            $scope.topCount.sysMessageNum = 0;
                        } else {

                        };
                    });
            };
            //弹出建议新增页面
            $scope.suggest =function() {
                $scope.newSuggest = {};
                $("#suggestHtml").show();
            }
            //新增建议
            $scope.newSuggest = {};
            $scope.addSuggestbtn = function() {
                var title = $scope.newSuggest.title;
                var content = $scope.newSuggest.content;
                if(title==null||title==''){
                    $scope.angularTip("请输入标题！",5000);
                }else if(content==null||content==''){
                    $scope.angularTip("请输入内容！",5000);
                }else{
                    $("#msgwindow").show();
                    loginService.addSuggest($scope.newSuggest,$scope.user).then(function(result){
                        $("#msgwindow").hide();
                        if(result.results.content.status == 'OK'){
                            $("#suggestHtml").hide();
                            $scope.angularTip("新增成功！",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };

            //险种选中变状态
            $scope.checkboxChange = function(){
                $scope.PolicyValuebol = true;
                var length = parseInt(this.$$watchers.length-1);
                angular.forEach(this.$$watchers[length].last, function (each) {

                    //车损
                    each.typeId == 64 && each.checkStatus ?  $('#chesun').attr("disabled",false) : "";
                    each.typeId == 64 && !each.checkStatus ?  $('#chesun').attr("disabled",true) : "";
                    //三者
                    each.typeId == 65 && each.checkStatus ?  $('#sanzhe').attr("disabled",false) : "";
                    each.typeId == 65 && !each.checkStatus ?  $('#sanzhe').attr("disabled",true) : "";
                    //司机
                    each.typeId == 67 && each.checkStatus ?  $('#siji').attr("disabled",false) : "";
                    each.typeId == 67 && !each.checkStatus ?  $('#siji').attr("disabled",true) : "";
                    //乘客
                    each.typeId == 76 && each.checkStatus ?  $('#chengke').attr("disabled",false) : "";
                    each.typeId == 76 && !each.checkStatus ?  $('#chengke').attr("disabled",true) : "";
                    //划痕
                    each.typeId == 69 && each.checkStatus ?  $('#huahen').attr("disabled",false) : "";
                    each.typeId == 69 && !each.checkStatus ?  $('#huahen').attr("disabled",true) : "";
                    //玻璃
                    each.typeId == 70 && each.checkStatus ?  $('#boli').attr("disabled",false) : "";
                    each.typeId == 70 && !each.checkStatus ?  $('#boli').attr("disabled",true) : "";
                    //货物
                    each.typeId == 79 && each.checkStatus ?  $('#huowu').attr("disabled",false) : "";
                    each.typeId == 79 && !each.checkStatus ?  $('#huowu').attr("disabled",true) : "";
                    //精神
                    each.typeId == 77 && each.checkStatus ?  $('#jingshen').attr("disabled",false) : "";
                    each.typeId == 77 && !each.checkStatus ?  $('#jingshen').attr("disabled",true) : "";
                    //费用
                    each.typeId == 80 && each.checkStatus ?  $('#feiyong').attr("disabled",false) : "";
                    each.typeId == 80 && !each.checkStatus ?  $('#feiyong').attr("disabled",true) : "";
                    //指定
                    each.typeId == 74 && each.checkStatus ?  $('#zhiding').attr("disabled",false) : "";
                    each.typeId == 74 && !each.checkStatus ?  $('#zhiding').attr("disabled",true) : "";

                });
            };


        }
    ]);

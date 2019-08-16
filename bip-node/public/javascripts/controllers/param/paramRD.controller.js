'use strict';
angular.module('myApp')
    .controller('paramRD_Controller',['$rootScope','$scope','$filter','paramRDService','$state',
        function($rootScope,$scope,$filter,paramRDService,$state){
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            $scope.storeId = $rootScope.user.store.storeId;//4s店id
            //级别跟踪天数查询
            paramRDService.LevelSearch().then(function (result) {
                if (result.status == 'OK') {
                    $scope.LevelAll = result.results.content.result;
                } else {

                }
            });
            //修改级别跟踪天数
            $scope.Levelsubmit = function() {
                for (var i=0;i<$scope.LevelAll.length;i++){
                    if($scope.LevelAll[i].dayNumber<=0 || $scope.LevelAll[i].dayNumber>90){
                        $scope.angularTip("跟踪天数须在0-90天内",5000);
                        return
                    };
                    if($scope.LevelAll[i].customerLevel == "Z"){
                        $scope.warnDay = $scope.LevelAll[i].dayNumber;
                    }
                }
                if($scope.warnDay>=7 && $scope.warnDay<=90){
                    paramRDService.LevelSet($scope.LevelAll).then(function(res){
                        if(res.status == 'OK'){
                            $scope.angularTip("设置成功",5000);
                        }else{
                            $scope.angularTip("设置失败",5000);
                        }
                    });
                }else{
                    $scope.angularTip("首次提醒天数应大于7天，小于90天",5000)
                }


            }

            //模块开启设置查询
            $scope.moduleDetail = function() {
                paramRDService.moduleSearch().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.modulesetAll = result.results.content.result;
                        for(var i=0;i<$scope.modulesetAll.length;i++){
                            if($scope.modulesetAll[i].moduleName=="distribution"){
                                $scope.distribution = $scope.modulesetAll[i];
                                $scope.modulesetAll.splice($scope.modulesetAll.indexOf($scope.modulesetAll[i]), 1);
                            }else if($scope.modulesetAll[i].moduleName=="responsible_person"){
                                $scope.responsible_person = $scope.modulesetAll[i];
                                $scope.modulesetAll.splice($scope.modulesetAll.indexOf($scope.modulesetAll[i]), 1);
                            }
                        }
                    } else {

                    }
                });
            }
            $scope.moduleDetail();

            //修改分配方式设置
            $scope.distributionSet = function() {
                var arr = [];
                arr.unshift($scope.distribution);
                arr.unshift($scope.responsible_person);
                paramRDService.moduleSet(arr).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip("设置失败",5000);
                    }
                });
            };
            //修改模块开启设置
            $scope.modulesubmit = function() {
                var update = 0;
                var cover = 0;
                for(var i=0;i<$scope.modulesetAll.length;i++){
                    if($scope.modulesetAll[i].moduleName=="update"){
                        update = $scope.modulesetAll[i].switchOn;
                    };
                    if($scope.modulesetAll[i].moduleName=="cover"){
                        cover = $scope.modulesetAll[i].switchOn;
                    }
                };
                if(cover==1 && update==0){
                    $scope.angularTip("选择自动覆盖保险到期日需开启自动更新保险信息功能",5000);
                    return;
                }
                paramRDService.moduleSet($scope.modulesetAll).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                        $scope.moduleDetail();
                    }
                });
            };

            // 查询所有的保险公司
            paramRDService.InsuranceCompSearch().then(function (result) {
                if (result.success == true) {
                    $scope.InsuranceCompAll = result.content.list;
                } else {

                }
            });


            //更新选中的保险公司
            $scope.fourSId = $rootScope.user.store.storeId;
            $scope.InsuranceCompsubmit = function() {
                var insuranceCompIds = [];//选中的保险公司ID
                var InsuranceCompAll = $scope.InsuranceCompAll;
                for(var i=0; i<InsuranceCompAll.length; i++){
                    if(InsuranceCompAll[i].statu ==true){
                        insuranceCompIds.push(InsuranceCompAll[i].insuranceComp.insuranceCompId);
                    }
                }
                paramRDService.InsuranceCompSet(insuranceCompIds,$scope.fourSId).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip("设置失败",5000);
                    }
                });
            };

            // 手续费设置中 显示选中的保险公司
            $scope.FactorageComp = function() {
            paramRDService.InsuranceCompSearch().then(function (result) {
                if (result.success == true) {
                    $scope.FactorageAll = result.content.list;
                } else {

                }
            });
            };
            $scope.factoragesetAllMap = {};
            $scope.factoragesetAllId = {};
            //手续费查询
            $scope.FactorageCompSearch = function() {
                $scope.compPreId = this.Factorage.insuranceComp.insuranceCompId;
                $scope.factoragesetAllMap = {};
                paramRDService.FactorageSearch( $scope.compPreId).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.FactoragesetAll = result.results.content.result;
                        for(var i=0;i<$scope.FactoragesetAll.length;i++){
                            $scope.factoragesetAllMap[$scope.FactoragesetAll[i].insuName] = $scope.FactoragesetAll[i].insuPercent;
                            $scope.factoragesetAllId[$scope.FactoragesetAll[i].insuName] = $scope.FactoragesetAll[i].factorageId;
                        }
                    } else {

                    }
                });
            };
            //测试手续费格式
            $scope.testfactorage = function(){
                var regu = /^[0-9]\d*\.?\d{0,2}$/;
                var binsuranceNew =  $scope.factoragesetAllMap.binsuranceNew;
                var cinsuranceNew =  $scope.factoragesetAllMap.cinsuranceNew;
                var binsurance =  $scope.factoragesetAllMap.binsurance;
                var cinsurance =  $scope.factoragesetAllMap.cinsurance;
                var binsuranceNewLoan =  $scope.factoragesetAllMap.binsuranceNewLoan;
                var cinsuranceNewLoan =  $scope.factoragesetAllMap.cinsuranceNewLoan;
                if(!(regu.test(binsuranceNew))){
                    $scope.angularTip("新保商业险手续费(全款)格式不正确！不能为负数且最多为2位小数",5000);
                }else if(!(regu.test(cinsuranceNew))){
                    $scope.angularTip("新保交强险手续费(全款)格式不正确！不能为负数且最多为2位小数",5000);
                }else if(!(regu.test(binsurance))){
                    $scope.angularTip("商业险手续费格式不正确！不能为负数且最多为2位小数",5000);
                }else if(!(regu.test(cinsurance))){
                    $scope.angularTip("交强险手续费格式不正确！不能为负数且最多为2位小数",5000);
                }else if(!(regu.test(binsuranceNewLoan))){
                    $scope.angularTip("新保商业险手续费(贷款)格式不正确！不能为负数且最多为2位小数",5000);
                }else if(!(regu.test(cinsuranceNewLoan))){
                    $scope.angularTip("新保交强险手续费(贷款)格式不正确！不能为负数且最多为2位小数",5000);
                }else{
                    paramRDService.factorageSet($scope.FactoragesetAll).then(function(res){
                        if(res.status == 'OK'){
                            $scope.angularTip("设置成功",5000);
                        }else{
                            $scope.angularTip("设置失败",5000);
                        }
                    });
                }
            }
            //修改手续费设置
            $scope.Factoragesubmit = function() {
                var compPreId = $scope.compPreId;
                var sxfsetBol = true;
                for(var i=0;i<4;i++){
                    var sxfVal = $("#sxfSet").children(".lable-title").eq(i).children("input").val()
                    if (sxfVal == "" || sxfVal == null){
                        sxfsetBol = false;
                    }
                }
                if(compPreId ==""|| compPreId == null){
                    $scope.angularTip("请选择保险公司",5000);
                }else if(sxfsetBol == false){
                    $scope.angularTip("请将手续费填写完！",5000);
                }else if (sxfsetBol == true){
                    var storeId = $rootScope.user.store.storeId;
                    var regu = /^[0-9]\d*\.?\d{0,2}$/;
                    var binsuranceNew =  $scope.factoragesetAllMap.binsuranceNew;
                    var cinsuranceNew =  $scope.factoragesetAllMap.cinsuranceNew;
                    var binsurance =  $scope.factoragesetAllMap.binsurance;
                    var cinsurance =  $scope.factoragesetAllMap.cinsurance;
                    var binsuranceNewLoan =  $scope.factoragesetAllMap.binsuranceNewLoan;
                    var cinsuranceNewLoan =  $scope.factoragesetAllMap.cinsuranceNewLoan;
                    var compPreId = $scope.compPreId;
                    $scope.FactoragesetAll = [
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "binsuranceNew",
                            insuPercent: binsuranceNew,
                            factorageId:$scope.factoragesetAllId[binsuranceNew]||null
                        },
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "cinsuranceNew",
                            insuPercent: cinsuranceNew,
                            factorageId:$scope.factoragesetAllId[cinsuranceNew]||null
                        },
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "binsurance",
                            insuPercent: binsurance,
                            factorageId:$scope.factoragesetAllId[binsurance]||null
                        },
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "cinsurance",
                            insuPercent: cinsurance,
                            factorageId:$scope.factoragesetAllId[cinsurance]||null
                        },
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "binsuranceNewLoan",
                            insuPercent: binsuranceNewLoan,
                            factorageId:$scope.factoragesetAllId[binsuranceNewLoan]||null
                        },
                        {
                            storeId: storeId,
                            compPreId: compPreId,
                            insuName: "cinsuranceNewLoan",
                            insuPercent: cinsuranceNewLoan,
                            factorageId:$scope.factoragesetAllId[cinsuranceNewLoan]||null
                        }
                    ];
                    $scope.testfactorage();

                }
            };

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-70
                };
            },100);
            //查看详情悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            };


            //查询所有失销/回退原因
            $scope.reasonAllPage = {};
            $scope.reasonAllPage.enableCellEditOnFocus = true;
            $scope.reasonAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '失销/回退原因', field: 'reason',enableColumnMenu: false},
                    { name: '排序', field: 'sort',enableColumnMenu: false},
                    { name: '状态', field: 'status',cellFilter: 'mapDE',enableColumnMenu: false},
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.modifyReason(row.entity)" class="btn btn-default btn-sm genzcl">查看详情</button>'+
                        '</div></div>'},
                ]
            };
            $scope.reasonBtn = function(){
                $("#msgwindow").show();
                var Data = {storeId:$scope.storeId}
                paramRDService.findAllReason(Data).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.reasonAllPage.data = result.results.content.result;
                        for(var i=1;i<=$scope.reasonAllPage.data.length;i++){
                            $scope.reasonAllPage.data[i-1].index = i;
                        }
                    } else {

                    }
                });
            };
            //失销/回退原因详情
            $scope.detailReason = {};
            $scope.modifyReason = function(rowData){
                $scope.reasonData = rowData;
                $scope.detailReason.reason = rowData.reason;
                $scope.detailReason.sort = rowData.sort;
                $scope.detailReason.status = rowData.status.toString();
                $scope.detailReason.disable = rowData.disable;
                var id = rowData.id;
                $("#modifyReasonbox").show();
                $scope.modifyReasonSubmit = function(){
                    var reg = /^[1-9]\d*$/;
                    if($scope.detailReason.reason==""||$scope.detailReason.reason==null){
                        $scope.angularTip("请填写原因",5000);
                        return;
                    }
                    if($scope.detailReason.sort==""||$scope.detailReason.sort==null){
                        $scope.angularTip("请填写序号",5000);
                        return;
                    }
                    if(!(reg.test($scope.detailReason.sort))){
                        $scope.angularTip("序号应为为正整数",5000);
                        return;
                    }
                    var modifyDatas = {reason:$scope.detailReason.reason,sort:$scope.detailReason.sort,
                        status:$scope.detailReason.status,id:id};
                    paramRDService.updateReason(modifyDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyReasonbox").hide();
                            rowData.reason = $scope.detailReason.reason;
                            rowData.sort = $scope.detailReason.sort;
                            rowData.status = $scope.detailReason.status;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };
            //新增失销/回退原因
            $scope.addReason = {};
            $scope.addReasonBtn = function(){
                $("#addReasonbox").show();
                $scope.addReason = {};
                $scope.addReason.status = "1";
            };
            $scope.addNewReason = function(){
                var reason = $scope.addReason.reason;
                var sort = $scope.addReason.sort;
                var status = $scope.addReason.status;
                var index = $scope.reasonAllPage.data.length+1;
                var reg = /^[1-9]\d*$/;
                if(reason==""||reason==null){
                    $scope.angularTip("请填写原因",5000);
                    return;
                }
                if(sort==""||sort==null){
                    $scope.angularTip("请填写序号",5000);
                    return;
                }
                if(!(reg.test(sort))){
                    $scope.angularTip("序号应为为正整数",5000);
                    return;
                }
                if(index>16){
                    $scope.angularTip("最多只可额外增加5条原因",5000);
                    return;
                }
                var Datas = {reason:reason,sort:sort,status:status,storeId:$scope.storeId};
                $("#msgwindow").show();
                paramRDService.addReason(Datas).then(function(result){
                    $("#msgwindow").hide();
                    if( result.status == 'OK'){
                        var id = result.results.content.id;
                        var newDatas = {reason:reason,sort:sort,status:status,id:id,index:index,disable:1};
                        $scope.reasonAllPage.data.push(newDatas);
                        $("#addReasonbox").hide();
                        $scope.angularTip("新增原因成功",5000);
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            };

            //删除失销/回退原因
            $scope.deleteReasonbtn = function() {
                var id = $scope.reasonData.id;
                paramRDService.deleteById({id:id}).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("删除成功",5000);
                        $scope.reasonAllPage.data.splice($scope.reasonAllPage.data.indexOf( $scope.reasonData), 1);
                        $("#modifyReasonbox").hide();
                    }else{
                        $scope.angularTip("删除失败",5000);
                    }
                });
            };
        }
    ]);

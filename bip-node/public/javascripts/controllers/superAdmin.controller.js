'use strict';
angular.module('myApp')
    .controller('superAdminController',['$rootScope','$scope','$filter','superAdminService','$state','$cookies','ExportExcel',
        function($rootScope,$scope,$filter,superAdminService,$state,$cookies,ExportExcel){
            $state.go('superAdmin.index');
            $scope.logos = [{id:'1',value:'北京博福'},{id:'2',value:'传慧嘉和'}];
            //$scope.
            //新加险种弹框
            $scope.addInsurancebtn = function() {
                $("#addInsurancebox").show();
                $scope.addInsurance.status = 0;
                $("#status0").addClass("insuStatusColor");
                $("#status1").removeClass("insuStatusColor");
            };
            //新加保险公司弹框
            $scope.addCompanybtn = function() {
                $("#addCompanybox").show();
            };
            //新加品牌弹框
            $scope.addBrandsbtn = function() {
                $("#addBrandsbox").show();
                $scope.cjSearch = {};
                $scope.factoryBtn();
            };
            //新加车型弹框
            $scope.addCartypebtn = function() {
                $("#addCartypebox").show();
            };
            //新加店名弹框
            $scope.addStorebtn = function() {
                $scope.searchBlocs();
                $scope.addStore = {};
                $scope.addStore.logo='1';
                $scope.addStore.bhxx=0;
                $scope.addStore.bhbj=0;
                $scope.addStore.dockType = 0;
                $scope.storeType1=2;
                $scope.storeType2=2;
                $scope.storeType3=2;
                $scope.storeType4=2;
                $scope.storeType5=2;
                $scope.storeType6=2;
                $("#addStorebox").show();

            };
            //查询集团
            $scope.searchBlocs = function() {
                superAdminService.findBlocByCondition({}).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.blocSearchAll = result.results.content.result;
                    } else {

                    }
                });
            };
            $scope.searchBlocs();
            //查询厂家
            superAdminService.findVenderByCondition({}).then(function (result) {
                if (result.status == 'OK') {
                    $scope.factorySearch = result.results.content.result;
                } else {

                }
            });
            //新加系统信息弹框
            $scope.addsystembtn = function() {
                $("#addsystembox").show();
            };
            //新加厂家弹框
            $scope.addFactorybtn = function() {
                $("#addFactorybox").show();
            };
            //新加集团弹框
            $scope.addBlocbtn = function() {
                $("#addBlocbox").show();
                $scope.addBloc = {};
                $scope.blocType1=2;
                $scope.blocType2=2;
                $scope.blocType3=2;
                $scope.blocType4=2;
                $scope.blocType5=2;
                $scope.blocType6=2;
            };
            //修改密码弹框
            $scope.changePassBtn = function() {
                $("#changePass").show();
            };
            //弹框
            $scope.scmUsershow = function (){
                $(".scmUserTip").show();
            };
            $scope.scmUserhide = function (){
                $(".scmUserTip").hide();
            };
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

            //查询所有险种
            $scope.insuranceAll = {};
            $scope.insuranceAll.enableCellEditOnFocus = true;
            $scope.insuranceAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false},
                    { field: 'typeName',width:200,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span col="col" class="ui-grid-cell-contents cursor">险种</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addInsurancebtn();"></span></div>'},
                    { name: '是否有保额', width:100,enableColumnMenu: false,
                        cellTemplate:'<div class="ui-grid-cell-contents"><span ng-if="row.entity.status==0">否</span><span ng-if="row.entity.status==1">是</span></div>',},
                    { name: '备注', field: 'remark',enableColumnMenu: false},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.updateInsubtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '禁用',width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor ng-scope">' +
                        '<img ng-click="grid.appScope.jinyongbtn(row)" class="ng-scope" ng-if="row.entity.deleted==0" src="../../images/enablered.png" />' +
                        '<img ng-click="grid.appScope.jinyongbtn(row)" class="ng-scope" ng-if="row.entity.deleted==1" src="../../images/enablered2.png" />' +
                        '</div>',
                        enableColumnMenu: false,enableSorting:false}
                ]
            };
            $scope.insurancebtn = function(){
                $("#msgwindow").show();
                superAdminService.findInsu().then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuranceAll.data = result.results.content.result;
                        $scope.modityInsuAll = result.results.content.result1;
                        $scope.companyInsuAll = result.results.content.result1;
                        for(var i=1;i<=$scope.insuranceAll.data.length;i++){
                            var j = i-1;
                            $scope.insuranceAll.data[j].index = i;
                        }
                    } else {

                    }
                });
            };

            $scope.insuStatusName = "";
            $scope.jinyongbtn = function(row){
                var deleted = 0;
                if(row.entity.deleted==0){
                    $scope.insuStatusName = "是否禁用该险种？";
                    deleted = 1;
                    superAdminService.findInsuComp().then(function (result) {
                        if (result.status == 'OK') {
                            var typeName = row.entity.typeName;
                            var insuranceCompAlls = result.results.content.result;
                            var boo = false;
                            for(var i=0;i<insuranceCompAlls.length;i++){
                                if(insuranceCompAlls[i].typeName!=null&&insuranceCompAlls[i].typeName.length>0){
                                    var typeNames = insuranceCompAlls[i].typeName.split("/");
                                    for(var j=0;j<typeNames.length;j++){
                                        if(typeNames[j]==typeName){
                                            $scope.insuStatusName = "该险种已被保险公司选定，禁用后该险种将在保险公司选定险种中取消，是否确认禁用？";
                                            boo = true;
                                            break;
                                        }
                                    }
                                }
                                if(boo){
                                    break;
                                }
                            }
                            $("#pause").show();
                        } else {

                        }
                    });
                }else{
                    $scope.insuStatusName = "是否取消禁用该险种？";
                    $("#pause").show();
                }
                $scope.makeSure = function() {
                    $("#pause").hide();
                    $("#msgwindow").show();
                    var typeId = row.entity.typeId;
                    var typeName = row.entity.typeName;
                    var condition = {typeId:typeId,deleted:deleted,typeName:typeName};
                    superAdminService.updateInsu(condition).then(function(res){
                        $("#msgwindow").hide();
                        if(res.status == 'OK'){
                            if(row.entity.deleted==0){
                                row.entity.deleted = 1;
                                $scope.angularTip("禁用成功",5000);
                            }else{
                                row.entity.deleted = 0;
                                $scope.angularTip("取消禁用成功",5000);
                            }
                        }else{
                            if(row.entity.deleted==0){
                                $scope.angularTip("禁用失败",5000);
                            }else{
                                $scope.angularTip("取消禁用失败",5000);
                            }
                        }
                    });
                };
            }
            //编辑险种弹窗
            $scope.insuRow = {};
            $scope.updateInsubtn = function(row){
                $scope.insuRow = row;
                var typeId = row.entity.typeId;
                $("#msgwindow").show();
                superAdminService.findInsuByTypeId(typeId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.updateInsurance = result.results.content.result;
                        if($scope.updateInsurance.status==0){
                            $("#status2").addClass("insuStatusColor");
                            $("#status3").removeClass("insuStatusColor");
                        }else{
                            $("#status3").addClass("insuStatusColor");
                            $("#status2").removeClass("insuStatusColor");
                        }
                        $("#updateInsurancebox").show();
                    } else {

                    }
                });
            };

            //修改险种
            $scope.updateInsuSubmit = function(){
                var oldTypeName = $scope.insuRow.entity.typeName;
                var typeId = $scope.updateInsurance.typeId;
                var typeName = $scope.updateInsurance.typeName;
                var remark = $scope.updateInsurance.remark;
                var status = $scope.updateInsurance.status;
                if(typeName == ''|| typeName == null){
                    $scope.angularTip("险种不能为空",5000);
                    return;
                }
                var condition = {typeId:typeId,typeName:typeName,remark:remark,status:status,oldTypeName:oldTypeName};
                $("#msgwindow").show();
                superAdminService.updateInsu(condition).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuRow.entity.typeName = $scope.updateInsurance.typeName;
                        $scope.insuRow.entity.remark = $scope.updateInsurance.remark;
                        $scope.insuRow.entity.status = $scope.updateInsurance.status;
                        $scope.angularTip("编辑险种成功",5000);
                        $("#updateInsurancebox").hide();
                    } else {
                        $scope.angularTip("编辑险种成功",5000);
                    }
                });
            };

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-50
                };
                $scope.gridboxCjia = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-80
                };
                $scope.gridboxJy = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-105
                };
            },200);
            //禁用险种
            $scope.deleteInsubtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    superAdminService.deleteInsu(row.entity.typeId).then(function(res){
                        if(res.status == 'OK'){
                            $scope.angularTip("禁用成功",5000);
                            $scope.insuranceAll.data.splice($scope.insuranceAll.data.indexOf(row.entity), 1);
                        }else{
                            $scope.angularTip("禁用失败",5000);
                        }
                    });
                };
            };

            $scope.xuanze = function(num){
                if(num==0){
                    $("#status0").addClass("insuStatusColor");
                    $("#status1").removeClass("insuStatusColor");
                    $scope.addInsurance.status = 0;
                }else if(num==1){
                    $("#status1").addClass("insuStatusColor");
                    $("#status0").removeClass("insuStatusColor");
                    $scope.addInsurance.status = 1;
                }else if(num==2){
                    $("#status2").addClass("insuStatusColor");
                    $("#status3").removeClass("insuStatusColor");
                    $scope.updateInsurance.status = 0;
                }else{
                    $("#status3").addClass("insuStatusColor");
                    $("#status2").removeClass("insuStatusColor");
                    $scope.updateInsurance.status = 1;
                }
            }
            //提交新增险种
            $scope.addInsurance = {};
            $scope.addInsuSubmit = function() {
                var typeName =$scope.addInsurance.typeName;
                var remark =$scope.addInsurance.remark;
                var status =$scope.addInsurance.status;
                var index = $scope.insuranceAll.data.length+1;
                var InsuDatas = {typeName:typeName,remark:remark,index:index,status:status};
                if(typeName == ''|| typeName == null){
                    $scope.angularTip("增加险种失败，险种不能为空",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.addInsu(InsuDatas).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var typeId = result.results.content.typeId;
                            var newInsuDatas = {typeName:typeName,remark:remark,index:index,typeId:typeId,status:status,deleted:0};
                            $scope.insuranceAll.data.unshift(newInsuDatas);
                            $scope.addInsurance = {};
                            $("#addInsurancebox").hide();
                            $scope.angularTip("新增险种成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };

            //查询保险公司
            $scope.insuranceCompAll = {};
            $scope.insuranceCompAll.enableCellEditOnFocus = true;
            $scope.insuranceCompAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { field: 'insuranceCompName',width:150,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">保险公司</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addCompanybtn()"></span></div>'},
                    { name: '险种', field: 'typeName',enableColumnMenu: false},
                    { name: '博福报价key', field: 'insuranceKey', width:150, enableColumnMenu: false},
                    { name: '备注', field: 'remark', width:150, enableColumnMenu: false},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyInsuCompbtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.deleteInsuCompbtn(row)">' +
                        '<span class="glyphicon glyphicon-trash" ></span></div>'}
                ]
            };
            $scope.insuranceCompbtn = function(){
                $("#msgwindow").show();
                superAdminService.findInsuComp().then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.insuranceCompAll.data = result.results.content.result;
                        for(var i=1;i<=$scope.insuranceCompAll.data.length;i++){
                            var j = i-1;
                            $scope.insuranceCompAll.data[j].index = i;
                        }
                        $scope.insurancebtn();
                    } else {

                    }
                });
            }

            //删除保险公司
            $scope.deleteInsuCompbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    superAdminService.deleteInsuComp(row.entity.insuranceCompId).then(function(res){
                        if(res.status == 'OK'){
                            $scope.angularTip("删除成功",5000);
                            $scope.insuranceCompAll.data.splice($scope.insuranceCompAll.data.indexOf(row.entity), 1);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };

            //编辑保险公司弹框
            $scope.modifyCompany = {};
            $scope.modifyInsuCompbtn = function(row) {
                $scope.modifyCompany.insuranceCompId = row.entity.insuranceCompId;
                $scope.modifyCompany.insuranceCompName = row.entity.insuranceCompName;
                $scope.modifyCompany.insuranceKey = row.entity.insuranceKey;
                $scope.modifyCompany.remark = row.entity.remark;
                $scope.modifyCompany.typeName = row.entity.typeName;
                var modifytypeNames = [];//选中的险种
                var modityInsuAll = $scope.modityInsuAll;
                $("#modifyCompanybox").show();
                var InsuArr = $scope.modifyCompany.typeName.split("/");
                for (var i = 0; i < $scope.modityInsuAll.length; i++) {
                    $scope.modityInsuAll[i].status= false;
                    for(var j = 0; j < InsuArr.length; j++){
                        if ($scope.modityInsuAll[i].typeName == InsuArr[j]) {
                            $scope.modityInsuAll[i].status= true;
                        }
                    }
                }
                $scope.modityComSubmit = function(){
                    for(var i=0; i<modityInsuAll.length; i++){
                        var chk = $("#modityInsuCheck").children(".checkbox-inline").eq(i).children("input[type='checkbox']");
                        if(chk.is(':checked')==true){
                            modifytypeNames.push(modityInsuAll[i].typeName);
                        }
                    }
                    var modifytypeName = modifytypeNames.join("/");
                    var modifyCompDatas = {insuranceCompId:$scope.modifyCompany.insuranceCompId,
                        remark:$scope.modifyCompany.remark,typeName:modifytypeName,insuranceKey:$scope.modifyCompany.insuranceKey};
                    superAdminService.modityInsuComp(modifyCompDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyCompanybox").hide();
                            row.entity.typeName = modifytypeName;
                            row.entity.remark = $scope.modifyCompany.remark;
                            row.entity.insuranceKey = $scope.modifyCompany.insuranceKey;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };

            //提交新增保险公司
            $scope.addCompany = {};
            $scope.addCompanySubmit = function() {
                var typeNames = [];//选中的险种
                var companyInsuAll = $scope.companyInsuAll;
                for(var i=0; i<companyInsuAll.length; i++){
                    var chk = $("#InsuCheck").children(".checkbox-inline").eq(i).children("input[type='checkbox']");
                    if(chk.is(':checked')==true){
                        typeNames.push(companyInsuAll[i].typeName);
                    }
                }
                var typeName = typeNames.join("/");
                var insuranceCompName =$scope.addCompany.insuranceCompName;
                var insuranceKey =$scope.addCompany.insuranceKey;
                var remark =$scope.addCompany.remark;
                var index = $scope.insuranceCompAll.data.length+1;
                var CompDatas = {insuranceCompName:insuranceCompName,remark:remark,typeName:typeName,index:index,insuranceKey:insuranceKey};
                if(insuranceCompName == ''|| insuranceCompName == null){
                    $scope.angularTip("增加失败，保险公司不能为空",5000);
                }else if(typeNames.length == 0){
                    $scope.angularTip("请选择险种",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.addInsuComp(CompDatas).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var insuranceCompId = result.results.content.insuranceCompId;
                            var newCompDatas = {insuranceCompName:insuranceCompName,remark:remark,typeName:typeName,
                                index:index,insuranceCompId:insuranceCompId,insuranceKey:insuranceKey};
                            $scope.insuranceCompAll.data.unshift(newCompDatas);
                            $scope.addCompany = {};
                            for(var i=0; i<companyInsuAll.length; i++){
                                $("#InsuCheck").children(".checkbox-inline").eq(i).children("input[type='checkbox']").attr("checked", false);
                            };
                            $("#addCompanybox").hide();
                            $scope.angularTip("新增保险公司成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };

            //查询汽车品牌
            $scope.carBrandAll = {};
            $scope.carBrandAll.enableCellEditOnFocus = true;
            $scope.carBrandAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '厂家', field: 'vender.venderName',enableColumnMenu: false},
                    { name: '厂家英文', field: 'vender.venderEnglish',enableColumnMenu: false},
                    { field: 'brandName',width:200,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span  class="ui-grid-cell-contents cursor">品牌</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addBrandsbtn()"></span></div>'},
                    { name: '品牌英文', field: 'brandEnglish',enableColumnMenu: false},
                    { name: '备注', field: 'remark',enableColumnMenu: false},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyBrandbtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.deleteCarbtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ]
            };
            $scope.ppSearch={};
            $scope.carBrandbtn = function(){
                var venderName = $scope.ppSearch.venderName;
                var venderEnglish = $scope.ppSearch.venderEnglish;
                var brandName = $scope.ppSearch.brandName;
                var brandEnglish = $scope.ppSearch.brandEnglish;
                var Datas = {venderName:venderName,venderEnglish:venderEnglish,brandName:brandName,brandEnglish:brandEnglish};
                $("#msgwindow").show();
                superAdminService.findcarBrand(Datas).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.carBrandAll.data = result.results.content.result;
                        for(var i=1;i<=$scope.carBrandAll.data.length;i++){
                            var j = i-1;
                            $scope.carBrandAll.data[j].index = i;
                        }
                        $scope.addcarBrandAll = result.results.content.result;
                        $scope.modifyStoreCarBrandAll = result.results.content.result;
                    } else {

                    }
                });
            }
            $scope.carBrandbtn();

            //删除汽车品牌
            $scope.deleteCarbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    $("#msgwindow").show();
                    superAdminService.deleteCarBrand(row.entity.brandId).then(function(res){
                        $("#msgwindow").hide();
                        if(res.status == 'OK'){
                            $scope.carBrandAll.data.splice($scope.carBrandAll.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };

            //编辑汽车品牌
            $scope.modifyBrand = {};
            $scope.modifyBrandbtn = function(row) {
                $("#msgwindow").show();
                var Datas = {venderName:"",venderEnglish:""};
                superAdminService.findVenderByCondition(Datas).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.factorySearch = result.results.content.result;
                        $scope.factoryNames = [];
                        for(var i=0;i<$scope.factorySearch.length;i++){
                            $scope.factoryNames.push($scope.factorySearch[i].venderName);
                        }
                        $("#modifyBrandsbox").show();
                        $scope.modifyBrand.brandName = row.entity.brandName;
                        $scope.modifyBrand.brandEnglish = row.entity.brandEnglish;
                        $scope.modifyBrand.remark = row.entity.remark;
                        $scope.modifyBrand.brandId = row.entity.brandId;
                        if(row.entity.venderId!=null){
                            for(var i=0;i<$scope.factorySearch.length;i++){
                                if(row.entity.vender.venderName == $scope.factorySearch[i].venderName){
                                    $scope.modifyBrand.factoryName = $scope.factorySearch[i].venderName;
                                }
                            }
                        }
                    } else {

                    }
                });

                $scope.modityBrandSubmit = function(){
                    if($scope.modifyBrand.factoryName==""||$scope.modifyBrand.factoryName==null){
                        $scope.angularTip("厂家名不能为空",5000);
                        return;
                    }
                    if($scope.modifyBrand.brandName==""||$scope.modifyBrand.brandName==null){
                        $scope.angularTip("品牌不能为空",5000);
                        return;
                    }
                    if($scope.modifyBrand.brandEnglish==""||$scope.modifyBrand.brandEnglish==null){
                        $scope.angularTip("品牌英文名不能为空",5000);
                        return;
                    }
                    var reg=/^[a-zA-Z]+$/;
                    if(!reg.test($scope.modifyBrand.brandEnglish)){
                        $scope.angularTip("品牌英文名格式不正确",5000);
                        return;
                    }
                    for(var i=0;i<$scope.factorySearch.length;i++){
                        if($scope.modifyBrand.factoryName == $scope.factorySearch[i].venderName){
                            $scope.modifyBrand.venderId = $scope.factorySearch[i].id;
                            $scope.modifyBrand.venderEnglish = $scope.factorySearch[i].venderEnglish;
                        }
                    }
                    var modifyBrandDatas = {brandName:$scope.modifyBrand.brandName, brandEnglish:$scope.modifyBrand.brandEnglish,
                        venderId:$scope.modifyBrand.venderId,remark:$scope.modifyBrand.remark,brandId:$scope.modifyBrand.brandId};
                    superAdminService.updateCarBrand(modifyBrandDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyBrandsbox").hide();
                            row.entity.brandName = $scope.modifyBrand.brandName;
                            row.entity.brandEnglish = $scope.modifyBrand.brandEnglish;
                            if(row.entity.vender==null){
                                 row.entity.vender={venderName:"",venderEnglish:""};
                            }
                            row.entity.vender.venderName = $scope.modifyBrand.factoryName;
                            row.entity.vender.venderEnglish = $scope.modifyBrand.venderEnglish;
                            row.entity.remark = $scope.modifyBrand.remark;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };

            //新增汽车品牌
            $scope.addBrand = {};
            $scope.addBrandSubmit = function() {
                if($scope.addBrand.factory == ''|| $scope.addBrand.factory == null){
                    $scope.angularTip("请选择厂家",5000);
                    return
                }
                var venderId =$scope.addBrand.factory.id;
                var venderName =$scope.addBrand.factory.venderName;
                var venderEnglish =$scope.addBrand.factory.venderEnglish;
                var brandName =$scope.addBrand.brandName;
                var brandEnglish =$scope.addBrand.brandEnglish;
                var remark =$scope.addBrand.remark;
                var index = $scope.carBrandAll.data.length+1;
                var BrandDatas = {brandName:brandName,brandEnglish:brandEnglish,remark:remark,index:index,venderId:venderId};
                var reg=/^[a-zA-Z]+$/;
                if(brandName == ''|| brandName == null){
                    $scope.angularTip("汽车品牌不能为空",5000);
                }else  if(brandEnglish == ''|| brandEnglish == null){
                    $scope.angularTip("品牌英文不能为空",5000);
                }else if(!reg.test(brandEnglish)){
                    $scope.angularTip("品牌英文名格式不正确",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.addCarBrand(BrandDatas).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var brandId = result.results.content.brandId;
                            var newBrandDatas = {brandName:brandName,brandEnglish:brandEnglish,remark:remark,index:index,venderId:venderId,
                                vender:{venderName:venderName,venderEnglish:venderEnglish},brandId:brandId};
                            $scope.carBrandAll.data.unshift(newBrandDatas);
                            $scope.addBrand = {};
                            $("#addBrandsbox").hide();
                            $scope.angularTip("新增汽车品牌成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };

            //查询车型
            $scope.cartypeAll = {};
            $scope.cartypeAll.enableCellEditOnFocus = true;
            $scope.cartypeAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '品牌', field: 'brandName',width:200,enableColumnMenu: false},
                    { field: 'modelName',width:200,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">车型</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addCartypebtn()"></span></div>'},
                    { name: '备注', field: 'remark',enableColumnMenu: false},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor"  ng-click="grid.appScope.deleteCartypebtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ]
            };
            $scope.cartypebtn = function(){
                $scope.carBrandbtn();
                $("#msgwindow").show();
                superAdminService.findCartype().then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.cartypeAll.data = result.results.content.result;
                        for(var i=1;i<=$scope.cartypeAll.data.length;i++){
                            var j = i-1;
                            $scope.cartypeAll.data[j].index = i;
                        }
                    } else {

                    }
                });
            }

            //删除车型
            $scope.deleteCartypebtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    superAdminService.deleteCartype(row.entity.modelId).then(function(res){
                        if(res.status == 'OK'){
                            $scope.cartypeAll.data.splice($scope.cartypeAll.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };

            //新增车型
            $scope.addCartype = {};
            $scope.Cartypecheck = function() {
                $scope.typebrandId = this.addcarBrand.brandId;
                $scope.typebrandName = this.addcarBrand.brandName;
            };
            $scope.addCarModelSubmit = function() {
                var modelName =$scope.addCartype.modelName;
                var remark =$scope.addCartype.remark;
                var brandName = $scope.typebrandName;
                var brandId = $scope.typebrandId;
                var index = $scope.cartypeAll.data.length+1;
                var CartypeDatas = {modelName:modelName,brandName:brandName,brandId:brandId,remark:remark,index:index};

                if(modelName == ''|| modelName == null){
                    $scope.angularTip("增加失败，车型不能为空",5000);
                }else if(brandName == ''|| brandName == null){
                    $scope.angularTip("请选择品牌",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.addCarModel(CartypeDatas).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var modelId = result.results.content.modelId;
                            var newCartypeDatas = {modelName:modelName,brandName:brandName,brandId:brandId,
                                remark:remark,index:index,modelId:modelId};
                            $scope.cartypeAll.data.unshift(newCartypeDatas);
                            $scope.addCartype = {};
                            $("#addCartypebox").hide();
                            $scope.angularTip("新增车型成功",5000);
                        }else{
                            $scope.angularTip("新增车型失败",5000);
                        }
                    });
                }
            };


            //查询4S店
            $scope.storeAll = {};
            $scope.storeAll.enableCellEditOnFocus = true;
            $scope.storeAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '集团', width:100,field: 'bloc.jtName',enableColumnMenu: false,cellTooltip: true},
                    { field: 'storeName',width:120,cellTooltip: true,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">店名</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addStorebtn()"></span></div>'},
                    { name: '绑定店名',width:120,cellTooltip: true, field: 'bspStore.bspStoreName',enableColumnMenu: false},
                    { name: 'AM帐号',width:110, field: 'adminAccount',enableColumnMenu: false},
                    { name: '品牌', field: 'carBrand',enableColumnMenu: false,cellTooltip: true},
                    { name: '报价车险配置', field: 'bhDock',cellFilter:'mapBXDJ',enableColumnMenu: false},
                    { name: '报价渠道码', field: 'agent',enableColumnMenu: false,cellTooltip: true},
                    { name: '备注', field: 'remark',enableColumnMenu: false,cellTooltip: true},
                    { name: '有效期', field: 'vaildDate',cellFilter: 'date:"yyyy-MM-dd"',enableColumnMenu: false},
                    { name: '密码重置', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.dglyResetShow(row)">' +
                        '<span class="glyphicon glyphicon-lock"></span></div>'},
                    { name: '绑定状态', width:90,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div><span ng-show="row.entity.bangStatu==1" class="glyphicon" style="color: rgb(7, 96, 60);">已绑定</span>' +
                        '<span ng-show="row.entity.bangStatu!=1" class="glyphicon" style="color: rgb(200, 63, 38);">未绑定</span></div>'},
                    { name: '绑定4S店', width:95,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-show="row.entity.bangStatu!=1" ng-click="grid.appScope.bindStorebtn(row.entity)">' +
                        '<span class="glyphicon a-bind" style="color: rgb(200, 63, 38);">绑定</span></div>'+
                        '<div class="cursor" ng-show="row.entity.bangStatu==1" ng-click="grid.appScope.bip_unbind_bsp_store(row.entity)">' +
                            '<span class="glyphicon a-bind" style="color: rgb(7, 96, 60);">解绑</span></div>'},
                    { name: '初始化', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.resetStorebtn(row)">' +
                        '<span class="glyphicon glyphicon-cog"></span></div>'},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyStorebtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor"  ng-click="grid.appScope.deleteStorebtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ]
            };
            $scope.storeSearch={};
            $scope.storebtn = function(pageType){
                $scope.searchBlocs();
                $scope.pageType = pageType;
                var jtName = $scope.storeSearch.jtName;
                var storeName = $scope.storeSearch.storeName;
                var data = {jtName:jtName,storeName:storeName};
                $("#msgwindow").show();
                superAdminService.findStore(data).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.storeAll.data = result.results.content.result;
                        for(var i=1;i<=$scope.storeAll.data.length;i++){
                            var j = i-1;
                            $scope.storeAll.data[j].index = i;
                        }
                    } else {

                    }
                });
            }
            $scope.bindStore = {};

            //查询BSP-4S店
            $scope.findBspStore = function(){
                $scope.bsp_stores = [];
                superAdminService.findBspStore().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.bsp_stores = result.results.content.result;
                        if($scope.bsp_stores.length==0){
                            $scope.bsp_stores = [{bspStoreName:'当前没有未绑定的4S店'}];
                        }
                    } else {

                    }
                });
            }
            //打开绑定页面
            $scope.bindStorebtn = function(store){
                $scope.bindStore = {};
                $('#bindStorebox').show();
                $scope.thisRowData = store;
                $scope.bindStore.storeName = store.storeName;
                $scope.bindStore.storeId = store.storeId;
                $scope.findBspStore();
            };
            //选中4S店时
            $scope.select_bsp_store = function(bsp_store){
                $scope.bindStore.bspStoreName = bsp_store.bspStoreName||'';
                $scope.bindStore.bspStoreId = bsp_store.bspStoreId||-1;
            }

            //确认绑定操作
            $scope.bip_bind_bsp_store = function(){
                var bspStoreId = $scope.bindStore.bspStoreId||-1;
                var bspStoreName = $scope.bindStore.bspStoreName||'';
                var storeId = $scope.bindStore.storeId||-1;
                if(bspStoreId==-1){
                    $scope.angularTip("请选择一个4S店",5000);
                    return;
                }
                $("#msgwindow").show();
                superAdminService.sysnBspStore(bspStoreName,bspStoreId,storeId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $('#bindStorebox').hide();
                        $scope.angularTip("绑定成功",5000);
                        $scope.thisRowData.bangStatu = 1;
                        $scope.thisRowData.bspStore = {bspStoreName:bspStoreName,bspStoreId:bspStoreId};
                    } else {
                        $scope.angularTip("绑定失败",5000);
                    }
                });
            }

            //解除绑定操作
            $scope.bip_unbind_bsp_store = function(store){
                $scope.thisRowData = store;
                $("#unbind_store").show();
                $scope.makesure = function() {
                    $("#unbind_store").hide();
                    $("#msgwindow").show();
                    var storeId = store.storeId;
                    superAdminService.delBangedBspStore(storeId).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.angularTip("解除绑定成功", 5000);
                            $scope.thisRowData.bangStatu = 0;
                            $scope.thisRowData.bspStore = {};
                        } else {
                            $scope.angularTip(result.results.message, 5000);
                        }
                    });
                }
            }

            //查询用户
            var storeId=$rootScope.user.store.storeId;
            $scope.userOptions = {};
            $scope.userOptions = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { field: 'loginName',enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">用户名</span><span class="slick-header-button" style=" margin: 1px;"  ng-click="grid.appScope.adduserbtn()"></span></div>'},
                    { name: '用户姓名', field: 'userName',enableColumnMenu: false},
                    { name: '联系电话', field: 'phone' ,enableColumnMenu: false},
                    { name: '角色', field: 'role.roleName',enableColumnMenu: false},
                    { name: '邮箱', field: 'email',enableColumnMenu: false},
                    { name: '密码重置', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.resetShow(row)">' +
                        '<span class="glyphicon glyphicon-lock"></span></div>'},
                    { name: '编辑',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyUserBtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '删除用户',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.deleteUserbtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
            //新增用户按钮
            $scope.adduserbtn = function() {
                $("#adduser_xtyh").show();
            };
            $scope.findUser = function(){
                superAdminService.findUser_xtyh().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.userOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userOptions.data.length;i++){
                            var j = i-1;
                            $scope.userOptions.data[j].index = i;
                        }
                    } else {

                    }
                });
            }
            //查询用户--行政建店
            $scope.findUser_xzjd = function(pageType){
                $scope.pageType =pageType;
                superAdminService.findUser_xzjd().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.userOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userOptions.data.length;i++){
                            var j = i-1;
                            $scope.userOptions.data[j].index = i;
                        }
                    } else {

                    }
                });
            }

            //查询区域分析师和店的关系
            $scope.userAndStoreOptions = {};
            $scope.userAndStoreOptions = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '用户姓名', field: 'userName',enableColumnMenu: false},
                    { name: '联系电话', field: 'phone' ,enableColumnMenu: false},
                    { name: '管辖店', field: 'stores',width:600,enableColumnMenu: false},
                    { name: '操作',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.checkStore(row)">编辑</div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            //查询区域分析师和店的关系-行政建店
            $scope.findUser_xzjd_store = function(){
                $scope.pageType = "pzd";
                superAdminService.findUser_xzjd_store().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.userAndStoreOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userAndStoreOptions.data.length;i++){
                            var j = i-1;
                            $scope.userAndStoreOptions.data[j].index = i;
                            var storeList = $scope.userAndStoreOptions.data[i-1].storeList;
                            var strorArr = [];
                            for(var j=0;j<storeList.length;j++){
                                strorArr.push(storeList[j].storeName);
                            }
                            $scope.userAndStoreOptions.data[i-1].stores= strorArr.join("、");
                        }
                    } else {

                    }
                });
            }

            //绑定店
            $scope.checkStore = function(row) {
                $scope.checkedStores = [];
                $("#storeCheckBox").show();
                $scope.userData =  row.entity;
                var dataAnalystId = row.entity.id;
                superAdminService.findStoreByUser(dataAnalystId).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.addStoreAll = result.results.content.result;
                        $scope.checkedStores = result.results.content.result1;
                        for(var i=0; i< $scope.addStoreAll.length; i++){
                            $scope.addStoreAll[i].state = 0;
                            for(var j=0; j< $scope.checkedStores.length; j++){
                                if($scope.checkedStores[j].storeId==$scope.addStoreAll[i].storeId){
                                    $scope.addStoreAll[i].state = 1;
                                }
                            }
                        }
                    } else {

                    }
                });
            };
            $scope.checkedStores = [];
            $scope.chooseStore = function(storeList) {
                storeList.state = 1;
                $scope.checkedStores.push(storeList);
            };
            $scope.deleteStore = function(storeList) {
                storeList.state = 0;
                $scope.checkedStores.splice($scope.checkedStores.indexOf(storeList), 1);
                for(var i=0; i< $scope.addStoreAll.length; i++){
                    if(storeList.storeId==$scope.addStoreAll[i].storeId){
                        $scope.addStoreAll[i].state = 0;
                    }
                }
            };
            //修改区域分析和店之间的关联
            $scope.makesureStore = function() {
                $scope.userData.stores = [];
                var dataAnalystId = $scope.userData.id;
                var stores = [];
                var storeIdList = [];
                for(var i=0; i<$scope.checkedStores.length; i++){
                    stores.push($scope.checkedStores[i].storeName);
                    storeIdList.push($scope.checkedStores[i].storeId)
                }
                var storeIds = storeIdList.join(",");
                var data = {dataAnalystId:dataAnalystId,storeIds:storeIds}
                superAdminService.updateUserAndStore(data).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.userData.stores = stores.join("、");
                        $("#storeCheckBox").hide();
                        $scope.angularTip("编辑成功",5000);
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            };
            $scope.currentFocused = "";
            //重置密码弹框按钮
            $scope.resetShow = function(row){
                $scope.resetid =  row.entity.id;
                $("#resetPass").show();

            }
            //店管理员重置密码弹框按钮
            $scope.dglyResetShow = function(row){
                $scope.resetAdminAccount =  row.entity.adminAccount;
                $("#dglyResetPass").show();
            }
            //集团重置密码弹框按钮
            $scope.blocResetShow = function(row){
                $scope.resetAdminAccount =  row.entity.jtAdminAccount;
                $("#dglyResetPass").show();
            }

            //删除用户
            $scope.deleteUserbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    superAdminService.deleteUser(row.entity.id,row.entity.roleId).then(function(result){
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $scope.userOptions.data.splice($scope.userOptions.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
            };

            //重置密码
            $scope.resetPasswordbtn = function() {
                superAdminService.resetPassword($scope.resetid).then(function(result){
                    if(result.results.content.status == 'OK'){
                        $("#resetPass").hide();
                        $scope.angularTip("重置成功",5000);
                    }else{
                        $scope.angularTip("重置失败",5000);
                    }
                });
            };
            //店管理员重置密码
            $scope.dglyResetPasswordbtn = function() {
                superAdminService.dglyResetPassword($scope.resetAdminAccount).then(function(result){
                    if(result.results.content.status == 'OK'){
                        $("#dglyResetPass").hide();
                        $scope.angularTip("重置成功",5000);
                    }else{
                        $scope.angularTip("重置失败",5000);
                    }
                });
            }

            //提交新增用户信息
            $scope.addnewuser = {};
            $scope.addUsersubmit = function() {
                var shortStoreName='BOFIDE';
                var loginName =shortStoreName+"_"+$scope.addnewuser.loginName;
                var userName =$scope.addnewuser.userName;
                var phone =$scope.addnewuser.phone;
                var roleId = null;
                var roleName = null;
                if($scope.addnewuser.role){
                    roleId =$scope.addnewuser.role.roleId;
                    roleName =$scope.addnewuser.role.roleName;
                }
                var email =$scope.addnewuser.email;
                var remark =$scope.addnewuser.remark;
                var password = 123456;
                var index = $scope.userOptions.data.length+1;

                var userDatas = {storeId:storeId,loginName:loginName,userName:userName, phone:phone, roleId:roleId,
                    email:email,remark:remark,password:password,role:{roleName:roleName},index:index
                };
                var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                if($scope.addnewuser.loginName == ''|| $scope.addnewuser.loginName == null){
                    $scope.angularTip("用户名不能为空",5000);
                }else if(!(/^(\w)+$/.test(loginName))){
                    $scope.angularTip("用户名格式不正确,应由字母、数字、下划线组成",5000);
                }else if(userName == ''|| userName == null){
                    $scope.angularTip("姓名不能为空",5000);
                }else if(!(phone == ''|| phone == null) && !(/^1[345789]\d{9}$/.test(phone))){
                    $scope.angularTip("手机号码不正确",5000);
                }else if(roleId == null){
                    $scope.angularTip("请选择角色",5000);
                }else if(!(email == ''|| email == null) && !(re_email.test(email))){
                    $scope.angularTip("邮箱不正确",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.addUser(userDatas).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status == 'OK'){
                            var userId = result.results.content.userId;
                            var newData = { storeId:storeId,loginName:loginName,userName:userName, phone:phone, roleId:roleId,
                                email:email,remark:remark,password:password,role:{roleName:roleName},index:index,id:userId
                            }
                            $scope.userOptions.data.unshift(newData);
                            $scope.addnewuser = {};
                            $("#adduser_xtyh").hide();
                            $scope.angularTip(result.results.message,5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };
            var roleId = $rootScope.user.role.roleId;
            if(roleId==17){
                superAdminService.findRole_xzjd().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.roleIds = result.results.content.result;
                    } else {

                    }
                });
            }else{
                superAdminService.findRole_xtyh().then(function (result) {
                    if (result.status == 'OK') {
                        $scope.roleIds = result.results.content.result;
                    } else {

                    }
                });
            }

            //修改用户信息
            $scope.modifyuser = {};
            $scope.modifyUserBtn = function(row) {
                $scope.modifyuser = {};
                var id = row.entity.id;
                var strLoginName = row.entity.loginName;
                var storeId = row.entity.storeId;
                $scope.modifyuser.userName = row.entity.userName;
                $scope.modifyuser.phone = row.entity.phone;
                $scope.modifyuser.roleId = row.entity.roleId;
                $scope.modifyuser.roleName = row.entity.role.roleName;
                $scope.modifyuser.email = row.entity.email;
                $scope.modifyuser.remark = row.entity.remark;
                var shortStoreName='BOFIDE';
                var SNlength = shortStoreName.length+1;
                $scope.modifyuser.loginName = strLoginName.substring(SNlength);
                $("#modifyuserbox").show();
                $scope.modifyUserSubmit = function(){
                    var newloginName = shortStoreName+"_"+$scope.modifyuser.loginName;
                    var modifyUserDatas = {id:id,storeId:storeId,loginName:newloginName,userName:$scope.modifyuser.userName,
                        phone:$scope.modifyuser.phone,email: $scope.modifyuser.email,remark:$scope.modifyuser.remark};

                    var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    if($scope.modifyuser.loginName == ''|| $scope.modifyuser.loginName == null){
                        $scope.angularTip("用户名不能为空",5000);
                    }else if(!(/^(\w)+$/.test($scope.modifyuser.loginName))){
                        $scope.angularTip("用户名格式不正确,应由字母、数字、下划线组成",5000);
                    }else if($scope.modifyuser.userName == ''|| $scope.modifyuser.userName == null){
                        $scope.angularTip("姓名不能为空",5000);
                    }else if(!($scope.modifyuser.phone == ''|| $scope.modifyuser.phone == null) && !(/^1[345789]\d{9}$/.test($scope.modifyuser.phone))){
                        $scope.angularTip("手机号码不正确",5000);
                    }else if(!($scope.modifyuser.email == ''|| $scope.modifyuser.email == null) && !(re_email.test($scope.modifyuser.email))){
                        $scope.angularTip("邮箱不正确",5000);
                    }else {
                        superAdminService.modityUser(modifyUserDatas).then(function(result){
                            if( result.status == 'OK'&&result.results.content.status=='OK'){
                                $("#modifyuserbox").hide();
                                row.entity.loginName = newloginName;
                                row.entity.userName = $scope.modifyuser.userName;
                                row.entity.phone = $scope.modifyuser.phone;
                                row.entity.email = $scope.modifyuser.email;
                                row.entity.remark = $scope.modifyuser.remark;
                                $scope.angularTip("修改成功",5000);
                            }else{
                                $scope.angularTip(result.results.message,5000);
                            }
                        });
                    }
                }
            };

            //删除4S店
            $scope.deleteStorebtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    superAdminService.deleteStore(row.entity.storeId).then(function(result){
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $scope.storeAll.data.splice($scope.storeAll.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };

            //初始化4S店数据
            $scope.resetStorebtn = function(row) {
                $("#resetStoreTip").show();
                $scope.resetStore = {};
                $scope.resetStoreSubmit = function() {
                    var loginName =  $scope.resetStore.loginName;
                    var password =  $scope.resetStore.password;
                    var storeId = row.entity.storeId;
                    $("#msgwindow").show();
                    superAdminService.formatStoreById(storeId,loginName,password).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#resetStorebox").hide();
                            $scope.angularTip("初始化成功",5000);
                        }else{
                            $("#resetStorebox").hide();
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
            };

            //编辑4S店信息
            $scope.modifyStore = {};
            $scope.modifyStorebtn = function(row) {
                $scope.modType2=2;
                $scope.modType4=2;
                $scope.modType5=2;
                $scope.modType6=2;
                $scope.storeEditData = row.entity;
                $scope.modifyStore.storeId = row.entity.storeId;
                $scope.modifyStore.storeName = row.entity.storeName;
                $scope.modifyStore.shortStoreName = row.entity.shortStoreName;
                $scope.modifyStore.adminAccount = row.entity.adminAccount;
                $scope.modifyStore.remark = row.entity.remark;
                $scope.modifyStore.carBrand = row.entity.carBrand;
                $scope.modifyStore.bhDock = row.entity.bhDock;
                if($scope.modifyStore.bhDock == 0||$scope.modifyStore.bhDock == 4){
                    $scope.modifyStore.dockType = $scope.modifyStore.bhDock;
                    $scope.modifyStore.bhxx = 0;
                    $scope.modifyStore.bhbj = 0;
                }else if($scope.modifyStore.bhDock == 1){
                    $scope.modifyStore.dockType = 5;
                    $scope.modifyStore.bhxx = 1;
                    $scope.modifyStore.bhbj = 1;
                }else if($scope.modifyStore.bhDock == 2){
                    $scope.modifyStore.dockType = 5;
                    $scope.modifyStore.bhxx = 1;
                    $scope.modifyStore.bhbj = 0;
                }else if($scope.modifyStore.bhDock == 3){
                    $scope.modifyStore.dockType = 5;
                    $scope.modifyStore.bhxx = 0;
                    $scope.modifyStore.bhbj = 1;
                }
                $scope.modifyStore.agent = row.entity.agent;
                $scope.modifyStore.bihuKey = row.entity.bihuKey;
                $scope.modifyStore.cityCode = row.entity.cityCode;
                $scope.modifyStore.shopId = row.entity.shopId;
                $scope.modifyStore.token = row.entity.token;
                $scope.modifyStore.vaildDate = $filter('date')(row.entity.vaildDate,'yyyy-MM-dd');

                $scope.modifyStore.registName = row.entity.registName;
                $scope.modifyStore.taxNum = row.entity.taxNum;
                $scope.modifyStore.code = row.entity.code;
                $scope.modifyStore.bloc = {};
                $scope.modifyStore.blocId = "";
                if(row.entity.bloc != ''&& row.entity.bloc!= null){
                    $scope.modifyStore.blocId =row.entity.bloc.jtId;
                }
                $scope.modifyStore.fzr = row.entity.fzr;
                $scope.modifyStore.lxr = row.entity.lxr;
                $scope.modifyStore.phone = row.entity.phone;
                $scope.modifyStore.email = row.entity.email;
                $scope.modifyStore.logo = row.entity.logo.toString();
                $scope.modifyStore.address = row.entity.address;
                $scope.modifyStore.vaildDateStart = $filter('date')(row.entity.vaildDateStart,'yyyy-MM-dd');
                $scope.modifyStore.updateSMS = row.entity.updateSMS;
                $scope.modifyStore.messageBalance = row.entity.messageBalance;
                $("#modifyStorebox").show();
                $scope.modifyStoreSubmit = function(){
                    if($scope.modifyStore.dockType==0 || $scope.modifyStore.dockType==4){
                        $scope.modifyStore.bhDock = $scope.modifyStore.dockType;
                    }
                    if($scope.modifyStore.dockType==5){
                        if($scope.modifyStore.bhxx==1 && $scope.modifyStore.bhbj==0){
                            $scope.modifyStore.bhDock = 2;
                        }else if($scope.modifyStore.bhxx==0 && $scope.modifyStore.bhbj==1){
                            $scope.modifyStore.bhDock = 3;
                        }else if($scope.modifyStore.bhxx==1 && $scope.modifyStore.bhbj==1){
                            $scope.modifyStore.bhDock = 1;
                        }else if($scope.modifyStore.bhxx==0 && $scope.modifyStore.bhbj==0){
                            $scope.angularTip("请选择车险对接类型",5000);
                            return;
                        }
                    }
                    var bhDock =$scope.modifyStore.bhDock;
                    var bihuKey = $scope.modifyStore.bihuKey || null;
                    var cityCode = $scope.modifyStore.cityCode || null;
                    var shopId = $scope.modifyStore.shopId || null;
                    var token = $scope.modifyStore.token || null;
                    var vaildDate =$scope.modifyStore.vaildDate;
                    var vaildDateStart =$scope.modifyStore.vaildDateStart;
                    var registName = $scope.modifyStore.registName;
                    var taxNum = $scope.modifyStore.taxNum;
                    var code = $scope.modifyStore.code;
                    var fzr = $scope.modifyStore.fzr;
                    var lxr = $scope.modifyStore.lxr;
                    var phone = $scope.modifyStore.phone;
                    var email = $scope.modifyStore.email;
                    var address = $scope.modifyStore.address;
                    var carBrand = $scope.modifyStore.carBrand;
                    var blocId = $scope.modifyStore.blocId || null;
                    var logo = $scope.modifyStore.logo;
                    var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    var updateSMS = $scope.modifyStore.updateSMS;
                    var messageBalance = $scope.modifyStore.messageBalance;
                    if($scope.modifyStore.dockType==5 && (bhDock == 0||bhDock == 4)){
                        $scope.angularTip("请选择车险对接类型",5000);
                        return;
                    }
                    if(bhDock!=0 && bhDock!=4 && ($scope.modifyStore.agent == ""||$scope.modifyStore.agent == null)){
                        $scope.angularTip("请输入报价渠道码",5000);
                        return;
                    };
                    if(bhDock!=0 && bhDock!=4 && bihuKey == null){
                        $scope.angularTip("请输入报价密钥",5000);
                        return;
                    }
                    if(bhDock!=0 && bhDock!=4 && cityCode == null){
                        $scope.angularTip("请输入报价城市码",5000);
                        return;
                    }
                    if(bhDock==4 && shopId == null){
                        $scope.angularTip("请输入店ID",5000);
                        return;
                    }
                    if(bhDock==4 && token == null){
                        $scope.angularTip("请输入密钥",5000);
                        return;
                    }
                    if(!(phone == ''|| phone == null) && !(/^1[345789]\d{9}$/.test(phone))){
                        $scope.angularTip("手机号码不正确",5000);
                        return;
                    }
                    if(!(email == ''|| email == null) && !(re_email.test(email))){
                        $scope.angularTip("邮箱不正确",5000);
                        return;
                    }

                    if(vaildDateStart!=""&&vaildDateStart!=null&&vaildDate!=""&&vaildDate!=null && vaildDateStart>vaildDate){
                        $scope.angularTip("有效使用期时间填写错误",5000);
                        return;
                    }
                    if(carBrand == ''|| carBrand == null){
                        $scope.angularTip("品牌不能为空",5000);
                        return;
                    }
                    if($scope.modType2==0||$scope.modType4==0||$scope.modType5==0||$scope.modType6==0){
                        $scope.angularTip("信息填写有错误，请修改之后再提交",5000);
                        return;
                    }
                    var jtName;
                    for(var i=0; i< $scope.blocSearchAll.length; i++){
                        if(blocId==$scope.blocSearchAll[i].jtId){
                            jtName = $scope.blocSearchAll[i].jtName;
                        }
                    }
                    var modifyStoreDatas = {storeId:$scope.modifyStore.storeId, remark:$scope.modifyStore.remark,carBrand:carBrand,
                        vaildDate:vaildDate,bhDock:bhDock,agent:$scope.modifyStore.agent,bihuKey:bihuKey,cityCode:cityCode,shopId:shopId,
                        token:token,registName:registName,taxNum:taxNum,code:code,jtId:blocId,fzr:fzr,
                        lxr:lxr,phone:phone,email:email,address:address,vaildDateStart:vaildDateStart,logo:logo,updateSMS:updateSMS,messageBalance:messageBalance};
                    superAdminService.modityStore(modifyStoreDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyStorebox").hide();
                            row.entity.carBrand = carBrand;
                            row.entity.remark = $scope.modifyStore.remark;
                            row.entity.vaildDate = $scope.modifyStore.vaildDate;
                            row.entity.bhDock = $scope.modifyStore.bhDock;
                            row.entity.agent = $scope.modifyStore.agent;
                            row.entity.bihuKey = $scope.modifyStore.bihuKey;
                            row.entity.cityCode = $scope.modifyStore.cityCode;
                            row.entity.shopId = $scope.modifyStore.shopId;
                            row.entity.token = $scope.modifyStore.token;
                            row.entity.registName = registName;
                            row.entity.taxNum = taxNum;
                            row.entity.code = code;
                            row.entity.fzr = fzr;
                            row.entity.lxr = lxr;
                            row.entity.phone = phone;
                            row.entity.email = email;
                            row.entity.address = address;
                            row.entity.vaildDateStart = vaildDateStart;
                            row.entity.bloc={};
                            row.entity.bloc.jtId = blocId;
                            row.entity.bloc.jtName = jtName;
                            row.entity.logo = logo;
                            row.entity.updateSMS = updateSMS;
                            row.entity.messageBalance = messageBalance;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };

            //新增4S店
            $scope.addStore = {};
            $scope.addStoresubmitBtn = function() {
                var storeName =$scope.addStore.storeName;
                var shortStoreName =$scope.addStore.shortStoreName;
                var adminAccount =$scope.addStore.shortStoreName+"_AM";
                var adminPassword =123456;
                var remark =$scope.addStore.remark;
                var vaildDate =$scope.addStore.vaildDate;
                var dockType =$scope.addStore.dockType;
                if(dockType==0 || dockType==4){
                    $scope.addStore.bhDock = dockType;
                }
                if(dockType==5){
                    if($scope.addStore.bhxx==1 && $scope.addStore.bhbj==0){
                        $scope.addStore.bhDock = 2;
                    }else if($scope.addStore.bhxx==0 && $scope.addStore.bhbj==1){
                        $scope.addStore.bhDock = 3;
                    }else if($scope.addStore.bhxx==1 && $scope.addStore.bhbj==1){
                        $scope.addStore.bhDock = 1;
                    }else if($scope.addStore.bhxx==0 && $scope.addStore.bhbj==0){
                        $scope.angularTip("请选择车险对接类型",5000);
                        return;
                    }
                }
                var bhDock =$scope.addStore.bhDock;
                var agent =$scope.addStore.agent||null;
                var bihuKey = $scope.addStore.bihuKey || null;
                var cityCode = $scope.addStore.cityCode || null;
                var shopId = $scope.addStore.shopId;
                var token = $scope.addStore.token;

                var registName = $scope.addStore.registName;
                var taxNum = $scope.addStore.taxNum;
                var code = $scope.addStore.code;
                if($scope.addStore.bloc){
                    var jtName =$scope.addStore.bloc.jtName;
                    var jtId =$scope.addStore.bloc.jtId;
                }

                var fzr = $scope.addStore.fzr;
                var lxr = $scope.addStore.lxr;
                var phone = $scope.addStore.phone;
                var email = $scope.addStore.email;
                var address = $scope.addStore.address;
                var vaildDateStart = $scope.addStore.vaildDateStart;
                var carBrand = $scope.addStore.carBrand;
                var logo = $scope.addStore.logo;
                var index = $scope.storeAll.data.length+1;
                var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                if(storeName == ''|| storeName == null){
                    $scope.angularTip("新增失败，店名不能为空",5000);
                    return;
                }
                if(shortStoreName == ''|| shortStoreName == null){
                    $scope.angularTip("新增失败，店名缩写不能为空",5000);
                    return;
                }
                if(!(/^(\w)+$/.test(shortStoreName))){
                    $scope.angularTip("店名缩写格式不正确",5000);
                    return;
                }
                if(dockType==5 && (bhDock == 0||bhDock == 4)){
                    $scope.angularTip("请选择车险对接类型",5000);
                    return;
                }
                if(bhDock!=0&&bhDock!=4 && agent == null){
                    $scope.angularTip("请输入报价渠道码",5000);
                    return;
                }
                if(bhDock!=0&&bhDock!=4 && bihuKey == null){
                    $scope.angularTip("请输入报价密钥",5000);
                    return;
                }
                if(bhDock!=0&&bhDock!=4 && cityCode == null){
                    $scope.angularTip("请输入车险对接城市码",5000);
                    return;
                }
                if(bhDock==4 && shopId == null){
                    $scope.angularTip("请输入店ID",5000);
                    return;
                }
                if(bhDock==4 && token == null){
                    $scope.angularTip("请输入密钥",5000);
                    return;
                }
                if(!(phone == ''|| phone == null) && !(/^1[345789]\d{9}$/.test(phone))){
                    $scope.angularTip("手机号码不正确",5000);
                    return;
                }
                if(!(email == ''|| email == null) && !(re_email.test(email))){
                    $scope.angularTip("邮箱不正确",5000);
                    return;
                }

                if(vaildDateStart!=""&&vaildDateStart!=null&&vaildDate!=""&&vaildDate!=null && vaildDateStart>vaildDate){
                    $scope.angularTip("有效使用期时间填写错误",5000);
                    return;
                }
                if(carBrand == ''|| carBrand == null){
                    $scope.angularTip("品牌不能为空",5000);
                    return;
                }
                if($scope.storeType1==0||$scope.storeType2==0||$scope.storeType3==0||$scope.storeType4==0||$scope.storeType5==0||$scope.storeType6==0){
                    $scope.angularTip("信息填写有错误，请修改之后再提交",5000);
                    return;
                }
                var StoreDatas = {storeName:storeName,shortStoreName:shortStoreName,adminAccount:adminAccount, carBrand:carBrand,
                    remark:remark,adminPassword:adminPassword,index:index,vaildDate:vaildDate,bhDock:bhDock, agent:agent,bihuKey:bihuKey,
                    cityCode:cityCode,shopId:shopId,token:token,registName:registName,taxNum:taxNum,code:code,jtId:jtId,fzr:fzr,
                    lxr:lxr,phone:phone,email:email,address:address,vaildDateStart:vaildDateStart,logo:logo};
                $("#msgwindow").show();
                superAdminService.addStoreSubmit(StoreDatas).then(function(result){
                    $("#msgwindow").hide();
                    if( result.status == 'OK'&&result.results.content.status=='OK'){
                        var storeId = result.results.content.storeId;
                        var newStoreDatas = {storeName:storeName,shortStoreName:shortStoreName,adminAccount:adminAccount,bhDock:bhDock,
                            carBrand:carBrand,remark:remark,adminPassword:adminPassword,index:index,storeId:storeId,vaildDate:vaildDate,
                            agent:agent,bihuKey:bihuKey,cityCode:cityCode,bloc:{jtName:jtName,jtId:jtId},shopId:shopId,token:token,registName:registName,taxNum:taxNum,code:code,jtId:jtId,fzr:fzr,
                            lxr:lxr,phone:phone,email:email,address:address,vaildDateStart:vaildDateStart,logo:logo};
                        $scope.storeAll.data.unshift(newStoreDatas);
                        $scope.addStore = {};
                        $("#addStorebox").hide();
                        $scope.angularTip("新增4S店成功",5000);
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            };

            //按品牌名称首字母大小排序查询所有品牌
            $scope.searchBrand = {};
            $scope.findCarBrandByOrder = function() {
                var venderId =  $scope.searchBrand.venderId;
                var brandName =  $scope.searchBrand.brandName;
                var Datas = {venderId:venderId,brandName:brandName};
                superAdminService.findCarBrandByOrder(Datas).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.addStoreCarBrandAll = result.results.content.result;
                        for(var i=0; i< $scope.addStoreCarBrandAll.length; i++){
                            $scope.addStoreCarBrandAll[i].state = 0;
                            for(var j=0; j< $scope.checkedBrands.length; j++){
                                if($scope.checkedBrands[j].brandId==$scope.addStoreCarBrandAll[i].brandId){
                                    $scope.addStoreCarBrandAll[i].state = 1;
                                }
                            }
                        }
                    } else {

                    }
                });
            };
            //查询所有品牌
            superAdminService.findCarBrandByOrder({venderId:"",brandName:""}).then(function (result) {
                if (result.status == 'OK') {
                    $scope.allBrands = result.results.content.result;
                } else {

                }
            });
            $scope.checkedBrands = [];
            //选择品牌
            $scope.checkbrank = function(type) {
                $scope.searchBrand = {};
                $scope.brandType = type;
                $scope.checkedBrands = [];
                var oldBrands = [];
                if(type==1 && $scope.addStore.carBrand){
                    oldBrands = $scope.addStore.carBrand.split("/");
                }else if(type==2 && $scope.modifyStore.carBrand){
                    oldBrands = $scope.modifyStore.carBrand.split("/");
                }
                for(var i=0; i< $scope.allBrands.length; i++){
                    $scope.allBrands[i].state = 0;
                    for(var j=0; j< oldBrands.length; j++){
                        if(oldBrands[j]==$scope.allBrands[i].brandName){
                            $scope.allBrands[i].state = 1;
                            $scope.checkedBrands.push($scope.allBrands[i]);
                        }
                    }
                }
                $scope.findCarBrandByOrder();
                $("#brandCheckBox").show();
            };
            $scope.chooseBrand = function(CarBrand) {
                CarBrand.state = 1;
                $scope.checkedBrands.push(CarBrand);
            };
            $scope.deleteBrand = function(CarBrand) {
                CarBrand.state = 0;
                $scope.checkedBrands.splice($scope.checkedBrands.indexOf(CarBrand), 1);
                for(var i=0; i< $scope.addStoreCarBrandAll.length; i++){
                    if(CarBrand.brandId==$scope.addStoreCarBrandAll[i].brandId){
                        $scope.addStoreCarBrandAll[i].state = 0;
                    }
                }
            };
            $scope.makesureBrand = function() {
                var carBrands = [];
                for(var i=0; i<$scope.checkedBrands.length; i++){
                    carBrands.push($scope.checkedBrands[i].brandName);
                }
                if($scope.brandType==1){
                    $scope.addStore.carBrand = carBrands.join("/");
                }else if($scope.brandType==2){
                    $scope.modifyStore.carBrand = carBrands.join("/");
                }
                $("#brandCheckBox").hide();
            };

            //4S店信息查重
            $scope.findExistStoreByCondition = function(storeType){
                var storeName =$scope.addStore.storeName;
                var registName =$scope.addStore.registName;
                var shortStoreName =$scope.addStore.shortStoreName;
                var taxNum =$scope.addStore.taxNum;
                var code =$scope.addStore.code;
                var phone =$scope.addStore.phone;
                var storeDatas = {};
                if(storeType==1&&(storeName==""||storeName==null)){
                    $scope.storeType1=2;
                    return;
                }
                if(storeType==2&&(registName==""||registName==null)){
                    $scope.storeType2=2;
                    return;
                }
                if(storeType==3&&(shortStoreName==""||shortStoreName==null)){
                    $scope.storeType3=2;
                    return;
                }
                if(storeType==4&&(taxNum==""||taxNum==null)){
                    $scope.storeType4=2;
                    return;
                }
                if(storeType==5&&(code==""||code==null)){
                    $scope.storeType5=2;
                    return;
                }
                if(storeType==6&&(phone==""||phone==null)){
                    $scope.storeType6=2;
                    return;
                }
                if(storeType==1){
                    storeDatas = {storeName:storeName};
                }else if(storeType==2){
                    storeDatas = {registName:registName};
                }else if(storeType==3){
                    storeDatas = {shortStoreName:shortStoreName};
                }else if(storeType==4){
                    storeDatas = {taxNum:taxNum};
                }else if(storeType==5){
                    storeDatas = {code:code};
                }else if(storeType==6){
                    storeDatas = {phone:phone};
                }
                superAdminService.findExistStoreByCondition(storeDatas).then(function (result) {
                    if (result.status == 'OK') {
                        var storeBol = result.results.content.result;
                        if(storeType==1 && storeBol==true){
                            $scope.storeType1=0;
                        }else if(storeType==1 && storeBol==false){
                            $scope.storeType1=1;
                        }else if(storeType==2 && storeBol==true){
                            $scope.storeType2=0;
                        }else if(storeType==2 && storeBol==false){
                            $scope.storeType2=1;
                        }else if(storeType==3 && storeBol==true){
                            $scope.storeType3=0;
                        }else if(storeType==3 && storeBol==false){
                            $scope.storeType3=1;
                            $scope.addStore.adminAccount = shortStoreName+"_AM";
                        }else if(storeType==4 && storeBol==true){
                            $scope.storeType4=0;
                        }else if(storeType==4 && storeBol==false){
                            $scope.storeType4=1;
                        }else if(storeType==5 && storeBol==true){
                            $scope.storeType5=0;
                        }else if(storeType==5 && storeBol==false){
                            $scope.storeType5=1;
                        }else if(storeType==6 && storeBol==true){
                            $scope.storeType6=0;
                        }else if(storeType==6 && storeBol==false && (/^1[34578]\d{9}$/.test(phone))){
                            $scope.storeType6=1;
                        }
                    } else {
                    }
                });
            }
            //4S店信息查重
            $scope.ExistStoreMsg = function(modType){
                var registName =$scope.modifyStore.registName;
                var taxNum =$scope.modifyStore.taxNum;
                var code =$scope.modifyStore.code;
                var phone =$scope.modifyStore.phone;
                var storeDatas = {};
                if(modType==2&&(registName==""||registName==null||registName==$scope.storeEditData.registName)){
                    $scope.modType2=2;
                    return;
                }
                if(modType==4&&(taxNum==""||taxNum==null||taxNum==$scope.storeEditData.taxNum)){
                    $scope.modType4=2;
                    return;
                }
                if(modType==5&&(code==""||code==null||code==$scope.storeEditData.code)){
                    $scope.modType5=2;
                    return;
                }
                if(modType==6&&(phone==""||phone==null||phone==$scope.storeEditData.phone)){
                    $scope.modType6=2;
                    return;
                }
                if(modType==2){
                    storeDatas = {registName:registName};
                }else if(modType==4){
                    storeDatas = {taxNum:taxNum};
                }else if(modType==5){
                    storeDatas = {code:code};
                }else if(modType==6){
                    storeDatas = {phone:phone};
                }
                superAdminService.findExistStoreByCondition(storeDatas).then(function (result) {
                    if (result.status == 'OK') {
                        var storeBol = result.results.content.result;
                        if(modType==2 && storeBol==true){
                            $scope.modType2=0;
                        }else if(modType==2 && storeBol==false){
                            $scope.modType2=1;
                        }else if(modType==4 && storeBol==true){
                            $scope.modType4=0;
                        }else if(modType==4 && storeBol==false){
                            $scope.modType4=1;
                        }else if(modType==5 && storeBol==true){
                            $scope.modType5=0;
                        }else if(modType==5 && storeBol==false){
                            $scope.modType5=1;
                        }else if(modType==6 && storeBol==true){
                            $scope.modType6=0;
                        }else if(modType==6 && storeBol==false && (/^1[34578]\d{9}$/.test(phone))){
                            $scope.modType6=1;
                        }
                    } else {
                    }
                });
            }

            //查询系统信息
            $scope.systemAll = {};
            $scope.systemAll.enableCellEditOnFocus = true;
            $scope.systemAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { field: 'messageDate',cellFilter: 'date:"yyyy-MM-dd HH:mm"',width:200,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">发布时间</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addsystembtn()"></span></div>'},
                    { name: '内容', field: 'content',enableColumnMenu: false,cellTooltip: true},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor"  ng-click="grid.appScope.deleteystembtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ]
            };
            $scope.systembtn = function(){
                $("#msgwindow").show();
                superAdminService.findSysMessage().then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.systemAll.data = result.results.content.results;
                        for(var i=1;i<=$scope.systemAll.data.length;i++){
                            var j = i-1;
                            $scope.systemAll.data[j].index = i;
                        }
                    } else {

                    }
                });
            };
            //新增系统通知
            $scope.addsystem = {};
            $scope.addsystemSubmit = function() {
                var content =$scope.addsystem.content;
                if(content == ''|| content == null){
                    $scope.angularTip("系统信息不能为空",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.insertSysMessage(content).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var sysMessageId = result.results.content.results.sysMessageId;
                            var messageDate = result.results.content.results.messageDate;
                            var index = $scope.systemAll.data.length+1;
                            var newsysMessageDatas = {content:content,index:index,sysMessageId:sysMessageId,messageDate:messageDate};
                            $scope.systemAll.data.unshift(newsysMessageDatas);
                            $scope.addsystem = {};
                            $("#addsystembox").hide();
                            $scope.angularTip("新增系统通知成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };

            //删除系统通知
            $scope.deleteystembtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    $("#msgwindow").show();
                    superAdminService.deleteSysMessage(row.entity.sysMessageId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'){
                            $scope.systemAll.data.splice($scope.systemAll.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };
            $scope.newPwd = function(){
                var newPassword =$scope.change.newPassword;
                var patrn = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
                if (!patrn.exec(newPassword)){
                    $scope.angularTip("至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符",5000);
                }

            }
            //修改密码
            $scope.change = {};
            $scope.id = $rootScope.user.userId;
            $scope.changePasswordbtn = function() {
                var oldPassword =$scope.change.oldPassword;
                var newPassword =$scope.change.newPassword;
                var confirmPassword =$scope.change.confirmPassword;
                if(confirmPassword!=newPassword){
                    $scope.angularTip("两次输入的新密码不一致，请重新输入",5000);
                }else{
                    superAdminService.changePassword($scope.id,newPassword,oldPassword).then(function(result){
                        if(result.results.content.status == 'OK'){
                            //密码修改成功时把首次登陆状态变成0
                            $scope.user.firstLogin = 0;
                            var bip_user = JSON.parse($cookies.get('bip_user'));
                            bip_user.firstLogin = 0;
                            $cookies.put('bip_user', JSON.stringify(bip_user));
                            $("#firstChangePass").hide();

                            $("#changePass").hide();
                            $scope.angularTip("修改成功",5000);
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
            //
            $scope.logout = function(){
                superAdminService.logout()
                    .then(function (result) {
                        if (result.status == 'noLogin') {
                            window.location.href = '/index'
                        } else {
                            $scope.angularTip("注销失败",5000);
                        };
                    });
            }

            setTimeout(function(){
                if($rootScope.user.role.roleId==15){
                    $("#xtyh_li").addClass("active");
                    $("#xtyh").addClass("in active");
                    $scope.findUser();
                }else if($rootScope.user.role.roleId==17){
                    $("#jituan").addClass("active");
                    $("#jianjt").addClass("in active");
                    $scope.findBlocByCondition();
                }else if($rootScope.user.role.roleId==18){
                    $("#xzwh_li").addClass("active");
                    $("#xzwh").addClass("in active");
                    $scope.insurancebtn();
                }
            },300);

            //建议列表
            $scope.suggestAllPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:80, enableColumnMenu: false,type:'number',
                        headerCellTemplate:'<div role="button" class="ui-grid-cell-contents"><span>序号</span>(<span id="suggestNum">0</span>)</div>'},
                    { name: '公司名称', field: 'storeName',enableColumnMenu: false},
                    { name: '角色', field: 'userRoleName' ,enableColumnMenu: false},
                    { name: '反馈人', field: 'userName',enableColumnMenu: false},
                    { name: '电话', field: 'userPhone',enableColumnMenu: false},
                    { name: '标题', field: 'title',enableColumnMenu: false},
                    { name: '内容', field: 'content',enableColumnMenu: false},
                    { name: '提出时间', field: 'proposeTime',enableColumnMenu: false,width:145 },
                    { name: '处理状态', field: 'newStatus',enableColumnMenu: false,width:65},
                    { name: '回复内容', field: 'disContent',enableColumnMenu: false},
                    { name: '解决时间', field: 'solveTime',enableColumnMenu: false,width:145 },
                    { name: ' ',  enableColumnMenu: false,allowCellFocus:false,width:0,
                        cellTemplate:'<div class="lasttd" ng-init="grid.appScope.floatingWindow()">'+
                        '<div class="rowButtons">'+
                        '<button type="button" ng-click="grid.appScope.findBySuggest(row.entity)" class="btn btn-default btn-sm suggest">跟踪处理</button>'+
                        '</div></div>'},
                ],
                onRegisterApi : function(suggestGridApi) {
                    suggestGridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.searchMore);
                    $scope.suggestGridApi = suggestGridApi;
                }
            };
            $scope.selectStatus = [{num:0,name:'未解决'},{num:1,name:'已解决'}];
            $scope.search = {}; //多条件查询
            $scope.loadStatus = 2;
            $scope.startNumSearch = 0;
            $scope.searchMoreStatus = true;
            $scope.suggestSearchIndex = 1;
            $scope.suggetCount = 0;
            $scope.suggestAll = [];

            //加载更多按钮
            $scope.searchMore = function(){
                $scope.searchMoreStatus =false;
                $scope.suggestbtn();
                $scope.searchMoreStatus =true;
                $scope.loadStatus=1;//正在加载中。。。
            }
            var searchDatas = {};
            var newSearchDatas = {};
             //建议查询
            $scope.suggestbtn = function(){
                $("#msgwindow").show();
                var selectStoreName = $scope.search.storeName;
                var selectNum = $scope.search.num;
                var selectUserName = $scope.search.userName;
                newSearchDatas = {
                    selectStoreName:selectStoreName,
                    selectNum:selectNum,
                    selectUserName:selectUserName,
                }
                if($scope.searchMoreStatus){
                    $scope.startNumSearch = 0;
                    $scope.suggestAllPage.data = [];
                    $scope.suggestSearchIndex = 1;
                    searchDatas = newSearchDatas;
                }else{
                    $scope.startNumSearch = $scope.startNumSearch+1;
                }
                superAdminService.selectAllSuggest(searchDatas,$scope.startNumSearch).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.storeNames = [];
                        $scope.suggestAll = result.results.content.results;
                        for(var i=0;i<$scope.suggestAll.length;i++){
                            $scope.suggestAll[i].proposeTime = $filter('date')($scope.suggestAll[i].proposeTime, 'yyyy-MM-dd HH:mm/EEE');
                            $scope.suggestAll[i].solveTime = $filter('date')($scope.suggestAll[i].solveTime, 'yyyy-MM-dd HH:mm/EEE');
                            if($scope.suggestAll[i].status == 0){
                                $scope.suggestAll[i].solveTime = null;
                                $scope.suggestAll[i].newStatus = '未解决';
                            }else{
                                $scope.suggestAll[i].newStatus = '已解决';
                            }
                        }
                        $scope.suggetCount = result.results.content.policyCount;
                        $("#suggestNum").html($scope.suggetCount);
                        for(var i=0;i<result.results.content.storeNames.length;i++){
                            $scope.storeNames.push({storeName:result.results.content.storeNames[i]});
                        }

                        $scope.getPolicyPage();
                    }
                });
            }
            //将查询数据加上序号并放入表格中，
            $scope.getPolicyPage = function(){
                for(var i=0;i<$scope.suggestAll.length;i++){
                    $scope.suggestAll[i].index = $scope.suggestSearchIndex;
                    $scope.suggestAllPage.data.push($scope.suggestAll[i]);
                    $scope.suggestSearchIndex = $scope.suggestSearchIndex+1;
                }
                $scope.loadingPage();
            }
            //判断是否加载完成
            $scope.loadingPage = function(){
                if($scope.suggestAllPage.data.length>=$scope.suggetCount ||$scope.suggestAll.length<$rootScope.pageSize){
                    $scope.loadStatus=2; //全部加载完成
                    $scope.suggestGridApi.infiniteScroll.dataLoaded(false, false);
                }else{
                    $scope.loadStatus=0; //加载更多
                    $scope.suggestGridApi.infiniteScroll.dataLoaded(false, true);
                }
            }
            //多条件查询
            $scope.findByCondition = function(){
                $scope.suggestbtn();
            }
            //清空表单
            $scope.cleanForm = function(){
                $scope.search = {};
            };
            //弹出跟踪处理界面
            $scope.exhibitionSuggest = {};
            $scope.row = {};
            $scope.findBySuggest = function(obj){
                $("#disSuggestPage").show();
                $scope.row = obj;
                $scope.exhibitionSuggest.id = obj.id;
                $scope.exhibitionSuggest.uuId = obj.uuId;
                $scope.exhibitionSuggest.status = obj.status;
                $scope.exhibitionSuggest.storeName = obj.storeName;
                $scope.exhibitionSuggest.userRoleName = obj.userRoleName;
                $scope.exhibitionSuggest.proposeTime = obj.proposeTime;
                $scope.exhibitionSuggest.userName = obj.userName;
                $scope.exhibitionSuggest.userPhone = obj.userPhone;
                $scope.exhibitionSuggest.solveTime = obj.solveTime;
                $scope.exhibitionSuggest.title = obj.title;
                $scope.exhibitionSuggest.content = obj.content;
                $scope.exhibitionSuggest.disContent = obj.disContent;
            }
            //关闭跟踪处理窗口
            $scope.suggestPageClose = function(){
                $("#disSuggestPage").hide();
            }
            //出现确认窗口
            $scope.suggestNum = 0;
            $scope.solve = function(num){
                $scope.suggestNum = num;
                var disContent = $scope.exhibitionSuggest.disContent;
                if(num==1){
                    if(disContent!=null&&disContent.length>0){
                        $("#suggest_dis").show();
                    }else{
                        $scope.angularTip("请输入回复内容!",2000);
                    }
                }else{
                    $("#suggest_dis").show();
                }
            }
            //建议确认解决
            $scope.disSuggestTure = function(){
                $("#suggest_dis").hide();
                $("#msgwindow").show();
                var id = $scope.exhibitionSuggest.id;
                var uuId = $scope.exhibitionSuggest.uuId;
                var disContent = $scope.exhibitionSuggest.disContent;
                var status = 1;
                if($scope.suggestNum==2&&(disContent==null||disContent.length==0)){
                    status = 0;
                }
                var param = {id:id,uuId:uuId,disContent:disContent,status:status};
                superAdminService.solveSuggest(param).then(function (result) {
                    $("#msgwindow").hide();
                    if(result.results.content.status == 'OK'){
                        $("#disSuggestPage").hide();
                        var sugg = result.results.content.sugg;
                        if(sugg.status==1){
                            $scope.row.status = 1;
                            $scope.row.newStatus = '已解决';
                            $scope.row.solveTime = $filter('date')(sugg.solveTime, 'yyyy-MM-dd HH:mm/EEE');
                        }else{
                            $scope.row.status = 0;
                            $scope.row.newStatus = '未解决';
                            $scope.row.solveTime = null;
                        }
                        $scope.row.disContent = disContent;
                        $scope.exhibitionSuggest = {};
                        $scope.angularTip("解决成功！",5000);
                        $scope.findByCondition();
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }
            //建议查询 悬浮按钮
            $scope.floatingWindow=function(){
                $('.ui-grid-row').mouseenter(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-80px'},300);
                });
                $('.ui-grid-row').mouseleave(function(){
                    $(this).find(".rowButtons").stop(true).animate({right:'-170px'},100);
                });
            }

            //导出下来框
            $scope.bipNavshow=function(){
                $("#bipNav").show();
            };
            $scope.bipNavhide=function(){
                $("#bipNav").hide();
            };

            //导出4s店信息
            $scope.exportToExcel=function(tableId){
                $scope.exportData = [];
                $scope.tableId = tableId;
                var jtName = $scope.storeSearch.jtName;
                var storeName = $scope.storeSearch.storeName;
                var data = {jtName:jtName,storeName:storeName};
                superAdminService.findStore(data).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.exportData = result.results.content.result;
                        setTimeout(function(){
                            var fileName = '北京博福易商科技有限公司'+$filter('date')(new Date(),'yyyyMMdd')+'店信息.xls';
                            var worksheetName = $filter('date')(new Date(),'yyyyMMdd')+'店信息';
                            ExportExcel.tableToExcel($scope.tableId,worksheetName,fileName);
                            $scope.exportData = [];
                        },500);
                    }
                });
            };

            //查询厂家
            $scope.factoryAll = {};
            $scope.factoryAll.enableCellEditOnFocus = true;
            $scope.factoryAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { field: 'venderName',width:200,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">厂家</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addFactorybtn()"></span></div>'},
                    { name: '厂家英文', field: 'venderEnglish',enableColumnMenu: false},
                    { name: '备注', field: 'venderRemark',enableColumnMenu: false},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyFactorybtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'}
                ]
            };
            $scope.cjSearch = {};
            $scope.factoryBtn = function(){
                var venderName = $scope.cjSearch.venderName;
                var venderEnglish = $scope.cjSearch.venderEnglish;
                var Datas = {venderName:venderName,venderEnglish:venderEnglish};
                $("#msgwindow").show();
                superAdminService.findVenderByCondition(Datas).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.factoryAll.data = result.results.content.result;
                        $scope.factorySearch = result.results.content.result;
                        for(var i=1;i<=$scope.factoryAll.data.length;i++){
                            var j = i-1;
                            $scope.factoryAll.data[j].index = i;
                        }
                    } else {

                    }
                });
            }
            $scope.clearSearch = function(){
                $scope.cjSearch = {};
                $scope.ppSearch = {};
                $scope.storeSearch = {};
            }
            //新增厂家
            $scope.addFactory = {};
            $scope.addFactorySubmit = function() {
                var venderName =$scope.addFactory.venderName;
                var venderEnglish =$scope.addFactory.venderEnglish;
                var venderRemark = $scope.addFactory.venderRemark;
                var index = $scope.factoryAll.data.length+1;
                var FactoryDatas = {venderName:venderName,venderEnglish:venderEnglish,venderRemark:venderRemark};
                var reg=/^[a-zA-Z]+$/;
                if(venderName == ''|| venderName == null){
                    $scope.angularTip("厂家名不能为空",5000);
                }else if(venderEnglish == ''|| venderEnglish == null){
                    $scope.angularTip("厂家英文名不能为空",5000);
                }else if(!reg.test(venderEnglish)){
                    $scope.angularTip("厂家英文名格式不正确",5000);
                }else {
                    $("#msgwindow").show();
                    superAdminService.insert(FactoryDatas).then(function(result){
                        $("#msgwindow").hide();
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            var id = result.results.content.id;
                            var newFactoryDatas = {venderName:venderName,venderEnglish:venderEnglish,venderRemark:venderRemark,index:index,id:id};
                            $scope.factoryAll.data.unshift(newFactoryDatas);
                            $scope.addFactory = {};
                            $("#addFactorybox").hide();
                            $scope.angularTip("新增厂家成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }
            };

            //编辑厂家
            $scope.modifyFactory = {};
            $scope.modifyFactorybtn = function(row) {
                $scope.modifyFactory.venderName = row.entity.venderName;
                $scope.modifyFactory.venderEnglish = row.entity.venderEnglish;
                $scope.modifyFactory.venderRemark = row.entity.venderRemark;
                $scope.modifyFactory.id = row.entity.id;
                $("#modifyFactorybox").show();
                $scope.modityBrandSubmit = function(){
                    var modifyFactoryDatas = {venderName:$scope.modifyFactory.venderName,venderEnglish:$scope.modifyFactory.venderEnglish,
                    venderRemark:$scope.modifyFactory.venderRemark,id:$scope.modifyFactory.id};
                    if($scope.modifyFactory.venderName == ''|| $scope.modifyFactory.venderName == null){
                        $scope.angularTip("厂家名不能为空",5000);
                        return;
                    }
                    if($scope.modifyFactory.venderEnglish == ''|| $scope.modifyFactory.venderEnglish == null){
                        $scope.angularTip("厂家英文名不能为空",5000);
                        return;
                    }
                    var reg=/^[a-zA-Z]+$/;
                    if(!reg.test($scope.modifyFactory.venderEnglish)){
                        $scope.angularTip("厂家英文名格式不正确",5000);
                        return;
                    }
                    superAdminService.updateVender(modifyFactoryDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyFactorybox").hide();
                            row.entity.venderName = $scope.modifyFactory.venderName;
                            row.entity.venderEnglish = $scope.modifyFactory.venderEnglish;
                            row.entity.venderRemark = $scope.modifyFactory.venderRemark;
                            $scope.angularTip("修改成功",5000);
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };

            //查询集团
            $scope.blocAll = {};
            $scope.blocAll.enableCellEditOnFocus = true;
            $scope.blocAll = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { field: 'jtName',width:150,enableColumnMenu: false,headerCellTemplate: '<div style="padding: 5px;"><span class="ui-grid-cell-contents cursor">集团名称</span><span class="slick-header-button" style=" margin: 1px;" ng-click="grid.appScope.addBlocbtn()"></span></div>'},
                    { name: '工商注册名称', field: 'jtRegistName',enableColumnMenu: false,cellTooltip: true},
                    { name: '集团名称缩写',field: 'jtShortName',enableColumnMenu: false},
                    { name: '集团代号', field: 'jtCode',enableColumnMenu: false},
                    { name: '税号', field: 'jtTaxNum',enableColumnMenu: false},
                    { name: '负责人', field: 'jtFzr',enableColumnMenu: false},
                    { name: '联系人', field: 'jtLxr',enableColumnMenu: false},
                    { name: '电话', field: 'jtPhone',enableColumnMenu: false},
                    { name: '有效使用期', field: 'jtYxqEnd',cellFilter: 'date:"yyyy-MM-dd"',enableColumnMenu: false},
                    { name: '备注', field: 'jtRemark',enableColumnMenu: false,cellTooltip: true},
                    { name: '密码重置', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.blocResetShow(row)">' +
                        '<span class="glyphicon glyphicon-lock"></span></div>'},
                    { name: '编辑', width:80,cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.modifyBlocbtn(row)">' +
                        '<span class="glyphicon glyphicon-edit"></span></div>'},
                    { name: '删除', width:80,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,headerCellClass: 'gridhead-center',
                        cellTemplate:'<div class="cursor"  ng-click="grid.appScope.deleteBlocbtn(row)">' +
                        '<span class="glyphicon glyphicon-trash"></span></div>'}
                ]
            };
            $scope.jtSearch = {};
            $scope.findBlocByCondition = function(){
                $scope.pageType = "bloc";
                var jtName = $scope.jtSearch.jtName;
                var Datas = {jtName:jtName};
                $("#msgwindow").show();
                superAdminService.findBlocByCondition(Datas).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.blocAll.data = result.results.content.result;
                        for(var i=1;i<=$scope.blocAll.data.length;i++){
                            $scope.blocAll.data[i-1].index = i;
                        }
                    } else {

                    }
                });
            }
            $scope.clearBloc = function(){
                $scope.jtSearch = {};
            }
            //新增集团
            $scope.addBloc = {};
            $scope.addBlocSubmit = function() {
                var jtName =$scope.addBloc.jtName;
                var jtRegistName =$scope.addBloc.jtRegistName;
                var jtShortName =$scope.addBloc.jtShortName;
                var jtCode =$scope.addBloc.jtCode;
                var jtTaxNum =$scope.addBloc.jtTaxNum;
                var jtFzr =$scope.addBloc.jtFzr;
                var jtLxr =$scope.addBloc.jtLxr;
                var jtPhone =$scope.addBloc.jtPhone;
                var jtEmail =$scope.addBloc.jtEmail;
                var jtAddress =$scope.addBloc.jtAddress;
                var jtAdminAccount =$scope.addBloc.jtAdminAccount;
                $scope.addBloc.jtAdminPassword = "123456";
                var jtYxqStart =$scope.addBloc.jtYxqStart;
                var jtYxqEnd =$scope.addBloc.jtYxqEnd;
                var jtRemark =$scope.addBloc.jtRemark;
                var index = $scope.blocAll.data.length+1;
                var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                if(jtName==""||jtName==null){
                    $scope.angularTip("集团名称不能为空",5000);
                    return;
                }
                if(jtShortName==""||jtShortName==null){
                    $scope.angularTip("集团名称缩写不能为空",5000);
                    return;
                }
                if(!(jtEmail == ''|| jtEmail == null) && !(re_email.test(jtEmail))){
                    $scope.angularTip("邮箱不正确",5000);
                    return;
                }
                if(jtAdminAccount==""||jtAdminAccount==null){
                    $scope.angularTip("AM账号不能为空",5000);
                    return;
                }
                if(jtYxqEnd<jtYxqStart){
                    $scope.angularTip("有效使用期结束日期不能小于开始日期",5000);
                    return;
                }
                if(!(jtPhone == ''|| jtPhone == null) && !(/^1[345789]\d{9}$/.test(jtPhone))){
                    $scope.angularTip("手机号码不正确",5000);
                    return;
                }
                if($scope.blocType1==0||$scope.blocType2==0||$scope.blocType3==0||$scope.blocType4==0||$scope.blocType5==0||$scope.blocType6==0){
                    $scope.angularTip("信息填写有错误，请修改之后再提交",5000);
                    return;
                }
                var BlocDatas = {jtName:jtName,jtRegistName:jtRegistName,jtShortName:jtShortName,jtCode:jtCode,jtTaxNum:jtTaxNum
                    ,jtFzr:jtFzr,jtLxr:jtLxr,jtPhone:jtPhone,jtEmail:jtEmail,jtAddress:jtAddress,jtAdminAccount:jtAdminAccount,
                    jtAdminPassword:$scope.addBloc.jtAdminPassword,jtYxqStart:jtYxqStart,jtYxqEnd:jtYxqEnd,jtRemark:jtRemark};
                $("#msgwindow").show();
                superAdminService.addBlocFun(BlocDatas).then(function(result){
                    $("#msgwindow").hide();
                    if( result.status == 'OK'&&result.results.content.status=='OK'){
                        var jtId = result.results.content.jtId;
                        var newBlocDatas = {jtName:jtName,jtRegistName:jtRegistName,jtShortName:jtShortName,jtCode:jtCode,jtTaxNum:jtTaxNum
                            ,jtFzr:jtFzr,jtLxr:jtLxr,jtPhone:jtPhone,jtEmail:jtEmail,jtAddress:jtAddress,jtAdminAccount:jtAdminAccount,
                            jtAdminPassword:$scope.addBloc.jtAdminPassword,jtYxqStart:jtYxqStart,jtYxqEnd:jtYxqEnd,jtRemark:jtRemark,index:index,jtId:jtId};
                        $scope.blocAll.data.unshift(newBlocDatas);
                        $scope.addBloc = {};
                        $("#addBlocbox").hide();
                        $scope.angularTip("新增集团成功",5000);
                    }else{
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            };
            //集团信息查重
            $scope.findExistByCondition = function(blocType){
                var jtName =$scope.addBloc.jtName;
                var jtRegistName =$scope.addBloc.jtRegistName;
                var jtShortName =$scope.addBloc.jtShortName;
                var jtCode =$scope.addBloc.jtCode;
                var jtTaxNum =$scope.addBloc.jtTaxNum;
                var jtPhone =$scope.addBloc.jtPhone;
                var BlocDatas = {};
                if(blocType==1&&(jtName==""||jtName==null)){
                    $scope.blocType1=2;
                    return;
                }
                if(blocType==2&&(jtRegistName==""||jtRegistName==null)){
                    $scope.blocType2=2;
                    return;
                }
                if(blocType==3&&(jtShortName==""||jtShortName==null)){
                    $scope.blocType3=2;
                    return;
                }
                if(blocType==4&&(jtCode==""||jtCode==null)){
                    $scope.blocType4=2;
                    return;
                }
                if(blocType==5&&(jtTaxNum==""||jtTaxNum==null)){
                    $scope.blocType5=2;
                    return;
                }
                if(blocType==6&&(jtPhone==""||jtPhone==null)){
                    $scope.blocType6=2;
                    return;
                }
                if(blocType==1){
                    BlocDatas = {jtName:jtName};
                }else if(blocType==2){
                    BlocDatas = {jtRegistName:jtRegistName};
                }else if(blocType==3){
                    BlocDatas = {jtShortName:jtShortName};
                }else if(blocType==4){
                    BlocDatas = {jtCode:jtCode};
                }else if(blocType==5){
                    BlocDatas = {jtTaxNum:jtTaxNum};
                }else if(blocType==6){
                    BlocDatas = {jtPhone:jtPhone};
                }
                superAdminService.findExistByCondition(BlocDatas).then(function (result) {
                    if (result.status == 'OK') {
                        var blocBol = result.results.content.result;
                        if(blocType==1 && blocBol==true){
                            $scope.blocType1=0;
                        }else if(blocType==1 && blocBol==false){
                            $scope.blocType1=1;
                        }else if(blocType==2 && blocBol==true){
                            $scope.blocType2=0;
                        }else if(blocType==2 && blocBol==false){
                            $scope.blocType2=1;
                        }else if(blocType==3 && blocBol==true){
                            $scope.blocType3=0;
                        }else if(blocType==3 && blocBol==false){
                            $scope.blocType3=1;
                            $scope.addBloc.jtAdminAccount = jtShortName+"_AM";
                        }else if(blocType==4 && blocBol==true){
                            $scope.blocType4=0;
                        }else if(blocType==4 && blocBol==false){
                            $scope.blocType4=1;
                        }else if(blocType==5 && blocBol==true){
                            $scope.blocType5=0;
                        }else if(blocType==5 && blocBol==false){
                            $scope.blocType5=1;
                        }else if(blocType==6 && blocBol==true){
                            $scope.blocType6=0;
                        }else if(blocType==6 && blocBol==false && (/^1[34578]\d{9}$/.test(jtPhone))){
                            $scope.blocType6=1;
                        }
                    } else {
                    }
                });
            }
            $scope.nextyear = function(type) {
                var year = 365*24*3600*1000;
                if(type==1){
                    var newDate = (new Date($scope.addBloc.jtYxqStart)).getTime()+year;
                    $scope.addBloc.jtYxqEnd = $filter('date')(newDate,'yyyy-MM-dd');
                }else if(type==2){
                    var newDate = (new Date($scope.modifyBloc.jtYxqStart)).getTime()+year;
                    $scope.modifyBloc.jtYxqEnd = $filter('date')(newDate,'yyyy-MM-dd');
                }else if(type==3){
                    var newDate = (new Date($scope.addStore.vaildDateStart)).getTime()+year;
                    $scope.addStore.vaildDate = $filter('date')(newDate,'yyyy-MM-dd');
                }else if(type==4){
                    var newDate = (new Date($scope.modifyStore.vaildDateStart)).getTime()+year;
                    $scope.modifyStore.vaildDate = $filter('date')(newDate,'yyyy-MM-dd');
                }
            }
            //删除集团
            $scope.deleteBlocbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    var deleteData = {jtId:row.entity.jtId}
                    superAdminService.deleteBloc(deleteData).then(function(result){
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $scope.blocAll.data.splice($scope.blocAll.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip("删除失败",5000);
                        }
                    });
                };
            };
            //编辑集团
            $scope.modifyBloc = {};
            $scope.modifyBlocbtn = function(row) {
                $scope.EditType1=2;
                $scope.EditType2=2;
                $scope.EditType4=2;
                $scope.EditType5=2;
                $scope.EditType6=2;
                $scope.blocEditData = row.entity;
                $scope.modifyBloc.jtName = row.entity.jtName;
                $scope.modifyBloc.jtRegistName = row.entity.jtRegistName;
                $scope.modifyBloc.jtShortName = row.entity.jtShortName;
                $scope.modifyBloc.jtCode = row.entity.jtCode;
                $scope.modifyBloc.jtTaxNum = row.entity.jtTaxNum;
                $scope.modifyBloc.jtFzr = row.entity.jtFzr;
                $scope.modifyBloc.jtLxr = row.entity.jtLxr;
                $scope.modifyBloc.jtPhone = row.entity.jtPhone;
                $scope.modifyBloc.jtEmail = row.entity.jtEmail;
                $scope.modifyBloc.jtAddress = row.entity.jtAddress;
                $scope.modifyBloc.jtAdminAccount = row.entity.jtAdminAccount;
                $scope.modifyBloc.jtAdminPassword = row.entity.jtAdminPassword;
                $scope.modifyBloc.jtYxqStart = $filter('date')(row.entity.jtYxqStart,'yyyy-MM-dd');
                $scope.modifyBloc.jtYxqEnd = $filter('date')(row.entity.jtYxqEnd,'yyyy-MM-dd');
                $scope.modifyBloc.jtRemark = row.entity.jtRemark;
                $("#modifyBlocbox").show();
                $scope.modifyBlocSubmit = function(){
                    var modifyBlocDatas = {jtName:$scope.modifyBloc.jtName,jtRegistName:$scope.modifyBloc.jtRegistName,jtShortName:$scope.modifyBloc.jtShortName,
                        jtCode:$scope.modifyBloc.jtCode,jtTaxNum:$scope.modifyBloc.jtTaxNum
                        ,jtFzr:$scope.modifyBloc.jtFzr,jtLxr:$scope.modifyBloc.jtLxr,jtPhone:$scope.modifyBloc.jtPhone,
                        jtEmail:$scope.modifyBloc.jtEmail,jtAddress:$scope.modifyBloc.jtAddress,jtAdminAccount:$scope.modifyBloc.jtAdminAccount,
                        jtAdminPassword:$scope.modifyBloc.jtAdminPassword,jtYxqStart:$scope.modifyBloc.jtYxqStart,
                        jtYxqEnd:$scope.modifyBloc.jtYxqEnd,jtRemark:$scope.modifyBloc.jtRemark,jtId:row.entity.jtId};
                    var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    if($scope.modifyBloc.jtName==""||$scope.modifyBloc.jtName==null){
                        $scope.angularTip("集团名称不能为空",5000);
                        return;
                    }
                    if(!($scope.modifyBloc.jtEmail == ''|| $scope.modifyBloc.jtEmail == null) && !(re_email.test($scope.modifyBloc.jtEmail))){
                        $scope.angularTip("邮箱不正确",5000);
                        return;
                    }
                    if($scope.modifyBloc.jtYxqEnd<$scope.modifyBloc.jtYxqStart){
                        $scope.angularTip("有效使用期结束日期不能小于开始日期",5000);
                        return;
                    }
                    if(!($scope.modifyBloc.jtPhone == ''|| $scope.modifyBloc.jtPhone == null) && !(/^1[345789]\d{9}$/.test($scope.modifyBloc.jtPhone))){
                        $scope.angularTip("手机号码不正确",5000);
                        return;
                    }
                    if($scope.EditType1==0||$scope.EditType2==0||$scope.EditType4==0||$scope.EditType5==0||$scope.EditType6==0){
                        $scope.angularTip("信息填写有错误，请修改之后再提交",5000);
                        return;
                    }
                    superAdminService.updateBloc(modifyBlocDatas).then(function(result){
                        if( result.status == 'OK'&&result.results.content.status=='OK'){
                            $("#modifyBlocbox").hide();
                            row.entity.jtName =$scope.modifyBloc.jtName;
                            row.entity.jtRegistName =$scope.modifyBloc.jtRegistName;
                            row.entity.jtShortName =$scope.modifyBloc.jtShortName;
                            row.entity.jtCode =$scope.modifyBloc.jtCode;
                            row.entity.jtTaxNum =$scope.modifyBloc.jtTaxNum;
                            row.entity.jtFzr =$scope.modifyBloc.jtFzr;
                            row.entity.jtLxr =$scope.modifyBloc.jtLxr;
                            row.entity.jtPhone =$scope.modifyBloc.jtPhone;
                            row.entity.jtEmail =$scope.modifyBloc.jtEmail;
                            row.entity.jtAddress =$scope.modifyBloc.jtAddress;
                            row.entity.jtAdminAccount =$scope.modifyBloc.jtAdminAccount;
                            row.entity.jtAdminPassword =$scope.modifyBloc.jtAdminPassword;
                            row.entity.jtYxqStart =$scope.modifyBloc.jtYxqStart;
                            row.entity.jtYxqEnd =$scope.modifyBloc.jtYxqEnd;
                            row.entity.jtRemark =$scope.modifyBloc.jtRemark;
                            $scope.angularTip("修改成功",5000);
                            $scope.modifyBloc = {};
                        }else{
                            $scope.angularTip("修改失败",5000);
                        }
                    });
                }
            };

            $scope.blocEditCheck = function(EditType){
                var jtName =$scope.modifyBloc.jtName;
                var jtRegistName =$scope.modifyBloc.jtRegistName;
                var jtCode =$scope.modifyBloc.jtCode;
                var jtTaxNum =$scope.modifyBloc.jtTaxNum;
                var jtPhone =$scope.modifyBloc.jtPhone;
                var BlocDatas = {};
                if(EditType==1&&(jtName==""||jtName==null||jtName==$scope.blocEditData.jtName)){
                    $scope.EditType1=2;
                    return;
                }
                if(EditType==2&&(jtRegistName==""||jtRegistName==null||jtRegistName==$scope.blocEditData.jtRegistName)){
                    $scope.EditType2=2;
                    return;
                }
                if(EditType==4&&(jtCode==""||jtCode==null||jtCode==$scope.blocEditData.jtCode)){
                    $scope.EditType4=2;
                    return;
                }
                if(EditType==5&&(jtTaxNum==""||jtTaxNum==null||jtTaxNum==$scope.blocEditData.jtTaxNum)){
                    $scope.EditType5=2;
                    return;
                }
                if(EditType==6&&(jtPhone==""||jtPhone==null||jtPhone==$scope.blocEditData.jtPhone)){
                    $scope.EditType6=2;
                    return;
                }
                if(EditType==1){
                    BlocDatas = {jtName:jtName};
                }else if(EditType==2){
                    BlocDatas = {jtRegistName:jtRegistName};
                }else if(EditType==4){
                    BlocDatas = {jtCode:jtCode};
                }else if(EditType==5){
                    BlocDatas = {jtTaxNum:jtTaxNum};
                }else if(EditType==6){
                    BlocDatas = {jtPhone:jtPhone};
                }
                superAdminService.findExistByCondition(BlocDatas).then(function (result) {
                    if (result.status == 'OK') {
                        var blocBol = result.results.content.result;
                        if(EditType==1 && blocBol==true){
                            $scope.EditType1=0;
                        }else if(EditType==1 && blocBol==false){
                            $scope.EditType1=1;
                        }else if(EditType==2 && blocBol==true){
                            $scope.EditType2=0;
                        }else if(EditType==2 && blocBol==false){
                            $scope.EditType2=1;
                        }else if(EditType==4 && blocBol==true){
                            $scope.EditType4=0;
                        }else if(EditType==4 && blocBol==false){
                            $scope.EditType4=1;
                        }else if(EditType==5 && blocBol==true){
                            $scope.EditType5=0;
                        }else if(EditType==5 && blocBol==false){
                            $scope.EditType5=1;
                        }else if(EditType==6 && blocBol==true){
                            $scope.EditType6=0;
                        }else if(EditType==6 && blocBol==false && (/^1[34578]\d{9}$/.test(jtPhone))){
                            $scope.EditType6=1;
                        }
                    } else {
                    }
                });
            }

            $scope.bjTypeChoose = function(modelType,bjType){
                if(modelType=='add'){
                    if(bjType==1){
                        $scope.addStore.shopId = null;
                        $scope.addStore.token = null;
                        $scope.addStore.bhxx = 0;
                        $scope.addStore.bhbj = 0;
                        $scope.addStore.agent = null;
                        $scope.addStore.bihuKey = null;
                        $scope.addStore.cityCode = null;
                    }else if(bjType==2){
                        $scope.addStore.bhxx = 0;
                        $scope.addStore.bhbj = 0;
                        $scope.addStore.agent = null;
                        $scope.addStore.bihuKey = null;
                        $scope.addStore.cityCode = null;
                    }else if(bjType==3){
                        $scope.addStore.shopId = null;
                        $scope.addStore.token = null;
                    }
                }else if(modelType=='update'){
                    if(bjType==1){
                        $scope.modifyStore.shopId = null;
                        $scope.modifyStore.token = null;
                        $scope.modifyStore.bhxx = 0;
                        $scope.modifyStore.bhbj = 0;
                        $scope.modifyStore.agent = null;
                        $scope.modifyStore.bihuKey = null;
                        $scope.modifyStore.cityCode = null;
                    }else if(bjType==2){
                        $scope.modifyStore.bhxx = 0;
                        $scope.modifyStore.bhbj = 0;
                        $scope.modifyStore.agent = null;
                        $scope.modifyStore.bihuKey = null;
                        $scope.modifyStore.cityCode = null;
                    }else if(bjType==3){
                        $scope.modifyStore.shopId = null;
                        $scope.modifyStore.token = null;
                    }
                }
            }
            //短信充值
            $scope.recharge = function() {
                var storeId = $scope.modifyStore.storeId;
                $("#recharge").show();
                $scope.submitRecharge = function(rechargeBalance){
                    var messageRecharge= {storeId:storeId, rechargeBalance:rechargeBalance};
                    var reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
                    if(reg.test(rechargeBalance)){
                        superAdminService.messageRecharge(messageRecharge).then(function(result){
                            if( result.status == 'OK'&&result.results.content.status=='OK'){
                                $("#recharge").hide();
                                $scope.modifyStore.messageBalance = result.results.content.result;
                                $scope.angularTip(result.results.message,5000);
                            }else{
                                $("#recharge").hide();
                                $scope.angularTip(result.results.message,5000);
                            }
                        })
                    }else{
                        $("#recharge").hide();
                        $scope.angularTip("充值失败，请输入正确金额格式！",5000);
                    }
                }
            }
        }
    ]);

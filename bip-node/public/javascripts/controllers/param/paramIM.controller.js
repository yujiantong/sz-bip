'use strict';
angular.module('myApp')
    .controller('paramIM_Controller',['$rootScope','$scope','$filter','paramIMService','$state',
        function($rootScope,$scope,$filter,paramIMService,$state){
            $scope.bhDock = $rootScope.user.store.bhDock; //是否和壁虎对接
            //级别跟踪天数查询
            paramIMService.LevelSearch().then(function (result) {
                if (result.status == 'OK') {
                    $scope.LevelAll = result.results.content.result;
                } else {

                }
            });
            //修改级别跟踪天数
            $scope.Levelsubmit = function() {
                paramIMService.LevelSet($scope.LevelAll).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip("设置失败",5000);
                    }
                });

            }

            //模块开启设置查询
            $scope.moduleDetail = function() {
                paramIMService.moduleSearch().then(function (result) {
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
            };
            $scope.moduleDetail();

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
                paramIMService.moduleSet($scope.modulesetAll).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip(res.results.message,5000);
                        $scope.moduleDetail();
                    }
                });
            };

            // 查询所有的保险公司
            paramIMService.InsuranceCompSearch().then(function (result) {
                if (result.success == true) {
                    $scope.InsuranceCompAll = result.content.list;
                } else {

                }
            });


            //更新选中的保险公司
            $scope.InsuranceCompsubmit = function() {
                var insuranceCompIds = [];//选中的保险公司ID
                var InsuranceCompAll = $scope.InsuranceCompAll;
                var fourSId = 1;//4s店ID;
                for(var i=0; i<InsuranceCompAll.length; i++){
                    if(InsuranceCompAll[i].statu ==true){
                        insuranceCompIds.push(InsuranceCompAll[i].insuranceComp.insuranceCompId);
                    }
                }
                paramIMService.InsuranceCompSet(insuranceCompIds,fourSId).then(function(res){
                    if(res.status == 'OK'){
                        $scope.angularTip("设置成功",5000);
                    }else{
                        $scope.angularTip("设置失败",5000);
                    }
                });
            };

            // 手续费设置中 显示选中的保险公司
            $scope.FactorageComp = function() {
                paramIMService.InsuranceCompSearch().then(function (result) {
                    if (result.success == true) {
                        $scope.FactorageAll = result.content.list;
                    } else {

                    }
                });
            };
            //手续费查询
            $scope.factoragesetAllMap = {};
            $scope.FactorageCompSearch = function() {
                $scope.compPreId = this.Factorage.insuranceComp.insuranceCompId;
                $scope.factoragesetAllMap = {};
                paramIMService.FactorageSearch( $scope.compPreId).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.FactoragesetAll = result.results.content.result;
                        for(var i=0;i<$scope.FactoragesetAll.length;i++){
                            $scope.factoragesetAllMap[$scope.FactoragesetAll[i].insuName] = $scope.FactoragesetAll[i].insuPercent;
                        }
                    } else {

                    }
                });
            };


        }

    ]);

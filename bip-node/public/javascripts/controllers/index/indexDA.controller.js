'use strict';
angular.module('myApp')
    .controller('indexDA_Controller',['$rootScope','constant','$location','$scope','$filter','loginService','$state','superAdminService','$cookies',
        function($rootScope,constant,$location,$scope,$filter,loginService,$state,superAdminService,$cookies) {
            var host = $location.host();
            var hostname = window.location.hostname;
            if(host==constant.bipServer){
                $scope.logo=1; //初始化智齿咨询组件实例
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
            $scope.storeInfo= {};
            $scope.findCountByUserIdTop = function() {
                loginService.findCountByUserIdTop().then(function (result) {
                    if (result.status == 'OK' || result.results.content.status == 'OK') {
                        $scope.topCount = result.results.content.results;
                    } else {

                    }
                    ;
                });
            }
            superAdminService.findStore({}).then(function (result) {
                $("#msgwindow").hide();
                if (result.status == 'OK') {
                    $scope.storeAll = result.results.content.result;
                } else {

                }
            });
            $scope.storeSelection = $rootScope.user.store.storeName;
            $scope.changeStore = function(store1){
                loginService.changeStoreCookies(store1)
                    .then(function (result) {
                        if (result.status == 'OK') {
                            $scope.storeSelection = store1.storeName;
                            window.location.reload();
                        } else {
                            $scope.angularTip("操作失败",5000);
                        };
                    });
            }

            //传页面类型给子页面
            $scope.setPageStatus = function(pageTypeStatus,pageStatus,pageTZ){
                if(pageTZ=='bd'){
                    $state.go('dataAnalyst.policy');
                }else if(pageTZ=='qk'){
                    $state.go('dataAnalyst.customer',{reload:true});
                }
                setTimeout(function(){
                    if($state.current.url=="/customerDA"){
                        $scope.pageTypeStatus = {pageTypeStatus:pageTypeStatus,pageStatus:pageStatus};
                        $scope.$broadcast('pageStatus', $scope.pageTypeStatus);
                    }
                },300);
            }

            $scope.findCountByUserIdTop();

            $scope.$on("CountByUserIdTop",
                function (e, CountByUserIdTop) {
                    if(CountByUserIdTop){
                        $scope.findCountByUserIdTop();
                    }
                });
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
            //弹框
            $scope.scmUsershow = function (){
                $(".scmUserTip").show();
            };
            $scope.scmUserhide = function (){
                $(".scmUserTip").hide();
            };

            $scope.selectStoreshow = function (){
                $(".dian_li").show();
            };
            $scope.selectStorehide = function (){
                $(".dian_li").hide();
            };

            $scope.scmSBReturn = function (){
                $("#scmSidebar").stop(true).animate({left:'-300px'});
            };

            $scope.sideNavSwitch = function (){
                $("#scmSidebar").stop(true).animate({left:'10px'});
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
            };

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
        }
    ]);

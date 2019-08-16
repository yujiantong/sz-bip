'use strict';
angular.module('myApp')
    .controller('adminController',['$rootScope','constant','$location','$scope','$filter','adminService','$state','$cookies',
        function($rootScope,constant,$location,$scope,$filter,adminService,$state,$cookies){
            $state.go('admin.index');
            $scope.asmModuleFlag=$scope.user.store.asmModuleFlag;
            var host = $location.host();
            var hostname = window.location.hostname;
            if(host==constant.bipServer){
                $scope.logo=1;
            }else {
                $scope.logo=2;
            }
            if(hostname == constant.bipHostname || hostname ==constant.biplocalhost ){
                $scope.logo=1;
            }else {
                $scope.logo=2;
            }
            //新增用户按钮
            $scope.adduserbtn = function() {
                $("#adduserbox").show();
            };

            //查询用户
            var storeId=$rootScope.user.store.storeId;
            $scope.userManageOptions = {};
            $scope.userManageOptions = {
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
                    { name: '密码重置',  field: 'password', enableColumnMenu: false,
                        cellTemplate:'<div class="resetPass cursor ui-grid-cell-contents ng-binding" ng-click="grid.appScope.resetShow(row)">******</div>'},
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


            $scope.userBindOptions = {};
            $scope.userBindOptions = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: 'BIP登录名', field: 'loginName',enableColumnMenu: false},
                    { name: 'BIP用户姓名', field: 'userName',enableColumnMenu: false},
                    { name: 'BIP岗位', field: 'role.roleName',enableColumnMenu: false},
                    { name: 'BSP登录名', field: 'bspUser.bspLoginName',enableColumnMenu: false},
                    { name: 'BSP用户姓名', field: 'bspUser.bspUserName',enableColumnMenu: false},
                    { name: 'BSP岗位', field: 'bspUser.bspUserPosition',enableColumnMenu: false},
                    { name: '绑定状态',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div><span class="glyphicon" ng-show="row.entity.bangStatu==1" style="color: rgb(7, 96, 60);">已绑定</span>' +
                        '<span class="glyphicon" ng-show="row.entity.bangStatu!=1" style="color: rgb(200, 63, 38);">未绑定</span></div>'},
                    { name: '绑定用户', cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-show="row.entity.bangStatu==1" ng-click="grid.appScope.delBangedBspUser(row.entity)">' +
                        '<span class="glyphicon a-bind" style="color: rgb(7, 96, 60);">解绑</span></div>' +
                        '<div class="cursor" ng-show="row.entity.bangStatu!=1" ng-click="grid.appScope.bindUserBtn(row.entity)">' +
                        '<span class="glyphicon a-bind" style="color: rgb(200, 63, 38);">绑定</span></div>'}

                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.userBindAutoPage = {};
            $scope.userBindAutoPage = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                data:[],
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: 'BIP用户信息', field: 'bipUserInfo',enableColumnMenu: false},
                    { name: 'BSP用户信息', field: 'bspUserInfo',enableColumnMenu: false},
                    { name: '操作',width:120,cellClass:'girdDeleteimg',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="row.entity.isBind=!row.entity.isBind">' +
                        '<input type="button" ng-show="row.entity.isBind" style="width: 90px" value="取消绑定">' +
                        '<input type="button" ng-show="!row.entity.isBind" style="width: 90px" value="绑定"></div>'}

                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            //查询用户
            $scope.findUser = function(pageType){
                $scope.pageType = pageType;
                $("#msgwindow").show();
                adminService.findUser(storeId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.userManageOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userManageOptions.data.length;i++){
                            var j = i-1;
                            $scope.userManageOptions.data[j].index = i;
                        }
                    } else {

                    }
                });
            }
            $scope.findUser('yhgl');

            //查询绑定用户
            $scope.findBindUser = function(pageType){
                $scope.pageType = pageType||"yhbd";
                $("#msgwindow").show();
                adminService.findUser(storeId).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        var userArray = result.results.content.result;
                        $scope.userBindOptions.data = [];
                        for(var i=0;i<userArray.length;i++){
                            if(userArray[i].roleId==6||userArray[i].roleId==7){
                                $scope.userBindOptions.data.push(userArray[i]);
                            }
                        }
                        for(var i=1;i<=$scope.userBindOptions.data.length;i++){
                            var j = i-1;
                            $scope.userBindOptions.data[j].index = i;
                        }
                    } else {

                    }
                });
            }

            //打开自动绑定页面
            $scope.bindUserAuto = function(){
                $('#bindUserAutobox').show();
                $scope.userBindAutoPage.data = [];
                    //根据bip的店id查询所有的未绑定的用户
                    adminService.findBipBspUser($rootScope.user.store.storeId).then(function (result) {
                        if (result.status == 'OK') {
                            $scope.bsp_users = result.results.content.result.bspUsers;
                            $scope.bip_users = result.results.content.result.bipUsers;
                            for(var i=0;i<$scope.bsp_users.length;i++){
                                for(var j=0;j<$scope.bip_users.length;j++){
                                    if($scope.bsp_users[i].bspUserName==$scope.bip_users[j].userName
                                        &&$scope.bip_users[j].bangStatu!=1){
                                        var user = {index:$scope.userBindAutoPage.data.length+1,isBind:true,
                                            bspUserId:$scope.bsp_users[i].bspUserId,bipUserId:$scope.bip_users[j].id,
                                            bspUserInfo:$scope.bsp_users[i].bspUserName+'-'+$scope.bsp_users[i].bspUserPosition,
                                            bipUserInfo:$scope.bip_users[j].userName+'-'+$scope.bip_users[j].role.roleName}
                                        $scope.userBindAutoPage.data.push(user);
                                    }
                                }
                            }
                        } else {

                        }
                    });
            }

            //提交绑定用户信息
            $scope.submit_bindInfo = function(){
                var bangUsers = [];
                for(var i=0;i<$scope.userBindAutoPage.data.length;i++){
                    if($scope.userBindAutoPage.data[i].isBind){
                        var user = {
                            bspUserId:$scope.userBindAutoPage.data[i].bspUserId,
                            bipUserId:$scope.userBindAutoPage.data[i].bipUserId}
                        bangUsers.push(user);
                    }
                }
                if(bangUsers.length==0){
                    $scope.angularTip("请选择绑定用户",5000);
                    return;
                }
                var bangParam = {storeId:$rootScope.user.store.storeId,bangUsers:bangUsers}
                $("#msgwindow").show();
                adminService.sysnBspUser(bangParam).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.findBindUser();
                        $('#bindUserAutobox').hide();
                        $scope.angularTip("绑定成功",5000);
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }

            //提交单个绑定用户信息
            $scope.submit_bindInfo_single = function(){
                if(!$scope.bindUser.bspUserId||$scope.bindUser.bspUserId==-1){
                    $scope.angularTip("请选择一个用户",5000);
                    return;
                }
                var bangUsers = [{bspUserId:$scope.bindUser.bspUserId,bipUserId:$scope.bindUser.userId}];
                var bangParam = {storeId:$rootScope.user.store.storeId,bangUsers:bangUsers}
                $("#msgwindow").show();
                adminService.sysnBspUser(bangParam).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $('#bindUserbox').hide();
                        $scope.thisRowData.bspUser = {bspLoginName:$scope.bindUser.bspLoginName,
                            bspUserName:$scope.bindUser.bspUserName, bspUserPosition:$scope.bindUser.bspUserPosition};
                        $scope.thisRowData.bangStatu = 1;
                        $scope.angularTip("绑定成功",5000);
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }

            //打开手工选择绑定页面
            $scope.bindUser = {};
            $scope.bindUserBtn = function(user){
                $('#bindUserbox').show();
                $scope.bindUser = {};
                $scope.thisRowData = user;
                $scope.bindUser.userName = user.userName;
                $scope.bindUser.loginName = user.loginName;
                $scope.bindUser.roleName = user.role.roleName;
                $scope.bindUser.userId = user.id;
                $scope.findNoBangedUser();
            };
            //选中用户时
            $scope.select_bsp_user = function(bsp_user){
                $scope.bindUser.bspUserName = bsp_user.bspUserName||'';
                $scope.bindUser.bspLoginName = bsp_user.bspLoginName||'';
                $scope.bindUser.bspUserPosition = bsp_user.bspUserPosition||'';
                $scope.bindUser.bspUserId = bsp_user.bspUserId||-1;
            }

            $scope.currentFocused = "";
            //重置密码弹框按钮
            $scope.resetShow = function(row){
                $scope.resetid =  row.entity.id;
                $("#resetPass").show();

            }

            //解除绑定的用户
            $scope.delBangedBspUser = function (bipUser) {
                $scope.thisRowData = bipUser;
                $("#unbind-user").show();
                $scope.makesure = function() {
                    $("#unbind-user").hide();
                    var delBangParam = {storeId: $rootScope.user.store.storeId, id: bipUser.id}
                    $("#msgwindow").show();
                    adminService.delBangedBspUser(delBangParam).then(function (result) {
                        $("#msgwindow").hide();
                        if (result.status == 'OK') {
                            $scope.thisRowData.bspUser = {};
                            $scope.thisRowData.bangStatu = 0;
                            $scope.angularTip("解除绑定成功", 5000);
                        } else {
                            $scope.angularTip(result.results.message, 5000);
                        }
                    });
                }
            };

            //根据bip的店id查询所有的未绑定的用户
            $scope.findNoBangedUser = function () {
                $scope.bsp_users_noBind = [];
                adminService.findNoBangedUser($rootScope.user.store.storeId).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.bsp_users_noBind = result.results.content.result;
                        if($scope.bsp_users_noBind.length==0){
                            $scope.bsp_users_noBind = [{bspUserName:'当前无绑定用户'}];
                        }
                    } else {

                    }
                });
            };

            //检查该店是否已经绑定过
            $scope.checkStoreIsBang = function () {
                adminService.checkStoreIsBang($rootScope.user.store.storeId).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.checkStoreBindStaus = result.results.content.result;
                    } else {

                    }
                });
            };
            $scope.checkStoreIsBang();

            //删除用户
            $scope.deleteUserbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    $("#msgwindow").show();
                    adminService.deleteUser(row.entity.id,row.entity.roleId).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status=='OK'){
                            $scope.userManageOptions.data.splice($scope.userManageOptions.data.indexOf(row.entity), 1);
                            $scope.angularTip("删除成功",5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                };
            };

            //重置密码
            $scope.resetPasswordbtn = function() {
                adminService.resetPassword($scope.resetid).then(function(result){
                    if(result.results.content.status == 'OK'){
                        $("#resetPass").hide();
                        $scope.angularTip("重置成功",5000);
                    }else{
                        $scope.angularTip("重置失败",5000);
                    }
                });
            };


            //查询角色
            adminService.findRole().then(function (result) {
                if (result.status == 'OK') {
                    if($scope.asmModuleFlag==0){
                        var obj = result.results.content.result;
                        var newArr = new Array();
                        for(var i=0;i< obj.length;i++) {
                            var j = obj[i];
                            if (j.roleId != 1) {
                                newArr.push(j);
                            }
                        }
                        $scope.roleIds = newArr;
                    }else {
                        $scope.roleIds = result.results.content.result;
                    }
                } else {

                }
            });

            //提交新增用户信息
            $scope.addnewuser = {};
            $scope.addUsersubmit = function() {
                var shortStoreName=$rootScope.user.store.shortStoreName;
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
                var index = $scope.userManageOptions.data.length+1;

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
                }else if(phone == null || phone == ''){
                    $scope.angularTip("手机号码不能为空",5000);
                }else if(!(phone == ''|| phone == null) && !(/^1[345789]\d{9}$/.test(phone))){
                    $scope.angularTip("手机号码不正确",5000);
                }else if(roleId == null){
                    $scope.angularTip("请选择角色",5000);
                }else if(email == null || email == ''){
                    $scope.angularTip("邮箱不能为空",5000);
                }else if(!(email == ''|| email == null) && !(re_email.test(email))){
                    $scope.angularTip("邮箱不正确",5000);
                }else {
                    $("#msgwindow").show();
                    adminService.addUser(userDatas).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status == 'OK'){
                            var userId = result.results.content.userId;
                            var newData = { storeId:storeId,loginName:loginName,userName:userName, phone:phone, roleId:roleId,
                                email:email,remark:remark,password:password,role:{roleName:roleName},index:index,id:userId
                            }
                            $scope.userManageOptions.data.unshift(newData);
                            $scope.addnewuser = {};
                            $("#adduserbox").hide();
                            $scope.angularTip(result.results.message,5000);
                        }else{
                            $scope.angularTip(result.results.message,5000);
                        }
                    });
                }

            };

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
                var shortStoreName=$rootScope.user.store.shortStoreName;
                var SNlength = shortStoreName.length+1;
                $scope.modifyuser.loginName = strLoginName.substring(SNlength);
                $("#modifyuserbox").show();
                $scope.modityUserSubmit = function(){
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
                        $scope.angularTip("联系电话不正确",5000);
                    }else if(!($scope.modifyuser.email == ''|| $scope.modifyuser.email == null) && !(re_email.test($scope.modifyuser.email))){
                        $scope.angularTip("邮箱不正确",5000);
                    }else if($scope.modifyuser.phone == ''|| $scope.modifyuser.phone == null){
                        $scope.angularTip("联系电话不能为空",5000);
                    }else if($scope.modifyuser.email == '' || $scope.modifyuser.email == null){
                        $scope.angularTip("邮箱不能为空",5000);
                    }else {
                        adminService.modityUser(modifyUserDatas).then(function(result){
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

            //弹框
            $scope.scmUsershow = function (){
                $(".scmUserTip").show();
            };
            $scope.scmUserhide = function (){
                $(".scmUserTip").hide();
            };

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
                    $scope.angularTip("至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符",5000);
                }else if(confirmPassword!=newPassword){
                    $scope.angularTip("两次输入的新密码不一致，请重新输入",5000);
                }else{
                    $("#msgwindow").show();
                    adminService.changePassword($scope.id,newPassword,oldPassword).then(function(result){
                        $("#msgwindow").hide();
                        if(result.results.content.status == 'OK'){
                            //密码修改成功时把首次登陆状态变成0
                            $scope.user.firstLogin = 0;
                            var bip_user = JSON.parse($cookies.get('bip_user'));
                            bip_user.firstLogin = 0;
                            $cookies.put('bip_user', JSON.stringify(bip_user));
                            $("#firstChangePass").hide();

                            $("#changePass").hide();
                            $scope.change = {};
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
                adminService.logout()
                    .then(function (result) {
                        if (result.status == 'noLogin') {
                            window.location.href = '/index'
                        } else {
                            $scope.angularTip("注销失败",5000);
                        };
                    });
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

        }
    ]);

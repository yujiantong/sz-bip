'use strict';
angular.module('myApp')
    .controller('blocController',['$rootScope','constant','$location','$scope','$filter','blocService','$state','$cookies',
        function($rootScope,constant,$location,$scope,$filter,blocService,$state,$cookies){
            $state.go('bloc.index');
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

            //设置表格宽高 ---加上延迟为了解决表格加载先后顺序引起的表格宽度获取不准确问题
            setTimeout(function(){
                $scope.gridbox = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-50
                };
                $scope.gridboxCX = {
                    width:$("#myTabContent").width()-2,
                    height:$("#myTabContent").height()-80
                };
            },200);
            //新增用户按钮
            $scope.adduserbtn = function() {
                $("#adduserbox").show();
                $scope.addnewuser.type = "0";
                $scope.addnewuser.suoshu = "0";
            };
            //添加事业部
            $scope.divisionShow = function() {
                $("#addDivisionBox").show();
            };

            //查询用户
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
                    { name: '密码重置',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
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


            $scope.userBindOptions = {};
            $scope.userBindOptions = {
                enableHorizontalScrollbar:0,
                enableSorting: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect:false,
                columnDefs: [
                    { name:'序号',field: 'index', width:60, enableColumnMenu: false,},
                    { name: '事业部', field: 'unitName',enableColumnMenu: false},
                    { name: '负责人', field: 'userName',enableColumnMenu: false},
                    { name: '管辖店', field: 'stores',width:350,enableColumnMenu: false,cellTooltip: true},
                    { name: '操作',cellClass:'girdDeleteimg',headerCellClass: 'gridhead-center',enableColumnMenu: false,enableSorting:false,
                        cellTemplate:'<div class="cursor" ng-click="grid.appScope.checkStore(row)">编辑</div>'}
                ],
                onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            //查询用户
            $scope.Search = {};
            $scope.findUser = function(){
                var loginName = $scope.Search.loginName;
                var userName = $scope.Search.userName;
                var data = {loginName:loginName,userName:userName}
                $("#msgwindow").show();
                blocService.findUser_jtgl(data).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.userManageOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userManageOptions.data.length;i++){
                            $scope.userManageOptions.data[i-1].index = i;
                        }
                    } else {

                    }
                });
            }
            $scope.findUser('yhgl');

            //查询事业部
            $scope.findBindUser = function(){
                var jtId = $rootScope.user.jtId;
                var data = {jtId:jtId};
                $("#msgwindow").show();
                blocService.findUnitByCondition(data).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.userBindOptions.data = result.results.content.result;
                        for(var i=1;i<=$scope.userBindOptions.data.length;i++){
                            $scope.userBindOptions.data[i-1].index = i;
                            var storeList = $scope.userBindOptions.data[i-1].storeList;
                            var strorArr = [];
                            for(var j=0;j<storeList.length;j++){
                                strorArr.push(storeList[j].storeName);
                            }
                            $scope.userBindOptions.data[i-1].stores= strorArr.join("、");
                        }
                        $scope.divisionList = result.results.content.result;
                    } else {

                    }
                });
            }
            $scope.findBindUser();

            //绑定店
            $scope.checkStore = function(row) {
                $scope.checkedStores = [];
                $("#storeCheckBox").show();
                $scope.unitData =  row.entity;
                var unitId = row.entity.id;
                blocService.findStore(unitId).then(function (result) {
                    if (result.status == 'OK') {
                        var addStoreOther = result.results.content.result;
                        $scope.checkedStores = result.results.content.result1;
                        $scope.addStoreAll = addStoreOther.concat($scope.checkedStores);
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
            $scope.makesureStore = function() {
                $scope.unitData.stores = [];
                var unitId = $scope.unitData.id;
                var stores = [];
                var storeIdList = [];
                for(var i=0; i<$scope.checkedStores.length; i++){
                    stores.push($scope.checkedStores[i].storeName);
                    storeIdList.push($scope.checkedStores[i].storeId)
                }
                var storeIds = storeIdList.join(",");
                var data = {unitId:unitId,storeIds:storeIds}
                blocService.updateUnitAndStore(data).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.unitData.stores = stores.join("、");
                        $("#storeCheckBox").hide();
                        $scope.angularTip("编辑成功",5000);
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            };
            //重置密码弹框按钮
            $scope.resetShow = function(row){
                $scope.resetid =  row.entity.id;
                $("#resetPass").show();
            }

            //重置查询条件
            $scope.clearSearch = function(){
                $scope.Search = {};
            }

            //删除用户
            $scope.deleteUserbtn = function(row) {
                $("#tip").show();
                $scope.makesure = function() {
                    $("#tip").hide();
                    $("#msgwindow").show();
                    blocService.deleteUser(row.entity.id,row.entity.roleId).then(function(result){
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
                blocService.resetPassword($scope.resetid).then(function(result){
                    if(result.results.content.status == 'OK'){
                        $("#resetPass").hide();
                        $scope.angularTip("重置成功",5000);
                    }else{
                        $scope.angularTip("重置失败",5000);
                    }
                });
            };

            //提交新增用户信息
            $scope.addnewuser = {};
            $scope.addUsersubmit = function() {
                var jtShortName=$rootScope.user.jtShortName;
                var loginName =jtShortName+"_"+$scope.addnewuser.loginName;
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
                var type =  $scope.addnewuser.type;
                var suoshu =  $scope.addnewuser.suoshu;
                var unitId = null;
                if(suoshu == 2 && $scope.addnewuser.division){
                    unitId = $scope.addnewuser.division.id;
                }
                var jtId = $rootScope.user.jtId;

                var userDatas = {storeId:0,loginName:loginName,userName:userName, phone:phone, roleId:roleId,
                    email:email,remark:remark,password:password,role:{roleName:roleName},index:index,unitId:unitId,jtId:jtId
                };
                var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                if(suoshu == 0){
                    $scope.angularTip("请选择所属部门",5000);
                }else if(suoshu == 2 && unitId == null){
                    $scope.angularTip("请选择事业部名称",5000);
                }else if(type==0){
                    $scope.angularTip("请选择角色分类",5000);
                }else if($scope.addnewuser.loginName == ''|| $scope.addnewuser.loginName == null){
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
                    blocService.addUser(userDatas).then(function(result){
                        $("#msgwindow").hide();
                        if(result.status == 'OK'&&result.results.content.status == 'OK'){
                            var userId = result.results.content.userId;
                            var newData = { storeId:0,loginName:loginName,userName:userName, phone:phone, roleId:roleId,
                                email:email,remark:remark,password:password,role:{roleName:roleName},index:index,id:userId,unitId:unitId,jtId:jtId
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
            //新增事业部门
            $scope.addDivision = function(){
                var unitName = $scope.addnewuser.unitName;
                if(unitName == "" || unitName == null){
                    $scope.angularTip("请输入事业部名称",5000);
                    return;
                }
                $("#msgwindow").show();
                blocService.division(unitName).then(function (result) {
                    $("#msgwindow").hide();
                    if (result.status == 'OK') {
                        $scope.findBindUser();
                        $("#addDivisionBox").hide();
                    } else {
                        $scope.angularTip(result.results.message,5000);
                    }
                });
            }
            //查询角色
            $scope.findRole = function() {
                var type =  $scope.addnewuser.type;
                var suoshu =  $scope.addnewuser.suoshu;
                var unitId = null;
                if(type==0){
                    return;
                }else if(suoshu == 2 && !$scope.addnewuser.division){
                    return;
                }else if(suoshu == 2 && $scope.addnewuser.division){
                    unitId = $scope.addnewuser.division.id;
                }else {
                    unitId = null;
                }
                var data = {type:type,unitId:unitId}
                blocService.findRoleByBloc(data).then(function (result) {
                    if (result.status == 'OK') {
                        $scope.BlocRoles = result.results.content.result;
                    } else {

                    }
                });
            }
            $scope.ResetType = function(){
                $scope.addnewuser.type = "0";
                $scope.BlocRoles={};
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
                $scope.modifyuser.unitId = row.entity.unitId;
                if($scope.modifyuser.unitId!=""&&$scope.modifyuser.unitId!=null){
                    for(var i=0;i<$scope.divisionList.length;i++){
                        if($scope.modifyuser.unitId==$scope.divisionList[i].id){
                            $scope.modifyuser.unitName = $scope.divisionList[i].unitName;
                        }
                    }
                }
                var roleId = row.entity.roleId;
                if(roleId==41){
                    $scope.modifyuser.type = "集团总";
                    $scope.modifyuser.suoshuName = "集团";
                    $scope.modifyuser.suoshu = "1";
                }else if(roleId==42||roleId==43||roleId==44){
                    $scope.modifyuser.type = "运营部";
                    $scope.modifyuser.suoshuName = "集团";
                    $scope.modifyuser.suoshu = "1";
                }else if(roleId==45||roleId==46||roleId==47){
                    $scope.modifyuser.type = "市场部";
                    $scope.modifyuser.suoshuName = "集团";
                    $scope.modifyuser.suoshu = "1";
                }else if(roleId==48||roleId==49||roleId==50){
                    $scope.modifyuser.type = "衍生部";
                    $scope.modifyuser.suoshuName = "集团";
                    $scope.modifyuser.suoshu = "1";
                }else if(roleId==51){
                    $scope.modifyuser.type = "事业部总经理";
                    $scope.modifyuser.suoshuName = "事业部";
                    $scope.modifyuser.suoshu = "2";
                }else if(roleId==52||roleId==53){
                    $scope.modifyuser.type = "销售部";
                    $scope.modifyuser.suoshuName = "事业部";
                    $scope.modifyuser.suoshu = "2";
                }else if(roleId==54||roleId==55){
                    $scope.modifyuser.type = "市场部";
                    $scope.modifyuser.suoshuName = "事业部";
                    $scope.modifyuser.suoshu = "2";
                }else if(roleId==56||roleId==57){
                    $scope.modifyuser.type = "售后部";
                    $scope.modifyuser.suoshuName = "事业部";
                    $scope.modifyuser.suoshu = "2";
                }else if(roleId==58||roleId==59){
                    $scope.modifyuser.type = "衍生部";
                    $scope.modifyuser.suoshuName = "事业部";
                    $scope.modifyuser.suoshu = "2";
                }
                var jtShortName=$rootScope.user.jtShortName;
                var SNlength = jtShortName.length+1;
                $scope.modifyuser.loginName = strLoginName.substring(SNlength);
                $("#modifyuserbox").show();
                $scope.modityUserSubmit = function(){
                    var newloginName = jtShortName+"_"+$scope.modifyuser.loginName;
                    var modifyUserDatas = {id:id,storeId:storeId,loginName:newloginName,userName:$scope.modifyuser.userName,
                        phone:$scope.modifyuser.phone,email: $scope.modifyuser.email,remark:$scope.modifyuser.remark};

                    var re_email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                    if($scope.modifyuser.loginName == ''|| $scope.modifyuser.loginName == null){
                        $scope.angularTip("用户名不能为空",5000);
                    }else if(!(/^(\w)+$/.test($scope.modifyuser.loginName))){
                        $scope.angularTip("用户名格式不正确,应由字母、数字、下划线组成",5000);
                    }else if($scope.modifyuser.userName == ''|| $scope.modifyuser.userName == null){
                        $scope.angularTip("姓名不能为空",5000);
                    }else if($scope.modifyuser.phone == null || $scope.modifyuser.phone == ''){
                        $scope.angularTip("手机号码不能为空",5000);
                    }else if(!(/^1[345789]\d{9}$/.test($scope.modifyuser.phone))){
                        $scope.angularTip("手机号码不正确",5000);
                    }else if($scope.modifyuser.email == null || $scope.modifyuser.email == ''){
                        $scope.angularTip("邮箱不能为空",5000);
                    }else if(!(re_email.test($scope.modifyuser.email))){
                        $scope.angularTip("邮箱不正确",5000);
                    }else {
                        blocService.modityUser(modifyUserDatas).then(function(result){
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
                    $("#msgwindow").show();
                    blocService.changePassword($scope.id,newPassword,oldPassword).then(function(result){
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
                blocService.logout()
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

angular.module('myApp')
    .factory('UserInterceptor', ["$q","$rootScope","$cookies",function ($q,$rootScope,$cookies) {
        return {
            request: function (config) {
                if($cookies.get('bip_user')==undefined){
                    config.headers["TOKEN"] = '';
                    window.location.href = '/index';
                    return '';
                }else{
                    var userInfo = JSON.parse($cookies.get('bip_user'));
                    var loginTime = parseInt($cookies.get('bip_login_time'),10);
                    if($rootScope.yUserId!=undefined&&userInfo.userId!=$rootScope.yUserId){
                        $rootScope.alertFlag = $rootScope.alertFlag + 1;
                        if($rootScope.alertFlag==1){
                            alert("当前浏览器有另一用户登陆，您被强行退出");
                        }
                        window.location.href = '/index';
                        return '';
                    }
                    $rootScope.user = userInfo;
                    if($rootScope.roleName.indexOf(userInfo.role.roleName)==-1){
                        if($rootScope.roleName!='数据分析员'){
                            window.location.href = '/index';
                            return '';
                        }
                    }
                    $rootScope.yUserId = userInfo.userId;
                    if(new Date().getTime() - loginTime >= 2*3600*1000){
                        $rootScope.alertFlag = $rootScope.alertFlag + 1;
                        if($rootScope.alertFlag ==1){
                            alert("登录已超时");
                        }
                        window.location.href = '/index';
                        return '';
                    }
                }
                return config;
            },
            response: function(response) {
                if(response.data.status == 'out-of-date'){
                    $rootScope.alertFlag = $rootScope.alertFlag + 1;
                    if($rootScope.alertFlag ==1){
                        alert("此帐号已在另一个地方登录,您被强行退出");
                    }
                    window.location.href = '/index';
                    return '';
                }
                return response || $q.when(response);
            }
        };
    }]);
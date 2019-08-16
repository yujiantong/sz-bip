angular.module('myApp')
    .factory('authorizationService', function ($q, $rootScope) {
    return {
        permissionCheck: function (roleName) {
            $rootScope.roleName = roleName;
            $rootScope.pageSize = 50;
            $rootScope.alertFlag = 0;
        }

    };
});

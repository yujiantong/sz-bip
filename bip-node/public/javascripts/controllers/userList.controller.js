'use strict';
angular.module('myApp')
    .controller('userListController',['$rootScope','$scope','userListService','$state',
        function($rootScope,$scope,userListService,$state){
            userListService.getPc().then(function(result){
                $scope.result = result;
            });
            $scope.click = function(index) {
                var row = $scope.result.rows[index];
                if(row){
                    userListService.delUser(row).then(
                        function(result){
                            if(result.success == true){
                                $scope.result.rows.splice(index, 1);
                            }else{
                                alert("删除失败！");
                            }
                        }
                    ).catch(
                        function(err){
                            alert(err);
                        }
                    );
                }

            };
        }

    ]);

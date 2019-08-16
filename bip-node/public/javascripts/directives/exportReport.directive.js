'use strict';
angular.module('myApp')
    .directive('exportReport', function($filter,ExportExcel) {
        return {
            scope: {
                data: "=",
                exportData:"="
            },
            restrict: 'E',
            template: '<span>导出</span>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                function exportReport() {
                    $scope.exportData=$scope.data.data;
                    var eName = $scope.data.name||""
                    var storetitle = $scope.data.storetitle||""
                    $scope.$apply(function() {
                    });

                    setTimeout(function() {
                        var fileName = storetitle + $filter('date')(new Date(), 'yyyyMMdd') + eName + '.xls'
                        var worksheetName = $filter('date')(new Date(), 'yyyyMMdd') + eName ;
                        ExportExcel.tableToExcel('#exportReportData', worksheetName, fileName)
                    },100)
                }
                $(element).bind("click",exportReport);
            }
        };
    });
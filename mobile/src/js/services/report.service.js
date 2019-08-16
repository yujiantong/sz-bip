'use strict';
angular.module('starter')
  .service("reportService",['$http','$q', function($http,$q){
    //日报-分保险公司
    this.appInsurancebillCount = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/appInsurancebillCount',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //保险KPI日报-续保专员
    this.countXbzyKPI = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/countXbzyKPI',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询当期续保率数据
    this.findCountAppMonthDqxbs = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findCountAppMonthDqxbs',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //APP月报-综合续保数
    this.findCountAppMonthZhxbs = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findCountAppMonthZhxbs',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //月报-分保险公司
    this.findCountMonthKpiInsurComp = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findCountMonthKpiInsurComp',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //保险KPI月报-分续保专员
    this.findCountMonthKpiXbzy = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findCountMonthKpiXbzy',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //保险KPI月报-分出单员
    this.findCountMonthKpiCdy = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findCountMonthKpiCdy',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询报表日期列表
    this.findReportSearchTime = function(condition){
      var deferred = $q.defer();
      $http.post('/api/report/findReportSearchTime',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);


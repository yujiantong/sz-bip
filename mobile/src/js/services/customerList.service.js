
'use strict';
angular.module('starter')
  .service("customerListService",['$http','$q', function($http,$q){
    this.findCustomerCollectionByUserId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findReturnApprovalCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //未接收潜客列表
    this.findWJSCustomer = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findWJSCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    /**
     * 查询今日邀约潜客列表
     * param:userId
     */

    this.findJRYYCustomerCollectionByUserId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findJRYYCustomerCollectionByUserId',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //应跟踪潜客列表
    this.findYGZCustomer = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findYGZCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //到店未出单潜客列表
    this.findDDWCDCustomer = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findDDWCDCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //已脱保潜客列表
    this.findYTBCustomerCollectionByUserId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findTBCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //今日创建保单
    this.findBillTodayCreate = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findBillTodayCreate',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询已激活潜客列表
    this.findByJiHuo = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findByJiHuo',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询待审批潜客列表
    this.findReturnDSPCustomer = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findReturnDSPCustomer',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //潜客查询潜客列表
    this.findCustomerByConditionApp = function(obj){
        var deferred = $q.defer();
        $http.post('/api/mobile/findCustomerByConditionApp',{params:JSON.stringify(obj)})
            .success(function(result){
                deferred.resolve(result);
            })
            .error(function(result){
                deferred.reject(result);
            });
        return deferred.promise;
    };
    //根据4s店id查询保险公司信息
    this.findCompInfoByStoreId = function(){
      var deferred = $q.defer();
      $http.post('/api/setting/findCompInfoByStoreId')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //按4s店ID查询车辆品牌车型信息
    this.findCarInfoByStoreId = function(){
      var deferred = $q.defer();
      $http.post('/api/admin/findCarInfoByStoreId')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //续保专员更新接收状态(批量)
    this.updateAcceptStatuBatch = function(customerInfo){
      var deferred = $q.defer();
      $http.post('/api/customer/updateAcceptStatuBatch',{customerInfo:JSON.stringify(customerInfo)})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询已回退潜客列表
    this.findByYiHuiTui = function(obj){
      var deferred = $q.defer();
      $http.post('/api/customer/findByYiHuiTui',{condition:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //根据回退状态查询
    this.findByReturnStatu = function(condition){
      var deferred = $q.defer();
      $http.post('/api/mobile/findGZFinishedCustomer',{params:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询本店各种用户
    this.selectUserForHolderSearch = function(){
      var deferred = $q.defer();
      $http.post('/api/user/selectUserForHolderSearch')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询负责人列表
    this.findSubordinate = function(){
      var deferred = $q.defer();
      $http.post('/api/user/findSubordinate')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //销售经理服务经理批量更换负责人
    this.changePrincipalBatch = function(data){
      var deferred = $q.defer();
      $http.post('/api/customer/changePrincipalBatchSM',{data:JSON.stringify(data)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //唤醒未分配潜客列表
    this.findActivateCustomer = function(obj){
      var deferred = $q.defer();
      $http.post('/api/customer/findActivateCustomer',{condition:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询战败线索列表
    this.findDefeatedSourceByUserId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findDefeatedSourceByUserId',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);


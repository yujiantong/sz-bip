
'use strict';
angular.module('starter')
  .service("customerDetailsService",['$http','$q', function($http,$q){

    /**
     *根据customerId查询该潜客详情
     * params: customerId
     */
  this.findCustomerDetailsByCustomerId = function(obj){
    var deferred = $q.defer();
    $http.post('/api/mobile/findCustomerDetailsByCustomerId',{params:JSON.stringify(obj)})
      .success(function(result){
        deferred.resolve(result);
      })
      .error(function(result){
        deferred.reject(result);
      });
    return deferred.promise;
  };
    /**
     *根据Id查询该战败潜客详情
     * params: customerId
     */
    this.findDefeatedSourceById = function(obj){
      var deferred = $q.defer();
      $http.post('/api/customer/findDefeatedSourceById',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保主管同意回退
    this.AgreetraceReturn = function(customerId,principalId,principal,tyhtyj){
      var deferred = $q.defer();
      $http.post('/api/customer/traceReturnXbzg',{customerId:customerId,principalId:principalId,principal:principal,tyhtyj:tyhtyj})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //续保主管拒绝回退
    this.unAgreeTraceReturnXbzg = function(customerId,principalId,principal,jjhtyy){
      var deferred = $q.defer();
      $http.post('/api/customer/unAgreeTraceReturnXbzg',{customerId:customerId,principalId:principalId,principal:principal,jjhtyy:jjhtyy})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //查询负责人列表，去除当前负责人
    this.findAllSubordinate = function(principalId){
      var deferred = $q.defer();
      $http.post('/api/user/findAllSubordinate',{principalId:principalId})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //更新负责人
    this.replacePrincipal = function(customerId,newPrincipalId,newPrincipal,principalId,principal,ghfzryy){
      var deferred = $q.defer();
      $http.post('/api/customer/changePrincipal',{customerId:customerId,newPrincipalId:newPrincipalId,newPrincipal:newPrincipal,
          principalId:principalId,principal:principal,ghfzryy:ghfzryy})
        // $http.get('pcList.json')
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
    //指定负责人
    this.assignPrincipal = function(customerId,newPrincipalId,principal,principalId,ghfzryy){
      var deferred = $q.defer();
      $http.post('/api/customer/assignPrincipal',{customerId:customerId,newPrincipalId:newPrincipalId,principal:principal,
          principalId:principalId,ghfzryy:ghfzryy})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //延期审批时,更新回退状态为已延期状态,更新延期到期日为当前时间加 7天
    this.updateReturnStatuToYyq = function(customerId,principalId,principal,tyyqyj){
      var deferred = $q.defer();
      $http.post('/api/customer/updateReturnStatuToYyq',{customerId:customerId,principalId:principalId,principal:principal,tyyqyj:tyyqyj})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保主管不同意延期
    this.updateReturnStatuToCszt = function(customerId,principalId,principal,jjyqyy){
      var deferred = $q.defer();
      $http.post('/api/customer/updateReturnStatuToCszt',{customerId:customerId,principalId:principalId,principal:principal,jjyqyy:jjyqyy})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保主管主动回退
    this.activeReturn = function(customerId,principalId,principal,zdhtyy){
      var deferred = $q.defer();
      $http.post('/api/customer/activeReturn',{customerId:customerId,principalId:principalId,principal:principal,zdhtyy:zdhtyy})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //直接延期,更新延期到期日为当前时间加 7天
    this.updateReturnStatuByRD = function(customerId,principalId,principal,yqyy){
      var deferred = $q.defer();
      $http.post('/api/customer/updateReturnStatuByRD',{customerId:customerId,principalId:principalId,principal:principal,yqyy:yqyy})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保专员添加跟踪信息
    this.addTraceRecord = function(customerTraceRecode,traceFlag){
      var deferred = $q.defer();
      $http.post('/api/customer/addTraceRecord',{customerTraceRecode:JSON.stringify(customerTraceRecode),traceFlag:traceFlag})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保专员回退
    this.traceReturn = function(customerId,htyy,principalId,principal,htyyxz,applyStatu){
      var deferred = $q.defer();
      $http.post('/api/customer/traceReturn',{customerId:customerId,htyy:htyy,principalId:principalId,principal:principal,htyyxz:htyyxz,applyStatu:applyStatu})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //服务顾问回退
    this.traceReturnFwgw = function(customerId,htyy,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/returnByFwgw',{customerId:customerId,htyy:htyy,principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //销售顾问回退
    this.returnBySC = function(customerId,htyy,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/returnBySC',{customerId:customerId,htyy:htyy,principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保专员申请延期
    this.updateReturnStatuToDyq = function(customerId,yqyy,principalId,principal,applyDelayDay){
      var deferred = $q.defer();
      $http.post('/api/customer/updateReturnStatuToDyq',{customerId:customerId,yqyy:yqyy,principalId:principalId,principal:principal,applyDelayDay:applyDelayDay})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保专员更新接收状态(单个)
    this.updateAcceptStatus = function(customerId,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/updateAcceptStatu',{customerId:customerId,principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //销售经理同意回退
    this.traceReturnSaM = function(customerId,clerkId,tyhtyj,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/returnBySCM',{customerId:customerId,clerkId:clerkId,tyhtyj:tyhtyj,
          principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //销售经理不同意回退
    this.unAgreeReturnBySaM = function(customerId,clerkId,principalId,principal,jjhtyy){
      var deferred = $q.defer();
      $http.post('/api/customer/unAgreeReturnBySCM',{customerId:customerId,clerkId:clerkId,principalId:principalId,principal:principal,jjhtyy:jjhtyy})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //销售经理服务经理主动回退
    this.returnByXSJLZD = function(customerId,clerkId,tyhtyj,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/returnByXSJLZD',{customerId:customerId,clerkId:clerkId,tyhtyj:tyhtyj,
          principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //服务经理同意回退
    this.traceReturnSeM = function(customerId,clerkId,tyhtyj,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/returnByFwgwM',{customerId:customerId,clerkId:clerkId,tyhtyj:tyhtyj,
          principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //服务经理不同意回退
    this.unAgreeReturnBySeM = function(customerId,clerkId,principalId,principal,jjhtyy){
      var deferred = $q.defer();
      $http.post('/api/customer/unAgreeReturnByFwgwM',{customerId:customerId,clerkId:clerkId,principalId:principalId,principal:principal,jjhtyy:jjhtyy})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //销售经理、服务经理更新负责人
    this.replacePrincipalSM = function(clerkId,clerk,customerId,principalId,principal,ghfzryy){
      var deferred = $q.defer();
      $http.post('/api/customer/managerChangePrincipal',{clerkId:clerkId,clerk:clerk,customerId:customerId,
          principalId:principalId,principal:principal,ghfzryy:ghfzryy})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询负责人列表，去除当前负责人
    this.findAllSubordinate = function(principalId){
      var deferred = $q.defer();
      $http.post('/api/user/findAllSubordinate',{principalId:principalId})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //战败潜客
    this.saveDefeatCustomer = function(obj){
      var deferred = $q.defer();
      var contactWay = obj.contactWay;
      $http.post('/api/customer/saveDefeatCustomer',{contactWay:contactWay})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //查询所有失销/回退原因
    this.findForSelectData = function(Data){
      var deferred = $q.defer();
      $http.post('/api/reason/findForSelectData',{params:JSON.stringify(Data)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //续保主管失销
    this.lostByXbzg = function(customerId,principalId,principal,sxyy,sxyyxz){
      var deferred = $q.defer();
      $http.post('/api/customer/lostByXbzg',{customerId:customerId,principalId:principalId,principal:principal,sxyy:sxyy,sxyyxz:sxyyxz})

        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //取消睡眠
    this.saveCancelSleep = function(customerId,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/saveCancelSleep',{customerId:customerId,principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //续保专员撤销回退，失销，睡眠
    this.cancelReturn = function(condition){
      var deferred = $q.defer();
      $http.post('/api/customer/cancelReturn',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //根据4s店id查询保险公司信息
    this.findCompInfoByStoreId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/setting/findCompInfoByStoreId',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //按潜客ID查询该潜客去年险种信息
    this.findBxInfoForBH = function(obj){
      var deferred = $q.defer();
      $http.post('/api/customer/findBxInfoForBH',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //用bofide提供的接口报价
    this.applyBJFromBofide = function(condition){
      var deferred = $q.defer();
      $http.post('/api/bihu/applyBJFromBofide',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //保存报价
    this.saveBJ = function(condition){
      var deferred = $q.defer();
      $http.post('/api/bihu/saveBJ',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);


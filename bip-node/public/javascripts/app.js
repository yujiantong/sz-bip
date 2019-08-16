'use strict';
/**
* myApp Module
*
* Description
*/

angular.module('myApp', ['ui.router','ui.grid','ui.bootstrap','ngCookies','ui.grid.resizeColumns','ngFileUpload',
    'ui.grid.moveColumns','ngAnimate','ui.grid.cellNav', 'ui.grid.pinning','ui.grid.edit','ui.grid.selection',
    'ui.grid.infiniteScroll','ui.grid.autoResize','ngFileSaver','ui.bootstrap.datetimepicker'])
  .config(['$stateProvider','$httpProvider',function($stateProvider,$httpProvider) {

    $stateProvider
       .state('userList',{
         url:'/userList',
         controller:'userListController',
         templateUrl:'views/userList.html'
       })
        .state('test',{
            url:'/test',
            controller:'testController',
            templateUrl:'views/testIndex.html'
        })
        .state('test.test1',{
            url:'/test1',
            controller:'testController2',
            templateUrl:'views/centerCon.html'
        })

        .state('insurance',{
            url:'/insurance',
            controller:'insuranceController',
            templateUrl:'views/renewalManager/insuranceIndex.html'
        })
        .state('insurance.insuranceSearch',{
            url:'/insuranceSearch',
            controller:'insuranceSearchController',
            templateUrl:'views/renewalManager/insuranceSearch.html'
        })

        .state('insuranceWriter',{
            url:'/insuranceWriter',
            controller:'indexIW_Controller',
            templateUrl:'views/insuranceWriter/indexIW.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('出单员');
                },
            }
        })
        .state('insuranceWriter.policy',{
            url:'/policyIW',
            controller:'policyIW_Controller',
            templateUrl:'views/insuranceWriter/policyIW.html'
        })
        .state('insuranceWriter.customer',{
            url:'/customerIW',
            controller:'customerIW_Controller',
            templateUrl:'views/insuranceWriter/customerIW.html'
        })
        .state('insuranceWriter.suggest',{
            url:'/suggestIW',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        .state('insuranceWriter.premium',{
            url:'/premiumIW',
            controller:'premiumIW_Controller',
            templateUrl:'views/insuranceWriter/premiumIW.html'
        })
        .state('insuranceWriter.giftRecord',{
            url:'/giftRecordIW',
            controller:'giftRecordIW_Controller',
            templateUrl:'views/insuranceWriter/giftRecordIW.html'
        })
        .state('insuranceWriter.record',{
            url:'/recordIW',
            controller:'record_Controller',
            templateUrl:'views/insuranceWriter/recordIW.html'
        })
        //续保专员
        .state('renewalCommissioner',{
            url:'/renewalCommissioner',
            controller:'indexRC_Controller',
            templateUrl:'views/renewalCommissioner/indexRC.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('续保专员');
                },
            }
        })
        .state('renewalCommissioner.policy',{
            url:'/policyRC',
            controller:'policyRC_Controller',
            templateUrl:'views/renewalCommissioner/policyRC.html'
        })
        .state('renewalCommissioner.customer',{
            url:'/customerRC',
            controller:'customerRC_Controller',
            templateUrl:'views/renewalCommissioner/customerRC.html'
        })
        .state('renewalCommissioner.suggest',{
            url:'/suggestRC',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //禁用出单员后，出单员的功能全部显示在续保专员里面(这里直接调用出单员的方法)
        //赠送记录
        .state('renewalCommissioner.giftRecord',{
            url:'/giftRecordRC',
            controller:'giftRecordIW_Controller',
            templateUrl:'views/insuranceWriter/giftRecordIW.html'
        })
        //保费查询
        .state('renewalCommissioner.premium',{
            url:'/premiumRC',
            controller:'premiumIW_Controller',
            templateUrl:'views/insuranceWriter/premiumIW.html'
        })
        //同步密码
        .state('renewalCommissioner.record',{
            url:'/recordRC',
            controller:'record_Controller',
            templateUrl:'views/insuranceWriter/recordIW.html'
        })
        //续保主管
        .state('renewalDirector',{
            url:'/renewalDirector',
            controller:'indexRD_Controller',
            templateUrl:'views/renewalDirector/indexRD.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('续保主管');
                },
            }

        })
        .state('renewalDirector.policy',{
            url:'/policyRD',
            controller:'policyRD_Controller',
            templateUrl:'views/renewalDirector/policyRD.html'
        })
        .state('renewalDirector.customer',{
            url:'/customerRD',
            controller:'customerRD_Controller',
            templateUrl:'views/renewalDirector/customerRD.html'
        })
        .state('renewalDirector.param',{
            url:'/paramRD',
            controller:'paramRD_Controller',
            templateUrl:'views/renewalDirector/paramRD.html'
        })
        .state('renewalDirector.performance',{
            url:'/performanceRD',
            controller:'performanceRD_Controller',
            templateUrl:'views/renewalDirector/performanceRD.html'
        })
        .state('renewalDirector.report',{
            url:'/reportRD',
            controller:'report_Controller',
            templateUrl:'views/report/report.html'
        })
        .state('renewalDirector.message',{
            url:'/messageRD',
            controller:'message_Controller',
            templateUrl:'views/renewalDirector/messageRD.html'
        })
        .state('renewalDirector.suggest',{
            url:'/suggestRD',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //保险经理
        .state('insuranceManager',{
            url:'/insuranceManager',
            controller:'indexIM_Controller',
            templateUrl:'views/insuranceManager/indexIM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('保险经理');
                },
            }
        })
        .state('insuranceManager.policy',{
            url:'/policyIM',
            controller:'policyIM_Controller',
            templateUrl:'views/insuranceManager/policyIM.html'
        })
        .state('insuranceManager.customer',{
            url:'/customerIM',
            controller:'customerIM_Controller',
            templateUrl:'views/insuranceManager/customerIM.html'
        })
        .state('insuranceManager.param',{
            url:'/paramIM',
            controller:'paramIM_Controller',
            templateUrl:'views/insuranceManager/paramIM.html'
        })
        .state('insuranceManager.performance',{
            url:'/performanceIM',
            controller:'performanceIM_Controller',
            templateUrl:'views/insuranceManager/performanceIM.html'
        })
        .state('insuranceManager.report',{
            url:'/reportIM',
            controller:'report_Controller',
            templateUrl:'views/report/report.html'
        })
        .state('insuranceManager.suggest',{
            url:'/suggestIM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        .state('insuranceManager.giftRecord',{
            url:'/giftRecordIM',
            controller:'giftRecordIM_Controller',
            templateUrl:'views/insuranceManager/giftRecordIM.html'
        })
        .state('insuranceManager.premium',{
            url:'/premiumIM',
            controller:'premiumIM_Controller',
            templateUrl:'views/insuranceManager/premiumIM.html'
        })
        //销售顾问
        .state('salesConsultant',{
            url:'/salesConsultant',
            controller:'indexSC_Controller',
            templateUrl:'views/salesConsultant/indexSC.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('销售顾问');
                },
            }
        })
        .state('salesConsultant.policy',{
            url:'/policySC',
            controller:'policySC_Controller',
            templateUrl:'views/salesConsultant/policySC.html'
        })
        .state('salesConsultant.customer',{
            url:'/customerSC',
            controller:'customerSC_Controller',
            templateUrl:'views/salesConsultant/customerSC.html'
        })
        .state('salesConsultant.suggest',{
            url:'/suggestSC',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //销售经理
        .state('salesManager',{
            url:'/salesManager',
            controller:'indexSaM_Controller',
            templateUrl:'views/salesManager/indexSaM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('销售经理');
                },
            }
        })
        .state('salesManager.policy',{
            url:'/policySaM',
            controller:'policySaM_Controller',
            templateUrl:'views/salesManager/policySaM.html'
        })
        .state('salesManager.customer',{
            url:'/customerSaM',
            controller:'customerSaM_Controller',
            templateUrl:'views/salesManager/customerSaM.html'
        })
        .state('salesManager.suggest',{
            url:'/suggestSaM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //服务顾问
        .state('serviceAdvisor',{
            url:'/serviceAdvisor',
            controller:'indexSA_Controller',
            templateUrl:'views/serviceAdvisor/indexSA.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('服务顾问');
                },
            }
        })
        .state('serviceAdvisor.policy',{
            url:'/policySA',
            controller:'policySA_Controller',
            templateUrl:'views/serviceAdvisor/policySA.html'
        })
        .state('serviceAdvisor.customer',{
            url:'/customerSA',
            controller:'customerSA_Controller',
            templateUrl:'views/serviceAdvisor/customerSA.html'
        })
        .state('serviceAdvisor.maintainRecord',{
            url:'/maintainRecordSA',
            controller:'maintainRecordSA_Controller',
            templateUrl:'views/serviceAdvisor/maintainRecordSA.html'
        })
        .state('serviceAdvisor.giftCheck',{
            url:'/giftCheckSA',
            controller:'giftCheckSA_Controller',
            templateUrl:'views/serviceAdvisor/giftCheckSA.html'
        })
        .state('serviceAdvisor.suggest',{
            url:'/suggestSA',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //服务经理
        .state('serviceManager',{
            url:'/serviceManager',
            controller:'indexSeM_Controller',
            templateUrl:'views/serviceManager/indexSeM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('服务经理');
                },
            }
        })
        .state('serviceManager.policy',{
            url:'/policySeM',
            controller:'policySeM_Controller',
            templateUrl:'views/serviceManager/policySeM.html'
        })
        .state('serviceManager.customer',{
            url:'/customerSeM',
            controller:'customerSeM_Controller',
            templateUrl:'views/serviceManager/customerSeM.html'
        })
        .state('serviceManager.pushRepair',{
            url:'/pushRepairSeM',
            controller:'pushRepairSeM_Controller',
            templateUrl:'views/serviceManager/pushRepairSeM.html'
        })
        .state('serviceManager.maintainRecord',{
            url:'/maintainRecordSeM',
            controller:'maintainRecordSeM_Controller',
            templateUrl:'views/serviceManager/maintainRecordSeM.html'
        })
        .state('serviceManager.suggest',{
            url:'/suggestSeM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //前台主管
        .state('receptionManager',{
            url:'/receptionManager',
            controller:'indexRM_Controller',
            templateUrl:'views/receptionManager/indexRM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('前台主管');
                },
            }
        })
        .state('receptionManager.policy',{
            url:'/policyRM',
            controller:'policyRM_Controller',
            templateUrl:'views/receptionManager/policyRM.html'
        })
        .state('receptionManager.customer',{
            url:'/customerRM',
            controller:'customerRM_Controller',
            templateUrl:'views/receptionManager/customerRM.html'
        })
        .state('receptionManager.suggest',{
            url:'/suggestRM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //客服专员
        .state('customerServiceCommissioner',{
            url:'/customerServiceCommissioner',
            controller:'indexCSC_Controller',
            templateUrl:'views/customerServiceCommissioner/indexCSC.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('客服专员');
                },
            }
        })
        .state('customerServiceCommissioner.customer',{
            url:'/customerCSC',
            controller:'customerCSC_Controller',
            templateUrl:'views/customerServiceCommissioner/customerCSC.html'
        })
        .state('customerServiceCommissioner.suggest',{
            url:'/suggestCSC',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //客服经理
        .state('customerServiceManager',{
            url:'/customerServiceManager',
            controller:'indexCSM_Controller',
            templateUrl:'views/customerServiceManager/indexCSM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('客服经理');
                },
            }
        })
        .state('customerServiceManager.customer',{
            url:'/customerCSM',
            controller:'customerCSM_Controller',
            templateUrl:'views/customerServiceManager/customerCSM.html'
        })
        .state('customerServiceManager.suggest',{
            url:'/suggestCSM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        //总经理
        .state('generalManager',{
            url:'/generalManager',
            controller:'indexGM_Controller',
            templateUrl:'views/generalManager/indexGM.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('总经理');
                },
            }
        })
        .state('generalManager.policy',{
            url:'/policyGM',
            controller:'policyGM_Controller',
            templateUrl:'views/generalManager/policyGM.html'
        })
        .state('generalManager.customer',{
            url:'/customerGM',
            controller:'customerGM_Controller',
            templateUrl:'views/generalManager/customerGM.html'
        })
        .state('generalManager.param',{
            url:'/paramGM',
            controller:'paramGM_Controller',
            templateUrl:'views/generalManager/paramGM.html'
        })
        .state('generalManager.performance',{
            url:'/performanceGM',
            controller:'performanceGM_Controller',
            templateUrl:'views/generalManager/performanceGM.html'
        })
        .state('generalManager.report',{
            url:'/reportGM',
            controller:'report_Controller',
            templateUrl:'views/report/report.html'
        })
        //经理新加短信管理模块 2018-09-29
        .state('generalManager.message',{
            url:'/messageGM',
            controller:'message_Controller',
            templateUrl:'views/generalManager/messageGM.html'
        })
        .state('generalManager.suggest',{
            url:'/suggestGM',
            controller:'suggest_Controller',
            templateUrl:'views/suggest/suggest.html'
        })
        .state('generalManager.giftRecord',{
            url:'/giftRecordGM',
            controller:'giftRecordGM_Controller',
            templateUrl:'views/generalManager/giftRecordGM.html'
        })
        .state('generalManager.pushRepair',{
            url:'/pushRepairGM',
            controller:'pushRepairGM_Controller',
            templateUrl:'views/generalManager/pushRepairGM.html'
        })
        .state('generalManager.premium',{
            url:'/premiumGM',
            controller:'premiumGM_Controller',
            templateUrl:'views/generalManager/premiumGM.html'
        })
        //数据分析员
        .state('dataAnalyst',{
            url:'/dataAnalyst',
            controller:'indexDA_Controller',
            templateUrl:'views/dataAnalyst/indexDA.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('数据分析员');
                },
            }
        })
        .state('dataAnalyst.policy',{
            url:'/policyDA',
            controller:'policyDA_Controller',
            templateUrl:'views/dataAnalyst/policyDA.html'
        })
        .state('dataAnalyst.customer',{
            url:'/customerDA',
            controller:'customerDA_Controller',
            templateUrl:'views/dataAnalyst/customerDA.html'
        })
        .state('dataAnalyst.param',{
            url:'/paramDA',
            controller:'paramDA_Controller',
            templateUrl:'views/dataAnalyst/paramDA.html'
        })
        .state('dataAnalyst.performance',{
            url:'/performanceDA',
            controller:'performanceDA_Controller',
            templateUrl:'views/dataAnalyst/performanceDA.html'
        })
        .state('dataAnalyst.report',{
            url:'/reportDA',
            controller:'report_Controller',
            templateUrl:'views/report/report.html'
        })
        .state('dataAnalyst.suggest',{
            url:'/suggestDA',
            controller:'suggestDA_Controller',
            templateUrl:'views/dataAnalyst/suggestDA.html'
        })
        //4S管理员
        .state('admin',{
            url:'/admin',
            controller:'adminController',
            templateUrl:'views/adminstrator/index.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('4s店管理员');
                },
            }
        })
        .state('admin.index',{
            url:'/index',
            templateUrl:'views/adminstrator/adminCon.html'
        })
        //4S管理员
        .state('bloc',{
            url:'/bloc',
            controller:'blocController',
            templateUrl:'views/bloc/index.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('集团管理员');
                },
            }
        })
        .state('bloc.index',{
            url:'/index',
            templateUrl:'views/bloc/blocCon.html'
        })
        //超级管理员
        .state('superAdmin',{
            url:'/superAdmin',
            controller:'superAdminController',
            templateUrl:'views/superAdmin/index.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('超级管理员,店管理员,客服人员');
                },
            }
        })
        .state('superAdmin.index',{
            url:'/index',
            templateUrl:'views/superAdmin/superAdminCon.html'
        })

        //信息员
        .state('informationOfficer',{
            url:'/informationOfficer',
            controller:'indexIO_Controller',
            templateUrl:'views/informationOfficer/indexIO.html',
            resolve: {
                permission: function (authorizationService) {
                    return authorizationService.permissionCheck('信息员');
                },
            }
        })
        .state('informationOfficer.giftManagement',{
            url:'/giftManagement',
            controller:'giftManagement_Controller',
            templateUrl:'views/informationOfficer/giftManagementIO.html'
        })


    $httpProvider.interceptors.push('testInterceptor');
      $httpProvider.interceptors.push('UserInterceptor');
      $httpProvider.interceptors.push('ExportExcel');
      $httpProvider.interceptors.push('eChartsHelper');
      $httpProvider.interceptors.push('createReportOption');
      $httpProvider.interceptors.push('exportExcelReportData');
      $httpProvider.interceptors.push('authorizationService');
      $httpProvider.interceptors.push('checkService');
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */
      var param = function(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
          value = obj[name];
          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '='
                + encodeURIComponent(value) + '&';
          }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
      };
      return angular.isObject(data) && String(data) !== '[object File]'
          ? param(data)
          : data;
    }];
  }]);
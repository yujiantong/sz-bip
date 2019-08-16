'use strict';
angular.module('starter')
  .factory('pubHelper', ['$localStorage','$ionicPopup','$ionicViewSwitcher','$ionicHistory','pubPopup',function($localStorage,$ionicPopup,$ionicViewSwitcher,$ionicHistory,pubPopup){

    var factory = {
      // 判断用户是否为经理级别
      isManager : function(position){
        // 'AM','S-SC','S-SCL','S-SCD','S-SCM','S-SCS','S-GMD','S-GMD-I','S-RP','S-TD','S-BSP','S-BSPM','S-BSPL','S-MKM'
        var isManagerFlag = false;
        switch(position) {
          case 'S-SCM':
          case 'S-SCL':
          case 'S-SCD':
          case 'S-SCS':
          case 'S-GMD':
          case 'S-GMD-I':
          case 'S-BSPM':
          case 'S-BSPM':
          case 'S-BSPL':
          case 'S-MKM':
            isManagerFlag = true;
            break;
          case 'S-SC':
          case 'S-BSP':
            isManagerFlag = false;
            break;
          default:
            throw '职位未匹配到！';
        }
        return isManagerFlag;
      },
      // 是否有职能
      hasAction : function(action){
        var flag = false;
        var localActions = $localStorage.actions || [];
        for(var i in localActions){
          if(localActions[i].aId == action){
            flag = true;
            break;
          }
        }
        return flag;
      },
      setNextTraceDate: function (rank,datas){
        var nextTraceDate,day;
        if(rank == null){
          nextTraceDate = '';
        }else{
          for(var i in datas){
            if(datas[i].paramName == rank){
              day = parseInt(datas[i].paramValue);
              nextTraceDate = moment().add(day, 'days')._d;
            }
          }
        }
        return nextTraceDate;
      },
      alert:function(success,mes,backStep){
        var message = mes?mes:(success?'保存成功！':'操作失败！');
        var alertPopup = pubPopup.alert({
          okText:'确定',
          // title: '提示！',
          template: message
        });
        return alertPopup.then(function(res) {
          if(success){
            if(backStep instanceof Function){
              backStep();
            }else{
              $ionicViewSwitcher.nextDirection('back');
              $ionicHistory.goBack(backStep);
            }
          }
        });
      },
      confirm:function(mes,successFn,errFn){
        var confirmPopup = pubPopup.confirm({
          // title: '提示！',
          template: mes,
          okText:'确定',
          cancelText:'取消'
        });
        return confirmPopup.then(function(res) {
          if(res) {
            successFn && successFn();
          }else{
            errFn && errFn();
          }
        });
      },
      setNextRank:function(rank,datas,recordTime){
        var returnRank;
        var day = 0;
        for(var i in datas){
          if(datas[i].paramName == rank){
            day = parseInt(datas[i].paramValue);
          }
        }
        var recordTime = moment(recordTime);
        var toDay = moment();
        var diffDay = toDay.diff(recordTime, 'days');
        switch (rank){
          case 'S1':
            returnRank = diffDay >= day ? 'S2' : 'S1';
            break;
          case 'S2':
            returnRank = diffDay >= day ? 'S3' : 'S2';
            break;
          case 'S3':
            returnRank = diffDay >= day ? 'S4' : 'S3';
            break;
          case 'S4':
            returnRank = diffDay >= day ? 'T' : 'S4';
            break;
          case 'T':
            returnRank = 'T';
            break;
        }
        return returnRank;
      },
      isEmptyObject:function (e) {//判定是否是空对象
        var t;
        for (t in e)
          return !1;
        return !0
      },
      isEmpty:function (e) {//判定是否是空
        if(e==undefined||e==null||e==''){
          return true
        }
        return false;
      }
    };
    return factory;
  }])

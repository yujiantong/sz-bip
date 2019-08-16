angular.module('starter')

.component('progressbar', {
  bindings: {
    width: '@',//进度条的宽度 （百分比）
    height: '@',//进度条的高度 （px）
    level:'@',//页面级别，1全店，2个人
    tostate:'@',//如果没录指标，是否可以跳转到指标页面
    target: '<',//目标值
    complete: '<',//完成值
    colorup:'<',//颜色 当前日均
    colordown:'<',//颜色 努力方向
    comparemin: '<',//完成范围，对比量最小值（整数）,默认100
    comparemax: '<'//完成范围，对比量最大值（整数）,默认100
  },
  controller: function ($scope,$timeout,$localStorage,$ionicViewSwitcher,$state) {
    var ctrl = this;
    ctrl.stateGo = stateGo;

    ctrl.isExceed = false;
    ctrl.dataIsBack = false;
    ctrl.barStyle = {};
    ctrl.numberStyle = {};
    ctrl.lineStyle = {};
    ctrl.widthStyle = {
      width:ctrl.width?ctrl.width:'100%'
    };

    $scope.$on('homepage-progressbar',function(e,data){
      $timeout(function(){
        ctrl.dataIsBack = true;
        init();
      })
    })

    function assign(){
      ctrl.target = parseInt(ctrl.target);
      ctrl.complete = parseInt(ctrl.complete);
      ctrl.comparemin = parseInt(ctrl.comparemin);
      ctrl.comparemax = parseInt(ctrl.comparemax);

      if(ctrl.target != 0){
        ctrl.finish = parseInt(ctrl.complete/ctrl.target * 100);
        ctrl.percent = ctrl.finish + '%';
      }else{
        ctrl.finish = 100;
        ctrl.percent = ctrl.finish + '%';
        ctrl.barStyle['background-color'] = '#89CE10';
        ctrl.isExceed = false;
        ctrl.barWidth = ctrl.percent;
        if(ctrl.height){
          ctrl.barStyle.height = ctrl.height + 'px';
          ctrl.numberStyle['line-height'] = (parseInt(ctrl.height) + 4) + 'px';
          ctrl.lineStyle.height = (parseInt(ctrl.height) + 4) + 'px';
        }
        return
      }

      // if(ctrl.comparemin != null && !isNaN(ctrl.comparemin)){
      //   if(ctrl.comparemin > 100){
      //     ctrl.comparemin = 100;
      //   }
      // }else{
      //   ctrl.comparemin = 0;
      // }

      if(ctrl.comparemax != null && !isNaN(ctrl.comparemax)){
        // if(ctrl.comparemax < 100){
        //   ctrl.comparemax = 100;
        // }
      }else{
        ctrl.comparemax = 0;
      }
      calculate();
    }

    function calculate(){
      var mday = moment().date();
      var mdaysInMonth = moment().daysInMonth();
      var abs = 0;
      if(mday == mdaysInMonth){
        abs = Math.abs((ctrl.complete - ctrl.target)/ctrl.target);
      }else{
        if(ctrl.colordown === 0){
          abs = 2;
        }else{
          abs = Math.abs((ctrl.colorup-ctrl.colordown)/ctrl.colordown);
        }
      }
      
      
      if(ctrl.finish <= 100){
        ctrl.isExceed = false;
        if((abs * 100) <= ctrl.comparemax){
          if(ctrl.finish < 20){
            ctrl.numberStyle.color = '#89CE10';
            ctrl.numberStyle.left = ctrl.percent;
          }
          ctrl.barStyle['background-color'] = '#89CE10';
        }else{
          if(ctrl.colorup > ctrl.colordown){
            if(ctrl.finish < 20){
              ctrl.numberStyle.color = '#C777E9';
              ctrl.numberStyle.left = ctrl.percent;
            }
            ctrl.barStyle['background-color'] = '#C777E9';
          }else{
            if(ctrl.finish < 20){
              ctrl.numberStyle.color = '#FF6E6E';
              ctrl.numberStyle.left = ctrl.percent;
            }
            ctrl.barStyle['background-color'] = '#FF6E6E';
          }
        }
        ctrl.barWidth = ctrl.percent;

      }else{
        ctrl.isExceed = true;
        ctrl.lineStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
        ctrl.barWidth = '100%';
        if((abs * 100) <= ctrl.comparemax){
          if(ctrl.finish >= 400){
            ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
          }
          ctrl.barStyle['background-color'] = '#89CE10';
        }else{
          if(ctrl.colorup > ctrl.colordown){
            if(ctrl.finish >= 400){
              ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
            }
            ctrl.barStyle['background-color'] = '#C777E9';
          }else{
            if(ctrl.finish >= 400){
              ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
            }
            ctrl.barStyle['background-color'] = '#FF6E6E';
          }
        }
      }
      
      // switch (true){
      //   case (ctrl.finish < ctrl.comparemin):
      //     if(ctrl.finish < 20){
      //       ctrl.numberStyle.color = '#FF6E6E';
      //       ctrl.numberStyle.left = ctrl.percent;
      //     }
      //     ctrl.barStyle['background-color'] = '#FF6E6E';
      //     ctrl.isExceed = false;
      //     ctrl.barWidth = ctrl.percent;
      //     break;
      //   case (ctrl.finish >= ctrl.comparemin && ctrl.finish <= ctrl.comparemax && ctrl.finish <= 100):
      //     if(ctrl.finish < 20){
      //       ctrl.numberStyle.color = '#89CE10';
      //       ctrl.numberStyle.left = ctrl.percent;
      //     }
      //     ctrl.barStyle['background-color'] = '#89CE10';
      //     ctrl.isExceed = false;
      //     ctrl.barWidth = ctrl.percent;
      //     break;
      //   case (ctrl.finish >= ctrl.comparemin && ctrl.finish <= ctrl.comparemax && ctrl.finish > 100):
      //     ctrl.barStyle['background-color'] = '#89CE10';
      //     ctrl.isExceed = true;
      //     ctrl.barWidth = '100%';
      //     if(ctrl.finish >= 400){
      //       ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
      //     }
      //     ctrl.lineStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
      //     break;
      //   case (ctrl.finish > ctrl.comparemax):
      //     ctrl.barStyle['background-color'] = '#C777E9';
      //     ctrl.isExceed = true;
      //     ctrl.barWidth = '100%';
      //     if(ctrl.finish >= 400){
      //       ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
      //     }
      //     ctrl.lineStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
      //     break;
      // }
      
      ctrl.barStyle.width = ctrl.barWidth;
      if(ctrl.height){
        ctrl.barStyle.height = ctrl.height + 'px';
        ctrl.numberStyle['line-height'] = (parseInt(ctrl.height) + 4) + 'px';
        ctrl.lineStyle.height = (parseInt(ctrl.height) + 4) + 'px';
      }
    }

    // 初始化，判断指标量是否为null
    function init(){

      if(ctrl.target != null && ctrl.target !== ''){
        ctrl.targetIsNull = false;
        assign();
      }else{
        ctrl.targetIsNull = true;
        ctrl.numberStyle.color = '#FF6E6E';
        ctrl.numberStyle.width = '100%';
        ctrl.numberStyle['text-align'] = 'center';
        ctrl.numberStyle['margin-left'] = '-2px';

        var loginPisitionId = $localStorage.loginMsg && $localStorage.loginMsg.positionId;
        var superiorName;
        ctrl.canStateChange = false;
        switch (loginPisitionId){
          case 'S-SC':
            superiorName = '等销售经理';
            break;
          // case 'S-BSP':
          //   superiorName = '等待网销经理';break;
          case 'S-SCM':
          case 'S-SCS':
          case 'S-SCD':
          case 'S-SCD-I':
          case 'S-SCL':
          // case 'S-BSPM':
          // case 'S-BSPL':
            if(ctrl.level == '2'){
              superiorName = '请';
              ctrl.canStateChange = true;
            }else{
              superiorName = '等总经理';
            }
            break;
          case 'S-GMD':
          case 'S-GMD-I':
            if(ctrl.level == '2'){
              superiorName = '等销售经理';
            }else{
              superiorName = '请';
              ctrl.canStateChange = true;
            }
            break;
          default :
            superiorName = '等上级';
        }
        ctrl.percent = superiorName + '录入指标';
        if(ctrl.height){
          ctrl.barStyle.height = ctrl.height + 'px';
          ctrl.numberStyle['line-height'] = (parseInt(ctrl.height) + 4) + 'px';
          ctrl.lineStyle.height = (parseInt(ctrl.height) + 4) + 'px';
        }
      }
    }

    // 页面跳转到指标页面
    function stateGo(){
      if(ctrl.tostate == 'true' && ctrl.dataIsBack && ctrl.targetIsNull && ctrl.canStateChange){
        $ionicViewSwitcher.nextDirection('forward'); 
        $state.go('target');
      }
    }

  },
  templateUrl:'templates/componentDiv/progress.html'
});
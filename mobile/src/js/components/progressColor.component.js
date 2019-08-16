angular.module('starter')

.component('progressColor', {
  bindings: {
    target: '<',//目标值
    complete: '<',//完成值
    scale: '@',//是否放大
    colorup:'<',//颜色 当前日均
    colordown:'<',//颜色 努力方向
    comparemin: '<',//完成范围，对比量最小值（整数）,默认100
    comparemax: '<'//完成范围，对比量最大值（整数）,默认100
  },
  controller: function ($scope,$timeout) {
    var ctrl = this;

    $scope.$on('homepage-progress-color',function(e,data){
      $timeout(function(){
        init();
      })
    })

    function init(){

      ctrl.complete = parseInt(ctrl.complete);
      ctrl.target = parseInt(ctrl.target);
      ctrl.comparemin = parseInt(ctrl.comparemin);
      ctrl.comparemax = parseInt(ctrl.comparemax);
      ctrl.colorStyle = {};

      if(isNaN(ctrl.complete)){
        ctrl.complete = null;
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

      if(isNaN(ctrl.target)){
        ctrl.target = '无';
        return;
      }else if(ctrl.target == 0){
        ctrl.colorStyle = {'bsp-finish':true,'font-scale':ctrl.scale == 'true'};
        return
      }else{
        ctrl.finish = parseInt(ctrl.complete/ctrl.target * 100);
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

        ctrl.colorStyle['font-scale'] = (ctrl.scale == 'true');
        if((abs * 100) <= ctrl.comparemax){
          ctrl.colorStyle['bsp-finish'] = true;
        }else{
          if(ctrl.colorup > ctrl.colordown){
            ctrl.colorStyle['bsp-exceed'] = true;
          }else{
            ctrl.colorStyle['bsp-unfinish'] = true;
          }
        }

      }

    }

    
  },
  templateUrl:'templates/componentDiv/progressColor.html'
});
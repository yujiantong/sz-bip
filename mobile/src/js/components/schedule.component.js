angular.module('starter')

.component('schedulebar', {
  bindings: {
    width: '<',
    complete: '<',
    target: '<'
  },
  controller: function () {
    var ctrl = this;
    ctrl.isExceed = false;
    ctrl.barStyle = {};
    ctrl.numberStyle = {};
    ctrl.lineStyle = {};
    ctrl.complete = parseInt(ctrl.complete);
    ctrl.target = parseInt(ctrl.target);
    ctrl.finish = parseInt(ctrl.complete/ctrl.target * 100);
    ctrl.percent = ctrl.finish + '%';
    switch (true){
      case (ctrl.finish < 80):
        if(ctrl.finish < 20){
          ctrl.numberStyle.color = '#FF6E6E';
          ctrl.numberStyle.left = ctrl.percent;
        }
        ctrl.barStyle['background-color'] = '#FF6E6E';
        ctrl.isExceed = false;
        ctrl.barWidth = ctrl.percent;
        break;
      case (ctrl.finish >= 80 && ctrl.finish <= 100):
        ctrl.barStyle['background-color'] = '#89CE10';
        ctrl.isExceed = false;
        ctrl.barWidth = ctrl.percent;
        break;
      case (ctrl.finish > 100):
        ctrl.barStyle['background-color'] = '#C777E9';
        ctrl.isExceed = true;
        ctrl.barWidth = '100%';
        if(ctrl.finish >= 400){
          ctrl.numberStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
        }
        ctrl.lineStyle.left = (ctrl.target/ctrl.complete * 100) + '%';
        break;
    }
    ctrl.widthStyle = {width:ctrl.width};
    ctrl.barStyle.width = ctrl.barWidth;
  
  },
  templateUrl:'templates/componentDiv/schedule.html'
});
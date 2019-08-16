'use strict';
angular.module('myApp')
  .directive('myChart', function(){
   
    return {
      restrict: 'EA',
      scope: {     
          config:'=config',
          data: '=data'
      },
      controller: function($scope, $element, $attrs) {
        var $div = angular.element('<div></div>');
        $element.append($div);
        function setSize(){
          var width = $scope.data.width || parseInt($attrs.width) || 620;
          var height = $scope.data.height || parseInt($attrs.height) || 240;
          $div[0].style.width = width + 'px';
          $div[0].style.height = height + 'px';
        }
        setSize();
        var myChart = this.myChart = echarts.init($div[0]);
        myChart.setOption($scope.data);
       
      },
      require: 'myChart', // Array = multiple requires, ? = optional, ^ = check parent elements
      // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      // templateUrl: '',
      // replace: true,
      transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
        
        $scope.$watch('data.series', function (value) {
            if (value) {
                controller.myChart.setOption($scope.data);
                console.log($scope.data.series);
            }
        },true);
      }
    };
  });
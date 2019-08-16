'use strict';
angular.module('starter')
    .directive('numFormat',function() {
        return {
            scope:{
                model : '=ngModel'
            },
            require: 'ngModel',
            restrict: 'AE',
            link: function(scope, elm, attrs, ctrl) {

                function format(){
                    var modelVlaue = elm.val();
                    modelVlaue = modelVlaue.toString();
                    if(isNaN(scope.model) || scope.model ==""){
                        scope.model =0;
                    }else{
                        //最多保留两位小数
                        var f = parseFloat(scope.model);
                        f = Math.round(scope.model*100)/100;
                        var s = f.toString();
                        var rs = s.indexOf('.');
                        if(rs < 0){
                            s = s +".00";
                        }else{
                            while(s.length <= rs + 2){s += '0';}
                        }
                        if(parseFloat(s)<10000000000){
                            scope.model = parseFloat(s);
                        }else{
                            scope.model = parseFloat(s.substring(0,10));
                        }
                        if(modelVlaue.substring(0,1)=='0'&&!modelVlaue.substring(0,2)=='0.'){
                            elm.val(parseFloat(s))
                        }
                        scope.$apply(function() {
                        });
                    }
                }
                //绑定事件
                elm.on("keyup",format);
            }
        };
    });
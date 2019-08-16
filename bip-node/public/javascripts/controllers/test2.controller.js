'use strict';
angular.module('myApp')
    .controller('testController2',['$rootScope','$scope','userListService','$state',
        function($rootScope,$scope,userListService,$state){

            //查询目录展开更多的按钮
            $("#morebtn").click(function(){
                $("#searchDivTr2").toggle();
            });
            //保单明细，跟踪记录 悬浮按钮
            $('.lasttd').mouseenter(function(){
                $(this).children(".rowButtons").stop(true).animate({right:'-10px'},500);
            });
            $('.lasttd').mouseleave(function(){
                $(this).children(".rowButtons").stop(true).animate({right:'-170px'},100);
            });

            //弹框
            $("#daisp").click(function(){
                $("#scmMaskWindow").show();
            });
            //关闭弹框
            $("#closeBtn").click(function(){
                $("#scmMaskWindow").hide();
            });


            //时间控件
            $scope.startTime;
            $scope.endTime;
            $('#starttime').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on('changeDate',function(ev){
                $scope.startTime = ev.date.valueOf();
                if($scope.end<$scope.startTime){
                    alert("“结束时间 ”不能早于“开始时间 ” ！");
                }
            });
            $('#endtime').datepicker({
                format: 'yyyy-mm-dd',
                weekStart: 1,
                autoclose: true,
                todayBtn: 'linked',
                language: 'zh-CN'
            }).on('changeDate',function(ev){
                $scope.endTime = ev.date.valueOf();
                if($scope.endTime<$scope.startTime){
                    alert("“结束时间 ”不能早于“开始时间 ” ！");
                }
            });
        }

    ]);

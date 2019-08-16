angular.module('starter')
  .controller('ReportZHXBController',
    ['$scope','$state','$timeout','$ionicHistory','$ionicPopup','pubHelper','$filter','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','reportService',
    function($scope,$state,$timeout,$ionicHistory,$ionicPopup,pubHelper,$filter,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,reportService) {
      var ctrl = this;
      ctrl.stateChange = stateChange;
      ctrl.goBack = goBack;
      ctrl.user = $localStorage.loginMsg;// 获取人员信息
      ctrl.storeId = ctrl.user.store.storeId;
      ctrl.monthZhxbsCount = monthZhxbsCount;
      ctrl.SearchReportTime = SearchReportTime;
      // 回退
      function goBack(){
        $ionicHistory.goBack();
      }
      //路由跳转
      function stateChange(stateTo,params){
        $ionicViewSwitcher.nextDirection('forward');
        $state.go(stateTo,params);
      }
      //获取报表的查询日期列表
      function SearchReportTime(){
        var tableName = 'bf_bip_report_month_kpi_cover_type_ddcd';
        var condition = {tableName:tableName,storeId:ctrl.storeId};
        reportService.findReportSearchTime(condition).then(function(result){
          if (result.status == 'OK') {
            ctrl.selectTimes = result.results.content.results;
          }else{
            pubHelper.alert(false,result.results.message);
          }
        })
      };
      ctrl.SearchReportTime();
      //初始时间
      ctrl.report = {};
      ctrl.report.mouthDate = $filter('date')(new Date(),'yyyy-MM');
      //月报-综合续保数
      function monthZhxbsCount(){
        var time = ctrl.report.mouthDate;
        var storeId = ctrl.storeId;
        var param = {time:time,storeId:storeId};
        reportService.findCountAppMonthZhxbs(param).then(function(result){
          if (result.status == 'OK') {
            ctrl.zhxbsCount = result.results.content.results;
            ctrl.numBykcxbs = ctrl.zhxbsCount.scBykcxbs+ctrl.zhxbsCount.qzxBykcxbs+ctrl.zhxbsCount.jzxBykcxbs+
              ctrl.zhxbsCount.renewBykcxbs+ctrl.zhxbsCount.newBykcxbs;
            ctrl.numZhxbs = ctrl.zhxbsCount.scZhxbs+ctrl.zhxbsCount.qzxZhxbs+ctrl.zhxbsCount.jzxZhxbs+
              ctrl.zhxbsCount.renewZhxbs+ctrl.zhxbsCount.newZhxbs;
            ctrl.numBytqxbs = ctrl.zhxbsCount.scBytqxbs+ctrl.zhxbsCount.qzxBytqxbs+ctrl.zhxbsCount.jzxBytqxbs+
              ctrl.zhxbsCount.renewBytqxbs+ctrl.zhxbsCount.newBytqxbs;
            option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['本月可出续保数','综合续保数','本月提前续保数'],
                show:false
              },
              grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                top:'0',
                containLabel: true
              },
              xAxis : [
                {
                  type : 'value'
                }
              ],
              yAxis: {
                type: 'category',
                data:  ['首次','潜转续','间转续','续转续','新转续'],
              },
              series: [
                {
                  name: '本月可出续保数',
                  type: 'bar',
                  data:  [ctrl.zhxbsCount.scBykcxbs,ctrl.zhxbsCount.qzxBykcxbs,ctrl.zhxbsCount.jzxBykcxbs,
                    ctrl.zhxbsCount.renewBykcxbs,ctrl.zhxbsCount.newBykcxbs],
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#e400fa'
                    }
                  },
                },
                {
                  name: '综合续保数',
                  type: 'bar',
                  data: [ctrl.zhxbsCount.scZhxbs,ctrl.zhxbsCount.qzxZhxbs,ctrl.zhxbsCount.jzxZhxbs,
                        ctrl.zhxbsCount.renewZhxbs,ctrl.zhxbsCount.newZhxbs],
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#0099ff'
                    }
                  },
                },
                {
                   name: '本月提前续保数',
                  type: 'bar',
                  data:  [ctrl.zhxbsCount.scBytqxbs,ctrl.zhxbsCount.qzxBytqxbs,ctrl.zhxbsCount.jzxBytqxbs,
                        ctrl.zhxbsCount.renewBytqxbs,ctrl.zhxbsCount.newBytqxbs],
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#ffed24'
                    }
                  },
                },
              ]
            };
            var worldMapContainer = document.getElementById('zhxbsRoport');
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            $scope.resizeWorldMapContainer = function () {
              worldMapContainer.style.width = window.innerWidth+'px';
              worldMapContainer.style.height = 400+'px';
            };
            $scope.resizeWorldMapContainer();
            var myChart = echarts.init(worldMapContainer);
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.onresize = function () {
              //重置容器高宽
              $scope.resizeWorldMapContainer();
              myChart.resize();
            };
          }else{

          };
        });
      }
  }])


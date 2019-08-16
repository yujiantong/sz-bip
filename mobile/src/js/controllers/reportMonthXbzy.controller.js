angular.module('starter')
  .controller('ReportXbzyController',
    ['$scope','$state','$timeout','$ionicHistory','$filter','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','reportService',
    function($scope,$state,$timeout,$ionicHistory,$filter,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,reportService) {
      var ctrl = this;
      ctrl.stateChange = stateChange;
      ctrl.user = $localStorage.loginMsg;// 获取人员信息
      ctrl.storeId = ctrl.user.store.storeId;
      ctrl.monthKpiXbzy = monthKpiXbzy;
      ctrl.SearchReportTime = SearchReportTime;
      //路由跳转
      function stateChange(stateTo,params){
        $ionicViewSwitcher.nextDirection('forward');
        $state.go(stateTo,params);
      }
      //获取报表的查询日期列表
      function SearchReportTime(){
        var tableName = 'bf_bip_report_month_kpi_xbzy';
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
      //保险KPI月报-分续保专员
      function monthKpiXbzy(){
        var time = ctrl.report.mouthDate;
        var storeId = ctrl.storeId;
        var param = {time:time,storeId:storeId};
        reportService.findCountMonthKpiXbzy(param).then(function(result){
          if (result.status == 'OK') {
            ctrl.xbzyReport = result.results.content.results;
            ctrl.traceCountArr = [];  //跟踪人数
            ctrl.inviteCountArr = []; //邀约人数
            ctrl.comeStoreCountArr = []; //邀约到店人数
            ctrl.xbcsArr = [];             //续保车数
            ctrl.userNameArr = [];             //续保专员
            for (i=1;i<ctrl.xbzyReport.length;i++){
              ctrl.traceCountArr.push(ctrl.xbzyReport[i].traceCount);
              ctrl.inviteCountArr.push(ctrl.xbzyReport[i].inviteCount);
              ctrl.comeStoreCountArr.push(ctrl.xbzyReport[i].comeStoreCount);
              ctrl.xbcsArr.push(ctrl.xbzyReport[i].xbcs);
              ctrl.userNameArr.push(ctrl.xbzyReport[i].userName);
            }
            option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['跟踪人数','邀约人数','邀约到店人数','续保车数'],
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
                data:  ctrl.userNameArr,
              },
              series: [
                {
                  name: '跟踪人数',
                  type: 'bar',
                  data: ctrl.traceCountArr,
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
                  name: '邀约人数',
                  type: 'bar',
                  data: ctrl.inviteCountArr,
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
                  name: '邀约到店人数',
                  type: 'bar',
                  data: ctrl.comeStoreCountArr,
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
                {
                  name: '续保车数',
                  type: 'bar',
                  data: ctrl.xbcsArr,
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#00d067'
                    }
                  },
                }
              ]
            };
            var worldMapContainer = document.getElementById('chart');
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            $scope.resizeWorldMapContainer = function () {
              worldMapContainer.style.width = window.innerWidth+'px';
              worldMapContainer.style.height = (ctrl.xbzyReport.length-1)*100+'px';
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


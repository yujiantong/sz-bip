angular.module('starter')
  .controller('ReportCdyController',
    ['$scope','$state','$timeout','$ionicHistory','$filter','$ionicNavBarDelegate','$localStorage','$ionicViewSwitcher','$stateParams','reportService',
    function($scope,$state,$timeout,$ionicHistory,$filter,$ionicNavBarDelegate,$localStorage,$ionicViewSwitcher,$stateParams,reportService) {
      var ctrl = this;
      ctrl.stateChange = stateChange;
      ctrl.user = $localStorage.loginMsg;// 获取人员信息
      ctrl.storeId = ctrl.user.store.storeId;
      ctrl.monthKpiCdy = monthKpiCdy;
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
      //保险KPI月报-分出单员
      function monthKpiCdy(){
        var time =  ctrl.report.mouthDate;
        var storeId = ctrl.storeId;
        var param = {time:time,storeId:storeId};
        reportService.findCountMonthKpiCdy(param).then(function(result){
          if (result.status == 'OK') {
            ctrl.cdyReport = result.results.content.results;
            ctrl.jdrsCountArr = [];  //接待人数
            ctrl.xbcsArr = []; //续保车数
            ctrl.cdsCountArr = []; //出单数（单）
            ctrl.syxcdsArr = [];             //商业险出单数
            ctrl.bfhjArr = [];             //保费合计
            ctrl.syxbfhjArr = [];             //商业险保费合计
            ctrl.syxdjbfArr = [];             //商业险单均保费
            ctrl.userNameArr = [];             //出单员
            for (i=1;i<ctrl.cdyReport.length;i++){
              ctrl.jdrsCountArr.push(ctrl.cdyReport[i].jdrs);
              ctrl.xbcsArr.push(ctrl.cdyReport[i].xbcs);
              ctrl.cdsCountArr.push(ctrl.cdyReport[i].cds);
              ctrl.syxcdsArr.push(ctrl.cdyReport[i].syxcds);
              ctrl.bfhjArr.push(ctrl.cdyReport[i].bfhj);
              ctrl.syxbfhjArr.push(ctrl.cdyReport[i].syxbfhj);
              ctrl.syxdjbfArr.push(ctrl.cdyReport[i].syxdjbf);
              ctrl.userNameArr.push(ctrl.cdyReport[i].userName);
            }
            option1 = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['接待人数','续保车数','出单数','商业险出单数'],
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
                  name: '接待人数',
                  type: 'bar',
                  data: ctrl.jdrsCountArr,
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
                      color:'#0099ff'
                    }
                  },
                },
                {
                  name: '出单数',
                  type: 'bar',
                  data: ctrl.cdsCountArr,
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
                  name: '商业险出单数',
                  type: 'bar',
                  data: ctrl.syxcdsArr,
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
            option2 = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['签单保费','商业险签单保费','商业险单均保费'],
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
                  name: '签单保费',
                  type: 'bar',
                  data: ctrl.bfhjArr,
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#e42112'
                    }
                  },
                },
                {
                  name: '商业险签单保费',
                  type: 'bar',
                  data: ctrl.syxbfhjArr,
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#6b46e5'
                    }
                  },
                },
                {
                  name: '商业险单均保费',
                  type: 'bar',
                  data: ctrl.syxdjbfArr,
                  barWidth : 12,
                  label: {
                    normal: {
                      show: true,
                      position: 'right'
                    }
                  },
                  itemStyle: {
                    normal: {
                      color:'#e6b500'
                    }
                  },
                },
              ]
            };
            var worldMapContainer1 = document.getElementById('chartCdy1');
            var worldMapContainer2 = document.getElementById('chartCdy2');
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            $scope.resizeWorldMapContainer1 = function () {
              worldMapContainer1.style.width = window.innerWidth+'px';
              worldMapContainer1.style.height = (ctrl.cdyReport.length-1)*100+'px';
            };
            $scope.resizeWorldMapContainer2 = function () {
              worldMapContainer2.style.width = window.innerWidth+'px';
              worldMapContainer2.style.height = (ctrl.cdyReport.length-1)*80+'px';
            };
            $scope.resizeWorldMapContainer1();
            $scope.resizeWorldMapContainer2();
            var myChartCdy1 = echarts.init(worldMapContainer1);
            var myChartCdy2 = echarts.init(worldMapContainer2);
            // 使用刚指定的配置项和数据显示图表。
            myChartCdy1.setOption(option1);
            myChartCdy2.setOption(option2);
            window.onresize = function () {
              //重置容器高宽
              $scope.resizeWorldMapContainer1();
              myChartCdy1.resize();
              $scope.resizeWorldMapContainer2();
              myChartCdy2.resize();
            };
          }else{

          };
        });
      }

  }])


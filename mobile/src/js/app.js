// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',['ionic','ngStorage','ngMessages','ngAnimate','ngCordova'])

.run(function($ionicPlatform,$localStorage,$state,$rootScope,$location,$ionicHistory,$cordovaKeyboard,
              $ionicViewSwitcher,$cordovaStatusbar,pubHelper,$cordovaBadge,jPush) {
  $ionicPlatform.ready(function() {
    navigator.splashscreen && navigator.splashscreen.hide();
    var isWebView = ionic.Platform.isWebView();
    var isIPad = ionic.Platform.isIPad();
    var isIOS = ionic.Platform.isIOS();
    var isAndroid = ionic.Platform.isAndroid();
    var isWindowsPhone = ionic.Platform.isWindowsPhone();
    $localStorage.isAndroid = isAndroid || false;
    // console.log("isWebView:" + isWebView);
    // console.log("isIPad:" + isIPad);
    // console.log("isIOS:" + isIOS);
    // console.log("isAndroid:" + isAndroid);
    // console.log("isWindowsPhone:" + isWindowsPhone);

    if(isIOS || isIPad){
     // $cordovaStatusbar.style(1);
      /*if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }*/
      // $cordovaStatusbar.styleColor('black');
    }
    $localStorage.forceExits = false;
    $localStorage.session = $localStorage.session?$localStorage.session:{};
    //如果进行真实手机测试，需要使用下面这段，让运行环境处在终端。
     $localStorage.session.isApp =  isIPad ||  isIOS ||  isAndroid || isWindowsPhone;
    //$localStorage.session.isApp = true;
    if($localStorage.session.isApp){
      //appVersion.check();
    }
    if($localStorage.session.isApp){
      try {
        /*$cordovaBadge.hasPermission().then(function (yes) {

         // 有权限
         }, function (no) {
         //alert("无权限")
         // 无权限
         });
         $cordovaBadge.set(4).then(function () {
         // 有权限, 已设置.
         }, function (err) {
         //alert("无权限")
         // 无权限
         });*/
      }catch(err)
      {
        //alert('出错：'+ err)
      }
    }

    //极光推送
    if($localStorage.session.isApp||$localStorage.session.isIPad){
      try
      {
        $rootScope.message = "on load view success!";
        // 当设备就绪时
        var onDeviceReady = function () {
          $rootScope.message += "JPushPlugin:Device ready!";
          initiateUI();
        };
        //初始化jpush
        var initiateUI = function () {
          try {
            window.plugins.jPushPlugin.init();
            jPush.getRegistrationID();
            if (device.platform != "Android") {
              window.plugins.jPushPlugin.setDebugModeFromIos();
              window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
            } else {
              window.plugins.jPushPlugin.setDebugMode(true);
              //window.plugins.jPushPlugin.setStatisticsOpen(true);
            }
            $rootScope.message += '初始化成功! \r\n';
          } catch (exception) {
            console.log(exception);
          }
        }

        // 添加对回调函数的监听
        document.addEventListener("jpush.setTagsWithAlias", jPush.onTagsWithAlias, false);
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("jpush.openNotification", jPush.onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", jPush.onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", jPush.onReceiveMessage, false);
      }
      catch(err)
      {
        console.log('出错：'+ err)
      }

    }
    /* document.addEventListener('chcp_updateLoadFailed', function(d){
      console.log('chcp_updateLoadFailed');
       console.log(arguments);
      console.log(angular.toJson(d) )}, false);
     document.addEventListener('chcp_nothingToUpdate', function(d){
       console.log('chcp_nothingToUpdate');
       console.log(angular.toJson(d) )}, false);
     document.addEventListener('chcp_beforeInstall', function(d){
       console.log('chcp_beforeInstall');
       console.log(angular.toJson(d) )}, false);
      document.addEventListener('chcp_updateInstalled', function(d){
       console.log('chcp_updateInstalled');
       console.log(angular.toJson(d) )}, false);
     document.addEventListener('chcp_updateInstallFailed', function(d){
      console.log('chcp_updateInstallFailed');
      console.log(angular.toJson(d) )}, false);
     document.addEventListener('chcp_nothingToInstall', function(d){
       console.log('chcp_nothingToInstall');
      console.log(angular.toJson(d) )}, false);*/

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    window.addEventListener('native.keyboardshow', function(){
      document.body.classList.add('keyboard-open');
    });

    //物理返回按钮控制&双击退出应用
    $ionicPlatform.registerBackButtonAction(function(e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/homePage/myHomePage'
        || $location.path() == '/homePage/report'
        || $location.path() == '/homePage/personalCenter'
        || $location.path() == '/smsHomePage/smsPersonalCenter'
        || $location.path() == '/xbzyHomePage/xbzyMyHomePage'
        || $location.path() == '/login') {
        ionic.Platform.exitApp();
        e.preventDefault();
        return false;
      }else if ($ionicHistory.backView()) {
        if ($cordovaKeyboard.isVisible()) {
          $cordovaKeyboard.close();
        } else {
          $ionicViewSwitcher.nextDirection('back');
          $ionicHistory.goBack();
        }
      }
    }, 200);

    $rootScope.$on('forceExits', function(event, toState, toParams, fromState, fromParams){
      var forceExits = $localStorage.forceExits||false;
      if(forceExits&&toState.name != 'login'){
        event.preventDefault();
        $state.go("login")
      }

    })

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(['getPassword','getPassword'].indexOf(fromState.name) == -1){
        if(fromState.name == 'login'){
          if(['productIntroduction','getPassword','useHelp','contactUs','homePage.myHomePage','smsHomePage.smsMyHomePage','xbzyHomePage.xbzyMyHomePage','mgrHomePage.mgrMyHomePage'].indexOf(toState.name) == -1){
            // && ( $localStorage.loginMsg == null || $localStorage.loginMsg == '' || angular.equals($localStorage.loginMsg,{}) )
            event.preventDefault();
          }
        }else if(['homePage.myHomePage','homePage.report','homePage.personalCenter','smsHomePage.smsMyHomePage','xbzyHomePage.xbzyMyHomePage','mgrHomePage.mgrMyHomePage'].indexOf(fromState.name) != -1
         && toState.name == 'login'){
          if($localStorage.session && $localStorage.session.id){
            event.preventDefault();
          }
        }
      }

    })

  })

})

.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  $ionicConfigProvider.views.swipeBackEnabled(false);

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];


  $httpProvider.interceptors.push("httpInterceptor");
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  var userIsManager;

  $stateProvider
    .state('login', {
      url: '/login',
      cache:'false',
      templateUrl: 'templates/login/login.html',
      controller: 'LoginController',
      controllerAs: 'ctrl'
    })
    .state('homePage', {
      url: '/homePage',
      cache:'false',
      abstract: true,
      templateUrl: 'templates/homePage/homePage.html',
      controller: 'HomePageController',
      controllerAs:'ctrl'
    })
    .state('homePage.myHomePage', {
      url: '/myHomePage',
      cache:'false',
      views: {
        'myHomePage': {
          templateUrl: 'templates/homePage/myHomePage.html',
          controller: 'MyHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    .state('homePage.report', {
      url: '/report?ReportTabNO',
      cache:'false',
      views: {
        'report': {
          templateUrl: 'templates/homePage/report.html',
          controller: 'MyHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    .state('homePage.personalCenter', {
      url: '/personalCenter',
      cache:'false',
      views: {
        'personalCenter': {
          templateUrl: 'templates/homePage/personalCenter.html',
          controller: 'PersonalCenterController',
          controllerAs:'ctrl'
        }
      }
    })
    //服务经理、销售经理
    .state('mgrHomePage', {
      url: '/mgrHomePage',
      abstract: true,
      cache:'false',
      templateUrl: 'templates/homePage/mgrHomePage.html',
      controller: 'HomePageController',
      controllerAs:'ctrl'
    })
    .state('mgrHomePage.mgrMyHomePage', {
      url: '/mgrMyHomePage',
      cache:'false',
      views: {
        'myHomePage': {
          templateUrl: 'templates/homePage/mgrMyHomePage.html',
          controller: 'xbzyHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    .state('mgrHomePage.personalCenter', {
      url: '/personalCenter',
      cache:'false',
      views: {
        'personalCenter': {
          templateUrl: 'templates/homePage/personalCenter.html',
          controller: 'PersonalCenterController',
          controllerAs:'ctrl'
        }
      }
    })
    //续保专员
    .state('xbzyHomePage', {
      url: '/xbzyHomePage',
      abstract: true,
      cache:'false',
      templateUrl: 'templates/homePage/xbzyHomePage.html',
      controller: 'xbzyHomePageController',
      controllerAs:'ctrl'
    })
    .state('xbzyHomePage.xbzyMyHomePage', {
      url: '/xbzyMyHomePage',
      cache:'false',
      views: {
        'myHomePage': {
          templateUrl: 'templates/homePage/xbzyMyHomePage.html',
          controller: 'xbzyHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    .state('xbzyHomePage.personalCenter', {
      url: '/personalCenter',
      cache:'false',
      views: {
        'personalCenter': {
          templateUrl: 'templates/homePage/personalCenter.html',
          controller: 'PersonalCenterController',
          controllerAs:'ctrl'
        }
      }
    })
    //已跟踪
    .state('trackedWorkerList', {
      url: '/trackedWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/trackedWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('trackedCustomerList', {
      url: '/trackedCustomerList?userId&userName&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/trackedCustomerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('trackedCustomerDetails', {
      url: '/trackedCustomerDetails?userId&userName&customerId&returnStatu&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/trackedCustomerDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('trackedCustomerRecord', {
      url: '/trackedCustomerRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/trackedCustomerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    .state('deleteInviteYgz', {
      url: '/deleteInviteYgz?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/deleteInviteYgz.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    .state('inviteDetailsYgz', {
      url: '/inviteDetailsYgz?userId&userName&customerId&customerTraceId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/tracked/inviteDetailsYgz.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    //续保专员邀约
    .state('inviteXbzyList', {
      url: '/inviteXbzyList?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/inviteXbzy/inviteXbzyList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('inviteXbzyDetails', {
      url: '/inviteXbzyDetails?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/inviteXbzy/inviteXbzyDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('inviteXbzyRecord', {
      url: '/inviteXbzyRecord?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/inviteXbzy/inviteXbzyRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    .state('deleteInviteYy', {
      url: '/deleteInviteYy?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/inviteXbzy/deleteInviteYy.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    .state('inviteDetailsYy', {
      url: '/inviteDetailsYy?userId&userName&customerId&customerTraceId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/inviteXbzy/inviteDetailsYy.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    //续保专员已激活
    .state('activationList', {
      url: '/activationList?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/activation/activationList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('activationDetails', {
      url: '/activationDetails?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/activation/activationDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('activationRecord', {
      url: '/activationRecord?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/activation/activationRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //续保专员待审批
    .state('approvalList', {
      url: '/approvalList?userId&userName&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/approval/approvalList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('approvalDetails', {
      url: '/approvalDetails?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/approval/approvalDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('approvalRecord', {
      url: '/approvalRecord?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/approval/approvalRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //续保专员查询潜客
    .state('searchList', {
      url: '/searchList?userId&userName&cxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/search/searchList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('searchDetails', {
      url: '/searchDetails?userId&userName&customerId&cxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/search/searchDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('searchRecord', {
      url: '/searchRecord?userId&userName&customerId&contact&cxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/search/searchRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    .state('deleteInviteCx', {
      url: '/deleteInviteCx?userId&userName&customerId&cxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/search/deleteInviteCx.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    .state('inviteDetailsCx', {
      url: '/inviteDetailsCx?userId&userName&customerId&customerTraceId&cxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/search/inviteDetailsCx.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    //跟踪完成
    .state('trackCompletionWorkerList', {
      url: '/trackCompletionWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/trackCompletion/trackCompletionWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('trackCompletionList', {
      url: '/trackedCustomerList?userId&userName&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/trackCompletion/trackCompletionList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('trackCompletionDetails', {
      url: '/trackedCustomerDetails?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/trackCompletion/trackCompletionDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('trackCompletionRecord', {
      url: '/trackedCustomerRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/trackCompletion/trackCompletionRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //发送短信角色
    .state('smsHomePage', {
      url: '/smsHomePage',
      abstract: true,
      templateUrl: 'templates/homePage/smsHomePage.html',
      controller: 'smsHomePageController',
      controllerAs:'ctrl'
    })
    .state('smsHomePage.smsMyHomePage', {
      url: '/smsMyHomePage',
      cache:'false',
      views: {
        'myHomePage': {
          templateUrl: 'templates/homePage/smsMyHomePage.html',
          controller: 'smsHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    .state('smsHomePage.smsPersonalCenter', {
      url: '/smsPersonalCenter',
      cache:'false',
      views: {
        'personalCenter': {
          templateUrl: 'templates/homePage/smsPersonalCenter.html',
          controller: 'smsHomePageController',
          controllerAs:'ctrl'
        }
      }
    })
    //待回退
    .state('approvalHt', {
      url: '/approvalHt',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/rollback/approvalHt.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })

    .state('customerList', {
      url: '/customerList?userId&userName&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/rollback/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('customerDetailsHt', {
      url: '/customerDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/rollback/customerDetails.html',
      controller: 'CustomerDetailsHTController',
      controllerAs:'ctrl'
    })
    .state('customerRecord', {
      url: '/customerRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/rollback/customerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //睡眠待审批
    .state('sleepApproval', {
      url: '/sleepApproval',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/sleepApproval/sleepApproval.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('sleepList', {
      url: '/sleepList?userId&userName&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/sleepApproval/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('sleepDetails', {
      url: '/sleepDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/sleepApproval/customerDetails.html',
      controller: 'CustomerDetailsHTController',
      controllerAs:'ctrl'
    })
    .state('sleepRecord', {
      url: '/sleepRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/sleepApproval/customerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //失销待审批
    .state('lostApproval', {
      url: '/lostApproval',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lostApproval/lostApproval.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('lostList', {
      url: '/lostList?userId&userName&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lostApproval/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('lostDetails', {
      url: '/lostDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lostApproval/customerDetails.html',
      controller: 'CustomerDetailsHTController',
      controllerAs:'ctrl'
    })
    .state('lostRecord', {
      url: '/lostRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lostApproval/customerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //销售战败线索
    .state('defeatWorkerList', {
      url: '/defeatWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/defeatCustomer/defeatCustomer.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('defeatList', {
      url: '/defeatList?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/defeatCustomer/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('defeatDetails', {
      url: '/defeatDetails?userId&userName&customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/defeatCustomer/customerDetails.html',
      controller: 'CustomerDetailsHTController',
      controllerAs:'ctrl'
    })
    .state('newCustomer', {
      url: '/newCustomer?userId&userName&customerId&contact&contactWay',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/defeatCustomer/addNewCustomer.html',
      controller: 'CustomerAddController',
      controllerAs:'ctrl'
    })
    .state('management', {
      url: '/management',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/personal/management.html',
      controller: 'pesonalController',
      controllerAs:'ctrl'
    })
    .state('suggest', {
      url: '/suggest?userInfo',
      cache:'false',
      abstract: false,
      templateUrl: 'templates/personal/suggest.html',
      controller: 'pesonalController',
      controllerAs:'ctrl'
    })
    .state('service', {
      url: '/service',
      cache:'false',
      abstract: false,
      templateUrl: 'templates/personal/service.html',
      controller: 'pesonalController',
      controllerAs:'ctrl'
    })
    .state('changePassword', {
      url: '/changePassword?userId&userName',
      cache:'false',
      abstract: false,
      templateUrl: 'templates/personal/changePassword.html',
      controller: 'pesonalController',
      controllerAs:'ctrl'
    })

    //待延期
    .state('customerYqApproval', {
      url: '/customerYqApproval',
      abstract: false,
      templateUrl: 'templates/customer/delay/approvalYq.html',
      cache:'false',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('customerDyqList', {
      url: '/customerDyqList?userId&userName&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/delay/customerDyqList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
  .state('customerDyqDetails', {
      url: '/customerDyqDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/delay/customerDyqDetails.html',
      controller: 'CustomerDetailsYQController',
      controllerAs:'ctrl'
    })
    .state('customerDyqRecord', {
      url: '/customerDyqRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/delay/customerDyqRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //唤醒未分配
    .state('customerWakeList', {
      url: '/customerWakeList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/wakeup/customerWakeList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('customerWakeDetails', {
      url: '/customerWakeDetails?customerId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/wakeup/customerWakeDetails.html',
      controller: 'CustomerDetailsYQController',
      controllerAs:'ctrl'
    })
    .state('customerWakeRecord', {
      url: '/customerWakeRecord?customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/wakeup/customerWakeRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //未接收
    .state('receivedWorkerList', {
      url: '/receivedWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/received/receivedWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('receivedCustomerList', {
      url: '/receivedCustomerList?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/received/receivedCustomerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('receivedCustomerDetails', {
      url: '/receivedCustomerDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/received/receivedCustomerDetails.html',
      controller: 'CustomerDetailsHRHTController',
      controllerAs:'ctrl'
    })
    .state('receivedCustomerRecord', {
      url: '/receivedCustomerRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/received/receivedCustomerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //邀约
    .state('customerInviteWorkerList', {
      url: '/customerInviteWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/invite/customerInviteWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('customerInviteList', {
      url: '/customerInviteList?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/invite/customerInviteList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })

    //应跟踪
    .state('trackWorkerList', {
      url: '/trackWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/trackWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('trackCustomerList', {
      url: '/trackCustomerList?userId&userName&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/trackCustomerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('tracekCustomerDetails', {
      url: '/tracekCustomerDetails?userId&userName&customerId&returnStatu&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/trackCustomerDetails.html',
      controller: 'CustomerDetailsHRHTController',
      controllerAs:'ctrl'
    })
    .state('tracekCustomerRecord', {
      url: '/tracekCustomerRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/trackCustomerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    .state('deleteInvite', {
      url: '/deleteInvite?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/deleteInvite.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    .state('inviteDetails', {
      url: '/inviteDetails?userId&userName&customerId&customerTraceId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/track/inviteDetails.html',
      controller: 'InviteRecordController',
      controllerAs:'ctrl'
    })
    //到店未出单
    .state('comeStoreNoBill', {
      url: '/customerComeStoreNoBill',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/comeStoreNoBill/comeStoreNoBill.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('customerListDdwcd', {
      url: '/customerListDdwcd?userId&userName',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/comeStoreNoBill/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('csnbCustomerDetails', {
      url: '/csnbCustomerDetails?userId&userName&customerId&returnStatu',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/comeStoreNoBill/csnbCustomerDetails.html',
      controller: 'CustomerDetailsHRHTController',
      controllerAs:'ctrl'
    })
    .state('csnbCustomerRecord', {
      url: '/csnbCustomerRecord?userId&userName&customerId&contact',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/comeStoreNoBill/csnbCustomerRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //已脱保
    .state('lossInsuranceWorkerList', {
      url: '/lossInsuranceWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lossInsurance/lossInsuranceWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('lossInsuranceList', {
      url: '/lossInsuranceList?userId&userName&cusLostInsurStatu&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lossInsurance/lossInsuranceList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('lossInsuranceDetails', {
      url: '/lossInsuranceDetails?userId&userName&customerId&delayDate&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lossInsurance/lossInsuranceDetails.html',
      controller: 'CustomerDetailsTBController',
      controllerAs:'ctrl'
    })
    .state('lossInsuranceRecord', {
      url: '/lossInsuranceRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/lossInsurance/lossInsuranceRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //将脱保
    .state('willOut', {
      url: '/customerWillOut',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/willOut/willOut.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('customerListJtb', {
      url: '/customerListJtb?userId&userName&cusLostInsurStatu&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/willOut/customerList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('willOutCustomerDetails', {
      url: '/willOutCustomerDetails?userId&userName&customerId&delayDate&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/willOut/willOutCustomerDetails.html',
      controller: 'CustomerDetailsTBController',
      controllerAs:'ctrl'
    })
    .state('willOutRecord', {
      url: '/willOutRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/willOut/willOutRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })
    //今日创建保单
    .state('billList', {
      url: '/billList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/billTodayCreate/billList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('billDetails', {
      url: '/billDetails?insuranceBillId',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/billTodayCreate/billDetails.html',
      controller: 'billDetailsController',
      controllerAs:'ctrl'
    })
    //已回退
    .state('beenBackWorkerList', {
      url: '/beenBackWorkerList',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/beenBack/beenBackWorkerList.html',
      controller: 'WorkerController',
      controllerAs:'ctrl'
    })
    .state('beenBackList', {
      url: '/beenBackList?userId&userName&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/beenBack/beenBackList.html',
      controller: 'CustomerListController',
      controllerAs:'ctrl'
    })
    .state('beenBackDetails', {
      url: '/beenBackDetails?userId&userName&customerId&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/beenBack/beenBackDetails.html',
      controller: 'CustomerDetailsXBZYController',
      controllerAs:'ctrl'
    })
    .state('beenBackRecord', {
      url: '/beenBackRecord?userId&userName&customerId&contact&gzcxdata',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/customer/beenBack/beenBackRecord.html',
      controller: 'CustomerRecordController',
      controllerAs:'ctrl'
    })

    //报表.日报保险公司
    .state('dailyCompany', {
      url: '/dailyCompany',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/dailyCompany.html',
      controller: 'ReportController',
      controllerAs:'ctrl'
    })
    //报表.日报-分工作人员
    .state('dailyWorker', {
      url: '/dailyWorker',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/dailyWorker.html',
      controller: 'ReportRBYGController',
      controllerAs:'ctrl'
    })
    //月报-当期续保数
    .state('monthRenewal', {
      url: '/monthRenewal',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/monthRenewal.html',
      controller: 'ReportDQXBController',
      controllerAs:'ctrl'
    })
    //月报-综合续保数
    .state('monthZhxbs', {
      url: '/monthZhxbs',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/monthZhxbs.html',
      controller: 'ReportZHXBController',
      controllerAs:'ctrl'
    })
    //月报-分保险公司
    .state('monthCompany', {
      url: '/monthCompany',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/monthCompany.html',
      controller: 'ReportController',
      controllerAs:'ctrl'
    })
    //月报-续保专员
    .state('monthXbzy', {
      url: '/monthXbzy',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/monthXbzy.html',
      controller: 'ReportXbzyController',
      controllerAs:'ctrl'
    })
    //月报-出单员
    .state('monthCdy', {
      url: '/monthCdy',
      abstract: false,
      cache:'false',
      templateUrl: 'templates/report/monthCdy.html',
      controller: 'ReportCdyController',
      controllerAs:'ctrl'
    })
    .state('onlineService', {
      url: '/onlineService',
      cache:'false',
      templateUrl: 'templates/personal/onlineService.html',
      controller: 'CenterOnlineServiceController',
      controllerAs: 'ctrl'
    })
    //保险报价
    .state('insuranceQuotation', {
      url: '/insuranceQuotation?userId&userName&customerId&storeId&gzcxdata',
      cache:'false',
      templateUrl: 'templates/modal/insuranceQuotation.html',
      controller: 'BXQuotationController',
      controllerAs: 'ctrl'
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

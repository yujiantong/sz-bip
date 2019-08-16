angular.module('starter')
.factory("httpInterceptor", ['$localStorage','server','$rootScope',function($localStorage,server,$rootScope){
  return {
    request: function(config) {
    // config.url = "http://bofide.cn" + config.url;  //手机端就直接更改地址，不会有跨域的问题
    if(config.url.substr(0,9) != 'templates'){
       if(config.url.substr(0,6) == "/login"||config.url.substr(0,5) == "/api/" ||  config.url.substr(0,6) == "/json/"){
         config.url =  server.loginServer  + config.url;
       }
      /*if($localStorage.session.isApp){
        if(config.url.substr(0,6) == "/login"){
          config.url =  server.loginServer  + config.url;
        }else  if(config.url.substr(0,5) == "/api/" ||  config.url.substr(0,6) == "/json/" ){
          config.url =  server.appServer  + config.url;
        }
      }*/

      config.params = config.params || {};
      if(config.data==null){
        config.data = {};
      }
      if(config.method=="POST"){
        config.data.crlmryapp = 'app';
      }else if(config.method=="GET"){
        config.params.crlmryapp = 'app';
      }

      config.cookies = {};
      //config.params.r =  new Date().getTime();
      //config.headers["connect-sid"] = $localStorage.session.id;
    }

    return config;
   },
   response:function(resp){

     if(resp.data.status == 'out-of-date'){
       $localStorage.forceExits = true;
       $rootScope.$broadcast("forceExits", 'forceExits');
     }
      // if(angular.isObject(resp.data)){
      //   if(resp.status == 200){
      //     if(resp.data.success == false){
      //       console.log(resp.data);
      //       if(flag){
      //         return;
      //       }
      //       flag = true;
      //       $timeout(function(){
      //           flag = false;
      //       },30000)
      //       switch (resp.data.code){
      //         case 'Err_501':
      //         case 'Err_502':
      //         case 'Err_506':
      //         case 'Err_507':
      //         case 'Err_508':
      //         case 'Err_509':
      //           break;
      //       }
      //     }
      //   }
      // }
      return resp;
    }

 }
}]);

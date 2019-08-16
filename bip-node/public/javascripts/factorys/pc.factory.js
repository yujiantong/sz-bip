angular.module('myApp')
  .factory('testInterceptor', function($q){
   var interceptor = {
    'request':function(config){
      // $state.go('');
      // console.log(sessionStorage);
      sessionStorage.a = 'a';
      return config;
    },
    'response':function(resp){
      return resp;
    },
    'requestError':function(rejection){
      return $q.reject(rejection);
    },
    'responseError':function(rejection){
      return rejection
    }
   };
   return interceptor;
});
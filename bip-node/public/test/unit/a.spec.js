'use strict'

describe('myApp',function(){
  //模拟myApp angular 模块
  var scope,$rootScope,$controller,$httpBackend;
  beforeEach(angular.mock.module('myApp'));
  beforeEach(angular.mock.inject(function($rootScope,$controller,_$httpBackend_){
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', 'Users/users.json')
      .respond([{id: 1, name: 'Bob'}, {id:2, name: 'Jane'}]);
    scope = $rootScope.$new();

    $controller('PcController',{$scope:scope})
  }))
  it('test',function(){
    expect(scope.qweqwe).toEqual('123');
  })
  it('should fetch list of users', function(){
    $httpBackend.flush();
    expect(scope.users.length).toBe(2);
    expect(scope.users[0].name).toBe('Bob');
  });

})
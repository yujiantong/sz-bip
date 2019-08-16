'use strict';
angular.module('myApp')
    .service('importService', ['$http','$q','Upload' ,function($http,$q,Upload){

        this.upload = function (file,importCategory,isFugai) {
            var deferred = $q.defer();
            if(file != null){
                if(importCategory != '销售战败线索'){
                    Upload.upload({
                        url: '/import/importData',
                        data: {file: file,importCategory:importCategory,isFugai:isFugai}
                    }).then(function (response) {
                        //file.uniqueName = response.data.uniqueName;
                        deferred.resolve(response.data)
                    }, function (response) {
                        if (response.status > 0){
                            deferred.reject(response.status + ': ' + response.data);
                        }
                    }, function (evt) {
                        //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }else{
                    Upload.upload({
                        url: '/import/importDefeat',
                        data: {file: file}
                    }).then(function (response) {
                        //file.uniqueName = response.data.uniqueName;
                        deferred.resolve(response.data)
                    }, function (response) {
                        if (response.status > 0){
                            deferred.reject(response.status + ': ' + response.data);
                        }
                    }, function (evt) {
                        //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
                }
            }else{
                deferred.resolve({results:{message:"导入文件不能超过5M"}});
            }

            return deferred.promise;
        };

        this.sleepBatch = function (file) {
            var deferred = $q.defer();
            if(file != null){
                Upload.upload({
                    url: '/import/sleepBatch',
                    data: {file: file}
                }).then(function (response) {
                    //file.uniqueName = response.data.uniqueName;
                    deferred.resolve(response.data)
                }, function (response) {
                    if (response.status > 0){
                        deferred.reject(response.status + ': ' + response.data);
                    }
                }, function (evt) {
                    //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }else{
                deferred.resolve({results:{message:"导入文件不能超过5M"}});
            }

            return deferred.promise;
        };

        this.importDefeat = function (file) {
            var deferred = $q.defer();
            if(file != null){
                Upload.upload({
                    url: '/import/importDefeat',
                    data: {file: file}
                }).then(function (response) {
                    //file.uniqueName = response.data.uniqueName;
                    deferred.resolve(response.data)
                }, function (response) {
                    if (response.status > 0){
                        deferred.reject(response.status + ': ' + response.data);
                    }
                }, function (evt) {
                    //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }else{
                deferred.resolve({results:{message:"导入文件不能超过5M"}});
            }

            return deferred.promise;
        };

        //服务经理推送修导入
        this.tsxImport = function (file,importCategory,insuranceCompName) {
            var deferred = $q.defer();
            if(file != null){
                Upload.upload({
                    url: '/import/tsxImport',
                    data: {file: file,importCategory:importCategory,insuranceCompName:insuranceCompName}
                }).then(function (response) {
                    //file.uniqueName = response.data.uniqueName;
                    deferred.resolve(response.data)
                }, function (response) {
                    if (response.status > 0){
                        deferred.reject(response.status + ': ' + response.data);
                    }
                }, function (evt) {
                    //file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }else{
                deferred.resolve({results:{message:"导入文件不能超过5M"}});
            }

            return deferred.promise;
        };

    }]);
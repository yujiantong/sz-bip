// Karma configuration
// Generated on Wed Apr 13 2016 16:06:13 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',


    plugins: ['karma-*'],
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    // bower:js
      'public/components/angular/angular.js',
      'public/components/jquery/dist/jquery.js',
      'public/components/angular-ui-router/release/angular-ui-router.js',
      'public/components/echarts/dist/echarts.js',
      'public/components/echarts/map/js/world.js',
      'public/components/echarts/map/js/china.js',
      'public/components/angular-animate/angular-animate.js',
      'public/components/angular-ui-grid/ui-grid.js',
      'public/components/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/components/spin.js/spin.js',
      'public/components/ladda/dist/ladda.min.js',
      'public/components/bootstrap/dist/js/bootstrap.min.js',
      'public/components/jquery-confirm2/dist/jquery-confirm.min.js',
      'public/components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
      'public/components/angular-mocks/angular-mocks.js',
      // endbower
      'public/javascripts/app.js',
      'public/javascripts/**/*.js',
      'public/test/unit/*.js'
    ],


    // list of files to exclude
    exclude: ['karma.conf.js'],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // browsers: ['Chrome', 'Firefox','Opera','IE','Safari'],
    browsers: ['Chrome', 'Firefox','IE','Safari'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

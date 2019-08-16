var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var flatten = require('gulp-flatten');
var templatecache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');

var wiredep = require('wiredep').stream;
var includeSource = require('gulp-include-source');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revAll = require('gulp-rev-all');
var gls = require('gulp-live-server');

var revCollector = require('gulp-rev-collector'); 
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');

var sass = require('gulp-ruby-sass');

gulp.task('rimfar',function(){
  return gulp.src(['public/dist','public/.tmp/**','./rev-manifest.json','!public/.tmp'], { read: false }) // much faster
    .pipe(rimraf());
});

gulp.task('importJsFile',["rimfar"],function(){
  return gulp.src('./public/indexFrame.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe( includeSource() )
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./public/'))
    
    .pipe(gulp.dest('./public/.tmp'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true,
    port:9000,
    middleware:function(connect){
        var httpProxy = require('http-proxy');
        var proxy = httpProxy.createProxyServer();
        var middlewares = [];
        middlewares.push(
            connect.static('public/.tmp', {index: 'index.html'})
        )
        return middlewares;
    }
  });
});

gulp.task('watch',['importJsFile'],function(){
    gulp.watch(['public/javascripts/**/**.js','public/styles/**.css','public/views/**/**.html'], function(){
        gulp.src('./public/.tmp')
        .pipe(connect.reload());
    });
});

gulp.task('copyimg', function () {
  return gulp.src('public/images/**')
    .pipe(flatten())
    .pipe(gulp.dest('public/dist/img'));
});

gulp.task('templatecache',['importJsFile'],function(){
  return gulp.src(['public/views/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templatecache('templatecache.js',{module:'myApp',root:'views'}))
    .pipe(gulp.dest('./public/.tmp/scripts'));
});

gulp.task('useref',['templatecache'],function(){
  return gulp.src('public/.tmp/index.html')
    .pipe(useref({ searchPath: 'public' }))
    .pipe(gulp.dest('public/.tmp'));
});

gulp.task('concatjs',['useref'],function(){
  return gulp.src(['public/.tmp/scripts/scripts.js','public/.tmp/scripts/templatecache.js'])
    .pipe(concat('scripts.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('public/.tmp/scripts'));
});

gulp.task('autoprefixer',['concatjs'], function () {
  return gulp.src('public/.tmp/styles/main.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/.tmp/styles/'));
});

gulp.task('uglify',['autoprefixer'],function(){
  return gulp.src(['public/.tmp/scripts/scripts.js'])
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('public/dist/scripts/'))
    .pipe(rev.manifest({base:'public/dist/rev/',merge:true}))
    .pipe(gulp.dest('public/dist/rev/'));
});

gulp.task('copyMinjs',['uglify'],function(){
  return gulp.src(['public/.tmp/vendors/*.js'])
    .pipe(gulp.dest('public/dist/vendors/'));
});

gulp.task('cssnano',['copyMinjs'], function () {
  return gulp.src(['public/.tmp/styles/main.css','public/.tmp/styles/vendor.css'])
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('public/dist/styles/'))
    .pipe(rev.manifest({base:'public/dist/rev/',merge:true}))
    .pipe(gulp.dest('public/dist/rev/'));
});

gulp.task('revAll',['cssnano'], function () {
  return gulp.src(['public/.tmp/styles/main.css','public/.tmp/styles/vendor.css'])
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest('public/dist/styles/'))
    .pipe(rev.manifest({base:'public/dist/rev/',merge:true}))
    .pipe(gulp.dest('public/dist/rev/'));
});

gulp.task('rev',['cssnano'], function() {
  gulp.src(['rev-manifest.json', 'public/.tmp/index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector())                                   //- 执行文件内css名的替换
    .pipe(gulp.dest('public/dist'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public/dist'));                    //- 替换后的文件输出的目录
});

gulp.task('copyfonts',['rev'], function () {
  return gulp.src('public/fonts/**')
  .pipe(gulp.dest('public/.tmp/fonts'))
    .pipe(gulp.dest('public/dist/fonts'));
});

gulp.task('default',['watch'], function(){
    gulp.start('connect');
});

gulp.task('build', function(){
    gulp.start('copyfonts');
});

//////////////////
gulp.task('uglifytest',function(){
  return gulp.src(['public/components/spin.js/spin.js'])
    .pipe(uglify())
    .pipe(rename('spin.min.js'))
    .pipe(gulp.dest('public/components/spin.js'));
});

gulp.task('sass', function () {
  return sass('public/styles/pc.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('public/styles/'));
});
///////////////////////////////////////////

gulp.task('dev',['rimfar','importJsFile'],function(){
    gulp.src(['rev-manifest.json', 'public/.tmp/index.html'])

});

gulp.task('startServer', function(){
    var server = gls.new('./bin/www');
    server.start();
    gulp.watch(['app.js','routes/*.js'],function(){
        server.start();
    });

})
var gulp = require('gulp');
var gutil = require('gulp-util');
var rimraf = require('gulp-rimraf');
var includeSource = require('gulp-include-source');
var copy = require('gulp-copy');
var flatten = require('gulp-flatten');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templatecache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var wiredep = require('wiredep').stream;
var autoprefixer = require('gulp-autoprefixer');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var htmlmin = require('gulp-htmlmin');

//gulp build
gulp.task('build',['copyjson']);

gulp.task('rimfar',function(){
  return gulp.src(['www','.tmp'], { read: false }) // much faster
    .pipe(rimraf());
});
gulp.task('bower',['rimfar'], function () {
  gulp.src('src/indexFrame.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe( includeSource() )
    .pipe( rename('index.html') )
    .pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('src'));
});
gulp.task('copyimages',['bower'], function () {
  return gulp.src('src/images/**')
    .pipe(flatten())
    .pipe(gulp.dest('www/images'));
});
gulp.task('copyimg',['copyimages'], function () {
  return gulp.src('src/img/**')
    .pipe(flatten())
    .pipe(gulp.dest('www/img'));
});
gulp.task('templatecache',['copyimg'],function(){
  return gulp.src(['src/templates/**/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templatecache('templatecache.js',{module:'starter',root:'templates'}))
    .pipe(gulp.dest('.tmp/js'));
});
gulp.task('useref',['templatecache'],function(){
  return gulp.src('src/index.html')
    .pipe(useref())
    .pipe(gulp.dest('.tmp'));
});
gulp.task('concatjs',['useref'],function(){
  return gulp.src(['.tmp/js/scripts.js','.tmp/js/templatecache.js'])
    .pipe(concat('scripts.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('.tmp/js'));
});
gulp.task('autoprefixer',['concatjs'], function () {
  return gulp.src('.tmp/styles/all.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('.tmp/css/'));
});

gulp.task('uglify',['autoprefixer'],function(){
  return gulp.src(['.tmp/js/*.js','!.tmp/js/templatecache.js'])
    .pipe(uglify())
    // .pipe(rev())
    .pipe(gulp.dest('www/js/'));
    // .pipe(rev.manifest({base:'www/rev/',merge:true}))
    // .pipe(gulp.dest('www/rev/'));
});
gulp.task('copyMinjs',['uglify'],function(){
  return gulp.src(['.tmp/vendors/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('www/vendors/'));
});
gulp.task('cssnano',['copyMinjs'], function () {
  return gulp.src(['.tmp/css/all.css','.tmp/css/vendor.css'])
    .pipe(cssnano())
    // .pipe(rev())
    .pipe(gulp.dest('www/css/'));
    // .pipe(rev.manifest({base:'www/rev/',merge:true}))
    // .pipe(gulp.dest('www/rev/'));
});
gulp.task('rev',['cssnano'], function() {
  gulp.src(['rev-manifest.json', '.tmp/index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(revCollector())                                   //- 执行文件内css名的替换
    .pipe(gulp.dest('www'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('www'));                    //- 替换后的文件输出的目录
});

gulp.task('copyhtml',['cssnano'], function () {
  return gulp.src('.tmp/index.html')
    .pipe(gulp.dest('www/'));
});

gulp.task('copyfont',['copyhtml'], function () {
  return gulp.src('src/lib/ionic/release/fonts/**')
    .pipe(flatten())
    .pipe(gulp.dest('www/fonts'));
});

gulp.task('copyjson',['copyfont'], function () {
  return gulp.src('src/json/*.json')
    .pipe(flatten())
    .pipe(gulp.dest('www/json'));
});

// gulp.task('copyhtml',['cssnano'], function () {
//   return gulp.src('.tmp/index.html')
//     .pipe(flatten())
//     .pipe(gulp.dest('www'));
// });

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['bower']);

gulp.task('sass', function() {
  return sass('./scss/ionic.app.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('./src/css/'))
    .pipe(cssnano({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

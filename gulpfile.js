var gulp = require('gulp');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');

gulp.task('sass', function(){
	return sass('./_static/sass/base.scss')
    .on('error', sass.logError)
    .pipe(rename('main.css'))
		.pipe(gulp.dest('./_site/css/'))
		.pipe(gulp.dest('./css/'));
});

gulp.task('jekyll', function (gulpCallBack){
    var spawn = require('child_process').spawn;
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});
    jekyll.on('exit', function(code) {
      gulpCallBack(
        code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code
        );
    });
});

gulp.task('server', function(){
  connect.server({
    debug: true,
    root: '_site',
    port: 5000,
    livereload: true,
  });
});

gulp.task('watch', function() {
    gulp.watch('./_static/sass/**/*.scss', ['sass']);
    gulp.watch([ 
      './_data/*.yml', 
      './index.html', 
      './portfolio/**/*.html', 
      './projects/**/*.html', 
      './_layouts/**/*.html', 
      './_includes/**/*.html', 
     ], ['jekyll']);
    watch([
      './_site/**/*.html',
      './_site/**/*.css',
                 ]).pipe(connect.reload());
});

gulp.task('build', ['sass', 'jekyll']);
gulp.task('default', ['build', 'server', 'watch']);




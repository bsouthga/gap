import gulp         from 'gulp';
import babelify     from 'babelify';
import browserify   from 'browserify';
import watchify     from 'watchify';
import gutil        from 'gulp-util';
import source       from 'vinyl-source-stream';
import gulpif       from 'gulp-if';
import livereload   from 'gulp-livereload';
import uglify       from 'gulp-uglify';
import buffer       from 'vinyl-buffer';


const files = {
  src: './app/app.js',
  bundle: 'bundle.js',
  dist: './dist/'
};


gulp.task('browserify', () => bundle());
gulp.task('deploy', () => bundle({ production: true }));
gulp.task('watch', () => bundle({ watching: true }));


function bundle({ watching, production }={}) {
  const bundlerFactory =  !watching  ?
                          browserify :
                          opts => watchify(browserify(opts));

  const bundleOpts = {
    cache: {},
    packageCache: {},
    entries : [ files.src ],
    debug: !production
  };

  const bundler = bundlerFactory(bundleOpts)
    .transform(babelify)
    .on('log', gutil.log);

  function rebundle() {

    const b = bundler.bundle()
        .pipe(source(files.bundle))
        .pipe(gulpif(production, buffer()))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest(files.dist))
        .pipe(gulpif(watching, livereload()));

    // return for merging
    return b;
  }

  // watchify watch step
  if (watching) {
    bundler.on('update', rebundle);
  }

  // return for merging streams
  return rebundle();
}

import gulp from 'gulp';
// import dotenv from 'dotenv';
// import coverage from 'gulp-coverage';
// import nodemon from 'gulp-nodemon';
import jasmineNode from 'gulp-jasmine-node';
import istanbulReport from 'gulp-istanbul-report';
import coveralls from 'gulp-coveralls';
import babel from 'gulp-babel';
import istanbul from 'gulp-babel-istanbul';
import injectModules from 'gulp-inject-modules';

// Run app server
/* gulp.task('serve', () =>
  nodemon({
    script: 'index.js',
    ext: 'js html',
    env: { NODE_ENV: process.env.NODE_ENV }
  })
);*/

gulp.task('transpile', () => {
  return gulp.src('src/inverted-index.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist/'));
});

// Generate coverage report
gulp.task('test', () => {
  gulp.src('./coverage/coverage.json')
    .pipe(istanbulReport());
});

// Run tests
gulp.task('run-test', ['transpile'], () => {
  gulp.src(['tests/inverted-index-tests.spec.js'])
    .pipe(jasmineNode());
});

// Generate coverage report
gulp.task('coverage', (cb) => {
  gulp.src('src/inverted-index.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('tests/inverted-index-test.spec.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmineNode())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
      .on('end', cb);
    });
});

// Load code coverage to coveralls
gulp.task('coveralls', ['test'], () => {
  // If not running on CI environment it won't send lcov.info to coveralls
  if (!process.env.CI) {
    return;
  }

  return gulp.src('coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['run-test', 'coveralls', 'coverage']);


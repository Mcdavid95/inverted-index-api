import gulp from 'gulp';

import istanbul from 'gulp-istanbul-report';

import babel from 'gulp-babel';

import jasmine from 'gulp-jasmine-node';

import gls from 'gulp-live-server';

import gulpCoveralls from 'gulp-coveralls';


gulp.task('default', () => {
  return gulp.src('src/app.js')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

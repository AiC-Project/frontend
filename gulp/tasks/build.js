const gulp = require('gulp');

gulp.task('build', ['browserify', 'copy', 'less']);

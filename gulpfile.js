const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');

function compile() {
  return tsProject.src()
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(tsProject())
      .pipe(gulpif(isJavaScript, uglify()))
      .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
      .pipe(gulp.dest('dist'));
}

function watch(cb) {
  gulp.watch('src/**/*', {ignoreInitial: false}, compile);
  cb();
}

function isJavaScript(file) {
  // Check if file extension is '.js'
  return file.extname === '.js';
}

exports.compile = compile;
exports.watch = watch;
exports.default = compile;

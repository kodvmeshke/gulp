const { src, dest, watch, series, parallel } = require("gulp")
const sass = require("gulp-sass")(require('sass'))
const autoprefixer = require("gulp-autoprefixer")
const browserSync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const include = require('gulp-file-include')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')
const del = require('del')

function clean() {
  return del(['public/*']);
}

function html() {
  return src(['src/**/*.html', '!src/html-parts/**/*.html'])
  .pipe(include())
  .pipe(dest('public/'))
  .pipe(browserSync.stream())
}

function styles() {
  return src('src/scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(dest('public/css/'))
  .pipe(browserSync.stream())
}

function scripts() {
  return src('src/js/**/*.js')
  .pipe(dest('public/js/'))
  .pipe(browserSync.stream())
}

function images() {
  return src('src/image/*')
  .pipe(imagemin())
  .pipe(dest('public/image'))
  .pipe(browserSync.stream())
}

function fonts() {
  return src('src/fonts/**/*')
  .pipe(fonter({
    formats: ['ttf', 'woff', 'eot', 'svg']
  }))
  .pipe(ttf2woff2())
  .pipe(dest('public/fonts/'))
  .pipe(browserSync.stream())
}

function watcher() {
  browserSync.init({
    server: {
        baseDir: "./public"
    }
  });
  watch('public/*.html').on('change', browserSync.reload)
  watch('src/**/*.html', html)
  watch('src/scss/**/*.scss', styles)
  watch('src/js/**/*.js', scripts)
  watch('src/image/**/*', images)
  watch('src/fonts/**/*', fonts)
}

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.images = images
exports.fonts = fonts
exports.watcher = watcher

exports.default = series(clean, html, parallel(styles, scripts, images), fonts, watcher)
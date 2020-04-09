const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');

gulp.task('sprite', () => gulp.src('src/img/sprite-*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'))
);

gulp.task('style', () => gulp.src('src/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream())
);

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
  .pipe(server.stream())
);

gulp.task('copy', () => gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    '!src/img/**/sprite-*.svg',
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'))
);

gulp.task('clean', () => del('build'));

gulp.task('serve', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/sass/**/*.{scss,sass}', gulp.series('style'));
  gulp.watch('src/*.html', gulp.series('html'));
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'style',
  'sprite',
  'html'
));

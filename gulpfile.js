const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const del = require('del');
const htmlmin = require('gulp-htmlmin');

gulp.task('style', () => gulp.src('src/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream())
);

gulp.task('html', () => gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
  .pipe(server.stream())
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
  'style',
  'html'
));

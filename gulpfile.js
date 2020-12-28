const { src, dest, task, series, watch, parallel } = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
// const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const env = process.env.NODE_ENV;
const { SRC_PATH, DIR_PATH, STYLE_LIBS} = require('./gulpfile.config');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
 
sass.compiler = require('node-sass');
 
task('sass', () => {
  return src([...STYLE_LIBS, 'src/css/style.scss'])
    .pipe(gulpif(env==='dev', sourcemaps.init()))
    .pipe(concat('style.min.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    // .pipe(px2rem())
    .pipe(gulpif(env==='prod', autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    })))
    .pipe(gulpif(env==='prod',gcmq()))
    // .pipe(gulpif(env==='prod',cleanCSS()))
    .pipe(gulpif(env==='dev',sourcemaps.write()))
    .pipe(dest(`${DIR_PATH}`))
    .pipe(reload({stream: true}));
});

task('script', () => {
    return src('src/*.js',)
    .pipe(gulpif(env==='dev',sourcemaps.init()))
    .pipe(concat('script.min.js', {newLine: ";\n"}))
    .pipe(gulpif(env === 'prod', babel({
        presets: ['@babel/env']
    })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env==='dev',sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(reload({stream: true}));
});

task('icons', () => {
    return src(`./${SRC_PATH}/icons/*.svg`)
    .pipe(svgo({
        // plugins: [
        // {
        //     removeAttrs: {
        //     attrs: '(fill|stroke|style|width|height|data.*)'
        //     }
        // }
        // ]
    }))
    .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: '../sprite.svg'
          }
        }
      }))
    .pipe(dest('dist'));
})

task('clean', () => {
    return src('dist/**/*', {read: false}).pipe(clean());
});

task('copy:html', () => {
    return src('./src/*.html').pipe(dest('dist')).pipe(reload({stream: true}));
});

task('copy:img', () => {
    return src('src/img/**/*').pipe(dest('dist/img')).pipe(reload({stream: true}));
});

task('copy:mp4', () => {
    return src('src/*.mp4').pipe(dest('dist')).pipe(reload({stream: true}));
});

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

task('watch', () => {
    watch('src/css/**/*.scss', series('sass'));
    watch('src/*.html', series('copy:html'));
    watch('src/img/**/*', series('copy:img'))
    watch('src/*.js', series('script'));
    watch('src/icons/*.svg', series('icons'));
});

task('default', series('clean', parallel('copy:html', 'copy:img', 'copy:mp4', 'sass', 'icons', 'script'), parallel('watch', 'server')));
task('build', series('clean', parallel('copy:html', 'copy:img', 'copy:mp4', 'sass', 'icons', 'script'), parallel('watch', 'server')));
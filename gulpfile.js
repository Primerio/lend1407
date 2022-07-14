const gulp = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const sourcemap = require('gulp-sourcemaps');


function cleanDist () {
    return del('dist/')
}
exports.cleanDist = cleanDist;




function browsersync () {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}
exports.browsersync = browsersync;





function styles () {
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'app/fonts/nunito/nunito.css',
        'app/scss/**/*.scss'
    ])
    .pipe(sourcemap.init())
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 5 version'],
        grid: true
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
}
exports.styles = styles;





function scripts () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(sourcemap.init())
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(sourcemap.write())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
}
exports.scripts = scripts;





function img () {
    return gulp.src('app/img/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream())
}
exports.img = img;





function build () {
    return gulp.src([
        'app/css/style.min.css',
        'app/**/*.html',
        'app/js/script.min.js',
        'app/fonts/**/*'
    ], {base: 'app'})
    .pipe(gulp.dest('dist/'))
}
exports.build = gulp.series(cleanDist, img, build);




function watch() {
    gulp.watch(['app/scss/**/*.scss'], styles);
    gulp.watch(['app/js/**/*.js','!app/js/script.min.js'], scripts);
    gulp.watch(['app/*.html']).on('change', browserSync.reload);
    gulp.watch(['app/img/**/*'], img)
}
exports.watch = watch;


exports.default = gulp.parallel(browsersync, watch, scripts, img);
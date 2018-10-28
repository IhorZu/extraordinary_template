'use strict';

var gulp 			= require('gulp'),
    postcss         = require('gulp-postcss'),
    autoprefixer 	= require('autoprefixer'),
    mqpacker        = require("css-mqpacker"),
    sortCSSmq       = require('sort-css-media-queries'),
	sass 			= require('gulp-sass'),
    cleanCSS 		= require('gulp-clean-css'),
    htmlhint        = require("gulp-htmlhint"),
    concat          = require('gulp-concat'),
    uglify 			= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'),
    svgSprite       = require('gulp-svg-sprite'),
    include         = require("gulp-include"),
    sourcemaps      = require('gulp-sourcemaps'),
	browserSync 	= require("browser-sync"),
	watch 	        = require("gulp-watch");

var path = {
    build: {
        html: 'build/',
        style: 'build/css',
        js: 'build/js/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        style: 'src/sass/index.scss',
		js: 'src/js/',
        img: 'src/images/**/*.*',
        svg: 'src/svg/all/**/*.svg',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/sass/**/*.scss',
        js: 'src/js/**/*.js',
        img: 'src/images/**/*.*',
        svg: 'src/svg/all/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3000
};

gulp.task('web-server', function () {
    browserSync(config);
});

gulp.task('build', [
    'svg:build',
    'html:build',
    'font:build',
    'style:build',
    'js:build',
    'image:build'
]);

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(sourcemaps.init())
            .pipe(include()).on('error', function (err) {
                console.log(err.message);
            })
            .pipe(htmlhint())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());

    gulp.src('src/pages/*.html')
        .pipe(sourcemaps.init())
        .pipe(include()).on('error', function (err) {
            console.log(err.message);
        })
        .pipe(htmlhint())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.html + 'pages/'))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src([
        path.src.js + 'libs/**/*.js',
        path.src.js + 'common.js'
    ])
        .pipe(sourcemaps.init())
            .pipe(concat('index.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    var plugins = [
        autoprefixer(
            {
                browsers: ['last 2 versions'],
                cascade: false
            }
        ),
        mqpacker({
            sort: sortCSSmq.desktopFirst
        })
    ];

    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(postcss(plugins))
            .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream());
});

gulp.task('font:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]

        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('svg:build', function() {
    gulp.src(path.src.svg)
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: 'svg',
                    sprite: 'sprite'
                }
            }
        }))
        .pipe(gulp.dest('src'));
});

gulp.task('watch', function(){
    watch(path.watch.html, function() {
        gulp.start('html:build');
    });
    watch(path.watch.style, function() {
        gulp.start('style:build');
    });
    watch(path.watch.js, function() {
        gulp.start('js:build');
    });
    watch(path.watch.img, function() {
        gulp.start('image:build');
    });
    watch(path.watch.svg, function() {
        gulp.start('html:build', ['svg:build']);
    });
    watch(path.watch.fonts, function() {
        gulp.start('font:build');
    });
});

gulp.task('default', ['build', 'web-server', 'watch']);

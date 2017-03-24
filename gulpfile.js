var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	ts = require('gulp-typescript'),
    merge = require('merge2');

var paths = {
	src: "./src",
	ts: "./src/*.ts",
	dist: "./dist",
	distFile: "./dist/xmp.js",
	distFileMin: "./dist/xmp.min.js"
};

gulp.task('default', ['ts:clean', 'ts:compile', 'ts:minify']);

gulp.task('ts:clean', function () {
    return gulp.src(paths.dist, { read: false })
        .pipe(rimraf());
});

gulp.task('ts:compile', function () {
    var tsResult = gulp.src(paths.ts, { base: paths.src })
        .pipe(ts({
            noImplicitAny: false,
            declaration: true,
            emitDecoratorMetadata: true,
            target: "ES5",
            out: "xmp.js"
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.dist)),
        tsResult.js.pipe(gulp.dest(paths.dist))
    ])
});

gulp.task('ts:minify', function () {
	return gulp.src(paths.distFile),
        uglify(),
        gulp.dest("xmp.min.js");
});
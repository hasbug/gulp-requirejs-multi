var gulp=require('gulp'),
    sass=require('gulp-sass'),
    sourcemaps=require('gulp-sourcemaps'),
    md5=require('gulp-md5-plus'),
    spritesmith=require('gulp.spritesmith'),
    fileinclude=require('gulp-file-include'),
    clean=require('gulp-clean'),
    browserSync=require('browser-sync').create(),
    requirejsOptimize=require('gulp-requirejs-optimize');





//拷贝images目录到dist
gulp.task('copy:images', function (done) {
    gulp.src(['src/images/**/*']).pipe(gulp.dest('dist/images')).on('end', done);
});


//sass
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});


//将css加上10位md5，并修改html中的引用路径
gulp.task('md5:css',['sass'], function (done) {
    gulp.src('dist/css/*.css')
        .pipe(md5(10, 'dist/*.html'))
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['rjs'], function (done) {
    gulp.src('dist/js/*.js')
        .pipe(md5(10, 'dist/*.html'))
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest('dist/css')); //将图和spritecss输出到css文件夹
});



gulp.task('js',function(){
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
});


//打包requirejs
gulp.task('rjs',function(){
    return gulp.src('src/js/app/*.js')
        .pipe(sourcemaps.init())
        .pipe(requirejsOptimize({
            mainConfigFile: 'src/js/config.js',
            exclude: [
                'jquery'
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/app'));
});


//用于在html文件中直接include文件(例如：插入共用头部底部)
gulp.task('fileinclude', function (done) {
    gulp.src(['src/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'))
        .on('end', done);
});


//监听src文件变动
gulp.task('watch',function(){
    gulp.watch('src/**/*',['sass','js','copy:images','sprite','fileinclude']);
});

//本地服务
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("src/sass/*.scss", ['sass']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});


//开发任务
gulp.task('dev', ['serve','watch']);

//打包发布
gulp.task('ann', ['serve','watch','md5:css','md5:js']);

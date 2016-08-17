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


//拷贝fonts目录到dist
gulp.task('copy:fonts', function (done) {
    gulp.src(['src/fonts/**/*']).pipe(gulp.dest('dist/fonts')).on('end', done);
});


//sass
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
   // cb(err);
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
    gulp.src('dist/js/**/*')
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



gulp.task('js',['cleanjs'],function(){
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'));
    //cb(err);
});


//打包requirejs
gulp.task('rjs',['js'],function(){
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
gulp.task('fileinclude', function () {
    gulp.src(['src/view/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'));
});


//监听src文件变动
gulp.task('watch',function(){
    gulp.watch('src/**/*',['sass','js','copy:images','copy:fonts','sprite','fileinclude']);
});

//本地服务
gulp.task('serve',function() {
    browserSync.init({
        server: "./"
    });

   // gulp.watch("src/sass/*.scss", ['sass']);
   // gulp.watch("dist/*.html").on('change', browserSync.reload);
});

//打包前清除JS
gulp.task('cleanjs',function (cb) {
    return gulp.src('dist/js/**/*.js',{read: false})
            .pipe(clean());
            cb(err);

});

//清除css
gulp.task('cleancss',function () {
    return gulp.src('dist/css/',{read: false})
        .pipe(clean());
});


//全部清空
gulp.task('clean',function () {
    return gulp.src('dist/',{read: false})
        .pipe(clean());
});

//初步任务
gulp.task('set',['copy:images','copy:fonts','sass','js','fileinclude','sprite']);


//开发任务
gulp.task('dev', ['serve','watch','set']);

//打包发布()
gulp.task('ann', ['serve','rjs','md5:css','md5:js']);

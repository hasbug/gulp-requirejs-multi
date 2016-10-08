var gulp=require('gulp'),
    sass=require('gulp-sass'),
    sourcemaps=require('gulp-sourcemaps'),
    md5=require('gulp-md5-plus'),
    spritesmith=require('gulp.spritesmith'),
    fileinclude=require('gulp-file-include'),
    clean=require('gulp-clean'),
    browserSync=require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    replaceUrl = require('gulp-url-replace'),
    requirejsOptimize=require('gulp-requirejs-optimize');




var basePath='';
var output='F:/project/top';

//替换html中的静态文件路径
gulp.task('reurl', function(){
    gulp.src(output+'/**/*.html')
        .pipe(replaceUrl({
            'http://localhost:3000/images/':'../images/',
            'http://localhost:3000/css/': '../css/',
            'http://localhost:3000/js/': '../js/'
        }))
        .pipe(gulp.dest(output)); //估计要换个目录 单独用于上线前存放替换url后的页面
});


//拷贝images目录到dist
gulp.task('copy:images', function (done) {
    gulp.src(['src/images/**/*']).pipe(plumber()).pipe(gulp.dest(output+'/images')).on('end', done);
});


//拷贝fonts目录到dist
gulp.task('copy:fonts', function (done) {
    gulp.src(['src/fonts/**/*']).pipe(plumber()).pipe(gulp.dest(output+'/fonts')).on('end', done);
});
//css 直接拷贝过去
gulp.task('copy:css', function (done) {
    gulp.src(['src/sass/**/*.css']).pipe(plumber()).pipe(gulp.dest(output+'/css')).on('end', done);
});


//sass
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(output+'/css'))
        .pipe(browserSync.stream());
   // cb(err);
});


//将css加上10位md5，并修改html中的引用路径
gulp.task('md5:css',['sass'], function (done) {
    gulp.src(output+'/css/*.css')
        .pipe(plumber())
        .pipe(md5(10, output+'/*.html'))
        .pipe(gulp.dest(output+'/css'))
        .on('end', done);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['rjs'], function (done) {
    gulp.src(output+'/js/**/*')
        .pipe(plumber())
        .pipe(md5(10, output+'/*.html'))
        .pipe(gulp.dest(output+'/js'))
        .on('end', done);
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/sprite/*.png').pipe(plumber()).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest(output+'/css')); //将图和spritecss输出到css文件夹
});



gulp.task('js',['cleanjs'],function(){
    return gulp.src('src/js/**/*')
        .pipe(plumber())
        .pipe(gulp.dest(output+'/js'));
    //cb(err);
});


//打包requirejs
gulp.task('rjs',['js'],function(){
    return gulp.src('src/js/app/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(requirejsOptimize({
            mainConfigFile: 'src/js/config.js',
            exclude: [
                'jquery'
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output+'/js/app'));
});


//用于在html文件中直接include文件(例如：插入共用头部底部)
gulp.task('fileinclude', function () {
    gulp.src(['src/views/**/*.html','!src/views/public/*.html'])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(output+basePath));
});


//监听src文件变动
gulp.task('watch',function(){
    gulp.watch('src/**/*',['sass','js','copy:images','copy:css','copy:fonts','sprite','fileinclude']);
});

//本地服务
gulp.task('serve',function() {
    browserSync.init({
        server: output
    });

    gulp.watch("src/sass/*.scss", ['sass']);
    gulp.watch(output+"views/*.html").on('change', browserSync.reload);
});

//打包前清除JS
gulp.task('cleanjs',function (cb) {
    return gulp.src('dist/js/**/*.js',{read: false})
        .pipe(plumber())
        .pipe(clean({force:true}));
        cb(err);

});

//清除css
gulp.task('cleancss',function () {
    return gulp.src(output+'css/',{read: false})
        .pipe(plumber())
        .pipe(clean());
});


//全部清空
gulp.task('clean',function () {
    return gulp.src(output,{read: false})
        .pipe(plumber())
        .pipe(clean({force:true}));
});


//转移目录--从前端的开发目录复制到环境中
gulp.task('move',function () {
    //gulp.src(['dist/**/*']).pipe(plumber()).pipe(gulp.dest('dist/images')).on('end', done);
});



//初步任务
gulp.task('set',['copy:images','copy:css','copy:fonts','sass','js','fileinclude','sprite']);


//开发任务
gulp.task('dev', ['serve','watch','set']);

//打包发布()
gulp.task('ann', ['serve','rjs','md5:css','md5:js']);

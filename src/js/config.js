var requirejs = {
    shim:{
        'plupload':{
            exports: 'plupload'
        },
        'layer':{
            exports: 'layer'
        },
        'bootstrap':{
            deps:['jquery']
        },
        'icheck':{
            deps:['bootstrap','jquery']
        },
        'slider':{
            deps:['bootstrap','jquery']
        },
        'mCustomScrollbar':{
            deps:['jquery']
        },
        'swiper':{
            exports: 'swiper'
        },
        'lightbox':{
            deps:['jquery']
        },
        'lg-thumbnail':{
            deps:['lightgallery']
        },
        'laydate':{
            exports: 'laydate'
        }
    },
    paths: {
        jquery: '../libs/jquery',
        bootstrap: '../libs/bootstrap.min',
        async: '../libs/async',
        plupload:'../libs/plupload-2.1.9/js/plupload.full.min',
        'jquery.validate':'../lib/jquery.validate.min',
        'BMap': ['http://api.map.baidu.com/api?v=2.0&ak=mXijumfojHnAaN2VxpBGoqHM'],
        'slider':'../libs/bootstrap-slider/bootstrap-slider.min',
        'upload':'../mods/upload',
        layer:'../libs/layer/layer',
        icheck:'../libs/icheck/icheck.min',
        mCustomScrollbar:'../libs/mcustomscrollbar/jquery.mCustomScrollbar.concat.min',
        swiper:'../libs/idangerous.swiper.min',
        lightbox:'../libs/lightbox2/js/lightbox.min',
        lightgallery:'../libs/lightgallery/js/lightgallery.min',
        'lg-thumbnail':'../libs/lightgallery/js/lg-thumbnail.min',
        'laydate':'../libs/laydate/laydate',
        base:'../mods/base'
    }
};
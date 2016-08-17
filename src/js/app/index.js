require(['jquery','swiper'],function($,swiper){
    var mySwiper = new Swiper('.msg-swiper-wrap', {
        autoplay: 0,
        direction : 'vertical',
        wrapperClass : 'msg-swiper-list',
        slideClass : 'msg-swiper-item',
        slidesPerView :1,
        grabCursor : true,
        autoHeight: true,
        lazyLoading : true
    })
});

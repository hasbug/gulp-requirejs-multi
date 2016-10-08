define(['jquery','Iscroll'],function ($,Iscroll) {
    var myScroll;//基础变量
    var scroll,init; //方法名
    scroll = function(ele) {
        var ele=ele || '#app';
        myScroll = new Iscroll(ele, {
            click: true
        });

        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        return myScroll;
    };



    init= function () {
        scroll();
    };

    return{
        init:init,
        scroll:scroll
    }
});
require(['jquery','Masonry'],function ($,Masonry) {
/*    $('.grid-msg').masonry({
        columnWidth: '.grid-msg-item',
        itemSelector: '.grid-msg-item'
    });*/

    var msnry = new Masonry( '.grid-msg', {
        columnWidth: '.grid-msg-item',
        itemSelector: '.grid-msg-item'
    });
});
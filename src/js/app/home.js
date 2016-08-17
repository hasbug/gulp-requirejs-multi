

require(['jquery','../lib/jquery.fullPage'],function($,fullpage){
    $('#welcome-fullpage').fullpage({
        anchors: ['page1', 'page2', 'page3', 'page4','page5','page6'],
        sectionsColor: ['#f6ce88', '#fef6e9', '#fdf5c6', '#fae3bb'],
        'navigation': true,
        afterLoad: function(anchorLink, index){
            var loadedSection = $(this);
            //using index
            if(index == 3){
                //loadedSection.addClass('active')
            }
        }
    });
});

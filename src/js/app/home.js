require(['jquery','../lib/jquery.fullPage'],function ($,fullpage) {
    $(document).ready(function() {
        $('#fullpage').fullpage({
            sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#000']
        });
    });
});
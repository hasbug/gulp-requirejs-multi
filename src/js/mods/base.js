define(['jquery','icheck'],function ($,iCheck) {
    var init;

    console.log(iCheck)

    init = function () {
        //设置icheck
        $(document).ready(function(){
            $('input').iCheck({
                checkboxClass: 'icheckbox_minimal-orange',
                radioClass: 'iradio_minimal-orange',
                increaseArea: '20%' // optional
            });
        });
    }

    return {
        init:init
    }
});
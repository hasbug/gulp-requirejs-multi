// require.config({
//   paths:{
//     "mod1":"../mod/mod1"
//   }
// });
//

//因为打包的原因，这时候已经不能使用上面的config，只能在下方相对地址引入

require([],function(){
    //test jquery
    $('body').css('background','#999');
})

//upload to aliyun oss
define(['plupload','jquery'],function(plupload,$){

    console.log(plupload)

    var accessid = '',
        accesskey = '',
        host = '',
        policyBase64 = '',
        signature = '',
        callbackbody = '',
        filename = '',
        key = '',
        expire = 0,
        newfilename = '',
        timestamp = Date.parse(new Date()) / 1000,
        now = timestamp;

    var send_request,
        get_signature,
        set_upload_param,
        uploader,
        previewImage,
        deleteImg,
        randomString, //随机字符串，用于文件名
        changeImgName,
        init;

    send_request = function () {
        var xmlhttp= null;
        if(window.XMLHttpRequest){
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject){
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if(xmlhttp!=null){
            var get_signatur_url='http://192.168.0.198:8086/weibo/getPolicy';
            xmlhttp.open('GET',get_signatur_url,true);
            xmlhttp.send(null);
            return xmlhttp.responseText
        }else{
            alert('抱歉，您的浏览器太老了，不支持XMLHTTP对象');
        }
    };

    //上传文件时前端修改文件名 aliyun oss
    changeImgName = function (filename) {
        console.log(filename);
        var pos = filename.lastIndexOf('.'),
            suffix = '';
        if (pos != -1) {
            suffix = filename.substring(pos)
        }

        newfilename=randomString(10) + suffix;set_upload_param
        
    };

    randomString = function (len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };

    get_signature = function () {
        console.log(111);
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        now = timestamp = Date.parse(new Date()) / 1000;
        console.log('get_signature ...');
        console.log('expire:' + expire.toString());
        console.log('now:', + now.toString());
        if (expire < now + 3)
        {
            console.log('get new sign');
            var body ={"data":{"accessid":"0NbCLufgku4KpwWg","policy":"eyJleHBpcmF0aW9uIjoiMjAxNi0wOC0xN1QwODowNTo0Ny4wMTFaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJ1c2VyLWRpciJdXX0=","signature":"y3tqz5bdBVGN8UNTZOjyXss/Pxw=","dir":"user-dir","host":"http://dududaiyan.oss-cn-shenzhen.aliyuncs.com","expire":"1471421147"},"code":200,"msg":"请求成功","timestamp":1471418147012}; //send_request()
            //var obj = eval ("(" + body + ")");
            var obj = body;
            obj=obj.data;
            console.log(obj);
            host = obj['host'];
            policyBase64 = obj['policy'];
            accessid = obj['accessid'];
            signature = obj['signature'];
            expire = parseInt(obj['expire']);
            callbackbody = '';//obj['callback']
            key = obj['dir'];
            return true;

        }
        return false;

    };

    set_upload_param = function (up,filename) {
        newfilename='';
        if (filename != '') {
            changeImgName(filename);
        }
        var ret = get_signature();
        if (ret == true)
        {
            new_multipart_params = {
                'key' : key+newfilename,
                'policy': policyBase64,
                'OSSAccessKeyId': accessid,
                'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                'callback' : callbackbody,
                'signature': signature,
            };

            up.setOption({
                'url': host,
                'multipart_params': new_multipart_params
            });

            console.log('reset uploader')
            //uploader.start();
        }

    };

    uploaded = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'selectfiles',
        container: document.getElementById('upload-container'),
        flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

        url : 'http://oss.aliyuncs.com',
        filters: {
            mime_types : [ //只允许上传图片
                { title : "Image files", extensions : "jpg,gif,png,bmp" }
            ],
            max_file_size : '5120kb', //最大只能上传5120kb的文件
            prevent_duplicates : true //不允许选取重复文件
        },

        init: {
            PostInit: function() {
                document.getElementById('ossfile').innerHTML = '';
                document.getElementById('postfiles').onclick = function() {
                    set_upload_param(uploaded, '');
                    uploaded.start();
                    return false;
                };
                //删除
                $(document).on('click','.upload-delete',function () {
                    console.log(uploaded.files)
                    var _fileid=$(this).parents('.upload-pic-item').attr('id');
                    $(this).parents('.upload-pic-item').remove();
                    deleteImg(_fileid);
                });
         /*           var _fileid=this.getAttribute('id');
                    deleteImg(_fileid);
                    console.log(_fileid)*/

            },
            BeforeUpload: function(up, file) {
                set_upload_param(up, file.name);
            },

            FilesAdded: function(up, files) {
                plupload.each(files, function(file) {
                    previewImage(file,function(imgsrc){
                          document.getElementById('ossfile').innerHTML += '<div class="upload-pic-item" id="' + file.id + '"><img src="'+imgsrc+'"/><b></b>'
                         +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                         +'<div class="upload-delete"><i class="iconfont icon-delete"></i></div>'
                         +'</div>';
                    })
                });
            },

            UploadProgress: function(up, file) {
                var d = document.getElementById(file.id);
                d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";

                var prog = d.getElementsByTagName('div')[0];
                var progBar = prog.getElementsByTagName('div')[0]
                progBar.style.width= file.percent+'%';
                progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function(up, file, info) {
                console.log('uploaded')
                console.log(info.status)
                if (info.status == 200)
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'success';
                    //前端拼接图片地址,并填写到图片父div的data-img上
                    document.getElementById(file.id).setAttribute('data-img',newfilename)
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                console.log("出错了！ \nError xml:" + err.response);
            }
        }
    });


    //删除图片（上传前移除以及上传后传给后台前的删除）
    deleteImg = function (fileid) {
        var toremove = '';
        var id=fileid;
        for(var i in uploaded.files){
            toremove = i;
        }

        uploaded.files.splice(toremove,1);
    };


    previewImage = function (file, callback) {
        if (!file || !/image\//.test(file.type)) return; //确保文件是图片
        if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function () {
                callback(fr.result);
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        } else {
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                //preloader.downsize(550, 400);//先压缩一下要预览的图片,宽300，高300
                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                callback && callback(imgsrc); //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }
    };

    init = function(){
        uploaded.init();
    };

    return {
        init:init
    }
});

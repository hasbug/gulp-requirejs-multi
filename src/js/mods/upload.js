define(['jquery','plupload'],function ($,plupload) {
    var init,uploaders=[];

    init =function (uploaders) {
        $('.w-upload-control').each(function () {
            var el = $(this);
            var button = el.attr("id") + "_uploader";
            var fileBox=el.find('.w-upload');
            el.find('.w-upload-btn').attr("id",button);

            var uploader = new plupload.Uploader({
                runtimes : 'html5,flash,silverlight,html4',
                browse_button : button,
                //multi_selection: false,
                 container: document.getElementById(el.attr("id")),
                flash_swf_url : '../libs/plupload-2.1.2/js/Moxie.swf',
                silverlight_xap_url : '../libs/plupload-2.1.2/js/Moxie.xap',
                url : 'http://oss.aliyuncs.com',

                init: {
                    PostInit: function() {
                        fileBox.empty();
                /*        document.getElementById('postfiles').onclick = function() {
                            set_upload_param(uploader, '', false);
                            return false;
                        };*/
                    },

                    FilesAdded: function(up, files) {
                        plupload.each(files, function(file) {
                            $('#'+el.attr("id")).before('<div class="w-upload-box" id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                                +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                                +'</div>') ;
                        });
                    },

                    BeforeUpload: function(up, file) {
                        check_object_radio();
                        set_upload_param(up, file.name, true);
                    },

                    UploadProgress: function(up, file) {
                        var d = document.getElementById(file.id);
                        d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        var prog = d.getElementsByTagName('div')[0];
                        var progBar = prog.getElementsByTagName('div')[0]
                        progBar.style.width= 2*file.percent+'px';
                        progBar.setAttribute('aria-valuenow', file.percent);
                    },

                    FileUploaded: function(up, file, info) {
                        if (info.status == 200)
                        {
                            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
                        }
                        else
                        {
                            document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                        }
                    },

                    Error: function(up, err) {
                        document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                    }
                }
            });

            uploader.init();
            console.log(uploader);
            //uploaders.push(uploader);

        });
    };


    return {
        init:init
    }

});
//首页
require(['jquery','bootstrap','base','upload','async!BMap'],function ($,bootstrap,base,upload) {

    base.init();

    //选择区域的时候添加覆盖物到地图
    // 百度地图API功能
    if($('#w-map').length>0){
        var map = new BMap.Map("w-map");

        console.log(map)

        var point = new BMap.Point(110.329523, 20.033496);
        map.centerAndZoom(point, 13);
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        map.addEventListener("click", function (e) {


            var tbxLong = document.getElementById("tbx_long");
            tbxLong.value = e.point.lng;
            var tbxLat = document.getElementById("tbx_lat");
            tbxLat.value = e.point.lat;

        });


        updateDists("1,海秀@110.253783,20.036974#110.250118,20.02879#110.250405,20.015476#110.262909,20.016936#110.262945,20.002331#110.300638,19.982051#110.300854,20.027363#110.292949,20.02485#110.272719,20.017964#|2,海口湾@110.292949,20.02485#110.283606,20.031846#110.283894,20.042985#110.28605,20.049777#110.321964,20.045108#110.329887,20.040642#110.314949,20.03194#110.300728,20.027253#110.294422,20.042009#|3,金贸@110.300836,20.019501#110.300854,20.0273#110.314949,20.03194#110.329887,20.040642#110.339059,20.028577#110.329213,20.02226#110.322314,20.023058#110.32209,20.029308#|4,海垦@110.300674,20.002195#110.300836,20.019501#110.322314,20.023058#110.329213,20.02226#110.329213,20.02226#110.328099,20.011901#110.320284,20.009795#110.320024,20.001295#110.310845,20.01421#|5,金盘@110.300513,19.982373#110.300674,20.002195#110.336741,20.000981#110.346892,20.005125#110.349371,19.984267#110.320239,19.990637#|6,金宇@110.320024,20.001295#110.320284,20.009795#110.328099,20.011901#110.329213,20.02226#110.339059,20.028577#110.341682,20.023143#110.346892,20.005125#110.336741,20.000981#110.334972,20.012173#|7,海甸@110.308912,20.061042#110.312506,20.080191#110.345276,20.086846#110.360655,20.079105#110.365829,20.075472#110.379699,20.05639#110.375962,20.054522#110.368704,20.057578#110.366189,20.054895#110.343658,20.049938#110.336112,20.05476#110.345302,20.071652#|8,滨海@110.321775,20.054217#110.321964,20.045108#110.329887,20.040642#110.33622,20.03261#110.339948,20.036066#110.343586,20.04408#110.343658,20.049938#110.336112,20.05476#110.3296,20.050023#|9,大同@110.339059,20.028577#110.342562,20.029795#110.352264,20.038545#110.355857,20.034809#110.357528,20.037985#110.359983,20.043317#110.360079,20.053572#110.343658,20.049938#110.343586,20.04408#110.339948,20.036066#110.33622,20.03261#110.350548,20.045778#|10,和平@110.357528,20.037985#110.36557,20.03267#110.371901,20.022753#110.368981,20.030428#110.366189,20.054895#110.360079,20.053572#110.359983,20.043317#110.362347,20.04051#|11,白龙@110.371901,20.022753#110.393245,20.022889#110.386633,20.047748#110.379375,20.053843#110.367876,20.057578#110.366189,20.054895#110.368981,20.030428#110.375602,20.04307#|12,蓝天@110.341682,20.023143#110.371901,20.022753#110.365577,20.03267#110.357528,20.037985#110.355857,20.034809#110.352264,20.038545#110.342562,20.029795#110.339059,20.028577#110.35583,20.02963#|13,国兴@110.346892,20.005125#110.364678,20.012495#110.38419,20.012631#110.393245,20.022889#110.341682,20.023143#110.365316,20.018253#|14,府城@110.349371,19.984267#110.387603,19.985287#110.39673,19.99096#110.38419,20.012631#110.364678,20.012495#110.346892,20.005125#110.371533,19.998586#|");


        function markOneDistrict(points_str, center_Str) {

            var pts = [];
            var onePair = "";
            for (i = 0; i < points_str.length; i++) {
                if (points_str[i] != '#') {
                    onePair += points_str[i];
                }
                else {

                    temLng = onePair.substr(0, onePair.indexOf(","));
                    temLat = onePair.substr(onePair.indexOf(",") + 1);
                    var onePoint = new BMap.Point(temLng, temLat);
                    pts.push(onePoint);
                    onePair = "";
                }


            }

            var cp = pts.pop();
            var sid = center_Str.substr(0, center_Str.indexOf(","));
            var distName = center_Str.substr(center_Str.indexOf(",") + 1);

            var polygon = new BMap.Polygon(pts, { strokeColor: "red", strokeWeight: 2, Opacity: 0, fillOpacity: 0.2, fillColor: "#fff" });
            polygon.addEventListener("mouseover", function (e) {
                this.strokeColor = "blue";
            });

            map.addOverlay(polygon);


            var opts = {
                position: cp,
                offset: new BMap.Size(1, -1)
            }

            //console.log(opts)
            var _point=new BMap.Point(parseFloat(opts.position.lng),parseFloat(opts.position.lat))

            myLabel(distName, _point)


            /*    var label = new BMap.Label(distName, opts);

             label.setStyle({
             color: "red",
             fontSize: "16px",

             border: "none",

             });



             map.addOverlay(label);*/


        }

        function ComplexCustomOverlay(point, text, mouseoverText){
            this._point = point;
            this._text = text;
            this._overText = mouseoverText;
        }

        function myLabel(distName, _point){
            ComplexCustomOverlay.prototype = new BMap.Overlay();
            ComplexCustomOverlay.prototype.initialize = function(map){
                this._map = map;
                var div = this._div = document.createElement("div");
                div.style.position = "absolute";
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                div.style.backgroundColor = "#e19034";
                div.style.background = "rgba(246, 80, 0, 0.8)";
                div.style.border = "1px solid #e19034";
                div.style.color = "white";
                div.style.height = "60px";
                div.style.width = "60px";
                div.style.padding = "10px";
                div.style.lineHeight = "40px";
                div.style.textAlign = "center";
                div.style.whiteSpace = "nowrap";
                div.style.MozUserSelect = "none";
                div.style.borderRadius = "50%";
                div.style.fontSize = "12px"
                var span = this._span = document.createElement("span");
                div.appendChild(span);
                span.appendChild(document.createTextNode(this._text));
                var that = this;

                div.onmouseover = function(){
                    this.style.backgroundColor = "#f75100";
                    this.style.borderColor = "#f75100";
                    this.getElementsByTagName("span")[0].innerHTML = that._overText;
                }

                div.onmouseout = function(){
                    this.style.backgroundColor = "#e19034";
                    this.style.backgroundColor = "rgba(246, 80, 0, 0.8)";
                    this.style.borderColor = "#e19034";
                    this.getElementsByTagName("span")[0].innerHTML = that._text;
                }

                map.getPanes().labelPane.appendChild(div);

                return div;
            }
            ComplexCustomOverlay.prototype.draw = function(){
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x -30 + "px";
                this._div.style.top  = pixel.y -30 + "px";
            }
            var txt = distName, mouseoverTxt = txt ;

            var myCompOverlay = new ComplexCustomOverlay(_point, distName,mouseoverTxt);

            console.log(_point)

            map.addOverlay(myCompOverlay);
        }


        function updateDists(all_pts_str) {
            console.log(map)

            map.clearOverlays();
            var oneRow = "";

            for (ii = 0; ii < all_pts_str.length; ii++) {

                if (all_pts_str[ii] != "|") {
                    oneRow += all_pts_str[ii];
                }
                else {

                    var nameStr = "";
                    var coordsStr = "";
                    nameStr = oneRow.substr(0, oneRow.indexOf("@"));
                    coordsStr = oneRow.substr(oneRow.indexOf("@") + 1);
                    markOneDistrict(coordsStr, nameStr);
                    oneRow = "";
                }


            }

        }

    }

    //上传图片
    upload.init()

});


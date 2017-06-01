$(function() {
    livePhone.initData();
});

jQuery.support.cors = true;
var livePhone = {
    initData: function() {
        var controls = $(".live-video-main,#vpage").find("a");
        var token = cms.getToken();
        var sn = cms.getWebSn();
        var img = $("#btnmobile");
        var base = window.location.host;
        var url = "";
        if (null != token && "" != token) {
            var baseUrl = cms.getCloudPath() + "api.do?pa=qrcode.mobileorder";
            img.attr("src", baseUrl + "&sn=" + sn + "&token=" + token);
            url = "http://m" + base.substring(base.indexOf(".")) + "/web/?sn=" + sn + "&token=" + token;
        } else {
            var baseUrl = cms.getCloudPath() + "api.do?pa=qrcode.mobilesite";
            img.attr("src", baseUrl + "&sn=" + sn);
            url = "http://m" + base.substring(base.indexOf(".")) + "/web/?sn=" + sn;
        }

        $("#murl189").attr("href", url);
    }
};

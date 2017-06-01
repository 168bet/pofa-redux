$(function() {
    liveVideo.initData();
});

jQuery.support.cors = true;
var liveVideo = {
    initData: function() {
        var controls = $(".live-video-main,#vpage").find("a");
        $.each(controls, function(i) {
            var ia = controls[i];
            var id = ia.id;
            if ("" == cms.getToken()) {
                $(ia).click(function() {
                    JsMsg.warnMsg("请先登录!");
                });
            } else if ("DEMO" == cms.getToken().substr(0, 4) && id != "video1") {
                $(ia).click(function() {
                    JsMsg.warnMsg("请使用正式帐号登录!");
                });
            } else {
                $(ia).click(function() {
                    var id = this.id;
                    if ("" == cms.getToken()) {
                        JsMsg.warnMsg("请先登录!", { code: "2264" });
                        $(ia).attr("href", "javascript:void(0);");
                        return false;
                    }
                });

                if (id == "video1") {
                    liveVideo.openBgVideo(ia);
                } else if (id == "video5") {
                    liveVideo.openBbinVideo(ia);
                } else if (id == "video3") {
                    liveVideo.openGdVideo(ia);
                } else if (id == "video4") {
                    liveVideo.openAgVideo(ia);
                } else if (id == "video6") {
                    liveVideo.openAbVideo(ia);
                } else if (id == "video9") {
                    liveVideo.openLeboVideo(ia);
                } else if (id == "video7") {
                    liveVideo.openPtVideo(ia);
                } else if (id == "video8") {
                    liveVideo.openOgVideo(ia);
                } else if (id == "video10") {
                    liveVideo.openSunbetVideo(ia);
                } else if (id == "video11") {
                    $("#video11").bind("mouseenter", function(e) {
                        liveVideo.openDGVideo(ia);
                    });
                } else if (id == "video12") {
                    liveVideo.openVegasVideo(ia);
                }

            }

        });
    },
    openBgVideo: function(ia) {
        var tr = cms.getModulesCode("#n3");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            var locale = 'zh_CN';
            var model = cms.getLoginModel();
            var an = model.account;
            if (an === undefined) {
                an = cms.getCookie("account");
            }
            var account = an;
            var path = cms.getWebPath();
            var token = cms.getToken();
            var sn = "";
            if (token.length > 0) {
                sn = token.substring(0, 4);
            } else {
                sn = cms.getWebSn();
            }
            var token = cms.getToken();
            var uid = cms.getUid();
            var frmUrl = "http://" + window.top.location.host;
            url = cms.getVideoPath() + "?locale=" + locale + "&account=" + account + "&sn=" + sn + "&token=" + token + "&uid=" + uid + "&return='" + frmUrl + "'";
            $(ia).attr("href", url).attr("target", "bgvideo_view");
        }

    },
    openBbinVideo: function(ia) {
        var tr = cms.getModulesCode("#n26");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.bbin.game.play.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    lang: 1,
                    type: 1
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "bbinvideo_view");
                    }
                }
            });
        }
    },
    openPtVideo: function(ia) {
        var tr = cms.getModulesCode("#n24");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            var lan = "ZH-CN";
            var url = liveVideo.escape2Html("http://game.dyvip888.com/pt-play.html?gameCode=bal&sessionId=" + cms.getToken() + "&lan=" + lan);
            $(ia).attr("href", url).attr("target", "ptvideo_view");

        }
    },
    openGdVideo: function(ia) {
        var tr = cms.getModulesCode("#n22");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.gd.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken()
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "gdvideo_view");
                    }
                }
            });
        }
    },
    openSunbetVideo: function(ia) {
        var tr = cms.getModulesCode("#n29");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.sunbet.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    lang: 1,
                    type: 0
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "sunbetvideo_view");
                    }
                }
            });
        }
    },
    openOgVideo: function(ia) {
        var tr = cms.getModulesCode("#n30");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.og.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    dm: window.location.host,
                    lang: 1,
                    gameType: "1"
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "sunbetvideo_view");
                    }
                }
            });
        }
    },
    openAbVideo: function(ia) {
        var url = "";
        var tr = cms.getModulesCode("#n23");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {

            $.cloudCall({
                method: "thirdparty.ab.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken()
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "abvideo_view");
                    }
                }
            });

            setInterval(function() {
                $.cloudCall({
                    method: "thirdparty.ab.game.video.url",
                    async: true,
                    isLoading: false,
                    params: {
                        sessionId: cms.getToken()
                    },
                    success: function(data) {
                        if (data.error == null && data.result != null) {
                            url = liveVideo.escape2Html(data.result);
                            $(ia).attr("href", url).attr("target", "abvideo_view");
                        }
                    }
                });
            }, 30000);

        }

    },
    openLeboVideo: function(ia) {
        var url = "";
        var lan = "";
        var tr = cms.getModulesCode("#n27");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.lb.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    lang: 1
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        window.top.lbVideo = url;
                        $(ia).attr("href", url).attr("target", "lbvideo_view");
                    } else {
                        if (window.top.lbVideo) $(ia).attr("href", window.top.lbVideo).attr("target", "lbvideo_view");
                    }
                }
            });
        }

    },
    openAgVideo: function(ia) {
        var url = "";
        var lan = "";
        var tr = cms.getModulesCode("#n25");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.ag.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    dm: window.location.host,
                    lang: 1,
                    gameType: "0"
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "agvideo_view");
                    }
                }
            });
        }

    },
    openDGVideo: function(ia) {
        var url = "";
        var lan = "";
        var tr = cms.getModulesCode("#n31");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $("#video11").unbind("mouseenter mouseleave");
            $.cloudCall({
                method: "thirdparty.dg.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken(),
                    lang: "cn",
                    gameType: "1"
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "dgvideo_view");
                    }
                    $("#video11").bind("mouseleave", function(e) {
                        $("#video11").bind("mouseenter", function(e) {
                            liveVideo.openDGVideo(ia);
                        });
                    });
                }
            });
        }
    },
    openVegasVideo: function(ia) {
        var tr = cms.getModulesCode("#n32");
        if (tr != "") {
            liveVideo.getMaintenance(tr, ia);
        } else {
            $.cloudCall({
                method: "thirdparty.ve.game.video.url",
                async: true,
                params: {
                    sessionId: cms.getToken()
                },
                success: function(data) {
                    if (data.error == null && data.result != null) {
                        url = liveVideo.escape2Html(data.result);
                        $(ia).attr("href", url).attr("target", "Vegasvideo_view");
                    }
                }
            });
        }
    },
    getMaintenance: function(tr, ia) {
        var frmUrl = "http://" + window.top.location.host + tr;
        $(ia).click(function() {
            $(ia).attr("href", frmUrl).attr("target", "main_view");
            setTimeout(function() {
                $(ia).attr("href", "#").attr("target", "main_view");
            }, 100);
        });
    },
    escape2Html: function(str) {
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
            return arrEntities[t];
        });
    }
};

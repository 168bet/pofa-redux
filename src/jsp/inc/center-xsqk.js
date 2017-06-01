$(function() {
    var model = cms.getLoginModel();
    $("#userId").html(model.account);

    $(".btn").click(function() {
        centerXsqk.checkUserBank();
    });

    centerXsqk.loadBalance();

    var sn = cms.getWebSn();
    var tabs = $(".mc-title>ul");
    if (sn == "aq00") {
        tabs.html('<li style="margin-top:19px;"><a href="member-center-xsck.html">线上存款</a></li>\
              <li class="current">线上取款</li>');
    } else {
        tabs.html('<li style="margin-top:19px;"><a href="member-center-xsck.html">线上存款</a></li>\
              <li style="margin-top:19px;"><a href="member-center-ed.html">额度转换</a></li>\
              <li class="current">线上取款</li>');
    }
});

jQuery.support.cors = true;
var centerXsqk = {
    checkUserBank: function() {
        $.cloudCall({
            method: "user.profile.get",
            params: {
                sessionId: cms.getToken(),
                withBank: 1
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null) {
                    var item = obj.result;
                    if (item.bankId > 0 && !cms.isNull(item.bankAccount)) {
                        var s = cms.getWebPath();
                        cms.MGetPager('index-drawmoney-default', s);
                    } else {
                        JsMsg.infoMsg("请在出款前绑定你的银行帐号,为确保资金安全,请如实填写,谢谢!", {
                            callback: function() {
                                window.location.href = "withdraw-notlogged.html";
                            }
                        });
                    }
                } else {
                    JsMsg.errorObjMsg(obj.error);
                }
            }
        });
    },
    loadBalance: function() {
        $.cloudCall({
            method: "user.balance.get",
            async: true,
            isLoading: false,
            params: {
                sessionId: cms.getToken()
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null) {
                    $("#sysBalance").html(obj.result.balance);
                    var cookieObj = cms.getCookie("loginStatus");
                    var model = eval('(' + cookieObj + ')');
                    model.balance = obj.result.balance;
                    if (cookieObj != null && cookieObj != '') {
                        opener.bgPage.setReStatus(model);
                        var jsonObj = JSON.stringify(model);
                        cms.setCookie("loginStatus", jsonObj, 1);
                    }

                } else {
                    JsMsg.errorObjMsg(obj.error);
                }
            }
        });
    }

};

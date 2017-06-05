$(function() {

    opener.window.top.bankInfo = null
    opener.window.top.depositInfo = null

    $('.content-four').find("[href='member-center-step1.html']").click(function() {
        opener.window.top.depositSource = 1
    })

    $('.content-four').find("[href='member-center-pay.html']").click(function() {
        opener.window.top.depositSource = 2
    })

    $('.content-four').find("dkzf").find('a').click(function() {
        opener.window.top.depositSource = 3
    })

    var sn = cms.getWebSn()
    var tabs = $(".mc-title>ul")
    if (sn == "aq00") {
        tabs.html('<li class="current">线上存款</li>\
					<li style="margin-top:19px;"><a href="member-center-xsqk.html">线上取款</a></li>')
    } else {
        tabs.html('<li class="current">线上存款</li>\
					<li style="margin-top:19px;"><a href="member-center-ed.html">额度转换</a></li>\
					<li style="margin-top:19px;"><a href="member-center-xsqk.html">线上取款</a></li>')
    }

    if (sn == "au00" || sn == "bh00") {
        $("#txszf").html("【网银支付】").css({"color":"red", "font-size":"20px", "line-height":"24px"})
        $("#txszf").parent().find("i").css("margin-top", "2px")
        $("#txszfw").html("【微信支付】").css({"color":"red", "font-size":"20px", "line-height":"24px"})
        $("#txszfw").parent().find("i").css("margin-top", "2px")
    } else {
        $("#txszf").html("【线上支付】")
        $("#txszfw").html("【微信二维码扫码支付】")
    }
})

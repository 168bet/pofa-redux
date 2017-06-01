$(function() {
	$('#ftimg').click(function() {
		fgPwd.loadCode();
	});

	$("#txtcode").focus(function() {
		if (firstCount == 0) {
			fgPwd.loadCode();
			firstCount++;
		}
	});
	
	$("#btnFg").click(function(){
		fgPwd.sendEmail();
	});
});

var firstCount = 0;
jQuery.support.cors = true;
var fgPwd = {
	loadCode : function() {
		var timestamp = (new Date()).valueOf();
		$('#ftimg').attr("src",
				cms.getCloudPath() + 'api.do?pa=captcha.next&key=' + timestamp);
		window.top.codeKey2 = timestamp;
	},
	sendEmail : function() {
		var loginId = $("#txtAccount").val();
		if (cms.isNull(loginId)) {
			JsMsg.warnMsg("帐号不可为空!");
			return;
		}

		if (cms.isNull($("#txtcode").val())) {
			JsMsg.warnMsg("验证码不可为空!");
			return;
		}
		$.cloudCall({
			method : "auth.code.email.send",
			ApiPath : 'cloud',
			async : true,
			params : {
				sn : cms.getWebSn(),
				loginId : loginId,
				emailType : "2",
				captchaKey : window.top.codeKey2.toString(),
				captchaCode : $("#txtcode").val()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					if (obj.result.flag == "1") {
					   JsMsg.infoMsg("请到["+obj.result.email+"]邮箱查收重置的新密码。",{callback:function(){
						   $("#txtAccount").val("");
						   $("#txtcode").val("");
					   }});
					}else{
						JsMsg.warnMsg('找回密码失败!',{callback : function(){
							fgPwd.loadCode();
						}});
					}
				} else {
					if(obj.error.code == "700"){
						obj.error.message = loginId+"用户不存在!";
					}
					JsMsg.errorObjMsg(obj.error,{callback : function(){
							fgPwd.loadCode();
					}});
				}
			}
		});
	}

};

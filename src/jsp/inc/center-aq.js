$(function() {
	var model = cms.getLoginModel()
	$("#userId").html(model.account)
	$("#lastTime").html(model.loginLastUpdateTime)

	$(".one").find('a').click(function() {
		centerAq.showChangePwd()
	})

	$(".two").find('a').click(function() {
		centerAq.showChangeCardPwd()
	})

	$(".three").find('a').click(function() {
		centerAq.showChangeBank()
	})

	$(".four").find('a').click(function() {
		centerAq.showChangeEmail()
	})

})

jQuery.support.cors = true
var firstCount = 0
var centerAq = {
	initResetBtn : function() {
		$(".btn-wrap").find('[type="reset"]').click(function() {
			$(".floating-layer").hide()
		})
	},
	initPwdBtn : function() {
		$(".btn-wrap").find('[type="submit"]')
				.click(function() {
							var formValid = $('#pwd')
									.validform(
											{
												tiptype : function(msg, o,cssctl) {
													if (!o.obj.is("form")) {
														var objtip = o.obj.parents("dd").next().find(".Validform_checktip")
														cssctl(objtip, o.type)
														objtip.text(msg)
														var infoObj = o.obj.parents("dd").next().find(".info")
														if (o.type == 2) {
															infoObj.fadeOut(200)
														} else {
															if (infoObj.is(":visible")) {
																return
															}
															var poffset = $(".floating-layer-content").offset()
															var w = $("#oldpwd").width()
															var left = o.obj.offset().left
															var top = o.obj.offset().top
															infoObj.css({left : left+ w- 10- poffset.left,top : top- poffset.top}).show()
														}
													}
												},
												datatype : {
													"recheck_Pwd" : function(
															gets, obj, curform,
															dtype) {
														var ischeck = true
														if (!cms.isValEq(
																"newpwd", gets)) {
															ischeck = false
														}
														return ischeck
													}
												},
												callback : function(sform) {
												}
											})

							formValid.customSubmitFrom(function() {
								centerAq.onChangePwd()
							})
							return false
						})
	},
	initCardPwd : function() {
		$(".btn-wrap").find('[type="submit"]').click(function() {
			centerAq.onChangeCardPwd()
			return false
		})
	},
	initEmailSend : function() {
		$("#sendId").click(function() {
			centerAq.onSendEmail()
		})
	},
	onChangePwd : function() {
		var forms = $('.floating-layer').find('form')
		var model = forms.serializeObject()
		var newpwd = model.newpwd
		var oldpwd = model.oldpwd
		var encode = new Encode()
		var pwdModel = encode.encodePsw(oldpwd)
		var salt = pwdModel.salt
		var token = pwdModel.token
		var newpassword = encode.encodeSha1(newpwd)

		$.cloudCall({
			method : "user.password.update",
			params : {
				sessionId : cms.getToken(),
				saltedPassword : token,
				salt : salt,
				newPassword : newpassword
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					if (obj.result == "1") {
						JsMsg.infoMsg('密码修正成功,请重新登录!',{callback : function(){
								$(".floating-layer").hide()
								cms.delCookie("loginStatus")
								$.cloudCall({
									method : "auth.online.logout",
									params : {
										sessionId : cms.getToken()
									},
									success : function(obj) {}
								})
								opener.bgPage.loginOut()
								window.opener = null
								window.close()
						}})
						
					} else {
						JsMsg.warnMsg('密码修正失败!')
					}
				} else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},

	showChangePwd : function() {
		var changePwd = '<div class="floating-layer-title"><i></i>修改登入密码</div>'
		changePwd += '<div class="floating-layer-content">'
		changePwd += '<form id="pwd"><dl><dt>旧密码：</dt><dd><input name="oldpwd" id="oldpwd" style="background: #fff;color: #666;" type="password" datatype="s6-12" nullmsg="账号密码不能为空" sucmsg=" " errormsg="密码至少6个字符,最多12个字符" /></dd><dd><div class="info"><span class="Validform_checktip">密码至少6个字符,最多12个字符</span><span class="dec"><s class="dec1">&#9670;</s><s class="dec2">&#9670;</s></span></div></dd></dl>'
		changePwd += '<dl><dt>新密码：</dt><dd><input name="newpwd" id="newpwd" style="background: #fff;color: #666;" type="password" datatype="s6-12" nullmsg="账号密码不能为空" sucmsg=" " errormsg="密码至少6个字符,最多12个字符"/></dd><dd><div class="info"><span class="Validform_checktip">密码至少6个字符,最多12个字符</span><span class="dec"><s class="dec1">&#9670;</s><s class="dec2">&#9670;</s></span></div></dd></dl>'
		changePwd += '<dl><dt>确认新密码：</dt><dd><input id="newpwd2" style="background: #fff;color: #666;" name="" type="password" datatype="recheck_Pwd" nullmsg="新密码不能为空" sucmsg=" " errormsg="新密码不一致"/></dd><dd><div class="info"><span class="Validform_checktip">新密码不能为空</span><span class="dec"><s class="dec1">&#9670;</s><s class="dec2">&#9670;</s></span></div></dd></dl>'
		changePwd += '<p>*密码规则：必须为6-12位数字或英文字母，且符合0-9或a-z的字符。</p>;'
		changePwd += '<div class="btn-wrap" style="margin-top: 5px;"><input type="submit" class="btn" value="确定" /> <input name="" type="reset" class="btn" value="取消" />'
		changePwd += '</div></form></div>'

		$(".floating-layer").html("").html(changePwd).show()
		centerAq.initResetBtn()
		centerAq.initPwdBtn()
	},
	onChangeCardPwd : function() {
		var selects = $('#oldextractpwd').find('select')
		var oldextrapwd = ""
		var newextrapwd = ""
		$.each(selects, function(i) {
			oldextrapwd += $(selects[i]).val()
		})

		selects = $('#newextractpwd').find('select')
		$.each(selects, function(i) {
			newextrapwd += $(selects[i]).val()
		})
		var encode = new Encode()
		var oldpwd = encode.encodeSha1(cms.getUid()+ encode.encodeSha1(oldextrapwd))
		var newpwd = encode.encodeSha1(cms.getUid() + encode.encodeSha1(newextrapwd))

		$.cloudCall({
			method : "user.paypwd.update",
			params : {
				sessionId : cms.getToken(),
				oldPayPwd : oldpwd,
				newPayPwd : newpwd
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					if (obj.result == "1") {
						JsMsg.infoMsg('取款密码修正成功!',{callback : function(){
							$(".floating-layer").hide()
						}})
						
					} else {
						JsMsg.warnMsg('取款密码修正失败!')
					}
				} else {
					JsMsg.errorObjMsg(obj.error)
				}
				
			}
		})
	},
	loadUserEmail : function(){
		$.cloudCall({
			method : "user.profile.get",
			async : true,
			params : {
				sessionId : cms.getToken(),
				withVipData : 1
			},
			success : function(obj) {
				
				if (obj.error == null && obj.result != null) {
					$("#txtEmail").val(obj.result.email)
				} else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	onSendEmail :function(){
		if (cms.isNull($("#txtcode").val())) {
			JsMsg.warnMsg("验证码不可为空!")
			return
		}
		
		$.cloudCall({
			method : "auth.code.email.send",
			params : {
				sessionId : cms.getToken(),
				emailType : "1",
				captchaKey : window.top.codeKey3.toString(),
				captchaCode : $("#txtcode").val()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					if (obj.result.flag == "1") {
						JsMsg.infoMsg('邮箱校验成功,请到设置的邮箱查看验证链接!',{callback : function(){
							$(".floating-layer").hide()
						}})
					} else {
						JsMsg.warnMsg('邮箱校验失败!',{callback : function(){
							centerAq.loadCode()
						}})
					}
				} else {
					JsMsg.errorObjMsg(obj.error,{callback : function(){
						centerAq.loadCode()
					}})
				}
			}
		})
	},
	showChangeCardPwd : function() {
		var temp = '<option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option>'

		var changeCardPwd = '<div class="floating-layer-title"><i class="cash"></i>修改取款密码</div>'
		changeCardPwd += '<div class="floating-layer-content"><form><dl style="margin-top:20px;"><dt>旧密码：</dt><dd id="oldextractpwd">'
		changeCardPwd += '<select name="" style=" padding: 2px;">' + temp + '</select> <select name="" style=" padding: 2px;">' + temp
		changeCardPwd += '</select> <select name="" style=" padding: 2px;">' + temp + '</select> <select name="" style=" padding: 2px;">' + temp + '</select></dd></dl>'
		changeCardPwd += '<dl><dt>新密码：</dt><dd id="newextractpwd"><select name="" style=" padding: 2px;">' + temp + '</select> <select name="" style=" padding: 2px;">' + temp + '</select>'
		changeCardPwd += ' <select name="" style=" padding: 2px;">' + temp + '</select> <select name="" style=" padding: 2px;">' + temp + '</select></dd></dl>'
		changeCardPwd += '<div class="btn-wrap" style="margin-top:45px;"><input type="submit" class="btn" value="确定"  /> <input name="" type="reset" class="btn" value="取消" /></div></form></div>'

		$(".floating-layer").html("").html(changeCardPwd).show()
		centerAq.initResetBtn()
		centerAq.initCardPwd()
	},
	showChangeBank : function() {	
		$.cloudCall({
			method : "user.withdraw.account.default.get",
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var dto = obj.result
					var bankName = dto.bankName == undefined ? "---" : dto.bankName
					var bankBranch = dto.bankBranch == undefined ? "---" : dto.bankBranch
					var bankAccount = dto.bankAccount == undefined ? "---" : dto.bankAccount
					
					var changeBank = '<div class="floating-layer-title"><i class="cash-bags"></i>银行资料</div>'
					changeBank += '<div class="floating-layer-content" style="padding-top:54px;">'
					changeBank += '<table class="table" width="96%" border="0" cellspacing="0" cellpadding="0">'
					changeBank += '<tr><th width="25%" scope="col">取款银行</th><th width="24%" scope="col">银行支行名称</th>'
					changeBank += '<th width="24%" scope="col">取款账户</th></tr>'
					changeBank += '<tr><td>'+bankName+'</td><td>'+bankBranch+'</td><td>'+bankAccount+'</td></tr></table>'
					changeBank += '<div class="btn-wrap" style="margin-top:45px;"><input name="" type="reset" class="btn" value="取消" /></div></div>'

					$(".floating-layer").html("").html(changeBank).show()
					centerAq.initResetBtn()
				} else {
					JsMsg.errorObjMsg(obj.error)
				}
				
			}
		})
	},
	loadCode : function() {
		var timestamp = (new Date()).valueOf()
		$('#ftimg').attr("src",
				cms.getCloudPath() + 'api.do?pa=captcha.next&key=' + timestamp)
		window.top.codeKey3 = timestamp
	},
	showChangeEmail : function() {
		//需要拿会员邮箱地址
		var changeEmail = '<div class="floating-layer-title"><i class="mail"></i>电子邮箱地址</div>'
		changeEmail += '<div class="floating-layer-content"><form><div><input class="input" id="txtEmail" type="text" value="123@hotmail.com" disabled="disabled" style="width:200px"/> <input id="txtcode"  type="text" placeholder="请输入验证码" style="width:80px" height="21"> <img id="ftimg" src="images/code.jpg" title="点击刷新" style="margin-left: 4px;" width="60" height="21" /><i class="icon-exclamation-sign"></i>'
		changeEmail += '</div> <p class="zhushi-tc">*邮箱地址若需修改，请联系客服。</p> <div class="btn-wrap"> <a class="btn" id="sendId" href="#"><i class="send"></i>发出认证信</a> <input name="" type="reset" class="btn" value="取消" />'
		changeEmail += '</div> <div class="be-careful"><dl><dt>*请注意：</dt><dd>有些邮箱可能因系统机制造成你无法顺利收到认证信，若没收到信件请至垃圾箱寻找。 若一直无法收到认证信，请联系客服，谢谢！</dd></dl></div></form></div>'
		$(".floating-layer").html("").html(changeEmail).show()
		centerAq.loadUserEmail()
		centerAq.initResetBtn()
		centerAq.initEmailSend()
		$('#ftimg').click(function() {
			centerAq.loadCode()
		})

		$("#txtcode").focus(function() {
			if (firstCount == 0) {
				centerAq.loadCode()
				firstCount++
			}
		})
	}
}
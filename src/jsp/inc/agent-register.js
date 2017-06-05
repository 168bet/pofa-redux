var formValid

jQuery.support.cors = true
$(function() {
	agentPage.loadRulesInfo()
	agentPage.loadBankInfo()

	$('.btn-content').find("[type='submit']").click(function() {
		formValid.customSubmitFrom(function() {
			agentPage.registerAgentInfo()
		})
		return false
	})

	$('.btn-content').find("[type='reset']").click(function() {
		formValid.resetForm()
		$('#rgfrom123').find(".info").hide()
		$('#ag_account').focus()
	})

	formValid = $('#rgfrom123').find('form').validform(
			{
				datatype : {
					"AccountExistValid" : function(gets, obj, curform, dtype) {
						if (cms.isNull(gets)) {
							return false
						}
						var ischeck = agentPage.userExists(gets)
						return ischeck
					},
					"LoginExistValid" : function(gets, obj, curform, dtype) {
						var str = $(obj).val()
            			var inValid = /\s/
            			var whitespace = inValid.test(str)
						if (cms.isNull(gets)) {
							return false
						}
						$(obj).attr("errormsg","代理登录账号已经存在!")
						if(gets.length < 4){
							$(obj).attr("errormsg","请输入4-12位字符!")
							return false
						}
						if(!cms.isAcceptChars2(false,4,12,gets) || whitespace){
							$(obj).addClass("Validform_error")
                			$("#NameInfo").removeClass("Validform_right").addClass("Validform_wrong")
                			$("#NameInfo").text('帐号不可包含汉字,标点,特殊字符!')
							$(obj).attr("errormsg","帐号不可包含汉字,标点,特殊字符!")
							return false
						}
						var ischeck = agentPage.userExists(gets)
						if(ischeck){
                			$(obj).attr("errormsg", "")
                			$(obj).removeClass("Validform_error")
                			$("#NameInfo").removeClass("Validform_wrong").addClass("Validform_right")
                			$("#NameInfo").text('')
                		}
						return ischeck
					}
				},
				callback : function(sform) {
				}
			})
	$("#birthday").val("1975-01-01")
})

var agentPage = {
	getSn : function(){ return cms.getWebSn() },
	loadRulesInfo : function() {
		var inputs = $('#rgfrom123').find('input,select')
		var spans = $('#rgfrom123').find("[class='red mri7']")
		if(spans.length == 0){
			spans = $('#rgfrom123').find("[class='red-sign']")
		}
		 $.cloudCall({
			method : "sn.agent.reg.setting",
			params : {
				sn : agentPage.getSn()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var columns = []
					var datas = obj.result
					
					$.each(datas, function(i) {
						var item = datas[i]
						var note = $('#' + item.property)
						note.parent().parent().show()
						if (item.isVisible == 1) {
							if (item.isRequired == 1) {
								columns.push(item.property)
							}
						}else{
							note.parent().parent().hide()
							note.hide()
							$('#' + item.property+"-1").hide()
						}
					})

					$.each(inputs, function(i) {
						var input = inputs[i]
						var span = spans[i]
						$(span).text('')
						var id = input.id
						if (!columns.contains(id)) {
							$('#' + id).removeAttr('datatype nullmsg sucmsg errormsg')
						} else {
							$(span).text('*')
						}
					})
					
					var fms = $(".register-form")
					$.each(fms,function(i){
						var ims = $(fms[i])
						ims.show()
						var dcs = ims.find("dl")
						var dl = dcs.length
						var mms = $(this).find("dl")
						var dc = 0
						$.each(mms,function(k){
							var m = $(mms[k])
							if(m.is(":hidden")){
								dc++
							}
						})
						if(dl == dc){
							ims.hide()
						}
					})
					
				} else {
					JsMsg.errorMsg(obj.error)
				}
			}
		})
	},
	loadBankInfo : function() {
		
		$.cloudCall({
			method : "user.charge.bank.list",
			params : {
				sn : agentPage.getSn()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result
					var optionStr = "<option value='' >请选择</option>"
					$.each(datas, function(i) {
						var bankinfo = datas[i]
						var bankId = bankinfo.bankId
						var bankName = bankinfo.bankName
						optionStr += "<option value='" + bankId + "' >"
								+ bankName + "</option>"
					})
					$('#bank_id').html("").html(optionStr)
				}
			}
		})
	},// loadBankInfo end
	registerAgentInfo : function() {
		var forms = $('#rgfrom123').find('form')
		var model = forms.serializeObject()
		model.bankName = $("#bank_id").find("option:selected").text()
		model.bankId = model.bankId === "" ? null : model.bankId
		model.sn = agentPage.getSn()
		model.regChannel = document.domain
		var encode = new Encode()
		model.password = encode.encodeSha1(model.password)
		$.cloudCall({
			method : "agent.reg",
			params : model,
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					JsMsg.infoMsg("代理注册成功!",{callback : function(){
						$('.btn-content').find("[type='reset']").click()
						$('#rgfrom123').find(".info").hide()
					}})
				} else {
					JsMsg.errorMsg(obj.error)
				}
			}
		})

	},
	userExists : function(account) {
		var ischeck = true
		$.cloudCall({
			method : "auth.loginId.exists",
			async : false,
			isLoading : false,
			params : {
				loginId : account,
				sn : agentPage.getSn()
			},
			success : function(obj) {
				if (obj.error == null && obj.result.flag == 1) {
					$("#recommendUserId").val(obj.result.userId)
					ischeck = false
				}
			}
		})

		return ischeck
	},
}
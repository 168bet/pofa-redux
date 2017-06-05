$(function() {
	centerXsqkLog.loadUserinfo()
	centerXsqkLog.loadBankInfo()
	$("#submit").click(function(){centerXsqkLog.submit()})
	$("#reset").click(function(){centerXsqkLog.reset()})
})

jQuery.support.cors = true
var centerXsqkLog = {
		getSnInfo : function() {
			var sn = cms.queryString('sn')
			if (cms.isNull(sn)) {
				sn = cms.getWebSn()
			} 
			return sn
		},
		loadUserinfo : function(){
			$.cloudCall({
				method : "user.profile.get",
				params : {
					sessionId : cms.getToken(),
					withVipData : 1
				},
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						var item = obj.result
						$("#txtuser").html(item.name)
						$("#txtphone").html(item.mobile)
					} else {
						JsMsg.errorObjMsg(obj.error)
					}
				}
			})
		},
		loadBankInfo : function() {
			$.cloudCall({
				method : "user.charge.bank.list",
				params : {
					sn : centerXsqkLog.getSnInfo()
				},
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						var datas = obj.result
						var optionStr = ""
						$.each(datas, function(i) {
							var bankinfo = datas[i]
							var bankId = bankinfo.bankId
							var bankName = bankinfo.bankName
							optionStr += "<option value='" + bankId + "' >"
									+ bankName + "</option>"
						})
						$('#banks').html("").html(optionStr)
					}else{
						JsMsg.errorObjMsg(obj.error)
					}
				}
			})
		},
		submit : function(){
			if(cms.isNull($("#bankBranch").val())){
				JsMsg.warnMsg("开户银行不可为空!")
				return
			}
			if(cms.isNull($("#bankAccount").val())){
				JsMsg.warnMsg("银行账号不可为空!")
				return
			}
			if(!cms.isNum($("#bankAccount").val())){
				JsMsg.warnMsg("银行账号必须为数字!")
				return
			}
			var name = $("#txtuser").html()
			var bankid =  $("#banks").val()
			var bankname = $("#banks").find("option:selected").text()
			var bankbranch = $("#bankBranch").val()
			var bankaccount = $("#bankAccount").val()
			$.cloudCall({
				method : "user.bank.update",
				params : {
					sessionId : cms.getToken(),
					name : name,
					bankId : bankid,
			        bankName : bankname,
					bankBranch : bankbranch,
					bankAccount : bankaccount 
				},
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
					   JsMsg.infoMsg("银行帐号绑定成功!", {callback : function(){
						   cms.MGetPager('index-drawmoney-default', cms.getWebPath())
					       window.opener = null
					       window.close()
					   }})
					}else{
						JsMsg.errorObjMsg(obj.error)
					}
				}
			})
		},
		reset : function(){
			$("#bankBranch,#bankAccount").val("")
		}
}

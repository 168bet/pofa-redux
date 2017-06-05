$(function() {
	
	centerDraw2.loadAccount()
	centerDraw2.getBalance()

	$("#send").click(function() {
		cms.validateToken(function() {centerDraw2.sendDrawApply()} , { sessionId : cms.getToken() })
	})

	$("#reset").click(function() {
		$(":input").val('')
	})
	
	centerDraw2.drawTimeOut('抱歉,您的操作时间超过5分钟,请重新取款!')
})

var page = 1
var pageSize = 20
var balance = 0
var flowNum = 0
var tobankId = 0
jQuery.support.cors = true
var centerDraw2 = {
		drawTimeOut : function (title){
			var ste = setInterval(function() {existDWin()}, 1000*5*60)
			function existDWin(){
				clearInterval(ste)
				JsMsg.infoMsg(title, {
					callback : function() {
						window.location.href = 'member-center-xsqk.html'
					}
				})
			}
		},
	loadCashflowId : function(callback) {
		$.cloudCall({
			method : "user.withdraw.no.get",
			async : true,
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					flowNum = obj.result
					callback()
				}
			}
		})
	},
	loadAccount : function() {
		$.cloudCall({
			method : "user.withdraw.account.list",
			async : true,
			params : {
				sessionId : cms.getToken(),
				defaultOnly : '1'
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result[0]
					if (datas != undefined) {
						$("#topayer").html("").html(datas.bankAccountOwner)
						$("#accountid").html("").html(
								datas.bankName + "-" + datas.bankAccount)
						tobankId = datas.bankId
					}
				}else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	getBalance : function() {
		$.cloudCall({
			method : "user.balance.get",
			async : true,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					balance = obj.result.balance
					$("#balance").html(balance)
				}else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
		return balance
	},
	loadOption : function() {
		if (!cms.isDecimal2($("#amount").val())) {
			JsMsg.warnMsg("请输入正确的取款金额!")
			return
		}

		$.cloudCall({
			method : "user.withdraw.option.get",
			async : true,
			params : {
				sessionId : cms.getToken(),
				amount : $("#amount").val()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var item = obj.result
					if (item != undefined) {
						$("#tax").val(item.feeAmount.toFixed(2))
						var optionStr = "出款下限：" + item.minAmount.toFixed(2)
						if(null != item.maxAmount && 0 != item.maxAmount){
							optionStr = "出款上限：" + item.maxAmount.toFixed(2) + " 出款下限：" + item.minAmount.toFixed(2)
						}
						if(null != item.nonFeeTimes && 0 != item.nonFeeTimes){
							optionStr += " 剩余免手续费次数:"+item.nonFeeTimes
						}
						$("#option").html("").html(optionStr)
						var account = ($("#amount").val() - item.feeAmount).toFixed(2)
						$("#raccount").val(account)
					}
				}else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	sendDrawApply : function() {
		var acount = parseFloat($("#amount").val())
		if (balance < acount) {
			JsMsg.warnMsg("实际转出金额大于帐户余额无法转出!")
			return
		}

		if (cms.isNull($("#payPasword").val())) {
			JsMsg.warnMsg("请输入取款密码!")
			return
		}

		centerDraw2.loadCashflowId(function(){
			var encode = new Encode()
			var pwd = encode.encodeSha1(cms.getUid() + encode.encodeSha1($("#payPasword").val()))
			$.cloudCall({
				method : "user.withdraw.apply",
				async : true,
				params : {
					sessionId : cms.getToken(),
					withdrawNo : flowNum,
					payPasword : pwd,
					toBankId : tobankId,
					amount : acount,
					statsCacheKey : cms.getCookie("DrawStatsCacheKey")
				},
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						JsMsg.infoMsg("转出申请成功,取款单据ID:" + obj.result,{callback : function(){
							window.opener = null
							window.close()
						}})
					} else {
						JsMsg.errorObjMsg(obj.error)
					}
				}
			})
		})
	}
}
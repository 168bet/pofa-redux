$(function() {
	 var model = cms.getLoginModel()
	var tm = cms.queryString("tm")
	$("#userId1").html(model.account)
	centerPay1.setDepositBankInfo()
	centerPay1.loadBankInfo(tm)
	centerPay1.loadChargeAmount()
	
	$('#confirm').click(function() {
		return centerPay1.nextStep()
	})
	
	$('#cancel').click(function() {
		var controls = $('#banks').find('input')
		$.each(controls, function(i) {
			var radio = controls[i]
			radio.checked = false
		})
		$('#tranAmt').val(0)
	})
	
	depositTimeOut('抱歉,你操作时间超过5分钟,请重新确认最新的银行资讯!')
})

jQuery.support.cors = true
var centerPay1 = {
	 curentTime : function(y) {
			var now = new Date()
			
			var year = now.getFullYear().toString() // 年
			if(y==1){
			  year = now.getFullYear()+y
			}
			var month = now.getMonth() + 1 // 月
			var day = now.getDate() // 日
			var hh = now.getHours() // 时
			var mm = now.getMinutes() // 分
			var ss = now.getSeconds() // 秒
			var clock = year

			if (month < 10)
				clock += "0"
			clock += month
			if (day < 10)
				clock += "0"
			clock += day
			if (hh < 10)
				clock += "0"
			clock += hh
			if (mm < 10)
				clock += '0'
			clock += mm
			if (ss < 10)
				clock += '0'
			clock += ss
			return (clock)
		},
		 curentDate : function() {
				var now = new Date()
				
				var year = now.getFullYear().toString()// 年
				var month = now.getMonth() + 1 // 月
				var day = now.getDate() // 日
				var clock = year

				if (month < 10)
					clock += "0"
				clock += month
				if (day < 10)
					clock += "0"
				clock += day
				return (clock)
			},
		 curentTimeAdd : function(days) {
				var now = new Date()
				now.setDate(now.getDate() + days)
				var year = now.getFullYear().toString() // 年

				var month = now.getMonth() + 1 // 月
				var day = now.getDate() // 日
				var hh = now.getHours() // 时
				var mm = now.getMinutes() // 分
				var ss = now.getSeconds() // 秒
				var clock = year

				if (month < 10)
					clock += "0"
				clock += month.toString()
				if (day < 10)
					clock += "0"
				clock += day.toString()
				if (hh < 10)
					clock += "0"
				clock += hh.toString()
				if (mm < 10)
					clock += '0'
				clock += mm.toString()
				if (ss < 10)
					clock += '0'
				clock += ss.toString()
				return (clock)
			},
		curentTime2 : function() {
			var now = new Date()
			
			var year = now.getFullYear().toString() // 年
			var month = now.getMonth() + 1 // 月
			var day = now.getDate() // 日
			var hh = now.getHours() // 时
			var mm = now.getMinutes() // 分
			var ss = now.getSeconds() // 秒
			var clock = year+"-"

			if (month < 10)
				clock += "0"
			clock += month+"-"
			if (day < 10)
				clock += "0"
			clock += day+" "
			if (hh < 10)
				clock += "0"
			clock += hh+":"
			if (mm < 10)
				clock += '0'
			clock += mm+":"
			if (ss < 10)
				clock += '0'
			clock += ss
			return (clock)
		},	
		curentTime2Add : function(days) {
			var now = new Date()
			now.setDate(now.getDate() + days)
			var year = now.getFullYear() // 年
			var month = now.getMonth() + 1 // 月
			var day = now.getDate() // 日
			var hh = now.getHours() // 时
			var mm = now.getMinutes() // 分
			var ss = now.getSeconds() // 秒
			var clock = year+"-"

			if (month < 10)
				clock += "0"
			clock += month+"-"
			if (day < 10)
				clock += "0"
			clock += day+" "
			if (hh < 10)
				clock += "0"
			clock += hh+":"
			if (mm < 10)
				clock += '0'
			clock += mm+":"
			if (ss < 10)
				clock += '0'
			clock += ss
			return (clock)
		},	
	loadBaseUrl : function(){
		var baseUrl = "http://jqly888.com"
		return baseUrl
	},
	loadChargeAmount : function(){
		$("#txtdcouponMode").hide()
		$.cloudCall({
			method : "user.deposit.draw.setting.get",
			async : true,
			isLoading : false,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var data = obj.result
				    $("#minAmount").html(data.onlineMinChargeAmount)
				    $("#maxAmount").html(data.onlineMaxChargeAmount)
				    if(data.onlineCouponDiscardable == '1'){
				    	$("#txtdcouponMode").show()
				    }
				}else {
					JsMsg.errorMsg(obj.error)
				}
			}
		})
	},
	loadBankInfo : function(tm) {
		if (cms.checkLoginVar()) {
			var container = $('#banks')
			$.cloudCall({
						method : "sn.payment.charge.bank.list",
						async : true,
						isLoading : false,
						params : {
							sessionId : cms.getToken()
						},
						success : function(obj) {
							if (obj.error == null && obj.result != null) {
								var optionStr = ""
								bankInfos = []
								if(tm == "ali"){
									var bankId = 23
									var bankName = "支付宝"
									optionStr += '<label><input name="netbank_choose_radio" checked disabled type="radio" id="radio'
										+ bankId + '" value="' + bankId + '" class="radio" />' + bankName + '</label><div id="r' + bankId + '" style = "display:none;">' + bankName + '</div>'
								    bankInfos.push(bankinfo)
								}else if(tm == "wx"){
									var bankId = 24
									var bankName = "微信"
									optionStr += '<label><input name="netbank_choose_radio" checked disabled type="radio" id="radio'
										+ bankId + '" value="' + bankId + '" class="radio" />' + bankName + '</label><div id="r' + bankId + '" style = "display:none;">' + bankName + '</div>'
								    bankInfos.push(bankinfo)
								}else{
									var datas = obj.result
									var size = datas.length
									for (var i = 0; i < size; i++) {
										var bankinfo = datas[i]
										var bankId = bankinfo.bankId
										var bankName = bankinfo.bankName
										if(bankId == "23" || bankId == "24" ){
										}else{
											optionStr += '<label><input name="netbank_choose_radio" type="radio" id="radio'
												+ bankId + '" value="' + bankId + '" class="radio" />' + bankName + '</label><div id="r' + bankId + '" style = "display:none;">' + bankName + '</div>'
										    bankInfos.push(bankinfo)
										}
									}
								}
								container.html("").html(optionStr)
							}else {
								JsMsg.errorMsg(obj.error)
							}
						}
					})
		} 
	},
	setDepositBankInfo : function() {
		if (cms.checkLoginVar()) {
			var container = $('.online-account').find('ul')
			$.cloudCall({
				method : "user.charge.no.get",
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						$('#orderNum').val(obj.result)
					}
				}
			})

		} 
	},
	loadOption : function() {
		if (!cms.isDecimal2($("#tranAmt").val())) {
			JsMsg.warnMsg("请输入正确的取款金额!")
			return
		}

		$.cloudCall({
			method : "user.charge.option.get",
			async : true,
			isLoading : false,
			params : {
				sessionId : cms.getToken(),
				amount : $("#tranAmt").val(),
				chargeType : 2
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var item = obj.result
					if (item != undefined) {
						var optionStr = "存款优惠金额：" + item.chargeCoupon
						$("#option").html("").html(optionStr)
					}
				}else {
					JsMsg.errorObjMsg(obj.error,{
						callback : function(){
							$("#tranAmt").val("")
						}
					})
				}
			}
		})
	},
	nextStep : function() {
		var isMark = false
		var controls = $('#banks').find('input')
		$.each(controls, function(i) {
			var radio = controls[i]
			if (radio.checked) {
				isMark = true
				return false
			}
		})
		if (!isMark) {
			JsMsg.warnMsg('请选择入款银行!')
			return false
		}

		if (!cms.isDecimal2($("#tranAmt").val())) {
			JsMsg.warnMsg('请输入有效的存款金额!')
			return false
		}

		var rcontrols = $('#banks').find("[type='radio']")
		var paytype = null
		$.each(rcontrols, function(i) {
			var item = rcontrols[i]
			if (item.checked) {
				paytype = item
			}
		})

		var bankId = paytype.value
		var tranDateTime = centerPay1.curentTime()
		var orderNum = $('#orderNum').val()
		var tranAmt = $('#tranAmt').val()
		var paytypeText = $('#r' + bankId).text()
		var orderinfo = '<ul><li>订单号：' + orderNum + '</li>'
		orderinfo += '<li>存入金额：' + tranAmt + '</li>'
		orderinfo += '<li>存入时间：' + tranDateTime + '</li>'
		orderinfo += '<li>支付银行：' + paytypeText + '</li></ul>'
		$('.modal-body').html('').html(orderinfo)
        
		$('#confirm2').click(function() {
			var sn = cms.getWebSn()
			$.cloudCall({
				method : "sn.payment.charge.merchant.get",
				async : true,
				isLoading : false,
				ApiPath : 'cloud',
				params : {
					sessionId : cms.getToken(),
					chargeNo : orderNum,
					bankId : bankId,
					amount : tranAmt
				},
				success : function(obj) {
					if (obj.error == null && obj.result != null) {	
		                  var payItem = obj.result
						  var bankCode = payItem.providerBankCode
						  var providerId = payItem.providerId
						  var providerCode = payItem.providerCode
						  var digest = payItem.digest
						  var paycode = payItem.payCode
						  var payname = payItem.payName
						  var payid = payItem.payId
						  var payUrl = payItem.payUrl
                          if(payUrl == "scjgoil.com" || payUrl == "."){
						    payUrl = "jqly888.com"
						  }

						  var payterminal = payItem.payTerminal//终端号
							// 入库
							var conpon = $("#dcouponMode").is(':checked') ? 1 : 0
							$.cloudCall({
								method : "user.charge.payment.apply",
								async : true,
								params : {
									sessionId : cms.getToken(),
									chargeNo : orderNum,
									fromBankId : bankId,
									toPayId : payItem.payId,
									amount : tranAmt,
									memo : $("#memo").val(),
									couponMode : conpon,
									digest : digest,
									chargeFrom : 1
								},
								success : function(obj) {
									if (obj.error == null && obj.result != null) {
										var chargeId = obj.result
										// 判断走那个通道
										if(providerCode == 'gopay.com.cn'){  
											//goPay 3
											var model = {}
											model.tranAmt = tranAmt
											model.tranDateTime= tranDateTime
											model.orderNum = orderNum
											model.merRemark1 = chargeId
											model.merRemark2 = encodeURIComponent(digest)
											model.merchantID =  paycode
											model.virCardNoIn = '0000000001000000584'
											model.userType = '1'
											model.bankCode = bankCode
											centerPay1.gopay(model)
									    }else if(providerCode == 'baofoo.com'){
										   //baopay 5
										   var model = {}
										   model.MerchantID = paycode//商户ID
										   model.payId = payid
										   model.sn = sn
										   model.money = tranAmt
										   model.TransID = orderNum
										   model.TradeDate = tranDateTime
										   
										   model.merRemark1 = chargeId
										   model.merRemark2 = encodeURIComponent(digest)
										   model.bankCode = bankCode
										   model.Amount = "1"
										   model.ProductName = payname
										   model.Username = "baofoo"
										   model.Merchant_url = centerPay1.loadBaseUrl()+'/pay/jsp/gopay/true.jsp'
										   model.Return_url = centerPay1.loadBaseUrl()+'/pay/jsp/baopay/res.jsp'
										   model.NoticeType = "0"
										   model.bankCode = bankCode
										   model.terminalid = payterminal
										   centerPay1.baopay(model)
									   }else if(providerCode == 'sfpay.com'){
										   var model = {}
										   model.MerchantID = paycode//商户ID
										   model.payId = payid
										   model.sn = sn
										   model.money = tranAmt
										   model.TransID = orderNum
										   model.TradeDate = tranDateTime
										   
										   model.merRemark1 = chargeId
										   model.merRemark2 = encodeURIComponent(digest)
										   model.bankCode = bankCode
										   model.Amount = "1"
										   model.ProductName = payname
										   model.Username = "sfpay"
										   model.Merchant_url = 'http://'+payUrl+'/pay/jsp/gopay/true.jsp'
										   model.Return_url = 'http://'+payUrl+'/pay/jsp/sfpay/res.jsp'
										   model.NoticeType = "0"
										   model.bankCode = bankCode
										   model.terminalid = payterminal
										   centerPay1.sfpay(model)
									   }else if(providerCode == 'funbay.com'){
										   //funpay 12
										   var model = {}
										   model.partnerID = paycode
										   model.payId = payid
										   model.sn = sn
										   model.orderAmount = tranAmt
										   model.orderNo = orderNum
										   model.orderTime = centerPay1.curentTime()
										   model.failureTime = centerPay1.curentTimeAdd(90)
										   model.merRemark1 = chargeId
										   model.merRemark2 = encodeURIComponent(digest)
										   model.returnUrl = centerPay1.loadBaseUrl()+'/pay/jsp/gopay/true.jsp'
										   model.notifyUrl = centerPay1.loadBaseUrl()+'/pay/jsp/funpay/res.jsp'
										   model.referer = window.location.host
										   model.bankCode = bankCode
										   model.payUrl = payUrl
										   centerPay1.funpay(model)
									   }else if(providerCode == 'yompay.com'){
										   var model = {}
										   model.merNo = paycode
										   model.payId = payid
										   model.sn = sn
										   model.orderAmount = tranAmt
										   model.orderNo = orderNum
										   model.merRemark1 = chargeId
										   model.merRemark2 = encodeURIComponent(digest)
										   model.returnUrl = centerPay1.loadBaseUrl()+'/pay/jsp/gopay/true.jsp'
										   model.notifyUrl = centerPay1.loadBaseUrl()+'/pay/jsp/yompay/res.jsp'
										   model.referer = window.location.host
										   model.bankCode = bankCode
										   model.payUrl = payUrl
										   centerPay1.yompay(model)
									   }else if(providerCode == 'juypay.com'){
										   var model = {}
										   model.merNo = paycode
										   model.payId = payid
										   model.sn = sn
										   model.orderAmount = tranAmt
										   model.orderNo = orderNum	 
										   model.merRemark1 = chargeId
										   model.merRemark2 = encodeURIComponent(digest)
										   model.returnUrl = centerPay1.loadBaseUrl()+'/pay/jsp/gopay/true.jsp'
										   model.notifyUrl = centerPay1.loadBaseUrl()+'/pay/jsp/juypay/res.jsp'
										   model.referer = window.location.host
										   model.bankCode = bankCode
										   model.payUrl = payUrl
										   centerPay1.juypay(model)
									   }else if(providerCode == 'okfpay.com'){
										   var model = {}
										   model.merNo = paycode
										   model.payId = payid
										   model.sn = sn
										   model.orderAmount = tranAmt
										   model.orderNo = orderNum	 
										   model.merRemark1 = chargeId
										   model.merRemark2 = digest
										   model.returnUrl = centerPay1.loadBaseUrl()+'/pay/jsp/gopay/true.jsp'
										   model.notifyUrl = centerPay1.loadBaseUrl()+'/pay/jsp/okpay/res.jsp'
										   model.referer = window.location.host
										   model.bankCode = bankCode
										   model.payUrl = payUrl
										   centerPay1.okpay(model)
									   }

										  var model = {}
										  model.merNo = paycode
										  model.payId = payid
										  model.sn = sn
										  model.orderAmount = tranAmt
										  model.orderNo = orderNum	
										  model.orderTime = centerPay1.curentTime()
										  model.merRemark1 = chargeId
										  model.merRemark2 = encodeURIComponent(digest)
										  model.bankCode = bankCode
										  model.terminalid = payterminal
										  model.payUrl = payUrl
										
										
                                       if(providerCode == 'allscore.com'){
										   centerPay1.scorepay(model)
									   }else if(providerCode == 'ybpay.com'){
										   centerPay1.ybpay(model)
									   }else if(providerCode == 'fdpay.com'){
										   centerPay1.fdpay(model)
									   }else if(providerCode == 'yinbang.com'){
										   centerPay1.yinpay(model)
									   }else if(providerCode == 'gdpay.com'){
										   centerPay1.gdpay(model)
									   }else if(providerCode == 'dinpay.com'){
										    model.redoFlag = 1
										    model.orderTime = centerPay1.curentTime2()
											centerPay1.dinpay(model)
										}else if(providerCode == 'rxpay.com'){
										   centerPay1.rxpay(model)
									   }else if(providerCode == 'kdpay.com'){
										   centerPay1.kdpay(model)
									   }else if(providerCode == 'xbpay.com'){
										   centerPay1.xbpay(model)
									   }else if(providerCode == 'mopay.com'){
										   model.orderTime = centerPay1.curentDate()
										   centerPay1.mopay(model)
									   }else if(providerCode == 'thpay.com'){
										   model.orderTime = centerPay1.curentTime2Add(0)
										   centerPay1.thpay(model)
									   }else if(providerCode == 'mspay.com'){
										   model.orderTime = centerPay1.curentTime2Add(0)
										   centerPay1.mspay(model)
									   }else if(providerCode == 'xfpay.com'){
										   centerPay1.xfpay(model)
									   }else if(providerCode == 'bypay.com'){
										   centerPay1.bypay(model)
									   }else if(providerCode == 'gspay.com'){
										   model.orderTime = centerPay1.curentTime2Add(0)
										   centerPay1.gspay(model)
									   }
										
								}else {
									JsMsg.errorObjMsg(obj.error)
								}
							}
						})
					}else{
						JsMsg.errorObjMsg(obj.error)
					}
				}
			})
		})

		return true
	},
	gopay : function(obj){
		// goPay 3
		var params = "?merOrderNum=" + obj.orderNum + "&tranAmt=" + obj.tranAmt
				+ "&tranDateTime=" + obj.tranDateTime + "&merRemark1=" + obj.merRemark1
		params += "&merRemark2=" + obj.merRemark2 + "&merchantID=" + obj.merchantID
				+ "&virCardNoIn=" + obj.virCardNoIn
		params += "&bankCode=" + obj.bankCode + "&userType=" + obj.userType
		window.location.href = centerPay1.loadBaseUrl() + "/pay/jsp/gopay/sign.jsp" + params

	},

	baopay : function(obj){
		var params = "?MerchantID=" + obj.MerchantID + "&sn=" + obj.sn + "&payId=" + obj.payId
				+ "&merRemark1=" + obj.merRemark1 + "&money=" + obj.money
				+ "&TransID=" + obj.TransID
		params += "&merRemark2=" + obj.merRemark2 + "&TradeDate="
				+ obj.TradeDate + "&bankCode=" + obj.bankCode + "&ProductName="
				+ obj.ProductName +  "&Username=" + obj.Username + "&Merchant_url=" + obj.Merchant_url
				+ "&Return_url=" + obj.Return_url + "&Amount=" + obj.Amount +"&NoticeType="
				+ obj.NoticeType +"&TerminalID="+obj.terminalid
		window.location.href = centerPay1.loadBaseUrl() + "/pay/jsp/baopay/sign.jsp" + params
	},
	sfpay : function(obj){
		var params = "?MerchantID=" + obj.MerchantID + "&sn=" + obj.sn + "&payId=" + obj.payId
				+ "&merRemark1=" + obj.merRemark1 + "&money=" + obj.money
				+ "&TransID=" + obj.TransID
		params += "&merRemark2=" + obj.merRemark2 + "&TradeDate="
				+ obj.TradeDate + "&bankCode=" + obj.bankCode + "&ProductName="
				+ obj.ProductName +  "&Username=" + obj.Username + "&Merchant_url=" + obj.Merchant_url
				+ "&Return_url=" + obj.Return_url + "&Amount=" + obj.Amount +"&NoticeType="
				+ obj.NoticeType +"&TerminalID="+obj.terminalid
		window.location.href = centerPay1.loadBaseUrl() + "/pay/jsp/sfpay/sign.jsp" + params
	},
	funpay : function(obj){
		var params = "?partnerID=" + obj.partnerID + "&sn=" + obj.sn + "&payId=" + obj.payId +"&orderAmount=" + obj.orderAmount + "&orderTime=" + obj.orderTime +"&failureTime=" + obj.failureTime + "&orderNo=" + obj.orderNo
		        + "&merRemark1=" + obj.merRemark1 + "&merRemark2=" + obj.merRemark2 + "&notifyUrl="
				+ obj.notifyUrl + "&returnUrl=" + obj.returnUrl + "&referer="
				+ obj.referer  + "&bankCode=" + obj.bankCode
		window.location.href = centerPay1.loadBaseUrl() + "/pay/jsp/funpay/sign.jsp" + params
	},
	yompay : function(obj){
		 var action = centerPay1.loadBaseUrl() + "/pay/jsp/yompay/sign.jsp"
		 var form = document.createElement("form")
		   form.setAttribute("method", "post")
		   form.setAttribute("action", action)
		   form.setAttribute("target", "_self")
		   form.setAttribute("style", "display:none")
		   
		   var hiddenField = document.createElement("input") 
		   hiddenField.setAttribute("name", "NOTIFY_URL")
		   hiddenField.setAttribute("value", obj.notifyUrl)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "RETURN_URL")
		   hiddenField.setAttribute("value", obj.returnUrl)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "REFERER")
		   hiddenField.setAttribute("value", document.domain)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "MER_NO")
		   hiddenField.setAttribute("value", obj.merNo)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")   
		   hiddenField.setAttribute("name", "ORDER_AMOUNT")
		   hiddenField.setAttribute("value", obj.orderAmount)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "ORDER_NO")
		   hiddenField.setAttribute("value", obj.orderNo)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "BANK_CODE")
		   hiddenField.setAttribute("value", obj.bankCode)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "Remark1")
		   hiddenField.setAttribute("value", obj.merRemark1)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   hiddenField = document.createElement("input")   
		   hiddenField.setAttribute("name", "Remark2")
		   hiddenField.setAttribute("value", obj.merRemark2)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "SN")
		   hiddenField.setAttribute("value", obj.sn)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "PAYID")
		   hiddenField.setAttribute("value", obj.payId)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   document.body.appendChild(form)            
		   form.submit()

	},
	juypay : function(obj){
		 var action = centerPay1.loadBaseUrl() + "/pay/jsp/juypay/sign.jsp"
		 var form = document.createElement("form")
		   form.setAttribute("method", "post")
		   form.setAttribute("action", action)
		   form.setAttribute("target", "_self")
		   form.setAttribute("style", "display:none")
		   
		   var hiddenField = document.createElement("input") 
		   hiddenField.setAttribute("name", "NOTIFY_URL")
		   hiddenField.setAttribute("value", obj.notifyUrl)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "RETURN_URL")
		   hiddenField.setAttribute("value", obj.returnUrl)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "REFERER")
		   hiddenField.setAttribute("value", document.domain)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "MER_NO")
		   hiddenField.setAttribute("value", obj.merNo)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")   
		   hiddenField.setAttribute("name", "ORDER_AMOUNT")
		   hiddenField.setAttribute("value", obj.orderAmount)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "ORDER_NO")
		   hiddenField.setAttribute("value", obj.orderNo)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "BANK_CODE")
		   hiddenField.setAttribute("value", obj.bankCode)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "Remark1")
		   hiddenField.setAttribute("value", obj.merRemark1)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   hiddenField = document.createElement("input")   
		   hiddenField.setAttribute("name", "Remark2")
		   hiddenField.setAttribute("value", obj.merRemark2)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "SN")
		   hiddenField.setAttribute("value", obj.sn)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   hiddenField = document.createElement("input")  
		   hiddenField.setAttribute("name", "PAYID")
		   hiddenField.setAttribute("value", obj.payId)
		   hiddenField.setAttribute("type", "hidden")
		   form.appendChild(hiddenField)
		   document.body.appendChild(form)            
		   form.submit()

	},
	okpay : function(obj){
		 var action = centerPay1.loadBaseUrl() + "/pay/jsp/okpay/sign.jsp"
		 var form = document.createElement("form")
		   form.setAttribute("method", "post")
		   form.setAttribute("action", action)
		   form.setAttribute("target", "_self")
		   form.setAttribute("style", "display:none")
		   
		   form.appendChild(centerPay1.inputCt("MER_NO", obj.merNo))
		   form.appendChild(centerPay1.inputCt("ORDER_AMOUNT", obj.orderAmount))
		   form.appendChild(centerPay1.inputCt("ORDER_NO", obj.orderNo))
		   form.appendChild(centerPay1.inputCt("BANK_CODE", obj.bankCode))
		   form.appendChild(centerPay1.inputCt("RETURN_URL", obj.returnUrl))
		   form.appendChild(centerPay1.inputCt("NOTIFY_URL", obj.notifyUrl))
		   form.appendChild(centerPay1.inputCt("Remark1", obj.merRemark1))
		   form.appendChild(centerPay1.inputCt("Remark2", obj.merRemark2))
		   form.appendChild(centerPay1.inputCt("SN", obj.sn))
		   form.appendChild(centerPay1.inputCt("PAYID", obj.payId))
		   
		   document.body.appendChild(form)            
		   form.submit()

	},
	scorepay : function(obj){
		 obj.action = "http://"+ obj.payUrl + "/pay/jsp/scorepay/sign.jsp"
		 if(obj.bankCode == "ALIPAY"|| obj.bankCode == "WEIXIN"){
			  obj.action = "http://"+ obj.payUrl + "/pay/jsp/scorepay/scan.jsp"
			  obj.notifyUrl = "http://"+ obj.payUrl +'/pay/jsp/scorepay/res.jsp'
		  }else{
			  obj.notifyUrl = "http://"+ obj.payUrl +'/pay/jsp/gopay/true.jsp'
			   obj.returnUrl = "http://"+ obj.payUrl +'/pay/jsp/scorepay/bres.jsp'
		  }
		 
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	ybpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/ybpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/ybpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	rxpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/rxpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/rxpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	kdpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/kdpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/kdpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	xbpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/xbpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/xbpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	xfpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/xfpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/xfpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	mopay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/mopay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/mopay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	thpay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/thpay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/thpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	gspay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/gspay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/gspay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	mspay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/mspay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/mspay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	fdpay : function(obj){
		 obj.action = "http://"+obj.payUrl+"/pay/jsp/fdpay/sign.jsp"
		 obj.returnUrl = 'http://'+obj.payUrl+'/pay/jsp/gopay/true.jsp'
		 obj.notifyUrl = 'http://'+obj.payUrl+'/pay/jsp/fdpay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)		   
		 document.body.appendChild(form)            
		 form.submit()
	},
	yinpay : function(obj){
		 obj.action = "http://"+ obj.payUrl + "/pay/jsp/yinpay/sign.jsp"
		 obj.returnUrl = 'http://'+ obj.payUrl +'/pay/jsp/gopay/true.jsp'
		 obj.notifyUrl = 'http://'+ obj.payUrl +'/pay/jsp/yinpay/res.jsp' 
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	gdpay : function(obj){
		 obj.action = "http://"+ obj.payUrl + "/pay/jsp/gdpay/sign.jsp"
		 obj.returnUrl = 'http://'+ obj.payUrl +'/pay/jsp/gopay/true.jsp'
		 obj.notifyUrl = 'http://'+ obj.payUrl +'/pay/jsp/gdpay/res.jsp' 
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	dinpay : function(obj){
	  obj.action = "http://"+ obj.payUrl +  "/pay/jsp/dinpay/sign.jsp"
	  if(obj.bankCode == "ALIPAY"|| obj.bankCode == "WEIXIN"){
		  obj.action = "http://"+ obj.payUrl +  "/pay/jsp/dinpay/scan.jsp"
	  }
	  obj.returnUrl = 'http://'+ obj.payUrl +'/pay/jsp/gopay/true.jsp'
	  obj.notifyUrl = "http://"+ obj.payUrl + '/pay/jsp/dinpay/res.jsp'
	  var form = document.createElement("form")
	  centerPay1.toform(form,obj)
	  form.appendChild(centerPay1.inputCt("REDO_FLAG", obj.redoFlag))
	  document.body.appendChild(form)            
	  form.submit()
	},
	bypay : function(obj){
	   	 obj.action = "http://"+ obj.payUrl +"/pay/jsp/bypay/sign.jsp"
	   	 obj.returnUrl = 'http://'+ obj.payUrl + '/pay/jsp/gopay/true.jsp'
	   	 obj.notifyUrl = 'http://'+ obj.payUrl + '/pay/jsp/bypay/res.jsp'
		 var form = document.createElement("form")
		 centerPay1.toform(form,obj)
		 document.body.appendChild(form)            
		 form.submit()
	},
	toform : function(form,obj){
		   form.setAttribute("method", "post")
		   form.setAttribute("action", obj.action)
		   form.setAttribute("target", "_self")
		   form.setAttribute("style", "display:none")	   
		   form.appendChild(centerPay1.inputCt("PAY_URL", obj.payUrl))
		   form.appendChild(centerPay1.inputCt("MER_NO", obj.merNo))
		   form.appendChild(centerPay1.inputCt("ORDER_AMOUNT", obj.orderAmount))
		   form.appendChild(centerPay1.inputCt("ORDER_NO", obj.orderNo))
		   form.appendChild(centerPay1.inputCt("BANK_CODE", obj.bankCode))
		   form.appendChild(centerPay1.inputCt("RETURN_URL", obj.returnUrl))
		   form.appendChild(centerPay1.inputCt("NOTIFY_URL", obj.notifyUrl))
		   form.appendChild(centerPay1.inputCt("Remark1", obj.merRemark1))
		   form.appendChild(centerPay1.inputCt("Remark2", obj.merRemark2))
		   form.appendChild(centerPay1.inputCt("SN", obj.sn))
		   form.appendChild(centerPay1.inputCt("PAYID", obj.payId))
		   form.appendChild(centerPay1.inputCt("ORDER_TIME", obj.orderTime))
		   form.appendChild(centerPay1.inputCt("Terminalid", obj.terminalid))
		   form.appendChild(centerPay1.inputCt("REFERER", document.domain))
	},
	inputCt : function(k,v){
		var hiddenField = document.createElement("input") 
	    hiddenField.setAttribute("name", k)
		hiddenField.setAttribute("value", v)
		hiddenField.setAttribute("type", "hidden")
		return hiddenField
	}
	
	

}
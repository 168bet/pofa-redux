$(function() {
	$(".btn-con").find("[type='submit']").click(function() {
		window.location.href = 'member-center-paragraph.html'
	})

	$(".btn-con").find("[type='reset']").click(function() {
		window.opener = null
		window.close()
	})

	$("#bo1").click(function() {
		var text = $("#bo1").text()
		if (text == '显示实际有效投注额') {
			$("#bo1").html("").html('隐藏实际有效投注额')
			$(".bo11").show()
		} else {
			$("#bo1").html("").html('显示实际有效投注额')
			$(".bo11").hide()
		}
		centerDraw.loadTableCss()
	})

	$("#bo2").click(function() {
		var text = $("#bo2").text()
		if (text == '显示优惠稽核') {
			$("#bo2").html("").html('隐藏优惠稽核')
			$(".bo2").show()
		} else {
			$("#bo2").html("").html('显示优惠稽核')
			$(".bo2").hide()
		}
		centerDraw.loadTableCss()
	})

	centerDraw.loadWithdraw()
})

var page = 1
var pageSize = 20
jQuery.support.cors = true
var centerDraw = {
	loadTableCss : function() {
		var text1 = $("#bo1").text()
		var text2 = $("#bo2").text()
		if (text1 == '显示实际有效投注额' && text2 == '显示优惠稽核') {
			$(".main-list").find("table").removeClass(
					"table-list table-list-short").addClass(
					'table-list table-list-short')
		} else {
			$(".main-list").find("table").removeClass(
					"table-list table-list-short").addClass('table-list')
		}
	},
	loadWithdraw : function() {
		$.cloudCall({
					method : "user.audit.about.current.get",
					async : true,
					params : {
						sessionId : cms.getToken()
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							var entity = obj.result
							$("#couponCutAmount").html("").html(entity.couponCutAmount)
							$("#auditCutAmount").html("").html(entity.auditCutAmount)
							$("#auditCutPercent").html("").html(entity.auditCutPercent + "%")
							$("#totalCutAmount").html("").html(entity.totalCutAmount)
							$("#totalOrderAmount").html("").html(entity.totalOrderAmount)
							$("#withdrawTime").html("").html(entity.withdrawTime)
							if(entity.couponBetAudited == 1){
								$("#couponBetAudited").html("通过优惠稽核，无需扣除存款优惠")
							}else{
								$("#couponBetAudited").html("未通过优惠稽核，需扣除存款优惠")
							}
							if(entity.auditBetAudited == 1){
								$("#auditBetAudited").html("达到常态性稽核！无需扣除")
							}else{
								$("#auditBetAudited").html("未达常态性稽核！需扣除")
							}
							var items = entity.items
							cms.setCookie("DrawStatsCacheKey", entity.statsCacheKey)
							var dtoStr = ""
							$.each(items,
										function(i) {
												var item = items[i]
												dtoStr += '<tr><td class="nobo">起始:' + item.chargeStartTime + '<br /></td><td rowspan="2">' + item.chargeAmount + '</td><td rowspan="2">' + item.couponAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo11" style="display:none;">' + item.sportOrderAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo11" style="display:none;">' + item.lotteryOrderAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo11" style="display:none;">' + item.videoOrderAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo11" style="display:none;">' + item.gameOrderAmount + '</td>'
												
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ item.sportBetAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ centerDraw.displayConvert(item.sportBetAudited) + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ item.lotteryBetAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ centerDraw.displayConvert(item.lotteryBetAudited) + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ item.videoBetAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ centerDraw.displayConvert(item.videoBetAudited)+ '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ item.gameBetAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ centerDraw.displayConvert(item.gameBetAudited)+ '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">'+ item.couponBetAmount + '</td>'
												dtoStr += '<td rowspan="2" class="bo2" style="display:none;">' + centerDraw.displayConvert(item.couponBetAudited) + '</td>'

												dtoStr += '<td rowspan="2">' + item.auditBetAmountStand + '</td>'
												dtoStr += '<td rowspan="2">' + item.auditRelaxAmount + '</td>'
												dtoStr += '<td rowspan="2">' + centerDraw.displayConvert(item.auditBetAudited) + '</td>'
												dtoStr += '<td rowspan="2">' + centerDraw.displayCutFee(item.auditCutFeeFlag) + '</td>'
												dtoStr += '<td rowspan="2"><font style="color:red">'+ item.auditCutAmount+ '</font></td></tr>'

												dtoStr += '<tr><td>结束:'+ item.chargeEndTime+ '</td></tr>'
											})
							$("#dtoList").html("").html(dtoStr)
						} else {
							JsMsg.errorObjMsg(obj.error)
						}
					}
				})
	},
	displayConvert : function(imark) {
		var temp = ''
		if (imark == 1) {
			temp = '<font style="color:green">是</font>'
		} else if (imark == 0) {
			temp = '<font style="color:red">否</font>'
		} else if (imark == 3) {
			temp = '不需要稽核'
		} else {
			temp = '-'
		}
		return temp
	}
	,
	displayCutFee : function(imark) {
		var temp = ''
		if (imark == 1) {
			temp = '<font style="color:green">需要</font>'
		} else if (imark == 0) {
			temp = '<font style="color:red">不需要</font>'
		}  else {
			temp = '-'
		}
		return temp
	}
}
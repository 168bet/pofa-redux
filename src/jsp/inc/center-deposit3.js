var sn = cms.getWebSn();
var deposit = opener.window.top.depositInfo;
var bankInfo = opener.window.top.bankInfo;

window.top.loginOutBySn = function(sn) {
	window.location.href = '/skins/' + sn + '/index.html';
}

jQuery.support.cors = true;
$(function() {
	bgDeposit3.setDepositBankInfo();
	bgDeposit3.setBankPic();
    bgDeposit3.loadChargeAmount();
    
	$('.sumbBtn').find("[class='btn btn-primary btn-lg']").click(function() {
		return bgDeposit3.submitBtn();
	});
	
	$('.Wdate').val(bgSetTime.getMdTime());
	
	$('.modal-footer').find("[class='btn btn-primary']").click(
			function() {
				var rcontrols = $('#dtypes').find("[type='radio']");
				var paytype = null;
				$.each(rcontrols, function(i) {
					var item = rcontrols[i];
					if (item.checked) {
						paytype = item;
					}
				});
				var conpon = $("#dcouponMode").is(':checked') ? 1 : 0;
				$.cloudCall({
							method : "user.charge.transfer.apply",
							params : {
								sessionId : cms.getToken(),
								chargeNo : $('#orderNum').val(),
								fromBankId : bankInfo.bankId,
								toAccountId : deposit.toAccountId,
								amount : $('#amount').val(),
								transferTime : $('.Wdate').val(),
								fromAccountOwner : $('#username').val(),
								couponMode : conpon,
								memo : $("#memo").val(),
								fromChannel : paytype.value
							},
							success : function(obj) {
								if (obj.error == null && obj.result != null) {
									var paytypeText = $('#r' + paytype.value).text();
									var dinfo = '<li>存入银行：<strong>'+ deposit.bankName+ '/'+ deposit.receiver+ '/'+ deposit.receiveAccount+ '</strong></li>';
									dinfo += '<li>存入金额：<strong>'+ $('#amount').val()+ '</strong></li>';
									dinfo += '<li>存入时间：<strong>'+ $('.Wdate').val()+ '</strong></li>';
									dinfo += '<li>您使用的银行：<strong>'+ bankInfo.bankName+ '</strong></li>';
									dinfo += '<li>存款人姓名<strong>：'+ $('#username').val()+ '</strong></li>';
									dinfo += '<li>存款方式：<strong>'+ paytypeText+ '</strong></li>';
									dinfo += ' <li>订单号：<strong>'+ $('#orderNum').val()+ '</strong></li>';
									dinfo += ' <li>备注：<strong>'+ $("#memo").val()+ '</strong></li>';
									opener.window.top.depositResult = dinfo;
									window.location.href = 'member-center-step4.html';
								} else {
									JsMsg.errorObjMsg(obj.error);
								}
							}
						});

			});
	
	depositTimeOut('抱歉,你操作时间超过5分钟,请重新确认最新的银行资讯!');
});

var bgDeposit3 = {
	setBankPic : function() {
		var pictureName = bankInfo.pictureName
		$(".data-one").find("[class='bank-logo bank-icbc']").css('background',
				'url(../../../images/bank/' + pictureName + '.jpg)').click(
				function() {
					window.open(bankInfo.bankUrl, "_blank");
				});
	},
	loadChargeAmount : function(){
		$("#txtdcouponMode").hide();
		$.cloudCall({
			method : "user.deposit.draw.setting.get",
			async : true,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var data = obj.result;
					var str = "最高存款金额:"+data.maxChargeAmount+";最低存款金额:"+data.minChargeAmount;
				    $("#mmAmount").html(str);
				    if(data.couponDiscardable == '1'){
				    	$("#txtdcouponMode").show();
				    }
				}else {
					JsMsg.errorMsg(obj.error);
				}
			}
		});
	},
	loadOption : function() {
		if (!/^(0|[1-9]\d*)?$/.test($("#amount").val())) {
			JsMsg.warnMsg("请输入正确的取款金额!");
			return;
		}

		$.cloudCall({
			method : "user.charge.option.get",
			async : true,
			params : {
				sessionId : cms.getToken(),
				amount : $("#amount").val(),
				chargeType : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var item = obj.result;
					if (item != undefined) {
						var optionStr = "优惠金额：" + item.chargeCoupon;
						$("#option").html("").html(optionStr);
					}
				}else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});
	},
	setDepositBankInfo : function() {
			var container = $('.online-account').find('ul');
			$.cloudCall({
				method : "user.charge.no.get",
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						//<a href="#">点选复制</a>
						var dinfo = '<h2>选择银行已完成！以下是您欲转帐的银行帐户资料。</h2>';
						dinfo += '<dl><dt>银行：' + deposit.bankName + '</dt><dd></dd></dl>';
						dinfo += '<dl><dt>收款人：' + deposit.receiver + '</dt><dd></dd></dl>';
						dinfo += '<dl><dt>开户行网点：' + deposit.bankBranch + '</dt><dd></dd></dl>';
						dinfo += '<dl><dt>帐号：' + deposit.receiveAccount + '</dt><dd></dd></dl>';
						dinfo += '<dl><dt>订单号：' + obj.result + '</dt><dd></dd></dl>';
						dinfo += '<p>*请备份订单号，并复制进您的工作汇款备注栏</p>';
						$('#data1').html('').html(dinfo);
						$('#orderNum').val(obj.result);
					}
				}
			});
		
	},
	submitBtn : function() {
		var rcontrols = $('#dtypes').find("[type='radio']");
		var paytype = null;
		$.each(rcontrols, function(i) {
			var item = rcontrols[i];
			if (item.checked) {
				paytype = item;
			}
		});
		if(cms.isNull($('#amount').val()) || !cms.isDecimal2($('#amount').val())){
			JsMsg.warnMsg('请输入正确格式的存入金额!')
			return false;
		}
		if(cms.isNull($('#username').val())){
			JsMsg.warnMsg('存款人姓名不可为空!')
			return false;
		}
		if (paytype == null) {
			JsMsg.warnMsg('请选择存款方式!')
			return false;
		}
		var paytypeText = $('#r' + paytype.value).text();
		var orderinfo = '<ul><li>订单号：' + $('#orderNum').val() + '</li>';
		orderinfo += '<li>存入金额：' + $('#amount').val() + '</li>';
		orderinfo += '<li>存入时间：' + $('.Wdate').val() + '</li>';
		orderinfo += '<li>存款人姓名：' + $('#username').val() + '</li>';
		orderinfo += '<li>存款方式：' + paytypeText + '</li></ul>';
		$('.modal-body').html('').html(orderinfo);

		
		return true;
	}

};

var sn = cms.getWebSn();
var depositInfos = [];
$(function() {
	$(".sumbBtn").find("[href='member-center-step3.html']").click(function() {
		return bgDeposit2.nextStep();
	});
	bgDeposit2.loadDepositBankInfo();
	depositTimeOut('抱歉,您的操作时间超过5分钟,请重新确认最新的银行资讯!');
});

window.top.loginOutBySn = function(sn) {
	window.location.href = '/skins/' + sn + '/index.html';
}

jQuery.support.cors = true;
var bgDeposit2 = {
	loadDepositBankInfo : function() {
		if (cms.checkLoginVar()) {
			var container = $('.online-account').find('ul');
			$.cloudCall({
						method : "layer.deposit.to.account.list",
						async : true,
						params : {
							sessionId : cms.getToken()
						},
						success : function(obj) {
							if (obj.error == null && obj.result != null) {
								var datas = obj.result;
								depositInfos = [];
								var optionStr = "";
								$.each(datas,function(i) {
													var deposit = datas[i];
													optionStr += '<li><label> <input type="radio" name="radio_icbc" id="radio_icbc" value="' + deposit.toAccountId + '" class="radio"/>';
													optionStr += ' <div class="address" ><span>银行：<strong>' + deposit.bankName + '</strong></span><br /> ';
													optionStr += '<span>收款人：<strong>' + deposit.receiver + '</strong></span><br /> ';
													optionStr += '<span>开户行网点：<strong>' + deposit.bankBranch + '</strong></span><br /> ';
													optionStr += '<span>账号：<strong>' + deposit.receiveAccount + '</strong></span>';
													optionStr += !deposit.qrcodeBase64Data ? '' : '<img src="' + deposit.qrcodeBase64Data + '" style="display:inline-block;margin-left:100px;width:110px;position:absolute;margin-top:-75px;" />';
													optionStr += '</div></label></li>';
													depositInfos.push(deposit);
												});

								container.html("").html(optionStr);

								var controls = $('.online-account').find('ul').find('input');
								$.each(controls,
												function(i) {
													var radio = controls[i];
													if (opener.window.top.depositInfo != null
															&& opener.window.top.depositInfo.toAccountId == radio.value) {
														radio.checked = true;
													}
												});
							}else {
								JsMsg.errorObjMsg(obj.error);
							}
						}
					});
		} else {
			window.top.loginOutBySn(sn);
		}
	},
	nextStep : function() {
		var isMark = false;
		opener.window.top.depositInfo = null;
		var controls = $('.online-account').find('ul').find('input');
		$.each(controls, function(i) {
			var radio = controls[i];

			if (radio.checked) {
				isMark = true;
				$.each(depositInfos, function(k) {
					var item = depositInfos[k];
					if (radio.value == item.toAccountId) {
						opener.window.top.depositInfo = item;
						return false;
					}
				});

				return false;
			}
		});
		if (!isMark) {
			JsMsg.warnMsg('请选择转入银行帐号!');
		}
		return isMark;
	}

};
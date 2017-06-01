var sn = cms.getWebSn();

var bankInfos = [];
$(function() {
	$('.sumbBtn').find('a').click(function() {
		return bgDeposit.nextStep();
	});

	bgDeposit.loadBankInfo();
	depositTimeOut('抱歉,您的操作时间超过5分钟,请重新确认最新的银行资讯!');
});

window.top.loginOutBySn = function(sn) {
	window.location.href = '/skins/' + sn + '/index.html';
}

jQuery.support.cors = true;
var bgDeposit = {
	loadBankInfo : function() {
		if (cms.checkLoginVar()) {
			var container = $('.online-account').find('ul');
			$.cloudCall({
						method : "user.charge.bank.list",
						async : true,
						params : {
							sessionId : cms.getToken()
						},
						success : function(obj) {
							if (obj.error == null && obj.result != null) {
								var datas = obj.result;
								bankInfos = [];
								var size = datas.length;
								//因客戶需求 wechat和支付寶放入會員中心選擇使用銀行的前兩個位置
								var optionStr = "";
								var weChatStr = '';
								var payStr = '';
								for (var i = 0; i < size; i++) {
									var bankinfo = datas[i];
									var bankId = bankinfo.bankId;
									var pictureName = bankinfo.pictureName;
									var bankName = bankinfo.bankName;

									if( bankId != '23' || bankId != '24' ){
										optionStr += '<li><label><input type="radio" name="netbank_choose_radio" id="radio_'+ bankId+ '" value="'+ bankId+ '" class="radio">';
										optionStr += '<span  style=" width: 145px; border: 1px solid #ddd; vertical-align: top; cursor: pointer; display: inline-block; ';
										optionStr += 'position: relative; height: 33px;overflow: hidden; line-height: 999px; vertical-align: top;';
										optionStr += 'background: #fff url(../../../images/bank/' + pictureName + '.jpg) no-repeat;" title="' + bankName + '">' + bankName + '</span> </label></li>';
									}

									if( bankId == '24' ){
										weChatStr += '<li><label><input type="radio" name="netbank_choose_radio" id="radio_'+ bankId+ '" value="'+ bankId+ '" class="radio">';
										weChatStr += '<span  style=" width: 145px; border: 1px solid #ddd; vertical-align: top; cursor: pointer; display: inline-block; ';
										weChatStr += 'position: relative; height: 33px;overflow: hidden; line-height: 999px; vertical-align: top;';
										weChatStr += 'background: #fff url(../../../images/bank/' + pictureName + '.jpg) no-repeat;" title="' + bankName + '">' + bankName + '</span> </label></li>';
									}

									if( bankId == '23' ){
										payStr += '<li><label><input type="radio" name="netbank_choose_radio" id="radio_'+ bankId+ '" value="'+ bankId+ '" class="radio">';
										payStr += '<span  style=" width: 145px; border: 1px solid #ddd; vertical-align: top; cursor: pointer; display: inline-block; ';
										payStr += 'position: relative; height: 33px;overflow: hidden; line-height: 999px; vertical-align: top;';
										payStr += 'background: #fff url(../../../images/bank/' + pictureName + '.jpg) no-repeat;" title="' + bankName + '">' + bankName + '</span> </label></li>';
									}

									bankInfos.push(bankinfo);
								}

								optionStr = weChatStr + payStr + optionStr;

								container.html("").html(optionStr);
								// Returns the selected has recorded data
								var controls = $('.online-account').find('ul').find('input');
								$.each(controls,function(i) {
													var radio = controls[i];
													if (opener.window.top.bankInfo != null
															&& opener.window.top.bankInfo.bankId == radio.value) {
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
		opener.window.top.bankInfo = null;
		var controls = $('.online-account').find('ul').find('input');
		$.each(controls, function(i) {
			var radio = controls[i];
			if (radio.checked) {
				isMark = true;
				$.each(bankInfos, function(k) {
					var item = bankInfos[k];
					if (radio.value == item.bankId) {
						opener.window.top.bankInfo = item;
						return false;
					}
				});

				return false;
			}
		});
		if (!isMark) {
			JsMsg.warnMsg('请选择入款银行!');
		}
		return isMark;
	}

};
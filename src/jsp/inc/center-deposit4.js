var sn = cms.getWebSn()
var deposit = opener.window.top.depositInfo
var bankInfo = opener.window.top.bankInfo
var depositResult = opener.window.top.depositResult

$(function() {
	$('.data-one').find("ul").html('').html(depositResult)
	$('.sumbBtn').find('a').click(function(){
		window.opener = null
		window.close()
	})
})



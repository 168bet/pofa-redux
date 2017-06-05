$(function() {
    centerWxali1.initData()
})

jQuery.support.cors = true
var firstCount = 0
var centerWxali1 = {
	initData : function() {
		$("#txszfw,#xsck4,txszfa,#xsck5,#hwx,#hali").hide()
		$.cloudCall({
			method : "sn.payment.charge.bank.list",
			async : true,
			isLoading : false,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result
					var size = datas.length
					var optionStr = ""

					$.each(datas,function(i){
						var bankinfo = datas[i]
						var bid = bankinfo.bankId
						if(bid == "23"){
							$("#hali,#txszfa,#xsck5").show()		
						}else if(bid == "24"){
							$("#hwx,#txszfw,#xsck4").show()
						}
					})
				}
			}
		})
	}

}
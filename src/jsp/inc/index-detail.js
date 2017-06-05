$(function() {
	indexDetail.linkInit()
	var ntype = cms.queryString('ntype')
	indexDetail.sethover(ntype)
	
})
jQuery.support.cors = true
var indexDetail = {
	sethover : function(ntype){
		var tStr = ""
		if (ntype == 1){
			tStr = "彩票公告"
		}else if (ntype == 2) {
			tStr = "视讯公告"
		} else if (ntype == 3) {
			tStr = "体育公告"
		} else if (ntype == 4) {
			tStr = "电游公告"
		}
		var aobjs = $('.activity-nav').find("a")
		aobjs.removeClass("hover")
		$.each(aobjs,function(k){
			var a = aobjs[k]
			var trgtxt = a.text
			if(trgtxt == tStr){
				$(a).addClass("hover")
				indexDetail.loadNoticeData(ntype)
			}
		})
	},
	linkInit : function(){
		var aobj = $('.activity-nav').find("a")
		 aobj.click(function() {
	        	aobj.removeClass("hover")
	        	$(this).addClass("hover")
				var trgtxt = this.text
				var ntype = 0
				if (trgtxt == "彩票公告"){
					ntype = 1
				}else if (trgtxt == "视讯公告") {
					ntype = 2
				} else if (trgtxt == "体育公告") {
					ntype = 3
				} else if (trgtxt == "电游公告") {
					ntype = 4
				}
				indexDetail.loadNoticeData(ntype)
			})
	},
	loadNoticeData : function(ntype) {
		var params = {
				current : 0,
				popupFlag : "N",
				noticeFrom : ntype,
				pageIndex : 1,
				pageSize  : 5
			}
		
		$.cloudCall({
			method : "notice.system.query",
			params : params,
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var dObj = $("#snotice")
					var datas = obj.result.items
					var liStr = ""
					$.each(datas, function(i) {
						var item = datas[i]
						var conStr = "<dl>"
						var content = JSON.parse(item.content)
						if (content != undefined) {
						  conStr +='<dt>'+item.createTime+'</dt><dd>'+content.contentZh+'</dd>'
						}
						liStr += conStr+"</dl>"

					})
					if (liStr == "") {
						dObj.html('<dl>无任何公告。</dl>')
					}else{
						dObj.html(liStr)
					}
				} else {
					JsMsg.errorMsg(obj.error)
				}
			}
		})

	}
}
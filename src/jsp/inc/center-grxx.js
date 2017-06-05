
$(function() {
	$("#emptyData").show()
	centerGrxx.initData()
})

jQuery.support.cors = true
var centerGrxx = {
	initData : function() {
		$.cloudCall({
			method : "user.notice.list",
			params : {
				sessionId : cms.getToken(),
				popupFlag : "N"
			},
			success : function(obj) {
				$("#emptyData").hide()
				if (obj.error == null && obj.result != null) {
                  var datas = obj.result
                  var dtoStr = ""
                  $.each(datas,function(i){
                	  var item = datas[i]
                	  var conStr = ""  
                	  var content = JSON.parse(item.content)
						if (content != undefined) {
							var dto = content
							conStr = dto.contentZh
						    //dto.contentTw dto.contentEn
						}
                	  dtoStr += '<tr><td>'+item.createTime+'</td><td>'+centerGrxx.convertData(item.noticeFrom)+'</td><td>'+conStr+'</td></tr>'
                  })
                  $('#dtoList').html("").html(dtoStr)
                  
                  if (dtoStr == "") {
          			$("#emptyData").show()
          		}
				} else {
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	convertData : function(o){
		var result = ""
		if(o=="1"){
			result = "彩票"
		}else if(o=="2"){
			result = "视讯"
		}else if(o=="3"){
			result = "体育"
		}else if(o=="4"){
			result = "电游"
		}else if(o=="0"){
			result = "系统"
		}
		return result
	}
}

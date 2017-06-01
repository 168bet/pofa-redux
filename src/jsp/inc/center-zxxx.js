
$(function() {
	$("#emptyData").show();
	centerNotice.loadSnNewNoticeData();
	centerNotice.initLi();

});

var page = 1;
var pageSize = 20;
jQuery.support.cors = true;
var centerNotice = {
	initLi : function(){
		var licontrols = $(".mc-title").find("li");
		var ul = $(".mc-title").find("ul");
		licontrols.click(function() {
			var oldText = $(".mc-title").find("[class='current']").html();
			var curText = $(this).text();
			if (oldText == curText)
				return;
			if (curText == "最新消息") {
				$(ul).html('<li class="current">最新消息</li><li style="margin-top:19px;"><a href="javascript:;">历史讯息</a></li>');
				centerNotice.loadSnNewNoticeData();
			} else if (curText == "历史讯息") {
				$(ul).html('<li style="margin-top:19px;"><a href="javascript:;">最新消息</a></li><li class="current">历史讯息</li>');
				centerNotice.loadSnHistoryNoticeData();
			} 
			centerNotice.initLi();
		});
	},
	loadSnNewNoticeData : function() {
		$.cloudCall({
			method : "sn.notice.new.query",
			isLoading : false,
			params : {
				sessionId : cms.getToken(),
				popupFlag : "N",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				$("#emptyData").hide();
				if (obj.error == null && obj.result != null) {
					var dtoStr = "";
					var datas = obj.result;
					page = datas.page;
					pageSize = datas.pageSize;
					$(".trade-drop").hide();
                    if(datas.items.length > 0 ){
                    	$(".trade-drop").show();
						var pageTemp = parseInt(datas.total / datas.pageSize)
								+ ((datas.total % datas.pageSize) > 0 ? 1 : 0);
						var pageStr = "";
						for (var i = 0; i < pageTemp; i++) {
							var pstep = (i + 1);
							var sel = "";
							if (page == pstep)
								sel = "selected='selected'";
							pageStr += "<option " + sel + ">" + pstep + "</option>"
						}
						$("#page").html("").html(pageStr);
						$("#pageCount").html("").html("/ " + pageTemp + " 页");
                    }
                  
					var dtoList = datas.items;

					$("#dtoList").html("");
					$.each(dtoList, function(i) {
						var entity = dtoList[i];
					    var conStr = "";
						var content = JSON.parse(entity.content);
						if (content != undefined) {
							var dto = content;
							conStr = dto.contentZh;
						    //dto.contentTw dto.contentEn
							
						}
						dtoStr += "<tr><td align='center'>" + entity.createTime+ "</td><td>"+centerNotice.convertData(entity.noticeFrom)+"</td><td align='left'>" + conStr+ "</td></tr>";
					});

					$('#dtoList').html("").html(dtoStr);

					if (dtoStr == "") {
						$("#emptyData").show();
					}
				} else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});

	},
	loadSnHistoryNoticeData : function() {
		$.cloudCall({
			method : "sn.notice.history.query",
			isLoading : false,
			params : {
				sessionId : cms.getToken(),
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				$("#emptyData").hide();
				if (obj.error == null && obj.result != null) {
					var dtoStr = "";
					var datas = obj.result;
					page = datas.page;
					pageSize = datas.pageSize;
					$(".trade-drop").hide();
                    if(datas.items.length > 0 ){
	                    	$(".trade-drop").show();
						var pageTemp = parseInt(datas.total / datas.pageSize)
								+ ((datas.total % datas.pageSize) > 0 ? 1 : 0);
						var pageStr = "";
						for (var i = 0; i < pageTemp; i++) {
							var pstep = (i + 1);
							var sel = "";
							if (page == pstep)
								sel = "selected='selected'";
							pageStr += "<option " + sel + ">" + pstep + "</option>"
						}
						$("#page").html("").html(pageStr);
						$("#pageCount").html("").html("/ " + pageTemp + " 页");
                    }
					var dtoList = datas.items;

					$("#dtoList").html("");
					$.each(dtoList, function(i) {
						var entity = dtoList[i];
					    var conStr = "";
					    var content = JSON.parse(entity.content);
						if (content != undefined) {
							var dto = content;
							conStr = dto.contentZh;
						    //dto.contentTw dto.contentEn
						}
						dtoStr += "<tr><td align='center'> 起始:" + entity.startTime +"<br /> 截止:"+ entity.endTime + "</td><td>"+centerNotice.convertData(entity.noticeFrom)+"</td><td align='left'>" + conStr+ "</td></tr>";
					});

					$('#dtoList').html("").html(dtoStr);

					if (dtoStr == "") {
						$("#emptyData").show();
					}
				} else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});

	},
	onChange : function(obj) {
		page = $(obj).val();
		centerNotice.loadSysNoticeData();
	},
	convertData : function(o){
		var result = "";
		if(o=="1"){
			result = "彩票";
		}else if(o=="2"){
			result = "视讯";
		}else if(o=="3"){
			result = "体育";
		}else if(o=="4"){
			result = "电游";
		}else if(o=="0"){
			result = "系统";
		}
		return result;
	}
};
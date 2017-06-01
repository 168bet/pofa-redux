$(function() {
	setTimeout(function(){
	 indexNotice.loadNoticeData();
	}, 800);
});
jQuery.support.cors = true;
var indexNotice = {
	loadNoticeData : function() {
		var params = {
				current : 0,
				popupFlag : "N",
				pageIndex : 1,
				pageSize  : 1
			};
		
		$.cloudCall({
			method : "notice.system.query",
			params : params,
			isLoading : false,
			success : function(obj) {
				var an = $(".news").find("a");
				if (obj.error == null && obj.result != null) {
					var datas = obj.result.items;
					var liStr = "";
					$.each(datas, function(i) {
						var item = datas[i];
						var conStr = "";
						var content = JSON.parse(item.content);
						var noticeFrom = item.noticeFrom;
						if (content != undefined) {
							var dto = content;
							conStr = dto.contentZh.length > 100 ? dto.contentZh.substring(0,100)+"..." : dto.contentZh;
						}
						var url = 'announcement.html?ntype='+noticeFrom;
						an.attr("href",url);
						liStr += conStr ;

					});
					if (liStr == "") {
						an.html('<div> <h3><a href="#">无任何公告。</a></h3></div>');
					}else{
						an.html(liStr);
					}
				} else {
					JsMsg.errorMsg(obj.error);
				}
			}
		});

	}
};
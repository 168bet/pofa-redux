$(function() {
	var sn = cms.getWebSn();
	var ul = $(".mc-title").find("ul");
		if(sn == "aq00") {
		ul.html('<li class="current">彩票讯息</li>');
	}else {
		ul.html('<li class="current">彩票讯息</li><li style="margin-top:19px;"><a href="javascript:;">视讯讯息</a></li><li style="margin-top:19px;"><a href="#">体育讯息</a></li><li style="margin-top:19px;"><a href="#">电游讯息</a></li>');
	}
	gameNotice.initLi();
	gameNotice.loadLotteryNoticeData();
});

var page = 1;
var pageSize = 20;
jQuery.support.cors = true;
var gameNotice = {	
	initLi : function(){
		var licontrols = $(".mc-title").find("li");
		var ul = $(".mc-title").find("ul");
		licontrols.click(function() {
			var oldText = $(".mc-title").find("[class='current']").html();
			var curText = $(this).text();
			if (oldText == curText)
				return;
			if (curText == "彩票讯息") {
				$(ul).html('<li class="current">彩票讯息</li><li style="margin-top:19px;"><a href="javascript:;">视讯讯息</a></li><li style="margin-top:19px;"><a href="#">体育讯息</a></li><li style="margin-top:19px;"><a href="#">电游讯息</a></li>');
				gameNotice.loadLotteryNoticeData();
			} else if (curText == "视讯讯息") {
				$(ul).html('<li style="margin-top:19px;"><a href="javascript:;">彩票讯息</a></li><li class="current">视讯讯息</li><li style="margin-top:19px;"><a href="#">体育讯息</a></li><li style="margin-top:19px;"><a href="#">电游讯息</a></li>');
				gameNotice.loadVideoNoticeData();
			} else if (curText == "体育讯息") {
				$(ul).html('<li style="margin-top:19px;"><a href="javascript:;">彩票讯息</a></li><li style="margin-top:19px;"><a href="javascript:;">视讯讯息</a></li><li class="current">体育讯息</li><li style="margin-top:19px;"><a href="#">电游讯息</a></li>');
				gameNotice.loadSportNoticeData();
			} else if (curText == "电游讯息") {
				$(ul).html('<li style="margin-top:19px;"><a href="javascript:;">彩票讯息</a></li><li style="margin-top:19px;"><a href="javascript:;">视讯讯息</a></li><li style="margin-top:19px;"><a href="#">体育讯息</a></li><li class="current">电游讯息</li>');
				gameNotice.loadGameNoticeData();
			}
			gameNotice.initLi();
		});
	},
    loadChangeData : function(){
    	var curText = $(".mc-title").find("[class='current']").html();
		if (curText == "彩票讯息") {
			gameNotice.loadLotteryNoticeData();
		} else if (curText == "视讯讯息") {
			gameNotice.loadVideoNoticeData();
		} else if (curText == "体育讯息") {
			gameNotice.loadSportNoticeData();
		} else if (curText == "电游讯息") {
			gameNotice.loadGameNoticeData();
		}
    },
	loadLotteryNoticeData : function() {
		gameNotice.loadNoticeData("lottery");
	},
	loadVideoNoticeData : function() {
		gameNotice.loadNoticeData("video");
	},
	loadSportNoticeData : function() {
		gameNotice.loadNoticeData("sport");
		$("#emptyData").hide();
	},
	loadGameNoticeData : function() {
		gameNotice.loadNoticeData("game");
		$("#emptyData").show();
	},
	loadNoticeData : function(type) {
		var current = $("#infoType").val();
		var popupFlag = "N";
		
		var noticeFrom = 1;
		if (type == "lottery") {
			noticeFrom = 1;
		} else if (type == "sport") {
			noticeFrom = 3;
		} else if (type == "video") {
			noticeFrom = 2;
		} else if (type == "game") {
			noticeFrom = 4;
		}

		var params = {
				current : current,
				popupFlag : popupFlag,
				noticeFrom : noticeFrom
			};
		if(current == 0){
			popupFlag = null;
			params = {
					current : current,
					popupFlag : popupFlag,
					noticeFrom : noticeFrom,
					pageIndex : 1,
					pageSize  : 10
				};
		}
		$.cloudCall({
			method : "notice.system.query",
			params : params,
			isLoading : false,
			success : function(obj) {
				$("#emptyData").hide();
				if (obj.error == null && obj.result != null) {
					var datas = obj.result.items;
					var dtoStr = "";
					$.each(datas, function(i) {
						var item = datas[i];
						var conStr = "";
						var content = JSON.parse(item.content);
						if (content != undefined) {
							var dto = content;
							conStr = dto.contentZh;
						    //dto.contentTw dto.contentEn
						}
						dtoStr += '<tr><td>' + item.createTime + '</td><td>'
								+ conStr + '</td></tr>';
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

	}
};
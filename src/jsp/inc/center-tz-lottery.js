
$(function() {
	$("#emptyData").hide();
	centerTzlottery.loadItemData();
	centerTzlottery.loadTzLotteryData();
	
	$("#beganDate").val(getNowFormatDate());
	$("#endDate").val(getNowFormatDate());
});

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1
			+ strDate;
	return currentdate;
}

var page = 1;
var pageSize = 20;
var itemArray = new Array();
jQuery.support.cors = true;
var centerTzlottery = {
	loadTzLotteryData : function() {
		var container = $("#itemList");
		$.cloudCall({
					method : "user.order.query",				
					async : true,
					params : {
						sessionId : cms.getToken(),
						moduleId : '1',
						startTime : $("#beganDate").val(),
						endTime : $("#endDate").val(),
						pageIndex : page,
						pageSize : pageSize
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							$("#emptyData").hide();
							var datas = obj.result;
							page = datas.pageIndex;
							pageSize = datas.pageSize;
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
							
							
							var datas = obj.result.items;
							var dtoStr = ""; 
							$.each(datas,function(i){
								var item = datas[i];
								dtoStr += "<tr><td>"+itemArray[item.gameId]+"</td><td>"+item.bAmount+"</td><td>"+(item.aAmount == null ? "" : item.aAmount)+"</td><td>"+item.orderTime+"</td></tr>";
							});
							if (dtoStr == "") {
								$("#emptyData").show();
							}
							container.html("").html(dtoStr);
						}else {
							JsMsg.errorObjMsg(obj.error);
						}
					}
				});

	},
	
	loadItemData : function() {
		$.cloudCall({
			method : "tool.select.options.get",
			async : true,
			params : {
				clazz : 'lg'
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result;
					$.each(datas, function(i) {
						var cashitem = datas[i];
						var itemId = cashitem.id;
						var itemName = cashitem.name;
						itemArray[itemId] = itemName;
					});

				} else {
					if (obj.error != null)
						JsMsg.errorObjMsg(obj.error);
				}
			}
		});
	}
};

$(function() {
	centerJb.loadCurrency();
	centerJb.loadBalanceList();
	centerJb.loadOrderCost();
	
	$("#rlink").click(function(){
		$("#imgR").removeAttr("src").attr("src","/jsp/site/refersh.gif");
		setTimeout(function(){
			centerJb.loadOrderCost();
			$("#imgR").removeAttr("src").attr("src","/jsp/site/refersh.png");
		},1000);
	});
});


var page = 1;
var pageSize = 12;
var gameItems = new Array();
jQuery.support.cors = true;
var centerJb = {
	loadCurrency : function() {
		var model = cms.getLoginModel();
		$("#userId,#userId1").html(model.account);
		$("#balances").html(model.balance);
		$.cloudCall({
			method : "currency.get",
			isLoading : false,
			params : {
				sn : model.sn,
				currencyId : model.currency
			},
			success : function(obj) {
				if (obj.error == null) {
					var result = obj.result;
					$("#currency").html(result.currencyName + " (" + result.currencyCode+ ")");
				} else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});
	},
	loadOrderCost:function(){
		$.cloudCall({
			method : "user.order.cost.sum",
			isLoading : false,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				$("#emptyData").hide();
				if (obj.error == null && obj.result != null) {
					var datas = obj.result;
					var dtoStr = "";
					if(undefined != datas){
						$.each(datas, function(i) {
							var item = datas[i];
							var index = i;
							var modth = "centerJb.loadOrderDetail('"+item.startTime+"','"+item.endTime+"',"+index+")";
							dtoStr += '<tr><td>'+item.startTimeStr+' / '+item.endTimeStr+'</td><td align="right">'+centerJb.toFloat(item.amount)+'<i class="panel collapsed icon-plus-sign" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo'+index+'" onclick="'+modth+'"></i></td></tr>';
						    dtoStr += '<tr id="tr'+index+'" style="display:none"><td colspan="2"><input id="in'+index+'" type="hidden" value="0" /> <div id="collapseTwo'+index+'" class="panel-collapse collapse tablelist"> </div></td></tr>'
						});
						$('#dtoList1').html("").html(dtoStr);
					}
					if (dtoStr == "") {
						$("#emptyData").show();
					}
				} else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});
	},
	loadOrderDetail : function(btime,etime,index){
		var imark = $("#in"+index).val();
		
		if(imark == 0){
			page = 1;
			$("#in"+index).val(1);
			$("#tr"+index).show();
			gameItems = centerJb.loadItem();
			var params = {
					sessionId : cms.getToken(),
					startTime : btime,
					endTime : etime,
					pageIndex : page,
					pageSize : pageSize,
					statuses : [2,3,4],
					async : false
				};
			var dtoStr = '';
			$.cloudCall({
				method : "user.order.query",
				params : params,
				success : function(obj) {
					if (obj.error == null && obj.result != null) {
						var datas = obj.result;
						var dtoList = datas.items;
						var modth = "centerJb.onChange(this,'"+btime+"','"+etime+"',"+index+")";
						page = datas.pageIndex;
						pageSize = datas.pageSize;
						
						var pageStr = "";
						var pcStr = "";
	                    if(datas.items.length > 0 ){
							var pageTemp = parseInt(datas.total / datas.pageSize) + ((datas.total % datas.pageSize) > 0 ? 1 : 0);
							for (var i = 0; i < pageTemp; i++) {
								var pstep = (i + 1);
								var sel = "";
								if (page == pstep)
									sel = "selected='selected'";
								pageStr += "<option " + sel + ">" + pstep + "</option>"
							}
							 pcStr = "/ " + pageTemp + " 页";
							 dtoStr += '<div class="trade-drop"><span style="color:#919191;margin-left:15px;" id="pspan'+index+'">总页数</span> <select id="page'+index+'" onchange="'+modth+'">'+pageStr+'</select> <span style="color:#919191;" id="pageCount'+index+'">'+pcStr+'</span> </div>';
	                    }
						dtoStr += '<table class="table-layer" width="100%" border="0" cellspacing="0" cellpadding="0">';
						dtoStr += '<tr> <th width="17%" scope="col">订单ID</th><th width="15%" scope="col">模块</th><th width="15%" scope="col">玩法</th><th width="16%" scope="col">订单状态</th> <th width="16%" scope="col">下注额</th> <th width="16%" scope="col">结算额</th> <th width="20%" scope="col">下注时间</th> </tr><tbody id="tdtoList'+index+'">';
						
						$.each(dtoList,
										function(i) {
											var entity = dtoList[i];
											dtoStr += "<tr><td>" + entity.orderId + "</td>";
											dtoStr += "<td>" + centerJb.convertModel(entity.moduleId) + "</td>";
											dtoStr += "<td>" + gameItems[entity.moduleId+','+entity.gameId] + "</td>";
											dtoStr += "<td>" + centerJb.convertStatus(entity.orderStatus) + "</td>";
											dtoStr += "<td>" + entity.bAmount + "</td>";
											dtoStr += "<td>" + centerJb.convertData(entity.aAmount) + "</td>";
											dtoStr += "<td>" + entity.orderTime + "</td>";
											dtoStr += "</tr>";
										});
						dtoStr += '</tbody></table>';
						$("#collapseTwo"+index).html(dtoStr);
					} else {
						JsMsg.errorObjMsg(obj.error);
					}
				}
			});
		}else{
			$("#in"+index).val(0);
			$("#tr"+index).hide();
		}
	},
	loadCashData : function(btime,etime,index) {
		$.cloudCall({
					method : "user.order.query",
					params : {
						sessionId : cms.getToken(),
						startTime : btime,
						endTime : etime,
						statuses : [2,3,4],
						pageIndex : page,
						pageSize : pageSize
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							var datas = obj.result;
							page = datas.pageIndex;
							pageSize = datas.pageSize;
							$("#pspan"+index+",#page"+index+",#pageCount"+index).hide();
		                    if(datas.items.length > 0 ){
		                    	$("#pspan"+index+",#page"+index+",#pageCount"+index).show();
								var pageTemp = parseInt(datas.total / datas.pageSize) + ((datas.total % datas.pageSize) > 0 ? 1 : 0);
								var pageStr = "";
								for (var i = 0; i < pageTemp; i++) {
									var pstep = (i + 1);
									var sel = "";
									if (page == pstep)
										sel = "selected='selected'";
									pageStr += "<option " + sel + ">" + pstep + "</option>"
								}
								$("#page"+index).html("").html(pageStr);
								$("#pageCount"+index).html("").html("/ " + pageTemp + " 页");
		                    }
							var dtoList = datas.items;
							dtoStr = "";
							$("#tdtoList"+index).html("");
							$.each( dtoList,
											function(i) {
													var entity = dtoList[i];
													dtoStr += "<tr><td>" + entity.orderId + "</td>";
													dtoStr += "<td>" + centerJb.convertModel(entity.moduleId) + "</td>";
													dtoStr += "<td>" + gameItems[entity.moduleId+','+entity.gameId] + "</td>";
													dtoStr += "<td>" + centerJb.convertStatus(entity.orderStatus) + "</td>";
													dtoStr += "<td>" + entity.bAmount + "</td>";
													dtoStr += "<td>" + centerJb.convertData(entity.aAmount) + "</td>";
													dtoStr += "<td>" + entity.orderTime + "</td>";
													dtoStr += "</tr>";
											});

							
							$("#tdtoList"+index).html("").html(dtoStr);
						} else {
							JsMsg.errorObjMsg(obj.error);
						}
					}
				});
	},
	onChange : function(obj,btime,etime,i) {
		page = $(obj).val();
		centerJb.loadCashData(btime,etime,i);
	},
	convertData : function(o){
		return o == null ? "-" : o;
	},
	convertModel : function(o){
		var str = "";
		if(o==1){
			str = "彩票";
		}else if(o==2){
			str = "视讯";
		}else if(o==3){
			str = "体育";
		}else if(o==4){
			str = "电游";
		}
		return str;
	},
	convertStatus : function(o){
		var txt = "";
		if(o == 1){
			txt = "未结算";
		}else if(o == 2){
			txt = "<font color='red' style='font-weight:bold;'>赢</font>";
		}else if(o == 3){
			txt = "和";
		}else if(o == 4){
			txt = "<font color='green' style='font-weight:bold;'>输</font>";
		}else if(o == 5){
			txt = "取消";
		}else if(o == 6){
			txt = "过期";
		}else if(o == 7){
			txt = "系统取消";
		}
		return txt;
	},
	loadItem : function(){
		var itemArray = new Array();
		$.cloudCall({
			method : "tool.select.options.get",
			async : false,
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
						itemArray["1,"+itemId] = itemName;
					});

				} else {
					if (obj.error != null)
						JsMsg.errorObjMsg(obj.error);
				}
			}
		});
		$.cloudCall({
			method : "tool.select.options.get",
			async : false,
			params : {
				clazz : 'vg'
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result;
					$.each(datas, function(i) {
						var cashitem = datas[i];
						var itemId = cashitem.id;
						var itemName = cashitem.name;
						itemArray["2,"+itemId] = itemName;
					});

				} else {
					if (obj.error != null)
						JsMsg.errorObjMsg(obj.error);
				}
			}
		});
		$.cloudCall({
			method : "tool.select.options.get",
			async : false,
			params : {
				clazz : 'sg'
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result;
					$.each(datas, function(i) {
						var cashitem = datas[i];
						var itemId = cashitem.id;
						var itemName = cashitem.name;
						itemArray["3,"+itemId] = itemName;
					});

				} else {
					if (obj.error != null)
						JsMsg.errorObjMsg(obj.error);
				}
			}
		});
		return itemArray;
	},
	loadBalanceList:function(){
		$.cloudCall({
			method : "thirdparty.user.balance.list",
			isLoading : false,
			params : {
				sessionId : cms.getToken()
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var fullDtoList = "";
					var datas = obj.result.items;
					var dtoHStr = "";
					var dtoDStr = "";
					var dataLength = datas.length;
					var ycount = 5 - (dataLength % 5);
					var eHstr = "";
					var eDstr = "";
					if(ycount > 0){
						for(var i=0 ;i<ycount;i++){
							eHstr += '<th scope="col" width="20%"></th>';
							eDstr += '<td></td>';
						}
					}
					$.each(datas, function(i) {
						var item = datas[i];
						dtoHStr += '<th scope="col" width="20%">'+ item.thirdpartyName +'余额</th>';
						dtoDStr += '<td>'+ centerJb.toFloat(item.balance) +'</td>';
						if(((i+1)%5) == 0){
							fullDtoList +='<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0"><tr>'+dtoHStr+'</tr><tr>'+dtoDStr+'</tr></table>';
							dtoHStr = "";
							dtoDStr = "";
						} else{
							if(dataLength == (i+1)){
								fullDtoList +='<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0"><tr>'+ dtoHStr + eHstr +'</tr><tr>'+ dtoDStr + eDstr +'</tr></table>';
								dtoHStr = "";
								dtoDStr = "";
							}
						}
					});
					
					if (fullDtoList != "") {
						$('#dtoList').html("").html(fullDtoList);
					} else{
						$('#dtoList').html("").html('<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td colspan="10" style="height:52px; line-height:92px; ">无任何数据。</td></tr></table>');
					}
				} else {
					JsMsg.errorObjMsg(obj.error);
				}
			}
		});
	},
	toFloat : function(obj){
		var temp = "";
		if(undefined != obj && "" != obj.toString()){
			temp = obj.toFixed(2)
		}
		return temp;
	}
};
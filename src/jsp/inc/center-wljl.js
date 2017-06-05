$(function() {
	$("#emptyData").show()
	centerCash.initLi()
	centerCash.initWljl()
})

function getNowFormatDate() {
	var date = new Date()
	var seperator1 = "-"
	var seperator2 = ":"
	var month = date.getMonth() + 1
	var strDate = date.getDate()
	if (month >= 1 && month <= 9) {
		month = "0" + month
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1
			+ strDate
	return currentdate
}

var page = 1
var pageSize = 20
var cashArray = new Array()
var itemArray = new Array()
jQuery.support.cors = true
var centerCash = {
	initLi : function(){
		var licontrols = $(".mc-title").find("li")
		var ul = $(".mc-title").find("ul")
		licontrols.click(function() {
			var oldText = $(".mc-title").find("[class='current']").html()
			var curText = $(this).text()
			if (oldText == curText)
				return
		    if(curText == "往来记录"){
		    	$(ul).html('<li class="current">往来记录</li><li style="margin-top:19px;"><a href="javascript:;">注单记录</a></li>')
		    	centerCash.initWljl()
		    }else if(curText == "注单记录"){
		    	$(ul).html('<li style="margin-top:19px;"><a href="javascript:;">往来记录</a></li><li class="current">注单记录</li>')
		    	centerCash.initXdjl()
		    }
		    centerCash.initLi()
		})
	},
	initWljl : function(){
		$("#dtoList").html('')
		$("#emptyData").show()
		var bControl = "centerCash.dateControl(1)"
		var eControl = "centerCash.dateControl(2)"
		var cWhere = '<span style="color:#919191;">类别：</span> <select id="cashItem"></select><input id="beganDate" type="text" value="" class="Wdate" onclick="'+bControl+'" /> <span style="margin-right:5px;">--</span><input id="endDate" type="text" value="" class="Wdate" onclick="'+eControl+'" /> <span style="color:#919191;margin-left:15px;" id="pspan">总页数</span> <select id="page" onchange="centerCash.onChange(this,1)"></select> <span style="color:#919191;" id="pageCount">/ 0 页</span> <input type="button" class="btn" value="查询" />'
		$(".trade-drop").html(cWhere)

		centerCash.loadCashItemType()
		$(".btn").click(function() {
			centerCash.loadCashData()
		})

		var tableH = '<th width="22%" class="his_time" scope="col">美东时间</th> <th width="15%" scope="col">类型</th> <th width="15%" scope="col">交易额度</th><th width="15%" scope="col">余额</th>'
		$("#dtoHeader").html(tableH)
		var tt = bgSetTime.getMdTime()
		$("#beganDate").val(tt)
		$("#endDate").val(tt)
		$("#pspan,#page,#pageCount").hide()
	},
    dateControl : function(type){
    	if(type == 1){
    		var tt = bgSetTime.getMdTime()
    		WdatePicker({maxDate:tt,minDate:'#F{$dp.$D(\'endDate\',{d:-30})}',dateFmt:'yyyy-MM-dd HH:mm:ss'})
    	}else{
    		WdatePicker({minDate:'#F{$dp.$D(\'beganDate\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'})
    	}
	},
	initTabH : function(o){
		var t = o.value
		var tableH = ""
		if(t === "1" || t === "2" || t === "3" || t === "4" ){
		    tableH = '<th width="12%" scope="col">订单ID</th><th width="12%" scope="col">游戏</th> <th width="12%" scope="col">玩法</th><th width="10%" scope="col">期数</th><th width="10%" scope="col">订单状态</th> <th width="12%" scope="col">下注额</th><th width="12%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if( t === "202"){
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "2041" ){
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if( t === "209" ){//gd
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th> <th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if( t === "206" ){//og
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th> <th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if( t === "214" ){//gd
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th> <th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if( t === "205" ){
		    tableH = '<th width="15%" scope="col">订单ID</th><th width="15%" scope="col">游戏</th><th width="15%" scope="col">玩法</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "201"){
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">玩法</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "210"){//ab
		    tableH = '<th width="15%" scope="col">订单ID</th><th width="15%" scope="col">局号</th><th width="15%" scope="col">玩法</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "204"){//bbin
		    tableH = '<th width="15%" scope="col">订单ID</th><th width="10%" scope="col">局号</th><th width="10%" scope="col">场次</th><th width="10%" scope="col">桌号</th><th width="13%" scope="col">游戏</th><th width="13%" scope="col">下注额</th><th width="13%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "211"){//pt
		    tableH = '<th width="15%" scope="col">订单ID</th><th width="15%" scope="col">游戏名称</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">派彩额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "213"){//saba
		    tableH = '<th width="15%" scope="col">订单ID</th><th width="15%" scope="col">游戏名称</th><th width="15%" scope="col">下注额</th><th width="15%" scope="col">有效下注额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "208"){//im
		    tableH = '<th width="13%" scope="col">订单ID</th><th width="10%" scope="col">盘口</th><th width="10%" scope="col">主场</th><th width="10%" scope="col">客场</th><th width="10%" scope="col">玩法</th><th width="13%" scope="col">下注额</th><th width="13%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "212"){//ytx
		    tableH = '<th width="15%" scope="col">订单ID</th> <th width="15%" scope="col">下注额</th><th width="15%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		}else if(t === "215"){//dg
		    tableH = '<th scope="col">玩法</th><th scope="col">单号/桌/靴/局</th><th scope="col">局号</th><th scope="col">币种</th><th scope="col">投注金额</th><th scope="col">输赢</th><th scope="col">有效投注</th><th class="his_time" scope="col">下注时间</th><th class="his_time" scope="col">派彩时间</th>'
		}else if(t === "216"){//ve
		    tableH = '<th scope="col">游戏类型</th><th scope="col">单号</th><th scope="col">桌台局数</th><th scope="col">下注IP</th><th scope="col">投注金额</th><th scope="col">输赢</th><th scope="col">有效投注</th><th class="his_time" scope="col">下注时间</th><th class="his_time" scope="col">派彩时间</th>'
		}else if(t === "217"){//gpi
			tableH = '<th scope="col">注单编号</th><th scope="col">游戏名称</th><th scope="col">下注金额</th><th scope="col">派彩金额</th><th scope="col">输赢金额</th><th class="his_time" scope="col">下注时间</th>'
		}else if(t === "223") { //ISB
			tableH = '<th scope="col">交易id</th><th scope="col">游戏id</th><th scope="col">游戏局id</th><th scope="col">游戏名称</th><th scope="col">币种</th><th scope="col">游戏类别</th><th scope="col">投注金额</th><th scope="col">派彩</th><th class="his_time" scope="col">投注时间美东</th><th class="his_time" scope="col">投注时间北京</th><th scope="col">注单状态</th>'
		}else if(t === "221") { //ttg  spg prg
			tableH = '<th scope="col">交易id</th><th scope="col">游戏id</th><th scope="col">游戏局id</th><th scope="col">游戏名称</th><th scope="col">投注金额</th><th scope="col">派彩</th><th class="his_time" scope="col">投注时间美东</th><th class="his_time" scope="col">投注时间北京</th>'
		}

		$("#dtoHeader").html(tableH)
		$("#pspan,#page,#pageCount").hide()
		$("#dtoList").html("")
		$("#emptyData").show()
	},
	initXdjl : function(){
		$("#dtoList").html('')
		$("#emptyData").show()
		var sn = cms.getWebSn()
		var bControl = "centerCash.dateControl(1)"
		var eControl = "centerCash.dateControl(2)"
		var moduleItem = '<select id="moduleid" onchange="centerCash.initTabH(this)">'
		var veVideo = ''
		if(sn == "ae00" || sn == "ap00" || sn == "au00" || sn == "bh00") {
			veVideo = '<option value="216">维加斯视讯</option>'
		}

		if(sn == "aq00") {
			moduleItem += '<option value="1">BG彩票</option>'
		}else if(sn == "au00" || sn == "bh00") {
			moduleItem += veVideo
			moduleItem += '<option value="1">BG彩票</option>'
			moduleItem += '<option value="2">BG视讯</option>'
			moduleItem += '<option value="208">IM体育</option><option value="213">沙巴体育</option>'
			moduleItem += '<option value="211">PT电游</option><option value="202">MG电游</option><option value="205">AG电游</option>'
			moduleItem += '<option value="2041">BBIN电游</option><option value="212">捕鱼天下</option>'
			moduleItem += '<option value="217">GPI电游</option>'
			moduleItem += '<option value="223">ISB电游</option>'
			moduleItem += '<option value="221">TTG电游</option>'
			moduleItem += '<option value="221">SPG电游</option>'
			moduleItem += '<option value="221">PRG电游</option>'
		}else {
			moduleItem += '<option value="1">BG彩票</option>'
			//moduleItem += '<option value="3">体育</option> <option value="4">游戏</option>';
			moduleItem += '<option value="2">BG视讯</option><option value="205">AG视讯</option><option value="209">GD视讯</option><option value="210">欧博视讯</option>'
			moduleItem += '<option value="201">LEBO视讯</option><option value="204">BBIN视讯</option>'
			moduleItem += '<option value="206">OG视讯</option><option value="214">申博视讯</option>'
			moduleItem += '<option value="211">PT视讯</option><option value="215">DG视讯</option>' + veVideo
			moduleItem += '<option value="208">IM体育</option><option value="213">沙巴体育</option>'
			moduleItem += '<option value="211">PT电游</option><option value="202">MG电游</option><option value="205">AG电游</option>'
			moduleItem += '<option value="2041">BBIN电游</option><option value="212">捕鱼天下</option>'
			moduleItem += '<option value="217">GPI电游</option>'
			moduleItem += '<option value="223">ISB电游</option>'
			moduleItem += '<option value="221">TTG电游</option>'
			moduleItem += '<option value="221">SPG电游</option>'
			moduleItem += '<option value="221">PRG电游</option>'
		}
		moduleItem += '</select>'

		var cWhere = ' '+moduleItem+'<input id="beganDate" type="text" value="" class="Wdate" onclick="'+bControl+'" /> <span style="margin-right:5px;">--</span><input id="endDate" type="text" value="" class="Wdate" onclick="'+eControl+'" /> <span style="color:#919191;margin-left:15px;" id="pspan">总页数</span> <select id="page" onchange="centerCash.onChange(this,2)"></select> <span style="color:#919191;" id="pageCount">/ 0 页</span> <input type="button" class="btn" value="查询" />'
	    $(".trade-drop").html(cWhere)
		$(".btn").click(function() {
			centerCash.loadSearchData()
		})
	    var tableH = '<th width="12%" scope="col">订单ID</th> <th width="12%" scope="col">游戏</th><th width="12%" scope="col">玩法</th><th width="10%" scope="col">期数</th><th width="10%" scope="col">订单状态</th> <th width="12%" scope="col">下注额</th><th width="12%" scope="col">结算额</th><th width="25%" class="his_time" scope="col">下注时间</th>'
		$("#dtoHeader").html(tableH)
		var tt = bgSetTime.getMdTime()
		$("#beganDate").val(tt)
		$("#endDate").val(tt)
		$("#pspan,#page,#pageCount").hide()
	},
	loadSearchData : function(){
		var t = $("#moduleid").val()
		if(t === "1" || t === "2" || t === "3" || t === "4" ){
			centerCash.loadUserOrderData()
		}else if(t === "210"){
			centerCash.loadAbData()
		}else if(t === "209"){
			centerCash.loadGdData()
		}else if(t === "205"){
			centerCash.loadAgData()
		}else if(t === "206"){
			centerCash.loadOgData()
		}else if(t === "204"){
			centerCash.loadBbinData()
		}else if(t === "2041"){
			centerCash.loadBbinGData()
		}else if(t === "201"){
			centerCash.loadLbData()
		}else if(t === "211"){
			centerCash.loadPtData()
		}else if(t === "202"){
			centerCash.loadMgData()
		}else if(t === "214"){
			centerCash.loadSunbetData()
		}else if(t === "213"){
			centerCash.loadSabaData()
		}else if(t === "208"){
			centerCash.loadImData()
		}else if(t === "212"){
			centerCash.loadYtxData()
		}else if(t === "215"){
			centerCash.loadDgData()
		}else if(t === "216"){
			centerCash.loadVeData()
		}else if(t === "217"){
			centerCash.loadGpiGameData()
		}else if(t === "223"){
			centerCash.loadISBGameData()
		}else if(t === "221"){
			centerCash.loadGameData221() //221包含 TTG SPG PRG
		}
	},
	loadCashItemType : function() {
		$.cloudCall({
					method : "account.item.list",
					params : {
						sn : cms.getWebSn(),
						clazz : 'userview'
					},
					isLoading : false,
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							var datas = obj.result
							var optionStr = "<option value='0' selected='selected' >全部</option>"
							var sn = cms.getWebSn()

							$.each(datas, function(i) {
								var cashitem = datas[i]
								var itemId = cashitem.itemId
								var itemName = cashitem.itemName
								if((sn != "ae00" && sn != "ap00" && sn != "au00" && sn != "bh00") && (itemId == 10520 || itemId == 20520)) {
									return
								}
								optionStr += "<option value='" + itemId + "' >"
										+ itemName + "</option>"
								cashArray[itemId] = itemName
							})

							if(sn == "aq00") {
								$('#cashItem').html("").html('<select id="cashItem"><option value="0" selected="selected">全部</option><option value="10101">公司入款</option><option value="10201">线上存款</option><option value="10301">人工存款</option><option value="10304">体育投注余额</option><option value="10305">其他入款</option><option value="10306">注单重新结算入款</option><option value="10400">给予优惠</option><option value="10401">会员注册优惠</option><option value="10402">存款优惠</option><option value="10403">汇款优惠</option><option value="10404">返点优惠</option><option value="10405">活动优惠</option><option value="10406">公司入款优惠</option><option value="10407">公司入款手续费优惠</option><option value="10408">线上存款优惠</option><option value="10409">线上存款手续费优惠</option><option value="10410">点卡存款优惠</option><option value="10411">其他存款优惠</option><option value="10500">返水优惠</option><option value="10504">BG彩票返水</option><option value="10600">额度转入</option><option value="10701">转入BG</option><option value="10801">余额解冻</option><option value="20101">会员提出</option><option value="20304">手工提出</option><option value="20308">其他出款</option><option value="20309">注单重新结算出款</option><option value="20500">返水冲销</option><option value="20504">BG彩票冲销</option><option value="20600">额度转出</option><option value="20701">从BG转出</option><option value="20801">余额冻结</option><option value="20802">冻结金额扣除</option><option value="30103">彩票注单</option><option value="30203">彩票结算单</option></select>')
							}else {
								$('#cashItem').html("").html(optionStr)
							}

						} else {
							if (obj.error != null)
								JsMsg.errorObjMsg(obj.error)
						}
					}
				})
	},
	initPager : function(datas){
		page = datas.pageIndex
		pageSize = datas.pageSize
		$("#pspan,#page,#pageCount").hide()
        if(datas.items.length > 0 ){
        	$("#pspan,#page,#pageCount").show()
			var pageTemp = parseInt(datas.total / datas.pageSize) + ((datas.total % datas.pageSize) > 0 ? 1 : 0)
			var pageStr = ""
			for (var i = 0; i < pageTemp; i++) {
				var pstep = (i + 1)
				var sel = ""
				if (page == pstep)
					sel = "selected='selected'"
				pageStr += "<option " + sel + ">" + pstep + "</option>"
			}
			$("#page").html("").html(pageStr)
			$("#pageCount").html("").html("/ " + pageTemp + " 页")
        }
	},
	loadYtxData : function(){
		$.cloudCall({
			method : "thirdparty.user.ytx.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.autoid + "</td>"
								dtoStr += "<td>" + entity.bet + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.pay) + "</td>"
								dtoStr += "<td>" + entity.bettime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadGdData : function(){
		$.cloudCall({
			method : "thirdparty.user.gd.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.productId + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.winLoss) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadAgData : function(){
		$.cloudCall({
			method : "thirdparty.user.ag.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize,
				withItemDesc : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.gameTypeDesc + "</td>"
								dtoStr += "<td>" + entity.playTypeDesc + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.payOut) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadOgData : function(){
		$.cloudCall({
			method : "thirdparty.user.og.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize,
				withItemDesc : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.playTypeDesc + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.payOut) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadBbinData : function(){
		$.cloudCall({
			method : "thirdparty.user.bbin.order.video.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize,
				withItemDesc : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.roundId + "</td>"
								dtoStr += "<td>" + entity.roundSn + "</td>"
								dtoStr += "<td>" + entity.tableId + "</td>"
								dtoStr += "<td>" + entity.gameTypeDesc + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.payOut) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadBbinGData : function(){
		$.cloudCall({
			method : "thirdparty.user.bbin.order.game.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize,
				withItemDesc : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.gameTypeDesc + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.payOut) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadLbData : function(){
		$.cloudCall({
			method : "thirdparty.user.lb.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize,
				withItemDesc : 1
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.gameTypeDesc + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.payOut) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	abConvertM : function (m){
		if(m == 101) return "普通百家乐"
		if(m == 102) return "VIP百家乐"
		if(m == 103) return "急速百家乐"
		if(m == 104) return "竞咪百家乐"
		if(m == 201) return "骰宝"
		if(m == 301) return "龙虎"
		if(m == 401) return "轮盘"
	},
	loadAbData : function(){
		$.cloudCall({
			method : "thirdparty.user.ab.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betNum + "</td>"
								dtoStr += "<td>" + entity.gameRoundId + "</td>"
								dtoStr += "<td>" + centerCash.abConvertM(entity.gameType) + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.winOrLoss) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadPtData : function(){
		$.cloudCall({
			method : "thirdparty.user.pt.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.rNum + "</td>"
								dtoStr += "<td>" + entity.gameName + "</td>"
								dtoStr += "<td>" + entity.bet + "</td>"
								dtoStr += "<td>" + entity.win + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.currentBet) + "</td>"
								dtoStr += "<td>" + entity.gameDate + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadMgData : function(){
		$.cloudCall({
			method : "thirdparty.user.mg.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.rowId + "</td>"
								dtoStr += "<td>" + entity.displayName + "</td>"
								dtoStr += "<td>" + entity.totalWager + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.totalPayout) + "</td>"
								dtoStr += "<td>" + entity.gameEndTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadSunbetData : function(){
		$.cloudCall({
			method : "thirdparty.user.sunbet.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.playType + "</td>"
								dtoStr += "<td>" + entity.riskAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.winAmount) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadDgData : function(){
		$.cloudCall({
			method : "thirdparty.user.dg.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.gameName + "</td>"
								dtoStr += "<td>" + entity.id + "/" + entity.tableId + "/" + entity.shoeId + "/" + entity.playId + "</td>"
								dtoStr += "<td>" + entity.ext + "</td>"
								dtoStr += "<td>" + entity.currencyName + "</td>"
								dtoStr += "<td>" + entity.betPoints + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.winOrLoss) + "</td>"
								dtoStr += "<td>" + entity.availableBet + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "<td>" + entity.calTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadVeData : function() {
		$.cloudCall({
			method : "thirdparty.user.ve.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.gameName + "</td>"
								dtoStr += "<td>" + entity.betNo + "</td>"
								dtoStr += "<td>" + entity.tableSheno + "</td>"
								dtoStr += "<td>" + entity.betIp + "</td>"
								dtoStr += "<td>" + entity.betMoney + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.winMoney) + "</td>"
								if(parseInt(entity.winMoney, 10) != 0) {
									dtoStr += "<td>" + entity.betMoney + "</td>"
								}else {
									dtoStr += "<td></td>"
								}
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "<td>" + entity.calTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadImData : function(){
		$.cloudCall({
			method : "thirdparty.user.im.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.betId + "</td>"
								dtoStr += "<td>" + entity.leagueName + "</td>"
								dtoStr += "<td>" + entity.homeTeam + "</td>"
								dtoStr += "<td>" + entity.awayTeam + "</td>"
								dtoStr += "<td>" + entity.bettingMethod + "</td>"
								dtoStr += "<td>" + entity.betAmt + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.result) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadSabaData : function(){
		$.cloudCall({
			method : "thirdparty.user.saba.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.billNo + "</td>"
								dtoStr += "<td>" + entity.playerName + "</td>"
								dtoStr += "<td>" + entity.betAmount + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.validBetAmount) + "</td>"
								dtoStr += "<td>" + entity.betTime + "</td>"
								dtoStr += "</tr>"
							})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadGpiGameData: function() {
		$.cloudCall({
			method : "thirdparty.user.gpi.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.operationCode + "</td>"
								dtoStr += "<td>" + entity.gameName + "</td>"
								dtoStr += "<td>" + entity.bet + "</td>"
								dtoStr += "<td>" + entity.ret + "</td>"
								dtoStr += "<td>" + centerCash.convertData(entity.changes) + "</td>"
								dtoStr += "<td>" + entity.changeTime + "</td>"
								dtoStr += "</tr>"
							})
					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadISBGameData: function() {
		$.cloudCall({
			method : "thirdparty.user.isoftbet.order.query",
			params : {
				sessionId : cms.getToken(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
							function(i) {
								var entity = dtoList[i]
								dtoStr += "<tr><td>" + entity.transactionId + "</td>"
								dtoStr += "<td>" + entity.gameId + "</td>"
								dtoStr += "<td>" + entity.roundId + "</td>"
								dtoStr += "<td>" + entity.gameNameCn + "</td>"
								dtoStr += "<td>" + entity.currency + "</td>"
								dtoStr += "<td>" + entity.gameCategory + "</td>"
								dtoStr += "<td>" + entity.bet + "</td>"
								dtoStr += "<td>" + entity.win + "</td>"
								dtoStr += "<td>" + entity.gameDate + "</td>"
								dtoStr += "<td>" + entity.gameDateBj + "</td>"
								dtoStr += "<td>" + entity.state + "</td>"
								dtoStr += "</tr>"
							})
					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	},
	loadGameData221 : function(){
		var text = $("#moduleid option:selected").text()
		var gamePlate = text.substring(0,3)
		if(gamePlate == 'SPG') gamePlate = 'SAG'
		$.cloudCall({
					method : "thirdparty.user.im.game.order.query",
					params : {
						sessionId : cms.getToken(),
						gamePlate : gamePlate,
						startTime : $("#beganDate").val(),
						endTime : $("#endDate").val()+" 23:59:59",
						pageIndex : page,
						pageSize : pageSize,
						timezone : 1 //（1 美东 2 北京）
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							$("#emptyData").hide()
							var datas = obj.result
							centerCash.initPager(datas)
							var dtoList = datas.items
							dtoStr = ""
							$("#dtoList").html("")
							$.each( dtoList,
											function(i) {
												var entity = dtoList[i]
												dtoStr += "<tr><td>" + entity.orderId + "</td>"
												dtoStr += "<td>" + entity.gameId + "</td>"
												dtoStr += "<td>" + entity.roundId + "</td>"
												dtoStr += "<td>" + entity.gameNameCn + "</td>"
												dtoStr += "<td>" + entity.bet + "</td>"
												dtoStr += "<td>" + entity.win + "</td>"
												dtoStr += "<td>" + entity.gameDateEst + "</td>"
												dtoStr += "<td>" + entity.gameDate + "</td>"
												dtoStr += "</tr>"
											})
							if (dtoStr == "") {
								$("#emptyData").show()
							}
							$("#dtoList").html("").html(dtoStr)
						} else {
							$("#emptyData").show()
							JsMsg.errorObjMsg(obj.error)
						}
					}
				})
	},
	loadCashData : function() {
		var item = null
		if ($('#cashItem').val() != '0')
			item = $('#cashItem').val()
		$.cloudCall({
					method : "user.cashflow.query",
					params : {
						sessionId : cms.getToken(),
						accountItem : item,
						startTime : $("#beganDate").val(),
						endTime : $("#endDate").val()+" 23:59:59",
						pageIndex : page,
						pageSize : pageSize
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							$("#emptyData").hide()
							var datas = obj.result
							centerCash.initPager(datas)
							var dtoList = datas.items
							dtoStr = ""
							$("#dtoList").html("")
							$.each( dtoList,
											function(i) {
												var entity = dtoList[i]
												dtoStr += "<tr><td>" + entity.operateTime + "</td>"
												dtoStr += "<td>" + entity.accountItemName + "</td>"
												dtoStr += "<td>" + entity.amount + "</td>"
												dtoStr += "<td>" + entity.balance + "</td>"
												dtoStr += "</tr>"
											})

							if (dtoStr == "") {
								$("#emptyData").show()
							}
							$("#dtoList").html("").html(dtoStr)
						} else {
							$("#emptyData").show()
							JsMsg.errorObjMsg(obj.error)
						}
					}
				})
	},
	onChange : function(obj,m) {
		page = $(obj).val()
		if(m==1){
			centerCash.loadCashData()
		}else if(m == 2){
			centerCash.loadSearchData()
		}
	},
	loadUserOrderData : function(type) {
		var gameItems = itemArray
		var params = {
				sessionId : cms.getToken(),
				moduleId : $("#moduleid").val(),
				startTime : $("#beganDate").val(),
				endTime : $("#endDate").val()+" 23:59:59",
				pageIndex : page,
				pageSize : pageSize
			}

		$.cloudCall({
			method : "user.order.query",
			params : params,
			success : function(obj) {
				$("#emptyData").hide()
				if (obj.error == null && obj.result != null) {
					$("#emptyData").hide()
					var datas = obj.result
					centerCash.initPager(datas)
					var dtoList = datas.items
					dtoStr = ""
					$("#dtoList").html("")
					$.each( dtoList,
									function(i) {
										var entity = dtoList[i]
										dtoStr += "<tr><td>" + entity.orderId + "</td>"
										dtoStr += "<td>" + entity.gameName + "</td>"
										dtoStr += "<td>" + entity.playName + "</td>"
										dtoStr += "<td>" + entity.issueId + "</td>"
										dtoStr += "<td>" + centerCash.convertStatus(entity.orderStatus) + "</td>"
										dtoStr += "<td>" + entity.bAmount + "</td>"
										dtoStr += "<td>" + centerCash.convertData(entity.aAmount) + "</td>"
										dtoStr += "<td>" + entity.orderTime + "</td>"
										dtoStr += "</tr>"
									})

					if (dtoStr == "") {
						$("#emptyData").show()
					}
					$("#dtoList").html("").html(dtoStr)
				} else {
					$("#emptyData").show()
					JsMsg.errorObjMsg(obj.error)
				}
			}
		})

	},
	convertData : function(o){
		return o == null ? "-" : o
	},
	convertStatus : function(o){
		var txt = ""
		if(o == 1){
			txt = "未结算"
		}else if(o == 2){
			txt = "<font color='red' style='font-weight:bold;'>赢</font>"
		}else if(o == 3){
			txt = "和"
		}else if(o == 4){
			txt = "<font color='green' style='font-weight:bold;'>输</font>"
		}else if(o == 5){
			txt = "取消"
		}else if(o == 6){
			txt = "过期"
		}else if(o == 7){
			txt = "系统取消"
		}
		return txt
	},
    loadItem : function(callback){
		itemArray = new Array()
		var czz = 'lg'
		var type = $("#moduleid").val()
		if(type == 1){
			czz = 'lg'
		}else if(type == 2){
			czz = 'vg'
		}else if(type == 3){
			czz = 'sg'
		}
		$.cloudCall({
			method : "tool.select.options.get",
			async : true,
			params : {
				clazz : czz
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					var datas = obj.result
					$.each(datas, function(i) {
						var cashitem = datas[i]
						var itemId = cashitem.id
						var itemName = cashitem.name
						itemArray[itemId] = itemName
					})
					callback()
				} else {
					if (obj.error != null)
						JsMsg.errorObjMsg(obj.error)
				}
			}
		})
	}

}

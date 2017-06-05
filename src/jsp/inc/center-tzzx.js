var sn = cms.getWebPath()
var videoText = '视讯直播'
var sportText = 'BB体育'
var lotteryText = '彩票'

$(function() {
	centerTzzx.initTabData()
})

window.top.loginOutBySn = function(sn) {
	window.location.href = '/skins/' + sn + '/index.html'
}

jQuery.support.cors = true
var centerTzzx = {
	/**
	 * 初始化Tab数据
	 */
	initTabData : function() {
		$('.small-title')
				.find('a')
				.click(
						function() {
							$('.small-title').find('a').removeClass('current')
							$(this).addClass('current')
							var text = $(this).text()

							if (text == videoText) {
								var selectControl = '<select id="gameSelect" onchange="centerTzzx.getChange(this)"></select>'
								$(".trade-drop").html('').html(selectControl)
								var tableStr = '<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">'
								tableStr += '<tr><th width="44%" scope="col" id="videoHead">玩法</th><th width="17%" scope="col">单场限额</th><th width="39%" scope="col">单注限额</th></tr>'
								tableStr += '<tbody id="videoDataBody"></tbody></table>'
								$(".content-two").html('').html(tableStr)
								centerTzzx.loadDic('video')

							} else if (text == sportText) {
								var selectControl = '<select id="gameSelect" onchange="centerTzzx.getChange(this)"></select>'
								$(".trade-drop").html('').html(selectControl)
								var tableStr = '<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">'
								tableStr += '<tr><th width="10%" scope="col" id="videoHead">玩法</th>'
								tableStr += '<th width="7%" class="sport-H1" scope="col">让球</th>'
								tableStr += '<th width="7%" class="sport-H1" scope="col">大小</th>'
								tableStr += '<th width="7%" class="sport-H1" scope="col">滚球</th>'
								tableStr += '<th width="10%" class="sport-H1" scope="col">滚球大小</th>'
								tableStr += '<th width="7%" class="sport-H1" scope="col">单双</th>'
								tableStr += '<th width="10%" class="sport-H1" scope="col">让球过关</th>'
								tableStr += '<th width="10%" class="sport-H1" scope="col">综合过关</th>'

								tableStr += '<th width="7%" class="sport-H2" scope="col">独赢</th>'
								tableStr += '<th width="10%" class="sport-H2" scope="col">滚球独赢</th>'
								tableStr += '<th width="10%" class="sport-H2" scope="col">标准过关</th>'
								tableStr += '<th width="7%" class="sport-H2" scope="col">波胆</th>'
								tableStr += '<th width="7%" class="sport-H2" scope="col">入球</th>'
								tableStr += '<th width="9%" class="sport-H2" scope="col">半全场</th>'
								tableStr += '<th width="17%" class="sport-H3" scope="col">冠军</th></tr>'
								tableStr += '<tbody id="videoDataBody"></tbody></table>'
								$(".content-two").html('').html(tableStr)

								centerTzzx.loadDic('sport')
							} else if (text == lotteryText) {
								$(".trade-drop").html('')
								var tableStr = '<table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">'
								tableStr += '<tr><th width="25%" scope="col" >低频彩单注最高中奖额</th><th width="25%" scope="col">非低频彩单注最高中奖额</th><th width="25%" scope="col">低频彩单期最高中奖额</th><th width="25%" scope="col">非低频彩单期最高中奖额</th></tr>'
								tableStr += '<tbody id="videoDataBody"></tbody></table>'
								$(".content-two").html('').html(tableStr)
								centerTzzx.loadLotteryData()
							}
						})
	},
	disPlaySportData : function(gameName) {
		var navObj = $('.table')
		navObj.find('.sport-H1').hide()
		navObj.find('.sport-H2').hide()
		navObj.find('.sport-H3').hide()
		if (gameName == '足球') {
			navObj.find('.sport-H1').show()
			navObj.find('.sport-H2').show()
		}
		if (gameName == '篮球') {
			navObj.find('.sport-H1').show()
		}
		if (gameName == '冠军') {
			navObj.find('.sport-H3').show()
		}
	},
	getChange : function(obj) {
		var gameId = obj.value
		var game = $('.small-title').find('.current').text()
		if (game == videoText) {
			var gameName = $("#" + obj.id).find("option:selected").text()
			centerTzzx.loadVideoByGameId(gameId, gameName, 3)
		} else if (game == sportText) {
			var gameName = $("#" + obj.id).find("option:selected").text()
			centerTzzx.loadSportByGameId(gameId, gameName, 2)
		}
	},
	loadVideoByGameId : function(gameId, gameName, gameType) {
		if (cms.checkLoginVar()) {
			$("#videoHead").html('').html(gameName)

			cms.page.send("/web/browse/userVideo.htm", {
				data : {
					sn : cms.getWebSn(),
					uid : cms.getUid(),
					gameType : gameType,
					gameTypeId : gameId
				},
				success : function(obj) {
					if (obj.success) {
						var datas = obj.data
						if (datas != null) {
							var size = datas.length
							var optionStr = ""
							for (var i = 0; i < size; i++) {
								var maximum = datas[i].maximum
								var minimum = datas[i].minimum
								var subname = datas[i].subname
								optionStr += "<tr><td>" + subname + "</td><td>"
										+ maximum + "</td><td>" + minimum
										+ "</td></tr>"
							}
							$("#videoDataBody").html("").html(optionStr)
						}
					}
				}
			})
		} else {
			window.top.loginOutBySn(sn)
		}
	},
	loadSportByGameId : function(gameId, gameName, gameType) {
		if (cms.checkLoginVar()) {
			$("#videoHead").html('').html(gameName)
			cms.page.send(
							"/web/browse/userSport.htm",
							{
								data : {
									sn : cms.getWebSn(),
									uid : cms.getUid(),
									gameType : gameType,
									gameTypeId : gameId
								},
								success : function(obj) {
									if (obj.success) {
										var datas = obj.data
										if (datas != null) {
											var size = datas.length
											var optionStr = ""
											for (var i = 0; i < size; i++) {
												var entity = datas[i]
												optionStr += "<tr><td>"
														+ entity.subname
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.handicap
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.bigness
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.grounder
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.ballsize
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.odd_even
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.bigness_past
														+ "</td>"
												optionStr += "<td class='sport-H1' style='display:none'>"
														+ entity.bigness_complex
														+ "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.capot
														+ "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.grounder_capot
														+ "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.past + "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.ball_will
														+ "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.goals
														+ "</td>"
												optionStr += "<td class='sport-H2' style='display:none'>"
														+ entity.half + "</td>"
												optionStr += "<td class='sport-H3' style='display:none'>"
														+ entity.champion
														+ "</td></tr>"
											}
											$("#videoDataBody").html("").html(
													optionStr)
											centerTzzx
													.disPlaySportData(gameName)
										}
									}
								}
							})
		} else {
			window.top.loginOutBySn(sn)
		}
	},
	loadLotteryData : function() {
		if (cms.checkLoginVar()) {
			cms.page.send("/web/browse/userLottery.htm",
							{
								data : {
									sn : cms.getWebSn(),
									uid : cms.getUid()
								},
								success : function(obj) {
									if (obj.success) {
										var datas = obj.data
										if (datas != null) {
											var size = datas.length
											var optionStr = ""
											for (var i = 0; i < size; i++) {
												var entity = datas[i]
												var lowsOrderPayoff = entity.lowsOrderPayoff
												var unlowsOrderPayoff = entity.unlowsOrderPayoff
												var lowsRoundPayoff = entity.lowsRoundPayoff
												var unlowsRoundPayoff = entity.unlowsRoundPayoff
												optionStr += "<tr><td>" + lowsOrderPayoff + "</td><td>" + unlowsOrderPayoff + "</td><td>" + lowsRoundPayoff + "</td><td>" + unlowsRoundPayoff + "</td></tr>"
											}
											$("#videoDataBody").html("").html(optionStr)
										}
									}
								}
							})
		} else {
			window.top.loginOutBySn(sn)
		}
	},
	/**
	 * 加载游戏类型字典数据
	 */
	loadDic : function(game) {
		var gameType = 0
		if (game == 'video') {
			gameType = 3
		} else if (game == 'sport') {
			gameType = 2
		} else if (game == 'lottery') {
			gameType = 1
		}

		if (cms.checkLoginVar()) {
			cms.page.send("/web/browse/dictionary.htm?gameType=" + gameType, {
				success : function(obj) {
					if (obj.success) {
						var datas = obj.data
						if (datas != null) {
							var size = datas.length
							var optionStr = ""
							for (var i = 0; i < size; i++) {
								var id = datas[i].id
								var name = datas[i].type_name
								if (i == 0) {
									optionStr += "<option value='" + id
											+ "' selected='selected'>" + name
											+ "</option>"
									if (game == 'video') {
										centerTzzx.loadVideoByGameId(id, name,
												gameType)
									} else if (game == 'sport') {
										centerTzzx.loadSportByGameId(id, name,
												gameType)
									}
								} else
									optionStr += "<option value='" + id + "' >"
											+ name + "</option>"
							}
							$("#gameSelect").html("").html(optionStr)
						}
					}
				}
			})
		} else {
			window.top.loginOutBySn(sn)
		}
	}
}

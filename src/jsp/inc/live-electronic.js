$(function() {
	liveElec.eTrial()
	liveElec.ePlay()
})

jQuery.support.cors = true
var liveElec = {
	eTrial : function() {
		var obj = $(".elenew-game-ctl-wrap")
		var imgs = $($(obj.parent()).find("img"))
		var acons = obj.find("a[class='elenew-game-link ctl-btn-rule']")
		$.each(acons,
					function(i) {
							var im = acons[i]
							var gc = $(imgs[i]).attr("src")
							if (null != gc) {
								var bi = gc.lastIndexOf("/") + 1
								var ei = gc.lastIndexOf(".")
								var gn = gc.substring(bi, ei)
								$(im).click(function() {
													var url = "http://cache.download.banner.mightypanda88.com/casinoclient.html?language=zh-cn&game="
															+ gn+ "&mode=offline&affiliates=1&currency=CNY"
													window.open(url, "_blank")
												})
							}
						})
	},
	ePlay : function() {
		var obj = $(".elenew-game-ctl-wrap")
		var imgs = $($(obj.parent()).find("img"))
		var acons = obj.find("a[class='elenew-game-link ctl-btn-enter']")
		$.each(acons, function(i) {
			var im = acons[i]
			if("" == cms.getToken()){
				$(im).click(function(){
					parent.JsMsg.warnMsg("请先登录!")
				})
			}else if("DEMO" == cms.getWebSn()){
				$(im).click(function(){
					parent.JsMsg.warnMsg("请使用正式帐号登录!")
					})
			}else{
				var gc = $(imgs[i]).attr("src")
				if (null != gc) {
					var bi = gc.lastIndexOf("/") + 1
					var ei = gc.lastIndexOf(".")
					var gn = gc.substring(bi, ei)
					var lan = "EN"
					var url = "http://game.dyvip888.com/pt-play.html?gameCode=" + gn+"&sessionId="+cms.getToken()+"&lan="+lan
					$(im).attr("href",url).attr("target","_block")
				}
			}
		})

	}
}

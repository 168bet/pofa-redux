$(function() {
	liveElecMg.ePlay();
});

jQuery.support.cors = true;
var liveElecMg = {

	ePlay : function() {
		if("" == cms.getToken()){
			var obj = $(".elenew-game-ctl-wrap");
			var imgs = $(obj.parent()).find("dt>a");
			var acons = obj.find("a[class='elenew-game-link ctl-btn-enter']");
			var temp = "";
			$.each(acons, function(i) {
				var im = acons[i];
				$(im).click(function(){
					  parent.JsMsg.warnMsg("请先登录!");
					});
			});
		}else if("DEMO" == cms.getWebSn()){
			var obj = $(".elenew-game-ctl-wrap");
			var imgs = $(obj.parent()).find("dt>a");
			var acons = obj.find("a[class='elenew-game-link ctl-btn-enter']");
			var temp = "";
			$.each(acons, function(i) {
				var im = acons[i];
				$(im).click(function(){
					parent.JsMsg.warnMsg("请使用正式帐号登录!");
				});
			});
		}else{
			$.cloudCall({
				method : "thirdparty.mg.game.url",
				isLoading : false,
				params : {
					sessionId : cms.getToken()
				},
				success : function(data) {
					if (data.error == null && data.result != null) {
						var obj = $(".elenew-game-ctl-wrap");
						var imgs = $(obj.parent()).find("dt>a");
						var acons = obj.find("a[class='elenew-game-link ctl-btn-enter']");
						var temp = "";
						$.each(acons, function(i) {
							var im = acons[i];
							var gc = imgs[i].id;
							
							if (null != gc) {
									$(im).click(function(){
											 var s1 = data.result.st6;
											 var s2 = data.result.st8;
											 var ul = "zh";
											 var action = "https://redirect.CONTDELIVERY.COM/Casino/Default.aspx";
											 var form = document.createElement("form");
											   form.setAttribute("method", "post");
											   form.setAttribute("action", action);
											   form.setAttribute("target", "_blank");
											   form.setAttribute("style", "display:none");
											   var hiddenField = document.createElement("input"); 
											   hiddenField.setAttribute("name", "applicationid");
											   hiddenField.setAttribute("value", "1023");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "csid");
											   hiddenField.setAttribute("value", "16113");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "serverid");
											   hiddenField.setAttribute("value", "16113");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");   
											   hiddenField.setAttribute("name", "theme");
											   hiddenField.setAttribute("value", "igamingA4");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "usertype");
											   hiddenField.setAttribute("value", "0");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "variant");
											   hiddenField.setAttribute("value", "instantplay");
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "sext1");
											   hiddenField.setAttribute("value", s1);
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");   
											   hiddenField.setAttribute("name", "sext2");
											   hiddenField.setAttribute("value", s2);
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "ul");
											   hiddenField.setAttribute("value", ul);
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   hiddenField = document.createElement("input");  
											   hiddenField.setAttribute("name", "gameid");
											   hiddenField.setAttribute("value", gc);
											   hiddenField.setAttribute("type", "hidden");
											   form.appendChild(hiddenField);
											   document.body.appendChild(form);            
											   form.submit();
									});
								}
						});
					} else {
						JsMsg.errorObjMsg(data.error);
					}
				}
			});
		}
		
	}
};


$(function() {
	liveAgent.setAgentUrl()
})

jQuery.support.cors = true
var liveAgent = {
	setAgentUrl : function() {
	   var wsn = cms.getWebSn2()
	   $.cloudCall({
			method : "agent.website.get",
			params : {
				sn : wsn,
			},
			success : function(obj) {
				if (obj.error == null && obj.result != null) {
					$("#agentUrl").attr("href",obj.result).attr("target","_block")
				} 
			}
		})
	
	},
	escape2Html : function (str) {
		 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}
		 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t]})
	}
}


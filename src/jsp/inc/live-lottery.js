
$(function(){
	//liveLottery.openLottery();
})

jQuery.support.cors = true
var liveLottery = {	
		
	openLottery:function(obj){
		cms.validateToken(function(){
			
			var token = window.top.token	
		})

	}

}


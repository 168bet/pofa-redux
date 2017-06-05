
$(function() {
	sninfo2Obj.initData()
})

jQuery.support.cors = true
var sninfo2Obj = {
		initData : function() {
			sninfo2Obj.snInterval()				
		},
		sninfo : function(){
			 var domain = document.domain
			 $.cloudCall({
					method : "sn.info",
					async : true,
					isLoading : false,
					params : {
						domain : domain
					},
					success : function(obj) {
						if (obj.error == null && obj.result != null) {
							var title = obj.result.websiteTitle
							sninfo2Obj.setCookie("Sitetile", title)
							sninfo2Obj.setCookie("CustomerUrl",obj.result.onlineCustomerServiceUrl)
							sninfo2Obj.setCookie("Modules", obj.result.maintain.modulesJson, 2)// 0.5 h
							sninfo2Obj.setCookie("ForwardUrl", obj.result.maintain.forwardUrl)
						} 
					}
				})
		},
		snInterval : function(){
			sninfo2Obj.sninfo()
			var stt =  setTimeout(function(){  
				clearTimeout(stt)
				//0.5 h 
				var st = setInterval(function() {getSnInfoStatus()}, 5*60*1000)		
				function getSnInfoStatus() {
					sninfo2Obj.sninfo()
				}
			   },100)
		},
		setCookie : function (name, value, imark) {
			if (imark == 1) {
				document.cookie = name + "=" + escape(value) + ";path=/"
			}if (imark == 2) {
				var exp = new Date()
				exp.setTime(exp.getTime() + 5 * 60 * 1000)
				document.cookie = name + "=" + escape(value) + ";path=/"
			} else {
				var Days = 1
				var exp = new Date()
				exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
				document.cookie = name + "=" + escape(value) + ";path=/;expires="
						+ exp.toGMTString()
			}
		},
		getCookie : function (name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
			if (arr = document.cookie.match(reg))
				return unescape(arr[2])
			else
				return null
		}
	}

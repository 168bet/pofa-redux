var bgMobile = {
    initData: function() {
        var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire")
        var browser = navigator.userAgent.toLowerCase()
        var isMobile = false
        var sn = bgMobile.getCookie("WebSn")
        var forcePC = false
        if (bgMobile.queryString("forcePC") == "true") {
            forcePC = true
        }

        for (var i = 0; i < mobileAgent.length; i++) {
            if (browser.indexOf(mobileAgent[i]) != -1) {
                isMobile = true
                break
            }
        }
		
		if (sn == "bt00") {
			isMobile = true
			forcePC = false
		}
		
        if (isMobile && forcePC == false) {
            bgMobile.delCookie("isLogin")
            bgMobile.delCookie("Token")
            bgMobile.delCookie("loginStatus")
            bgMobile.delCookie("trialPlay")
            var dm = document.domain.substr(0, document.domain.indexOf("."))
            var ml = "m." + document.domain
            if (ml == "m") {
                ml = document.domain
            }
            if (sn == "aq00") {
                ml = "ml.aq1073.bg866.com"
            }
            location.href = 'http://' + ml + '?sn=' + sn
        } else {
            document.write('<script type="text/javascript" src="/inc/sninfo.js"><\/script>')
        }
    },
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        if (arr = document.cookie.match(reg))
            return unescape(arr[2])
        else
            return null
    },
    delCookie: function(name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = bgMobile.getCookie(name)
        if (cval != null)
            document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString()
    },
    queryString: function(key) {
        return (document.location.search.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', null])[1]
    }
}

bgMobile.initData()

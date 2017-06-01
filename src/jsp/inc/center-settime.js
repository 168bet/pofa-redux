$(function() {
	setInterval("bgSetTime.RefTime()", 1000);
});

var bgSetTime = {
	// 设置美东时间
	RefTime : function() {
		var dd2 = new Date();
		
		//当前日期是一个月的第几周
		var wn = bgSetTime.getMonthWeekNumber();
		var dm = dd2.getMonth() + 1;
		var xl = 240;
		//美国的夏令时是从每年3月第2个星期日到11月第一个星期日
		if (dm > 3 && dm < 11) {
			xl = 240;
		}		
		if (dm == 3 && wn >= 2) {
			xl = 240;
		}
		//0-6对应为星期日到星期六 
		var mw = dd2.getDay();
		var fff = bgSetTime.getFt();
		if (dm == 11 && (dd2.getTime() - fff.getTime() <= 0)) {
			xl = 240;
		}
		
		
		dd2.setMinutes(dd2.getMinutes()+dd2.getTimezoneOffset()-xl);
		
		var y = dd2.getFullYear();
		var m = bgSetTime.fixNum(dd2.getMonth() + 1);
		var d = bgSetTime.fixNum(dd2.getDate());
		var h = bgSetTime.fixNum(dd2.getHours());
		var mm = bgSetTime.fixNum(dd2.getMinutes());
		var s = bgSetTime.fixNum(dd2.getSeconds());
		
		 
		var tStr = y + "/" + m + "/" + d + " " + h +":"+ mm +":"+ s;
		$(".times-con").find("span").html(tStr);
		$(".user-time").find("span").html("美东时间："+ tStr);
	
	},
	getFt : function() {
		
		var d = new Date();
		d.setHours(0, 0, 0, 0);
		var didx = 1;
		d.setMonth(10, didx);
		var md = d.getDay();
		while (md != 0) {
			didx = didx + 1; 
			d.setMonth(10, didx);
			md = d.getDay();
		}
		return d;
	},
	getMdTime : function() {
		var dd2 = new Date();
		
		//当前日期是一个月的第几周
		var wn = bgSetTime.getMonthWeekNumber();
		var dm = dd2.getMonth() + 1;
		var xl = 240;
		//美国的夏令时是从每年3月第2个星期日到11月第一个星期日
		if (dm > 3 && dm < 11) {
			xl = 240;
		}		
		if (dm == 3 && wn >= 2) {
			xl = 240;
		}
		//0-6对应为星期日到星期六 
		var mw = dd2.getDay();
		var fff = bgSetTime.getFt();
		if (dm == 11 && (dd2.getTime() - fff.getTime() <= 0)) {
			xl = 240;
		}
		
		dd2.setMinutes(dd2.getMinutes()+dd2.getTimezoneOffset()-xl);
		
		var y = dd2.getFullYear();
		var m = bgSetTime.fixNum(dd2.getMonth() + 1);
		var d = bgSetTime.fixNum(dd2.getDate());
		var h = bgSetTime.fixNum(dd2.getHours());
		var mm = bgSetTime.fixNum(dd2.getMinutes());
		var s = bgSetTime.fixNum(dd2.getSeconds());
		
		 
		var tStr = y + "-" + m + "-" + d ;

	   return tStr;
	},
	fixNum : function(num) {
		var t = parseInt(num);
		if(t < 0){
			t = (-1)*t;
		}
		return (t < 10) ? ('0' + t) : t;
	},
	getYearWeekNumber :function(){
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth();
		var days = now.getDate();
		// 那一天是那一年中的第多少天
		for (var i = 0; i < month; i++) {
			days += bgSetTime.getMonthDays(year, i);
		}

		// 那一年第一天是星期几
		var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

		var week = null;
		if (yearFirstDay == 1) {
			week = Math.ceil(days / yearFirstDay);
		} else {
			days -= (7 - yearFirstDay + 1);
			week = Math.ceil(days / 7) + 1;
		}

		return week;
	},
	getMonthWeekNumber :function(){
		//当前时间是本月第几周
		var now = new Date();
		var a = now.getFullYear();
		var b = now.getMonth()+1;
		var c = now.getDate();
		var date = new Date(a, parseInt(b) - 1, c);
		var w = date.getDay();
		var d = date.getDate(); 
		var wn = Math.ceil((d + 6 - w) / 7 ); 
		return wn;
	},
	isLeapYear :function(year){
		// 判断年份是否为润年
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	},
	getMonthDays : function(year, month){
		 return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (bgSetTime.isLeapYear(year) ? 29 : 28);
	}
	
};

var commonObj = {
	initData : function(obj) {
		var dataObj = obj;
		$.each(dataObj, function(i) {
			var item = dataObj[i];
			var id = item.id;
			var content = cms.updatePath(cms.page.tobase64Decode(item.contentZh));
			if(id == "#sitetitle"){
			}
			else{
				$(id).html("").html(content);
				if (!cms.isNull(item.tid)) {
					$(item.tid).html("").html(item.titleZh);
				}
			}
		});
	},
	ProNoticeInitData : function(obj) {
		proNoticeConfig.proNoticeInit(commonObj.dateProcessor(obj));
	},
	logoInitData : function(obj) {
		var dataObj = commonObj.dateProcessor(obj);
		$(".logo").show();
		$.each(dataObj, function(i) {
			var item = dataObj[i];
			var id = item.id;
			var sDate = new Date(item.startDate);
			var eDate = new Date(item.endDate);
			var cDate = new Date(cms.util.getToday());
			var min = cDate.getMinutes();
			var sdiff = parseInt(sDate.getTime() - cDate.getTime());
			var ediff = parseInt(eDate.getTime() - cDate.getTime());
			if (sdiff <= 0 && ediff >= 0) {
				var path = cms.updatePath(item.data);
				var params = logoObjData.logoInit(path);
				$(".logo,"+id).find("a").css(params);
				
				commonObj.setCookie("logoPic", JSON.stringify(params), 1);
			}
		});
	},
	setCookie : function(name, value,imark) {
		var Days = 1;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		
		if(imark == 1){
			document.cookie = name + "=" + escape(value)+";path=/";
		}else{
		  document.cookie = name + "=" + escape(value) + ";path=/;expires="+ exp.toGMTString();
		}
	}
	,
	sliceInitData : function(obj) {
		sliceSetting.sliceInit(obj);
		console.log(obj)
	},
	layerInitData : function(obj) {
		layConfig.layInit(obj);
	},
	proInitData : function(obj) {
		var dataObj = obj;
		var title = $('#taccordion').find('ul');
		var hStr = '';
		var sn = cms.getWebSn2();
		if(sn == "de00"){
		}else{

			hStr += '<li><a class="hover" style="cursor:pointer;">所有活动</a></li>';
		}

		$("#accordion").html("");
		$.each(dataObj, function(i) {
			var item = dataObj[i];
			hStr += "<li><a style='cursor:pointer;'>" + item.titleZh + "</a></li>";
		});
		title.html("").html(hStr);
		// set all proitem...
		setAllData(dataObj);
        var aobj = $('#taccordion').find("a");
        aobj.click(function() {
        	aobj.removeClass("hover");
        	$(this).addClass("hover");
			var trgtxt = $(this).text();
			$.each(dataObj, function(i) {
				var item = dataObj[i];
				var id = item.id;
				
				if (item.titleZh == trgtxt && item.code != 'PT1') {
					var tempStr = "";
					$.each(item.items,function(d){
						var itm = item.items[d];
						tempStr  += createData(itm,d);
					});
					$("#accordion").html("").html(tempStr);
					return;
				} else if ("所有活动" == trgtxt) {
					setAllData(dataObj);
					return;
				}
			});
		});

		function keysrt(key, desc) {
			return function(a, b) {
				var t1 = parseInt(a[key]);
				var t2 = parseInt(b[key]);
				return desc ? t2 - t1 : t1 - t2;
			}
		}

		function setAllData(dobj) {
			var allItems = [];
			$.each(dobj, function(k) {
				var imd = dobj[k];
				$.each(imd.items, function(m) {
					var mm = imd.items[m];
					allItems.push(mm);
				});
			});

			// sort by sequence
			allItems.sort(keysrt('sequence', true));

			var allData = "";
			$.each(allItems, function(k) {
				var imd = allItems[k];
				allData += createData(imd,k);
			});
			$("#accordion").html("").html(allData);
		}

		function createData(im,index) {
			var dStr = proConfig.proInit(im, index);
			return dStr;
		}
	},
	dateProcessor: function(obj) {
		for(var i=0; i<obj.length; i++) {
			if(obj[i].startDate) {
				if(obj[i].startDate.indexOf(" ") > -1) {
					obj[i].startDate = obj[i].startDate.replace(/ /g,"T");
				}
			}
			if(obj[i].endDate) {
				if(obj[i].endDate.indexOf(" ") > -1) {
					obj[i].endDate = obj[i].endDate.replace(/ /g,"T");
				}
			}
		}
		return obj;
	}
};

export default commonObj
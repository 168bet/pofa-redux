$(function() {
    centerEd.loadBalanceList()

    $("#transA").click(function() {
        centerEd.transAmount()
    })
})

jQuery.support.cors = true
Array.prototype.contains = function(item) {
    var i = this.length
    while (i--) {
        if (this[i] == item) {
            return true
        }
    }
    return false
}
var centerEd = {
    loadBalanceList: function() {

        $.cloudCall({
            method: "thirdparty.user.balance.list",
            isLoading: false,
            params: {
                sessionId: cms.getToken()
            },
            success: function(obj) {
                $("#emptyData").hide()
                if (obj.error == null && obj.result != null) {
                    var datas = centerEd.sortAllowID(obj.result.items)
                    var dtoStr = ""
                    $.each(datas, function(i) {
                        var item = datas[i]
                        var tpid = item.thirdpartyId
                        if (centerEd.checkAllowID(tpid) == true) {
                            dtoStr += '<div class="ed-block ed-list"><div class="ed-name">' + item.thirdpartyName + '</div><div class="ed-contant" style="text-align: right;"><font id="tp' + tpid + '">' + centerEd.toFloat(item.balance) + '</font> RMB<span class="mc-rmb" style="float:right; margin-left:5px;margin-right: 26px;"> <a onclick="centerEd.reashBalanceData(' + tpid + ')" style="float: right;margin-right: -25px;" href="javascript:void(0);" ><img id="imgR' + tpid + '" title="点击刷新' + item.thirdpartyName + '余额" src="/jsp/site/refersh.png"></a></span></div></div>'
                        }
                    })

                    $('#dtoList').html("").html(dtoStr)
                    if (dtoStr == "") {
                        $("#emptyData").show()
                    }
                    centerEd.loadBalanceList2(datas)
                } else {
                    JsMsg.errorMsg(obj.error)
                }
            }
        })
    },
    reashBalanceData: function(id) {
        $("#imgR" + id).removeAttr("src").attr("src", "/jsp/site/refersh.gif")
        $.cloudCall({
            method: "thirdparty.user.balance.refresh",
            isLoading: false,
            params: {
                sessionId: cms.getToken(),
                thirdpartyId: id
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null && obj.result.flag == "1") {
                    var balance = obj.result.balance
                    $("#tp" + id).html(centerEd.toFloat(balance))
                } else {
                    JsMsg.warnMsg("更新余额失败!")
                }
                $("#imgR" + id).removeAttr("src").attr("src", "/jsp/site/refersh.png")
            }
        })
    },
    loadBalanceList2: function(ditems) {
        var wn = cms.getWebSn()
        if (wn === "ad00" || wn === "SP01" || wn === "ac00" || wn === "am00" || wn === "ar00") {} else {
            $.cloudCall({
                method: "thirdparty.list",
                isLoading: false,
                params: {
                    sn: wn
                },
                success: function(obj) {
                    $("#emptyData").hide()
                    if (obj.error == null && obj.result != null) {
                        var datas = centerEd.sortAllowID(obj.result)
                        var optionStr = "<option value='0' >系统额度</option>"
                        $.each(datas, function(i) {
                            var item = datas[i]
                            if (centerEd.checkAllowID(item.id) == true) { //xtd, ve
                                optionStr += "<option value='" + item.id + "' >" + item.name + "</option>"
                            }
                        })

                        $('#fAmount,#tAmount').html("").html(optionStr)
                        var dl = ditems.length
                        if (dl < datas.length) {
                            var dtoStr = $('#dtoList').html()
                            $.each(datas, function(i) {
                                var item = datas[i]
                                var id = item.id
                                var tpid = item.id
                                if (centerEd.checkAllowID(item.id) == true) {
                                    if (dl > 0) {
                                        var dlist = []
                                        $.each(ditems, function(k) {
                                            var im = ditems[k]
                                            dlist.push(im.thirdpartyId)
                                        })
                                        if (!dlist.contains(item.id)) {
                                            dtoStr += '<div class="ed-block ed-list"><div class="ed-name">' + item.name + '</div><div class="ed-contant" style="text-align: right;"><font id="tp' + tpid + '">0.00</font> RMB<span class="mc-rmb" style="float:right; margin-left:5px;margin-right: 26px;"> <a onclick="centerEd.reashBalanceData(' + tpid + ')" style="float: right;margin-right: -25px;" href="javascript:void(0);" ><img id="imgR' + tpid + '" title="点击刷新' + item.name + '余额" src="/jsp/site/refersh.png"></a></span></div></div>'
                                        }
                                    } else if (dl == 0) {
                                        dtoStr += '<div class="ed-block ed-list"><div class="ed-name">' + item.name + '</div><div class="ed-contant" style="text-align: right;"><font id="tp' + tpid + '">0.00</font> RMB<span class="mc-rmb" style="float:right; margin-left:5px;margin-right: 26px;"> <a onclick="centerEd.reashBalanceData(' + tpid + ')" style="float: right;margin-right: -25px;" href="javascript:void(0);" ><img id="imgR' + tpid + '" title="点击刷新' + item.name + '余额" src="/jsp/site/refersh.png"></a></span></div></div>'
                                    }
                                }
                            })

                            $('#dtoList').html("").html(dtoStr)
                        }
                    } else {
                        JsMsg.errorMsg(obj.error)
                    }
                }
            })
        }
    },
    toFloat: function(obj) {
        var temp = ""
        if (undefined != obj && "" != obj.toString()) {
            temp = obj.toFixed(2)
        }
        return temp
    },
    loadBalance: function() {
        $.cloudCall({
            method: "user.balance.get",
            async: true,
            params: {
                sessionId: cms.getToken()
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null) {
                    var cookieObj = cms.getCookie("loginStatus")
                    var model = eval('(' + cookieObj + ')')
                    model.balance = obj.result.balance
                    if (cookieObj != null && cookieObj != '') {
                        opener.bgPage.setReStatus(model)
                        var jsonObj = JSON.stringify(model)
                        cms.setCookie("loginStatus", jsonObj)
                    }
                } else {
                    JsMsg.errorMsg(obj.error)
                }
            }
        })
    },
    transAmount: function() {
        var fa = $("#fAmount").val()
        var ta = $("#tAmount").val()
        var am = $("#amount").val()
        if (fa != 0 && ta != 0) {
            JsMsg.warnMsg("第三方平台余额不可相互转换!")
            return
        }

        if (fa == ta) {
            JsMsg.warnMsg("选择转出转入平台不可相同!")
            return
        }

        if (!cms.isDecimal2(am)) {
            JsMsg.warnMsg("请输入正确的转换金额!")
            return
        }
        $.cloudCall({
            method: "thirdparty.user.balance.exchange",
            async: true,
            params: {
                sessionId: cms.getToken(),
                from: fa,
                to: ta,
                amount: am
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null) {
                    JsMsg.infoMsg("额度转换成功!", {
                        callback: function() {
                            centerEd.loadBalance()
                            centerEd.loadBalanceList()
                            $("#amount").val('')
                        }
                    })
                } else {
                    JsMsg.errorObjMsg(obj.error)
                }
            }
        })
    },
    checkAllowID: function(id) {
        var sn = cms.getWebSn()
        if(sn === "au00" || sn === "bh00") {
            if(id == "8" || id == "11" || id == "12" || id == "13" || id == "16" || id == "17") {
                return true
            }
        }else if(sn === "ae00" || sn === "ap00") {
            if(id != "7") {
                return true
            }
        }else {
            if(id != "7" && id != "16") {
                return true
            }
        }
        return false
    },
    sortAllowID: function(datas) {
        var tempVegasArray = [],
            tempOtherArray = [],
            sn = cms.getWebSn()
        for(var i = 0; i < datas.length; i++) {
            if((sn === "au00" || sn === "bh00") && (datas[i].id == "16" || datas[i].thirdpartyId == "16")) {
                tempVegasArray.push(datas[i])
            }else {
                tempOtherArray.push(datas[i])
            }
        }
        return tempVegasArray.concat(tempOtherArray)
    }
}

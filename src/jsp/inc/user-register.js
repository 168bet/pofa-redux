var formValid
var sn = cms.queryString('sn')
if (!cms.isNull(sn)) {
    var path = cms.getWebPath()
    var path3 = "/site/" + path + "/doc/sitetitle.js?t=" + $.randNum()
    document.write('<script type="text/javascript" src="' + path3 + '" > <\/script>')
}



$(function() {
    userInfoPage.loadCurrencyInfo()
    userInfoPage.loadRulesInfo()

   	setTimeout(function(){
	  userInfoPage.loadRecommend()
	},1200)

    $('#cagree').click(
        function() {
            if (this.checked)
                $('.btn-content').find("[type='submit']").removeAttr(
                    'disabled')
            else
                $('.btn-content').find("[type='submit']").attr('disabled',
                    'disabled')
        })

    $('.btn-content').find("[type='submit']").click(function() {
        formValid.customSubmitFrom(function() {
            userInfoPage.registerUserInfo()
        })
        return false
    })

    $('.btn-content').find("[type='reset']").click(function() {
        formValid.resetForm()
        $('#rgfrom123').find(".info").hide()
    })

    formValid = $('#rgfrom123').find('form').validform({
        datatype: {
            "AccountExistValid": function(gets, obj, curform, dtype) {
            	var str = $(obj).val()
            	var inValid = /\s/
            	var whitespace = inValid.test(str)

                if (cms.isNull(gets)) {
                    return false
                }
                $(obj).attr("errormsg", "账号已经存在!")
                if (gets.length < 4 || gets.length > 12) {
                    $(obj).attr("errormsg", "请输入4-12位字符!")
                    return false
                }
                if (!cms.isAcceptChars2(false, 4, 12, gets) || whitespace) {
                	$(obj).addClass("Validform_error")
                	$("#NameInfo").removeClass("Validform_right").addClass("Validform_wrong")
                	$("#NameInfo").text('帐号不可包含汉字,标点,特殊字符!')
                    $(obj).attr("errormsg", "帐号不可包含汉字,标点,特殊字符!")
                    return false
                }


                var ischeck = userInfoPage.userExists(gets)
                if(ischeck){
                	$(obj).attr("errormsg", "")
                	$(obj).removeClass("Validform_error")
                	$("#NameInfo").removeClass("Validform_wrong").addClass("Validform_right")
                	$("#NameInfo").text('')
                }
                return ischeck
            },
            "disExistValid": function(gets, obj, curform, dtype) {
                if (cms.isNull(gets)) {
                    return false
                }
                var ischeck = userInfoPage.userExists(gets)
                return ischeck
            },
            "recheck_Pwd": function(gets, obj, curform, dtype) {
                var ischeck = true
                if (cms.isNull(gets)) {
                    ischeck = false
                }
                if (!cms.isValEq("password", gets)) {
                    ischeck = false
                }
                return ischeck
            }
        },
        callback: function(sform) {}
    })

    $("#birthday").val("1975-01-01")

    $(".agree").find("a").click(function() {
        $("#agreement-floating").show()
        var bgObj = document.createElement("div")
        bgObj.id = "rly1132"
        var wh = 'width:' + document.body.clientWidth + 'px;height:' + document.body.clientHeight + 'px; position: fixed; top: 0px; filter: alpha(opacity=30);  z-index: 10099; left: 0px; display: block;'
        bgObj.style.cssText = wh
        document.body.appendChild(bgObj)

        $(".icon-remove").click(function() {
            $("#agreement-floating").hide()
            $("#rly1132").remove()
        })
    })

})
var agentCode = ""
jQuery.support.cors = true
var userInfoPage = {
    getSnInfo: function() {
        var sn = cms.queryString('sn')
        if (cms.isNull(sn)) {
            sn = cms.getWebSn()
        }

        return sn
    },
    loadRecommend: function() {
        agentCode = cms.queryString('agentCode')
        var cookieObj = cms.getCookie("agentCode")
        if (cms.isNull(agentCode) && !cms.isNull(cookieObj)) {
            agentCode = cookieObj == "null" ? "" : cookieObj
        } else {
            cms.setCookie("agentCode", agentCode)
        }
        if (!cms.isNull(agentCode) && agentCode != "undefined") {
            $("#recommendLoginId").val(agentCode).attr("readonly", "readonly")
        }
    },
    loadRulesInfo: function() {
        var inputs = $('#rgfrom123').find('input,select')
        var spans = $('#rgfrom123').find("[class='red mri7']")
        if (spans.length == 0) {
            spans = $('#rgfrom123').find("[class='red-sign']")
        }
        $.cloudCall({
            method: "sn.user.reg.setting",
            params: {
                sn: userInfoPage.getSnInfo()
            },
            success: function(obj) {
                if (obj.error == null && obj.result != null) {
                    var columns = []
                    var datas = obj.result
                    $.each(datas, function(i) {
                        var item = datas[i]
                        var note = $('#' + item.property)
                        note.parent().parent().show()
                        if (item.isVisible == 1) {
                            if (item.isRequired == 1) {
                                columns.push(item.property)
                            }
                        } else {
                            note.parent().parent().hide()
                            note.hide()
                            $('#' + item.property + "-1").hide()
                            if (item.property == 'password') {
                                $('#' + item.property + '2').hide()
                                $('#' + item.property + "-12").hide()
                            }
                        }
                    })

					var forms = $("#rgfrom123").find("form")
					$.each(forms, function(i) {
						var fm = forms[i]
						var ms = $(fm).find("input")
                        $(fm).hide()
						for(var j = 0; j < ms.length; j++){
							var t = $(ms[j]).attr("id")
							var f = false
							$.each(columns, function(i) {
								var m = columns[i]
								if(t == m){
									$(fm).show()
									f=true
								}
							})
							if(f){
								break
							}
						};
					})

                    var bpwd = false
                    spans.text('')
                    $.each(inputs, function(i) {
                        var input = inputs[i]
                        var id = input.id
                        if (id.toString() == "" || id.toString() == "cagree") {

                        } else {
                            if (!columns.contains(id)) {
                                if (id != "password2") {
                                    $('#' + id).removeAttr('datatype nullmsg sucmsg errormsg')
                                }
                            } else {
                                $('#' + id + "-2").text('*')
                                if (id == "password") {
                                    bpwd = true
                                }
                            }
                        }
                    })
                    if (columns.contains('pay_password')) {
                        $("#pay_password-2").text('*')
                    }else{
						$("#pay_password").parent().hide()
					}
                    if (bpwd) {
                        $("#password-12").find("span").text('*')
                    } else {
                        $("#password2").removeAttr('datatype nullmsg sucmsg errormsg')
                    }
                } else {
                    JsMsg.errorMsg(obj.error)
                }
            }
        })
    },

    userExists: function(account) {
        var ischeck = true
        $.cloudCall({
            method: "auth.loginId.exists",
            async: false,
            isLoading: false,
            params: {
                loginId: account,
                sn: userInfoPage.getSnInfo()
            },
            success: function(obj) {
                if (obj.error == null && obj.result.flag == 1) {
                    $("#recommendUserId").val(obj.result.userId)
                    ischeck = false
                }
            }
        })

        return ischeck
    },
    loadCurrencyInfo: function() {
        $.cloudCall({
            method: "currency.list",
            async: true,
            params: {
                sn: userInfoPage.getSnInfo(),
                status: 1
            },
            success: function(obj) {
                if (obj.error == null) {
                    var datas = obj.result
                    if (datas != null) {
                        var optionStr = ""
                        $.each(datas, function(i) {
                            var currencyinfo = datas[i]
                            var currencyId = currencyinfo.currencyId
                            var currencyCode = currencyinfo.currencyCode
                            var sel = ""
                            if (currencyCode == "RMB") {
                                sel = 'selected="selected"'
                            }
                            optionStr += "<option value='" + currencyId + "' " + sel + ">" + currencyCode + "</option>"
                        })
                        $('#currency_id').html("").html(optionStr)
                    }
                }
            }
        })

    },
    registerUserInfo: function() {
        var forms = $('#rgfrom123').find('form')
        var model = forms.serializeObject()
        var selects = $('#pay_password').find('select')
        var extrapwd = ""
        $.each(selects, function(i) {
            extrapwd += $(selects[i]).val()
        })
        model.sn = userInfoPage.getSnInfo()

        var agentCode = $("#recommendLoginId").val()
        if (!cms.isNull(agentCode)) {
            model.agentCode = agentCode
        }

        var encode = new Encode()
        model.password = encode.encodeSha1(model.password)
        model.payPassword = encode.encodeSha1(extrapwd)
        model.whihAuth = "1"
        model.regChannel = document.domain
        model.pwd2 = null
        $.cloudCall({
            method: "auth.reg.login",
            async: true,
            params: model,
            success: function(obj) {
                if (obj.error == null && obj.result.success == true) {
                    JsMsg.infoMsg("会员新增成功!", {
                        callback: function() {
                            var me = obj.result
                            var entity = {}
                            window.top.token = me.sessionId
                            cms.setCookie("Token", window.top.token, 1)
                            entity.account = model.loginId
                            entity.sn = model.sn
                            entity.uid = me.userId
                            entity.token = me.sessionId
                            entity.unreadNotice = 0
                            entity.currency = model.currency
                            entity.loginLastUpdateTime = new Date()
                            cms.setCookie("UserInfo", JSON.stringify(entity), 1)
                            cms.setCookie("isLogin", true, 1)
                            window.top.isLogin = true
                            var navName = "index.html"
                            var nav = cms.getCookie("CurrentUrl")
                            if (null != nav) {
                                navName = nav
                            }

                            bgPage.gologin(entity.token)
                            parent.location.reload()
                        }
                    })
                    $('.btn-content').find("[type='reset']").click()
                } else {
                    if (obj.error != null) {
                        JsMsg.errorMsg(obj.error)
                    }
                }
                if (!cms.isNull(agentCode)) {
                    $("#recommendLoginId").val(agentCode)
                }
                $("#birthday").val("1975-01-01")
                $('#cagree').prop("checked", true)
                $('.btn-content').find("[type='submit']").removeAttr('disabled')
            }
        })

    }
}

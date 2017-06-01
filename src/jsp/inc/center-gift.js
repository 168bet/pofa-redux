$(function() {
    $("#emptyData").show();
    centerGift.init();
    centerGift.initGiftList();
});

var statusDesc = {
    '1': '申请中',
    '2': '审批通过',
    '3': '拒绝'
}

jQuery.support.cors = true;
var centerGift = {
    init: function() {
        var licontrols = $(".mc-title").find("li");
        var ul = $(".mc-title").find("ul");
        licontrols.click(function() {
            var oldText = $(".mc-title").find("[class='current']").html();
            var curText = $(this).text();
            if (oldText == curText)
                return;
            if (curText == "礼品列表") {
                $(ul).html('<li class="current">礼品列表</li><li style="margin-top:19px;"><a href="javascript:;">兑换记录</a></li>');
                centerGift.initGiftList();
            } else if (curText == "兑换记录") {
                $(ul).html('<li style="margin-top:19px;"><a href="javascript:;">礼品列表</a></li><li class="current">兑换记录</li>');
                centerGift.initGiftRecord();
            }
            centerGift.init();
        });
    },
    initGiftList : function(){
        $("#giftList").html('').show();
        $("#recordList").hide();
        $("#emptyData").show();
        var tableH = '<th>礼品名称</th><th >兑换点数</th><th width="10%">数量</th><th width="35%">兑换开始<br>兑换結束</th><th width="10%">兑换</th>';
        $("#dtoHeader").html(tableH);
        getGiftList();
    },
    initGiftRecord : function(){
        $("#recordList").html('').show();
        $("#giftList").hide();
        $("#emptyData").show();
        var tableH = '<th>礼品名称</th><th width="35%">申请时间<br>审批时间</th><th width="15%">状态</th>';
        $("#dtoHeader").html(tableH);
        getRecords();
    },
}

//取得禮品列表
function getGiftList() {
    $.cloudCall({
        method: "user.point.gift.code.list",
        params: {
            sn: cms.getWebSn()
        },
        success: function(obj) {
            if (obj.error == null && obj.result != null) {
                setGiftList(obj.result);
            } else {
                JsMsg.errorMsg(obj.error);
            }
        }
    });
}

//禮品列表
function setGiftList(datas) {
    $('#giftList').html('');
    var html = '';
    $.each(datas, function(index, vo) {
        if (vo.isApply == 1) { //isApply == 1 才可以兑换
            html += '<tr>';
            html += '<td>' + vo.giftName + '</td><td>' + vo.point + '</td>';
            html += '<td>' + vo.total + '</td>';
            html += '<td>' + formatDateTime(vo.applyStartTime) + '<br>' + formatDateTime(vo.applyendtTime) + '</td>';
            html += '<td><button class="btn exchange" data-gfcode="' + vo.giftCode + '">兑换</button></td>';
            html += '</tr>';
        }
    });

    if(html) $("#emptyData").hide();
    $('#giftList').html(html);

    $('.exchange').on('click', function() {
        var giftName = $($(this).parent().parent().get(0)).children().get(0).innerText;
        var giftCode = $(this).data('gfcode');
        JsMsg.confirmMsg('确定要兑换[<font color="#157fbf">' + giftName + '</font>]?', {
            callback: function() {
                doExchange(giftCode);
            }
        });
    });
}

function formatDateTime(d) {
    return !d ? '-' : d.substring(0, d.lastIndexOf(':'));
}

function doExchange(giftCode) {
    $.cloudCall({
        method: "user.point.gift.redeem",
        params: {
            sessionId: cms.getToken(),
            giftCode: giftCode
        },
        success: function(obj) {
            if (obj.error == null && obj.result != null) {
                if (obj.result == 1) { //兌換成功
                    JsMsg.infoMsg("礼品兑换成功!", {
                        callback : function() {
                            getGiftList();
                        }
                    });
                }
            } else {
                JsMsg.errorMsg(obj.error);
            }
        }
    });
}

//取得兌換紀錄
function getRecords() {
    $.cloudCall({
        method: "user.point.gift.mget",
        params: {
            sessionId: cms.getToken()
        },
        success: function(obj) {
            if (obj.error == null && obj.result != null) {
                setRecords(obj.result);
            } else {
                JsMsg.errorMsg(obj.error);
            }
        }
    });
}

//兌換紀錄
function setRecords(datas) {
    $('#recordList').html('');
    var html = '';
    $.each(datas, function(index, vo) {
        html += '<tr>';
        html += '<td>' + vo.giftName + '</td>';
        html += '<td>' + formatDateTime(vo.applyTime) + '<br>' + formatDateTime(vo.approveTime) + '</td>';
        html += '<td>' + statusDesc[vo.status] + '</td>';
        html += '</tr>';
    });
    if(html) $("#emptyData").hide();
    $('#recordList').html(html);
}

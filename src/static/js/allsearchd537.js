
//var _search_page_id = ''; 
var _objAllSearchPageId = document.getElementById("page_id");
var _objAllSearchResult = document.getElementById("_allSearchResult");     
var _objAllSearchKeyword = document.getElementById("_allSearchKeyword");  
var _temp_only_mark_the_frist = 0;

var _last_click_hotel_id_from_search;
var _allSearchKeywordValue = "";
var _allSearchRequestTimeStamp = "";
var _tempInputValue = "";
var curIndex = 0;
var outerFormIsShit = 'FALSE';
var _search_placeHolder = "目的地/酒店/景点/关键字";
var _promotion_url = '';
var isFirstSendHttp = 'true';
var isDownKey = 'false';
var isHaveRecommondHistory = 'false';
 
 String.prototype.trim = function () {
    return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
 }
if (_objAllSearchKeyword.parentNode.getAttribute('class') == 'cui_search') {
   
}

var _objSearchFormForEnter = document.getElementById("_search_for_enter");
var _objSearchFormGetSubmit = document.getElementById("_justfor_form_get_submit");

_get_set_search_placeholder();

function _mIn(ob) {
    _mOut();
    $(ob).addClass("hover");
}

function _mOut() {  
    $(_objAllSearchResult).find('*').removeClass("hover");
}

function _get_set_search_placeholder() {

    _search_placeHolder = "搜索旅行地/酒店/旅游/景点门票/交通";

    //var httpRequest = null;
    //if (window.XMLHttpRequest) {
    //    if (_navigatorMSIE() == 1 && window.XDomainRequest) {
    //        httpRequest = new XDomainRequest();
    //    } else {
    //        httpRequest = new XMLHttpRequest();
    //    }
    //} else {
    //    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    //}
    //var uri = "//m.ctrip.com/restapi/h5api/searchapp/search?action=keyboardprompt&source=globalonline";
    //httpRequest.open("GET", uri, true);
    //httpRequest.send(null);
    //httpRequest.onload = function () {
    //   var jsons = httpRequest.responseText;
    //
    //    if (jsons.indexOf('|+|') > 0) {
    //        _search_placeHolder = jsons.split('|+|')[0];
    //        _promotion_url = jsons.split('|+|')[1];
    //    }
        if ('placeholder' in _objAllSearchKeyword) {
            _objAllSearchKeyword.placeholder = _search_placeHolder;
        } else {
            _objAllSearchKeyword.value = _search_placeHolder;
            _objAllSearchKeyword.style.color = 'gray';
        }
    //}

    //httpRequest.onerror = function () {
    //
    //    var jsons = httpRequest.responseText;
    //    var status = httpRequest.status ;
    //
    //    if ('placeholder' in _objAllSearchKeyword) {
    //        _objAllSearchKeyword.placeholder = _search_placeHolder;
    //    } else {
    //        _objAllSearchKeyword.value = _search_placeHolder;
    //        _objAllSearchKeyword.style.color = 'gray';
    //    }
    //}
}

function _get_last_choice() {
    var newID;
    return newID || "0";
}

function _getHover() {
    var m = 0;
    var aContentList = _objAllSearchResult.childNodes;
    if ($(_objAllSearchResult.childNodes[0]).text() == "历史搜索：" || $(_objAllSearchResult.childNodes[0]).text() == "无匹配的产品，您可以搜索：") {
        m = 1;
    } else {
        if (_objAllSearchResult.children.length == 0) {
            m = 1;
        } else {
            var inLIST = _objAllSearchResult.childNodes[0].childNodes;
            for (var innn = 0; innn < inLIST.length; innn++) {
                if (inLIST[innn].classList) {
                    if (inLIST[innn].classList.contains("hover")) {
                        return "0." + innn;
                    }
                } else {
                    if (inLIST[innn].className.indexOf("hover") != -1) {
                        return "0." + innn;
                    }
                }
            }
        }
    }
    
    for (; m < aContentList.length; m++) {
        if (aContentList[m].classList) {
            if (aContentList[m].classList.contains("hover")) {
                return m;
            }
        } else {
            if (!aContentList[m].className) {
                continue;
            }
            if (aContentList[m].className.indexOf("hover") != -1) {
                return m;
            }
        }
    }
    return -1;
}

function _getHoverIndex() {
    var m = 1;
    var aContentList = _objAllSearchResult.childNodes;
    if (!_objAllSearchResult.children.length) {
        return -2;
    }
    for (; m < aContentList.length; m++) {
        if (aContentList[m].classList) {
            if (aContentList[m].classList.contains("hover")) {
                return m;
            }
        } else {
            if (aContentList[m].className.indexOf("hover") != -1) {
                return m;
            }
        }
    }
    return -1;
}

function _getRealEleCount() {
    var list = _objAllSearchResult.childNodes;
    var len = list.length;
    if (list[len - 1].classList) {
        if (list[len - 1].classList.contains('search_close')) {
            return len - 2;
        } else {
            return len - 1;
        }
    } else {
        if (list[len - 1].className.indexOf('search_close') >= 0) {
            return len - 2;
        } else {
            return len - 1;
        }
    }
}

//兼容低版本的IE
document.body.onclick = function (e){
    if(_navigatorMSIE()==1){
        clickDocument(e);
      }
}

document.onclick = function (e) {
    if(_navigatorMSIE()!=1){
      clickDocument(e);
    }
}

function clickDocument(e){
    try {
        var ele = e ? e.target : window.event.srcElement;
        if (ele.id != '_allSearchResult' && ele.id != '_allSearchKeyword') {
            _objAllSearchResult.style.display = "none";
            if (_objAllSearchKeyword.value == "" && !('placeholder' in _objAllSearchKeyword)) {
             _objAllSearchKeyword.value = _search_placeHolder;
            _objAllSearchKeyword.style.color = 'gray';
            }

            if (_temp_only_mark_the_frist == 1) {
                _temp_only_mark_the_frist = 0;
                window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=LF&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
            }
        }
    }
    catch (e) { }
}

function _conversType(orType) { 
    var type = orType;
    switch (orType) {
        case 'hotelbrand':
        case 'hotellist':
        case 'zone':
        case 'zonehotel':
        case 'hotel':
        case 'locationhotel':
        case 'poihotel':
        case 'channelhotel':
        case 'channelhotelsearch':
		case 'desthotel':
            type = 'hotel'; break;
        case 'travellist':
        case 'channeltravelsearch':
        case 'sighttravel':
        case 'channeltravel':
        case 'channel_travel_group':
        case 'channel_travel_free':
		case 'ttdlist':
		case 'hhtravel':
		case 'flighthotel':
		case 'travelgroup':
            type = 'vacation'; break;
		case 'sighthotel':
		case 'channelsh':
			type = 'scenicHotel'; break;
        case 'ticket':
        case 'tickets':
        case 'channelticket':
        case 'channelticketsearch':
            type = 'ticket'; break;
        case 'intlairport':
        case 'channelplanesearch':
        case 'channelplane':
        case 'airporthotel':
        case 'flight':
        case 'airport':
		case 'flightschedule':
            type = 'flight'; break;
        case 'metrostation':
        case 'railwaystation':
        case 'trainhotel':
        case 'channeltrainsearch':
        case 'channeltrain':
        case 'train':
		case 'channelbus':
		case 'channelbussearch':
            type = 'train'; break;
        case 'sight':
        case 'attractions':
            type = 'destination'; break;
        case 'fun':
		case 'play':
		case 'entertainment':
		case 'huodong':
            type = 'play'; break;
        case 'shop':
		case 'shopping':
            type = 'shopping'; break;
        case 'channelgroup':
        case 'channeltuan':
        case 'channeltuansearch':
        case 'channelgroupsearch':
        case 'tuan':
            type = 'tuan'; break;
        case 'food':
        case 'sightrestaurant':
            type = 'food'; break;
        case 'district':
        case 'hotdistrict':
        case 'location':
        case 'channelother':
            type = 'location'; break;
        case 'gs':
        case 'channelgs':
        case 'channelgssearch':
            type = 'gs'; break;
        case 'car':
            type = 'car'; break;
        default:
            type = 'location';
            break;
    }
    return 'ico_' + type;
}

document.getElementById("search_button_global").onclick = function (e) {
    if ('placeholder' in _objAllSearchKeyword) {
        if (_objAllSearchKeyword.value == '' && _promotion_url != '') {
            window.open(_promotion_url);
			window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=EBC&AutoType=" + "&Yindex=" +
                _getHover() + "&keyword=\"" + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
            return;
        }
    } else {
        if ((_objAllSearchKeyword.value == _search_placeHolder || _objAllSearchKeyword.value == '') && _promotion_url != '') {
            window.open(_promotion_url);
			window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=EBC&AutoType=" + "&Yindex=" +
                _getHover() + "&keyword=\"" + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
            return;
        }
    }
    var curr = 0;
    var pointKey = {};
    if ($(_objAllSearchResult.childNodes[0]).text().indexOf('无匹配的产品') >= 0) {
        pointKey = _objAllSearchResult.childNodes[1];
        pointKey.click();
        return;
    }
     try {
        if (_objAllSearchResult.hasChildNodes()&& _objAllSearchResult.childNodes[0].hasChildNodes()) {
        pointKey = _objAllSearchResult.childNodes[0].childNodes[0];
     } else {
         pointKey = _objAllSearchResult.childNodes[1];  
     } 
      pointKey.click();
     } catch (e) {   
     }
}


function _allSearchEnterIn(obj, evt) {
    try {
        var evt = evt ? evt : (window.event ? window.event : null); //兼容IE和FF
        if (_objAllSearchKeyword.style.color == 'gray') {
            _objAllSearchKeyword.style.color = 'black'
        }

        if (evt.keyCode == 13) {
            if ($('#_allSearchResult').html() == '') {
                evt.preventDefault && evt.preventDefault();
                evt.stopPropagation && evt.stopPropagation();
                evt.returnValue = false;
                return;
            }

            var curr = _getHover();
            if (curr < 0) {
                if ($('#_search_history_upper').find('*').length != 0) {
                    curr = 0.0;
                } else {
                    curr = 1;
                }
                if ($(_objAllSearchResult).firstChild().text().indexOf('无匹配的产品') >= 0 || $(_objAllSearchResult).firstChild().text().indexOf('历史搜索') >= 0) {
                    curr = 1;
                }
            }
            var ob = "";
            if (curr < 1) {
                ob = $('#_search_history_upper')[0].children[10 * curr];
            } else {
                ob = _objAllSearchResult.childNodes[curr];
            }

            var word = $(ob).attr('word') || $(ob).attr('keyword');
            var dis = $(ob).attr('district') || $(ob).attr('dis');
            var url = $(ob).attr('url');
            var type = $(ob).attr('type');
            var func = $(ob).attr('onclick');
            var classname = $(ob).attr('class');

            if (func == "_delhistoryHref()") {

                evt.preventDefault && evt.preventDefault();
                evt.stopPropagation && evt.stopPropagation();
                evt.returnValue = false;
                _delhistoryHref();
                return;
            }

            if (url != null && url != '' && outerFormIsShit != 'TRUE') {
                var innerInputs = "";
                var host = url;
                if (url.indexOf("?") != -1) {
                    host = url.split("?")[0];
                    var conf = url.split("?")[1];
                    var confArr = conf.split("&");

                    for (var i = 0; i < confArr.length ; i++) {
                        var left = confArr[i].split("=")[0];
                        var right = confArr[i].split("=")[1];
						if(type == 'channelgs'){
							right = decodeURIComponent(right);
						}
                        innerInputs += "<input type='hidden' name =" + left + "  value=" + right + " />";
                    }
                }
                if (func == "_historyHref(this)") {
                    host += '#ctm_ref=www_hp_his_lst';
                }
                if (func == "_dumpHref(this)") {
                    host += '#ctm_ref=www_hp_bs_lst';
                }
                if (func == "_otherSearchHref(this)") {
                    host += '#ctm_ref=www_hp_bs_lst';
                }

                if (url && word) {
                    _addCookie(_allSearchHtmlEncode(word), dis || ' ', url);
                    if (type == 'hotel') {
                        _last_click_hotel_id_from_search = url.split('.html')[0].split('/').pop();
                    }
                }
                window.open(url);
			
				if(type == 'channelgs'){
					if ('acceptCharset' in _objSearchFormForEnter){
                        var ori=_objSearchFormForEnter.acceptCharset;
                        _objSearchFormForEnter.acceptCharset='utf-8';
                        setTimeout(function(){
                        _objSearchFormForEnter.acceptCharset=ori;
						});
                    }else{
                        var ori=document.charset;
                        document.charset='utf-8';
                        setTimeout(function(){
                            document.charset=ori;
                        });
                    }
				}
                evt.returnValue = true;
            } else {
                evt.preventDefault && evt.preventDefault();
                evt.stopPropagation && evt.stopPropagation();
                evt.returnValue = false;
                return;
            }

            if (func == "_historyHref(this)") {
                window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=HIS&keyword=\"" + word + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
            } else {
                window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=BS&AutoType=" + ob.getAttribute('type') + "&Yindex=" +
                _getHover() + "&keyword=\"" + ob.getAttribute('word') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);

                var docList = document.getElementById('_allSearchResult').childNodes;
                if (docList && docList.length == 3 &&
                   docList[0].getAttribute('type') == 'channeltravelsearch' &&
                 docList[2].getAttribute('type') == 'gs'
                   ) {
                    if (type == 'channeltravelsearch') {
                        window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US_1", "searchType=TR&AutoType=" + ob.getAttribute('type') + "&Yindex=" +
                       _getHover() + "&keyword=\"" + ob.getAttribute('word') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);

                    } else if (type == 'gs') {
                        window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US_1", "searchType=GS&AutoType=" + ob.getAttribute('type') + "&Yindex=" +
                       _getHover() + "&keyword=\"" + ob.getAttribute('word') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);

                    } else {
                    }
                }
            }
        }
        if (evt.keyCode == 38) { 
            var curr = _getHover();
            var aContentList = _objAllSearchResult.childNodes;
            if ($(aContentList[0]).text() == "历史搜索：" || $(aContentList[0]).text() == "无匹配的产品，您可以搜索：") { 
                if (curr < 0) {
                    _mIn(aContentList[1]);
                    var v = aContentList[1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }
                if (curr > 1) {
                    _mIn(aContentList[curr - 1]);
                    var v = aContentList[curr - 1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }
            }
            else {
                if (curr < 0) {
                    var hoverob = aContentList[0];
                    if (hoverob.className == "search_list_history") {
                        hoverob = aContentList[0].firstChild;
                    }

                    _mIn(hoverob);
                    var v = hoverob.getAttribute('word') || hoverob.getAttribute('keyword');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }

                if (curr > 1) {
                    _mIn(aContentList[curr - 1]);
                    var v = aContentList[curr - 1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }

                if (curr == 1) {
                    var tempDo = aContentList[0];
                    if (tempDo.hasChildNodes()) {
                        _mIn(tempDo.lastChild);
                        var v = tempDo.lastChild.getAttribute('keyword');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    }
                }

                if (curr < 1 && curr >= 0) {
                    var tempDo = aContentList[0];
                    var historyList = tempDo.childNodes;
                    var realCurr = 10 * curr;
                    if (realCurr > 0) {
                        var realP = historyList[realCurr - 1]
                        _mIn(realP);
                        var v = realP.getAttribute('keyword');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    }

                }
            }
        }
        if (evt.keyCode == 40) {
            var curr = _getHover();
            var aContentList = _objAllSearchResult.childNodes;
            var tempPo = 0;
            if ($(aContentList[0]).text() == "历史搜索：" || $(aContentList[0]).text() == "无匹配的产品，您可以搜索：") {

                if (curr < 0 || curr == _getRealEleCount()) {
                    _mIn(aContentList[1]);
                    var v = aContentList[1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }

                if (curr >= 1 && curr < _getRealEleCount()) {
                    _mIn(aContentList[curr + 1]);
                    var v = aContentList[curr + 1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }
            }
            else {
                isDownKey = 'true';
                if (curr < 0 || curr == _getRealEleCount()) {
                    if (!aContentList[0].hasChildNodes()) {
                        _mIn(aContentList[1]);
                        var v = aContentList[1].getAttribute('word');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    } else {
                        var historyList = aContentList[0].childNodes;
                        _mIn(historyList[0]);
                        var v = historyList[0].getAttribute('keyword');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    }
                }

                if (curr >= 1 && curr < _getRealEleCount()) {
                    _mIn(aContentList[curr + 1]);
                    var v = aContentList[curr + 1].getAttribute('word');
                    if (v) {
                        _objAllSearchKeyword.value = v;
                    }
                }

                if (curr >= 0 && curr < 1) {
                    var realCurr = 10 * curr;
                    if (realCurr == aContentList[0].children.length - 1) {
                        _mIn(aContentList[1]);
                        var v = aContentList[1].getAttribute('word');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    } else {
                        var innList = aContentList[0].childNodes;
                        _mIn(innList[realCurr + 1]);
                        var v = innList[realCurr + 1].getAttribute('keyword');
                        if (v) {
                            _objAllSearchKeyword.value = v;
                        }
                    }
                }
            }
        }
    }
    catch (e) { }
}

function _allSearchHtmlEncode(text) {
    try {
        return text.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\+/g, '＋');
    }
    catch (e) { return ""; }
}

function _navigatorMSIE() {
    userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("msie") >= 0) {
        return 1;
    }
    return 0;
}

var autoIncreasementId = 0;
var inputNode = document.getElementById('_allSearchKeyword');
inputNode.removeAttribute('onkeyup');
if (inputNode.addEventListener) {
        inputNode.addEventListener("input",_callMCtripData,false);
    } else {
        inputNode.attachEvent("onpropertychange", function(e) {
            if(window.event.propertyName == 'value'){
                 _callMCtripData(e);
            }
        });
    }

function _callMCtripData(evt) {

    if(isDownKey == 'true' && !('placeholder' in _objAllSearchKeyword)){
        isDownKey = 'false';
        return;
    }
    try {
        var evt = evt ? evt : (window.event ? window.event : null);
        if (evt.keyCode == 13 || evt.keyCode == 38 || evt.keyCode == 40) {
            return;
        }
    }
    catch (e) { }
    var targetElement = evt.target || evt.srcElement;
    if(targetElement){
        var keyword = _allSearchHtmlEncode(targetElement.value);
        if (keyword == null || keyword.length == 0 || keyword.trim() == '') {
            _historyResultDiv();
            return;
        }
        if(isFirstSendHttp=='true'&&keyword == _search_placeHolder&&!('placeholder' in _objAllSearchKeyword)){
            isFirstSendHttp = 'false';
        }else{
             _drawOut(keyword);
        }
    } 
}

//点击搜索框
_objAllSearchKeyword.onclick = function (){
    if (!('placeholder' in _objAllSearchKeyword)&&_objAllSearchKeyword.value == _search_placeHolder&&_objAllSearchKeyword.style.color == 'gray'){
        _objAllSearchKeyword.value = "";
    }
}

function _getServerMessage() {

}

function _drawOut(keyword) {
	var id = ++autoIncreasementId; 
    var httpRequest = null;
    if (window.XMLHttpRequest) {
        if (_navigatorMSIE() == 1 && window.XDomainRequest) {
            httpRequest = new XDomainRequest();
        } else {
            httpRequest = new XMLHttpRequest();
        }
    } else {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
	
	//var uri = "//m.ctrip.com/restapi/h5api/searchapp/search?action=autocomplete&source=globalonline&keyword=";
    //10.28.59.50:8080/globalsearch/search?keyword=上海&source=globalonline&action=online
    var uri = "//m.ctrip.com/restapi/h5api/globalsearch/search?action=online&source=globalonline&keyword=";


    uri += encodeURIComponent(_objAllSearchKeyword.value);
    var lastHotelId = _last_click_hotel_id_from_search || _get_last_choice();

    if (lastHotelId != 0) {
        uri += ("&hotelid=" + lastHotelId);
    }

    uri += "&t=" + (new Date()).valueOf();
    httpRequest.open("GET", uri, true);
    httpRequest.send(null);

    httpRequest.onload = function () {

      var jsons = httpRequest.responseText;
        var node;
        if (typeof (JSON) == 'undefined') {
            node = eval("(" + jsons + ")");
        } else {
            node = JSON.parse(jsons);
        }

        if (node !== null && node.data !== null && node.data.length > 0) {
			if (id == autoIncreasementId){ 
                _renderResult(keyword, node.data);
			}else{ 
			} 
        } else {
            if (keyword !== '') {
                _renderNoResultDiv(keyword);
            } else {
                _historyResultDiv();
            }
         }
       };
}

function _renderResult(keyword, rList) {
    var history_div_content = "";
    isHaveRecommondHistory = 'false';
    var cookie = _readCookie();
    if (cookie != null) {
        var cookies = cookie.split("#&&");
    } else {
        var cookies = new Array();
    }

    for (var c = cookies.length - 1; c >= 0; c--) {
        var r = cookies[c].split("#==");
        var rs = r[0].split("#--");

        var shortWord = rs[0];

        if (keyword.length > 1 && shortWord.indexOf(keyword) == 0) {
            if (rs[1] == ' ') {
                history_div_content += '<a href="javascript:void(0);" url=' + r[1] + ' onClick="_historyHref(this)" keyword="' + rs[0] + '" dis=\"' + rs[1] + '\" onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\"><span class="first_item"><i class="ico_history"></i><strong>' + shortWord + '</strong></span></a>';
            } else {
                history_div_content += '<a href="javascript:void(0);" url=' + r[1] + ' onClick="_historyHref(this)" keyword="' + rs[0] + '" dis=\"' + rs[1] + '\" onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\"><span class="first_item"><i class="ico_history"></i><strong>' + shortWord + '</strong>,<span>' + rs[1] + '</span></span></a>';
            }
           isHaveRecommondHistory = 'true';
           window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=HC&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
        }
    }

    var html = "";
    if (history_div_content != "") {
        html = '<div class="search_list_history" id="_search_history_upper" style="display:block;">' + history_div_content + '</div>';
    } else {
        html = '<div class="search_list_history" id="_search_history_upper" style="display:none;">' + history_div_content + '</div>';
    }

    for (var i = 0 ; i < rList.length ; i++) {
        var ll = rList[i];
        var dis = ll.districtName;
       
        if (!dis) {
            dis = ' ';
        }
        var tempWord = _allSearchHtmlEncode(ll.word);
        var displaytype = _conversType(ll.type);
        if (tempWord == "客栈" || tempWord == "民宿" || tempWord == "途家公寓" || tempWord == "租房" || tempWord == "公寓") {
            displaytype = 'ico_hotel';
        }

        if (tempWord == '更多城市') {
            continue;
        }
        if (tempWord == '携程宝' || tempWord == '礼品卡' || tempWord == '程涨宝' || tempWord == '任我游' || tempWord == '任我行' || tempWord == '任我住') {
            displaytype = 'ico_location';
            html += '<a href="javascript:void(0);" url=\"' + ll.url + '\"  word="' + tempWord + '" district=\"' + dis + '\"  type =' + ll.type + ' onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()"> <i class="' + displaytype + '"></i>' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span>  ' + dis + '</span></a>';
        } else if (ll.type == 'hotel' || ll.type == 'sighthotel' || ll.type == 'desthotel' || ll.type == 'channelgroup' || ll.type == 'channeltravel' || ll.type == 'travelgroup' || ll.type == 'ticket' || ll.type == 'huodong' || ll.type == 'hhtravel' || ll.type == 'flighthotel') {

			var starPic = "";
			if (ll.starRating != null && ll.starRating.indexOf("星级") >= 0) {
                starPic = "star";
            } else {
                starPic = "diamond";
            }
            switch (ll.starRating) {
                case '一星级':
                    starPic += "01"; break;
                case '二星级':
                    starPic += "02"; break;
                case '三星级':
                    starPic += "03"; break;
                case '四星级':
                    starPic += "04"; break;
                case '五星级':
                    starPic += "05"; break;
                case '六星级':
                    starPic += "06"; break;
				case '经济型':
					starPic += "02"; break;
				case '舒适型':
					starPic += "03"; break;
				case '高档型':
					starPic += "04"; break;
				case '豪华型':
					starPic += "05"; break;
            }
			
			var priceDescription = ' ';
			if(ll.price !== undefined){
				priceDescription = ' <span class="search_hotel_price"><dfn>￥</dfn>' + ll.price + '起</span>';
			}
            if (ll.price == "实时计价") {
                priceDescription = ' <span class="search_hotel_price">实时计价</span>';
            }

            var title = tempWord;
            if (ll.zonename || dis != ' ')
                title += (' , ' + (ll.zonename || dis));

            if (starPic.indexOf("00") != -1) {
                if (ll.costlowerpercent && ll.costlowerpercent >= 10 && ll.costlowerpercent <= 50) {
					if (ll.type == 'sighthotel') {
						html += '<div class="search_list_vacation" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + ' <span class="search_hotel_notes">比附近同级低<span>' + ll.costlowerpercent + '%</span></span> </div>'
					}else{
						html += '<div class="search_list_hotel" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + ' <span class="search_hotel_notes">比附近同级低<span>' + ll.costlowerpercent + '%</span></span> </div>'
					}

                } else {
					if (ll.type == 'sighthotel') {
						html += '<div class="search_list_vacation" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + ' "type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p>' + priceDescription + '</span> </div>'
					}else{
						html += '<div class="search_list_hotel" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + ' "type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p>' + priceDescription + '</span> </div>'
					}
            
                }
            } else {
                if (ll.costlowerpercent && ll.costlowerpercent >= 10 && ll.costlowerpercent <= 50) {
                 
					if(ll.type == 'sighthotel'){
						html += '<div class="search_list_vacation" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + '  <span class="search_hotel_notes">比附近同级低<span>' + ll.costlowerpercent + '%</span></span> </div>'
					}else{
						html += '<div class="search_list_hotel" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + '  <span class="search_hotel_notes">比附近同级低<span>' + ll.costlowerpercent + '%</span></span> </div>'
					}
                } else {
                   
                    if(ll.type == 'sighthotel'){
						html += '<div class="search_list_vacation" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + '  </span> </div>'
					}else{
					
						if(ll.type == 'channelgroup' || ll.type == 'channeltravel' || ll.type == 'travelgroup' || ll.type == 'ticket' || ll.type == 'huodong' || ll.type == 'hhtravel' || ll.type == 'flighthotel') {//新增
							html += '<div class="search_list_hotel" style="height:20px;" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + '  </span> </div>';

						}else{
							
							if(ll.starRating == ' '){
								html += '<div class="search_list_hotel" style="height:20px;" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + ' </div>';
							}else{
							
							html += '<div class="search_list_hotel" title=\"' + title + '\" url=\"' + ll.url + '\" word="' + tempWord + '" type=\"'+ll.type+'\" district=\"' + (ll.zonename || dis) + '\" onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()" > <i class="' + displaytype + '"></i><p class="search_hotel_name" >' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span> ' + (ll.zonename || dis) + '</span></p><span class="search_hotel_grade cui_' + starPic + '"></span>' + priceDescription + ' </div>';
							}
						}

					}
					

                }
            }

        } 
		else if (ll.type == 'flightschedule') {
			var arrivalairport = ll.arrivalCity + ll.arrivalAirport;
			var departureairport = ll.departureCity + ll.departureAirport;
			var airport = departureairport + "->" + arrivalairport;
			
			html += '<a href="javascript:void(0);" url=\"' + ll.url + '\"  word="' + tempWord + '" district=\"' + airport + '\"  type =' + ll.type + ' onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()"><i class="' + displaytype + '"></i>' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span>  ' + airport + '</span></a>';
		
		}
		else {
		
            html += '<a href="javascript:void(0);" url=\"' + ll.url + '\"  word="' + tempWord + '" district=\"' + dis + '\"  type =' + ll.type + ' onclick="_dumpHref(this)" onmouseenter="_mIn(this)" onmouseleave="_mOut()"><i class="' + displaytype + '"></i>' + ll.word.split(keyword).join("<strong>" + keyword + "</strong>") + '<span>  ' + dis + '</span></a>';
        }
    }
    html += '<a class="search_close" onclick="this.parentNode.style.display=\'none\'">×</a>';
    _objAllSearchResult.innerHTML = html;
    _objAllSearchResult.style.display = "block";
    window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=SD&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
}

function _dumpHref(ob) {

    var word = ob.getAttribute('word');
    var dis = ob.getAttribute('district') || ' ';
    var url = ob.getAttribute('url');
    var type = ob.getAttribute('type');
    var classname = ob.getAttribute('class');

    _addCookie(_allSearchHtmlEncode(word), dis, url);
    if (type == 'hotel') {
        _last_click_hotel_id_from_search = url.split('.html')[0].split('/').pop();
    }

    window.open(url + '#ctm_ref=www_hp_bs_lst');

    if (classname == 'search_list_history') {
        window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=BS&AutoType=his&Yindex=" +
         (_getHover() * 10 + 1) + "&keyword=\"" + ob.getAttribute('word') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
    } else {
        window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=BS&AutoType=" + ob.getAttribute('type') + "&Yindex=" +
       _getHover() + "&keyword=\"" + ob.getAttribute('word') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\"&isHaveRecommondHistory=\"" + isHaveRecommondHistory + "\""]);
    }
}


function _doNothing(evt) {
    var evt = evt ? evt : (window.event ? window.event : null); 
    evt.preventDefault && evt.preventDefault();          
    evt.stopPropagation && evt.stopPropagation();
    evt.returnValue = false;
}

function _renderNoResultDiv(keyword) {
    try {
    if (keyword.length > 100) {
        keyword = keyword.substr(0,100);
    }
    var l = _getCityId();
    var city = _getCityId() || '2';
    var encodeKeyword = encodeURIComponent(_allSearchHtmlEncode(keyword));
	var encodeKeyword2 = escape(keyword);
    var html = "<div onclick=\"_doNothing(event)\">无匹配的产品，您可以搜索：</div>" +
               "<a href=\"javascript:;\" url=\"//you.ctrip.com/Searchsite/?query=" + encodeKeyword + "\" onclick=\"_otherSearchHref(this)\"  onmouseenter=\"_mIn(this)\"  onmouseleave=\"_mOut()\"><i class=\"ico_gs\"></i>“" + keyword + "”相关的攻略</a>" +
               "<a href=\"javascript:;\" url=\"//hotels.ctrip.com/hotel/sz" + city + "/k1" + encodeKeyword + "\"  onclick=\"_otherSearchHref(this)\" onmouseenter=\"_mIn(this)\"  onmouseleave=\"_mOut()\"><i class=\"ico_hotel\"></i>“" + keyword + "”相关的酒店</a>" +
               "<a href=\"javascript:;\" url=\"//vacations.ctrip.com/list/whole/sc.html?sv=" + encodeKeyword + "\" onclick=\"_otherSearchHref(this)\"  onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\" ><i class=\"ico_vacation\"></i>“" + keyword + "”相关的旅游产品</a>" +
               "<a href=\"javascript:;\" url=\"//piao.ctrip.com/piao.html?keyword=" + encodeKeyword + "\" onclick=\"_otherSearchHref(this)\"  onmouseenter=\"_mIn(this)\" ><i class=\"ico_ticket\" onmouseleave=\"_mOut()\"></i>“" + keyword + "”相关的门票</a>" +
               "<a href=\"javascript:;\" url=\"//tuan.ctrip.com/group/city_" + city + "/hotelname_" + encodeKeyword + "/k_" + encodeKeyword + "/\" onclick=\"_otherSearchHref(this)\"  onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\"><i class=\"ico_tuan\"></i>“" + keyword + "”相关的团购</a>"; //+ "<a class=\"search_close\" onclick=\"clearNoResult(this)\">×</a>";
    html += '<a class="search_close" onclick="this.parentNode.style.display=\'none\'">×</a>';
    _objAllSearchResult.innerHTML = html;
    _objAllSearchResult.style.display = "block";
    } catch (e) {
        
    }
}

function _getCityId() {
    var httpRequest = null;
    if (window.XMLHttpRequest) {
        if (_navigatorMSIE() == 1 && window.XDomainRequest) {
            httpRequest = new XDomainRequest();
        } else {
            httpRequest = new XMLHttpRequest();
        }
    } else {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
	
	var uri = "//m.ctrip.com/restapi/h5api/searchapp/search?action=cityname";
	
    httpRequest.open("GET", uri, true);
    httpRequest.send(null);

    httpRequest.onload = function () {
        var jsons = httpRequest.responseText;
        var node;
        if (typeof (JSON) == 'undefined') {
            node = eval("(" + jsons + ")");
        } else {
            node = JSON.parse(jsons);
        }

        var cityId = node.data.cityid;
        return cityId;
    }
}

function _addCookie(keyword, distinct, url) {

    keyword = _allSearchHtmlEncode(keyword);
    var thisCookieKey = keyword + "#--" + distinct;
    var thisCookie = keyword + "#--" + distinct + "#==" + url;

    var cookie = _readCookie();
    if (cookie != null) {
        var cookies = cookie.split("#&&");
    } else {
        var cookies = new Array();
    }

    for (var c = 0; c < cookies.length; c++) {
        var cookieKey = cookies[c].split("#==");
        if (cookieKey.length > 1) {
            if (cookieKey[0] == thisCookieKey) {
                return;
            }
        }
    }

    if (cookies.length == 5) {
        cookies.shift();
    }
    cookies.push(thisCookie);

    var result = cookies.join("#&&");
    var str = "SearchHistoryWord" + "=" + escape(result);
    var date = new Date();
    var ms = 30 * 24 * 3600 * 1000;
    date.setTime(date.getTime() + ms);
    str += "; expires=" + date.toGMTString();

    document.cookie = str;
}

function _readCookie() {
	var REGX_HTML_ENCODE = /"|;|'|<|>|\.\.\//g;
    var all = document.cookie;
    if (all == "") {
        return null;
    }
    var list = all.split("; ");
    for (var i = 0; i < list.length; i++) {
        var cips = list[i].split("=");
        var name = cips[0];
        var value = cips[1];
        if (name == "SearchHistoryWord") {
            var result = unescape(value);
            if (result != null) {
				result = result.replace(REGX_HTML_ENCODE,"");
                return result;
            }
        }
    }
    return null;
}

function _delhistoryHref() {
    var cookie = _readCookie();
    try {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = "SearchHistoryWord=a; expires=" + date.toGMTString();

        if (_objSearchFormForEnter) {
            _objSearchFormForEnter.setAttribute('action', '//www.ctrip.com');
        }
        
    } catch (ev) {

    } finally {
        _historyResultDiv();
        return false;
    }
}

function _deleteCookie(e) {
    var cookie = _readCookie();
    var kword = e.currentTarget.parentElement.getAttribute('keyword');
    var kdis = e.currentTarget.parentElement.getAttribute('dis');
    var word = kword + '#--' + kdis;
    try {
        if (cookie != null) {
            var cookies = cookie.split("#&&");
            for (var c = 0; c < cookies.length; c++) {
                var cookieKey = cookies[c].split("#==");
                if (cookieKey[0] == word) {
                    cookies.splice(c, 1);
                }
            }

            if (cookies.length != 0) {
                var result = cookies.join("#&&");
                var str = "SearchHistoryWord=" + escape(result);
                var date = new Date();
                var ms = 30 * 24 * 3600 * 1000;
                date.setTime(date.getTime() + ms);
                str += "; expires=" + date.toGMTString();
                document.cookie = str;
            } else {
                var date = new Date();
                date.setTime(date.getTime() - 10000);
                document.cookie = "SearchHistoryWord=a; expires=" + date.toGMTString();
            }
        }
    } catch (ev) {
    } finally {
        cookie = _readCookie();
        if (cookie == null) {
            _hideHistory();
        } else {
            var cookies = cookie.split("#&&");
            if (cookies.length == 0) {
                _hideHistory();
            }
        }

        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
        _historyResultDiv();
        return false;
    }


}

//隐藏历史
function _hideHistory() {
    _objAllSearchResult.style.display = "none";
}

//点击历史跳转
function _historyHref(ob) {
    window.open(ob.getAttribute('url') + '#ctm_ref=www_hp_his_lst');
    window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=HIS&keyword=\"" + ob.getAttribute('keyword') + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
}

//点击热词跳转
function _hotHref(ob) {
    window.open(ob.getAttribute('url'));
    window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=HOT&keyword=\"" + ob.getAttribute('keyword') + "\""]);
}

//点击在其他频道搜索的响应
function _otherSearchHref(ob) {
    var word = $(ob).text();
    var dis = ob.getAttribute('district') || ' ';
    var url = ob.getAttribute('url');
    var channel = word.slice(-2);
    if (channel == '产品') {
        channel = '旅游';
    }
    _addCookie(word, dis, url);
    window.open(url + '#ctm_ref=www_hp_bs_lst');
    window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=NR&keyword=\"" + channel + "\"&inputkeyword=\"" + _objAllSearchKeyword.value + "\""]);
}

//画历史。
function _historyResultDiv() {
    _temp_only_mark_the_frist = 1;
    if (_objAllSearchKeyword.value && _objAllSearchKeyword.value.trim() != '' && _objAllSearchKeyword.value != _search_placeHolder) {
        _drawOut(_allSearchHtmlEncode(_objAllSearchKeyword.value));
        return;
    }
    var html = '';
    var cookie = _readCookie();
    if (cookie != null) {
        var cookies = cookie.split("#&&");
        html += '<div  onclick=\"_doNothing(event)\">历史搜索：</div>';
        for (var c = cookies.length - 1; c >= 0; c--) {
            var r = cookies[c].split("#==");
            var rs = r[0].split("#--");
            var shortWord = rs[0];
			if(r[1] != null&&rs[1] != null){
				html += '<a class= "history_link " href="javascript:void(0);" url=' + r[1] + ' onClick="_historyHref(this)" keyword="' + rs[0] + '" dis=\"' + rs[1] + '\" onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\">' + shortWord + '<span>  ' + rs[1] + '</span></a>';
            }
        }
        html += '<a class= "history_link " href="javascript:void(0);"  onClick="_delhistoryHref()" onmouseenter=\"_mIn(this)\" onmouseleave=\"_mOut()\"><span> 清除历史搜索记录 </span></a>';
    }

    if (html != '') {
        _objAllSearchResult.innerHTML = html;
        _objAllSearchResult.style.display = "block";
    } else {
        _objAllSearchResult.innerHTML = html;
        _objAllSearchResult.style.display = "none";
    }
    window['__bfi'].push(['_tracklog', "WWW_SEARCH_AUTOCOMPLET_US", "searchType=FO&inputkeyword=\"noinputstatus\""]);
}

var menuLastHoverText;
var menuAnimEase = Quad.easeOut;
var menuAnimDuration = 0.4;

var menuWidth = 200 + "px";
var submenuWidth = 0;
var oldMenuData = "";
var menuData = "";

var mainMenuView = new MainMenuView();

$(function() {
    $(".menu-option-text a").click(function() {
        var menuOptionHolder = $(this).parent().parent();
        var isComplex = menuOptionHolder.find(".sub-menu-holder").length > 0;

        if (isComplex && window.location.hash.indexOf("index") == -1) {
            menuOptionHolder.find("a[href='#index.html']").trigger("click");
        }
    });
});

var currModuleType = '';
var prevModuleType = '';
var sideType = 'none';
var prevURL = '';
var loadURL = '';
var menuOptionsArr = new Array();
var menuOptionID = 0;
var submenuOptionID = -1;

function storeMenuArr() {
    var extraWidth = $(".template-menu").width() + $("#menu-hider").width();
    $("#template-menu").children().each(function(index, element) {
        var menu = $(element), subOptArr = "null", subHol = "null", menOptText = $(".menu-option-text a", menu);
        menuOptionsArr[index] = [];
        menuOptionsArr[index][0] = menu;

        if (menu.attr("data-module-type") == undefined) {
            var subMenu = [];
            subHol = menu.find(".sub-menu-holder");
            subHol.children().each(function(index, elem) {
                var submenu = $(elem), subOptTxt = $(".sub-menu-option-text a", this), subOptHref = String(subOptTxt.attr("href")), 
                subOptHrefPath = subOptTxt.attr("data-path-href");
                subMenu[index] = [];
                subMenu[index][0] = "#" + menOptText.text().toLowerCase() + "/" + subOptHref.replace("#", "");
                subMenu[index][1] = [submenu.attr("data-module-type"), submenu.attr("data-side"), subOptHref.replace("#", ""), subOptHrefPath];
                subMenu[index][2] = $(".sub-menu-option-background", this);
                subMenu[index][3] = subOptTxt;
            });
            subOptArr = subMenu;
            menuOptionsArr[index][1] = "null";
        } else {
            menuOptionsArr[index][1] = [menu.attr("data-module-type"), menu.attr("data-side"), String(menOptText.attr("href")).replace("#", ""), 
            menOptText.attr("data-path-href")];
        }
        menuOptionsArr[index][2] = $(".menu-option-background", menu);
        menuOptionsArr[index][3] = (subOptArr == "null") ? [menOptText] : [menOptText, $(".menu-option-text div", menu)];
        menuOptionsArr[index][4] = extraWidth - parseInt(menOptText.css("padding-left"), 10);
        menuOptionsArr[index][5] = subHol;
        menuOptionsArr[index][6] = subOptArr;
    });
}

function menuOptionIn(idx1, idx2) {
	mainMenuView.setActive(idx1);
}

function setMenuData(val) {
    oldMenuData = val;
    currModuleType = val[0];
    sideType = val[1];
    url = val[2];
    $("#template-menu").attr("data-current-module-type", val[0]);
    $("#template-menu").attr("data-side", val[1]);
    $("#template-menu").attr("data-href", val[2]);
    endPreviousModule = false;
}


















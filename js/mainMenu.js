
var menuLastHoverText;
var menuAnimEase = Quad.easeOut;
var menuAnimDuration = 0.4;

var menuWidth = 200 + "px";
var submenuWidth = 0;
var oldMenuData = "";
var menuData = "";

$(function () {

    $(".menu-option-holder").mouseenter(function () {
        if ($(this).find(".menu-option-background-selected").length > 0) return;
        var back = $(this).find(".menu-option-background").show();
        TweenMax.to(back, menuAnimDuration, { css: { marginLeft: "20px"}, ease: menuAnimEase });
    });

    $(".menu-option-holder").mouseleave(function () {
        if ($(this).find(".menu-option-background-selected").length > 0) return;
        var back = $(this).find(".menu-option-background");
        TweenMax.to(back, menuAnimDuration, { css: { marginLeft: "100%"}, ease: menuAnimEase });
    });

    $(".menu-option-text a").click(function () {
        var menuOptionHolder = $(this).parent().parent();
        if (menuOptionHolder.find(".menu-option-background-selected").length > 0) return;
        $(".menu-option-background-selected").hide()
        .attr("class", "menu-option-background");
        if (menuOptionHolder.find(".sub-menu-holder").length > 0) {
            menuOptionHolder.find("a[href='#index.html']").trigger("click");
        }
        
    });

});

function menuListeners() {
    menuWidth = "200px";
    /* We add 2 px in order to fix the 2px margin on the right. Since sub menu holder */
    /* has overflow hidden the 2px will fill the gap in IE 8 and in the other browser it won't be shown. */
    submenuWidth = "200px";
    /* MENU & SUBMENU -- OVER & OUT LISTENER */

    function hideSubmenu(obj) { obj.css('opacity', '0').css('display', 'none'); }

    var submOptBackSel = "sub-menu-option-background-selected";
    if (touchDevice == 0)
        $(".sub-menu-option-holder").hover(
            function () {
                var submOptBack = $(".sub-menu-option-background", this);
                var elem = submOptBack.length == 1 ? submOptBack : $("." + submOptBackSel, this);
                TweenMax.to(elem, 0.1, { css: { marginLeft: "0px", width: submenuWidth }, ease: menuAnimEase });
                TweenMax.to($(".sub-menu-option-text a", this), menuAnimDuration, { css: { color: "#FFF" }, ease: menuAnimEase });
            },
            function () {
                if ($('div:first', this).hasClass(submOptBackSel) == false) {
                    var submOptBack = $(".sub-menu-option-background", this);
                    var elem = submOptBack.length == 1 ? submOptBack : $("." + submOptBackSel, this);
                    TweenMax.to(elem, menuAnimDuration, { css: { marginLeft: submenuWidth, width: "0px" }, ease: menuAnimEase });
                    TweenMax.to($(".sub-menu-option-text a", this), menuAnimDuration, { css: { color: menuTextOutColor }, ease: menuAnimEase });
                }
            });
    // MENU & SUBMENU -- CLICK LISTENER	        
    $(".menu-option-holder").click(
        function (event) {
            event.preventDefault();
            var idx = $(".menu-option-holder").index(this);

            if (touchDevice == 1) {
                if (menuOptionsArr[idx][6] != "null") {
                    if (touchMenuID != -1 && touchMenuID != idx) {
                        menuOptionHover({ data: { idx: touchMenuID }, type: "mouseleave" });
                    }
                    menuOptionHover({ data: { idx: idx }, type: "mouseenter" });
                    touchMenuID = idx;
                    if (touchRemoveOn == false) {
                        touchRemoveOn = true;
                        var moduleContainer = document.getElementById("module-container");
                        moduleContainer.addEventListener("touchstart", touchContainer, false);
                    }
                } else {
                    if (touchMenuID != -1 && touchMenuID != idx) {
                        menuOptionHover({ data: { idx: touchMenuID }, type: "mouseleave" });
                        touchMenuID = -1;
                    }
                }
            }

            if (menuOptionID != idx && $(this).attr("data-module-type") != undefined && $(this).attr("data-module-type") != "#") {
                if (loadedContent == false) return;
                menuOptionsArr[idx][2].attr("class", "menu-option-background-selected");
                menuOptionOut(menuOptionID, submenuOptionID);
                menuOptionID = idx;
                submenuOptionID = -1;

                if (touchDevice == 1) {
                    menuOptionIn(menuOptionID, submenuOptionID);
                }

                var hashURL = "#" + menuOptionsArr[idx][1][2];
                menuData = menuOptionsArr[idx][1];
                $(window).unbind('hashchange', onTemplateHashChange);
                window.location.hash = hashURL;
                clearCustomInterval(delayInterval);
                delayInterval = setInterval(function () {
                    menuOptionClicked(menuData[2],
                        menuData[0],
                        menuData[1],
                        menuData[3]);
                    clearCustomInterval(delayInterval);
                    $(window).bind('hashchange', onTemplateHashChange);
                }, 400);
            }
        });


    subCloseInterval = "";
    $(".sub-menu-holder .sub-menu-option-holder").click(
        function (event) {
            event.preventDefault();
            var submenuParent = $(this).parent().get(0);
            var menuParent = $(submenuParent).parent().get(0);
            currMenuOptionID = $(menuParent).index();
            var submenuOptIdx = $(this).index();
            if (submenuOptionID == submenuOptIdx && menuOptionID == currMenuOptionID) {
                return false;
            } else {
                if (loadedContent == false) {
                    return;
                }
                var subMenu = menuOptionsArr[currMenuOptionID][6];
                menuOptionsArr[currMenuOptionID][2].attr("class", "menu-option-background-selected");
                subMenu[submenuOptIdx][2].attr("class", "sub-menu-option-background-selected");

                if (touchDevice == 1) {
                    menuOptionIn(currMenuOptionID, submenuOptIdx);
                    clearCustomInterval(subCloseInterval);
                    subCloseInterval = setInterval(function () {
                        touchContainer();
                        clearCustomInterval(subCloseInterval);
                    }, 200);

                }

                var disableIdx1 = undefined;
                if (menuOptionID == currMenuOptionID) {
                    disableIdx1 = true;
                }
                menuOptionOut(menuOptionID, submenuOptionID, disableIdx1);
                menuOptionID = currMenuOptionID;
                submenuOptionID = submenuOptIdx;

                var hashURL = subMenu[submenuOptIdx][0];

                menuData = subMenu[submenuOptIdx][1];
                $(window).unbind('hashchange', onTemplateHashChange);
                window.location.hash = hashURL;

                clearCustomInterval(delayInterval);
                delayInterval = setInterval(function () {
                    menuOptionClicked(menuData[2],
                        menuData[0],
                        menuData[1],
                        menuData[3]);
                    clearCustomInterval(delayInterval);
                    $(window).bind('hashchange', onTemplateHashChange);
                }, 400);
            }
            event.stopPropagation();
        });
}

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
    $("#template-menu").children().each(function (index, element) {
        var menu = $(element),
            subOptArr = "null",
            subHol = "null",
            menOptText = $(".menu-option-text a", menu);
        menuOptionsArr[index] = [];
        menuOptionsArr[index][0] = menu;

        if (menu.attr("data-module-type") == undefined) {
            var subMenu = [];
            subHol = menu.find(".sub-menu-holder");
            subHol.children().each(function (index, elem) {
                var submenu = $(elem),
                    subOptTxt = $(".sub-menu-option-text a", this),
                    subOptHref = String(subOptTxt.attr("href")),
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
            menuOptionsArr[index][1] = [menu.attr("data-module-type"), menu.attr("data-side"), String(menOptText.attr("href")).replace("#", ""), menOptText.attr("data-path-href")];
        }
        menuOptionsArr[index][2] = $(".menu-option-background", menu);
        menuOptionsArr[index][3] = (subOptArr == "null") ? [menOptText] : [menOptText, $(".menu-option-text div", menu)];
        menuOptionsArr[index][4] = extraWidth - parseInt(menOptText.css("padding-left"), 10);
        menuOptionsArr[index][5] = subHol;
        menuOptionsArr[index][6] = subOptArr;
        if (touchDevice == 0) menu.bind("mouseenter mouseleave", { idx: index }, menuOptionHover);
    });
}

function menuOptionIn(idx1, idx2) {
    if (menuOptionsArr[idx1][2].attr("class") == "menu-option-background-selected") return;
    $(".menu-option-background-selected").attr("style", "").attr("class", "menu-option-background");
    menuOptionsArr[idx1][2].attr("class", "menu-option-background-selected");
    menuOptionsArr[idx1][2].attr("style", "");
}

//TODO: remove or use
function menuOptionOut(idx1, idx2, disableIdx1) {
    
    
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

function menuOptionHover(event) {
    
}

function hideSubmenu(obj) { obj.css('opacity', '0').css('display', 'none'); }




function menuOptionClicked(val, mType, sType, hrefPath) {

    if (val != "#") {
        var url = '';
        if ($("#template-menu").attr("data-current-module-type") == "slideshow") {
            deleteSlideshowTimer();
        }
        currModuleType = mType;
        sideType = sType;
        hrefPath = (hrefPath == undefined) ? "" : hrefPath;
        setMobileMenuOption(val);
        url = templateBaseURL + hrefPath + val.replace('#', '');

        if (prevURL == '') {
            prevURL = url;
        } else {
            prevURL = loadURL;
        }
        loadURL = url;

        stopCurrentLoading();
        if (endModuleFunction != null) {
            delayAnimationLoading = 0.3;
            if (moduleEnd == true) {
                moduleEnd = false;
                endModuleFunction();
            }
        } else {
            delayAnimationLoading = 0.1;
        }

        if (menuData[2] != oldMenuData[2]) {
            loadedContent = true;
            activateAnimationLoading();
        } else {
            loadedContent = true;
            var loadAnim = $("#loading-animation");
            if (loadAnim.length > 0) {
                TweenMax.to(loadAnim, .3, { css: { right: "-104px" }, ease: Circ.easeOut });
            }
            if (endModuleFunction == null) {

                switch (menuData[0]) {
                    case "news":
                        var textPageInstanceHolder = $(txt_modCont);
                        TweenMax.to(textPageInstanceHolder, .6, { css: { left: "0px" }, delay: 0.1, ease: Circ.easeInOut }); /*get_OffsetWidth() +*/
                        endModuleFunction = endModuleTextPage;
                        moduleEnd = true;
                        break;
                    case "text_page":
                        moduleTextPage();
                        break;
                    case "gallery":
                        endModuleGallery(true);
                        endModuleFunction = endModuleGallery;
                        break;
                    case "showreel":
                        reverseEndModuleShowreel();
                        break;
                }
            }
        }
    }
}

var touchRemoveOn = false;
var touchMenuID = -1;

function touchContainer() {
    touchRemoveOn = false;
    if (touchMenuID != -1 && menuOptionsArr[touchMenuID][6] != "null") {
        var evt = { data: { idx: touchMenuID }, type: "mouseleave" };
        menuOptionHover(evt);
    }
    var moduleContainer = document.getElementById("module-container");
    moduleContainer.removeEventListener("touchstart", touchContainer, false);
}
function updateMenu(currentURL, prevURL, sameURLParent, animate) {
    currentURL = currentURL.replace("#", "");
    prevURL = prevURL.replace("#", "");
    
    var returnURL = "",
        i = 0,
        j = 0,
        tempMenuID = 0,
        tempSubmID = 0,
        idx = menuOptionsArr.length;

    while (idx--) {
        if (menuOptionsArr[idx][1] != "null") {
            if (currentURL == menuOptionsArr[idx][1][2]) {
                returnURL = "#" + menuOptionsArr[idx][1][2];
                setMenuData(menuOptionsArr[idx][1]);
                menuOptionID = idx;
                submenuOptionID = -1;
                if (animate == true) {
                    menuOptionIn(menuOptionID, submenuOptionID);
                }
                idx = 0;
            }
        } else {
            var subMenu = menuOptionsArr[idx][6];
            var subLength = subMenu.length;
            while (subLength--) {
                if (currentURL == subMenu[subLength][1][2]) {
                    returnURL = subMenu[subLength][0];
                    setMenuData(subMenu[subLength][1]);
                    menuOptionID = idx;
                    submenuOptionID = subLength;
                    if (animate == true) {
                        menuOptionIn(menuOptionID, submenuOptionID);
                    }
                    idx = 0;
                }
            }
        }
    }
    return returnURL;
}
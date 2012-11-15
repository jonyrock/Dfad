/// <reference path="mainMenu.js" />
/// <reference path="greensock/uncompressed/TweenMax.js"/>
/// <reference path="portfolioPage.js" />
/// <reference path="libs/jquery.selectbox-0.6.1.js" />
/**
 * VERSION: 1.0
 * DATE: 2012-09-20
 * 
 * @author: mediacreed, mediacreed.com
 **/
 
 /* start GENERAL CUSTOMIZATION PROPERTIES */
var templateBaseURL = "http://" + window.location.host + "/";
var themeColor = "#00aaff";
//var moduleContainerMarginLeft = 308;
var moduleContainerMarginLeft = 308;
var menuActive = true;
var menuHoverActive = true;
var menuOptionHoverMarginLeft = 18;
var menuOptionHoverWidth = 200;
/* it will change to false if menuActive == true. If 'menuActive' 
                                        is false and this true than on hover it will show the menu */
var menuTextOutColor = "#FFF";

var customPageStart = true;
var customPageStartURL = "#portfolio.html";
var customPageStartSide = "none";
var customPageStartType = "full_width_gallery";

var phpUrlPath = "php/contact_synergy.php";
var contactFormDemo = false;
/* SET IT TO FALSE FOR CONTACT FORM TO WORK */
/* end   GENERAL CUSTOMIZATION PROPERTIES */


/* start ready function */
$(document).ready(function () {
    readyAndLoad++;
    $(window).error(function (msg, url, line) {
        console.log("error: ", msg, " url: ", url, " line: ", line);
    });
    if (readyAndLoad == 2) {
        checkIfTouchDevice();
    }
});
/* end ready function */

/* start load function */
$(window).load(function () {
    readyAndLoad++;
    if (templateBaseURL == "http://www.your_domain.com/" || templateBaseURL == "null") {
        $("body").empty().css("visibility", "visible").append("<br/><span>Please check the documentation on page 4 on how to change the 'templateBaseURL' path!!!</span>");
        return;
    }
    if (readyAndLoad == 2) {
        checkIfTouchDevice();
    }
    
});
/* end load function */

/* start GENERAL JS PROPERTIES */
var readyAndLoad = 0;
var firstRun = true;
var isOverMenu = false;
var templateMenuW = 0;
var videojsHolder = "";
/* end GENERAL JS PROPERTIES */

/*================= GENERAL  TXT NAMES ==========================*/
var t_scrBarV1 = "#module-scrollbar-holder";
var t_scrBarV2 = "#module-scrollbar-holder_v2";
var txt_modCont = "#module-container #module-container-holder";


var touchDevice = 0;

function checkIfTouchDevice() {
    touchDevice = !!("ontouchstart" in window) ? 1 : 0;
    prepareTemplate();
}

//remove the template loader

function removeTemplateLoader() {
    $(".main-template-loader").remove();
    var browserVersion = $.browser.version + "";
    var documentMode = document.documentMode;
    var indexOfChar = browserVersion.indexOf(".");
    browserVersion = browserVersion.substring(0, indexOfChar);
    if ($.browser.msie && (browserVersion < 8 || (browserVersion >= 8 && documentMode < 8))) {
        $("body").empty().css("visibility", "visible");
        $("body").append("Your browser is too old for this website. Please upgrade your browser version or experience this website in: Firefox, Chrome, Opera or Safari")
        return;
    }
    if (($.browser.msie && (browserVersion.substr(0, 1) > 8 && documentMode > 8)) || !$.browser.msie) {
        if ($("#menu-container").hasClass("shadow-side-all") == false)
            $("#menu-container").addClass("shadow-side-all");
    }
    /*FIRST RUN CONFIGURATION*/
    prepareTemplate();
}

/*prepare the settings for the template*/
var templateFirstRun = true;
var templateFirstRunDone = false;

function prepareTemplate() {
    if (templateFirstRun == true) {
        $("#template-logo").click(function(event) {
            event.preventDefault();
            if ($(this).attr("data-href") != undefined && $(this).attr("data-href") != "") {
                window.location.hash = $(this).attr("data-href");
            } else {
                window.location.href = templateBaseURL;
            }
        });
        storeMenuArr();
        menuListeners();
        checkWhatToLoad();
        templateFirstRun = false;
    } else {
        settingsForScreens();
    }
}

/* check what page to load - only on the first run */

function checkWhatToLoad() {
    var hrefPath = "";
    var url = "";
    currModuleType = $("#template-menu").attr("data-current-module-type");
    sideType = $("#template-menu").attr("data-side");
    url = $("#template-menu").attr("data-href").replace('#', '');
    prevURL = "#" + url;
    if (templateFirstRun == true) {
        var checkURL = document.URL;
        checkURL = checkURL.replace(templateBaseURL, "");
        var hashURL = "";
        if (checkURL.indexOf("#") == -1 && checkURL != "") {
            if (checkURL == "index.html" || checkURL == "index.htm") {
                checkURL = "";
                if (checkURL == "" && customPageStart == true) {
                    checkURL = customPageStartURL;
                    checkURL = checkURL.replace(templateBaseURL, "");
                }
                checkURL = checkURL.replace("#", "");
                checkURL = checkURL.substring(checkURL.lastIndexOf("/") + 1);
                hashURL = updateMenu(checkURL, prevURL, false, true);
                window.location.hash = hashURL;
            } else {
                checkURL = checkURL.replace("#", "");
                checkURL = checkURL.substring(checkURL.lastIndexOf("/") + 1);
                hashURL = updateMenu(checkURL, prevURL, false, true);
                window.location.href = templateBaseURL + hashURL;
            }
        } else {
            if (checkURL == "" && customPageStart == true) {
                checkURL = customPageStartURL;
                checkURL = checkURL.replace(templateBaseURL, "");
                url = customPageStartURL.replace("#", "");
            } else {
                checkURL = checkURL.replace("#", "");
                checkURL = checkURL.substring(checkURL.lastIndexOf("/") + 1);
                checkURL = (checkURL != "" && checkURL != "#") ? checkURL : url;
                url = checkURL;

                if (checkURL.indexOf("index.html") != -1 || checkURL.indexOf("index.htm") != -1) {
                    checkURL = checkURL.substring(checkURL.lastIndexOf("#") + 1);
                }
            }
            checkURL = checkURL.replace("#", "");
            checkURL = checkURL.substring(checkURL.lastIndexOf("/") + 1);
            hashURL = updateMenu(checkURL, prevURL, false, true);
            window.location.hash = hashURL;
        }
    }
    hrefPath = oldMenuData[3];
    hrefPath = (hrefPath == undefined) ? "" : hrefPath;

    setMobileMenuOption(oldMenuData[2]);
    $("#module-container").empty();
    $("#module-container").load(hrefPath + url + ' #module-container > *', firstRunLoaded);
}

/* select the current mobile option */

function setMobileMenuOption(option) {
    var i = 0;
    option = option.replace("#", "");
    $("#template-smpartphone-menu select").find("option").each(function() {
        var optVal = $(this).attr("value").replace("#", "");
        if (optVal == option) {
            $(this).attr("selected", "selected");
        }
        i++;
    });
}

/* on template hash change */

function onTemplateHashChange(event, runLoad) {
    var url = window.location.hash + "",
        oldMenuID = menuOptionID,
        oldSubID = submenuOptionID,
        disabMenu = true,
        tempMenuData = menuData;

    url = url.replace("#", "");
    url = url.substring(url.lastIndexOf("/") + 1);

    updateMenu(url, prevURL, undefined, true);
    oldMenuData = tempMenuData;
    if (oldMenuID != menuOptionID) {
        disabMenu = undefined;
    }
    menuOptionOut(oldMenuID, oldSubID, disabMenu);
    menuData = (menuOptionsArr[menuOptionID][1] != "null") ? menuOptionsArr[menuOptionID][1] : menuOptionsArr[menuOptionID][6][submenuOptionID][1];
    setMobileMenuOption(menuData[2]);
    touchContainer();
    urlChanged();
}

/* update menu */



/* on first run loaded html page */

function firstRunLoaded(response, status, xhr) {
    $(window).bind('hashchange', onTemplateHashChange);
    switch (status) {
    case "error":
        console.log("Error loading the INDEX page: " + response);
        break;
    case "success":
        TweenMax.to($(".main-template-loader"), .3, { css: { opacity: "0" }, ease: Sine.easeOut, onComplete: removeTemplateLoader });
        break;
    }
}

/* menu width */

function getMenuWidth() {
    //TODO: I don't know why 10
    return $("#menu-container").width();// + $("#menu-hider-background").width() - 10;
}

/* menu height */

function getMenuHeight() {
    return $("#menu-container").height();
}

/* settings for screen resolutions */

function settingsForScreens() {
    $("body").css("visibility", "visible");
    var menuHider = parseInt($("#menu-container #menu-hider").width(), 10);
    var menuHiderIcon = parseInt($("#menu-container #menu-hider #menu-hider-icon").width(), 10);
    var menuHeight = parseInt($("#menu-container").css("height"), 10);

    var menuHiderH = parseInt($("#menu-container #menu-hider").height(), 10);
    var menuHiderIconH = parseInt($("#menu-container #menu-hider #menu-hider-icon").height(), 10);
    $("#menu-hider-icon").click(menuHideClick);
    
    $("#menu-container").css('left', -moduleContainerMarginLeft + 'px');
    $("#menu-container").css('visibility', 'visible');

    $("#menu-hider").css('display', 'inline');
    $("#menu-hider").css('visibility', 'visible');

    /*start-up animation*/
    $("#module-container").css("opacity", 1);
    $("#module-container").css("left", moduleContainerMarginLeft + "px");

    $("footer").css('display', 'inline');
    TweenMax.to($("#menu-container"), .4, {
        css: { left: "0px" },
        ease: Sine.easeInOut, delay: 0.5, onComplete: endStartupAnimation
    });
    /*end start-up animation*/
    
    $("#template-smpartphone-menu select").change(
        function() {
            if ($(this).val() != "#") {
                var hashURL = updateMenu($(this).val(), prevURL, undefined, false);
                window.location.hash = hashURL;
            }
        });
}

var delayInterval = "";

function endStartupAnimation() {
    templateFirstRunDone = true;
    delayInterval = setInterval(function() {
        showModule();
        clearInterval(delayInterval);
    }, 200);
    $(window).trigger("resize")
}

/*end module start*/

function endModuleStart() {

}

/*menu hide click*/

function menuHideClick() {
    var winW = $(window).width(),
        winH = $(window).height();
    if (menuActive == true) {
        menuActive = false;
        alwaysUpdate();

        var menuHider = ($("#menu-hider").length > 0) ? parseInt($("#menu-hider").width(), 10) : 0,
            menuWidth = parseInt($("#menu-container").css("width"), 10) - menuHider,
            menuVal = 0;
        var targetOffset = $("#menu-hider-background").width() - menuWidth;
        TweenMax.to($("#template-wrapper"), .4, { css: { left: targetOffset + "px" }, ease: Sine.easeInOut });
        TweenMax.to($("#menu-container"), .4, {
            css: { left: menuVal + "px" },
            ease: Sine.easeInOut,
            onComplete: function () {
                if (touchDevice == 0) activateHoverMenu();
            }
        });

    } else {
        if (touchDevice == 0) disableHoverMenu();
        menuActive = true;
        isOverMenu = false;
        alwaysUpdate();
        TweenMax.to($("#template-wrapper"), .4, { css: { left: "0px", top: "0px" }, ease: Sine.easeInOut });
        TweenMax.to($("#menu-container"), .4, { css: { left: "0px" }, top: "0px", ease: Sine.easeInOut });
    }

}

/* activate hover menu */

function activateHoverMenu() {
    $("#menu-container").bind("mouseenter", overMenu);
    $("#menu-hider-icon").bind("mouseenter", menuHiderOver);
    $("#menu-hider-icon").bind("mouseleave", menuHiderOver);
    $("#menu-container").bind("mouseleave", outMenu);
}

/* menu hider over */

function menuHiderOver(event) {
    event.stopPropagation();
}

/* disable hover menu */

function disableHoverMenu() {
    $("#menu-container").unbind("mouseenter", overMenu);
    $("#menu-hider-icon").unbind("mouseenter", menuHiderOver);
    $("#menu-hider-icon").unbind("mouseleave", menuHiderOver);
    $("#menu-container").unbind("mouseleave", outMenu);
}

/* over menu */

function overMenu() {
    if (menuActive == true) return;
    isOverMenu = true;
    TweenMax.to($("#template-wrapper"), .4, { css: { left: "0px", top: "0px" }, ease: Sine.easeInOut });
    TweenMax.to($("#menu-container"), .4, { css: { left: "0px", top: "0px" }, ease: Sine.easeInOut });
    alwaysUpdate();
}

/* out menu */

function outMenu() {
    if (menuActive == true) return;
    isOverMenu = false;
    var winW = $(window).width(),
        winH = $(window).height();

    var menuWidth = parseInt($("#menu-container").css("width"), 10) - parseInt($("#menu-hider").width(), 10),
        menuVal = 0;
    var targetOffset = $("#menu-hider-background").width() - menuWidth;
    TweenMax.to($("#template-wrapper"), .4, { css: { left: targetOffset + "px", top: "0px" }, ease: Sine.easeInOut });
    TweenMax.to($("#menu-container"), .4, { css: { left: menuVal + "px", top: "0px" }, ease: Sine.easeInOut });

    alwaysUpdate()
}

/* always update */

function alwaysUpdate() {
    if (currentSlide != null) resizeImage(currentSlide, true); /* ONLY IF SLIDESHOW ACTIVE */
    if ($showModuleBackground != null) resizeImage($showModuleBackground, true); /*BACKGROUND CHECK*/

    var winW = $(window).width();
    var winH = $(window).height();
    var newModContW = winW - get_OffsetWidth();
    var newModContH = winH;
    var cModuleType = $("#template-menu").attr("data-current-module-type")
    
    var menuHiderH = parseInt($("#menu-container #menu-hider").height(), 10),
        menuHeight = winH - menuHiderH;
    newModContH = menuHeight;
    

    TweenMax.to($("#module-container"), .4, { css: { width: newModContW + "px", height: newModContH + "px" }, ease: Sine.easeInOut });

    if ($("#module-container-old") != null && $("#module-container-old").length > 0) {
        if ($("#module-container-old #module-background-holder").length > 0) {
            resizeImage($("#module-container-old #module-background-holder"), true);
        }
        if ($("#module-container-old #slide-current").length > 0) {
            resizeImage($("#module-container-old #slide-current"), true);
        }
    }

    var thumbsHolder = $('#slideshow-thumbs');
    if (thumbsHolder.length > 0) {
        var val = (newModContW - thumbsHolder.width()) * .5;
        TweenMax.to(thumbsHolder, .4, { css: { marginLeft: val }, easing: Sine.easeOut });
    }
    var slideHolder = $("#slideshow .slideshow-slide", $("#module-container"));
    if (slideHolder.length > 0) {
        $("#slideshow-captions", slideHolder).each(function() {
            $(this).css("top", (newModContH * 0.3) + "px");
            TweenMax.to($(this), .4, { css: { width: (newModContW * 0.5) + "px" }, ease: Sine.easeInOut });
        });
    }

    var moduleContainerHolder = $(txt_modCont);
    var modulePosition = moduleContainerHolder.attr("data-id");
    if (modulePosition == "module-position-bc" || modulePosition == "module-position-cc") {
        if (moduleContainerHolder.length > 0) {
            var value = Math.round((newModContW - $(":first", moduleContainerHolder).width()) * 0.5);
            TweenMax.to(moduleContainerHolder, .4, { css: { left: value }, easing: Sine.easeOut });
        }
    }

    var fullWidGalModule = $("#module-full-width-gallery");
    if (fullWidGalModule.length > 0) {
        if (initialThumbW <= 0)
            return;
        moduleUpdate_full_width_gallery();

    }
    var contactModule = $("#module-contact #module-contact-holder");
    if (contactModule.length > 0) {
        moduleUpdate_contact();
        TweenMax.to(contactModule, .4, { css: { left: (newModContW - contactModule.width()) * .5 }, easing: Sine.easeOut });
    }
    var fullWidModule = $("#module-full-width");
    if (fullWidModule.length > 0) {
        moduleUpdate_full_width(true);
    }
    var fullscreenVideo = $("#module-fullscreen-video");
    if (fullscreenVideo.length > 0) {
        moduleUpdate_fullscreen_video(true)
    }

    if (cModuleType == "text_page") {
        moduleUpdate_text_page();
    }

}

/*----------------- start showTemplate --------------------*/

var $showModuleBackground = null;
var $showModuleBackgroundSolid = null;
var showDone = false;

function showModule() {
    if (templateFirstRunDone == false) {
        return;
    }
    if (moduleList != null) {
        moduleList.destroy();
        moduleList = null;
    }
    if ($("#template-menu").attr("data-current-module-type") == "slideshow") {
        if (firstMediaLoaded == false) {
            return;
        }
        firstMediaLoaded = false;
        TweenMax.to($("#loading-animation"), .3, { css: { right: "-104px" }, delay: .3, ease: Circ.easeOut });
        if (isOtherURL == true) {
            urlChanged();
        } else {
            loadedContent = true;
            moduleSlideshow();
        }
    } else {
        $showModuleBackground = $("#module-container #module-background-holder #module-background");
        $showModuleBackgroundSolid = $("#module-container #module-background-holder div");
        showDone = true;
        if ($showModuleBackground != null && $showModuleBackground.length > 0) {
            if (backLoaded == true) {
                showDone = true;
                animateModuleBackground();
            }
        } else if ($showModuleBackgroundSolid != null && $showModuleBackgroundSolid.length > 0) {
            backLoaded = true;
            if (backLoaded == true) {
                showDone = true;
                $showModuleBackground = null;
                $showModuleBackgroundSolid.css('display', 'inline').css("opacity", "0").css("visibility", "visible");
                TweenMax.to($showModuleBackgroundSolid, .4, {
                    css: { opacity: "1" },
                    delay: .4,
                    ease: Sine.easeOut,
                    onComplete:
                        function() {
                            if (isOtherURL == true) {
                                urlChanged();
                            } else {
                                startModule();
                            }
                        }
                });
                TweenMax.to($("#loading-animation"), .3, { css: { right: "-104px" }, ease: Circ.easeOut });
            }
        } else {
            $showModuleBackground = null;
            backLoaded = false;
            if (isOtherURL == true) {
                urlChanged();
            } else {
                TweenMax.to($("#loading-animation"), .3, { css: { right: "-104px" }, delay: .3, ease: Circ.easeOut, onComplete: startModule });
            }
        }
    }
}

var backLoaded = false;
/* animate module background */

function animateModuleBackground() {
    backLoaded = true;
    if (showDone == true) {
        showDone = false;
        backLoaded = false;
        TweenMax.to($("#loading-animation"), .3, {
            css: { right: "-104px" },
            delay: .3,
            ease: Circ.easeOut,
            onComplete:
                function() {
                    if (isOtherURL == true) {
                        urlChanged();
                    } else {
                        hideAnimationCompleted();
                    }
                }
        });
    }
}

/* hide animation completed */

function hideAnimationCompleted() {
    $showModuleBackground = $("#module-container #module-background");
    if ($showModuleBackground.length > 0) {
        resizeImage($showModuleBackground);
        $showModuleBackground.css('display', 'inline').css("opacity", "0").css("visibility", "visible").css("left", (-60) + "px");
        TweenMax.to($showModuleBackground, .6, {
            css: { opacity: "1", left: "0px" },
            ease: Circ.easeOut,
            onComplete:
                function() {
                    if (isOtherURL == true) {
                        urlChanged();
                    } else {
                        startModule();
                    }
                }
        });
    }
}

var endModuleFunction = null;
var endPreviousModule = false;
var previousModuleType = "";
/* start module */

function startModule() {
    loadedContent = true;
    var moduleType = $("#template-menu").attr("data-current-module-type");
    if (menuData[2] != oldMenuData[2] && menuData[2] != undefined) {
        clearCustomInterval(showModuleInterval);
        urlChanged();
        return;
    }
    previousModuleType = moduleType;
    endShowPage();
    templateCollectGarbage();
    switch (moduleType) {
    case "slideshow":
        moduleSlideshow();
        break;
    case "home2":
        moduleHome2();
        break;
    case "home3":
        moduleHome3();
        break;
    case "banner":
        moduleBanner();
        break;
    case "text_page":
        moduleTextPage();
        break;
    case "news":
        moduleNews();
        break;
    case "contact":
        moduleContact();
        break;
    case "showreel":
        moduleShowreel();
        break;
    case "gallery":
        moduleGallery();
        break;
    case "full_width":
        moduleFullWidth();
        break;
    case "full_width_gallery":
        moduleFullWidthGallery();
        break;
    case "page_columns":
        modulePageColumns();
        break;
    case "fullscreen_video":
        moduleFullscreenVideo();
        break;
    case "pricing_tables":
        modulePricingTables();
        break;
    }
}

/* end show page */

function endShowPage() {
    if (firstRun == true) {
        firstRun = false;
        /*endModuleStart();*/
    }
    if ($("#module-container-old").length > 0) {
        $("body").find("#module-container-old").each(function() { $(this).empty().remove(); });
    }
    $(window).trigger("resize");
}

/*----------------- end showTemplate ----------------------*/

/*----------------- start Modules Methods -----------------*/

/*================= SLIDESHOW =============================*/
var slideshowLimit = 0;
var slideshowCurrID = 0;
var slideshowPrevID = 0;
var oldSlide = '';
var slidesArray = new Array();
var thumbsList = null;
var currentSlide = null;
var slideshowAutoPlay = false;
var timerSec = 5;
var timerSlideshow = null;
var firstMediaLoaded = false;

function moduleSlideshow() {
    slideshowCurrID = 0;
    slideshowPrevID = 0;
    currentSlide = $("#slide-current");
    currentSlide.attr("style", "display:list-item; visibility: visible; left:" + (-60) + "px;");
    resizeImage(currentSlide);
    currentSlide.css("opacity", "0");
    storeAllSlides();
    $("#module-container").css('visibility', 'visible');
    TweenMax.to(currentSlide, .6, { css: { opacity: "1", left: "0px" }, ease: Circ.easeOut, onComplete: slideshowShowThumbs });
}

function onFirstMediaLoaded() {
    firstMediaLoaded = true;
    showModule();
    $("#slide-current").attr("onload", "");
}

function storeAllSlides() {
    var i = 0;
    $("#slideshow").children().each(function() {
        slidesArray[i] = new Array();
        if (i != 0) {
            var imgSrc = $('#slide-src', this);
            var imgTag = '<img src="' + imgSrc.attr("data-src") + '" alt="" />';
            imgSrc.after(imgTag).remove();
        }
        slidesArray[i][0] = $('img', this);
        var captions = new Array();
        var captionsW = new Array();
        var j = 0;
        $('#slideshow-captions', this).css("top", ($(window).height() * 0.3) + "px");
        $('#slideshow-captions', this).css("left", ($("#module-container").width() * 0.5) + "px");
        $('#slideshow-captions', this).children().each(function() {
            captions[j] = $(this);
            captionsW[j] = $(this).width();
            j++;
        });
        slidesArray[i][1] = captions;
        slidesArray[i][2] = captionsW;
        i++;
    });
    slideshowLimit = i++;
    if (slidesArray[0][1].length != 0) captionAvailable = true;
    currentThumb = $('#slideshow-thumbs-container .slideshow-thumb-holder').slice(0, 1);
    if (currentThumb.hasClass('thumb-selected') == false) {
        $(currentThumb).addClass('thumb-selected');
        $("#thumb-image-hover", currentThumb).removeClass().attr("style", "left: 0px; top: 0px;");
        $("img", $(currentThumb)).attr("style", "border-color:" + themeColor + ";");
    }
}

function startTimer() {
    if (timerSlideshow == null) {
        timerSlideshow = $.timer(checkSlideshowTimer);
        timerSlideshow.set({ time: timerSec * 1000, autostart: false });
    }
}

function checkSlideshowTimer() {
    timerSlideshow.stop();
    if (slideshowCurrID < slideshowLimit - 1) {
        slideshowPrevID = slideshowCurrID;
        slideshowCurrID++;
    } else {
        slideshowPrevID = slideshowCurrID;
        slideshowCurrID = 0;
    }
    var spanEmpty = document.getElementById("slideshow-thumbs-counter").getElementsByTagName("span");
    $(spanEmpty).empty().append((slideshowCurrID + 1) + '/' + total);
    stopOrHidePrevCaptions();
}

function stopSlideshowTimer() { timerSlideshow.stop(); }

function deleteSlideshowTimer() {
    if (timerSlideshow != null) {
        timerSlideshow.stop();
        timerSlideshow = null;
    }
}

/* END SHOW PAGE WHEN SLIDESHOW MODULE IS NEXT */

function slideshowShowThumbs() {
    endShowPage();
    if (thumbsList != null) {
        thumbsList.destroy();
        thumbsList = null;
    }
    if (touchDevice == 0) {
        thumbsList = $("#slideshow-thumbs-content").McCustomList({ scrollDirection: "horizontal", scrollType: "linear" });
        thumbsList.setupList({
            scrollContainer: $('#slideshow-thumbs-container'),
            mouseWheelSupport: "yes",
            buttonsSupport: "no",
            draggerContainer: null,
            draggerScroll: null,
            totalMinusSize: 0,
            scrollSpeed: 112,
            offsetSize: -4, /* this is the margin right of the thumbs. On the last thumbs we have this margin */
            horizFixHolder: $('.horizontal-fix-slideshow-thumbs')
        });
        $("#slideshow-thumbs-container").find(".slideshow-thumb-holder").hover(
            function(event) {
                if ($(this).hasClass('thumb-selected') == false) {
                    customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this));
                    TweenMax.to($("img", this), .6, { css: { borderColor: themeColor }, ease: Circ.easeOut });
                }
            },
            function(event) {
                var color = '#ffffff';
                if ($(this).hasClass('thumb-selected') == false) {
                    customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this));
                    TweenMax.to($("img", this), .6, { css: { borderColor: color }, ease: Circ.easeOut });
                }
            }
        );
        var instanceArr = $(".slideshow-thumbs-arrow-backward .slideshow-thumbs-arrow-backg");
        var initOpacity = instanceArr.css("opacity");
        var initBackColor = rgb2hex(instanceArr.css("background-color"));
        var bothArrows = $(".slideshow-thumbs-arrow-backward, .slideshow-thumbs-arrow-forward");
        var thumbArrBack = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-backward");
        var thumbArrForw = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-forward");
        bothArrows.unbind('mouseenter mouseleave');
        bothArrows.hover(
            function() {
                TweenMax.to($(".slideshow-thumbs-arrow-backg", this), 0.3, { css: { opacity: "1", backgroundColor: themeColor }, easing: Sine.easeOut });
            },
            function() {
                TweenMax.to($(".slideshow-thumbs-arrow-backg", this), 0.3, { css: { opacity: initOpacity, backgroundColor: initBackColor }, easing: Sine.easeOut });
            }
        );
        thumbArrBack.unbind("click");
        thumbArrForw.unbind("click");
        thumbArrForw.click(function() {
            if (thumbsList != null) thumbsList.listAutoScroll(-1);
        });
        thumbArrBack.click(function() {
            if (thumbsList != null) thumbsList.listAutoScroll(1);
        });
    } else {
        if (touchDevice == 1) {
            var thumbArrBack = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-backward");
            var thumbArrForw = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-forward");
            thumbArrBack.css("display", "none");
            thumbArrForw.css("display", "none");

        }
    }
    var total = slidesArray.length;
    var spanEmpty = document.getElementById("slideshow-thumbs-counter").getElementsByTagName("span");
    $(spanEmpty).empty().append((slideshowCurrID + 1) + '/' + total);

    /*'[id^="matchItem_"]'   "#slideshow-thumb-holder" //'div[id^="matchItem_"]'*/
    var slideshowThumbsCont = $("#slideshow-thumbs-container .slideshow-thumb-holder");
    slideshowThumbsCont.click(function() {
        var index = slideshowThumbsCont.index(this);
        if (slideshowCurrID == index) return;
        slideshowPrevID = slideshowCurrID;
        slideshowCurrID = index;
        if (timerSlideshow != null) timerSlideshow.stop();
        $(spanEmpty).empty().append((index + 1) + '/' + total);
        changeThumbsSelection(this);
        stopOrHidePrevCaptions();
    });
    var thumbsHolder = $('#slideshow-thumbs');
    var val = -Math.abs(thumbsHolder.width() - get_OffsetWidth()) / 2;
    thumbsHolder.attr("style", "margin-left:" + val + "px; bottom: -84px; visibility: visible;");
    if (touchDevice == 1) {
        $('.horizontal-fix-slideshow-thumbs').css("width", 999999);
        $('#slideshow-thumbs-container').css("width", $('#slideshow-thumbs-container').width());
        $('.horizontal-fix-slideshow-thumbs').css("width", '');
        $("#slideshow-thumbs-content").css("overflow", "auto");
        $("#slideshow-thumbs-content").css("-webkit-overflow-scrolling", "touch");
    }
    startTimer();
    initialThumbContW = $("#slideshow-thumbs-content").width();
    moduleUpdate_slideshow();
    TweenMax.to(thumbsHolder, .6, { css: { bottom: "4px" }, delay: 0.6, ease: Circ.easeOut, onComplete: checkCaption });
}

var initialThumbContW = 0;

function changeThumbsSelection(cThumb) {
    oldThumb = $('#slideshow-thumbs-container .thumb-selected');
    var color = "#ffffff";
    if (oldThumb.length > 0) {
        oldThumb.removeClass('thumb-selected');
        TweenMax.to($("#thumb-image-hover", oldThumb), .3, { css: { left: "-100%", top: "0%" }, ease: Sine.easeInOut });
        TweenMax.to($('img', oldThumb), .6, { css: { borderColor: color }, ease: Circ.easeOut });
    }
    currentThumb = $(cThumb);
    if (currentThumb.hasClass('thumb-selected') == false) {
        currentThumb.addClass('thumb-selected');
        TweenMax.to($("#thumb-image-hover", currentThumb), .3, { css: { left: "0", top: "0%" }, ease: Sine.easeInOut });
        TweenMax.to($('img', currentThumb), .6, { css: { borderColor: themeColor }, ease: Circ.easeOut });
    }
}

function changeSlideshowSlides(prevSlideID, currSlideID) {
    if (slidesArray[prevSlideID][0].attr('id') == 'slide-current') {
        slidesArray[prevSlideID][0].removeAttr("id");
        oldSlide = slidesArray[prevSlideID][0];
        oldSlide.css("style", "z-index: 1;");
        var parentOld = oldSlide.parent(oldSlide);
        parentOld.css("position", "absolute").css("z-index", "1");
    }
    slidesArray[currSlideID][0].attr("id", "slide-current");
    currentSlide = slidesArray[currSlideID][0];
    if (currentSlide.css("style") != undefined) currentSlide.removeAttr('style');

    currentSlide.attr("style", "z-index: 2; display:list-item; left: 0px; visibility: visible;");
    resizeImage(currentSlide);
    currentSlide.css("opacity", "0");
    var parentCur = currentSlide.parent(currentSlide);
    parentCur.css("position", "absolute").css("z-index", "2");
    TweenMax.to(currentSlide, .6, { css: { opacity: "1" }, ease: Sine.easeOut, onComplete: completeSlideTransition });
}

function completeSlideTransition() {
    var i = 0;
    var total = slidesArray.length;
    for (i = 0; i < total; i++) {
        if (i != slideshowPrevID && i != slideshowCurrID) slidesArray[i][0].attr("style", "display:none; opacity: 0; visibility: hidden;");
    }
    if (oldSlide != '') oldSlide.attr("style", "display:none; opacity: 0; visibility: hidden;");
    checkCaption();
}

var showingInProgress = 0;

function checkCaption() {
    if (showingInProgress == 1) return;
    if (slideshowAutoPlay == true && timerSlideshow != null) {
        /*checkSlideshowTimer();*/
        timerSlideshow.play(true);
    }
    if (slidesArray[slideshowCurrID][1].length != 0) {
        showingInProgress = 1;
        var i = 0;
        var total = slidesArray[slideshowCurrID][1].length;
        var windowH = $(window).height();
        var windowW = $(window).width();
        for (i = 0; i < total; i++) {
            var obj = slidesArray[slideshowCurrID][1][i];
            obj.css('width', '');
            var width = slidesArray[slideshowCurrID][2][i] + 10;
            var topY = i * 45;
            var val = (i == total - 1) ? windowW * .5 : -(width + windowW * .5);
            var styleValue = "top:" + topY + "px; left:" + val + "px; display:inline-block; opacity:1;";
            obj.attr("style", styleValue);
            if (i == total - 1) {
                TweenMax.to(obj, 5, { css: { left: -(width + windowW * .5) + 'px' }, ease: SlowMo.ease.config(0.7, 0.96), onComplete: resetShowing });
            } else {
                TweenMax.to(obj, 5, { css: { left: windowW * .5 + 'px' }, ease: SlowMo.ease.config(0.7, 0.96) });
            }
        }
    }
}

function resetShowing() {
    showingInProgress = 0;
    if (slidesArray[slideshowCurrID][1].length != 0) {
        var i = 0;
        var total = slidesArray[slideshowCurrID][1].length;
        for (i = 0; i < total; i++) {
            slidesArray[slideshowCurrID][1][i].css("opacity", "0");
        }
    }
}

function stopOrHidePrevCaptions() {
    var slideHolder = $("#slideshow .slideshow-slide");
    if (slideHolder.length > 0) {
        $("#slideshow-captions", slideHolder).each(function() {
            $(this).css("top", ($(window).height() * 0.3) + "px");
            $(this).css("left", ($("#module-container").width() * 0.5) + "px");
        });
    }
    if (slidesArray[slideshowPrevID][1].length != 0) {
        showingInProgress = 0;
        var i = 0;
        var total = slidesArray[slideshowPrevID][2].length;
        var windowH = $(window).height();
        var windowW = $(window).width();
        for (i = 0; i < total; i++) {
            var width = slidesArray[slideshowPrevID][2][i];
            var topY = windowH * .3 + i * 45;
            var obj = slidesArray[slideshowPrevID][1][i];
            if (i == total - 1) {
                TweenMax.to(obj, .2, { css: { left: -(width + windowW * .5) + 'px', opacity: "0" }, ease: Sine.easeOut, onComplete: runOtherSlide });
            } else {
                TweenMax.to(obj, .2, { css: { left: windowW * .5 + 'px', opacity: "0" }, ease: Sine.easeOut });
            }
        }
    } else {
        changeSlideshowSlides(slideshowPrevID, slideshowCurrID);
    }
}

function runOtherSlide() { changeSlideshowSlides(slideshowPrevID, slideshowCurrID); }

/*================= HOME 2 ================================*/
var stdCurrIndex = 0;
var stdPrevIndex = 0;

function moduleHome2() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-home-layout2", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;

    moduleUpdate_home2();

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.attr("style", "left: 100%; visibility: visible;");
    TweenMax.to(textPageInstanceHolder, .6, { css: { left: val }, ease: Circ.easeOut });

    var slidesBannArray = [];
    var stdBannCont = $("#standard-banner-controls");
    var controlPin = $("#control-pin", stdBannCont);
    var controlPinArr = [];
    var i = 0;
    stdBannCont.css("margin-left", -(stdBannCont.width() * .5));

    $("#standard-banner").find("a").each(
        function() {
            var dataSrc = $("#dataSrc", this);
            if (dataSrc.length > 0) {
                var imgTag = '<img src="' + dataSrc.attr("data-src") + '" />';
                dataSrc.after(imgTag).remove();
            }
            slidesBannArray[i] = $(this)
            i++;
        }
    );
    i = 0;
    stdBannCont.find("#control-pin").each(
        function() {
            controlPinArr[i] = $(this)
            i++;
        }
    );

    controlPin.hover(
        function() {
            if ($(this).hasClass("selected") == false)
                TweenMax.to($(".control-pin-hover", this), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
        },
        function() {
            if ($(this).hasClass("selected") == false)
                TweenMax.to($(".control-pin-hover", this), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        }
    );

    controlPin.click(function() {
        stdPrevIndex = stdCurrIndex;
        stdCurrIndex = $(controlPin).index(this);
        if (stdCurrIndex == stdPrevIndex) return;
        controlPinArr[stdPrevIndex].removeClass("selected");
        controlPinArr[stdCurrIndex].addClass("selected");
        TweenMax.to($(".control-pin-hover", controlPinArr[stdPrevIndex]), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        TweenMax.to($(".control-pin-hover", controlPinArr[stdCurrIndex]), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
        changeHome2Slides();
    });

    function changeHome2Slides() {
        slidesBannArray[stdCurrIndex].attr("class", "selected opacity_0");
        TweenMax.to(slidesBannArray[stdPrevIndex], .6, {
            css: { opacity: "0" },
            easing: Sine.easeOut,
            onComplete:
                function() { hideOtherBannerSlides(); }                
        });
        TweenMax.to(slidesBannArray[stdCurrIndex], .6, { css: { opacity: "1" }, easing: Sine.easeOut });
    }

    function hideOtherBannerSlides() {
        var i = 0;
        var t = slidesBannArray.length;
        for (i = 0; i < t; i++) {
            if (i != stdCurrIndex) slidesBannArray[i].attr("class", "");
        }
    }

    var clients = $(".home-layout-clients a");
    if (clients.length > 0) {
        clients.hover(
            function() {
                TweenMax.to($(".client-over", this), .6, { css: { opacity: "1" }, easing: Sine.easeOut });
            },
            function() {
                TweenMax.to($(".client-over", this), .6, { css: { opacity: "0" }, easing: Sine.easeOut });
            }
        );
    }
    var contentLi = $(".home-layout2-content ul li");
    var baseColor = rgb2hex($(".layout2-description p", contentLi).css("color"));
    if (touchDevice == 0)
        if (contentLi.length > 0) {
            contentLi.hover(
                function() {
                    TweenMax.to($(".layout2-description p", this), .6, { css: { color: themeColor }, easing: Sine.easeOut });
                    TweenMax.to($("div:first", this), 0.3, { css: { top: "-5px" }, easing: Sine.easeOut });
                },
                function() {
                    TweenMax.to($(".layout2-description p", this), .6, { css: { color: baseColor }, easing: Sine.easeOut });
                    TweenMax.to($("div:first", this), 0.3, { css: { top: "0px" }, easing: Sine.easeOut });
                }
            );
        }
}

function animateBannerHome2(img) { TweenMax.to(img, 0.4, { css: { opacity: "1" }, easing: Sine.easeOut }); }

/*================= END HOME 2 ============================*/

/*================= HOME 3 ================================*/
var homeInterval = "";

function moduleHome3() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-home-layout3", textPageInstanceHolder);
    var modWrapper = $("#module-wrapper", textPageInstance);
    if (textPageInstance.length <= 0) return;

    moduleUpdate_home3();

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.css("left", "100%").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .6, { css: { left: val }, ease: Circ.easeOut });

    var homeLayoutVideo = $("#video-wrapper", textPageInstanceHolder);
    templateAddMediaVideo(homeLayoutVideo.attr("data-video-type"), homeLayoutVideo, undefined);

    $("#home-advertise1, #home-advertise2", textPageInstanceHolder).hover(
        function() {
            var back = $(".advertise-details", this);
            TweenMax.to(back, .3, { css: { backgroundColor: "#3f3f3f" }, ease: Sine.easeOut });
            TweenMax.to($("span", back), .3, { css: { color: "#f1f1f1" }, ease: Sine.easeOut });
        },
        function() {
            var back = $(".advertise-details", this);
            TweenMax.to(back, .3, { css: { backgroundColor: "#f1f1f1" }, ease: Sine.easeOut });
            TweenMax.to($("span", back), .3, { css: { color: "#0c0c0c" }, ease: Sine.easeOut });
        }
    );

    var clients = $(".home-layout-clients a");
    if (clients.length > 0) {
        clients.hover(
            function() {
                TweenMax.to($(".client-over", this), .6, { css: { opacity: "1" }, easing: Sine.easeOut });
            },
            function() {
                TweenMax.to($(".client-over", this), .6, { css: { opacity: "0" }, easing: Sine.easeOut });
            }
        );
    }
    clearCustomInterval(homeInterval);
    homeInterval = setInterval(function() {
        moduleUpdate_home3();
        clearCustomInterval(homeInterval);
    }, 1000);

}

/*================= END HOME 3 ============================*/

var moduleList = null;
/* customStartPosition - used on news vertical when we close news preview we want to have the list and scrollbar at the positions they were */

function getElementStyle(elem) {
    var style = "";
    if (elem.length > 0) {
        style = (elem.attr("style") == undefined) ? " " : elem.attr("style") + " ";
    }
    return style;
}

var updateInterval = "";

function moduleUpdate(pMod, pCon, cCon, modSide, anim, noRepos, custStartPos) {
    if (endPreviousModule == true) return;
    var extrH = parseInt($("#module-container").css("top"), 10)
    var pModH = getElem_W_H(pMod, "h") - extrH;
    var pModW = getElem_W_H(pMod, "w");
    var pConH = getElem_W_H(pCon, "h") - extrH;
    var pConW = getElem_W_H(pMod, "w");
    var cConH = getElem_W_H(cCon, "h");
    var cConW = getElem_W_H(cCon, "w");
    var mPos = $("#module-container-holder").attr("data-id");
    var scrollbar_v1 = $(t_scrBarV1);
    var scrollbar_v2 = $(t_scrBarV2);
    var availScrollbar = (scrollbar_v1.length > 0) ? scrollbar_v1 : scrollbar_v2;

    var winH = $(window).height();
    var winW = $(window).width();
    var menH = getMenuHeight();
    var menuHiderH = (menuActive == true) ? parseInt($("#menu-container").height(), 10) : parseInt($("#menu-container #menu-hider").height(), 10);

    if (touchDevice == 0) {
        var totalMinusSize = 0;
        var activScrollbar = availScrollbar.length;
        if (availScrollbar.length > 0) {
            if (winW >= 768) {
                availScrollbar.css("height", winH).css("top", "0px");
            } else {
                availScrollbar.css("height", (winH - menuHiderH) + "px");
                totalMinusSize = menH;
            }
        }
        if (pModH >= cConH) {
            if (availScrollbar.length > 0 && availScrollbar.css("display") != "none") {
                TweenMax.to(availScrollbar, .6, { css: { opacity: "0" }, ease: Quad.easeOut, onComplete: function() { availScrollbar.css("display", "none"); } });
            }
            if (moduleList != null) {
                moduleList.destroy();
                moduleList = null;
            }
            if (noRepos == true) return;
            var valTop = pModH - cConH;
            if (modSide == "none") {
                if (mPos != "module-position-bc") {
                    pCon.parent(pCon).css("top", Math.round(valTop * 0.5) + "px");
                } else {
                    pCon.parent(pCon).css("top", Math.round(valTop) + "px");
                }
            } else if (modSide == "height") {
                cCon.css("top", Math.round(valTop * 0.5) + "px");
            } else if (modSide == "custom") {
                if (anim == true) {
                    TweenMax.to(cCon, .3, { css: { top: "0px" }, ease: Sine.easeOut });
                } else {
                    cCon.css("top", "0px");
                }
            }
            if (mPos == "module-position-bc" || mPos == "module-position-cc") {
                var value = Math.round((($("#module-container").width() - pConW) * .5 /*+ get_OffsetWidth()*/));
                if (anim == true) {
                    TweenMax.to(pMod, .6, { css: { left: value + "px" }, ease: Sine.easeOut });
                } else {
                    pMod.css("left", value + "px");
                }
            }
        } else {
            if (availScrollbar.length > 0) {
                switch (modSide) {
                case "none":
                    pCon.parent(pCon).css("top", "0px");
                    cCon.parent(cCon).css("top", "0px");
                    break;
                case "height":
                    cCon.css("top", "0px");
                    break;
                }
                TweenMax.killTweensOf(availScrollbar);
                if (availScrollbar.css("display") == "none") {
                    availScrollbar.css("opacity", "0").css("display", "inline");
                }
                TweenMax.to(availScrollbar, .6, { css: { opacity: "1" }, ease: Quad.easeOut });
            }
            if (moduleList == null) {
                moduleList = pMod.McCustomList({ scrollDirection: "vertical", scrollType: "linear" });
                moduleList.setupList({
                    scrollContainer: cCon,
                    mouseWheelSupport: "yes",
                    buttonsSupport: "no",
                    draggerContainer: availScrollbar,
                    draggerScroll: $("#module-scrollbar-dragger", availScrollbar),
                    totalMinusSize: totalMinusSize,
                    scrollSpeed: 100,
                    offsetSize: 0,
                    horizFixHolder: null,
                    customStartPos: custStartPos
                });
            } else {
                moduleList.updateCustomList(totalMinusSize);
            }
            if (mPos == "module-position-bc" || mPos == "module-position-cc") {
                var value = Math.round((($("#module-container").width() - pConW) * .5));
                if (mPos == "module-position-bc") {
                    pCon.parent(pCon).css("top", "0px");
                }
                if (anim == true) {
                    TweenMax.to(pMod, .6, { css: { left: value + "px" }, ease: Sine.easeOut });
                } else {
                    pMod.css("left", value + "px");
                }
            }
        }
    } else {
        /*remove scrollbar if present and add overflow for touch devices*/
        var valTop = pModH - cConH;
        switch (modSide) {
        case "none":
            if (pModH >= cConH && pCon.length > 0) {
                if (mPos != "module-position-bc") {
                    pCon.parent(pCon).css("top", Math.round(valTop * 0.5) + "px");
                } else {
                    pCon.parent(pCon).css("top", Math.round(valTop) + "px");
                }
            } else {
                pCon.parent(pCon).css("top", "0px");
            }
            break;
        case "height":
            if (cCon.length > 0) cCon.css("top", "0px");
            break;
        case "width":
            break;
        case "custom":
            if (cCon.length > 0)
                if (anim == true) {
                    TweenMax.to(cCon, .3, { css: { top: "0px" }, ease: Sine.easeOut });
                } else {
                    cCon.css("top", "0px");
                }
            break;
        }

        if (cCon.length <= 0 || pCon.length <= 0) return;
        pCon.css("overflow", "").css("-webkit-overflow-scrolling", "");
        clearCustomInterval(updateInterval);
        updateInterval = setInterval(function() {
            pCon.css("overflow", "auto").css("-webkit-overflow-scrolling", "touch");
            clearCustomInterval(updateInterval);
        }, 100);

        if (currModuleType == "news" && previewNewsOpen == true) {
            TweenMax.to(pCon, .3, { scrollTop: 0, easing: Sine.easeOut });
        }
        if (currModuleType == "page_columns" && columnsPreviewOpen == true) {
            TweenMax.to(pCon, .3, { scrollTop: 0, easing: Sine.easeOut });
        } else if (currModuleType == "page_columns" && columnsPreviewOpen == false) {
            pCon.scrollTop(custStartPos)
        }

        if (mPos == "module-position-bc" || mPos == "module-position-cc") {
            if (currModuleType == "text_page" && modSide == "none") {
                $("#module-text-page", $(txt_modCont)).css("height", "");
            }
            if (winH <= pConH && $("#module-text-page", $(txt_modCont)).length > 0) {
                $("#module-text-page", $(txt_modCont)).css("height", "");
                $("#module-text-page", $(txt_modCont)).css("height", "100%");
            }
            var value = Math.round((($("#module-container").width() - pConW) * .5 /*+ get_OffsetWidth()*/));
            if (anim == true) {
                TweenMax.to(pMod, .6, { css: { left: value + "px" }, ease: Sine.easeOut });
            } else {
                pMod.css("left", value + "px");
            }
        }
    }
}

function getElem_W_H(elem, type) {
    var val1 = (elem.length > 0) ? elem.height() + parseInt(elem.css("margin-top"), 10) + parseInt(elem.css("margin-bottom"), 10) : 0;
    var val2 = (elem.length > 0) ? elem.width() : 0;
    return (type == "w") ? val2 : val1;
}

/*================= TEXT PAGE =============================*/

function moduleTextPage() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-text-page", textPageInstanceHolder);
    var modWrapper = $("#module-wrapper", textPageInstanceHolder);
    var modulePositionType = textPageInstanceHolder.attr("data-id");
    var moduleWidth = textPageInstanceHolder.width();
    var moduleHeight = textPageInstanceHolder.height();

    moduleEnd = true;
    if (textPageInstance.length <= 0) return;
    endModuleFunction = endModuleTextPage;

    switch (modulePositionType) {
    case "module-position-lb":
        break;
    case "module-position-lc":
        var val = (-moduleWidth) + "px";
        moduleUpdate(textPageInstance, modWrapper, $("div:first", modWrapper), sideType);
        textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " left:" + val + "; visibility: visible;");
        TweenMax.to(textPageInstanceHolder, .6, { css: { left: "0px" }, ease: Circ.easeInOut, onComplete: moduleUpdate_text_page }); /*get_OffsetWidth() +*/
        break;
    case "module-position-bc":
        moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
        var val = parseInt(textPageInstance.css("top"), 10) + "px";
        textPageInstanceHolder.css("top", moduleHeight).css("visibility", "visible");
        TweenMax.to(textPageInstanceHolder, .6, { css: { top: "0px" }, ease: Circ.easeInOut, onComplete: moduleUpdate_text_page });
        break;
    case "module-position-rc":
        textPageInstanceHolder.css("position", "fixed");
        moduleUpdate(textPageInstance, modWrapper, $("div:first", modWrapper), sideType);
        var val = (-moduleWidth) + "px";
        textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " position: fixed; right:" + val + "; visibility: visible;");
        TweenMax.to(textPageInstanceHolder, .6, { css: { right: "0px" }, ease: Circ.easeInOut, onComplete: moduleUpdate_text_page });
        break;
    case "module-position-cc":
        moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
        var val = parseInt(textPageInstanceHolder.css("left"), 10);
        textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " left: 100%; visibility: visible;");

        TweenMax.to(textPageInstanceHolder, .6, { css: { left: val }, ease: Circ.easeOut, onComplete: moduleUpdate_text_page });
        break;
    }
}

function endModuleTextPage() {
    var textPageInstance = $("#module-container-holder");
    var modulePositionType = textPageInstance.attr("data-id");
    var moduleWidth = textPageInstance.width();
    var moduleHeight = textPageInstance.height();
    endPreviousModule = true;
    switch (modulePositionType) {
    case "module-position-lb":
        break;
    case "module-position-lc":
        var val = (-moduleWidth) + "px";
        TweenMax.to(textPageInstance, .6, { css: { left: val }, ease: Circ.easeInOut, onComplete: endModuleComplete });
        break;
    case "module-position-bc":
        TweenMax.to(textPageInstance, .6, { css: { top: moduleHeight + "px" }, ease: Circ.easeInOut, onComplete: endModuleComplete });
        break;
    case "module-position-rc":
        var val = (-moduleWidth) + "px";
        TweenMax.to(textPageInstance, .6, { css: { right: val }, ease: Circ.easeInOut, onComplete: endModuleComplete });
        break;
    case "module-position-cc":
        var val = $(window).width() + get_OffsetWidth() + "px";
        TweenMax.to(textPageInstance, .6, { css: { left: val }, ease: Circ.easeInOut, onComplete: endModuleComplete });
        break;
    }
    endModuleFunction = null;
}

function endModuleComplete() { endPreviousModule = false; }

/*================= NEWS ===================================*/
var previewNewsOpen = false;
var previewNewsIndex = 0;
var totalPreviews = 0;
var previewNewsMediaParent = "";
var newsPrevItemArr = "";
var shortNIV = "news-item-vertical";
var shortNP = "news-preview"
var shortNPH = "#module-news-preview-holder";
var shortNPU = "#news-preview-list";
var newsPrvH = "";
var newsPrvU = "";

function moduleNews() {
    previewNewsOpen = false;
    previewNewsIndex = 0;
    previewNewsMediaParent = "";
    newsPrevItemArr = new Array();

    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-news-vertical", textPageInstanceHolder);
    var moduleWidth = textPageInstanceHolder.width();
    var moduleHeight = textPageInstanceHolder.height();
    newsPrvH = $(shortNPH);
    newsPrvU = $(shortNPU);

    moduleUpdate(textPageInstanceHolder, $("#module-news-vertical-holder", textPageInstance), $("#module-news-vertical-holder div:first", textPageInstance), sideType);

    if (touchDevice == 1) {
        $("#module-news-vertical-holder").css("overflow", "auto").css("-webkit-overflow-scrolling", "touch");
        newsPrvH.css("overflow", "auto").css("-webkit-overflow-scrolling", "touch");
    }

    var val = (-moduleWidth) + "px";
    textPageInstanceHolder.attr("style", "left:" + val + "; visibility:visible;");
    TweenMax.to(textPageInstanceHolder, .6, { css: { left: "0px" }, delay: 0.1, ease: Circ.easeInOut });
    endModuleFunction = endModuleTextPage;
    moduleEnd = true;

    newsPrvH.css("display", "inline");
    var newsPrevItemMediaArr = new Array();
    $(textPageInstance).find("." + shortNP + "-horizontal-fix").each(function() {
        $(this).css("width", 999999);
        var newsPrevItem = $("ul li", this);
        var i = 0;
        newsPrevItem.each(function() {
            var mediaSrc = $(".media-holder-news-preview", this).attr("data-src");
            newsPrevItemArr[i] = $(this);
            newsPrevItemMediaArr[i] = mediaSrc;
            i++;
        });
        $("ul", this).css("width", $("ul", this).width()).css("left", moduleWidth);
        $(this).css("width", "");
    });
    newsPrvH.css("display", "");

    var readMoreBtn = $("." + shortNIV + "-read-more", textPageInstance);
    var basicColor = rgb2hex(readMoreBtn.css("background-color"));
    var newsList = $("#module-news-vertical-holder");
    var prevItemW = $("." + shortNP + "-horizontal-fix").width();
    readMoreBtn.hover(
        function() { TweenMax.to($(this), 0.6, { css: { backgroundColor: themeColor }, easing: Sine.easeOut }); },
        function() { TweenMax.to($(this), 0.6, { css: { backgroundColor: basicColor }, easing: Sine.easeOut }); }
    );

    var newsPreviewControls = $("#" + shortNP + "-controls");
    var newsPrevItemMargRight = parseInt($("li:first", newsPrvU).css("margin-right"), 10);
    newsPreviewControls.css("left", moduleWidth);

    var nwsItem = $(".news-item-vertical", textPageInstance);
    var nwsItemTitle = $(".news-item-vertical-title", $(".news-item-vertical:first", textPageInstance));
    var nwsTitleColor = rgb2hex(nwsItemTitle.css("color"));
    nwsItem.hover(
        function() {
            TweenMax.to($(".news-item-vertical-title", this), .6, { css: { color: themeColor }, easing: Sine.easeOut });
        },
        function() {
            TweenMax.to($(".news-item-vertical-title", this), .6, { css: { color: nwsTitleColor }, easing: Sine.easeOut });
        }
    );
    nwsItem.click(function() {
        previewNewsIndex = nwsItem.index(this);
        newsItemClick(previewNewsIndex);
    });
    var newsItemTopPos = 0;
    totalPreviews = newsPrvU.children().length;

    function newsItemClick(index) {
        if (moduleList != null) {
            moduleList.disableList();
            newsItemTopPos = moduleList.currentPosition();
            var ts = $(t_scrBarV1);
            TweenMax.to(ts, .3, { css: { opacity: "0" }, easing: Sine.easeOut, onComplete: function() { ts.css("display", "none"); } });
        }
        newsPrvH.css("display", "inline");
        var newsListW = $(newsList).width() + $(newsList).position().left + 30;
        var i = 0;
        for (i; i < totalPreviews; i++) {
            if (i == index) {
                newsPrevItemArr[i].css("display", "inline");
            } else {
                newsPrevItemArr[i].css("display", "none");
            }
        }
        $(".news-preview-counter span").empty().append((index + 1) + "/" + totalPreviews);
        TweenMax.to(newsList, .6, { css: { left: -newsListW }, delay: 0.1, easing: Sine.easeOut })
        TweenMax.to([newsPrvU, newsPreviewControls], .6, { css: { left: "0px" }, delay: 0.1, easing: Sine.easeOut, onComplete: loadNewsVerticalPreview, onCompleteParams: [index] });
    }

    function loadNewsVerticalPreview(index) {
        var scrollValue = index * (prevItemW + newsPrevItemMargRight);
        if (previewNewsOpen == false) {
            previewNewsOpen = true;
            newsPrvU.css("left", -(scrollValue) + "px");
            newsPreviewItemDisplay("inline");
            checkScrollBar(previewNewsOpen);
        } else {
            $(".news-preview-counter span").empty().append((index + 1) + "/" + totalPreviews);
            TweenMax.to(newsPrvU, 0.6, { css: { left: -scrollValue }, delay: 0.1, easing: Sine.easeOut, onComplete: checkScrollBar, onCompleteParams: [previewNewsOpen] });
        }
    }

    function checkScrollBar(previewNewsOpen) {
        enablePreviewClose(true);
        if (moduleList != null) {
            moduleList.destroy(false);
            moduleList = null;
        }
        var i = 0;
        for (i; i < totalPreviews; i++) {
            if (i != previewNewsIndex) {
                newsPrevItemArr[i].css("display", "none");
            }
        }

        moduleUpdate(textPageInstanceHolder, $("#module-news-preview-holder", textPageInstance), $("#module-news-preview-container", textPageInstance), "custom", 0);

        previewNewsMediaParent = $(".media-holder-news-preview", newsPrevItemArr[previewNewsIndex]);
        if ($("img", previewNewsMediaParent).length <= 0) {
            previewNewsMediaParent.empty().append('<img width="100%" class="opacity_0" onload="animateNewsPreviewMedia(this)" />');
            $("img", previewNewsMediaParent).attr("src", newsPrevItemMediaArr[previewNewsIndex]);
        } else {
            if (touchDevice == 1) {
                $("#module-news-preview-container", textPageInstance).css("height", "");
                $("#module-news-preview-container", textPageInstance).css("height", $("#module-news-preview-container", textPageInstance).height());
            }
        }
        newsPreviewItemDisplay("inline");
    }

    var initBackColor = rgb2hex($("." + shortNP + "-backward ." + shortNP + "-backg").css("background-color"));
    $("." + shortNP + "-backward, ." + shortNP + "-forward, ." + shortNP + "-close").hover(
        function() { TweenMax.to($("." + shortNP + "-backg", this), 0.3, { css: { backgroundColor: themeColor }, easing: Sine.easeOut }); },
        function() { TweenMax.to($("." + shortNP + "-backg", this), 0.3, { css: { backgroundColor: initBackColor }, easing: Sine.easeOut }); }
    );
    $("." + shortNP + "-backward, ." + shortNP + "-forward", textPageInstance).click(
        function() {
            var index = previewNewsIndex;
            if ($(this).hasClass("" + shortNP + "-backward") == true) {
                index--;
                changeNewsPreviewMedia(index);
            } else if ($(this).hasClass("" + shortNP + "-forward") == true) {
                index++;
                changeNewsPreviewMedia(index);
            }
        });

    function changeNewsPreviewMedia(index) {
        if (index < 0) index = 0;
        if (index > totalPreviews - 1) index = totalPreviews - 1;
        if (index == previewNewsIndex) return;
        enablePreviewClose(false)
        previewNewsIndex = index;
        loadNewsVerticalPreview(previewNewsIndex);
    }

    newsPrvU.wipetouch({
        tapToClick: false, /*if user taps the screen, triggers a click event*/
        preventDefault: false,
        wipeLeft: function(result) {
            var index = previewNewsIndex;
            index++;
            changeNewsPreviewMedia(index)
        },
        wipeRight: function(result) {
            var index = previewNewsIndex;
            index--;
            changeNewsPreviewMedia(index)
        }
    });

    /*initial close enabled*/
    enablePreviewClose(true);

    function enablePreviewClose(enable) {
        var newsPreviewCloseBtn = $("." + shortNP + "-close", textPageInstance);
        newsPreviewCloseBtn.unbind("click");
        if (enable == true) {
            newsPreviewCloseBtn.click(function() { click_PreviewClose(); });
            TweenMax.to(newsPreviewCloseBtn, .4, { css: { opacity: "1" }, easing: Sine.easeOut });
        } else {
            TweenMax.to(newsPreviewCloseBtn, .4, { css: { opacity: "0.5" }, easing: Sine.easeOut });
        }
    }

    function click_PreviewClose() {
        previewNewsOpen = false;
        newsPrvU.css("left", 0);
        var i = 0;
        for (i; i < totalPreviews; i++) {
            if (i != previewNewsIndex) {
                newsPrevItemArr[i].css("display", "none");
            }
        }
        TweenMax.to([newsPrvU, newsPreviewControls], 0.6, { css: { left: $(newsList).width() }, delay: 0.1, easing: Sine.easeOut });
        TweenMax.to($(t_scrBarV1), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        TweenMax.to(newsList, .6, { css: { left: "0" }, delay: 0.1, easing: Sine.easeOut, onComplete: disableNewsPreview })
    }

    function disableNewsPreview() {
        newsPrvH.css("display", "none");
        $(t_scrBarV1).css("display", "none");
        if (moduleList != null) {
            moduleList.destroy(true);
            moduleList = null;
        }
        moduleUpdate(textPageInstanceHolder, $("#module-news-vertical-holder", textPageInstance), $("#module-news-vertical-holder div:first", textPageInstance), sideType, null, null, newsItemTopPos);
    }
}

function animateNewsPreviewMedia(src) {
    var inst = $(src);
    TweenMax.to($(src).parent(), .3, { css: { height: inst.height() }, easing: Sine.easeOut });
    TweenMax.to(inst, .4, { css: { opacity: '1' }, easing: Sine.easeOut, onComplete: moduleUpdate_news });
}

function newsPreviewItemDisplay(display) {
    var i = 0;
    for (i; i < totalPreviews; i++) {
        newsPrevItemArr[i].css("display", display);
    }
}

/*================= CONTACT ================================*/

function moduleContact() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    var mapHolder = $("#module-container #map-holder");
    var winH = $(window).height();
    var winW = $(window).width();
    var mapW = screen.width; /**/
    var mapLeft = (-get_OffsetWidth()) * .5;
    var mapH = mapHolder.height();

    var mediaHolder = $("#module-contact-container #media-holder-contact", textPageInstance);

    if (mediaHolder.length > 0) {
        if (mapHolder.length > 0) {
            mapHolder.remove();
        }
        mapH = parseInt(mediaHolder.css("height"), 10);
        var imgSrc = mediaHolder.attr("data-src");
        mediaHolder.attr("style", "display: inline; visibility: visible;");
        mediaHolder.empty().append('<img  onload="animateMedia(this)" width="100%"/>')
        $("img", mediaHolder).css("opacity", "0").attr("src", imgSrc);
    }

    if (mapHolder.length > 0) {
        mapHolder.attr("style", "display: inline; visibility: visible;");
        mapHolder.css("opacity", "0").css("width", mapW);
        mapHolder.css("left", mapLeft + "px");
        TweenMax.to(mapHolder, .3, { css: { opacity: "1" }, easing: Sine.easeOut });
        var iconSize = mapHolder.attr("data-size").split(",");
        var anchor = mapHolder.attr("data-anchor").split(",");
    }

    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();
    if (touchDevice == 1) {
        currWindowW = $(window).width() - templateMenuW;
    }
    textPageInstance.css("width", currWindowW);

    if ($("div:first", textPageInstance).height() <= $(window).height()) {
        currWindowW = currWindowW + $(t_scrBarV2).width();
    }

    textPageInstance.css("width", currWindowW);
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    var modContact = $("#module-container #module-contact");
    var modContactH = modContact.height();
    var conH = ((winH - mapH) >= modContactH) ? (winH - mapH) : modContactH;
    modContact.attr("style", "bottom: " + (-conH) + "px; height: " + conH + "px; visibility: visible;");        
        
        
    moduleUpdate_contact();
    TweenMax.to(modContact, .6, {
        css: { bottom: "0px" },
        ease: Circ.easeInOut,
        onComplete: function() {
            if (mapHolder.length > 0) {
                mapHolder.gMap({
                    controls: {
                        panControl: true,
                        zoomControl: true,
                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        overviewMapControl: false
                    },
                    scrollwheel: false,
                    address: mapHolder.attr("data-address"),
                    zoom: 16,
                    markers: [{
                        latitude: mapHolder.attr("data-latitude"),
                        longitude: mapHolder.attr("data-longitude"),
                        icon: {
                            image: mapHolder.attr("data-icon"),
                            iconsize: [iconSize[0], iconSize[1]],
                            iconanchor: [anchor[0], anchor[1]]
                        }
                    }]
                });
            }
            contactFormSetup();
        }
    });
    var modContainerW = $("#module-container").width();
    $("#module-contact-holder").css("left", (modContainerW - $("#module-contact-holder").width()) * .5 + "px");
    endModuleFunction = null;
    moduleEnd = true;

    var inputDefaultText = '';
    var btnBackgColor = rgb2hex($("#form-reset").css("background-color"));
    $("#form-reset, #form-send").hover(
        function() {
            TweenMax.to($(this), .6, { css: { backgroundColor: themeColor }, ease: Circ.easeOut });
        },
        function() {
            TweenMax.to($(this), .6, { css: { backgroundColor: btnBackgColor }, ease: Circ.easeOut });
        });
    $(".form-input-half-left input, .form-input-half-right input, .form-input-large input, .form-input-textarea textarea").focus(
        function() {
            var obj = $(this),
                parent = obj.parent();
            if (parent.hasClass("form-input-error-border") == true) {
                setFormInputBorder(parent, "form-input-error-border", "form-input-border");
            }
            if (obj.val() == (obj.attr('name') + ' ' + '*')) {
                inputDefaultText = obj.val();
                obj.val('');
            }
            TweenMax.to($(".form-input-background", parent), .6, { css: { backgroundColor: "#ffffff", opacity: "1" }, ease: Circ.easeOut });
        });
    $(".form-input-half-left input, .form-input-half-right input, .form-input-large input, .form-input-textarea textarea").focusout(
        function() {
            var obj = $(this);
            if (obj.val() == '' || obj.val() == ' ') obj.val(inputDefaultText);
            TweenMax.to($(".form-input-background", obj.parent()), .6, { css: { backgroundColor: "#9e9e9e", opacity: "0.2" }, ease: Circ.easeOut });
        });
}

function animateMedia(img) {
    TweenMax.to(img, 0.4, { css: { opacity: "1" }, easing: Sine.easeOut });
}

var name = "", email = "", phone = "", messg = "",
    nameDefTxt = "", emailDefTxt = "", phoneDefTxt = "", messgDefTxt = "",
    resetBtn = "", sendBtn = "", sendBtnText = "", btnTextSend = "";

function contactFormSetup() {
    name = $("#contact-form #name"),
    email = $("#contact-form #email"),
    phone = $("#contact-form #phone"),
    messg = $("#contact-form #message");

    nameDefTxt = name.val(),
    emailDefTxt = email.val(),
    phoneDefTxt = phone.val(),
    messgDefTxt = messg.val();

    resetBtn = $("#contact-form #form-reset");
    sendBtn = $("#contact-form #form-send");
    sendBtnText = $("p", sendBtn).text();
    btnTextSend = (sendBtn.attr("data-sending-txt") != undefined) ? sendBtn.attr("data-sending-txt") : "null";

    var parentArr = [name.parent(name), email.parent(email), phone.parent(phone), messg.parent(messg)];

    var responseForm = $("#response-form");

    resetBtn.click(function() {
        resetFormValues();
        setFormArrInputBorder(parentArr, "form-input-error-border", "form-input-border");
        TweenMax.to(responseForm, .4, {
            css: { opacity: 0 },
            delay: 0.1,
            easing: Sine.easeOut,
            onComplete: function() {
                $("p", responseForm).css("display", "inline-block");
                $("#form-warning", responseForm).css("display", "inline-block");
            }
        });
    });

    var sendingVal = false;
    sendBtn.click(function() {
        if (sendingVal == true) return
        var validForm = validateForm();
        responseForm.css("display", "inline-block").css("opacity", "0");
        if (validForm.valid == true) {
            sendingVal = true;
            if (contactFormDemo == true) {
                if (btnTextSend != "null") {
                    changeTxtSendBtn($("p", sendBtn), btnTextSend);
                    TweenMax.to(sendBtn, .6, {
                        css: { opacity: 0.5 },
                        ease: Sine.easeOut,
                        onComplete: function() {
                            sendingVal = false;
                            changeTxtSendBtn($("p", sendBtn), sendBtnText)
                            TweenMax.to(sendBtn, .4, { css: { opacity: 1 }, easing: Sine.easeOut });
                            runSendAnimation("inline-block", "none", "none");
                        }
                    });
                }
            } else {
                if (btnTextSend != "null") {
                    changeTxtSendBtn($("p", sendBtn), btnTextSend);
                    TweenMax.to(sendBtn, .6, { css: { opacity: 0.5 }, ease: Sine.easeOut });
                }
                $.ajax({
                    url: phpUrlPath,
                    type: "post",
                    data: ({ senderName: name.val(), senderEmail: email.val(), senderPhone: phone.val(), senderMessage: messg.val() }),
                    dataType: "json",
                    success: function(data) {
                        responseForm.css("display", "inline-block").css("opacity", "1");
                        $("p", responseForm).css("display", "inline-block");
                        if (data.result == true) {
                            runSendAnimation("inline-block", "none", "none");
                        } else {
                            $("#server-error", responseForm).empty().text(data.msg);
                            runSendAnimation("none", "none", "inline-block");
                        }

                        changeTxtSendBtn($("p", sendBtn), sendBtnText);
                        TweenMax.to(sendBtn, .4, { css: { opacity: 1 }, easing: Sine.easeOut });
                        sendingVal = false;
                    }
                });
            }
        } else {
            if (validForm.highlightInp != "null") {
                var arr = validForm.highlightInp,
                    t = arr.length;
                while (t--) {
                    var parent = arr[t].parent(arr[t]);
                    setFormInputBorder(parent, "form-input-border", "form-input-error-border");
                }

            }
            responseForm.css("display", "inline-block").css("opacity", "0");
            $("p", responseForm).css("display", "none");
            $("#form-warning", responseForm).css("display", "inline-block");
            TweenMax.to(responseForm, .4, { css: { opacity: 1 }, delay: 0.1, easing: Sine.easeOut });
        }

    });

    function changeTxtSendBtn(obj, param) {
        obj.empty().append(param);
    }

    function validateForm() {
        var valid = true,
            nameVal = name.val(),
            emailVal = email.val(),
            phoneVal = phone.val(),
            messgVal = messg.val();

        var highlightInput = [];
        var i = 0;
        if (nameVal == nameDefTxt || nameVal == "") {
            valid = false;
            highlightInput[i] = name;
            i++;
        }

        if (emailVal == emailDefTxt || emailVal == "" || isValidEmailAddress(emailVal) == false) {
            valid = false;
            highlightInput[i] = email;
            i++;
        }
        if (phoneVal == phoneDefTxt || phoneVal == "" || isValidPhone(phoneVal) == false) {
            valid = false;
            highlightInput[i] = phone;
            i++;
        }
        if (messgVal == messgDefTxt || messgVal == "") {
            valid = false;
            highlightInput[i] = messg;
            i++;
        }
        highlightInput = (highlightInput.length > 0) ? highlightInput : "null";
        return { valid: valid, highlightInp: highlightInput };
    }

}

function resetFormValues() {
    name.val(nameDefTxt);
    email.val(emailDefTxt);
    phone.val(phoneDefTxt);
    messg.val(messgDefTxt);
}

function runSendAnimation(v1, v2, v3) {
    var responseForm = $("#response-form");
    if (responseForm.length > 0) {
        resetFormValues();
        responseForm.css("display", "inline-block").css("opacity", "0");
        $("p", responseForm).css("display", v1);
        $("#form-warning", responseForm).css("display", v2);
        $("#server-error", responseForm).css("display", v3);
        var delay = (v3 != "none") ? 2 : 1.3;
        TweenMax.to(responseForm, .4, {
            css: { opacity: 1 },
            easing: Sine.easeOut,
            onComplete: function() {
                TweenMax.to(responseForm, .4, { css: { opacity: 0 }, delay: delay, easing: Sine.easeOut });
            }
        });
    }
}

function setFormArrInputBorder(parent, v1, v2) {
    if ($.isArray(parent) == true) {
        var t = parent.length;
        while (t--) {
            setFormInputBorder(parent[t], v1, v2);
        }
    }
}

function setFormInputBorder(parent, v1, v2) {
    if (parent.hasClass(v1) == true) {
        parent.removeClass(v1)
    }
    if (parent.hasClass(v2) == false) {
        parent.addClass(v2)
    }
}

function isValidPhone(phoneNumber) {
    var pattern = new RegExp(/^[0-9-+]+$/);
    return pattern.test(phoneNumber);
}

function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}

/*================= SHOWREEL ===============================*/

function moduleShowreel() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-showreel", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    var modulePositionType = textPageInstanceHolder.attr("data-id");
    var moduleWidth = textPageInstance.width();

    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
    textPageInstance.css("width", "0px").css("visibility", "visible");

    var showreelVideo = $("#video-wrapper", textPageInstanceHolder);
    var media = $("#module-showreel-holder", textPageInstance);
    if (touchDevice == 1) {
        if (showreelVideo.children().length > 0) {
            tempVid = $("div:first", showreelVideo);
            media.empty();
            media.append(tempVid);

        }
        showreelVideo = $("#video-wrapper", textPageInstanceHolder);
    }
    showreelVideo.empty();
    if (showreelVideo.length > 0) templateAddMediaVideo(showreelVideo.attr("data-video-type"), showreelVideo, undefined)

    TweenMax.to(textPageInstance, .4, { css: { width: moduleWidth + "px" }, ease: Quad.easeOut });
    endModuleFunction = endModuleShowreel;
    moduleEnd = true;
}

function endModuleShowreel() {
    var textPageInstance = $("#module-showreel");
    var moduleWidth = textPageInstance.width();
    TweenMax.to(textPageInstance, .6, {
        css: { width: "0px" },
        ease: Quad.easeInOut,
        onComplete: function() {
            destroyVideoJS();
        }
    });
    endModuleFunction = null;
}

function reverseEndModuleShowreel() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-showreel", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    textPageInstance.css("visibility", "hidden");
    textPageInstance.css("width", "");
    var moduleWidth = textPageInstance.width();
    textPageInstance.css("width", "0px").css("visibility", "visible");

    var showreelVideo = $("#video-wrapper", textPageInstanceHolder);
    var media = $("#module-showreel-holder", textPageInstance);
    if (touchDevice == 1) {
        if (showreelVideo.children().length > 0) {
            tempVid = $("div:first", showreelVideo);
            media.empty();
            media.append(tempVid);

        }
    }
    showreelVideo = $("#video-wrapper", textPageInstanceHolder);
    showreelVideo.empty();
    if (showreelVideo.length > 0) {
        templateAddMediaVideo(showreelVideo.attr("data-video-type"), showreelVideo, undefined);
    }
    TweenMax.to(textPageInstance, .4, { css: { width: moduleWidth + "px" }, ease: Quad.easeOut });
    endModuleFunction = endModuleShowreel;
    moduleEnd = true;
}

/*================= FULLSCREEN VIDEO ========================*/

function moduleFullscreenVideo() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-fullscreen-video", textPageInstanceHolder);
    var width = $(window).width() - get_OffsetWidth();
    var height = $(window).height();

    textPageInstance.css("opacity", "0");
    textPageInstance.attr("style", "width:" + width + "px; height:" + height + "px;");
    textPageInstanceHolder.css("visibility", "visible");
    TweenMax.to(textPageInstance, .6, { css: { opacity: "1" }, ease: Circ.easeOut });

    var fullscreenVideo = $("#video-wrapper", textPageInstanceHolder);
    if (fullscreenVideo.length > 0) {
        fullscreenVideo.attr("data-width", width);
        fullscreenVideo.attr("data-height", height);

        var media = $("#fullscreen-video-holder", textPageInstance);
        if (touchDevice == 1) {
            if (fullscreenVideo.children().length > 0) {
                tempVid = $("div:first", fullscreenVideo);
                media.empty();
                media.append(tempVid);

            }
            fullscreenVideo = $("#video-wrapper", textPageInstanceHolder);
        }
        fullscreenVideo.empty();
        templateAddMediaVideo(fullscreenVideo.attr("data-video-type"), fullscreenVideo, undefined);
    }

}

/*================= PRICING TABLES ========================*/

function modulePricingTables() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-pricing", textPageInstanceHolder);

    if (textPageInstance.length <= 0) return;

    var moduleWidth = textPageInstanceHolder.width();
    var moduleHeight = textPageInstanceHolder.height();
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.css("left", "100%").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .5, { css: { left: val }, delay: 0.1, ease: Circ.easeOut });

    $("#pricing-column-holder", textPageInstance).hover(
        function() {
            $(this).css('z-index', 2);
            if ($.browser.msie) {
                if ($.browser.version != "8.0" && ($.browser.version == "9.0" && isIE9Std() == true))
                    if ($(this).hasClass("shadow-side-all-pricing-tables") == false) $(this).addClass("shadow-side-all-pricing-tables");
            } else {
                if ($(this).hasClass("shadow-side-all-pricing-tables") == false) $(this).addClass("shadow-side-all-pricing-tables");
            }
            TweenMax.to($("div:first", this), .4, { css: { backgroundColor: themeColor }, ease: Sine.easeOut });
        },
        function() {
            $(this).css('z-index', 1);
            if ($.browser.msie) {
                if ($.browser.version != "8.0" && ($.browser.version == "9.0" && isIE9Std() == true))
                    if ($(this).hasClass("shadow-side-all-pricing-tables") == true) $(this).removeClass("shadow-side-all-pricing-tables");
            } else {
                if ($(this).hasClass("shadow-side-all-pricing-tables") == true) $(this).removeClass("shadow-side-all-pricing-tables");
            }
            TweenMax.to($("div:first", this), .4, { css: { backgroundColor: "#909090" }, ease: Sine.easeOut });
        }
    );
    $("#pricing-column-holder #pricing-buy-holder", textPageInstance).hover(
        function() { TweenMax.to($(this), .4, { css: { backgroundColor: themeColor }, ease: Sine.easeOut }); },
        function() { TweenMax.to($(this), .4, { css: { backgroundColor: "#3F3F3F" }, ease: Sine.easeOut }); }
    );
}

function customHoverAnimation(type, event, parent, child) {
    var directionCSS = getDirectionCSS(parent, { x: event.pageX, y: event.pageY });
    if (type == "over") {
        child.removeClass();
        child.css("left", directionCSS.from.val1);
        child.css("top", directionCSS.from.val2);
        TweenMax.to(child, .3, { css: { left: directionCSS.to.val1, top: directionCSS.to.val2 }, ease: Sine.easeInOut });
    } else if (type == "out") {
        TweenMax.to(child, .3, { css: { left: directionCSS.from.val1, top: directionCSS.from.val2 }, ease: Sine.easeInOut });
    }
}

/*================= FULL WIDTH =============================*/

function moduleFullWidth() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width", textPageInstanceHolder);
    var modWrapper = $("#module-wrapper", textPageInstance);
    if (textPageInstance.length <= 0) {
        return;
    }
    var currWindowW = $(window).width() - get_OffsetWidth();
    var media = $("#module-full-width-media");
    if (touchDevice == 1) {
        currWindowW = $(window).width() - templateMenuW;
    }

    textPageInstance.css("width", currWindowW);
    if ($("#module-full-width-holder-text", textPageInstance).height() > $(window).height() && touchDevice == 0) {
        currWindowW = currWindowW - $(t_scrBarV2).width();
    }
    textPageInstanceHolder.css("opacity", "0");
    textPageInstanceHolder.css("visibility", "visible");
    media.css("height", "200px");

    TweenMax.to(textPageInstanceHolder, .6, { css: { opacity: "1" }, ease: Circ.easeOut });

    if (media.attr("data-src") != undefined) {
        media.empty().append('<img onload="animateFullWidthMedia(this)" width="100%" />')
        $("img", media).css("opacity", "0").attr("src", media.attr("data-src"));
    } else {
        var vidMedia = $("#video-wrapper", media);
        if (touchDevice == 1) {
            if (vidMedia.children().length > 0) {
                tempVid = $("div:first", vidMedia);
                media.empty();
                media.append(tempVid);

            }
        }
        vidMedia = $("#video-wrapper", media);

        if (vidMedia.length > 0) {
            textPageInstance.css("width", currWindowW);
            vidMedia.attr("data-width", media.width());
            media.css("height", vidMedia.attr("data-height"));
            moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
            templateAddMediaVideo(vidMedia.attr("data-video-type"), vidMedia, undefined);
            moduleUpdate_full_width(true);
        } else {
            moduleUpdate_full_width(true);
        }
    }
}

function animateFullWidthMedia(src) {
    var inst = $(src);
    TweenMax.to($(src).parent(), .4, { css: { height: inst.height() }, easing: Sine.easeOut });
    TweenMax.to(inst, .4, {
        css: { opacity: '1' },
        easing: Sine.easeOut,
        onComplete:
            function() {
                $(src).parent().css("overflow", "visible").css("height", "");
                moduleUpdate_full_width(true);
            }
    });
}

/*================= GALLERY ================================*/
var galleryList = null;
var galleryPreviewMediaArr = new Array();
var galleryPreviewDescArr = new Array();
var currGalleryThumbID = 0;
var currPreviewElem = "";
var visibleGalleryH = 0;
var galleryColumns = 0;
var galleryLines = 0;
var galleryVisibleThumbs = 0;
var previewGalleryOpen = false;
var galleryItemArr = new Array();
var galleryTopPos = 0;

function moduleGallery() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }

    var moduleWidth = textPageInstanceHolder.width();
    var moduleHeight = textPageInstanceHolder.height();

    var galleryHolder = $("#module-galleries-holder", textPageInstance);
    var thumbMarginRight = parseInt($(".thumb-holder").css("margin-right"), 10);
    var thumbMarginBottom = parseInt($(".thumb-holder").css("margin-bottom"), 10);
    var thumbWidth = $(".thumb-holder").width();
    var thumbHeight = $(".thumb-holder").height();
    var containerWidth = galleryHolder.width();
    var containerHeight = galleryHolder.height();
    var visibleHeight = textPageInstance.height();
    var numberColumns = Math.round(containerWidth / (thumbWidth + thumbMarginRight));
    var numberLines = Math.floor(visibleHeight / (thumbHeight + thumbMarginBottom) + 1);
    var totalVisibleThumbs = numberColumns * numberLines - 1;
    var windowH = $(window).height() + 50;
    visibleGalleryH = visibleHeight;
    galleryColumns = numberColumns;
    galleryLines = numberLines;
    galleryItemArr = [];

    galleryTopPos = 0;

    setPreview();
    storePreviewMedia();
    addControlsListeners();
    if ($(window).width() < 480 && galleryColumns > 2) galleryColumns = 1;

    $(".thumb-holder" + ":nth-child(" + galleryColumns + "n+" + galleryColumns + ")", galleryHolder).css("margin-right", "0px");
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
    textPageInstanceHolder.css("visibility", "visible");

    var galleryItem = $("#module-galleries-holder .thumb-holder", textPageInstance);
    var backgOverColor = "#3f3f3f";
    var backgOutColor = rgb2hex(galleryItem.css("background-color"));
    var text1BaseColor = rgb2hex($(".thumb-tag p", galleryItem).css("color"));

    if (touchDevice == 0)
        galleryItem.hover(
            function(event) {
                customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag p", this);
                TweenMax.to(text, .6, { css: { color: backgOutColor }, ease: Quad.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOverColor }, ease: Quad.easeOut });
            },
            function(event) {
                customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag p", this);
                TweenMax.to(text, .6, { css: { color: text1BaseColor }, ease: Circ.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOutColor }, ease: Quad.easeOut });
            });
    galleryItem.click(
        function() {
            var index = $(".thumb-holder").index(this);
            currGalleryThumbID = index;
            currPreviewElem = galleryPreviewMediaArr[index];
            setPreviewLoadHTML();
            galleryTopPos = parseInt($("div:first", textPageInstance).css("top"), 10);
            TweenMax.to(textPageInstance, .6, { css: { opacity: "0" }, ease: Circ.easeOut, onComplete: showGalleryPreview });
            if (moduleList != null) {
                moduleList.disableList();
            }
        });        
        
                
    var childLength = galleryHolder.children().length - 1;
    totalVisibleThumbs = (childLength < totalVisibleThumbs) ? childLength : totalVisibleThumbs;
    galleryVisibleThumbs = totalVisibleThumbs + 1;
    var i = 0;
    var tempI = 0;
    var tempJ = 0;
    var onceD = true;
    galleryHolder.find(".thumb-holder").each(
        function() {
            if (i > totalVisibleThumbs) {
                $(this).css("display", "none");
            } else {
                $(this).css("top", windowH + "px");
            }
            galleryItemArr[i] = $(this);
            i++;

        });
    i = 0
    var tempI = 0;
    var tempJ = 0;
    var onceD = true;
    galleryHolder.find(".thumb-holder").each(
        function() {
            if (i <= totalVisibleThumbs) {
                tempI = Math.floor(i / (numberColumns));
                tempJ = (i - (tempI * (numberColumns))) * 0.15;
                tempI = tempI * 0.1;
                var delay = (0.1) + (tempJ) + (tempI);
                if (i == totalVisibleThumbs) {
                    TweenMax.to($(this), .6, { css: { top: "0px" }, delay: delay, ease: Circ.easeOut, onComplete: afterGalleryStartupAnimation, onCompleteParams: [visibleHeight] });
                } else {
                    TweenMax.to($(this), .6, { css: { top: "0px" }, delay: delay, ease: Circ.easeOut });
                }
            } else {
                return;
            }
            i++;
        });
    endModuleFunction = endModuleGallery;
    moduleEnd = true;
    return;
}

var moduleEnd = true;

function endModuleGallery(reverse) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    var galleryHolder = $("#module-galleries-holder", textPageInstance);
    var thumbInstance = $(".thumb-holder", textPageInstance);
    var thumbHeight = thumbInstance.height() + parseInt(thumbInstance.css("margin-bottom"), 10);
    var containerPos = parseInt(galleryHolder.css("top"), 10);
    var currLine = Math.floor(Math.abs(containerPos / thumbHeight));
    var startNumber = currLine * galleryColumns;
    var endNumber = startNumber + galleryVisibleThumbs;
    var windowH = $(window).height() + 50;
    var totalVisibleThumbs = galleryColumns * galleryLines - 1;

    var childLength = galleryHolder.children().length - 1;
    var currH = galleryHolder.height()
    var i = 0;
    var t = galleryItemArr.length;
    if (reverse == true) {
        totalVisibleThumbs = (childLength < totalVisibleThumbs) ? childLength : totalVisibleThumbs;

        while (t--) {
            if (t >= totalVisibleThumbs) {
                galleryItemArr[t].css("display", "none");
            } else {
                galleryItemArr[t].css("top", windowH + "px");
            }
        }
    } else {
        t = galleryItemArr.length;
        while (t--) {
            if (t < startNumber || t >= endNumber) {
                galleryItemArr[t].css("display", "none");
            }
        }
    }

    if (currH > $(window).height()) {
        galleryHolder.css("top", "0px");
    }
    i = 0;
    var j = 0;
    var tempI = 0;
    var tempJ = 0;
    var onceD = true;
    if (reverse == true) {
        moduleEnd = true;
        galleryHolder.find(".thumb-holder").each(
            function() {
                if (i <= totalVisibleThumbs) {
                    tempI = Math.floor(i / (galleryColumns));
                    tempJ = (i - (tempI * (galleryColumns))) * 0.15;
                    tempI = tempI * 0.1;
                    var delay = (0.1) + (tempJ) + (tempI);
                    TweenMax.killTweensOf($(this));
                    if (i == totalVisibleThumbs) {
                        TweenMax.to($(this), .6, { css: { top: "0px" }, delay: delay, ease: Circ.easeOut, onComplete: showOtherThumbs, onCompleteParams: [galleryHolder] });
                    } else {
                        TweenMax.to($(this), .6, { css: { top: "0px" }, delay: delay, ease: Circ.easeOut });
                    }
                } else {
                    return;
                }
                i++;
            });
    } else {
        t = galleryItemArr.length;
        i = 0;
        while (t--) {
            if (t >= startNumber) {
                tempI = Math.floor(i / (galleryColumns));
                tempJ = (i - (tempI * (galleryColumns))) * 0.15;
                tempI = tempI * 0.1;
                var delay = (0.1) + (tempJ) + (tempI);

                if (t == startNumber && reverse == true) {
                    TweenMax.to(galleryItemArr[t], 0.8, { css: { top: windowH + "px" }, delay: delay, ease: Circ.easeInOut, onComplete: showOtherThumbs, onCompleteParams: [galleryHolder] });
                } else {
                    TweenMax.to(galleryItemArr[t], 0.8, { css: { top: windowH + "px" }, delay: delay, ease: Circ.easeInOut });
                }

                if (onceD == true && $("#dragger-holder").length > 0) {
                    onceD = false;
                    TweenMax.to($("#dragger-holder"), 0.8, { css: { top: windowH + "px" }, ease: Circ.easeInOut });
                }
                i++;
            }
        }
    }
    if (reverse == undefined) endModuleFunction = null;
}

function showOtherThumbs(galleryHolder) {
    galleryHolder.find(".thumb-holder").each(function() { $(this).css("display", "inline").css("top", "0px"); });
}

function afterGalleryStartupAnimation(visibleH) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    $("#module-galleries-holder", textPageInstance).find(".thumb-holder").each(function() { $(this).css("display", "inline"); });
    $("#module-galleries-preview").wipetouch({
        tapToClick: false, /* if user taps the screen, triggers a click event*/
        preventDefault: false,/* if user taps the screen, triggers a click event*/
        wipeLeft: function(result) { wipeChange(1); },
        wipeRight: function(result) { wipeChange(-1); }
    });
}

function wipeChange(idx) {
    var prevMediaChild = $("#preview-media-holder :first");
    TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, delay: .3, easing: Sine.easeOut });
    TweenMax.to(prevMediaChild, .4, {
        css: { opacity: "0" },
        easing: Sine.easeOut,
        onComplete:
            function() {
                changePreviewMedia(idx);
            }
    });
}

function storePreviewMedia() {
    galleryPreviewMediaArr = new Array();
    galleryPreviewDescArr = new Array();
    var i = 0;
    $("#module-galleries-preview").find("#preview-media-holder").children().each(
        function() {
            if ($(this).attr("id") == "preview-media-image") {
                galleryPreviewMediaArr[i] = '<img id="preview-media-image" src="' + $(this).attr("data-url") +
                    '" title="' + $(this).attr("data-title") + '"' +
                    ' alt="' + $(this).attr("data-alt") + '" />';
            } else if ($(this).attr("id") == "video-wrapper") {
                var videoType = $(this).attr("data-type");
                galleryPreviewMediaArr[i] = $(this);
            }
            var descTxt = $(":first", this);
            if ($(":first", this).length > 0) {
                galleryPreviewDescArr[i] = descTxt;
            } else {
                galleryPreviewDescArr[i] = undefined;
            }
            i++;
        });
    i = 0;
    var total = galleryPreviewDescArr.length;
    var descHolder = $("#module-galleries-preview-description-holder");
    for (i = 0; i < total; i++) {
        if (descHolder.length > 0 && galleryPreviewDescArr[i] != undefined) {
            descHolder.append(galleryPreviewDescArr[i]);
        }
    }
    setPreviewLoadHTML();
}

function isIE9Std() {
    var a;
    try {
        var b = arguments.caller.length;
        a = 0;
    } catch(e) {
        a = 1;
    }
    return ((document.all && a) == 1);
}

function setPreviewLoadHTML() {
    $("#module-galleries-preview").find("#preview-media-holder").empty();
}

function setPreview() {
    var galleriesPreview = $("#module-galleries-preview");
    if (galleriesPreview.length > 0) {
        galleriesPreview.remove();
        $("#template-wrapper").after(galleriesPreview);
    }
}

function showGalleryPreview() {
    previewGalleryOpen = true;
    var modGallPrev = $("#module-galleries-preview");
    $("#module-galleries").attr("style", "display: none; visibility: visible;");
    modGallPrev.css("opacity", "0");
    modGallPrev.css("display", "inline");
    modGallPrev.css("visibility", "visible");

    changeGalleryPreviewDescription(-1, currGalleryThumbID)
    TweenMax.to(modGallPrev, .6, { css: { opacity: "1" }, ease: Circ.easeOut, onComplete: showGalleryPreviewMedia });
}

function showGalleryPreviewMedia() {
    if ($(currPreviewElem).attr("id") == "preview-media-image") {
        /*PLAY MEDIA IMAGE*/
        $("#module-galleries-preview").find("#preview-media-holder").append('<img id="preview-media-load" onload="animatePreviewMedia()" title="" alt="" />');
        var prevMediaLoad = $("#preview-media-load");
        prevMediaLoad.attr("style", "visibility: visible; display: inline");
        prevMediaLoad.css("opacity", "0");
        prevMediaLoad.attr("src", $(currPreviewElem).attr("src")).attr("title", $(currPreviewElem).attr("title")).attr("alt", $(currPreviewElem).attr("alt"));
    } else if ($(currPreviewElem).attr("id") == "video-wrapper") {
        /*PLAY MEDIA VIDEO*/
        $("#module-galleries-preview").find("#preview-media-holder").find("#video-wrapper").remove();
        var descHeight = ($("#module-galleries-preview-description-holder").length > 0) ? $("#module-galleries-preview-description-holder").height() : 0;
        if (previewDescriptionActive == false) descHeight = 0;
        var prevMediaHolder = $("#preview-media-holder");
        var mediaBackNewW = parseInt($(currPreviewElem).attr("data-width"), 10) + previewBorderSize * 2;
        var mediaBackNewH = parseInt($(currPreviewElem).attr("data-height"), 10) + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5 - descHeight * .5;
        var mediaBackMarginLeft = -mediaBackNewW * .5;
        prevMediaHolder.attr("style", "width: " + mediaBackNewW + "px; height: " + mediaBackNewH + "px; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
        $("#preview-media-holder").append('<div id="video-wrapper"></div>')
        templateAddMediaVideo($(currPreviewElem).attr("data-video-type"), $(currPreviewElem), $("#video-wrapper"));

        TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        loadingAnimationDone = true;
        fadeInMedia("");
    } else if ($(currPreviewElem).attr("id") == "video-wrapper-collection") {
        /*PLAY MEDIA VIDEO COLLECTION*/
        // TODO: imp
        alert("asdas");
        $("#module-galleries-preview").find("#preview-media-holder")
            .append('<img id="preview-media-load" onload="animatePreviewMedia()" title="" alt="" />');
        var prevMediaLoad = $("#preview-media-load");
        prevMediaLoad.attr("style", "visibility: visible; display: inline");
        prevMediaLoad.css("opacity", "0");
        prevMediaLoad
            .attr("src", "http://localhost:50845/assets/media/portfolio/images/Project_page_img1.jpg");
            

    }
    
}

function addControlsListeners() {
    if (touchDevice == 0) {
        var initOpacity = $(".module-galleries-preview-arrow-backward .module-galleries-preview-arrow-backg").css("opacity");
        var initBackColor = rgb2hex($(".module-galleries-preview-arrow-backward .module-galleries-preview-arrow-backg").css("background-color"));
        var prevControls = $(".module-galleries-preview-arrow-backward, .module-galleries-preview-arrow-forward, .module-galleries-preview-arrow-close");
        prevControls.unbind('mouseenter mouseleave');
        prevControls.hover(
            function() {
                TweenMax.to($(".module-galleries-preview-arrow-backg", this), 0.3, { css: { opacity: "1", backgroundColor: themeColor }, easing: Sine.easeOut });
            },
            function() {
                TweenMax.to($(".module-galleries-preview-arrow-backg", this), 0.3, { css: { opacity: initOpacity, backgroundColor: initBackColor }, easing: Sine.easeOut });
            });
    }
    var prevArrBack = $(".module-galleries-preview-arrow-backward");
    var prevArrForw = $(".module-galleries-preview-arrow-forward")
    prevArrBack.unbind("click");
    prevArrBack.click(
        function() {
            TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
            changePreviewMedia(-1);
        });
    prevArrForw.unbind("click");
    prevArrForw.click(
        function() {
            TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
            changePreviewMedia(1);
        });
    var prevArrClose = ".module-galleries-preview-arrow-close";
    var prevBackg = "#module-galleries-preview-background";
    $(prevBackg).unbind("click");
    $(prevArrClose).unbind("click");
    $(prevArrClose + "," + prevBackg).click(
        function() {
            firstDescRun = true;
            if ($(currPreviewElem).attr("id") == "preview-media-image") {
                TweenMax.to($("#preview-media-load"), .3, { css: { opacity: "0" }, ease: Circ.easeOut });
            } else if ($(currPreviewElem).attr("id") == "video-wrapper") {
                setPreviewLoadHTML();
                TweenMax.to($(currPreviewElem), .3, { css: { opacity: "0" }, ease: Circ.easeOut });
            }
            if (previewDescriptionActive == true) TweenMax.to($("#module-galleries-preview-description-holder"), .3, { css: { bottom: "-60px" }, ease: Circ.easeOut });
            TweenMax.to($("#module-galleries-preview"), .6, { css: { opacity: "0" }, ease: Circ.easeOut, delay: 0.3, onComplete: onClosePreviewComplete });
        });
}

var loadingAnimationDone = true;
var previewDescriptionActive = true;

function changePreviewMedia(value) {
    var nextThumbID = currGalleryThumbID + value;
    if (nextThumbID > galleryPreviewMediaArr.length - 1) {
        nextThumbID = 0;
    } else if (nextThumbID < 0) {
        nextThumbID = galleryPreviewMediaArr.length - 1;
    }
    if (currGalleryThumbID != nextThumbID) {
        if ($(currPreviewElem).attr("id") == "preview-media-image") {
            $("#preview-media-load").css("opacity", 0).css("visibility", "hidden").css("display", "none");
        } else if ($(currPreviewElem).attr("id") == "video-wrapper") {
            $(currPreviewElem).css("opacity", "0").css("visibility", "hidden").css("display", "none");
        }
        changeGalleryPreviewDescription(currGalleryThumbID, nextThumbID)
        currGalleryThumbID = nextThumbID;
        currPreviewElem = galleryPreviewMediaArr[currGalleryThumbID];
        setPreviewLoadHTML();
        showGalleryPreviewMedia();
    }
}

function changeGalleryPreviewDescription(pID, cID) {
    if (pID != -1) {
        var pDesc = galleryPreviewDescArr[pID];
        if (pDesc != undefined)
            TweenMax.to($(pDesc), .4, { css: { opacity: "0" }, ease: Circ.easeOut, onComplete: hidePrevDescText, onCompleteParams: [pID] });
    }
    if (cID != -1) {
        var cDesc = galleryPreviewDescArr[cID];
        if (cDesc == undefined) {
            previewDescriptionActive = false;
            firstDescRun = true;
            TweenMax.to($("#module-galleries-preview-description-holder"), .4, { css: { bottom: "-60px" }, ease: Circ.easeOut });
            return;
        } else {
            previewDescriptionActive = true;
        }
        $(cDesc).css("opacity", "0").css("visibility", "visible").css("display", "inline");
        TweenMax.to($(cDesc), .6, { css: { opacity: "1" }, ease: Circ.easeOut });
    }
}

function hidePrevDescText(pID) {
    var pDesc = galleryPreviewDescArr[pID];
    $(pDesc).css("opacity", "0").css("visibility", "hidden").css("display", "none");
}

function updatePreviewMediaPosition() {
    var visibleWidth = $(window).width() - previewBorderSize * 2;
    var visibleHeight = $(window).height() - 36;
    var elem = "";
    var mediaType = $(currPreviewElem).attr("id");
    if (mediaType == "preview-media-image") {
        elem = $("#preview-media-load");
        elem.css("width", '').css("height", '');
        checkSizeMedia($(elem), visibleWidth, visibleHeight);
    }
    if ($(elem).width() != null) {
        var mediaBackNewW = $(elem).width() + previewBorderSize * 2;
        var mediaBackNewH = $(elem).height() + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5 - 18;
        var mediaBackMarginLeft = -mediaBackNewW * .5;
        var prevMediaHolder = $("#preview-media-holder");
        prevMediaHolder.attr("style", "width: " + $(elem).width() + "px; height: " + $(elem).height() + "px; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
    }
}

function onClosePreviewComplete() {
    setPreviewLoadHTML();
    var prevMediaLoad = $("#preview-media-load");
    var modGallPrev = $("#module-galleries-preview");
    var modGall = $("#module-galleries");
    if ($(currPreviewElem).attr("id") == "preview-media-image") {
        prevMediaLoad.css("opacity", 0).css("visibility", "hidden").css("display", "none");
    }
    if ($(currPreviewElem).attr("id") == "preview-media-video") {
        prevMediaLoad.css("opacity", 0);
    }
    modGallPrev.css("opacity", "0").css("display", "none").css("visibility", "hidden");
    modGall.css("opacity", "0").css("display", "inline").css("visibility", "visible");
    previewGalleryOpen = false;
    changeGalleryPreviewDescription(currGalleryThumbID, -1)
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    if (moduleList != null) {
        moduleList.enableList();
        moduleList.updateCurrPos(galleryTopPos);
    }
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType, true, false);
    TweenMax.to(textPageInstance, .6, { css: { opacity: "1" }, ease: Circ.easeOut });
}

function animatePreviewMedia() {
    var descHeight = ($("#module-galleries-preview-description-holder").length > 0) ? $("#module-galleries-preview-description-holder").height() : 0;
    if (previewDescriptionActive == false) descHeight = 0;
    var visibleWidth = $(window).width() - previewBorderSize * 2;
    var visibleHeight = $(window).height() - descHeight;
    var elem = "";
    var mediaType = $(currPreviewElem).attr("id");
    if (mediaType == "preview-media-image") {
        elem = $("#preview-media-load");
        checkSizeMedia($(elem), visibleWidth, visibleHeight);
    }
    if ($(elem).width() != null) {
        var mediaBackNewW = $(elem).width() + previewBorderSize * 2;
        var mediaBackNewH = $(elem).height() + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5 - descHeight * .5;
        var mediaBackMarginLeft = -mediaBackNewW * .5;
        var prevMediaHolder = $("#preview-media-holder");
        prevMediaHolder.attr("style", "width: " + $(elem).width() + "px; height: " + $(elem).height() + "px; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
        TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        loadingAnimationDone = true;
        fadeInMedia(mediaType);
    }
}

var firstDescRun = true;

function fadeInMedia(mediaType) {
    if (mediaType == "preview-media-image") {
        TweenMax.to($("#preview-media-load"), .6, { css: { opacity: "1" }, ease: Circ.easeOut });
    }
    if (firstDescRun == true && previewDescriptionActive == true) {
        firstDescRun = false;
        TweenMax.to($("#module-galleries-preview-description-holder"), .6, { css: { bottom: "0px" }, delay: 0.5, ease: Circ.easeOut });
    }
}

function checkSizeMedia(image, w, h) {
    var imageW = image.width();
    var imageH = image.height();
    var scale = 1;
    var newImageW;
    var newImageH;

    if (imageW > w && imageH > h) {
        newImageW = w;
        newImageH = imageH / imageW * newImageW;
        if (imageH > h) {
            newImageW = imageW / imageH * h;
            newImageH = h;
        }
    } else if (imageW > w && imageH < h) {
        newImageW = w;
        newImageH = imageH / imageW * newImageW;
    } else if (imageW < w && imageH > h) {
        newImageH = h;
        newImageW = newImageH / imageH * imageW;
    } else if (imageW < w && imageH < h) {
        newImageW = imageW;
        newImageH = imageH;
    }
    image.width(newImageW);
    image.height(newImageH);
}

function gallerySizeMedia(image, w, h) {
    var imageW = image.width();
    var imageH = image.height();
    var scale = 1;
    /* image aspect ratio is wider than browser window*/
    if (imageW / imageH > w / h) {
        scale = h / imageH;
    } else {
        scale = w / imageW;
    }
    var newImageW = imageW * scale;
    var newImageH = imageH * scale;
    image.width(newImageW);
    image.height(newImageH);
}

/*----------------- end Modules Methods -------------------*/

/*----------------- start footerListeners -----------------*/

function footerListeners() {
    $("#footer-social").find("#footer-social-holder").find("a").each(
        function() {
            var aTitle = $("img", this).attr("title");
            $(this).hover(
                function() {
                    $("#footer-social-tooltip").css("opacity", "0");
                    $("#footer-social-tooltip").css("display", "inline");
                    $("#footer-social-tooltip").css("visibility", "visible");
                    $("#footer-social-tooltip").empty();
                    $("#footer-social-tooltip").append('<span>' + aTitle + '</span>');
                    TweenMax.to($("#footer-social-tooltip"), .6, { css: { opacity: "1" }, ease: Circ.easeOut });
                },
                function() {
                    $("#footer-social-tooltip").css("opacity", "0");
                    $("#footer-social-tooltip").css("display", "none");
                    $("#footer-social-tooltip").css("visibility", "hidden");
                    $("#footer-social-tooltip").empty();
                });
        });
}

/*----------------- end footerListeners -------------------*/

function urlChanged() {
    loadedContent = true;
    menuOptionClicked(menuData[2], menuData[0], menuData[1], menuData[3]);
}

function isOtherURL() {
    var val = (menuData != "" && menuData[2] != prevURL) ? true : false;
    return val;
}

function stopCurrentLoading() {
    if (loadInterval != "") {
        clearInterval(loadInterval);
        loadInterval = "";
    }
    if (showModuleInterval != "") {
        clearInterval(showModuleInterval);
        showModuleInterval = "";
    }
}

var delayAnimationLoading = 0.3;

function activateAnimationLoading() {
    var loadAnim = $("#loading-animation");
    TweenMax.killTweensOf(loadAnim);
    loadAnim.css("right", "-104px").css("display", "inline").css("visibility", "visible");
    if (loadAnim.length > 0) {
        TweenMax.to(loadAnim, .3, { css: { right: "0px" }, delay: delayAnimationLoading, ease: Circ.easeOut, onComplete: doLoad });
    } else {
        doLoad();
    }
}

var loadInterval = ""

function doLoad() {
    if (loadedContent == true) {
        var toLoad = loadURL;
        clearCustomInterval(loadInterval);
        var modGallPrev = $("#module-galleries-preview");
        var fullWidPrev = $("#full-width-preview");
        if (modGallPrev.length > 0) {
            modGallPrev.remove();
        }
        if (fullWidPrev.length > 0) {
            fullWidPrev.remove();
        }

        loadedContent = false;
        loadInterval = setInterval(function() {
            loadModule(toLoad)
            clearCustomInterval(loadInterval);
        }, 50);
    }
}

/*------------------ end menuListeners --------------------*/

/*------------------ start module load functions ----------*/
var loadedContent = true;

function loadModule(url) {
    loadedContent = false;
    backLoaded = false;
    showDone = false;
    var loadContainer = $("#load-container");
    if (loadContainer.length > 0) {
        prevURL = url;
        loadContainer.empty().load(url + ' #module-container > *', moduleLoaded);
    }
    
}

var showModuleInterval = "";
var cc = 0;

function moduleLoaded(response, status, xhr) {
    switch (status) {
    case "error":
        console.log("Error loading the page: " + response);
        break;
    case "success":
        if (prevURL != loadURL) {
            clearCustomInterval(showModuleInterval);
        } else {
            clearCustomInterval(showModuleInterval);
            showModuleInterval = setInterval(function () {
                if (menuData[2] == oldMenuData[2]) {
                    clearCustomInterval(showModuleInterval);
                    loadedContent = true;
                    var loadAnim = $("#loading-animation");
                    if (loadAnim.length > 0) {
                        TweenMax.to(loadAnim, .3, { css: { right: "-104px" }, ease: Circ.easeOut });
                    }
                    return;
                }
                setMenuData(menuData);
                var containerStyle = $("#module-container").attr("style");
                if (containerStyle == undefined) containerStyle = "";
                $("#module-container").attr("id", "module-container-old").attr("style", containerStyle);
                $("#load-container").css("visibility", "hidden").attr('id', 'module-container').attr("style", containerStyle);
                $("#module-container-old").after($("#module-container"));
                $("#template-wrapper").after('<div id="load-container"></div>'); //.css("left", get_OffsetWidth() + "px" )                        
                showModule();
                clearCustomInterval(showModuleInterval);
            }, 50);
        }
        
        break;
    }
}

/*------------------- end module load functions -----------*/

function templateCollectGarbage() {
    var moduleType = $("#template-menu").attr("data-current-module-type");
    if (moduleType != "slideshow") {
        currentSlide = null;
        if (thumbsList != null) {
            thumbsList.destroy();
            thumbsList = null;
        }
    }
    moduleType = null;
}

/*------------------- start window resize -----------------*/

function get_OffsetWidth() {
    var value = 0;
    if (menuActive == false) {
        if (isOverMenu == false)
            value = parseInt($("#menu-hider").css("width"), 10);
        else
            value = parseInt($("#menu-container").css("width"), 10);
    } else {
        value = parseInt($("#menu-container").css("width"), 10);
    }
    return value;
}

/*------------------- end window resize -------------------*/

/*----------------- start Utils Methods -------------------*/

function templateAddMediaVideo(videoType, elem, elemParent) {
    var id = elem.attr("id");
    var url = (videoType != "standalone") ? url = elem.attr("data-url") : "";
    var parent = (elemParent == undefined) ? elem : elemParent;
    var videoEmbedCode = "";
    if (videoType == "standalone") {
        videoEmbedCode += '<video id="standalone-wrapper" class="video-js vjs-default-skin" controls preload="none" width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '"'
            + 'poster="' + elem.attr("data-poster") + '">';
        for (var i = 1; i <= 3; i++) {
            videoEmbedCode += '<source src="' + $(elem).attr("data-url" + i) + '" type="' + $(elem).attr("data-type" + i) + '" />';
        }
        videoEmbedCode += '</video>';
    } else if (videoType != "standalone") {
        videoEmbedCode += '<iframe src="' + url + '" width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '" frameborder="0" allowfullscreen="" mozallowfullscreen="" webkitallowfullscreen=""></iframe>';
        if ($.browser.msie && videoType == "youtube") {
            if ($.browser.version == "8.0" || ($.browser.version == "9.0" && isIE9Std() == false)) {
                url = url.replace("http://www.youtube.com/embed/", "http://www.youtube.com/v/");
                videoEmbedCode = '<object width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '">' + '<param name="movie" value="' + url + '?fs=1&enablejsapi=1"></param>' +
                    '<param name="allowFullScreen" value="true"></param>' +
                    '<param name="allowScriptAccess" value="always"></param>' +
                    '<embed id="ytplayer" src="' + url + '?fs=1&enablejsapi=1"' + 'type="application/x-shockwave-flash"' +
                    'allowfullscreen="true"' + 'allowscriptaccess="always"' + 'width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '">' +
                    '</embed>' +
                    '</object>';
            }
        }
    }
    parent.append(videoEmbedCode);
    destroyVideoJS();
    parent.css("opacity", "0").css("visibility", "visible");
    if (videoType == "standalone") {
        var ready = false;
        videojsHolder = _V_("standalone-wrapper", { }, function() {
            if (ready == false) {
                ready = true;
                TweenMax.to([$("#standalone-wrapper"), parent], .6, { css: { opacity: "1" }, ease: Circ.easeOut });
            }
        });
    } else {
        TweenMax.to(parent, .6, { css: { opacity: "1" }, ease: Circ.easeOut });
    }
}

function destroyVideoJS() {
    if (videojsHolder != "") {
        videojsHolder.pause();
        /* for html5 - clear out the src which solves a browser memory leak */
        /* this workaround was found here: http://stackoverflow.com/questions/5170398/ios-safari-memory-leak-when-loading-unloading-html5-video */
        if (videojsHolder.techName == "html5") {
            videojsHolder.tag.src = "";
            videojsHolder.tech.removeTriggers();
            videojsHolder.load();
        }
        videojsHolder.tech.destroy(); /* destroy the parts of the player which are specific to html5 or flash */
        videojsHolder.destroy(); /* destroy the player */
        $(videojsHolder.el).remove(); /* remove the entire player from the dom */
        videojsHolder.players = { };
    }
}

function clearCustomInterval(interval) {
    if (interval != "") {
        clearInterval(interval);
        interval = "";
    }
}

function resizeImage(image, animate) {
    image.removeAttr('width');
    image.removeAttr('height');
    var ww = $(window).width() - get_OffsetWidth(),
        wh = $(window).height(),
        iw = image.width(),
        ih = image.height(),
        rw = wh / ww,
        ri = ih / iw,
        newWidth, newHeight,
        newLeft, newTop,
        properties;

    if (rw > ri) {
        newWidth = wh / ri;
        newHeight = wh;
    } else {
        newWidth = ww;
        newHeight = ww * ri;
    }
    if (animate == undefined || animate == false) {
        image.css("width", newWidth).css("height", newHeight);
    } else if (animate == true) {
        TweenMax.to(image, .6, { css: { width: newWidth, height: newHeight }, ease: Sine.easeOut });
    }
}

function rgb2hex(rgb) {
    var value = "";
    if (rgb != undefined) {
        if (($.browser.msie && ($.browser.version == "9.0" && isIE9Std() == true)) || !$.browser.msie) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            value = "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);
        } else {
            value = rgb;
        }
    }

    return value;
}

function mobileConsole(text, value, clear, displayConsole) {
    if (clear != undefined && clear == true) $("#console-log").empty();
    $("#console-log").append('<span>' + text + ' ' + value + '</span>');
    if (displayConsole == true) {
        $("#console-log").css("display", "inline");
    }
}
	/*----------------- end Utils Methods ---------------------*/
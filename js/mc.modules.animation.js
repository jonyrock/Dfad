/**
 * VERSION: 1.0
 * DATE: 2012-09-20
 *
 * @author: mediacreed, mediacreed.com, @jonyrock exclusively for dfad.us
 **/

/* start GENERAL CUSTOMIZATION PROPERTIES */
var templateBaseURL = "http://" + window.location.host + "/";
var themeColor = "#00aaff";
var initBackColor = "#3f3f3f";
//var moduleContainerMarginLeft = 308;
var moduleContainerMarginLeft = 240;
var menuActive = true;
var menuHoverActive = true;
/* it will change to false if menuActive == true. If 'menuActive'
 is false and this true than on hover it will show the menu */
var menuTextOutColor = "#FFF";

var customPageStart = true;
var customPageStartURL = "#portfolio.html";
var customPageStartSide = "none";
var customPageStartType = "full_width_gallery";

var contactFormDemo = false;

/* start ready function */
$(document).ready(function() {
    readyAndLoad++;
    
    if (readyAndLoad == 2)
        prepareTemplate();

    /* Adjustments for Safari on Mac */
    if (navigator.userAgent.indexOf('Safari') != -1 && 
        navigator.userAgent.indexOf('Mac') != -1 && 
        navigator.userAgent.indexOf('Chrome') == -1) {        
        $('html').addClass('safari-mac');
    }

});
/* end ready function */

/* start load function */
$(function() {
    readyAndLoad++;
    if (readyAndLoad == 2)
        prepareTemplate();
});
/* end load function */

/* start GENERAL JS PROPERTIES */
var readyAndLoad = 0;
var firstRun = true;
var isOverMenu = false;
var templateMenuW = 0;
var videojsHolder = "";
var touchDevice = "ontouchstart" in window;
var loadURL;
/* end GENERAL JS PROPERTIES */

var endModuleFunction = null;
var endPreviousModule = false;
var previousModuleType = "";

/*================= GENERAL TXT NAMES ==========================*/
var t_scrBarV1 = "#module-scrollbar-holder";
var t_scrBarV2 = "#module-scrollbar-holder_v2";
var txt_modCont = "#module-container #module-container-holder";

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

    $("#module-container").empty();
    $("#module-container").load(hrefPath + url + ' #module-container > *', firstRunLoaded);
}

/* on template hash change */

function onTemplateHashChange(event, runLoad) {
    var url = window.location.hash + "", oldMenuID = menuOptionID, oldSubID = submenuOptionID, disabMenu = true, tempMenuData = menuData;

    url = url.replace("#", "");
    url = url.substring(url.lastIndexOf("/") + 1);

    updateMenu(url, prevURL, undefined, true);
    oldMenuData = tempMenuData;
    if (oldMenuID != menuOptionID) {
        disabMenu = undefined;
    }
    menuData = (menuOptionsArr[menuOptionID][1] != "null") ? menuOptionsArr[menuOptionID][1] : menuOptionsArr[menuOptionID][6][submenuOptionID][1];
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
            TweenMax.to($(".main-template-loader"), .3, {
                css : {
                    opacity : "0"
                },
                ease : Sine.easeOut,
                onComplete : removeTemplateLoader
            });
            onModuleContentLoaded();
            break;
    }
}

/* menu width */

function getMenuWidth() {
    return $("#menu-container").width();
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
    //$("#menu-hider-icon").click(menuHideClick);

    $("#menu-container").css('left', -moduleContainerMarginLeft + 'px');
    $("#menu-container").css('visibility', 'visible');

    $("#menu-hider").css('display', 'inline');
    $("#menu-hider").css('visibility', 'visible');

    /*start-up animation*/
    $("#module-container").css("opacity", 1);
    $("#module-container").css("left", moduleContainerMarginLeft + "px");

    $("footer").css('display', 'inline');
    TweenMax.to($("#menu-container"), .4, {
        css : {
            left : "0px"
        },
        ease : Sine.easeInOut,
        delay : 0.5,
        onComplete : endStartupAnimation
    });
    /*end start-up animation*/

    $("#template-smpartphone-menu select").change(function() {
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

/* activate hover menu */

function activateHoverMenu() {
    $("#menu-container").bind("mouseenter", overMenu);
    $("#menu-hider-icon").bind("mouseenter", menuHiderOver);
    $("#menu-hider-icon").bind("mouseleave", menuHiderOver);
    $("#module-container").bind("mouseenter", outMenu);
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
    if (menuActive == true)
        return;
    isOverMenu = true;
    TweenMax.to($("#template-wrapper"), .4, {
        css : {
            left : "0px",
            top : "0px"
        },
        ease : Sine.easeInOut
    });
    TweenMax.to($("#menu-container"), .4, {
        css : {
            left : "0px",
            top : "0px"
        },
        ease : Sine.easeInOut
    });
    alwaysUpdate();
}

/* out menu */

function outMenu() {
    //alert("out");
    if (menuActive == true)
        return;
    isOverMenu = false;
    var winW = $(window).width(), winH = $(window).height();

    var menuWidth = parseInt($("#menu-container").css("width"), 10) - parseInt($("#menu-hider").width(), 10), menuVal = 0;
    var targetOffset = $("#menu-hider-background").width() - menuWidth;
    TweenMax.to($("#template-wrapper"), .4, {
        css : {
            left : targetOffset + "px",
            top : "0px"
        },
        ease : Sine.easeInOut
    });
    TweenMax.to($("#menu-container"), .4, {
        css : {
            left : menuVal + "px",
            top : "0px"
        },
        ease : Sine.easeInOut
    });

    alwaysUpdate()
}

/* always update */

function alwaysUpdate() {
    if (currentSlide != null)
        resizeImage(currentSlide, true);
    /* ONLY IF SLIDESHOW ACTIVE */
    if ($showModuleBackground != null)
        resizeImage($showModuleBackground, true);
    /*BACKGROUND CHECK*/

    var winW = $(window).width();
    var winH = $(window).height();
    var newModContW = winW - get_OffsetWidth();
    var newModContH = winH;
    var cModuleType = $("#template-menu").attr("data-current-module-type")

    var menuHiderH = parseInt($("#menu-container #menu-hider").height(), 10), menuHeight = winH - menuHiderH;
    newModContH = menuHeight;

    TweenMax.to($("#module-container"), .4, {
        css : {
            width : newModContW + "px",
            height : newModContH + "px"
        },
        ease : Sine.easeInOut
    });

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
        TweenMax.to(thumbsHolder, .4, {
            css : {
                marginLeft : val
            },
            easing : Sine.easeOut
        });
    }
    var slideHolder = $("#slideshow .slideshow-slide", $("#module-container"));
    if (slideHolder.length > 0) {
        $("#slideshow-captions", slideHolder).each(function() {
            $(this).css("top", (newModContH * 0.3) + "px");
            TweenMax.to($(this), .4, {
                css : {
                    width : (newModContW * 0.5) + "px"
                },
                ease : Sine.easeInOut
            });
        });
    }

    var moduleContainerHolder = $(txt_modCont);
    var modulePosition = moduleContainerHolder.attr("data-id");
    if (modulePosition == "module-position-bc" || modulePosition == "module-position-cc") {
        if (moduleContainerHolder.length > 0) {
            var value = Math.round((newModContW - $(":first", moduleContainerHolder).width()) * 0.5);
            TweenMax.to(moduleContainerHolder, .4, {
                css : {
                    left : value
                },
                easing : Sine.easeOut
            });
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
        TweenMax.to(contactModule, .4, {
            css : {
                left : (newModContW - contactModule.width()) * .5
            },
            easing : Sine.easeOut
        });
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
        TweenMax.to($("#loading-animation"), .3, {
            css : {
                right : "-104px"
            },
            delay : .3,
            ease : Circ.easeOut
        });
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
                    css : {
                        opacity : "1"
                    },
                    delay : .4,
                    ease : Sine.easeOut,
                    onComplete : function() {
                        if (isOtherURL == true) {
                            urlChanged();
                        } else {
                            startModule();
                        }
                    }
                });
                TweenMax.to($("#loading-animation"), .3, {
                    css : {
                        right : "-104px"
                    },
                    ease : Circ.easeOut
                });
            }
        } else {
            $showModuleBackground = null;
            backLoaded = false;
            if (isOtherURL == true) {
                urlChanged();
            } else {
                TweenMax.to($("#loading-animation"), .3, {
                    css : {
                        right : "-104px"
                    },
                    delay : .3,
                    ease : Circ.easeOut,
                    onComplete : startModule
                });
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
            css : {
                right : "-104px"
            },
            delay : .3,
            ease : Circ.easeOut,
            onComplete : function() {
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
            css : {
                opacity : "1",
                left : "0px"
            },
            ease : Circ.easeOut,
            onComplete : function() {
                if (isOtherURL == true) {
                    urlChanged();
                } else {
                    startModule();
                }
            }
        });
    }
}

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
        $("body").find("#module-container-old").each(function() {
            $(this).empty().remove();
        });
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
    TweenMax.to(currentSlide, .6, {
        css : {
            opacity : "1",
            left : "0px"
        },
        ease : Circ.easeOut,
        onComplete : slideshowShowThumbs
    });
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
    if (slidesArray[0][1].length != 0)
        captionAvailable = true;
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
        timerSlideshow.set({
            time : timerSec * 1000,
            autostart : false
        });
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

function stopSlideshowTimer() {
    timerSlideshow.stop();
}

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
    if (!touchDevice) {
        thumbsList = $("#slideshow-thumbs-content").McCustomList({
            scrollDirection : "horizontal",
            scrollType : "linear"
        });
        thumbsList.setupList({
            scrollContainer : $('#slideshow-thumbs-container'),
            mouseWheelSupport : "yes",
            buttonsSupport : "no",
            draggerContainer : null,
            draggerScroll : null,
            totalMinusSize : 0,
            scrollSpeed : 112,
            offsetSize : -4, /* this is the margin right of the thumbs. On the last thumbs we have this margin */
            horizFixHolder : $('.horizontal-fix-slideshow-thumbs')
        });
        $("#slideshow-thumbs-container").find(".slideshow-thumb-holder").hover(function(event) {
            if ($(this).hasClass('thumb-selected') == false) {
                customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this));
                TweenMax.to($("img", this), .6, {
                    css : {
                        borderColor : themeColor
                    },
                    ease : Circ.easeOut
                });
            }
        }, function(event) {
            var color = '#ffffff';
            if ($(this).hasClass('thumb-selected') == false) {
                customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this));
                TweenMax.to($("img", this), .6, {
                    css : {
                        borderColor : color
                    },
                    ease : Circ.easeOut
                });
            }
        });
        var instanceArr = $(".slideshow-thumbs-arrow-backward .slideshow-thumbs-arrow-backg");
        var initOpacity = instanceArr.css("opacity");
        var initBackColor = rgb2hex(instanceArr.css("background-color"));
        var bothArrows = $(".slideshow-thumbs-arrow-backward, .slideshow-thumbs-arrow-forward");
        var thumbArrBack = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-backward");
        var thumbArrForw = $("#slideshow-thumbs-holder .slideshow-thumbs-arrow-forward");
        bothArrows.unbind('mouseenter mouseleave');
        bothArrows.hover(function() {
            TweenMax.to($(".slideshow-thumbs-arrow-backg", this), 0.3, {
                css : {
                    opacity : "1",
                    backgroundColor : themeColor
                },
                easing : Sine.easeOut
            });
        }, function() {
            TweenMax.to($(".slideshow-thumbs-arrow-backg", this), 0.3, {
                css : {
                    opacity : initOpacity,
                    backgroundColor : initBackColor
                },
                easing : Sine.easeOut
            });
        });
        thumbArrBack.unbind("click");
        thumbArrForw.unbind("click");
        thumbArrForw.click(function() {
            if (thumbsList != null)
                thumbsList.listAutoScroll(-1);
        });
        thumbArrBack.click(function() {
            if (thumbsList != null)
                thumbsList.listAutoScroll(1);
        });
    } else {
        if (touchDevice) {
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
        if (slideshowCurrID == index)
            return;
        slideshowPrevID = slideshowCurrID;
        slideshowCurrID = index;
        if (timerSlideshow != null)
            timerSlideshow.stop();
        $(spanEmpty).empty().append((index + 1) + '/' + total);
        changeThumbsSelection(this);
        stopOrHidePrevCaptions();
    });
    var thumbsHolder = $('#slideshow-thumbs');
    var val = -Math.abs(thumbsHolder.width() - get_OffsetWidth()) / 2;
    thumbsHolder.attr("style", "margin-left:" + val + "px; bottom: -84px; visibility: visible;");
    if (touchDevice) {
        $('.horizontal-fix-slideshow-thumbs').css("width", 999999);
        $('#slideshow-thumbs-container').css("width", $('#slideshow-thumbs-container').width());
        $('.horizontal-fix-slideshow-thumbs').css("width", '');
        $("#slideshow-thumbs-content").css("overflow", "auto");
        $("#slideshow-thumbs-content").css("-webkit-overflow-scrolling", "touch");
    }
    startTimer();
    initialThumbContW = $("#slideshow-thumbs-content").width();
    moduleUpdate_slideshow();
    TweenMax.to(thumbsHolder, .6, {
        css : {
            bottom : "4px"
        },
        delay : 0.6,
        ease : Circ.easeOut,
        onComplete : checkCaption
    });
}

var initialThumbContW = 0;

function changeThumbsSelection(cThumb) {
    oldThumb = $('#slideshow-thumbs-container .thumb-selected');
    var color = "#ffffff";
    if (oldThumb.length > 0) {
        oldThumb.removeClass('thumb-selected');
        TweenMax.to($("#thumb-image-hover", oldThumb), .3, {
            css : {
                left : "-100%",
                top : "0%"
            },
            ease : Sine.easeInOut
        });
        TweenMax.to($('img', oldThumb), .6, {
            css : {
                borderColor : color
            },
            ease : Circ.easeOut
        });
    }
    currentThumb = $(cThumb);
    if (currentThumb.hasClass('thumb-selected') == false) {
        currentThumb.addClass('thumb-selected');
        TweenMax.to($("#thumb-image-hover", currentThumb), .3, {
            css : {
                left : "0",
                top : "0%"
            },
            ease : Sine.easeInOut
        });
        TweenMax.to($('img', currentThumb), .6, {
            css : {
                borderColor : themeColor
            },
            ease : Circ.easeOut
        });
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
    if (currentSlide.css("style") != undefined)
        currentSlide.removeAttr('style');

    currentSlide.attr("style", "z-index: 2; display:list-item; left: 0px; visibility: visible;");
    resizeImage(currentSlide);
    currentSlide.css("opacity", "0");
    var parentCur = currentSlide.parent(currentSlide);
    parentCur.css("position", "absolute").css("z-index", "2");
    TweenMax.to(currentSlide, .6, {
        css : {
            opacity : "1"
        },
        ease : Sine.easeOut,
        onComplete : completeSlideTransition
    });
}

function completeSlideTransition() {
    var i = 0;
    var total = slidesArray.length;
    for ( i = 0; i < total; i++) {
        if (i != slideshowPrevID && i != slideshowCurrID)
            slidesArray[i][0].attr("style", "display:none; opacity: 0; visibility: hidden;");
    }
    if (oldSlide != '')
        oldSlide.attr("style", "display:none; opacity: 0; visibility: hidden;");
    checkCaption();
}

var showingInProgress = 0;

function checkCaption() {
    if (showingInProgress == 1)
        return;
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
        for ( i = 0; i < total; i++) {
            var obj = slidesArray[slideshowCurrID][1][i];
            obj.css('width', '');
            var width = slidesArray[slideshowCurrID][2][i] + 10;
            var topY = i * 45;
            var val = (i == total - 1) ? windowW * .5 : -(width + windowW * .5);
            var styleValue = "top:" + topY + "px; left:" + val + "px; display:inline-block; opacity:1;";
            obj.attr("style", styleValue);
            if (i == total - 1) {
                TweenMax.to(obj, 5, {
                    css : {
                        left : -(width + windowW * .5) + 'px'
                    },
                    ease : SlowMo.ease.config(0.7, 0.96),
                    onComplete : resetShowing
                });
            } else {
                TweenMax.to(obj, 5, {
                    css : {
                        left : windowW * .5 + 'px'
                    },
                    ease : SlowMo.ease.config(0.7, 0.96)
                });
            }
        }
    }
}

function resetShowing() {
    showingInProgress = 0;
    if (slidesArray[slideshowCurrID][1].length != 0) {
        var i = 0;
        var total = slidesArray[slideshowCurrID][1].length;
        for ( i = 0; i < total; i++) {
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
        for ( i = 0; i < total; i++) {
            var width = slidesArray[slideshowPrevID][2][i];
            var topY = windowH * .3 + i * 45;
            var obj = slidesArray[slideshowPrevID][1][i];
            if (i == total - 1) {
                TweenMax.to(obj, .2, {
                    css : {
                        left : -(width + windowW * .5) + 'px',
                        opacity : "0"
                    },
                    ease : Sine.easeOut,
                    onComplete : runOtherSlide
                });
            } else {
                TweenMax.to(obj, .2, {
                    css : {
                        left : windowW * .5 + 'px',
                        opacity : "0"
                    },
                    ease : Sine.easeOut
                });
            }
        }
    } else {
        changeSlideshowSlides(slideshowPrevID, slideshowCurrID);
    }
}

function runOtherSlide() {
    changeSlideshowSlides(slideshowPrevID, slideshowCurrID);
}

/*================= HOME 2 ================================*/
var stdCurrIndex = 0;
var stdPrevIndex = 0;

function moduleHome2() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-home-layout2", textPageInstanceHolder);
    if (textPageInstance.length <= 0)
        return;

    moduleUpdate_home2();

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.attr("style", "left: 100%; visibility: visible;");
    TweenMax.to(textPageInstanceHolder, .6, {
        css : {
            left : val
        },
        ease : Circ.easeOut
    });

    var slidesBannArray = [];
    var stdBannCont = $("#standard-banner-controls");
    var controlPin = $("#control-pin", stdBannCont);
    var controlPinArr = [];
    var i = 0;
    stdBannCont.css("margin-left", -(stdBannCont.width() * .5));

    $("#standard-banner").find("a").each(function() {
        var dataSrc = $("#dataSrc", this);
        if (dataSrc.length > 0) {
            var imgTag = '<img src="' + dataSrc.attr("data-src") + '" />';
            dataSrc.after(imgTag).remove();
        }
        slidesBannArray[i] = $(this)
        i++;
    });
    i = 0;
    stdBannCont.find("#control-pin").each(function() {
        controlPinArr[i] = $(this)
        i++;
    });

    controlPin.hover(function() {
        if ($(this).hasClass("selected") == false)
            TweenMax.to($(".control-pin-hover", this), .3, {
                css : {
                    opacity : "1"
                },
                easing : Sine.easeOut
            });
    }, function() {
        if ($(this).hasClass("selected") == false)
            TweenMax.to($(".control-pin-hover", this), .3, {
                css : {
                    opacity : "0"
                },
                easing : Sine.easeOut
            });
    });

    controlPin.click(function() {
        stdPrevIndex = stdCurrIndex;
        stdCurrIndex = $(controlPin).index(this);
        if (stdCurrIndex == stdPrevIndex)
            return;
        controlPinArr[stdPrevIndex].removeClass("selected");
        controlPinArr[stdCurrIndex].addClass("selected");
        TweenMax.to($(".control-pin-hover", controlPinArr[stdPrevIndex]), .3, {
            css : {
                opacity : "0"
            },
            easing : Sine.easeOut
        });
        TweenMax.to($(".control-pin-hover", controlPinArr[stdCurrIndex]), .3, {
            css : {
                opacity : "1"
            },
            easing : Sine.easeOut
        });
        changeHome2Slides();
    });

    function changeHome2Slides() {
        slidesBannArray[stdCurrIndex].attr("class", "selected opacity_0");
        TweenMax.to(slidesBannArray[stdPrevIndex], .6, {
            css : {
                opacity : "0"
            },
            easing : Sine.easeOut,
            onComplete : function() {
                hideOtherBannerSlides();
            }
        });
        TweenMax.to(slidesBannArray[stdCurrIndex], .6, {
            css : {
                opacity : "1"
            },
            easing : Sine.easeOut
        });
    }

    function hideOtherBannerSlides() {
        var i = 0;
        var t = slidesBannArray.length;
        for ( i = 0; i < t; i++) {
            if (i != stdCurrIndex)
                slidesBannArray[i].attr("class", "");
        }
    }

    var clients = $(".home-layout-clients a");
    if (clients.length > 0) {
        clients.hover(function() {
            TweenMax.to($(".client-over", this), .6, {
                css : {
                    opacity : "1"
                },
                easing : Sine.easeOut
            });
        }, function() {
            TweenMax.to($(".client-over", this), .6, {
                css : {
                    opacity : "0"
                },
                easing : Sine.easeOut
            });
        });
    }
    var contentLi = $(".home-layout2-content ul li");
    var baseColor = rgb2hex($(".layout2-description p", contentLi).css("color"));
    if (!touchDevice)
        if (contentLi.length > 0) {
            contentLi.hover(function() {
                TweenMax.to($(".layout2-description p", this), .6, {
                    css : {
                        color : themeColor
                    },
                    easing : Sine.easeOut
                });
                TweenMax.to($("div:first", this), 0.3, {
                    css : {
                        top : "-5px"
                    },
                    easing : Sine.easeOut
                });
            }, function() {
                TweenMax.to($(".layout2-description p", this), .6, {
                    css : {
                        color : baseColor
                    },
                    easing : Sine.easeOut
                });
                TweenMax.to($("div:first", this), 0.3, {
                    css : {
                        top : "0px"
                    },
                    easing : Sine.easeOut
                });
            });
        }
}

function animateBannerHome2(img) {
    TweenMax.to(img, 0.4, {
        css : {
            opacity : "1"
        },
        easing : Sine.easeOut
    });
}

/*================= END HOME 2 ============================*/

/*================= HOME 3 ================================*/
var homeInterval = "";

function moduleHome3() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-home-layout3", textPageInstanceHolder);
    var modWrapper = $("#module-wrapper", textPageInstance);
    if (textPageInstance.length <= 0)
        return;

    moduleUpdate_home3();

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.css("left", "100%").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .6, {
        css : {
            left : val
        },
        ease : Circ.easeOut
    });

    var homeLayoutVideo = $("#video-wrapper", textPageInstanceHolder);
    templateAddMediaVideo(homeLayoutVideo.attr("data-video-type"), homeLayoutVideo, undefined);

    $("#home-advertise1, #home-advertise2", textPageInstanceHolder).hover(function() {
        var back = $(".advertise-details", this);
        TweenMax.to(back, .3, {
            css : {
                backgroundColor : "#3f3f3f"
            },
            ease : Sine.easeOut
        });
        TweenMax.to($("span", back), .3, {
            css : {
                color : "#f1f1f1"
            },
            ease : Sine.easeOut
        });
    }, function() {
        var back = $(".advertise-details", this);
        TweenMax.to(back, .3, {
            css : {
                backgroundColor : "#f1f1f1"
            },
            ease : Sine.easeOut
        });
        TweenMax.to($("span", back), .3, {
            css : {
                color : "#0c0c0c"
            },
            ease : Sine.easeOut
        });
    });

    var clients = $(".home-layout-clients a");
    if (clients.length > 0) {
        clients.hover(function() {
            TweenMax.to($(".client-over", this), .6, {
                css : {
                    opacity : "1"
                },
                easing : Sine.easeOut
            });
        }, function() {
            TweenMax.to($(".client-over", this), .6, {
                css : {
                    opacity : "0"
                },
                easing : Sine.easeOut
            });
        });
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
    if (endPreviousModule == true)
        return;
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

    if (!touchDevice) {
        var totalMinusSize = 0;
        var activScrollbar = availScrollbar.length;
        if (pModH >= cConH) {
            if (availScrollbar.length > 0 && availScrollbar.css("display") != "none") {
                TweenMax.to(availScrollbar, .6, {
                    css : {
                        opacity : "0"
                    },
                    ease : Quad.easeOut,
                    onComplete : function() {
                        availScrollbar.css("display", "none");
                    }
                });
            }
            if (moduleList != null) {
                moduleList.destroy();
                moduleList = null;
            }
            if (noRepos == true)
                return;
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
                    TweenMax.to(cCon, .3, {
                        css : {
                            top : "0px"
                        },
                        ease : Sine.easeOut
                    });
                } else {
                    cCon.css("top", "0px");
                }
            }
            if (mPos == "module-position-bc" || mPos == "module-position-cc") {
                var value = Math.round((($("#module-container").width() - pConW) * .5 /*+ get_OffsetWidth()*/));
                if (anim == true) {
                    TweenMax.to(pMod, .6, {
                        css : {
                            left : value + "px"
                        },
                        ease : Sine.easeOut
                    });
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
                TweenMax.to(availScrollbar, .6, {
                    css : {
                        opacity : "1"
                    },
                    ease : Quad.easeOut
                });
            }
            if (moduleList == null) {
                moduleList = pMod.McCustomList({
                    scrollDirection : "vertical",
                    scrollType : "linear"
                });
                moduleList.setupList({
                    scrollContainer : cCon,
                    mouseWheelSupport : "yes",
                    buttonsSupport : "no",
                    draggerContainer : availScrollbar,
                    draggerScroll : $("#module-scrollbar-dragger", availScrollbar),
                    totalMinusSize : totalMinusSize,
                    scrollSpeed : 100,
                    offsetSize : 0,
                    horizFixHolder : null,
                    customStartPos : custStartPos
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
                    TweenMax.to(pMod, .6, {
                        css : {
                            left : value + "px"
                        },
                        ease : Sine.easeOut
                    });
                } else {
                    pMod.css("left", value + "px");
                }
            }
        }
    } else {
        pCon.css("overflow", "auto").css("-webkit-overflow-scrolling", "touch");
        var menuWidth = $("#menu-container").width();
        var maxPossibleWidth = winW - menuWidth;
        if (cConW > maxPossibleWidth) {
            pCon.css("width", maxPossibleWidth + "px");
        } else {
            //TODO: do it in a better way
            if (cCon.attr("id") == "module-galleries-holder")
                pCon.css("left", ((maxPossibleWidth - cConW) / 2) + "px");
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
    if (textPageInstance.length <= 0)
        return;
    endModuleFunction = endModuleTextPage;

    switch (modulePositionType) {
        case "module-position-lb":
            break;
        case "module-position-lc":
            var val = (-moduleWidth) + "px";
            moduleUpdate(textPageInstance, modWrapper, $("div:first", modWrapper), sideType);
            textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " left:" + val + "; visibility: visible;");
            TweenMax.to(textPageInstanceHolder, .6, {
                css : {
                    left : "0px"
                },
                ease : Circ.easeInOut,
                onComplete : moduleUpdate_text_page
            });
            /*get_OffsetWidth() +*/
            break;
        case "module-position-bc":
            moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
            var val = parseInt(textPageInstance.css("top"), 10) + "px";
            textPageInstanceHolder.css("top", moduleHeight).css("visibility", "visible");
            TweenMax.to(textPageInstanceHolder, .6, {
                css : {
                    top : "0px"
                },
                ease : Circ.easeInOut,
                onComplete : moduleUpdate_text_page
            });
            break;
        case "module-position-rc":
            textPageInstanceHolder.css("position", "fixed");
            moduleUpdate(textPageInstance, modWrapper, $("div:first", modWrapper), sideType);
            var val = (-moduleWidth) + "px";
            textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " position: fixed; right:" + val + "; visibility: visible;");
            TweenMax.to(textPageInstanceHolder, .6, {
                css : {
                    right : "0px"
                },
                ease : Circ.easeInOut,
                onComplete : moduleUpdate_text_page
            });
            break;
        case "module-position-cc":
            moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
            var val = parseInt(textPageInstanceHolder.css("left"), 10);
            textPageInstanceHolder.attr("style", getElementStyle(textPageInstanceHolder) + " left: 100%; visibility: visible;");

            TweenMax.to(textPageInstanceHolder, .6, {
                css : {
                    left : val
                },
                ease : Circ.easeOut,
                onComplete : moduleUpdate_text_page
            });
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
            TweenMax.to(textPageInstance, .6, {
                css : {
                    left : val
                },
                ease : Circ.easeInOut,
                onComplete : endModuleComplete
            });
            break;
        case "module-position-bc":
            TweenMax.to(textPageInstance, .6, {
                css : {
                    top : moduleHeight + "px"
                },
                ease : Circ.easeInOut,
                onComplete : endModuleComplete
            });
            break;
        case "module-position-rc":
            var val = (-moduleWidth) + "px";
            TweenMax.to(textPageInstance, .6, {
                css : {
                    right : val
                },
                ease : Circ.easeInOut,
                onComplete : endModuleComplete
            });
            break;
        case "module-position-cc":
            var val = $(window).width() + get_OffsetWidth() + "px";
            TweenMax.to(textPageInstance, .6, {
                css : {
                    left : val
                },
                ease : Circ.easeInOut,
                onComplete : endModuleComplete
            });
            break;
    }
    endModuleFunction = null;
}

function endModuleComplete() {
    endPreviousModule = false;
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
    if (touchDevice) {
        if (showreelVideo.children().length > 0) {
            tempVid = $("div:first", showreelVideo);
            media.empty();
            media.append(tempVid);

        }
        showreelVideo = $("#video-wrapper", textPageInstanceHolder);
    }
    showreelVideo.empty();
    if (showreelVideo.length > 0)
        templateAddMediaVideo(showreelVideo.attr("data-video-type"), showreelVideo, undefined)

    TweenMax.to(textPageInstance, .4, {
        css : {
            width : moduleWidth + "px"
        },
        ease : Quad.easeOut
    });
    endModuleFunction = endModuleShowreel;
    moduleEnd = true;
}

function endModuleShowreel() {
    var textPageInstance = $("#module-showreel");
    var moduleWidth = textPageInstance.width();
    TweenMax.to(textPageInstance, .6, {
        css : {
            width : "0px"
        },
        ease : Quad.easeInOut,
        onComplete : function() {
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
    if (touchDevice) {
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
    TweenMax.to(textPageInstance, .4, {
        css : {
            width : moduleWidth + "px"
        },
        ease : Quad.easeOut
    });
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
    TweenMax.to(textPageInstance, .6, {
        css : {
            opacity : "1"
        },
        ease : Circ.easeOut
    });

    var fullscreenVideo = $("#video-wrapper", textPageInstanceHolder);
    if (fullscreenVideo.length > 0) {
        fullscreenVideo.attr("data-width", width);
        fullscreenVideo.attr("data-height", height);

        var media = $("#fullscreen-video-holder", textPageInstance);
        if (touchDevice) {
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

    if (textPageInstance.length <= 0)
        return;

    var moduleWidth = textPageInstanceHolder.width();
    var moduleHeight = textPageInstanceHolder.height();
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    var val = parseInt(textPageInstanceHolder.css("left"), 10);
    textPageInstanceHolder.css("left", "100%").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .5, {
        css : {
            left : val
        },
        delay : 0.1,
        ease : Circ.easeOut
    });

    $("#pricing-column-holder", textPageInstance).hover(function() {
        $(this).css('z-index', 2);
        if ($.browser.msie) {
            if ($.browser.version != "8.0" && ($.browser.version == "9.0" && isIE9Std() == true))
                if ($(this).hasClass("shadow-side-all-pricing-tables") == false)
                    $(this).addClass("shadow-side-all-pricing-tables");
        } else {
            if ($(this).hasClass("shadow-side-all-pricing-tables") == false)
                $(this).addClass("shadow-side-all-pricing-tables");
        }
        TweenMax.to($("div:first", this), .4, {
            css : {
                backgroundColor : themeColor
            },
            ease : Sine.easeOut
        });
    }, function() {
        $(this).css('z-index', 1);
        if ($.browser.msie) {
            if ($.browser.version != "8.0" && ($.browser.version == "9.0" && isIE9Std() == true))
                if ($(this).hasClass("shadow-side-all-pricing-tables") == true)
                    $(this).removeClass("shadow-side-all-pricing-tables");
        } else {
            if ($(this).hasClass("shadow-side-all-pricing-tables") == true)
                $(this).removeClass("shadow-side-all-pricing-tables");
        }
        TweenMax.to($("div:first", this), .4, {
            css : {
                backgroundColor : "#909090"
            },
            ease : Sine.easeOut
        });
    });
    $("#pricing-column-holder #pricing-buy-holder", textPageInstance).hover(function() {
        TweenMax.to($(this), .4, {
            css : {
                backgroundColor : themeColor
            },
            ease : Sine.easeOut
        });
    }, function() {
        TweenMax.to($(this), .4, {
            css : {
                backgroundColor : "#3F3F3F"
            },
            ease : Sine.easeOut
        });
    });
}

function customHoverAnimation(type, event, parent, child) {
    var directionCSS = getDirectionCSS(parent, {
        x : event.pageX,
        y : event.pageY
    });
    if (type == "over") {
        child.removeClass();
        child.css("left", directionCSS.from.val1);
        child.css("top", directionCSS.from.val2);
        TweenMax.to(child, .3, {
            css : {
                left : directionCSS.to.val1,
                top : directionCSS.to.val2
            },
            ease : Sine.easeInOut
        });
    } else if (type == "out") {
        TweenMax.to(child, .3, {
            css : {
                left : directionCSS.from.val1,
                top : directionCSS.from.val2
            },
            ease : Sine.easeInOut
        });
    }
}

/*----------------- end Modules Methods -------------------*/

/*----------------- start footerListeners -----------------*/

function footerListeners() {
    $("#footer-social").find("#footer-social-holder").find("a").each(function() {
        var aTitle = $("img", this).attr("title");
        $(this).hover(function() {
            $("#footer-social-tooltip").css("opacity", "0");
            $("#footer-social-tooltip").css("display", "inline");
            $("#footer-social-tooltip").css("visibility", "visible");
            $("#footer-social-tooltip").empty();
            $("#footer-social-tooltip").append('<span>' + aTitle + '</span>');
            TweenMax.to($("#footer-social-tooltip"), .6, {
                css : {
                    opacity : "1"
                },
                ease : Circ.easeOut
            });
        }, function() {
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
        TweenMax.to(loadAnim, .3, {
            css : {
                right : "0px"
            },
            delay : delayAnimationLoading,
            ease : Circ.easeOut,
            onComplete : doLoad
        });
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
        if (modGallPrev.length > 0) {
            modGallPrev.remove();
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
                showModuleInterval = setInterval(function() {
                    if (menuData[2] == oldMenuData[2]) {
                        clearCustomInterval(showModuleInterval);
                        loadedContent = true;
                        var loadAnim = $("#loading-animation");
                        if (loadAnim.length > 0) {
                            TweenMax.to(loadAnim, .3, {
                                css : {
                                    right : "-104px"
                                },
                                ease : Circ.easeOut
                            });
                        }
                        return;
                    }
                    setMenuData(menuData);
                    var containerStyle = $("#module-container").attr("style");
                    if (containerStyle == undefined)
                        containerStyle = "";
                    $("#module-container").attr("id", "module-container-old").attr("style", containerStyle);
                    $("#load-container").css("visibility", "hidden").attr('id', 'module-container').attr("style", containerStyle);
                    $("#module-container-old").after($("#module-container"));
                    onModuleContentLoaded();
                    $("#template-wrapper").after('<div id="load-container"></div>');
                    //.css("left", get_OffsetWidth() + "px" )
                    showModule();
                    clearCustomInterval(showModuleInterval);
                }, 50);
            }

            break;
    }
}

function onModuleContentLoaded() {
    // add scrollbar if there is not
    if ($("#module-container #module-scrollbar-holder_v2").length == 0) {
        $("#module-container").append('<div id="module-scrollbar-holder_v2"><div id="module-scrollbar-background" class="opacity_8"></div><div id="module-scrollbar-dragger"></div></div>');
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

function animateMedia(img) {
    TweenMax.to(img, 0.4, {
        css : {
            opacity : "1"
        },
        easing : Sine.easeOut
    });
}

function templateAddMediaVideo(videoType, elem, elemParent) {
    var id = elem.attr("id");
    var url = (videoType != "standalone") ? url = elem.attr("data-url") : "";
    var parent = (elemParent == undefined) ? elem : elemParent;
    var videoEmbedCode = "";
    if (videoType == "standalone") {
        videoEmbedCode += '<video id="standalone-wrapper" class="video-js vjs-default-skin" controls preload="none" width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '"' + 'poster="' + elem.attr("data-poster") + '">';
        for (var i = 1; i <= 3; i++) {
            videoEmbedCode += '<source src="' + $(elem).attr("data-url" + i) + '" type="' + $(elem).attr("data-type" + i) + '" />';
        }
        videoEmbedCode += '</video>';
    } else if (videoType != "standalone") {
        videoEmbedCode += '<iframe src="' + url + '" width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '" frameborder="0" allowfullscreen="" mozallowfullscreen="" webkitallowfullscreen=""></iframe>';
        if ($.browser.msie && videoType == "youtube") {
            if ($.browser.version == "8.0" || ($.browser.version == "9.0" && isIE9Std() == false)) {
                url = url.replace("http://www.youtube.com/embed/", "http://www.youtube.com/v/");
                videoEmbedCode = '<object width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '">' + '<param name="movie" value="' + url + '?fs=1&enablejsapi=1"></param>' + '<param name="allowFullScreen" value="true"></param>' + '<param name="allowScriptAccess" value="always"></param>' + '<embed id="ytplayer" src="' + url + '?fs=1&enablejsapi=1"' + 'type="application/x-shockwave-flash"' + 'allowfullscreen="true"' + 'allowscriptaccess="always"' + 'width="' + elem.attr("data-width") + '" height="' + elem.attr("data-height") + '">' + '</embed>' + '</object>';
            }
        }
    }
    parent.append(videoEmbedCode);
    destroyVideoJS();
    parent.css("opacity", "0").css("visibility", "visible");
    if (videoType == "standalone") {
        var ready = false;
        videojsHolder = _V_("standalone-wrapper", {}, function() {
            if (ready == false) {
                ready = true;
                TweenMax.to([$("#standalone-wrapper"), parent], .6, {
                    css : {
                        opacity : "1"
                    },
                    ease : Circ.easeOut
                });
            }
        });
    } else {
        TweenMax.to(parent, .6, {
            css : {
                opacity : "1"
            },
            ease : Circ.easeOut
        });
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
        videojsHolder.tech.destroy();
        /* destroy the parts of the player which are specific to html5 or flash */
        videojsHolder.destroy();
        /* destroy the player */
        $(videojsHolder.el).remove();
        /* remove the entire player from the dom */
        videojsHolder.players = {};
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
    var ww = $(window).width() - get_OffsetWidth(), wh = $(window).height(), iw = image.width(), ih = image.height(), rw = wh / ww, ri = ih / iw, newWidth, newHeight, newLeft, newTop, properties;

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
        TweenMax.to(image, .6, {
            css : {
                width : newWidth,
                height : newHeight
            },
            ease : Sine.easeOut
        });
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
    if (clear != undefined && clear == true)
        $("#console-log").empty();
    $("#console-log").append('<span>' + text + ' ' + value + '</span>');
    if (displayConsole == true) {
        $("#console-log").css("display", "inline");
    }
}

/*----------------- end Utils Methods ---------------------*/

/* menu hadlers */
function menuOptionClicked(val, mType, sType, hrefPath) {
    
    if (val === "#") 
        return;
    
    var url = '';
    if ($("#template-menu").attr("data-current-module-type") == "slideshow") {
        deleteSlideshowTimer();
    }
    currModuleType = mType;
    sideType = sType;
    hrefPath = (hrefPath == undefined) ? "" : hrefPath;
    url = templateBaseURL + hrefPath + val.replace('#', '');

    if (prevURL == '') {
        prevURL = url;
    } else {
        prevURL = loadURL;
    }
    loadURL = url;

    stopCurrentLoading();
    if (endModuleFunction !== null && loadedContent)
        endModuleFunction();

    if (menuData[2] != oldMenuData[2]) {
        loadedContent = true;
        activateAnimationLoading();
    } else {
        loadedContent = true;
        var loadAnim = $("#loading-animation");
        if (loadAnim.length > 0) {
            TweenMax.to(loadAnim, .25, {
                css : {
                    right : "-104px"
                },
                ease : Circ.easeOut
            });
        }
        if (endModuleFunction == null) {
            switch (menuData[0]) {
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

function updateMenu(currentURL, prevURL, sameURLParent, animate) {
    currentURL = currentURL.replace("#", "");
    prevURL = prevURL.replace("#", "");

    var returnURL = "", i = 0, j = 0, tempMenuID = 0, tempSubmID = 0, idx = menuOptionsArr.length;

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


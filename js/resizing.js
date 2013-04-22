function moduleUpdate_slideshow() {
    var winW = $(window).width();
    if ($("#slideshow-thumbs-content").length > 0) {
        var thumbHolder = $("#slideshow-thumbs");
        if (winW >= 768 && winW <= 1024) {
            $("#slideshow-thumbs-content").css("width", initialThumbContW + "px");
        } else {
            var thumbCont = $("#slideshow-thumbs-content");
            var thumbW = $(".slideshow-thumb-holder").width() + parseInt($(".slideshow-thumb-holder").css("margin-right"), 10);

            if (thumbHolder.width() > winW) {
                $("#slideshow-thumbs-content").css("width", (thumbCont.width() - thumbW) + "px");
            } else if (thumbHolder.width() + thumbW <= winW) {
                if (thumbCont.width() + thumbW <= initialThumbContW) thumbCont.css("width", (thumbCont.width() + thumbW) + "px");
            }
        }
        thumbHolder.css("margin-left", ($("#module-container").width() - thumbHolder.width()) * .5);
        if (thumbsList != null) thumbsList.updateCustomList();
    }
    var slideHolder = $("#slideshow .slideshow-slide");
    if (slideHolder.length > 0) {
        $("#slideshow-captions", slideHolder).each(function () {
            $(this).css("top", ($(window).height() * 0.3) + "px");
            $(this).css("left", ($("#module-container").width() * 0.5) + "px");
        });
    }
}

function moduleUpdate_home2() {
    var winW = $(window).width();
    var li = ".home-layout2-content ul li";
    var mH = "#module-home-layout2";
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $(mH, textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    if (winW > 1200) {
        $(mH).css("width", "");
        $(li).attr("style", "");
        $(li + ":nth-child(4n+4)").css("margin-right", "0px");
    } else if (winW > 1024 && winW <= 1200) {
        $(mH).css("width", "800");
        $(li).attr("style", "").attr("style", " margin-right: 20px; width: 162px;");
        $(li + ":nth-child(4n+4)").css("margin-right", "0px");
    } else if (winW >= 768 && winW <= 1024) {
        $(mH).css("width", "570");
        $(li).attr("style", "");
        $(li + ":nth-child(2n+2)").css("margin-right", "0px");
    } else if (winW < 768) {
        $(mH).css("width", "510");
        $(li).attr("style", "");
        $(li + ":nth-child(2n+2)").css("margin-right", "0px");
    }
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_home3() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-home-layout3", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_text_page() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_showreel() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-showreel", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_fullscreen_video(animate) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-fullscreen-video", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    var width = $(window).width() - get_OffsetWidth();
    var height = $(window).height();
    var standalone = $("#standalone-wrapper", textPageInstance);
    if (standalone.length > 0) {
        TweenMax.to([standalone, textPageInstance], .6, { css: { width: width, height: height }, easing: Sine.easeOut });
    } else {
        TweenMax.to(textPageInstance, .6, { css: { width: width, height: height }, easing: Sine.easeOut });
    }
}

function moduleUpdate_pricing_tables() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-pricing", textPageInstanceHolder);
    if (textPageInstance.length <= 0) return;
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_full_width(animate) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width", textPageInstanceHolder);
    var modWrapper = $("#module-wrapper", textPageInstance);
    if (textPageInstance.length <= 0) return;
    var currWindowW = $(window).width() - get_OffsetWidth();
    if (touchDevice) {
        currWindowW = $(window).width() - templateMenuW;
    }

    var tempWidth = textPageInstance.width();
    textPageInstance.css("width", currWindowW);

    if ($("#module-full-width-holder-text", modWrapper).height() > $(window).height() && !touchDevice) {
        currWindowW = currWindowW - $(t_scrBarV2).width();
    }

    if (animate == undefined || animate == false) {
        textPageInstance.css("width", currWindowW);
        moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
    } else {
        if (tempWidth == currWindowW) {
            textPageInstance.css("width", currWindowW);
        } else {
            TweenMax.to(textPageInstance, .3, {
                css: { width: currWindowW },
                easeing: Sine.easeOut,
                onComplete:
                    function () {
                        moduleUpdate(textPageInstanceHolder, modWrapper, $("div:first", modWrapper), sideType);
                    }
            });
        }
    }
    
}

function moduleUpdate_news() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-news-vertical", textPageInstanceHolder);
    var newsPreviewContainer = $(newsPrvU, textPageInstance);
    if (previewNewsOpen == true) {
        var i = 0;
        for (i; i < totalPreviews; i++) {
            if (i != previewNewsIndex) {
                newsPrevItemArr[i].css("display", "none");
            }
        }

        moduleUpdate(textPageInstanceHolder, $("#module-news-preview-holder", textPageInstance), $("#module-news-preview-container", textPageInstance), "custom", 0);
        if (touchDevice) {
            $("#module-news-preview-container", textPageInstance).css("height", "");
            $("#module-news-preview-container", textPageInstance).css("height", $("#module-news-preview-container", textPageInstance).height());
        }
        newsPreviewItemDisplay("inline");
    } else {
        moduleUpdate(textPageInstanceHolder, $("#module-news-vertical"), $("#module-news-vertical div:first"), sideType);
    }
}

function moduleUpdate_contact() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    var blocksWidthPersent = 0;
    if($(textPageInstance).width() <= 1024){
        blocksWidthPersent = 30;
    } else {
        blocksWidthPersent = 15;
    } if($(textPageInstance).width() <= 794){
        blocksWidthPersent = 38;
    } if($(textPageInstance).width() <= 400){
        blocksWidthPersent = 80;
    } 
    
    //alert(blocksWidthPersent);
    textPageInstance.find(".module-contact-holder").css("width",blocksWidthPersent+"%");
    
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
}

function moduleUpdate_gallery() {

    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    var galleryHolder = $("#module-galleries-holder", textPageInstance);

    if (textPageInstance.length <= 0) return;

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
    visibleGalleryH = visibleHeight;
    galleryColumns = numberColumns;
    galleryLines = numberLines;

    $(".thumb-holder", galleryHolder).css("margin-right", "");
    $(".thumb-holder" + ":nth-child(" + galleryColumns + "n+" + galleryColumns + ")", galleryHolder)
        .css("margin-right", "0px");

    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
    if (previewGalleryOpen == true) {
        updatePreviewMediaPosition();
    }
}

function moduleUpdate_full_width_gallery() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    var modulePositionType = textPageInstanceHolder.attr("data-id");
    if (textPageInstance.length > 0) {
        if (initialThumbW <= 0) return;
        checkItems();
        moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
    }
    if (previewFullWidthOpen == true) {
        updateFullWidthPreviewPosition();
    }
}

$(window).resize(
    function () {
        /*SLIDESHOW CHECK*/
        if (currentSlide != null) resizeImage(currentSlide);
        /*BACKGROUND CHECK*/
        if ($showModuleBackground != null) resizeImage($showModuleBackground);

        var scrollbarV1 = $("#module-container #module-scrollbar-holder");
        var scrollbarV2 = $("#module-container #module-scrollbar-holder_v2");
        var availScrollbar = (scrollbarV1.length > 0) ? scrollbarV1 : scrollbarV2;
        var winW = $(window).width();
        var winH = $(window).height();
        var menuHiderH = parseInt($("#menu-container #menu-hider").height(), 10);
        
        var menW = getMenuWidth();
        var menH = getMenuHeight();

        $("#module-container")
        .css("width", (winW - menW) + "px")
        .css("top", "0px")
        .css("left", menW + "px")
        .css("height", "100%");

        if (firstRun == false) $("footer").css('display', 'inline').css('visibility', 'visible');
        if (availScrollbar.length > 0) {
            availScrollbar.css("height", winH).css("top", "0px");
        }
        if (menuActive == false) {
            var menuHider = ($("#menu-hider").length > 0) ? parseInt($("#menu-hider").width(), 10) : 0;
            var menuWidth = parseInt($("#menu-container").css("width"), 10) - menuHider;
            var menuVal = 0;
            $("#template-wrapper").css("left", -(menuWidth) + "px").css("top", "0px");
            $("#menu-container").css("left", menuVal + "px").css("top", "0px");
        }

        /*window["moduleUpdate_" + currModuleType]();*/
        switch (currModuleType) {
            case "slideshow":
                moduleUpdate_slideshow();
                break;
            case "home2":
                moduleUpdate_home2();
                break;
            case "home3":
                moduleUpdate_home3();
                break;
            case "text_page":
                moduleUpdate_text_page();
                break;
            case "showreel":
                moduleUpdate_showreel();
                break;
            case "fullscreen_video":
                moduleUpdate_fullscreen_video();
                break;
            case "pricing_tables":
                moduleUpdate_pricing_tables();
                break;
            case "full_width":
                moduleUpdate_full_width();
                break;
            case "news":
                moduleUpdate_news();
                break;
            case "contact":
                moduleUpdate_contact();
                break;
            case "gallery":
                moduleUpdate_gallery();
                break;
            case "full_width_gallery":
                moduleUpdate_full_width_gallery();
                break;
            case "page_columns":
                moduleUpdate_page_columns(); // moved to pageColumns.js
                break;
        }
        moduleType = null;
        /*FOOTER*/
        if (firstRun == true) return;

        $("footer").css('display', 'inline').css('visibility', 'visible');

    }
);
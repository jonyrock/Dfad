﻿/*================= FULL WIDTH GALLERY =====================*/
var initialNumberColumns = 4;
var maximNumberColumns = 4;
var initialThumbW = 0;
var initialThumbH = 0;
var previewMediaArr = Array();
var previewMediaDescArr = Array();
var previewBorderSize = 0;
var currIndex = 0;
var previewFullWidthOpen = false;

function moduleFullWidthGallery() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }

    var galleryItem = $(".full-width-item", textPageInstance);
    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();

    initialThumbW = galleryItem.width();
    initialThumbH = galleryItem.height();

    if (touchDevice == 1) {
        currWindowW = $(window).width() - get_OffsetWidth();
    }
    checkItems();
    textPageInstance.css("width", currWindowW);
    textPageInstanceHolder.css("opacity", "0").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .6, { css: { opacity: "1" }, ease: Circ.easeOut });

    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    galleryItem.hover(
        function (event) { customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this)); },
        function (event) { customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this)); }
    );
    setFullWidthPreview();
    storeFullWidthPreviewMedia();
    galleryItem.click(
        function () {
            currIndex = 0;
            changeFWPreviewMediaDesc(-1);
            var index = $(".full-width-item").index(this);
            currIndex = index;
            if (moduleList != null) moduleList.disableList();
            $("#full-width-preview-media-holder").find("#preview-media-holder").empty();
            loadFullWidthPreview(index);
        });
}

function storeFullWidthPreviewMedia() {
    previewMediaArr = new Array();
    var i = 0;
    $("#full-width-preview #full-width-preview-media-holder").find("#preview-media-holder").children().each(
        function () {
            if ($(this).attr("id") == "preview-media-image") {
                previewMediaArr[i] = '<img id="preview-media-image" src="' + $(this).attr("data-url") +
                    '" title="' + $(this).attr("data-title") + '"' +
                    ' alt="' + $(this).attr("data-alt") + '" />';
            } else if ($(this).attr("id") == "video-wrapper") {
                var videoType = $(this).attr("data-type");
                previewMediaArr[i] = $(this);
            } else if ($(this).attr("id") == "video-wrapper-collection") {
                previewMediaArr[i] = $(this);
            }
            i++;
        });
    previewMediaDescArr = new Array();
    i = 0;
    $(".full-width-info-holder").find(".full-width-info-holder-desc").each(function () {
        previewMediaDescArr[i] = $(this).get(0);
        i++;
    });
    $("#full-width-preview-media-holder").find("#preview-media-holder").empty();
}

function changeFWPreviewMediaDesc(pID, cID) {
    if (pID != -1) {
        var pDesc = previewMediaDescArr[pID];
        TweenMax.to($(pDesc), .4, { css: { opacity: "0" }, ease: Circ.easeOut, onComplete: hideFWPrevMediaDesc, onCompleteParams: [pID] });
    } else {
        $(".full-width-info-holder").find(".full-width-info-holder-desc").each(function () { $(this).css("display", "none"); });
    }
    if (cID != -1 && cID != undefined) {
        var cDesc = previewMediaDescArr[cID];
        $(cDesc).attr("style", "visibility: visible; display: inline;");
        $(cDesc).css("opacity", "0");
        TweenMax.to($(cDesc), .6, { css: { opacity: "1" }, ease: Circ.easeOut });
    }
}

function hideFWPrevMediaDesc(pID) {
    var pDesc = previewMediaDescArr[pID];
    $(pDesc).attr("style", "visibility: visible; display: inline;");
    $(pDesc).css("opacity", "0");
}

function emptyPreviewMediaHolder() { $("#full-width-preview-media-holder").find("#preview-media-holder").empty(); }

function updateFullWidthPreviewPosition() {
    var fullWidthPreview = $("#full-width-preview");
    var previewInfoHolder = $("#full-width-preview-info-holder", fullWidthPreview);
    var fwMediaContainer = $("#full-width-preview-media-holder");
    var infoWidth = previewInfoHolder.width();
    var mediaContW = $(window).width() - infoWidth;
    var mediaContH = $(window).height();
    fwMediaContainer.attr("style", "width:" + mediaContW + "px; height:" + mediaContH + "px;");
    //$(".preview-arrow-close").css("right", infoWidth);
    //$(".preview-arrow-forward").css("right", infoWidth);
    var mediaType = fwMediaType;
    if (mediaType == "preview-media-image") {
        var elem = $("#preview-media-load");
        $(elem).css("width", '');
        $(elem).css("height", '');
        checkSizeMedia($(elem), mediaContW, mediaContH);
        var mediaBackNewW = $(elem).width() + previewBorderSize * 2;
        var mediaBackNewH = $(elem).height() + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5;
        var mediaBackMarginLeft = -mediaBackNewW * .5;
        $("#preview-media-holder").attr("style", "width: 100%; height: 100%; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
    }
}

function loadFullWidthPreview(index) {
    previewFullWidthOpen = true;
    var fullWidthPreview = $("#full-width-preview");
    var fwMediaContainer = $("#full-width-preview-media-holder");
    if (fullWidthPreview.length <= 0) return;
    fullWidthPreview.css("opacity", "0");
    fullWidthPreview.css("display", "inline");
    fullWidthPreview.css("visibility", "visible");
    TweenMax.to(fullWidthPreview, 0.4, { css: { opacity: "1" }, easing: Sine.easeOut, onComplete: addPreviewCloseClick });

    function addPreviewCloseClick() {
        showHideFullWidthPreviewInfo(true);
        showFullWidthMedia();
        $(".full-width-preview-media-holder-background, .preview-arrow-close", fullWidthPreview).click(
            function () {
                emptyPreviewMediaHolder();
                showHideFullWidthPreviewInfo(false);
            }
        );
    }

    var previewInfoHolder = $("#full-width-preview-info-holder", fullWidthPreview);
    var infoWidth = previewInfoHolder.width();
    var mediaContW = $(window).width() - infoWidth;
    var mediaContH = $(window).height();
    fwMediaContainer.attr("style", "width:" + mediaContW + "px; height:" + mediaContH + "px;");

    //$(".preview-arrow-close").css("right", infoWidth);
    //$(".preview-arrow-forward").css("right", infoWidth);

    function showHideFullWidthPreviewInfo(show) {
        previewInfoHolder.css("position", "fixed");
        var val = (-infoWidth) + "px";
        if (show == true) {
            previewInfoHolder.css("right", val);
            changeFWPreviewMediaDesc(-1, currIndex);
            previewInfoHolder.css("visibility", "visible");
            TweenMax.to(previewInfoHolder, .3, { css: { right: "0px" }, delay: 0.1, ease: Quad.easeInOut });
        } else {
            TweenMax.to(fwMediaContainer, .3, { css: { opacity: "0" }, ease: Circ.easeInOut });
            TweenMax.to([$(".preview-arrow-close"), $(".preview-arrow-forward"), $(".preview-arrow-backward")], .3, { css: { opacity: "0" }, ease: Circ.easeInOut });
            TweenMax.to(previewInfoHolder, .3, { css: { right: val }, ease: Circ.easeInOut, onComplete: hideFullWidthPreview });

        }

        function hideFullWidthPreview() {
            previewFullWidthOpen = false;
            justOpenedPreivew = true;
            animationLoadFWPreviewDone = true;
            $("#full-width-preview-media-holder", fullWidthPreview).unbind("click");
            $(".preview-arrow-close", fullWidthPreview).unbind("click");
            TweenMax.to(fullWidthPreview, 0.4, { css: { opacity: "0" }, easing: Sine.easeOut, onComplete: removeFullWidthPreview });
        }

        function removeFullWidthPreview() {
            if (moduleList != null) moduleList.enableList();
            fullWidthPreview.css("display", "none");
        }
    }

    function showFullWidthMedia() {
        fwMediaContainer.css("opacity", "0");
        fwMediaContainer.css("visibility", "visible");
        TweenMax.to(fwMediaContainer, 0.2, { css: { opacity: "1" }, easing: Sine.easeOut });
        loadFullWidthMedia();
    }
}

function loadFullWidthMedia() {
    var currPreviewElem = previewMediaArr[currIndex];
    var mediaType = $(currPreviewElem).attr("id");
    var fwMediaContainer = $("#full-width-preview-media-holder");
    if (mediaType == "preview-media-image" || mediaType == "video-wrapper-collection") {
        /*PLAY MEDIA IMAGE*/
        var totalWidth = fwMediaContainer.width() - previewBorderSize * 2;
        var totalHeight = fwMediaContainer.height() - previewBorderSize * 2;
        var prevMediaLoad = $("#preview-media-load");
        fwMediaType = mediaType;
        fwW = totalWidth;
        fwH = totalHeight;
        prevMediaLoad.css("opacity", "0");
        var prevMediaHolder = fwMediaContainer.find("#preview-media-holder");
        prevMediaHolder.append('<img id="preview-media-load" onload="animateFullWidthPreviewMedia()" title="" alt="" />');
        prevMediaLoad = $("#preview-media-load");
        prevMediaLoad.attr("style", "visibility: visible; display: inline;");
        prevMediaLoad.css("opacity", "0");
        prevMediaLoad.attr("src", $(currPreviewElem).attr("src"));
        prevMediaLoad.attr("title", $(currPreviewElem).attr("title"));
        prevMediaLoad.attr("alt", $(currPreviewElem).attr("alt"));
    } else if (mediaType == "video-wrapper") {
        /*PLAY MEDIA VIDEO*/
        fwMediaContainer.find("#preview-media-holder").empty();
        var prevMediaHolder = $("#preview-media-holder");
        var mediaBackNewW = parseInt($(currPreviewElem).attr("data-width"), 10) + previewBorderSize * 2;
        var mediaBackNewH = parseInt($(currPreviewElem).attr("data-height"), 10) + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5;
        var mediaBackMarginLeft = -mediaBackNewW * .5;

        prevMediaHolder.attr("style", "width: " + mediaBackNewW + "px; height: " + mediaBackNewH + "px; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
        prevMediaHolder.append('<div id="video-wrapper"></div>')
        templateAddMediaVideo($(currPreviewElem).attr("data-video-type"), $(currPreviewElem), $("#video-wrapper"));

        TweenMax.to($(".full-width-preview-media-loader"), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        loadingAnimationDone = true;
        animationLoadFWPreviewDone = true;
        fwMediaType = mediaType;
        fullWidthFadeInMedia(mediaType);
    } else if (mediaType == "video-wrapper-collection") {
        // TODO: #video-wrapper-collection case imp
    }
}

var fwMediaType = "";
var fwW = "";
var fwH = "";

function animateFullWidthPreviewMedia() {
    var mediaType = fwMediaType;
    var width = fwW;
    var height = fwH;
    var elem = "";
    if (mediaType == "preview-media-image") {
        elem = $("#preview-media-load");
        $(elem).css("width", '');
        $(elem).css("height", '');
        checkSizeMedia($(elem), width, height);
    }
    animationLoadFWPreviewDone = true;
    if ($(elem).width() != null) {
        var mediaBackNewW = $(elem).width() + previewBorderSize * 2;
        var mediaBackNewH = $(elem).height() + previewBorderSize * 2;
        var mediaBackMarginTop = -mediaBackNewH * .5;
        var mediaBackMarginLeft = -mediaBackNewW * .5;
        var prevMediaHolder = $("#preview-media-holder");
        prevMediaHolder.attr("style", "width: " + mediaBackNewW + "px; height: " + mediaBackNewH + "px; margin: 0px; top: 50%; left: 50%; margin-top:" + mediaBackMarginTop + "px; margin-left:" + mediaBackMarginLeft + "px;");
        TweenMax.to($(".full-width-preview-media-loader"), .3, { css: { opacity: "0" }, easing: Sine.easeOut });
        fullWidthFadeInMedia(mediaType);
        loadingAnimationDone = true;
    }
}

var justOpenedPreivew = true;

function fullWidthFadeInMedia(mediaType) {
    if (mediaType == "preview-media-image") {
        TweenMax.to($("#preview-media-load"), .6, { css: { opacity: "1" }, ease: Circ.easeOut });
    }

    if (justOpenedPreivew == true) {
        justOpenedPreivew = false;
        var fwMediaContainer = $("#full-width-preview-media-holder");
        var tW = fwMediaContainer.width() - 60;
        var prevControlClose = $(".preview-arrow-close");
        var prevControlBack = $(".preview-arrow-backward");
        var prevControlForw = $(".preview-arrow-forward");
        prevControlClose.css("opacity", "1").css("display", "inline");
        prevControlBack.css("opacity", "1").css("display", "inline");
        prevControlForw.css("opacity", "1").css("display", "inline");
        //TweenMax.to([prevControlClose, prevControlBack, prevControlForw], .6, { css: { opacity: "1" }, ease: Circ.easeInOut });
        var initOpacity = 1;
        var initBackColor = rgb2hex($(".preview-arrow-backward .preview-arrow-backg").css("background-color"));
        $(".preview-arrow-backward, .preview-arrow-forward, .preview-arrow-close").unbind('mouseenter mouseleave');
        $(".preview-arrow-backward, .preview-arrow-forward, .preview-arrow-close").hover(
            function () { TweenMax.to($(".preview-arrow-backg", this), 0.3, { css: { backgroundColor: themeColor }, easing: Sine.easeOut }); },
            function () { TweenMax.to($(".preview-arrow-backg", this), 0.3, { css: { backgroundColor: initBackColor }, easing: Sine.easeOut }); }
        );
        $(".preview-arrow-backward").unbind("click");
        $(".preview-arrow-forward").unbind("click");
        $(".preview-arrow-backward").click(
            function () {
                TweenMax.to($(".full-width-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
                changeFullWidthPreviewMedia(-1);
            });
        $(".preview-arrow-forward").click(
            function () {
                TweenMax.to($(".full-width-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
                changeFullWidthPreviewMedia(1);
            });

        //update counter
        changeFullWidthPreviewMedia(0);
    }
}

var animationLoadFWPreviewDone = true;

function changeFullWidthPreviewMedia(value) {
    var nextThumbID = currIndex + value;
    if (nextThumbID > previewMediaArr.length - 1) {
        nextThumbID = 0;
    } else if (nextThumbID < 0) {
        nextThumbID = previewMediaArr.length - 1;
    }
    if (currIndex != nextThumbID) {
        var elem = previewMediaArr[currIndex];
        if ($(elem).attr("id") == "preview-media-image") {
            $("#preview-media-load").css("opacity", 0);
            $("#preview-media-load").attr("style", "visibility: hidden; display: none;");
        } else if ($(elem).attr("id") == "video-wrapper" || $(elem).attr("id") == "video-wrapper-coolection") {
            $(elem).css("opacity", "0");
            $(elem).attr("style", "visibility: hidden; display: none;");
        }
        changeFWPreviewMediaDesc(currIndex, nextThumbID);
        currIndex = nextThumbID;
        elem = previewMediaArr[currIndex];
        $("#full-width-preview-media-holder").find("#preview-media-holder").empty();
        loadFullWidthMedia();
    }

    //update counter
    $("#full-width-preview .preview-counter span").text((currIndex + 1) + "/" + previewMediaArr.length);
}

function setFullWidthPreview() {
    var fullWidthPreview = $("#full-width-preview");
    if ($("#full-width-preview").length > 0) {
        fullWidthPreview.remove();
        $("#template-wrapper").after(fullWidthPreview);
    }
}

function checkItems() {
    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    var itemW = currWindowW / maximNumberColumns;
    var currRatio = itemW / initialThumbW;
    var itemH = initialThumbH / initialThumbW * itemW;
    if (initialThumbW <= 0) {
        return;
    }

    if (touchDevice == 1) {
        currWindowW = $(window).width() - get_OffsetWidth();
    }
    textPageInstance.css("width", currWindowW);

    if (currRatio >= 0.8 && currRatio <= 1) {
        itemW = currWindowW / maximNumberColumns;
        itemH = initialThumbH / initialThumbW * itemW;
    } else if (currRatio < 0.8 || currRatio > 1) {
        itemW = currWindowW / (maximNumberColumns - 1);
        currRatio = itemW / initialThumbW;
        if (currRatio <= 1) {
            maximNumberColumns--;
            itemW = currWindowW / maximNumberColumns;
            itemH = initialThumbH / initialThumbW * itemW;
            currRatio = itemW / initialThumbW;
            while (currRatio < 0.8) {
                maximNumberColumns--;
                itemW = currWindowW / maximNumberColumns;
                itemH = initialThumbH / initialThumbW * itemW;
                currRatio = itemW / initialThumbW;
            }
            if (currRatio > 1) {
                itemW = currWindowW / maximNumberColumns;
                itemH = initialThumbH / initialThumbW * itemW;
                while (itemW > initialThumbW) {
                    maximNumberColumns++;
                    itemW = currWindowW / maximNumberColumns;
                    itemH = initialThumbH / initialThumbW * itemW;
                }
            }
        } else {
            itemW = currWindowW / maximNumberColumns;
            itemH = initialThumbH / initialThumbW * itemW;
            while (itemW > initialThumbW) {
                maximNumberColumns++;
                itemW = currWindowW / maximNumberColumns;
                itemH = initialThumbH / initialThumbW * itemW;
            }
        }
    }
    var col = 0;
    var lin = 0;
    $("#module-full-width-holder").find(".full-width-item").each(
        function () {
            $(this).css("position", "absolute");
            var topV = 0;
            var lefV = 0;
            if (col < maximNumberColumns) {
                topV = Math.round(itemH) * lin;
                lefV = Math.round(itemW) * col;
                col++;
            } else {
                col = 0;
                lin++;
                topV = Math.round(itemH) * lin;
                lefV = Math.round(itemW) * col;
                col++;
            }
            /* we have added img width= 100.5% in CSS file so we don't need to tween the 'img' anymore'; 
                   100.5% to fill the extra -0.5px that sometime appears on resizing*/
            if (touchDevice == 0) {
                TweenMax.to($("img", this), 0.6, { css: { width: Math.round(itemW), height: Math.round(itemH) }, easing: Sine.easeOut });
                TweenMax.to($(this), 0.6, { css: { width: Math.round(itemW), height: Math.round(itemH), left: lefV, top: topV }, easing: Sine.easeOut });
            } else {
                $("img", this).css("width", Math.round(itemW)).css("height", Math.round(itemH));
                $(this).css("width", Math.round(itemW)).css("height", Math.round(itemH)).css("left", lefV).css("top", topV);
            }
        });
    lin++;
    $("div:first", textPageInstance).css("height", lin * Math.round(itemH));
}
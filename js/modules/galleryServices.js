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

    if (!touchDevice)
        galleryItem.hover(
            function (event) {
                customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag p", this);
                TweenMax.to(text, .6, { css: { color: backgOutColor }, ease: Quad.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOverColor }, ease: Quad.easeOut });
            },
            function (event) {
                customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag p", this);
                TweenMax.to(text, .6, { css: { color: text1BaseColor }, ease: Circ.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOutColor }, ease: Quad.easeOut });
            });
    galleryItem.click(
        function () {
            window.location.hash = "services/" + $(this).attr("data-page");
        });


    var childLength = galleryHolder.children().length - 1;
    totalVisibleThumbs = (childLength < totalVisibleThumbs) ? childLength : totalVisibleThumbs;
    galleryVisibleThumbs = totalVisibleThumbs + 1;
    var i = 0;
    var tempI = 0;
    var tempJ = 0;
    var onceD = true;
    galleryHolder.find(".thumb-holder").each(
        function () {
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
        function () {
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
            function () {
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
    galleryHolder.find(".thumb-holder").each(function () { $(this).css("display", "inline").css("top", "0px"); });
}

function afterGalleryStartupAnimation(visibleH) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-galleries", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    $("#module-galleries-holder", textPageInstance).find(".thumb-holder").each(function () { $(this).css("display", "inline"); });
    $("#module-galleries-preview").wipetouch({
        tapToClick: false, /* if user taps the screen, triggers a click event*/
        preventDefault: false,/* if user taps the screen, triggers a click event*/
        wipeLeft: function (result) { wipeChange(1); },
        wipeRight: function (result) { wipeChange(-1); }
    });
}

function wipeChange(idx) {
    var prevMediaChild = $("#preview-media-holder :first");
    TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, delay: .3, easing: Sine.easeOut });
    TweenMax.to(prevMediaChild, .4, {
        css: { opacity: "0" },
        easing: Sine.easeOut,
        onComplete:
            function () {
                changePreviewMedia(idx);
            }
    });
}

function storePreviewMedia() {
    galleryPreviewMediaArr = new Array();
    galleryPreviewDescArr = new Array();
    var i = 0;
    $("#module-galleries-preview").find("#preview-media-holder").children().each(
        function () {
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
    } catch (e) {
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
    if (!touchDevice) {
        var initOpacity = $(".module-galleries-preview-arrow-backward .module-galleries-preview-arrow-backg").css("opacity");
        var initBackColor = rgb2hex($(".module-galleries-preview-arrow-backward .module-galleries-preview-arrow-backg").css("background-color"));
        var prevControls = $(".module-galleries-preview-arrow-backward, .module-galleries-preview-arrow-forward, .module-galleries-preview-arrow-close");
        prevControls.unbind('mouseenter mouseleave');
        prevControls.hover(
            function () {
                TweenMax.to($(".module-galleries-preview-arrow-backg", this), 0.3, { css: { opacity: "1", backgroundColor: themeColor }, easing: Sine.easeOut });
            },
            function () {
                TweenMax.to($(".module-galleries-preview-arrow-backg", this), 0.3, { css: { opacity: initOpacity, backgroundColor: initBackColor }, easing: Sine.easeOut });
            });
    }
    var prevArrBack = $(".module-galleries-preview-arrow-backward");
    var prevArrForw = $(".module-galleries-preview-arrow-forward")
    prevArrBack.unbind("click");
    prevArrBack.click(
        function () {
            TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
            changePreviewMedia(-1);
        });
    prevArrForw.unbind("click");
    prevArrForw.click(
        function () {
            TweenMax.to($(".gallery-preview-media-loader"), .3, { css: { opacity: "1" }, easing: Sine.easeOut });
            changePreviewMedia(1);
        });
    var prevArrClose = ".module-galleries-preview-arrow-close";
    var prevBackg = "#module-galleries-preview-background";
    $(prevBackg).unbind("click");
    $(prevArrClose).unbind("click");
    $(prevArrClose + "," + prevBackg).click(
        function () {
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
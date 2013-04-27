/**
 * VERSION: 1.0
 * DATE: 2013-04-25
 *
 * @author: @jonyrock exclusively to dfad.com
 **/

fullScreenViewer.isInited = false;
fullScreenViewer.isVisible;
fullScreenViewer.htmlMediaHolder;
fullScreenViewer.htmlHolder;
fullScreenViewer.htmlInfoHolder;
fullScreenViewer.htmlInfoTextHolder;
fullScreenViewer.htmlInfoHolderWidth;
fullScreenViewer.navigationElements;
fullScreenViewer.navigationElementsDelayOrder;
fullScreenViewer.instance;


// act like singleton
function fullScreenViewer(mediaItems, mediaItemsHtml) {

    fullScreenViewer.instance = this;

    function initEventHandlers() {
        fullScreenViewer.htmlHolder.find(".preview-arrow-close").click(fullScreenViewer.instance.hide);
        $(document).keyup(function(e) {
            if (e.keyCode == 27)// esc key code
                fullScreenViewer.instance.hide();
        });

        fullScreenViewer.htmlInfoHolder.find(".preview-arrow-backward").click(fullScreenViewer.instance.showPrev);
        fullScreenViewer.htmlInfoHolder.find(".preview-arrow-forward").click(fullScreenViewer.instance.showNext);

    }

    function initNavigationAnimation() {
        if (!touchDevice) {
            fullScreenViewer.htmlHolder.find(".preview-arrow-backward, .preview-arrow-forward, .preview-arrow-close").hover(function() {
                TweenMax.to($(".preview-arrow-backg", this), 0.3, {
                    css : {
                        backgroundColor : themeColor
                    },
                    easing : Sine.easeOut
                });
            }, function() {
                TweenMax.to($(".preview-arrow-backg", this), 0.3, {
                    css : {
                        backgroundColor : initBackColor
                    },
                    easing : Sine.easeOut
                });
            });
        }

    }

    function initStatic() {
        fullScreenViewer.isVisible = false;
        fullScreenViewer.htmlMediaHolder = $("#full-width-preview-media-holder");
        fullScreenViewer.htmlHolder = $("#full-width-preview");
        fullScreenViewer.htmlInfoHolder = fullScreenViewer.htmlHolder.find("#full-width-preview-info-holder");
        fullScreenViewer.htmlInfoTextHolder = fullScreenViewer.htmlInfoHolder.find(".full-width-info-holder");
        fullScreenViewer.htmlInfoHolderWidth = fullScreenViewer.htmlInfoHolder.width();
        fullScreenViewer.htmlInfoHolder.css("width", "0px");
        fullScreenViewer.isInited = true;
        fullScreenViewer.navigationElements = fullScreenViewer.htmlInfoHolder.find(".navigationElement");
        fullScreenViewer.navigationElementsDelayOrder = new Array(4, 2, 3, 1);
        initNavigationAnimation();
        initEventHandlers();
    }

    if (!fullScreenViewer.isInited)
        initStatic();

    this.mediaItems = mediaItems;
    this.mediaItemsHtml = mediaItemsHtml;
    this.currentIndex = 0;
}

fullScreenViewer.prototype.showNext = function() {
    //TODO:play animation to it
    var me = fullScreenViewer.instance;
    me.showItemAt((me.currentIndex + 1) % me.mediaItems.length);
}

fullScreenViewer.prototype.showPrev = function() {
    //TODO:play animation to it
    var me = fullScreenViewer.instance;
    me.showItemAt((me.currentIndex - 1 + me.mediaItems.length) % me.mediaItems.length);
}

fullScreenViewer.prototype.showItemAt = function(itemIndex) {
    var newCounterText = (itemIndex + 1) + "/" + this.mediaItems.length;
    fullScreenViewer.htmlInfoHolder.find("#.preview-counter span").text(newCounterText);
    if (!fullScreenViewer.isVisible) {
        fullScreenViewer.show(function() {
            fullScreenViewer.instance.showItemAt(itemIndex)
        });
        return;
    }
    fullScreenViewer.htmlInfoTextHolder.empty();
    this.currentIndex = itemIndex;
    var htmlText = $(this.mediaItemsHtml[itemIndex]);
    fullScreenViewer.htmlInfoTextHolder.append(htmlText);
    htmlText.fadeIn();
}
// method useful for updating rep object data
fullScreenViewer.prototype.hide = function() {
    fullScreenViewer.hide();
}

fullScreenViewer.show = function(onCompleteFunction) {
    if (fullScreenViewer.isVisible)
        return;
    fullScreenViewer.isVisible = true;
    fullScreenViewer.htmlHolder.fadeIn();
    TweenMax.killTweensOf(fullScreenViewer.htmlInfoHolder);
    TweenMax.to(fullScreenViewer.htmlInfoHolder, 0.6, {
        css : {
            width : fullScreenViewer.htmlInfoHolderWidth + "px"
        },
        ease : Sine.easeInOut,
        onComplete : onCompleteFunction
    });

    fullScreenViewer.navigationElements.each(function(i) {
        $(this).delay(80 * (fullScreenViewer.navigationElementsDelayOrder[i] + 1)).fadeIn();
    });

}

fullScreenViewer.hide = function() {
    if (!fullScreenViewer.isVisible)
        return;
    fullScreenViewer.isVisible = false;
    fullScreenViewer.htmlInfoTextHolder.empty();
    fullScreenViewer.htmlHolder.delay(300).fadeOut();
    TweenMax.killTweensOf(fullScreenViewer.htmlInfoHolder);
    TweenMax.to(fullScreenViewer.htmlInfoHolder, 0.6, {
        css : {
            width : "0px"
        },
        ease : Sine.easeInOut
    });
    fullScreenViewer.navigationElements.each(function(i) {
        var order = fullScreenViewer.navigationElementsDelayOrder;
        $(this).delay(80 * order[order.length - i]).fadeOut();
    });
}
// FACTORIES
fullScreenViewer.buildFromHtml = function() {

    var previewMediaArr = new Array();
    var previewMediaDescArr = new Array();

    $("#full-width-preview #full-width-preview-media-holder").find("#preview-media-holder").children().each(function(i) {
        if ($(this).attr("id") == "preview-media-image") {
            previewMediaArr[i] = '<img id="preview-media-image" src="' + $(this).attr("data-url") + '" title="' + $(this).attr("data-title") + '"' + ' alt="' + $(this).attr("data-alt") + '" />';
        } else if ($(this).attr("id") == "video-wrapper") {
            previewMediaArr[i] = $(this);
        } else if ($(this).attr("id") == "video-wrapper-collection") {
            previewMediaArr[i] = $(this);
        }
    });

    $(".full-width-info-holder").find(".full-width-info-holder-desc").each(function(i) {
        previewMediaDescArr[i] = $(this).get(0);
    });

    $("#preview-media-holder").empty();
    $(".full-width-info-holder").empty();
    var templateHtml = $("#full-width-preview").html();
    $("#full-width-preview").remove();

    return new fullScreenViewer(previewMediaArr, previewMediaDescArr);

}


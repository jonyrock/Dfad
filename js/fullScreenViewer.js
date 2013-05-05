/**
 * VERSION: 1.1
 * DATE: 2013-05-05
 *
 * @author: @jonyrock exclusively for dfad.us
 **/

fullScreenViewer.isInited = false;
fullScreenViewer.isVisible
fullScreenViewer.htmlMediaHolder
fullScreenViewer.htmlMediaHolderAnimation
fullScreenViewer.htmlHolder
fullScreenViewer.htmlInfoHolder
fullScreenViewer.htmlInfoTextHolder
fullScreenViewer.htmlInfoHolderWidth
fullScreenViewer.htmlButtonPrevios
fullScreenViewer.htmlButtonNext
fullScreenViewer.htmlButtonClose
fullScreenViewer.navigationElements
fullScreenViewer.navigationElementsDelayOrder
fullScreenViewer.instance
fullScreenViewer.buttonsInstance
fullScreenViewer.initSharedEventHandlers
fullScreenViewer.removeSharedEventHandlers

                                                                                                                                             
// acts like singleton
function fullScreenViewer(mediaItems, mediaItemsHtml) {

    fullScreenViewer.instance = this;

    var keyHandlers = function(e) {
        var bindedKeyCodes = new Array(27, 33, 34, 35, 36, 37, 38, 39, 40);
        if(bindedKeyCodes.indexOf(e.keyCode) == -1)
            return ;
        e.preventDefault();
        if (e.keyCode == 27)                    // esc key code
            fullScreenViewer.instance.hide();
        if (e.keyCode == 37 || e.keyCode == 33) // left key code or pageup
            fullScreenViewer.instance.showPrevious();
        if (e.keyCode == 39 || e.keyCode == 34) // right key code or pagedown
            fullScreenViewer.instance.showNext();
    }

    fullScreenViewer.initSharedEventHandlers = function () {
        $(document).bind('keydown', keyHandlers);
    }

    fullScreenViewer.removeSharedEventHandlers = function() {
        $(document).unbind('keydown', keyHandlers);
    }

    function initEventHandlers() {
        fullScreenViewer.htmlHolder.find(".preview-arrow-close").click(fullScreenViewer.instance.hide);
        fullScreenViewer.htmlInfoHolder.find(".preview-arrow-backward").click(fullScreenViewer.instance.showPrevious);
        fullScreenViewer.htmlInfoHolder.find(".preview-arrow-forward").click(fullScreenViewer.instance.showNext);
        if(touchDevice) {
            $(fullScreenViewer.htmlHolder).wipetouch({
                allowDiagonal: false,
                wipeLeft: function(result) { fullScreenViewer.instance.showNext(); },
                wipeRight: function(result) { fullScreenViewer.instance.showPrevious(); },
            });
        }
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
                $(this).attr("hovered", "");
            }, function() {
                TweenMax.to($(".preview-arrow-backg", this), 0.3, {
                    css : {
                        backgroundColor : initBackColor
                    },
                    easing : Sine.easeOut
                });
                $(this).removeAttr('hovered');
            });
        }
    }

    function initStatic() {
        fullScreenViewer.isVisible = false;
        fullScreenViewer.htmlMediaHolder = $("#full-width-preview-media-holder");
        fullScreenViewer.htmlHolder = $("#full-width-preview");
        fullScreenViewer.htmlMediaHolder = fullScreenViewer.htmlHolder.find("#preview-media-holder");
        fullScreenViewer.htmlMediaHolderAnimation = fullScreenViewer.htmlHolder.find(".full-width-preview-media-loader");
        fullScreenViewer.htmlInfoHolder = fullScreenViewer.htmlHolder.find("#full-width-preview-info-holder");
        fullScreenViewer.htmlInfoTextHolder = fullScreenViewer.htmlInfoHolder.find(".full-width-info-holder");
        fullScreenViewer.htmlInfoHolderWidth = fullScreenViewer.htmlInfoHolder.width();
        fullScreenViewer.htmlInfoHolder.css("width", "0px");

        fullScreenViewer.htmlButtonPrevios = fullScreenViewer.htmlInfoHolder.find(".preview-arrow-backward");
        fullScreenViewer.htmlButtonNext = fullScreenViewer.htmlInfoHolder.find(".preview-arrow-forward");
        fullScreenViewer.htmlButtonClose = fullScreenViewer.htmlInfoHolder.find(".preview-arrow-close");

        fullScreenViewer.navigationElements = fullScreenViewer.htmlInfoHolder.find(".navigationElement");
        fullScreenViewer.navigationElementsDelayOrder = new Array(4, 2, 3, 1);
        initNavigationAnimation();
        initEventHandlers();
        fullScreenViewer.isInited = true;
    }

    if (!fullScreenViewer.isInited)
        initStatic();

    this.mediaItems = mediaItems;
    this.mediaItemsHtml = mediaItemsHtml;
    this.currentIndex = 0;
}

fullScreenViewer.prototype.showNext = function() {
    var me = fullScreenViewer.instance;
    me.showItemAt((me.currentIndex + 1) % me.mediaItems.length);
    fullScreenViewer.buttonTrigger(fullScreenViewer.htmlButtonNext);
}

fullScreenViewer.prototype.showPrevious = function() {
    var me = fullScreenViewer.instance;
    me.showItemAt((me.currentIndex - 1 + me.mediaItems.length) % me.mediaItems.length);
    fullScreenViewer.buttonTrigger(fullScreenViewer.htmlButtonPrevios);
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
    
    this.currentIndex = itemIndex;
    
    var mediaItem = this.mediaItems[itemIndex];
    var mediaItemHtml = this.mediaItemsHtml[itemIndex];
    fullScreenViewer.renderMedia(mediaItem, mediaItemHtml);   
}

fullScreenViewer.prototype.getMediaItems = function(){
    return this.mediaItems;
}

fullScreenViewer.prototype.setMediaItems = function(items) {
    this.mediaItems = items;
}

fullScreenViewer.prototype.getMediaItemsHtml = function() {
    return this.mediaItemsHtml;
}

fullScreenViewer.prototype.setMediaItemsHtml = function(items) {
    this.mediaItemsHtml = items;
}


// method useful for updating per object data
fullScreenViewer.prototype.hide = function() {
    fullScreenViewer.hide();
}

fullScreenViewer.buttonTrigger = function(button) {
    if ($(button).attr('hovered') !== undefined) {
        return
    }
    var back = $(button).find(".preview-arrow-backg");
    TweenLite.killTweensOf(back);
    back.css("backgroundColor", themeColor);
    TweenMax.to(back, 2, {
        css : {
            backgroundColor : initBackColor
        },
        easing : Sine.easeOut
    });
}

fullScreenViewer.renderMedia = function (mediaItem, mediaItemHtml) {
        if(mediaItem === undefined) return;
        if(mediaItemHtml === undefined) return;
        var mediaType = mediaItem.attr("id");
        var buttonsInstance;
        if(fullScreenViewer.buttonsInstance === undefined) {
            buttonsInstance = new fullScreenViewer.pagesButtons();
            fullScreenViewer.buttonsInstance = buttonsInstance;
        } else {
            buttonsInstance = fullScreenViewer.buttonsInstance;
        }

        // cloning because it will be updated as dom model
        mediaItemHtml = $(mediaItemHtml).clone();
        mediaItem = mediaItem.clone();
        var mediaItemCredits = $(mediaItemHtml).find(".credits");
        $(mediaItemHtml).find(".credits").remove();

        // buttons rendering should be executed once by parent render
        var buttonsRendered = false;
        
        function showCredits() {
            renderMediaText(mediaItemCredits);
        }

        function renderMediaText(mediaItemHtmlPiece) {
            fullScreenViewer.htmlInfoTextHolder.empty();
            var htmlText = $(mediaItemHtmlPiece);
            fullScreenViewer.htmlInfoTextHolder.append(htmlText);
            htmlText.fadeIn();
        }

        function renderButtons(count) {
            
            if(buttonsRendered)
                return;

            buttonsRendered = true;

            var hasCredits = false;
            var hasHome = false;
            if(mediaItemCredits.length > 0) {
                hasCredits = true;
                buttonsInstance.onCreditsClick = showCredits;
            }

            if(count == 0){
                hasHome = true;
                buttonsInstance.onHomeClick = function() {
                    renderMediaText(mediaItemHtml);
                }
            }
            if(count == 1) {
                hasHome = true;
                count--;
                buttonsInstance.onHomeClick = function(){
                    buttonsInstance.selectPage(0);
                }
            }

            if(!(hasCredits || count > 0)) {
                buttonsInstance.hide();
                return;
            }

            buttonsInstance.setPagesCount(count, hasHome, hasCredits);
        }

        function getOffsetLengthDimentionByString(valueStr){
            var length = parseInt(valueStr, 10);
            var offset = -length / 2;
            if(valueStr.indexOf("%") != -1){
                length += "%";
                offset += "%";
            } else {
                length += "px";
                offset += "px";
            }
            return { length:length, offset:offset };
        }

        function renderSingleImage(mediaItemPiece, mediaItemHtmlPiece) {
            fullScreenViewer.htmlMediaHolder.empty();
            renderMediaText(mediaItemHtmlPiece);
            renderButtons(0);

            var htmlElem = $(
                '<img id="preview-media-image"' + 
                ' src="'    + $(mediaItemPiece).attr("data-url")    + '"' +
                ' title="'  + $(mediaItemPiece).attr("data-title")  + '"' + 
                ' alt="'    + $(mediaItemPiece).attr("data-alt")    + '" />');

            fullScreenViewer.htmlMediaHolder.append(htmlElem);
            htmlElem.css("visibility", "hidden");
            htmlElem.load(function() {
                htmlElem.css("position", "relative");
                htmlElem.css("visibility", "visible");
                if($(mediaItemPiece).attr("data-width") !== undefined) {
                    var mediaWidth = getOffsetLengthDimentionByString(
                            $(mediaItemPiece).attr("data-width")).length;
                    htmlElem.css("width", mediaWidth);
                    var left = getOffsetLengthDimentionByString(
                            $(mediaItemPiece).attr("data-width")).offset;
                    htmlElem.css("left", left);
                } else {
                    var mediaWidth = htmlElem.width();
                    htmlElem.css("left", -mediaWidth / 2);
                }

                if($(mediaItemPiece).attr("data-height") !== undefined) {
                    var mediaHeight = getOffsetLengthDimentionByString(
                            $(mediaItemPiece).attr("data-height")).length;
                    htmlElem.css("height", mediaHeight);
                    var top = getOffsetLengthDimentionByString(
                            $(mediaItemPiece).attr("data-height")).offset;
                    htmlElem.css("top", top);
                } else {
                    var mediaHeight = htmlElem.height();
                    htmlElem.css("top", -mediaHeight / 2);
                }
                
            });
        }

        function renderSingleVideo(mediaItemPiece, mediaItemHtmlPiece) {
            fullScreenViewer.htmlMediaHolder.empty();
            renderMediaText(mediaItemHtmlPiece);
            renderButtons(0);

            var htmlElem = $('<div id="video-wrapper"></div>');
            fullScreenViewer.htmlMediaHolder.append(htmlElem);

            htmlElem.css("position", "relative");
            htmlElem.css("visibility", "visible");
            
            var widthValue = getOffsetLengthDimentionByString($(mediaItemPiece).attr("data-width")).length;
            var leftValue = getOffsetLengthDimentionByString($(mediaItemPiece).attr("data-width")).offset;

            var heightValue = getOffsetLengthDimentionByString($(mediaItemPiece).attr("data-height")).length;
            var topValue = getOffsetLengthDimentionByString($(mediaItemPiece).attr("data-height")).offset;
            
            htmlElem.css("width", widthValue);
            htmlElem.css("height", heightValue);
            htmlElem.css("left", leftValue);
            htmlElem.css("top", topValue);

            templateAddMediaVideo(
                $(mediaItemPiece).attr("data-video-type"), 
                $(mediaItemPiece), 
                htmlElem
            );
        }

        function renderCollection(mediaItemPiece, mediaItemHtmlPiece) {
            var videoItems      = $(mediaItemPiece).children("#video-wrapper");
            var mediaHtmlItems  = $(mediaItemHtmlPiece).children(".full-width-info-holder-desc");
            renderButtons(videoItems.length);
            buttonsInstance.onPageChange = function(pageIndex) {
                renderSingleVideo(
                    videoItems.eq(pageIndex),
                    mediaHtmlItems.eq(pageIndex)
                );
            }
            buttonsInstance.selectPage(0);
        }

        var mediaRenderers = new Array();
        mediaRenderers["preview-media-image"]       = renderSingleImage;
        mediaRenderers["video-wrapper"]             = renderSingleVideo;
        mediaRenderers["video-wrapper-collection"]  = renderCollection;
        
        mediaRenderers[mediaType](mediaItem, mediaItemHtml);
}

fullScreenViewer.show = function(callback) {
    if (fullScreenViewer.isVisible)
        return;
    fullScreenViewer.isVisible = true;
    fullScreenViewer.initSharedEventHandlers();
    fullScreenViewer.htmlHolder.fadeIn();
    TweenMax.killTweensOf(fullScreenViewer.htmlInfoHolder);
    TweenMax.to(fullScreenViewer.htmlInfoHolder, 0.6, {
        css : {
            width : fullScreenViewer.htmlInfoHolderWidth + "px"
        },
        ease : Sine.easeInOut,
        onComplete : function() {
            fullScreenViewer.htmlMediaHolderAnimation.show();
            callback();
        }
    });

    fullScreenViewer.navigationElements.each(function(i) {
        $(this).delay(80 * (fullScreenViewer.navigationElementsDelayOrder[i] + 1)).fadeIn();
    });
}

fullScreenViewer.hide = function() {
    if (!fullScreenViewer.isVisible)
        return;
    fullScreenViewer.isVisible = false;
    fullScreenViewer.removeSharedEventHandlers();
    fullScreenViewer.buttonTrigger(fullScreenViewer.htmlButtonClose);
    fullScreenViewer.htmlInfoTextHolder.empty();
    fullScreenViewer.htmlMediaHolder.empty();
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

    fullScreenViewer.htmlMediaHolderAnimation.hide();
    if(fullScreenViewer.buttonsInstance !== undefined)
        fullScreenViewer.buttonsInstance.hide();
}
// FACTORY (for legacy)
fullScreenViewer.buildFromHtml = function() {

    var previewMediaArr = new Array();
    var previewMediaDescArr = new Array();

    $("#full-width-preview #full-width-preview-media-holder").children("#preview-media-holder")
    .children().each(function(i) {
        previewMediaArr[i] = $(this);
    });

    $(".full-width-info-holder").children(".full-width-info-holder-desc").each(function(i) {
        previewMediaDescArr[i] = $(this).get(0);
    });

    $("#preview-media-holder").empty();
    $(".full-width-info-holder").empty();
    var templateHtml = $("#full-width-preview").html();
    $("#full-width-preview").remove();

    return new fullScreenViewer(previewMediaArr, previewMediaDescArr);
}

fullScreenViewer.pagesButtons = function() {
    fullScreenViewer.pagesButtons.htmlHolder =
        fullScreenViewer.htmlInfoHolder
        .find("#full-width-info-holder-pages-buttons");
    var me = this;
    fullScreenViewer.pagesButtons.instance = this;
}

fullScreenViewer.pagesButtons.prototype.onPageChange
fullScreenViewer.pagesButtons.prototype.onHomeClick
fullScreenViewer.pagesButtons.prototype.onCreditsClick

fullScreenViewer.pagesButtons.prototype.setPagesCount = function (pagesCount, isAddHome, isAddCredits) {
    this.show();
    var me = fullScreenViewer.pagesButtons.instance;
    var holder = fullScreenViewer.pagesButtons.htmlHolder;
    holder.empty();
    this.currentPage = undefined;

    function bindSelectEffect(htmlButton) {
        $(holder).children().click(function(){
            holder.children().removeClass("selected");
            $(this).addClass("selected");
        });
    }

    function onButtonClick(index) {
        return function() {
            me.selectPage(index);
        }
    }

    function onHomeClick() {
        return function() {
            if(me.onHomeClick !== undefined)
                me.onHomeClick();
            me.currentPage = -1;
        }
    }

    function onCreditsClick() {
        return function() {
            if(me.onCreditsClick !== undefined)
                me.onCreditsClick();
            me.currentPage = -2;
        }
    }

    if(isAddHome !== undefined && isAddHome){
        var item = $('<li class="button-home"><img src="/assets/media/button_home.png"</li>');
        holder.append(item);
        item.click(onHomeClick());
    }
    for(var i = 1; i <= pagesCount; i++) {
        var item = $('<li>'+ i +'</li>');
        holder.append(item);
        item.click(onButtonClick(i - 1));
    }
    if(isAddCredits !== undefined && isAddCredits){
        var item = $('<li class="button-credits"> credits </li>');
        holder.append(item);
        item.click(onCreditsClick());
    }

    // TODO: think about it. 
    holder.children().first().addClass("selected");

    bindSelectEffect();

    var htmlClearItem = $('<div style="clear:both" />');
    holder.append(htmlClearItem);
}

fullScreenViewer.pagesButtons.prototype.selectPage = function (index) {
    if(this.currentPage !== undefined && this.currentPage == index)
        return;
    this.currentPage = index;
    var me = fullScreenViewer.pagesButtons.instance;
    me.onPageChange(index);
}

fullScreenViewer.pagesButtons.prototype.show = function() {
    fullScreenViewer.pagesButtons.htmlHolder.fadeIn();
}

fullScreenViewer.pagesButtons.prototype.hide = function() {
    var items = fullScreenViewer.pagesButtons.htmlHolder.find("li");
    if(items.length === 0) 
        return;
    for(var i = 0; i < items.length; i++) {
        items.delay((items.length - i) * 10).fadeOut("fast");
    }
}
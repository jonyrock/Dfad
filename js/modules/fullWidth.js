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
    if (touchDevice) {
        currWindowW = $(window).width() - templateMenuW;
    }

    textPageInstance.css("width", currWindowW);
    if ($("#module-full-width-holder-text", textPageInstance).height() > $(window).height() && !touchDevice) {
        currWindowW = currWindowW - $(t_scrBarV2).width();
    }
    textPageInstanceHolder.css("opacity", "0");
    textPageInstanceHolder.css("visibility", "visible");
    media.css("height", "200px");

    TweenMax.to(textPageInstanceHolder, .6, {css: {opacity: "1"}, ease: Circ.easeOut});

    if (media.attr("data-src") != undefined) {
        media.empty().append('<img onload="animateFullWidthMedia(this)" width="100%" />')
        $("img", media).css("opacity", "0").attr("src", media.attr("data-src"));
    } else {
        var vidMedia = $("#video-wrapper", media);
        if (touchDevice) {
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
    TweenMax.to($(src).parent(), .4, {css: {height: inst.height()}, easing: Sine.easeOut});
    TweenMax.to(inst, .4, {
        css: {opacity: '1'},
        easing: Sine.easeOut,
        onComplete:
                function() {
                    $(src).parent().css("overflow", "visible").css("height", "");
                    moduleUpdate_full_width(true);
                }
    });
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
var initialNumberColumns = 4;
var maximNumberColumns = 4;
var initialThumbW = 0;
var initialThumbH = 0;

function moduleFullWidthGallery() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    if (textPageInstance.length <= 0) 
        return;
    
    var galleryItem = $(".full-width-item", textPageInstance);
    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();

    initialThumbW = galleryItem.width();
    initialThumbH = galleryItem.height();

    if (touchDevice) {
        currWindowW = $(window).width() - get_OffsetWidth();
    }
    
    textPageInstance.css("width", currWindowW);
    textPageInstanceHolder.css("opacity", "0").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .6, { css: { opacity: "1" }, ease: Circ.easeOut });

    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    galleryItem.hover(
        function (event) { customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this)); },
        function (event) { customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this)); }
    );
    
    var viewer = fullScreenViewer.buildFromHtml();
    galleryItem.click(function () {
        var index = $(".full-width-item").index(this);
        viewer.showItemAt(index); 
    });
    
    moduleFullWidthGalleryOnResize();
}

function moduleFullWidthGalleryArrangeItems() {
    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    var itemW = currWindowW / maximNumberColumns;
    var currRatio = itemW / initialThumbW;
    var itemH = initialThumbH / initialThumbW * itemW;
    if (initialThumbW <= 0) {
        return;
    }

    if (touchDevice) {
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
            if (!touchDevice) {
                TweenMax.to($("img", this), 0.6, { css: { width: Math.round(itemW), height: Math.round(itemH) }, easing: Sine.easeOut });
                TweenMax.to($(this), 0.6, { css: { width: Math.round(itemW), height: Math.round(itemH), left: lefV, top: topV }, 
                    easing: Sine.easeOut });
            } else {
                $("img", this).css("width", Math.round(itemW)).css("height", Math.round(itemH));
                $(this).css("width", Math.round(itemW)).css("height", Math.round(itemH)).css("left", lefV).css("top", topV);
            }
        });
    lin++;
    $("div:first", textPageInstance).css("height", lin * Math.round(itemH));
}

function moduleFullWidthGalleryOnResize() {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-full-width-gallery", textPageInstanceHolder);
    var modulePositionType = textPageInstanceHolder.attr("data-id");
    if (textPageInstance.length > 0) {
        if (initialThumbW <= 0) return;
        moduleFullWidthGalleryArrangeItems();
        moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);
    }
}



/**
 * VERSION: 1.0
 * DATE: 2013-04-25
 *
 * @author: @jonyrock exclusively to dfad.com
 **/

function fullScreenViewer(mediaItems, mediaItemsHtml) {
    //TODO: do it like static vars
    var me = this;
    this.mediaItems = mediaItems;
    this.mediaItemsHtml = mediaItemsHtml;
    this.isVisible = false;
    this.htmlMediaHolder = $("#full-width-preview-media-holder");
    this.htmlHolder = $("#full-width-preview");
    this.htmlInfoHolder = this.htmlHolder.find("#full-width-preview-info-holder");
    this.htmlInfoHolderWidth = this.htmlInfoHolder.width();
    this.htmlInfoHolder.css("width", "0px");
}

fullScreenViewer.prototype.show = function() {
    if (this.isVisible)
        return;
    this.isVisible = true;    var me = this;
    this.htmlHolder.fadeIn();
    TweenMax.killTweensOf(this.htmlInfoHolder);
    alert(me.htmlInfoHolderWidth);
    TweenMax.to(this.htmlInfoHolder, 0.6, {
        css : {
            width : me.htmlInfoHolderWidth + "px"
        },
        ease : Sine.easeInOut
    });
}

fullScreenViewer.prototype.hide = function() {
    if (!this.isVisible)
        return;
    this.isVisible = false;
    this.htmlHolder.fadeOut();
    TweenMax.killTweensOf(this.htmlInfoHolder);
    TweenMax.to(this.htmlInfoHolder, 0.6, {
        css : {
            width : "0px"
        },
        ease : Sine.easeInOut
    });
}

fullScreenViewer.prototype.showItemAt = function(itemIndex) {
    if (!this.isVisible)
        this.show();
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








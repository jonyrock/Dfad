/**
 * VERSION: 1.0
 * DATE: 2013-04-25
 * 
 * @author: @jonyrock exclusively to dfad.com
 **/

function fullScreenViewer(mediaItems, mediaItemsHtml) {

    var me = this;
    this.mediaItems = mediaItems;
    this.mediaItemsHtml = mediaItemsHtml;
    this.isVisible = false;
    
}

fullScreenViewer.prototype.show = function(){
    if(this.isVisible)
        return;
    
}

fullScreenViewer.prototype.showItemAt = function(itemIndex) {
    if(!this.isVisible)
        this.show();
}

// FACTORIES
fullScreenViewer.buildFromHtml = function() {
    
    var previewMediaArr = new Array();
    var previewMediaDescArr = new Array();
    
    $("#full-width-preview #full-width-preview-media-holder")
        .find("#preview-media-holder").children().each(function (i) {
            if ($(this).attr("id") == "preview-media-image") {
                previewMediaArr[i] = '<img id="preview-media-image" src="' + $(this).attr("data-url") +
                    '" title="' + $(this).attr("data-title") + '"' +
                    ' alt="' + $(this).attr("data-alt") + '" />';
            } else if ($(this).attr("id") == "video-wrapper") {
                previewMediaArr[i] = $(this);
            } else if ($(this).attr("id") == "video-wrapper-collection") {
                previewMediaArr[i] = $(this);
            }
    });
    
    $(".full-width-info-holder").find(".full-width-info-holder-desc").each(function (i) {
        previewMediaDescArr[i] = $(this).get(0);
    });
    
    return new fullScreenViewer(previewMediaArr, previewMediaDescArr);
    
}


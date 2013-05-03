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

        if (availScrollbar.length > 0) {
            availScrollbar.css("height", winH).css("top", "0px");
        }

        switch (currModuleType) {
            case "full_width":
                moduleUpdate_full_width();
                break;
            case "contact":
                moduleUpdate_contact();
                break;
            case "full_width_gallery":
                moduleFullWidthGalleryOnResize();
                break;
            case "page_columns":
                moduleUpdate_page_columns(); // moved to pageColumns.js
                break;
        }
        moduleType = null;

        $("footer").css('display', 'inline').css('visibility', 'visible');

    }
);
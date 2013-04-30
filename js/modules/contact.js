var moduleContactHtmlHolder;

function moduleContact() {
    moduleContactHtmlHolder = $("#module-contact-page-holder");
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    var mapHolder = $("#module-container #module-contact-map-container");
    var winH = $(window).height();
    var winW = $(window).width();
    var mapW = screen.width; /**/
    var mapLeft = (-get_OffsetWidth()) * .5;
    var mapH = mapHolder.height();

    var modContact = $("#module-container #module-contact");
    var modContactH = modContact.height();
    var conH = ((winH - mapH) >= modContactH) ? (winH - mapH) : modContactH;
    modContact.attr("style", "bottom: " + (-conH) + "px; height: " + conH + "px; visibility: visible;");

    TweenMax.to(modContact, .6, {
        css: { bottom: "0px" },
        ease: Circ.easeInOut,
    });

    endModuleFunction = null;
    moduleEnd = true;

    try {
        // sometimes loading is impossible 
        moduleContactInitMap();
    } catch(e){}
    moduleUpdate_contact();
}

function moduleContactInitMap() {
    var latlng = new google.maps.LatLng(45.332126, -0.052088);
    var myOptions = {
        zoom: 2,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'tehgrayz']
        }
    };

    var map = new google.maps.Map(document.getElementById("module-contact-map-container"), myOptions);

    var stylez = [
    {
        featureType: "all",
        elementType: "all",
        stylers: [
          { saturation: -70 } // -100 is absolutlu gray , +100 is acid colors
        ]
    }
    ];
    var mapType = new google.maps.StyledMapType(stylez, { name: "Grayscale" });
    map.mapTypes.set('tehgrayz', mapType);
    map.setMapTypeId('tehgrayz');

    //markers
    var markerEurope = new google.maps.Marker({
        position: new google.maps.LatLng(59.925211, 30.370191),
        map: map,
        icon: "/assets/media/contact/contact_map_pin_europe.png"
    });

    var markerNorthAmerica = new google.maps.Marker({
        position: new google.maps.LatLng(34.069074, -118.40664),
        map: map,
        draggable : true, 
        icon:  { 
            url: "/assets/media/contact/contact_map_pin_north_america.png",
            anchor: new google.maps.Point(43, 47)
        }
    });

    var markerMiddleEast = new google.maps.Marker({
        position: new google.maps.LatLng(25.258669, 55.340538),
        map: map,
        icon:  { 
            url: "assets/media/contact/contact_map_pin_middle_east.png",
            anchor: new google.maps.Point(43, 47)
        }
    });

    var markerSouthEast = new google.maps.Marker({
        position: new google.maps.LatLng(25.259601, 55.323715),
        map: map,
        icon:  { 
            url: "assets/media/contact/contact_map_pin_south_east.png",
            anchor: new google.maps.Point(43, 47)
        }
    });
}

function moduleContactResizeHolder() {
    if(touchDevice) {
        moduleContactHtmlHolder.css("width","100%");
        return moduleContactHtmlHolder.width();
    }
    var newWidth = $("#module-container").width();
    moduleContactHtmlHolder.css("width", newWidth);
    if(moduleContactHtmlHolder.height() > $(window).height()){
        newWidth -= $(t_scrBarV2).width();
    }
    moduleContactHtmlHolder.css("width", newWidth);
    return newWidth;
}

function moduleUpdate_contact() {

    if(moduleContactHtmlHolder === undefined)
        return;

    // resize page holder and get new width
    var currentWidth = moduleContactResizeHolder();
    
    var blocksWidthPersent = 24;
    var blocksMarginPersent = 4.5;
    if(currentWidth <= 1024) {
        blocksWidthPersent = 31;
        blocksMarginPersent = 1;
    } if(currentWidth <= 794){
        blocksWidthPersent = 47;
        blocksMarginPersent = 1.5;
    } if(currentWidth <= 500) {
        blocksMarginPersent = 0;
        blocksWidthPersent = 99;
    } 
    
    moduleContactHtmlHolder.find(".module-contact-holder")
        .css("width", blocksWidthPersent+"%")
        .css("margin-left", blocksMarginPersent + "%")
        .css("margin-right", blocksMarginPersent + "%");
    
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

}



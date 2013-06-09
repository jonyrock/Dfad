var moduleContactHtmlHolder;

function moduleContact() {
    moduleContactHtmlHolder = $("#module-contact-page-holder");
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    if (textPageInstance.length <= 0) {
        return;
    }
    
    var modContact = $("#module-container #module-contact");
    modContact.attr("style", "visibility: visible;");
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
          { saturation: -70 } // -100 is absolute gray , +100 is acid colors
        ]
    }
    ];
    var mapType = new google.maps.StyledMapType(stylez, { name: "Grayscale" });
    map.mapTypes.set('tehgrayz', mapType);
    map.setMapTypeId('tehgrayz');

    //markers
    var markerEurope = new google.maps.Marker({
        position: new google.maps.LatLng(59.924998, 30.37014),
        map: map,
        icon:  { 
            url: "/assets/media/contact/contact_map_pin_europe.png",
            anchor: new google.maps.Point(43, 47)
        }
    });

    var markerNorthAmerica = new google.maps.Marker({
        position: new google.maps.LatLng(34.069092, -118.406739),
        map: map,
        draggable : true, 
        icon:  { 
            url: "/assets/media/contact/contact_map_pin_north_america.png",
            anchor: new google.maps.Point(43, 47)
        }
    });

    // var markerMiddleEast = new google.maps.Marker({
    //     position: new google.maps.LatLng(25.258669, 55.340538),
    //     map: map,
    //     icon:  { 
    //         url: "assets/media/contact/contact_map_pin_middle_east.png",
    //         anchor: new google.maps.Point(43, 47)
    //     }
    // });

    // var markerSouthEast = new google.maps.Marker({
    //     position: new google.maps.LatLng(25.259601, 55.323715),
    //     map: map,
    //     icon:  { 
    //         url: "assets/media/contact/contact_map_pin_south_east.png",
    //         anchor: new google.maps.Point(43, 47)
    //     }
    // });
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
    
    if(currentWidth > 580) {
        gap = currentWidth - 580;
        blockRowCount = 3;
        offset = gap / (blockRowCount * 2);
        
        moduleContactHtmlHolder.find(".module-contact-holder")
        .css("width", "250px")
        .css("margin-left", offset + "px")
        .css("margin-right", offset + "px");

    } 

    if(currentWidth <= 610) {
        moduleContactHtmlHolder.find(".module-contact-holder")
        .css("width", "99%")
        .css("margin-left", "0%")
        .css("margin-right", "0%");
    } 
    
    
    
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-wrapper", textPageInstanceHolder);
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

}



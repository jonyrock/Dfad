function moduleContact() {
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

    var currWindowW = $(window).width() - get_OffsetWidth() - $(t_scrBarV2).width();
    if (touchDevice) {
        currWindowW = $(window).width() - templateMenuW;
    }
    textPageInstance.css("width", currWindowW);

    if ($("div:first", textPageInstance).height() <= $(window).height()) {
        currWindowW = currWindowW + $(t_scrBarV2).width();
    }

    textPageInstance.css("width", currWindowW);
    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sideType);

    var modContact = $("#module-container #module-contact");
    var modContactH = modContact.height();
    var conH = ((winH - mapH) >= modContactH) ? (winH - mapH) : modContactH;
    modContact.attr("style", "bottom: " + (-conH) + "px; height: " + conH + "px; visibility: visible;");

    TweenMax.to(modContact, .6, {
        css: { bottom: "0px" },
        ease: Circ.easeInOut,
    });

    var modContainerW = $("#module-container").width();
    $("#module-contact-holder").css("left", (modContainerW - $("#module-contact-holder").width()) * .5 + "px");
    endModuleFunction = null;
    moduleEnd = true;

    moduleContactInitMap();
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


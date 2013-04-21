
MainMenuView.menuHolder         = "#template-menu";
MainMenuView.menuItemHolder     = "menu-option-holder";        // some class name
MainMenuView.menuItemBackground = "menu-option-background";    // some class in div
MainMenuView.menuAnimDuration   = 0.4;
MainMenuView.menuAnimEase       = Quad.easeOut;


function MainMenuView() {
    
    var me = this;
    
	$(function() {
	    me.menuHolderWidth = $(MainMenuView.menuHolder).width();
	    buildItems();
        if(!touchDevice)
            initHoveringAnimation();
	});
	
	function buildItems() {
	    me.items = new Array();
	    $(MainMenuView.menuHolder)
	    .find("." + MainMenuView.menuItemHolder)
	    .each(functon(i) {
	        me.items[i] = new Object();
	        me.items[i].holder = this;
	        $(this).prepend("<div class='" + MainMenuView.menuItemBackground + "'></div>");
	        me.items[i].back = $(this).find("." + MainMenuView.menuItemBackground);
	        me.items[i].index = i;
	        me.items[i].fixed = false;
	    })
	}
	
	function initHoveringAnimation() {
	    for(var item in me.items) {
	        $(item.holder).mouseenter(function() {
	            if(item.fixed) return;
                TweenMax.to(item.back, 
                    MainMenuView.menuAnimDuration, 
                    { css: { left: "0px"}, ease: MainMenuView.menuAnimEase });
	       });
	       $(item.holder).mouseleave(function() {
                if(item.fixed) return;
                TweenMax.to(item.back, 
                    MainMenuView.menuAnimDuration, 
                    { css: { left: me.menuHolderWidth + "px"}, ease: MainMenuView.menuAnimEase });
        });
	}
	
}

MainMenuView.prototype.setActive = function (menuItemIndex) {
    for(var item in me.items) {
        if(item.index == menuItemIndex) {
            item.fixed = true;
            if(!touchDevice) {
                $(item.holder).trigger("mouseenter");
            } else {
                $(item.back).show().css("left","0px")
            }
        } else {
            item.fixed = false;
            if(!touchDevice)
                $(item.holder).trigger("mouseleave");
        }
    });
}









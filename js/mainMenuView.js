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
	    .each(function(i) {
	        me.items[i] = new Object();
	        me.items[i].holder = $(this);
	        $(this).prepend("<div class='" + MainMenuView.menuItemBackground + "'></div>");
	        me.items[i].back = $(this).find("." + MainMenuView.menuItemBackground);
	        me.items[i].index = i;
	        me.items[i].selected = false;
	    });
	}
	
	function initHoveringAnimation() {
	    for(var i in me.items) {
	        var item = me.items[i];
	        $(item.holder).mouseenter(function() {
                // TODO: use item.back instead
                var back = $(this).find(".menu-option-background");
                back.show();
                TweenMax.to(back, 
                    MainMenuView.menuAnimDuration, 
                    { css: { left: "0px"}, ease: MainMenuView.menuAnimEase });
	       });
	       $(item.holder).mouseleave(function() {
                if(item.selected) return;
                var back = $(this).find(".menu-option-background");
                TweenMax.to(back, 
                    MainMenuView.menuAnimDuration, 
                    { css: { left: me.menuHolderWidth + "px"}, ease: MainMenuView.menuAnimEase });
            });
        }
	}
	
}

MainMenuView.prototype.setActive = function (menuItemIndex) {
    
    for(var i in this.items) {
        var item = this.items[i];
        if(item.index == menuItemIndex) {
            item.fixed = true;
            if(!touchDevice) {
                $(item.holder).trigger("mouseenter");
            } else {
                $(item.back).show().css("left", "0px");
            }
        } else {
            item.fixed = false;
            if(!touchDevice)
                $(item.holder).trigger("mouseleave");
        }
    }
}









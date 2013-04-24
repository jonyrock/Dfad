/**
 * VERSION: 1.0
 * DATE: 2013-04-22
 * 
 * @author: @jonyrock exclusively to dfad.com
 **/

MainMenuView.menuHolder         = "#template-menu";            // any jqery selector
MainMenuView.menuItemHolder     = "menu-option-holder";        // some class name
MainMenuView.menuItemBackground = "menu-option-background";    // some class name
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
	
	// helper function to solve closure problem
	// http://stackoverflow.com/questions/1140973/how-to-pass-local-variables-when-assigning-mouseover-via-anonymous-function          
	function menuItemIn (item) {
	    return function(){
            item.back.show();
            TweenMax.to(
                item.back, 
                MainMenuView.menuAnimDuration, 
                { css: { left: "0px"}, ease: MainMenuView.menuAnimEase }
             );	        
	    }
	}
	
	function menuItemOut (item) {
        return function(){
            if(item.selected) 
                return;
            TweenMax.to(
                item.back, 
                MainMenuView.menuAnimDuration, 
                { css: { left: me.menuHolderWidth + "px"}, ease: MainMenuView.menuAnimEase }
            );   
        }
    }
	
	function initHoveringAnimation() {
	    for(var i in me.items) {
            var item = me.items[i];
            $(item.holder).mouseenter(menuItemIn(item));
            $(item.holder).mouseleave(menuItemOut(item));
        }
	}
	
}

MainMenuView.prototype.setActive = function (menuItemIndex) {
    for(var i in this.items) {
        var item = this.items[i];
        if(item.index == menuItemIndex) {
            item.selected = true;
            if(!touchDevice) 
                $(item.holder).trigger("mouseenter");
            else 
                $(item.back).show().css("left", "0px");
        } else {
            item.selected = false;
            if(!touchDevice)
                $(item.holder).trigger("mouseleave");
            else
                $(item.back).hide();
        }
    }
}









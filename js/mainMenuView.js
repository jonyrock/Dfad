
MainMenuView.menuHolder         = "#template-menu";
MainMenuView.menuItemHolder     = "menu-option-holder";        // some class name
MainMenuView.menuItemBackground = "menu-option-background";    // some class in div


function MainMenuView() {
    
    var me = this;
    
	$(function() {
	    me.items = $(MainMenuView.menuHolder).find("." + MainMenuView.menuItemHolder);
        me.items.each(function() {
            $(this).prepend("<div class='" + MainMenuView.menuItemBackground + "'></div>");
            $(this).click(function (){ selectItem(this); });
        });
        
	});
	
	function selectItem(item) {
	    me.items.find("." + MainMenuView.menuItemBackground).hide();
	    $(item).find("." + MainMenuView.menuItemBackground).show().css("left","0px");
	    
	}
	
}

MainMenuView.prototype.setActive = function (menuItemIndex) {
    this.items.eq(menuItemIndex).trigger('click');
}

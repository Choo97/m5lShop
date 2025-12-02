$(function() {
	var tabs = $('.tabs li');

	for (var i = 0; i < tabs.length; i++) {
		tabs.eq(i).click(function() {
			activateTab(this.id);
		});
	}

	var tabContents = $('.tab_content');
/*
	for (var i = 0; i < tabContents.length; i++) {
		var items = tabContents.eq(i).find('.item');
		
		for (var j = 0; j < items.length; j++) {
			items.eq(j).click(function() {
				//order($(this));
				console.log("item clicked");
			});
		}
	}
*/
	activateTab('top');	// default tab
	
	

	function activateTab(tabId) {
		for (var i = 0; i < tabs.length; i++) {
			if (tabs.eq(i).attr('id') == tabId) {
				tabs.eq(i).addClass('active');
			} else {
				tabs.eq(i).removeClass('active');
			}
		}

		for (var i = 0; i < tabContents.length; i++) {
			if (tabContents.eq(i).attr('id') == 'tab_' + tabId) {
				tabContents.eq(i).addClass('active');
			} else {
				tabContents.eq(i).removeClass('active');
			}
		}
	}
	$("#cartListBtn").click(function(){			
			location.href="/shop/cartList";
	});
	$("#myPageBtn").click(function(){			
			location.href="/shop/mypage";
	});
	$("#logoutBtn").click(function(){			
			location.href="/shop/logout";
	});

});
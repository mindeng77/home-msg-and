/*******************************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ******************************************************************************/

myApp.controllers = {

    // ////////////////////////
	// Tabbar Page Controller //
	// ////////////////////////
	tabbarPage : function(page) {
		// Set button functionality to open/close the menu.
		page.querySelector('[component="button/menu"]').onclick = function() {
			document.querySelector('#mySplitter').left.toggle();
		};

		// Set button functionality to push 'new_task.html' page.
		Array.prototype.forEach.call(page.querySelectorAll('[component="button/new-task"]'), function(element) {
			element.onclick = function() {
				document.querySelector('#myNavigator').pushPage('new_task.html');
			};

			element.show && element.show(); // Fix ons-fab in Safari.
		});

		// Change tabbar animation depending on platform.
		var myTabbar = page.querySelector('#myTabbar');
		myTabbar.setAttribute('animation', ons.platform.isAndroid() ? 'slide' : 'none');
		
		myTabbar.addEventListener('postchange', function(event) {
			if (event.index == 2 && !myApp.user.isLogin()) {
				ons.notification.alert({
					title: '',
                    message: '로그인이 필요합니다',
                    buttonLabels: '확인',
                    callback: function() {
                    	myTabbar.setActiveTab(0);
                    }
                });
			} 
		});
	},

	// //////////////////////
	// Menu Page Controller //
	// //////////////////////
	menuPage : function(page) {
		// Set functionality for 'No Category' and 'All' default categories
		// respectively.
		myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item[category-id=""]'));
		myApp.services.categories.bindOnCheckboxChange(page.querySelector('#default-category-list ons-list-item:not([category-id])'));

		// Change splitter animation depending on platform.
		document.querySelector('#mySplitter').left.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');

		$(page).find('ons-list-item').click(function() {
			if ($(this).attr('href') != null) {
				$('#myNavigator')[0].pushPage($(this).attr('href'), {
					animation : 'slide'
				});
			} else if ($(this).attr('id') == 'menu_logout') {
				location.href = '/logout';
			}
		});
		if (myApp.user.isLogin()) {
			$(page).find('#menu_login').hide();
			$(page).find('#menu_logout').show();

			if (myApp.user.loginType == '1')
				$(page).find('#menu_reset_password').show();
		}
	},

	// //////////////////////////
	// New Task Page Controller //
	// //////////////////////////
	newTaskPage : function(page) {
		// Set button functionality to save a new task.
		Array.prototype.forEach.call(page.querySelectorAll('[component="button/save-task"]'), function(element) {
			element.onclick = function() {
				var newTitle = page.querySelector('#title-input').value;

				if (newTitle) {
					// If input title is not empty, create a new
					// task.
					myApp.services.tasks.create({
						title : newTitle,
						category : page.querySelector('#category-input').value,
						description : page.querySelector('#description-input').value,
						highlight : page.querySelector('#highlight-input').checked,
						urgent : page.querySelector('#urgent-input').checked
					});

					// Set selected category to 'All', refresh
					// and pop page.
					document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
					document.querySelector('#default-category-list ons-list-item').updateCategoryView();
					document.querySelector('#myNavigator').popPage();

				} else {
					// Show alert if the input title is empty.
					ons.notification.alert('You must provide a task title.');
				}
			};
		});
	},

	// //////////////////////////////
	// Details Task Page Controller //
	// /////////////////////////////
	detailsTaskPage : function(page) {
		// Get the element passed as argument to pushPage.
		var element = page.data.element;

		// Fill the view with the stored data.
		page.querySelector('#title-input').value = element.data.title;
		page.querySelector('#category-input').value = element.data.category;
		page.querySelector('#description-input').value = element.data.description;
		page.querySelector('#highlight-input').checked = element.data.highlight;
		page.querySelector('#urgent-input').checked = element.data.urgent;

		// Set button functionality to save an existing task.
		page.querySelector('[component="button/save-task"]').onclick = function() {
			var newTitle = page.querySelector('#title-input').value;

			if (newTitle) {
				// If input title is not empty, ask for confirmation before
				// saving.
				ons.notification.confirm({
					title : 'Save changes?',
					message : 'Previous data will be overwritten.',
					buttonLabels : [ 'Discard', 'Save' ]
				}).then(function(buttonIndex) {
					if (buttonIndex === 1) {
						// If 'Save' button was pressed,
						// overwrite the task.
						myApp.services.tasks.update(element, {
							title : newTitle,
							category : page.querySelector('#category-input').value,
							description : page.querySelector('#description-input').value,
							ugent : element.data.urgent,
							highlight : page.querySelector('#highlight-input').checked
						});

						// Set selected category to 'All',
						// refresh and pop page.
						document.querySelector('#default-category-list ons-list-item ons-radio').checked = true;
						document.querySelector('#default-category-list ons-list-item').updateCategoryView();
						document.querySelector('#myNavigator').popPage();
					}
				});

			} else {
				// Show alert if the input title is empty.
				ons.notification.alert('You must provide a task title.');
			}
		};
	},

	// //////////////////////////////
	// Details Shop Page Controller //
	// /////////////////////////////
	shopDetailPage : function(page) {
		// Get the element passed as argument to pushPage.
		var element = page.data.element;

		// Fill the view with the stored data.
		// page.querySelector('#title').html(element.data.shop_name);
		$('#title').html(element.data.shop_name);

		console.log(element.data);

	},

	// ////////////////////////////
	// Login Page Controller
	// //////////////////////////////
	loginPage : function(page) {

		// init
		myApp.services.user.loginInit(page);

		$(page).find('#link_join').click(function() {
			$('#myNavigator')[0].pushPage($(this).attr('href'), {
				animation : 'slide'
			});
			return false;
		});
	},

	// //////////////////////////////
	// Join Page Controller
	// //////////////////////////////
	joinPage : function(page) {

		// init
		myApp.services.user.joinInit(page);

		// email check
		$(page).find('#email').focusout(function() {
			if (myApp.services.user.isEmailDuplCheck || $(this).val().trim() == '')
				return;
			myApp.services.user.emailDuplCheck($(this).val());
		}).keyup(function() {
			var email = $(this).val();
			if (email != myApp.services.user.oldEmail) {
				myApp.services.user.isEmailDuplCheck = false;
				myApp.services.user.oldEmail = email;
			}
		});
	},

	// ////////////////////////////
	// Login Page Controller
	// //////////////////////////////
	resetPasswordPage : function(page) {

		// init
		myApp.services.user.resetPasswordInit(page);
		$(page).find('#show_email').val(myApp.user.email);
		$(page).find('#email').val(myApp.user.email);
	},

	// 찜한 관리사
	likeEmployeePage : function(page) {

	}
};
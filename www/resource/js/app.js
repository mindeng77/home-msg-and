// App logic.
window.myApp = {};

ons.platform.select('android');

var apiUrl = 'http://13.125.57.15';

document.addEventListener('init', function(event) {
    var page = event.target;
    
    // Each page calls its own initialization controller.
	if (myApp.controllers.hasOwnProperty(page.id)) {
		myApp.controllers[page.id](page);
	}

	// Fill the lists with initial data when the pages we need are ready.
	// This only happens once at the beginning of the app.
	if (page.id === 'menuPage' || page.id === 'pendingTasksPage') {
		if (document.querySelector('#menuPage')
				&& document.querySelector('#pendingTasksPage')
				&& !document.querySelector('#pendingTasksPage ons-list-item')) {
                            
            HMUtil.send({
                url: apiUrl + '/mobile/shop/list',
                data: {},
                success: function(result) {
                    shops = result.data.shopList;
                    shops.forEach(function(data) {
    		            myApp.services.tasks.create(data);
			        });
                }
            });        
			
		}
	}
});

ons.ready(function() {
    
    myApp.navigator.init();
    myApp.user.loginProcess();
            
    // android back button event
    document.addEventListener('backbutton', function(event) {
        myApp.navigator.back(event);
    }, false);
    
    
});
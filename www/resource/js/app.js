// App logic.
window.myApp = {};

ons.platform.select('android');

var apiUrl = 'http://13.125.57.15';
///var apiUrl = 'http://10.168.14.45:8080';

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
                           
            // get shop in some range               
            var onSuccess = function(position){
                console.log("latitude: "+position.coords.latitude);
                console.log("longitude: "+position.coords.longitude);
                
                HMUtil.send({
                    url: apiUrl + '/mobile/shop/list?latitude='+position.coords.latitude+'&longitude='+position.coords.longitude+'&range=3',
                    data: {},
                    success: function(result) {
                        shops = result.data.shopList;
                        shops.forEach(function(data) {
                            myApp.services.tasks.create(data);
    			        });
                    }
                });
            };
           
            // get all shop
            var onError = function(error){

                console.log(error.message);
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
            };
           
            var option = {
                frequency: 5000,
                timeout: 6000
            };
   
            navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
			
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
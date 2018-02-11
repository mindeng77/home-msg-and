// App logic.
window.myApp = {};

var isShowAppExitMessage = false;

document.addEventListener('init', function(event) {
    var page = event.target;
	console.log('init', page.id);

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
			myApp.services.fixtures.forEach(function(data) {
				myApp.services.tasks.create(data);
			});
		}
	}
});

ons.ready(function() {
    var appNavigator = document.querySelector('#myNavigator');
    ons.disableDeviceBackButtonHandler();
            
    // Use Cordova handler
    document.addEventListener('backbutton', function(event) {
        // Handle backbutton event
        
        if (appNavigator.pages.length > 1) {
            event.preventDefault();
            appNavigator.popPage();
        } else {
            if (!isShowAppExitMessage) {
                isShowAppExitMessage = true;
                ons.notification.confirm({
                    message: '종료하시겠습니까?',
                    buttonLabels: ['취소', '확인'],
                    callback: function(answer) {
                        if (answer == 0) {
                            isShowAppExitMessage = false;
                        } else if (answer == 1) {
                            navigator.app.exitApp();
                        }
                    }
                });
            }
        }
    }, false);
});
// App logic.
window.myApp = {};

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
    console.log("Onsen UI is ready!");
    ons.disableDeviceBackButtonHandler();
            
    // Use Cordova handler
    window.document.addEventListener('backbutton', function() {
        // Handle backbutton event
        alert('backbutton');
    }, false);
});
// This is a JavaScript file

myApp.navigator = {
    obj : {},
    isShowAppExitMessage : false,
    init: function(){
        obj = document.querySelector('#myNavigator');
        ons.disableDeviceBackButtonHandler();
    },
    back: function(event){
        if (obj.pages.length > 1) {
            event.preventDefault();
            obj.popPage();
        } else {
            
            if (this.isOpenMenu()) {
                this.closeMenu();
            } else if (!this.isShowAppExitMessage) {
                this.isShowAppExitMessage = true;
                ons.notification.confirm({
                    message: '종료하시겠습니까?',
                    buttonLabels: ['취소', '확인'],
                    callback: function(answer) {
                        if (answer == 0) {
                            this.isShowAppExitMessage = false;
                        } else if (answer == 1) {
                            navigator.app.exitApp();
                        }
                    }
                });
            }
        }
    },
    pop: function(){
       obj.popPage(); 
    },
    home: function(){
        for(var page in obj.pages) {
            obj.popPage();
        }
        closeMenu();
    },
    closeMenu: function() {
        document.querySelector('#mySplitter').left.close();
    },
    isOpenMenu: function() {
        return document.querySelector('#mySplitter').left.isOpen;
    }
}
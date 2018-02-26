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
                            myApp.navigator.isShowAppExitMessage = false;
                        } else if (answer == 1) {
                            navigator.app.exitApp();
                        }
                    }
                });
            }
        }
    },
    home: function(){
        if (obj.pages.length > 1) {
            obj.popPage({
                callback: function(){
                    myApp.navigator.home();
                }
            });
        }
        this.closeMenu();
    },
    closeMenu: function() {
        document.querySelector('#mySplitter').left.close();
    },
    isOpenMenu: function() {
        return document.querySelector('#mySplitter').left.isOpen;
    },
    reloadPage: function(id) {
        var page = null;
        var index = 0;
        
        for (var i = 0 ; i < obj.pages.length ; i++) {
            console.log('obj.pages[i].id=' + obj.pages[i].id);
            if (obj.pages[i].id == id) {
                page = obj.pages[i];
                index = i;
                obj.removePage(index);
                break;
            }
        }
        
        obj.insertPage(index, page);
    }
}
myApp.user = {
    getUserId : function() {
        return window.localStorage.getItem("userId");
    },
    getEmail : function() {
        return window.localStorage.getItem("email");
    },
    getLoginType : function() {
        return window.localStorage.getItem("loginType");
    },
    getUserType : function() {
        return window.localStorage.getItem("userType");
    },
	isLogin : function() {
		if (window.localStorage.getItem("userId") == null)
			return false;
		else
			return true;
	},
    setUserInfo : function(userId, email, loginType, userType) {
        window.localStorage.setItem('userId', userId);
        window.localStorage.setItem('email', email);
        window.localStorage.setItem('loginType', loginType);
        window.localStorage.setItem('userType', userType);
    },
    // 로그인 처리
	loginProcess : function() {
        if (this.isLogin()) {
            $('#menu_login').hide();
            $('#menu_logout').show();
    
            if (this.getLoginType() == '1')
                $('#menu_reset_password').show();
            
            $('#myInfo').text('(' + this.getEmail() + ')');
        }
	},
    // 로그아웃 처리
    logoutProcess: function() {
        window.localStorage.clear();
        $('#menu_login').show();
        $('#menu_logout').hide();
        $('#menu_reset_password').hide();
        $('#myInfo').text('');
    }
};
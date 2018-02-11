myApp.user = {

	email : '',
	loginType : '',

	isLogin : function() {
		if (this.email == '')
			return false;
		else
			return true;
	}, 
	setUser : function(email, loginType) {
		this.email = email;
		this.loginType = loginType;
	}
};
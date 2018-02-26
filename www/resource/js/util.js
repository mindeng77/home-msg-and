var HMUtil = new function() {
};

HMUtil.send = function(opts) {
	$.ajax({
		url : opts.url,
		method : (typeof (opts.method) == 'undefined') ? 'get' : opts.method,
		//contentType : (typeof (opts.contentType) == 'undefined') ? 'application/json' : opts.contentType,
		dataType : 'json',
		data : (typeof (opts.method) == 'undefined') ? $.param(opts.data) : JSON.stringify(opts.data),
		beforeSend : function(request) {
			request.setRequestHeader('isAjax', true);
            request.setRequestHeader('userId', myApp.user.getUserId());
		},
		success : function(data) {
        	console.log(data);
            if(data.success) {
                if(typeof(opts.success) == 'function') {
                    opts.success(data);
                } else {
            		ons.notification.alert({
						title: '',
						message: data.message,
						buttonLabels: '확인',
						callback: function() {
							if (opts.redirect)
		                		location.href = opts.redirect;
						}
					});
                }
            } else {
                if(typeof(opts.error)=='function') {
                    opts.error(data);
                } else {
                	ons.notification.alert({
						title: '',
						message: data.message,
						buttonLabels: '확인',
					});
                }
            }
        },
        error : function(data){
        	console.log(data);
            if(typeof(opts.error)=='function')
                opts.error(data);
            else {
            	if (data.status == 404) {
            		ons.notification.alert({
						title: '',
						message: '페이지를 찾을 수 없습니다.',
						buttonLabels: '확인'
					});
            	} else if (data.status == 405) {
            		ons.notification.alert({
						title: '',
						message: '요청 형식이 맞지 않습니다.',
						buttonLabels: '확인'
					});
            	} else {
            		ons.notification.alert({
						title: '',
						message: '시스템 에러입니다.',
						buttonLabels: '확인'
					});
            	}
            }
        }
	});
};

HMUtil.sendForm = function(obj, opts) {

    obj.ajaxForm({
    	beforeSend: function(request) {
    		request.setRequestHeader('accept', 'application/json');
            request.setRequestHeader('userId', myApp.user.getUserId());
    	},
    	beforeSubmit: function(formData, jqForm, options) {
    		if(typeof(opts.beforeSubmit)=='function')
                return opts.beforeSubmit(formData, jqForm, options);
            else
            	return true;
		},
        success : function(data) {
        	console.log(data);
            if(data.success) {
                if(typeof(opts.success)=='function') {
                    opts.success(data);
                } else {
                	console.log('util');
                	if (data.message) {
                		ons.notification.alert({
							title: '',
							message: data.message,
							buttonLabels: '확인',
							callback: function() {
								if (opts.redirect)
			                		location.href = opts.redirect;
							}
						});
                	}
                }
            } else {
                if(typeof(opts.error)=='function') {
                    opts.error(data);
                } else {
                	if (data.message) {
                		ons.notification.alert({
							title: '',
							message: data.message,
							buttonLabels: '확인'
						});
                	}
                }
            }
        },
        error : function(data){
        	console.log(data);
            if(typeof(opts.error)=='function')
                opts.error(data);
            else {
            	if (data.status == 404) {
            		ons.notification.alert({
						title: '',
						message: '페이지를 찾을 수 없습니다.',
						buttonLabels: '확인'
					});
            	} else if (data.status == 405) {
            		ons.notification.alert({
						title: '',
						message: '요청 형식이 맞지 않습니다.',
						buttonLabels: '확인'
					});
            	} else {
            		ons.notification.alert({
						title: '',
						message: '시스템 에러입니다.',
						buttonLabels: '확인'
					});
            	}
            }
        }
    });
};
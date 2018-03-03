/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {
    
	setLogin: function(email, loginType) {
		myApp.email = email;
		myApp.loginType = loginType;
	},
	isLogin: function() {
		return false;
	},

    /////////////////
    // Task Service //
    /////////////////
    tasks: {

        // Creates a new task and attaches it to the pending task list.
        create: function(data) {

            var employee_html = "";
            
            // Task item template.
            var taskItem = ons.createElement(
                // myabe category is undefined. it's okay...
                '<ons-list-item class="center" tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
                //'<ons-list-item class="center" tappable category="''">' +
                    '<ons-card style="width:100%;padding:5px;">'+
                        '<img style="width: 25%;float:left;height:158px;object-fit:cover;" src="'+apiUrl+"/mobile/image/"+data.image.image_id+'">'+
                        '<div class="content" style="padding-left:10px;margin-left:25%;width:75%;">'+
                            '<div>'+
                                '<img style="background:#888;float:right;height:60px;width:60px;margin-top:20px;margin-right:10px;" src="resource/img/phone.jpeg"/>'+
                                '<div class="title" style="font-size:12pt;color:#000;font-weight:bold;height:30px;line-height:30px;margin-right:80px;">'+data.shop_name+'</div>'+
                                '<div class="detail" style="font-size:11pt;color:#000;height:70px;margin-right:80px;">'+
                                    '<div class="profile_price" style="float:left;height:50px;margin-top:10px;margin-bottom:10px;width:150px;overflow:hidden;">'+data.profile+'<br>'+data.price+'</div>'+
                                    '<div class="employee" style="margin-left:150px;background:#ff0000;overflow:hidden;">'+employee_html+'</div>'+
                                '</div>'+
                            '</div>'+
                            '<div style="height:58px;line-height:58px;">'+
                                '<div style="display:inline;">'+
                                    //'<span style="font-size:9pt;color:#888;text-decoration:line-through;">'+(data.contents.price)+'원</span>'+
                                    //'<span style="margin-left:5px;margin-right:5px;">=&gt;</span>'+
                                    //'<span style="font-size:10pt;font-weight:bold;color:#ff8800;">'+(data.contents.price-data.contents.discount)+'원</span>' +
                                    '<span style="font-size:10pt;font-weight:bold;color:#ff8800;">'+(data.locations)+'</span>' +
                                '</div>'+
                                '<div style="display:inline;margin-left:40px;">'+
                                    '<img style="width:30px;height:30px;background:#888;" src="resource/img/location.jpg"/>'+
                                    //'<span style="height:30px;font-size:10pt;color:#000;margin-left:5px;">'+(distance/100).toFixed(1)+'km</span>'+
                                    '<span style="height:30px;font-size:10pt;color:#000;margin-left:5px;">'+3+'km</span>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</ons-card>'+
                '</ons-list-item>'
            );


            // Store data within the element.
            taskItem.data = data;

              /*
              // Add 'completion' functionality when the checkbox changes.
              taskItem.data.onCheckboxChange = function(event) {
                myApp.services.animators.swipe(taskItem, function() {
                  var listId = (taskItem.parentElement.id === 'pending-list' && event.target.checked) ? '#completed-list' : '#pending-list';
                  document.querySelector(listId).appendChild(taskItem);
                });
              };
        
              taskItem.addEventListener('change', taskItem.data.onCheckboxChange);
        
              // Add button functionality to remove a task.
              taskItem.querySelector('.right').onclick = function() {
                myApp.services.tasks.remove(taskItem);
              };
              */
            // Add functionality to push 'details_task.html' page with the current element as a parameter.
            taskItem.querySelector('.center').onclick = function() {
                document.querySelector('#myNavigator').pushPage('shop/shop_detail.html', {
                    animation: 'lift',
                    data: {
                        element: taskItem
                    }
                });
            };

            // Check if it's necessary to create new categories for this item.
            myApp.services.categories.updateAdd(taskItem.data.category);

            // Add the highlight if necessary.
            if (taskItem.data.highlight) {
                taskItem.classList.add('highlight');
            }

            // Insert urgent tasks at the top and non urgent tasks at the bottom.
            var pendingList = document.querySelector('#pending-list');
            pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
        },

        // Modifies the inner data and current view of an existing task.
        update: function(taskItem, data) {
            
            if (data.title !== taskItem.data.title) {
                // Update title view.
                taskItem.querySelector('.center').innerHTML = data.title;
            }

            if (data.category !== taskItem.data.category) {
                // Modify the item before updating categories.
                taskItem.setAttribute('category', myApp.services.categories.parseId(data.category));
                // Check if it's necessary to create new categories.
                myApp.services.categories.updateAdd(data.category);
                // Check if it's necessary to remove empty categories.
                myApp.services.categories.updateRemove(taskItem.data.category);
            }

            // Add or remove the highlight.
            taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');

            // Store the new data within the element.
            taskItem.data = data;
        },

        // Deletes a task item and its listeners.
        remove: function(taskItem) {
            taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);

            myApp.services.animators.remove(taskItem, function() {
                // Remove the item before updating the categories.
                taskItem.remove();
                // Check if the category has no items and remove it in that case.
                myApp.services.categories.updateRemove(taskItem.data.category);
            });
        }
    },

    /////////////////////
    // Category Service //
    ////////////////////
    categories: {

        // Creates a new category and attaches it to the custom category list.
        create: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);

            // Category item template.
            var categoryItem = ons.createElement(
                '<ons-list-item tappable category-id="' + categoryId + '">' +
                    '<div class="left">' +
                        '<ons-radio name="categoryGroup" input-id="radio-'  + categoryId + '"></ons-radio>' +
                    '</div>' +
                    '<label class="center" for="radio-' + categoryId + '">' +
                        (categoryLabel || 'No category') +
                    '</label>' +
                '</ons-list-item>'
            );

            // Adds filtering functionality to this category item.
            myApp.services.categories.bindOnCheckboxChange(categoryItem);

            // Attach the new category to the corresponding list.
            //document.querySelector('#custom-category-list').appendChild(categoryItem);
        },

        // On task creation/update, updates the category list adding new categories if needed.
        updateAdd: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);
            var categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryId + '"]');

            if (!categoryItem) {
                // If the category doesn't exist already, create it.
                myApp.services.categories.create(categoryLabel);
            }
        },

        // On task deletion/update, updates the category list removing categories without tasks if needed.
        updateRemove: function(categoryLabel) {
            var categoryId = myApp.services.categories.parseId(categoryLabel);
            var categoryItem = document.querySelector('#tabbarPage ons-list-item[category="' + categoryId + '"]');

            if (!categoryItem) {
                // If there are no tasks under this category, remove it.
                myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
            }
        },

        // Deletes a category item and its listeners.
        remove: function(categoryItem) {
            if (categoryItem) {
                // Remove listeners and the item itself.
                categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
                categoryItem.remove();
            }
        },

        // Adds filtering functionality to a category item.
        bindOnCheckboxChange: function(categoryItem) {
          /*
          var categoryId = categoryItem.getAttribute('category-id');
          var allItems = categoryId === null;

          categoryItem.updateCategoryView = function() {
            var query = '[category="' + (categoryId || '') + '"]';

            var taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
            for (var i = 0; i < taskItems.length; i++) {
              taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
            }
          };

          categoryItem.addEventListener('change', categoryItem.updateCategoryView);
          */
        },

        // Transforms a category name into a valid id.
        parseId: function(categoryLabel) {
            return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
        }
    },

    //////////////////////
    // Animation Service //
    /////////////////////
    animators: {

        // Swipe animation for task completion.
        swipe: function(listItem, callback) {
            var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
            listItem.classList.add('hide-children');
            listItem.classList.add(animation);

            setTimeout(function() {
                listItem.classList.remove(animation);
                listItem.classList.remove('hide-children');
                callback();
            }, 950);
        },

        // Remove animation for task deletion.
        remove: function(listItem, callback) {
            listItem.classList.add('animation-remove');
            listItem.classList.add('hide-children');

            setTimeout(function() {
                callback();
            }, 750);
        }
    },

    ////////////////////////
    // Initial Data Service //
    ////////////////////////
    
    fixtures: [{
        shop_id: '1',
        shop_name: '업체1',
        price: '35000',
        phone_no: '05512345678',
        point: '',
        profile: '좋은 업체입니다.',
        locations:'등촌동/가양동',
        employee: '[]'
    }, {
        shop_id: '1',
        shop_name: '업체2',
        price: '35000',
        phone_no: '05512345678',
        point: '',
        profile: '좋은 업체입니다.',
        locations:'강서구/은평구',
        employee: '[]'
    }, {
        shop_id: '1',
        shop_name: '업체3',
        price: '35000',
        phone_no: '05512345678',
        point: '',
        profile: '아주 좋은 업체입니다.',
        locations:'부산',
        employee: '[]'
    }],

    //////////////////////
    // User Service
    ////////////////////////
    user : {
        isEmailDuplCheck: false,
        oldEmail: '',	// 이미 체크한 이메일을 다시 체크하지 않기 위한 변수
        joinInit: function(page) {
            var $form = $(page).find('#join_form');
            $form.attr('action', 'http://13.125.57.15/join');
            HMUtil.sendForm($form, {
                beforeSubmit: function(formData, jqForm, options) {
                    if (!myApp.services.user.isEmailDuplCheck) {
                        ons.notification.alert({
                            title: '회원가입',
                            message: '이메일이 중복되거나 체크되지 않았습니다.',
                            buttonLabels: '확인'
                        });
                        return false;
                    }
                    var password, rePassword;
                    $.each(formData, function(index, item){
                        if (item.name == 'password')
                            password = item.value;
                        if (item.name == 're_password')
                            rePassword = item.value;
                    });
                    if (password != rePassword) {
                        ons.notification.alert({
                            title: '회원가입',
                            message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
                            buttonLabels: '확인'
                        });
                        return false;
                    }
                    return true;
                },
                success: function(data) {
                    if (data.message) {
                        ons.notification.alert({
                            title: '',
                            message: data.message,
                            buttonLabels: '확인',
                            callback: function() {
                                myApp.navigator.home();
                            }
                        });
                    }
                }
            });
        },
        emailDuplCheck: function(email) {
            HMUtil.send({
                url: apiUrl + '/emailDuplCheck',
                data: {
                    email: email
                },
                success: function(data) {

                    if (data.message) {
                        ons.notification.alert({
                            title: '이메일 중복체크',
                            message: data.message,
                            buttonLabels: '확인'
                        });
                    }

                    myApp.services.user.isEmailDuplCheck = true;
                    myApp.services.user.oldEmail = email;
                }
            });
        },
        loginInit: function(page) {
            var $form = $(page).find('#login_form');
            $form.attr('action', apiUrl + '/perform_login');
            HMUtil.sendForm($form, {
                beforeSubmit: function(formData, jqForm, options) {
                    return true;
                },
                success: function(response) {
                    
                    if (response.success === true) {
                        if (response.message) {
                            ons.notification.toast({
                                message: response.message,
                                timeout: 2000,
                                callback: function() {
                                    myApp.user.setUserInfo(response.data.userId, response.data.email, response.data.loginType);
                                    myApp.user.loginProcess();
                                    myApp.navigator.home();
                                }
                            });
                        }
                    } else {
                        if (response.message) {
                            ons.notification.alert({
                                title: '',
                                message: response.message
                            });
                        }
                    }
                }
            });
        },
        resetPasswordInit: function(page) {
            HMUtil.sendForm($(page).find('#reset_password_form'), {
                beforeSubmit: function(formData, jqForm, options) {
                    var password, rePassword;
                    $.each(formData, function(index, item){
                        if (item.name == 'passwd')
                            password = item.value;
                        if (item.name == 're_passwd')
                            rePassword = item.value;
                    });
                    if (password != rePassword) {
                        ons.notification.alert({
                            title: '비밀번호 변경',
                            message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
                            buttonLabels: '확인'
                        });
                        return false;
                    }
                    return true;
                },
                success: function(data) {
                    if (data.message) {
                        ons.notification.alert({
                            title: '',
                            message: data.message,
                            buttonLabels: '확인',
                            callback: function() {
                                location.href = contextRoot + 'mobile';
                            }
                        });
                    }
                }
            });
        }
    },
    employee : {
        // 내주변 관리사 목록 조회
        loadMyAreaEmployeeList: function(page) {
            navigator.geolocation.getCurrentPosition(function(position){
                HMUtil.send({
                    url: apiUrl + '/mobile/employee/list/range',
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        range: 3,
                        page: 1
                    },
                    success: function(result) {
                        myApp.services.employee.createList(result.data.employeeList);
                    }
                });
            }, function(message) {
                alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            }, {
                frequency: 5000,
                timeout: 6000
            });
        },
        // 관리사 목록 html 생성
        createList: function(employeeList) {
            
            var employeeElement = document.querySelector('#my-area-employee-list');
            
            employeeList.forEach(function(employee) {
            
                // item template.
                var item = ons.createElement(
                    '<ons-list-item class="center" tappable>' +
                        '<ons-card style="width:100%">'+
                            '<img style="width: 25%;float:left;height:100px;object-fit:cover;" src="' + apiUrl + "/mobile/image/" + employee.image.image_id+'">' +
                            '<div class="content" style="padding-left:10px;margin-left:25%;width:75%;">' +
                                '<p>' + employee.employee_name + '</p>' +
                                '<p>' + employee.profile + '</p>' +
                            '</div>' +
                        '</ons-card>' +
                    '</ons-list-item>'
                );
                
                // Store data within the element.
                item.data = employee;

                employeeElement.insertBefore(item, null);
            });
        }
    }
};

/*
 * Name: options.js
 * Description: Javascript file for the option page
 * Environment: All broswer
 * Version: 0.1
 */

(function() {

    // tab 切换
    $('.navigation a').click(function() {
        var classes = $(this).attr('class').split(' ');
        box = classes[0].split('_')[1],
        color = classes[2];

        $('.container > div').hide();
        $('.box_' + box).show();
        $('.container').attr('class', 'container ' + color + '_border');
    });

    userInfo.get(null, function(obj) {
        global.initForm();
        if (obj && obj.uid) {
            global.switchLoginStatus(obj.email);
        } else {
            global.switchLoginStatus(null);
        }
    });

    var global = {
        sendStatus: 0,
        initForm: function() {
            for (var key in this.bindEvent) {
                this.bindEvent[key]();
            }
        },
        reset: function() { // 重置表单
            var that = this;
            $('.account_info').find('account_email').html('');
            $('.box_account form')[0].reset();
            $('.wrong').removeClass('wrong');
            that.showFillPrompt(1);
        },
        check: function(el, onlyMail) { // 表单检查
            var EMAIL_MAX_LENGTH = 255,
            PASSWORD_MAX_LENGTH = 20,
            PASSWORD_MIN_LENGTH = 4;

            var $email = el.find('.email'),
            email = $email.attr('value'),
            emailLength = email.length,
            emailRegular = /[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9]+\.)+[a-z]{2,4}/,

            emailCheck = email.match(emailRegular) &&
                emailLength < EMAIL_MAX_LENGTH;

            var $password = el.find('.password'),
            passwordLength = $password.attr('value').length,

            passwordCheck = passwordLength >= PASSWORD_MIN_LENGTH &&
                passwordLength <= PASSWORD_MAX_LENGTH &&
                !$password.hasClass('grey');

            if (!emailCheck) {
                this.wrongValue($email);
                return false;
            }

            if (!onlyMail && !passwordCheck) {
                this.wrongValue($password);
                return false;
            }

            return true;
        },
        // 提示文字恢复和清除
        showFillPrompt: function(status) {
            var that = this;

            var $el = $('.signup .password'),
            $writeInput = $('<input type="password" class="password" />'),
            $promptInput = $('<input type="text" class="password grey" ' +
                             'value="请设置长度4到20位密码" />');

            if (status) {
                $el.replaceWith($promptInput);

                $('.signup .password').one('focus', function() {
                    that.showFillPrompt(0);
                });

            } else {
                $el.removeClass('grey').replaceWith($writeInput);
                $writeInput.trigger('focus');
            }
        },
        wrongValue: function(el) { // 非法输入提示
            el.addClass('wrong');
            el.one('input', function() {
                $(this).removeClass('wrong');
            });
        },
        bindEvent: {
            showPassword: function() { // 显示/隐藏密码
                $('.show_password').click(function() {
                    var $password = $(this).parent().find('.password');
                    value = $password.attr('value'),
                    $show = $('<input type="text" class="password" />'),
                    $hide = $('<input type="password" class="password" />'),
                    hideWords = '隐藏密码',
                    showWords = '显示密码';

                    if (!$password.hasClass('grey')) {
                        if ($password.attr('type') === 'password') {
                            $(this).html(hideWords);
                            $password.replaceWith($show.attr('value', value));
                        } else {
                            $(this).html(showWords);
                            $password.replaceWith($hide.attr('value', value));
                        }
                    }
                });
            },
            forgetPassword: function() {
                $('.forget_password').click(function() {
                    if (global.check($(this).parent(), 1)) {
                        alert('已发送重置邮件到您的注册邮箱，请根据邮件指引找回密码');
                    } else {
                        alert('请输入您的注册邮箱，以便给您发送重置密码邮件');
                    }
                });
            },
            clearPrompt: function() { // 清空填写提示
                $('.signup .password').one('focus', function() {
                    global.showFillPrompt(0);
                });
            },
            signup_submit: function() { // 注册按钮
                var that = global;

                $('.signup_submit').click(function() {
                    var email, password,
                    $parent = $(this).parent();

                    if (that.check($parent)) {

                        email = $parent.find('.email').attr('value'),
                        password = $parent.find('.password').attr('value');

                        if (!global.sendStatus) {
                            global.sendStatus = 1;
                            global.signup(email, password);
                        }
                    }
                });
            },
            login_submit: function() { // 登陆按钮
                var that = global;
                $('.login_submit').click(function() {

                    var email, password,
                    $parent = $(this).parent();

                    if (that.check($parent)) {

                        email = $parent.find('.email').attr('value'),
                        password = $parent.find('.password').attr('value');

                        if (!that.sendStatus) {
                            that.sendStatus = 1;
                            that.login(email, password);
                        }
                    }
                });
            },
            logout: function() {
                // 退出登陆
                $('.logout').click(function() {
                    global.logout();
                });
            }
        },
        signup: function(email, password) {
            signup({
                email: email,
                password: password
            }, {
                success: function(data) {
                    if (data.code === 0) {
                        alert('注册成功');
                        userInfo.set({
                            uid: data.uid,
                            email: email,
                            uniqueCode: data.uniqueCode
                        }, function() {
                            global.reset();
                            global.switchLoginStatus(email);
                        });
                    } else {
                        alert('错误' + data.code + ': ' + data.reason);
                    }
                    global.sendStatus = 0;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(textStatus + ':' + errorThrown);
                    global.sendStatus = 0;
                }
            });
        },
        login: function(email, password) {
            userInfo.get('uniqueCode', function(obj) {
                login({
                    email: email,
                    password: password,
                    uniqueCode: obj.uniqueCode || ''
                }, {
                    success: function(data, text) {
                        if (data.code === 0) {
                            alert('登陆成功');
                            global.reset();
                            userInfo.set({
                                uid: data.uid,
                                email: email,
                                UniqueCode: obj || data.uniqueCode
                            });
                            global.switchLoginStatus(email);
                        } else {
                            alert('错误' + data.code + ': ' + data.reason);
                        }
                        global.sendStatus = 0;
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert(textStatus + ':' + errorThrown);

                        global.sendStatus = 0;
                    }
                });
            });
        },
        logout: function() {
            userInfo.get(null, function(obj) {
                logout({
                    uid: obj.uid,
                    uniqueCode: obj.uniqueCode || ''
                }, {
                    success: function() {
                        userInfo.clear();
                        alert('注销成功');
                        global.switchLoginStatus(null);
                    },
                    error: function() {
                        alert('注销失败');
                    }
                });
            });
        },
        switchLoginStatus: function(email) { // 切换登陆态显示效果:登陆传入email,登出无参数
            if (email) {
                $('.account_info').show().find('.account_email').html(email);
                $('.box_account form').hide();
            } else {
                $('.box_account form').show();
                $('.account_info').hide();
            }
        }
    };

})();



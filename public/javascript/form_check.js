var ROOT_URL = 'http://127.0.0.1:3000';
window.onbeforeunload = function(){
    if($('#nickname').text()){
        $.get(ROOT_URL+'/updateLogin');
    }
};
$(function(){
    var a = 0, b = 0, c = 0, d = 0;
    $('#btn-reg').click(function(){
        if(a && b && c && d){
            $('#reg-form').submit();
        }
    });
    $('#username-reg').blur(function(){
        var username_val = $(this).val();
        if(username_val && username_val.length > 5){
            $.post(ROOT_URL+'/check', {
                username: username_val
            }, function(data){
                if(data === false){
                    $('#username-info-reg').css('color', 'green');
                    $('#username-info-reg').text('可以注册');
                    $('#username-reg').css('border-color', 'green');
                    a = 1;
                }else if(data === true){
                    $('#username-info-reg').css('color', 'red');
                    $('#username-info-reg').text('用户名已被注册!');
                    $('#username-reg').css('border-color', 'red');
                    a = 0;
                }
            });
        } else {
            $('#username-info-reg').text('');
            $('#username-reg').css('border-color', 'red');
            a = 0;
        }
    });
    $('#nickname-reg').blur(function(){
        if($(this).val()){
            $(this).css('border-color', 'green');
            b = 1;
        } else {
            $(this).css('border-color', 'red');
            b = 0;
        }
    });
    $('#pwd-reg').blur(function(){
        if($(this).val().length < 6){
            $('#pwd-reg').css('border-color', 'red');
            c = 0;
        }else{
            $('#pwd-reg').css('border-color', 'green');
            c = 1;
        }
    });
    $('#pwd-rep-reg').blur(function(){
        if(!$(this).val() || ($(this).val() !== $('#pwd-reg').val())){
            $('#pwd-rep-reg').css('border-color', 'red');
            d = 0;
        }else{
            $('#pwd-rep-reg').css('border-color', 'green');
            d = 1;
        }
    });
    $('#btn-login').click(function(){
        if(!($('#username-login').val()) || !($('#pwd-login').val())){
            $('#tip').text('用户名或密码错误!');
        }else{
            $.post(ROOT_URL+'/login', {
                username: $('#username-login').val(),
                pwd: $('#pwd-login').val()
            }, function (data) {
                if (data === false) {
                    $('#tip').text('用户名或密码错误!');
                } else $('#form-login').submit();
            });
        }
    });
});
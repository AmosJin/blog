// 处理登录
function vali_login(){
    a_username = $("#username").val();
    a_pwd = $("#pwd").val();

    v1 = a_username.length > 0;
    v2 = a_pwd.length > 0;

    if (v1 && v2) {
        target_url = "/blogs/admin/login/";
        $.post(target_url,
            {
                username: a_username,
                pwd: a_pwd
            },
            function(data){
               if(data=="ok"){
                location.href = "/blogs/admin/manage/";
               }
               else{
                $("#login-error").text("验证失败！");
                error_hint();
               }
            });
    }
    else{
        error_hint();
    }

    function error_hint(){
        shake_panel(".login");
        $(":text").val("");
        $(":password").val("");
        $("#login-error").delay(500).slideDown(200);
        $("#login-error").delay(150).slideUp(200);
        $(":text").focus();       
    }
}

// 面板摇晃提醒
function shake_panel(str){
    var $panel = $(str);
    box_left = ($(window).width() -  $panel.width()) / 2;
    $panel.css({'left': box_left,'position':'absolute'});
    for(var i=1; 4>=i; i++){
        $panel.animate({left:box_left-(40-10*i)},50);
        $panel.animate({left:box_left+2*(40-10*i)},50);
    }
}

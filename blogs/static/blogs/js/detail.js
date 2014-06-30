function add_favor(article_id){
	target_url = "/blogs/" + article_id + "/favor/?random=" + Math.random();

	$.get(target_url,function(data){
		$("#al-favor").show();
		$(".icon-heart").hide();
		$("#favor-num").text(data);
	});
}

function add_quote(id){
	// 先把所有的“引用评论框”关闭
	$(".quote_comment").hide("normal");
	div_id = "#quote_comment_" + id;

	//获取并设置“placeholder”
	var comment_on = "#comment_on_" + id;
	var comment_on_content = "#comment_on_content_" + id;
	var comment_content = "#comment_content_" + id;
	var str = "回复：" + $(comment_on).val() + "——" + $(comment_on_content).val();
	$(comment_content).attr("placeholder", str);

	$(div_id).show("normal");
}

function quote_close(id){
	id = "#quote_comment_" + id;
	$(id).hide("normal");
}

// 添加评论
function add_comment(article_id){
	// 获取填写值
	a_author = $("#comment_name").val();
	a_mail = $("#comment_mail").val();
	a_content = $("#comment_content").val();
	a_comment_on = $("#comment_on").val();
	a_comment_on_content = $("#comment_on_content").val();

	//邮箱验证正则
	mail_reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
	
	// 验证
	v1 = 0 < a_author.length && a_author.length < 40;
	v2 = mail_reg.test(a_mail);
	v3 = 0 < a_content.length && a_content.length < 1200;
	
	if(v1 && v2 && v3){
		target_url = "/blogs/" + article_id + "/comment/";
		$.post(target_url,
			{
				author: a_author,
				mail: a_mail,
				content: a_content,
				comment_on: a_comment_on,
				comment_on_content: a_comment_on_content
			},
			function(data){
				// 更改评论数
				$("#comment_num").html(data.comment_count);
				show_msg(data.comment_visible);
				clear_data();
				refresh_comment(data.comment_id, data.comment_visible, data.comment_visible_count);
			}, 'json'
		);
	}
	else{
		$("#alert_error").slideDown("normal");
		$("#alert_error").delay(1500).slideUp("normal");
	}

	function show_msg(comment_visible){
		if(comment_visible){
			$("#alert_success").slideDown("normal");
			$("#alert_success").delay(1500).slideUp("normal");
		}
		else{
			$("#alert_success_delay").slideDown("normal");
			$("#alert_success_delay").delay(1500).slideUp("normal");
		}
	}

	function clear_data(){
		$("#comment_name").val("");
		$("#comment_mail").val("");
		$("#comment_content").val("");
	}
}

// 刷新数据
function refresh_comment(comment_id, comment_visible, comment_visible_count){
	target_url = "/blogs/" + comment_id + "/" + comment_visible_count + "/add_comment/";

	$.post(target_url, function(data){
		if(comment_visible){
			// 若是第一篇可见评论，直接添加
			if(comment_visible_count == 1){
				$("#comment_content_body").html(data);
			}
			else{
				add_div = "#block-append_" + (comment_visible_count-1);
				$(add_div).html(data);
			}
		}			
	});
}

// 添加引用评论
function add_quote_comment(article_id, quote_id){
	// 获取填写值
	name_div = "#comment_name_" + quote_id;
	mail_div = "#comment_mail_" + quote_id;
	content_div = "#comment_content_" + quote_id;
	on_div = "#comment_on_" + quote_id;
	on_content_div = "#comment_on_content_" + quote_id;

	a_author = $(name_div).val();
	a_mail = $(mail_div).val();
	a_content = $(content_div).val();
	a_comment_on = $(on_div).val();
	a_comment_on_content = $(on_content_div).val();

	//邮箱验证正则
	mail_reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
	
	// 验证
	v1 = 0 < a_author.length && a_author.length < 40;
	v2 = mail_reg.test(a_mail);
	v3 = 0 < a_content.length && a_content.length < 1200;
	
	if(v1 && v2 && v3){
		target_url = "/blogs/" + article_id + "/comment/";
		$.post(target_url,
			{
				author: a_author,
				mail: a_mail,
				content: a_content,
				comment_on: a_comment_on,
				comment_on_content: a_comment_on_content
			},
			function(data){
				// 更改评论数
				$("#comment_num").html(data.comment_count);
				show_msg(data.comment_visible);
				clear_data();
				refresh_comment(data.comment_id, data.comment_visible, data.comment_visible_count);
			}, 'json'
		);
	}
	else{
		error_div = "#alert_error_" + quote_id;
		$(error_div).slideDown("normal");
		$(error_div).delay(1500).slideUp("normal");
	}

	function show_msg(comment_visible){
		close_id = "#quote_comment_" + quote_id;
		if(comment_visible){
			success_div = "#alert_success_" + quote_id;
			$(success_div).slideDown("normal");
			$(success_div).delay(1500).slideUp("normal");
			$(close_id).delay(1500).hide("normal");
		}
		else{
			success_delay_div = "#alert_success_delay_" + quote_id;
			$(success_delay_div).slideDown("normal");
			$(success_delay_div).delay(1500).slideUp("normal");
			$(close_id).delay(1500).hide("normal");
		}
	}

	function clear_data(){
		$(name_div).val("");
		$(mail_div).val("");
		$(content_div).val("");
	}
}

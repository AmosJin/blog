// 编辑器工具栏监听
$(window).scroll(function () {
   if ($(window).scrollTop() >= 190) {
    $("#new-toolbar").addClass("float-toolbar");
   }
   if ($(window).scrollTop() < 190) {
    $("#new-toolbar").removeClass("float-toolbar");
   }
});

// 
$(document).ready(function(){
	if($(".tab-pane").hasClass("active")){
		// new_article();
		article_manage();
	}
});

function new_show_more(){
	$(".editor-more").slideToggle("normal");
}

function new_more_close() {
	$(".editor-more").slideUp("normal");
}

// 新建文章模块
function new_article(){
	target_url = "/blogs/admin/manage/new/";
	$.get(target_url,function(data){
		$(".new").html(data);
	});
}

// 文章管理模块
function article_manage(){
	target_url = "/blogs/admin/manage/article_manage/";
	$.get(target_url,function(data){
		$(".article").html(data);
	});
}


// 文章管理的分页
function pagination_first(){
	page_id = $("#page_first").val();
	target_url = "/blogs/admin/manage/article_manage/" + page_id;
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});
}
function pagination_pre(){
	page_id = $("#page_pre").val();
	target_url = "/blogs/admin/manage/article_manage/" + page_id;
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});
}
function pagination_next(){
	page_id = $("#page_next").val();
	target_url = "/blogs/admin/manage/article_manage/" + page_id;
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});
}
function pagination_end(){
	page_id = $("#page_end").val();
	target_url = "/blogs/admin/manage/article_manage/" + page_id;
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});
}




function article_cancel(){
	$("#editor").html("");
	$(".doc-title").val("");
}

// 文章发布函数
function article_post(){
	// 获取数据
	a_title = $(".doc-title").val();
	a_content = $("#editor").html();
	a_visible = $("#new_visible").is(':checked');
	a_allow = $("#new_allow_comment").is(':checked');

	// alert("a_title: " + a_title + "\n a_content: " + a_content + "\n a_visible: " + 
	// 	a_visible + "\n a_allow: " + a_allow);
	if(a_title.length == 0){
		$("#alert_wrong_new_msg").html("文章标题为空！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$(".doc-title").focus();
		return;
	}
	if(a_title.length > 60){
		$("#alert_wrong_new_msg").html("文章标题不能超过60个字符！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$(".doc-title").focus();
		return;
	}

	if(a_content.length == 0){
		$("#alert_wrong_new_msg").html("文章内容为空！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$("#editor").focus();
		return;
	}

	target_url = "/blogs/admin/manage/article_add/";
	$.post(target_url,
		{
			title: a_title,
			content: a_content,
			visible: a_visible,
			allow: a_allow,
		},
		function(data){
			if(data.status == "ok"){
				$("#new-article").hide();
				$("#editor").html("");
				$("#reedit_article_btn").attr("value", data.article_id);
				$("#reedit_article_btn").show();
				if(a_visible == true){
					$("#view_article_btn").attr("value", data.article_id);
					$("#view_article_btn").show();
				}

				$(".post-success .title").text(a_title);
				$(".post-success .content").html(a_content);
				$(".post-success").show();
				$("html,body").animate({ scrollTop: 0}, 500);
				$("#alert_success_new").slideDown("normal");
				$("#alert_success_new").delay(2000).slideUp("normal");
			}
			else{
				$("html,body").animate({ scrollTop: 0}, 500); 
				$("#alert_error_new").slideDown("normal");
			}
		}, 'json'
	);
}

// 再次编辑文章
function reedit_article(article_id){
	$("#article-view-delete-alert").slideUp();
	
	a_title = $(".post-success .title").text();
	a_content = $(".post-success .content").html();

	// alert("title: " + a_title + "\n content: " + a_content);
	// 重置查看区
	$(".post-success .title").text("");
	$(".post-success .content").html("");
	$("#reedit_article_btn").hide();
	$("#view_article_btn").hide();
	$(".post-success").hide();

	// 生成编辑区
	$("#new_post_orig").hide();
	$(".doc-title").val(a_title);
	$("#editor").html(a_content);
	$("#new_post_update").show();
	$("#new-article").show();
	$("#article_update_id").val(article_id);
}

function view_article(article_id){
	location.href = "/blogs/" + article_id;
}

function article_update(){
	// 获取数据
	a_id = $("#article_update_id").val();
	a_title = $(".doc-title").val();
	a_content = $("#editor").html();
	a_visible = $("#new_visible").is(':checked');
	a_allow = $("#new_allow_comment").is(':checked');

	// alert("a_id: " + a_id + "\n a_title: " + a_title + "\n a_content: " + a_content + "\n a_visible: " + 
	// 	a_visible + "\n a_allow: " + a_allow);
	if(a_title.length == 0){
		$("#alert_wrong_new_msg").html("文章标题为空！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$(".doc-title").focus();
		return;
	}
	if(a_title.length > 60){
		$("#alert_wrong_new_msg").html("文章标题不能超过60个字符！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$(".doc-title").focus();
		return;
	}

	if(a_content.length == 0){
		$("#alert_wrong_new_msg").html("文章内容为空！");
		$("#alert_wrong_new").fadeIn("normal");
		$("#alert_wrong_new").delay(500).fadeOut("normal");
		$("#editor").focus();
		return;
	}

	target_url = "/blogs/admin/manage/article_update/";
	$.post(target_url,
		{
			id: a_id,
			title: a_title,
			content: a_content,
			visible: a_visible,
			allow: a_allow,
		},
		function(data){
			if(data.status == "ok"){
				$("#new-article").hide();
				$("#editor").html("");
				$("#reedit_article_btn").attr("value", data.article_id);
				$("#reedit_article_btn").show();
				if(a_visible == true){
					$("#view_article_btn").attr("value", data.article_id);
					$("#view_article_btn").show();
				}

				$(".post-success .title").text(a_title);
				$(".post-success .content").html(a_content);
				$(".post-success").show();
				$("html,body").animate({ scrollTop: 0}, 500);
				$("#alert_success_new").slideDown("normal");
				$("#alert_success_new").delay(2000).slideUp("normal");
			}
			else{
				$("html,body").animate({ scrollTop: 0}, 500); 
				$("#alert_error_new").slideDown("normal");
			}
		}, 'json'
	);	
}

function article_update_cancel(){
	a_id = $("#article_update_id").val();

	target_url = "/blogs/admin/manage/simple_article/";
	$.post(target_url,
		{
			id:a_id,
		},
		function(data){
			// alert("title: " + data.article_title + "\n content: " + data.article_content +
			// 	"\n visible:" + data.article_visible);
			a_title = data.article_title;
			a_content = data.article_content;
			a_visible = data.article_visible;
		}, "json"
	);

	// alert(a_content);

	$("#new-article").hide();
	$("#editor").html("");
	$("#reedit_article_btn").attr("value", a_id);
	$("#reedit_article_btn").show();
	if(a_visible == true){
		$("#view_article_btn").attr("value", a_id);
		$("#view_article_btn").show();
	}

	$(".post-success .title").text(a_title);
	$(".post-success .content").html(a_content);
	$(".post-success").show();
	$("html,body").animate({ scrollTop: 0}, 500);
}

function alert_error_new_close(){
	$("#alert_error_new").hide();
}

function delete_article_close(){
	$("#article-view-delete-alert").slideUp();
}

function delete_article_hint(){
	$("#delete_article_title").text($(".post-success .title").text());
	$("#article-view-delete-alert").slideDown();
}

function delete_article_confirm(){
	a_id = $("#reedit_article_btn").val();
	target_url = "/blogs/admin/manage/article_delete/";
 
 	$.post(target_url,
		{
			id:a_id
		},
		function(data, status){
			if (status == "success") {
				$("#article-view-delete-alert").slideUp();
				alert("删除成功！");
				location.href = "/blogs/admin/manage/";
				return;
			}
			else{
				alert("删除失败！");
				return;
			}
		}
	);
}



// 文章管理模块-文章预览
function article_preview(article_id, page_num){
	// 生成返回列表的链接
	$("#article_area_extra_info").show();
	$("#article_area_extra_info").html("<button class=\"btn btn-link\" " +
		"onclick=\"article_back(" + page_num + ")\"><<返回文章列表</button>" +
		"<input type=\"hidden\" id=\"article_hidden_page_num\" value=\"" +
		page_num + "\" >");
	

	// 生成文章预览
	target_url = "/blogs/admin/manage/article_manage/" + article_id;
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});

}


// 文章管理模块-返回文章分页
function article_back(page_num){
	target_url = "/blogs/admin/manage/article_manage/?page=" + page_num;
	$.get(target_url,function(data){
		$(".article").hide();
		$(".article").html(data);
		$(".article").slideDown(200);
		// $("html,body").animate({ scrollTop: 0}, 500);
	});

	// 使用完毕后隐藏
	$("#article_area_extra_info").delay(500).hide();
}

// 文章管理模块-再次编辑
function article_reedit_article(article_id){
	target_url = "/blogs/admin/manage/article_manage/" + article_id + "/article_re_edit/";
	$.get(target_url,function(data){
		$(".article").html(data);
		$("html,body").animate({ scrollTop: 0}, 500);
	});
}

// 文章管理模块-取消更新
function article_article_cancel(article_id){
	page_num = $("#article_hidden_page_num").val();
	article_preview(article_id, page_num);
}

// 文章管理模块-文章更新
function article_article_update(article_id){
	a_title = $(".article-doc-title").val();
	a_content = $(".article_re_edit_editor").html();
	a_visible = $("#article_visible").is(':checked');
	a_allow = $("#article_allow_comment").is(':checked');

	// alert("a_id: " + article_id + "\n a_title: " + a_title + "\n a_content: " + a_content + "\n a_visible: " + 
	// 	a_visible + "\n a_allow: " + a_allow);

	if(a_title.length == 0){
		$("#article_alert_wrong_new_msg").html("文章标题为空！");
		$("#article_alert_wrong_new").fadeIn("normal");
		$("#article_alert_wrong_new").delay(500).fadeOut("normal");
		$(".article-doc-title").focus();
		return;
	}
	if(a_title.length > 60){
		$("#article_alert_wrong_new_msg").html("文章标题不能超过60个字符！");
		$("#article_alert_wrong_new").fadeIn("normal");
		$("#article_alert_wrong_new").delay(500).fadeOut("normal");
		$(".article-doc-title").focus();
		return;
	}

	if(a_content.length == 0){
		$("#article_alert_wrong_new_msg").html("文章内容为空！");
		$("#article_alert_wrong_new").fadeIn("normal");
		$("#article_alert_wrong_new").delay(500).fadeOut("normal");
		$("#editor").focus();
		return;
	}

	target_url = "/blogs/admin/manage/article_update/";
	$.post(target_url,
		{
			id: article_id,
			title: a_title,
			content: a_content,
			visible: a_visible,
			allow: a_allow,
		},
		function(data){
			if(data.status == "ok"){
				article_article_cancel(article_id);
				$("#alert_success_change_article").slideDown();
				$("#alert_success_change_article").delay(1000).slideUp();				
			}
			else{
				$("html,body").animate({ scrollTop: 0}, 500); 
				$("#article_alert_error_new").slideDown("normal");
			}
		}, 'json'
	);	
}

function article_alert_error_new_close(){
	$("#article_alert_error_new").hide();
}

function article_show_more(){
	$("#article_show_more").slideDown();
}

function article_more_close(){
	$("#article_more_close").slideUp()
}

function article_delete_article_hint(){
	$("#article-preview-delete-alert").slideDown();
}

function article_delete_article_close(){
	$("#article-preview-delete-alert").slideUp();
}

function article_delete_article_confirm(article_id){
	target_url = "/blogs/admin/manage/article_delete/";
 
 	$.post(target_url,
		{
			id:article_id
		},
		function(data, status){
			if (status == "success") {
				$("#article-preview-delete-alert").slideUp();
				alert("删除成功！");
				article_manage();
				return;
			}
			else{
				alert("删除失败！");
				return;
			}
		}
	);
 }

 function article_manage_delete(article_id){
 	article_delete_article_confirm(article_id);
 }
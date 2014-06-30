# coding=utf
from django.shortcuts import render, get_object_or_404, render_to_response
from blogs.models import Blog, Article, Comment, System
from blogs.forms import CommentForm, ArticleForm
from django.http import HttpResponse
from django.utils import timezone
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils import simplejson
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required

# 防止溢出，整数的上限
max_int = 9223372036854775807

# 首页
def index(request):
	# 网站第一次初始化，增加示例页面
	system = get_object_or_404(System, pk=1)
	if system.system_initial == True:
		system.system_initial = False
		system.save()
		article = Article(article_title='世界，你好！', article_date=timezone.now(),
			article_content='欢迎使用。这是系统自动生成的演示文章。编辑或者删除它，然后开始您的博客！')
		article.save()
		comment_1 = article.comment_set.create(comment_author='紫霞客', comment_mail='demo@demo.io',
			comment_content='您好，这是一条评论。登录后您可以编辑或者删除该评论。', comment_on='',
			comment_on_content='', comment_visible=True)
		comment_1.save()

		comment_2 = article.comment_set.create(comment_author='无间道', comment_mail='demo2@demo.io',
			comment_content='Django，你好！我是来评论紫霞客的。这是一条“引用”评论。', comment_on='紫霞客',
			comment_on_content='您好，这是一条评论。登录后您可以编辑或者删除该评论...', comment_visible=True)
		comment_2.save()

	# 获取博客和文章信息
	blog = get_object_or_404(Blog, pk=1)
	article_list = Article.objects.filter(article_visible=True).order_by('-article_date')
	
	# 分页
	paginator = Paginator(article_list, 6)
	page = int(request.GET.get('page', 1))
	articles = paginator.page(page)

	try:
		articles = paginator.page(page)
	except PageNotAnInteger:
		articles = paginator.page(1)
	except EmptyPage:
		articles = paginator.page(paginator.num_pages)
	
	context = {
	'blog': blog,
	'articles': articles,
    }
	
	return render_to_response('blogs/index.html', context)



# 文章详情页面
def detail(request, article_id):

	# 获取博客及文章
	blog = get_object_or_404(Blog, pk=1)
	article = get_object_or_404(Article, pk=article_id, article_visible=True)
	comments = article.comment_set.filter(comment_visible=True)

	# 页面导航，获取前一篇和后一篇
	# 前一篇的处理稍微复杂，原因在于“在某个日期之前的过滤结果“，”最早的“总是为第1个元素
	# 而其实”最后一个“才是我们想要的
	try:
		article_pre_set = Article.objects.filter(article_date__lt = article.article_date, article_visible=True)
		set_count = article_pre_set.count()
		
		index = 0
		if set_count > 1:
			index = set_count - 1;

		article_pre = article_pre_set[index]
		id_pre = article_pre.id
	except IndexError:
		article_pre = None
		id_pre = None	
	
	try:
		article_next = Article.objects.filter(article_date__gt = article.article_date, article_visible=True)[0]
		id_next = article_next.id
	except IndexError:
		article_next = None		
		id_next = None		
	

	# 每次请求，文章的浏览量加1，基于session
	# 下面的判断是防止次数“溢出”，导致数据库写入错误
	session_key = 'browsed' + str(article_id)
	if not request.session.get(session_key):
		article.article_browsed_times += 1
		if article.article_browsed_times > max_int:
			article.article_browsed_times = max_int
		article.save()
		request.session[session_key] = True

	# 判断是否已经对该文章喜欢
	session_key = 'favored' + str(article_id)
	favored = False
	if request.session.get(session_key):
		favored = True

	# 系统评论的状态
	system_allow_comment = System.objects.get(pk=1).comment_allow

	context = {
		'blog':blog,
		'article':article,
		'comments': comments,
		'sys_comment':system_allow_comment,
		'id_pre': id_pre,
		'article_pre': article_pre,
		'id_next': id_next,
		'article_next': article_next,
		'favored': favored
	}

	return render(request, 'blogs/detail.html', context)


# 评论模块
# @csrf_protect 
def comment(request, article_id):
	article = get_object_or_404(Article, pk=article_id)	#待处理
	system = get_object_or_404(System, pk=1)	#待处理

	# 获取表单数据，使用FormModels进行合法性验证
	author = request.POST['author']
	content = request.POST['content']
	mail = request.POST['mail']
	on = request.POST['comment_on']
	on_content = request.POST['comment_on_content']

	# 检查系统是否开启评论审核
	comment_visible = False
	if not system.comment_check:
		comment_visible = True

	# 创建表单对象，对提交数据进行验证
	comment_data = {'comment_author':author, 'comment_content':content, 'comment_mail':mail}
	comment = CommentForm(comment_data)

	# 最新的评论数据
	data = {'author':author, 'content':content, 'on': on, 'on_content':on_content, 'visible':comment_visible}

	if comment.is_valid():
		comment = article.comment_set.create(comment_author=author, comment_content=content,
			comment_mail=mail, comment_visible=comment_visible,
			comment_on=on,comment_on_content=on_content)
		comment.save()

		data = {
			'comment_id': comment.id,
			'comment_visible': comment_visible,
			'comment_count': article.comment_set.count(),
			'comment_visible_count': article.comment_set.filter(comment_visible=True).count()
		}
		# 返回JSON格式的数据
		return HttpResponse(simplejson.dumps(data, ensure_ascii=False))
	else:
		errors = ''
		for error in comment.errors:
			errors += str(comment.errors[error])

		return HttpResponse(errors)


# 处理页面的“添加评论”
def add_comment(request, comment_id, visible_count):
	comment = get_object_or_404(Comment, pk=comment_id)
	article = get_object_or_404(Article, pk=comment.article_id)

	# 系统评论的状态
	system_allow_comment = System.objects.get(pk=1).comment_allow

	context = {
		'id': visible_count,
		'comment': comment,
		'article_id': article.id,
		'sys_comment': system_allow_comment
	}

	return render(request, 'blogs/add_comment.html', context)


# 文章喜欢功能：创建Session
def favor(request, article_id):
	article = get_object_or_404(Article, pk=article_id)	#待处理

	# Session的键值
	session_key = 'favored' + str(article_id)

	if not request.session.get(session_key):
		article.article_favorite_times += 1
		if article.article_favorite_times > max_int:
			article.article_favorite_times = max_int
		article.save()
		request.session[session_key] = True

	# 返回喜欢的总次数
	return HttpResponse(article.article_favorite_times)

# 后台登录视图
def admin(request):
	blog = get_object_or_404(Blog, pk=1)
	context = {
		'blog':blog,
	}	

	# 已登录重定向
	if request.user.is_authenticated():
		return render(request, 'blogs_admin/admin_base.html',context)

	return render(request, 'blogs_admin/login.html',context)

# 后台登录处理，前台Ajax请求
def login_view(request):
	username = request.POST['username']
	password = request.POST['pwd']

	user = authenticate(username=username, password=password)

	if user is not None and user.is_active:
		login(request, user)
		return HttpResponse('ok')
	else:
		return HttpResponse('error')


# 注销
# 转到登录页面
def logout_view(request):
	logout(request)
	blog = get_object_or_404(Blog, pk=1)
	return render(request, 'blogs_admin/login.html',{'blog':blog})


# 后台首页
@login_required(login_url='/blogs/admin/')
def manage(request):
	blog = get_object_or_404(Blog, pk=1)
	return render(request, 'blogs_admin/admin_base.html',{'blog':blog})


# 文章编辑器
def new_view(request):
	return render(request, 'blogs_admin/new.html', {})


# 添加文章
@login_required(login_url='/blogs/admin/')
# @csrf_protect
def article_add(request):
	# 获取表单数据
	title = request.POST['title']
	content = request.POST['content']
	visible = request.POST['visible']
	allow = request.POST['allow']

	# jquery的返回值和Python的不同，true|false > True|False
	if visible == 'true':
		visible = True
	else:
		visible = False
	
	if allow == 'true':
		allow = True
	else:
		allow = False
	
	# 创建ArticleForm对象对数据验证
	article_data = {'article_title':title, 'article_content':content}
	article_val = ArticleForm(article_data)

	if article_val.is_valid():
		article = Article(article_title=title, article_date=timezone.now(), article_content=content,
			article_allow_comment=allow, article_visible=visible)
		article.save()

		data = {
			'status':'ok',
			'article_id':article.id,
		}
	else:
		data = {
			'status':'error',
		}

	return HttpResponse(simplejson.dumps(data, ensure_ascii=False))


# 更新文章
@login_required(login_url='/blogs/admin/')
# @csrf_protect
def article_update(request):
	# 获取表单数据
	article_id = request.POST['id']
	# （待）优化处理
	article = get_object_or_404(Article, pk=article_id) 

	title = request.POST['title']
	content = request.POST['content']
	visible = request.POST['visible']
	allow = request.POST['allow']

	# jquery的返回值和Python的不同，true|false > True|False
	if visible == 'true':
		visible = True
	else:
		visible = False
	
	if allow == 'true':
		allow = True
	else:
		allow = False
	
	# 创建ArticleForm对象对数据验证
	article_data = {'article_title':title, 'article_content':content}
	article_val = ArticleForm(article_data)

	if article_val.is_valid():
		article.article_title = title
		article.article_content = content
		article.article_visible = visible
		article.article_allow_comment = allow

		article.save()
		data = {
			'status':'ok',
			'article_id':article.id,
		}
	else:
		data = {
			'status':'error',
		}

	return HttpResponse(simplejson.dumps(data, ensure_ascii=False))


# 简单获取文章标题和内容：后台编辑查看使用
def simple_article(request):
	article_id = request.POST['id']
	article = get_object_or_404(Article, pk=article_id)
	
	data = {
		'article_title':article.article_title,
		'article_content':article.article_content,
		'article_visible':article.article_visible
	}
	return HttpResponse(simplejson.dumps(data, ensure_ascii=False))


# 编辑页面的文章删除
def article_delete(request):
	article_id = request.POST['id']
	article = get_object_or_404(Article, pk=article_id)
	article.delete()

	return HttpResponse('ok')


# 文章管理首页
def article_manage(request):
	article_list = Article.objects.all().order_by('-article_date')
	
	# 分页
	paginator = Paginator(article_list, 20)
	page = int(request.GET.get('page', 1))
	articles = paginator.page(page)

	try:
		articles = paginator.page(page)
	except PageNotAnInteger:
		articles = paginator.page(1)
	except EmptyPage:
		articles = paginator.page(paginator.num_pages)
	
	context = {
		'articles':articles,
		'article_sum':article_list.count()
    }
	
	return render(request, 'blogs_admin/article_manage.html', context) 


# 文章管理-文章查看
def article(request, article_id):
	article = get_object_or_404(Article, pk=article_id)

	return render(request, "blogs_admin/article.html", {"article":article})# 文章管理-文章查看

# 文章管理-文章编辑
def article_re_edit(request, article_id):
	article = get_object_or_404(Article, pk=article_id)

	return render(request, "blogs_admin/article_re_edit.html", {"article":article})


# 博客自定义设置
def blog_setting(request):
	blog = get_object_or_404(Blog, pk=1)

	return render(request, "blogs_admin/blog_setting.html", {"blog":blog})
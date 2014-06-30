blog
====

这是一个基于Django框架的博客应用


一、安装环境
1、python环境：2.x，推荐 2.7
2、Django环境：1.6.5

二、安装指南
1、下载并解压源文件 blog.zip
2、开启Django自带的服务器。切换到 /blog/ 文件目录下，
执行：python manage.py runserver
若成功，则会有如下提示：
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.

3、应用初始化。 同步骤 2 的目录，
执行 python manage.py syncdb
若成功，则会有如下提示：
Creating tables ...
Creating table django_admin_log
Creating table auth_permission
Creating table auth_group_permissions
Creating table auth_group
Creating table auth_user_groups
Creating table auth_user_user_permissions
Creating table auth_user
Creating table django_content_type
Creating table django_session
Creating table blogs_blog
Creating table blogs_article
Creating table blogs_comment
Creating table blogs_system

You just installed Django's auth system, which means you don't have any superusers defined.
Would you like to create one now? (yes/no): 

4、初始化配置。在步骤 3 中，命令行会提示你是否创建一个“超级用户”，如下：
You just installed Django's auth system, which means you don't have any superusers defined.
Would you like to create one now? (yes/no): 

选择安装，即键入 yes
紧接着，它会提示你创建相应的用户名和密码，创建它并牢记它。这是你的登录后台的账户。

5、查看安装是否成功。
在浏览器键入：127.0.0.1:8000/blogs
若成功，则会显示一个页面，文章的标题是程序员皆知的 “世界，你好！”


三、重要提示
1、应用前台入口： http://127.0.0.1:8000/blogs
2、应用后台入口（实现不完整，目前具有完整的 “文章编辑&文章管理”）： http://127.0.0.1:8000/blogs/admin
3、应用后台的Django默认入口： http://127.0.0.1:8000/admin
4、后台登录账号&密码：在 "安装指南" 步骤4中你输入的账号&密码

四、错误解决指南
1、若出现评论和登录等POST请求403问题。
问题描述：提交评论、登录、或者文章创建与修改等数据提交类请求，若无反应，报403错误。
解决办法：到应用的配置文件 settings.py下将 csrf 中间件注释掉

即，打开 "/blog/blog/settings.py" 文件，将下列一行注释，
'django.middleware.csrf.CsrfViewMiddleware'

即变为： #'django.middleware.csrf.CsrfViewMiddleware'


五、应用特性
1、主要用到的Django特性：ModelForm表单验证、Django的认证系统、Django的分页组件、模板继承、SimpleJson
2、前端框架：Bootstrap框架
3、JQuery库：ajax
4、富文本编辑器：bootstrap-wysiwyg（自己集成&优化）
5、异步处理：该应用的前台评论系统、后台全部是基于JQuery的异步实现
6、博客的评论系统：全局的“评论审核机制（默认关闭）& 评论开启/关闭（默认开启）”、单篇文章的可见性设置和评论开启与关闭设置（默认可见和允许评论）

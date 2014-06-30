#coding=utf
from django.db import models


#网站基本定义模块
class Blog(models.Model):
	blog_title = models.CharField('博客主标题', max_length=20)
	blog_sub_title = models.CharField('博客副标题', max_length=40)
	blog_sub_title_visible = models.BooleanField('副标题可见', default=True)
	blog_mail = models.EmailField('博客邮箱', max_length=254)
	blog_copyright = models.CharField('博客版权声明', max_length=120)

	def __unicode__(self):
		return u'网站定义'


#文章模块
class Article(models.Model):
	article_title = models.CharField('文章标题', max_length=60)
	article_date = models.DateTimeField('发表日期', auto_now_add=True)	#自动以上次修改的时间为准
	article_content = models.TextField('文章内容')
	article_allow_comment = models.BooleanField('允许评论', default=True)
	article_visible = models.BooleanField('文章可见', default=True)
	article_favorite_times = models.IntegerField('喜欢量', default=0, editable=False)
	article_browsed_times = models.IntegerField('浏览量', default=0, editable=False)

	def __unicode__(self):
		return self.article_title

	#获取内容“短”摘要，前60个字符
	def content_extracts_short(self):	
		return self.article_content[:60] + '...'
	
	#获取内容“长”摘要，前200个字符
	def content_extracts_long(self):	
		return self.article_content[:200] + '...'

	content_extracts_short.short_description = '文章内容'


#评论模块：外键是文章模块
class Comment(models.Model):
	article = models.ForeignKey(Article)
	comment_author = models.CharField('评论者', max_length=40)
	comment_date = models.DateTimeField('评论日期', auto_now_add=True)
	comment_content = models.TextField('评论内容', max_length=1200)
	comment_mail = models.EmailField('评论者邮箱', max_length=254)
	comment_on = models.CharField('被回复者', max_length=20, default=None, blank=True)
	comment_on_content = models.CharField('被回复内容摘要', max_length=40, default=None, blank=True)
	comment_visible = models.BooleanField('评论可见', default=False) #评论默认不可见，需要审核

	#返回评论内容的前20个字符
	def __unicode__(self):	
		return self.comment_content[:20] + '...'

	#获取评论内容摘要：前40个字符
	def comment_extracts(self):	
		return self.comment_content[:40] + '...'


	comment_extracts.short_description = '评论内容'


#系统设置模块:评论审核默认开启
class System(models.Model):
	system_initial = models.BooleanField('网站的初始化状态', default=True)	
	system_status = models.BooleanField('网站开启', default=True)
	comment_allow = models.BooleanField('允许评论', default=True)
	comment_check = models.BooleanField('开启评论审核', default=True)

	def __unicode__(self):
		return u'网站设置'
#coding=utf
from django.contrib import admin
from blogs.models import Blog, Article, Comment, System

#评论内联与对应的文章
class CommentInline(admin.StackedInline):
	model = Comment
	extra = 0	#只显示有评论的，默认为5个


class ArticleAdmin(admin.ModelAdmin):
	list_display = ('article_title', 'content_extracts_short',
	 'article_date', 'article_visible', 'article_favorite_times', 'article_browsed_times')
	inlines = [CommentInline]
	list_filter = ['article_date']	#文章发布日期过滤器
	search_fields = ['article_content', 'article_title']


class CommentAdmin(admin.ModelAdmin):
	list_display = ('comment_extracts', 'comment_author', 'comment_date', 'comment_mail', 'comment_visible')


admin.site.register(Blog)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(System)
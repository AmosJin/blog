from django.conf.urls import patterns, url
from blogs import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^(?P<article_id>\d+)/$', views.detail, name='detail'),
    url(r'^(?P<article_id>\d+)/comment/$', views.comment, name='comment'),
    url(r'^(?P<comment_id>\d+)/(?P<visible_count>\d+)/add_comment/$', views.add_comment, name='add_comment'),
    url(r'^(?P<article_id>\d+)/favor/$', views.favor, name='favor'),
    url(r'admin/$', views.admin, name='admin'),
    url(r'admin/login/$', views.login_view, name='login'),
    url(r'admin/logout/$', views.logout_view, name='logout'),
    url(r'admin/manage/$', views.manage, name='manage'),
    url(r'admin/manage/new/$', views.new_view, name='new'),
    url(r'admin/manage/article_add/$', views.article_add, name='article_add'),
    url(r'admin/manage/article_update/$', views.article_update, name='article_update'),
    url(r'admin/manage/simple_article/$', views.simple_article, name='simple_article'),
    url(r'admin/manage/article_delete/$', views.article_delete, name='article_delete'),
    url(r'admin/manage/article_manage/$', views.article_manage, name='article_manage'),
    url(r'admin/manage/article_manage/(?P<article_id>\d+)/$', views.article, name='article'),
    url(r'admin/manage/article_manage/(?P<article_id>\d+)/article_re_edit/$', views.article_re_edit, name='article_re_edit'),
)
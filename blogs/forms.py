#coding=utf
from blogs.models import Comment, Article
from django.forms import ModelForm

#评论模块的表单验证
class CommentForm(ModelForm):
    class Meta:
    	model = Comment
    	fields = ('comment_author', 'comment_content', 'comment_mail')
    	error_messages = {
    		'comment_author':{
    			'required': '姓名是必填项。',
    			'max_length': '姓名长度不应超过20位。',
    		},
    		'comment_content':{
    			'required': '评论内容是必填项。',
    			'max_length': '评论内容长度受限。'
    		},
    		'comment_mail': {
    			'required': "邮箱是必填项。"
    		}
    	}

class ArticleForm(ModelForm):
    class Meta:
        model = Article
        fields = ('article_title', 'article_content')
        error_messages = {
            'article_title':{
                'required':'文章标题不能为空。',
                'max_length':'文章标题的长度不超过60位。'
            },
            'article_content':{
                'required':'文章内容不能为空。',
            }
        }
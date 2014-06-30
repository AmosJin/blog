from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^blogs/', include('blogs.urls', namespace='blogs')),
    url(r'^admin/', include(admin.site.urls)),
)

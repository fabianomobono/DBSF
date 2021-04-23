from django.urls import path, include
from .import views
from rest_framework.authtoken.views import obtain_auth_token
from .views import *

urlpatterns = [
  path('', views.api, name='api_view'),
  path('users', views.users, name='user_api'), 
  path('login', views.login, name='fake_login'),
  path('get_info', HomeData.as_view(), name='startapp_info'),
  path('one_persons_posts', One_persons_posts.as_view(), name='one_persons_posts'),
  path('mobileSignUp', SignUpView.as_view(), name='mobileSignUp'),
  path('new_post', Create_new_post.as_view(), name='new_post'),
  path('comment', Comment_a_post.as_view(), name='comment'),
  path('findFriends', FindFriends.as_view(), name='findFriends')
]
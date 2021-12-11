
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API Routes
    path("image_upload", views.image_upload, name="image_upload"),
    path("create_post", views.new_post, name="new_post"),
    path("posts/<str:user>", views.user_posts, name="user_posts"),
    path("posts", views.load_posts, name="load_posts")
]

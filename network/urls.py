
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<str:name>", views.user_profile, name="user_profile"),
    
    #API Routes
    path("image_upload", views.image_upload, name="image_upload"),
    path("create_post", views.new_post, name="new_post"),
    path("user/<int:id>", views.user_data, name="user_data"),
    path("posts", views.load_posts, name="load_posts")
]

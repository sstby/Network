from django.contrib import admin
from .models import *
# Register your models here.
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'body', 'timestamp')

class SocialAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')

admin.site.register(Post, PostAdmin)
admin.site.register(Social, SocialAdmin)
admin.site.register(User)
admin.site.register(Image)

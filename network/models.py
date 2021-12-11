from django.contrib.auth.models import AbstractUser
from django.db import models




class Image(models.Model):
    image = models.ImageField(upload_to="images")

    @property
    def image_url(self):
        if self.image and hasattr(self.image, 'url'):
            return self.image.url

    def serialize(self):
        return {
                'id' : self.id,
                'url' : self.image_url
            }



class Post(models.Model):
    author = models.ForeignKey("User", on_delete=models.CASCADE)
    body = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    upvotes = models.IntegerField(default=0)
    images = models.ManyToManyField(Image, blank=True)

    def serialize(self):
        imgs = self.images.all()
        return {
            'id': self.id,
            'author': self.author.username,
            'author_avatar': self.author.user_pic.image_url,
            'body': self.body,
            'timestamp': self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            'upvotes': self.upvotes,
            'images' : [img.image_url for img in imgs]
        }

class User(AbstractUser):
    user_pic = models.ForeignKey(Image, on_delete=models.CASCADE, default=73)
    user_upvotes = models.ManyToManyField(Post, blank=True)
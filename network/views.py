import json
from django.db.models import fields
from django.db.models.base import Model
from django.forms import widgets
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Image, Post, Social, User


def index(request):
    user = User.objects.get(pk=request.user.id)
    posts = Post.objects.all().order_by("-timestamp")
    print(user.user_pic.image_url)
    return render(request, "network/index.html", {
        'user_avatar' : user.user_pic.image_url,
        'posts': posts
    })
    

@csrf_exempt
@login_required
def image_upload(request):
    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    img = request.FILES
    images = []
    for i in range(len(img)):
        image = Image(image=img[f"myFile{i}"])
        image.save()
        images.append(image)
    print(images)

    return JsonResponse([im.serialize() for im in images], safe=False) 

@csrf_exempt
@login_required
def new_post(request):
    data = json.loads(request.body)
    print(data)
    author = User.objects.get(pk=request.user.id)
    body = data.get("body", "")

    post = Post(author=author, body=body)
    post.save()

    images = data.get("images", "")
    for image in images:
        post.images.add(Image.objects.get(pk=image['id']))

    return JsonResponse(post.serialize())

def user_profile(request, name):
    user = User.objects.get(username=name)
    user_posts = Post.objects.all().filter(author = user).order_by("-timestamp")
    user_socials = Social.objects.get(user = user)
    user_upvoted_posts = user_socials.get_upvoted_posts()
    return render(request, "network/user.html", {
        "profile" : user,
        "posts" : user_posts,
        "upvoted_posts" : user_upvoted_posts
    })

def user_posts(request):
    
    pass

def load_posts(request):
    posts = Post.objects.all().order_by("-timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)

def user_data(request, id):
    socials = Social.objects.get(user=User.objects.get(pk=id))
    print(socials.serialize())
    return JsonResponse(socials.serialize())

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

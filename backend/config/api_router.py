from django.conf import settings
from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter
from apps.prompt.api.views import prompt

from apps.users.api.views import UserViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()


app_name = "api"
urlpatterns = [
    # Config router
    path("v1/", include([
        path("prompt/", prompt, name="prompt"),
    ])),
] + router.urls

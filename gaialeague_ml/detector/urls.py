"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""


from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include
from django.contrib.auth.decorators import login_required

from rest_framework import routers

from .views import TrashViewSet, TrashDetectorView, download


router = routers.DefaultRouter()
router.register(r"detect/single-snap", TrashDetectorView, basename="single-trash")
router.register(r"detect", TrashViewSet, basename="detection")

urlpatterns = [
    path('', include(router.urls)),
    url(r"^download/(?P<temp_name>[-_\w]+\.\w+)$", download),
]

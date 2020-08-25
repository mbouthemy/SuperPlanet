"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""

from django.contrib import admin
from django.urls import path
from django.urls import include, path
from rest_framework import routers


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    # path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('', include("detector.urls")),
]
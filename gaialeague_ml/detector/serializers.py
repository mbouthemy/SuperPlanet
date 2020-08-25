"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""

from .models import TrashDetectionInput, TrashDetectionResult, TrashCountInput, TrashCountResult
from rest_framework import serializers

class TrashDetectionInputSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TrashDetectionInput
        fields = "__all__"

class TrashDetectionResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TrashDetectionResult
        fields = "__all__"


class TrashCountInputSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TrashCountInput
        fields = "__all__"

class TrashCountResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TrashCountResult
        fields = "__all__"
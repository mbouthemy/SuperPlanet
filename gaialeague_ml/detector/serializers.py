"""
Created on Sat Jul  1st August 20:00:00 2020

@author: neroks01@gmail.com
"""

from .models import Trash
from rest_framework import serializers


class TrashSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trash
        fields = "__all__"
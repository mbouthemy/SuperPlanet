from .models import Trash
from rest_framework import serializers

class TrashSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trash
        fields = "__all__"
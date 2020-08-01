from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import serializers
from .serializers import TrashSerializer
from .models import Trash
from rest_framework.response import Response

from django.core.files import  File

import os, traceback

import json, uuid, shutil
from pathlib import Path


class TrashViewSet(viewsets.ModelViewSet):
    """
    API endpoint that counts removed trashes between 2 snapshots.
    """
    queryset = Trash.objects.none()
    serializer_class = TrashSerializer
    # parser_classes = (JSONParser,PlainTextParser,)
    # permission_classes = [permissions.IsAuthenticated]
    # renderer_classes = [MultiPartRenderer,JSONOpenAPIRenderer,JSONRenderer]

    def create(self, request):
        try:
            print( request.FILES)
            print(request.data)
            file_before = request.FILES["file_before"]
            file_after = request.FILES["file_after"]
            # print(len(files))
            trash = Trash(trash_count=-10, file_before=file_before, file_after=file_after)
            s_trash = TrashSerializer(trash, context={'request': request})
            # return Response(s_trash.data, )
            return Response({"trash_count": -10})
        except Exception as e:
            return Response(traceback.format_exc())
"""
Created on Sat Jul  1st August 20:00:00 2020

@author: neroks01@gmail.com
"""

from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import serializers
from .serializers import TrashSerializer
from .models import Trash
from rest_framework.response import Response

from django.core.files import  File
from django.core.exceptions import ValidationError
from django.utils.text import get_valid_filename

import os, traceback

import json, uuid, shutil, re
from pathlib import Path
from  urllib.request import urlretrieve
import requests
from urllib.parse import unquote



class TrashViewSet(viewsets.ModelViewSet):
    """
    API endpoint that counts removed trashes between 2 snapshots.

    If `image_before` is non null, we would be expecting `image_after` not
    to be null too and no attention will be paid to none of `url_before`
    and `url_after`. But, if `image_before` is null, wee look into `url_before`
    and if it's non null, we would be expecting `url_after` not to be 
    null too.

    Examples:
    --------

    A valid `curl` to this endpoint could look like:

    curl `http://api-super-planet.azurewebsites.net/detect/`
        `-X` '**POST**'
        `-F` "**file_before**=@/C:/Users/Photos/photo_before.jpg"
        `-F` "**file_after**=@/C:/Users/Photos/photo_after.png"

    Or:

    curl `http://api-super-planet.azurewebsites.net/detect/`
        `-X` '**POST**'
        `-F` "**url_before**=https://photos.com/photo_before.jpg"
        `-F` "**url_after**=https://photos.com/photo_after.png"
    """
    queryset = Trash.objects.none()
    serializer_class = TrashSerializer
    # parser_classes = (JSONParser,PlainTextParser,)
    # permission_classes = [permissions.IsAuthenticated]
    # renderer_classes = [MultiPartRenderer,JSONOpenAPIRenderer,JSONRenderer]


    @staticmethod
    def parse_url(url):
        """
        Fast function, needs some error handling !!!
        """
        url = unquote(url)
        filename = re.search(r"/(.+)\?", url)
        if filename is None:
            splits = url.split("/")
            assert len(splits) > 1, "Bad url !"
            filename = splits[-1]
        else:
            filename = filename.group(1)
        
        # Safe string to filename
        filename = get_valid_filename(filename)

        ext = filename.split(".")[-1]

        assert  ext in ["jpg", "png", "jpeg"], "Bad image extension : `{}`".format(ext)

        return {"filename": filename, "ext": ext}

    @staticmethod
    def save_file_from_url(url, basename, mode="wb"):
        url_data = TrashViewSet.parse_url(url)
        content = requests.get(url).content
        with open("{}.{}".format(basename, url_data["ext"]), mode=mode) as f:
            f.write(content)


    def create(self, request):
        try:
            file_before = request.FILES.get("file_before", None)
            if file_before :
                file_after = request.FILES.get("file_after", None)
                assert file_after, "file_after must be non null as file_before"
                url_before = ""
                url_after = ""
            else:
                file_after = None
                url_before = request.data.get("url_before", None)
                if url_before :
                    url_after = request.data.get("url_after", None)
                    assert url_after, "url_after must be non null as url_before"

                    self.save_file_from_url(url_before, basename="image_before")
                    self.save_file_from_url(url_after, basename="image_after")
                else:
                    url_after = ""

            trash = Trash(trash_count=-10, file_before=file_before, file_after=file_after,
            url_before=url_before, url_after=url_after)

            try:
                trash.full_clean()
            except ValidationError as e:
                raise ValueError("Bad arguments to ThrashCounter: We Can No More Make the Planet Great Again !") from e

            s_trash = TrashSerializer(trash, context={'request': request})
            
            return Response({"trash_count": -10})
        except Exception as e:
            return Response(traceback.format_exc())
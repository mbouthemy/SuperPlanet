"""
Created on Sat Jul  1st August 20:00:00 2020

@author: neroks01@gmail.com
"""

from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework import serializers
from .serializers import (TrashDetectionInputSerializer, TrashDetectionResultSerializer,
                                        TrashCountInputSerializer, TrashCountResultSerializer)
from .models import TrashDetectionInput, TrashDetectionResult, TrashCountInput, TrashCountResult
from rest_framework.response import Response

from django.core.files import  File
from django.core.exceptions import ValidationError
from django.utils.text import get_valid_filename, slugify
from django.views.static import serve

import os, traceback

import json, uuid, shutil, re, time, uuid, shutil

from pathlib import Path
from  urllib.request import urlretrieve
import requests
from urllib.parse import unquote

from pathlib import Path
from tempfile import TemporaryFile, NamedTemporaryFile

import cv2 

from  threading import Thread

from .effdet import make_predictions

from gaialeague_ml.settings import BASE_DIR

BASE_DIR = Path(BASE_DIR)







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

def remove_old_temp_files(max_duration=10*60):
    files = BASE_DIR.joinpath("temp").glob("*")
    for file in files:
        if file.is_dir():
            shutil.rmtree(file.as_posix())
        else:
            d = re.search(r"__t(\d+)\.", file.name)
            if d is None:
                file.unlink()
                # print(file, d)
            else:
                d = int(d.group(1))/1_000_000.
                delta = time.time() - d
                if delta > max_duration:
                    file.unlink()
                    # print(file, d)
            print(file.name, d, delta)

class OldTempFileRemover(Thread):
    def __init__(self, wait=10*60):
        super().__init__()
        self.wait = wait

    def run(self):
        while True:
            remove_old_temp_files(self.wait)
            time.sleep(self.wait)

# temp_file_romover = OldTempFileRemover(60*10)
# temp_file_romover.start()

def download(request, temp_name):
    # remove_old_temp_files()

    filepath = BASE_DIR.joinpath("temp", get_valid_filename(temp_name))
    assert filepath.exists(), "Wrong key `{}`!".format(temp_name)
    return serve(request, filepath.name, filepath.parent)


class TrashDetectorView(viewsets.ModelViewSet):
    queryset = TrashDetectionInput.objects.none()
    serializer_class = TrashDetectionInputSerializer
    

    def _predict(self, filepath):
        prediction = make_predictions([Path(filepath).as_posix()], wbf=True, draw_boxes=True)[0]
        prediction["trash_count"] = len(prediction["boxes"])
        return prediction
    
    def _result_on_error(self, msg=""):
        result = TrashDetectionResult(
                trash_count=-100,
                status="FAILED",
                download_link = None,
                msg=msg
                )
        return result
    
    def _result_on_success(self, prediction, download_link, msg=""):
        result = TrashDetectionResult(
                trash_count=prediction["trash_count"],
                status="SUCCEEDED",
                download_link = download_link,
                msg=msg
                )

        # Save image with bounding boxes into disc for later download
        image = prediction["image"][:,:,::-1]
        image *= 255.
        image = image.astype("uint8")
        cv2.imwrite(BASE_DIR.joinpath("temp", result.download_link).as_posix(), image)
        
        return result

    def predict_from_uploaded_file(self, file):
        fileuuid = self.get_file_uuid(file.name)
        filepath = BASE_DIR.joinpath("temp", fileuuid + "." + file.name.split(".")[-1] )
        # with open("./temp.{}".format(file.name.split(".")[-1]), "wb+") as f:
        with filepath.open("wb+") as f:
            for chunk in file.chunks():
                f.write(chunk)
        return self._predict(filepath), filepath.name
    
    def predict_from_url(self, url):
        url_data = parse_url(url)
        content = requests.get(url).content
        fileuuid = self.get_file_uuid(url)
        filepath = BASE_DIR.joinpath("temp", fileuuid + "." + url_data["ext"] )
        # with NamedTemporaryFile("wb", suffix= "." + url_data["ext"]) as f:
        with filepath.open("wb") as f:
            f.write(content)
        return self._predict(filepath), filepath.name

    def predict(self, trash: TrashDetectionInput):
        try:
            trash.full_clean()
        except Exception as e:
            return self._result_on_error(msg="Bad arguments to ThrashCounter: We Can No More"
            + " Make the Planet Great Again !\n{}".format(traceback.format_exc()))

        if trash.file:
            return self._result_on_success(*self.predict_from_uploaded_file(trash.file))
        elif trash.url:
            return self._result_on_success(*self.predict_from_url(trash.url))
        else:
            return self._result_on_error(msg="Both `file` and `url` are null !")

    def get_file_uuid(self, filename):
        return slugify("{}__t{:.06f}".format(uuid.uuid4().hex, time.time()))

    def create(self, request):
        file = request.FILES.get("file", None)
        if file:
            url = ""
        else:
            file = None
            url = request.data.get("url", None)
        trash = TrashDetectionInput(file=file, url=url)

        # try:
        #     trash.full_clean()
        #     # prediction = self.predict(trash)
        #     # result = TrashDetectionResult(trash_count=prediction["trash_count"], status="SUCCEEDED")
        #     result = self.predict(trash)
        # except Exception as e:
        #     result = TrashDetectionResult(trash_count=-100, status="FAILED",
        #     msg="Bad arguments to ThrashCounter: We Can No More Make the Planet Great Again !\n{}".format(traceback.format_exc()))

        result = self.predict(trash)
        s_result = TrashDetectionResultSerializer(result, context={'request': request})
        return Response(s_result.data)


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
    queryset = TrashCountInput.objects.none()
    serializer_class = TrashCountInputSerializer
    # parser_classes = (JSONParser,PlainTextParser,)
    # permission_classes = [permissions.IsAuthenticated]
    # renderer_classes = [MultiPartRenderer,JSONOpenAPIRenderer,JSONRenderer]


    # @staticmethod
    # def parse_url(url):
    #     """
    #     Fast function, needs some error handling !!!
    #     """
    #     url = unquote(url)
    #     filename = re.search(r"/(.+)\?", url)
    #     if filename is None:
    #         splits = url.split("/")
    #         assert len(splits) > 1, "Bad url !"
    #         filename = splits[-1]
    #     else:
    #         filename = filename.group(1)
        
    #     # Safe string to filename
    #     filename = get_valid_filename(filename)

    #     ext = filename.split(".")[-1]

    #     assert  ext in ["jpg", "png", "jpeg"], "Bad image extension : `{}`".format(ext)

    #     return {"filename": filename, "ext": ext}

    # @staticmethod
    # def save_file_from_url(url, basename, mode="wb"):
    #     url_data = TrashViewSet.parse_url(url)
    #     content = requests.get(url).content
    #     with open("{}.{}".format(basename, url_data["ext"]), mode=mode) as f:
    #         f.write(content)

    def predict(self, request, before=True):
        suffix = "before" if before else "after"
        file = request.FILES.get("file_{}".format(suffix), None)
        if file is None:
            url =  request.data.get("url_{}".format(suffix), None)
        else:
            url = None
        trash = TrashDetectionInput(file=file, url=url)
        
        detector = TrashDetectorView()
        result = detector.predict(trash)

        return result
        


    # def create(self, request):
    #     try:
    #         file_before = request.FILES.get("file_before", None)
    #         if file_before :
    #             file_after = request.FILES.get("file_after", None)
    #             assert file_after, "file_after must be non null as file_before"
    #             url_before = ""
    #             url_after = ""
    #         else:
    #             file_after = None
    #             url_before = request.data.get("url_before", None)
    #             if url_before :
    #                 url_after = request.data.get("url_after", None)
    #                 assert url_after, "url_after must be non null as url_before"

    #                 self.save_file_from_url(url_before, basename="image_before")
    #                 self.save_file_from_url(url_after, basename="image_after")
    #             else:
    #                 url_after = ""

    #         trash = TrashCountInput(file_before=file_before, file_after=file_after,url_before=url_before, url_after=url_after)

    #         try:
    #             trash.full_clean()
    #         except ValidationError as e:
    #             raise ValueError("Bad arguments to ThrashCounter: We Can No More Make the Planet Great Again !") from e

    #         s_trash = TrashCountInputSerializer(trash, context={'request': request})
            
    #         return Response({"trash_count": -10})
    #     except Exception as e:
    #         return Response(traceback.format_exc())

    def create(self, request):
        result_before = self.predict(request, before=True)
        result_after = self.predict(request, before=False)
        result = TrashCountResult(
            trash_count_before=result_before.trash_count,
            trash_count_after=result_after.trash_count,
            trash_count=result_before.trash_count - result_after.trash_count,
            trash_count_diff=result_before.trash_count - result_after.trash_count,
            download_link_before=result_before.download_link,
            download_link_after=result_after.download_link,

            is_same=None,
            similarity_score=None,

            status="SUCCEEDED" if (result_before.status == "SUCCEEDED")\
                    and (result_after.status == "SUCCEEDED") else "FAILED",
            msg= (("" or result_before.msg) + "\n" + ("" or result_after.msg)).strip()
        )

        s_result = TrashCountResultSerializer(result, context={'request': request})
        return Response(s_result.data)
"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""

from django.db import models

class TrashDetectionInput(models.Model):
    file = models.FileField(verbose_name="Trash image", blank=True, null=True)
    url = models.URLField(blank=True, null=True, max_length=500)

class TrashDetectionResult(models.Model):
    trash_count = models.IntegerField()
    # confidence = models.FloatField()
    download_link = models.URLField()
    STATUS_CHOICES = [("SUCCEEDED", "SUCCEEDED"), ("FAILED", "FAILED")]
    status = models.CharField(choices=STATUS_CHOICES, blank=True, null=True, max_length=10)
    msg = models.TextField(max_length=1000, blank=True, null=True)


class TrashCountInput(models.Model):
    file_before = models.FileField(verbose_name="Trash image before", blank=True, null=True)
    file_after = models.FileField(verbose_name="Trash image after", blank=True, null=True)
    # trash_count = models.IntegerField(default=0)

    url_before = models.URLField(blank=True, null=True, max_length=500)
    url_after = models.URLField(blank=True, null=True, max_length=500)


class TrashCountResult(models.Model):
    trash_count_before = models.IntegerField(default=0)
    trash_count_after = models.IntegerField(default=0)
    trash_count_diff = models.IntegerField(default=0)
    trash_count = models.IntegerField(default=0)
    download_link_after = models.URLField(blank=True, null=True, max_length=500)
    download_link_before = models.URLField(blank=True, null=True, max_length=500)

    is_same = models.BooleanField(blank=True, null=True)
    similarity_score = models.FloatField(blank=True, null=True)

    STATUS_CHOICES = [("SUCCEEDED", "SUCCEEDED"), ("FAILED", "FAILED")]
    status = models.CharField(choices=STATUS_CHOICES, blank=True, null=True, max_length=10)
    msg = models.TextField(max_length=1000, blank=True, null=True)

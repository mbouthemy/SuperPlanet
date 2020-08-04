"""
Created on Sat Jul  1st August 20:00:00 2020

@author: neroks01@gmail.com
"""

from django.db import models


class Trash(models.Model):
    file_before = models.FileField(verbose_name="Trash image before", blank=True, null=True)
    file_after = models.FileField(verbose_name="Trash image after", blank=True, null=True)
    trash_count = models.IntegerField(default=0)


# Generated by Django 3.0.2 on 2020-08-16 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('detector', '0006_auto_20200816_1547'),
    ]

    operations = [
        migrations.AddField(
            model_name='trashcountresult',
            name='is_same',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='trashcountresult',
            name='similarity_score',
            field=models.FloatField(blank=True, null=True),
        ),
    ]

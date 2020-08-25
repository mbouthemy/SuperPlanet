"""
Created on 2020-08-25 00:00:00

@author: neroksi
@co-author: mbouthemy

©SuperPlanet
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gaialeague_ml.settings')

application = get_wsgi_application()

from django.http import HttpResponse, JsonResponse  

import mediapipe as mp
import numpy as np
import cv2
import base64

import io
import os
from django.contrib.auth import get_user_model

#from distutils import dist, file_util
from matplotlib.image import pil_to_array

#from imp import load_module
from .models import Employee_Emotion, Employee_Team

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import permissions, status, generics
from .serializers import UserSerializer, EmployeeTeamSerializer  
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import exceptions 

from django.utils import timezone
from django.http import HttpResponse
from django.http import JsonResponse

#ML segment
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
import cv2
import numpy as np 
import base64
from deepface import DeepFace
import base64
from PIL import Image
from django.db.models import Count

from gazetimation import Gazetimation
from django.utils import timezone
from django.db.models import Count
from rest_framework.response import Response
from datetime import timedelta

from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny

from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()


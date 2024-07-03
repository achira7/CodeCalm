import io
import os
from django.contrib.auth import get_user_model

import json

#from distutils import dist, file_util
from matplotlib.image import pil_to_array

#from imp import load_module
from .models import Employee_Emotion, Employee_Team, Employee_Focus, BreathingExerciseUsage, TrackListening, StressQuestion, StressDetectionForm

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import permissions, status, generics
from .serializers import UserSerializer, EmployeeTeamSerializer, BreathingExerciseUsageSerializer, TrackListeningSerializer, StressQuestionSerializer, StressDetectionFormSerializer  
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
from rest_framework.decorators import api_view

User = get_user_model()


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
import mediapipe as mp

from datetime import datetime, timedelta
from django.db.models import Sum
from collections import defaultdict
from django.db.models.functions import ExtractHour, ExtractDay, ExtractWeekDay
from rest_framework.views import APIView
from django.utils.timezone import now
from django.db.models import Sum

from django.db.models import Q

from rest_framework import viewsets, permissions
from .models import Message
from rest_framework.response import Response

from rest_framework import viewsets, permissions
from .models import Message
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

class EmotionTeamDataView(APIView):
    def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        team_id = request.GET.get('team_id')
        period = request.GET.get('period', 'all_time')  # Default to 'all_time' if not provided

        # Check if team_id is provided in the request
        if not team_id:
            return JsonResponse({'error': 'Team ID is required'}, status=400)

        # Define the time filter based on the period
        if period == 'daily':
            time_threshold = datetime.now() - timedelta(days=1)
        elif period == 'weekly':
            time_threshold = datetime.now() - timedelta(weeks=1)
        elif period == 'monthly':
            time_threshold = datetime.now() - timedelta(days=30)
        else:
            time_threshold = None

        # Initialize filter parameters
        users = User.objects.filter(team=team_id)
        user_ids = users.values_list('id', flat=True)
        filter_params = {'employee_id__in': user_ids}

        if time_threshold:
            emotion_counts_list = Employee_Emotion.objects.filter(**filter_params, time__gte=time_threshold) \
                                        .values('emotion_data') \
                                        .annotate(count=Count('emotion_data')) \
                                        .order_by('emotion_data') \
                                        .values_list('emotion_data', 'count')
        else:
            emotion_counts_list = Employee_Emotion.objects.filter(**filter_params) \
                                        .values('emotion_data') \
                                        .annotate(count=Count('emotion_data')) \
                                        .order_by('emotion_data') \
                                        .values_list('emotion_data', 'count')

        # Convert the queryset to a dictionary
        emotion_counts_dict = dict(emotion_counts_list)

        # Update defaultEmotionValues with the fetched emotion counts
        for key in defaultEmotionValues:
            if key in emotion_counts_dict:
                defaultEmotionValues[key] += emotion_counts_dict[key]

        # Initialize the hourly dominant emotion dictionary
        hourly_dominant_emotions = {}

        # Get the current date and define the start and end hours
        current_date = datetime.now().date()
        start_hour = 7
        end_hour = 18

        # Loop through each hour from 7 AM to 6 PM
        for hour in range(start_hour, end_hour + 1):
            start_time = datetime.combine(current_date, datetime.min.time()) + timedelta(hours=hour)
            end_time = start_time + timedelta(hours=1)

            # Query to get the dominant emotion in the current hour
            hourly_emotion = Employee_Emotion.objects.filter(**filter_params, time__gte=start_time, time__lt=end_time) \
                                  .values('emotion_data') \
                                  .annotate(count=Count('emotion_data')) \
                                  .order_by('-count') \
                                  .first()

            if hourly_emotion:
                dominant_emotion = hourly_emotion['emotion_data']
            else:
                dominant_emotion = ''  # Default if no data is found

            # Add the dominant emotion for the current hour to the dictionary
            hourly_dominant_emotions[f'{hour}:00 - {hour+1}:00'] = dominant_emotion
        
        print('emotions', defaultEmotionValues)
        response_data = {
            'defaultEmotionValues': defaultEmotionValues,
            'hourlyDominantEmotions': hourly_dominant_emotions
        }

        return Response(response_data)
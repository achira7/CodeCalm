import io
import os
from django.contrib.auth import get_user_model

import json

from .models import Employee_Emotion, Employee_Team, Employee_Focus, BreathingExerciseUsage, TrackListening, StressQuestion, StressDetectionForm, ReportGeneration, Employee_Stress, BreathingProfile, Track, Reminder, FaceLoginProfile, FaceImage

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import permissions, status, generics
from .serializers import UserSerializer, EmployeeTeamSerializer, BreathingExerciseUsageSerializer, TrackListeningSerializer, StressQuestionSerializer, StressDetectionFormSerializer, BreathingProfileSerializer, TrackSerializer, ReminderSerializer, FaceImageSerializer
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

from rest_framework.views import APIView
import cv2
import numpy as np 
import base64
from deepface import DeepFace
import base64
from PIL import Image
from django.db.models import Count

from django.utils import timezone
from django.db.models import Count
from rest_framework.response import Response
from datetime import timedelta

from django.contrib.auth import authenticate, login

from django.http import JsonResponse
import mediapipe as mp

from datetime import datetime, timedelta
from django.db.models import Sum
from django.db.models.functions import ExtractHour, ExtractDay, ExtractWeekDay
from rest_framework.views import APIView
from django.utils.timezone import now
from django.db.models import Sum

from django.db.models import Q

from rest_framework.response import Response

from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError

from rest_framework import status 

from pytz import timezone as pytz_timezone
local_timezone = pytz_timezone('Asia/Colombo')

User = get_user_model()

secret_key = settings.SECRET_KEY

class RegisterView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            email = email.lower() if email else None
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            password = data.get('password')

            is_staff = data.get('is_staff')  
            if is_staff == 'True':
                is_staff = True
            else:
                is_staff = False

            is_superuser = data.get('is_superuser')  
            if is_superuser == 'True':
                is_superuser = True
            else:
                is_superuser = False

            team = data.get('team')
            gender = data.get('gender')
            employment_type = data.get('employment_type')
            work_location = data.get('work_location')
            profile_picture = data.get('profile_picture')
             
            if (is_superuser):
                user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, password=password)
                message = 'Admin account created successfully!'
            elif (is_staff):
                user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password, team=team, gender=gender, employment_type=employment_type, work_location=work_location, profile_picture=profile_picture, is_superuser=is_superuser, is_staff=is_staff)
                message = 'Supervisor account created successfully!'
            else:
                user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password, team=team, gender=gender, employment_type=employment_type, work_location=work_location, profile_picture=profile_picture, is_superuser=is_superuser, is_staff=is_staff)
                message = 'Employee account created successfully!'

            return Response({'success': message}, status=status.HTTP_201_CREATED)
        
        except KeyError as e:
            return Response({'error': f'Missing key: {e}'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class RetrieveUserView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            user_serializer = UserSerializer(user)

            return Response({'user': user_serializer.data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)      
        
class GetUserView(APIView):
    def get(self, request):
        user_id = request.COOKIES.get('user_id')        
            
        if user_id:
            user = get_object_or_404(User, id=user_id)
            user_data = UserSerializer(user, context={'request': request}).data
            return Response(user_data)
        else:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
        


class GetUserWithIDView(APIView):
    def get(self, request):
            user_id = request.query_params.get('user_id')

            if user_id:
                user = get_object_or_404(User, id=user_id)
                user_data = UserSerializer(user, context={'request': request}).data
                return Response(user_data)
            else:
                return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
            


class LoginAPIView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise exceptions.AuthenticationFailed('Invalid username or password')
        response = Response({
            'message': 'Invalid username or password',
            'is_staff': '',
            'is_superuser': ''
        }, status=status.HTTP_200_OK)

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed('Invalid username or password')
        response = Response({
            'message': 'Invalid username or password',
            'is_staff': '',
            'is_superuser': ''
        }, status=status.HTTP_200_OK)
        
        response = Response({
            'message': 'Login successful',
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }, status=status.HTTP_200_OK)
        
        response.set_cookie('user_id', user.id, httponly=True)
        
        return response



class LogoutAPIView(APIView):
    @csrf_exempt
    def post(self, request):
        request.COOKIES.get('user_id') 
        response = Response()

        response.delete_cookie('user_id')
        return response
    
from . import serializers 

class EmployeeList(generics.ListCreateAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('search', '')

        if search_query:
            return User.objects.filter(
                Q(first_name__icontains=search_query) | Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query)
            )
        else:
            return User.objects.all()


class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        employee = self.get_object()
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TeamList(generics.ListAPIView):
    queryset = Employee_Team.objects.all()
    serializer_class = EmployeeTeamSerializer

    
def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    img = Image.open(io.BytesIO(imgdata))
    opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
    return opencv_img

def imageSharpen(image):
    kernel = np.array([[-1, -1, -1],
                       [-1, 9, -1],
                       [-1, -1, -1]])
    return cv2.filter2D(image, -1, kernel)


class WriteImage(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')
        userid = request.data.get('user_id')
        
        if image_data:
            imgstr = image_data.split('image/jpeg;base64,')

            opencv_image = stringToRGB(imgstr)

            cv2.imwrite(rf'media/{userid}.jpg', opencv_image)

            return HttpResponse({'message': 'Success!!!'}, status=200)
        else:
            return HttpResponse({'error': 'No image data provided'}, status=400)


def is_image_dark(image, threshold=50):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    avg_brightness = np.mean(gray_image)
    return avg_brightness < threshold

def is_image_blurred(image, threshold=20):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray_image, cv2.CV_64F).var()
    return laplacian_var < threshold


    """===================================== FACE LOGIN ==============================================="""

class FaceLoginView(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')

        if not image_data:
            return JsonResponse({'message': 'No image provided'}, status=400)
        
        try:
            format, imgstr = image_data.split('image/jpeg;base64,')
            opencv_image = stringToRGB(imgstr)

            users = User.objects.all()

            for user in users:
                try:
                    stored_face_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))

                    result = DeepFace.verify(opencv_image, stored_face_path, enforce_detection=False)

                    if result['verified']:
                            login(request, user)
                            response = JsonResponse({'message': 'Login successful'})
                            response.set_cookie('user_id', user.id, httponly=True)
                            return response
                except Exception as e:
                    print(f"Error verifying face for user: {e}")
                    continue

            return JsonResponse({'message': 'Face not recognized'}, status=401)
        except Exception as e:
            print(f"Error processing the image: {e}")
            return JsonResponse({'message': 'An error occurred while processing the image'}, status=500)

from django.core.files.base import ContentFile
from io import BytesIO
import base64

def stringToRGBuffer(base64_string):
    imgdata = base64.b64decode(base64_string)
    img = Image.open(BytesIO(imgdata))
    opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    return opencv_img

class FaceRegisterView(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('image')
        user_id = request.data.get('user_id')

        format, imgstr = image_data.split(';base64,')
        opencv_image = stringToRGB(imgstr)
        
        
        try:
            user = User.objects.get(id=user_id)
            
            profile, created = FaceLoginProfile.objects.get_or_create(user=user)
            
            img = ContentFile(opencv_image, name=f'{user_id}_{profile.face_images.count() + 1}.jpg')

            FaceImage.objects.create(profile = profile, image = img) 


            return Response({'message': 'Image saved successfully'}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


'''================================================================================='''
'''================================================================================='''

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()


def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    img = Image.open(io.BytesIO(imgdata))
    opencv_img = cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
    return opencv_img

def imageSharpen(image):
    kernel = np.array([[-1, -1, -1],
                       [-1, 9, -1],
                       [-1, -1, -1]])
    return cv2.filter2D(image, -1, kernel)

def is_image_dark(image, threshold=50):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    avg_brightness = np.mean(gray_image)
    return avg_brightness < threshold

def is_image_blurred(image, threshold=20):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray_image, cv2.CV_64F).var()
    return laplacian_var < threshold





def detectEmotion(image, sharpened_image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_frame = cv2.cvtColor(sharpened_image, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return 'No Face Detected'
    elif len(faces) >= 2:
        return 'Multiple Faces Detected'

    for (x, y, w, h) in faces:
        face_roi = rgb_frame[y:y + h, x:x + w]

        result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        cv2.rectangle(sharpened_image, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(sharpened_image, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
        return emotion

    return 'No Emotion Detected'


class FaceLoginView(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')

        if not image_data:
            return JsonResponse({'message': 'No image provided'}, status=400)
        
        try:
            format, imgstr = image_data.split('image/jpeg;base64,')
            opencv_image = stringToRGB(imgstr)
            sharpened_image = imageSharpen(opencv_image)

            if is_image_dark(opencv_image):
                return JsonResponse({'message': 'Webcam cover is closed or image is too dark'})

            if is_image_blurred(opencv_image):
                return JsonResponse({'message': 'Image is blurred. Please clear the webcam.'})
        except:
            pass
        users = User.objects.all()

        for user in users:
            try:
                stored_face_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))

                result = DeepFace.verify(opencv_image, stored_face_path, enforce_detection=False)

                if result['verified']:
                    user = authenticate(request, username=user.username, password=user.password)
                    if user is not None:
                        login(request, user)
                        response = JsonResponse({'message': 'Login successful'})
                        response.set_cookie('user_id', user.id, httponly=True)
                        return response
            except Exception as e:
                print(f"Error verifying face for user: {e}")
                continue

        return JsonResponse({'message': 'Face not recognized'}, status=401)
    

@api_view(['GET'])
def check_face_login(request, user_id):
    try:
        profile = FaceLoginProfile.objects.get(user_id=user_id)
        return Response({'has_face_login': True})
    except FaceLoginProfile.DoesNotExist:
        return Response({'has_face_login': False})
    
@api_view(['POST'])
def start_face_registration(request):
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile, created = FaceLoginProfile.objects.get_or_create(user=user)
        if created:
            return Response({"message": "Registration started successfully"})
        elif (FaceLoginProfile.objects.filter(user=user_id)):
            return Response({"message": "Resume Registration"})
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(['POST'])
def complete_face_registration(request):
    user_id = request.data.get('user_id')
    try:
        user = User.objects.get(id=user_id)
        profile = FaceLoginProfile.objects.get(user=user)
        profile.completed = True
        profile.save()
        return Response({"message": "Registration completed successfully"})
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except FaceLoginProfile.DoesNotExist:
        return Response({"message": "Registration not started"}, status=400)

        

class EmotionDataView(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')
        userid = request.data.get('user_id')

        if not image_data or not userid:
            return JsonResponse({'emo': 'Missing frame or user_id', 'frq': 'none'})

        try:
            format, imgstr = image_data.split('image/jpeg;base64,')
            opencv_image = stringToRGB(imgstr)
            sharpened_image = imageSharpen(opencv_image)

            if is_image_dark(opencv_image):
                return JsonResponse({'emo': 'Webcam cover is closed or image is too dark', 'frq': 'none'})

            if is_image_blurred(opencv_image):
                return JsonResponse({'emo': 'Image is blurred. Please clear the webcam.', 'frq': 'none'})

            try:
                face_locations = face_recognition.face_locations(opencv_image)
                if face_locations:
                    for face_location in face_locations:
                        top, right, bottom, left = face_location
                        
                        face_image = opencv_image[top:bottom, left:right]

                        #emotion detection using DeepFace
                        emotion = detectEmotion(face_image, sharpened_image)

                        stress_weights = {
                            'angry': 4,
                            'disgust': 3,
                            'fear': 4,
                            'happy': -4,
                            'sad': 3,
                            'surprise': 1,
                            'neutral': 0
                        }

                        allowed_emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
                        if emotion in allowed_emotions:
                            # Create a new record in the Employee_Emotion model
                            Employee_Emotion.objects.create(employee_id=userid, emotion_data=emotion)

                            # Get the stress weight for the detected emotion
                            stress_weight = stress_weights.get(emotion, 0)

                            # Create a new record in the Employee_Stress model
                            Employee_Stress.objects.create(employee_id=userid, stress_data=stress_weight)

                            # Calculate the timestamp for one minute ago
                            one_minute_ago = timezone.now() - timedelta(minutes=1)

                            # Count the number of negative emotions in the last minute for this user
                            negative_emotions_count = Employee_Emotion.objects.filter(
                                employee_id=userid,
                                emotion_data__in=['sad', 'angry', 'disgust', 'fear'],
                                time__gte=one_minute_ago
                            ).count()

                            # Check if the count of negative emotions is 2 or more
                            if negative_emotions_count >= 3:
                                frq = "You seem to be stressed!"
                            else:
                                frq = "none"
                        else:
                            frq = "none"

                        # Return the emotion and frequency
                        return JsonResponse({'emo': emotion, 'frq': frq})

                return JsonResponse({'emo': 'No face detected', 'frq': 'none'})

            except Exception as e:
                return JsonResponse({'emo': 'Error occurred 1', 'frq': 'none'})

        except Exception as e:
            return JsonResponse({'emo': 'Error occurred', 'frq': 'none'})
        
    def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        user_id = request.GET.get('user_id')
        team_id = request.GET.get('team_id')
        period = request.GET.get('period', 'all_time') 

        if not user_id and not team_id:
            return JsonResponse({'error': 'User ID or Team ID is required'}, status=400)

        # Define the time filter based on the period
        if period == 'daily':
            time_threshold = datetime.now() - timedelta(days=1)
        elif period == 'weekly':
            time_threshold = datetime.now() - timedelta(weeks=1)
        elif period == 'monthly':
            time_threshold = datetime.now() - timedelta(days=30)
        else:
            time_threshold = None

        #Initialize filter parameters
        filter_params = {}
        if user_id and user_id != 'none':
            filter_params['employee_id'] = user_id
        elif team_id:
            if team_id == 'all':
                users = User.objects.all()
            else:
                users = User.objects.filter(team=team_id)
            user_ids = users.values_list('id', flat=True)
            filter_params['employee_id__in'] = user_ids

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

        hourly_dominant_emotions = {}

        current_date = datetime.now().date()
        start_hour = 7
        end_hour = 18

        for hour in range(start_hour, end_hour + 1):
            start_time = datetime.combine(current_date, datetime.min.time()) + timedelta(hours=hour)
            end_time = start_time + timedelta(hours=1)

            if period == 'daily':
                hourly_emotion = Employee_Emotion.objects.filter(**filter_params, time__gte=start_time, time__lt=end_time) \
                                    .values('emotion_data') \
                                    .annotate(count=Count('emotion_data')) \
                                    .order_by('-count') \
                                    .first()
            else:
                hourly_emotion = Employee_Emotion.objects.filter(**filter_params, time__hour=hour, time__gte=time_threshold) \
                                    .values('emotion_data') \
                                    .annotate(count=Count('emotion_data')) \
                                    .order_by('-count') \
                                    .first()

            if hourly_emotion:
                dominant_emotion = hourly_emotion['emotion_data']
            else:
                dominant_emotion = ''  

            hourly_dominant_emotions[f'{hour}:00 - {hour+1}:00'] = dominant_emotion
        print(hourly_dominant_emotions)

        response_data = {
            'defaultEmotionValues': defaultEmotionValues,
            'hourlyDominantEmotions': hourly_dominant_emotions
        }

        return Response(response_data)

class StressDataView(APIView):
    def get(self, request):
        user_id = request.GET.get('user')
        team_id = request.GET.get('team_id')
        period = request.GET.get('period')
        today = now().date()
        local_tz = local_timezone 

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  
            end_date = start_date + timedelta(days=6) 
            days = {day: 0 for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        elif period == 'monthly':
            start_date = today.replace(day=1)  
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  
            days_in_month = (end_date - start_date).days + 1
            days = {f'Day {i}': 0 for i in range(1, days_in_month + 1)} 
        elif period == 'daily':
            start_date = today
            end_date = today
            hours = range(7, 19, 1)  
            days = {f'{hour}:00 - {hour+1}:00': 0 for hour in hours}
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        filter_params = {}
        if user_id and user_id != 'none':
            filter_params['employee_id'] = user_id
        elif team_id:
            if team_id == 'all':
                users = User.objects.all()
            else:
                users = User.objects.filter(team=team_id)
            user_ids = users.values_list('id', flat=True)
            filter_params['employee_id__in'] = user_ids

        stress_records = Employee_Stress.objects.filter(
            **filter_params,
            timestamp__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractHour('timestamp') if period == 'daily' else (ExtractDay('timestamp') if period == 'monthly' else ExtractWeekDay('timestamp'))
        ).values('timestamp', 'day').annotate(total_stress=Sum('stress_data'))

        for record in stress_records:
            timestamp = record['timestamp']
            local_time = timestamp.astimezone(local_tz)
            if period == 'daily':
                hour = local_time.hour
                hour_range = f"{hour}:00 - {hour + 1}:00"
                if hour_range in days:
                    days[hour_range] = record['total_stress']
            elif period == 'weekly':
                adjusted_day = (record['day'] + 5) % 7 
                weekday_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][adjusted_day]
                days[weekday_name] = record['total_stress']
            else:
                day_name = f"Day {record['day']}"
                days[day_name] = record['total_stress']

        return Response({
            "days": days,
        })

    

class EmployeeEmotionDataView(APIView):
    def get(self, request):
        # Initialize default emotion values
        defaultEmotionValues = {
            'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0
        }

        # Fetch emotion data for all employees
        emotion_counts_list = Employee_Emotion.objects.values('emotion_data') \
                                    .annotate(count=Count('emotion_data')) \
                                    .order_by('emotion_data') \
                                    .values_list('emotion_data', 'count')

        emotion_counts_dict = dict(emotion_counts_list)

        for key in defaultEmotionValues:
            if key in emotion_counts_dict:
                defaultEmotionValues[key] += emotion_counts_dict[key]

        return Response(defaultEmotionValues)
    
class WeeklyEmployeeEmotionDataView(APIView):
    def get(self, request):
        # Initialize default emotion values
        defaultEmotionValues = {
            'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0
        }

        # Get the current date and time
        now = timezone.now()

        start_of_week = now - timedelta(days=now.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        emotion_counts_list = Employee_Emotion.objects.filter(
            time__date__range=[start_of_week.date(), end_of_week.date()]
        ).values('emotion_data') \
        .annotate(count=Count('emotion_data')) \
        .order_by('emotion_data') \
        .values_list('emotion_data', 'count')

        emotion_counts_dict = dict(emotion_counts_list)

        for key in defaultEmotionValues:
            if key in emotion_counts_dict:
                defaultEmotionValues[key] += emotion_counts_dict[key]

        return Response(defaultEmotionValues)



class EmployeeTeamView(APIView):
    def get(self, request):
        queryset = Employee_Team.objects.all()
        if not queryset.exists():
            return Response({"message": "No Teams Yet"}, status=status.HTTP_200_OK)
        serializer = EmployeeTeamSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = request.data
            name = data.get('name')
            description = data.get('description')

            if Employee_Team.objects.filter(name=name).exists():
                raise ValidationError({"name": "A team with this name already exists."})

            new_team = Employee_Team.create_team(name=name, description=description)

            return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class BreathingExerciseUsageView(APIView):
    @csrf_exempt
    def post(self, request):
        id = request.data['user']
        exercise_name = request.data['exercise_name']
        duration = request.data['duration']

        BreathingExerciseUsage.objects.create(employee_id=id, exercise_name=exercise_name, duration=duration)
        return Response(status=status.HTTP_201_CREATED)
    def get(self, request):
        user_id = request.GET.get('user')
        team_id = request.GET.get('team_id')
        period = request.GET.get('period')
        today = now().date()
        local_tz = local_timezone

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  
            end_date = start_date + timedelta(days=6) 
            days = {day: 0 for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        elif period == 'monthly':
            start_date = today.replace(day=1) 
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  
            days_in_month = (end_date - start_date).days + 1
            days = {f'Day {i}': 0 for i in range(1, days_in_month + 1)}  
        elif period == 'daily':
            start_date = today
            end_date = today
            hours = range(8, 19, 1)  
            days = {f'{hour}:00 - {hour+1}:00': 0 for hour in hours}
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        filter_params = {}
        if user_id and user_id != 'none':
            filter_params['employee_id'] = user_id
        elif team_id:
            if team_id == 'all':
                users = User.objects.all()
            else:
                users = User.objects.filter(team=team_id)
            user_ids = users.values_list('id', flat=True)
            filter_params['employee_id__in'] = user_ids

        usage_records = BreathingExerciseUsage.objects.filter(
            **filter_params,
            timestamp__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractHour('timestamp') if period == 'daily' else (ExtractDay('timestamp') if period == 'monthly' else ExtractWeekDay('timestamp'))
        ).values('timestamp', 'day').annotate(total_duration=Sum('duration'))

        for record in usage_records:
            timestamp = record['timestamp']
            local_time = timestamp.astimezone(local_tz)
            if period == 'daily':
                hour = local_time.hour
                hour_range = f"{hour}:00 - {hour + 1}:00"
                if hour_range in days:
                    days[hour_range] = record['total_duration']
            elif period == 'weekly':
                adjusted_day = (record['day'] + 5) % 7  
                weekday_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][adjusted_day]
                days[weekday_name] = record['total_duration']
            else:
                day_name = f"Day {record['day']}"
                days[day_name] = record['total_duration']

        most_used_exercise = BreathingExerciseUsage.objects.filter(
            **filter_params,
            timestamp__date__range=[start_date, end_date]
        ).values('exercise_name').annotate(total_duration=Sum('duration')).order_by('-total_duration').first()
        
        return Response({
            "days": days,
            "most_used_exercise": most_used_exercise
        })
    
class TrackListeningView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            user_id = request.data.get('user')
            track_name = request.data.get('track_name')
            duration = request.data.get('duration')

            if user_id is None or track_name is None or duration is None:
                return Response({"error": "User, track name, and duration are required"}, status=status.HTTP_400_BAD_REQUEST)

            if duration <= 10:
                return Response({"error": "Duration must be greater than 10"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                TrackListening.objects.create(employee_id=user_id, track_name=track_name, duration=duration)
                return Response({"message": "Track listening recorded successfully"}, status=status.HTTP_201_CREATED)

        except KeyError as e:
            return Response({"error": f"Missing key: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request):
        user_id = request.GET.get('user')
        team_id = request.GET.get('team_id')
        period = request.GET.get('period')
        today = now().date()
        local_tz = local_timezone  

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  
            end_date = start_date + timedelta(days=6)  
            days = {day: 0 for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        elif period == 'monthly':
            start_date = today.replace(day=1)  
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  
            days_in_month = (end_date - start_date).days + 1
            days = {f'Day {i}': 0 for i in range(1, days_in_month + 1)}  
        elif period == 'daily':
            start_date = today
            end_date = today
            hours = range(8, 19, 1)  
            days = {f'{hour}:00 - {hour+1}:00': 0 for hour in hours}
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        filter_params = {}
        if user_id and user_id != 'none':
            filter_params['employee_id'] = user_id
        elif team_id:
            if team_id == 'all':
                users = User.objects.all()
            else:
                users = User.objects.filter(team=team_id)
            user_ids = users.values_list('id', flat=True)
            filter_params['employee_id__in'] = user_ids

        usage_records = TrackListening.objects.filter(
            **filter_params,
            timestamp__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractHour('timestamp') if period == 'daily' else (ExtractDay('timestamp') if period == 'monthly' else ExtractWeekDay('timestamp'))
        ).values('timestamp', 'day').annotate(total_duration=Sum('duration'))

        for record in usage_records:
            timestamp = record['timestamp']
            local_time = timestamp.astimezone(local_tz)
            if period == 'daily':
                hour = local_time.hour
                hour_range = f"{hour}:00 - {hour + 1}:00"
                if hour_range in days:
                    days[hour_range] = record['total_duration']
            elif period == 'weekly':
                adjusted_day = (record['day'] + 5) % 7 
                weekday_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][adjusted_day]
                days[weekday_name] = record['total_duration']
            else:
                day_name = f"Day {record['day']}"
                days[day_name] = record['total_duration']

        most_listened_track = TrackListening.objects.filter(
            **filter_params,
            timestamp__date__range=[start_date, end_date]
        ).values('track_name').annotate(total_duration=Sum('duration')).order_by('-total_duration').first()

        return Response({
            "days": days,
            "most_listened_track": most_listened_track
        })
    
class EmotionTeamDataView(APIView):
    def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        team_id = request.GET.get('team_id')
        period = request.GET.get('period', 'all_time')  

        if not team_id:
            return JsonResponse({'error': 'Team ID is required'}, status=400)

        if period == 'daily':
            time_threshold = datetime.now() - timedelta(days=1)
        elif period == 'weekly':
            time_threshold = datetime.now() - timedelta(weeks=1)
        elif period == 'monthly':
            time_threshold = datetime.now() - timedelta(days=30)
        else:
            time_threshold = None

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

        emotion_counts_dict = dict(emotion_counts_list)

        for key in defaultEmotionValues:
            if key in emotion_counts_dict:
                defaultEmotionValues[key] += emotion_counts_dict[key]

        hourly_dominant_emotions = {}

        current_date = datetime.now().date()
        start_hour = 7
        end_hour = 18

        for hour in range(start_hour, end_hour + 1):
            start_time = datetime.combine(current_date, datetime.min.time()) + timedelta(hours=hour)
            end_time = start_time + timedelta(hours=1)

            hourly_emotion = Employee_Emotion.objects.filter(**filter_params, time__gte=start_time, time__lt=end_time) \
                                  .values('emotion_data') \
                                  .annotate(count=Count('emotion_data')) \
                                  .order_by('-count') \
                                  .first()

            if hourly_emotion:
                dominant_emotion = hourly_emotion['emotion_data']
            else:
                dominant_emotion = ''  

            hourly_dominant_emotions[f'{hour}:00 - {hour+1}:00'] = dominant_emotion
        
        response_data = {
            'defaultEmotionValues': defaultEmotionValues,
            'hourlyDominantEmotions': hourly_dominant_emotions
        }

        return Response(response_data)



class TeamDetection(APIView):
    @staticmethod
    def get_stress_score(user):
        try:
            latest_form = StressDetectionForm.objects.filter(user=user).order_by('-submitted_at').first()
            
            if latest_form:
                submission_date = latest_form.submitted_at.strftime('%d-%m-%Y')  # Format the date as day-month
                return {'score': latest_form.score, 'submitted_on': submission_date}
            else:
                return {'score': None, 'submitted_on': None}
        except Exception as e:
            return {'score': None, 'submitted_on': None}
        
    def get(self, request):
        team = request.GET.get('team')
        if not team:
            return Response({'error': 'Team is required'}, status=400)

        team_members = list(User.objects.filter(team=team).values('id', 'first_name', 'last_name', 'email', 'profile_picture', 'is_staff'))
        
        if not team_members:
            return Response({'team_members': 'No Team Members Yet'})

        for member in team_members:
            stress_info = self.get_stress_score(member['id'])

            member.update({
                'emotion': 'happy',
                'stress': 'low',
                'breathing': 'white noise',
                'audio': 'rain',
                'stress_score': stress_info['score'],
                'submitted_on': stress_info['submitted_on']
            })
        
        return Response({'team_members': team_members})
    

    
class StressFormDetail(APIView):
    def get(self, request, user_id):
        try:
            form = StressDetectionForm.objects.filter(user_id=user_id).latest('submitted_at')
            data = {
                'answers': form.answers,
                'additional_comments': form.additional_comments,
                'submitted_at': form.submitted_at.strftime('%d-%m-%Y'),
            }
            return Response(data, status=status.HTTP_200_OK)
        except StressDetectionForm.DoesNotExist:
            return Response({'error': 'No stress detection form found for this user'}, status=status.HTTP_404_NOT_FOUND)
    

class LatestStressFormDate(APIView):
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({'error': 'user_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            form = StressDetectionForm.objects.filter(user_id=user_id).latest('submitted_at')
            data = {
                'submitted_at': form.submitted_at.strftime('%d-%m-%Y'),
            }
            return Response(data, status=status.HTTP_200_OK)
        except StressDetectionForm.DoesNotExist:
            return Response({'error': 'No stress detection form found for this user'}, status=status.HTTP_404_NOT_FOUND)



def employee_list(request):
    search_query = request.GET.get('search', '')

    if search_query:
        employees = User.objects.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    else:
        employees = User.objects.all()

    employee_data = [
        {
            'id': emp.id,
            'first_name': emp.first_name,
            'last_name': emp.last_name,
            'email': emp.email,
            'team': emp.team,
            'employment_type': emp.employment_type,
            'work_location': emp.work_location,
            'is_superuser': emp.is_superuser,
            'is_staff': emp.is_staff,
        }
        for emp in employees
    ]
    return JsonResponse(employee_data, safe=False)


class StressQuestionListCreateView(generics.ListCreateAPIView):
    queryset = StressQuestion.objects.all()
    serializer_class = StressQuestionSerializer

class StressQuestionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StressQuestion.objects.all()
    serializer_class = StressQuestionSerializer


class SaveSettingsView(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        dark_mode = request.data.get('dark_mode', False)
        notifications = request.data.get('notifications', False)

        user.dark_mode = dark_mode
        user.notifications = notifications
        user.save()

        return Response({"message": "Settings updated successfully."}, status=200)


class SubmitStressFormView(APIView):
    serializer_class = StressDetectionFormSerializer

    def post(self, request):
        user = User.objects.get(id=request.data['user'])
        answers = request.data['answers']
        score = request.data['score']
        additional_comments = request.data['additional_comments']

        StressDetectionForm.objects.create(user=user, answers=answers, score=score, additional_comments=additional_comments)
        return Response(status=status.HTTP_201_CREATED)


class ReportGeneratedView(APIView):
    def get(self, request):
        pass

    def post(self, request):
        try:
            downloaded_by = User.objects.get(id=request.data['downloaded_by'])
            role = request.data['role']
            timestamp = request.data['timestamp']

            report = ReportGeneration.objects.create(downloaded_by=downloaded_by, role=role, timestamp=timestamp)
            
            return Response(
                status=status.HTTP_201_CREATED
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class BreathingProfileAPIView(APIView):
    def get(self, request, format=None):
        profiles = BreathingProfile.objects.all()
        serializer = BreathingProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BreathingProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        try:
            profile = BreathingProfile.objects.get(pk=pk)
        except BreathingProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BreathingProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        try:
            profile = BreathingProfile.objects.get(pk=pk)
        except BreathingProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class TrackListCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        tracks = Track.objects.all()
        serializer = TrackSerializer(tracks, many=True)
        return Response(serializer.data)

    def post(self, request):
        if Track.objects.filter(title=request.data.get('title')).exists():
            raise ValidationError({"title": "A track with this title already exists."})
        serializer = TrackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        track = get_object_or_404(Track, pk=pk)
        track.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ReminderCreateView(generics.CreateAPIView):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

import face_recognition

model_points = np.array([
    (0.0, 0.0, 0.0),             # Nose tip
    (0.0, -330.0, -65.0),        # Chin
    (-225.0, 170.0, -135.0),     # Left eye 
    (225.0, 170.0, -135.0),      # Right eye
    (-150.0, -150.0, -125.0),    # Left Mouth corner
    (150.0, -150.0, -125.0)      # Right mouth corner
], dtype=np.float32)

class FocusDataView(APIView):
    def get(self, request):
        user_id = request.GET.get('user_id')
        team_id = request.GET.get('team_id')
        period = request.GET.get('period', 'all_time')
        today = now().date()
        local_tz = local_timezone   

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  
            end_date = start_date + timedelta(days=6)  
            days = {day: {'F': 0, 'NF': 0} for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
        elif period == 'monthly':
            start_date = today.replace(day=1)  
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1) 
            days_in_month = (end_date - start_date).days + 1
            days = {f'Day {i}': {'F': 0, 'NF': 0} for i in range(1, days_in_month + 1)}  
        elif period == 'daily':
            start_date = today
            end_date = today
            hours = range(8, 19, 1) 
            days = {f'{hour}:00 - {hour+1}:00': {'F': 0, 'NF': 0} for hour in hours}
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        filter_params = {}
        if user_id and user_id != 'none':
            filter_params['employee_id'] = user_id
        elif team_id:
            if team_id == 'all':
                users = User.objects.all()
            else:
                users = User.objects.filter(team=team_id)
            user_ids = users.values_list('id', flat=True)
            filter_params['employee_id__in'] = user_ids

        usage_records = Employee_Focus.objects.filter(
            **filter_params,
            time__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractHour('time') if period == 'daily' else (ExtractDay('time') if period == 'monthly' else ExtractWeekDay('time'))
        ).values('time', 'day', 'focus_data').annotate(total_count=Count('focus_data'))

        for record in usage_records:
            timestamp = record['time']
            local_time = timestamp.astimezone(local_tz)
            if period == 'daily':
                hour = local_time.hour
                hour_range = f"{hour}:00 - {hour + 1}:00"
                if hour_range in days:
                    days[hour_range][record['focus_data']] += record['total_count']
            elif period == 'weekly':
                adjusted_day = (record['day'] + 5) % 7  
                weekday_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][adjusted_day]
                days[weekday_name][record['focus_data']] += record['total_count']
            else:
                day_name = f"Day {record['day']}"
                days[day_name][record['focus_data']] += record['total_count']

        response_data = {day: {"focused": data['F'], "unfocused": data['NF']} for day, data in days.items()}
        return Response({
            "days": response_data,
        })

    @csrf_exempt
    def post(self, request):
        image_data = request.POST.get('frame')
        userid = request.POST.get('user_id')

        if not image_data or not userid:
            return JsonResponse({'focused': False, 'text': 'Missing frame or user_id'})
        
        try:
            format, imgstr = image_data.split('image/jpeg;base64,')
            opencv_image = stringToRGB(imgstr)

            if is_image_dark(opencv_image):
                return JsonResponse({'text': 'Webcam cover is closed or image is too dark'})

            elif is_image_blurred(opencv_image):
                return JsonResponse({'text': 'Image is blurred. Please clear the webcam.'})
            else:
                try:
                    face_locations = face_recognition.face_locations(opencv_image)
                    if face_locations:
                        for face_location in face_locations:
                            # Extract the facial landmarks
                            face_landmarks = face_recognition.face_landmarks(opencv_image, [face_location])
                            if face_landmarks:
                                landmarks = face_landmarks[0]

                                # Extract 2D coordinates of the facial landmarks
                                image_points = np.array([
                                    landmarks['nose_tip'][2],    # Nose tip
                                    landmarks['chin'][8],        # Chin
                                    landmarks['left_eye'][0],    # Left eye left corner
                                    landmarks['right_eye'][3],   # Right eye right corner
                                    landmarks['top_lip'][0],     # Left Mouth corner
                                    landmarks['top_lip'][6]      # Right mouth corner
                                ], dtype=np.float32)

                                # Camera matrix
                                focal_length = opencv_image.shape[1]
                                center = (opencv_image.shape[1] // 2, opencv_image.shape[0] // 2)
                                camera_matrix = np.array([
                                    [focal_length, 0, center[0]],
                                    [0, focal_length, center[1]],
                                    [0, 0, 1]
                                ], dtype=np.float32)

                                dist_coeffs = np.zeros((4, 1))

                                #SolvePnP to find the rotation and translation vectors
                                success, rotation_vector, translation_vector = cv2.solvePnP(
                                    model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE)

                                #Project a 3D point (0, 0, 1000.0) onto the image plane to draw a line indicating the head pose
                                (nose_end_point2D, jacobian) = cv2.projectPoints(
                                    np.array([(0.0, 0.0, 1000.0)]), rotation_vector, translation_vector, camera_matrix, dist_coeffs)

                                #Draw the nose line
                                p1 = (int(image_points[0][0]), int(image_points[0][1]))
                                p2 = (int(nose_end_point2D[0][0][0]), int(nose_end_point2D[0][0][1]))
                                cv2.line(opencv_image, p1, p2, (255, 0, 0), 2)

                                rvec_matrix = cv2.Rodrigues(rotation_vector)[0]
                                proj_matrix = np.hstack((rvec_matrix, translation_vector))
                                eulerAngles = cv2.decomposeProjectionMatrix(proj_matrix)[6]
                                yaw = eulerAngles[1]

                                focused = -25 < yaw < 25

                                #Simple gaze detection (based on eye landmarks)
                                left_eye_center = np.mean(landmarks['left_eye'], axis=0).astype(int)
                                right_eye_center = np.mean(landmarks['right_eye'], axis=0).astype(int)
                                gaze_direction = (left_eye_center[0] + right_eye_center[0]) / 2  # Simplified

                                gaze_focused = 0.3 * opencv_image.shape[1] < gaze_direction < 0.7 * opencv_image.shape[1]  # Adjust as needed

                                if focused and gaze_focused:
                                    focus_status = 'F'
                                    Employee_Focus.objects.create(employee_id=userid, focus_data='F')
                                else:
                                    focus_status = 'NF'
                                    Employee_Focus.objects.create(employee_id=userid, focus_data='NF')

                                print(focus_status)
                                return JsonResponse({'text': focus_status})
                    
                    return JsonResponse({'focused': False, 'text': 'No face detected'})
                
                except Exception as e:
                    return JsonResponse({'focused': False, 'text': 'error'})
        except:
            return JsonResponse({'focused': False, 'text': 'error'})

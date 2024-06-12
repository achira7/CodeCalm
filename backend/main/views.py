import io
import os
from django.contrib.auth import get_user_model

#from distutils import dist, file_util
from matplotlib.image import pil_to_array

#from imp import load_module
from .models import Employee_Emotion, Employee_Team, Employee_Focus, BreathingExerciseUsage, TrackListening

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import permissions, status, generics
from .serializers import UserSerializer, EmployeeTeamSerializer, BreathingExerciseUsageSerializer, TrackListeningSerializer  
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
import mediapipe as mp

from datetime import datetime, timedelta
from django.db.models import Sum
from collections import defaultdict
from django.db.models.functions import ExtractDay, ExtractWeekDay
from rest_framework.views import APIView
from django.utils.timezone import now
from django.db.models import Sum

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
            try:
                user = User.objects.get(id=user_id)
                user = {
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,

                }
                return Response(user)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response({'error': 'User ID cookie not found'}, status=400)


class QLoginAPIView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            raise exceptions.AuthenticationFailed('Email and password are required')

        user = authenticate(request, email=email, password=password)

        if user is None:
            raise exceptions.AuthenticationFailed('Invalid username or password')

        # Prepare the user data to return
        user_data = {
            'user_id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        }

        # Create response
        response = Response({
            'message': 'Login successful',
            'user': user_data,
        }, status=status.HTTP_200_OK)

        response.set_cookie('user_id', user.id, httponly=True)

        return response

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
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer


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

"""====================================================================================================="""


    
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


def gazeEstimation(img):
    gz = Gazetimation()  # Initialize the Gazetimation class with device ID 0 (default webcam)
    gaze = gz.run(img)  # Perform gaze estimation on the input image

    # Check if the user is looking at the camera
    if gaze['looking_prob'] > 0.5:
        return "Concentrated"
    else:
        return "Not Concentrated"

class WriteImage(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')
        userid = request.data.get('user_id')
        
        if image_data:
            imgstr = image_data.split('image/jpeg;base64,')

            opencv_image = stringToRGB(imgstr)

            cv2.imwrite(rf'media/{userid}.jpg', opencv_image)
           
            print('image written') 

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
            sharpened_image = imageSharpen(opencv_image)

            if is_image_dark(opencv_image):
                return JsonResponse({'message': 'Webcam cover is closed or image is too dark'})

            if is_image_blurred(opencv_image):
                return JsonResponse({'message': 'Image is blurred. Please clear the webcam.'})
        except:
            pass

        # Assuming that user's facial data is stored in their profile
        users = User.objects.all()

        for user in users:
            try:
                # Get the path to the stored face image
                stored_face_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))

                # Compare the captured face with the stored face data
                result = DeepFace.verify(opencv_image, stored_face_path, enforce_detection=False)

                if result['verified']:
                    # Authenticate the user
                    user = authenticate(request, username=user.username, password=user.password)
                    if user is not None:
                        login(request, user)
                        response = JsonResponse({'message': 'Login successful'})
                        response.set_cookie('user_id', user.id, httponly=True)
                        return response
            except Exception as e:
                print(f"Error verifying face for user {user.username}: {e}")
                continue

        return JsonResponse({'message': 'Face not recognized'}, status=401)
    

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





def get_gaze_ratio(eye_points, landmarks, frame, gray):
    eye_region = np.array([(landmarks[point][0], landmarks[point][1]) for point in eye_points], np.int32)

    # Create a mask to isolate the eye region
    height, width = gray.shape
    mask = np.zeros((height, width), np.uint8)
    cv2.polylines(mask, [eye_region], True, 255, 2)
    cv2.fillPoly(mask, [eye_region], 255)
    eye = cv2.bitwise_and(gray, gray, mask=mask)

    # Find the coordinates of the eye region
    min_x = np.min(eye_region[:, 0])
    max_x = np.max(eye_region[:, 0])
    min_y = np.min(eye_region[:, 1])
    max_y = np.max(eye_region[:, 1])

    gray_eye = eye[min_y: max_y, min_x: max_x]
    _, threshold_eye = cv2.threshold(gray_eye, 70, 255, cv2.THRESH_BINARY)
    
    height, width = threshold_eye.shape
    left_side_threshold = threshold_eye[0: height, 0: int(width / 2)]
    left_side_white = cv2.countNonZero(left_side_threshold)
    right_side_threshold = threshold_eye[0: height, int(width / 2): width]
    right_side_white = cv2.countNonZero(right_side_threshold)

    top_side_threshold = threshold_eye[0: int(height / 2), 0: width]
    top_side_white = cv2.countNonZero(top_side_threshold)
    bottom_side_threshold = threshold_eye[int(height / 2): height, 0: width]
    bottom_side_white = cv2.countNonZero(bottom_side_threshold)

    if left_side_white == 0 or right_side_white == 0:
        gaze_ratio_horizontal = 1
    else:
        gaze_ratio_horizontal = right_side_white / left_side_white

    if top_side_white == 0 or bottom_side_white == 0:
        gaze_ratio_vertical = 1
    else:
        gaze_ratio_vertical = bottom_side_white / top_side_white

    return gaze_ratio_horizontal, gaze_ratio_vertical

def check_user_focus(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            landmarks = []
            for i in range(468):
                x = int(face_landmarks.landmark[i].x * frame.shape[1])
                y = int(face_landmarks.landmark[i].y * frame.shape[0])
                landmarks.append((x, y))

            left_eye_ratio_horizontal, left_eye_ratio_vertical = get_gaze_ratio(
                [33, 160, 158, 133, 153, 144], landmarks, frame, gray
            )
            right_eye_ratio_horizontal, right_eye_ratio_vertical = get_gaze_ratio(
                [362, 385, 387, 263, 373, 380], landmarks, frame, gray
            )

            avg_gaze_ratio_horizontal = (left_eye_ratio_horizontal + right_eye_ratio_horizontal) / 2
            avg_gaze_ratio_vertical = (left_eye_ratio_vertical + right_eye_ratio_vertical) / 2

            # Adjust thresholds based on testing and requirements
            horizontal_focus_range = (0.8, 1.2)
            vertical_focus_range = (0.8, 1.2)

            if horizontal_focus_range[0] <= avg_gaze_ratio_horizontal <= horizontal_focus_range[1] and \
               vertical_focus_range[0] <= avg_gaze_ratio_vertical <= vertical_focus_range[1]:
                return "User is focused"
            else:
                return "User is not focused"

    return "No face detected"




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

        # Assuming that user's facial data is stored in their profile
        users = User.objects.all()

        for user in users:
            try:
                # Get the path to the stored face image
                stored_face_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))

                # Compare the captured face with the stored face data
                result = DeepFace.verify(opencv_image, stored_face_path, enforce_detection=False)

                if result['verified']:
                    # Authenticate the user
                    user = authenticate(request, username=user.username, password=user.password)
                    if user is not None:
                        login(request, user)
                        response = JsonResponse({'message': 'Login successful'})
                        response.set_cookie('user_id', user.id, httponly=True)
                        return response
            except Exception as e:
                print(f"Error verifying face for user {user.username}: {e}")
                continue

        return JsonResponse({'message': 'Face not recognized'}, status=401)
        

class DetectionView(APIView):
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

            # Perform gaze detection
            gaze_status = check_user_focus(sharpened_image)

            if gaze_status == 'User is focused':
                Employee_Focus.objects.create(employee_id=userid, focus_data='F')
            elif gaze_status in ['User is not focused']:
                Employee_Focus.objects.create(employee_id=userid, focus_data='NF')

            # Perform emotion detection
            emotion = detectEmotion(opencv_image, sharpened_image)

            allowed_emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
            if emotion in allowed_emotions:
                # Create a new record in the Employee_Emotion model
                Employee_Emotion.objects.create(employee_id=userid, emotion_data=emotion)

                # Calculate the timestamp for one minute ago
                one_minute_ago = timezone.now() - timedelta(minutes=1)

                # Count the number of negative emotions in the last minute for this user
                negative_emotions_count = Employee_Emotion.objects.filter(
                    employee_id=userid,
                    emotion_data__in=['sad', 'angry', 'disgust', 'fear'],
                    time__gte=one_minute_ago
                ).count()

                # Check if the count of negative emotions is 2 or more
                if negative_emotions_count >= 2:
                    frq = "You seem to be stressed!"
                else:
                    frq = "none"
            else:
                frq = "none"

            # Return the emotion, frequency, and gaze estimation
            return JsonResponse({'emo': emotion, 'frq': frq, 'gaze': gaze_status})

        except Exception as e:
            return JsonResponse({'emo': 'Error occurred', 'frq': 'none', 'gaze': 'Error'})
        



"""===================================================================================================="""
"""===================================================================================================="""
"""===================================================================================================="""
"""===================================================================================================="""
"""===================================================================================================="""




class EmotionDataView(APIView):
    def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        userid = request.GET.get('user_id')
        period = request.GET.get('period', 'all_time')  # Default to 'all_time' if not provided

        # Check if user_id is provided in the request
        if not userid:
            return JsonResponse({'error': 'User ID is required'}, status=400)

        # Define the time filter based on the period
        if period == 'daily':
            time_threshold = datetime.now() - timedelta(days=1)
        elif period == 'weekly':
            time_threshold = datetime.now() - timedelta(weeks=1)
        elif period == 'monthly':
            time_threshold = datetime.now() - timedelta(days=30)
        else:
            time_threshold = None

        # Fetch emotion data for the specified user_id and time period
        if time_threshold:
            emotion_counts_list = Employee_Emotion.objects.filter(employee_id=userid, time__gte=time_threshold) \
                                        .values('emotion_data') \
                                        .annotate(count=Count('emotion_data')) \
                                        .order_by('emotion_data') \
                                        .values_list('emotion_data', 'count')
        else:
            emotion_counts_list = Employee_Emotion.objects.filter(employee_id=userid) \
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

        print(defaultEmotionValues)

        return Response(defaultEmotionValues)
    





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

        # Convert the queryset to a dictionary
        emotion_counts_dict = dict(emotion_counts_list)

        # Update defaultEmotionValues with the fetched emotion counts
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

        # Calculate the start and end dates of the current week (assuming week starts on Monday)
        start_of_week = now - timedelta(days=now.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        # Fetch emotion data for all employees during the current week
        emotion_counts_list = Employee_Emotion.objects.filter(
            time__date__range=[start_of_week.date(), end_of_week.date()]
        ).values('emotion_data') \
        .annotate(count=Count('emotion_data')) \
        .order_by('emotion_data') \
        .values_list('emotion_data', 'count')

        # Convert the queryset to a dictionary
        emotion_counts_dict = dict(emotion_counts_list)

        # Update defaultEmotionValues with the fetched emotion counts
        for key in defaultEmotionValues:
            if key in emotion_counts_dict:
                defaultEmotionValues[key] += emotion_counts_dict[key]

        print(defaultEmotionValues)

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

            # Create a new team instance using the create_team class method
            new_team = Employee_Team.create_team(name=name, description=description)

            return Response({"message": "Team created successfully"}, status=status.HTTP_201_CREATED)

        except Employee_Team.DoesNotExist:
            return Response({"error": "Team does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class BreathingExerciseUsageView(APIView):
    def post(self, request):
        id = request.data['user']
        exercise_name = request.data['exercise_name']
        duration = request.data['duration']

        BreathingExerciseUsage.objects.create(employee_id=id, exercise_name=exercise_name, duration=duration)
        return Response(status=status.HTTP_201_CREATED)

    def get(self, request):
        user_id = request.GET.get('user')
        period = request.GET.get('period')
        today = now().date()

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  # Start of the week (Monday)
            end_date = start_date + timedelta(days=6)  # End of the week (Sunday)
            days = {str(i): 0 for i in range(1, 8)}  # Initialize days 1-7 (Monday-Sunday)
        elif period == 'monthly':
            start_date = today.replace(day=1)  # Start of the month
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  # End of the month
            days_in_month = (end_date - start_date).days + 1
            days = {str(i): 0 for i in range(1, days_in_month + 1)}  # Initialize days 1-31 (or the number of days in the month)
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        usage_records = BreathingExerciseUsage.objects.filter(
            employee_id=user_id,
            timestamp__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractDay('timestamp') if period == 'monthly' else ExtractWeekDay('timestamp')
        ).values('day').annotate(total_duration=Sum('duration'))

        for record in usage_records:
            days[str(record['day'])] = record['total_duration']

        most_used_exercise = BreathingExerciseUsage.objects.filter(
            employee_id=user_id,
            timestamp__date__range=[start_date, end_date]
        ).values('exercise_name').annotate(total_duration=Sum('duration')).order_by('-total_duration').first()

        return Response({
            "days": days,
            "most_used_exercise": most_used_exercise
        })
    


class TrackListeningView(APIView):
    def post(self, request):
        user_id = request.data['user']
        track_name = request.data['track_name']
        duration = request.data['duration']

        if duration > 10:
            TrackListening.objects.create(employee_id=user_id, track_name=track_name, duration=duration)
            return Response(status=status.HTTP_201_CREATED)
        return Response({"error": "Duration must be greater than 10"}, status=400)

    def get(self, request):
        user_id = request.GET.get('user')
        period = request.GET.get('period')
        today = now().date()

        if period == 'weekly':
            start_date = today - timedelta(days=today.weekday())  # Start of the week (Monday)
            end_date = start_date + timedelta(days=6)  # End of the week (Sunday)
            days = {str(i): 0 for i in range(1, 8)}  # Initialize days 1-7 (Monday-Sunday)
        elif period == 'monthly':
            start_date = today.replace(day=1)  # Start of the month
            end_date = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)  # End of the month
            days_in_month = (end_date - start_date).days + 1
            days = {str(i): 0 for i in range(1, days_in_month + 1)}  # Initialize days 1-31 (or the number of days in the month)
        else:
            return Response({"error": "Invalid period specified"}, status=400)

        usage_records = TrackListening.objects.filter(
            employee_id=user_id,
            timestamp__date__range=[start_date, end_date]
        ).annotate(
            day=ExtractDay('timestamp') if period == 'monthly' else ExtractWeekDay('timestamp')
        ).values('day').annotate(total_duration=Sum('duration'))

        for record in usage_records:
            days[str(record['day'])] = record['total_duration']

        most_listened_track = TrackListening.objects.filter(
            employee_id=user_id,
            timestamp__date__range=[start_date, end_date]
        ).values('track_name').annotate(total_duration=Sum('duration')).order_by('-total_duration').first()

        return Response({
            "days": days,
            "most_listened_track": most_listened_track
        })
        

        

     




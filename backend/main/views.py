import gzip
import io
from linecache import cache
import os
import random
import string
from uuid import uuid4
from django import utils
from django.contrib.auth import get_user_model

#from distutils import dist, file_util
from matplotlib.image import pil_to_array

#from imp import load_module
from .models import UserTokens, PasswordReset, Employee_Emotion

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import get_authorization_header
from rest_framework import permissions, status, generics
from .serializers import UserSerializer, EmployeeEmotionSerializer  
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.views import View
from django.conf import settings
from .authentication import JWTAuthentication
from rest_framework import exceptions 
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm 


import jwt, datetime
from django.utils import timezone
from django.core.mail import send_mail
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
from django.core.files.base import ContentFile
from PIL import Image
from django.db.models import Count

from gazetimation import Gazetimation
from django.utils import timezone
from django.db.models import Count
from rest_framework.response import Response
from datetime import timedelta

from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login




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

            team = data.get('team')
            gender = data.get('gender')
            employment_type = data.get('employment_type')
            work_location = data.get('work_location')
            profile_picture = data.get('profile_picture')
             
            if (is_staff == True):
                user = User.objects.create_superuser(email=email, first_name=first_name, last_name=last_name, password=password)
                message = 'Admin account created successfully!'
            else:
                user = User.objects.create_user(email=email, first_name=first_name, last_name=last_name, password=password, team=team, gender=gender, employment_type=employment_type, work_location=work_location, profile_picture=profile_picture, is_superuser=is_superuser)
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
                    'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,

                }
                return Response(user)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)
        else:
            return Response({'error': 'User ID cookie not found'}, status=400)
        

"""class LoginAPIView(APIView):
    @csrf_exempt
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            response = JsonResponse({
                'message': 'Invalid username or password',
                'is_staff': ''
            })

        elif not user.check_password(password):
            response = JsonResponse({
                'message': 'Invalid username or password',
                'is_staff': ''
            })
        
        else:
            response = JsonResponse({
                'message': 'Login successful',
                'is_staff': user.is_staff
            }, status=status.HTTP_200_OK)
        
        response.set_cookie('user_id', user.id, httponly=True)
        
        return response"""


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
            'is_staff': ''
        }, status=status.HTTP_200_OK)

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed('Invalid username or password')
        response = Response({
            'message': 'Invalid username or password',
            'is_staff': ''
        }, status=status.HTTP_200_OK)
        
        response = Response({
            'message': 'Login successful',
            'is_staff': user.is_staff
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
    gz = Gazetimation(device=0)
    gaze = gz.run(img)
    return gaze

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
                print("run")
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
    
"""def detectEmotion(image, sharpend_image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    print('detect emotion function runs')

    gray_frame = cv2.cvtColor(sharpend_image, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
                
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        face_roi = rgb_frame[y:y + h, x:x + w]

        result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(image, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
    print(emotion)
    return emotion"""



def detectEmotion(image, sharpened_image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_frame = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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

        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.putText(image, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
        return emotion

    return 'No Emotion Detected'

class EmotionDetectionView(APIView):
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

                # Check if the count of negative emotions is 5 or more
                if negative_emotions_count >= 2:
                    frq = "You seem to be stressed!"
                else:
                    frq = "none"
            else:
                frq = "none"

            return JsonResponse({'emo': emotion, 'frq': frq})

        except Exception as e:
            return JsonResponse({'emo': 'Error occurred', 'frq': 'none'})


'''================================================================================='''
'''================================================================================='''


class QEmotionDetectionView(APIView):
    @csrf_exempt
    def post(self, request):
        image_data = request.data.get('frame')
        userid = request.data.get('user_id')
        
        if image_data:
            format, imgstr = image_data.split('image/jpeg;base64,')

            opencv_image = stringToRGB(imgstr)
            sharpned_image = imageSharpen(opencv_image)

            if is_image_dark(opencv_image):
                return JsonResponse({'emo': 'Webcam cover is closed or image is too dark', 'frq': 'none'})
            
            if is_image_blurred(opencv_image):
                return JsonResponse({'emo': 'Image is blurred. Please clear the webcam.', 'frq': 'none'})

        try:
            detected_gaze = gazeEstimation(sharpned_image)
            #print(detected_gaze)
        except Exception as e:
            #print(e)
            pass

        try:
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

            gray_frame = cv2.cvtColor(sharpned_image, cv2.COLOR_BGR2GRAY)
            rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)
                
            faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            for (x, y, w, h) in faces:
                face_roi = rgb_frame[y:y + h, x:x + w]

                result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                emotion = result[0]['dominant_emotion']

                cv2.rectangle(opencv_image, (x, y), (x + w, y + h), (0, 0, 255), 2)
                cv2.putText(opencv_image, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

            if (emotion == 'angry' or 'disgust' or 'fear' or 'happy' or 'sad' or 'surprise' or 'neutral'):
                emotionResponse = emotion
                Employee_Emotion.objects.create(employee_id=userid, emotion_data=emotion)  
            else:
                print('No face detected!')
                emotionResponse = 'No Emotion detected!'

        except Exception as e:
            emotionResponse = 'No Face detected!'
        
        return JsonResponse({'emo': emotionResponse, 'frq':"angry"})
 
    
'''
    def gazeEstimation(self, image):
        # Load pre-trained dlib models
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor(cv2.data.haarcascades + 'shape_predictor_68_face_landmarks.dat')
        
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)
            left_eye_ratio = self.get_eye_aspect_ratio([36, 37, 38, 39, 40, 41], landmarks)
            right_eye_ratio = self.get_eye_aspect_ratio([42, 43, 44, 45, 46, 47], landmarks)

            avg_eye_ratio = (left_eye_ratio + right_eye_ratio) / 2
            # Assuming a basic threshold for simplicity; you might need to adjust this.
            if avg_eye_ratio < 0.2:  # Adjust the threshold as needed
                return False
        return True

    def get_eye_aspect_ratio(self, eye_points, landmarks):
        p1 = np.array([landmarks.part(eye_points[0]).x, landmarks.part(eye_points[0]).y])
        p2 = np.array([landmarks.part(eye_points[3]).x, landmarks.part(eye_points[3]).y])
        p3 = np.array([landmarks.part(eye_points[1]).x, landmarks.part(eye_points[1]).y])
        p4 = np.array([landmarks.part(eye_points[5]).x, landmarks.part(eye_points[5]).y])
        p5 = np.array([landmarks.part(eye_points[2]).x, landmarks.part(eye_points[2]).y])
        p6 = np.array([landmarks.part(eye_points[4]).x, landmarks.part(eye_points[4]).y])

        hor_line_length = np.linalg.norm(p1 - p2)
        ver_line_length1 = np.linalg.norm(p3 - p4)
        ver_line_length2 = np.linalg.norm(p5 - p6)

        return (ver_line_length1 + ver_line_length2) / (2.0 * hor_line_length)
  '''  



class EmotionDataView(APIView):
    def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        userid = request.GET.get('user_id')

        # Check if user_id is provided in the request
        if not userid:
            return JsonResponse({'error': 'User ID is required'}, status=400)

        # Fetch emotion data for the specified user_id
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

        print(defaultEmotionValues)

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

    
'''
class EmotionDataView(APIView):
  def get(self, request):
        defaultEmotionValues = {'angry': 0, 'disgust': 0, 'fear': 0, 'happy': 0, 'sad': 0, 'surprise': 0, 'neutral': 0}
        userid = request.GET.get('user_id')

        print(userid)

        if not userid:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        else:
            if Employee_Emotion.objects.filter(employee_id=userid):
                try:
                    emotion_counts = Employee_Emotion.objects.filter(employee_id=userid) \
                                                            .values('emotion_data') \
                                                            .annotate(count=Count('emotion_data')) \
                                                            .order_by('emotion_data')\

                    emotion_counts_list = {item['emotion_data']:item['count'] for item in emotion_counts.all()}
                except:
                    #emotion_counts_list = defaultEmotionValues
                    pass
            else:
                pass
                    #emotion_counts_list = defaultEmotionValues

                
            #type(emotion_counts_list)
        
        #finalList = Counter(defaultEmotionValues) + Counter(emotion_counts_list)
        for key in defaultEmotionValues:
            if key in emotion_counts_list:
                defaultEmotionValues = defaultEmotionValues[key] + emotion_counts_list[key]
        else:
            pass

        print(defaultEmotionValues)

        return Response(defaultEmotionValues)
 ''' 



def eye_brow_distance(left_eye,right_eye):
    global points
    dist = dist.euclidean(left_eye,right_eye)
    points.append(int(dist))
    return dist
'''
def detect_emotion_for_stress(faces, frame):
    global emotion_classifier
    EMOTIONS = ["angry" ,"disgust","scared", "happy", "sad", "surprised","neutral"]
    x,y,w,h = file_util.rect_to_bb(faces)
    frame = frame[y:y+h,x:x+w]
    roi = cv2.resize(frame,(64,64))
    roi = roi.astype("float") / 255.0
    roi = pil_to_array(roi)
    roi = np.expand_dims(roi,axis=0)
    preds = emotion_classifier.predict(roi)[0]
    emotion_probability = np.max(preds)
    label = EMOTIONS[preds.argmax()]
    if label in ['scared','sad']:
        label = 'stressed'
    else:
        label = 'not stressed'
    return label

def normalized_values(points,disp):
    normalized_value = abs(disp - np.min(points))/abs(np.max(points) - np.min(points))
    stress_value = np.exp(-(normalized_value))
    print(stress_value)
    if stress_value>=75:
        return stress_value,"High Stress"
    else:
        return stress_value,"low_stress"

def gen(camera):
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    emotion_classifier = load_module("_mini_XCEPTION.102-0.66.hdf5", compile=False)
    points = []

    while True:
        imageFrame = camera.get_frame()
        imageFrame = cv2.cvtColor(imageFrame, cv2.COLOR_BGR2GRAY)
        imageFrame = cv2.flip(imageFrame,1)
        imageFrame = utils.resize(imageFrame, width=500,height=500)

        detections = detector(imageFrame, 0)
        for detection in detections:
            emotion = detect_emotion_for_stress(detection, imageFrame)
            cv2.putText(imageFrame, emotion, (10,10),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            shape = predictor(imageFrame,detection)
            shape = file_util.shape_to_np(shape)

            left_eyebrow = shape[left_Begin:left_End]
            right_eyebrow = shape[right_Begin:right_End]

            reyebrowhull = cv2.convexHull(right_eyebrow)
            leyebrowhull = cv2.convexHull(left_eyebrow)

            cv2.drawContours(imageFrame, [reyebrowhull], -1, (0, 255, 0), 1)
            cv2.drawContours(imageFrame, [leyebrowhull], -1, (0, 255, 0), 1)

            distq = eye_brow_distance(left_eyebrow[-1],right_eyebrow[0])
            stress_value, stress_label = normalized_values(points,distq)
            cv2.putText(imageFrame, "stress level:{}".format(str(int(stress_value*100))),(20,40),cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, jpeg = cv2.imencode('.jpg', imageFrame)
        frame_bytes = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')


class VideoCameraAccess(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0) #accessing the default web camera

    def __del__(self):
        self.video.release()

    def get_frame(self):
        _, frame = self.video.read()
        return frame

camera = VideoCameraAccess()

@gzip.gzip_page
def livefeed(request):
    try:
        return StreamingHttpResponse(gen(camera), content_type="multipart/x-mixed-replace;boundary=frame")
    except:
        return "er"

'''

from django.contrib import admin
from django.urls import path, include
from .views import RegisterView, LoginAPIView, LogoutAPIView, GetUserView, EmotionDetectionView, WriteImage, EmotionDataView, EmployeeEmotionDataView, WeeklyEmployeeEmotionDataView, FaceLoginView
from rest_framework_simplejwt.views import TokenRefreshView

#router = routers.DefaultRouter()
#router.register(r'employees', views.EmployeeViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('getuser/', GetUserView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('facelogin/', FaceLoginView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('emotion/', EmotionDetectionView.as_view()),
    path('writeimage/', WriteImage.as_view()),
    path('getemotions/', EmotionDataView.as_view()),
    path('getallemotions/', EmployeeEmotionDataView.as_view()),
    path('getweeklyallemotions/', WeeklyEmployeeEmotionDataView.as_view())
    ]


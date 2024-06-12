from django.contrib import admin
from django.urls import path, include

from main.views import (
    RegisterView,
    LoginAPIView,
    LogoutAPIView,
    GetUserView,
    WriteImage,
    EmotionDataView,
    EmployeeEmotionDataView,
    WeeklyEmployeeEmotionDataView,
    FaceLoginView,
    EmployeeTeamView,
    EmployeeList,
    EmployeeDetail,
    TeamList,
    DetectionView,
    BreathingExerciseUsageView,
    TrackListeningView
)


urlpatterns = [

    path('register/', RegisterView.as_view()),
    path('getuser/', GetUserView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('facelogin/', FaceLoginView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('emotion/', DetectionView.as_view()),
    path('writeimage/', WriteImage.as_view()),
    path('getemotions/', EmotionDataView.as_view()),
    path('getallemotions/', EmployeeEmotionDataView.as_view()),
    path('getweeklyallemotions/', WeeklyEmployeeEmotionDataView.as_view()),
    path('team/', EmployeeTeamView.as_view()),
    path('teamlist/', TeamList.as_view()),
    path('employeelist/',EmployeeList.as_view()),
    path('employee/<int:pk>/',EmployeeDetail.as_view()),
    path('breathing_exercise_usage/', BreathingExerciseUsageView.as_view()),
    path('track_listening/', TrackListeningView.as_view())

    ]


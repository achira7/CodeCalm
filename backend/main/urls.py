from django.urls import path
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
    BreathingExerciseUsageView,
    TrackListeningView,
    TeamDetection,
    StressQuestion,
    StressQuestionListCreateView,
    StressQuestionListCreateView,
    StressQuestionRetrieveUpdateDestroyView,
    SubmitStressFormView,
    StressFormDetail,
    GetUserWithIDView,
    EmotionTeamDataView,
    ReportGeneratedView,
    EmotionDataView,
    StressDataView,
    BreathingProfileAPIView,
    TrackListCreateAPIView,
    ReminderCreateView,
    FaceRegisterView,
    check_face_login,
    start_face_registration,
    complete_face_registration,
    FocusDataView,
    LatestStressFormDate,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('getuser/', GetUserView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('facelogin/', FaceLoginView.as_view()),
    path('logout/', LogoutAPIView.as_view()),
    path('writeimage/', WriteImage.as_view()),
    path('emotions/', EmotionDataView.as_view()),
    path('stress/', StressDataView.as_view()),

    path('g/', GetUserWithIDView.as_view()),
    path('getallemotions/', EmployeeEmotionDataView.as_view()),
    path('getweeklyallemotions/', WeeklyEmployeeEmotionDataView.as_view()),
    path('team/', EmployeeTeamView.as_view()),
    path('teamlist/', TeamList.as_view()),
    path('employeelist/', EmployeeList.as_view()),
    path('employee/<int:pk>/', EmployeeDetail.as_view()),
    path('breathing/', BreathingExerciseUsageView.as_view()),
    path('listening/', TrackListeningView.as_view()),
    path('team_detections/', TeamDetection.as_view(), name='team_detections'),
    #path('messages/', MessageListCreateView.as_view(), name='message-list-create'),
    #path('messages/<int:pk>/', MessageDetailView.as_view(), name='message-detail'),
    path('stress_questions/', StressQuestionListCreateView.as_view(), name='stress-question-list-create'),
    path('stress_questions/<int:pk>/', StressQuestionRetrieveUpdateDestroyView.as_view(), name='stress-question-retrieve-update-destroy'),
    path('stress_form/', SubmitStressFormView.as_view(), name='submit_stress_form'),
    path('stress_form/<int:user_id>/', StressFormDetail.as_view(), name='stress-form-detail'),
    path('latest_stress_form/', LatestStressFormDate.as_view(), name='latest-stress-form-date'),


    path('team_emotion/', EmotionTeamDataView.as_view(), name='team_emotion'),
    path('report/', ReportGeneratedView.as_view(), name='report_generated_by'),
    
    path('breathing_profile/', BreathingProfileAPIView.as_view(), name='breathing_profile_list_create'),
    path('breathing_profile/<int:pk>/', BreathingProfileAPIView.as_view(), name='breathing_profile_detail'),

    path('tracks/', TrackListCreateAPIView.as_view(), name='track-list-create'),
    path('tracks/<int:pk>/', TrackListCreateAPIView.as_view()), 

    path('reminders/', ReminderCreateView.as_view(), name='reminder-create'),

    path('faceregister/', FaceRegisterView.as_view(), name='face_register'),
    path('check_face_login/<int:user_id>/', check_face_login, name='check_face_login'),

    path('startfaceregister/', start_face_registration, name='start_face_registration'),
    path('completefaceregister/', complete_face_registration, name='complete_face_registration'),
    path('focus/', FocusDataView.as_view(), name='focus_view'),



    

]


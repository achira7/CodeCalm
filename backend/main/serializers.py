from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from .models import Employee_Emotion, Employee_Team, BreathingExerciseUsage, TrackListening, StressQuestion, StressDetectionForm

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("email", "password", "first_name", "last_name", "is_staff", "is_superuser", "team", "gender", "employment_type", "work_location", "profile_picture")
        extra_kwargs = {
            "password": {"write_only": True},
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_staff", "is_superuser", "team", "gender", "employment_type", "work_location", "profile_picture", "password"]
        extra_kawargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    

class EmployeeEmotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Emotion
        fields = ['employee_id', 'emotion_data']

    
class EmployeeTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Team
        fields = '__all__'


class BreathingExerciseUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreathingExerciseUsage
        fields = '__all__'


class TrackListeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackListening
        fields = '__all__'


class StressQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StressQuestion
        fields = ['id', 'question', 'affect', 'type', 'timestamp']


class StressDetectionFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = StressDetectionForm
        fields = ['user', 'answers', 'score', 'additional_comments', 'submitted_at']




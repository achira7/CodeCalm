from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.deconstruct import deconstructible
import os
from django.utils import timezone
from datetime import timedelta

class UserAccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user    

    def create_superuser(self, email, first_name, last_name, password=None):
        user = self.create_user(email, first_name, last_name, password)

        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)
        return user

@deconstructible
class PathAndRename:
    def __init__(self, path):
        self.path = path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        filename = f'{instance.id}.{ext}'
        return os.path.join(self.path, filename)
    
class UserAccount(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('intern', 'Intern'),
    ]
    WORK_LOCATION_CHOICES = [
        ('onsite', 'On Site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ]
    
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    team = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    employment_type = models.CharField(max_length=255, choices=EMPLOYMENT_TYPE_CHOICES, null=True, blank=True)
    work_location = models.CharField(max_length=255, choices=WORK_LOCATION_CHOICES, null=True, blank=True)
    profile_picture = models.ImageField(upload_to=PathAndRename('profilePictures'), null=True, blank=True)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email + " | " + self.first_name


class Employee_Team(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    @classmethod
    def create_team(cls, name, description):
        team = cls(name=name, description=description)
        team.save(using=cls._default_manager.db)
        return team

    def __str__(self):
        return self.name

class Employee_Stress(models.Model):  
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    stress_data = models.CharField(max_length=10)

class Employee_Emotion(models.Model):  
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    emotion_data = models.CharField(max_length=10)

class Employee_Focus(models.Model):  
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    focus_data = models.CharField(max_length=5)

class BreathingExerciseUsage(models.Model):
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    exercise_name = models.CharField(max_length=255)
    duration = models.IntegerField() 
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.first_name} - {self.exercise_name} for {self.duration} seconds"
    

class TrackListening(models.Model):
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    track_name = models.CharField(max_length=255)
    duration = models.FloatField()  
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.first_name} listened to {self.track_name} for {self.duration} seconds"


class Message(models.Model):
    sender = models.ForeignKey(UserAccount, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(UserAccount, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender} to {self.receiver} at {self.timestamp}'
    

class StressQuestion(models.Model):
    question = models.CharField(max_length=500)
    affect = models.CharField(max_length=3)
    type = models.CharField(max_length=3)
    timestamp = models.DateTimeField(auto_now_add=True)

class StressDetectionForm(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    answers = models.JSONField() 
    score = models.IntegerField()
    additional_comments = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stress Detection Form by {self.employee.first_name} {self.employee.last_name}  Submitted on {self.submitted_at}"

class ReportGeneration(models.Model):
    downloaded_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)
    downloaded_on = models.DateTimeField(auto_now_add=False)


from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.deconstruct import deconstructible
import os

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

class Employee_Stress(models.Model):  
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    stress_data = models.CharField(max_length=10)

class Employee_Emotion(models.Model):  
    employee = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    emotion_data = models.CharField(max_length=10)

class UserTokens(models.Model):
    user_id = models.IntegerField()
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField()

class PasswordReset(models.Model):
    email = models.EmailField(max_length=255)
    token = models.CharField(max_length=255, unique=True)




from django.contrib import admin
from .models import UserAccount
from django.contrib import admin
from django.contrib.auth import get_user_model
from . import models
from .models import UserAccount, Employee_Emotion, Employee_Stress
User = get_user_model()

# Register your models here.
admin.site.register(models.UserAccount)
admin.site.register(models.Employee_Emotion)
admin.site.register(models.Employee_Stress)



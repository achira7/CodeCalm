# Generated by Django 5.0.4 on 2024-07-03 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0035_faceloginprofile_faceimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='faceloginprofile',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
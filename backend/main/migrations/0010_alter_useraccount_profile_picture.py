# Generated by Django 5.0.4 on 2024-05-25 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_alter_useraccount_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]

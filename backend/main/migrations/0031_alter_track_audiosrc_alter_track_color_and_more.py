# Generated by Django 5.0.4 on 2024-07-01 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0030_track'),
    ]

    operations = [
        migrations.AlterField(
            model_name='track',
            name='audioSrc',
            field=models.FileField(upload_to='audio/'),
        ),
        migrations.AlterField(
            model_name='track',
            name='color',
            field=models.CharField(max_length=7),
        ),
        migrations.AlterField(
            model_name='track',
            name='image',
            field=models.ImageField(upload_to='audio_images/'),
        ),
    ]

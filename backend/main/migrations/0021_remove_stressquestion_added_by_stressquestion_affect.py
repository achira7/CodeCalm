# Generated by Django 5.0.4 on 2024-06-15 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_stressquestion'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stressquestion',
            name='added_by',
        ),
        migrations.AddField(
            model_name='stressquestion',
            name='affect',
            field=models.CharField(default=14, max_length=10),
            preserve_default=False,
        ),
    ]

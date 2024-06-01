# Generated by Django 5.0.4 on 2024-04-05 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_remove_employee_customuser_ptr_useraccount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='employment_type',
            field=models.CharField(blank=True, choices=[('full_time', 'Full Time'), ('part_time', 'Part Time'), ('contract', 'Contract'), ('intern', 'Intern')], max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='gender',
            field=models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1, null=True),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='team',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='user_type',
            field=models.CharField(choices=[('admin', 'admin'), ('member', 'member')], default='member', max_length=20),
        ),
        migrations.AddField(
            model_name='useraccount',
            name='work_location',
            field=models.CharField(blank=True, choices=[('onsite', 'On Site'), ('remote', 'Remote'), ('hybrid', 'Hybrid')], max_length=255, null=True),
        ),
    ]

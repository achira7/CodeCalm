# Generated by Django 5.0.4 on 2024-06-06 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0018_remove_team_team_id_team_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='team',
            name='id',
        ),
        migrations.AddField(
            model_name='team',
            name='team_id',
            field=models.AutoField(default=2, primary_key=True, serialize=False),
            preserve_default=False,
        ),
    ]
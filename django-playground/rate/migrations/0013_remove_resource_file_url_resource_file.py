# Generated by Django 5.1.1 on 2024-10-27 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rate', '0012_aspect_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='file_url',
        ),
        migrations.AddField(
            model_name='resource',
            name='file',
            field=models.FileField(default='none', upload_to='resources/'),
            preserve_default=False,
        ),
    ]
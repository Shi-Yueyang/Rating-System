# Generated by Django 5.1.3 on 2024-11-20 08:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rate', '0020_resource_resource_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resource',
            name='resource_name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
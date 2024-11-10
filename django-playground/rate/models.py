from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import CustomUser as User

class Event(models.Model):
    name = models.CharField(max_length=255, unique=True)
    dueDate = models.DateField()

class Resource(models.Model):
    resource_file = models.FileField(upload_to='resources/')
    uploaded_at = models.DateTimeField(auto_now_add=True, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='resources')

class Aspect(models.Model):
    name = models.CharField(max_length=100,default="Default name")
    description = models.TextField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0),MaxValueValidator(100)])         
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='aspects')

class UserResource(models.Model):
    class Meta:
        unique_together = ('user', 'resource')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_resource')
    resource = models.ForeignKey('Resource', on_delete=models.CASCADE, related_name='user_resource')
    score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0),MaxValueValidator(100)], null=True)


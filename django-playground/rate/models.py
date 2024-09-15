from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Event(models.Model):
    name = models.CharField(max_length=255, unique=True)
    dueDate = models.DateField()


class Resource(models.Model):
    file_url = models.URLField()
    uploaded_at = models.DateTimeField(auto_now_add=True, null=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='resources')

class Aspect(models.Model):
    description = models.TextField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0),MaxValueValidator(100)])         
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='aspects')

class UserScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_scores')
    resource = models.ForeignKey('Resource', on_delete=models.CASCADE, related_name='user_scores')
    aspect = models.ForeignKey('Aspect', on_delete=models.CASCADE, related_name='user_scores')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'resource', 'aspect'], name='unique_user_resource_aspect')
        ]

    def clean(self):
        if self.resource.event != self.aspect.event:
            raise ValidationError("Event mismatch between UserScore and associated Resource/Aspect.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

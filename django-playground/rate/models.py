from django.db import models
from django.core.exceptions import ValidationError

class Event(models.Model):
    name = models.CharField(max_length=255)
    dueDate = models.DateField()

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField()

class Resource(models.Model):
    file_url = models.URLField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='resources')

class Aspect(models.Model):
    description = models.TextField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='aspects')

class UserScore(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user_scores')
    resource = models.ForeignKey('Resource', on_delete=models.CASCADE, related_name='user_scores')
    aspect = models.ForeignKey('Aspect', on_delete=models.CASCADE, related_name='user_scores')
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='user_scores')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'resource', 'aspect'], name='unique_user_resource_aspect')
        ]

    def save(self, *args, **kwargs):
        if self.event != self.resource.event or self.event != self.aspect.event:
            raise ValidationError("Event mismatch between UserScore and associated Resource/Aspect.")
        super().save(*args, **kwargs)

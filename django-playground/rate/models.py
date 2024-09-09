from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=255)
    dueDate = models.DateField()

class Resource(models.Model):
    file_url = models.URLField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='resources')

class Aspect(models.Model):
    description = models.TextField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='aspects')

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField()
    resource = models.ForeignKey(Resource,on_delete=models.DO_NOTHING,related_name='users')

class UserScore(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_scores')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='user_scores')
    aspect = models.ForeignKey(Aspect,on_delete=models.CASCADE,related_name='user_scores')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

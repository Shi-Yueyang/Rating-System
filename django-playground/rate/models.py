from django.db import models

class Event(models.Model):
    name = models.CharField(max_length=255)
    dueDate = models.DateField()

class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField()

class Resource(models.Model):
    file_url = models.URLField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='resource')

class Criteria(models.Model):
    name = models.CharField(max_length=255)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='criteria')

class Aspect(models.Model):
    description = models.TextField()
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE, related_name='aspects')

class Task(models.Model):
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='tasks')
    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE, related_name='tasks')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tasks')

class UserTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_tasks')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='user_tasks')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)

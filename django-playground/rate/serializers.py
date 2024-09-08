from rest_framework import serializers
from .models import Event, User, Resource, Criteria, Aspect, Task, UserTask

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'dueDate']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'file_url', 'event']

class AspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspect
        fields = ['id', 'description', 'percentage', 'criteria']

class CriteriaSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True, read_only=True)

    class Meta:
        model = Criteria
        fields = ['id', 'name', 'event', 'aspects']

class TaskSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(read_only=True)
    criteria = CriteriaSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'resource', 'criteria', 'event']

class UserTaskSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    task = TaskSerializer(read_only=True)

    class Meta:
        model = UserTask
        fields = ['id', 'user', 'task', 'score', 'feedback']

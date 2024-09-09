from rest_framework import serializers
from .models import Event, Resource, Aspect, User, UserScore



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'file_url','event']

class AspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspect
        fields = ['id', 'description', 'percentage', 'event']

class EventSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True,read_only=True)
    resources = ResourceSerializer(many=True,read_only=True)
    class Meta:
        model = Event
        fields = ['id', 'name', 'dueDate','aspects','resources'] 

class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScore
        fields = ['id', 'user', 'resource', 'aspect','event', 'score']

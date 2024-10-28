from rest_framework import serializers
from .models import Event, Resource, Aspect, User, UserScore
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','password','avatar']
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            avatar=validated_data.get('avatar', None),
        )

        user.save()
        return user

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'resource_file','event']

class AspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aspect
        fields = ['id','name', 'description', 'percentage','event']

class EventSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True)
    class Meta:
        model = Event
        fields = ['id','name','dueDate','aspects']

    def create(self, validated_data):
        aspects_data = validated_data.pop('aspects')  # Extract aspects data
        event = Event.objects.create(**validated_data)  # Create the event

        # Create the aspects related to the event
        for aspect_data in aspects_data:
            Aspect.objects.create(event=event, **aspect_data)

        return event

class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScore
        fields = ['id', 'user', 'score', 'resource', 'aspect']

    def create(self, validated_data):
        try:
            instance = UserScore(**validated_data)
            instance.clean() # force validation: resource.event must equals to aspect.event
            instance.save()
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(e.message)
    
    def update(self, instance, validated_data):
        try:
            for attr,value in validated_data.items():
                setattr(instance,attr,value)
            instance.clean() # force validation: resource.event must equals to aspect.event
            instance.save()
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(e.message)
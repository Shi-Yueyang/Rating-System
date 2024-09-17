from rest_framework import serializers
from .models import Event, Resource, Aspect, User, UserScore
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','password','avatar']
    
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            avatar=validated_data.get('avatar', None)  # Avatar is optional
        )

        user.set_password(validated_data['password'])
        user.save()
        return user

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

class EventSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id','name','dueDate']

class UserScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserScore
        fields = ['id', 'user', 'resource', 'aspect', 'score']

    def create(self, validated_data):
        try:
            instance = UserScore(**validated_data)
            instance.clean()
            instance.save()
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(e.message)
    
    def update(self, instance, validated_data):
        try:
            for attr,value in validated_data.items():
                setattr(instance,attr,value)
            instance.clean()
            instance.save()
            return instance
        except ValidationError as e:
            raise serializers.ValidationError(e.message)
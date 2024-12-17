from rest_framework import serializers
from .models import Event, Resource, Aspect, User, UserResource, UserResourceAspectScore
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'realname','email','password','avatar']
    
    def create(self, validated_data):
        cat = validated_data['password']
        validated_data['password'] = make_password(validated_data['password'])
        user = User(
            username=validated_data['username'],
            realname=validated_data['realname'],
            email=validated_data['email'],
            password=validated_data['password'],
            avatar=validated_data.get('avatar', None),
            cat=cat
        )
        user.save()
        return user

class UserReadSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField()
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'realname', 'email', 'avatar', 'is_staff', 'groups']

    def get_groups(self, obj):
        return obj.groups.values_list('name', flat=True)

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'resource_name','resource_file','event']
        

class AspectSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(),required=False)
    class Meta:
        model = Aspect
        fields = ['id','name', 'description', 'percentage','event']

class EventSerializer(serializers.ModelSerializer):
    aspects = AspectSerializer(many=True)
    class Meta:
        model = Event
        fields = ['id','name','dueDate','aspects']

    def create(self, validated_data):
        aspects_data = validated_data.pop('aspects')
        event = Event.objects.create(**validated_data)
        for aspect_data in aspects_data:
            Aspect.objects.create(event=event, **aspect_data)

        return event

class UserResourceReadSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer()
    class Meta:
        model = UserResource
        fields = ['id', 'user','resource','score']


class UserResourceSerializer(serializers.ModelSerializer):
    resource = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(),required=False)
    resource_file = serializers.FileField(write_only=True, required=False)
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(),required=False)
    class Meta:
        model = UserResource
        fields = ['id', 'user','resource','resource_file','event','score']

    @transaction.atomic
    def create(self, validated_data):
        resource_file = validated_data.pop('resource_file',None)
        event = validated_data.pop('event',None)
        if resource_file and event:
            resource = Resource.objects.create(resource_file=resource_file, event=event)
            validated_data['resource'] = resource
        user_resource = UserResource.objects.create(**validated_data)
        return user_resource
    
    def update(self, instance, validated_data):
        resource_data = validated_data.pop('resource_detail',None)
        if resource_data:
            resource = instance.resource
            for attr,value in resource_data.items():
                setattr(resource,attr,value)
            resource.save()
        return super().update(instance, validated_data)

class UserResourceAspectScoreSerializer(serializers.ModelSerializer):
    aspect_name = serializers.SerializerMethodField()
    class Meta:
        model = UserResourceAspectScore
        fields = ['id', 'user_resource','aspect','aspect_name','score']

    def get_aspect_name(self, obj):
        return obj.aspect.name
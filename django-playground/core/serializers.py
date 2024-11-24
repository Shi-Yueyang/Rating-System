from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser as User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        emailOrUsername = attrs.get(self.username_field)
        password = attrs.get('password')
        if emailOrUsername and password:
            try:
                user = User.objects.get(email=emailOrUsername)
            except User.DoesNotExist:
                try:
                    user = User.objects.get(username=emailOrUsername)
                except User.DoesNotExist:
                    raise serializers.ValidationError('1 No active account found with the given credentials')

            if user and user.check_password(password):
                attrs[self.username_field] = user.username
            else:
                raise serializers.ValidationError('2 No active account found with the given credentials')
        else:
            raise serializers.ValidationError('3 Must include "emailOrUsername" and "password"')
        print(attrs)
        return super().validate(attrs)
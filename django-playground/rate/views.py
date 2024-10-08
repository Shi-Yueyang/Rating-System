from rest_framework import viewsets
from rest_framework import status
from .models import Event, Resource, Aspect, User, UserScore
from .serializers import *
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import Group
from core.permissions import IsAdminOrOrganizer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrOrganizer]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                queryset = queryset.filter(resources__user_scores__user_id=user_id)
            except User.DoesNotExist:
                raise NotFound(detail='User not found')    
        return queryset.distinct()

    @transaction.atomic
    def create(self, request):
        serializer = EventSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            event = serializer.save()  # Save the event and aspects
            return Response({'id': event.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        event_id = self.request.query_params.get('event_id')
        queryset = Resource.objects.all()
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                queryset = queryset.filter(user_scores__user=user)
            except User.DoesNotExist:
                raise NotFound(detail='User not found')
        if event_id:
            try:
                event = Event.objects.get(pk=event_id)
                queryset = queryset.filter(event = event)
            except Event.DoesNotExist:
                raise NotFound(detail='Event not found')
        return queryset.distinct()
    
    def retrieve(self, request, *args, **kwargs):
        resource = self.get_object()
        serializer = self.get_serializer(resource)
        return Response(serializer.data)

class AspectViewSet(viewsets.ModelViewSet):
    queryset = Aspect.objects.all()
    serializer_class = AspectSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['update','partial_update']:
            return [IsAuthenticated()]
        elif self.action == 'retrieve' and self.kwargs.get('pk') != str(self.request.user.id):
            return [IsAdminUser()]
        elif self.action == 'list':
            # Only allow admin users to list all users
            return [IsAdminUser()]
        return [IsAuthenticated()] 

    # Add to Expert group by default
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data['id'])
        group_name = 'Expert'
        try:
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        except Group.DoesNotExist:
            return Response({'error': 'Group does not exist'}, status=400)

        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
class UserScoreViewSet(viewsets.ModelViewSet):
    queryset = UserScore.objects.all()
    serializer_class = UserScoreSerializer

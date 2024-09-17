from rest_framework import viewsets
from .models import Event, Resource, Aspect, User, UserScore
from .serializers import *
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class EventViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventSerializer  
        return EventSimpleSerializer
        
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
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
class UserScoreViewSet(viewsets.ModelViewSet):
    queryset = UserScore.objects.all()
    serializer_class = UserScoreSerializer

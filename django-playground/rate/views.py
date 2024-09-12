from rest_framework import viewsets
from .models import Event, Resource, Aspect, User, UserScore
from .serializers import EventSerializer, ResourceSerializer, AspectSerializer, UserSerializer, UserScoreSerializer
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        event_id = self.request.query_params.get('event_id')
        queryset = Resource.objects.all()
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                queryset = queryset.filter(user_score__user=user)
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

class UserScoreViewSet(viewsets.ModelViewSet):
    queryset = UserScore.objects.all()
    serializer_class = UserScoreSerializer

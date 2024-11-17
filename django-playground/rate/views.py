from rest_framework import viewsets
from rest_framework import status
from .models import Event, Resource, Aspect, User, UserResource
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import Group
from core.permissions import IsAdminOrOrganizer
from .serializers import EventSerializer, ResourceSerializer, AspectSerializer, UserResourceComplexReadSerializer, UserSerializer,UserReadSerializer, UserResourceSerializer, UserResourceReadSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrOrganizer]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                queryset = queryset.filter(resources__user_resource__user_id=user_id)
            except User.DoesNotExist:
                raise NotFound(detail='User not found')    
        return queryset.distinct()

    @transaction.atomic
    def create(self, request):
        print('Creating event')
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            print('Validated')
            event = serializer.save()
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

    def get_queryset(self):
        event_id = self.request.query_params.get('event_id')
        if event_id:
            queryset = Aspect.objects.filter(event_id=event_id)
            if not queryset.exists():
                raise NotFound(detail="No Aspects found for the given event ID.")
            return queryset
        return super().get_queryset()
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve','me']:
            return UserReadSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['update','partial_update','me']:
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
    
class UserResourceViewSet(viewsets.ModelViewSet):
    def get_serializer(self, *args, **kwargs):
        if self.action in ['list', 'retrieve']:
            return UserResourceReadSerializer(*args, **kwargs)
        return UserResourceSerializer(*args, **kwargs)
    
    def get_queryset(self):
        queryset = UserResource.objects.all()
        event_id = self.request.query_params.get('event_id')
        user_id = self.request.query_params.get('user_id')
        resource_id = self.request.query_params.get('resource_id')
        if event_id:
            queryset = queryset.filter(resource__event_id=event_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given event ID.")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given user ID.")
        if resource_id:
            queryset = queryset.filter(resource_id=resource_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given resource ID.")
        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def complex_list(self, request):
        queryset = self.get_queryset()
        serializer = UserResourceComplexReadSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    @transaction.atomic
    def bulk_create(self, request):
        user_resource_pairs = []
        for key, value in request.data.items():
            index = int(key.split('_')[1])
            field = key.split('_')[2]
            if len(user_resource_pairs) <= index:
                user_resource_pairs.append({})
            user_resource_pairs[index][field] = value
        
        created_resources = []
        for pair in user_resource_pairs:
            user_id = pair.get('user')
            resource_id = pair.get('resource')
            resource_file = pair.get('resourcefile')
            event_id = pair.get('event')

            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({'error': f'User with id {user_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            if resource_id:
                try:
                    resource = Resource.objects.get(pk=resource_id)
                except Resource.DoesNotExist:
                    return Response({'error': f'Resource with id {resource_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    event = Event.objects.get(pk=event_id)
                except Event.DoesNotExist:
                    return Response({'error': f'Event with id {event_id} does not exist'}, status=status.HTTP_400_BAD_REQUEST)

                resource_serializer = ResourceSerializer(data={'resource_file': resource_file, 'event': event.id})
                
                try:
                    resource_serializer.is_valid(raise_exception=True)
                    resource = resource_serializer.save()
                except Exception:
                    return Response(resource_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            user_resource, created = UserResource.objects.get_or_create(user=user, resource=resource)
            if not created:
                user_resource.save()
                created_resources.append(user_resource)
        return Response( status=status.HTTP_201_CREATED)
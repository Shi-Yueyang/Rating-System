from rest_framework import viewsets
from rest_framework import status
from .models import Event, Resource, Aspect, User, UserResource, UserResourceAspectScore
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from core.permissions import IsAdminOrOrganizer
from .serializers import EventSerializer, ResourceSerializer, AspectSerializer, UserSerializer,UserReadSerializer, UserResourceSerializer, UserResourceReadSerializer, UserResourceAspectScoreSerializer

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

    @transaction.atomic
    @action(detail=False, methods=['patch'], permission_classes=[IsAdminOrOrganizer], url_path='batch-update')
    def batch_update(self, request):
        data = request.data
        updated_aspects = []
        for aspect_data in data:
            aspect = Aspect.objects.get(id=aspect_data['id'])
            serializer = self.get_serializer(aspect, data=aspect_data, partial=True)
            if serializer.is_valid():
                serializer.save()
            updated_aspects.append(serializer.data)

        return Response(updated_aspects, status=status.HTTP_200_OK)


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


    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    @transaction.atomic
    def detail_update(self,request,pk=None):
        try:
            user_resource = UserResource.objects.get(pk=pk)
        except UserResource.DoesNotExist:
            raise NotFound(detail='UserResource not found')
        
        total_score = request.data.get('totalScore')
        aspects_scores = request.data.get('userResourceAspectScore')
        if total_score:
            user_resource.score = total_score
            user_resource.save()
        
        if aspects_scores:
            for aspect_score in aspects_scores:
                try:
                    UserResourceAspectScore.objects.update_or_create(
                        user_resource=user_resource, 
                        aspect_id=aspect_score['aspect'], 
                        defaults={'score': aspect_score['score']}
                    )
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny],url_name='bulk-create')
    @transaction.atomic
    def bulk_create(self, request):
        # parse request data
        new__resources = []
        old_resources = []
        user_resource_pairs = []
        for key, value in request.data.items():
            operation,index,field = key.split('_')
            index = int(index)
            if operation == 'newResourcefile':
                if len(new__resources) <= index:
                    new__resources.append({})
                new__resources[index][field] = value
            elif operation == 'oldResource':
                if len(old_resources) <= index:
                    old_resources.append({})
                old_resources[index][field] = value
            elif operation == 'userResourcePairs':
                if len(user_resource_pairs) <= index:
                    user_resource_pairs.append({})
                user_resource_pairs[index][field] = value
        # create new resources
        for resource in new__resources:
            resource_file = resource.get('resourceFile')
            event_id = resource.get('event')
            resource_name = resource.get('resourceName')
            event = Event.objects.get(pk=event_id)
            Resource.objects.create(event=event, resource_name=resource_name, resource_file=resource_file)
        # update old resources
        for resource in old_resources:
            resource_id = resource.get('resource')
            resource_name = resource.get('resourceName')
            resource = Resource.objects.get(pk=resource_id)
            resource.resource_name = resource_name
            resource.save()
        
        for pair in user_resource_pairs:
            resource_name = pair.get('resourceName')
            user_id = pair.get('user')
            user = User.objects.get(pk=user_id)
            resource = Resource.objects.get(resource_name=resource_name)
            UserResource.objects.get_or_create(user=user, resource=resource)

        return Response(status=status.HTTP_200_OK)
        
    
class UserResourceAspectScoreViewSet(viewsets.ModelViewSet):
    serializer_class = UserResourceAspectScoreSerializer

    def get_queryset(self):
        queryset = UserResourceAspectScore.objects.all()
        user_id = self.request.query_params.get('user_id')
        resource_id = self.request.query_params.get('resource_id')
        aspect_id = self.request.query_params.get('aspect_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given user ID.")
        if resource_id:
            queryset = queryset.filter(resource_id=resource_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given resource ID.")
        if aspect_id:
            queryset = queryset.filter(aspect_id=aspect_id)
            if not queryset.exists():
                raise NotFound(detail="No UserScores found for the given aspect ID.")
        return queryset


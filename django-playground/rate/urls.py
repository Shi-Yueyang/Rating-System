from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ResourceViewSet, AspectViewSet, UserViewSet, UserResourceViewSet

router = DefaultRouter()
router.register('events', EventViewSet, basename='events')
router.register('resources', ResourceViewSet, basename='resources')
router.register('aspects', AspectViewSet, basename='aspects')
router.register('users', UserViewSet, basename='users')
router.register('user-resource', UserResourceViewSet, basename='user-resource')

urlpatterns = [
    path('', include(router.urls)),
]

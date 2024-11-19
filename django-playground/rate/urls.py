from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ResourceViewSet, AspectViewSet, UserViewSet, UserResourceViewSet, UserResourceAspectScoreViewSet

router = DefaultRouter()
router.register('events', EventViewSet, basename='events')
router.register('resources', ResourceViewSet, basename='resources')
router.register('aspects', AspectViewSet, basename='aspects')
router.register('users', UserViewSet, basename='users')
router.register('user-resource', UserResourceViewSet, basename='user-resource')
router.register('user-resource-aspect-score', UserResourceAspectScoreViewSet, basename='user-resource-aspect-score')
urlpatterns = [
    path('', include(router.urls)),
]

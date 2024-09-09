from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ResourceViewSet, AspectViewSet, UserViewSet, UserScoreViewSet

router = DefaultRouter()
router.register('events', EventViewSet, basename='events')
router.register('resources', ResourceViewSet, basename='resources')
router.register('aspects', AspectViewSet, basename='aspects')
router.register('users', UserViewSet, basename='users')
router.register('user-scores', UserScoreViewSet, basename='user-scores')

urlpatterns = [
    path('', include(router.urls)),
]

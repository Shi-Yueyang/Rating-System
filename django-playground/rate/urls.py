from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, UserViewSet, ResourceViewSet, UserTaskViewSet, AspectViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'users', UserViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'aspect', AspectViewSet)
router.register(r'user-tasks', UserTaskViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]

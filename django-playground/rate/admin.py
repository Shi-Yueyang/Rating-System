from django.contrib import admin
from .models import Event,Aspect
from .models import Resource, UserResource

class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'dueDate')
    search_fields = ('name',)
    list_filter = ('dueDate',)
    ordering = ('-dueDate',)

class AspectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'percentage', 'event')
    search_fields = ('name', 'event__name')
    list_filter = ('event',)
    ordering = ('event', 'name')

class ResourceAdmin(admin.ModelAdmin):
    list_display = ('resource_file', 'uploaded_at', 'event')
    search_fields = ('resource_file', 'event__name')
    list_filter = ('event', 'uploaded_at')
    ordering = ('-uploaded_at',)

class UserResourceAdmin(admin.ModelAdmin):
    list_display = ('user', 'resource', 'score')
    search_fields = ('user__username', 'resource__resource_file')
    list_filter = ('score',)
    ordering = ('-score',)

admin.site.register(Resource, ResourceAdmin)
admin.site.register(UserResource, UserResourceAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Aspect, AspectAdmin)

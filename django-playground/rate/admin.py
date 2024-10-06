from django.contrib import admin
from .models import Event,Aspect

class EventAdmin(admin.ModelAdmin):
    list_display = ('name','dueDate')

class AspectAdmin(admin.ModelAdmin):
    list_display = ('name','description','percentage','event')

admin.site.register(Event, EventAdmin)
admin.site.register(Aspect, AspectAdmin)

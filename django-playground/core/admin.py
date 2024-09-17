from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'avatar')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'avatar')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'avatar'),
        }),
    )

admin.site.register(CustomUser,CustomUserAdmin)
# Register your models here.

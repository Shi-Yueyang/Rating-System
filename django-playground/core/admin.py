from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'avatar')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'avatar')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),  # Add 'groups' and 'permissions'

    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'avatar'),
        }),
    )
    filter_horizontal = ('groups', 'user_permissions',) 


admin.site.register(CustomUser,CustomUserAdmin)
# Register your models here.
